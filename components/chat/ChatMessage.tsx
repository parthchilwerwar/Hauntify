"use client"

import type { ChatMessage as ChatMessageType } from "@/src/types"
import { TimelineInChat } from "./TimelineInChat"

interface ChatMessageProps {
  message: ChatMessageType
}

export function ChatMessage({ message }: ChatMessageProps) {
  if (message.role === "system") return null

  const isUser = message.role === "user"
  
  // Remove ##TIMELINE## markers from displayed content
  const cleanContent = message.content.replace(/##TIMELINE##[^\n]*\n?/g, "").trim()

  // Use timeline items from the message itself
  const timelineItems = message.timelineItems || []

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg ${
          isUser ? "bg-zinc-900/80 border border-zinc-800 text-white" : "bg-zinc-900/50 border border-orange-500/20 text-white"
        }`}
      >
        <p className="text-sm whitespace-pre-wrap leading-relaxed">{cleanContent}</p>
        {!isUser && timelineItems.length > 0 && <TimelineInChat items={timelineItems} />}
      </div>
    </div>
  )
}
