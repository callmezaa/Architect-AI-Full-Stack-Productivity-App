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
import { Mail, Lock } from 'lucide-react-native';
import * as SecureStore from 'expo-secure-store';
import { useTranslation } from 'react-i18next';

// Modular Components
import { AuthHeader } from '../../components/auth/AuthHeader';
import { InputField } from '../../components/auth/InputField';
import { PrimaryButton } from '../../components/auth/PrimaryButton';
import { SocialLogin } from '../../components/auth/SocialLogin';

export default function LoginScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError(t('auth.fieldsRequired'));
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await authService.login(email, password);
      await SecureStore.setItemAsync('user_token', response.access_token);
      router.replace('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <AuthHeader 
              title={t('auth.welcomeBack')} 
              subtitle={t('auth.loginSubtitle')}
            />

            <View style={styles.form}>
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

              <TouchableOpacity style={styles.forgotPass}>
                <Text style={styles.forgotPassText}>{t('auth.forgotPassword')}</Text>
              </TouchableOpacity>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <PrimaryButton 
                title={t('auth.signIn')} 
                onPress={handleLogin} 
                loading={loading}
              />

              <SocialLogin />

              <View style={styles.footer}>
                <Text style={styles.footerText}>{t('auth.noAccount')} </Text>
                <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                  <Text style={styles.footerLink}>{t('auth.createOne')}</Text>
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
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: 60,
    paddingBottom: 40,
    flexGrow: 1,
    justifyContent: 'center',
  },
  form: {
    width: '100%',
  },
  forgotPass: {
    alignSelf: 'flex-end',
    marginBottom: 28,
    marginTop: 4,
    marginRight: 8,
  },
  forgotPassText: {
    color: Colors.light.textMuted,
    fontSize: 14,
    fontWeight: '700',
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
    marginTop: 40,
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
