import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Image,
  FlatList,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useFonts, PlusJakartaSans_400Regular, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    title: 'Bingung\nbelajar\nreaksi kimia?',
    subtitle: 'Yuk belajar di KimiApp!\nEksplorasi dunia kimia\ndengan cara yang seru.',
    image: require('../assets/landingpage1.png'),
    icon: 'science',
  },
  {
    id: 2,
    title: 'Simulasi\nLab Virtual',
    subtitle: 'Eksperimen kimia tanpa\nrisiko, kapan saja dan\ndi mana saja.',
    image: require('../assets/landingpage2.png'),
    icon: 'biotech',
  },
  {
    id: 3,
    title: 'Belajar\njadi Mudah',
    subtitle: 'Materi lengkap dengan\npenjelasan yang mudah\ndipahami oleh kalangan\nmanapun.',
    image: require('../assets/landingpage3.png'),
    icon: 'menu-book',
  },
];

export default function LandingScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  let [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToOffset({
        offset: nextIndex * width,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    } else {
      navigation.navigate('Register');
    }
  };

  const handleSkip = () => {
    navigation.navigate('Login');
  };

  const goToSlide = (index) => {
    flatListRef.current?.scrollToOffset({
      offset: index * width,
      animated: true,
    });
    setCurrentIndex(index);
  };

  const renderSlide = ({ item }) => (
    <View style={styles.slide}>
      {/* Outer gradient for glass effect */}
      <View style={styles.cardOuter}>
        <LinearGradient
          colors={['rgba(255,255,255,0.95)', 'rgba(243,240,255,0.85)', 'rgba(230,225,250,0.8)']}
          locations={[0, 0.5, 1]}
          style={styles.card}
        >
          {/* Glass overlay */}
          <View style={styles.glassOverlay} />
          
          <View style={styles.cardContent}>
            <View style={styles.headerRow}>
              <Text style={styles.title}>{item.title}</Text>
              <MaterialIcons name={item.icon} size={40} color="#9CA3AF" style={styles.headerIcon} />
            </View>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
            
            {/* Dots inside card */}
            <View style={styles.dotsContainer}>
              {slides.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => goToSlide(index)}
                  style={[
                    styles.dot,
                    currentIndex === index && styles.dotActive,
                  ]}
                />
              ))}
            </View>
          </View>
          
          {/* Mascot Image */}
          <View style={styles.mascotContainer}>
            {/* Sparkle large - top right of mascot */}
            <View style={[styles.sparkleLarge, { position: 'absolute', top: 20, right: 40 }]} />
            
            {/* Sparkle small - bottom left of mascot */}
            <View style={[styles.sparkleSmall, { position: 'absolute', bottom: 60, left: 50 }]} />
            <View style={[styles.sparkleSmall, { position: 'absolute', bottom: 80, left: 35 }]} />
            
            <View style={styles.mascotShadow}>
              <Image
                source={item.image}
                style={styles.mascotImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </LinearGradient>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
      />

      {/* Bottom Buttons */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={handleSkip}
        >
          <Text style={styles.skipButtonText}>{currentIndex === slides.length - 1 ? 'Login' : 'Lewati'}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.nextButton, currentIndex === slides.length - 1 && styles.startButton]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentIndex === slides.length - 1 ? 'Mulai KimiApp' : 'Lanjutkan'}
          </Text>
          <MaterialIcons 
            name={currentIndex === slides.length - 1 ? 'science' : 'arrow-forward'} 
            size={20} 
            color="#FFFFFF" 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E1E5FD',
  },
  sparkleLarge: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  sparkleSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  slide: {
    width: width,
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 120,
  },
  cardOuter: {
    flex: 1,
    borderRadius: 32,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 10,
  },
  card: {
    flex: 1,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  glassOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  cardContent: {
    padding: 32,
    paddingTop: 48,
    zIndex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerIcon: {
    opacity: 0.3,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1E1F35',
    lineHeight: 44,
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6B7280',
    lineHeight: 26,
    marginBottom: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },
  dotActive: {
    backgroundColor: '#1E1F35',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  mascotContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  mascotShadow: {
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
  },
  mascotImage: {
    width: 250,
    height: 250,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  skipButtonText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#6B7280',
  },
  nextButton: {
    backgroundColor: '#1E1F35',
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  startButton: {
    backgroundColor: '#6366F1',
    shadowColor: '#6366F1',
    shadowOpacity: 0.3,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#FFFFFF',
  },
});