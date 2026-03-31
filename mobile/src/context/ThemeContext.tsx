import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Colors } from '../constants/theme';
import { settingsService } from '../app/services/api';

interface Theme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  surfaceSubtle: string;
  text: string;
  textMuted: string;
  border: string;
  architectBlue: string;
  glassEffect: string;
  shadow: string;
}

interface ThemeContextType {
  isDark: boolean;
  theme: Theme;
  toggleTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    const loadTheme = async () => {
      const settings = await settingsService.getSettings();
      if (settings && typeof settings.darkMode === 'boolean') {
        setIsDark(settings.darkMode);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    // Persist to settings
    const settings = await settingsService.getSettings();
    await settingsService.saveSettings({
      ...settings,
      darkMode: newIsDark
    });
  };

  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider value={{ isDark, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
