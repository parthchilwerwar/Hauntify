/**
 * Zod validation schemas for API requests and responses
 */
import { z } from "zod"

export const chatMessageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: z.string().max(2000, "Message too long"),
  timestamp: z.number().optional(),
})

export const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(50),
})

export const timelineItemSchema = z.object({
  year: z.number().int().min(-10000).max(3000),
  title: z.string().min(1).max(200),
  desc: z.string().min(1).max(500),
  place: z.string().max(200).optional(),
  lat: z.number().min(-90).max(90).optional(),
  lon: z.number().min(-180).max(180).optional(),
  weight: z.number().min(0).max(1).optional(),
})

export const geocodeQuerySchema = z.object({
  q: z.string().min(1).max(200),
})

export const locationHitSchema = z.object({
  name: z.string(),
  lat: z.number(),
  lon: z.number(),
  country: z.string().optional(),
})

export const voiceRequestSchema = z.object({
  text: z.string().min(1).max(5000),
})

export const audioQueueItemSchema = z.object({
  id: z.string(),
  paragraphId: z.string(),
  audioUrl: z.string(),
  duration: z.number(),
  voiceType: z.string(),
  text: z.string(),
})
