import React from 'react';
import { StyleSheet, View, ViewProps, Platform } from 'react-native';
import { Colors, Shadows, BorderRadius, Spacing } from '../../constants/theme';

interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, style, ...props }) => {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Shadows.medium,
    // Add glass blur if on iOS (Expo-blur can be used if installed)
    // For now, simple surface with shadow is premium in light mode
  },
});
