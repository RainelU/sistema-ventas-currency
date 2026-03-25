import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { CurrenciesProvider } from '@/context/currencies-context';
import { ProductsProvider } from '@/context/products-context';
import { SettingsProvider, useSettings } from '@/context/settings-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

// Separated so it can consume SettingsProvider
function AppContent() {
  const systemScheme = useColorScheme();
  const { themeMode } = useSettings();

  const resolvedScheme =
    themeMode === 'system' ? systemScheme : themeMode;

  const theme = resolvedScheme === 'dark' ? DarkTheme : DefaultTheme;
  const statusBarStyle = resolvedScheme === 'dark' ? 'light' : 'dark';

  return (
    <ThemeProvider value={theme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false, title: 'Productos' }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="product/[id]" options={{ title: 'Detalle del Producto' }} />
        <Stack.Screen name="product/modal" options={{ presentation: 'modal', title: 'Producto' }} />
      </Stack>
      <StatusBar style={statusBarStyle} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SettingsProvider>
      <CurrenciesProvider>
        <ProductsProvider>
          <AppContent />
        </ProductsProvider>
      </CurrenciesProvider>
    </SettingsProvider>
  );
}
