---
inclusion: always
---

# Technical Stack

## Framework & Core

- **Next.js 16** with App Router and React 19
- **TypeScript** with strict mode for type safety across frontend and backend
- **Tailwind CSS v4 alpha** with custom CSS variables for black/orange/white horror theme
- **Node.js runtime** for API routes (required for streaming support)

## State Management & Data

- **Zustand** for global state management (messages, timeline, audio queue, locations)
- **localStorage** for session persistence with custom storage utilities
- **Zod** for runtime validation (chat requests, voice requests, timeline items)
- **Server-Sent Events (SSE)** for real-time streaming with NDJSON format
- **NDJSON** event types: token, timeline, error, done

## External Services

- **Groq API**: LLaMA 3.3 70B Versatile model for AI story generation with streaming
  - System prompt enforces 1-2 paragraph format with timeline markers
  - Includes sound effect tags: [whispers], [exhales], [laughs], etc.
  - Temperature: 0.8, Max tokens: 600, Top P: 0.9
- **ElevenLabs API**: Text-to-speech with Brian voice (hbB2qXyS2GMyyZIZyhAH)
  - Model: eleven_turbo_v2_5
  - Voice settings: stability 0.5, similarity_boost 0.75, style 0.6
  - Fallback to Web Speech API if key missing or quota exceeded
- **Nominatim API**: OpenStreetMap geocoding with 1 req/sec rate limiting
  - 30-day response caching
  - Coordinate validation (-90 to 90 lat, -180 to 180 lon)
- **OpenStreetMap**: Map tiles via Leaflet with custom markers and popups

## UI Components

- **shadcn/ui**: 50+ pre-built components (button, card, input, dialog, etc.)
- **Leaflet + react-leaflet**: Interactive map visualization with markers and polylines
- **Lucide React**: Icon library (Play, Pause, SkipBack, SkipForward, Volume2, etc.)
- **React Icons**: Additional icons (FaArrowTurnUp for chat input)
- **Sonner**: Toast notifications with dark theme and orange accents
- **Custom Components**:
  - AudioPlayer: Compact rounded player with gradient styling
  - TimelineInChat: Vertical timeline cards with connecting lines
  - ChatMessage: Message bubbles with inline timeline items

## Audio System

- Custom **AudioQueueManager** class using HTML5 Audio API
  - Queue management with add/play/pause/resume/seek/skip
  - Blob URL lifecycle management with proper cleanup
  - Sequential playback with auto-advance to next segment
  - Real-time progress updates without throttling
  - Error handling with automatic skip-to-next on failure
  - Volume control (0-1 range)
  - State notifications via listener pattern
- Audio generation pipeline:
  1. AI streams full story
  2. Timeline markers removed
  3. Audio cue brackets cleaned ([whispers] → whispers)
  4. Entire story sent to ElevenLabs at once
  5. MP3 blob returned and queued
  6. Duration estimated from word count
  7. Playback starts with user control

## Build & Development

### Common Commands

```bash
# Development
pnpm dev             # Start dev server on localhost:3000
pnpm build           # Build for production
pnpm start           # Start production server

# Verification
pnpm verify          # Run setup verification script

# Testing
node scripts/test-api.js       # Test API endpoints
node scripts/verify-setup.js   # Verify environment setup
```

### Environment Variables

Required:
- `GROQ_API_KEY`: Groq API key for story generation

Optional:
- `ELEVENLABS_API_KEY`: ElevenLabs API key (falls back to Web Speech API)
- `NOMINATIM_BASE`: Custom Nominatim server URL
- `MAP_TILES_URL`: Custom map tile server URL
- `MAP_ATTRIBUTION`: Custom map attribution text

## Architecture Patterns

- **Streaming-First**: All content flows through real-time SSE pipeline
  - Token-by-token AI streaming
  - Real-time timeline extraction
  - Automatic voice generation on completion
- **Client Components**: All UI components use "use client" directive
- **API Routes**: Backend services in `/api` directory
  - `/api/chat`: Groq streaming with 2-stage pipeline
  - `/api/voice`: ElevenLabs TTS synthesis
  - `/api/voice-stream`: Streaming voice synthesis
  - `/api/geocode`: Nominatim geocoding with caching
- **Custom Hooks**: Encapsulate complex logic
  - `useChatStream`: Manages streaming, voice generation, timeline
  - `useAudioPlayer`: Controls AudioQueueManager and player state
  - `useMapSync`: Handles geocoding and map updates
- **Service Layer**: 
  - Server: `groqChat`, `enhancedPipeline`, `timeline`, `geocode`
  - Client: `elevenLabsService`, `audioQueue`, `paragraphDetector`
- **Error Handling**: Centralized ErrorHandler with severity levels
- **Validation**: Coordinate validation, input sanitization, schema validation
- **Persistence**: localStorage with session management utilities
