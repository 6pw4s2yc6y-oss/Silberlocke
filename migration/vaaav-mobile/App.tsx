// ── App-Einstieg ────────────────────────────────────────────────────────────
// Lädt die Inter-Schriftfamilie (theme.ts, Typografie-Regel) und rendert den
// Master-Screen-Prototyp innerhalb des SafeArea-Kontexts, den die schwebende
// Core Bar für ihre Positionierung braucht.

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
  Inter_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/inter';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MasterScreen } from './src/screens/MasterScreen';
import { theme } from './src/theme/theme';

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  if (!fontsLoaded) {
    // Kein Flash of Unstyled Text: bis zum Font-Load nur die matte Grundfläche
    return <View style={{ flex: 1, backgroundColor: theme.colors.background }} />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <MasterScreen />
    </SafeAreaProvider>
  );
}
