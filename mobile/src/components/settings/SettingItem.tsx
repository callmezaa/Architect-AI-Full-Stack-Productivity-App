import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Switch, Platform } from 'react-native';
import { Colors, Spacing, Typography, Shadows, BorderRadius } from '../../constants/theme';
import { ChevronRight } from 'lucide-react-native';

interface SettingItemProps {
  icon: any;
  label: string;
  value?: string | boolean;
  type?: 'link' | 'switch' | 'select' | 'danger';
  onPress?: () => void;
  onValueChange?: (val: boolean) => void;
}

import { useTheme } from '../../context/ThemeContext';

export const SettingItem = ({ 
  icon: Icon, 
  label, 
  value, 
  type = 'link', 
  onPress, 
  onValueChange 
}: SettingItemProps) => {
  const { isDark, theme } = useTheme();
  const isDanger = type === 'danger';

  return (
    <TouchableOpacity 
      style={[styles.item, { borderBottomColor: theme.border }]} 
      onPress={onPress}
      activeOpacity={type === 'switch' ? 1 : 0.7}
      disabled={type === 'switch'}
    >
      <View style={[styles.iconBox, isDanger && styles.dangerIconBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9' }]}>
        <Icon size={20} color={isDanger ? '#EF4444' : theme.primary} />
      </View>
      <Text style={[styles.label, isDanger && styles.dangerLabel, { color: theme.text }]}>{label}</Text>
      
      {type === 'link' && (
        <ChevronRight size={18} color={theme.textMuted} />
      )}
      
      {type === 'switch' && (
        <Switch 
          value={value as boolean} 
          onValueChange={onValueChange}
          trackColor={{ false: theme.border, true: theme.primary }}
          thumbColor="#FFFFFF"
          ios_backgroundColor={isDark ? theme.surfaceSubtle : theme.border}
        />
      )}

      {type === 'select' && (
        <View style={styles.valueRow}>
          <Text style={[styles.valueText, { color: theme.textMuted }]}>{value as string}</Text>
          <ChevronRight size={18} color={theme.textMuted} />
        </View>
      )}
    </TouchableOpacity>
  );
};

export const SettingGroup = ({ title, children }: { title: string, children: React.ReactNode }) => {
  const { theme } = useTheme();
  return (
    <View style={styles.groupContainer}>
       <Text style={[styles.groupTitle, { color: theme.textMuted }]}>{title}</Text>
       <View style={[styles.groupCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
         {children}
       </View>
    </View>
  );
};

const styles = StyleSheet.create({
  groupContainer: {
    marginBottom: Spacing.xl,
  },
  groupTitle: {
    ...Typography.caption,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginLeft: 14,
  },
  groupCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.light.border,
    overflow: 'hidden',
    ...Shadows.soft,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dangerIconBox: {
    backgroundColor: '#FEF2F2',
  },
  label: {
    ...Typography.body,
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  dangerLabel: {
    color: '#EF4444',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  valueText: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.light.textMuted,
    fontWeight: '500',
  }
});
