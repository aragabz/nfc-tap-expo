# Research Findings

## Storage Strategy
**Decision**: `AsyncStorage` (via `@react-native-async-storage/async-storage`)
**Rationale**: The data model is simple (single profile + list of small JSON objects). `AsyncStorage` is lightweight, requires no native setup, and is sufficient for the scale (hundreds of cards). SQL overhead is unnecessary for this MVP.
**Alternatives Considered**: 
- `expo-sqlite`: Better for complex queries, but overkill here.
- `Realm`: Too heavy and adds unnecessary complexity.

## Integration Testing Tool
**Decision**: `Maestro`
**Rationale**: Supports Expo Development Builds well, uses simple YAML flows, and is less flaky than Detox for this type of UI-heavy flow.
**Alternatives Considered**:
- `Detox`: Harder to configure with Expo, notoriously flaky in CI.
- `Appium`: Too slow and resource-heavy.

## NFC Library
**Decision**: `react-native-nfc-manager`
**Rationale**: The standard for React Native. Requires `expo-dev-client` (Development Build) as Expo Go does not support NFC.
**Alternatives Considered**:
- `expo-nfc`: Experimental/deprecated or limited functionality.

## QR Code Strategy
**Decision**: `react-native-qrcode-svg` (Generation) + `expo-camera` (Scanning)
**Rationale**: `react-native-qrcode-svg` provides reliable, pure JS generation. `expo-camera` is the standard Expo library for camera access.

## Package Manager
**Decision**: `yarn`
**Rationale**: Explicit user request.