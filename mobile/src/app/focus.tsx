import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  Text,
  TouchableOpacity,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';
import * as Haptics from 'expo-haptics';
import { settingsService } from './services/api';
import { ChevronLeft } from 'lucide-react-native';
import { notificationService } from '../app/services/notificationService';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

// Modular Components
import { TimerDisplay } from '../components/focus/TimerDisplay';
import { FocusControls } from '../components/focus/FocusControls';
import { TaskContext } from '../components/focus/TaskContext';
import { FocusSummary } from '../components/focus/FocusSummary';

const FOCUS_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

function FocusScreen() {
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [isSummaryVisible, setIsSummaryVisible] = useState(false);

  // Load User Preferences
  useEffect(() => {
    const loadDuration = async () => {
      const settings = await settingsService.getSettings();
      if (settings?.focusDuration) {
        setTimeLeft(settings.focusDuration * 60);
      }
    };
    loadDuration();
  }, []);

  // Core Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Send Local Notification
      notificationService.sendInstantNotification(
        mode === 'work' ? t('focus.sessionComplete') : t('focus.breakOver'),
        mode === 'work' ? t('focus.sessionBody') : t('focus.breakBody'),
        { type: 'TIMER_END' }
      );

      setIsSummaryVisible(true);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsActive((prev) => !prev);
  }, []);

  const resetTimer = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsActive(false);
    setTimeLeft(mode === 'work' ? FOCUS_TIME : BREAK_TIME);
  }, [mode]);

  const endSession = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setIsActive(false);
    setIsSummaryVisible(true);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progress = mode === 'work' 
    ? (FOCUS_TIME - timeLeft) / FOCUS_TIME 
    : (BREAK_TIME - timeLeft) / BREAK_TIME;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Simplified & Clean Header */}
        <View style={styles.header}>
           <View style={[styles.headerDot, { backgroundColor: theme.primary }]} />
           <Text style={[styles.headerSubtitle, { color: theme.text }]}>
             {mode === 'work' ? t('focus.workMode') : t('focus.breakMode')}
           </Text>
           <View style={[styles.headerDot, { backgroundColor: theme.primary }]} />
        </View>

        <View style={styles.content}>
          <TaskContext taskName="Designing App Core" />
          
          <TimerDisplay 
            progress={progress} 
            timeLeft={formatTime(timeLeft)} 
            mode={mode}
            isActive={isActive}
          />

          <View style={styles.controlsWrapper}>
            <FocusControls 
              isActive={isActive} 
              onToggle={toggleTimer} 
              onReset={resetTimer}
              onEnd={endSession}
              mode={mode}
            />
          </View>
        </View>

        {isSummaryVisible && (
          <FocusSummary 
            timeFocused={formatTime(mode === 'work' ? (FOCUS_TIME - timeLeft) : 0)} 
            onClose={() => {
                setIsSummaryVisible(false);
                setMode(mode === 'work' ? 'break' : 'work');
                const nextTime = mode === 'work' ? BREAK_TIME : FOCUS_TIME;
                setTimeLeft(nextTime);
            }} 
          />
        )}
      </SafeAreaView>
    </View>
  );
}

export default FocusScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    gap: 12,
  },
  headerSubtitle: {
    ...Typography.caption,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  headerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    opacity: 0.3,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  controlsWrapper: {
    marginTop: Spacing.xl,
    width: '100%',
  }
});
