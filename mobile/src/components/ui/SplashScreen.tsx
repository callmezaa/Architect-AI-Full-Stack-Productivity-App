import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Colors, Typography, Spacing } from '../../constants/theme';
import { Sparkles } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring, 
  withSequence,
  withDelay,
  Easing
} from 'react-native-reanimated';

export const SplashScreen = () => {
  const logoScale = useSharedValue(0.5);
  const logoOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);
  const textOpacity = useSharedValue(0);
  const brandOpacity = useSharedValue(0);

  useEffect(() => {
    // 1. Logo Pops in
    logoScale.value = withSpring(1, { damping: 10, stiffness: 100 });
    logoOpacity.value = withTiming(1, { duration: 800 });

    // 2. Title slides up and fades in
    textTranslateY.value = withDelay(400, withSpring(0, { damping: 12, stiffness: 90 }));
    textOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));

    // 3. Brand baseline fades in
    brandOpacity.value = withDelay(1000, withTiming(1, { duration: 1000 }));
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }]
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }]
  }));

  const brandStyle = useAnimatedStyle(() => ({
    opacity: brandOpacity.value,
  }));

  return (
    <View style={styles.container}>
      {/* Background with pure architectBlue */}
      <View style={[StyleSheet.absoluteFillObject, styles.background]} />

      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          {/* We use a white icon to contrast the deep navy background (Option B) */}
          <Sparkles size={64} color="#FFFFFF" strokeWidth={1.5} />
        </Animated.View>

        <Animated.View style={[styles.textContainer, textStyle]}>
          <Text style={styles.title}>ARCHITECT</Text>
        </Animated.View>
      </View>

      <Animated.View style={[styles.footer, brandStyle]}>
        <Text style={styles.footerText}>Designed for Deep Work.</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.architectBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    backgroundColor: Colors.light.architectBlue,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // Extremely transparent white circle
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    ...Typography.h1,
    fontSize: 42,
    color: '#FFFFFF',
    letterSpacing: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
  },
  footerText: {
    ...Typography.caption,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 3,
    textTransform: 'uppercase',
  }
});
