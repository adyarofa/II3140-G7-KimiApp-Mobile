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

export default function TermokimiaScreen({ navigation }) {
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
        if (docSnap.exists() && docSnap.data().termokimiaProgress) {
          setScrollProgress(docSnap.data().termokimiaProgress);
          return;
        }
        setScrollProgress(0);
        return;
      }
      const saved = await AsyncStorage.getItem('termokimiaProgress');
      if (saved) setScrollProgress(parseInt(saved));
    } catch (error) {
      console.error('Error loading progress:', error);
      setScrollProgress(0);
    }
  };

  const saveProgress = async (progress) => {
    try {
      await AsyncStorage.setItem('termokimiaProgress', progress.toString());
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'userProgress', user.uid);
        await setDoc(docRef, { termokimiaProgress: progress }, { merge: true });
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
              <Text style={styles.headerTitle}>Termokimia</Text>
              <Text style={styles.headerSubtitle}>Modul Pembelajaran Kimia</Text>
            </View>
            <View style={styles.progressCircle}>
              <Text style={styles.progressCircleText}>{scrollProgress}%</Text>
            </View>
          </View>

          {/* Hero Card */}
          <View style={styles.heroCard}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Kimia Fisik</Text>
          </View>
          <Text style={styles.heroTitle}>Dasar Termokimia</Text>
          <Text style={styles.heroDescription}>
            Pelajari hubungan energi, perubahan entalpi, serta hukum dasar termodinamika dalam reaksi kimia.
          </Text>
          <View style={styles.heroMeta}>
            <View style={styles.metaItem}>
              <MaterialIcons name="schedule" size={16} color="#FFFFFF" />
              <Text style={styles.metaText}>25 Menit</Text>
            </View>
            <View style={styles.metaDot} />
            <Text style={styles.metaText}>4 Topik</Text>
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

          {/* 1. Entalpi */}
          <View style={styles.conceptItem}>
            <View style={styles.conceptNumber}>
              <Text style={styles.conceptNumberText}>1</Text>
            </View>
            <View style={styles.conceptContent}>
              <Text style={styles.conceptTitle}>Entalpi (ΔH)</Text>
              <Text style={styles.conceptDescription}>
                Energi yang terkandung dalam sistem. <Text style={styles.italic}>Eksoterm</Text> (ΔH {'<'} 0) melepaskan kalor.
              </Text>
            </View>
          </View>

          {/* 2. Hukum Hess */}
          <View style={styles.conceptItem}>
            <View style={styles.conceptNumber}>
              <Text style={styles.conceptNumberText}>2</Text>
            </View>
            <View style={styles.conceptContent}>
              <Text style={styles.conceptTitle}>Hukum Hess</Text>
              <Text style={styles.conceptDescription}>
                Perubahan entalpi reaksi tidak bergantung pada jalannya reaksi, hanya keadaan awal & akhir.
              </Text>
            </View>
          </View>

          {/* 3. Sistem & Lingkungan */}
          <View style={[styles.conceptItem, { borderBottomWidth: 0, paddingBottom: 0, marginBottom: 0 }]}>
            <View style={styles.conceptNumber}>
              <Text style={styles.conceptNumberText}>3</Text>
            </View>
            <View style={styles.conceptContent}>
              <Text style={styles.conceptTitle}>Sistem & Lingkungan</Text>
              <Text style={styles.conceptDescription}>
                Sistem adalah pusat reaksi kimia. Lingkungan adalah segala sesuatu di luar sistem.
              </Text>
            </View>
          </View>
        </View>

        {/* Info Cards Row */}
        <View style={styles.cardRow}>
          {/* Energi Ikatan */}
          <View style={styles.infoCard}>
            <View style={[styles.infoIcon, { backgroundColor: '#EEF2FF' }]}>
              <MaterialIcons name="link" size={22} color="#6366F1" />
            </View>
            <Text style={styles.infoTitle}>Energi Ikatan</Text>
            <Text style={styles.infoLabel}>KONSEP</Text>
            <View style={styles.bulletList}>
              <View style={styles.bulletItem}>
                <View style={[styles.bullet, { backgroundColor: '#6366F1' }]} />
                <Text style={styles.bulletText}>Pemutusan (+)</Text>
              </View>
              <View style={styles.bulletItem}>
                <View style={[styles.bullet, { backgroundColor: '#6366F1' }]} />
                <Text style={styles.bulletText}>Pembentukan (-)</Text>
              </View>
            </View>
          </View>

          {/* Kalor Reaksi */}
          <View style={styles.infoCard}>
            <View style={[styles.infoIcon, { backgroundColor: '#EEF2FF' }]}>
              <MaterialIcons name="thermostat" size={22} color="#6366F1" />
            </View>
            <Text style={styles.infoTitle}>Kalor Reaksi</Text>
            <Text style={styles.infoLabel}>PENGUKURAN</Text>
            <View style={styles.bulletList}>
              <View style={styles.bulletItem}>
                <View style={[styles.bullet, { backgroundColor: '#6366F1' }]} />
                <Text style={styles.bulletText}>Kalorimeter Bom</Text>
              </View>
              <View style={styles.bulletItem}>
                <View style={[styles.bullet, { backgroundColor: '#6366F1' }]} />
                <Text style={styles.bulletText}>Azas Black</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tips Card */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <View style={[styles.tipsIcon, { backgroundColor: '#FEF3C7' }]}>
              <MaterialIcons name="lightbulb" size={20} color="#F59E0B" />
            </View>
            <Text style={styles.tipsTitle}>Tips Menghitung</Text>
          </View>
          <Text style={styles.tipsText}>
            Ingat rumus: ΔH Reaksi = ΣΔH (Produk/Kanan) - ΣΔH (Reaktan/Kiri). Jangan terbalik!
          </Text>
        </View>

        {/* Jenis Entalpi */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: '#FEE2E2' }]}>
              <MaterialIcons name="category" size={24} color="#EF4444" />
            </View>
            <Text style={styles.sectionTitle}>Jenis-Jenis Entalpi</Text>
          </View>

          <View style={styles.enthalpiItem}>
            <Text style={styles.enthalpiTitle}>Entalpi Pembentukan (ΔHf°)</Text>
            <Text style={styles.enthalpiDesc}>
              Perubahan entalpi saat 1 mol senyawa terbentuk dari unsur-unsurnya dalam keadaan standar.
            </Text>
          </View>

          <View style={styles.enthalpiItem}>
            <Text style={styles.enthalpiTitle}>Entalpi Penguraian (ΔHd°)</Text>
            <Text style={styles.enthalpiDesc}>
              Perubahan entalpi saat 1 mol senyawa terurai menjadi unsur-unsurnya.
            </Text>
          </View>

          <View style={styles.enthalpiItem}>
            <Text style={styles.enthalpiTitle}>Entalpi Pembakaran (ΔHc°)</Text>
            <Text style={styles.enthalpiDesc}>
              Perubahan entalpi saat 1 mol zat dibakar sempurna dengan oksigen berlebih.
            </Text>
          </View>

          <View style={[styles.enthalpiItem, { borderBottomWidth: 0, paddingBottom: 0, marginBottom: 0 }]}>
            <Text style={styles.enthalpiTitle}>Entalpi Netralisasi (ΔHn°)</Text>
            <Text style={styles.enthalpiDesc}>
              Perubahan entalpi saat asam dan basa bereaksi membentuk 1 mol air.
            </Text>
          </View>
        </View>

        {/* Diagram Entalpi */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: '#DCFCE7' }]}>
              <MaterialIcons name="show-chart" size={24} color="#10B981" />
            </View>
            <Text style={styles.sectionTitle}>Diagram Tingkat Energi</Text>
          </View>

          <View style={styles.diagramContainer}>
            {/* Eksoterm */}
            <View style={styles.diagramBox}>
              <Text style={styles.diagramTitle}>Eksoterm (ΔH {'<'} 0)</Text>
              <View style={styles.diagramVisual}>
                <View style={styles.energyLevelHigh}>
                  <Text style={styles.energyText}>Reaktan</Text>
                </View>
                <MaterialIcons name="arrow-downward" size={24} color="#EF4444" />
                <Text style={styles.releaseText}>Melepas Kalor</Text>
                <View style={styles.energyLevelLow}>
                  <Text style={styles.energyText}>Produk</Text>
                </View>
              </View>
            </View>

            {/* Endoterm */}
            <View style={styles.diagramBox}>
              <Text style={styles.diagramTitle}>Endoterm (ΔH {'>'} 0)</Text>
              <View style={styles.diagramVisual}>
                <View style={styles.energyLevelLow}>
                  <Text style={styles.energyText}>Reaktan</Text>
                </View>
                <MaterialIcons name="arrow-upward" size={24} color="#3B82F6" />
                <Text style={styles.absorbText}>Menyerap Kalor</Text>
                <View style={styles.energyLevelHigh}>
                  <Text style={styles.energyText}>Produk</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Perhitungan Entalpi */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: '#E0E7FF' }]}>
              <MaterialIcons name="calculate" size={24} color="#6366F1" />
            </View>
            <Text style={styles.sectionTitle}>Cara Menghitung ΔH</Text>
          </View>

          <View style={styles.methodItem}>
            <Text style={styles.methodTitle}>1. Menggunakan Data ΔHf°</Text>
            <View style={styles.formulaBox}>
              <Text style={styles.formulaText}>ΔH = Σ ΔHf° (produk) - Σ ΔHf° (reaktan)</Text>
            </View>
          </View>

          <View style={styles.methodItem}>
            <Text style={styles.methodTitle}>2. Menggunakan Energi Ikatan</Text>
            <View style={styles.formulaBox}>
              <Text style={styles.formulaText}>ΔH = Σ E ikatan putus - Σ E ikatan terbentuk</Text>
            </View>
          </View>

          <View style={[styles.methodItem, { borderBottomWidth: 0, paddingBottom: 0, marginBottom: 0 }]}>
            <Text style={styles.methodTitle}>3. Hukum Hess</Text>
            <Text style={styles.methodDesc}>
              Menjumlahkan reaksi-reaksi antara untuk mendapatkan ΔH total. Jika reaksi dibalik, tanda ΔH juga dibalik.
            </Text>
          </View>
        </View>

        {/* Kalorimetri */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: '#FEF3C7' }]}>
              <MaterialIcons name="science" size={24} color="#F59E0B" />
            </View>
            <Text style={styles.sectionTitle}>Kalorimetri</Text>
          </View>

          <Text style={styles.paragraph}>
            Kalorimetri adalah metode pengukuran kalor reaksi menggunakan alat kalorimeter.
          </Text>

          <View style={styles.formulaBox}>
            <Text style={styles.formulaLabel}>Rumus Kalorimetri:</Text>
            <Text style={styles.formulaText}>q = m × c × ΔT</Text>
          </View>

          <View style={styles.variableList}>
            <Text style={styles.variableItem}>• q = kalor (Joule)</Text>
            <Text style={styles.variableItem}>• m = massa (gram)</Text>
            <Text style={styles.variableItem}>• c = kalor jenis (J/g°C)</Text>
            <Text style={styles.variableItem}>• ΔT = perubahan suhu (°C)</Text>
          </View>

          <View style={styles.noteBox}>
            <MaterialIcons name="info" size={18} color="#6366F1" />
            <Text style={styles.noteText}>
              Kalor jenis air = 4,18 J/g°C atau 1 kal/g°C
            </Text>
          </View>
        </View>

        {/* Contoh Soal */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: '#DCFCE7' }]}>
              <MaterialIcons name="edit" size={24} color="#10B981" />
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
              Diketahui:{'\n'}
              • ΔHf° H₂O(l) = -286 kJ/mol{'\n'}
              • ΔHf° CO₂(g) = -394 kJ/mol{'\n'}
              • ΔHf° C₂H₆(g) = -85 kJ/mol{'\n\n'}
              Hitung ΔH pembakaran etana:{'\n'}
              C₂H₆(g) + 7/2 O₂(g) → 2CO₂(g) + 3H₂O(l)
            </Text>
            <View style={styles.solutionBox}>
              <Text style={styles.solutionTitle}>Penyelesaian:</Text>
              <Text style={styles.solutionText}>
                ΔH = [2(-394) + 3(-286)] - [(-85) + 0]{'\n'}
                ΔH = [-788 - 858] - [-85]{'\n'}
                ΔH = -1646 + 85{'\n'}
                ΔH = -1561 kJ/mol
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
              Sebanyak 100 g air dipanaskan dari 25°C menjadi 75°C. Jika kalor jenis air 4,18 J/g°C, hitung kalor yang diperlukan!
            </Text>
            <View style={styles.solutionBox}>
              <Text style={styles.solutionTitle}>Penyelesaian:</Text>
              <Text style={styles.solutionText}>
                q = m × c × ΔT{'\n'}
                q = 100 g × 4,18 J/g°C × (75-25)°C{'\n'}
                q = 100 × 4,18 × 50{'\n'}
                q = 20.900 J = 20,9 kJ
              </Text>
            </View>
          </View>
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationButtons}>
          <TouchableOpacity 
            style={styles.backModuleButton}
            onPress={() => navigation.navigate('IkatanKimia')}
          >
            <MaterialIcons name="arrow-back" size={20} color="#6366F1" />
            <Text style={styles.backModuleText}>Ikatan Kimia</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.nextModuleButton}
            onPress={() => navigation.navigate('Stoikiometri')}
          >
            <Text style={styles.nextModuleText}>Stoikiometri</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
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
    color: '#6366F1',
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
  enthalpiItem: {
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  enthalpiTitle: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  enthalpiDesc: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  diagramContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  diagramBox: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  diagramTitle: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  diagramVisual: {
    alignItems: 'center',
    gap: 6,
  },
  energyLevelHigh: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  energyLevelLow: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  energyText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#1F2937',
  },
  releaseText: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#EF4444',
  },
  absorbText: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#3B82F6',
  },
  methodItem: {
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  methodTitle: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  methodDesc: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  formulaBox: {
    backgroundColor: '#EEF2FF',
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
  },
  formulaLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#6366F1',
    marginBottom: 4,
  },
  formulaText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#4338CA',
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 12,
  },
  variableList: {
    marginTop: 12,
    gap: 4,
  },
  variableItem: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#4B5563',
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 10,
    padding: 12,
    marginTop: 16,
    gap: 8,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#4338CA',
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
    color: '#000000ff',
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
    color: '#000000ff',
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
});
