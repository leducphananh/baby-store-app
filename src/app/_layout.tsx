import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Providers } from '@/providers';
import { AuthProvider } from '@/providers/AuthProvider';
import { useAuthStore } from '@/features/auth/store/authStore';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function InitialLayout() {
  const { isInitialized, session } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (session) {
      // If user is logged in but still on the auth screens, redirect them to the app
      if (inAuthGroup) {
        router.replace('/(app)/(tabs)');
      }
    } else {
      // If user is not logged in and trying to access app screens, force to login
      if (!inAuthGroup) {
        router.replace('/(auth)/login');
      }
    }
    
    // Hide splash screen once we know what to render
    SplashScreen.hideAsync();
  }, [session, isInitialized, segments, router]);

  if (!isInitialized) {
    return null; // Return null or splash screen component while checking session
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <Providers>
      <AuthProvider>
        <InitialLayout />
      </AuthProvider>
    </Providers>
  );
}
