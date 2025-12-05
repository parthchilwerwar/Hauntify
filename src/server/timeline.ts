/**
 * Timeline extraction and processing utilities
 */
import type { TimelineItem } from "@/src/types"
import { timelineItemSchema } from "@/src/schemas"

const TIMELINE_MARKER = "##TIMELINE##"

/**
 * Extract timeline blocks from AI response text
 * Parses lines like: ##TIMELINE## {"year":1692,"title":"..."}
 */
export function extractTimelineBlocks(text: string): TimelineItem[] {
  const lines = text.split("\n")
  const items: TimelineItem[] = []
  const seen = new Set<string>()

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed.startsWith(TIMELINE_MARKER)) continue

    const jsonStr = trimmed.slice(TIMELINE_MARKER.length).trim()
    try {
      const parsed = JSON.parse(jsonStr)
      const validated = timelineItemSchema.parse(parsed)

      // Deduplicate by title+year
      const key = `${validated.year}:${validated.title}`
      if (seen.has(key)) continue

      seen.add(key)
      items.push(validated)
    } catch (e) {
      console.error("Failed to parse timeline block:", jsonStr, e)
    }
  }

  // Sort by year ascending
  return items.sort((a, b) => a.year - b.year)
}

/**
 * Process streaming text and emit timeline events as they're detected
 */
export async function* processStreamForTimeline(
  stream: AsyncGenerator<string>
): AsyncGenerator<string> {
  let buffer = ""

  for await (const chunk of stream) {
    yield chunk

    // Parse the chunk to get token data
    try {
      const event = JSON.parse(chunk)
      if (event.type === "token") {
        buffer += event.data

        // More robust timeline extraction: find TIMELINE_MARKER then parse JSON by matching braces
        const markerIndex = buffer.indexOf(TIMELINE_MARKER)
        if (markerIndex !== -1) {
          // find first opening brace after the marker
          const startIdx = buffer.indexOf("{", markerIndex + TIMELINE_MARKER.length)
          if (startIdx !== -1) {
            // find matching closing brace using simple brace counting
            let depth = 0
            let endIdx = -1
            for (let i = startIdx; i < buffer.length; i++) {
              const ch = buffer[i]
              if (ch === "{") depth++
              else if (ch === "}") {
                depth--
                if (depth === 0) {
                  endIdx = i
                  break
                }
              }
            }

            if (endIdx !== -1) {
              const jsonStr = buffer.slice(startIdx, endIdx + 1).trim()
              try {
                const parsed = JSON.parse(jsonStr)
                const validated = timelineItemSchema.parse(parsed)
                yield JSON.stringify({ type: "timeline", data: validated }) + "\n"

                // Remove processed timeline from buffer (everything up through endIdx)
                buffer = buffer.slice(endIdx + 1)
              } catch (e) {
                // Invalid timeline JSON - avoid tight loop by removing the marker prefix
                console.error("Failed to parse timeline JSON (robust parser):", jsonStr, e)
                buffer = buffer.slice(markerIndex + TIMELINE_MARKER.length)
              }
            }
          }
        }

        // Keep buffer manageable
        if (buffer.length > 5000) {
          buffer = buffer.slice(-2000)
        }
      }
    } catch (e) {
      // Not JSON, skip
    }
  }
}
