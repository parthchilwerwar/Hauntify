/**
 * Hook for streaming chat with Groq API and voice generation
 */
import { useState, useCallback, useRef } from "react"
import { toast } from "sonner"
import { useSessionStore } from "@/src/store/session"
import type { ChatMessage, AudioQueueItem } from "@/src/types"
import { generateSpeech } from "@/src/services/elevenLabsService"

export function useChatStream() {
  const [error, setError] = useState<string | null>(null)
  const fullResponseRef = useRef<string>("")
  
  const {
    messages,
    addMessage,
    appendToLastMessage,
    addTimelineItem,
    setStreaming,
    addAudioToQueue,
    setGeneratingVoice,
  } = useSessionStore()

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return

      // Validate message length
      if (content.length > 2000) {
        toast.error("Message too long. Please keep it under 2,000 characters.")
        return
      }

      setError(null)

      // Don't clear audio queue if currently playing - let it finish
      const { clearAudioQueue, audioQueue: currentQueue } = useSessionStore.getState()
      
      // Only clear if no audio is in queue or we want to interrupt
      if (currentQueue.length > 0) {
        console.log("⚠️ Audio queue has items, clearing for new story")
      }
      clearAudioQueue()

      // Reset full response buffer
      fullResponseRef.current = ""

      // Sanitize input (strip HTML)
      const sanitized = content.trim().replace(/<[^>]*>/g, "")

      // Add user message
      const userMessage: ChatMessage = {
        role: "user",
        content: sanitized,
        timestamp: Date.now(),
      }
      addMessage(userMessage)

      // Add empty assistant message
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: "",
        timestamp: Date.now(),
      }
      addMessage(assistantMessage)

      setStreaming(true)

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMessage],
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to send message")
        }

        if (!response.body) {
          throw new Error("No response body")
        }

        // Read stream
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ""

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split("\n")
          buffer = lines.pop() || ""

          for (const line of lines) {
            if (!line.trim()) continue

            try {
              const event = JSON.parse(line)

              switch (event.type) {
                case "token":
                  appendToLastMessage(event.data)
                  // Accumulate full response for voice generation at the end
                  fullResponseRef.current += event.data
                  break

                case "timeline":
                  addTimelineItem(event.data)
                  break

                case "error":
                  setError(event.data)
                  break

                case "done":
                  // Generate voice for the ENTIRE story (all paragraphs combined) at the end
                  if (fullResponseRef.current.trim()) {
                    generateVoiceForFullStory(fullResponseRef.current)
                  }
                  break
              }
            } catch (e) {
              console.error("Failed to parse event:", line, e)
            }
          }
        }
      } catch (err: any) {
        console.error("Chat stream error:", err)
        const errorMsg = err.message || "Failed to send message"
        setError(errorMsg)
        
        // Show user-friendly error toast
        if (errorMsg.includes("GROQ_API_KEY")) {
          toast.error("API key not configured. Please add GROQ_API_KEY to .env.local")
        } else if (errorMsg.includes("rate limit")) {
          toast.error("Rate limit exceeded. Please wait a moment and try again.")
        } else {
          toast.error(`Error: ${errorMsg}`)
        }
      } finally {
        setStreaming(false)
      }
    },
    [messages, addMessage, appendToLastMessage, addTimelineItem, setStreaming, addAudioToQueue, setGeneratingVoice]
  )

  /**
   * Generate voice for the entire story (all paragraphs) at once
   */
  const generateVoiceForFullStory = async (fullText: string) => {
    if (!fullText.trim()) return

    // Remove timeline markers from the full story before sending to voice API
    const cleanStory = fullText.replace(/##TIMELINE##[^\n]*\n?/g, "").trim()

    if (!cleanStory) {
      console.log("⚠️ Story is empty after removing timeline markers, skipping voice generation")
      return
    }

    // Remove brackets from audio cues (e.g. [whispers] → whispers, [shhhh...] → hmmm...)
    // This keeps the sound effects but makes them realistic by removing the brackets
    // Example: "The door creaked [shhhh...]" becomes "The door creaked shhhh..." (sounds like actual audio)
    const ttsText = cleanStory
      .replace(/\[([^\]]+)\]/g, "$1")  // Replace [content] with content (removes brackets)
      .replace(/\s{2,}/g, " ")         // Clean up extra spaces
      .trim()

    if (!ttsText) {
      console.log("⚠️ Story empty after removing audio cues, skipping voice generation")
      return
    }

    console.log(`🎤 Generating voice for FULL STORY:`)
    console.log(`   - Original length: ${fullText.length} chars`)
    console.log(`   - Clean story: ${cleanStory.length} chars`)
    console.log(`   - TTS text: ${ttsText.length} chars`)
    console.log(`   - Preview: "${ttsText.substring(0, 100)}..."`)

    const storyId = `story_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

    try {
      setGeneratingVoice(true)
      console.log("🎙️ Starting ElevenLabs API call...")

      // Send cleaned TTS-friendly text to the voice API (entire story at once)
      const result = await generateSpeech(ttsText)

      console.log(`✅ Voice generation complete:`)
      console.log(`   - Audio URL: ${result.audioUrl.substring(0, 50)}...`)
      console.log(`   - Duration: ${result.duration}s`)

      const audioItem: AudioQueueItem = {
        id: storyId,
        paragraphId: storyId,
        audioUrl: result.audioUrl,
        duration: result.duration,
        voiceType: "horror",
        text: cleanStory, // Store the clean story without timeline markers (display)
      }

      console.log("📥 Adding audio to queue:", audioItem.id)
      addAudioToQueue(audioItem)
    } catch (error: any) {
      console.error("❌ Voice generation failed:", error)
      toast.error(error.message || "Voice generation failed. Please check your ElevenLabs API key.")
    } finally {
      setGeneratingVoice(false)
    }
  }

  return {
    sendMessage,
    error,
    isStreaming: useSessionStore((state) => state.isStreaming),
  }
}
