import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type ProfitMode = 'margin' | 'markup';
export type ThemeMode = 'light' | 'dark' | 'system';

interface SettingsState {
  profitMode: ProfitMode;
  themeMode: ThemeMode;
  setProfitMode: (mode: ProfitMode) => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const KEYS = {
  PROFIT_MODE: '@psm/profitMode',
  THEME_MODE: '@psm/themeMode',
} as const;

const SettingsContext = createContext<SettingsState | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [profitMode, setProfitModeState] = useState<ProfitMode>('margin');
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    AsyncStorage.multiGet([KEYS.PROFIT_MODE, KEYS.THEME_MODE]).then(pairs => {
      const pm = pairs[0][1] as ProfitMode | null;
      const tm = pairs[1][1] as ThemeMode | null;
      if (pm) setProfitModeState(pm);
      if (tm) setThemeModeState(tm);
    });
  }, []);

  const setProfitMode = useCallback((mode: ProfitMode) => {
    setProfitModeState(mode);
    AsyncStorage.setItem(KEYS.PROFIT_MODE, mode);
  }, []);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    AsyncStorage.setItem(KEYS.THEME_MODE, mode);
  }, []);

  const value = useMemo(
    () => ({ profitMode, themeMode, setProfitMode, setThemeMode }),
    [profitMode, themeMode, setProfitMode, setThemeMode]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsState {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
