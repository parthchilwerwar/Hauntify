/**
 * Audio Player Component - Compact, centered at bottom of map
 * Redesigned: small width, curved edges, gradient styling, timeline sync
 */
"use client"

import { useAudioPlayer } from "@/src/hooks/useAudioPlayer"
import { useSessionStore } from "@/src/store/session"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react"
import { useState } from "react"

export function AudioPlayer() {
  const { playerState, togglePlayPause, playNext, playPrevious, seek, setVolume, hasAudio } =
    useAudioPlayer()
  const isGeneratingVoice = useSessionStore((state) => state.isGeneratingVoice)
  const [isMuted, setIsMuted] = useState(false)

  if (!hasAudio && !isGeneratingVoice) {
    return null
  }

  const formatTime = (seconds: number): string => {
    if (!isFinite(seconds)) return "00:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    seek(time)
  }

  const handleToggleMute = () => {
    if (isMuted) {
      setVolume(1) // Unmute to full volume
    } else {
      setVolume(0) // Mute
    }
    setIsMuted(!isMuted)
  }

  // Calculate progress percentage for timeline visualization
  const progressPercent = playerState.duration 
    ? (playerState.currentTime / playerState.duration) * 100 
    : 0

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 md:left-[25rem] md:transform-none z-[1000]">
      {/* Compact Player Container */}
      <div className="relative w-80 px-4 py-3 rounded-full bg-linear-to-r from-orange-600/20 via-black/80 to-orange-600/20 border border-orange-500/40 backdrop-blur-lg shadow-2xl shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-300">
        
        {/* Generating indicator - subtle */}
        {isGeneratingVoice && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-orange-400 font-medium flex items-center gap-1.5 whitespace-nowrap">
            Generating...
          </div>
        )}

        {/* Main controls row */}
        <div className="flex items-center justify-between gap-2">
          
          {/* Play/Pause button */}
          <button
            onClick={togglePlayPause}
            disabled={!hasAudio}
            className="w-10 h-10 rounded-full bg-linear-to-br from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-lg shadow-orange-500/40 hover:shadow-orange-500/60 shrink-0"
          >
            {playerState.isPlaying ? (
              <Pause size={20} className="text-black fill-black" />
            ) : (
              <Play size={20} className="text-black fill-black ml-0.5" />
            )}
          </button>

          {/* Timeline with time labels */}
          <div className="flex-1 flex flex-col gap-1.5 min-w-0">
            {/* Timeline bar */}
            <div className="relative h-1 bg-gray-700/50 rounded-full overflow-hidden group mt-5">
              <input
              type="range"
              min="0"
              max={playerState.duration || 100}
              value={playerState.currentTime || 0}
              onChange={handleSeek}
              disabled={!hasAudio}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed  z-10"
              />
              {/* Filled progress bar */}
              <div
              className="absolute top-0 left-0 h-full bg-linear-to-r from-orange-500 via-orange-400 to-orange-500 rounded-full transition-all duration-100"
              style={{ width: `${progressPercent}%` }}
              />
              {/* Playhead indicator */}
              <div
              className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-orange-300 rounded-full shadow-lg shadow-orange-500/50 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `${progressPercent}%`, transform: 'translate(-50%, -50%)' }}
              />
            </div>

            {/* Time display */}
            <div className="flex justify-between text-xs font-mono text-orange-300/80">
              <span className="text-orange-400 font-medium">{formatTime(playerState.currentTime)}</span>
              <span className="text-orange-300/60">{formatTime(playerState.duration)}</span>
            </div>
          </div>

          {/* Mute/Unmute button */}
          <button
            onClick={handleToggleMute}
            disabled={!hasAudio}
            className="w-8 h-8 rounded-full hover:bg-orange-500/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX size={16} className="text-orange-400" />
            ) : (
              <Volume2 size={16} className="text-orange-400" />
            )}
          </button>
        </div>

        {/* Decorative glow effect */}
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none bg-linear-to-r from-orange-600 to-orange-400 blur-xl" />
      </div>
    </div>
  )
}
