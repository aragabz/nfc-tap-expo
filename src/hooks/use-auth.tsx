import * as Auth from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import NetInfo from "@react-native-community/netinfo";
import { useCallback, useEffect } from "react";
import { Alert, Platform } from "react-native";
import { AzureService, StorageService } from "../services";
import { AzureUser, AzureSession as LocalAuthSession } from "../types/auth";
import { BusinessCard } from "../types/card";
import { STORAGE_KEYS } from "../constants/storage";
import { useAuthStore } from "../store/use-auth-store";

WebBrowser.maybeCompleteAuthSession();

// Note: Replace these with your actual Azure AD application details
const CLIENT_ID = "30a2a9f9-c1a6-4bcb-a9d5-df72a79b6d17";
const TENANT_ID = "bd448036-bc11-4a8f-9c77-8ff94d85b33c";

const mapAzureUserToCard = (user: AzureUser): BusinessCard => ({
  id: user.id,
  fullName: user.fullName,
  email: user.email,
  jobTitle: user.jobTitle,
  company: user.organization,
  profileImage: user.photoUri,
  version: "1.0",
});

/**
 * Hook to manage authentication logic and state.
 * Should be called at the root of the app to initialize auth.
 */
export const useAuth = () => {
  const { session, user, isLoading, isOffline, hasLocalProfile, setSession, setUser, setIsLoading, setIsOffline, setHasLocalProfile, clearAuth } = useAuthStore();

  const discovery = Auth.useAutoDiscovery(
    `https://login.microsoftonline.com/${TENANT_ID}/v2.0`,
  );

  const redirectUri = Auth.makeRedirectUri({
    native: "digital-business-cards://com.tasama.digitalbusinesscards",
  });

  const [request, response, promptAsync] = Auth.useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: ["openid", "profile", "email", "User.Read", "offline_access"],
      redirectUri,
    },
    discovery,
  );

  const handleSignInSuccess = useCallback(async (newSession: LocalAuthSession) => {
    console.log("Handling sign in success...");
    try {
      await StorageService.saveSecureItem(STORAGE_KEYS.AUTH_TOKENS, newSession);
      setSession(newSession);
      
      const state = await NetInfo.fetch();
      if (state.isConnected) {
        const profile = await AzureService.getUserProfile(newSession.accessToken);
        const card = mapAzureUserToCard(profile);
        await StorageService.saveItem(STORAGE_KEYS.USER_PROFILE, card);
        setUser(profile);
        setHasLocalProfile(true);
      }
    } catch (error) {
      console.error("Error during sign in success handling:", error);
    }
  }, [setSession, setUser, setHasLocalProfile]);

  const loadSession = useCallback(async () => {
    try {
      console.log("Loading saved session...");
      setIsLoading(true);
      
      // Check network status
      const netState = await NetInfo.fetch();
      const offline = netState.isConnected === false;
      setIsOffline(offline);

      // Check for local profile
      const storedProfile = await StorageService.getItem<BusinessCard>(STORAGE_KEYS.USER_PROFILE);
      setHasLocalProfile(!!storedProfile);

      const savedSession = await StorageService.getSecureItem<LocalAuthSession>(STORAGE_KEYS.AUTH_TOKENS);
      
      if (savedSession) {
        if (!offline && savedSession.expiresAt < Date.now() / 1000) {
          // Only attempt refresh if online
          if (savedSession.refreshToken) {
            const newSession = await AzureService.refresh(savedSession.refreshToken, TENANT_ID, CLIENT_ID);
            await handleSignInSuccess(newSession);
          } else {
            await StorageService.removeSecureItem(STORAGE_KEYS.AUTH_TOKENS);
            clearAuth();
          }
        } else {
          // If offline or session still valid, use saved session
          setSession(savedSession);
          
          if (!offline) {
            // If online, refresh profile data
            try {
              const profile = await AzureService.getUserProfile(savedSession.accessToken);
              await StorageService.saveItem(STORAGE_KEYS.USER_PROFILE, mapAzureUserToCard(profile));
              setUser(profile);
              setHasLocalProfile(true);
            } catch (err) {
              console.error("Failed to refresh profile from Azure:", err);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error loading session:", error);
    } finally {
      setIsLoading(false);
    }
  }, [handleSignInSuccess, setSession, setUser, setIsLoading, setIsOffline, setHasLocalProfile, clearAuth]);

  // Handle Auth Response
  useEffect(() => {
    if (response?.type === "success") {
      const { authentication, params } = response;
      if (authentication) {
        const newSession: LocalAuthSession = {
          accessToken: authentication.accessToken,
          refreshToken: authentication.refreshToken,
          expiresAt: Math.floor(Date.now() / 1000) + (authentication.expiresIn || 3600),
        };
        handleSignInSuccess(newSession);
      } else if (params.code && discovery) {
        setIsLoading(true);
        Auth.exchangeCodeAsync(
          {
            clientId: CLIENT_ID,
            code: params.code,
            extraParams: request?.codeVerifier ? { code_verifier: request.codeVerifier } : {},
            redirectUri,
          },
          discovery,
        )
          .then((tokenResponse) => {
            const newSession: LocalAuthSession = {
              accessToken: tokenResponse.accessToken,
              refreshToken: tokenResponse.refreshToken,
              expiresAt: Math.floor(Date.now() / 1000) + (tokenResponse.expiresIn || 3600),
            };
            handleSignInSuccess(newSession);
          })
          .catch((error) => {
            console.error("Token exchange failed:", error);
            Alert.alert("Authentication Error", "Failed to exchange code.");
          })
          .finally(() => setIsLoading(false));
      }
    } else if (response?.type === "error") {
      console.error("Auth response error:", response.error);
    }
  }, [response, discovery, request, redirectUri, handleSignInSuccess, setIsLoading]);

  // Listen for network changes
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(state.isConnected === false);
    });
    return () => unsubscribe();
  }, [setIsOffline]);

  const signIn = async () => {
    const netState = await NetInfo.fetch();
    if (!netState.isConnected) {
      Alert.alert("Offline", "Please check your internet connection to sign in.");
      return;
    }

    if (!request) return;
    try {
      if (Platform.OS === "android") {
        const result = await WebBrowser.getCustomTabsSupportingBrowsersAsync();
        if (result.browserPackages.length === 0 && !result.defaultBrowserPackage) {
          Alert.alert("No Browser Found", "A web browser is required for sign-in.");
          return;
        }
      }
      await promptAsync();
    } catch (error) {
      console.error("Detailed sign-in error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await StorageService.removeSecureItem(STORAGE_KEYS.AUTH_TOKENS);
      await StorageService.removeItem(STORAGE_KEYS.USER_PROFILE);
      clearAuth();
      const netState = await NetInfo.fetch();
      if (netState.isConnected) {
        await AzureService.signOut();
      }
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return {
    session,
    user,
    isLoading,
    isOffline,
    hasLocalProfile,
    signIn,
    signOut,
    loadSession, // Exported to be called once in layout
  };
};
