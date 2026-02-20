# AvaChat Design System

## Philosophy
**"Finance at the speed of chat, with the elegance of glass."**

We use a **Glassmorphism** aesthetic inspired by Apple's visionOS and iOS.
- **Dark Mode Only**: Deep blacks (`#000000`) and dark grays (`#1C1C1E`).
- **Translucency**: High-usage of `expo-blur` to create depth.
- **Typography**: San Francisco (System) fonts.

## Core Components

### `GlassView`
A wrapper around `BlurView` with a subtle white border and rounded corners.
```tsx
<GlassView intensity={50}>
  <Text>Content</Text>
</GlassView>
```

### `AppleButton`
A premium button with haptic feedback.
```tsx
<AppleButton title="Send" onPress={...} variant="primary" />
```

## Colors
Defined in `constants/Theme.ts`.
- `primary`: `#0A84FF` (Apple Blue)
- `surface`: `#1C1C1E` (Apple Dark Gray)
- `glass`: `rgba(28, 28, 30, 0.7)`

## Icons
Use `@expo/vector-icons/Ionicons` for a native Apple feel.
