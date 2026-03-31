import React from 'react';
import { StyleSheet, TouchableOpacity, View, Platform } from 'react-native';
import { Colors, Shadows, BorderRadius, Spacing } from '../../constants/theme';
import { Plus } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface TaskFABProps {
  onPress: () => void;
}

export const TaskFAB = ({ onPress }: TaskFABProps) => {
  return (
    <Animated.View 
      entering={FadeInDown.delay(600).springify()}
      style={styles.container}
    >
      <TouchableOpacity 
        onPress={onPress} 
        style={styles.fab}
        activeOpacity={0.8}
      >
        <Plus size={28} color="#FFF" strokeWidth={2.5} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    zIndex: 100,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
      },
      android: {
        elevation: 8,
      },
    }),
  }
});
