// Internal Service Contracts for NFC Business Card

export interface BusinessCard {
  id: string;
  fullName: string;
  jobTitle?: string;
  company?: string;
  phone?: string;
  email?: string;
  socialLinks?: string[];
  profileImage?: string; // Base64
  version: string;
}

export interface ScannedCard extends BusinessCard {
  scannedAt: string; // ISO 8601
  notes?: string;
}

export interface StorageServiceContract {
  // User Profile
  saveUserProfile(card: BusinessCard): Promise<void>;
  getUserProfile(): Promise<BusinessCard | null>;
  deleteUserProfile(): Promise<void>;

  // Scanned Cards (Wallet)
  saveScannedCard(card: ScannedCard): Promise<void>;
  getScannedCards(): Promise<ScannedCard[]>;
  deleteScannedCard(cardId: string): Promise<void>;
  updateScannedCardNote(cardId: string, notes: string): Promise<void>;
}

export interface NfcServiceContract {
  isSupported(): Promise<boolean>;
  isEnabled(): Promise<boolean>;
  startWriteSession(payload: BusinessCard): Promise<void>;
  startReadSession(): Promise<ScannedCard>; // Resolves when card detected
  stopSession(): Promise<void>;
}
