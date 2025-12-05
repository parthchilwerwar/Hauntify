"use client"

import { useState } from "react"
import { Send, ArrowUp } from "lucide-react"
import { useChatStream } from "@/src/hooks/useChatStream"
import { useSessionStore } from "@/src/store/session"
import { detectLanguage } from "@/src/lib/languageSupport"

export function ChatInput() {
  const [input, setInput] = useState("")
  const { sendMessage, isStreaming } = useChatStream()
  const handleSend = () => {
    if (!input.trim() || isStreaming) return
    
    // Auto-detect language from user input
    const detectedLang = detectLanguage(input)
    console.log(`🌍 Auto-detected language: ${detectedLang}`)
    
    sendMessage(input)
    setInput("")
  }

  const charCount = input.length
  const isOverLimit = charCount > 2000

  return (
    <div className="shrink-0 p-4 border-t border-orange-500/20 bg-black">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !isOverLimit && handleSend()}
            placeholder="Tell me a story about... (e.g., a haunted lighthouse, cursed artifact, forbidden ritual)"
            disabled={isStreaming}
            className="w-full bg-zinc-900/80 text-white border border-orange-500/40 rounded-lg px-4 py-3 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:opacity-50 transition-all"
          />
          {charCount > 1800 && (
            <div className={`absolute -top-6 right-0 text-xs ${isOverLimit ? 'text-red-500' : 'text-gray-400'}`}>
              {charCount}/2000
            </div>
          )}
        </div>
        <button
          onClick={handleSend}
          disabled={isStreaming || !input.trim() || isOverLimit}
          className="bg-linear-to-r from-orange-600 to-orange-500 text-white px-5 py-3 rounded-lg font-semibold hover:from-orange-500 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 flex items-center gap-2"
        >
          <ArrowUp size={18} />
        </button>
      </div>
    </div>
  )
}
