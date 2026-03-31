import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { authService } from '../services/api';
import { User, Mail, Lock, ArrowLeft } from 'lucide-react-native';
import * as SecureStore from 'expo-secure-store';
import { useTranslation } from 'react-i18next';

// Modular Components
import { AuthHeader } from '../../components/auth/AuthHeader';
import { InputField } from '../../components/auth/InputField';
import { PrimaryButton } from '../../components/auth/PrimaryButton';

export default function RegisterScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      setError(t('auth.fieldsRequired'));
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await authService.register(email, password, fullName);
      await SecureStore.setItemAsync('user_token', response.access_token);
      router.replace('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#111" />
        </TouchableOpacity>

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <AuthHeader 
              title={t('auth.createAccount')} 
              subtitle={t('auth.registerSubtitle')}
            />

            <View style={styles.form}>
              <InputField
                icon={User}
                placeholder={t('auth.fullName')}
                value={fullName}
                onChangeText={setFullName}
              />

              <InputField
                icon={Mail}
                placeholder={t('auth.emailLabel')}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <InputField
                icon={Lock}
                placeholder={t('auth.passwordLabel')}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <InputField
                icon={Lock}
                placeholder="Confirm password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <PrimaryButton 
                title={t('auth.signUp')} 
                onPress={handleRegister} 
                loading={loading}
                style={{ marginTop: 16 }}
              />

              <View style={styles.footer}>
                <Text style={styles.footerText}>{t('auth.haveAccount')} </Text>
                <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                  <Text style={styles.footerLink}>{t('auth.logIn')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background, // architectWhite
  },
  safeArea: {
    flex: 1,
  },
  backBtn: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: 12,
    zIndex: 10,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 40,
    flexGrow: 1,
    justifyContent: 'center',
  },
  form: {
    width: '100%',
  },
  errorText: {
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '700',
    fontSize: 13,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  footerText: {
    color: Colors.light.textMuted,
    fontSize: 15,
    fontWeight: '500',
  },
  footerLink: {
    color: Colors.light.architectBlue,
    fontWeight: '800',
    fontSize: 15,
  },
});
