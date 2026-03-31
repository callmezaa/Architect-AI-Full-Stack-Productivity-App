import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList, 
  Keyboard, 
  Platform,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Shadows } from '../constants/theme';
import { aiService } from './services/api';
import Animated, { 
  FadeInDown, 
  LinearTransition,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay
} from 'react-native-reanimated';

// Modular Components
import { ChatHeader } from '../components/chat/ChatHeader';
import { ChatBubble } from '../components/chat/ChatBubble';
import { ChatInputBar } from '../components/chat/ChatInputBar';
import { ChatSuggestionChips } from '../components/chat/ChatSuggestionChips';
import { ChatEmptyState } from '../components/chat/ChatEmptyState';

const { height } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const SUGGESTIONS = [
  "Summarize my tasks",
  "Plan my morning routine",
  "Help me prioritize tasks",
  "Give productivity tips"
];

const TypingIndicator = () => {
    const Dot = ({ delay }: { delay: number }) => {
      const scale = useSharedValue(1);
      const opacity = useSharedValue(0.4);
  
      useEffect(() => {
        scale.value = withDelay(delay, withRepeat(withSequence(withTiming(1.4, { duration: 500 }), withTiming(1, { duration: 500 })), -1, true));
        opacity.value = withDelay(delay, withRepeat(withSequence(withTiming(1, { duration: 500 }), withTiming(0.4, { duration: 500 })), -1, true));
      }, []);
  
      const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
      }));
  
      return <Animated.View style={[styles.typingDot, animatedStyle]} />;
    };
  
    return (
      <View style={styles.typingContainer}>
        <Dot delay={0} />
        <Dot delay={200} />
        <Dot delay={400} />
      </View>
    );
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await aiService.chat(text);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg: Message = {
        id: 'err-' + Date.now(),
        text: "I'm sorry, I'm having trouble connecting to the server. Please try again in a moment.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ChatHeader onClear={clearChat} isTyping={isTyping} />

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <ChatBubble message={item} />}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<ChatEmptyState />}
          ListFooterComponent={isTyping ? (
            <Animated.View entering={FadeInDown} style={styles.typingWrapper}>
                 <TypingIndicator />
            </Animated.View>
          ) : null}
        />

        <View style={styles.bottomSection}>
          {!isTyping && messages.length < 5 && (
            <ChatSuggestionChips 
              suggestions={SUGGESTIONS} 
              onSelect={sendMessage} 
            />
          )}
          <ChatInputBar onSend={sendMessage} disabled={isTyping} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  listContent: {
    padding: Spacing.lg,
    paddingBottom: 20,
  },
  typingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  typingContainer: {
    flexDirection: 'row',
    gap: 4,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Shadows.soft,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light.primary,
  },
  bottomSection: {
    // Spacer for relative container
  }
});
