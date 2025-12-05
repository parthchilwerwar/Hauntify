/**
 * Validation utilities for coordinates, locations, and timeline items
 */
import type { TimelineItem } from "@/src/types"

/**
 * Validate if a coordinate is valid (not NaN, not undefined, within bounds)
 */
export function isValidCoordinate(coord: any): boolean {
  if (coord === null || coord === undefined) return false
  if (typeof coord !== "number") return false
  if (!isFinite(coord)) return false
  return true
}

/**
 * Validate if latitude is within valid range (-90 to 90)
 */
export function isValidLatitude(lat: any): boolean {
  return isValidCoordinate(lat) && lat >= -90 && lat <= 90
}

/**
 * Validate if longitude is within valid range (-180 to 180)
 */
export function isValidLongitude(lon: any): boolean {
  return isValidCoordinate(lon) && lon >= -180 && lon <= 180
}

/**
 * Validate if a [lat, lon] pair is valid
 */
export function isValidLatLngPair(lat: any, lon: any): boolean {
  return isValidLatitude(lat) && isValidLongitude(lon)
}

/**
 * Validate if a center coordinate array is valid
 */
export function isValidCenter(center: any): center is [number, number] {
  if (!Array.isArray(center)) return false
  if (center.length !== 2) return false
  return isValidLatitude(center[0]) && isValidLongitude(center[1])
}

/**
 * Validate a TimelineItem has valid coordinates (if present)
 */
export function hasValidCoordinates(item: TimelineItem): boolean {
  // If coordinates are not present, that's okay (will be geocoded later)
  if (item.lat === undefined || item.lon === undefined) {
    return true
  }
  // If coordinates are present, they must be valid
  return isValidLatLngPair(item.lat, item.lon)
}

/**
 * Safe coordinate getter - returns null if invalid
 */
export function getValidCoordinates(
  item: TimelineItem
): [number, number] | null {
  if (!hasValidCoordinates(item)) {
    return null
  }
  if (item.lat === undefined || item.lon === undefined) {
    return null
  }
  return [item.lat, item.lon]
}

/**
 * Filter timeline items to only those with valid coordinates
 */
export function filterByValidCoordinates(items: TimelineItem[]): TimelineItem[] {
  return items.filter((item) => {
    if (item.lat === undefined || item.lon === undefined) {
      return false
    }
    return isValidLatLngPair(item.lat, item.lon)
  })
}

/**
 * Get a default fallback center if provided center is invalid
 */
export function getSafeCenter(center: any, fallback: [number, number] = [20, 0]): [number, number] {
  if (isValidCenter(center)) {
    return center
  }
  return fallback
}

/**
 * Validate and sanitize coordinates (clamp to valid ranges)
 */
export function sanitizeCoordinates(
  lat: any,
  lon: any
): [number, number] | null {
  if (!isValidCoordinate(lat) || !isValidCoordinate(lon)) {
    return null
  }

  // Clamp to valid ranges
  const clampedLat = Math.max(-90, Math.min(90, lat))
  const clampedLon = Math.max(-180, Math.min(180, lon))

  return [clampedLat, clampedLon]
}
