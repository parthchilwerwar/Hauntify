"use client"

import { useEffect, useState, useCallback, memo } from "react"
import dynamic from "next/dynamic"
import type { TimelineItem } from "@/src/types"
import { useMapSync } from "@/src/hooks/useMapSync"
import { AudioPlayer } from "@/components/AudioPlayer"
import { isValidLatLngPair, filterByValidCoordinates, getSafeCenter } from "@/src/lib/validation"

// Dynamic import with better loading state
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-black flex items-center justify-center">
      <div className="text-orange-500 flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Initializing map...</span>
      </div>
    </div>
  ),
})

const DEFAULT_CENTER: [number, number] = [20, 0]
const DEFAULT_ZOOM = 2

function MapPaneComponent() {
  const [markers, setMarkers] = useState<TimelineItem[]>([])
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER)
  const [zoom, setZoom] = useState(DEFAULT_ZOOM)

  // Memoized callbacks to prevent unnecessary re-renders
  const handleLocationUpdate = useCallback((item: TimelineItem) => {
    const hasValidCoords = item.lat !== undefined && 
                           item.lon !== undefined &&
                           isValidLatLngPair(item.lat, item.lon)

    if (!hasValidCoords) {
      console.warn(`⚠️ Invalid coordinates for: ${item.place}`)
      return
    }

    console.log(`📍 Location update: "${item.place}" [${item.lat}, ${item.lon}]`)

    setMarkers((prev) => {
      const exists = prev.some((m) => m.title === item.title && m.year === item.year)
      if (exists) {
        return prev.map((m) => 
          m.title === item.title && m.year === item.year ? item : m
        )
      }
      return [...prev, item]
    })

    const newCenter = getSafeCenter([item.lat, item.lon], DEFAULT_CENTER)
    setCenter(newCenter)
    setZoom(12)
  }, [])

  const handlePathUpdate = useCallback((items: TimelineItem[]) => {
    const validItems = filterByValidCoordinates(items)
    
    if (validItems.length === 0) {
      console.warn("⚠️ No valid coordinates in path update")
      return
    }

    console.log(`🗺️ Path update: ${validItems.length} locations`)
    setMarkers(validItems)

    const latest = validItems[validItems.length - 1]
    if (latest.lat !== undefined && latest.lon !== undefined) {
      setCenter(getSafeCenter([latest.lat, latest.lon], DEFAULT_CENTER))
      setZoom(12)
    }
  }, [])

  useMapSync({
    onLocationUpdate: handleLocationUpdate,
    onPathUpdate: handlePathUpdate,
  })

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <LeafletMap markers={markers} center={center} zoom={zoom} />
      <AudioPlayer />
      
      {/* Subtle gradient overlay at edges for polish */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
    </div>
  )
}

export const MapPane = memo(MapPaneComponent)
