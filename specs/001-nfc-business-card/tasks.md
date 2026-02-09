# Tasks: NFC Business Card

**Input**: Design documents from `/specs/001-nfc-business-card/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/internal-schema.ts

**Tests**: Unit tests are required for services and hooks per the project constitution. Integration tests using Maestro are planned for core journeys.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Phase 1: Setup

**Purpose**: Project initialization and environment configuration

- [x] T001 Initialize Expo project with `expo-dev-client` using `yarn`
- [x] T002 [P] Install primary dependencies: `react-native-nfc-manager`, `@react-native-async-storage/async-storage`, `react-native-qrcode-svg`, `expo-camera`, `expo-image-picker`, `react-native-svg`
- [x] T003 [P] Configure iOS permissions (NFC, Camera) and entitlements in `app.json`
- [x] T004 [P] Configure Android permissions (NFC, Camera) in `app.json`
- [x] T005 [P] Setup Jest testing environment for React Native with `yarn jest` configuration
- [x] T006 [P] Setup Maestro configuration for integration testing in `.maestro/`

---

## Phase 2: Foundational

**Purpose**: Shared infrastructure and core services

- [x] T007 Define TypeScript interfaces in `src/types/card.ts` based on `internal-schema.ts`
- [x] T008 Implement `StorageService` using `AsyncStorage` in `src/services/storage.ts`
- [x] T009 [P] Write unit tests for `StorageService` in `src/services/__tests__/storage.test.ts`
- [x] T010 Implement `NfcService` wrapper for `react-native-nfc-manager` in `src/services/nfc.ts`
- [x] T011 [P] Create `useStorage` custom hook in `src/hooks/use-storage.ts`
- [x] T012 [P] Create `useNfc` custom hook in `src/hooks/use-nfc.ts`
- [x] T013 Setup base navigation layout with Expo Router in `src/app/(tabs)/_layout.tsx`

---

## Phase 3: User Story 1 - Create & Edit Digital Card (Priority: P1) 🎯 MVP

**Goal**: Allow users to create and manage their single professional profile with a photo.

**Independent Test**: Create a card with all fields and a photo, restart the app, and verify the card data is displayed correctly on the Home screen.

### Implementation for User Story 1

- [x] T014 [US1] Create `CardForm` component in `src/components/card/card-form.tsx`
- [x] T015 [US1] Implement image picker logic in `src/hooks/use-image-picker.ts`
- [x] T016 [US1] Implement image compression utility in `src/utils/image.ts` (Target < 4KB Base64 for NDEF)
- [x] T017 [US1] [P] Write unit tests for image compression in `src/utils/__tests__/image.test.ts`
- [x] T018 [US1] Create "Create Card" screen in `src/app/card/create.tsx`
- [x] T019 [US1] Create "Edit Card" screen in `src/app/card/[id].tsx`
- [x] T020 [US1] Implement Home/Dashboard to display the user's card in `src/app/(tabs)/index.tsx`
- [x] T021 [US1] [P] Create Maestro flow for "Create Card" journey in `.maestro/create_card.yaml`

**Checkpoint**: User Story 1 functional - Card creation and persistence verified locally.

---

## Phase 4: User Story 2 - Share Card via NFC or QR (Priority: P1)

**Goal**: Enable sharing of card data via NFC NDEF records and QR code display.

**Independent Test**: Open "Share" mode, scan the displayed QR with another device, and verify NDEF write initiation when a tag is present.

### Implementation for User Story 2

- [x] T022 [US2] Create `QrCodeDisplay` component in `src/components/qr/qr-code-display.tsx`
- [x] T023 [US2] Implement NFC NDEF writer logic in `src/services/nfc.ts`
- [x] T024 [US2] Create "Share" screen in `src/app/(tabs)/share.tsx`
- [x] T025 [US2] [P] Implement "Ready to Share" UI with simultaneous NFC/QR feedback in `src/components/share/share-ui.tsx`
- [x] T026 [US2] [P] Create Maestro flow for "Share Card" UI states in `.maestro/share_card.yaml`

**Checkpoint**: User Story 2 functional - Card data can be shared via NFC and QR fallback.

---

## Phase 5: User Story 3 - Scan & View Card via NFC or Camera (Priority: P1)

**Goal**: Read and save other users' cards via NFC tap or QR camera scan.

**Independent Test**: Scan a known valid business card QR or NFC tag and verify it appears in the Wallet history with the correct details.

### Implementation for User Story 3

- [x] T027 [US3] Create `QrScanner` component using `expo-camera` in `src/components/qr/qr-scanner.tsx`
- [x] T028 [US3] Implement NFC NDEF reader logic in `src/services/nfc.ts`
- [x] T029 [US3] Create `CardPreview` modal/UI in `src/components/card/card-preview.tsx`
- [x] T030 [US3] Create "Scan" screen in `src/app/(tabs)/scan.tsx`
- [x] T031 [US3] Implement "Wallet" history view in `src/app/wallet/index.tsx`
- [x] T032 [US3] Implement "Export to Contacts" logic in `src/services/contacts.ts` using `expo-contacts`
- [x] T033 [US3] [P] Create Maestro flow for "Scan Card" journey in `.maestro/scan_card.yaml`

**Checkpoint**: User Story 3 functional - Loop closed; app can send and receive cards and save to history.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final refinements, haptics, and error handling

- [x] T034 [P] Implement haptic feedback for success/error states using `expo-haptics`
- [x] T035 Implement "NFC Not Supported" and "Camera Not Supported" fallback UI
- [x] T036 [P] Add validation for Base64 payload size before sharing in `src/utils/validation.ts`
- [x] T037 [P] Final UI/UX polish and consistency check against project constitution
- [x] T038 Run full suite of Maestro flows and Jest tests to verify MVP

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: Blocks all other phases.
- **Phase 2 (Foundational)**: Blocks all User Story implementation.
- **Phase 3 (US1)**: Must be completed first to have data for US2.
- **Phase 4 (US2) & Phase 5 (US3)**: Can be worked on in parallel once Phase 3 is stable.
- **Phase 6 (Polish)**: Depends on completion of all core user stories.

### Parallel Opportunities

- T002-T006 can be handled in parallel during Setup.
- T009, T011, T012 can be handled in parallel during Foundational.
- T017 (Unit tests) can be parallel to UI tasks in US1.
- US2 and US3 implementation tasks are largely independent of each other's UI components.

---

## Implementation Strategy

### MVP First (User Story 1)

1. Complete Phase 1 & 2 (Setup and Foundation).
2. Complete Phase 3 (Create/Edit Card).
3. **Validation**: Verify data persists correctly using `AsyncStorage`.

### Incremental Delivery

1. Add US2 (Share) -> Test NFC write and QR display.
2. Add US3 (Scan) -> Test reading via NFC/Camera and Wallet history storage.
3. Finalize with Polish, Haptics, and final validation.