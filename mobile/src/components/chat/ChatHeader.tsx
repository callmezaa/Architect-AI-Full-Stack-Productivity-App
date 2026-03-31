import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Typography, Shadows } from '../../constants/theme';
import { MoreVertical, Sparkles } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface ChatHeaderProps {
  onClear: () => void;
  isTyping?: boolean;
}

export const ChatHeader = ({ onClear, isTyping }: ChatHeaderProps) => {
  return (
    <Animated.View entering={FadeInUp.springify()} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.titleArea}>
           <View style={styles.iconContainer}>
              <Sparkles size={16} color="#FFF" />
           </View>
           <View>
              <Text style={styles.title}>AI Assistant</Text>
              <View style={styles.statusRow}>
                 <View style={[styles.statusDot, isTyping && { backgroundColor: Colors.light.primary }]} />
                 <Text style={styles.statusText}>{isTyping ? 'Thinking...' : 'Ready to help'}</Text>
              </View>
           </View>
        </View>

        <TouchableOpacity onPress={onClear} style={styles.optionsButton} activeOpacity={0.7}>
           <MoreVertical size={20} color={Colors.light.textMuted} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    ...Typography.title,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34C759', // Apple Green
    marginRight: 6,
  },
  statusText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.light.textMuted,
    fontWeight: '600',
  },
  optionsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.surfaceSubtle,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
