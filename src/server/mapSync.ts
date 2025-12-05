/**
 * Map synchronization utilities
 */
import type { TimelineItem, LocationHit } from "@/src/types"
import { getCoords } from "./geocode"

/**
 * Resolve place name to coordinates
 * If lat/lon already present, trust them; otherwise geocode
 */
export async function resolvePlace(item: TimelineItem): Promise<TimelineItem> {
  if (item.lat !== undefined && item.lon !== undefined) {
    return item
  }

  if (!item.place) {
    return item
  }

  const coords = await getCoords(item.place)
  if (coords) {
    return {
      ...item,
      lat: coords.lat,
      lon: coords.lon,
    }
  }

  return item
}

/**
 * Resolve multiple timeline items in parallel
 */
export async function resolveTimeline(items: TimelineItem[]): Promise<TimelineItem[]> {
  return Promise.all(items.map(resolvePlace))
}
