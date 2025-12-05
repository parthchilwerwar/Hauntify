# Implementation Plan

- [ ] 1. Initialize Next.js 15+ project with TypeScript and dependencies
  - Create Next.js app with App Router and TypeScript configuration
  - Install core dependencies: react@19, next@15+, typescript, zustand, zod, leaflet, react-leaflet, lucide-react, sonner, groq-sdk
  - Install Tailwind CSS v4 alpha and configure with custom theme
  - Set up project structure: app/, components/, src/server/, src/services/, src/hooks/, src/types/, src/store/
  - _Requirements: 14.1, 14.4_

- [ ] 2. Create type definitions and schemas
  - Define TypeScript interfaces in src/types/index.ts: ChatMessage, TimelineItem, AudioQueueItem, ChatSession, GeocodingResult
  - Create Zod schemas for validation: ChatRequestSchema, VoiceRequestSchema, TimelineItemSchema, GeocodingResultSchema
  - Export all types and schemas for use across the application
  - _Requirements: 10.5, 6.3_

- [ ] 3. Implement error handling utilities
  - Create ErrorHandler class in src/server/errorHandler.ts with log method supporting severity levels (info, warn, error)
  - Add handleApiError method for consistent API error handling with user-friendly messages
  - Implement validation utilities for coordinate ranges (lat -90 to 90, lon -180 to 180)
  - Add sanitization utility for stripping HTML from user input
  - _Requirements: 10.4, 6.3, 10.2_

- [ ] 4. Build Zustand state store with persistence
  - Create store in src/store/chatStore.ts with messages, streaming state, audio queue, location history, and active location
  - Implement actions: addMessage, updateLastMessage, addTimelineToLastMessage, setIsStreaming, addToAudioQueue, clearAudioQueue, addLocation, setActiveLocation
  - Add localStorage persistence with createSession, saveSession, updateSession, loadSession functions
  - Implement session ID generation and serialization/deserialization logic
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 5. Create timeline extraction server utility
  - Implement extractTimeline function in src/server/timelineExtractor.ts with regex pattern for ##TIMELINE## markers
  - Build brace-counting JSON parser to handle incomplete/malformed markers
  - Add deduplication logic by year+title key
  - Implement sorting by year ascending
  - Validate extracted data with Zod TimelineItemSchema
  - _Requirements: 5.1, 5.2, 2.4_

- [ ] 6. Implement Groq chat streaming service
  - Create groqChat.ts in src/server/ with SYSTEM_PROMPT constant enforcing story format and requirements
  - Build buildChatRequest function that strips timestamps and adds system message
  - Implement streamGroqToNDJSON async generator that calls Groq API with streaming enabled
  - Parse SSE response line-by-line, extract delta.content tokens, yield as NDJSON token events
  - Emit done event when stream completes
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3_

- [ ] 7. Build chat API endpoint with streaming
  - Create /api/chat/route.ts with POST handler accepting user message
  - Validate request with Zod ChatRequestSchema and sanitize input
  - Call streamGroqToNDJSON and process timeline extraction in parallel
  - Yield SSE events: {"type":"token","data":"..."}, {"type":"timeline","data":{...}}, {"type":"done","data":null}
  - Implement buffer management to prevent infinite loops
  - Set proper headers for SSE: Content-Type: text/event-stream, Cache-Control: no-cache
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 5.1_

- [ ] 8. Implement geocoding service with rate limiting
  - Create geocodingService.ts in src/server/ with GeocodingService class
  - Implement in-memory cache with 30-day TTL for geocoding results
  - Add rate limiting logic: 1 request per second with queue management
  - Build fetchNominatim method calling Nominatim API with proper query formatting
  - Validate coordinates to ensure lat -90 to 90, lon -180 to 180
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 9. Create geocoding API endpoint
  - Create /api/geocode/route.ts with GET handler accepting query parameter
  - Validate place name format ("City, Country" or "City, State, Country")
  - Call GeocodingService.geocode with rate limiting
  - Return JSON response with {name, lat, lon, country}
  - Implement error handling for invalid coordinates or failed lookups
  - Set caching headers: Cache-Control: public, max-age=2592000 (30 days)
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 10. Build voice synthesis service
  - Create voiceService.ts in src/services/ with generateSpeech function
  - Implement ElevenLabs API call with Brian voice ID (hbB2qXyS2GMyyZIZyhAH)
  - Configure eleven_turbo_v2_5 model with settings: stability 0.5, similarity 0.75, style 0.6
  - Remove timeline markers and convert audio cue brackets ([whispers] → whispers) before synthesis
  - Estimate duration based on word count (150 words per minute)
  - Return audio blob with duration
  - _Requirements: 3.1, 3.2, 3.3, 3.5_

- [ ] 11. Create voice API endpoint with fallback
  - Create /api/voice/route.ts with POST handler accepting {text, voice_type, language}
  - Validate request with Zod VoiceRequestSchema
  - Strip timeline markers before sending to ElevenLabs
  - Call ElevenLabs API and return audio/mpeg response
  - Implement fallback to Web Speech API if ELEVENLABS_API_KEY missing or quota exceeded (429)
  - Set proper caching headers: Cache-Control: public, max-age=86400 (24 hours)
  - _Requirements: 3.4, 10.3, 14.2_

- [ ] 12. Implement Audio Queue Manager class
  - Create AudioQueueManager.ts in src/services/ with class managing HTMLAudioElement
  - Implement queue operations: addToQueue (with deduplication), play, pause, resume, playNext, playPrevious, seek, setVolume, clearQueue
  - Add private methods: notifyTimeUpdate, handleError, getSegmentOffset, getOverallProgress
  - Implement event listeners: ended (auto-advance), timeupdate (progress), error (skip-to-next), loadedmetadata (duration)
  - Add listener pattern with subscribe/unsubscribe for state updates
  - Implement blob URL cleanup with URL.revokeObjectURL in clearQueue and destroy methods
  - _Requirements: 4.1, 4.2, 4.5, 11.2, 11.3_

- [ ] 13. Create paragraph detection utility
  - Implement detectParagraph function in src/services/paragraphDetector.ts
  - Check for timeline markers (split before marker as complete paragraph)
  - Check for double newlines (paragraph breaks)
  - Check for 100-180 word count with sentence boundaries
  - Return {isComplete, paragraph, wordCount, remaining}
  - Build ParagraphExtractor class with addText, getParagraphs, getBuffer, flush, reset methods
  - _Requirements: 3.1_

- [ ] 14. Build chat streaming hook
  - Create useChatStream.ts in src/hooks/ with sendMessage function
  - Validate message length (2000 character limit)
  - Clear audio queue on new message
  - Add user and empty assistant messages to store
  - Fetch /api/chat with POST, read stream with ReadableStream reader and TextDecoder
  - Parse NDJSON events: token (append to message), timeline (add inline), error (show toast), done (trigger voice)
  - On done event: remove timeline markers, clean audio cue brackets, call generateSpeech, create AudioQueueItem, add to queue
  - Implement abort controller for cleanup on unmount
  - _Requirements: 2.1, 2.2, 2.3, 3.1, 8.5_

- [ ] 15. Create audio player hook
  - Implement useAudioPlayer.ts in src/hooks/ that initializes AudioQueueManager on mount
  - Subscribe to manager state changes and sync with Zustand store
  - Provide actions: togglePlayPause, play, pause, resume, playNext, playPrevious, seek, setVolume, clearQueue
  - Return playerState: isPlaying, currentTime, duration, currentIndex, volume, hasAudio
  - Implement cleanup: unsubscribe from listeners, destroy manager instance
  - _Requirements: 4.1, 4.2, 11.2, 11.3, 11.4_

- [ ] 16. Build map synchronization hook
  - Create useMapSync.ts in src/hooks/ that watches activeLocation and locationHistory from store
  - Validate timeline items for required fields (place) and coordinate ranges
  - Trigger geocoding for items with place but no lat/lon
  - Update store with geocoded coordinates
  - Add to locationHistory and set as activeLocation
  - Call onLocationUpdate callback when location ready
  - Call onPathUpdate with entire history for polyline rendering
  - Deduplicate by title+year to prevent re-geocoding
  - _Requirements: 6.1, 6.3, 6.4, 12.1, 12.2, 12.3, 12.4, 12.5_

- [ ] 17. Create Leaflet map component
  - Build MapVisualizer.tsx in components/ with dynamic import (ssr: false)
  - Use MapContainer with center and zoom props
  - Add TileLayer using OpenStreetMap tiles
  - Render Marker components for each timeline item with custom icons and animated pulse
  - Add Popup with location details: year, title, description
  - Render Polyline connecting locations in chronological order
  - Implement useEffect hook for panning to new center when prop changes
  - Validate coordinates before panning to avoid errors
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 18. Build audio player UI component
  - Create AudioPlayer.tsx in components/ with compact rounded capsule design
  - Add centered play/pause button with gradient background and icon toggle
  - Implement timeline scrubber with filled progress bar and playhead indicator on hover
  - Display current/total time in monospace font (MM:SS format)
  - Add mute button with volume icon toggle
  - Position absolutely at bottom of map pane with blur backdrop
  - Style with gradient orange borders and smooth transitions
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ] 19. Create timeline card component
  - Build TimelineCard.tsx in components/ with vertical timeline layout
  - Add year badge with orange background positioned on left
  - Display location pin emoji with place name
  - Show title and description with proper typography
  - Add vertical connecting line with gradient (orange-500 to transparent)
  - Implement hover effect with shadow glow
  - Style with gradient card background (#1A1A1A to #0D0D0D) and orange border
  - _Requirements: 5.4, 13.5_

- [ ] 20. Build chat message component
  - Create ChatMessage.tsx in components/ with distinct backgrounds for user (#1A1A1A) and assistant (#1a1919)
  - Remove timeline markers from displayed text using regex replace
  - Render inline timeline items using TimelineCard component
  - Add timestamp display with relative time formatting
  - Style with rounded corners, padding, and smooth transitions
  - _Requirements: 5.5, 9.5_

- [ ] 21. Implement chat input component
  - Create ChatInput.tsx in components/ with textarea for user input
  - Add 2000 character limit validation with count display when over 1800 chars
  - Implement Enter key submission (Shift+Enter for new line)
  - Show loading state with disabled input and animated dots indicator
  - Add auto-resize for textarea based on content
  - Style with dark background, orange border on focus, and smooth transitions
  - _Requirements: 10.1, 10.2_

- [ ] 22. Build chat window component
  - Create ChatWindow.tsx in components/ displaying messages array from store
  - Implement auto-scroll to latest message on new content
  - Show streaming indicator with animated dots when isStreaming is true
  - Add empty state message when no messages exist
  - Style with dark background and custom scrollbar
  - _Requirements: 9.5_

- [ ] 23. Create chat interface layout
  - Build ChatInterface.tsx in components/ with header showing "Hauntify 🎃" title
  - Use flex flex-col layout: header (fixed), ChatWindow (flex-1 overflow-y-auto), ChatInput (fixed bottom)
  - Integrate useChatStream hook for message handling
  - Add Sonner toast notifications for errors
  - Style with dark horror theme and orange accents
  - _Requirements: 9.5, 10.3_

- [ ] 24. Build map pane component
  - Create MapPane.tsx in components/ wrapping MapVisualizer and AudioPlayer
  - Position AudioPlayer absolutely at bottom center
  - Integrate useMapSync hook for location updates
  - Pass locations and center props to MapVisualizer
  - Handle loading state while map initializes
  - _Requirements: 7.1, 7.2, 11.1_

- [ ] 25. Implement responsive layout with tab switcher
  - Create page.tsx in app/ with three layout modes: desktop (lg:flex 60/40), tablet (md:flex 50/50), mobile (tabbed)
  - Build custom tab switcher for mobile with animated gradient backgrounds on active tabs
  - Use state for activeTab and conditional rendering (both components mounted, hide/show with CSS)
  - Add MapPane and ChatInterface components with proper className for responsive behavior
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ] 26. Configure Tailwind CSS with custom theme
  - Create tailwind.config.ts with custom color palette: primary #ff8c00, background #000000, foreground #ffffff
  - Add custom fonts: Montserrat (primary), Elms Sans (headings), JetBrains Mono (code/time)
  - Configure custom animations: glow (for hover effects), gradient (for mobile tabs)
  - Set up purge settings for production optimization
  - _Requirements: 13.1, 13.2, 13.4, 13.5_

- [ ] 27. Create global styles
  - Build globals.css with CSS variables for theme colors
  - Add font family definitions with Google Fonts imports
  - Implement scrollbar hiding for all elements while maintaining scrollability
  - Customize selection color to orange (#c15808)
  - Add glow and gradient animation keyframes
  - Style Leaflet popup with custom dark theme
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [ ] 28. Set up environment variables and configuration
  - Create .env.example with GROQ_API_KEY (required), ELEVENLABS_API_KEY (optional), NOMINATIM_BASE (optional), MAP_TILES_URL (optional), MAP_ATTRIBUTION (optional)
  - Add environment variable validation in API routes
  - Configure Next.js with appDir enabled and runtime set to nodejs for all API routes
  - Set up tsconfig with paths alias for @/ imports
  - _Requirements: 14.1, 14.2, 14.3, 14.4_

- [ ] 29. Add toast notifications and error handling
  - Integrate Sonner in layout.tsx with dark theme and top-center positioning
  - Implement toast notifications in useChatStream for API errors, rate limits, quota exceeded
  - Add error boundaries for React components with fallback UI
  - Implement proper error logging with ErrorHandler utility
  - _Requirements: 10.3, 10.4_

- [ ] 30. Implement session persistence and restoration
  - Add useEffect in page.tsx to load session on mount
  - Generate unique session ID if none exists
  - Restore messages, timeline, and location history from localStorage
  - Implement auto-save on store changes with debouncing
  - Add clear session functionality
  - _Requirements: 8.2, 8.3, 8.4_

- [ ] 31. Add cleanup and memory management
  - Implement abort controllers in useChatStream for stream cleanup on unmount
  - Add blob URL revocation in AudioQueueManager.clearQueue and destroy methods
  - Implement proper cleanup in all hooks with return functions
  - Add event listener cleanup in AudioQueueManager
  - _Requirements: 4.5, 15.5_

- [ ] 32. Create documentation files
  - Write README.md with features list, tech stack, setup instructions, API documentation, project structure, deployment guide
  - Create FEATURE_ROADMAP.md documenting implemented features and future enhancements
  - Add QUALITY_PIPELINE.md explaining the AI generation pipeline
  - Include troubleshooting section in README
  - _Requirements: All_

- [ ]* 33. Add comprehensive error handling tests
  - Write tests for ErrorHandler utility with different severity levels
  - Test API error handling with various status codes (401, 429, 500)
  - Test coordinate validation with edge cases
  - Test HTML sanitization with malicious input
  - _Requirements: 10.4, 6.3_

- [ ]* 34. Create integration tests for streaming pipeline
  - Test end-to-end story generation with timeline extraction
  - Test voice generation trigger after paragraph detection
  - Test map synchronization with geocoding
  - Test audio queue auto-advance
  - _Requirements: 2.1, 2.2, 2.3, 3.1, 6.1, 12.1_

- [ ]* 35. Add unit tests for core utilities
  - Test timeline extraction with malformed JSON markers
  - Test brace-counting parser with incomplete data
  - Test deduplication logic by year+title
  - Test paragraph detection with various word counts
  - Test geocoding service rate limiting
  - _Requirements: 5.1, 5.2, 6.2, 3.1_
