import { Platform } from 'react-native';

export const Colors = {
  light: {
    primary: '#1A3673', 
    secondary: '#3b82f6', 
    accent: '#34C759',
    background: '#F6F8FA', 
    surface: '#FFFFFF', 
    surfaceSubtle: '#F2F2F7', 
    text: '#111827', 
    textMuted: '#6B7280', 
    border: '#E5E5EA',
    architectBlue: '#162F69', 
    glassEffect: 'rgba(255, 255, 255, 0.8)',
    shadow: 'rgba(0, 0, 0, 0.05)',
  },
  dark: {
    primary: '#3b82f6', 
    secondary: '#60a5fa', 
    accent: '#34C759',
    background: '#0F172A', // Slate 900
    surface: '#1E293B', // Slate 800
    surfaceSubtle: '#334155', // Slate 700
    text: '#F8FAFC', // Slate 50
    textMuted: '#94A3B8', // Slate 400
    border: '#1E293B',
    architectBlue: '#1E293B', // In dark mode, we use surface color for the main card
    glassEffect: 'rgba(30, 41, 59, 0.8)',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const Typography = {
  h1: {
    fontSize: 34,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: '700' as const,
    letterSpacing: -0.2,
  },
  body: {
    fontSize: 17,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: '#8E8E93',
  },
} as const;

export const Shadows = {
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 20,
  xl: 32,
  full: 999,
} as const;
