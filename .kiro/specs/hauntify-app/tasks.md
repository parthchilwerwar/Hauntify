# Implementation Plan

## Status: Implementation Complete ✅

All core features have been implemented and are functional. The application successfully delivers:
- AI-powered horror story generation with streaming
- Professional voice narration with ElevenLabs TTS
- Interactive timeline extraction and display
- Real-time map visualization with geocoding
- Responsive split-screen interface with horror aesthetic
- Session persistence and audio queue management

---

## Completed Tasks

- [x] 1. Set up project structure and core interfaces
  - Created Next.js 16 App Router structure with TypeScript
  - Configured Tailwind CSS v4 with horror theme (black/orange/white)
  - Set up Zustand store for state management
  - Implemented Zod schemas for validation
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 2. Implement streaming chat with Groq API
  - [x] 2.1 Create /api/chat endpoint with SSE streaming
    - Built streaming endpoint with NDJSON event format
    - Integrated Groq LLaMA 3.3 70B with system prompt
    - Implemented 2-stage pipeline with quality enhancement
    - _Requirements: 1.1, 1.2, 1.3_
  
  - [x] 2.2 Implement useChatStream hook
    - Created hook for managing streaming state
    - Added message validation and sanitization
    - Integrated voice generation trigger on completion
    - _Requirements: 1.1, 1.2, 1.4_
  
  - [x] 2.3 Build ChatWindow and ChatMessage components
    - Implemented auto-scrolling message display
    - Added streaming indicator with animated dots
    - Cleaned timeline markers from displayed content
    - _Requirements: 1.2, 1.3_
  
  - [x] 2.4 Create ChatInput with validation
    - Added 2000 character limit with counter
    - Implemented HTML sanitization
    - Added disabled state during streaming
    - _Requirements: 1.1, 7.1_

- [x] 3. Implement voice narration system
  - [x] 3.1 Create /api/voice endpoint
    - Integrated ElevenLabs API with Brian voice
    - Implemented text cleaning (remove markers and brackets)
    - Added error handling with fallback messaging
    - _Requirements: 2.1, 2.2_
  
  - [x] 3.2 Build ElevenLabs service
    - Created service for TTS API calls
    - Implemented blob URL generation
    - Added duration estimation
    - _Requirements: 2.1, 2.2_
  
  - [x] 3.3 Implement AudioQueueManager class
    - Built custom audio queue with sequential playback
    - Added play/pause/resume/seek/skip controls
    - Implemented listener pattern for state updates
    - Added blob URL cleanup to prevent memory leaks
    - _Requirements: 2.3, 2.4, 2.5_
  
  - [x] 3.4 Create AudioPlayer component
    - Built compact player with gradient styling
    - Added progress bar with scrubber
    - Implemented volume control and mute
    - Added time display (current/total)
    - _Requirements: 2.5_
  
  - [x] 3.5 Build useAudioPlayer hook
    - Wrapped AudioQueueManager in React hook
    - Managed subscription lifecycle
    - Synced with Zustand audio queue
    - _Requirements: 2.3, 2.4, 2.5_

- [x] 4. Implement timeline extraction and display
  - [x] 4.1 Create timeline extraction service
    - Built server-side parser for ##TIMELINE## markers
    - Implemented JSON validation with Zod
    - Added deduplication by title+year
    - Sorted items chronologically
    - _Requirements: 3.1, 3.2, 3.4_
  
  - [x] 4.2 Integrate timeline extraction in streaming
    - Modified /api/chat to emit timeline events
    - Removed markers from story text before display
    - Added real-time timeline event emission
    - _Requirements: 3.1, 3.2_
  
  - [x] 4.3 Build TimelineInChat component
    - Created vertical timeline cards with connecting lines
    - Added year badges and location pins
    - Implemented hover effects with shadow glow
    - Styled with horror aesthetic
    - _Requirements: 3.3, 3.4_
  
  - [x] 4.4 Add timeline items to messages
    - Stored timeline items inline with messages
    - Updated ChatMessage to display timeline
    - Maintained association with story text
    - _Requirements: 3.4, 3.5_

- [x] 5. Implement map visualization with geocoding
  - [x] 5.1 Create /api/geocode endpoint
    - Integrated Nominatim API with rate limiting (1 req/sec)
    - Implemented 30-day response caching
    - Added coordinate validation
    - _Requirements: 4.1, 4.2_
  
  - [x] 5.2 Build geocoding service
    - Created getCoords function with error handling
    - Implemented in-memory cache with TTL
    - Added coordinate validation (-90 to 90, -180 to 180)
    - _Requirements: 4.2_
  
  - [x] 5.3 Create LeafletMap component
    - Integrated Leaflet with dark theme tiles
    - Implemented animated markers with orange glow
    - Added polyline paths between locations
    - Created custom popups with event details
    - Implemented auto-pan with zoom level 12
    - _Requirements: 4.3, 4.4, 4.5_
  
  - [x] 5.4 Build MapPane container
    - Created container for map and audio player
    - Added error handling for invalid coordinates
    - Implemented voice generation indicator
    - _Requirements: 4.3, 4.4_
  
  - [x] 5.5 Implement useMapSync hook
    - Created hook for geocoding and map updates
    - Added automatic geocoding for new locations
    - Implemented coordinate validation
    - Updated store with geocoded coordinates
    - _Requirements: 4.1, 4.2, 4.4_

- [x] 6. Implement synchronized streaming pipeline
  - [x] 6.1 Coordinate concurrent processing
    - Set up parallel text display, audio, timeline, and geocoding
    - Implemented NDJSON event streaming
    - Added proper error handling for each stage
    - _Requirements: 5.1, 5.2_
  
  - [x] 6.2 Ensure synchronization timing
    - Optimized event processing to <200ms
    - Implemented real-time UI updates
    - Added proper state management
    - _Requirements: 5.2_
  
  - [x] 6.3 Implement audio-text synchronization
    - Coordinated audio playback with text display
    - Maintained queue state across components
    - _Requirements: 5.3_
  
  - [x] 6.4 Handle map updates without interruption
    - Implemented smooth marker additions
    - Prevented map interaction disruption
    - Added flyTo animations
    - _Requirements: 5.4_
  
  - [x] 6.5 Prevent race conditions
    - Used proper async/await patterns
    - Implemented abort controllers for cleanup
    - Added state validation before updates
    - _Requirements: 5.5_

- [x] 7. Implement cinematic horror aesthetic
  - [x] 7.1 Apply color palette throughout
    - Configured Tailwind with black/orange/white theme
    - Applied consistent colors to all components
    - Added gradient effects
    - _Requirements: 6.1_
  
  - [x] 7.2 Add cinematic styling
    - Implemented smooth transitions
    - Added dramatic shadows and glows
    - Created atmospheric visual effects
    - _Requirements: 6.2_
  
  - [x] 7.3 Build split-screen layout
    - Created 60/40 desktop layout (map/chat)
    - Implemented 50/50 tablet layout
    - Added tabbed mobile interface
    - _Requirements: 6.3_
  
  - [x] 7.4 Optimize typography and spacing
    - Configured custom fonts (Montserrat, Elms Sans, JetBrains Mono)
    - Optimized readability with proper spacing
    - Maintained horror aesthetic
    - _Requirements: 6.4_
  
  - [x] 7.5 Ensure consistency across components
    - Applied theme to buttons, controls, overlays
    - Standardized component styling
    - Added consistent hover effects
    - _Requirements: 6.5_

- [x] 8. Implement error handling and graceful degradation
  - [x] 8.1 Handle story generation failures
    - Added error messages with retry option
    - Implemented toast notifications
    - Logged errors for debugging
    - _Requirements: 7.1_
  
  - [x] 8.2 Handle voice generation failures
    - Continued story display without audio
    - Showed user-friendly error messages
    - Maintained timeline functionality
    - _Requirements: 7.2_
  
  - [x] 8.3 Handle geocoding failures
    - Skipped unresolved locations
    - Continued story generation
    - Logged warnings for debugging
    - _Requirements: 7.3_
  
  - [x] 8.4 Handle map loading failures
    - Implemented single-pane fallback layout
    - Maintained story, audio, and timeline
    - Added error boundary
    - _Requirements: 7.4_
  
  - [x] 8.5 Implement comprehensive error logging
    - Created ErrorHandler utility
    - Added severity levels (minor, major, critical)
    - Logged to console without exposing details to users
    - _Requirements: 7.5_

- [x] 9. Implement session persistence
  - [x] 9.1 Create storage utilities
    - Built localStorage wrapper functions
    - Implemented session creation and updates
    - Added proper serialization
    - _Requirements: 5.1, 5.2_
  
  - [x] 9.2 Integrate persistence in Zustand store
    - Added automatic save on state updates
    - Implemented session restoration on load
    - Maintained audio queue with blob URLs
    - _Requirements: 5.1, 5.2_
  
  - [x] 9.3 Handle blob URL lifecycle
    - Created blob URLs for audio
    - Implemented proper cleanup with revokeObjectURL
    - Prevented memory leaks
    - _Requirements: 5.1, 5.2_

- [x] 10. Build responsive UI and landing page
  - [x] 10.1 Create landing page
    - Built hero section with background image
    - Added features showcase with MagicCard
    - Created animated timeline for "How It Works"
    - Implemented footer with branding
    - _Requirements: 6.3_
  
  - [x] 10.2 Create dashboard page
    - Implemented split-screen layout for desktop
    - Added 50/50 layout for tablet
    - Built tabbed interface for mobile
    - Maintained component mounting across tabs
    - _Requirements: 6.3_
  
  - [x] 10.3 Optimize mobile experience
    - Created animated tab switcher
    - Optimized touch interactions
    - Ensured audio player accessibility
    - _Requirements: 6.3_

---

## Remaining Work

### Documentation and Polish

- [ ] 11. Complete design document
  - [ ] 11.1 Finish Correctness Properties section
    - Add property definitions based on requirements
    - Document testable properties for each acceptance criterion
    - Reference specific requirements for each property
    - _Requirements: All_
  
  - [ ] 11.2 Add Testing Strategy section
    - Document unit testing approach
    - Document property-based testing approach
    - Specify testing libraries and configuration
    - _Requirements: All_
  
  - [ ] 11.3 Add Error Handling section
    - Document error handling patterns
    - Specify error severity levels
    - Document user-facing error messages
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

### Testing (Optional - marked for future enhancement)

- [ ]* 12. Expand test coverage
  - [ ]* 12.1 Add property-based tests for timeline extraction
    - Test timeline parsing with random inputs
    - Verify deduplication logic
    - Test chronological sorting
    - _Requirements: 3.1, 3.2, 3.4_
  
  - [ ]* 12.2 Add property-based tests for coordinate validation
    - Test validation with random coordinates
    - Verify bounds checking
    - Test sanitization logic
    - _Requirements: 4.2_
  
  - [ ]* 12.3 Add integration tests for streaming pipeline
    - Test end-to-end story generation
    - Verify timeline extraction during streaming
    - Test voice generation trigger
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [ ]* 12.4 Add unit tests for AudioQueueManager
    - Test queue operations (add, play, pause, skip)
    - Verify state notifications
    - Test blob URL cleanup
    - _Requirements: 2.3, 2.4, 2.5_
  
  - [ ]* 12.5 Add integration tests for map synchronization
    - Test geocoding integration
    - Verify map updates
    - Test coordinate validation
    - _Requirements: 4.1, 4.2, 4.4, 4.5_

### Performance Optimization (Optional)

- [ ]* 13. Performance enhancements
  - [ ]* 13.1 Optimize streaming performance
    - Profile token processing time
    - Optimize event emission
    - Reduce re-renders
    - _Requirements: 5.2_
  
  - [ ]* 13.2 Optimize map rendering
    - Implement marker clustering for many locations
    - Optimize polyline rendering
    - Add viewport-based rendering
    - _Requirements: 4.3, 4.4, 4.5_
  
  - [ ]* 13.3 Optimize audio loading
    - Implement audio preloading
    - Add loading indicators
    - Optimize blob URL management
    - _Requirements: 2.1, 2.2, 2.3_

---

## Notes

- All core functionality is implemented and working
- The application successfully meets all 8 main requirements
- Error handling is comprehensive with graceful degradation
- The horror aesthetic is consistently applied throughout
- Session persistence works correctly with localStorage
- The streaming pipeline coordinates all components effectively
- Optional tasks marked with `*` are enhancements for future iterations
