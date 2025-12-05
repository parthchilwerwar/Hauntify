---
inclusion: always
---

# Product Overview

**Hauntify** is an AI-powered horror storytelling application that delivers immersive cinematic experiences through synchronized multi-modal content. Users submit storytelling prompts and receive real-time streaming horror narratives with professional voice narration, interactive map visualization, and historical timeline extraction—all orchestrated in a dark, atmospheric split-screen interface.

## Core Experience

The application orchestrates a sophisticated streaming pipeline where AI-generated stories flow through multiple stages simultaneously:

1. **Text Generation**: Groq LLaMA 3.3 70B generates atmospheric 1-2 paragraph horror stories
   - Enforces "In the year [YEAR], in [LOCATION], ..." opening format
   - Includes natural sound effects: [whispers], [exhales], [shhhh...]
   - Stories are 140-170 words per paragraph, max 2 paragraphs
   - Dark, ominous, cinematic tone with suspense building

2. **Voice Narration**: ElevenLabs TTS converts entire story to dramatic audio
   - Uses Brian voice (deep, resonant male narrator)
   - Slowed down with dramatic voice settings for horror effect
   - Audio cue brackets removed for natural speech
   - Generated as single MP3 blob for full story
   - Auto-queued for playback with user controls

3. **Timeline Extraction**: Server-side parser identifies historical events
   - Extracts ##TIMELINE## markers with JSON data
   - Format: {"year":YYYY, "title":"...", "desc":"...", "place":"City, Country"}
   - Validates with Zod schema and deduplicates by title+year
   - Rendered as vertical timeline cards in chat

4. **Map Visualization**: Leaflet displays story locations dynamically
   - Automatic geocoding of place names via Nominatim
   - Animated markers with orange glow effects
   - Polyline paths connecting chronological locations
   - Popups with event details (year, title, description)
   - Auto-pan to new locations with zoom level 12

## Key Features

### Story Generation
- Real-time streaming with Server-Sent Events (token-by-token)
- 2-stage AI pipeline: LLaMA 3.3 70B generation + optional quality enhancement
- System prompt enforces horror atmosphere and location formatting
- 2000 character input limit with validation
- Auto-language detection for multilingual support

### Audio Experience
- Automatic voice narration for entire story (not per-paragraph)
- ElevenLabs TTS with Brian voice for cinematic horror narration
- Fallback to Web Speech API if quota exceeded
- Custom audio player with:
  - Play/pause with resume from last position
  - Timeline scrubber with progress bar and playhead
  - Volume control and mute button
  - Current time / total duration display
  - Compact gradient-styled design at bottom of map

### Map & Timeline
- Interactive Leaflet map with OpenStreetMap tiles
- Automatic geocoding with 1 req/sec rate limiting
- Coordinate validation to prevent invalid locations
- Animated markers with orange glow
- Polyline paths showing story progression
- Timeline cards with vertical layout and connecting lines
- Year badges, location pins, and event descriptions
- Hover effects with shadow glow

### UI & UX
- Split-screen layout: 60% map + 40% chat (desktop)
- 50/50 split on tablet, tabbed interface on mobile
- Dark horror theme: black background, orange accents, white text
- Custom fonts: Montserrat (body), Elms Sans (headings), JetBrains Mono (code)
- Animated gradients on mobile tab switcher
- Streaming indicator with pulsing dots
- Voice generation indicator above audio player
- Error handling with toast notifications

### Persistence & Performance
- Session persistence with localStorage
- Audio blob URLs stored in queue
- Geocoding results cached for 30 days
- Proper cleanup with URL.revokeObjectURL to prevent memory leaks
- Abort controllers for stream cleanup on navigation

## User Flow

### Initial Experience
1. User lands on split-screen interface (map left, chat right)
2. Sees "Hauntify 🎃" branding and empty chat
3. Types storytelling prompt in input field (max 2000 chars)
4. Clicks send button or presses Enter

### Story Generation Phase
5. User message appears in chat with dark background
6. AI begins streaming response token-by-token
7. Story text appears in real-time in assistant message bubble
8. Streaming indicator shows animated dots while generating
9. Timeline markers are extracted and removed from displayed text
10. Timeline cards appear inline with connecting vertical lines

### Audio Generation Phase
11. When story completes, "Generating..." indicator appears above audio player
12. Full story (without timeline markers) sent to ElevenLabs
13. MP3 audio blob generated with Brian voice
14. Audio added to queue with estimated duration
15. Audio player becomes visible at bottom of map
16. User can click play to start narration

### Map Visualization Phase
17. Timeline events with place names trigger geocoding
18. Nominatim API converts "City, Country" to lat/lon coordinates
19. Map automatically pans to new location with zoom level 12
20. Animated orange marker appears with location popup
21. Polyline connects to previous locations showing path
22. User can click markers for event details

### Playback Control
23. User controls audio with play/pause, skip, volume, mute
24. Progress bar shows current position in timeline
25. Time display shows current/total duration
26. Audio auto-advances through queue (if multiple segments)
27. User can seek by dragging timeline scrubber

### Session Persistence
28. All messages, timeline, audio queue saved to localStorage
29. On page reload, session restored with:
    - Full conversation history
    - Timeline cards with geocoded coordinates
    - Audio blobs in queue (ready to play)
    - Map markers and paths
30. User can continue conversation or start new session

### Mobile Experience
31. Tab switcher at top with animated gradient backgrounds
32. Toggle between "Chat" and "Map" tabs
33. Both components stay mounted (no re-render on switch)
34. Audio player remains accessible on map tab
35. Same functionality as desktop, optimized for touch
