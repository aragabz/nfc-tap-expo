# Research: Mobile App Foundation

## Decision: Azure AD SSO Implementation
**Choice**: `expo-auth-session` with Microsoft Azure Discovery
**Rationale**: 
- Follows "Expo-compatible libraries and patterns" principle.
- Supports managed and dev-client workflows.
- Handles the OAuth 2.0 flow securely using the system browser.
- Integrates well with `expo-crypto` and `expo-web-browser` which are already in `package.json`.
**Alternatives considered**: 
- `react-native-msal`: Offers more advanced MS-specific features but requires complex native setup and doesn't fit the "Expo-first" preference as cleanly as `expo-auth-session`.

## Decision: Onboarding Component Strategy
**Choice**: Custom `FlatList` with `pagingEnabled` + `react-native-reanimated`
**Rationale**: 
- High performance (60fps targets).
- Full control over design and animations.
- Leverages existing `react-native-reanimated` dependency.
- Avoids adding unnecessary third-party onboarding libraries.
**Alternatives considered**: 
- `react-native-app-intro-slider`: Simple but less flexible for custom "production-ready UX" requirements.

## Decision: Navigation & Auth State Management
**Choice**: Expo Router `(auth)`/`(tabs)` groups + React Context
**Rationale**: 
- Expo Router groups provide a clean way to separate authenticated and unauthenticated flows.
- React Context is sufficient for global auth state (user profile, tokens) as per the project's "Local state preferred; Global state only when shared" principle.
- `AsyncStorage` for persisting the `isFirstLaunch` flag is standard and efficient.
**Alternatives considered**: 
- `Zustand`: Excellent for larger state, but might be overkill for just auth and onboarding state in the initial foundation.

## Decision: Secure Token Storage
**Choice**: `expo-secure-store`
**Rationale**: 
- Provides hardware-backed encryption for sensitive data (access/refresh tokens).
- standard Expo library for security.
**Alternatives considered**: 
- `AsyncStorage`: Not secure for sensitive tokens, only suitable for non-sensitive flags like `onboarding_completed`.
