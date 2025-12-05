/**
 * Hook for managing audio playback with queue
 */
import { useEffect, useState, useCallback, useRef } from "react"
import { AudioQueueManager, type AudioPlayerState } from "@/src/services/audioQueue"
import { useSessionStore } from "@/src/store/session"

export function useAudioPlayer() {
  const queueManagerRef = useRef<AudioQueueManager | null>(null)
  const [playerState, setPlayerState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    currentIndex: -1,
    volume: 1,
  })

  const audioQueue = useSessionStore((state) => state.audioQueue)

  // Initialize queue manager
  useEffect(() => {
    if (typeof window === "undefined") return

    queueManagerRef.current = new AudioQueueManager()

    const unsubscribe = queueManagerRef.current.subscribe((state) => {
      // Use callback form to avoid triggering re-renders during notification
      setPlayerState((prev) => {
        // Only update if values actually changed
        const hasChanges = Object.keys(state).some(
          (key) => state[key as keyof AudioPlayerState] !== prev[key as keyof AudioPlayerState]
        )
        return hasChanges ? { ...prev, ...state } : prev
      })
    })

    return () => {
      unsubscribe()
      queueManagerRef.current?.destroy()
    }
  }, [])

  // Sync audio queue from store
  useEffect(() => {
    if (!queueManagerRef.current) return

    const currentQueue = queueManagerRef.current.getQueue()
    
    // If store queue is empty but manager has items, clear the manager
    if (audioQueue.length === 0 && currentQueue.length > 0) {
      queueManagerRef.current.clearQueue()
      return
    }

    // Add new items from store to manager
    const newItems = audioQueue.filter(
      (item) => !currentQueue.some((q) => q.id === item.id)
    )

    newItems.forEach((item) => {
      console.log(" Adding new audio to queue manager:", item.id)
      queueManagerRef.current?.addToQueue(item)
    })

    // When first audio is added, set index to 0 but don't play yet
    if (newItems.length > 0 && currentQueue.length === 0) {
      console.log("🎵 First audio added - ready to play")
      // Update state to show we're ready to play
      setPlayerState((prev) => ({
        ...prev,
        currentIndex: 0,
        duration: newItems[0].duration,
        isPlaying: false,
        currentTime: 0,
      }))
    }
  }, [audioQueue])

  const play = useCallback((index?: number) => {
    queueManagerRef.current?.play(index)
  }, [])

  const pause = useCallback(() => {
    queueManagerRef.current?.pause()
  }, [])

  const resume = useCallback(() => {
    queueManagerRef.current?.resume()
  }, [])

  const togglePlayPause = useCallback(() => {
    if (!queueManagerRef.current) return
    
    const state = queueManagerRef.current.getState()
    const audioElement = (queueManagerRef.current as any).currentAudio as HTMLAudioElement | null
    
    console.log("🎛️ Toggle play/pause:", { 
      isPlaying: state.isPlaying, 
      currentIndex: state.currentIndex,
      hasAudio: audioQueue.length > 0,
      hasSrc: !!audioElement?.src,
      currentTime: audioElement?.currentTime || 0
    })
    
    if (state.isPlaying) {
      console.log("⏸️ Pausing audio")
      pause()
    } else {
      // Only start from beginning if never played before (no src loaded)
      if (!audioElement?.src && state.currentIndex === -1) {
        console.log("▶️ Starting playback from index 0 (first time)")
        play(0)
      } else {
        console.log("▶️ Resuming playback from current position")
        resume()
      }
    }
  }, [audioQueue.length, pause, play, resume])

  const playNext = useCallback(() => {
    queueManagerRef.current?.playNext()
  }, [])

  const playPrevious = useCallback(() => {
    queueManagerRef.current?.playPrevious()
  }, [])

  const seek = useCallback((time: number) => {
    queueManagerRef.current?.seek(time)
  }, [])

  const setVolume = useCallback((volume: number) => {
    queueManagerRef.current?.setVolume(volume)
  }, [])

  const clearQueue = useCallback(() => {
    queueManagerRef.current?.clearQueue()
  }, [])

  return {
    playerState,
    play,
    pause,
    resume,
    togglePlayPause,
    playNext,
    playPrevious,
    seek,
    setVolume,
    clearQueue,
    hasAudio: audioQueue.length > 0,
  }
}
