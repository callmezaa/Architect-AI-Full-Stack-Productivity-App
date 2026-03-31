import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  RefreshControl,
  ActivityIndicator,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, Shadows, BorderRadius } from '../constants/theme';
import { taskService, aiService, isAuthenticated } from './services/api';
import Animated, { 
  FadeInDown, 
  LinearTransition, 
  useSharedValue,
  useAnimatedStyle,
  withSpring
} from 'react-native-reanimated';
import { Sparkles } from 'lucide-react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

// Modular Components
import { TaskHeader } from '../components/tasks/TaskHeader';
import { TaskFilter } from '../components/tasks/TaskFilter';
import { TaskItem } from '../components/tasks/TaskItem';
import { TaskInputSheet } from '../components/tasks/TaskInputSheet';
import { TaskEmptyState } from '../components/tasks/TaskEmptyState';

export default function TasksScreen() {
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('today');
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [aiInsight, setAiInsight] = useState<string>('');
  const { openInput, t: activeTabParam } = useLocalSearchParams();

  // Listen for navigation params to open quick add
  useEffect(() => {
    if (openInput === 'true') {
      setIsInputVisible(true);
    }
  }, [openInput, activeTabParam]);

  const fetchData = async (showLoading = true) => {
    if (!await isAuthenticated()) return;
    if (showLoading) setLoading(true);
    try {
      const [allTasks, aiData] = await Promise.all([
        taskService.getTasks(),
        aiService.getSuggestions()
      ]);
      setTasks(allTasks || []);
      setAiInsight(aiData.suggestions?.[0] || 'Focus on your high-priority items first today.');
    } catch (error) {
      console.error("Data fetch error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData(false);
  }, []);

  const handleToggle = async (id: number, currentStatus: boolean) => {
    try {
      const updated = await taskService.updateTask(id, { is_completed: !currentStatus });
      setTasks(prev => prev.map(t => t.id === id ? updated : t));
    } catch (error) {
      console.error("Toggle error:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await taskService.deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleCreate = async (title: string, priority: 'high' | 'medium' | 'low') => {
    try {
      const created = await taskService.createTask(title, priority);
      setTasks([created, ...tasks]);
    } catch (error) {
      console.error("Create error:", error);
    }
  };

  const filteredTasks = useMemo(() => {
    if (activeTab === 'completed') {
      return tasks.filter(t => t.is_completed);
    }
    if (activeTab === 'upcoming') {
        return tasks.filter(t => !t.is_completed && t.priority === 'high');
    }
    return tasks.filter(t => !t.is_completed);
  }, [tasks, activeTab]);

  const completedCount = tasks.filter(t => t.is_completed).length;

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="small" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <TaskHeader 
          title={t('tasks.todayFocus')} 
          count={tasks.length} 
          completed={completedCount} 
        />
        
        <TaskFilter activeTab={activeTab} onTabChange={setActiveTab} />

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
          }
        >
          {/* AI Task Insight */}
          {activeTab === 'today' && aiInsight && filteredTasks.length > 0 && (
            <View style={styles.insightSection}>
               <View style={[styles.aiInsightBox, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : '#E8F0FE' }]}>
                 <Sparkles size={18} color={theme.primary} style={{ marginRight: 8 }} />
                 <Text style={[styles.aiInsightText, { color: theme.primary }]}>{aiInsight}</Text>
               </View>
            </View>
          )}

          <View style={styles.listContainer}>
            {filteredTasks.length === 0 ? (
              <TaskEmptyState message={activeTab === 'completed' ? t('tasks.emptyState') : undefined} />
            ) : (
                filteredTasks.map((task, idx) => (
                  <TaskItem 
                    key={task.id || idx} 
                    task={{
                        ...task,
                        due_time: task.priority === 'high' ? 'Due soon' : undefined
                    }} 
                    onToggle={() => handleToggle(task.id, task.is_completed)}
                    onDelete={() => handleDelete(task.id)}
                  />
                ))
            )}
          </View>
          
          <View style={{ height: 100 }} />
        </ScrollView>

        <TaskInputSheet 
          isVisible={isInputVisible} 
          onClose={() => setIsInputVisible(false)} 
          onSubmit={handleCreate}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  insightSection: {
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  aiInsightBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  aiInsightText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
  }
});
