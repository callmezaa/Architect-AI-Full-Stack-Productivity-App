import React from 'react';
import { StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Typography, Shadows, BorderRadius } from '../../constants/theme';
import { Sparkles } from 'lucide-react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

interface ChatSuggestionChipsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

export const ChatSuggestionChips = ({ suggestions, onSelect }: ChatSuggestionChipsProps) => {
  return (
    <Animated.ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
      entering={FadeInRight.delay(400)}
    >
      {suggestions.map((suggestion, i) => (
        <TouchableOpacity 
          key={i} 
          style={styles.chip} 
          onPress={() => onSelect(suggestion)}
          activeOpacity={0.7}
        >
          <Sparkles size={14} color={Colors.light.primary} />
          <Text style={styles.text}>{suggestion}</Text>
        </TouchableOpacity>
      ))}
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  content: {
    paddingRight: 40,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Shadows.soft,
  },
  text: {
    ...Typography.caption,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.text,
  }
});
