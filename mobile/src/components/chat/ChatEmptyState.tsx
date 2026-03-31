import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Colors, Spacing, Typography } from '../../constants/theme';
import { Bot, Sparkles } from 'lucide-react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

export const ChatEmptyState = () => {
  return (
    <View style={styles.container}>
      <Animated.View entering={ZoomIn.duration(800)} style={styles.iconContainer}>
        <View style={styles.mainIcon}>
           <Bot size={48} color={Colors.light.primary} strokeWidth={1.5} />
        </View>
        <Animated.View entering={FadeIn.delay(400)} style={styles.sparkleOne}>
           <Sparkles size={20} color={Colors.light.accent} fill={Colors.light.accent} />
        </Animated.View>
      </Animated.View>
      
      <Animated.Text entering={FadeIn.delay(600)} style={styles.title}>
        How can I help you today?
      </Animated.Text>
      <Animated.Text entering={FadeIn.delay(800)} style={styles.subtitle}>
        I can help you plan your day, summarize your tasks, or give you productivity tips.
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
    paddingHorizontal: Spacing.xl,
  },
  iconContainer: {
    marginBottom: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.light.surfaceSubtle,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.light.border,
  },
  sparkleOne: {
    position: 'absolute',
    top: -10,
    right: -10,
  },
  title: {
    ...Typography.title,
    fontSize: 22,
    fontWeight: '700',
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    ...Typography.body,
    fontSize: 15,
    color: Colors.light.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  }
});
