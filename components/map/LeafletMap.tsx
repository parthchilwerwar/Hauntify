"use client"

import { useEffect, useRef } from "react"
import type { TimelineItem } from "@/src/types"
import { isValidCenter, getSafeCenter } from "@/src/lib/validation"

interface LeafletMapProps {
  markers: TimelineItem[]
  center: [number, number]
  zoom: number
}

const DEFAULT_CENTER: [number, number] = [20, 0]
const DEFAULT_ZOOM = 2

export default function LeafletMap({ markers, center, zoom }: LeafletMapProps) {
  const mapRef = useRef<any>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersLayerRef = useRef<any>(null)

  // Validate props
  const safeCenter = getSafeCenter(center, DEFAULT_CENTER)
  const safeZoom = typeof zoom === "number" && isFinite(zoom) && zoom > 0 ? zoom : DEFAULT_ZOOM

  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const L = require("leaflet")
      // Note: Leaflet CSS is loaded via CDN in app/layout.tsx

      if (!mapInstanceRef.current && mapRef.current) {
        const map = L.map(mapRef.current, {
          center: safeCenter,
          zoom: safeZoom,
          zoomControl: false,        // Disable zoom controls (+/-)
          attributionControl: false, // Disable attribution watermark
        })

        // Dark theme map tiles for horror atmosphere
        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
          attribution: '',
          maxZoom: 19,
          subdomains: 'abcd',
        }).addTo(map)

        markersLayerRef.current = L.layerGroup().addTo(map)
        mapInstanceRef.current = map

        console.log("✅ Map initialized with center:", safeCenter, "zoom:", safeZoom)
      }
    } catch (error) {
      console.error("❌ Map initialization error:", error)
    }

    return () => {
      try {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove()
          mapInstanceRef.current = null
        }
      } catch (error) {
        console.error("❌ Map cleanup error:", error)
      }
    }
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current) return

    // Validate coordinates before flying
    if (!isValidCenter(safeCenter)) {
      console.warn("⚠️ Invalid map center coordinates, skipping map update:", {
        center: safeCenter,
      })
      return
    }

    try {
      mapInstanceRef.current.flyTo(safeCenter, safeZoom, {
        duration: 0.8,
        easeLinearity: 0.25,
      })
    } catch (error) {
      console.error("❌ Map flyTo error:", error, { center: safeCenter, zoom: safeZoom })
    }
  }, [safeCenter, safeZoom])

  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return

    try {
      const L = require("leaflet")
      markersLayerRef.current.clearLayers()

      let validMarkerCount = 0

      markers.forEach((marker) => {
        try {
          // Validate marker coordinates
          if (marker.lat === undefined || marker.lon === undefined) {
            console.debug(`ℹ️ Marker missing coordinates, will geocode later: "${marker.title}"`)
            return
          }

          // Check if coordinates are valid numbers
          if (typeof marker.lat !== "number" || typeof marker.lon !== "number") {
            console.warn(
              `⚠️ Marker has non-numeric coordinates:`,
              { title: marker.title, lat: typeof marker.lat, lon: typeof marker.lon }
            )
            return
          }

          if (!isFinite(marker.lat) || !isFinite(marker.lon)) {
            console.warn(`⚠️ Marker has invalid (NaN/Infinity) coordinates:`, {
              title: marker.title,
              lat: marker.lat,
              lon: marker.lon,
            })
            return
          }

          // Validate bounds
          if (marker.lat < -90 || marker.lat > 90 || marker.lon < -180 || marker.lon > 180) {
            console.warn(`⚠️ Marker coordinates out of bounds:`, {
              title: marker.title,
              lat: marker.lat,
              lon: marker.lon,
            })
            return
          }

          const icon = L.divIcon({
            className: "custom-marker",
            html: `<div style="font-size: 32px; filter: drop-shadow(0 0 8px rgba(255, 140, 0, 0.8));">📍</div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
          })

          const leafletMarker = L.marker([marker.lat, marker.lon], { icon })
            .bindPopup(
              `<div style="background: #1a1a1a; padding: 12px; border-radius: 8px; border: 2px solid #ff8c00; min-width: 200px;">
                <div style="font-family: 'JetBrains Mono', monospace; font-weight: bold; color: #ff8c00; font-size: 14px; margin-bottom: 6px;">📅 ${marker.year}</div>
                <div style="font-weight: 600; color: #ffffff; font-size: 13px; margin-bottom: 4px;">${marker.title}</div>
                <div style="color: #cccccc; font-size: 11px; line-height: 1.4;">${marker.desc}</div>
                ${marker.place ? `<div style="color: #ff8c00; font-size: 10px; margin-top: 6px;">📍 ${marker.place}</div>` : ''}
              </div>`,
              {
                className: 'custom-popup',
                maxWidth: 300,
              }
            )

          leafletMarker.addTo(markersLayerRef.current)
          validMarkerCount++
        } catch (markerError) {
          console.error(`❌ Error adding marker for "${marker.title}":`, markerError)
        }
      })

      console.log(`📍 Rendered ${validMarkerCount}/${markers.length} valid markers`)

      // Draw connecting lines between markers with Halloween theme
      try {
        const validCoords = markers
          .filter((m) => {
            if (m.lat === undefined || m.lon === undefined) return false
            if (!isFinite(m.lat) || !isFinite(m.lon)) return false
            return m.lat >= -90 && m.lat <= 90 && m.lon >= -180 && m.lon <= 180
          })
          .map((m) => [m.lat!, m.lon!] as [number, number])

        if (validCoords.length > 1) {
          L.polyline(validCoords, {
            color: "#FF8C00",
            weight: 3,
            opacity: 0.8,
            dashArray: "10, 15",
          }).addTo(markersLayerRef.current)
          console.log(`🔗 Drew connecting line through ${validCoords.length} locations`)
        }
      } catch (polylineError) {
        console.error("❌ Error drawing polyline:", polylineError)
      }
    } catch (error) {
      console.error("❌ Error in marker rendering effect:", error)
    }
  }, [markers])

  return <div ref={mapRef} className="w-full h-full bg-black" />
}
