"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import type { TimelineItem } from "@/src/types"
import { useMapSync } from "@/src/hooks/useMapSync"
import { AudioPlayer } from "@/components/AudioPlayer"
import { isValidLatLngPair, filterByValidCoordinates, getSafeCenter } from "@/src/lib/validation"

const MapComponent = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-black flex items-center justify-center text-white">
      Loading map...
    </div>
  ),
})

const DEFAULT_CENTER: [number, number] = [20, 0]
const DEFAULT_ZOOM = 2

export function MapPane() {
  const [markers, setMarkers] = useState<TimelineItem[]>([])
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER)
  const [zoom, setZoom] = useState(DEFAULT_ZOOM)
  const [hasError, setHasError] = useState(false)

  useMapSync({
    onLocationUpdate: (item) => {
      try {
        // Validate coordinates with detailed logging
        const hasValidCoords = item.lat !== undefined && 
                               item.lon !== undefined &&
                               isValidLatLngPair(item.lat, item.lon)

        if (!hasValidCoords) {
          console.warn(`⚠️ Location update received with invalid coordinates:`, {
            place: item.place,
            title: item.title,
            year: item.year,
            lat: item.lat,
            lon: item.lon,
          })
          setHasError(true)
          return
        }

        console.log(`📍 Map updating with valid location: "${item.place}" [${item.lat}, ${item.lon}]`)
        setHasError(false)

        // Add marker
        setMarkers((prev) => {
          const exists = prev.some((m) => m.title === item.title && m.year === item.year)
          if (exists) {
            // Update existing marker with coordinates if they were missing
            return prev.map((m) => 
              m.title === item.title && m.year === item.year ? item : m
            )
          }
          return [...prev, item]
        })

        // Pan to location with appropriate zoom
        const newCenter = getSafeCenter([item.lat, item.lon], DEFAULT_CENTER)
        setCenter(newCenter)
        setZoom(12) // City level zoom for better visibility
      } catch (error) {
        console.error("❌ Error in onLocationUpdate:", error)
        setHasError(true)
      }
    },

    onPathUpdate: (items) => {
      try {
        // Filter to only items with valid coordinates
        const validItems = filterByValidCoordinates(items)
        
        console.log(`🗺️ Path update: ${validItems.length}/${items.length} locations with valid coordinates`)
        
        if (validItems.length === 0) {
          console.warn("⚠️ Path update received but no items with valid coordinates")
          setHasError(true)
          return
        }

        setMarkers(validItems)
        setHasError(false)

        // If we have locations, center on the most recent one
        const latest = validItems[validItems.length - 1]
        if (latest.lat !== undefined && latest.lon !== undefined) {
          const newCenter = getSafeCenter([latest.lat, latest.lon], DEFAULT_CENTER)
          setCenter(newCenter)
          setZoom(12)
        }
      } catch (error) {
        console.error("❌ Error in onPathUpdate:", error)
        setHasError(true)
      }
    },
  })

  // Log any errors
  useEffect(() => {
    if (hasError) {
      console.error("🚨 Map error state detected - check console for details")
    }
  }, [hasError])

  return (
    <div className="relative w-full h-full">
      {hasError && (
        <div className="absolute top-4 right-4 z-50 bg-red-900 border border-red-600 text-white px-4 py-2 rounded text-sm max-w-xs">
          ⚠️ Map encountered invalid coordinates. Check console for details.
        </div>
      )}
      <MapComponent markers={markers} center={center} zoom={zoom} />
      <AudioPlayer />
    </div>
  )
}
