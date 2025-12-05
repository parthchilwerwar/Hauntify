# AI Motion Designer Prompt for Hauntify Landing Page

## Project Overview
Create cinematic horror-themed animations for **Hauntify** - an AI-powered horror storytelling web application with voice narration, interactive maps, and timeline visualization. The app uses a dark aesthetic with purple/fuchsia gradients, black backgrounds, and white text.

## Brand Identity
- **Name**: Hauntify (Spectral Voice AI)
- **Tagline**: "AI-Powered Horror Storytelling with Voice, Maps & Timeline"
- **Theme**: Cinematic horror, supernatural, dark fantasy
- **Color Palette**: 
  - Primary: Deep blacks (#000000, #0a0a0a)
  - Accent: Purple (#a855f7, #9333ea), Fuchsia (#d946ef, #e879f9)
  - Highlights: White (#ffffff), Gray (#d1d5db)
- **Mood**: Atmospheric, suspenseful, immersive, cinematic, mysterious

## Animation Requirements

### 1. Hero Section Animation (0-5 seconds)
**Scene**: Main landing hero with title reveal

**Elements to Animate**:
- **Title Text**: "Spectral Voice AI" 
  - Effect: Glitch reveal with ghostly fade-in
  - Typography: Bold, large (9xl), gradient purple-to-fuchsia
  - Motion: Letters materialize from fog/mist particles
  - Glow: Pulsing purple glow around text
  
- **Pumpkin Emoji** (🎃)
  - Effect: Gentle pulsing glow animation
  - Motion: Subtle rotation (±5 degrees)
  - Lighting: Orange inner glow that intensifies and fades
  
- **Floating Horror Icons** (Ghost 👻, Witch Hat 🧙, Bat 🦇, Skull 💀, Pumpkin 🎃)
  - Effect: Parallax floating with depth
  - Motion: Slow drift up/down/sideways with rotation
  - Blur: Background icons have gaussian blur
  - Opacity: 60-80% with fade in/out
  - Positions: Scattered around hero (top-left, top-right, center-left, center-right, bottom corners)

- **Subtitle Text**: "AI-Powered Horror Storytelling"
  - Effect: Typewriter reveal with cursor
  - Timing: Starts after title completes (2s delay)
  - Speed: 50ms per character

- **CTA Button**: "Start Your Horror Story"
  - Effect: Gradient shimmer animation
  - Motion: Gentle scale pulse (1.0 → 1.05 → 1.0)
  - Glow: Purple shadow that pulses
  - Sparkles: Particle sparkles around button

**Background**:
- Animated gradient mesh (purple/fuchsia/black)
- Subtle fog/mist particles drifting
- Vignette darkening at edges

**Duration**: 5 seconds
**Loop**: Yes (after initial reveal)

---

### 2. Feature Cards Animation (5-10 seconds)
**Scene**: Six feature cards appearing in grid

**Cards to Animate** (in order):
1. 🎙️ **AI Voice Narration** - Orange-to-red gradient
2. 🗺️ **Interactive Maps** - Red-to-orange gradient
3. 📅 **Timeline Extraction** - Amber-to-orange gradient
4. 🎵 **Audio Queue** - Orange-to-red gradient
5. 💬 **Streaming AI** - Amber-to-orange gradient
6. 📱 **Responsive Design** - Orange-to-red gradient

**Animation Sequence**:
- **Entrance**: Staggered fade-in from bottom (100ms delay between each)
- **Card Motion**: 
  - Slide up from Y+50px with ease-out
  - Fade from 0% to 100% opacity
  - Scale from 0.95 to 1.0
- **Emoji Animation**: 
  - Gentle float (up/down 10px)
  - Rotation (±3 degrees)
  - Scale pulse on hover (1.0 → 1.1)
- **Border Glow**: 
  - Purple border that intensifies on hover
  - Shadow grows from 0 to 40px blur
- **Background Gradient**: 
  - Subtle gradient overlay fades in on hover (0% → 10% opacity)

**Hover State**:
- Card lifts up (-8px translateY)
- Border color intensifies (purple-500/30 → purple-500/60)
- Shadow expands and glows
- Emoji scales up 110%

**Duration**: 5 seconds (staggered)
**Loop**: Hover states only

---

### 3. Timeline "How It Works" Animation (10-18 seconds)
**Scene**: Vertical timeline with 6 steps

**Steps to Animate**:
1. 💭 **Ask "What if..."** - Orange-to-amber gradient
2. ✨ **AI Streams Story** - Amber-to-orange gradient
3. 🎙️ **Voice Narration** - Orange-to-red gradient
4. 📅 **Timeline Appears** - Red-to-orange gradient
5. 🗺️ **Map Updates** - Orange-to-amber gradient
6. 🎮 **Control Playback** - Violet-to-purple gradient

**Animation Sequence**:
- **Timeline Line**: 
  - Vertical gradient line draws from top to bottom
  - Purple-to-fuchsia-to-purple gradient
  - Glowing effect as it draws
  - Duration: 2 seconds

- **Step Nodes** (numbered circles):
  - Appear sequentially after line reaches them
  - Scale from 0 to 1.0 with bounce
  - Gradient background with glow
  - Number fades in
  - Pulse animation (scale 1.0 → 1.05 → 1.0)

- **Content Cards**:
  - Slide in from left (even steps) or right (odd steps)
  - Fade in with card content
  - 200ms delay after node appears
  - Ease-out motion

- **Emoji Icons**:
  - Pop in with scale animation (0 → 1.2 → 1.0)
  - Gentle rotation on entrance
  - Continuous float animation

**Duration**: 8 seconds
**Loop**: Timeline line pulses, nodes glow

---

### 4. Demo Preview Section Animation (18-23 seconds)
**Scene**: App interface preview mockup

**Elements to Animate**:
- **Container Border**:
  - Animated gradient border (purple-to-fuchsia)
  - Border glow pulses
  - Shadow expands on hover

- **Ghost Emoji** (👻):
  - Float animation (up/down 20px)
  - Gentle rotation (±5 degrees)
  - Scale pulse (1.0 → 1.05 → 1.0)
  - Opacity fade (90% → 100% → 90%)

- **Feature Tags** (🗺️ Interactive Maps, 💬 AI Chat, 📅 Timeline Cards, 🎵 Audio Player):
  - Staggered fade-in from bottom
  - Slide up with bounce
  - Hover: Scale up, border glow intensifies
  - Background gradient shifts

- **Split-screen Text**:
  - Gradient text animation (purple-to-fuchsia sweep)
  - Glow effect pulses

**Duration**: 5 seconds
**Loop**: Float and pulse animations

---

### 5. Final CTA Section Animation (23-28 seconds)
**Scene**: Bottom call-to-action

**Elements to Animate**:
- **Title Text**: "Ready to Summon Horror?"
  - Glitch effect on "Summon"
  - Gradient sweep animation
  - Glow intensifies

- **CTA Button**: "Enter the Darkness"
  - Gradient shimmer (left to right sweep)
  - Scale pulse (1.0 → 1.1 → 1.0)
  - Shadow glow expands
  - Sparkle particles around button
  - Arrow icon slides right on hover

- **Checkmarks** (✓ 100% Free, ✓ No Signup, ✓ Powered by AI):
  - Staggered check animation
  - Fade in with scale
  - Green-to-purple color transition

**Duration**: 5 seconds
**Loop**: Button pulse and shimmer

---

## Technical Specifications

### Animation Style
- **Easing**: Ease-out for entrances, ease-in-out for loops
- **Duration**: 300-500ms for micro-interactions, 1-2s for major animations
- **Stagger Delay**: 100-200ms between sequential elements
- **Frame Rate**: 60fps
- **Format**: MP4, WebM, or Lottie JSON

### Motion Principles
1. **Anticipation**: Elements wind up before major movements
2. **Follow-through**: Overshoots with bounce-back
3. **Easing**: Natural acceleration/deceleration
4. **Staging**: Clear focal points, one action at a time
5. **Timing**: Faster for small objects, slower for large
6. **Secondary Action**: Supporting animations (particles, glows)

### Effects Library
- **Glow**: Gaussian blur with color overlay (purple/fuchsia)
- **Particles**: Small dots/sparkles that drift and fade
- **Gradient Sweep**: Animated gradient position
- **Glitch**: RGB split, displacement, scan lines
- **Float**: Sine wave motion (Y-axis)
- **Pulse**: Scale and opacity oscillation
- **Shimmer**: Highlight sweep across surface

### Responsive Considerations
- **Desktop** (1024px+): Full animations, parallax effects
- **Tablet** (768-1023px): Simplified animations, reduced particles
- **Mobile** (<768px): Essential animations only, performance optimized

---

## Deliverables

### Primary Animations (Required)
1. **Hero Section** - Full animation (5s, looping)
2. **Feature Cards** - Entrance sequence (5s, hover states)
3. **Timeline Steps** - Sequential reveal (8s, looping)
4. **CTA Button** - Shimmer and pulse (continuous loop)

### Secondary Animations (Optional)
5. **Background Mesh** - Animated gradient (continuous)
6. **Floating Icons** - Parallax drift (continuous)
7. **Particle System** - Ambient particles (continuous)
8. **Hover States** - All interactive elements

### File Formats
- **Video**: MP4 (H.264), WebM (VP9) - for background/hero
- **Lottie**: JSON format - for icons and micro-interactions
- **GIF**: Fallback for older browsers
- **Sprite Sheet**: For frame-by-frame animations

### Optimization
- **File Size**: <2MB per animation
- **Resolution**: 1920x1080 for full-screen, 512x512 for icons
- **Compression**: Balanced quality/size
- **Loading**: Lazy load below-fold animations

---

## Reference Mood & Style

### Visual References
- **Horror Aesthetic**: Subtle, atmospheric (not jump-scare)
- **Cinematic**: Film-quality motion blur and depth
- **Supernatural**: Ethereal glows, ghostly trails
- **Modern**: Clean, minimal, not cheesy

### Motion References
- **Apple Product Launches**: Smooth, confident reveals
- **Stripe Website**: Gradient animations, card interactions
- **Linear App**: Fast, snappy micro-interactions
- **Framer Motion**: Physics-based spring animations

### Color Grading
- **Shadows**: Deep blacks with purple tint
- **Midtones**: Desaturated with purple/fuchsia accents
- **Highlights**: Bright whites with glow
- **Contrast**: High contrast for drama

---

## Implementation Notes

### Integration with Landing Page
- Animations will be added to existing React components
- Use Framer Motion for React-based animations
- Lottie files for complex icon animations
- CSS animations for simple effects
- Video backgrounds for hero section

### Performance Budget
- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <3.5s
- **Animation FPS**: 60fps (no jank)
- **Total Animation Assets**: <5MB

### Accessibility
- **Reduced Motion**: Respect `prefers-reduced-motion` media query
- **Fallbacks**: Static images for users who disable animations
- **Focus States**: Clear focus indicators for keyboard navigation

---

## Example Prompt for Each Section

### Hero Animation Prompt
"Create a cinematic horror hero animation: Large bold text 'Spectral Voice AI' materializes from purple mist particles with glitch effect. Gradient purple-to-fuchsia text with pulsing glow. Floating horror emojis (ghost, pumpkin, bat, skull, witch hat) drift in parallax with gaussian blur. Animated gradient mesh background (black/purple/fuchsia). Pumpkin emoji pulses with orange glow. CTA button shimmers with gradient sweep and sparkle particles. Dark, atmospheric, 60fps, 5 seconds, looping."

### Feature Cards Prompt
"Animate 6 feature cards in 3-column grid: Staggered entrance from bottom (100ms delay each), slide up 50px with fade-in and scale 0.95→1.0. Each card has emoji that floats gently. On hover: card lifts -8px, purple border glows, shadow expands, emoji scales 110%. Cards have gradient overlays (orange/red/amber). Modern, smooth, 60fps, 5 seconds."

### Timeline Prompt
"Vertical timeline with 6 steps: Purple gradient line draws top-to-bottom (2s). Numbered circles appear sequentially with bounce, gradient backgrounds glow. Content cards slide in alternating left/right with fade. Emojis pop in with scale animation. Continuous pulse on nodes. Cinematic, smooth, 60fps, 8 seconds, looping."

---

## Questions for Motion Designer

1. Do you prefer Lottie JSON or video format for hero section?
2. Should floating icons have physics-based motion or keyframed?
3. Do you want particle systems for ambient atmosphere?
4. Should we include sound design recommendations?
5. Any specific horror film references for motion style?

---

## Brand Voice in Motion

- **Confident**: Smooth, deliberate movements (not jittery)
- **Mysterious**: Slow reveals, fog effects, glows
- **Powerful**: Bold scale changes, strong easing
- **Cinematic**: Motion blur, depth of field, dramatic timing
- **Modern**: Clean, minimal, not over-animated

---

## Success Criteria

✅ Animations enhance storytelling without distraction
✅ Performance: 60fps on mid-range devices
✅ File sizes optimized (<5MB total)
✅ Accessible with reduced-motion fallbacks
✅ Brand-consistent purple/fuchsia horror aesthetic
✅ Smooth, cinematic quality
✅ Mobile-responsive and performant

---

**Timeline**: Please provide animations in phases:
1. **Phase 1**: Hero section + CTA button (priority)
2. **Phase 2**: Feature cards + Timeline
3. **Phase 3**: Demo preview + Background effects

**Feedback Loop**: Share work-in-progress for review after each phase.
