import { NextRequest, NextResponse } from "next/server"

/**
 * Voice streaming endpoint
 * Streams audio from ElevenLabs using the /stream endpoint
 * Enables real-time audio generation for faster playback start
 */
export async function POST(request: NextRequest) {
  try {
    const { text, segmentId, voiceSettings } = await request.json()

    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      )
    }

    if (!process.env.ELEVEN_LABS_API_KEY) {
      console.error("ELEVEN_LABS_API_KEY not configured")
      return NextResponse.json(
        { error: "Voice service not configured" },
        { status: 500 }
      )
    }

    const VOICE_ID = process.env.ELEVEN_LABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM" // Rachel voice

    // Call ElevenLabs streaming endpoint
    const elevenLabsResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`,
      {
        method: "POST",
        headers: {
          "xi-api-key": process.env.ELEVEN_LABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text.trim(),
          model_id: "eleven_turbo_v2_5",
          voice_settings: {
            stability: voiceSettings?.stability ?? 0.35,
            similarity_boost: voiceSettings?.similarity_boost ?? 0.75,
            style: voiceSettings?.style ?? 0.8,
            use_speaker_boost: voiceSettings?.use_speaker_boost ?? true,
          },
        }),
      }
    )

    if (!elevenLabsResponse.ok) {
      const errorText = await elevenLabsResponse.text()

      // Try to parse as JSON error response
      try {
        const errorJson = JSON.parse(errorText)
        console.error("ElevenLabs streaming error:", errorJson)
      } catch {
        console.error(
          `ElevenLabs streaming HTTP ${elevenLabsResponse.status}:`,
          errorText
        )
      }

      return NextResponse.json(
        {
          error: `ElevenLabs streaming failed: ${elevenLabsResponse.status}`,
          details: errorText,
        },
        { status: elevenLabsResponse.status || 500 }
      )
    }

    // Stream the audio response directly back to client
    // This enables the client to collect chunks progressively
    const responseHeaders = new Headers()
    responseHeaders.set("Content-Type", "audio/mpeg")
    responseHeaders.set("Transfer-Encoding", "chunked")
    responseHeaders.set("Cache-Control", "no-cache")

    // If ElevenLabs response has a body, stream it
    if (elevenLabsResponse.body) {
      return new NextResponse(elevenLabsResponse.body, {
        status: 200,
        headers: responseHeaders,
      })
    } else {
      return NextResponse.json(
        { error: "No audio stream from ElevenLabs" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Voice streaming error:", error)

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json(
      { error: "Voice streaming failed", details: errorMessage },
      { status: 500 }
    )
  }
}
