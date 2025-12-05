# Design Document

## Overview

Hauntify is a full-stack Next.js 15+ application that delivers immersive horror storytelling through synchronized multi-modal content streaming. The system orchestrates AI-generated narratives, voice narration, timeline extraction, and map visualization in real-time, creating a cinematic experience where text, audio, and visual elements update simultaneously.

The application follows a streaming-first architecture where content flows through multiple processing stages concurrently. As the AI generates story text token-by-token, the system simultaneously extracts timeline events, geocodes locations, and prepares audio narration—all while maintaining synchronization across the split-screen interface.

**Key Design Principles:**
- **Streaming-First**: All content flows through real-time Server-Sent Events (SSE) pipeline
- **Concurrent Processing**: Text display, audio generation, timeline extraction, and geocoding happen in parallel
- **Graceful Degradation**: Each component can fail independently without breaking the entire experience
- **Session Persistence**: Full state preservation across page reloads using localStorage
- **Cinematic Aesthetic**: Consistent horror theme (black/orange/white) across all UI components

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (Browser)                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Split-Screen Interface                       │  │
│  │  ┌─────────────────┐  ┌──────────────────────────────┐  │  │
│  │  │   Map Pane      │  │      Chat Pane               │  │  │
│  │  │  - Leaflet Map  │  │  - Message Display           │  │  │
│  │  │  - Markers      │  │  - Timeline Cards            │  │  │
│  │  │  - Audio Player │  │  - Input Field               │  │  │
│  │  └─────────────────┘  └──────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              ↕                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              State Management (Zustand)                   │  │
│  │  - Messages  - Timeline  - Audio Queue  - Locations      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              ↕                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   Custom Hooks                            │  │
│  │  - useChatStream  - useAudioPlayer  - useMapSync         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                               ↕ HTTP/SSE
┌─────────────────────────────────────────────────────────────────┐
│                    Next.js API Routes (Server)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │  /api/chat   │  │  /api/voice  │  │   /api/geocode       │ │
│  │  (SSE)       │  │  (TTS)       │  │   (Nominatim)        │ │
│  └──────────────┘  └──────────────┘  └──────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                               ↕ HTTPS
┌─────────────────────────────────────────────────────────────────┐
│                      External Services                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │  Groq API    │  │  ElevenLabs  │  │   Nominatim OSM      │ │
│  │  (LLaMA 3.3) │  │  (TTS)       │  │   (Geocoding)        │ │
│  └──────────────┘  └──────────────┘  └──────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Streaming Pipeline Architecture

The core of Hauntify is its multi-stage streaming pipeline that processes story content through multiple transformations simultaneously:

```
User Input
    ↓
┌───────────────────────────────────────────────────────────────┐
│                    /api/chat Endpoint                          │
│  1. Validate request (Zod schema)                             │
│  2. Build Groq API request with system prompt                 │
│  3. Stream tokens from Groq LLaMA 3.3 70B                     │
│  4. Process stream for timeline markers                        │
│  5. Emit NDJSON events (token, timeline, error, done)         │
└───────────────────────────────────────────────────────────────┘
    ↓ SSE Stream
┌───────────────────────────────────────────────────────────────┐
│                    useChatStream Hook                          │
│  1. Accumulate tokens into full response                      │
│  2. Update UI with streaming text                             │
│  3. Extract timeline items from events                         │
│  4. On completion: trigger voice generation                    │
└───────────────────────────────────────────────────────────────┘
    ↓ Parallel Processing
┌─────────────────┐  ┌─────────────────┐  ┌──────────────────┐
│  Voice Gen      │  │  Timeline       │  │  Map Sync        │
│  1. Clean text  │  │  1. Parse items │  │  1. Extract locs │
│  2. Call TTS    │  │  2. Validate    │  │  2. Geocode      │
│  3. Queue audio │  │  3. Display     │  │  3. Add markers  │
└─────────────────┘  └─────────────────┘  └──────────────────┘
```

**Design Rationale**: The streaming architecture provides immediate feedback to users while processing happens in the background. By using Server-Sent Events (SSE) with NDJSON format, we can send multiple event types (tokens, timeline, errors) through a single connection, reducing latency and improving perceived performance.

### Technology Stack

**Frontend:**
- Next.js 16 with App Router and React 19
- TypeScript with strict mode for type safety
- Tailwind CSS v4 alpha for styling
- Zustand for state management
- Leaflet + react-leaflet for map visualization
- shadcn/ui component library
- Sonner for toast notifications

**Backend:**
- Next.js API Routes with Node.js runtime (required for streaming)
- Server-Sent Events (SSE) for real-time streaming
- Zod for runtime validation

**External Services:**
- Groq API: LLaMA 3.3 70B Versatile for story generation
- ElevenLabs API: Text-to-speech with Brian voice
- Nominatim API: OpenStreetMap geocoding
- OpenStreetMap: Map tiles via Leaflet

**Design Rationale**: Next.js 16 provides excellent streaming support through App Router and API routes. The Node.js runtime is essential for SSE streaming (Edge runtime doesn't support it). Zustand offers a lightweight state management solution with built-in persistence. Leaflet is chosen over Google Maps for its open-source nature and customization capabilities.

## Components and Interfaces

### Core Components

#### 1. Split-Screen Interface (`app/page.tsx`)

The main layout component that orchestrates the entire application:

```typescript
interface SplitScreenProps {
  // No props - uses global state
}

// Responsive layout:
// - Desktop: 60% map + 40% chat (side-by-side)
// - Tablet: 50/50 split
// - Mobile: Tabbed interface with animated switcher
```

**Responsibilities:**
- Render map and chat panes
- Handle responsive layout transitions
- Manage mobile tab switching
- Apply horror aesthetic theme

**Design Rationale**: The split-screen layout allows users to see both the narrative and its geographic context simultaneously. On mobile, tabs prevent cramped UI while keeping both components mounted to avoid re-rendering costs.

#### 2. Chat Window (`components/chat/ChatWindow.tsx`)

Displays the conversation history with streaming support:

```typescript
interface ChatWindowProps {
  messages: ChatMessage[]
  isStreaming: boolean
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}
```

**Responsibilities:**
- Render message list with auto-scroll
- Display streaming indicator
- Show inline timeline cards
- Handle message formatting

**Design Rationale**: Auto-scroll ensures users always see the latest content during streaming. Timeline cards are rendered inline with messages to maintain narrative context.

#### 3. Chat Input (`components/chat/ChatInput.tsx`)

User input field with validation:

```typescript
interface ChatInputProps {
  onSend: (message: string) => void
  disabled: boolean
}

// Validation:
// - Max 2000 characters
// - HTML stripping
// - Trim whitespace
```

**Responsibilities:**
- Capture user input
- Validate message length
- Sanitize input (strip HTML)
- Provide visual feedback for character count

**Design Rationale**: The 2000 character limit prevents excessive API costs and ensures reasonable response times. HTML stripping prevents XSS attacks and formatting issues.

#### 4. Timeline Display (`components/chat/TimelineInChat.tsx`)

Vertical timeline visualization:

```typescript
interface TimelineInChatProps {
  items: TimelineItem[]
}

interface TimelineItem {
  year: number
  title: string
  desc: string
  place: string
  coordinates?: { lat: number; lon: number }
}
```

**Responsibilities:**
- Render timeline cards with vertical layout
- Display year badges, titles, descriptions
- Show location information
- Provide hover effects

**Design Rationale**: Vertical layout with connecting lines creates a clear chronological flow. Cards are designed to be scannable while maintaining the horror aesthetic.

#### 5. Map Pane (`components/map/MapPane.tsx`)

Container for map and audio player:

```typescript
interface MapPaneProps {
  // Uses global state for locations and audio
}
```

**Responsibilities:**
- Render Leaflet map
- Display audio player at bottom
- Handle map interactions
- Show voice generation indicator

#### 6. Leaflet Map (`components/map/LeafletMap.tsx`)

Interactive map with markers and paths:

```typescript
interface LeafletMapProps {
  locations: TimelineItem[]
  activeLocation: TimelineItem | null
}
```

**Responsibilities:**
- Display OpenStreetMap tiles
- Render animated markers with orange glow
- Draw polyline paths between locations
- Show popups with event details
- Auto-pan to new locations (zoom level 12)

**Design Rationale**: Leaflet provides excellent customization for markers and styling. Animated markers with orange glow maintain the horror aesthetic. Polylines show the story's geographic progression.

#### 7. Audio Player (`components/AudioPlayer.tsx`)

Compact audio playback controls:

```typescript
interface AudioPlayerProps {
  // Uses global audio queue state
}

interface AudioPlayerControls {
  play: () => void
  pause: () => void
  resume: () => void
  skip: (direction: 'next' | 'prev') => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
}
```

**Responsibilities:**
- Display playback controls (play/pause, skip, volume)
- Show progress bar with scrubber
- Display current time / total duration
- Handle user interactions

**Design Rationale**: Compact design fits at bottom of map pane without obscuring content. Gradient styling maintains horror aesthetic. Real-time progress updates provide smooth visual feedback.

### Custom Hooks

#### 1. useChatStream

Manages streaming chat and voice generation:

```typescript
interface UseChatStreamReturn {
  sendMessage: (content: string) => Promise<void>
  error: string | null
  isStreaming: boolean
}

// Internal flow:
// 1. Validate and sanitize input
// 2. Add user message to store
// 3. Call /api/chat with SSE
// 4. Process stream events (token, timeline, error, done)
// 5. On completion: generate voice for full story
```

**Design Rationale**: Centralizing streaming logic in a hook makes it reusable and testable. Accumulating the full response before voice generation ensures we send complete paragraphs to the TTS API.

#### 2. useAudioPlayer

Controls audio playback and queue:

```typescript
interface UseAudioPlayerReturn {
  play: (index?: number) => void
  pause: () => void
  resume: () => void
  skip: (direction: 'next' | 'prev') => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  state: AudioPlayerState
}

interface AudioPlayerState {
  isPlaying: boolean
  currentTime: number
  duration: number
  currentIndex: number
  volume: number
}
```

**Design Rationale**: Wrapping the AudioQueueManager in a hook provides React-friendly state updates and lifecycle management. The hook handles subscription/unsubscription automatically.

#### 3. useMapSync

Handles geocoding and map updates:

```typescript
interface UseMapSyncReturn {
  geocodeLocation: (place: string) => Promise<Coordinates | null>
  isGeocoding: boolean
}

interface Coordinates {
  lat: number
  lon: number
}
```

**Design Rationale**: Separating geocoding logic allows for rate limiting, caching, and error handling without cluttering the timeline extraction code.

### Service Layer

#### 1. AudioQueueManager (`src/services/audioQueue.ts`)

Custom class for managing sequential audio playback:

```typescript
class AudioQueueManager {
  private queue: AudioQueueItem[]
  private currentAudio: HTMLAudioElement
  private currentIndex: number
  private listeners: Set<StateListener>

  addToQueue(item: AudioQueueItem): void
  play(index?: number): void
  pause(): void
  resume(): void
  playNext(): void
  playPrevious(): void
  seek(time: number): void
  setVolume(volume: number): void
  clearQueue(): void
  subscribe(listener: StateListener): Unsubscribe
  destroy(): void
}
```

**Design Rationale**: Using a custom class instead of React state provides better control over audio lifecycle and prevents unnecessary re-renders. The listener pattern allows multiple components to react to playback changes.

#### 2. ElevenLabs Service (`src/services/elevenLabsService.ts`)

TTS API integration with fallback:

```typescript
interface GenerateSpeechParams {
  text: string
  voiceType?: 'narrator' | 'villain' | 'ghost' | 'historian'
  language?: string
}

interface GenerateSpeechResult {
  audioUrl: string  // Blob URL
  duration: number  // Estimated duration in seconds
}

async function generateSpeech(params: GenerateSpeechParams): Promise<GenerateSpeechResult>
```

**Design Rationale**: Encapsulating TTS logic in a service allows for easy testing and fallback handling. Blob URLs are used for efficient memory management.

#### 3. Timeline Extractor (`src/server/timeline.ts`)

Server-side timeline parsing:

```typescript
function extractTimelineBlocks(text: string): TimelineItem[]

async function* processStreamForTimeline(
  stream: AsyncGenerator<string>
): AsyncGenerator<string>
```

**Design Rationale**: Server-side extraction ensures timeline markers are removed before voice generation. The streaming processor emits timeline events as soon as they're detected, enabling real-time UI updates.

#### 4. Geocoding Service (`src/server/geocode.ts`)

Nominatim API integration with rate limiting:

```typescript
interface GeocodeResult {
  name: string
  lat: number
  lon: number
  country: string
}

async function geocodePlace(place: string): Promise<GeocodeResult | null>

// Features:
// - 1 req/sec rate limiting
// - 30-day response caching
// - Coordinate validation (-90 to 90 lat, -180 to 180 lon)
```

**Design Rationale**: Rate limiting prevents API abuse and respects Nominatim's usage policy. Caching reduces redundant requests for common locations.

### API Routes

#### 1. POST /api/chat

Streaming chat endpoint with SSE:

```typescript
interface ChatRequest {
  messages: ChatMessage[]
}

// Response: NDJSON stream
// Event types:
// - {"type":"token","data":"text"}
// - {"type":"timeline","data":{...}}
// - {"type":"error","data":"message"}
// - {"type":"done","data":null}
```

**Flow:**
1. Validate request with Zod schema
2. Build Groq API request with system prompt
3. Stream tokens from LLaMA 3.3 70B
4. Process stream for timeline markers
5. Emit NDJSON events

**Design Rationale**: NDJSON format allows multiple event types in a single stream. Server-side timeline extraction ensures markers don't appear in the UI or voice narration.

#### 2. POST /api/voice

Text-to-speech endpoint:

```typescript
interface VoiceRequest {
  text: string
  voice_type?: string
  language?: string
}

// Response: audio/mpeg (MP3 blob)
```

**Flow:**
1. Validate request with Zod schema
2. Clean text (remove timeline markers, audio cue brackets)
3. Call ElevenLabs API with Brian voice
4. Return MP3 audio blob

**Design Rationale**: Cleaning text on the server ensures consistent audio output. Using Brian voice provides a deep, dramatic narration suitable for horror stories.

#### 3. GET /api/geocode

Geocoding endpoint with caching:

```typescript
interface GeocodeQuery {
  q: string  // Place name
}

interface GeocodeResponse {
  name: string
  lat: number
  lon: number
  country: string
}
```

**Flow:**
1. Check cache (30-day TTL)
2. If miss: call Nominatim API (rate limited to 1 req/sec)
3. Validate coordinates
4. Cache result
5. Return coordinates

**Design Rationale**: Caching reduces API load and improves response times. Rate limiting respects Nominatim's usage policy.

## Data Models

### Message Model

```typescript
interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}
```

**Validation**: Zod schema ensures role is valid and content is non-empty string.

### Timeline Item Model

```typescript
interface TimelineItem {
  year: number          // 1800-2024
  title: string         // 3-6 words
  desc: string          // 10-15 words
  place: string         // "City, Country" format
  coordinates?: {       // Added after geocoding
    lat: number
    lon: number
  }
}
```

**Validation**: Zod schema ensures:
- Year is between 1800-2024
- Title and desc are non-empty strings
- Place follows geocodable format
- Coordinates are valid lat/lon values

### Audio Queue Item Model

```typescript
interface AudioQueueItem {
  id: string            // Unique identifier
  paragraphId: string   // Reference to story paragraph
  audioUrl: string      // Blob URL
  duration: number      // Duration in seconds
  voiceType: string     // Voice type used
  text: string          // Original text (for display)
}
```

**Lifecycle**: Blob URLs are created when audio is generated and revoked when queue is cleared to prevent memory leaks.

### Session State Model

```typescript
interface SessionState {
  // Messages
  messages: ChatMessage[]
  
  // Timeline
  timeline: TimelineItem[]
  activeLocation: TimelineItem | null
  
  // Audio
  audioQueue: AudioQueueItem[]
  isGeneratingVoice: boolean
  
  // UI State
  isStreaming: boolean
  
  // Actions
  addMessage: (message: ChatMessage) => void
  appendToLastMessage: (text: string) => void
  addTimelineItem: (item: TimelineItem) => void
  addAudioToQueue: (item: AudioQueueItem) => void
  clearAudioQueue: () => void
  setStreaming: (streaming: boolean) => void
  setGeneratingVoice: (generating: boolean) => void
  setActiveLocation: (location: TimelineItem | null) => void
}
```

**Persistence**: State is automatically saved to localStorage on every update. On page load, state is restored from localStorage.

**Design Rationale**: Zustand provides a simple, performant state management solution. The flat structure avoids nested updates and makes persistence straightforward.


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Acceptance Criteria Testing Prework

1.1 WHEN the user initiates story generation, THE Hauntify System SHALL invoke the Story Generator with a system prompt that enforces 1-2 paragraph story format beginning with "In the year"
  Thoughts: This is about ensuring the system prompt is correctly configured and sent to the API. We can test that the API request includes the proper system prompt format.
  Testable: yes - example

1.2 THE Hauntify System SHALL stream the generated story text to the Split-Screen Interface in real-time as tokens arrive from the Story Generator
  Thoughts: This is about the streaming mechanism working correctly. For any stream of tokens, they should be displayed in real-time without buffering the entire response.
  Testable: yes - property

1.3 THE Hauntify System SHALL display the streaming story text with the Horror Aesthetic color scheme of black, orange, and white
  Thoughts: This is a UI styling requirement that can be verified by checking computed styles.
  Testable: yes - example

1.4 WHEN story generation completes, THE Hauntify System SHALL maintain the complete story text visible in the Split-Screen Interface
  Thoughts: For any completed story, the full text should remain visible and not be truncated or cleared.
  Testable: yes - property

1.5 IF the Story Generator fails to respond within 30 seconds, THEN THE Hauntify System SHALL display an error message to the user
  Thoughts: This is testing timeout handling for a specific edge case.
  Testable: yes - edge case

2.1 WHEN the Story Generator produces story text, THE Hauntify System SHALL send the text to the Voice Narrator for conversion to audio
  Thoughts: For any completed story text, voice generation should be triggered automatically.
  Testable: yes - property

2.2 THE Hauntify System SHALL segment long story text into chunks of 500 characters or fewer before sending to the Voice Narrator
  Thoughts: For any story text longer than 500 characters, it should be split into chunks. This is a specific chunking rule.
  Testable: yes - property

2.3 WHEN the Voice Narrator returns audio data, THE Hauntify System SHALL add the audio segment to the Audio Queue Manager
  Thoughts: For any audio blob returned from the API, it should be added to the queue.
  Testable: yes - property

2.4 THE Audio Queue Manager SHALL play audio segments sequentially without gaps or overlaps between segments
  Thoughts: For any queue of audio segments, playback should be sequential with proper transitions.
  Testable: yes - property

2.5 THE Hauntify System SHALL provide playback controls allowing the user to pause, resume, and stop the audio narration
  Thoughts: This is testing that the UI provides specific controls and they function correctly.
  Testable: yes - example

3.1 WHEN the Story Generator produces story text, THE Timeline Extractor SHALL parse the text to identify historical events with associated dates
  Thoughts: For any story text containing timeline markers, the extractor should identify and parse them.
  Testable: yes - property

3.2 THE Timeline Extractor SHALL extract events that include year information matching the pattern "In the year YYYY" or similar date formats
  Thoughts: For any text with year patterns, the extractor should correctly identify them.
  Testable: yes - property

3.3 THE Hauntify System SHALL display extracted timeline events in chronological order within the Split-Screen Interface
  Thoughts: For any set of timeline events, they should be sorted by year in ascending order.
  Testable: yes - property

3.4 THE Hauntify System SHALL associate each timeline event with its corresponding text position in the story
  Thoughts: For any timeline event, it should maintain a reference to where it appears in the story.
  Testable: yes - property

3.5 WHEN the user interacts with a timeline event, THE Hauntify System SHALL highlight the corresponding text in the story display
  Thoughts: This is a UI interaction that can be tested by simulating clicks and checking for highlighting.
  Testable: yes - example

4.1 WHEN the Story Generator produces story text, THE Geocoder SHALL identify location names within the narrative
  Thoughts: For any story text with location names in timeline events, the geocoder should extract them.
  Testable: yes - property

4.2 THE Geocoder SHALL convert identified location names into geographic coordinates with latitude and longitude values
  Thoughts: For any valid location name, the geocoder should return valid lat/lon coordinates within proper bounds.
  Testable: yes - property

4.3 THE Map Visualizer SHALL display an interactive Leaflet map within the Split-Screen Interface
  Thoughts: This is testing that the map component renders correctly.
  Testable: yes - example

4.4 WHEN the Geocoder returns coordinates, THE Map Visualizer SHALL place animated markers on the map at the corresponding locations
  Thoughts: For any valid coordinates, a marker should be added to the map.
  Testable: yes - property

4.5 THE Map Visualizer SHALL allow the user to pan, zoom, and interact with map markers to view location details
  Thoughts: This is testing interactive map functionality.
  Testable: yes - example

5.1 THE Streaming Pipeline SHALL process story text through text display, Voice Narrator, Timeline Extractor, and Geocoder concurrently
  Thoughts: This is about architectural concurrency, which is difficult to test as a property but can be verified through integration testing.
  Testable: no

5.2 WHEN new story text arrives from the Story Generator, THE Hauntify System SHALL update the text display, initiate audio conversion, extract timeline events, and identify locations within 200 milliseconds
  Thoughts: This is a performance requirement with a specific timing constraint.
  Testable: yes - property

5.3 THE Hauntify System SHALL maintain synchronization between audio playback position and visual highlighting of the corresponding story text
  Thoughts: This is about audio-text synchronization which can be tested by verifying playback position matches highlighted text.
  Testable: yes - property

5.4 THE Hauntify System SHALL update the Map Visualizer with new location markers as they are geocoded without interrupting existing map interactions
  Thoughts: For any new marker addition, existing map state (zoom, pan position) should be preserved.
  Testable: yes - property

5.5 THE Hauntify System SHALL coordinate all pipeline stages to prevent race conditions or data inconsistencies
  Thoughts: This is a general corr 