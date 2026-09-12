/**
 * Smoke tests for /api/chat endpoint
 */
import { NextRequest } from "next/server"
import { POST } from "@/app/api/chat/route"

describe("/api/chat endpoint", () => {
  it("should reject requests without GROQ_API_KEY", async () => {
    const originalApiKey = process.env.GROQ_API_KEY
    const fetchSpy = jest.spyOn(global, "fetch").mockRejectedValue(new Error("Unexpected external request"))
    delete process.env.GROQ_API_KEY

    try {
      const response = await POST(new NextRequest("http://localhost/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: [{ role: "user", content: "Hello" }] }),
      }))

      expect(response.status).toBe(500)
      await expect(response.json()).resolves.toEqual({ error: "GROQ_API_KEY not configured" })
      expect(fetchSpy).not.toHaveBeenCalled()
    } finally {
      fetchSpy.mockRestore()
      if (originalApiKey === undefined) delete process.env.GROQ_API_KEY
      else process.env.GROQ_API_KEY = originalApiKey
    }
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
