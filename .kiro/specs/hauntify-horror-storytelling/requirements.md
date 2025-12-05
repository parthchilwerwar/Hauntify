# Requirements Document

## Introduction

Hauntify is a full-stack Next.js 15+ AI-powered horror storytelling application that combines real-time AI text generation, voice narration with ElevenLabs text-to-speech, interactive map visualization with Leaflet, and timeline extraction—all synchronized in a cinematic split-screen interface with black, orange, and white horror aesthetics. The application implements a sophisticated multi-stage streaming pipeline where AI-generated stories are simultaneously displayed as text, converted to audio narration, parsed for historical timeline events, geocoded to real locations, and visualized on an interactive map with animated markers.

## Glossary

- **Hauntify**: The AI-powered horror storytelling application system
- **Story Generator**: The AI component using Groq's LLaMA 3.3 70B model for generating horror stories
- **Voice Synthesizer**: The text-to-speech component using ElevenLabs API or Web Speech API fallback
- **Audio Queue Manager**: The custom audio playback system managing multiple voice segments
- **Timeline Extractor**: The parser that identifies and extracts timeline markers from AI-generated text
- **Geocoding Service**: The component that converts location names to latitude/longitude coordinates using Nominatim API
- **Map Visualizer**: The Leaflet-based interactive map component displaying story locations
- **Chat Interface**: The user interface for inputting prompts and viewing generated stories
- **State Store**: The Zustand-based state management system with localStorage persistence
- **Streaming Pipeline**: The server-sent events system delivering real-time story generation

## Requirements

### Requirement 1: AI Story Generation

**User Story:** As a user, I want to submit storytelling prompts and receive AI-generated horror stories with specific formatting, so that I can experience immersive storytelling with consistent structure.

#### Acceptance Criteria

1. WHEN a user submits a chat message, THE Story Generator SHALL stream a response using Groq's LLaMA 3.3 70B model with a system prompt that enforces 1-2 paragraph stories beginning with "In the year [YEAR], in [LOCATION], ..." format
2. WHILE generating stories, THE Story Generator SHALL include atmospheric sound effect tags like [whispers], [exhales], [laughs] naturally throughout the narrative
3. THE Story Generator SHALL emit hidden timeline markers in the format ##TIMELINE## {"year":YYYY, "title":"...", "desc":"...", "place":"City, Country"} after each story
4. THE Story Generator SHALL keep stories between 100-180 words per paragraph with exactly 1-2 paragraphs total
5. THE Story Generator SHALL use specific real city names with proper formatting and vary locations across different horror themes (gothic, tech, historical, mystery, tropical, arctic)

### Requirement 2: Real-Time Streaming Pipeline

**User Story:** As a user, I want to see stories appear in real-time as they're generated, so that I can experience the narrative unfolding dynamically.

#### Acceptance Criteria

1. WHEN the Story Generator produces content, THE Streaming Pipeline SHALL deliver tokens via Server-Sent Events using NDJSON format with {"type":"token","data":"..."} events
2. THE Streaming Pipeline SHALL emit {"type":"timeline","data":{...}} events when timeline markers are detected
3. THE Streaming Pipeline SHALL emit {"type":"done","data":null} event when story generation completes
4. THE Streaming Pipeline SHALL use robust timeline extraction with brace-counting JSON parsing to handle malformed markers
5. THE Streaming Pipeline SHALL implement buffer management to prevent infinite loops during parsing

### Requirement 3: Voice Narration System

**User Story:** As a user, I want to hear AI-generated stories narrated with dramatic voice synthesis, so that I can experience an immersive audio storytelling experience.

#### Acceptance Criteria

1. WHEN a complete paragraph is detected (100-180 words or timeline marker), THE Voice Synthesizer SHALL automatically trigger voice generation for the entire story at once
2. THE Voice Synthesizer SHALL use ElevenLabs' Brian voice (hbB2qXyS2GMyyZIZyhAH) with slowed-down dramatic settings (stability 0.5, similarity 0.75, style 0.6)
3. THE Voice Synthesizer SHALL remove timeline markers and convert audio cue brackets (e.g., [whispers] → whispers) before synthesis to make narration natural
4. IF ElevenLabs API key is missing or quota exceeded, THEN THE Voice Synthesizer SHALL fall back to Web Speech API
5. THE Voice Synthesizer SHALL estimate duration based on word count (150 words per minute) and return audio blobs with durations

### Requirement 4: Audio Queue Management

**User Story:** As a user, I want to control audio playback with play/pause/seek/volume controls, so that I can manage the narration experience.

#### Acceptance Criteria

1. THE Audio Queue Manager SHALL store audio blobs with durations and support play/pause/resume/seek/volume controls
2. THE Audio Queue Manager SHALL auto-advance through queued segments when one segment ends
3. THE Audio Queue Manager SHALL display a compact rounded audio player with gradient styling at the bottom center of the map pane
4. THE Audio Queue Manager SHALL show current time and total duration in monospace font with a timeline scrubber and playhead indicator
5. THE Audio Queue Manager SHALL properly cleanup blob URLs with URL.revokeObjectURL to prevent memory leaks

### Requirement 5: Timeline Extraction and Display

**User Story:** As a user, I want to see historical timeline events extracted from stories and displayed as cards, so that I can understand the chronological context of the narrative.

#### Acceptance Criteria

1. WHEN timeline markers are detected in the stream, THE Timeline Extractor SHALL parse JSON using brace-counting to handle incomplete markers
2. THE Timeline Extractor SHALL deduplicate timeline items by title+year key and sort by year ascending
3. THE Timeline Extractor SHALL add timeline items to the last assistant message's timelineItems array for inline display
4. THE Chat Interface SHALL render timeline items as cards with year badges, location pins, titles, and descriptions with vertical connecting lines
5. THE Chat Interface SHALL remove timeline markers from displayed text using regex replace before showing to users

### Requirement 6: Geocoding and Location Services

**User Story:** As a user, I want story locations to be automatically geocoded and displayed on a map, so that I can visualize where events take place.

#### Acceptance Criteria

1. WHEN a timeline event contains a place name, THE Geocoding Service SHALL automatically geocode it using Nominatim OpenStreetMap API
2. THE Geocoding Service SHALL enforce 1 request per second rate limiting server-side
3. THE Geocoding Service SHALL cache responses for 30 days and validate coordinates to ensure they're within valid latitude/longitude ranges (lat -90 to 90, lon -180 to 180)
4. THE Geocoding Service SHALL update the State Store with lat/lon data and add to locationHistory
5. IF geocoding fails or coordinates are invalid, THEN THE Geocoding Service SHALL log errors and allow timeline display without map markers

### Requirement 7: Interactive Map Visualization

**User Story:** As a user, I want to see story locations visualized on an interactive map with animated markers, so that I can explore the geographical context of the narrative.

#### Acceptance Criteria

1. THE Map Visualizer SHALL display locations using Leaflet with OpenStreetMap tiles and custom markers with animated pulses
2. WHEN a new location is geocoded, THE Map Visualizer SHALL pan to the new location with zoom level 12
3. THE Map Visualizer SHALL maintain a history of all visited locations and render a polyline path connecting them in order
4. THE Map Visualizer SHALL display popup tooltips with location details (year, title, description) when markers are clicked
5. THE Map Visualizer SHALL validate coordinates before panning to avoid infinite geocoding loops

### Requirement 8: State Management and Persistence

**User Story:** As a user, I want my chat sessions to be saved and restored, so that I can continue my storytelling experience across browser sessions.

#### Acceptance Criteria

1. THE State Store SHALL manage messages array with inline timeline items, streaming state, audio queue with blob URLs and durations, location history with geocoded coordinates, and active location for map focus
2. THE State Store SHALL persist data to localStorage using createSession, saveSession, updateSession, and loadSession functions
3. THE State Store SHALL generate unique session IDs and serialize messages and timeline data
4. THE State Store SHALL restore sessions on mount with proper deserialization
5. THE State Store SHALL clear audio queue when new messages are sent to prevent playback conflicts

### Requirement 9: Responsive User Interface

**User Story:** As a user, I want the application to work seamlessly on desktop, tablet, and mobile devices, so that I can experience horror storytelling on any device.

#### Acceptance Criteria

1. THE Chat Interface SHALL display a desktop split-screen layout with 60% map and 40% chat above 1024px width
2. THE Chat Interface SHALL display a tablet 50/50 split layout between 768px and 1023px width
3. THE Chat Interface SHALL display a mobile tabbed interface with custom styled tab switcher featuring animated gradient backgrounds below 768px width
4. THE Chat Interface SHALL keep both map and chat components mounted but hide/show with CSS for smooth transitions
5. THE Chat Interface SHALL style chat messages with distinct backgrounds for user (#1A1A1A) and assistant (#1a1919) messages

### Requirement 10: Input Validation and Error Handling

**User Story:** As a user, I want clear feedback when errors occur or limits are reached, so that I can understand what went wrong and how to proceed.

#### Acceptance Criteria

1. THE Chat Interface SHALL validate user input with 2000 character limit and show count when over 1800 characters
2. THE Chat Interface SHALL sanitize input by stripping HTML before sending to API
3. THE Hauntify SHALL display user-friendly toast notifications using Sonner for API errors, rate limits, and quota exceeded messages
4. THE Hauntify SHALL implement comprehensive error handling with ErrorHandler utility for logging warnings and errors with severity levels
5. THE Hauntify SHALL use Zod schemas for validating chat requests and voice requests on the server

### Requirement 11: Audio Player Controls

**User Story:** As a user, I want a polished audio player interface with visual feedback, so that I can easily control narration playback.

#### Acceptance Criteria

1. THE Audio Queue Manager SHALL display a compact rounded capsule with gradient orange borders positioned at the bottom of the map pane
2. THE Audio Queue Manager SHALL show a centered play/pause button with gradient background that toggles playback state
3. THE Audio Queue Manager SHALL display a timeline scrubber with filled progress bar that updates in real-time
4. THE Audio Queue Manager SHALL show a playhead indicator on hover over the scrubber for precise seeking
5. THE Audio Queue Manager SHALL include a mute button and use blur backdrop for visual polish

### Requirement 12: Map Synchronization

**User Story:** As a user, I want the map to automatically update and focus on new locations as they appear in stories, so that I can follow the narrative geographically.

#### Acceptance Criteria

1. WHEN a timeline event with a place name is added, THE Map Visualizer SHALL trigger geocoding if coordinates are not present
2. WHEN geocoding completes successfully, THE Map Visualizer SHALL update the State Store with lat/lon data
3. WHEN coordinates are available, THE Map Visualizer SHALL pan to the new location and update activeLocation in the store
4. THE Map Visualizer SHALL deduplicate locations by title+year to prevent re-geocoding the same place
5. THE Map Visualizer SHALL call onPathUpdate callback with entire location history for polyline rendering

### Requirement 13: Theme and Styling

**User Story:** As a user, I want a dark, atmospheric horror-themed interface with orange accents, so that I can experience an immersive cinematic aesthetic.

#### Acceptance Criteria

1. THE Hauntify SHALL use a color palette with black background (#000000), orange primary (#ff8c00), and white foreground (#ffffff)
2. THE Hauntify SHALL use custom fonts: Montserrat for primary text, Elms Sans for headings, and JetBrains Mono for code/time displays
3. THE Hauntify SHALL hide scrollbars globally while maintaining scrollability
4. THE Hauntify SHALL customize selection color to orange (#c15808) and implement glow animations for hover effects
5. THE Hauntify SHALL use gradient backgrounds, glowing borders on hover, smooth transitions, and animated gradients for mobile tab switcher

### Requirement 14: API Configuration and Security

**User Story:** As a developer, I want secure API configuration with proper environment variables, so that sensitive credentials are protected.

#### Acceptance Criteria

1. THE Hauntify SHALL require GROQ_API_KEY environment variable for AI story generation
2. THE Hauntify SHALL accept optional ELEVENLABS_API_KEY environment variable and fall back to Web Speech API without it
3. THE Hauntify SHALL accept optional NOMINATIM_BASE, MAP_TILES_URL, and MAP_ATTRIBUTION environment variables for custom tile servers
4. THE Hauntify SHALL never expose API keys to the client and use server-side API routes for all external calls
5. THE Hauntify SHALL implement proper CSP headers for security and validate all API responses before processing

### Requirement 15: Performance and Optimization

**User Story:** As a user, I want fast load times and smooth performance, so that I can enjoy storytelling without delays or lag.

#### Acceptance Criteria

1. THE Hauntify SHALL implement lazy loading for the map component using dynamic import with ssr: false
2. THE Hauntify SHALL cache voice audio for 24 hours and geocoding results for 30 days
3. THE Hauntify SHALL use code splitting to reduce initial bundle size
4. THE Hauntify SHALL preload critical resources (fonts, map tiles) and implement proper cleanup in all hooks
5. THE Hauntify SHALL abort fetch requests on component unmount and revoke blob URLs to prevent memory leaks
