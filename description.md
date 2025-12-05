# Hauntify 🎃

## Inspiration
I've always been fascinated by the dark corners of history—the haunted places, the unsolved mysteries, the chilling "what ifs" that send shivers down your spine. What if you could explore any location's darkest secrets? What if history's most terrifying moments came alive with a narrator's voice and a map that traces the horror? I wanted to create an experience that generates these spine-tingling tales instantly, narrates them like a horror documentary, and visualizes the dread spreading across a living map.

## What it does
Type any horror prompt and Hauntify:
1. **Generates** a cinematic horror story (1-2 atmospheric paragraphs with historical timeline events)
2. **Narrates** it with professional AI voice so the terror never stops
3. **Illuminates** the map as each dark event unfolds, with animated markers tracing the path of horror
4. **Extracts** historical timeline events that appear as vertical cards with connecting lines
5. **Synchronizes** everything in real-time—streaming text, voice generation, and map visualization

## How I built it

**Frontend**: Next.js 16 + React 19 + Tailwind CSS v4. The interface is a split-screen experience (60/40 desktop, tabbed mobile) with a Leaflet map featuring animated orange markers, polyline paths, and a custom audio player with gradient styling.

**Generation**: Groq LLaMA 3.3 70B streams horror stories token-by-token via Server-Sent Events (SSE). Stories follow "In the year [YEAR], in [LOCATION]..." format with embedded timeline markers and natural sound effects like [whispers], [exhales], [shhhh...].

**Narration**: ElevenLabs TTS with Brian voice (deep, resonant male narrator) converts the entire story to dramatic audio. Fallback to Web Speech API ensures narration always works. Audio is generated as a single MP3 blob and queued for playback with full user controls.

**Map & Timeline**: Server-side parser extracts ##TIMELINE## markers with JSON data (year, title, description, place). Nominatim API geocodes locations with 1 req/sec rate limiting and 30-day caching. Leaflet displays animated markers with orange glow, polylines connecting events, and popups with historical details.

**State/UX**: Zustand manages global state (messages, timeline, audio queue, locations) with localStorage persistence. Custom hooks (`useChatStream`, `useAudioPlayer`, `useMapSync`) orchestrate the streaming pipeline. AbortControllers ensure clean stream cleanup.

## How I used Kiro

**Spec-to-code**: I fed Kiro detailed specs for the horror storytelling pipeline (streaming chat, voice generation, timeline extraction, map sync). It generated production-ready TypeScript scaffolding with proper error handling, validation, and type safety.

**Vibe coding**: I iterated on the dark horror aesthetic (black/orange/white theme, animated gradients, glowing markers, vertical timeline cards) and Kiro helped refine the CSS animations and responsive layouts.

**Agent hooks**: Kiro helped me compose a robust 2-stage AI pipeline (generation + enhancement), a custom AudioQueueManager class with sequential playback, and a geocoding service with rate limiting and coordinate validation.

**Quality assurance**: Kiro assisted in creating comprehensive test suites for chat endpoints, geocoding, and timeline extraction to ensure reliability.

## Challenges

**Audio queue management**: Building a custom AudioQueueManager that handles blob URLs, sequential playback, auto-advance, seek controls, and proper cleanup without memory leaks. I implemented a listener pattern for state updates and careful URL.revokeObjectURL lifecycle management.

**Streaming pipeline coordination**: Orchestrating three simultaneous streams (text tokens, timeline extraction, voice generation) without blocking or race conditions. I used NDJSON event types (token, timeline, error, done) and proper abort controllers.

**Timeline extraction accuracy**: Parsing ##TIMELINE## markers from streaming text while handling malformed JSON, duplicate events, and invalid coordinates. I built a robust parser with Zod validation and deduplication by title+year.

**Map synchronization**: Geocoding place names in real-time while respecting rate limits, caching results, validating coordinates, and handling API failures gracefully. I implemented a 1 req/sec throttle with 30-day localStorage caching.

**Mobile responsiveness**: Creating a seamless experience across desktop (split-screen), tablet (50/50), and mobile (tabbed interface) while keeping both components mounted to avoid re-renders and maintain state.

## Accomplishments I'm proud of

- A **zero-latency streaming experience** where text, voice, and map updates flow simultaneously
- A **cinematic audio player** with full controls (play/pause, seek, volume, skip) and automatic queue management
- A **dark horror aesthetic** that feels immersive and atmospheric while staying performant and accessible
- **Session persistence** that restores full conversation history, timeline, audio queue, and map state on reload
- A **robust error handling system** with graceful fallbacks (Web Speech API, coordinate validation, rate limiting)

## What I learned

- **Streaming UX > batch responses**: Users perceive speed when something happens immediately (first token, voice generation, map marker)
- **Audio blob lifecycle matters**: Proper cleanup with URL.revokeObjectURL prevents memory leaks in long sessions
- **Rate limiting is essential**: Respecting API limits (1 req/sec for geocoding) with caching (30 days) ensures reliability
- **Type safety catches bugs early**: Zod schemas for validation and TypeScript strict mode prevented countless runtime errors

## What's next

- **Save/share stories** with unique URLs and social media previews
- **Multi-voice cast** with different voices for narration vs. character dialogue
- **Enhanced map layers** with historical overlays and custom horror-themed markers
- **Branching narratives** where users can influence the story direction
- **Audio effects** like reverb, echo, and ambient soundscapes for deeper immersion
- **Export functionality** to save stories as audio files or PDFs

## Built With

- **Next.js 16** with App Router and React 19
- **TypeScript** with strict mode for type safety
- **Tailwind CSS v4** with custom horror theme
- **Groq API** (LLaMA 3.3 70B Versatile) for AI story generation
- **ElevenLabs API** for professional text-to-speech narration
- **Nominatim API** (OpenStreetMap) for geocoding
- **Leaflet + react-leaflet** for interactive map visualization
- **Zustand** for state management with localStorage persistence
- **Zod** for runtime validation
- **shadcn/ui** for UI components
- **Lucide React** for icons
- **Sonner** for toast notifications
- **Kiro** for spec-driven development and AI-assisted coding
- **Vercel** for deployment
- **Node.js** runtime for streaming support

## Try it out

[Your deployment URL here]

---

**Hauntify** transforms any prompt into an immersive horror experience—where AI-generated stories, professional narration, and living maps converge to create cinematic terror. Every location has a dark history. What will you uncover? 🎃👻
