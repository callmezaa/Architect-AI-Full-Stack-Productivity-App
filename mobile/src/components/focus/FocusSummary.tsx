import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Colors, Spacing, Shadows, BorderRadius, Typography } from '../../constants/theme';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { CheckCircle2, Sparkles } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

interface FocusSummaryProps {
  timeFocused: string;
  onClose: () => void;
}

export const FocusSummary = ({ timeFocused, onClose }: FocusSummaryProps) => {
  const { theme, isDark } = useTheme();

  return (
    <Animated.View 
      entering={FadeIn}
      style={[StyleSheet.absoluteFill, styles.overlay, { backgroundColor: isDark ? 'rgba(0,0,0,0.85)' : 'rgba(26, 54, 115, 0.4)' }]}
    >
      <Animated.View 
        entering={SlideInDown.springify().damping(15)}
        style={[styles.modal, { backgroundColor: theme.surface }]}
      >
        <View style={[styles.iconBadge, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(26, 54, 115, 0.05)' }]}>
           <CheckCircle2 size={40} color={theme.primary} strokeWidth={2.5} />
        </View>

        <Text style={[styles.title, { color: theme.text }]}>Great Session!</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          You stayed focused for {timeFocused}. Every minute counts towards your progress.
        </Text>

        <View style={[styles.statsRow, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }]}>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: theme.text }]}>1.2h</Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>Today</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: theme.text }]}>+12%</Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>Efficiency</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.primary }]} 
          activeOpacity={0.8}
          onPress={onClose}
        >
          <Text style={styles.buttonText}>Take a Short Break</Text>
          <Sparkles size={16} color="#FFF" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  modal: {
    padding: 32,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    alignItems: 'center',
    ...Shadows.medium,
  },
  iconBadge: {
    width: 84,
    height: 84,
    borderRadius: 42,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    padding: 20,
    borderRadius: 24,
    marginBottom: 32,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  divider: {
    width: 1,
    height: '100%',
  },
  button: {
    flexDirection: 'row',
    width: '100%',
    height: 64,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
