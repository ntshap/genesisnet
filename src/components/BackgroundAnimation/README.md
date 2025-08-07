# Background Animation Documentation

## Overview
The BackgroundAnimation component provides a sophisticated, futuristic background animation system for the GenesisNet dashboard. It includes multiple layers of animated elements that create an immersive data-centric environment.

## Features

### 1. **Animated Grid Background**
- Moving grid pattern that creates depth
- Wave-like distortion effects
- Responsive grid sizing based on screen size

### 2. **Floating Particles System**
- Dynamic particle generation with Canvas API
- Particle connections when in proximity
- Pulse animations with glow effects
- Performance-optimized particle count based on screen size

### 3. **Neural Network Pathways**
- Curved pathways that simulate data flow
- Gradient effects for realistic neural connections
- Bezier curve animations for smooth movement

### 4. **Scan Lines Effect**
- Horizontal and vertical scan lines
- Timed animations for futuristic feel
- Glow effects with color shadows

### 5. **Data Streams**
- Binary data flowing vertically
- Multiple streams with different timing
- Glowing data bits with animation
- Hidden on small screens for performance

### 6. **Holographic Corners**
- Corner border effects that flicker
- Positioned at screen edges
- Staggered animation timing
- Responsive sizing

### 7. **Floating Orbs**
- Large blur orbs with radial gradients
- Complex float animations with scaling
- Different colors and sizes
- Performance-aware sizing

## Performance Optimizations

### 1. **Responsive Design**
- Reduced particle count on mobile devices
- Disabled complex effects on smaller screens
- Adaptive grid sizing
- Hidden data streams on very small screens

### 2. **Motion Preferences**
- Respects `prefers-reduced-motion` CSS media query
- Optional `reduceMotion` prop for manual control
- Complete animation disable when motion is reduced

### 3. **Frame Rate Management**
- Target 60fps with frame skipping
- Performance monitoring built-in
- Canvas optimization techniques
- Hardware acceleration with `will-change` properties

### 4. **Memory Management**
- Proper cleanup of animation frames
- Event listener removal on unmount
- Efficient particle creation and destruction

## Usage

```jsx
import BackgroundAnimation from './components/BackgroundAnimation';

// Basic usage
<BackgroundAnimation />

// With reduced motion
<BackgroundAnimation reduceMotion={true} />
```

## File Structure

```
BackgroundAnimation/
├── BackgroundAnimation.jsx    # Main component with Canvas animations
├── BackgroundAnimation.css    # Styles for all animation effects
└── index.js                  # Export file
```

## CSS Animations

### Grid Movement
- 20-second linear animation
- Translates grid pattern for seamless tiling

### Particle Effects
- Canvas-based with JavaScript control
- Real-time collision detection for connections

### Scan Lines
- 4-second vertical scan
- 6-second horizontal scan
- Gradient effects with shadows

### Data Streams
- 10-15 second flow animations
- Staggered timing for natural feel
- Individual bit glow animations

### Holographic Corners
- 3-second flicker cycle
- Opacity and shadow changes
- Staggered delays for each corner

### Floating Orbs
- 12-18 second complex paths
- Scale and position changes
- Alternate direction animations

## Browser Compatibility

- Modern browsers with Canvas support
- CSS Animation support required
- Hardware acceleration recommended
- Mobile-optimized for iOS and Android

## Integration

The component is designed to be a background element and should be placed early in the component tree:

```jsx
<div className="app-container">
  <BackgroundAnimation />
  {/* Other app content */}
</div>
```

## Customization

### Colors
Primary colors can be changed by modifying the CSS custom properties:
- `rgba(0, 183, 255, opacity)` - Primary blue
- Gradients using the same color family

### Animation Speed
Adjust animation durations in CSS:
- Grid: `animation: gridMove 20s linear infinite`
- Streams: `animation: streamFlow1 12s infinite`
- Orbs: `animation: float1 15s ease-in-out infinite`

### Particle Count
Modify in JavaScript:
- Desktop: up to 80 particles
- Mobile: up to 30 particles
- Calculation based on screen area

## Performance Notes

- Uses `requestAnimationFrame` for smooth animations
- Hardware accelerated with CSS `will-change`
- Automatic performance scaling based on device
- Memory efficient with proper cleanup
- Respects user accessibility preferences
