import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Dimensions, Text, Animated } from 'react-native';
import { useFonts, PlusJakartaSans_400Regular, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onFinish }) {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const bubbleAnim1 = useRef(new Animated.Value(0)).current;
  const bubbleAnim2 = useRef(new Animated.Value(0)).current;
  const bubbleAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      Animated.timing(textFadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 400);

    const animateBubble = (anim, delay) => {
      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 2000,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }, delay);
    };

    animateBubble(bubbleAnim1, 0);
    animateBubble(bubbleAnim2, 500);
    animateBubble(bubbleAnim3, 1000);

    const timer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const bubbleTranslate1 = bubbleAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  const bubbleTranslate2 = bubbleAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -25],
  });

  const bubbleTranslate3 = bubbleAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -35],
  });

  return (
    <LinearGradient
      colors={['#1E1B4B', '#312E81', '#4338CA']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Decorative bubbles */}
      <Animated.View style={[styles.bubble, styles.bubble1, { transform: [{ translateY: bubbleTranslate1 }] }]} />
      <Animated.View style={[styles.bubble, styles.bubble2, { transform: [{ translateY: bubbleTranslate2 }] }]} />
      <Animated.View style={[styles.bubble, styles.bubble3, { transform: [{ translateY: bubbleTranslate3 }] }]} />
      <Animated.View style={[styles.bubble, styles.bubble4, { transform: [{ translateY: bubbleTranslate1 }] }]} />
      <Animated.View style={[styles.bubble, styles.bubble5, { transform: [{ translateY: bubbleTranslate2 }] }]} />

      {/* Logo */}
      <Animated.View style={[
        styles.logoContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }
      ]}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* App Name */}
      <Animated.View style={[styles.textContainer, { opacity: textFadeAnim }]}>
        <Text style={styles.tagline}>Belajar Kimia Jadi Menyenangkan</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubble: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  bubble1: {
    width: 80,
    height: 80,
    top: '15%',
    left: '10%',
  },
  bubble2: {
    width: 50,
    height: 50,
    top: '25%',
    right: '15%',
  },
  bubble3: {
    width: 100,
    height: 100,
    bottom: '20%',
    left: '5%',
  },
  bubble4: {
    width: 40,
    height: 40,
    bottom: '30%',
    right: '10%',
  },
  bubble5: {
    width: 60,
    height: 60,
    top: '60%',
    right: '25%',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -60,
  },
  logoGlow: {
    position: 'absolute',
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: 'rgba(99, 102, 241, 0.3)',
  },
  logo: {
    width: width * 0.55,
    height: width * 0.55,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: -60,
  },
  appName: {
    fontSize: 40,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 0.5,
  },
  bottomDecoration: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  molecule: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  atom: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  atomSmall: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  bond: {
    width: 20,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
});
