/**
 * ElevenLabs Text-to-Speech service - Horror narrator voice only
 */

export interface VoiceGenerationResult {
  audioUrl: string
  duration: number
  format: "mp3"
}

/**
 * Generate speech from text using ElevenLabs API
 * Deep, scary horror narrator voice with v3 model
 * Supports multiple languages
 */
export async function generateSpeech(text: string, language?: string): Promise<VoiceGenerationResult> {
  try {
    const response = await fetch("/api/voice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })

    const contentType = response.headers.get("content-type") || ""

    if (!response.ok) {
      let errorMsg = "Voice generation failed"
      if (contentType.includes("application/json")) {
        try {
          const errorData = await response.json()
          errorMsg = errorData.error || errorMsg
        } catch (e) {
          // Failed to parse JSON error response
        }
      } else {
        const errorText = await response.text()
        errorMsg = errorText || errorMsg
      }
      console.error(`🎙️ Voice API error (${response.status}):`, errorMsg)
      throw new Error(errorMsg)
    }

    if (contentType.includes("audio")) {
      // Success - got audio from ElevenLabs
      const audioBlob = await response.blob()
      
      if (audioBlob.size === 0) {
        console.error("🎙️ ElevenLabs returned empty audio blob")
        throw new Error("ElevenLabs returned empty audio")
      }

      const audioUrl = URL.createObjectURL(audioBlob)
      console.log(`🎙️ Successfully generated audio (${audioBlob.size} bytes), URL: ${audioUrl.substring(0, 50)}...`)

      // Estimate duration (rough: ~150 words per minute, ~5 chars per word)
      const wordCount = text.split(/\s+/).length
      const duration = (wordCount / 150) * 60

      return {
        audioUrl,
        duration,
        format: "mp3",
      }
    }

    console.error("🎙️ Invalid content-type from voice API:", contentType)
    throw new Error("Invalid response from voice API - expected audio/mpeg")
  } catch (error: any) {
    console.error("🎙️ ElevenLabs service error:", error)
    throw new Error(error.message || "Voice generation failed")
  }
}

/**
 * Clean up audio blob URL to prevent memory leaks
 */
export function releaseAudioUrl(url: string): void {
  if (url && url.startsWith("blob:")) {
    URL.revokeObjectURL(url)
  }
}
