/**
 * 2-Stage Story Pipeline:
 * Stage 1: Groq LLaMA 3.3 70B generates raw story
 * Stage 2: Groq GPT-OSS-120B quality checks and enhances
 * Output: High-quality scary story for user + audio
 * Both stages use the same Groq API key!
 */

import { streamGroqToNDJSON } from "./groqChat"
import { checkAndEnhanceStory } from "./storyEnhancer"
import { processStreamForTimeline } from "./timeline"

/**
 * Main pipeline: Groq LLaMA → Groq GPT Quality Gate → Output
 */
export async function* enhancedStoryPipeline(
  groqApiKey: string,
  groqRequest: any,
  signal?: AbortSignal
): AsyncGenerator<string> {
  console.log("🎬 Starting 2-Stage Story Pipeline (All via Groq)...")
  console.log("📝 Stage 1: Groq LLaMA 3.3 70B generates story...")

  // Stage 1: Collect full story from Groq LLaMA
  let fullStory = ""
  let timelineMarkers: string[] = []

  try {
    const groqStream = streamGroqToNDJSON(groqApiKey, groqRequest, signal)

    for await (const chunk of groqStream) {
      try {
        const parsed = JSON.parse(chunk)

        if (parsed.type === "token") {
          fullStory += parsed.data
        } else if (parsed.type === "done") {
          break
        }
      } catch (e) {
        // Skip unparseable chunks
        continue
      }
    }

    console.log(`✅ Stage 1 Complete: Generated ${fullStory.length} characters`)
    console.log(`📄 Raw Story Preview: ${fullStory.substring(0, 150)}...`)

    // Extract timeline markers from story (preserve them)
    const timelineRegex = /##TIMELINE##\s*\{[^}]+\}/g
    const matches = fullStory.match(timelineRegex)
    if (matches) {
      timelineMarkers = matches
      console.log(`🗺️ Found ${timelineMarkers.length} timeline markers`)
    }

    // Remove timeline markers from story for quality check
    const storyWithoutMarkers = fullStory.replace(timelineRegex, "").trim()

    // Stage 2: Quality Gate with Groq GPT-OSS-120B
    console.log("🔍 Stage 2: Groq GPT-OSS-120B quality check and enhancement...")

    const result = await checkAndEnhanceStory(
      storyWithoutMarkers,
      groqApiKey, // Same API key as Stage 1!
      signal
    )

    console.log(
      `${result.passed ? "✅" : "🔧"} Quality Gate: ${result.passed ? "PASSED" : "ENHANCED"} (Score: ${result.score}/10)`
    )

    // Reconstruct story with timeline markers
    let finalStory = result.enhancedStory

    // Re-add timeline markers at the end
    if (timelineMarkers.length > 0) {
      finalStory += "\n\n" + timelineMarkers.join("\n")
    }

    console.log("🎯 Pipeline Complete: Streaming enhanced story to user...")

    // Stream the enhanced story with timeline processing
    // Split into words for smooth streaming
    const words = result.enhancedStory.split(" ")

    for (let i = 0; i < words.length; i++) {
      const token = i === words.length - 1 ? words[i] : words[i] + " "
      yield JSON.stringify({ type: "token", data: token }) + "\n"

      // Small delay for natural streaming feel
      await new Promise((resolve) => setTimeout(resolve, 30))
    }

    // Emit timeline events
    for (const marker of timelineMarkers) {
      // Extract JSON from timeline marker
      const jsonMatch = marker.match(/\{[^}]+\}/)
      if (jsonMatch) {
        try {
          const timelineData = JSON.parse(jsonMatch[0])
          yield JSON.stringify({ type: "timeline", data: timelineData }) + "\n"
          console.log(`📍 Timeline Event: ${timelineData.title} (${timelineData.year})`)
        } catch (e) {
          console.error("Failed to parse timeline marker:", marker)
        }
      }
    }

    // Emit quality metadata (for debugging/analytics)
    yield JSON.stringify({
      type: "quality_report",
      data: {
        score: result.score,
        passed: result.passed,
        enhancements: result.enhancements,
        stage1Length: fullStory.length,
        stage2Length: result.enhancedStory.length,
      },
    }) + "\n"

    // Done
    yield JSON.stringify({ type: "done", data: null }) + "\n"
    console.log("✅ Pipeline finished successfully")
  } catch (error: any) {
    console.error("❌ Pipeline error:", error)

    // On error, try to return what we have
    if (fullStory) {
      console.log("⚠️ Returning partial story due to error")

      // Stream whatever we got from Stage 1
      const processedStream = processStreamForTimeline(
        (async function* () {
          const words = fullStory.split(" ")
          for (const word of words) {
            yield JSON.stringify({ type: "token", data: word + " " }) + "\n"
          }
          yield JSON.stringify({ type: "done", data: null }) + "\n"
        })()
      )

      for await (const chunk of processedStream) {
        yield chunk
      }
    } else {
      // Send error event
      yield JSON.stringify({
        type: "error",
        data: error.message || "Pipeline failed",
      }) + "\n"
    }
  }
}
