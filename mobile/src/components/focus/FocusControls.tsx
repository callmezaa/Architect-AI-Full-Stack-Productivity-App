import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Colors, Spacing, Typography, Shadows, BorderRadius } from '../../constants/theme';
import { Play, Pause, RotateCcw, X } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';

interface FocusControlsProps {
  isActive: boolean;
  onToggle: () => void;
  onReset: () => void;
  onEnd: () => void;
  mode: 'work' | 'break';
}

export const FocusControls = ({ isActive, onToggle, onReset, onEnd, mode }: FocusControlsProps) => {
  const { theme, isDark } = useTheme();
  const accentColor = mode === 'work' ? theme.primary : '#10B981';

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.secondaryBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }]} 
        onPress={onReset}
        activeOpacity={0.7}
      >
        <RotateCcw size={24} color={theme.text} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.mainBtn, { backgroundColor: accentColor, shadowColor: accentColor }]} 
        onPress={onToggle}
        activeOpacity={0.9}
      >
        {isActive ? (
          <Pause size={32} color="#FFF" fill="#FFF" />
        ) : (
          <Play size={32} color="#FFF" fill="#FFF" style={{ marginLeft: 4 }} />
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.secondaryBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }]} 
        onPress={onEnd}
        activeOpacity={0.7}
      >
        <X size={24} color={theme.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
    width: '100%',
  },
  mainBtn: {
    width: 84,
    height: 84,
    borderRadius: 42,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.medium,
  },
  secondaryBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
