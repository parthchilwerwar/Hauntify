# 🎃 Hauntify 👻

<div align="center">

[![Built with Kiro](https://img.shields.io/badge/Built%20with-Kiro%20IDE-orange?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMiAyMkgyMkwxMiAyWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+)](https://kiro.ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)

</div>

---

An interactive AI-powered horror storytelling app that weaves terrifying narratives with real-time map visualization. Submit storytelling prompts and watch as the AI reveals supernatural events across time and space.

> **🤖 Built with [Kiro IDE](https://kiro.ai)** - An AI-powered development environment that accelerates full-stack development with intelligent code generation, real-time assistance, and seamless workflow automation.

## Features

- **🤖 2-Stage AI Pipeline**: Groq LLaMA 3.3 70B generates stories + Groq GPT-OSS-120B ensures quality (all via single Groq API key!)
- **🎙️ AI Voice Narration**: Real-time text-to-speech using ElevenLabs with 4 voice types (Narrator, Villain, Ghost, Historian)
- **💬 Streaming AI Chat**: Real-time token-by-token responses with Server-Sent Events
- **🎵 Audio Player**: Full playback controls with play/pause, skip, timeline scrubber, volume control
- **📜 Interactive Timeline**: Events appear inline as the AI narrates with clickable cards
- **🗺️ Live Map Sync**: Locations automatically geocoded and displayed on an interactive map
- **💾 Session Persistence**: Conversations and audio saved to localStorage
- **🎨 Split-Screen Layout**: Map with audio player (60%) + Chat (40%)
- **📱 Mobile Responsive**: Tabbed interface for mobile devices

## Tech Stack

- **Framework**: Next.js 16 (App Router, Node runtime) with React 19
- **AI Generation**: Groq API with LLaMA 3.3 70B Versatile (story generation)
- **AI Quality**: Groq API with GPT-OSS-120B (quality enhancement)
- **Voice**: ElevenLabs Text-to-Speech API (with Web Speech API fallback)
- **Maps**: Leaflet + OpenStreetMap
- **Geocoding**: Nominatim (OSM)
- **State**: Zustand with localStorage persistence
- **Audio**: HTML5 Audio API with custom AudioQueueManager
- **Styling**: Tailwind CSS v4 (black-orange-white horror theme)
- **Validation**: Zod schemas for runtime validation
- **Streaming**: Server-Sent Events (SSE) with NDJSON format

## Setup

### Quick Start (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env.local

# 3. Add your API keys to .env.local
# Get a free Groq key at: https://console.groq.com (REQUIRED)
# Get ElevenLabs key at: https://elevenlabs.io (optional, 10k chars/month free)
# Edit .env.local and set:
#   GROQ_API_KEY=gsk_your_key_here          # Required for AI generation
#   ELEVENLABS_API_KEY=your_elevenlabs_key  # Optional (falls back to Web Speech API)

# 4. Verify setup
npm run verify

# 5. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start chatting!

**Note**: Voice narration requires `ELEVENLABS_API_KEY`. Without it, the app falls back to browser's Web Speech API.

### Detailed Setup

See [SETUP.md](./SETUP.md) for:
- Step-by-step installation
- Troubleshooting guide
- Customization options
- Development workflow

### Quick Reference

See [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for:
- Common tasks
- API endpoints
- Debugging tips
- Code snippets

## API Endpoints

### POST /api/chat

**2-Stage AI Pipeline** - Streaming chat endpoint powered entirely by Groq API.

**Pipeline Flow:**
1. **Stage 1**: Groq LLaMA 3.3 70B generates horror story (fast, creative)
2. **Stage 2**: Groq GPT-OSS-120B quality checks and enhances (ensures scariness)
3. **Output**: Enhanced story streamed to client with timeline markers

**Request:**
```json
{
  "messages": [
    {"role": "user", "content": "Tell me about a cursed town where the Salem witch trials never ended"}
  ]
}
```

**Response:** NDJSON stream
```json
{"type":"token","data":"In the year 1692, in Salem, Massachusetts, United States..."}
{"type":"timeline","data":{"year":1692,"title":"The Trials Begin","desc":"Accusations spread through Salem Village","place":"Salem, Massachusetts, United States"}}
{"type":"quality_report","data":{"score":8,"passed":true,"enhancements":[]}}
{"type":"done","data":null}
```

**Event Types:**
- `token` - Story text chunks (streamed word-by-word)
- `timeline` - Historical event markers for map visualization
- `quality_report` - Quality score and enhancement metadata
- `error` - Error messages if pipeline fails
- `done` - Stream completion signal

**System Prompt Features:**
- Enforces "In the year [YEAR], in [LOCATION]..." opening format
- Generates 1-2 paragraph stories (140-170 words each)
- Includes natural sound effects: [whispers], [exhales], [shhhh...]
- Embeds ##TIMELINE## markers with geocodable locations
- Dark, ominous, cinematic horror tone

See [QUALITY_PIPELINE.md](./QUALITY_PIPELINE.md) for detailed pipeline documentation.

### POST /api/voice

Text-to-speech endpoint using ElevenLabs API.

**Request:**
```json
{
  "text": "The Salem witch trials began in 1692...",
  "voice_type": "narrator",
  "language": "en"
}
```

**Response:** MP3 audio file (audio/mpeg)

**Voice Types:**
- `narrator` - Professional & dramatic (Rachel)
- `villain` - Sinister & menacing (Antoni)
- `ghost` - Ethereal & haunting (Dorothy)
- `historian` - Academic & formal (Arnold)

**Fallback**: If ElevenLabs fails or quota exceeded, automatically falls back to browser's Web Speech API.

### GET /api/geocode?q=place

Geocode a place name to coordinates.

**Response:**
```json
{
  "name": "Salem, Essex County, Massachusetts, USA",
  "lat": 42.5195,
  "lon": -70.8967,
  "country": "United States"
}
```

Rate limited to 1 req/sec per IP. Results cached for 30 days.

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # Streaming chat endpoint
│   │   ├── voice/route.ts         # ElevenLabs TTS endpoint
│   │   └── geocode/route.ts       # Geocoding endpoint
│   ├── page.tsx                   # Main split-screen layout
│   └── layout.tsx
├── components/
│   ├── chat/
│   │   ├── ChatWindow.tsx         # Message list
│   │   ├── ChatInput.tsx          # Input field with voice selector
│   │   ├── ChatMessage.tsx        # Individual message
│   │   └── TimelineInChat.tsx     # Timeline visualization
│   ├── map/
│   │   ├── MapPane.tsx            # Map container with audio player
│   │   └── LeafletMap.tsx         # Leaflet integration
│   ├── AudioPlayer.tsx            # Audio playback controls
│   ├── VoiceSelector.tsx          # Voice type selector
│   └── chat-interface.tsx         # Chat layout wrapper
├── src/
│   ├── hooks/
│   │   ├── useChatStream.ts       # Chat streaming + voice generation
│   │   ├── useAudioPlayer.ts      # Audio playback management
│   │   └── useMapSync.ts          # Map synchronization
│   ├── services/
│   │   ├── elevenLabsService.ts   # ElevenLabs API + Web Speech fallback
│   │   ├── audioQueue.ts          # Audio queue manager
│   │   └── paragraphDetector.ts   # Paragraph extraction (100-200 words)
│   ├── server/
│   │   ├── groqChat.ts            # Groq API integration (LLaMA 3.3 70B)
│   │   ├── enhancedPipeline.ts    # 2-stage pipeline orchestration
│   │   ├── storyEnhancer.ts       # Quality gate (GPT-OSS-120B)
│   │   ├── timeline.ts            # Timeline extraction & parsing
│   │   └── geocode.ts             # Geocoding service with caching
│   ├── store/
│   │   └── session.ts             # Zustand state (messages, audio, timeline)
│   ├── lib/
│   │   └── storage.ts             # LocalStorage persistence
│   ├── schemas/
│   │   └── index.ts               # Zod validation schemas
│   └── types/
│       └── index.ts               # TypeScript types
└── .env.example                   # Environment template
```

## How It Works

### Complete Data Flow

1. **User sends message** via ChatInput with selected voice type
2. **useChatStream hook** calls `/api/chat` with message history
3. **2-Stage AI Pipeline** (all via Groq API):
   - **Stage 1**: Groq LLaMA 3.3 70B generates horror story draft
   - **Stage 2**: Groq GPT-OSS-120B analyzes quality (score 1-10)
   - If score ≥ 7: Story passes through unchanged
   - If score < 7: Story enhanced with better atmosphere, pacing, tension
4. **Server streams enhanced story** token by token via Server-Sent Events
5. **Timeline extraction** happens server-side:
   - Regex parser detects `##TIMELINE##` markers
   - JSON validation with Zod schemas
   - Timeline events sent as separate NDJSON events
6. **Voice generation** triggered automatically when story completes:
   - Full story (without timeline markers) sent to `/api/voice`
   - ElevenLabs generates MP3 audio (or Web Speech API fallback)
   - Audio blob added to queue with estimated duration
7. **Audio player** automatically plays queued audio continuously
8. **Timeline events** rendered as vertical cards in chat with connecting lines
9. **useMapSync hook** geocodes locations via Nominatim API (1 req/sec, 30-day cache)
10. **Leaflet map** displays animated orange markers with polyline paths
11. **Session persisted** to localStorage (messages, timeline, audio blobs, coordinates)

### 2-Stage AI Pipeline

```
User Prompt
    ↓
[Stage 1] Groq LLaMA 3.3 70B
    → Fast generation of horror story draft
    ↓
[Stage 2] Groq GPT-OSS-120B
    → Analyzes scariness (score 1-10)
    → If score ≥ 7: Pass through ✓
    → If score < 7: Enhance story ⚡
    ↓
Enhanced Story + Timeline Markers
    ↓
Stream to Client (SSE/NDJSON)
```

### Voice Generation Pipeline

```
Complete Story → Remove Timeline Markers → ElevenLabs API → MP3 Blob → Audio Queue → Auto-play
```

### Audio Player Features

- **Auto-play**: First paragraph starts automatically
- **Queue management**: Subsequent paragraphs queued for continuous playback
- **Controls**: Play/pause, previous/next paragraph, timeline scrubber
- **Volume control**: Adjustable volume slider
- **Voice switching**: Change voice type mid-story (affects new paragraphs)
- **Persistence**: Audio blobs saved to localStorage for session resume

## Groq API Implementation

### Why Groq?

Hauntify uses **Groq API exclusively** for all AI generation:

- **Ultra-Fast Inference**: Groq's LPU (Language Processing Unit) delivers 10x faster token generation than traditional GPUs
- **Cost-Effective**: ~$0.0015 per story (both stages combined)
- **Single API Key**: Both LLaMA and GPT models accessible with one `GROQ_API_KEY`
- **Streaming Support**: Native Server-Sent Events for real-time token streaming
- **High Quality**: LLaMA 3.3 70B for creative generation + GPT-OSS-120B for quality assurance

### Implementation Files

**`src/server/groqChat.ts`**
- Groq API integration with LLaMA 3.3 70B Versatile
- 200+ line system prompt for horror storytelling
- Streaming via `fetch()` with Server-Sent Events
- NDJSON event formatting (token, timeline, error, done)
- Configuration: temperature 0.8, max_tokens 600, top_p 0.9

**`src/server/enhancedPipeline.ts`**
- Orchestrates 2-stage pipeline
- Stage 1: Collects full story from Groq LLaMA
- Stage 2: Sends to Groq GPT for quality check
- Reconstructs story with timeline markers
- Streams enhanced result to client

**`src/server/storyEnhancer.ts`**
- Quality gate using Groq GPT-OSS-120B
- Analyzes: atmosphere, pacing, tension, imagery, ending
- Scores 1-10 (≥7 passes, <7 enhanced)
- Returns enhanced story with improvement notes

**`app/api/chat/route.ts`**
- Next.js API route (Node.js runtime)
- Validates request with Zod schema
- Calls `enhancedStoryPipeline()` with Groq API key
- Returns SSE stream with proper headers

### System Prompt Highlights

The 200+ line system prompt in `groqChat.ts` enforces:

1. **Opening Format**: "In the year [YEAR], in [LOCATION], ..."
2. **Story Length**: 1-2 paragraphs, 140-170 words each
3. **Tone**: Dark, ominous, cinematic, fear-inducing
4. **Sound Effects**: [whispers], [exhales], [shhhh...], [laughs]
5. **Location Format**: "City, State, Country" or "City, Country"
6. **Timeline Markers**: ##TIMELINE## with JSON data
7. **City Variety**: 100+ cities across 20+ countries

### Quality Enhancement Criteria

Groq GPT-OSS-120B evaluates stories on:

- **Atmosphere** (1-10): Sense of dread and unease
- **Pacing** (1-10): Tension building and rhythm
- **Tension** (1-10): Suspense and fear escalation
- **Imagery** (1-10): Vivid sensory details
- **Ending** (1-10): Impact and lingering dread

**Overall Score** = Average of 5 criteria
- Score ≥ 7: Story passes unchanged
- Score < 7: Story enhanced with specific improvements

### Disabling Quality Enhancement (Optional)

If you want faster responses without quality checking:

1. Edit `app/api/chat/route.ts`
2. Replace `enhancedStoryPipeline` with `streamGroqToNDJSON`
3. Import from `@/src/server/groqChat`
4. No API key changes needed (still just Groq)

**Trade-off**: Stories will be faster (2-3s vs 3-5s) but quality may vary.

See [QUALITY_PIPELINE.md](./QUALITY_PIPELINE.md) for detailed comparison.

## Timeline Format

The Groq system prompt instructs the AI to emit timeline events in this format:

```
##TIMELINE## {"year":1692,"title":"The Trials Begin","desc":"Accusations spread through Salem Village","place":"Salem, Massachusetts, United States"}
```

**Processing:**
1. Timeline markers are embedded in the story by Groq LLaMA 3.3 70B
2. Server-side regex parser extracts markers: `/##TIMELINE##\s*\{[^}]+\}/g`
3. JSON validated with Zod schema (year, title, desc, place)
4. Markers removed from story before voice synthesis
5. Timeline events sent as separate NDJSON events to client
6. Client geocodes locations and displays on map

**Location Format Requirements:**
- Must be geocodable: "City, Country" or "City, State, Country"
- Examples: "Salem, Massachusetts, United States", "London, United Kingdom"
- System prompt includes 100+ cities across 20+ countries for variety

## Voice Narration

### ElevenLabs Integration

The app uses ElevenLabs for high-quality text-to-speech narration with 4 distinct voice types:

| Voice Type | Character | Description | ElevenLabs Voice |
|------------|-----------|-------------|------------------|
| 🎭 Narrator | Rachel | Professional & dramatic | 21m00Tcm4TlvDq8ikWAM |
| 😈 Villain | Antoni | Sinister & menacing | EXAVITQu4vr4xnSDxMaL |
| 👻 Ghost | Dorothy | Ethereal & haunting | ThT5KcBeYPX3keUQqHPh |
| 📚 Historian | Arnold | Academic & formal | pNInz6obpgDQGcFmaJgB |

### Voice Settings

```javascript
{
  stability: 0.6,
  similarity_boost: 0.75,
  style: 0.5,
  use_speaker_boost: true
}
```

### Pricing & Quotas

- **Free Tier**: 10,000 characters/month
- **Starter**: $5/month - 30,000 characters
- **Creator**: $22/month - 100,000 characters
- **Pro**: $99/month - 500,000 characters

Get your API key at: https://elevenlabs.io

### Fallback Behavior

If ElevenLabs is unavailable (no API key, quota exceeded, or API error), the app automatically falls back to the browser's **Web Speech API** with adjusted pitch/rate for each voice type. The experience is seamless - users still get narration, just with browser voices instead of ElevenLabs.

## Attribution

This app uses OpenStreetMap data. Per OSM license requirements:
- Map tiles: © OpenStreetMap contributors
- Geocoding: Nominatim / OpenStreetMap

Voice synthesis powered by ElevenLabs (optional).

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel dashboard
3. Add environment variable:
   - `GROQ_API_KEY` = your_groq_api_key
4. Deploy

Or use Vercel CLI:

```bash
vercel
```

**Important**: The app uses Node.js runtime (not Edge) for streaming support. This is already configured in the API routes.

### Other Platforms

The app works on any platform that supports:
- Next.js 16 App Router
- Node.js runtime (for streaming)
- Environment variables

Tested on: Vercel, Railway, Render

### Environment Variables

**Required:**
- `GROQ_API_KEY` - Your Groq API key (get at https://console.groq.com)

**Optional:**
- `ELEVENLABS_API_KEY` - ElevenLabs API key for voice narration (get at https://elevenlabs.io)
  - Without this, app falls back to Web Speech API
  - Free tier: 10,000 characters/month
- `NOMINATIM_BASE` - Geocoding service URL (default: https://nominatim.openstreetmap.org)
- `MAP_TILES_URL` - Map tiles URL (default: OpenStreetMap)
- `MAP_ATTRIBUTION` - Map attribution text (default: © OpenStreetMap contributors)

### Production Checklist

- [ ] Add `GROQ_API_KEY` to environment variables (required)
- [ ] Add `ELEVENLABS_API_KEY` to environment variables (optional but recommended)
- [ ] Verify streaming works (test a chat message)
- [ ] Test voice narration (should hear audio automatically)
- [ ] Check audio player controls (play/pause, skip, volume)
- [ ] Test voice type switching (narrator, villain, ghost, historian)
- [ ] Check map loads and markers appear
- [ ] Test geocoding (timeline events with locations)
- [ ] Verify localStorage persistence (refresh page, audio should resume)
- [ ] Check mobile responsiveness (tabbed interface)
- [ ] Confirm OSM attribution is visible on map
- [ ] Test ElevenLabs fallback (remove API key, should use Web Speech API)

## Rate Limits & Costs

### Groq API (Required)
- **Free Tier**: Available at https://console.groq.com
- **Models Used**:
  - LLaMA 3.3 70B Versatile (story generation)
  - GPT-OSS-120B (quality enhancement)
- **Cost per Story** (average 200 words):
  - Stage 1 (LLaMA): ~$0.0005 per story
  - Stage 2 (GPT): ~$0.001 per story
  - **Total**: ~$0.0015 per story (~667 stories per $1)
- **Speed**: 3-5 seconds total (both stages)
- **Single API Key**: Both stages use the same `GROQ_API_KEY`

### ElevenLabs API (Optional)
- **Free Tier**: 10,000 characters/month
- **Paid Plans**: 
  - Starter: $5/month - 30,000 characters
  - Creator: $22/month - 100,000 characters
  - Pro: $99/month - 500,000 characters
- **Average Story**: 500-1000 characters
- **Fallback**: Web Speech API (browser-based, free, unlimited)

### Nominatim Geocoding (Free)
- **Rate Limit**: 1 request/second (enforced by our API)
- **Caching**: 30-day localStorage cache
- **Fair Use**: OpenStreetMap data, respect usage policy

### OpenStreetMap Tiles (Free)
- **Fair Use Policy**: Consider MapTiler/Stadia for high-traffic production

## Security

- Messages limited to 2,000 characters
- HTML stripped from user input
- API keys never exposed to client
- Abort controllers for stream cleanup
- Rate limiting on geocoding endpoint

## License

MIT

## Architecture

### Frontend
- **React 19** with Next.js 16 App Router
- **Zustand** for global state management
- **Leaflet** for interactive maps
- **Tailwind CSS v4** for styling
- **Sonner** for toast notifications

### Backend
- **Next.js API Routes** (Node.js runtime)
- **Server-Sent Events** for streaming
- **Zod** for validation
- **Nominatim** for geocoding

### Data Flow
1. User message → ChatInput
2. useChatStream → /api/chat
3. 2-Stage Pipeline:
   - Groq LLaMA 3.3 70B → Story generation
   - Groq GPT-OSS-120B → Quality enhancement
4. Server-side timeline extraction (regex + Zod validation)
5. SSE/NDJSON streaming → Client
6. Timeline events → Store update
7. useMapSync → Nominatim geocoding → Map update
8. Voice generation → ElevenLabs/Web Speech API
9. Audio queue → AudioQueueManager → Playback
10. LocalStorage persistence (messages, timeline, audio, coordinates)

### State Management (Zustand)
- **Messages:** Array of chat messages
- **Timeline:** Extracted historical events with coordinates
- **Active Location:** Current map focus
- **Audio Queue:** Array of audio items with blob URLs and durations
- **Voice Type:** Selected narrator voice (narrator/villain/ghost/historian)
- **Player State:** isPlaying, currentTime, duration, volume
- **Session:** Persisted to localStorage (including audio blobs)

## Documentation

- [SETUP.md](./SETUP.md) - Detailed setup guide
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Developer reference
- [MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md) - Implementation status

## Credits

**Built with [Kiro IDE](https://kiro.ai)** 🚀

This project was developed using Kiro IDE, an AI-powered development environment that combines intelligent code generation, real-time assistance, and workflow automation to accelerate full-stack development.

### Development Tools
- **Primary IDE**: [Kiro](https://kiro.ai) - AI-assisted development environment
- **Initial Design**: v0.dev - UI component generation
- **AI Models**: 
  - Groq LLaMA 3.3 70B Versatile (story generation)
  - Groq GPT-OSS-120B (quality enhancement)
- **Voice Synthesis**: ElevenLabs TTS API with Web Speech API fallback

### Open Source
This project is open source and available under the MIT License. Contributions are welcome!
