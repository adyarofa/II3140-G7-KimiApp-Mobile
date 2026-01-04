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

export default function TitrasiScreen({ navigation }) {
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
          if (data.titrasiProgress !== undefined) {
            setProgress(data.titrasiProgress);
            await AsyncStorage.setItem('titrasiProgress', data.titrasiProgress.toString());
            return;
          }
        }
        setProgress(0);
        await AsyncStorage.setItem('titrasiProgress', '0');
        return;
      }
      
      const savedProgress = await AsyncStorage.getItem('titrasiProgress');
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
        await AsyncStorage.setItem('titrasiProgress', newProgress.toString());
        
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, 'userProgress', user.uid);
          await setDoc(docRef, {
            titrasiProgress: newProgress,
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
              <Text style={styles.headerTitle}>Modul Titrasi</Text>
              <Text style={styles.headerSubtitle}>Lanjutkan pembelajaranmu</Text>
            </View>
            {/* Progress Circle */}
            <View style={styles.progressCircle}>
              <Text style={styles.progressCircleText}>{progress}%</Text>
            </View>
          </View>

          {/* Hero Card */}
          <View style={styles.heroCard}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>Kimia Analisis</Text>
            </View>
            <Text style={styles.heroTitle}>Prinsip Dasar Titrasi</Text>
            <Text style={styles.heroDescription}>
              Pelajari metode penentuan konsentrasi larutan dengan prosedur titrasi asam-basa.
            </Text>
            <View style={styles.heroStats}>
              <View style={styles.heroStatItem}>
                <MaterialIcons name="schedule" size={16} color="#FFFFFF" />
                <Text style={styles.heroStatText}>25 Menit</Text>
              </View>
              <Text style={styles.heroStatDivider}>•</Text>
              <Text style={styles.heroStatText}>5 Topik</Text>
            </View>
          </View>

          {/* Prosedur Titrasi */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <MaterialIcons name="science" size={24} color="#6366F1" />
              </View>
              <Text style={styles.sectionTitle}>Prosedur Titrasi</Text>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Persiapan Alat</Text>
                <Text style={styles.stepDescription}>
                  Siapkan buret, statif, klem, dan erlenmeyer. Pastikan semua alat bersih.
                </Text>
              </View>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Pengisian Titran</Text>
                <Text style={styles.stepDescription}>
                  Isi buret dengan larutan standar (titran) sampai tanda batas nol.
                </Text>
              </View>
            </View>

            <View style={[styles.stepItem, { borderBottomWidth: 0, paddingBottom: 0, marginBottom: 0 }]}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Penambahan Indikator</Text>
                <Text style={styles.stepDescription}>
                  Tambahkan 2-3 tetes indikator (misal: fenolftalein) ke dalam titrat.
                </Text>
              </View>
            </View>
          </View>

          {/* Rumus dan Jenis Titrasi */}
          <View style={styles.twoColumnContainer}>
            {/* Rumus */}
            <View style={styles.formulaCard}>
              <View style={styles.formulaIconContainer}>
                <MaterialIcons name="calculate" size={24} color="#6366F1" />
              </View>
              <Text style={styles.formulaTitle}>Rumus</Text>
              <Text style={styles.formulaSubtitle}>PERHITUNGAN</Text>
              <View style={styles.formulaBox}>
                <Text style={styles.formulaText}>M₁V₁ = M₂V₂</Text>
              </View>
              <Text style={styles.formulaNote}>
                M = Molaritas{'\n'}V = Volume
              </Text>
            </View>

            {/* Jenis Titrasi */}
            <View style={styles.jenisCard}>
              <View style={styles.jenisIconContainer}>
                <MaterialIcons name="category" size={24} color="#10B981" />
              </View>
              <Text style={styles.jenisTitle}>Jenis Titrasi</Text>
              <Text style={styles.jenisSubtitle}>KATEGORI</Text>
              <View style={styles.jenisList}>
                <Text style={styles.jenisItem}>• Asam Basa</Text>
                <Text style={styles.jenisItem}>• Redoks</Text>
                <Text style={styles.jenisItem}>• Kompleksometri</Text>
                <Text style={styles.jenisItem}>• Pengendapan</Text>
              </View>
            </View>
          </View>

          {/* Titik Ekuivalen vs Akhir */}
          <View style={styles.infoCard}>
            <View style={styles.infoIconContainer}>
              <MaterialIcons name="info" size={20} color="#6366F1" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Titik Ekuivalen vs Akhir</Text>
              <Text style={styles.infoDescription}>
                Titik ekuivalen adalah saat mol titran sama dengan mol titrat. Titik akhir adalah saat indikator berubah warna. Idealnya, titik akhir harus sedekat mungkin dengan titik ekuivalen.
              </Text>
            </View>
          </View>

          {/* Kurva Titrasi */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconContainer, { backgroundColor: '#FEF3C7' }]}>
                <MaterialIcons name="show-chart" size={24} color="#F59E0B" />
              </View>
              <Text style={styles.sectionTitle}>Kurva Titrasi</Text>
            </View>

            <Text style={styles.contentText}>
              Kurva titrasi menunjukkan perubahan pH selama titrasi, penting untuk memilih indikator yang tepat.
            </Text>

            <View style={styles.conceptCard}>
              <Text style={styles.conceptTitle}>Asam Kuat - Basa Kuat</Text>
              <Text style={styles.conceptText}>
                •  pH = 7 pada titik ekuivalen{'\n'}
                •  Kurva simetris
              </Text>
            </View>

            <View style={styles.conceptCard}>
              <Text style={styles.conceptTitle}>Asam Lemah - Basa Kuat</Text>
              <Text style={styles.conceptText}>
                •  pH {'>'} 7 pada titik ekuivalen{'\n'}
                •  Ada daerah buffer
              </Text>
            </View>

            <View style={styles.conceptCard}>
              <Text style={styles.conceptTitle}>Basa Lemah - Asam Kuat</Text>
              <Text style={styles.conceptText}>
                •  pH {'<'} 7 pada titik ekuivalen
              </Text>
            </View>
          </View>

          {/* Indikator Titrasi */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconContainer, { backgroundColor: '#FCE7F3' }]}>
                <MaterialIcons name="palette" size={24} color="#EC4899" />
              </View>
              <Text style={styles.sectionTitle}>Indikator Titrasi</Text>
            </View>

            <Text style={styles.contentText}>
              Indikator adalah zat yang berubah warna pada rentang pH tertentu. Pemilihan indikator yang tepat sangat penting untuk akurasi titrasi.
            </Text>

            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, { flex: 2 }]}>Indikator</Text>
                <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Rentang pH</Text>
                <Text style={[styles.tableHeaderText, { flex: 2 }]}>Perubahan Warna</Text>
              </View>
              
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2 }]}>Metil Merah</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>4.4 - 6.2</Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>Merah → Kuning</Text>
              </View>
              
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2 }]}>Bromtimol Biru</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>6.0 - 7.6</Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>Kuning → Biru</Text>
              </View>
              
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2 }]}>Fenolftalein</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>8.2 - 10.0</Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>Tidak berwarna → Pink</Text>
              </View>
              
              <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
                <Text style={[styles.tableCell, { flex: 2 }]}>Timolftalein</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>9.3 - 10.5</Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>Tidak berwarna → Biru</Text>
              </View>
            </View>

            <View style={styles.tipCard}>
              <MaterialIcons name="lightbulb" size={20} color="#F59E0B" />
              <Text style={styles.tipText}>
                Pilih indikator dengan rentang pH yang mencakup pH pada titik ekuivalen. Untuk titrasi asam kuat-basa kuat, fenolftalein atau metil merah cocok digunakan.
              </Text>
            </View>
          </View>

          {/* Perhitungan Titrasi */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconContainer, { backgroundColor: '#DBEAFE' }]}>
                <MaterialIcons name="functions" size={24} color="#3B82F6" />
              </View>
              <Text style={styles.sectionTitle}>Perhitungan Titrasi</Text>
            </View>

            <Text style={styles.contentText}>
              Perhitungan titrasi menggunakan prinsip stoikiometri reaksi. Pada titik ekuivalen, mol reaktan sama dengan mol produk sesuai koefisien reaksi.
            </Text>

            <View style={styles.formulaCardLarge}>
              <Text style={styles.formulaLargeTitle}>Rumus Dasar Titrasi</Text>
              <View style={styles.formulaBoxLarge}>
                <Text style={styles.formulaTextLarge}>n₁ = n₂</Text>
                <Text style={styles.formulaTextLarge}>M₁ × V₁ = M₂ × V₂</Text>
              </View>
              <Text style={styles.formulaExplanation}>
                n = jumlah mol{'\n'}
                M = Molaritas (mol/L){'\n'}
                V = Volume (L atau mL)
              </Text>
            </View>

            <View style={styles.formulaCardLarge}>
              <Text style={styles.formulaLargeTitle}>Untuk Reaksi dengan Koefisien Berbeda</Text>
              <View style={styles.formulaBoxLarge}>
                <Text style={styles.formulaTextLarge}>a × M₁ × V₁ = b × M₂ × V₂</Text>
              </View>
              <Text style={styles.formulaExplanation}>
                a = koefisien zat 1{'\n'}
                b = koefisien zat 2
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
                Soal 1: Sebanyak 25 mL larutan HCl dititrasi dengan larutan NaOH 0,1 M. Jika volume NaOH yang diperlukan sampai titik akhir adalah 20 mL, tentukan konsentrasi HCl!
              </Text>
              <View style={styles.exampleSolution}>
                <Text style={styles.exampleSolutionTitle}>Penyelesaian:</Text>
                <Text style={styles.exampleSolutionText}>
                  Reaksi: HCl + NaOH → NaCl + H₂O{'\n\n'}
                  Diketahui:{'\n'}
                  • V₁ (HCl) = 25 mL{'\n'}
                  • M₂ (NaOH) = 0,1 M{'\n'}
                  • V₂ (NaOH) = 20 mL{'\n\n'}
                  Perhitungan:{'\n'}
                  • M₁ × V₁ = M₂ × V₂{'\n'}
                  • M₁ × 25 = 0,1 × 20{'\n'}
                  • M₁ = 2/25{'\n'}
                  • M₁ = 0,08 M{'\n\n'}
                  Jadi, konsentrasi HCl adalah 0,08 M
                </Text>
              </View>
            </View>

            <View style={[styles.exampleItem, { borderBottomWidth: 0, marginBottom: 0, paddingBottom: 0 }]}>
              <Text style={styles.exampleQuestion}>
                Soal 2: Sebanyak 20 mL larutan H₂SO₄ dititrasi dengan larutan KOH 0,2 M. Volume KOH yang diperlukan adalah 30 mL. Hitung konsentrasi H₂SO₄!
              </Text>
              <View style={styles.exampleSolution}>
                <Text style={styles.exampleSolutionTitle}>Penyelesaian:</Text>
                <Text style={styles.exampleSolutionText}>
                  Reaksi: H₂SO₄ + 2KOH → K₂SO₄ + 2H₂O{'\n\n'}
                  Diketahui:{'\n'}
                  • V₁ (H₂SO₄) = 20 mL{'\n'}
                  • M₂ (KOH) = 0,2 M{'\n'}
                  • V₂ (KOH) = 30 mL{'\n\n'}
                  Perhitungan (perhatikan koefisien):{'\n'}
                  • Mol KOH = 0,2 × 30 = 6 mmol{'\n'}
                  • Mol H₂SO₄ = 6/2 = 3 mmol{'\n'}
                  • M₁ = 3/20 = 0,15 M{'\n\n'}
                  Jadi, konsentrasi H₂SO₄ adalah 0,15 M
                </Text>
              </View>
            </View>
          </View>

          {/* Aplikasi Titrasi */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconContainer, { backgroundColor: '#D1FAE5' }]}>
                <MaterialIcons name="biotech" size={24} color="#10B981" />
              </View>
              <Text style={styles.sectionTitle}>Aplikasi Titrasi</Text>
            </View>

            <Text style={styles.contentText}>
              Titrasi memiliki banyak aplikasi praktis dalam kehidupan sehari-hari dan industri:
            </Text>

            <View style={styles.applicationItem}>
              <View style={styles.applicationIcon}>
                <MaterialIcons name="local-pharmacy" size={20} color="#6366F1" />
              </View>
              <View style={styles.applicationContent}>
                <Text style={styles.applicationTitle}>Industri Farmasi</Text>
                <Text style={styles.applicationDescription}>
                  Menentukan kadar zat aktif dalam obat-obatan untuk memastikan dosis yang tepat dan aman.
                </Text>
              </View>
            </View>

            <View style={styles.applicationItem}>
              <View style={styles.applicationIcon}>
                <MaterialIcons name="restaurant" size={20} color="#F59E0B" />
              </View>
              <View style={styles.applicationContent}>
                <Text style={styles.applicationTitle}>Industri Makanan</Text>
                <Text style={styles.applicationDescription}>
                  Mengukur keasaman dalam produk seperti cuka, jus, dan susu untuk kontrol kualitas.
                </Text>
              </View>
            </View>

            <View style={styles.applicationItem}>
              <View style={styles.applicationIcon}>
                <MaterialIcons name="water" size={20} color="#3B82F6" />
              </View>
              <View style={styles.applicationContent}>
                <Text style={styles.applicationTitle}>Pengolahan Air</Text>
                <Text style={styles.applicationDescription}>
                  Menentukan kesadahan air dan kadar klorin untuk memastikan kualitas air minum.
                </Text>
              </View>
            </View>

            <View style={[styles.applicationItem, { borderBottomWidth: 0, marginBottom: 0, paddingBottom: 0 }]}>
              <View style={styles.applicationIcon}>
                <MaterialIcons name="eco" size={20} color="#10B981" />
              </View>
              <View style={styles.applicationContent}>
                <Text style={styles.applicationTitle}>Lingkungan</Text>
                <Text style={styles.applicationDescription}>
                  Menganalisis kandungan polutan dalam air limbah dan tanah untuk pemantauan lingkungan.
                </Text>
              </View>
            </View>
          </View>

          {/* Navigation Buttons */}
          <View style={styles.navigationButtons}>
            <TouchableOpacity 
              style={styles.backModuleButton}
              onPress={() => navigation.navigate('AsamBasa')}
            >
              <MaterialIcons name="arrow-back" size={20} color="#6366F1" />
              <Text style={styles.backModuleText}>Asam Basa</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.nextModuleButton}
              onPress={() => navigation.navigate('ReaksiRedoks')}
            >
              <Text style={styles.nextModuleText}>Reaksi Redoks</Text>
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
  formulaBox: {
    backgroundColor: '#F3F4FF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  formulaText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#6366F1',
    textAlign: 'center',
  },
  formulaNote: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6B7280',
    lineHeight: 18,
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
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 14,
    alignItems: 'flex-start',
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#92400E',
    lineHeight: 20,
    marginLeft: 10,
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
  applicationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  applicationIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F3F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  applicationContent: {
    flex: 1,
  },
  applicationTitle: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#1E1F35',
    marginBottom: 4,
  },
  applicationDescription: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6B7280',
    lineHeight: 20,
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
