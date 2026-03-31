import React, { useState, useEffect } from 'react';
import { 
  StyleSheet,
  View,
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Platform,
  ActionSheetIOS,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, Shadows } from '../constants/theme';
import { authService, settingsService } from './services/api';
import { notificationService } from '../app/services/notificationService';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import * as SecureStore from 'expo-secure-store';
import { 
  User, 
  Lock, 
  Bell, 
  Moon, 
  Globe, 
  HelpCircle, 
  Shield, 
  LogOut, 
  ArrowLeft,
  Sparkles,
  Timer,
  BarChart,
  Target
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

// Modular Components
import { ProfileCard } from '../components/settings/ProfileCard';
import { SettingItem, SettingGroup } from '../components/settings/SettingItem';

export default function SettingsScreen() {
  const router = useRouter();
  const { isDark, theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [settings, setSettings] = useState<any>({
    darkMode: false,
    notifications: true,
    focusDuration: 25,
    aiFrequency: 'Medium',
    aiPersonalization: true,
    language: 'en'
  });

  // Modal State
  const [isNameModalVisible, setIsNameModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [passwords, setPasswords] = useState({
    old: '',
    new: '',
    confirm: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profile, savedSettings] = await Promise.all([
          authService.getMe(),
          settingsService.getSettings()
        ]);
        setUser(profile);
        setSettings(savedSettings);
      } catch (error) {
        console.error("Fetch settings error:", error);
      }
    };
    fetchData();
  }, []);

  const updateSetting = async (key: string, value: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await settingsService.saveSettings(newSettings);
    
    if (key === 'darkMode') {
        await toggleTheme();
    }

    if (key === 'notifications' && value === true) {
        await notificationService.registerForPushNotificationsAsync();
    }
  };

  const handleUpdateName = () => {
    setNewName(user?.full_name || '');
    setIsNameModalVisible(true);
  };

  const onUpdateNameSubmit = async () => {
    if (!newName.trim()) return;
    setIsUpdating(true);
    try {
      await authService.updateMe({ full_name: newName.trim() });
      const profile = await authService.getMe();
      setUser(profile);
      setIsNameModalVisible(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(t('common.success'), t('settings.modals.messages.success'));
    } catch (e) {
      Alert.alert(t('common.error'), t('settings.modals.messages.error'));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = () => {
    setPasswords({ old: '', new: '', confirm: '' });
    setIsPasswordModalVisible(true);
  };

  const onChangePasswordSubmit = async () => {
    if (!passwords.old || !passwords.new || !passwords.confirm) {
      Alert.alert(t('common.error'), t('auth.fieldsRequired'));
      return;
    }
    if (passwords.new !== passwords.confirm) {
      Alert.alert(t('common.error'), t('settings.modals.messages.passwordMismatch'));
      return;
    }

    setIsUpdating(true);
    try {
      await authService.changePassword(passwords.old, passwords.new);
      setIsPasswordModalVisible(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(t('common.success'), t('settings.modals.messages.success'));
    } catch (e: any) {
      const msg = e.response?.data?.detail || t('settings.modals.messages.error');
      Alert.alert(t('common.error'), msg);
    } finally {
      setIsUpdating(false);
    }
  };

  const showFocusPicker = () => {
    const options = ["15 Minutes", "25 Minutes", "45 Minutes", "60 Minutes", "Cancel"];
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { options, cancelButtonIndex: 4 },
        (buttonIndex) => {
          if (buttonIndex !== undefined && buttonIndex < 4) {
            const val = parseInt(options[buttonIndex]);
            updateSetting('focusDuration', val);
          }
        }
      );
    } else {
        Alert.alert("Focus Duration", "Choose length", [
            { text: "15m", onPress: () => updateSetting('focusDuration', 15) },
            { text: "25m", onPress: () => updateSetting('focusDuration', 25) },
            { text: "45m", onPress: () => updateSetting('focusDuration', 45) },
            { text: "60m", onPress: () => updateSetting('focusDuration', 60) },
            { text: "Cancel", style: "cancel" }
        ]);
    }
  };

  const handleLanguageChange = () => {
    const currentLang = i18n.language;
    const newLang = currentLang === 'en' ? 'id' : 'en';
    
    Alert.alert(
      t('settings.items.language'),
      t('common.update') + " " + t('settings.items.language') + "?",
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: t('common.update'), 
          onPress: async () => {
            await i18n.changeLanguage(newLang);
            updateSetting('language', newLang);
            await SecureStore.setItemAsync('user_language', newLang);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        }
      ]
    );
  };

  const showAiFrequencyPicker = () => {
    Alert.alert(t('settings.items.aiFrequency'), "How often should AI suggest tasks?", [
        { text: "Low", onPress: () => updateSetting('aiFrequency', "Low") },
        { text: "Medium", onPress: () => updateSetting('aiFrequency', "Medium") },
        { text: "High", onPress: () => updateSetting('aiFrequency', "High") },
        { text: t('common.cancel'), style: "cancel" }
    ]);
  };

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: async () => {
            await authService.logout();
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
           <TouchableOpacity 
             onPress={() => router.back()} 
             style={[styles.backButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
             activeOpacity={0.7}
           >
             <ArrowLeft size={24} color={theme.text} />
           </TouchableOpacity>
           <Text style={[styles.headerTitle, { color: theme.text }]}>{t('settings.title')}</Text>
           <View style={{ width: 44 }} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Section */}
          <ProfileCard 
            name={user?.full_name || 'Loading...'} 
            email={user?.email || 'loading...'} 
            profileImage={user?.profile_image_url}
            onUpdate={async () => {
              const profile = await authService.getMe();
              setUser(profile);
            }}
          />

          {/* General Group */}
          <SettingGroup title={t('settings.groups.general')}>
            <SettingItem 
                icon={Moon} 
                label={t('settings.items.darkMode')} 
                type="switch" 
                value={isDark} 
                onValueChange={() => updateSetting('darkMode', !isDark)} 
            />
            <SettingItem 
                icon={Bell} 
                label={t('settings.items.notifications')} 
                type="switch" 
                value={settings.notifications} 
                onValueChange={(v) => updateSetting('notifications', v)} 
            />
            <SettingItem 
                icon={Globe} 
                label={t('settings.items.language')} 
                value={t(`settings.languageOptions.${i18n.language}`)} 
                type="select" 
                onPress={handleLanguageChange} 
            />
          </SettingGroup>

          {/* Productivity Group */}
          <SettingGroup title={t('settings.groups.productivity')}>
             <SettingItem 
                icon={Timer} 
                label={t('settings.items.focusDuration')} 
                value={`${settings.focusDuration} Minutes`} 
                type="select" 
                onPress={showFocusPicker} 
             />
             <SettingItem 
                icon={BarChart} 
                label={t('settings.items.aiFrequency')} 
                value={settings.aiFrequency} 
                type="select" 
                onPress={showAiFrequencyPicker} 
             />
          </SettingGroup>

          {/* AI Assistant Group */}
          <SettingGroup title={t('settings.groups.aiAssistant')}>
             <SettingItem 
                icon={Sparkles} 
                label={t('settings.items.personalization')} 
                type="switch" 
                value={settings.aiPersonalization} 
                onValueChange={(v) => updateSetting('aiPersonalization', v)} 
             />
             <SettingItem icon={Shield} label={t('settings.items.privacy')} onPress={() => Alert.alert("Privacy", "Your data is encrypted locally.")} />
          </SettingGroup>

          {/* Account Group */}
          <SettingGroup title={t('settings.groups.account')}>
             <SettingItem icon={User} label={t('settings.items.updateName')} onPress={handleUpdateName} />
             <SettingItem icon={Lock} label={t('settings.items.changePassword')} onPress={handleChangePassword} />
             <SettingItem icon={LogOut} label={t('settings.items.logout')} type="danger" onPress={handleLogout} />
          </SettingGroup>

          <View style={styles.footer}>
             <Text style={[styles.versionText, { color: theme.textMuted }]}>Version 2.1.0 (Premium)</Text>
             <Text style={[styles.copyrightText, { color: theme.textMuted }]}>© 2026 AI Productivity Inc.</Text>
          </View>
          
          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>

      {/* Name Update Modal */}
      <Modal
        visible={isNameModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsNameModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setIsNameModalVisible(false)}
        >
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContentWrapper}
          >
            <View style={[styles.modalCard, { backgroundColor: theme.surface }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>{t('settings.modals.updateName.title')}</Text>
              <TextInput
                style={[styles.modalInput, { color: theme.text, borderColor: theme.border, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }]}
                value={newName}
                onChangeText={setNewName}
                placeholder={t('settings.modals.updateName.placeholder')}
                placeholderTextColor={theme.textMuted}
                autoFocus
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalBtn, { backgroundColor: theme.border }]} 
                  onPress={() => setIsNameModalVisible(false)}
                >
                  <Text style={[styles.modalBtnText, { color: theme.text }]}>{t('common.cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalBtn, { backgroundColor: theme.primary }]} 
                  onPress={onUpdateNameSubmit}
                  disabled={isUpdating}
                >
                  {isUpdating ? <ActivityIndicator color="#FFF" size="small" /> : <Text style={styles.modalBtnTextPrimary}>{t('common.update')}</Text>}
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </Modal>

      {/* Password Change Modal */}
      <Modal
        visible={isPasswordModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsPasswordModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setIsPasswordModalVisible(false)}
        >
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContentWrapper}
          >
            <View style={[styles.modalCard, { backgroundColor: theme.surface }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>{t('settings.modals.changePassword.title')}</Text>
              
              <TextInput
                style={[styles.modalInput, { color: theme.text, borderColor: theme.border, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }]}
                value={passwords.old}
                onChangeText={(v) => setPasswords(p => ({ ...p, old: v }))}
                placeholder={t('settings.modals.changePassword.oldPassword')}
                placeholderTextColor={theme.textMuted}
                secureTextEntry
              />
              <TextInput
                style={[styles.modalInput, { color: theme.text, borderColor: theme.border, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }]}
                value={passwords.new}
                onChangeText={(v) => setPasswords(p => ({ ...p, new: v }))}
                placeholder={t('settings.modals.changePassword.newPassword')}
                placeholderTextColor={theme.textMuted}
                secureTextEntry
              />
              <TextInput
                style={[styles.modalInput, { color: theme.text, borderColor: theme.border, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }]}
                value={passwords.confirm}
                onChangeText={(v) => setPasswords(p => ({ ...p, confirm: v }))}
                placeholder={t('settings.modals.changePassword.confirmPassword')}
                placeholderTextColor={theme.textMuted}
                secureTextEntry
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalBtn, { backgroundColor: theme.border }]} 
                  onPress={() => setIsPasswordModalVisible(false)}
                >
                  <Text style={[styles.modalBtnText, { color: theme.text }]}>{t('common.cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalBtn, { backgroundColor: theme.primary }]} 
                  onPress={onChangePasswordSubmit}
                  disabled={isUpdating}
                >
                  {isUpdating ? <ActivityIndicator color="#FFF" size="small" /> : <Text style={styles.modalBtnTextPrimary}>{t('common.confirm')}</Text>}
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.soft,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  headerTitle: {
    ...Typography.title,
    fontSize: 20,
    fontWeight: '800',
    color: Colors.light.text,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  footer: {
    alignItems: 'center',
    marginTop: Spacing.xl,
    paddingBottom: 40,
  },
  versionText: {
    ...Typography.caption,
    fontSize: 12,
    fontWeight: '600',
  },
  copyrightText: {
    ...Typography.caption,
    fontSize: 10,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContentWrapper: {
    width: '100%',
    maxWidth: 400,
  },
  modalCard: {
    padding: 24,
    borderRadius: 24,
    ...Shadows.medium,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  modalBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  modalBtnTextPrimary: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  }
});
