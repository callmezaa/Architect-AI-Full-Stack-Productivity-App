import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Colors, Spacing, Typography } from '../../constants/theme';
import { Sparkles } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
}

export const AuthHeader = ({ title, subtitle }: AuthHeaderProps) => {
  return (
    <Animated.View 
      entering={FadeInDown.duration(800)} 
      style={styles.container}
    >
      <View style={styles.logoRow}>
        <Sparkles size={24} color={Colors.light.architectBlue} fill={Colors.light.architectBlue} />
        <Text style={styles.logoText}>ARCHITECT</Text>
      </View>
      
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.light.architectBlue,
    letterSpacing: 4,
  },
  title: {
    ...Typography.title,
    fontSize: 32,
    fontWeight: '800',
    color: '#111',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    ...Typography.body,
    fontSize: 16,
    color: Colors.light.textMuted,
    marginTop: 8,
    textAlign: 'center',
  }
});
