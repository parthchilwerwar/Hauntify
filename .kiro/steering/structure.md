---
inclusion: always
---

# Project Structure

## Directory Organization

```
Hauntify/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── chat/
│   │   │   └── route.ts          # Streaming chat endpoint (SSE with Groq)
│   │   ├── geocode/
│   │   │   └── route.ts          # Geocoding endpoint (Nominatim)
│   │   ├── voice/
│   │   │   └── route.ts.example  # Voice synthesis endpoint (ElevenLabs)
│   │   └── voice-stream/
│   │       └── route.ts          # Streaming voice endpoint
│   ├── layout.tsx                # Root layout with fonts & Sonner
│   ├── page.tsx                  # Main page with responsive split-screen layout
│   └── globals.css               # Global styles, theme, animations
│
├── components/                   # React components
│   ├── chat/                     # Chat-related components
│   │   ├── ChatInput.tsx         # User input with 2000 char validation
│   │   ├── ChatMessage.tsx       # Individual message with timeline
│   │   ├── ChatWindow.tsx        # Message display with auto-scroll
│   │   └── TimelineInChat.tsx    # Timeline cards with vertical layout
│   ├── map/                      # Map-related components
│   │   ├── LeafletMap.tsx        # Leaflet map with markers & popups
│   │   └── MapPane.tsx           # Map container with audio player
│   ├── ui/                       # shadcn/ui components (50+ components)
│   │   ├── button.tsx            # Button component
│   │   ├── card.tsx              # Card component
│   │   ├── input.tsx             # Input component
│   │   ├── toast.tsx             # Toast component
│   │   └── ...                   # (accordion, alert, badge, etc.)
│   ├── AudioPlayer.tsx           # Compact audio player with controls
│   ├── chat-interface.tsx        # Main chat UI container
│   ├── ErrorBoundary.tsx         # Error boundary wrapper
│   └── theme-provider.tsx        # Theme provider (dark mode)
│
├── src/
│   ├── hooks/                    # Custom React hooks
│   │   ├── useChatStream.ts      # Streaming chat + voice generation
│   │   ├── useAudioPlayer.ts     # Audio player state management
│   │   └── useMapSync.ts         # Map synchronization with geocoding
│   │
│   ├── services/                 # Client-side services
│   │   ├── audioQueue.ts         # AudioQueueManager class
│   │   ├── elevenLabsService.ts  # ElevenLabs TTS API client
│   │   ├── elevenLabsStreamingService.ts  # Streaming TTS
│   │   └── paragraphDetector.ts  # Paragraph detection (100-180 words)
│   │
│   ├── server/                   # Server-side utilities
│   │   ├── groqChat.ts           # Groq API with system prompt
│   │   ├── enhancedPipeline.ts   # 2-stage AI pipeline
│   │   ├── storyEnhancer.ts      # Story quality enhancement
│   │   ├── timeline.ts           # Timeline extraction & parsing
│   │   ├── geocode.ts            # Geocoding with rate limiting
│   │   └── mapSync.ts            # Map synchronization logic
│   │
│   ├── store/                    # State management
│   │   └── session.ts            # Zustand store with localStorage
│   │
│   ├── lib/                      # Utilities
│   │   ├── errorHandler.ts       # ErrorHandler class for logging
│   │   ├── instrumentation.ts    # Performance monitoring
│   │   ├── languageSupport.ts    # Language detection
│   │   ├── sanitize.ts           # HTML sanitization
│   │   ├── storage.ts            # localStorage persistence
│   │   ├── utils.ts              # Utility functions (cn helper)
│   │   └── validation.ts         # Coordinate validation
│   │
│   ├── schemas/                  # Zod validation schemas
│   │   └── index.ts              # All schemas (chat, voice, timeline)
│   │
│   ├── types/                    # TypeScript definitions
│   │   └── index.ts              # Shared types & interfaces
│   │
│   └── tests/                    # Test files
│       ├── chat.spec.ts          # Chat endpoint tests
│       ├── geocode.spec.ts       # Geocoding tests
│       └── timeline.spec.ts      # Timeline extraction tests
│
├── hooks/                        # Additional hooks (legacy)
│   ├── use-mobile.ts             # Mobile detection hook
│   └── use-toast.ts              # Toast hook
│
├── lib/                          # Library utilities (legacy)
│   └── utils.ts                  # Utility functions
│
├── public/                       # Static assets
│   └── leaflet-fix.css           # Leaflet CSS fixes
│
├── scripts/                      # Utility scripts
│   ├── test-api.js               # API testing script
│   └── verify-setup.js           # Setup verification
│
├── styles/                       # Additional styles
│   └── globals.css               # Global styles (duplicate)
│
├── .kiro/                        # Kiro AI configuration
│   ├── specs/                    # Feature specifications
│   └── steering/                 # AI assistant guidance
│       └── structure.md          # This file
│
├── components.json               # shadcn/ui configuration
├── tailwind.config.ts            # Tailwind v4 configuration
├── tsconfig.json                 # TypeScript configuration
├── next.config.mjs               # Next.js configuration
├── postcss.config.mjs            # PostCSS configuration
├── package.json                  # Dependencies and scripts
├── pnpm-lock.yaml                # pnpm lockfile
├── vercel.json                   # Vercel deployment config
├── README.md                     # Project documentation
├── FEATURE_ROADMAP.md            # Feature planning
├── QUALITY_PIPELINE.md           # Quality assurance docs
└── report.md                     # Project report
```

## Key Conventions

### File Naming
- React components: PascalCase (e.g., `ChatInterface.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useChatStream.ts`)
- Services/utilities: camelCase (e.g., `groqChat.ts`)
- API routes: lowercase with `route.ts` suffix

### Import Aliases
- Use `@/` for imports from workspace root
- Example: `import { ChatStore } from '@/src/store/chatStore'`

### Component Organization
- One component per file
- Co-locate related components in same directory
- Export default for main component, named exports for utilities

### State Management
- Use Zustand store (`session.ts`) for global state
  - Messages array with inline timeline items
  - Audio queue with blob URLs and durations
  - Timeline with geocoded coordinates
  - Active location for map focus
  - Streaming and voice generation flags
- Use local state for UI-only concerns (input values, loading states)
- Persist critical data to localStorage via `storage.ts` utilities

### API Routes
- All external API calls go through Next.js API routes (never from client)
- `/api/chat` - Streaming with Groq LLaMA 3.3 70B via SSE
- `/api/voice` - ElevenLabs TTS with Brian voice
- `/api/voice-stream` - Streaming voice synthesis
- `/api/geocode` - Nominatim geocoding with rate limiting
- Return proper HTTP status codes and error messages
- Implement rate limiting (1 req/sec for geocoding) and caching (30 days)

### Error Handling
- Use `ErrorHandler` utility in `src/lib/errorHandler.ts` for consistent logging
- Severity levels: minor, major, critical
- Display user-friendly messages via Sonner toasts
- Never expose API keys or sensitive data in errors
- Log structured error objects with context
