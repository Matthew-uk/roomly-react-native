import {
  Manrope_400Regular,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from '@expo-google-fonts/manrope';
import {
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import {
  Urbanist_400Regular,
  Urbanist_600SemiBold,
  Urbanist_700Bold,
} from '@expo-google-fonts/urbanist';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import MapboxGL from '@rnmapbox/maps';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import '../global.css';
MapboxGL.setAccessToken(
  'pk.eyJ1IjoibWF0dGhldy11a2FyaSIsImEiOiJjbTlteXBnamEwZGhhMmpyNzExbWd3ejE2In0.f5Qs76_7HLfHIC7hBwJmxg',
);

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
    Montserrat_500Medium,
    // Urbanist
    'Urbanist-Regular': Urbanist_400Regular,
    'Urbanist-Semibold': Urbanist_600SemiBold,
    'Urbanist-Bold': Urbanist_700Bold,

    // Plus Jakarta Sans
    'PlusJakarta-Regular': PlusJakartaSans_400Regular,
    'PlusJakarta-Semibold': PlusJakartaSans_600SemiBold,
    'PlusJakarta-Bold': PlusJakartaSans_700Bold,

    // Manrope
    'Manrope-Regular': Manrope_400Regular,
    'Manrope-Semibold': Manrope_600SemiBold,
    'Manrope-Bold': Manrope_700Bold,
  });

  // Hide splash screen when fonts are ready
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // or use a custom loader
  }

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(modal)" options={{ presentation: 'modal' }} />
        </Stack>
        <Toast position="top" swipeable={true} />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
