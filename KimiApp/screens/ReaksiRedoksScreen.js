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

export default function ReaksiRedoksScreen({ navigation }) {
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
          if (data.reaksiRedoksProgress !== undefined) {
            setProgress(data.reaksiRedoksProgress);
            await AsyncStorage.setItem('reaksiRedoksProgress', data.reaksiRedoksProgress.toString());
            return;
          }
        }
        // User exists but no progress data yet - start from 0
        setProgress(0);
        await AsyncStorage.setItem('reaksiRedoksProgress', '0');
        return;
      }
      
      // No user logged in - fallback to AsyncStorage
      const savedProgress = await AsyncStorage.getItem('reaksiRedoksProgress');
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
        await AsyncStorage.setItem('reaksiRedoksProgress', newProgress.toString());
        
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, 'userProgress', user.uid);
          await setDoc(docRef, {
            reaksiRedoksProgress: newProgress,
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
              <Text style={styles.headerTitle}>Reaksi Redoks</Text>
              <Text style={styles.headerSubtitle}>Modul Pembelajaran Kimia</Text>
            </View>
            <View style={styles.progressCircle}>
              <Text style={styles.progressCircleText}>{progress}%</Text>
            </View>
          </View>

          {/* Hero Card */}
          <View style={styles.heroCard}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>Kimia Fisik</Text>
            </View>
            <Text style={styles.heroTitle}>Konsep Oksidasi & Reduksi</Text>
            <Text style={styles.heroDescription}>
              Pelajari perpindahan elektron, perubahan bilangan oksidasi (biloks), dan penyetaraan reaksi.
            </Text>
            <View style={styles.heroStats}>
              <View style={styles.heroStatItem}>
                <MaterialIcons name="schedule" size={16} color="#FFFFFF" />
                <Text style={styles.heroStatText}>20 Menit</Text>
              </View>
              <Text style={styles.heroStatDivider}>•</Text>
              <Text style={styles.heroStatText}>5 Topik</Text>
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
                <Text style={styles.stepTitle}>Oksidasi</Text>
                <Text style={styles.stepDescription}>
                  Pelepasan elektron atau <Text style={styles.italicText}>kenaikan</Text> bilangan oksidasi.
                </Text>
              </View>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Reduksi</Text>
                <Text style={styles.stepDescription}>
                  Penerimaan elektron atau <Text style={styles.italicText}>penurunan</Text> bilangan oksidasi.
                </Text>
              </View>
            </View>

            <View style={[styles.stepItem, { borderBottomWidth: 0, paddingBottom: 0, marginBottom: 0 }]}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Reduktor & Oksidator</Text>
                <Text style={styles.stepDescription}>
                  Zat yang mengalami oksidasi (Reduktor) dan zat yang mengalami reduksi (Oksidator).
                </Text>
              </View>
            </View>
          </View>

          {/* Penyetaraan dan Aplikasi */}
          <View style={styles.twoColumnContainer}>
            <View style={styles.formulaCard}>
              <View style={styles.formulaIconContainer}>
                <MaterialIcons name="functions" size={24} color="#6366F1" />
              </View>
              <Text style={styles.formulaTitle}>Penyetaraan</Text>
              <Text style={styles.formulaSubtitle}>METODE</Text>
              <View style={styles.jenisList}>
                <Text style={styles.jenisItem}>• Metode PBO</Text>
                <Text style={styles.jenisItem}>• Setengah Reaksi</Text>
              </View>
            </View>

            <View style={styles.jenisCard}>
              <View style={styles.jenisIconContainer}>
                <MaterialIcons name="lightbulb" size={24} color="#F59E0B" />
              </View>
              <Text style={styles.jenisTitle}>Aplikasi</Text>
              <Text style={styles.jenisSubtitle}>KEHIDUPAN</Text>
              <View style={styles.jenisList}>
                <Text style={styles.jenisItem}>• Sel Volta</Text>
                <Text style={styles.jenisItem}>• Korosi Logam</Text>
              </View>
            </View>
          </View>

          {/* Tips Menghafal */}
          <View style={styles.infoCard}>
            <View style={styles.infoIconContainer}>
              <MaterialIcons name="tips-and-updates" size={20} color="#6366F1" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Tips Menghafal</Text>
              <Text style={styles.infoDescription}>
                Ingat "KRAO": Katoda terjadi Reduksi, Anoda terjadi Oksidasi pada sel elektrokimia.
              </Text>
            </View>
          </View>

          {/* Bilangan Oksidasi */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconContainer, { backgroundColor: '#FEF3C7' }]}>
                <MaterialIcons name="tag" size={24} color="#F59E0B" />
              </View>
              <Text style={styles.sectionTitle}>Bilangan Oksidasi</Text>
            </View>

            <Text style={styles.contentText}>
              Bilangan oksidasi adalah muatan yang dimiliki atom jika elektron ikatan diberikan kepada atom yang lebih elektronegatif.
            </Text>

            <View style={styles.conceptCard}>
              <Text style={styles.conceptTitle}>Aturan Bilangan Oksidasi</Text>
              <Text style={styles.conceptText}>
                • Unsur bebas: biloks = 0{'\n'}
                • Ion monoatom: biloks = muatan ion{'\n'}
                • H dalam senyawa: +1 (kecuali hidrida: -1){'\n'}
                • O dalam senyawa: -2 (kecuali peroksida: -1)
              </Text>
            </View>
          </View>

          {/* Sel Elektrokimia */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconContainer, { backgroundColor: '#DBEAFE' }]}>
                <MaterialIcons name="battery-charging-full" size={24} color="#3B82F6" />
              </View>
              <Text style={styles.sectionTitle}>Sel Elektrokimia</Text>
            </View>

            <View style={styles.conceptCard}>
              <Text style={styles.conceptTitle}>Sel Volta (Galvani)</Text>
              <Text style={styles.conceptText}>
                • Mengubah energi kimia → listrik{'\n'}
                • Reaksi berlangsung spontan{'\n'}
                • Anoda (-): terjadi oksidasi{'\n'}
                • Katoda (+): terjadi reduksi
              </Text>
            </View>

            <View style={styles.conceptCard}>
              <Text style={styles.conceptTitle}>Sel Elektrolisis</Text>
              <Text style={styles.conceptText}>
                • Mengubah energi listrik → kimia{'\n'}
                • Reaksi tidak spontan{'\n'}
                • Anoda (+): terjadi oksidasi{'\n'}
                • Katoda (-): terjadi reduksi
              </Text>
            </View>
          </View>

          {/* Potensial Sel */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconContainer, { backgroundColor: '#D1FAE5' }]}>
                <MaterialIcons name="bolt" size={24} color="#10B981" />
              </View>
              <Text style={styles.sectionTitle}>Potensial Sel</Text>
            </View>

            <View style={styles.formulaCardLarge}>
              <Text style={styles.formulaLargeTitle}>Rumus Potensial Sel</Text>
              <View style={styles.formulaBoxLarge}>
                <Text style={styles.formulaTextLarge}>E°sel = E°katoda - E°anoda</Text>
              </View>
              <Text style={styles.formulaExplanation}>
                E°sel = potensial sel standar (Volt){'\n'}
                E°katoda = potensial reduksi katoda{'\n'}
                E°anoda = potensial reduksi anoda
              </Text>
            </View>

            <View style={styles.tipCard}>
              <MaterialIcons name="info" size={20} color="#3B82F6" />
              <Text style={styles.tipText}>
                Jika E°sel {'>'} 0, reaksi berlangsung spontan (sel volta). Jika E°sel {'<'} 0, reaksi tidak spontan (perlu elektrolisis).
              </Text>
            </View>
          </View>

          {/* Tabel Potensial Reduksi */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconContainer, { backgroundColor: '#FCE7F3' }]}>
                <MaterialIcons name="table-chart" size={24} color="#EC4899" />
              </View>
              <Text style={styles.sectionTitle}>Potensial Reduksi Standar</Text>
            </View>

            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, { flex: 2.5 }]}>Setengah Reaksi</Text>
                <Text style={[styles.tableHeaderText, { flex: 1 }]}>E° (V)</Text>
              </View>
              
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2.5 }]}>F₂ + 2e⁻ → 2F⁻</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>+2.87</Text>
              </View>
              
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2.5 }]}>Ag⁺ + e⁻ → Ag</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>+0.80</Text>
              </View>
              
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2.5 }]}>Cu²⁺ + 2e⁻ → Cu</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>+0.34</Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2.5 }]}>2H⁺ + 2e⁻ → H₂</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>0.00</Text>
              </View>
              
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2.5 }]}>Zn²⁺ + 2e⁻ → Zn</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>-0.76</Text>
              </View>
              
              <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
                <Text style={[styles.tableCell, { flex: 2.5 }]}>Li⁺ + e⁻ → Li</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>-3.04</Text>
              </View>
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
                Soal 1: Tentukan bilangan oksidasi S dalam H₂SO₄!
              </Text>
              <View style={styles.exampleSolution}>
                <Text style={styles.exampleSolutionTitle}>Penyelesaian:</Text>
                <Text style={styles.exampleSolutionText}>
                  Diketahui: H = +1, O = -2{'\n\n'}
                  Jumlah biloks = 0{'\n'}
                  2(+1) + x + 4(-2) = 0{'\n'}
                  2 + x - 8 = 0{'\n'}
                  x = +6{'\n\n'}
                  Jadi, biloks S dalam H₂SO₄ = +6
                </Text>
              </View>
            </View>

            <View style={[styles.exampleItem, { borderBottomWidth: 0, marginBottom: 0, paddingBottom: 0 }]}>
              <Text style={styles.exampleQuestion}>
                Soal 2: Hitung E°sel untuk reaksi: Zn + Cu²⁺ → Zn²⁺ + Cu
              </Text>
              <View style={styles.exampleSolution}>
                <Text style={styles.exampleSolutionTitle}>Penyelesaian:</Text>
                <Text style={styles.exampleSolutionText}>
                  Katoda (reduksi): Cu²⁺ + 2e⁻ → Cu, E° = +0.34 V{'\n'}
                  Anoda (oksidasi): Zn → Zn²⁺ + 2e⁻, E° = -0.76 V{'\n\n'}
                  E°sel = E°katoda - E°anoda{'\n'}
                  E°sel = (+0.34) - (-0.76){'\n'}
                  E°sel = +1.10 V{'\n\n'}
                  Karena E°sel {'>'} 0, reaksi spontan.
                </Text>
              </View>
            </View>
          </View>

          {/* Korosi */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconContainer, { backgroundColor: '#FEE2E2' }]}>
                <MaterialIcons name="warning" size={24} color="#EF4444" />
              </View>
              <Text style={styles.sectionTitle}>Korosi</Text>
            </View>

            <Text style={styles.contentText}>
              Korosi adalah proses pengkaratan logam akibat reaksi redoks dengan lingkungan.
            </Text>

            <View style={styles.conceptCard}>
              <Text style={styles.conceptTitle}>Cara Mencegah Korosi</Text>
              <Text style={styles.conceptText}>
                • Pengecatan/pelapisan{'\n'}
                • Galvanisasi (melapisi dengan Zn){'\n'}
                • Proteksi katodik{'\n'}
                • Membuat paduan/alloy
              </Text>
            </View>
          </View>

          {/* Navigation Buttons */}
          <View style={styles.navigationButtons}>
            <TouchableOpacity 
              style={styles.backModuleButton}
              onPress={() => navigation.navigate('Titrasi')}
            >
              <MaterialIcons name="arrow-back" size={20} color="#6366F1" />
              <Text style={styles.backModuleText}>Titrasi</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.nextModuleButton}
              onPress={() => navigation.navigate('IkatanKimia')}
            >
              <Text style={styles.nextModuleText}>Ikatan Kimia</Text>
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
    backgroundColor: '#FEF3C7',
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
  formulaCardLarge: {
    backgroundColor: '#F3F4FF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  formulaLargeTitle: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#1E1F35',
    marginBottom: 12,
  },
  formulaBoxLarge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  formulaTextLarge: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#6366F1',
    marginVertical: 4,
  },
  formulaExplanation: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 14,
    alignItems: 'flex-start',
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#1E40AF',
    lineHeight: 20,
    marginLeft: 10,
  },
  tableContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#6366F1',
    padding: 12,
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#FFFFFF',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tableCell: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#4B5563',
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
