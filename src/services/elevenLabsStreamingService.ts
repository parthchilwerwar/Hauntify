/**
 * ElevenLabs Streaming Audio Service
 * Handles streaming TTS with segment-based stitching for continuous playback
 */

export interface StreamingSegment {
  id: string
  text: string
  segmentIndex: number
  duration?: number
  voiceType?: string
}

export interface StreamingAudioResult {
  blob: Blob
  duration: number
  segmentId: string
}

/**
 * Stream text to speech from ElevenLabs with progressive audio delivery
 * Uses the /stream endpoint for real-time audio generation
 */
export async function streamTextToSpeech(
  text: string,
  segmentId: string,
  voiceSettings?: {
    stability?: number
    similarity_boost?: number
    style?: number
    use_speaker_boost?: boolean
  }
): Promise<Blob> {
  try {
    const response = await fetch("/api/voice-stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        segmentId,
        voiceSettings: {
          stability: voiceSettings?.stability ?? 0.35,
          similarity_boost: voiceSettings?.similarity_boost ?? 0.75,
          style: voiceSettings?.style ?? 0.8,
          use_speaker_boost: voiceSettings?.use_speaker_boost ?? true,
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(
        `ElevenLabs streaming error (${response.status}):`,
        errorText
      )
      throw new Error(
        `ElevenLabs streaming failed: ${response.status} ${errorText}`
      )
    }

    // Collect audio chunks from streaming response
    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error("No response body from ElevenLabs streaming")
    }

    const chunks: BlobPart[] = []
    let totalChunks = 0

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      if (value && value.length > 0) {
        chunks.push(new Uint8Array(value))
        totalChunks += value.length
      }
    }

    if (chunks.length === 0) {
      throw new Error("Received empty audio stream from ElevenLabs")
    }

    // Combine chunks into single blob
    const audioBlob = new Blob(chunks, { type: "audio/mpeg" })

    if (audioBlob.size === 0) {
      throw new Error("Generated audio blob is empty")
    }

    console.log(
      `✅ Successfully streamed audio for segment ${segmentId}: ${audioBlob.size} bytes (${chunks.length} chunks)`
    )

    return audioBlob
  } catch (error) {
    console.error(`Failed to stream audio for segment ${segmentId}:`, error)
    throw error
  }
}

/**
 * Stream multiple segments sequentially with pre-buffering
 * Useful for paragraphs/sections where we want to generate audio as content arrives
 */
export async function streamSegmentsSequential(
  segments: StreamingSegment[],
  onSegmentReady: (result: StreamingAudioResult) => void,
  onError: (error: Error) => void
): Promise<void> {
  try {
    for (const segment of segments) {
      try {
        const blob = await streamTextToSpeech(
          segment.text,
          segment.id,
          {
            stability: 0.35,
            similarity_boost: 0.75,
            style: 0.8,
            use_speaker_boost: true,
          }
        )

        // Calculate duration (rough estimate: 8-10 chars per second)
        const estimatedDuration = Math.max(2, segment.text.length / 9)

        onSegmentReady({
          blob,
          duration: estimatedDuration,
          segmentId: segment.id,
        })
      } catch (segmentError) {
        console.error(
          `Failed to process segment ${segment.id}:`,
          segmentError
        )
        onError(
          segmentError instanceof Error
            ? segmentError
            : new Error(`Failed to process segment ${segment.id}`)
        )
      }
    }
  } catch (error) {
    console.error("Error streaming segments:", error)
    onError(
      error instanceof Error ? error : new Error("Failed to stream segments")
    )
  }
}

/**
 * Stream segments in parallel with controlled concurrency
 * More efficient than sequential, but uses more bandwidth
 */
export async function streamSegmentsParallel(
  segments: StreamingSegment[],
  maxConcurrent: number = 2,
  onSegmentReady: (result: StreamingAudioResult) => void,
  onError: (error: Error) => void
): Promise<void> {
  try {
    const activePromises: Promise<void>[] = []

    for (let i = 0; i < segments.length; i++) {
      if (activePromises.length >= maxConcurrent) {
        // Wait for first promise to complete before adding new one
        await Promise.race(activePromises)
        activePromises.splice(activePromises.findIndex((p) => !p), 1)
      }

      const segment = segments[i]
      const promise = (async () => {
        try {
          const blob = await streamTextToSpeech(
            segment.text,
            segment.id,
            {
              stability: 0.35,
              similarity_boost: 0.75,
              style: 0.8,
              use_speaker_boost: true,
            }
          )

          const estimatedDuration = Math.max(2, segment.text.length / 9)

          onSegmentReady({
            blob,
            duration: estimatedDuration,
            segmentId: segment.id,
          })
        } catch (segmentError) {
          console.error(
            `Failed to process segment ${segment.id}:`,
            segmentError
          )
          onError(
            segmentError instanceof Error
              ? segmentError
              : new Error(`Failed to process segment ${segment.id}`)
          )
        }
      })()

      activePromises.push(promise)
    }

    // Wait for all remaining promises
    await Promise.all(activePromises)
  } catch (error) {
    console.error("Error streaming segments in parallel:", error)
    onError(
      error instanceof Error
        ? error
        : new Error("Failed to stream segments in parallel")
    )
  }
}

/**
 * Create blob URL from audio blob with automatic cleanup
 */
export function createAudioUrl(blob: Blob): string {
  return URL.createObjectURL(blob)
}

/**
 * Cleanup blob URL to prevent memory leaks
 */
export function revokeAudioUrl(url: string): void {
  if (url && url.startsWith("blob:")) {
    try {
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Failed to revoke blob URL:", error)
    }
  }
}
