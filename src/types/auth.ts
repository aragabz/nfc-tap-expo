export interface AzureUser {
  id: string;
  fullName: string;
  email: string;
  photoUri?: string;
  jobTitle?: string;
  organization?: string;
}

export interface AzureSession {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number; // Unix timestamp in seconds
}
