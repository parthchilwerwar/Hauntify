"use client"

import { useEffect, useRef, useState, memo } from "react"
import type { TimelineItem } from "@/src/types"
import { isValidCenter, getSafeCenter } from "@/src/lib/validation"

interface LeafletMapProps {
  markers: TimelineItem[]
  center: [number, number]
  zoom: number
}

const DEFAULT_CENTER: [number, number] = [20, 0]
const DEFAULT_ZOOM = 2

function LeafletMapComponent({ markers, center, zoom }: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersLayerRef = useRef<any>(null)
  const leafletRef = useRef<any>(null)
  const isInitialMount = useRef(true)
  const prevCenterRef = useRef<[number, number] | null>(null)
  const [mapReady, setMapReady] = useState(false)

  // Validate and sanitize coordinates - ensure they are valid numbers
  const centerLat = (typeof center?.[0] === 'number' && isFinite(center[0]) && !Number.isNaN(center[0])) 
    ? center[0] 
    : DEFAULT_CENTER[0]
  const centerLng = (typeof center?.[1] === 'number' && isFinite(center[1]) && !Number.isNaN(center[1])) 
    ? center[1] 
    : DEFAULT_CENTER[1]
  const safeZoom = typeof zoom === "number" && isFinite(zoom) && zoom > 0 ? zoom : DEFAULT_ZOOM

  // Initialize map only once
  useEffect(() => {
    if (typeof window === "undefined") return
    if (!mapContainerRef.current) return
    if (mapInstanceRef.current) return

    let cancelled = false

    const init = async () => {
      try {
        const L = (await import("leaflet")).default
        
        if (cancelled || !mapContainerRef.current || mapInstanceRef.current) return

        leafletRef.current = L

        const map = L.map(mapContainerRef.current, {
          center: [centerLat, centerLng],
          zoom: safeZoom,
          zoomControl: false,
          attributionControl: false,
        })

        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
          maxZoom: 19,
          subdomains: "abcd",
        }).addTo(map)

        markersLayerRef.current = L.layerGroup().addTo(map)
        mapInstanceRef.current = map
        setMapReady(true)
      } catch (err) {
        console.error("Map init failed:", err)
      }
    }

    init()

    return () => {
      cancelled = true
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        markersLayerRef.current = null
        leafletRef.current = null
      }
    }
  }, [])

  // Pan to new center when it changes (but not on initial mount)
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return
    
    // Extra validation - ensure coordinates are valid numbers
    const lat = centerLat
    const lng = centerLng
    
    // Strict validation for NaN and invalid coordinates
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      console.warn('⚠️ LeafletMap: Invalid coordinate types', { lat, lng })
      return
    }
    if (!isFinite(lat) || !isFinite(lng) || Number.isNaN(lat) || Number.isNaN(lng)) {
      console.warn('⚠️ LeafletMap: Non-finite coordinates', { lat, lng })
      return
    }
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      console.warn('⚠️ LeafletMap: Coordinates out of range', { lat, lng })
      return
    }
    
    // Skip flyTo on initial mount - the map is already centered
    if (isInitialMount.current) {
      isInitialMount.current = false
      prevCenterRef.current = [lat, lng]
      return
    }
    
    // Skip if center hasn't actually changed
    if (prevCenterRef.current && 
        prevCenterRef.current[0] === lat && 
        prevCenterRef.current[1] === lng) {
      return
    }
    
    prevCenterRef.current = [lat, lng]
    
    try {
      mapInstanceRef.current.flyTo([lat, lng], safeZoom, { duration: 0.8 })
    } catch (err) {
      console.error('❌ LeafletMap flyTo error:', err)
    }
  }, [centerLat, centerLng, safeZoom, mapReady])

  // Update markers when they change
  useEffect(() => {
    if (!mapReady || !markersLayerRef.current || !leafletRef.current) return

    const L = leafletRef.current
    markersLayerRef.current.clearLayers()

    const valid = markers.filter((m) => {
      if (typeof m.lat !== "number" || typeof m.lon !== "number") return false
      if (!isFinite(m.lat) || !isFinite(m.lon)) return false
      return m.lat >= -90 && m.lat <= 90 && m.lon >= -180 && m.lon <= 180
    })

    if (valid.length === 0) return

    const icon = L.divIcon({
      className: "custom-marker",
      html: '<div style="font-size:28px;filter:drop-shadow(0 0 8px #ff8c00);">📍</div>',
      iconSize: [28, 28],
      iconAnchor: [14, 28],
    })

    valid.forEach((m) => {
      L.marker([m.lat!, m.lon!], { icon })
        .bindPopup(`
          <div style="background:#111;padding:10px;border-radius:6px;border:2px solid #ff8c00;min-width:180px;">
            <div style="color:#ff8c00;font-weight:bold;font-size:13px;">📅 ${m.year || "Unknown"}</div>
            <div style="color:#fff;font-size:12px;margin:4px 0;">${m.title || ""}</div>
            <div style="color:#aaa;font-size:11px;">${m.desc || ""}</div>
            ${m.place ? `<div style="color:#ff8c00;font-size:10px;margin-top:4px;">📍 ${m.place}</div>` : ""}
          </div>
        `)
        .addTo(markersLayerRef.current)
    })

    if (valid.length > 1) {
      L.polyline(
        valid.map((m) => [m.lat!, m.lon!]),
        { color: "#FF8C00", weight: 2, opacity: 0.6, dashArray: "6,10" }
      ).addTo(markersLayerRef.current)
    }
  }, [markers, mapReady])

  return (
    <div className="relative w-full h-full bg-black">
      {!mapReady && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
          <div className="text-orange-500 text-sm">Loading map...</div>
        </div>
      )}
      <div
        ref={mapContainerRef}
        className="w-full h-full"
        style={{ opacity: mapReady ? 1 : 0, transition: "opacity 0.3s" }}
      />
    </div>
  )
}

export default memo(LeafletMapComponent)
