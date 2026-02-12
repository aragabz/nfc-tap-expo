import * as Auth from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Alert, Platform } from "react-native";
import { AuthService } from "../services/auth";
import { StorageService } from "../services/storage";
import { AuthSession as LocalAuthSession, UserProfile } from "../types/auth";

WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  session: LocalAuthSession | null;
  user: UserProfile | null;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Note: Replace these with your actual Azure AD application details
const CLIENT_ID = "30a2a9f9-c1a6-4bcb-a9d5-df72a79b6d17"; // Replace with your Application (client) ID
const TENANT_ID = "bd448036-bc11-4a8f-9c77-8ff94d85b33c"; // Use 'common' for multi-tenant, or your specific Tenant ID

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<LocalAuthSession | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    console.log("Auth State Changed:", {
      hasSession: !!session,
      hasUser: !!user,
      isLoading,
      isSigningIn,
    });
  }, [session, user, isLoading, isSigningIn]);

  const discovery = Auth.useAutoDiscovery(
    `https://login.microsoftonline.com/${TENANT_ID}/v2.0`,
  );

  const redirectUri = Auth.makeRedirectUri({
    native: "digital-business-cards://com.tasama.digitalbusinesscards",
  });

  useEffect(() => {
    console.log("Generated Redirect URI:", redirectUri);
  }, [redirectUri]);

  const [request, response, promptAsync] = Auth.useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: ["openid", "profile", "email", "User.Read", "offline_access"],
      redirectUri,
    },
    discovery,
  );

  const loadSession = useCallback(async () => {
    try {
      console.log("Loading saved session...");
      const savedSession = await StorageService.getTokens();
      console.log("Saved Session:", JSON.stringify(savedSession));
      if (savedSession) {
        console.log("Found saved session, checking expiration...");
        // Check expiration and refresh if needed
        if (savedSession.expiresAt < Date.now() / 1000) {
          console.log("Session expired, refreshing...");
          if (savedSession.refreshToken) {
            const newSession = await AuthService.refresh(
              savedSession.refreshToken,
              TENANT_ID,
              CLIENT_ID,
            );
            console.log("Refreshed Session:", JSON.stringify(newSession));
            await StorageService.saveTokens(newSession);
            setSession(newSession);
            const profile = await AuthService.getUserProfile(
              newSession.accessToken,
            );
            setUser(profile);
          } else {
            console.log("No refresh token available, clearing session");
            await StorageService.clearTokens();
            setSession(null);
            setUser(null);
          }
        } else {
          console.log("Session still valid");
          setSession(savedSession);
          const profile = await AuthService.getUserProfile(
            savedSession.accessToken,
          );
          setUser(profile);
        }
      } else {
        console.log("No saved session found");
      }
    } catch (error) {
      console.error("Error loading session:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  useEffect(() => {
    console.log("Auth Response Received:", response?.type);
    if (response?.type === "success") {
      const { authentication, params } = response;
      console.log("Auth Params:", JSON.stringify(params));

      if (authentication) {
        console.log("Authentication object found in response");
        const newSession: LocalAuthSession = {
          accessToken: authentication.accessToken,
          refreshToken: authentication.refreshToken,
          expiresAt:
            Math.floor(Date.now() / 1000) + (authentication.expiresIn || 3600),
        };
        handleSignInSuccess(newSession);
      } else if (params.code && discovery) {
        console.log("Auth code found, performing exchange...");
        setIsSigningIn(true);
        // Exchange code for tokens
        Auth.exchangeCodeAsync(
          {
            clientId: CLIENT_ID,
            code: params.code,
            extraParams: request?.codeVerifier
              ? { code_verifier: request.codeVerifier }
              : {},
            redirectUri,
          },
          discovery,
        )
          .then((tokenResponse) => {
            console.log("Token exchange successful");
            const newSession: LocalAuthSession = {
              accessToken: tokenResponse.accessToken,
              refreshToken: tokenResponse.refreshToken,
              expiresAt:
                Math.floor(Date.now() / 1000) +
                (tokenResponse.expiresIn || 3600),
            };
            handleSignInSuccess(newSession);
          })
          .catch((error) => {
            console.error("Token exchange failed:", error);
            Alert.alert(
              "Authentication Error",
              "Failed to exchange authorization code for tokens.",
            );
          })
          .finally(() => {
            setIsSigningIn(false);
          });
      }
    } else if (response?.type === "error") {
      console.error("Auth response error:", response.error);
      setIsSigningIn(false);
    } else if (response?.type === "cancel") {
      console.log("Auth cancelled by user");
      setIsSigningIn(false);
    }
  }, [response, discovery, request, redirectUri]);

  const handleSignInSuccess = async (newSession: LocalAuthSession) => {
    console.log("Handling sign in success. Setting session state...");
    try {
      await StorageService.saveTokens(newSession);
      setSession(newSession);
      console.log("Session state set, fetching profile...");
      const profile = await AuthService.getUserProfile(newSession.accessToken);
      console.log("Profile fetched:", profile.email);
      setUser(profile);
    } catch (error) {
      console.error("Error during sign in success handling:", error);
    }
  };

  const signIn = async () => {
    if (!request) {
      console.warn("Auth request not ready");
      return;
    }

    try {
      setIsSigningIn(true);
      // On Android, check if a browser is available to handle the auth request
      if (Platform.OS === "android") {
        const result = await WebBrowser.getCustomTabsSupportingBrowsersAsync();
        if (
          result.browserPackages.length === 0 &&
          !result.defaultBrowserPackage
        ) {
          Alert.alert(
            "No Browser Found",
            "A web browser is required for sign-in. Please install Chrome or another browser on this device.",
          );
          setIsSigningIn(false);
          return;
        }
      }

      console.log("Starting auth prompt...");
      const result = await promptAsync();
      console.log("Auth prompt result:", result.type);

      if (result?.type !== "success") {
        setIsSigningIn(false);
      }

      if (result?.type === "error") {
        console.error("Auth prompt error:", result.error);
        throw new Error(result.error?.message || "Authentication failed");
      }
    } catch (error: any) {
      console.error("Detailed sign-in error:", error);
      setIsSigningIn(false);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await StorageService.clearTokens();
      setSession(null);
      setUser(null);
      await AuthService.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isLoading: isLoading || isSigningIn,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
