import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Typography, Shadows, BorderRadius } from '../../constants/theme';
import { Plus, Target } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

interface HeroSectionProps {
  productivityScore: number;
  userName: string;
  onNewTask?: () => void;
}

export const HeroSection = ({ productivityScore, userName, onNewTask }: HeroSectionProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <Animated.View 
        entering={FadeInUp.duration(800)} 
        style={[styles.container, { backgroundColor: theme.primary }]}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>{t('home.greetingUser', { name: '' })}</Text>
        <Text style={styles.userName}>{userName.toUpperCase()}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.infoCol}>
          <Text style={styles.title}>{t('tasks.todayFocus')}</Text>
          <View style={styles.row}>
            <View style={[styles.scoreBadge, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
              <Target size={14} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={styles.scoreText}>{productivityScore}% {t('home.productivityScore').split(' ')[0].toUpperCase()}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.plusBtn, { backgroundColor: theme.surface }]} 
          activeOpacity={0.9}
          onPress={onNewTask}
        >
          <Plus size={24} color={theme.primary} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.md,
    borderRadius: 32,
    padding: Spacing.xl,
    ...Shadows.medium,
  },
  header: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 2,
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: -0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoCol: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
  },
  scoreText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  plusBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.soft,
  }
});
