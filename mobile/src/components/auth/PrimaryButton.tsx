import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ActivityIndicator, ViewStyle } from 'react-native';
import { Colors, Shadows, Typography, BorderRadius } from '../../constants/theme';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  style?: ViewStyle;
}

export const PrimaryButton = ({ title, onPress, loading, style }: PrimaryButtonProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View style={[styles.container, animatedStyle, style]}>
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={loading}
        activeOpacity={1}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={styles.text}>{title}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: BorderRadius.full,
    ...Shadows.medium,
  },
  button: {
    backgroundColor: Colors.light.architectBlue,
    height: 60,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
