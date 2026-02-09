# Data Model

## Entities

### BusinessCard
Represents the user's single active profile.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Unique identifier (v4) |
| `fullName` | String | Yes | User's full name |
| `jobTitle` | String | No | Professional title |
| `company` | String | No | Company name |
| `phone` | String | No | Contact number |
| `email` | String | No | Email address |
| `socialLinks`| Array<String> | No | List of social profile URLs |
| `profileImage`| String | No | Base64 encoded image (compressed, max 100x100px) |
| `version` | String | Yes | Schema version (e.g., "1.0") |

### ScannedCard
Represents a card received from another user via NFC or QR.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| ... | ... | ... | *Inherits all fields from BusinessCard* |
| `scannedAt` | ISO8601 String | Yes | Timestamp of when the card was received |
| `notes` | String | No | Private notes added by the user |

## Storage Schema (AsyncStorage)

### Keys

- `user_profile`: Stores the single `BusinessCard` object for the user.
- `scanned_cards`: Stores a serialized JSON array of `ScannedCard` objects.

### Validation Rules

1.  **Image Size**: `profileImage` must be < 4KB (Base64 length) to fit in standard NDEF payloads alongside text.
2.  **Required Fields**: `fullName` must be non-empty.
3.  **Format**: `email` must match standard regex. `socialLinks` must be valid URLs.
