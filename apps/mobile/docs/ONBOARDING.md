# Onboarding Feature

## Overview
The Onboarding screen is the entry point of the app. It uses **Privy** for authentication to create a non-custodial Embedded Wallet for the user.

## Design
- **Apple-Style**: Uses a high-quality abstract background image.
- **Glassmorphism**: The content is hosted in a `GlassView` component with `expo-blur`.
- **Typography**: Uses System fonts (San Francisco on iOS) with tight letter spacing for a premium feel.

## Dependencies
- `@privy-io/expo`: For authentication logic.
- `expo-blur`: For the glass effect.
- `expo-haptics`: For button feedback.

## Next Steps
- Connect the successful login to the **Smart Account** deployment.
