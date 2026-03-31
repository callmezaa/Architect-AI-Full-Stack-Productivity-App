import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { Slot, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider as CustomThemeProvider, useTheme } from '../context/ThemeContext';
import AppTabs from '@/components/app-tabs';
import * as SecureStore from 'expo-secure-store';
import { SplashScreen } from '../components/ui/SplashScreen';
import { notificationService } from '../app/services/notificationService';
import '../i18n';

function AppContent() {
  const segments = useSegments();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const [isAuthChecked, setIsAuthChecked] = React.useState(false);
  const [isTimerDone, setIsTimerDone] = React.useState(false);
  const { isDark, theme } = useTheme();

  // 1. Splash Screen Timer
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setIsTimerDone(true);
    }, 2500);
    return () => clearTimeout(timeout);
  }, []);

  // 2. Auth & Navigation Logic
  React.useEffect(() => {
    if (!rootNavigationState?.key || isAuthChecked) return;

    const performAuthCheck = async () => {
      try {
        const token = await SecureStore.getItemAsync('user_token');
        const segment0 = segments[0];
        const segment1 = segments[1];
        const isOnboarding = segment0 === '(auth)' && segment1 === 'onboarding';

        console.log('[AuthCheck] Flow start', { token: !!token, isOnboarding });

        // Always show Onboarding first if not already there
        if (!isOnboarding) {
          console.log('[AuthCheck] Universal Redirect to Onboarding');
          router.replace('/(auth)/onboarding');
        }
        
        setIsAuthChecked(true);
      } catch (e) {
        console.error("[AuthCheck] Failed", e);
        setIsAuthChecked(true);
      }
    };

    performAuthCheck();
  }, [rootNavigationState?.key, segments[0], isAuthChecked]);

  // 3. Notification Initialization (Placeholder active)
  React.useEffect(() => {
    notificationService.registerForPushNotificationsAsync();
  }, []);

  const isReady = isAuthChecked && isTimerDone;
  const hideTabs = segments[0] === '(auth)';

  // Wait for auth check to be fully processed before showing content
  if (!isAuthChecked) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={{ flex: 1, position: 'relative' }}>
        <Slot />
        
        {!isReady && (
          <View style={[StyleSheet.absoluteFill, styles.splashContainer, { backgroundColor: theme.architectBlue }]}>
            <SplashScreen />
          </View>
        )}
      </View>

      {!hideTabs && isReady && <AppTabs />}
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <CustomThemeProvider>
        <AppContent />
      </CustomThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  splashContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  }
});
