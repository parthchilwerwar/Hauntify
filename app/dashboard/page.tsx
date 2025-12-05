"use client"

import { useState } from "react"
import { ChatInterface } from "@/components/chat-interface"
import { MapPane } from "@/components/map/MapPane"

export default function AppPage() {
  const [activeTab, setActiveTab] = useState("chat")

  return (
    <>
      {/* Desktop: Split-screen layout (1024px and up) */}
      <div className="hidden lg:flex w-screen h-screen bg-black">
        <div className="w-3/5 h-full border-r border-orange-500/20 overflow-hidden">
          <MapPane />
        </div>

        <div className="w-2/5 h-full overflow-hidden">
          <ChatInterface />
        </div>
      </div>

      {/* Tablet: Different split ratio (768px to 1023px) */}
      <div className="hidden md:flex lg:hidden w-screen h-screen bg-black">
        <div className="w-1/2 h-full border-r border-orange-500/20 overflow-hidden">
          <MapPane />
        </div>

        <div className="w-1/2 h-full overflow-hidden">
          <ChatInterface />
        </div>
      </div>

      {/* Mobile: Tabbed layout (below 768px) - Keep both mounted */}
      <div className="md:hidden w-screen h-screen bg-black flex flex-col">
        {/* Tab switcher with enhanced styling */}
        <div className="w-full bg-linear-to-b from-black to-zinc-950 border-b-2 border-orange-500/30 shadow-lg shadow-orange-500/20 shrink-0">
          <div className="flex gap-1 p-2">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 py-3.5 px-3.5 font-bold text-sm uppercase tracking-wider  transition-all duration-300 relative overflow-hidden ${
                activeTab === "chat"
                  ? "text-white "
                  : "text-orange-500/60 hover:text-orange-500/90 hover:bg-orange-500/5"
              }`}
            >
              {/* Active gradient background */}
              {activeTab === "chat" && (
                <div className="absolute inset-0 bg-linear-to-br from-orange-600 via-orange-500 to-red-600 animate-gradient" />
              )}
              
              {/* Icon and text */}
              <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                Chat
              </span>
            </button>
            
            <button
              onClick={() => setActiveTab("map")}
              className={`flex-1 py-3.5 px-3.5 font-bold text-sm uppercase tracking-wider  transition-all duration-300 relative overflow-hidden ${
                activeTab === "map"
                  ? "text-white  "
                  : "text-orange-500/60 hover:text-orange-500/90 hover:bg-orange-500/5"
              }`}
            >
              {/* Active gradient background */}
              {activeTab === "map" && (
                <div className="absolute inset-0 bg-linear-to-br from-orange-600 via-orange-500 to-red-600 animate-gradient" />
              )}
              
              {/* Icon and text */}
              <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                Map
              </span>
            </button>
          </div>
        </div>

        {/* Keep both components mounted, just hide with CSS */}
        <div className={`flex-1 overflow-hidden ${activeTab === "chat" ? "block" : "hidden"}`}>
          <ChatInterface />
        </div>

        <div className={`flex-1 overflow-hidden ${activeTab === "map" ? "block" : "hidden"}`}>
          <MapPane />
        </div>
      </div>
    </>
  )
}
