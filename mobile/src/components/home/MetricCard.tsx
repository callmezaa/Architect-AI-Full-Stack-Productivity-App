import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Colors, Spacing, Typography, Shadows, BorderRadius } from '../../constants/theme';
import Svg, { Circle } from 'react-native-svg';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ProgressChart } from './ProgressChart';
import { TrendingUp } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

interface MetricCardProps {
  savedHours?: string;
  successRate?: number;
}

export const MetricCard = ({ savedHours = "12.4h", successRate = 85 }: MetricCardProps) => {
  const { isDark, theme } = useTheme();
  const { t } = useTranslation();
  const size = 64;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (successRate / 100) * circumference;

  return (
    <Animated.View 
      entering={FadeInDown.delay(200).duration(800)} 
      style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
    >
      <View style={styles.topSection}>
        <View style={styles.leftCol}>
          <Text style={[styles.label, { color: theme.textMuted }]}>{t('home.successRate').toUpperCase()}</Text>
          <View style={styles.scoreRow}>
            <View style={styles.chartWrapper}>
              <Svg width={size} height={size}>
                <Circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}
                  strokeWidth={strokeWidth}
                  fill="none"
                />
                <Circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={theme.primary}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  fill="none"
                  transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
              </Svg>
              <View style={styles.scoreOverlay}>
                <Text style={[styles.scoreText, { color: theme.text }]}>{successRate}%</Text>
              </View>
            </View>
            <View>
              <Text style={[styles.valueLarge, { color: theme.text }]}>{savedHours}</Text>
              <Text style={[styles.subtext, { color: theme.textMuted }]}>{t('home.savedHours')}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <View style={styles.bottomSection}>
        <View style={styles.chartHeader}>
          <View style={[styles.iconBadge, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(26, 54, 115, 0.05)' }]}>
            <TrendingUp size={12} color={theme.primary} />
          </View>
          <Text style={[styles.chartTitle, { color: theme.text }]}>{t('home.productivityScore')}</Text>
        </View>
        
        <ProgressChart 
          data={[30, 45, 35, 70, 50, 85, 75]} 
          height={70} 
        />
        
        <View style={styles.daysRow}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
            <Text key={i} style={[styles.dayText, { color: theme.textMuted }]}>{day}</Text>
          ))}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.sm,
    borderRadius: 32,
    padding: Spacing.xl,
    ...Shadows.medium,
    borderWidth: 1,
  },
  topSection: {
    marginBottom: 12,
  },
  leftCol: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 16,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartWrapper: {
    position: 'relative',
    marginRight: 20,
  },
  scoreOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '800',
  },
  valueLarge: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1,
  },
  subtext: {
    fontSize: 12,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  bottomSection: {
    marginTop: 4,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  iconBadge: {
    width: 24,
    height: 24,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  chartTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: 4,
  },
  dayText: {
    fontSize: 9,
    fontWeight: '800',
    width: 20,
    textAlign: 'center',
  }
});
