import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { NfcService } from "@/services/nfc";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { session, isLoading: isAuthLoading } = useAuth();
  const [isReady, setIsReady] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    NfcService.start();
    
    // Set a minimum timeout for the splash screen
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 2000); // 2000ms = 2 seconds
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    console.log("RootLayoutNav Sync:", {
      isAuthLoading,
      isReady,
      hasSession: !!session,
      segments,
    });

    if (isAuthLoading || !isReady) {
      console.log("RootLayoutNav: Still loading or waiting for splash timeout");
      return;
    }

    // Hide splash screen once loading is complete and timeout has passed
    SplashScreen.hideAsync();

    const inAuthGroup = segments[0] === "(auth)";

    console.log("Navigation Check:", {
      session: !!session,
      segments,
      inAuthGroup,
    });

    if (!session) {
      // If no session, force login screen
      if (segments[0] !== "(auth)" || segments[1] !== "login") {
        console.log("Navigation: Forcing Login");
        router.replace("/(auth)/login");
      } else {
        console.log("Navigation: Already on Login screen");
      }
    } else if (inAuthGroup || segments.length < 1) {
      // If session exists but user is in auth group or at root, go to main app
      console.log("Navigation: Forcing Main App (tabs/profile)");
      router.replace("/(tabs)/profile");
    } else {
      console.log("Navigation: No action needed", { segments });
    }
  }, [session, isAuthLoading, isReady, segments, router]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="card/create"
          options={{ headerShown: false, title: "Create Card" }}
        />
        <Stack.Screen
          name="card/[id]"
          options={{ headerShown: false, title: "Edit Card" }}
        />
        <Stack.Screen
          name="card/index"
          options={{ headerShown: false, title: "Cards" }}
        />
        <Stack.Screen
          name="modal"
          options={{
            presentation: "modal",
            headerShown: false,
            title: "Modal",
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
