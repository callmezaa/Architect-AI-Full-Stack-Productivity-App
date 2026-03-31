import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { Colors, Spacing, Typography, Shadows, BorderRadius } from '../../constants/theme';
import { CheckCircle2, Circle, Trash2, Calendar, Clock } from 'lucide-react-native';
import Animated, { 
  FadeInRight, 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  Layout
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';

interface TaskItemProps {
  task: any;
  onToggle: () => void;
  onDelete: () => void;
}

export const TaskItem = ({ task, onToggle, onDelete }: TaskItemProps) => {
  const { theme, isDark } = useTheme();
  const isCompleted = task.is_completed;
  const strikeWidth = useSharedValue(isCompleted ? 1 : 0);

  useEffect(() => {
    strikeWidth.value = withSpring(isCompleted ? 1 : 0, { damping: 15 });
  }, [isCompleted]);

  const strikeStyle = useAnimatedStyle(() => ({
    width: `${strikeWidth.value * 100}%`,
    opacity: strikeWidth.value,
  }));

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle();
  };

  const priorityColor = task.priority === 'high' ? '#EF4444' : task.priority === 'medium' ? theme.primary : '#10B981';

  return (
    <Animated.View 
      entering={FadeInRight.duration(400)} 
      layout={Layout.springify()}
      style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}
    >
      <TouchableOpacity 
        style={styles.checkArea} 
        onPress={handleToggle}
        activeOpacity={0.7}
      >
        {isCompleted ? (
          <CheckCircle2 size={24} color={theme.primary} strokeWidth={2} />
        ) : (
          <Circle size={24} color={theme.border} strokeWidth={2} />
        )}
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.titleWrapper}>
          <Text style={[styles.title, { color: theme.text }, isCompleted && { color: theme.textMuted }]}>
            {task.title}
          </Text>
          <Animated.View style={[styles.strikeLine, { backgroundColor: theme.textMuted }, strikeStyle]} />
        </View>

        <View style={styles.meta}>
          <View style={[styles.priorityBadge, { backgroundColor: isDark ? priorityColor + '20' : priorityColor + '10' }]}>
            <Text style={[styles.priorityText, { color: priorityColor }]}>
              {task.priority?.toUpperCase()}
            </Text>
          </View>
          
          {task.due_time && (
            <View style={styles.timeRow}>
              <Clock size={12} color={theme.textMuted} />
              <Text style={[styles.timeText, { color: theme.textMuted }]}>{task.due_time}</Text>
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity 
        style={styles.deleteBtn} 
        onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onDelete();
        }}
      >
        <Trash2 size={18} color={isDark ? theme.textMuted : '#EF4444'} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    ...Shadows.soft,
  },
  checkArea: {
    paddingRight: 16,
  },
  content: {
    flex: 1,
  },
  titleWrapper: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  strikeLine: {
    position: 'absolute',
    height: 1.5,
    top: '50%',
    left: 0,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 12,
  },
  priorityText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  deleteBtn: {
    padding: 8,
    marginLeft: 8,
  }
});
