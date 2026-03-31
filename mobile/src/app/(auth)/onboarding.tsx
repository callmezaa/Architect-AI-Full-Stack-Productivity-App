import React, { useRef, useState, memo } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  Dimensions, 
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';
import { Timer, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import Animated, { 
  FadeInUp, 
  FadeIn, 
  useSharedValue, 
  useAnimatedScrollHandler, 
  useAnimatedStyle, 
  interpolate, 
  Extrapolation,
  SharedValue,
  withSpring,
  Layout
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    icon: CheckCircle2,
  },
  {
    id: '2',
    icon: Timer,
  },
  {
    id: '3',
    icon: Sparkles,
  }
];

// --- Sub-components for Hook Safety ---

const SlideItem = ({ item, index, scrollX, t }: { item: any, index: number, scrollX: SharedValue<number>, t: any }) => {
  const IconComponent = item.icon;
  
  const iconAnimatedStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    const scale = interpolate(scrollX.value, inputRange, [0.5, 1, 0.5], Extrapolation.CLAMP);
    const opacity = interpolate(scrollX.value, inputRange, [0.2, 1, 0.2], Extrapolation.CLAMP);
    const rotate = interpolate(scrollX.value, inputRange, [-30, 0, 30], Extrapolation.CLAMP);
    
    return {
      transform: [{ scale }, { rotate: `${rotate}deg` }],
      opacity,
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
     const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
     const translateY = interpolate(scrollX.value, inputRange, [50, 0, 50], Extrapolation.CLAMP);
     const opacity = interpolate(scrollX.value, inputRange, [0, 1, 0], Extrapolation.CLAMP);
     return { transform: [{ translateY }], opacity };
  });

  return (
    <View style={styles.slide}>
      <Animated.View style={[styles.glassIconContainer, iconAnimatedStyle]}>
         <View style={styles.glassBackground} />
         <IconComponent size={width * 0.5} color={Colors.light.architectBlue} strokeWidth={0.5} opacity={0.08} style={styles.iconAbsolute} />
         <IconComponent size={72} color={Colors.light.architectBlue} strokeWidth={1.5} />
      </Animated.View>
      
      <Animated.View style={textAnimatedStyle}>
        <Text style={styles.title}>{t(`onboarding.slides.${index}.title`)}</Text>
        <Text style={styles.description}>{t(`onboarding.slides.${index}.description`)}</Text>
      </Animated.View>
    </View>
  );
};

const PaginationDot = ({ index, scrollX }: { index: number, scrollX: SharedValue<number> }) => {
  const dotStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    
    const dotWidth = interpolate(
      scrollX.value,
      inputRange,
      [8, 24, 8],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.3, 1, 0.3],
      Extrapolation.CLAMP
    );

    return {
      width: dotWidth,
      opacity,
    };
  });

  return (
    <Animated.View
      style={[styles.dot, dotStyle, { backgroundColor: Colors.light.architectBlue }]}
    />
  );
};

const BackgroundDecor = ({ scrollX }: { scrollX: SharedValue<number> }) => {
  const decorStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      scrollX.value,
      [0, (SLIDES.length - 1) * width],
      [0, -width * 0.5],
      Extrapolation.CLAMP
    );
    
    const rotate = interpolate(
      scrollX.value,
      [0, (SLIDES.length - 1) * width],
      [0, 45],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateX }, { rotate: `${rotate}deg` }],
    };
  });

  return (
    <Animated.View style={[styles.backgroundDecor, decorStyle]} />
  );
};

// --- Main Screen ---

export default function OnboardingScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<FlatList>(null);
  const scrollX = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const updateCurrentSlideIndex = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const newIdx = Math.round(contentOffsetX / width);
    if (newIdx !== currentIndex) {
      setCurrentIndex(newIdx);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      scrollRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    try {
      const token = await SecureStore.getItemAsync('user_token');
      await SecureStore.setItemAsync('has_seen_onboarding', 'true');
      
      if (token) {
        console.log('[OnboardingComplete] Authenticated, going Home');
        router.replace('/');
      } else {
        console.log('[OnboardingComplete] No token, going to Login');
        router.replace('/(auth)/login');
      }
    } catch (error) {
      console.error('Error on onboarding completion:', error);
      router.replace('/(auth)/login');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundDecor scrollX={scrollX} />
      <Animated.FlatList
        ref={scrollRef as any}
        onScroll={onScroll}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        scrollEventThrottle={16}
        data={SLIDES}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsHorizontalScrollIndicator={false}
        horizontal
        pagingEnabled
        bounces={false}
        renderItem={({ item, index }) => (
          <SlideItem item={item} index={index} scrollX={scrollX} t={t} />
        )}
        keyExtractor={(item) => item.id}
      />

      <Animated.View entering={FadeIn.delay(1000).duration(800)} style={styles.footer}>
        <View style={styles.pagination}>
          {SLIDES.map((_, index) => (
            <PaginationDot key={index} index={index} scrollX={scrollX} />
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
           {currentIndex < SLIDES.length - 1 ? (
             <>
               <TouchableOpacity onPress={handleComplete} style={styles.skipButton}>
                 <Text style={styles.skipText}>{t('onboarding.skip')}</Text>
               </TouchableOpacity>
               <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
                 <Text style={styles.nextText}>{t('onboarding.next')}</Text>
                 <ArrowRight size={18} color="#FFF" />
               </TouchableOpacity>
             </>
           ) : (
             <TouchableOpacity onPress={handleComplete} style={styles.getStartedButton}>
               <Text style={styles.getStartedText}>{t('onboarding.getStarted')}</Text>
               <ArrowRight size={18} color="#FFF" />
             </TouchableOpacity>
           )}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  slide: {
    width,
    alignItems: 'center',
    paddingHorizontal: Spacing.xl * 1.5,
    paddingTop: height * 0.12,
  },
  backgroundDecor: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: width,
    height: width,
    borderRadius: width / 2,
    backgroundColor: 'rgba(22, 47, 105, 0.03)',
    zIndex: -1,
  },
  glassIconContainer: {
    width: width * 0.7,
    height: width * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xxl,
    position: 'relative',
  },
  glassBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(22, 47, 105, 0.04)',
    borderRadius: width * 0.35,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  iconAbsolute: {
    position: 'absolute',
  },
  title: {
    ...Typography.h1,
    fontSize: 34,
    color: '#111',
    lineHeight: 40,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  description: {
    ...Typography.body,
    fontSize: 16,
    color: Colors.light.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.xl,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    // handled by animated style
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
  },
  skipButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.textMuted,
    opacity: 0.8,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.light.architectBlue,
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: BorderRadius.full,
    ...Shadows.medium,
  },
  nextText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  getStartedButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.light.architectBlue,
    paddingVertical: 18,
    borderRadius: BorderRadius.full,
    ...Shadows.medium,
  },
  getStartedText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  }
});
