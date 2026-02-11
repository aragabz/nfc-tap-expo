import { Redirect } from 'expo-router';

export default function Index() {
  // This is a placeholder that triggers the redirect logic in _layout.tsx
  // Since _layout.tsx handles the actual redirection based on auth/onboarding state,
  // we just need to ensure this route exists so the app doesn't show "Page not found".
  return <Redirect href="/(auth)/onboarding" />;
}
