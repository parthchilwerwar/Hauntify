/**
 * Core type definitions for Hauntify
 */

export interface ChatMessage {
  role: "system" | "user" | "assistant"
  content: string
  timestamp?: number
  timelineItems?: TimelineItem[]
}

export interface TimelineItem {
  year: number
  title: string
  desc: string
  place?: string
  lat?: number
  lon?: number
  weight?: number
}

export interface LocationHit {
  name: string
  lat: number
  lon: number
  country?: string
}

export interface StreamEvent {
  type: "token" | "timeline" | "location" | "error" | "done" | "quality_report"
  data: any
}

export interface QualityReport {
  score: number
  passed: boolean
  enhancements: string[]
  stage1Length?: number
  stage2Length?: number
}

export interface ChatRequest {
  messages: ChatMessage[]
  locale?: string
}

export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  timeline: TimelineItem[]
  createdAt: number
  updatedAt: number
}

export interface AudioQueueItem {
  id: string
  paragraphId: string
  audioUrl: string
  duration: number
  voiceType: "horror"
  text: string
}

export interface VoiceRequest {
  text: string
}

export interface VoiceResponse {
  audioUrl: string
  duration: number
  format: "mp3" | "webspeech"
}
