import React, { createContext, useContext, useMemo, useState, useCallback } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { buildTheme, Theme } from "./theme";

interface SettingsContextValue {
  theme: Theme;
  isDark: boolean;
  setDark: (v: boolean) => void;
  largeText: boolean;
  setLargeText: (v: boolean) => void;
  highContrast: boolean;
  setHighContrast: (v: boolean) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

const STORAGE_KEY = "get_settings_v1";

export function GetThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [isDark, setDarkState] = useState<boolean>(system === "dark");
  const [largeText, setLargeTextState] = useState(false);
  const [highContrast, setHighContrastState] = useState(false);

  // Load persisted settings once
  React.useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (!raw) return;
      try {
        const s = JSON.parse(raw);
        if (typeof s.isDark === "boolean") setDarkState(s.isDark);
        if (typeof s.largeText === "boolean") setLargeTextState(s.largeText);
        if (typeof s.highContrast === "boolean") setHighContrastState(s.highContrast);
      } catch {}
    });
  }, []);

  const persist = useCallback(
    (next: { isDark?: boolean; largeText?: boolean; highContrast?: boolean }) => {
      AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ isDark, largeText, highContrast, ...next })
      ).catch(() => {});
    },
    [isDark, largeText, highContrast]
  );

  const setDark = useCallback((v: boolean) => { setDarkState(v); persist({ isDark: v }); }, [persist]);
  const setLargeText = useCallback((v: boolean) => { setLargeTextState(v); persist({ largeText: v }); }, [persist]);
  const setHighContrast = useCallback((v: boolean) => { setHighContrastState(v); persist({ highContrast: v }); }, [persist]);

  const theme = useMemo(() => buildTheme(isDark, largeText, highContrast), [isDark, largeText, highContrast]);

  const value = useMemo(
    () => ({ theme, isDark, setDark, largeText, setLargeText, highContrast, setHighContrast }),
    [theme, isDark, setDark, largeText, setLargeText, highContrast, setHighContrast]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within GetThemeProvider");
  return ctx;
}

export function useTheme(): Theme {
  return useSettings().theme;
}
