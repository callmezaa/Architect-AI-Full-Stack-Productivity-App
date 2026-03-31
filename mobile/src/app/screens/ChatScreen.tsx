import React, { useState, useRef, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform, 
  FlatList,
  Dimensions
} from 'react-native';
import { Colors, Spacing, Typography, Shadows, BorderRadius } from '../../constants/theme';
import { GlassCard } from '../../components/ui/GlassCard';
import { aiService } from '../services/api';
import { 
  Send, 
  Sparkles, 
  User, 
  Bot, 
  Trash2, 
  ChevronRight, 
  MessageSquare,
  Zap
} from 'lucide-react-native';
import Animated, { 
  FadeInDown, 
  FadeInRight, 
  FadeOut, 
  LinearTransition,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const SUGGESTED_PROMPTS = [
  "How can I be more productive?",
  "Summarize my tasks for today",
  "Give me a 5-minute focus routine",
  "Write a polite email about a delay"
];

const TypingIndicator = () => {
  const Dot = ({ delay }: { delay: number }) => {
    const translateY = useSharedValue(0);

    React.useEffect(() => {
      translateY.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(-6, { duration: 400 }),
            withTiming(0, { duration: 400 })
          ),
          -1,
          true
        )
      );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }],
    }));

    return <Animated.View style={[styles.typingDot, animatedStyle]} />;
  };

  return (
    <View style={styles.typingContainer}>
      <Dot delay={0} />
      <Dot delay={150} />
      <Dot delay={300} />
    </View>
  );
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Halo! Saya asisten produktivitas AI Anda. Ada yang bisa saya bantu hari ini?', sender: 'ai', timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<FlatList>(null);

  const sendMessage = async (text?: string) => {
    const messageToSend = text || inputText;
    if (!messageToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageToSend,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    if (!text) setInputText('');
    setIsTyping(true);

    try {
      const response = await aiService.chat(messageToSend);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        id: 'err', 
        text: 'Maaf, terjadi kesalahan koneksi. Silakan coba lagi.', 
        sender: 'ai', 
        timestamp: new Date() 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([{ 
      id: '1', 
      text: 'Halo kembali! Apa yang bisa kita kerjakan bersama sekarang?', 
      sender: 'ai', 
      timestamp: new Date() 
    }]);
  };

  const renderMessage = ({ item, index }: { item: Message, index: number }) => (
    <Animated.View 
      entering={FadeInDown.delay(100).duration(400)}
      layout={LinearTransition}
      style={[
        styles.messageWrapper,
        item.sender === 'user' ? styles.userWrapper : styles.aiWrapper
      ]}
    >
      <View style={[
        styles.messageContainer,
        item.sender === 'user' ? styles.userContainer : styles.aiContainer
      ]}>
        {item.sender === 'ai' && (
          <View style={styles.avatarAi}>
            <Bot size={16} color="#FFF" />
          </View>
        )}
        
        <View style={styles.bubbleCol}>
          <GlassCard style={[
            styles.messageBubble,
            item.sender === 'user' ? styles.userBubble : styles.aiBubble
          ]}>
            <Text style={[
              styles.messageText,
              item.sender === 'user' ? styles.userText : styles.aiText
            ]}>
              {item.text}
            </Text>
          </GlassCard>
          <Text style={styles.timestampText}>
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>

        {item.sender === 'user' && (
          <View style={styles.avatarUser}>
            <User size={16} color="#FFF" />
          </View>
        )}
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <LinearGradient
        colors={['#F8FAFC', '#EFF6FF', '#F8FAFC']}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.headerTitleRow}>
            <Text style={styles.headerTitle}>AI Assistant</Text>
            <View style={styles.onlineDot} />
          </View>
          <Text style={styles.headerSubtitle}>{isTyping ? 'Thinking...' : 'Active now'}</Text>
        </View>
        <TouchableOpacity onPress={clearChat} style={styles.clearButton}>
          <Trash2 size={20} color={Colors.light.textMuted} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <FlatList
          ref={scrollRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => isTyping ? (
            <View style={styles.aiWrapper}>
              <View style={styles.aiContainer}>
                <View style={styles.avatarAi}>
                  <Bot size={16} color="#FFF" />
                </View>
                <TypingIndicator />
              </View>
            </View>
          ) : null}
        />

        <View style={styles.bottomSection}>
          {messages.length < 3 && !isTyping && (
             <Animated.ScrollView 
               horizontal 
               showsHorizontalScrollIndicator={false}
               style={styles.suggestions}
               contentContainerStyle={styles.suggestionsContent}
               entering={FadeInRight.delay(500)}
             >
               {SUGGESTED_PROMPTS.map((prompt, i) => (
                 <TouchableOpacity 
                   key={i} 
                   style={styles.suggestionItem}
                   onPress={() => sendMessage(prompt)}
                 >
                   <Sparkles size={14} color={Colors.light.primary} style={{ marginRight: 6 }} />
                   <Text style={styles.suggestionText}>{prompt}</Text>
                 </TouchableOpacity>
               ))}
             </Animated.ScrollView>
          )}

          <GlassCard style={styles.inputCard}>
            <TextInput
              style={styles.input}
              placeholder="Ask anything..."
              placeholderTextColor={Colors.light.textMuted}
              value={inputText}
              onChangeText={setInputText}
              multiline
              onFocus={() => scrollRef.current?.scrollToEnd({ animated: true })}
            />
            <TouchableOpacity 
              style={[
                styles.sendButton, 
                !inputText.trim() && { opacity: 0.5, backgroundColor: Colors.light.border }
              ]} 
              onPress={() => sendMessage()}
              disabled={!inputText.trim() || isTyping}
            >
              <Send size={20} color="#FFF" />
            </TouchableOpacity>
          </GlassCard>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.5)',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light.accent,
    marginLeft: 8,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.light.textMuted,
    marginTop: 2,
  },
  clearButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
  },
  messageList: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  messageWrapper: {
    marginBottom: 20,
    width: '100%',
  },
  userWrapper: {
    alignItems: 'flex-end',
  },
  aiWrapper: {
    alignItems: 'flex-start',
  },
  messageContainer: {
    flexDirection: 'row',
    maxWidth: '85%',
    alignItems: 'flex-end',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  aiContainer: {
    justifyContent: 'flex-start',
  },
  bubbleCol: {
    marginHorizontal: 10,
  },
  messageBubble: {
    padding: 14,
    borderRadius: 20,
    ...Shadows.soft,
  },
  userBubble: {
    backgroundColor: Colors.light.primary,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: '#FFF',
    fontWeight: '500',
  },
  aiText: {
    color: Colors.light.text,
  },
  timestampText: {
    fontSize: 10,
    color: Colors.light.textMuted,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  avatarAi: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarUser: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: Colors.light.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.light.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  typingContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light.primary,
    marginHorizontal: 2,
  },
  bottomSection: {
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    paddingHorizontal: Spacing.md,
  },
  suggestions: {
    marginBottom: 16,
  },
  suggestionsContent: {
    paddingRight: 20,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
    marginRight: 10,
    ...Shadows.soft,
  },
  suggestionText: {
    fontSize: 13,
    color: Colors.light.text,
    fontWeight: '500',
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    ...Shadows.medium,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    maxHeight: 120,
    color: Colors.light.text,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});
