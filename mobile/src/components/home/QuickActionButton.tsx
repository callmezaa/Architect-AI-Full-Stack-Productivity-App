import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Typography, Shadows, BorderRadius } from '../../constants/theme';
import { LucideIcon } from 'lucide-react-native';

interface QuickActionButtonProps {
  label: string;
  icon: LucideIcon;
  onPress: () => void;
  color?: string;
}

export const QuickActionButton = ({ label, icon: Icon, onPress, color = Colors.light.primary }: QuickActionButtonProps) => {
  return (
    <TouchableOpacity 
        style={styles.container} 
        onPress={onPress}
        activeOpacity={0.7}
    >
      <View style={[styles.iconBox, { backgroundColor: `${color}10` }]}>
        <Icon size={22} color={color} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    backgroundColor: 'transparent',
    marginHorizontal: Spacing.xs,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    ...Shadows.soft,
  },
  label: {
    ...Typography.caption,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.text,
    textAlign: 'center',
  }
});
