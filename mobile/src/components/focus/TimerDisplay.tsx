import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, { 
  useAnimatedProps, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';
import { Colors, Shadows, Typography } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');
const SIZE = width * 0.72;
const STROKE_WIDTH = 12;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface TimerDisplayProps {
  progress: number;
  timeLeft: string;
  mode: 'work' | 'break';
  isActive: boolean;
}

export const TimerDisplay = ({ progress, timeLeft, mode, isActive }: TimerDisplayProps) => {
  const { theme, isDark } = useTheme();
  
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: withTiming(CIRCUMFERENCE * (1 - progress), {
      duration: 1000,
      easing: Easing.linear,
    }),
  }));

  const accentColor = mode === 'work' ? theme.primary : '#10B981';

  return (
    <View style={styles.container}>
      <View style={[styles.outerGlow, { shadowColor: accentColor, opacity: isActive ? 1 : 0 }]} />
      
      <Svg width={SIZE} height={SIZE}>
        <Defs>
          <LinearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={accentColor} />
            <Stop offset="100%" stopColor={isDark ? '#FFF' : accentColor} />
          </LinearGradient>
        </Defs>
        
        {/* Background Track */}
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        
        {/* Progress Circle */}
        <AnimatedCircle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke="url(#timerGradient)"
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          animatedProps={animatedProps}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        />
      </Svg>

      <View style={styles.textContainer}>
        <Text style={[styles.timerText, { color: theme.text }]}>
          {timeLeft}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)' }]}>
           <View style={[styles.statusDot, { backgroundColor: accentColor }]} />
           <Text style={[styles.statusText, { color: theme.textMuted }]}>
             {mode === 'work' ? 'FLOWING' : 'RECOVERY'}
           </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SIZE,
    height: SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
  },
  outerGlow: {
    position: 'absolute',
    width: SIZE - 20,
    height: SIZE - 20,
    borderRadius: SIZE / 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    backgroundColor: 'transparent',
    zIndex: -1,
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 72,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    letterSpacing: -2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
