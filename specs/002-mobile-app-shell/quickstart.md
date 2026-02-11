# Quickstart: Mobile App Foundation

## Prerequisites
- Node.js 18+
- Expo CLI (`npx expo`)
- iOS Simulator or Android Emulator
- Azure AD Tenant (for SSO configuration)

## Setup
1. **Environment Variables**:
   Create a `.env` file in the root (or use `app.json` extra fields) with:
   ```text
   AZURE_CLIENT_ID=your-client-id
   AZURE_TENANT_ID=your-tenant-id
   ```

2. **Azure AD Configuration**:
   - Register a new "Mobile and desktop applications" in Azure Portal.
   - Redirect URI: `nfctapexpo://redirect` (matches `app.json` scheme).
   - Enable "Access tokens" and "ID tokens" in Authentication settings.

## Running the Feature
1. **Start Development Server**:
   ```bash
   npx expo start
   ```
2. **Launch App**:
   - Press `i` for iOS or `a` for Android.

## Verification Steps
### 1. Onboarding Flow
- Launch the app for the first time.
- Verify swipable screens are displayed.
- Swipe to the last screen and tap "Continue".
- Verify redirection to Login screen.

### 2. Azure AD Login
- Tap "Sign in with Microsoft".
- Complete the authentication in the system browser.
- Verify redirection to the Home tab upon success.

### 3. Profile & Logout
- Navigate to the "Profile" tab.
- Verify user information is correctly displayed.
- Tap "Logout".
- Verify redirection back to the Login screen and that tokens are cleared.
