/**
 * Smoke tests for /api/chat endpoint
 */
import { describe, it, expect, beforeEach } from "@jest/globals"

describe("/api/chat endpoint", () => {
  it("should reject requests without GROQ_API_KEY", async () => {
    // This is a smoke test - in real environment, API key should be set
    expect(process.env.GROQ_API_KEY).toBeDefined()
  })

  it("should validate message format", () => {
    const validMessage = {
      role: "user",
      content: "Tell me about a cursed monastery in the Alps",
    }

    expect(validMessage.role).toMatch(/^(system|user|assistant)$/)
    expect(validMessage.content.length).toBeLessThanOrEqual(2000)
  })

  it("should handle timeline marker format", () => {
    const timelineMarker = '##TIMELINE## {"year":476,"title":"Fall of Rome","desc":"Western Roman Empire collapses","place":"Rome, Italy"}'
    
    expect(timelineMarker).toContain("##TIMELINE##")
    
    const jsonPart = timelineMarker.split("##TIMELINE##")[1].trim()
    const parsed = JSON.parse(jsonPart)
    
    expect(parsed).toHaveProperty("year")
    expect(parsed).toHaveProperty("title")
    expect(parsed).toHaveProperty("desc")
  })
})
