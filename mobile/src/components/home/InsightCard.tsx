import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Shadows, BorderRadius, Typography } from '../../constants/theme';
import Animated, { 
  FadeInRight, 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring 
} from 'react-native-reanimated';
import { ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';

interface InsightCardProps {
  title: string;
  subtitle: string;
  icon: any;
  delay?: number;
  onPress?: () => void;
}

export const InsightCard = ({ title, subtitle, icon: Icon, delay = 0, onPress }: InsightCardProps) => {
  const { isDark, theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View 
      entering={FadeInRight.delay(delay).duration(600).springify()}
      style={[styles.container, animatedStyle]}
    >
      <TouchableOpacity 
        style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]} 
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
      >
        <View style={[styles.iconContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
          <Icon size={20} color={theme.primary} strokeWidth={2.5} />
        </View>
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>{title}</Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]} numberOfLines={1}>{subtitle}</Text>
        </View>
        <ChevronRight size={14} color={theme.textMuted} style={styles.chevron} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    marginBottom: Spacing.md,
  },
  card: {
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    ...Shadows.soft,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  content: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '500',
  },
  chevron: {
    position: 'absolute',
    right: 12,
    top: 14,
  },
});
