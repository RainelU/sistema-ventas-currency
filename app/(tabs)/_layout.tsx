import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useSettings } from '@/context/settings-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const systemScheme = useColorScheme();
  const { themeMode } = useSettings();

  // Resolve effective scheme: settings override > system > default light
  const effectiveScheme =
    themeMode === 'system'
      ? (systemScheme ?? 'light')
      : themeMode;

  const activeTint = Colors[effectiveScheme].tint;
  const inactiveTint = Colors[effectiveScheme].tabIconDefault;
  const tabBarBg = effectiveScheme === 'dark' ? '#151718' : '#fff';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeTint,
        tabBarInactiveTintColor: inactiveTint,
        tabBarStyle: { backgroundColor: tabBarBg },
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Productos',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="shippingbox.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="currencies"
        options={{
          title: 'Monedas',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="dollarsign.circle.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Configuración',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gearshape.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
