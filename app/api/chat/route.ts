/**
 * POST /api/chat - 2-Stage Streaming Pipeline (All via Groq)
 * Stage 1: Groq LLaMA 3.3 70B generates story
 * Stage 2: Groq GPT-OSS-120B quality checks and enhances
 * Output: Enhanced story with guaranteed scariness
 * Uses single GROQ_API_KEY for both stages!
 */
import { NextRequest } from "next/server"
import { chatRequestSchema } from "@/src/schemas"
import { buildChatRequest } from "@/src/server/groqChat"
import { enhancedStoryPipeline } from "@/src/server/enhancedPipeline"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    // Validate API key (only need Groq API key!)
    const groqApiKey = process.env.GROQ_API_KEY

    if (!groqApiKey) {
      return new Response(
        JSON.stringify({ error: "GROQ_API_KEY not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      )
    }

    // Parse and validate request
    const body = await req.json()
    const validated = chatRequestSchema.parse(body)

    // Build Groq request
    const groqRequest = buildChatRequest(validated)

    // Create abort controller for cleanup
    const controller = new AbortController()
    req.signal.addEventListener("abort", () => controller.abort())

    // Create streaming response with 2-stage pipeline
    const stream = new ReadableStream({
      async start(streamController) {
        try {
          console.log("🚀 Starting 2-Stage Story Pipeline (All via Groq)...")

          // Run the enhanced pipeline: Groq LLaMA → Groq GPT Quality Gate → Output
          const pipelineStream = enhancedStoryPipeline(
            groqApiKey, // Same key for both stages!
            groqRequest,
            controller.signal
          )

          // Pipe enhanced story to response
          for await (const chunk of pipelineStream) {
            streamController.enqueue(new TextEncoder().encode(chunk))
          }

          streamController.close()
        } catch (error: any) {
          console.error("Pipeline error:", error)

          // Send error event
          const errorEvent = JSON.stringify({
            type: "error",
            data: error.message || "Pipeline failed",
          }) + "\n"

          streamController.enqueue(new TextEncoder().encode(errorEvent))
          streamController.close()
        }
      },
      cancel() {
        controller.abort()
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error: any) {
    console.error("Chat API error:", error)

    return new Response(
      JSON.stringify({
        error: error.message || "Invalid request",
        details: error.issues || undefined,
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
}
