import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFonts, PlusJakartaSans_400Regular, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function IkatanKimiaScreen({ navigation }) {
  const [progress, setProgress] = useState(0);
  const scrollViewRef = useRef(null);

  let [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'userProgress', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.ikatanKimiaProgress !== undefined) {
            setProgress(data.ikatanKimiaProgress);
            await AsyncStorage.setItem('ikatanKimiaProgress', data.ikatanKimiaProgress.toString());
            return;
          }
        }
        setProgress(0);
        await AsyncStorage.setItem('ikatanKimiaProgress', '0');
        return;
      }
      
      const savedProgress = await AsyncStorage.getItem('ikatanKimiaProgress');
      if (savedProgress !== null) {
        setProgress(parseInt(savedProgress));
      }
    } catch (error) {
      console.error('Error loading progress:', error);
      setProgress(0);
    }
  };

  const saveProgress = async (newProgress) => {
    try {
      if (newProgress > progress) {
        setProgress(newProgress);
        await AsyncStorage.setItem('ikatanKimiaProgress', newProgress.toString());
        
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, 'userProgress', user.uid);
          await setDoc(docRef, {
            ikatanKimiaProgress: newProgress,
            lastUpdated: new Date().toISOString(),
            email: user.email,
          }, { merge: true });
        }
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const scrollPercentage = Math.round(
      ((contentOffset.y + layoutMeasurement.height) / contentSize.height) * 100
    );
    const cappedProgress = Math.min(scrollPercentage, 100);
    saveProgress(cappedProgress);
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={true}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back" size={24} color="#1E1F35" />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Ikatan Kimia</Text>
              <Text style={styles.headerSubtitle}>Modul Pembelajaran Kimia</Text>
            </View>
            <View style={styles.progressCircle}>
              <Text style={styles.progressCircleText}>{progress}%</Text>
            </View>
          </View>

          {/* Hero Card */}
          <View style={styles.heroCard}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>Kimia Dasar</Text>
            </View>
            <Text style={styles.heroTitle}>Pengertian Ikatan Kimia</Text>
            <Text style={styles.heroDescription}>
              Pelajari gaya tarik menarik antar atom yang menyebabkan atom-atom tersebut tetap bersama membentuk senyawa stabil.
            </Text>
            <View style={styles.heroStats}>
              <View style={styles.heroStatItem}>
                <MaterialIcons name="schedule" size={16} color="#FFFFFF" />
                <Text style={styles.heroStatText}>25 Menit</Text>
              </View>
              <Text style={styles.heroStatDivider}>•</Text>
              <Text style={styles.heroStatText}>4 Topik</Text>
            </View>
          </View>

          {/* Konsep Utama */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <MaterialIcons name="menu-book" size={24} color="#6366F1" />
              </View>
              <Text style={styles.sectionTitle}>Konsep Utama</Text>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Ikatan Ion</Text>
                <Text style={styles.stepDescription}>
                  Terbentuk dari <Text style={styles.italicText}>serah terima</Text> elektron antara logam dan non-logam.
                </Text>
              </View>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Ikatan Kovalen</Text>
                <Text style={styles.stepDescription}>
                  Terbentuk dari <Text style={styles.italicText}>pemakaian bersama</Text> pasangan elektron antar non-logam.
                </Text>
              </View>
            </View>

            <View style={[styles.stepItem, { borderBottomWidth: 0, paddingBottom: 0, marginBottom: 0 }]}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Ikatan Logam</Text>
                <Text style={styles.stepDescription}>
                  Gaya tarik elektrostatik antara ion positif logam dengan <Text style={styles.italicText}>lautan elektron</Text>.
                </Text>
              </View>
            </View>
          </View>

          {/* Struktur dan Sifat */}
          <View style={styles.twoColumnContainer}>
            <View style={styles.formulaCard}>
              <View style={styles.formulaIconContainer}>
                <MaterialIcons name="auto-awesome" size={24} color="#6366F1" />
              </View>
              <Text style={styles.formulaTitle}>Struktur</Text>
              <Text style={styles.formulaSubtitle}>PENGGAMBARAN</Text>
              <View style={styles.jenisList}>
                <Text style={styles.jenisItem}>• Struktur Lewis</Text>
                <Text style={styles.jenisItem}>• Kaidah Oktet</Text>
              </View>
            </View>

            <View style={styles.jenisCard}>
              <View style={styles.jenisIconContainer}>
                <MaterialIcons name="blur-on" size={24} color="#10B981" />
              </View>
              <Text style={styles.jenisTitle}>Sifat Materi</Text>
              <Text style={styles.jenisSubtitle}>KARAKTERISTIK</Text>
              <View style={styles.jenisList}>
                <Text style={styles.jenisItem}>• Titik Didih</Text>
                <Text style={styles.jenisItem}>• Daya Hantar</Text>
              </View>
            </View>
          </View>

          {/* Tips Memahami */}
          <View style={styles.infoCard}>
            <View style={styles.infoIconContainer}>
              <MaterialIcons name="tips-and-updates" size={20} color="#6366F1" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Tips Memahami</Text>
              <Text style={styles.infoDescription}>
                Ingat! <Text style={styles.boldText}>Logam + Non-Logam</Text> biasanya membentuk Ikatan Ion, sedangkan <Text style={styles.boldText}>Sesama Non-Logam</Text> membentuk Ikatan Kovalen.
              </Text>
            </View>
          </View>

          {/* Ikatan Ion */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconContainer, { backgroundColor: '#FEF3C7' }]}>
                <MaterialIcons name="add-circle" size={24} color="#F59E0B" />
              </View>
              <Text style={styles.sectionTitle}>Ikatan Ion</Text>
            </View>

            <Text style={styles.contentText}>
              Ikatan ion terjadi karena gaya tarik elektrostatik antara ion positif (kation) dan ion negatif (anion).
            </Text>

            <View style={styles.conceptCard}>
              <Text style={styles.conceptTitle}>Ciri-ciri Senyawa Ion</Text>
              <Text style={styles.conceptText}>
                • Keras tapi rapuh{'\n'}
                • Titik leleh dan didih tinggi{'\n'}
                • Dapat menghantarkan listrik saat larut{'\n'}
                • Larut dalam pelarut polar (air)
              </Text>
            </View>

            <View style={styles.conceptCard}>
              <Text style={styles.conceptTitle}>Contoh Senyawa Ion</Text>
              <Text style={styles.conceptText}>
                • NaCl (Natrium Klorida){'\n'}
                • MgO (Magnesium Oksida){'\n'}
                • CaCl₂ (Kalsium Klorida)
              </Text>
            </View>
          </View>

          {/* Ikatan Kovalen */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconContainer, { backgroundColor: '#DBEAFE' }]}>
                <MaterialIcons name="share" size={24} color="#3B82F6" />
              </View>
              <Text style={styles.sectionTitle}>Ikatan Kovalen</Text>
            </View>

            <Text style={styles.contentText}>
              Ikatan kovalen terbentuk ketika dua atom berbagi pasangan elektron untuk mencapai konfigurasi stabil.
            </Text>

            <View style={styles.conceptCard}>
              <Text style={styles.conceptTitle}>Jenis Ikatan Kovalen</Text>
              <Text style={styles.conceptText}>
                • <Text style={styles.boldText}>Kovalen Tunggal:</Text> 1 pasang elektron (H₂, Cl₂){'\n'}
                • <Text style={styles.boldText}>Kovalen Rangkap 2:</Text> 2 pasang elektron (O₂, CO₂){'\n'}
                • <Text style={styles.boldText}>Kovalen Rangkap 3:</Text> 3 pasang elektron (N₂)
              </Text>
            </View>

            <View style={styles.conceptCard}>
              <Text style={styles.conceptTitle}>Kovalen Polar vs Non-Polar</Text>
              <Text style={styles.conceptText}>
                • <Text style={styles.boldText}>Polar:</Text> Beda keelektronegatifan besar (H₂O, HCl){'\n'}
                • <Text style={styles.boldText}>Non-polar:</Text> Beda keelektronegatifan kecil
              </Text>
            </View>
          </View>

          {/* Ikatan Logam */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconContainer, { backgroundColor: '#D1FAE5' }]}>
                <MaterialIcons name="grain" size={24} color="#10B981" />
              </View>
              <Text style={styles.sectionTitle}>Ikatan Logam</Text>
            </View>

            <Text style={styles.contentText}>
              Ikatan logam terbentuk dari gaya tarik antara ion-ion positif logam dengan elektron valensi yang bergerak bebas (lautan elektron).
            </Text>

            <View style={styles.conceptCard}>
              <Text style={styles.conceptTitle}>Sifat Khas Logam</Text>
              <Text style={styles.conceptText}>
                • Mengkilap (berkilau){'\n'}
                • Penghantar listrik dan panas yang baik{'\n'}
                • Dapat ditempa (malleable){'\n'}
                • Dapat ditarik menjadi kawat (ductile)
              </Text>
            </View>
          </View>

          {/* Gaya Antar Molekul */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconContainer, { backgroundColor: '#FCE7F3' }]}>
                <MaterialIcons name="compare-arrows" size={24} color="#EC4899" />
              </View>
              <Text style={styles.sectionTitle}>Gaya Antar Molekul</Text>
            </View>

            <View style={styles.conceptCard}>
              <Text style={styles.conceptTitle}>Gaya Van der Waals</Text>
              <Text style={styles.conceptText}>
                • Gaya dispersi London (molekul non-polar){'\n'}
                • Gaya dipol-dipol (molekul polar){'\n'}
                • Gaya paling lemah di antara semua ikatan
              </Text>
            </View>

            <View style={styles.conceptCard}>
              <Text style={styles.conceptTitle}>Ikatan Hidrogen</Text>
              <Text style={styles.conceptText}>
                • Gaya tarik antara H dengan atom F, O, atau N{'\n'}
                • Lebih kuat dari Van der Waals{'\n'}
                • Contoh: air (H₂O), DNA
              </Text>
            </View>
          </View>

          {/* Contoh Soal */}
          <View style={styles.exampleCard}>
            <View style={styles.exampleHeader}>
              <View style={styles.exampleIconContainer}>
                <MaterialIcons name="edit" size={24} color="#10B981" />
              </View>
              <Text style={styles.exampleTitle}>Contoh Soal</Text>
            </View>

            <View style={styles.exampleItem}>
              <Text style={styles.exampleQuestion}>
                Soal 1: Tentukan jenis ikatan pada senyawa MgCl₂!
              </Text>
              <View style={styles.exampleSolution}>
                <Text style={styles.exampleSolutionTitle}>Penyelesaian:</Text>
                <Text style={styles.exampleSolutionText}>
                  Mg = logam (golongan IIA){'\n'}
                  Cl = non-logam (golongan VIIA){'\n\n'}
                  Karena terbentuk dari logam + non-logam, maka MgCl₂ memiliki <Text style={styles.boldText}>ikatan ion</Text>.
                </Text>
              </View>
            </View>

            <View style={[styles.exampleItem, { borderBottomWidth: 0, marginBottom: 0, paddingBottom: 0 }]}>
              <Text style={styles.exampleQuestion}>
                Soal 2: Mengapa air (H₂O) memiliki titik didih tinggi dibanding H₂S?
              </Text>
              <View style={styles.exampleSolution}>
                <Text style={styles.exampleSolutionTitle}>Penyelesaian:</Text>
                <Text style={styles.exampleSolutionText}>
                  H₂O memiliki <Text style={styles.boldText}>ikatan hidrogen</Text> yang kuat antara molekul-molekulnya.{'\n\n'}
                  H₂S hanya memiliki gaya Van der Waals yang lebih lemah.{'\n\n'}
                  Ikatan hidrogen membutuhkan energi lebih besar untuk diputus, sehingga titik didih H₂O lebih tinggi.
                </Text>
              </View>
            </View>
          </View>

          {/* Navigation Buttons */}
          <View style={styles.navigationButtons}>
            <TouchableOpacity 
              style={styles.backModuleButton}
              onPress={() => navigation.navigate('ReaksiRedoks')}
            >
              <MaterialIcons name="arrow-back" size={20} color="#6366F1" />
              <Text style={styles.backModuleText}>Reaksi Redoks</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.nextModuleButton}
              onPress={() => navigation.navigate('Termokimia')}
            >
              <Text style={styles.nextModuleText}>Termokimia</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4FF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1E1F35',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  progressCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  progressCircleText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#6366F1',
  },
  heroCard: {
    backgroundColor: '#6366F1',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
  },
  heroBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  heroBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  heroDescription: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
    marginBottom: 16,
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroStatText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    marginLeft: 6,
  },
  heroStatDivider: {
    color: '#FFFFFF',
    marginHorizontal: 12,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1E1F35',
  },
  stepItem: {
    flexDirection: 'row',
    paddingBottom: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#6366F1',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#1E1F35',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6B7280',
    lineHeight: 22,
  },
  italicText: {
    fontStyle: 'italic',
    color: '#6366F1',
  },
  boldText: {
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  twoColumnContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  formulaCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
  },
  formulaIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  formulaTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1E1F35',
  },
  formulaSubtitle: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#9CA3AF',
    letterSpacing: 1,
    marginBottom: 12,
  },
  jenisCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
  },
  jenisIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  jenisTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1E1F35',
  },
  jenisSubtitle: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#9CA3AF',
    letterSpacing: 1,
    marginBottom: 12,
  },
  jenisList: {
    gap: 4,
  },
  jenisItem: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#1E1F35',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#1E1F35',
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  contentText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 16,
  },
  conceptCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#6366F1',
  },
  conceptTitle: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#1E1F35',
    marginBottom: 8,
  },
  conceptText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6B7280',
    lineHeight: 22,
  },
  exampleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  exampleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  exampleIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  exampleTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1E1F35',
  },
  exampleItem: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  exampleQuestion: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#1E1F35',
    marginBottom: 12,
    lineHeight: 22,
  },
  exampleSolution: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  exampleSolutionTitle: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#059669',
    marginBottom: 8,
  },
  exampleSolutionText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#065F46',
    lineHeight: 22,
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 20,
  },
  backModuleButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: '#6366F1',
  },
  backModuleText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#6366F1',
  },
  nextModuleButton: {
    flex: 1,
    backgroundColor: '#6366F1',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  nextModuleText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#FFFFFF',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    top: -12,
    width: 20,
    height: 3,
    backgroundColor: '#6366F1',
    borderRadius: 2,
  },
  navLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#9CA3AF',
    marginTop: 4,
  },
  navLabelActive: {
    color: '#6366F1',
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
});
