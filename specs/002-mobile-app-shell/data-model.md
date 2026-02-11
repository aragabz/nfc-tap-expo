# Data Model: Mobile App Foundation

## Entities

### UserProfile
Represents the authenticated user's information retrieved from Azure AD.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| id | string | Unique identifier from Azure AD (sub claim) | Required, Non-empty |
| fullName | string | User's display name | Required |
| email | string | User's primary email address | Required, Email format |
| photoUri | string? | URI to user's profile photo | Optional |
| jobTitle | string? | User's professional title | Optional |
| organization | string? | Tenant or organization name | Optional |

### AuthSession
Represents the current authentication state and tokens.

| Field | Type | Description | Storage |
|-------|------|-------------|---------|
| accessToken | string | JWT for accessing resources | SecureStore |
| refreshToken | string? | Token used to refresh access token | SecureStore |
| expiresAt | number | Timestamp (seconds) when access token expires | SecureStore |
| isAuthenticated | boolean | Derived state indicating if valid session exists | Memory |

### OnboardingState
Persistent flags for user journey.

| Field | Type | Description | Storage |
|-------|------|-------------|---------|
| isCompleted | boolean | Whether the user has finished onboarding | AsyncStorage |

## State Transitions

### Authentication Flow
1. **Unauthenticated**: No valid tokens in SecureStore.
2. **Authenticating**: User redirected to Azure AD via `expo-auth-session`.
3. **Authenticated**: Valid `accessToken` received and stored.
4. **Expired**: `expiresAt` < current time. Trigger refresh or re-login.
5. **Logged Out**: All tokens cleared from SecureStore.

### Onboarding Flow
1. **Initial**: `isCompleted` is null/false.
2. **Completed**: User reaches final onboarding screen and taps CTA. `isCompleted` set to true.
