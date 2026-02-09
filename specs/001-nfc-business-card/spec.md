# Feature Specification: NFC Business Card

**Feature Branch**: `001-nfc-business-card`
**Created**: 2026-02-02
**Status**: Draft
**Input**: User description: "Create a digital business card, Share the card using NFC tap, Read another user's card using NFC tap..."

## Clarifications
### Session 2026-02-02
- Q: Storage of scanned cards? → A: **Hybrid (Local History + Export)** - Scanned cards are saved to a local "Wallet/History" list; users can manually export specific cards to device contacts.
- Q: Number of user profiles? → A: **Single Identity** - The user creates and manages exactly one digital business card profile.
- Q: Data Persistence Strategy? → A: **Local Only** - Data is persisted locally on the device (e.g., via SQLite or AsyncStorage). No cloud synchronization or user accounts are required.
- Q: Profile Photos? → A: **Base64 Photo** - The user can add a profile photo which is serialized as a Base64 string and shared over NFC.
- Q: Sharing Modes & Fallbacks? → A: **NFC Primary + QR Fallback** - The app uses explicit "Share" and "Scan" modes for NFC, with a QR code fallback for sharing with non-NFC devices.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create & Edit Digital Card (Priority: P1)

Users can input their professional details and a profile photo to create a personal digital business card stored locally on their device.

**Why this priority**: Foundation of the app; users need data to share before they can use NFC features.

**Independent Test**: Can be tested by launching the app, entering details and a photo, saving, and verifying the data persists and is displayed correctly on the screen.

**Acceptance Scenarios**:

1. **Given** a new user, **When** they open the app, **Then** they see an option to create a new card.
2. **Given** the "Create Card" screen, **When** the user enters valid details and a photo, and saves, **Then** the card (including photo) is stored and displayed.
3. **Given** an existing card, **When** the user edits a field or changes the photo and saves, **Then** the updated information is persisted.
4. **Given** the input form, **When** the user enters invalid data (e.g., malformed email), **Then** the system shows a validation error.

---

### User Story 2 - Share Card via NFC or QR (Priority: P1)

Users can share their card data by initiating a "Share" mode which supports both NFC writing and a QR code display.

**Why this priority**: Core value proposition; enables the "sharing" aspect even on non-NFC devices.

**Independent Test**: Can be tested by initiating the "Share" mode, verifying the QR code is generated, and successfully writing NDEF data to a test device.

**Acceptance Scenarios**:

1. **Given** a stored business card, **When** the user taps "Share", **Then** the system initiates an NFC write session AND displays a QR code containing the card data.
2. **Given** an active share session, **When** an NFC tag/device is detected, **Then** the system writes the card data as an NDEF record.
3. **Given** a successful NFC write, **Then** the user sees a success confirmation.
4. **Given** a recipient without NFC, **When** they scan the displayed QR code with a compatible reader, **Then** they receive the card data.

---

### User Story 3 - Scan & View Card via NFC or Camera (Priority: P1)

Users can read a digital business card from another user's device via NFC tap or by scanning their QR code.

**Why this priority**: Completes the loop; allows users to receive information regardless of device capabilities.

**Independent Test**: Can be tested by initiating "Scan" mode and successfully reading data via either an NFC tap or a QR code scan.

**Acceptance Scenarios**:

1. **Given** the app is in "Scan" mode, **When** an NFC tag/device is tapped, **Then** the system reads and parses the NDEF record.
2. **Given** the app is in "Scan" mode, **When** the user points the camera at a valid Business Card QR code, **Then** the system parses the data.
3. **Given** valid data from either source, **Then** the system displays the "Card Preview" UI and saves it to the "Wallet/History" list.

### Edge Cases

- **NFC Not Supported**: Device does not have NFC hardware. App should automatically default to the QR code path for sharing/scanning and hide NFC-specific UI.
- **Permission Denied**: User refuses Camera permissions for QR scanning. App must guide user to settings.
- **Large Payload**: QR codes can handle more data than small NFC tags, but Base64 images still need heavy compression to keep QR codes scannable.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to input Name, Job Title, Company, Phone, Email, Social Links, and a Profile Photo.
- **FR-002**: System MUST validate input fields.
- **FR-003**: System MUST persist the user's card data locally on the device.
- **FR-004**: System MUST check for NFC and Camera availability.
- **FR-005**: System MUST serialize card data into a JSON string for both NDEF and QR transmission.
- **FR-006**: System MUST write NDEF records containing the JSON payload to compatible targets.
- **FR-007**: System MUST generate a QR code from the JSON payload for visual sharing.
- **FR-008**: System MUST read NDEF records and scan QR codes to receive card data.
- **FR-009**: System MUST display a "Ready to Scan/Share" UI that handles both NFC and QR simultaneously.
- **FR-010**: System MUST provide visual feedback for Success and Error states.
- **FR-011**: System MUST persist a history of scanned cards (Wallet) locally.
- **FR-012**: System MUST provide a function to export a saved card to the device's native contacts.
- **FR-013**: System MUST limit user to one active professional profile.
- **FR-014**: System MUST NOT require an internet connection for core sharing or local storage.
- **FR-015**: System MUST compress and resize profile photos to ensure payload stays within NDEF/QR limits.

### Key Entities

- **BusinessCard**: Represents the user's profile.
    - `id`: Unique identifier (UUID).
    - `fullName`: String (Required).
    - `jobTitle`: String.
    - `company`: String.
    - `phone`: String (Optional).
    - `email`: String (Optional).
    - `socialLinks`: Array of URLs (Optional).
    - `profileImage`: Base64 String (Optional).
    - `version`: String.
- **ScannedCard**: Represents a card received from another user.
    - Extends `BusinessCard`.
    - `scannedAt`: Timestamp.
    - `notes`: String (Optional user notes).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete the "Create Card" flow in under 2 minutes.
- **SC-002**: NFC Write operations report >90% success rate on supported hardware.
- **SC-003**: QR code generation and scanning works in under 2 seconds.
- **SC-004**: App handles hardware limitations (no NFC/Camera) without crashing.
