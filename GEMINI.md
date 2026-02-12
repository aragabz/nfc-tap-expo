# digital-business-cards Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-02-02

## Active Technologies

- TypeScript 5.9 + Expo 54, React Native 0.81, Expo Router 6, @react-native-async-storage/async-storage, expo-auth-session (Azure AD SSO), expo-secure-store (token storage) (002-mobile-app-shell)
- AsyncStorage (for onboarding state and profile cache), SecureStore (for auth tokens) (002-mobile-app-shell)

- TypeScript 5.x + `expo`, `react-native-nfc-manager` (or `expo-nfc`), `react-native-qrcode-svg`, `expo-camera`, `expo-image-picker` (001-nfc-business-card)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript 5.x: Follow standard conventions

## Recent Changes

- 002-mobile-app-shell: Added TypeScript 5.9 + Expo 54, React Native 0.81, Expo Router 6, @react-native-async-storage/async-storage, expo-auth-session (Azure AD SSO), expo-secure-store (token storage)

- 001-nfc-business-card: Added TypeScript 5.x + `expo`, `react-native-nfc-manager` (or `expo-nfc`), `react-native-qrcode-svg`, `expo-camera`, `expo-image-picker`

<!-- MANUAL ADDITIONS START -->
- Added `react-native-svg`
<!-- MANUAL ADDITIONS END -->
