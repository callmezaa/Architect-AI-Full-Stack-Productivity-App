import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, Spacing, Shadows, BorderRadius, Typography } from '../../constants/theme';
import { Music, Wind, Coffee, CloudRain, Trees } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';

const AMBIENCE_OPTIONS = [
  { id: 'none', label: 'None', icon: Music },
  { id: 'rain', label: 'Rain', icon: CloudRain },
  { id: 'wind', label: 'Wind', icon: Wind },
  { id: 'cafe', label: 'Cafe', icon: Coffee },
  { id: 'forest', label: 'Forest', icon: Trees },
];

export const AmbienceSelector = () => {
    const { theme, isDark } = useTheme();
    const [selected, setSelected] = useState('none');

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: theme.textMuted }]}>AMBIENCE SOUND</Text>
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {AMBIENCE_OPTIONS.map((item) => {
                    const isSelected = selected === item.id;
                    const Icon = item.icon;

                    return (
                        <TouchableOpacity
                            key={item.id}
                            style={[
                                styles.option,
                                { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' },
                                isSelected && { backgroundColor: theme.primary }
                            ]}
                            onPress={() => setSelected(item.id)}
                            activeOpacity={0.8}
                        >
                            <Icon size={18} color={isSelected ? '#FFF' : theme.text} />
                            <Text style={[
                                styles.label, 
                                { color: theme.text },
                                isSelected && { color: '#FFF', fontWeight: '700' }
                            ]}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: Spacing.xl,
    },
    title: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 2,
        paddingHorizontal: 40,
        marginBottom: 12,
    },
    scrollContent: {
        paddingHorizontal: 30,
        gap: 12,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        gap: 8,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
    }
});
