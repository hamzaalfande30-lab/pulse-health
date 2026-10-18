import React, { ReactNode } from 'react';
import { View, ViewProps, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../context/AppContext';
import { RADIUS, SPACING } from '../../constants/theme';

interface CardProps extends ViewProps {
  elevated?: boolean;
  padding?: number;
  children: ReactNode;
}

export function Card({ elevated, padding, style, children, ...props }: CardProps) {
  const theme = useTheme();
  const c = theme.colors;

  const cardStyle: ViewStyle = {
    backgroundColor: elevated ? c.bgCardElevated : c.bgCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: c.border,
    padding: padding ?? SPACING.lg,
  };

  return (
    <View style={[cardStyle, style]} {...props}>
      {children}
    </View>
  );
}
