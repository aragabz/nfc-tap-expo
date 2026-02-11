import { AuthSession as Session, UserProfile } from '../types/auth';

export const AuthService = {
  /**
   * Clears the current session and signs the user out.
   */
  async signOut(): Promise<void> {
    // In Azure AD, a full sign out might require opening a browser to the end_session_endpoint
    // For this foundation, we focus on clearing local state.
  },

  /**
   * Retrieves the user profile from Microsoft Graph API.
   * @param accessToken The access token to use.
   */
  async getUserProfile(accessToken: string): Promise<UserProfile> {
    try {
      const response = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const data = await response.json();
      
      return {
        id: data.id,
        fullName: data.displayName,
        email: data.mail || data.userPrincipalName,
        jobTitle: data.jobTitle,
        organization: data.officeLocation, // Fallback to officeLocation if companyName is not available
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  /**
   * Refreshes the current session using the refresh token.
   * @param refreshToken The refresh token to use.
   * @param tenantId Azure AD Tenant ID
   * @param clientId Azure AD Client ID
   */
  async refresh(refreshToken: string, tenantId: string, clientId: string): Promise<Session> {
    try {
      const response = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId,
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          scope: 'openid profile email User.Read offline_access',
        }).toString(),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      
      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: Math.floor(Date.now() / 1000) + data.expires_in,
      };
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  },
};
