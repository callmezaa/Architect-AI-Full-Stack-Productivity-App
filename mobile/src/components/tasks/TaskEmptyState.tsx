import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Colors, Spacing, Typography, Shadows, BorderRadius } from '../../constants/theme';
import { Layout } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';

interface TaskEmptyStateProps {
  message?: string;
}

export const TaskEmptyState = ({ message = "All caught up! Time to recharge." }: TaskEmptyStateProps) => {
  const { theme, isDark } = useTheme();
  
  return (
    <Animated.View 
      entering={FadeInDown.duration(800)} 
      style={styles.container}
    >
      <View style={[styles.iconBox, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(26, 54, 115, 0.05)' }]}>
        <Layout size={48} color={theme.primary} strokeWidth={1} />
      </View>
      <Text style={[styles.message, { color: theme.text }]}>{message}</Text>
      <Text style={[styles.submessage, { color: theme.textMuted }]}>
        Your productivity score is currently peaking. Check back later for fresh AI suggestions.
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconBox: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  message: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  submessage: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  }
});
