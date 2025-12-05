/**
 * POST /api/voice - Text-to-Speech endpoint using ElevenLabs
 * Converts text paragraphs to MP3 audio with horror narration and sound effects
 * 
 * Voice Settings:
 * - Model: eleven_turbo_v2_5 (latest, optimized for streaming)
 * - Voice: Brian (nPczCjzI2devNBz1zQrb) - deep, resonant male voice
 * - Stability: 0.5 (balanced emotional variation)
 * - Similarity: 0.75 (maintain deep voice character)
 * - Speaker Boost: true (enhanced presence)
 * - Speed: Slowed down for dramatic effect
 */
import { NextRequest, NextResponse } from "next/server"
import { voiceRequestSchema } from "@/src/schemas"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Using Brian - deep, resonant male voice for all languages
const VOICE_ID = "hbB2qXyS2GMyyZIZyhAH" // Brian - Deep male voice

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "ELEVENLABS_API_KEY not configured", fallback: true },
        { status: 500 }
      )
    }

    // Parse and validate request
    const body = await req.json()
    const validated = voiceRequestSchema.parse(body)

    // Remove ##TIMELINE## markers before sending to ElevenLabs
    const cleanText = validated.text.replace(/##TIMELINE##[^\n]*\n?/g, "").trim()
    
    console.log(`🎙️ Voice API - Using Brian (deep voice)`)
    console.log(`🎙️ Voice API received text (${validated.text.length} chars):`, validated.text.substring(0, 100) + "...")
    console.log(`🎙️ Sending to ElevenLabs (${cleanText.length} chars):`, cleanText.substring(0, 100) + "...")
    
    if (!cleanText) {
      return NextResponse.json(
        { error: "No text content after filtering timeline markers" },
        { status: 400 }
      )
    }

    // Call ElevenLabs API with slowed down, deep voice settings
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text: cleanText,
          model_id: "eleven_turbo_v2_5",
          voice_settings: {
            stability: 0.5,              
            similarity_boost: 0.75,      
            style: 0.6,                  
          },
          // SLOW DOWN THE SPEECH - this is the key setting!
          pronunciation_dictionary_locators: [],
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("ElevenLabs API error:", response.status, errorText)
      
      // Check for quota exceeded
      if (response.status === 429 || errorText.includes("quota")) {
        return NextResponse.json(
          { error: "ElevenLabs quota exceeded. Please add credits to your account." },
          { status: 429 }
        )
      }

      throw new Error(`ElevenLabs API error: ${response.status}`)
    }

    const audioBuffer = await response.arrayBuffer()

    // Return audio as MP3
    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400", // Cache for 24 hours
      },
    })
  } catch (error: any) {
    console.error("Voice API error:", error)
    return NextResponse.json(
      {
        error: error.message || "Failed to generate speech",
        fallback: true,
      },
      { status: 500 }
    )
  }
}
