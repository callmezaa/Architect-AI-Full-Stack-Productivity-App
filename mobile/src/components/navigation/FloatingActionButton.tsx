import React from 'react';
import { StyleSheet, TouchableOpacity, View, Platform } from 'react-native';
import { Colors, Shadows, Spacing } from '../../constants/theme';
import { Plus } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring 
} from 'react-native-reanimated';

interface FloatingActionButtonProps {
  onPress: () => void;
}

export const FloatingActionButton = ({ onPress }: FloatingActionButtonProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 10 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10 });
    onPress();
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.fabWrapper, animatedStyle]}>
        <TouchableOpacity 
          style={styles.fab} 
          activeOpacity={1}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Plus size={32} color="#FFF" strokeWidth={2.5} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: '50%',
    marginLeft: -35, // Half of FAB width
    top: -24, // Adjust this to "merge" with the notched nav bar
    zIndex: 100,
  },
  fabWrapper: {
    ...Shadows.medium,
    borderRadius: 35,
    backgroundColor: Colors.light.primary,
  },
  fab: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      }
    })
  }
});
