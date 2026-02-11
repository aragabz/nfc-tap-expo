import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { NfcService } from '@/services/nfc';
import { AuthProvider, useAuth } from '@/hooks/use-auth';
import { OnboardingProvider, useOnboarding } from '@/hooks/use-onboarding';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  return (
    <OnboardingProvider>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </OnboardingProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { session, isLoading: isAuthLoading } = useAuth();
  const { isCompleted: isOnboardingCompleted, isLoading: isOnboardingLoading } = useOnboarding();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    NfcService.start();
  }, []);

  useEffect(() => {
    console.log('RootLayoutNav Sync:', { 
      isAuthLoading, 
      isOnboardingLoading, 
      hasSession: !!session, 
      segments 
    });

    if (isAuthLoading || isOnboardingLoading) {
      console.log('RootLayoutNav: Still loading, skipping navigation check');
      return;
    }

    // Hide splash screen once loading is complete
    SplashScreen.hideAsync();

    const inAuthGroup = segments[0] === '(auth)';
    
    console.log('Navigation Check:', {
      isOnboardingCompleted,
      session: !!session,
      segments,
      inAuthGroup
    });

    if (isOnboardingCompleted === false) {
      // If onboarding is NOT completed, always force onboarding screen
      if (segments[0] !== '(auth)' || segments[1] !== 'onboarding') {
         console.log('Navigation: Forcing Onboarding');
         router.replace('/(auth)/onboarding');
      }
    } else if (!session) {
      // If onboarding IS completed but no session, force login screen
      if (segments[0] !== '(auth)' || segments[1] !== 'login') {
        console.log('Navigation: Forcing Login');
        router.replace('/(auth)/login');
      } else {
        console.log('Navigation: Already on Login screen');
      }
    } else if (inAuthGroup || segments.length < 1) {
      // If session exists but user is in auth group or at root, go to main app
      console.log('Navigation: Forcing Main App (tabs)');
      router.replace('/(tabs)');
    } else {
      console.log('Navigation: No action needed', { segments });
    }
  }, [session, isAuthLoading, isOnboardingCompleted, isOnboardingLoading, segments, router]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(auth)/onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}