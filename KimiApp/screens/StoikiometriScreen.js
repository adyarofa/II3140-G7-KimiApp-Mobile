import React, { useState, useEffect } from 'react';
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
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function StoikiometriScreen({ navigation }) {
  const [scrollProgress, setScrollProgress] = useState(0);

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
        if (docSnap.exists() && docSnap.data().stoikiometriProgress) {
          setScrollProgress(docSnap.data().stoikiometriProgress);
          return;
        }
        setScrollProgress(0);
        return;
      }
      const saved = await AsyncStorage.getItem('stoikiometriProgress');
      if (saved) setScrollProgress(parseInt(saved));
    } catch (error) {
      console.error('Error loading progress:', error);
      setScrollProgress(0);
    }
  };

  const saveProgress = async (progress) => {
    try {
      await AsyncStorage.setItem('stoikiometriProgress', progress.toString());
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'userProgress', user.uid);
        await setDoc(docRef, { stoikiometriProgress: progress }, { merge: true });
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const progress = Math.round(
      (contentOffset.y / (contentSize.height - layoutMeasurement.height)) * 100
    );
    const clampedProgress = Math.min(100, Math.max(0, progress));
    
    if (clampedProgress > scrollProgress) {
      setScrollProgress(clampedProgress);
      saveProgress(clampedProgress);
    }
  };

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ flexGrow: 1 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <MaterialIcons name="arrow-back" size={24} color="#1F2937" />
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Stoikiometri</Text>
              <Text style={styles.headerSubtitle}>Modul Pembelajaran Kimia</Text>
            </View>
            <View style={styles.progressCircle}>
              <Text style={styles.progressCircleText}>{scrollProgress}%</Text>
            </View>
          </View>

          {/* Hero Card */}
          <View style={styles.heroCard}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Kimia Dasar</Text>
            </View>
            <Text style={styles.heroTitle}>Konsep Mol</Text>
            <Text style={styles.heroDescription}>
              Pelajari hubungan antara jumlah zat, massa, volume, dan jumlah partikel dalam perhitungan kimia.
            </Text>
            <View style={styles.heroMeta}>
              <View style={styles.metaItem}>
                <MaterialIcons name="schedule" size={16} color="#FFFFFF" />
                <Text style={styles.metaText}>25 Menit</Text>
              </View>
              <View style={styles.metaDot} />
              <Text style={styles.metaText}>6 Topik</Text>
            </View>
          </View>

          {/* Konsep Utama */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: '#EEF2FF' }]}>
                <MaterialIcons name="menu-book" size={24} color="#6366F1" />
              </View>
              <Text style={styles.sectionTitle}>Konsep Utama</Text>
            </View>

            {/* 1. Persamaan Reaksi */}
            <View style={styles.conceptItem}>
              <View style={styles.conceptNumber}>
                <Text style={styles.conceptNumberText}>1</Text>
              </View>
              <View style={styles.conceptContent}>
                <Text style={styles.conceptTitle}>Persamaan Reaksi</Text>
                <Text style={styles.conceptDescription}>
                  Menulis dan menyetarakan reaksi kimia dengan <Text style={styles.italic}>koefisien</Text> yang tepat.
                </Text>
              </View>
            </View>

            {/* 2. Pereaksi Pembatas */}
            <View style={styles.conceptItem}>
              <View style={styles.conceptNumber}>
                <Text style={styles.conceptNumberText}>2</Text>
              </View>
              <View style={styles.conceptContent}>
                <Text style={styles.conceptTitle}>Pereaksi Pembatas</Text>
                <Text style={styles.conceptDescription}>
                  Reaktan yang habis lebih dulu dan membatasi jumlah produk yang terbentuk.
                </Text>
              </View>
            </View>

            {/* 3. Massa Atom */}
            <View style={[styles.conceptItem, { borderBottomWidth: 0, paddingBottom: 0, marginBottom: 0 }]}>
              <View style={styles.conceptNumber}>
                <Text style={styles.conceptNumberText}>3</Text>
              </View>
              <View style={styles.conceptContent}>
                <Text style={styles.conceptTitle}>Massa Atom (Ar & Mr)</Text>
                <Text style={styles.conceptDescription}>
                  Jumlah massa relatif atom-atom penyusun suatu unsur atau senyawa kimia.
                </Text>
              </View>
            </View>
          </View>

          {/* Info Cards Row */}
          <View style={styles.cardRow}>
            {/* Volume Gas */}
            <View style={styles.infoCard}>
              <View style={[styles.infoIcon, { backgroundColor: '#FEF3C7' }]}>
                <MaterialIcons name="cloud" size={22} color="#F59E0B" />
              </View>
              <Text style={styles.infoTitle}>Volume Gas</Text>
              <Text style={styles.infoLabel}>KEADAAN</Text>
              <View style={styles.bulletList}>
                <View style={styles.bulletItem}>
                  <View style={[styles.bullet, { backgroundColor: '#F59E0B' }]} />
                  <Text style={styles.bulletText}>STP (0°C, 1 atm)</Text>
                </View>
                <View style={styles.bulletItem}>
                  <View style={[styles.bullet, { backgroundColor: '#F59E0B' }]} />
                  <Text style={styles.bulletText}>RTP (25°C, 1 atm)</Text>
                </View>
              </View>
            </View>

            {/* Rumus Kimia */}
            <View style={styles.infoCard}>
              <View style={[styles.infoIcon, { backgroundColor: '#F3E8FF' }]}>
                <MaterialIcons name="science" size={22} color="#8B5CF6" />
              </View>
              <Text style={styles.infoTitle}>Rumus Kimia</Text>
              <Text style={styles.infoLabel}>JENIS</Text>
              <View style={styles.bulletList}>
                <View style={styles.bulletItem}>
                  <View style={[styles.bullet, { backgroundColor: '#8B5CF6' }]} />
                  <Text style={styles.bulletText}>Rumus Empiris</Text>
                </View>
                <View style={styles.bulletItem}>
                  <View style={[styles.bullet, { backgroundColor: '#8B5CF6' }]} />
                  <Text style={styles.bulletText}>Rumus Molekul</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Tips Card */}
          <View style={styles.tipsCard}>
            <View style={styles.tipsHeader}>
              <View style={[styles.tipsIcon, { backgroundColor: '#DCFCE7' }]}>
                <MaterialIcons name="lightbulb" size={20} color="#10B981" />
              </View>
              <Text style={styles.tipsTitle}>Tips Menentukan</Text>
            </View>
            <Text style={styles.tipsText}>
              Gunakan "Jembatan Mol": Ubah semua besaran (massa, volume, jumlah partikel) menjadi Mol terlebih dahulu.
            </Text>
          </View>

          {/* Konsep Mol */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: '#DCFCE7' }]}>
                <MaterialIcons name="bubble-chart" size={24} color="#10B981" />
              </View>
              <Text style={styles.sectionTitle}>Konsep Mol</Text>
            </View>

            <Text style={styles.paragraph}>
              Mol adalah satuan jumlah zat dalam SI. Satu mol mengandung 6,022 × 10²³ partikel (Bilangan Avogadro).
            </Text>

            <View style={styles.formulaBox}>
              <Text style={styles.formulaLabel}>Bilangan Avogadro:</Text>
              <Text style={styles.formulaText}>Nₐ = 6,022 × 10²³ partikel/mol</Text>
            </View>

            <View style={styles.relationBox}>
              <Text style={styles.relationTitle}>Hubungan Mol dengan:</Text>
              <View style={styles.relationItem}>
                <Text style={styles.relationLabel}>Massa:</Text>
                <Text style={styles.relationFormula}>n = massa / Mr</Text>
              </View>
              <View style={styles.relationItem}>
                <Text style={styles.relationLabel}>Partikel:</Text>
                <Text style={styles.relationFormula}>n = N / Nₐ</Text>
              </View>
              <View style={styles.relationItem}>
                <Text style={styles.relationLabel}>Volume Gas (STP):</Text>
                <Text style={styles.relationFormula}>n = V / 22,4 L</Text>
              </View>
            </View>
          </View>

          {/* Persamaan Reaksi */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: '#FEE2E2' }]}>
                <MaterialIcons name="balance" size={24} color="#EF4444" />
              </View>
              <Text style={styles.sectionTitle}>Menyetarakan Reaksi</Text>
            </View>

            <Text style={styles.paragraph}>
              Persamaan reaksi harus setara: jumlah atom di reaktan = jumlah atom di produk.
            </Text>

            <View style={styles.exampleBox}>
              <Text style={styles.exampleLabel}>Contoh:</Text>
              <Text style={styles.exampleFormula}>CH₄ + 2O₂ → CO₂ + 2H₂O</Text>
            </View>

            <View style={styles.stepList}>
              <Text style={styles.stepTitle}>Langkah Menyetarakan:</Text>
              <Text style={styles.stepItem}>1. Tulis kerangka reaksi</Text>
              <Text style={styles.stepItem}>2. Hitung jumlah atom tiap unsur</Text>
              <Text style={styles.stepItem}>3. Tambahkan koefisien yang sesuai</Text>
              <Text style={styles.stepItem}>4. Periksa ulang kesetaraan</Text>
            </View>
          </View>

          {/* Pereaksi Pembatas */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: '#FEF3C7' }]}>
                <MaterialIcons name="block" size={24} color="#F59E0B" />
              </View>
              <Text style={styles.sectionTitle}>Pereaksi Pembatas</Text>
            </View>

            <Text style={styles.paragraph}>
              Pereaksi pembatas adalah reaktan yang habis lebih dulu dan menentukan jumlah produk maksimum yang terbentuk.
            </Text>

            <View style={styles.stepList}>
              <Text style={styles.stepTitle}>Cara Menentukan:</Text>
              <Text style={styles.stepItem}>1. Hitung mol masing-masing reaktan</Text>
              <Text style={styles.stepItem}>2. Bandingkan dengan perbandingan koefisien</Text>
              <Text style={styles.stepItem}>3. Reaktan dengan mol relatif terkecil = pembatas</Text>
            </View>

            <View style={styles.noteBox}>
              <MaterialIcons name="info" size={18} color="#F59E0B" />
              <Text style={styles.noteTextOrange}>
                Perhitungan produk selalu berdasarkan pereaksi pembatas!
              </Text>
            </View>
          </View>

          {/* Rumus Empiris & Molekul */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: '#F3E8FF' }]}>
                <MaterialIcons name="functions" size={24} color="#8B5CF6" />
              </View>
              <Text style={styles.sectionTitle}>Rumus Empiris & Molekul</Text>
            </View>

            <View style={styles.comparisonRow}>
              <View style={styles.comparisonItem}>
                <Text style={styles.comparisonTitle}>Rumus Empiris</Text>
                <Text style={styles.comparisonDesc}>
                  Perbandingan atom paling sederhana
                </Text>
                <View style={styles.comparisonExample}>
                  <Text style={styles.comparisonFormula}>CH₂O</Text>
                </View>
              </View>
              <View style={styles.comparisonItem}>
                <Text style={styles.comparisonTitle}>Rumus Molekul</Text>
                <Text style={styles.comparisonDesc}>
                  Jumlah atom sebenarnya dalam molekul
                </Text>
                <View style={styles.comparisonExample}>
                  <Text style={styles.comparisonFormula}>C₆H₁₂O₆</Text>
                </View>
              </View>
            </View>

            <View style={styles.formulaBox}>
              <Text style={styles.formulaLabel}>Hubungan:</Text>
              <Text style={styles.formulaText}>Rumus Molekul = n × Rumus Empiris</Text>
            </View>
          </View>

          {/* Contoh Soal */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: '#EEF2FF' }]}>
                <MaterialIcons name="edit" size={24} color="#6366F1" />
              </View>
              <Text style={styles.sectionTitle}>Contoh Soal</Text>
            </View>

            {/* Soal 1 */}
            <View style={styles.exampleItem}>
              <View style={styles.exampleHeader}>
                <View style={styles.exampleBadge}>
                  <Text style={styles.exampleBadgeText}>Soal 1</Text>
                </View>
              </View>
              <Text style={styles.exampleQuestion}>
                Berapa mol dan jumlah molekul dalam 36 gram air (H₂O)? (Ar H = 1, O = 16)
              </Text>
              <View style={styles.solutionBox}>
                <Text style={styles.solutionTitle}>Penyelesaian:</Text>
                <Text style={styles.solutionText}>
                  Mr H₂O = 2(1) + 16 = 18 g/mol{'\n'}
                  n = massa / Mr = 36 / 18 = 2 mol{'\n'}
                  N = n × Nₐ = 2 × 6,022 × 10²³{'\n'}
                  N = 1,2044 × 10²⁴ molekul
                </Text>
              </View>
            </View>

            {/* Soal 2 */}
            <View style={[styles.exampleItem, { borderBottomWidth: 0, paddingBottom: 0, marginBottom: 0 }]}>
              <View style={styles.exampleHeader}>
                <View style={styles.exampleBadge}>
                  <Text style={styles.exampleBadgeText}>Soal 2</Text>
                </View>
              </View>
              <Text style={styles.exampleQuestion}>
                4 gram H₂ bereaksi dengan 48 gram O₂ membentuk H₂O. Tentukan pereaksi pembatas! (Ar H = 1, O = 16)
              </Text>
              <View style={styles.solutionBox}>
                <Text style={styles.solutionTitle}>Penyelesaian:</Text>
                <Text style={styles.solutionText}>
                  2H₂ + O₂ → 2H₂O{'\n'}
                  mol H₂ = 4/2 = 2 mol{'\n'}
                  mol O₂ = 48/32 = 1,5 mol{'\n\n'}
                  Perbandingan: H₂ : O₂ = 2 : 1{'\n'}
                  Dibutuhkan: 2 mol H₂ butuh 1 mol O₂{'\n'}
                  Tersedia O₂ = 1,5 mol (berlebih){'\n\n'}
                  Pereaksi pembatas = H₂
                </Text>
              </View>
            </View>
          </View>

          {/* Navigation Buttons */}
          <View style={styles.navigationButtons}>
            <TouchableOpacity 
              style={styles.backModuleButton}
              onPress={() => navigation.navigate('Termokimia')}
            >
              <MaterialIcons name="arrow-back" size={20} color="#6366F1" />
              <Text style={styles.backModuleText}>Termokimia</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.nextModuleButton}
              onPress={() => navigation.navigate('Teori')}
            >
              <Text style={styles.nextModuleText}>Semua Modul</Text>
              <MaterialIcons name="view-module" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Selesai Card */}
          <View style={styles.completeCard}>
            <MaterialIcons name="celebration" size={40} color="#6366F1" />
            <Text style={styles.completeTitle}>Selamat!</Text>
            <Text style={styles.completeText}>
              Kamu telah menyelesaikan semua modul teori kimia. Terus berlatih dengan kuis untuk memperdalam pemahamanmu!
            </Text>
          </View>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
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
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1F2937',
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
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#6366F1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressCircleText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#6366F1',
  },
  heroCard: {
    backgroundColor: '#6366F1',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
  },
  badge: {
    backgroundColor: '#818CF8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#FFFFFF',
  },
  heroTitle: {
    fontSize: 24,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  heroDescription: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 22,
    marginBottom: 16,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 10,
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
  sectionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1F2937',
  },
  conceptItem: {
    flexDirection: 'row',
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  conceptNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  conceptNumberText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#6366F1',
  },
  conceptContent: {
    flex: 1,
  },
  conceptTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  conceptDescription: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  italic: {
    fontStyle: 'italic',
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#6B7280',
    marginBottom: 12,
  },
  bulletList: {
    gap: 8,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  bulletText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#4B5563',
  },
  tipsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipsIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  tipsTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1F2937',
  },
  tipsText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#4B5563',
    lineHeight: 22,
  },
  paragraph: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 16,
  },
  formulaBox: {
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  formulaLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#6366F1',
    marginBottom: 4,
  },
  formulaText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#4338CA',
    textAlign: 'center',
  },
  relationBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  relationTitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  relationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  relationLabel: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6B7280',
  },
  relationFormula: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#6366F1',
  },
  exampleBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  exampleLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#EF4444',
    marginBottom: 4,
  },
  exampleFormula: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#1F2937',
    textAlign: 'center',
  },
  stepList: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  stepTitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  stepItem: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#4B5563',
    lineHeight: 24,
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    padding: 12,
    marginTop: 16,
    gap: 8,
  },
  noteTextOrange: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#92400E',
  },
  comparisonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  comparisonItem: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
  },
  comparisonTitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  comparisonDesc: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  comparisonExample: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  comparisonFormula: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#8B5CF6',
  },
  exampleItem: {
    paddingBottom: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  exampleHeader: {
    marginBottom: 12,
  },
  exampleBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  exampleBadgeText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#6366F1',
  },
  exampleQuestion: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#1F2937',
    lineHeight: 22,
    marginBottom: 12,
  },
  solutionBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  solutionTitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#10B981',
    marginBottom: 8,
  },
  solutionText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#1F2937',
    lineHeight: 24,
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
  completeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginTop: 8,
  },
  completeTitle: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 8,
  },
  completeText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
});
