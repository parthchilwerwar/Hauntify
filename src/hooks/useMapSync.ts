/**
 * Hook for syncing timeline events to map markers
 */
import { useEffect, useRef } from "react"
import { useSessionStore } from "@/src/store/session"
import type { TimelineItem } from "@/src/types"
import { isValidLatLngPair } from "@/src/lib/validation"
import ErrorHandler from "@/src/lib/errorHandler"

export interface MapSyncCallbacks {
  onLocationUpdate: (item: TimelineItem) => void
  onPathUpdate: (items: TimelineItem[]) => void
}

export function useMapSync(callbacks: MapSyncCallbacks) {
  const { activeLocation, locationHistory } = useSessionStore()
  const prevLocationRef = useRef<TimelineItem | null>(null)
  const callbacksRef = useRef(callbacks)
  
  // Keep callbacks ref up to date
  useEffect(() => {
    callbacksRef.current = callbacks
  }, [callbacks])

  useEffect(() => {
    if (!activeLocation) return
    if (prevLocationRef.current?.title === activeLocation.title) return

    try {
      prevLocationRef.current = activeLocation

      // Validate the location
      if (!activeLocation.title || activeLocation.year === undefined) {
        ErrorHandler.logWarning(
          "MapSync",
          "Active location missing required fields",
          { title: activeLocation.title, year: activeLocation.year }
        )
        return
      }

      // Geocode if needed
      if (activeLocation.place && (activeLocation.lat === undefined || activeLocation.lon === undefined)) {
        geocodeAndUpdate(activeLocation)
      } else if (
        activeLocation.lat !== undefined &&
        activeLocation.lon !== undefined &&
        isValidLatLngPair(activeLocation.lat, activeLocation.lon)
      ) {
        callbacksRef.current.onLocationUpdate(activeLocation)
      } else if (activeLocation.lat !== undefined && activeLocation.lon !== undefined) {
        // Coordinates exist but are invalid
        ErrorHandler.logWarning(
          "MapSync",
          `Invalid coordinates for location: "${activeLocation.title}"`,
          {
            place: activeLocation.place,
            lat: activeLocation.lat,
            lon: activeLocation.lon,
          }
        )
      }
    } catch (error) {
      ErrorHandler.logError(
        "MapSync",
        error instanceof Error ? error.message : "Unknown error in activeLocation effect",
        "major",
        { activeLocation },
        error instanceof Error ? error : undefined
      )
    }
  }, [activeLocation])

  useEffect(() => {
    try {
      if (locationHistory.length > 0) {
        // Validate all items before updating
        const validItems = locationHistory.filter((item) => {
          if (!item.title || item.year === undefined) {
            console.warn("⚠️ Location history item missing required fields:", item)
            return false
          }
          // Items may not have coordinates yet, that's okay
          if (item.lat === undefined || item.lon === undefined) {
            return true
          }
          // If coordinates exist, validate them
          return isValidLatLngPair(item.lat, item.lon)
        })

        if (validItems.length === 0 && locationHistory.length > 0) {
          ErrorHandler.logWarning(
            "MapSync",
            "Location history has no valid items",
            { count: locationHistory.length }
          )
        }

        callbacksRef.current.onPathUpdate(validItems)
      }
    } catch (error) {
      ErrorHandler.logError(
        "MapSync",
        error instanceof Error ? error.message : "Unknown error in locationHistory effect",
        "major",
        { historyLength: locationHistory.length },
        error instanceof Error ? error : undefined
      )
    }
  }, [locationHistory])

  async function geocodeAndUpdate(item: TimelineItem) {
    if (!item.place) {
      ErrorHandler.logWarning("MapSync", "Cannot geocode location without place name", { item })
      return
    }

    console.log(`🗺️ Geocoding location: "${item.place}"`)

    try {
      const response = await fetch(`/api/geocode?q=${encodeURIComponent(item.place)}`)
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(
          `Geocoding API returned ${response.status}: ${errorText}`
        )
      }

      const coords = await response.json()

      // Validate geocoded coordinates
      if (!coords.lat || !coords.lon) {
        throw new Error(
          `Geocoding returned invalid coordinates: lat=${coords.lat}, lon=${coords.lon}`
        )
      }

      if (!isValidLatLngPair(coords.lat, coords.lon)) {
        throw new Error(
          `Geocoded coordinates out of valid range: [${coords.lat}, ${coords.lon}]`
        )
      }

      const updated: TimelineItem = {
        ...item,
        lat: coords.lat,
        lon: coords.lon,
      }

      console.log(`✅ Geocoded "${item.place}" to [${coords.lat}, ${coords.lon}]`)

      try {
        // Update the store with geocoded coordinates
        const store = useSessionStore.getState()
        const timelineIndex = store.timeline.findIndex(
          (t) => t.title === item.title && t.year === item.year
        )

        if (timelineIndex !== -1) {
          // Create new timeline array with updated item
          const newTimeline = [...store.timeline]
          newTimeline[timelineIndex] = updated

          // Check if already in locationHistory
          const historyExists = store.locationHistory.some(
            (h) => h.title === updated.title && h.year === updated.year
          )

          const newLocationHistory = historyExists
            ? store.locationHistory
            : [...store.locationHistory, updated]

          // Update the store
          useSessionStore.setState({
            timeline: newTimeline,
            locationHistory: newLocationHistory,
            activeLocation: updated,
          })

          // Notify callback with updated coordinates
          callbacksRef.current.onLocationUpdate(updated)
        }
      } catch (storeError) {
        ErrorHandler.logError(
          "MapSync_StoreUpdate",
          storeError instanceof Error ? storeError.message : "Failed to update store with geocoded coordinates",
          "major",
          { location: item.place },
          storeError instanceof Error ? storeError : undefined
        )
      }
    } catch (error) {
      ErrorHandler.logError(
        "MapSync_Geocode",
        error instanceof Error ? error.message : "Geocoding failed",
        "major",
        { place: item.place, title: item.title },
        error instanceof Error ? error : undefined
      )
    }
  }
}
