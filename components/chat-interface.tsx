"use client"

import { useEffect } from "react"
import { useSessionStore } from "@/src/store/session"
import { ChatWindow } from "./chat/ChatWindow"
import { ChatInput } from "./chat/ChatInput"

export function ChatInterface() {
  const startNewSession = useSessionStore((state) => state.startNewSession)
  const isStreaming = useSessionStore((state) => state.isStreaming)

  useEffect(() => {
    startNewSession()
  }, [startNewSession])

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden">
      {/* Animated background similar to landing page */}
      <div className="absolute inset-0 backdrop-blur-xs" />
      <div className="absolute inset-0 bg-linear-to-b from-orange-500/5 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,140,0,0.08),transparent_50%)]" />
      
      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col">
        <div className="shrink-0 p-6 border-b border-orange-500/30 bg-transparent backdrop-blur-xs">
          <h2 className="text-3xl font-bold bg-linear-to-b from-white via-orange-300 to-orange-600 bg-clip-text text-transparent text-center flex items-center justify-center gap-2">
            Hauntify
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          <ChatWindow />
        </div>

        {isStreaming && (
          <div className="shrink-0 px-4 pb-3">
            <div className="flex gap-1.5 justify-center">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse delay-100" />
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse delay-200" />
            </div>
          </div>
        )}

        <div className="shrink-0">
          <ChatInput />
        </div>
      </div>
    </div>
  )}
