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
