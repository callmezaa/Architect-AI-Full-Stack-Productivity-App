import React from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Link, usePathname, useRouter } from 'expo-router';
import { Colors, Spacing, Shadows, BorderRadius } from '../constants/theme';
import { LayoutDashboard, CheckSquare, MessageSquare, Timer, Plus } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');
const TAB_BAR_WIDTH = width * 0.92;
const TAB_BAR_HEIGHT = 64;

export default function AppTabs() {
  const pathname = usePathname();
  const router = useRouter();
  const { isDark, theme } = useTheme();

  const tabs = [
    { name: 'Home', href: '/', icon: LayoutDashboard },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'FAB', isFab: true },
    { name: 'Chat', href: '/explore', icon: MessageSquare },
    { name: 'Focus', href: '/focus', icon: Timer },
  ];

  const handleFabPress = () => {
    router.push({
      pathname: '/tasks',
      params: { openInput: 'true', t: Date.now() }
    });
  };

  const TabItem = ({ tab }: any) => {
    if (tab.isFab) {
      return <FabItem onPress={handleFabPress} />;
    }

    const isActive = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href));
    const Icon = tab.icon;
    
    return (
      <Link key={tab.name} href={tab.href as any} asChild>
        <TouchableOpacity style={styles.tabItem} activeOpacity={0.7}>
          <View style={[
            styles.iconContainer, 
            isActive && { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(26, 54, 115, 0.05)' }
          ]}>
            <Icon 
                size={24} 
                color={isActive ? theme.primary : theme.textMuted} 
                strokeWidth={isActive ? 2.5 : 2}
            />
          </View>
        </TouchableOpacity>
      </Link>
    );
  };

  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        {tabs.map((tab, index) => (
          <TabItem key={tab.name || index} tab={tab} />
        ))}
      </View>
    </View>
  );
}

const FabItem = ({ onPress }: { onPress: () => void }) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    onPress();
  };

  return (
    <Animated.View style={[styles.fabWrapper, { backgroundColor: theme.primary }, animatedStyle]}>
      <TouchableOpacity 
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={styles.fab}
      >
        <Plus size={28} color="#FFF" strokeWidth={3} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 42 : 32,
    width: width,
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    flexDirection: 'row',
    width: TAB_BAR_WIDTH,
    height: TAB_BAR_HEIGHT,
    borderRadius: 32,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    ...Shadows.soft,
  },
  tabItem: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabWrapper: {
    width: 54,
    height: 54,
    borderRadius: 27,
    ...Platform.select({
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
        },
        android: {
            elevation: 4,
        }
    })
  },
  fab: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
