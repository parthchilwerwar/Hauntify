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

- **🎙️ AI Voice Narration**: Real-time text-to-speech using ElevenLabs with 4 voice types (Narrator, Villain, Ghost, Historian)
- **💬 Streaming AI Chat**: Real-time responses from Groq's LLaMA 3.3 70B model
- **🎵 Audio Player**: Full playback controls with play/pause, skip, timeline scrubber, volume control
- **📜 Interactive Timeline**: Events appear inline as the AI narrates with clickable cards
- **🗺️ Live Map Sync**: Locations automatically geocoded and displayed on an interactive map
- **💾 Session Persistence**: Conversations and audio saved to localStorage
- **🎨 Split-Screen Layout**: Map with audio player (60%) + Chat (40%)
- **📱 Mobile Responsive**: Tabbed interface for mobile devices

## Tech Stack

- **Framework**: Next.js 16 (App Router, Node runtime) with React 19
- **AI**: Groq API (llama-3.3-70b-versatile)
- **Voice**: ElevenLabs Text-to-Speech API (with Web Speech API fallback)
- **Maps**: Leaflet + OpenStreetMap
- **Geocoding**: Nominatim (OSM)
- **State**: Zustand
- **Audio**: HTML5 Audio API with custom queue manager
- **Styling**: Tailwind CSS v4 (black-orange-white theme)
- **Validation**: Zod
- **Streaming**: Server-Sent Events (NDJSON)

## Setup

### Quick Start (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env.local

# 3. Add your API keys to .env.local
# Get a free Groq key at: https://console.groq.com
# Get ElevenLabs key at: https://elevenlabs.io (optional, 10k chars/month free)
# Edit .env.local and set:
#   GROQ_API_KEY=gsk_your_key_here
#   ELEVENLABS_API_KEY=your_elevenlabs_key (optional)

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

Streaming chat endpoint that accepts messages and returns Server-Sent Events.

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
{"type":"token","data":"The Salem"}
{"type":"timeline","data":{"year":1692,"title":"The Trials Begin","desc":"...","place":"Salem, Massachusetts"}}
{"type":"done","data":null}
```

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
│   │   ├── groqChat.ts            # Groq API integration
│   │   ├── timeline.ts            # Timeline extraction
│   │   └── geocode.ts             # Geocoding service
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
3. **Server streams response** from Groq API token by token
4. **Paragraph detector** monitors stream for complete 100-200 word paragraphs
5. **Voice generation** triggered automatically when paragraph completes:
   - Calls `/api/voice` with paragraph text and voice type
   - ElevenLabs generates MP3 audio (or Web Speech API fallback)
   - Audio blob added to queue with duration
6. **Audio player** automatically plays queued audio continuously
7. **Timeline parser** detects `##TIMELINE##` markers in AI output
8. **Timeline events** rendered as cards in chat
9. **useMapSync hook** geocodes locations and updates map
10. **Leaflet map** displays animated markers and paths
11. **Session persisted** to localStorage (messages, timeline, audio URLs)

### Voice Generation Pipeline

```
AI Token Stream → Paragraph Detector (100-200 words) → ElevenLabs API → MP3 Blob → Audio Queue → Auto-play
```

### Audio Player Features

- **Auto-play**: First paragraph starts automatically
- **Queue management**: Subsequent paragraphs queued for continuous playback
- **Controls**: Play/pause, previous/next paragraph, timeline scrubber
- **Volume control**: Adjustable volume slider
- **Voice switching**: Change voice type mid-story (affects new paragraphs)
- **Persistence**: Audio blobs saved to localStorage for session resume

## Timeline Format

The AI is instructed to emit timeline events in this format:

```
##TIMELINE## {"year":1692,"title":"The Trials Begin","desc":"Accusations spread through Salem Village","place":"Salem, Massachusetts"}
```

These are parsed server-side and sent as separate events to the client.

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

- **Groq**: Free tier available, check your plan limits at console.groq.com
- **ElevenLabs**: 
  - Free tier: 10,000 characters/month
  - Paid plans start at $5/month for 30,000 characters
  - Average story: 500-1000 characters
- **Nominatim**: 1 request/second (enforced by our API)
- **OSM Tiles**: Fair use policy (consider MapTiler/Stadia for production)

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
3. Groq API → Streaming response
4. Timeline extraction → Store update
5. useMapSync → Geocoding → Map update
6. LocalStorage persistence

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
- **AI Models**: Groq LLaMA 3.3 70B for storytelling
- **Voice Synthesis**: ElevenLabs TTS API

### Open Source
This project is open source and available under the MIT License. Contributions are welcome!
