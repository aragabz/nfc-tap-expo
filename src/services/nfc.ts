import { NativeModules } from "react-native";
import NfcManager, { Ndef, NfcTech } from "react-native-nfc-manager";
import { BusinessCard, ScannedCard } from "../types/card";

const hasNativeModule = !!NativeModules.NfcManager;

/* ---------------- READ OUTCOMES ---------------- */

export enum NfcScanResultType {
  SUCCESS = "SUCCESS",
  SECURE_ELEMENT = "SECURE_ELEMENT",
  EMPTY_TAG = "EMPTY_TAG",
  UNSUPPORTED_DATA = "UNSUPPORTED_DATA",
  ERROR = "ERROR",
}

export interface NfcScanOutcome {
  type: NfcScanResultType;
  data?: ScannedCard;
  error?: string;
}

export const NfcService = {
  async start(): Promise<void> {
    if (!hasNativeModule) return;
    await NfcManager.start();
  },

  async isSupported(): Promise<boolean> {
    return hasNativeModule && (await NfcManager.isSupported());
  },

  async isEnabled(): Promise<boolean> {
    return hasNativeModule && (await NfcManager.isEnabled());
  },

  /* ---------------- WRITE ---------------- */

  async startWriteSession(card: BusinessCard): Promise<void> {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);

      // Create a copy of the card data for NFC
      // We explicitly remove the profileImage because Base64 images are too large for most NFC tags
      // (NTAG213: ~144 bytes, NTAG215: ~504 bytes, NTAG216: ~888 bytes)
      const { profileImage, ...cardDataForNfc } = card;

      const jsonPayload = JSON.stringify(cardDataForNfc);
      const bytes = Ndef.encodeMessage([Ndef.textRecord(jsonPayload)]);

      if (!bytes) {
        throw new Error("Failed to encode NFC payload.");
      }

      await NfcManager.ndefHandler.writeNdefMessage(bytes);
    } finally {
      await NfcManager.cancelTechnologyRequest();
    }
  },

  /* ---------------- READ ---------------- */

  async startReadSession(): Promise<NfcScanOutcome> {
    try {
      // Request NDEF technology directly.
      // This will automatically filter for tags that support NDEF.
      await NfcManager.requestTechnology(NfcTech.Ndef);

      const tag = await NfcManager.getTag();
      if (!tag) {
        return { type: NfcScanResultType.ERROR, error: "No NFC tag detected." };
      }

      console.log("NFC tag detected:", tag);

      // On iOS, ndefMessage might be directly on the tag object if using Ndef tech.
      // On Android, we might need to query it or it's in the tag object too.
      // react-native-nfc-manager normalizes this somewhat, but let's be safe.

      // If we are here, we successfully connected with Ndef tech.
      // Let's try to read the NDEF message.
      // Note: getTag() usually returns the cached message from discovery if available.
      // But for a fresh read, we might want to read explicitly if the tag object doesn't have it.

      let ndefMessage = tag.ndefMessage;

      // If no message in tag object, try to read it explicitly (mostly for Android updates)
      if (!ndefMessage) {
        try {
          // For Ndef tech, we can try getTag again or rely on the initial one.
          // Actually, let's assume if it's Ndef tech, the manager handles it.
          // But strictly speaking, we can try:
          // ndefMessage = await NfcManager.ndefHandler.getNdefMessage();
        } catch (e) {
          // Ignore, maybe empty
        }
      }

      if (!ndefMessage || ndefMessage.length === 0) {
        return {
          type: NfcScanResultType.EMPTY_TAG,
          error: "This NFC tag is empty.",
        };
      }

      // 4. Parse Records
      for (const record of ndefMessage) {
        try {
          const payload = record.payload;
          // Decode payload
          // Ndef.text.decodePayload handles the language byte stripping
          const decoded = Ndef.text.decodePayload(new Uint8Array(payload));

          // Try to parse as JSON
          const cardData = JSON.parse(decoded);

          if (cardData?.fullName) {
            return {
              type: NfcScanResultType.SUCCESS,
              data: {
                ...cardData,
                scannedAt: new Date().toISOString(),
              },
            };
          }
        } catch (e) {
          // Not a JSON or not our card format, continue to next record
          console.log("Failed to parse record:", e);
          continue;
        }
      }

      return {
        type: NfcScanResultType.UNSUPPORTED_DATA,
        error: "No valid business card found on this tag.",
      };
    } catch (e: any) {
      console.warn("NFC Read Error:", e);
      if (e === "User cancelled" || e?.toString().includes("cancelled")) {
        return { type: NfcScanResultType.ERROR, error: "Scan cancelled." };
      }
      return {
        type: NfcScanResultType.ERROR,
        error: "Failed to read NFC tag. Please try again.",
      };
    } finally {
      await NfcManager.cancelTechnologyRequest();
    }
  },

  async stopSession(): Promise<void> {
    await NfcManager.cancelTechnologyRequest();
  },
};
