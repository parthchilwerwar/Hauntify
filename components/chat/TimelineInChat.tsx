"use client"

import type { TimelineItem } from "@/src/types"

interface TimelineInChatProps {
  items: TimelineItem[]
}

export function TimelineInChat({ items }: TimelineInChatProps) {
  if (items.length === 0) return null

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-orange-500/50 to-transparent" />
      </div>
      
      {items.map((item, index) => (
        <div key={index} className="flex gap-4 group">
          <div className="flex flex-col items-center pt-1">
            {index < items.length - 1 && (
              <div className="w-0.5 flex-1 bg-linear-to-b from-orange-500 via-orange-400 to-orange-300/20 min-h-12 mt-1" />
            )}
          </div>

          <div className="flex-2  bg-linear-to-br from-[#1A1A1A] to-[#0D0D0D] border border-orange-500/60 rounded-lg p-4  group-hover:shadow-lg group-hover:shadow-orange-500/20 transition-all duration-300 mb-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="font-mono text-sm font-bold text-orange-500 bg-orange-500/10 px-2 py-1 rounded">
                {item.year}
              </div>
              {item.place && (
                <div className="flex items-center gap-1 text-xs text-orange-400/80">
                  <span>📍</span>
                  <span>{item.place}</span>
                </div>
              )}
            </div>
            
            <h4 className="font-semibold text-base text-white mb-2 leading-tight">
              {item.title}
            </h4>
            
            <p className="text-sm text-gray-300 leading-relaxed">
              {item.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
