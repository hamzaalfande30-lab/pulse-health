import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { AppProvider, useTheme } from '../src/context/AppContext';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function RootContent() {
  const theme = useTheme();

  useEffect(() => {
    // Hide splash once the app is mounted
    SplashScreen.hideAsync();
  }, []);

  return (
    <>
      <StatusBar style="light" backgroundColor={theme.colors.bgMain} />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <RootContent />
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
