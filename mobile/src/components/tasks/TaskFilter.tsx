import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, Spacing, Shadows, BorderRadius, Typography } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

interface TaskFilterProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TaskFilter = ({ activeTab, onTabChange }: TaskFilterProps) => {
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();
  
  const TABS = [
    { id: 'today', label: t('tasks.filters.today') },
    { id: 'upcoming', label: t('tasks.filters.upcoming') },
    { id: 'completed', label: t('tasks.filters.completed') },
  ];

  return (
    <View style={[styles.container, { borderBottomColor: theme.border }]}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tab}
              onPress={() => onTabChange(tab.id)}
              activeOpacity={0.7}
            >
              <Text 
                style={[
                  styles.tabText, 
                  { color: theme.textMuted },
                  isActive && { color: theme.primary, fontWeight: '800' }
                ]}
              >
                {tab.label}
              </Text>
              {isActive && (
                <View style={[styles.indicator, { backgroundColor: theme.primary }]} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.xl,
    borderBottomWidth: 1,
  },
  scrollContent: {
    paddingRight: 40,
    gap: 32,
  },
  tab: {
    paddingVertical: 12,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  indicator: {
    position: 'absolute',
    bottom: -1,
    width: '100%',
    height: 3,
    borderRadius: 2,
  }
});
