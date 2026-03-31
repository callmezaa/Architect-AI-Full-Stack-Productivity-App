import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Colors, Spacing, Typography, Shadows, BorderRadius } from '../../constants/theme';
import { Bell, User, Settings } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

interface HomeHeaderProps {
  user?: {
    full_name?: string;
    profile_image_url?: string;
  };
  notificationCount?: number;
}

export const HomeHeader = ({ user, notificationCount = 0 }: HomeHeaderProps) => {
  const router = useRouter();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const greeting = t('home.greetingUser', { name: '' }).split(',')[0] + ',';

  return (
    <View style={[styles.container, { borderBottomColor: theme.border }]}>
      <View style={styles.left}>
        <Text style={[styles.greeting, { color: theme.textMuted }]}>{greeting}</Text>
        <Text style={[styles.name, { color: theme.text }]}>{user?.full_name || 'Architect'}</Text>
      </View>
      
      <View style={styles.right}>
        <TouchableOpacity 
            style={[styles.notificationBtn, { backgroundColor: theme.surface, borderColor: theme.border }]} 
            activeOpacity={0.7}
        >
          <Bell size={20} color={theme.text} strokeWidth={2} />
          {notificationCount > 0 && (
            <View style={[styles.badge, { backgroundColor: theme.primary, borderColor: theme.surface }]}>
              <Text style={styles.badgeText}>{notificationCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => router.push('/settings')}
          style={[styles.avatarBtn, { borderColor: theme.border }]}
          activeOpacity={0.8}
        >
          {user?.profile_image_url ? (
            <Image source={{ uri: user.profile_image_url }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: theme.primary }]}>
              <User size={20} color="#FFF" />
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  left: {
    flex: 1,
  },
  greeting: {
    ...Typography.caption,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  name: {
    ...Typography.h1,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    ...Shadows.soft,
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: '800',
  },
  avatarBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    padding: 2,
    ...Shadows.soft,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
