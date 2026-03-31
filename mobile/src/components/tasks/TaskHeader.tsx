import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Colors, Spacing, Typography, Shadows, BorderRadius } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

interface TaskHeaderProps {
  title: string;
  count: number;
  completed: number;
}

export const TaskHeader = ({ title, count, completed }: TaskHeaderProps) => {
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();
  
  return (
    <View style={styles.container}>
      <View style={styles.leftCol}>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          {t('tasks.completedOf', { completed, total: count })}
        </Text>
      </View>
      
      <View style={[styles.progressBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
        <Text style={[styles.progressNum, { color: theme.primary }]}>
          {count > 0 ? Math.round((completed / count) * 100) : 0}%
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftCol: {
    flex: 1,
  },
  title: {
    ...Typography.h1,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
    fontWeight: '600',
  },
  progressBox: {
    width: 60,
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  progressNum: {
    fontSize: 16,
    fontWeight: '800',
  }
});
