/**
 * GET /api/geocode?q=place - Geocoding endpoint with rate limiting and caching
 */
import { NextRequest, NextResponse } from "next/server"
import { geocodeQuerySchema } from "@/src/schemas"
import { getCoords } from "@/src/server/geocode"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Simple rate limiting (1 req/sec per IP)
const rateLimits = new Map<string, number>()
const RATE_LIMIT_MS = 1000

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const lastRequest = rateLimits.get(ip) || 0

  if (now - lastRequest < RATE_LIMIT_MS) {
    return false
  }

  rateLimits.set(ip, now)
  return true
}

// Clean up old rate limit entries every minute
setInterval(() => {
  const now = Date.now()
  for (const [ip, timestamp] of rateLimits.entries()) {
    if (now - timestamp > 60000) {
      rateLimits.delete(ip)
    }
  }
}, 60000)

export async function GET(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait 1 second between requests." },
        { status: 429 }
      )
    }

    // Validate query
    const searchParams = req.nextUrl.searchParams
    const query = searchParams.get("q")

    const validated = geocodeQuerySchema.parse({ q: query })

    // Geocode
    const result = await getCoords(validated.q)

    if (!result) {
      return NextResponse.json(
        { error: "Location not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, max-age=2592000", // 30 days
      },
    })
  } catch (error: any) {
    console.error("Geocode API error:", error)

    return NextResponse.json(
      {
        error: error.message || "Invalid request",
        details: error.issues || undefined,
      },
      { status: 400 }
    )
  }
}
