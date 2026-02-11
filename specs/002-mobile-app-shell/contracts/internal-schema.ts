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

export interface AuthService {
  /**
   * Initiates the Azure AD SSO flow.
   * @returns A promise that resolves to the AuthSession on success.
   */
  signIn(): Promise<AuthSession>;

  /**
   * Refreshes the current session using the refresh token.
   * @param refreshToken The refresh token to use.
   */
  refresh(refreshToken: string): Promise<AuthSession>;

  /**
   * Clears the current session and signs the user out.
   */
  signOut(): Promise<void>;

  /**
   * Retrieves the user profile from Azure AD claims or API.
   * @param accessToken The access token to use.
   */
  getUserProfile(accessToken: string): Promise<UserProfile>;
}

export interface StorageService {
  saveTokens(session: AuthSession): Promise<void>;
  getTokens(): Promise<AuthSession | null>;
  clearTokens(): Promise<void>;
  
  saveOnboardingStatus(completed: boolean): Promise<void>;
  getOnboardingStatus(): Promise<boolean>;
}
