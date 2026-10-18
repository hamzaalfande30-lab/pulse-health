import { ThemeName } from '../types';

export interface ColorTokens {
  bgMain: string;
  bgSecondary: string;
  bgCard: string;
  bgCardElevated: string;
  primary: string;
  secondary: string;
  accent: string;
  accentAlt: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  warning: string;
  error: string;
  gradientStart: string;
  gradientEnd: string;
}

export interface Theme {
  name: ThemeName;
  label: string;
  colors: ColorTokens;
}

export const THEMES: Record<ThemeName, Theme> = {
  'midnight-lime': {
    name: 'midnight-lime',
    label: 'Midnight Lime',
    colors: {
      bgMain: '#080B12',
      bgSecondary: '#0D111B',
      bgCard: '#121826',
      bgCardElevated: '#192131',
      primary: '#B7F34A',
      secondary: '#58E1B5',
      accent: '#55C8F5',
      accentAlt: '#A78BFA',
      textPrimary: '#F4F7FB',
      textSecondary: '#9AA6B8',
      textMuted: '#667085',
      border: '#252E40',
      warning: '#FFC857',
      error: '#FF6B78',
      gradientStart: '#B7F34A',
      gradientEnd: '#58E1B5',
    },
  },
  'deep-ocean': {
    name: 'deep-ocean',
    label: 'Deep Ocean',
    colors: {
      bgMain: '#060A14',
      bgSecondary: '#0A1020',
      bgCard: '#0F1928',
      bgCardElevated: '#162234',
      primary: '#55C8F5',
      secondary: '#58E1B5',
      accent: '#B7F34A',
      accentAlt: '#A78BFA',
      textPrimary: '#EEF4FF',
      textSecondary: '#8EA6C4',
      textMuted: '#5A7090',
      border: '#1E2E44',
      warning: '#FFC857',
      error: '#FF6B78',
      gradientStart: '#55C8F5',
      gradientEnd: '#58E1B5',
    },
  },
  'violet-night': {
    name: 'violet-night',
    label: 'Violet Night',
    colors: {
      bgMain: '#09070F',
      bgSecondary: '#100E1A',
      bgCard: '#161224',
      bgCardElevated: '#1E1830',
      primary: '#A78BFA',
      secondary: '#C4B5FD',
      accent: '#F472B6',
      accentAlt: '#55C8F5',
      textPrimary: '#F5F0FF',
      textSecondary: '#9E94C0',
      textMuted: '#6B5F8A',
      border: '#2A2048',
      warning: '#FFC857',
      error: '#FF6B78',
      gradientStart: '#A78BFA',
      gradientEnd: '#F472B6',
    },
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const RADIUS = {
  sm: 10,
  md: 16,
  lg: 20,
  xl: 26,
  full: 999,
};

export const FONT_SIZE = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

export const FONT_WEIGHT = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};
