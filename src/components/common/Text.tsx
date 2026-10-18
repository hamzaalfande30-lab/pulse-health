import React from 'react';
import { Text as RNText, TextProps, TextStyle } from 'react-native';
import { useTheme, useLang } from '../../context/AppContext';
import { FONT_SIZE, FONT_WEIGHT } from '../../constants/theme';

interface PulseTextProps extends TextProps {
  variant?: 'huge' | 'xxxl' | 'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  color?: string;
  muted?: boolean;
  secondary?: boolean;
}

export function PText({
  variant = 'md',
  weight = 'regular',
  color,
  muted,
  secondary,
  style,
  children,
  ...props
}: PulseTextProps) {
  const theme = useTheme();
  const lang = useLang();
  const isRTL = lang === 'ar';

  const c = theme.colors;
  let resolvedColor = c.textPrimary;
  if (secondary) resolvedColor = c.textSecondary;
  if (muted) resolvedColor = c.textMuted;
  if (color) resolvedColor = color;

  const textStyle: TextStyle = {
    fontSize: FONT_SIZE[variant],
    fontWeight: FONT_WEIGHT[weight],
    color: resolvedColor,
    textAlign: isRTL ? 'right' : 'left',
    writingDirection: isRTL ? 'rtl' : 'ltr',
  };

  return (
    <RNText style={[textStyle, style]} {...props}>
      {children}
    </RNText>
  );
}
