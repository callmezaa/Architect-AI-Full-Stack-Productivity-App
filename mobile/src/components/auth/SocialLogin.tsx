import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';
import { Globe, Apple } from 'lucide-react-native';

export const SocialLogin = () => {
  return (
    <View style={styles.container}>
      <View style={styles.dividerRow}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>or continue with</Text>
        <View style={styles.line} />
      </View>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
          <Globe size={18} color="#111" />
          <Text style={styles.buttonText}>Google</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
          <Apple size={18} color="#111" />
          <Text style={styles.buttonText}>Apple</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 32,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 12,
    color: Colors.light.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
  },
});
