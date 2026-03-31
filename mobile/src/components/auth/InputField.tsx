import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, TextInputProps } from 'react-native';
import { Colors, Spacing, Shadows, Typography, BorderRadius } from '../../constants/theme';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface InputFieldProps extends TextInputProps {
  icon: any;
  error?: string;
}

export const InputField = ({ icon: Icon, error, ...props }: InputFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const containerStyle = useAnimatedStyle(() => {
    return {
      borderColor: withTiming(
        error ? '#EF4444' : isFocused ? Colors.light.architectBlue : 'transparent',
        { duration: 200 }
      ),
      backgroundColor: withTiming(
        isFocused ? '#FFFFFF' : 'rgba(22, 47, 105, 0.05)',
        { duration: 200 }
      ),
      borderWidth: withTiming(isFocused || error ? 1.5 : 0, { duration: 200 }),
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.inputWrapper, containerStyle]}>
        <Icon 
          size={18} 
          color={error ? '#EF4444' : isFocused ? Colors.light.architectBlue : Colors.light.textMuted} 
          style={styles.icon} 
        />
        <TextInput
          style={styles.input}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={Colors.light.textMuted}
          {...props}
        />
      </Animated.View>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 58,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 20,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#111',
    fontSize: 15,
    fontWeight: '600',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 20,
    fontWeight: '600',
  },
});
