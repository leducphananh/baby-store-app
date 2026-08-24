import { useEffect } from 'react';
import { Appearance } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Providers } from '@/providers';
import { AuthProvider } from '@/providers/AuthProvider';
import { useAuthStore } from '@/features/auth/store/authStore';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// The app only ships a light theme so far (most screens hardcode light
// colors and don't follow the system scheme yet), so pin the color scheme
// to light everywhere — otherwise screens that DO read the theme (like
// Categories) go dark on a device set to system dark mode while the rest
// of the app stays hardcoded white, which looks like a bug.
// `setColorScheme` isn't implemented on react-native-web, so guard it.
if (typeof Appearance.setColorScheme === 'function') {
  Appearance.setColorScheme('light');
}

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
    <SafeAreaProvider>
      <Providers>
        <AuthProvider>
          <InitialLayout />
        </AuthProvider>
      </Providers>
    </SafeAreaProvider>
  );
}
