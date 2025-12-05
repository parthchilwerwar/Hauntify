# Requirements Document

## Introduction

Hauntify is a full-stack Next.js 15+ AI-powered horror storytelling application that delivers an immersive cinematic experience through synchronized multi-modal content delivery. The system generates horror stories using AI, converts them to voice narration, extracts historical timeline events, geocodes locations, and visualizes everything in a split-screen interface with interactive map markers—all streaming in real-time with a cohesive horror aesthetic.

## Glossary

- **Hauntify System**: The complete Next.js 15+ web application including frontend UI, backend API routes, and third-party service integrations
- **Story Generator**: The Groq LLaMA 3.3 70B AI model integration that produces horror narratives
- **Voice Narrator**: The ElevenLabs text-to-speech service integration that converts text to audio
- **Timeline Extractor**: The component that parses AI-generated stories to identify historical events with dates
- **Geocoder**: The service that converts location names from stories into geographic coordinates
- **Map Visualizer**: The Leaflet-based interactive map component that displays location markers
- **Audio Queue Manager**: The system that manages sequential playback of multiple voice segments
- **Streaming Pipeline**: The multi-stage data flow that processes story content through text, audio, timeline, and map visualization simultaneously
- **Split-Screen Interface**: The dual-pane UI layout displaying story text and interactive map side-by-side
- **Horror Aesthetic**: The visual design theme using black, orange, and white colors with cinematic styling

## Requirements

### Requirement 1

**User Story:** As a user, I want to generate AI-powered horror stories with a single action, so that I can experience immersive storytelling without complex interactions

#### Acceptance Criteria

1. WHEN the user initiates story generation, THE Hauntify System SHALL invoke the Story Generator with a system prompt that enforces 1-2 paragraph story format beginning with "In the year"
2. THE Hauntify System SHALL stream the generated story text to the Split-Screen Interface in real-time as tokens arrive from the Story Generator
3. THE Hauntify System SHALL display the streaming story text with the Horror Aesthetic color scheme of black, orange, and white
4. WHEN story generation completes, THE Hauntify System SHALL maintain the complete story text visible in the Split-Screen Interface
5. IF the Story Generator fails to respond within 30 seconds, THEN THE Hauntify System SHALL display an error message to the user

### Requirement 2

**User Story:** As a user, I want the story to be narrated with realistic voice audio, so that I can listen to the horror story while viewing the visual elements

#### Acceptance Criteria

1. WHEN the Story Generator produces story text, THE Hauntify System SHALL send the text to the Voice Narrator for conversion to audio
2. THE Hauntify System SHALL segment long story text into chunks of 500 characters or fewer before sending to the Voice Narrator
3. WHEN the Voice Narrator returns audio data, THE Hauntify System SHALL add the audio segment to the Audio Queue Manager
4. THE Audio Queue Manager SHALL play audio segments sequentially without gaps or overlaps between segments
5. THE Hauntify System SHALL provide playback controls allowing the user to pause, resume, and stop the audio narration

### Requirement 3

**User Story:** As a user, I want to see historical events from the story displayed on a timeline, so that I can understand the chronological context of the narrative

#### Acceptance Criteria

1. WHEN the Story Generator produces story text, THE Timeline Extractor SHALL parse the text to identify historical events with associated dates
2. THE Timeline Extractor SHALL extract events that include year information matching the pattern "In the year YYYY" or similar date formats
3. THE Hauntify System SHALL display extracted timeline events in chronological order within the Split-Screen Interface
4. THE Hauntify System SHALL associate each timeline event with its corresponding text position in the story
5. WHEN the user interacts with a timeline event, THE Hauntify System SHALL highlight the corresponding text in the story display

### Requirement 4

**User Story:** As a user, I want to see story locations visualized on an interactive map, so that I can explore the geographic context of the horror narrative

#### Acceptance Criteria

1. WHEN the Story Generator produces story text, THE Geocoder SHALL identify location names within the narrative
2. THE Geocoder SHALL convert identified location names into geographic coordinates with latitude and longitude values
3. THE Map Visualizer SHALL display an interactive Leaflet map within the Split-Screen Interface
4. WHEN the Geocoder returns coordinates, THE Map Visualizer SHALL place animated markers on the map at the corresponding locations
5. THE Map Visualizer SHALL allow the user to pan, zoom, and interact with map markers to view location details

### Requirement 5

**User Story:** As a user, I want all story elements (text, audio, timeline, map) to update simultaneously, so that I experience a cohesive synchronized presentation

#### Acceptance Criteria

1. THE Streaming Pipeline SHALL process story text through text display, Voice Narrator, Timeline Extractor, and Geocoder concurrently
2. WHEN new story text arrives from the Story Generator, THE Hauntify System SHALL update the text display, initiate audio conversion, extract timeline events, and identify locations within 200 milliseconds
3. THE Hauntify System SHALL maintain synchronization between audio playback position and visual highlighting of the corresponding story text
4. THE Hauntify System SHALL update the Map Visualizer with new location markers as they are geocoded without interrupting existing map interactions
5. THE Hauntify System SHALL coordinate all pipeline stages to prevent race conditions or data inconsistencies

### Requirement 6

**User Story:** As a user, I want the application to have a cinematic horror aesthetic, so that the visual design enhances the storytelling atmosphere

#### Acceptance Criteria

1. THE Split-Screen Interface SHALL use a color palette consisting exclusively of black backgrounds, orange accent colors, and white text
2. THE Hauntify System SHALL apply cinematic styling including smooth transitions, dramatic shadows, and atmospheric visual effects
3. THE Split-Screen Interface SHALL divide the viewport into two equal panes displaying story content and the Map Visualizer
4. THE Hauntify System SHALL use typography and spacing that enhances readability while maintaining the Horror Aesthetic
5. THE Hauntify System SHALL ensure the Horror Aesthetic remains consistent across all UI components including buttons, controls, and overlays

### Requirement 7

**User Story:** As a user, I want the application to handle errors gracefully, so that technical failures don't break my experience

#### Acceptance Criteria

1. IF the Story Generator fails to generate content, THEN THE Hauntify System SHALL display an error message and allow the user to retry
2. IF the Voice Narrator fails to convert text to audio, THEN THE Hauntify System SHALL continue displaying story text and timeline without audio
3. IF the Geocoder fails to resolve a location, THEN THE Hauntify System SHALL continue story generation and skip the unresolved location marker
4. IF the Map Visualizer fails to load, THEN THE Hauntify System SHALL display story text, audio, and timeline in a single-pane layout
5. THE Hauntify System SHALL log all errors to the console for debugging purposes without exposing error details to the user

### Requirement 8

**User Story:** As a user, I want the application to be built with Next.js 15+ and modern web technologies, so that I have a fast and reliable experience

#### Acceptance Criteria

1. THE Hauntify System SHALL be implemented using Next.js version 15 or higher with App Router architecture
2. THE Hauntify System SHALL use React Server Components for initial page rendering and data fetching
3. THE Hauntify System SHALL implement API routes for backend services including Story Generator, Voice Narrator, and Geocoder integrations
4. THE Hauntify System SHALL use TypeScript for type safety across frontend and backend code
5. THE Hauntify System SHALL implement proper environment variable management for API keys and service credentials
