/**
 * Geocoding service using Nominatim (OpenStreetMap)
 */
import type { LocationHit } from "@/src/types"

const NOMINATIM_BASE = process.env.NOMINATIM_BASE || "https://nominatim.openstreetmap.org"
const USER_AGENT = "SpectralVoice/1.0 (+https://github.com/spectralvoice)"

// Simple in-memory cache (30 days)
const cache = new Map<string, { data: LocationHit; expires: number }>()
const CACHE_TTL = 30 * 24 * 60 * 60 * 1000 // 30 days

/**
 * Get coordinates for a place name using Nominatim
 */
export async function getCoords(place: string): Promise<LocationHit | null> {
  const cacheKey = place.toLowerCase().trim()

  // Check cache
  const cached = cache.get(cacheKey)
  if (cached && cached.expires > Date.now()) {
    console.log(`📦 Cache hit for: ${place}`)
    return cached.data
  }

  try {
    console.log(`🌍 Geocoding: ${place}`)
    
    const url = new URL("/search", NOMINATIM_BASE)
    url.searchParams.set("q", place)
    url.searchParams.set("format", "json")
    url.searchParams.set("limit", "1")
    url.searchParams.set("addressdetails", "1")

    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": USER_AGENT,
      },
    })

    if (!response.ok) {
      console.error(`❌ Nominatim error: ${response.status}`)
      throw new Error(`Nominatim error: ${response.status}`)
    }

    const results = await response.json()
    if (!results || results.length === 0) {
      console.warn(`⚠️ No results found for: ${place}`)
      return null
    }

    const result = results[0]
    const lat = parseFloat(result.lat)
    const lon = parseFloat(result.lon)

    // Validate coordinates are valid numbers
    if (!isFinite(lat) || !isFinite(lon)) {
      console.warn(`⚠️ Invalid coordinates returned by Nominatim for: ${place} (lat=${lat}, lon=${lon})`)
      return null
    }

    const hit: LocationHit = {
      name: result.display_name,
      lat,
      lon,
      country: result.address?.country,
    }

    console.log(`✅ Geocoded ${place} → [${hit.lat}, ${hit.lon}]`)

    // Cache the result
    cache.set(cacheKey, {
      data: hit,
      expires: Date.now() + CACHE_TTL,
    })

    return hit
  } catch (error) {
    console.error(`❌ Geocoding failed for ${place}:`, error)
    return null
  }
}

/**
 * Clean up expired cache entries (call periodically)
 */
export function cleanCache() {
  const now = Date.now()
  for (const [key, value] of cache.entries()) {
    if (value.expires < now) {
      cache.delete(key)
    }
  }
}
