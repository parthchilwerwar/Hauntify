"use client"

import { useEffect, useRef } from "react"
import { useSessionStore } from "@/src/store/session"
import { ChatMessage } from "./ChatMessage"

export function ChatWindow() {
  const messages = useSessionStore((state) => state.messages)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <ChatMessage key={index} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}
