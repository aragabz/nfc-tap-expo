export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  photoUri?: string;
  jobTitle?: string;
  organization?: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number; // Unix timestamp in seconds
}
