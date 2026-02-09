# Implementation Plan: NFC Business Card

**Branch**: `001-nfc-business-card` | **Date**: 2026-02-02 | **Spec**: [specs/001-nfc-business-card/spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-nfc-business-card/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a digital business card application using React Native and Expo. Key features include creating a single-profile card with photo, sharing via NFC and QR codes, scanning other cards, and persisting history locally. Data transfer uses NDEF JSON payloads (with strict size limits) and QR fallbacks. Using `yarn` for all package management.

## Technical Context

**Language/Version**: TypeScript 5.x
**Primary Dependencies**: `expo`, `react-native-nfc-manager`, `react-native-qrcode-svg`, `expo-camera`, `expo-image-picker`, `@react-native-async-storage/async-storage`
**Storage**: `AsyncStorage` (Decision from research: Simple JSON schema fits requirements)
**Testing**: `jest` (Unit), `Maestro` (Integration)
**Target Platform**: iOS 15+ and Android 10+ (Physical devices required for NFC)
**Project Type**: Mobile (React Native / Expo / Dev Client)
**Performance Goals**: 60fps UI, <1s scan/share latency
**Constraints**: Offline-first, strictly local storage, NDEF payload size limits (<4KB total, <1KB target)
**Scale/Scope**: Single user profile, local history, ~5 screens

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

*   **I. Code Quality**: TypeScript required. (Pass)
*   **II. Testing Strategy**: Unit tests for utilities/logic required. (Pass)
*   **III. UX & Design**: Native feel, a11y support. (Pass)
*   **IV. Performance**: 60fps goal aligned. (Pass)
*   **Tech Stack**: React Native/Expo, TypeScript, File-based routing. (Pass)

## Project Structure

### Documentation (this feature)

```text
specs/001-nfc-business-card/
├── plan.md              # This file
├── research.md          # Phase 0 output ✅
├── data-model.md        # Phase 1 output ✅
├── quickstart.md        # Phase 1 output ✅
├── contracts/           # Phase 1 output ✅
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
app/
├── (tabs)/
│   ├── index.tsx          # Home/Dashboard
│   ├── share.tsx          # Share Mode (NFC/QR)
│   └── scan.tsx           # Scan Mode
├── card/
│   ├── [id].tsx           # Card Details/Edit
│   └── create.tsx         # New Card Flow
components/
├── nfc/                   # NFC Logic & UI Components
├── qr/                    # QR Generation/Scanning Components
└── ui/                    # Reusable UI (ThemedText, Buttons)
constants/                 # App Constants
hooks/                     # Custom Hooks (useNfc, useStorage)
services/                  # Business Logic Services
├── storage.ts             # Local Persistence
├── nfc.ts                 # NFC Adapter
└── vcard.ts               # VCard Parser/Generator (if needed)
```

**Structure Decision**: Standard Expo Router file-based structure with separated concerns for services and components.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
