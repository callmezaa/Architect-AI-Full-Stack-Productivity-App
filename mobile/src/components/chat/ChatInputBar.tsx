import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { Colors, Spacing, Shadows, BorderRadius } from '../../constants/theme';
import { Send, Mic } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface ChatInputBarProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export const ChatInputBar = ({ onSend, disabled }: ChatInputBarProps) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSend(text);
    setText('');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      style={styles.container}
    >
      <Animated.View entering={FadeInUp.delay(200)} style={styles.inputWrapper}>
        <View style={styles.inputCard}>
          <TextInput
            style={[styles.input, { maxHeight: 100 }]}
            placeholder="Ask anything..."
            placeholderTextColor={Colors.light.textMuted}
            value={text}
            onChangeText={setText}
            multiline
            editable={!disabled}
          />
          <View style={styles.actions}>
            {!text.trim() && (
              <TouchableOpacity style={styles.micButton} activeOpacity={0.6}>
                <Mic size={20} color={Colors.light.textMuted} />
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={[
                styles.sendButton,
                (!text.trim() || disabled) && styles.disabledButton
              ]} 
              onPress={handleSend}
              disabled={!text.trim() || disabled}
              activeOpacity={0.8}
            >
              <Send size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100, // Account for floating tab bar
  },
  inputWrapper: {
    width: '100%',
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 6,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Shadows.medium,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.light.text,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 4,
  },
  micButton: {
    padding: 10,
    marginRight: 4,
    borderRadius: 20,
    backgroundColor: Colors.light.surfaceSubtle,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: Colors.light.border,
    opacity: 0.5,
  }
});
