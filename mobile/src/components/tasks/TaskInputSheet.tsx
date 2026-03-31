import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Dimensions, 
  KeyboardAvoidingView, 
  Platform,
  Keyboard
} from 'react-native';
import { Colors, Spacing, Shadows, BorderRadius, Typography } from '../../constants/theme';
import Animated, { 
  FadeIn, 
  SlideInDown, 
  FadeOut, 
  SlideOutDown 
} from 'react-native-reanimated';
import { X, Send, Flag, Clock, Calendar } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { notificationService } from '../../app/services/notificationService';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface TaskInputSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (title: string, priority: 'high' | 'medium' | 'low') => void;
}

export const TaskInputSheet = ({ isVisible, onClose, onSubmit }: TaskInputSheetProps) => {
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    } else {
      setTitle('');
      setPriority('medium');
    }
  }, [isVisible]);

  const handleSubmit = () => {
    if (title.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Send Local Notification
      notificationService.sendInstantNotification(
        t('home.newItem'),
        `"${title.trim()}" ${t('tasks.completedOf').split(' ')[0]}...`, // Simple approximation
        { type: 'TASK_CREATED' }
      );

      onSubmit(title.trim(), priority);
      onClose();
      Keyboard.dismiss();
    }
  };

  if (!isVisible) return null;

  return (
    <Animated.View 
      entering={FadeIn} 
      exiting={FadeOut} 
      style={[StyleSheet.absoluteFill, styles.overlay, { backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(26, 54, 115, 0.3)' }]}
    >
      <TouchableOpacity 
        style={StyleSheet.absoluteFill} 
        activeOpacity={1} 
        onPress={() => {
          Keyboard.dismiss();
          onClose();
        }} 
      />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <Animated.View 
          entering={SlideInDown.springify().damping(15)} 
          exiting={SlideOutDown}
          style={[styles.sheet, { backgroundColor: theme.surface }]}
        >
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>{t('tasks.new')}</Text>
            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
              <X size={20} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          <TextInput
            ref={inputRef}
            style={[styles.input, { color: theme.text }]}
            placeholder={t('tasks.titlePlaceholder')}
            placeholderTextColor={theme.textMuted}
            value={title}
            onChangeText={setTitle}
            multiline
            maxLength={100}
          />

          <View style={[styles.optionsRow, { borderTopColor: theme.border }]}>
            <View style={styles.priorityGroup}>
              {(['low', 'medium', 'high'] as const).map((p) => (
                <TouchableOpacity
                  key={p}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setPriority(p);
                  }}
                  style={[
                    styles.priorityBtn,
                    { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' },
                    priority === p && { backgroundColor: p === 'high' ? '#EF4444' : p === 'medium' ? theme.primary : '#10B981' }
                  ]}
                >
                  <Text style={[
                      styles.priorityText, 
                      { color: theme.textMuted },
                      priority === p && { color: '#FFF', fontWeight: '700' }
                  ]}>
                    {t(`tasks.priority.${p}`)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity 
              style={[
                  styles.submitBtn, 
                  { backgroundColor: theme.primary },
                  !title.trim() && { opacity: 0.5 }
              ]} 
              onPress={handleSubmit}
              disabled={!title.trim()}
            >
              <Send size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    justifyContent: 'flex-end',
    zIndex: 2000,
  },
  keyboardView: {
    width: '100%',
  },
  sheet: {
    width: '100%',
    padding: 24,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    ...Shadows.medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    fontSize: 20,
    fontWeight: '600',
    minHeight: 80,
    maxHeight: 150,
    textAlignVertical: 'top',
    paddingTop: 0,
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
  },
  priorityGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  submitBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.soft,
  }
});
