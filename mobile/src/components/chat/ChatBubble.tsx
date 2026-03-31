import React from 'react';
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import { Colors, Spacing, Typography, Shadows, BorderRadius } from '../../constants/theme';
import { User, Bot } from 'lucide-react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const MAX_BUBBLE_WIDTH = width * 0.82;

interface ChatBubbleProps {
  message: {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
  };
}

export const ChatBubble = ({ message }: ChatBubbleProps) => {
  const isAI = message.sender === 'ai';

  return (
    <Animated.View 
        entering={FadeInDown.duration(400)}
        layout={LinearTransition}
        style={[styles.container, isAI ? styles.aiContainer : styles.userContainer]}
    >
      {isAI && (
        <View style={styles.avatarBox}>
          <View style={[styles.avatar, { backgroundColor: Colors.light.primary }]}>
             <Bot size={16} color="#FFF" />
          </View>
        </View>
      )}

      <View style={[styles.bubbleWrapper, isAI ? styles.aiWrapper : styles.userWrapper]}>
        <View style={[
          styles.bubble,
          isAI ? styles.aiBubble : styles.userBubble
        ]}>
          <Text style={[
            styles.text,
            isAI ? styles.aiText : styles.userText
          ]}>
            {message.text}
          </Text>
        </View>
        <Text style={[styles.timeText, isAI ? styles.aiTime : styles.userTime]}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>

      {!isAI && (
        <View style={styles.avatarBox}>
          <View style={[styles.avatar, { backgroundColor: Colors.light.secondary }]}>
             <User size={16} color="#FFF" />
          </View>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 20,
    width: '100%',
  },
  aiContainer: {
    justifyContent: 'flex-start',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  avatarBox: {
    paddingHorizontal: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubbleWrapper: {
    maxWidth: MAX_BUBBLE_WIDTH,
  },
  aiWrapper: {
    alignItems: 'flex-start',
  },
  userWrapper: {
    alignItems: 'flex-end',
  },
  bubble: {
    padding: 14,
    borderRadius: 22,
    ...Shadows.soft,
  },
  aiBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  userBubble: {
    backgroundColor: Colors.light.primary,
    borderBottomRightRadius: 4,
  },
  text: {
    ...Typography.body,
    fontSize: 15,
    lineHeight: 22,
  },
  aiText: {
    color: Colors.light.text,
  },
  userText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  timeText: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.light.textMuted,
    marginTop: 4,
  },
  aiTime: {
    marginLeft: 4,
  },
  userTime: {
    marginRight: 4,
  }
});
