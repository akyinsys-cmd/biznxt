import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

type Theme = 'light' | 'dark';
type Preset = 'corporate' | 'creative' | 'minimalist';

interface ThemeContextType {
  preset: Preset;
  setPreset: (preset: Preset) => void;
  hapticsEnabled: boolean;
  setHapticsEnabled: (enabled: boolean) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [hapticsEnabled, setHapticsEnabledState] = useState<boolean>(() => {
    const saved = localStorage.getItem('hapticsEnabled');
    return saved !== 'false';
  });

  const [preset, setPresetState] = useState<Preset>(() => {
    const saved = localStorage.getItem('theme-preset') as Preset;
    if (['corporate', 'creative', 'minimalist'].includes(saved)) return saved;
    return 'corporate';
  });

  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  // Fetch theme from Firestore when user logs in
  useEffect(() => {
    if (user) {
      const fetchTheme = async () => {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.preferences?.hapticsEnabled !== undefined) {
              setHapticsEnabledState(userData.preferences.hapticsEnabled);
            }
            if (userData.preferences?.preset && ['corporate', 'creative', 'minimalist'].includes(userData.preferences.preset)) {
              setPresetState(userData.preferences.preset as Preset);
            }
            if (userData.preferences?.theme && (userData.preferences.theme === 'light' || userData.preferences.theme === 'dark')) {
              setThemeState(userData.preferences.theme);
            }
          }
        } catch (error: any) {
          if (error?.code === 'unavailable' || error?.message?.includes('offline')) {
            console.warn("Client offline, using local theme preference.");
          } else {
            console.error("Failed to fetch user theme preference", error);
          }
        }
      };
      fetchTheme();
    }
  }, [user]);

  const setHapticsEnabled = async (enabled: boolean) => {
    setHapticsEnabledState(enabled);
    localStorage.setItem('hapticsEnabled', enabled.toString());
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          preferences: { hapticsEnabled: enabled }
        }, { merge: true });
      } catch (error) {
        console.error("Failed to save haptics preference", error);
      }
    }
  };

  const setPreset = async (newPreset: Preset) => {
    setPresetState(newPreset);
    localStorage.setItem('theme-preset', newPreset);
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          preferences: { preset: newPreset }
        }, { merge: true });
      } catch (error) {
        console.error("Failed to save preset to Firestore", error);
      }
    }
  };

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          preferences: {
            theme: newTheme
          }
        }, { merge: true });
      } catch (error) {
        console.error("Failed to save theme preference to Firestore", error);
      }
    }
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'theme-corporate', 'theme-creative', 'theme-minimalist');
    root.classList.add(theme);
    root.classList.add(`theme-${preset}`);
    localStorage.setItem('theme', theme);
  }, [theme, preset]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, hapticsEnabled, setHapticsEnabled, preset, setPreset }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
