import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { CurrenciesProvider } from '@/context/currencies-context';
import { ProductsProvider } from '@/context/products-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <CurrenciesProvider>
      <ProductsProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            <Stack.Screen name="product/[id]" options={{ title: 'Detalle del Producto' }} />
            <Stack.Screen name="product/modal" options={{ presentation: 'modal', title: 'Producto' }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </ProductsProvider>
    </CurrenciesProvider>
  );
}
