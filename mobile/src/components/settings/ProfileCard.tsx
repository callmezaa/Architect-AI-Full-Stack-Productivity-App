import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { Colors, Spacing, Typography, Shadows, BorderRadius } from '../../constants/theme';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { authService } from '../../app/services/api';
import { useTheme } from '../../context/ThemeContext';

interface ProfileCardProps {
  name: string;
  email: string;
  profileImage?: string;
  onUpdate?: () => void;
}

export const ProfileCard = ({ name, email, profileImage, onUpdate }: ProfileCardProps) => {
  const { theme } = useTheme();
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setUploading(true);
      try {
        const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
        await authService.updateMe({ profile_image_url: base64Image });
        if (onUpdate) onUpdate();
      } catch (error) {
        console.error('Upload error:', error);
        Alert.alert('Error', 'Failed to update profile picture.');
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <Animated.View 
      entering={FadeInUp.duration(600)} 
      style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}
    >
      <TouchableOpacity 
        style={styles.avatarContainer} 
        onPress={pickImage}
        disabled={uploading}
        activeOpacity={0.8}
      >
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.avatarImage} />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: theme.primary }]}>
            <Text style={styles.avatarText}>
              {name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
        )}
        
        <View style={[styles.editBadge, { backgroundColor: theme.primary, borderColor: theme.surface }]}>
          {uploading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Camera size={12} color="#FFF" strokeWidth={3} />
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.info}>
        <Text style={[styles.name, { color: theme.text }]}>{name}</Text>
        <Text style={[styles.email, { color: theme.textMuted }]}>{email}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 24,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    ...Shadows.soft,
  },
  avatarContainer: {
    width: 68,
    height: 68,
    position: 'relative',
  },
  avatarPlaceholder: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    marginLeft: 18,
    flex: 1,
  },
  name: {
    ...Typography.body,
    fontSize: 18,
    fontWeight: '700',
  },
  email: {
    ...Typography.caption,
    fontSize: 13,
    marginTop: 2,
  }
});
