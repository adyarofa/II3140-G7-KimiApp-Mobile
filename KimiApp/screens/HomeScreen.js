import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { MaterialIcons } from '@expo/vector-icons';
import { useFonts, PlusJakartaSans_400Regular, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans';

export default function HomeScreen({ navigation }) {
  const user = auth.currentUser;

  let [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  // Random profile picture selection
  const profilePics = [
    require('../assets/tosca.png'),
    require('../assets/kuning.png'),
    require('../assets/ijo.png'),
    require('../assets/pink.png'),
  ];
  
  const randomProfilePic = React.useMemo(() => {
    const userEmail = user?.email || '';
    const index = userEmail.length % 4; // Consistent random based on user email
    return profilePics[index];
  }, [user?.email]);

  if (!fontsLoaded) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Landing' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const features = [
    {
      id: 1,
      title: 'Aman',
      description: 'Bebas risiko bahan kimia.',
      icon: 'shield',
      color: '#6366F1',
      bgColor: '#FFFFFF',
    },
    {
      id: 2,
      title: 'Interaktif',
      description: 'Simulasi alat virtual nyata.',
      icon: 'touch-app',
      color: '#8B5CF6',
      bgColor: '#FFFFFF',
    },
    {
      id: 3,
      title: 'Efektif',
      description: 'Pahami konsep lebih cepat.',
      icon: 'lightbulb',
      color: '#F59E0B',
      bgColor: '#FFFFFF',
    },
  ];

  const modules = [
    { 
      id: 1, 
      name: 'Asam & Basa', 
      description: 'Pelajari pH dan indikator warna.',
      icon: 'science', 
      color: '#FF6B6B',
      duration: '20 min',
      rating: '4.8'
    },
    { 
      id: 2, 
      name: 'Titrasi', 
      description: 'Analisis kuantitatif larutan.',
      icon: 'water-drop', 
      color: '#4ECDC4',
      duration: '35 min',
      rating: '4.9'
    },
    { 
      id: 3, 
      name: 'Reaksi Redoks', 
      description: 'Eksplorasi transfer elektron.',
      icon: 'flash-on', 
      color: '#9B59B6',
      duration: '25 min',
      rating: '4.7'
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.scrollContent}>
        {/* Header with Logo and Notification */}
        <View style={styles.header}>
          <Image
            source={require('../assets/logogelap.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <View style={styles.headerSpacer} />
          <TouchableOpacity style={styles.notificationButton}>
            <MaterialIcons name="notifications-none" size={26} color="#1E1F35" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={randomProfilePic}
              style={styles.avatar}
              resizeMode="contain"
            />
            <View style={styles.onlineIndicator} />
          </View>
          <Text style={styles.greeting}>Hello, {user?.displayName || 'Wijak'}!</Text>
          <Text style={styles.tagline}>Siap untuk bereksperimen hari ini?</Text>
        </View>

        {/* CTA Button */}
        <View style={styles.ctaSection}>
          <TouchableOpacity style={styles.primaryCTA}>
            <View style={styles.ctaIcon}>
              <MaterialIcons name="play-arrow" size={28} color="#FFFFFF" />
            </View>
            <View style={styles.ctaContent}>
              <Text style={styles.ctaTitle}>Mulai Belajar</Text>
              <Text style={styles.ctaSubtitle}>Lanjutkan progres terakhirmu</Text>
            </View>
            <MaterialIcons name="arrow-forward" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Modules Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Modul Populer</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllButton}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modulesContainer}>
            {modules.map((module) => (
              <TouchableOpacity key={module.id} style={styles.moduleCard}>
                <View style={styles.moduleLeft}>
                  <View style={[styles.moduleIconContainer, { backgroundColor: module.color + '20' }]}>
                    <MaterialIcons name={module.icon} size={28} color={module.color} />
                  </View>
                  <View style={styles.moduleInfo}>
                    <Text style={styles.moduleName}>{module.name}</Text>
                    <Text style={styles.moduleDescription}>{module.description}</Text>
                    <View style={styles.moduleStats}>
                      <MaterialIcons name="access-time" size={14} color="#9CA3AF" />
                      <Text style={styles.moduleStatText}>{module.duration}</Text>
                      <MaterialIcons name="star" size={14} color="#FBBF24" style={styles.starIcon} />
                      <Text style={styles.moduleStatText}>{module.rating}</Text>
                    </View>
                  </View>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kenapa KimiApp?</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature) => (
              <View key={feature.id} style={[styles.featureCard, { backgroundColor: feature.bgColor }]}>
                <MaterialIcons name={feature.icon} size={32} color={feature.color} />
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation - Fixed at bottom */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.activeIndicator} />
          <MaterialIcons name="home" size={26} color="#6366F1" />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="book" size={26} color="#9CA3AF" />
          <Text style={styles.navLabel}>Teori</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="science" size={26} color="#9CA3AF" />
          <Text style={styles.navLabel}>Simulasi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="quiz" size={26} color="#9CA3AF" />
          <Text style={styles.navLabel}>Kuis</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleLogout}>
          <MaterialIcons name="person" size={26} color="#9CA3AF" />
          <Text style={styles.navLabel}>Profil</Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 40,
    paddingBottom: 120,
    minHeight: 1000,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerLogo: {
    width: 110,
    height: 40,
  },
  headerSpacer: {
    flex: 1,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  avatar: {
    width: 160,
    height: 160,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981',
    borderWidth: 4,
    borderColor: '#E1E5FD',
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1E1F35',
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  ctaSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  primaryCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  ctaIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  ctaContent: {
    flex: 1,
  },
  ctaTitle: {
    fontSize: 17,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  ctaSubtitle: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  secondaryCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E1E5FD',
  },
  ctaIconSecondary: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ctaTitleSecondary: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1E1F35',
    marginBottom: 2,
  },
  ctaSubtitleSecondary: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6B7280',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1E1F35',
  },
  seeAllButton: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#6366F1',
  },
  featuresGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  featureCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1E1F35',
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  modulesContainer: {
    gap: 12,
  },
  moduleCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    minHeight: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  moduleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  moduleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  moduleIcon: {
    fontSize: 24,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleName: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1E1F35',
    marginBottom: 2,
  },
  moduleDescription: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6B7280',
    marginBottom: 6,
  },
  moduleStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moduleStatText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#6B7280',
    marginLeft: 4,
    marginRight: 12,
  },
  starIcon: {
    marginLeft: 0,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingBottom: 20,
    paddingHorizontal: 8,
    paddingTop: 12,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    top: -12,
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#6366F1',
  },
  navLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#9CA3AF',
    marginTop: 4,
  },
  navLabelActive: {
    color: '#6366F1',
  },
});
