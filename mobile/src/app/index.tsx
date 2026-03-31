import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  RefreshControl,
  ActivityIndicator,
  Platform,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../constants/theme';
import { aiService, authService, taskService, isAuthenticated } from './services/api';
import { 
  Calendar, 
  FileText, 
  Mail, 
  Dumbbell, 
  CheckCircle2,
  Circle,
  Sparkles
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Animated, { 
  FadeInDown, 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  useSharedValue,
  Layout
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import { notificationService } from '../app/services/notificationService';
import { useTranslation } from 'react-i18next';

// Modular Components
import { HomeHeader } from '../components/home/HomeHeader';
import { HeroSection } from '../components/home/HeroSection';
import { MetricCard } from '../components/home/MetricCard';
import { InsightCard } from '../components/home/InsightCard';
import { TaskInputSheet } from '../components/tasks/TaskInputSheet';

const AnimatedTaskItem = ({ task, onToggle }: { task: any, onToggle: (t: any) => void }) => {
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

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle(task);
  };

  return (
    <Animated.View layout={Layout.springify()}>
      <TouchableOpacity 
        style={[styles.taskItem, { borderBottomColor: theme.border }]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.taskCheckIcon}>
          {isCompleted ? (
            <CheckCircle2 size={26} color={theme.primary} strokeWidth={1.5} />
          ) : (
            <Circle size={26} color={theme.border} strokeWidth={1.5} />
          )}
        </View>
        <View style={styles.taskTextContainer}>
          <View style={styles.titleWrapper}>
            <Text style={[styles.taskTitle, { color: theme.text }, isCompleted && { color: theme.textMuted }]}>
              {task.title}
            </Text>
            <Animated.View style={[styles.strikeLine, { backgroundColor: theme.textMuted }, strikeStyle]} />
          </View>
          <Text style={[styles.taskSubtitle, { color: theme.textMuted }]}>{task.priority?.toUpperCase() || 'MEDIUM'} PRIORITY</Text>
        </View>
        {task.due_date && (
          <View style={[styles.timeBadge, { backgroundColor: isDark ? theme.surfaceSubtle : '#F3F4F6' }]}>
            <Text style={[styles.timeBadgeText, { color: theme.text }]}>
              {new Date(task.due_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isTaskSheetVisible, setIsTaskSheetVisible] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const fetchData = async (isRefreshing = false) => {
    if (!await isAuthenticated()) return;
    if (!isRefreshing) setLoading(true);
    try {
      const [profile, allTasks, aiSuggestions] = await Promise.all([
        authService.getMe(),
        taskService.getTasks(),
        aiService.getSuggestions().catch(() => []) 
      ]);
      setUser(profile);
      setTasks(allTasks || []);
      setSuggestions(aiSuggestions || []);
      
      const count = await notificationService.getMockNotificationCount();
      setNotificationCount(count);
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
    fetchData(true);
  }, []);

  const handleToggleTask = async (task: any) => {
    try {
      const updatedTasks = tasks.map(t => 
        t.id === task.id ? { ...t, is_completed: !t.is_completed } : t
      );
      setTasks(updatedTasks);
      await taskService.updateTask(task.id, { is_completed: !task.is_completed });
    } catch (error) {
      console.error("Failed to toggle task:", error);
      fetchData(true); 
    }
  };

  const handleCreateTask = async (title: string, priority: any) => {
     try {
        await taskService.createTask(title, priority);
        fetchData(true);
     } catch (error) {
        console.error("Failed to create task:", error);
     }
  };

  const activeTasks = tasks.filter(t => !t.is_completed).slice(0, 4);
  const completedCount = tasks.filter(t => t.is_completed).length;
  const totalCount = tasks.length || 0;
  const productivityScore = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const getIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'calendar': return Calendar;
      case 'document': return FileText;
      case 'mail': case 'inbox': return Mail;
      case 'focus': return Dumbbell;
      case 'break': return Sparkles;
      default: return Dumbbell;
    }
  };

  const handleSuggestionPress = (item: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    switch (item.action) {
      case 'FOCUS':
        router.push('/focus');
        break;
      case 'CREATE_TASK':
        setIsTaskSheetVisible(true);
        break;
      case 'AI_CHAT':
        router.push('/explore');
        break;
      case 'GO_TO_TASKS':
        router.push('/tasks');
        break;
      default:
        console.log("No action defined for:", item.action);
    }
  };

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
        <HomeHeader user={user} notificationCount={notificationCount} />
        
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
          }
        >
          {/* Greeting & New Task */}
          <HeroSection 
            productivityScore={productivityScore} 
            userName={user?.full_name?.split(' ')[0] || "User"}
            onNewTask={() => setIsTaskSheetVisible(true)}
          />

          {/* Large Dashboard Stats Card */}
          <MetricCard 
            savedHours={(completedCount * 1.5).toFixed(1) + "h"} 
            successRate={productivityScore} 
          />

          {/* Smart Suggestions Grid */}
          <View style={styles.sectionHeaderLine}>
             <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('home.smartSuggestions')}</Text>
             <View style={[styles.aiBadge, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(26, 54, 115, 0.05)' }]}>
                <Sparkles size={10} color={theme.primary} style={{ marginRight: 4 }} />
                <Text style={[styles.aiBadgeText, { color: theme.primary }]}>AI</Text>
             </View>
          </View>
          
          <View style={styles.gridContainer}>
             {suggestions.length > 0 ? (suggestions.map((item, index) => (
                 <InsightCard 
                   key={item.id || index}
                   title={item.title} 
                   subtitle={item.subtitle} 
                   icon={getIcon(item.type)} 
                   delay={(index + 1) * 100}
                   onPress={() => handleSuggestionPress(item)}
                 />
               ))
             ) : (
                <>
                  <InsightCard title="Team Sync" subtitle="Today at 2:00 PM" icon={Calendar} delay={100} onPress={() => router.push('/tasks')} />
                  <InsightCard title="Project Draft" subtitle="Ready for review" icon={FileText} delay={200} onPress={() => setIsTaskSheetVisible(true)} />
                  <InsightCard title="Inbox Zero" subtitle="12 items to archive" icon={Mail} delay={300} onPress={() => router.push('/explore')} />
                  <InsightCard title="Focus Mode" subtitle="Next 60m session" icon={Dumbbell} delay={400} onPress={() => router.push('/focus')} />
                </>
             )}
          </View>

          {/* Active Tasks List */}
          <View style={styles.sectionHeaderLine}>
             <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('home.activeTasks')}</Text>
             <TouchableOpacity onPress={() => router.push('/tasks')}>
               <Text style={[styles.viewAllText, { color: theme.primary }]}>{t('home.viewAll')}</Text>
             </TouchableOpacity>
          </View>

          <View style={styles.taskListContainer}>
            {activeTasks.length > 0 ? activeTasks.map((t, index) => (
              <AnimatedTaskItem 
                key={t.id || index} 
                task={t} 
                onToggle={handleToggleTask} 
              />
            )) : (
              <View style={styles.emptyTasksContainer}>
                <Text style={[styles.emptyTasksText, { color: theme.textMuted }]}>{t('home.noActiveTasks')}</Text>
              </View>
            )}
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>

        <TaskInputSheet 
          isVisible={isTaskSheetVisible}
          onClose={() => setIsTaskSheetVisible(false)}
          onSubmit={handleCreateTask}
        />

        {/* Floating AI Button */}
        <TouchableOpacity 
            style={[styles.fab, { backgroundColor: theme.primary, shadowColor: theme.primary }]} 
            activeOpacity={0.9} 
            onPress={() => router.push('/explore')}
        >
           <Sparkles size={20} color="#FFF" style={{ marginRight: 6 }} />
           <Text style={styles.fabText}>{t('home.askAi')}</Text>
        </TouchableOpacity>
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
    paddingBottom: Spacing.xl,
  },
  sectionHeaderLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  aiBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  viewAllText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
  },
  taskListContainer: {
    paddingHorizontal: Spacing.xl,
    marginTop: 8,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  taskCheckIcon: {
    marginRight: Spacing.md,
  },
  taskTextContainer: {
    flex: 1,
  },
  titleWrapper: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  strikeLine: {
    position: 'absolute',
    height: 1.5,
    top: '50%',
    left: 0,
  },
  taskSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  timeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginLeft: Spacing.sm,
  },
  timeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  emptyTasksContainer: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 20,
  },
  emptyTasksText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: BorderRadius.xl,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  fabText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  }
});
