/**
 * Global state management for chat session and map sync
 * Using Zustand for simplicity
 */
import { create } from "zustand"
import type { ChatMessage, TimelineItem, ChatSession, AudioQueueItem } from "@/src/types"
import { createSession, saveSession, updateSession } from "@/src/lib/storage"

interface SessionState {
  // Current session
  currentSession: ChatSession | null
  messages: ChatMessage[]
  timeline: TimelineItem[]
  isStreaming: boolean

  // Map sync
  activeLocation: TimelineItem | null
  locationHistory: TimelineItem[]

  // Audio state
  audioQueue: AudioQueueItem[]
  isGeneratingVoice: boolean

  // Actions
  startNewSession: () => void
  loadSession: (session: ChatSession) => void
  addMessage: (message: ChatMessage) => void
  appendToLastMessage: (content: string) => void
  addTimelineItem: (item: TimelineItem) => void
  setActiveLocation: (item: TimelineItem | null) => void
  setStreaming: (streaming: boolean) => void
  persistSession: () => void
  addAudioToQueue: (item: AudioQueueItem) => void
  setGeneratingVoice: (generating: boolean) => void
  clearAudioQueue: () => void
}

export const useSessionStore = create<SessionState>((set, get) => ({
  currentSession: null,
  messages: [],
  timeline: [],
  isStreaming: false,
  activeLocation: null,
  locationHistory: [],
  audioQueue: [],
  isGeneratingVoice: false,

  startNewSession: () => {
    const session = createSession()
    set({
      currentSession: session,
      messages: [],
      timeline: [],
      activeLocation: null,
      locationHistory: [],
      isStreaming: false,
    })
  },

  loadSession: (session) => {
    set({
      currentSession: session,
      messages: session.messages,
      timeline: session.timeline,
      activeLocation: null,
      locationHistory: session.timeline.filter((t) => t.lat && t.lon),
      isStreaming: false,
    })
  },

  addMessage: (message) => {
    const { messages, currentSession } = get()
    const newMessages = [...messages, message]
    set({ messages: newMessages })

    if (currentSession) {
      updateSession(currentSession.id, newMessages, get().timeline)
    }
  },

  appendToLastMessage: (content) => {
    const { messages } = get()
    if (messages.length === 0) return

    const lastMessage = messages[messages.length - 1]
    if (lastMessage.role !== "assistant") return

    const newMessages = [
      ...messages.slice(0, -1),
      { ...lastMessage, content: lastMessage.content + content },
    ]

    set({ messages: newMessages })
  },

  addTimelineItem: (item) => {
    const { timeline, currentSession, locationHistory, messages } = get()

    console.log(`📅 Adding timeline item: ${item.title} (${item.year}) at ${item.place || 'unknown location'}`)

    // Deduplicate
    const exists = timeline.some((t) => t.year === item.year && t.title === item.title)
    if (exists) {
      console.log(`⚠️ Timeline item already exists: ${item.title}`)
      return
    }

    const newTimeline = [...timeline, item].sort((a, b) => a.year - b.year)
    
    // Only add to location history if it has coordinates
    const newHistory = item.lat && item.lon 
      ? [...locationHistory, item] 
      : locationHistory

    console.log(`📍 Timeline item has coordinates: ${item.lat && item.lon ? 'YES' : 'NO (will geocode)'}`)

    // Add timeline item to the last assistant message
    const lastMessageIndex = messages.length - 1
    if (lastMessageIndex >= 0 && messages[lastMessageIndex].role === "assistant") {
      const lastMessage = messages[lastMessageIndex]
      const updatedMessages = [...messages]
      updatedMessages[lastMessageIndex] = {
        ...lastMessage,
        timelineItems: [...(lastMessage.timelineItems || []), item],
      }
      
      set({
        messages: updatedMessages,
        timeline: newTimeline,
        locationHistory: newHistory,
        activeLocation: item,
      })
    } else {
      set({
        timeline: newTimeline,
        locationHistory: newHistory,
        activeLocation: item,
      })
    }

    if (currentSession) {
      updateSession(currentSession.id, get().messages, newTimeline)
    }
  },

  setActiveLocation: (item) => {
    set({ activeLocation: item })
  },

  setStreaming: (streaming) => {
    set({ isStreaming: streaming })
  },

  persistSession: () => {
    const { currentSession, messages, timeline } = get()
    if (currentSession) {
      updateSession(currentSession.id, messages, timeline)
    }
  },

  addAudioToQueue: (item) => {
    const { audioQueue } = get()
    // Deduplicate by ID
    const exists = audioQueue.some((a) => a.id === item.id)
    if (exists) return

    set({ audioQueue: [...audioQueue, item] })
  },

  setGeneratingVoice: (generating) => {
    set({ isGeneratingVoice: generating })
  },

  clearAudioQueue: () => {
    set({ audioQueue: [] })
  },
}))
