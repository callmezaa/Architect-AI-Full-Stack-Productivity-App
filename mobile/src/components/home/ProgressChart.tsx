import React, { useEffect } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, { 
  useAnimatedProps, 
  useSharedValue, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';
import { Colors } from '../../constants/theme';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface ProgressChartProps {
  data: number[];
  height?: number;
  width?: number;
}

export const ProgressChart = ({ data = [10, 40, 25, 70, 50, 90, 80], height = 120, width }: ProgressChartProps) => {
  const chartWidth = width || Dimensions.get('window').width - 80;
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, {
      duration: 1500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, []);

  // Simple normalization to fit the SVG area
  const max = Math.max(...data) || 100;
  const min = Math.min(...data);
  const range = (max - min) || 1;
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * chartWidth;
    const y = height - ((val - min) / range) * (height * 0.8) - (height * 0.1);
    return { x, y };
  });

  // Generate SVG Path
  const pathData = points.reduce((acc, point, i) => {
    return i === 0 ? `M${point.x},${point.y}` : `${acc} L${point.x},${point.y}`;
  }, '');

  // Generate Area Path (to close the path for gradient)
  const areaPath = `${pathData} L${points[points.length - 1].x},${height} L${points[0].x},${height} Z`;

  const animatedProps = useAnimatedProps(() => {
    // This is for the line drawing effect
    // We can't easily get the total length here, so we cheat with DashArray
    const length = 1000; // Large arbitrary length
    return {
      strokeDashoffset: length * (1 - progress.value),
      strokeDasharray: length,
    };
  });

  return (
    <View style={styles.container}>
      <Svg height={height} width={chartWidth}>
        <Defs>
          <LinearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={Colors.light.architectBlue} stopOpacity="0.15" />
            <Stop offset="1" stopColor={Colors.light.architectBlue} stopOpacity="0" />
          </LinearGradient>
        </Defs>
        
        {/* Fill Area */}
        <AnimatedPath
          d={areaPath}
          fill="url(#gradient)"
          // Optional: we can animate the opacity or use clipPath here as well
        />

        {/* Line Path */}
        <AnimatedPath
          d={pathData}
          fill="none"
          stroke={Colors.light.architectBlue}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          animatedProps={animatedProps}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: 'center',
    overflow: 'hidden',
  },
});
