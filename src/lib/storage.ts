/**
 * LocalStorage persistence for chat sessions
 */
import type { ChatSession, ChatMessage, TimelineItem } from "@/src/types"

const STORAGE_KEY = "spectral_voice_sessions"
const MAX_SESSIONS = 50

/**
 * Get all sessions from localStorage
 */
export function getSessions(): ChatSession[] {
  if (typeof window === "undefined") return []

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []

    const sessions = JSON.parse(data)
    return Array.isArray(sessions) ? sessions : []
  } catch (error) {
    console.error("Failed to load sessions:", error)
    return []
  }
}

/**
 * Save a session to localStorage
 */
export function saveSession(session: ChatSession): void {
  if (typeof window === "undefined") return

  try {
    const sessions = getSessions()
    const index = sessions.findIndex((s) => s.id === session.id)

    if (index !== -1) {
      sessions[index] = session
    } else {
      sessions.unshift(session)
    }

    // Keep only recent sessions
    const trimmed = sessions.slice(0, MAX_SESSIONS)

    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  } catch (error) {
    console.error("Failed to save session:", error)
  }
}

/**
 * Get a specific session by ID
 */
export function getSession(id: string): ChatSession | null {
  const sessions = getSessions()
  return sessions.find((s) => s.id === id) || null
}

/**
 * Delete a session
 */
export function deleteSession(id: string): void {
  if (typeof window === "undefined") return

  try {
    const sessions = getSessions().filter((s) => s.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
  } catch (error) {
    console.error("Failed to delete session:", error)
  }
}

/**
 * Create a new session
 */
export function createSession(title?: string): ChatSession {
  return {
    id: `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    title: title || "New Conversation",
    messages: [],
    timeline: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}

/**
 * Update session with new messages and timeline
 */
export function updateSession(
  id: string,
  messages: ChatMessage[],
  timeline: TimelineItem[]
): void {
  const session = getSession(id)
  if (!session) return

  session.messages = messages
  session.timeline = timeline
  session.updatedAt = Date.now()

  // Auto-generate title from first user message
  if (session.title === "New Conversation" && messages.length > 0) {
    const firstUser = messages.find((m) => m.role === "user")
    if (firstUser) {
      session.title = firstUser.content.slice(0, 50) + (firstUser.content.length > 50 ? "..." : "")
    }
  }

  saveSession(session)
}
