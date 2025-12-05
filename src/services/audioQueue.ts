/**
 * Audio queue management for continuous playback
 */

export interface AudioQueueItem {
  id: string
  paragraphId: string
  audioUrl: string
  duration: number
  voiceType: string
  text: string
}

export interface AudioPlayerState {
  isPlaying: boolean
  currentTime: number
  duration: number
  currentIndex: number
  volume: number
}

export class AudioQueueManager {
  private queue: AudioQueueItem[] = []
  private currentAudio: HTMLAudioElement | null = null
  private currentIndex: number = -1
  private listeners: Set<(state: Partial<AudioPlayerState>) => void> = new Set()

  constructor() {
    if (typeof window !== "undefined") {
      // Initialize audio element
      this.currentAudio = new Audio()
      this.currentAudio.addEventListener("ended", () => this.playNext())
      this.currentAudio.addEventListener("timeupdate", () => this.notifyTimeUpdate())
      this.currentAudio.addEventListener("error", (e) => {
        // Only handle errors when we actually have audio loaded with a valid blob URL
        const audio = e.target as HTMLAudioElement
        if (audio && audio.src && audio.src.startsWith('blob:') && this.queue.length > 0) {
          this.handleError(e)
        }
        // Silently ignore errors when there's no real audio source
      })
    }
  }

  /**
   * Add audio to queue
   */
  addToQueue(item: AudioQueueItem): void {
    this.queue.push(item)
    console.log(`📥 Added audio to queue: ${item.id} (queue size: ${this.queue.length})`)
    
    // Update duration but DON'T auto-play
    // Let the user control playback with the play button
    this.notifyListeners({ 
      duration: item.duration,
      currentIndex: this.queue.length === 1 ? 0 : this.currentIndex
    })
  }

  /**
   * Play audio at specific index
   */
  play(index?: number): void {
    if (!this.currentAudio) return

    if (index !== undefined) {
      this.currentIndex = index
    }

    if (this.currentIndex < 0 || this.currentIndex >= this.queue.length) {
      console.log("⚠️ Cannot play: index out of bounds", { currentIndex: this.currentIndex, queueLength: this.queue.length })
      return
    }

    const item = this.queue[this.currentIndex]
    if (!item) {
      console.log("⚠️ Cannot play: no item at index", this.currentIndex)
      return
    }

    console.log(`🎵 Playing audio: ${item.id} (${this.currentIndex + 1}/${this.queue.length})`)

    // Stop current audio if playing
    if (this.currentAudio.src && !this.currentAudio.paused) {
      console.log("⏸️ Stopping current audio before playing new one")
      this.currentAudio.pause()
      this.currentAudio.currentTime = 0
    }

    // Load and play
    if (item.audioUrl && item.audioUrl.startsWith("blob:")) {
      this.currentAudio.src = item.audioUrl
      
      // Use metadata duration if available, fallback to item duration estimate
      this.currentAudio.onloadedmetadata = () => {
        console.log(`📊 Audio metadata loaded: ${this.currentAudio!.duration}s`)
        this.notifyListeners({
          duration: this.currentAudio!.duration || item.duration,
        })
      }
      
      // Add error handler before play
      this.currentAudio.onerror = (e) => {
        this.handleError(e)
      }
      
      this.currentAudio.play().catch((error: any) => {
        const errorMsg = error?.message || String(error)
        console.error(`❌ Audio play error for ${item.id}:`, errorMsg)
        this.handleError(errorMsg, { playError: true, originalError: error })
      })
    } else {
      console.error(`❌ Invalid or missing audio URL for ${item.id}:`, {
        audioUrl: item.audioUrl,
        isBlob: item.audioUrl?.startsWith("blob:"),
      })
      this.handleError(`Invalid audio URL for ${item.id}`, { urlInvalid: true })
      // Skip to next item if current URL is invalid
      this.playNext()
      return
    }

    this.notifyListeners({
      isPlaying: true,
      currentIndex: this.currentIndex,
      duration: item.duration,
      currentTime: 0,
    })
  }

  /**
   * Pause playback
   */
  pause(): void {
    if (!this.currentAudio) return
    this.currentAudio.pause()
    this.notifyListeners({ isPlaying: false })
  }

  /**
   * Resume playback
   */
  resume(): void {
    if (!this.currentAudio) return
    
    // If no audio loaded at all, start from beginning of queue
    if (!this.currentAudio.src && this.queue.length > 0) {
      console.log("🎵 No audio loaded, starting from beginning")
      this.play(0)
      return
    }
    
    // If audio has ended, restart from beginning
    if (this.currentAudio.ended && this.queue.length > 0) {
      console.log("🔄 Audio ended, restarting from beginning")
      this.currentAudio.currentTime = 0
    }
    
    console.log("▶️ Resuming audio playback from:", this.currentAudio.currentTime)
    this.currentAudio.play().catch((error) => {
      console.error("Audio resume error:", error)
      this.handleError(error)
    })
    this.notifyListeners({ isPlaying: true })
  }

  /**
   * Play next paragraph
   */
  playNext(): void {
    if (this.currentIndex < this.queue.length - 1) {
      this.play(this.currentIndex + 1)
    } else {
      this.notifyListeners({ isPlaying: false })
    }
  }

  /**
   * Play previous paragraph
   */
  playPrevious(): void {
    if (this.currentIndex > 0) {
      this.play(this.currentIndex - 1)
    }
  }

  /**
   * Seek to specific time in current audio
   */
  seek(time: number): void {
    if (!this.currentAudio) return
    this.currentAudio.currentTime = time
    this.notifyListeners({ currentTime: time })
  }

  /**
   * Set volume (0-1)
   */
  setVolume(volume: number): void {
    if (!this.currentAudio) return
    this.currentAudio.volume = Math.max(0, Math.min(1, volume))
    this.notifyListeners({ volume: this.currentAudio.volume })
  }

  /**
   * Get current playback state
   */
  getState(): AudioPlayerState {
    return {
      isPlaying: this.currentAudio ? !this.currentAudio.paused : false,
      currentTime: this.currentAudio?.currentTime || 0,
      duration: this.currentAudio?.duration || 0,
      currentIndex: this.currentIndex,
      volume: this.currentAudio?.volume || 1,
    }
  }

  /**
   * Get queue
   */
  getQueue(): AudioQueueItem[] {
    return [...this.queue]
  }

  /**
   * Clear queue
   */
  clearQueue(): void {
    console.log("🧹 Clearing audio queue")
    
    // Stop and cleanup current audio
    if (this.currentAudio) {
      this.currentAudio.pause()
      this.currentAudio.currentTime = 0
      
      // Revoke old blob URLs to prevent memory leaks
      if (this.currentAudio.src && this.currentAudio.src.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(this.currentAudio.src)
        } catch (e) {
          console.error("Failed to revoke blob URL:", e)
        }
      }
      
      this.currentAudio.src = ""
    }
    
    // Revoke all blob URLs in queue
    this.queue.forEach((item) => {
      if (item.audioUrl && item.audioUrl.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(item.audioUrl)
        } catch (e) {
          console.error("Failed to revoke blob URL:", e)
        }
      }
    })
    
    this.queue = []
    this.currentIndex = -1
    
    this.notifyListeners({
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      currentIndex: -1,
    })
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: (state: Partial<AudioPlayerState>) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  /**
   * Get total duration of all segments
   */
  private getTotalDuration(): number {
    return this.queue.reduce((sum, item) => sum + item.duration, 0)
  }

  /**
   * Calculate cumulative time offset for a segment
   * Used for accurate timeline positioning across segments
   */
  private getSegmentOffset(index: number): number {
    let offset = 0
    for (let i = 0; i < index && i < this.queue.length; i++) {
      offset += this.queue[i].duration
    }
    return offset
  }

  /**
   * Get overall playback progress across all segments
   * Returns total time played (accounting for completed segments + current position)
   */
  private getOverallProgress(): number {
    const segmentOffset = this.getSegmentOffset(this.currentIndex)
    const currentTime = this.currentAudio?.currentTime || 0
    return segmentOffset + currentTime
  }

  /**
   * Get overall duration of all queued segments
   */
  private getOverallDuration(): number {
    return this.getTotalDuration()
  }

  /**
   * Notify listeners of state change
   */
  private notifyListeners(state: Partial<AudioPlayerState>): void {
    this.listeners.forEach((listener) => listener(state))
  }

  /**
   * Notify time update
   */
  private notifyTimeUpdate(): void {
    if (!this.currentAudio) return
    // Real-time update without throttling for smooth progress bar sync
    this.notifyListeners({
      currentTime: this.currentAudio.currentTime,
      duration: this.currentAudio.duration || this.queue[this.currentIndex]?.duration || 0,
    })
  }

  private lastNotifiedTime: number = 0

  /**
   * Handle audio error with detailed logging
   */
  private handleError(error: Event | string, errorDetails?: any): void {
    let audioElement: HTMLAudioElement | null = null
    let errorCode: number | undefined
    let errorDescription: string = 'Unknown error'
    
    // Support both Event objects and string error messages
    if (typeof error === 'string') {
      errorDescription = error
      audioElement = this.currentAudio
    } else {
      audioElement = error.target as HTMLAudioElement | null
      errorCode = audioElement?.error?.code
      const errorMessage = audioElement?.error?.message || 'Unknown error'
      
      const errorMap: { [key: number]: string } = {
        1: 'MEDIA_ERR_ABORTED - Media playback was aborted by user',
        2: 'MEDIA_ERR_NETWORK - Network error, check URL/connectivity',
        3: 'MEDIA_ERR_DECODE - Audio decode error, format may be unsupported',
        4: 'MEDIA_ERR_SRC_NOT_SUPPORTED - Media source/format not supported',
      }
      
      errorDescription = errorCode ? errorMap[errorCode] : errorMessage
    }
    
    const currentItem = this.queue[this.currentIndex]
    
    console.error(`❌ Audio playback error in ${currentItem?.id || 'unknown'}:`, {
      code: errorCode,
      message: errorDescription,
      url: audioElement?.src || 'no URL',
      urlType: audioElement?.src?.startsWith('blob:') ? 'blob' : 'other',
      currentTime: audioElement?.currentTime || 0,
      itemDuration: currentItem?.duration || 0,
      queueIndex: this.currentIndex,
      queueLength: this.queue.length,
      readyState: audioElement?.readyState || 'unknown',
      networkState: audioElement?.networkState || 'unknown',
      ...errorDetails,
    })
    
    this.notifyListeners({ isPlaying: false })
    
    // Try to skip to next item on error
    if (this.currentIndex < this.queue.length - 1) {
      console.log('⚠️ Skipping to next audio item due to playback error...')
      this.playNext()
    } else {
      console.warn('⚠️ No more items in queue, stopping playback')
    }
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.pause()
    this.listeners.clear()
    if (this.currentAudio) {
      this.currentAudio.src = ""
      this.currentAudio = null
    }
  }
}
