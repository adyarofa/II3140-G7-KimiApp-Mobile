import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { signOut } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';
import { useFonts, PlusJakartaSans_400Regular, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function ProfileScreen({ navigation }) {
  const user = auth.currentUser;
  const [loading, setLoading] = useState(true);
  const [teoriProgress, setTeoriProgress] = useState(0);
  const [kuisHighScore, setKuisHighScore] = useState(0);

  let [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  useFocusEffect(
    useCallback(() => {
      loadAllData();
    }, [])
  );

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([loadProgress(), fetchMaxScore()]);
    setLoading(false);
  };

  const loadProgress = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'userProgress', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          const asamBasa = data.asamBasaProgress || 0;
          const titrasi = data.titrasiProgress || 0;
          const reaksiRedoks = data.reaksiRedoksProgress || 0;
          const ikatanKimia = data.ikatanKimiaProgress || 0;
          const termokimia = data.termokimiaProgress || 0;
          const stoikiometri = data.stoikiometriProgress || 0;
          
          const totalProgress = Math.round(
            (asamBasa + titrasi + reaksiRedoks + ikatanKimia + termokimia + stoikiometri) / 6
          );
          setTeoriProgress(totalProgress);
        } else {
          // User baru - mulai dari 0
          setTeoriProgress(0);
        }
        return;
      }
      
      // No user - set to 0
      setTeoriProgress(0);
    } catch (error) {
      console.error('Error loading progress:', error);
      setTeoriProgress(0);
    }
  };
  const fetchMaxScore = async () => {
    if (!user) return;

    try {
      const userProgressRef = doc(db, "userProgress", user.uid);
      const docSnap = await getDoc(userProgressRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setKuisHighScore(data.maxQuizScore || 0);
      } else {
        setKuisHighScore(0);
      }
    } catch (error) {
      console.error("Error fetching max score:", error);
      setKuisHighScore(0);
    }
  };

  const profilePics = [
    require('../assets/tosca.png'),
    require('../assets/kuning.png'),
    require('../assets/ijo.png'),
    require('../assets/pink.png'),
  ];
  
  const randomProfilePic = React.useMemo(() => {
    const userEmail = user?.email || '';
    const index = userEmail.length % 4;
    return profilePics[index];
  }, [user?.email]);

  if (!fontsLoaded) {
    return null;
  }

  const handleLogout = async () => {
    try {
      // Clear all progress from AsyncStorage saat logout
      await AsyncStorage.multiRemove([
        'asamBasaProgress',
        'titrasiProgress',
        'reaksiRedoksProgress',
        'ikatanKimiaProgress',
        'termokimiaProgress',
        'stoikiometriProgress',
      ]);
      
      await signOut(auth);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Landing' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.scrollContent}>
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Image
                source={randomProfilePic}
                style={styles.avatar}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.userName}>{user?.displayName || 'Wijak'}</Text>
            <Text style={styles.welcomeText}>Selamat datang di profil Anda!</Text>

            <View style={styles.divider} />

            {/* Progress Teori Section */}
            <View style={styles.statsSection}>
              <Text style={styles.statsTitle}>Progress Teori</Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${teoriProgress}%` }]} />
                </View>
                <Text style={styles.progressText}>{teoriProgress}% Selesai</Text>
              </View>
              <Text style={styles.statsDescription}>Progress Anda dalam membaca modul teori.</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Teori')}>
                <Text style={styles.actionLink}>Lanjutkan Belajar</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            {/* Skor Kuis Section */}
            <View style={styles.statsSection}>
              <Text style={styles.statsTitle}>Skor Kuis Tertinggi</Text>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreNumber}>{kuisHighScore}</Text>
                <Text style={styles.scoreLabel}>Poin</Text>
              </View>
              <Text style={styles.statsDescription}>Skor tertinggi yang pernah Anda capai di kuis.</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Quiz')}>
                <Text style={styles.actionLink}>Coba Lagi</Text>
              </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <MaterialIcons name="home" size={26} color="#9CA3AF" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Teori')}>
          <MaterialIcons name="book" size={26} color="#9CA3AF" />
          <Text style={styles.navLabel}>Teori</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('VirtualLab')}>
          <MaterialIcons name="science" size={26} color="#9CA3AF" />
          <Text style={styles.navLabel}>Simulasi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Quiz')}>
          <MaterialIcons name="quiz" size={26} color="#9CA3AF" />
          <Text style={styles.navLabel}>Kuis</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.activeIndicator} />
          <MaterialIcons name="person" size={26} color="#6366F1" />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Profil</Text>
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
    paddingTop: 80,
    paddingBottom: 120,
    paddingHorizontal: 20,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  avatar: {
    width: 120,
    height: 120,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1E1F35',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6B7280',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 20,
  },
  statsSection: {
    width: '100%',
    alignItems: 'flex-start',
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1E1F35',
    marginBottom: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 5,
    marginRight: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#1E1F35',
  },
  statsDescription: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  actionLink: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#6366F1',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#6366F1',
    marginRight: 8,
  },
  scoreLabel: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6366F1',
  },
  logoutButton: {
    backgroundColor: '#cb3636ff',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginTop: 24,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#FFFFFF',
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
