import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';
import { Target } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';

interface TaskContextProps {
  taskName: string;
}

export const TaskContext = ({ taskName }: TaskContextProps) => {
  const { theme, isDark } = useTheme();
  
  return (
    <View style={styles.container}>
      <View style={[styles.badge, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(26, 54, 115, 0.05)' }]}>
        <Target size={14} color={theme.primary} />
      </View>
      <Text style={[styles.taskLabel, { color: theme.textMuted }]}>CURRENT FOCUS</Text>
      <Text style={[styles.taskName, { color: theme.text }]}>{taskName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 40,
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 4,
  },
  taskName: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
});
