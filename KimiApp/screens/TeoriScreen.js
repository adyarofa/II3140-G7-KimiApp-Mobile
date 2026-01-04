import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFonts, PlusJakartaSans_400Regular, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { auth, db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function TeoriScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [asamBasaProgress, setAsamBasaProgress] = useState(0);
  const [titrasiProgress, setTitrasiProgress] = useState(0);
  const [reaksiRedoksProgress, setReaksiRedoksProgress] = useState(0);
  const [ikatanKimiaProgress, setIkatanKimiaProgress] = useState(0);
  const [termokimiaProgress, setTermokimiaProgress] = useState(0);
  const [stoikiometriProgress, setStoikiometriProgress] = useState(0);

  let [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  useFocusEffect(
    useCallback(() => {
      loadProgress();
    }, [])
  );

  const loadProgress = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'userProgress', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setAsamBasaProgress(data.asamBasaProgress || 0);
          setTitrasiProgress(data.titrasiProgress || 0);
          setReaksiRedoksProgress(data.reaksiRedoksProgress || 0);
          setIkatanKimiaProgress(data.ikatanKimiaProgress || 0);
          setTermokimiaProgress(data.termokimiaProgress || 0);
          setStoikiometriProgress(data.stoikiometriProgress || 0);
        } else {
          setAsamBasaProgress(0);
          setTitrasiProgress(0);
          setReaksiRedoksProgress(0);
          setIkatanKimiaProgress(0);
          setTermokimiaProgress(0);
          setStoikiometriProgress(0);
        }
        return;
      }
      
      setAsamBasaProgress(0);
      setTitrasiProgress(0);
      setReaksiRedoksProgress(0);
      setIkatanKimiaProgress(0);
      setTermokimiaProgress(0);
      setStoikiometriProgress(0);
    } catch (error) {
      console.error('Error loading progress:', error);
      setAsamBasaProgress(0);
      setTitrasiProgress(0);
      setReaksiRedoksProgress(0);
      setIkatanKimiaProgress(0);
      setTermokimiaProgress(0);
      setStoikiometriProgress(0);
    }
  };

  const modules = [
    {
      id: 1,
      title: 'Asam & Basa',
      description: 'pH, Indikator, Titrasi Asam-Basa',
      icon: 'water-drop',
      iconBg: '#10B981',
      cardAccent: '#e7f9f0ff',
      progress: asamBasaProgress,
      completed: asamBasaProgress >= 100,
    },
    {
      id: 2,
      title: 'Titrasi',
      description: 'Kurva Titrasi, Titik Ekuivalen',
      icon: 'opacity',
      iconBg: '#A78BFA',
      cardAccent: '#f6f4fdff',
      progress: titrasiProgress,
      completed: titrasiProgress >= 100,
    },
    {
      id: 3,
      title: 'Reaksi Redoks',
      description: 'Bilangan Oksidasi, Sel Volta',
      icon: 'flash-on',
      iconBg: '#F59E0B',
      cardAccent: '#fcf6ddff',
      progress: reaksiRedoksProgress,
      completed: reaksiRedoksProgress >= 100,
    },
    {
      id: 4,
      title: 'Ikatan Kimia',
      description: 'Ion, Kovalen, Logam, Van der Waals',
      icon: 'hub',
      iconBg: '#06B6D4',
      cardAccent: '#e0fafcff',
      progress: ikatanKimiaProgress,
      completed: ikatanKimiaProgress >= 100,
    },
    {
      id: 5,
      title: 'Termokimia',
      description: 'Entalpi, Hukum Hess, Energi Ikatan',
      icon: 'local-fire-department',
      iconBg: '#EF4444',
      cardAccent: '#fdf4f4ff',
      progress: termokimiaProgress,
      completed: termokimiaProgress >= 100,
    },
    {
      id: 6,
      title: 'Stoikiometri',
      description: 'Mol, Massa Molar, Persamaan Reaksi',
      icon: 'calculate',
      iconBg: '#8B5CF6',
      cardAccent: '#f8f6ffff',
      progress: stoikiometriProgress,
      completed: stoikiometriProgress >= 100,
    },
  ];

  const totalProgress = Math.round(
    modules.reduce((sum, m) => sum + m.progress, 0) / modules.length
  );

  const filteredModules = modules.filter(
    (m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Modul Teori</Text>
              <Text style={styles.headerSubtitle}>Pilih topik untuk mulai belajar</Text>
            </View>
            <View style={styles.totalProgressBadge}>
              <MaterialIcons name="emoji-events" size={16} color="#6366F1" />
              <Text style={styles.totalProgressText}>Total: {totalProgress}%</Text>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={22} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari materi kimia..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Module Cards */}
          <View style={styles.modulesContainer}>
            {filteredModules.map((module) => (
              <TouchableOpacity 
                key={module.id} 
                style={styles.moduleCard}
                onPress={() => {
                  if (module.id === 1) {
                    navigation.navigate('AsamBasa');
                  } else if (module.id === 2) {
                    navigation.navigate('Titrasi');
                  } else if (module.id === 3) {
                    navigation.navigate('ReaksiRedoks');
                  } else if (module.id === 4) {
                    navigation.navigate('IkatanKimia');
                  } else if (module.id === 5) {
                    navigation.navigate('Termokimia');
                  } else if (module.id === 6) {
                    navigation.navigate('Stoikiometri');
                  }
                }}
              >
                {/* Color accent in top right corner */}
                <View style={[styles.cardAccent, { backgroundColor: module.cardAccent }]} />
                <View style={styles.moduleContent}>
                  <View style={[styles.moduleIcon, { backgroundColor: module.iconBg }]}>
                    <MaterialIcons name={module.icon} size={24} color="#FFFFFF" />
                  </View>
                  <View style={styles.moduleInfo}>
                    <View style={styles.moduleTitleRow}>
                      <Text style={styles.moduleTitle}>{module.title}</Text>
                      {module.completed && (
                        <View style={styles.completedBadge}>
                          <Text style={styles.completedText}>Selesai</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.moduleDescription}>{module.description}</Text>
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View
                          style={[
                            styles.progressFill,
                            { width: `${module.progress}%` },
                            module.progress === 100 && styles.progressComplete,
                          ]}
                        />
                      </View>
                      <Text style={styles.progressText}>{module.progress}%</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <MaterialIcons name="home" size={26} color="#9CA3AF" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.activeIndicator} />
          <MaterialIcons name="book" size={26} color="#6366F1" />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Teori</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('VirtualLab')}>
          <MaterialIcons name="science" size={26} color="#9CA3AF" />
          <Text style={styles.navLabel}>Simulasi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Quiz')}>
          <MaterialIcons name="quiz" size={26} color="#9CA3AF" />
          <Text style={styles.navLabel}>Kuis</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
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
    paddingTop: 60,
    paddingBottom: 120,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1E1F35',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6B7280',
  },
  totalProgressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  totalProgressText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#6366F1',
    marginLeft: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#1E1F35',
    marginLeft: 10,
  },
  modulesContainer: {
    gap: 12,
  },
  moduleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  cardAccent: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 100,
    height: 100,
    borderBottomLeftRadius: 100,
  },
  moduleContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    zIndex: 1,
  },
  moduleIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1E1F35',
  },
  completedBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#16A34A',
  },
  moduleDescription: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6B7280',
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginRight: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 4,
  },
  progressComplete: {
    backgroundColor: '#16A34A',
  },
  progressText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#6366F1',
    minWidth: 40,
    textAlign: 'right',
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
