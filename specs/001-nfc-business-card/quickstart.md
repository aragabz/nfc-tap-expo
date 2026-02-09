# Quickstart Guide: NFC Business Card

## Prerequisites

1.  **Physical Device**: NFC features require a physical iOS or Android device. Simulators do not support NFC hardware.
2.  **Expo Development Client**: Since we use `react-native-nfc-manager`, you cannot use "Expo Go". You must build a Development Client.

## Setup Instructions

1.  **Install Dependencies**:
    ```bash
    yarn add @react-native-async-storage/async-storage react-native-nfc-manager react-native-qrcode-svg expo-camera expo-image-picker react-native-svg expo-dev-client
    ```

2.  **Configure NFC (iOS)**:
    -   Ensure `app.json` contains `ios.infoPlist.NFCReaderUsageDescription`.
    -   Ensure `app.json` contains `ios.entitlements["com.apple.developer.nfc.readersession.formats"] = ["NDEF"]`.

3.  **Build Development Client**:
    ```bash
    # For iOS (requires macOS and Xcode)
    npx expo run:ios
    
    # For Android
    npx expo run:android
    ```

## Development Workflow

1.  **Start Dev Server**:
    ```bash
    yarn start
    ```

2.  **Open on Device**:
    -   Install the generated build from step 3.
    -   Open the app and scan the QR code from the terminal.

3.  **Test NFC Tap**:
    -   Go to "Share" mode on one device.
    -   Go to "Scan" mode on another device.
    -   Tap devices back-to-back.

## Testing

1.  **Unit Tests**:
    ```bash
    yarn jest
    ```
