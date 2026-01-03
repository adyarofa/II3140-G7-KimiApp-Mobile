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

export default function AsamBasaScreen({ navigation }) {
  const [progress, setProgress] = useState(0);
  const scrollViewRef = useRef(null);

  let [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  // Load saved progress on mount
  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      // Try to load from Firebase first
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'userProgress', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.asamBasaProgress !== undefined) {
            setProgress(data.asamBasaProgress);
            // Cache locally
            await AsyncStorage.setItem('asamBasaProgress', data.asamBasaProgress.toString());
            return;
          }
        }
      }
      
      // Fallback to AsyncStorage
      const savedProgress = await AsyncStorage.getItem('asamBasaProgress');
      if (savedProgress !== null) {
        setProgress(parseInt(savedProgress));
      }
    } catch (error) {
      console.error('Error loading progress:', error);
      // Fallback to AsyncStorage on error
      const savedProgress = await AsyncStorage.getItem('asamBasaProgress');
      if (savedProgress !== null) {
        setProgress(parseInt(savedProgress));
      }
    }
  };

  const saveProgress = async (newProgress) => {
    try {
      // Only save if new progress is higher than current progress
      if (newProgress > progress) {
        setProgress(newProgress);
        
        // Save to AsyncStorage (local cache)
        await AsyncStorage.setItem('asamBasaProgress', newProgress.toString());
        
        // Save to Firebase
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, 'userProgress', user.uid);
          await setDoc(docRef, {
            asamBasaProgress: newProgress,
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
    // Cap at 100%
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
              <Text style={styles.headerTitle}>Modul Asam & Basa</Text>
              <Text style={styles.headerSubtitle}>Lanjutkan progresmu</Text>
            </View>
            {/* Progress Circle */}
            <View style={styles.progressCircle}>
              <Text style={styles.progressCircleText}>{progress}%</Text>
            </View>
          </View>

          {/* Hero Card */}
          <View style={styles.heroCard}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>Kimia Larutan</Text>
            </View>
            <Text style={styles.heroTitle}>Pengertian Asam & Basa</Text>
            <Text style={styles.heroDescription}>
              Pelajari teori Arrhenius, perbedaan sifat asam dan basa, serta penggunaan indikator pH.
            </Text>
            <View style={styles.heroMeta}>
              <MaterialIcons name="access-time" size={16} color="#FFFFFF" />
              <Text style={styles.heroMetaText}>10 Menit</Text>
              <Text style={styles.heroMetaDot}>•</Text>
              <Text style={styles.heroMetaText}>1 Topik</Text>
            </View>
          </View>

          {/* Konsep Inti Card */}
          <View style={styles.conceptCard}>
            <View style={styles.conceptHeader}>
              <View style={styles.conceptIconContainer}>
                <MaterialIcons name="menu-book" size={24} color="#6366F1" />
              </View>
              <Text style={styles.conceptTitle}>Konsep Inti</Text>
            </View>

            {/* Asam (Acid) */}
            <View style={styles.conceptItem}>
              <View style={styles.conceptItemIcon}>
                <Text style={styles.conceptItemIconText}>H+</Text>
              </View>
              <View style={styles.conceptItemContent}>
                <Text style={styles.conceptItemTitle}>Asam (Acid)</Text>
                <Text style={styles.conceptItemDescription}>
                  Zat yang dalam air melepaskan ion <Text style={styles.italicText}>H⁺</Text>. Rasanya masam & korosif.
                </Text>
              </View>
            </View>

            {/* Basa (Base) */}
            <View style={styles.conceptItem}>
              <View style={[styles.conceptItemIcon, styles.conceptItemIconBase]}>
                <Text style={styles.conceptItemIconText}>OH-</Text>
              </View>
              <View style={styles.conceptItemContent}>
                <Text style={styles.conceptItemTitle}>Basa (Base)</Text>
                <Text style={styles.conceptItemDescription}>
                  Zat yang melepaskan ion <Text style={styles.italicText}>OH⁻</Text>. Rasanya pahit & licin.
                </Text>
              </View>
            </View>

            {/* Derajat Keasaman */}
            <View style={styles.conceptItem}>
              <View style={[styles.conceptItemIcon, styles.conceptItemIconPH]}>
                <Text style={styles.conceptItemIconTextSmall}>pH</Text>
              </View>
              <View style={styles.conceptItemContent}>
                <Text style={styles.conceptItemTitle}>Derajat Keasaman</Text>
                <Text style={styles.conceptItemDescription}>
                  Skala 0-14 untuk menentukan tingkat keasaman suatu larutan.
                </Text>
              </View>
            </View>
          </View>

          {/* Sifat Asam & Basa Cards */}
          <View style={styles.propertiesRow}>
            {/* Sifat Asam */}
            <View style={styles.propertyCard}>
              <View style={[styles.propertyIcon, { backgroundColor: '#FEE2E2' }]}>
                <MaterialIcons name="science" size={24} color="#EF4444" />
              </View>
              <Text style={styles.propertyTitle}>Sifat Asam</Text>
              <Text style={styles.propertyPH}>pH {'<'} 7</Text>
              <View style={styles.propertyList}>
                <View style={styles.propertyListItem}>
                  <View style={[styles.propertyDot, { backgroundColor: '#EF4444' }]} />
                  <Text style={styles.propertyListText}>Memerahkan Lakmus</Text>
                </View>
                <View style={styles.propertyListItem}>
                  <View style={[styles.propertyDot, { backgroundColor: '#EF4444' }]} />
                  <Text style={styles.propertyListText}>Bersifat Korosif</Text>
                </View>
              </View>
            </View>

            {/* Sifat Basa */}
            <View style={styles.propertyCard}>
              <View style={[styles.propertyIcon, { backgroundColor: '#DBEAFE' }]}>
                <MaterialIcons name="science" size={24} color="#3B82F6" />
              </View>
              <Text style={styles.propertyTitle}>Sifat Basa</Text>
              <Text style={[styles.propertyPH, { color: '#3B82F6' }]}>pH {'>'} 7</Text>
              <View style={styles.propertyList}>
                <View style={styles.propertyListItem}>
                  <View style={[styles.propertyDot, { backgroundColor: '#3B82F6' }]} />
                  <Text style={styles.propertyListText}>Membirukan Lakmus</Text>
                </View>
                <View style={styles.propertyListItem}>
                  <View style={[styles.propertyDot, { backgroundColor: '#3B82F6' }]} />
                  <Text style={styles.propertyListText}>Terasa Licin</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Keselamatan Lab Card */}
          <View style={styles.safetyCard}>
            <View style={styles.safetyIcon}>
              <MaterialIcons name="warning" size={24} color="#F59E0B" />
            </View>
            <View style={styles.safetyContent}>
              <Text style={styles.safetyTitle}>Keselamatan Lab</Text>
              <Text style={styles.safetyDescription}>
                Hati-hati saat menangani asam/basa kuat. Selalu gunakan sarung tangan dan pelindung mata.
              </Text>
            </View>
          </View>

          {/* Teori Asam Basa Card */}
          <View style={styles.theoryCard}>
            <View style={styles.theoryHeader}>
              <View style={styles.theoryIconContainer}>
                <MaterialIcons name="lightbulb" size={24} color="#F59E0B" />
              </View>
              <Text style={styles.theoryTitle}>Teori Asam-Basa</Text>
            </View>

            {/* Arrhenius */}
            <View style={styles.theoryItem}>
              <Text style={styles.theoryItemTitle}>1. Teori Arrhenius</Text>
              <Text style={styles.theoryItemDescription}>
                • <Text style={styles.boldText}>Asam</Text>: Zat yang menghasilkan ion H⁺ dalam air{'\n'}
                • <Text style={styles.boldText}>Basa</Text>: Zat yang menghasilkan ion OH⁻ dalam air{'\n'}
                • Contoh: HCl → H⁺ + Cl⁻ (asam){'\n'}
                • Contoh: NaOH → Na⁺ + OH⁻ (basa)
              </Text>
            </View>

            {/* Bronsted-Lowry */}
            <View style={styles.theoryItem}>
              <Text style={styles.theoryItemTitle}>2. Teori Brønsted-Lowry</Text>
              <Text style={styles.theoryItemDescription}>
                • <Text style={styles.boldText}>Asam</Text>: Donor proton (H⁺){'\n'}
                • <Text style={styles.boldText}>Basa</Text>: Akseptor proton (H⁺){'\n'}
                • Lebih luas dari Arrhenius{'\n'}
                • Berlaku di pelarut non-air
              </Text>
            </View>

            {/* Lewis */}
            <View style={styles.theoryItem}>
              <Text style={styles.theoryItemTitle}>3. Teori Lewis</Text>
              <Text style={styles.theoryItemDescription}>
                • <Text style={styles.boldText}>Asam</Text>: Akseptor pasangan elektron{'\n'}
                • <Text style={styles.boldText}>Basa</Text>: Donor pasangan elektron{'\n'}
                • Paling luas cakupannya{'\n'}
                • Termasuk reaksi tanpa proton
              </Text>
            </View>
          </View>

          {/* Skala pH Card */}
          <View style={styles.phScaleCard}>
            <View style={styles.phScaleHeader}>
              <View style={styles.phScaleIconContainer}>
                <MaterialIcons name="straighten" size={24} color="#8B5CF6" />
              </View>
              <Text style={styles.phScaleTitle}>Skala pH</Text>
            </View>
            
            {/* pH Scale Visual */}
            <View style={styles.phScaleVisual}>
              <View style={styles.phScaleBar}>
                <View style={[styles.phScaleSegment, { backgroundColor: '#EF4444' }]} />
                <View style={[styles.phScaleSegment, { backgroundColor: '#F97316' }]} />
                <View style={[styles.phScaleSegment, { backgroundColor: '#EAB308' }]} />
                <View style={[styles.phScaleSegment, { backgroundColor: '#84CC16' }]} />
                <View style={[styles.phScaleSegment, { backgroundColor: '#22C55E' }]} />
                <View style={[styles.phScaleSegment, { backgroundColor: '#14B8A6' }]} />
                <View style={[styles.phScaleSegment, { backgroundColor: '#06B6D4' }]} />
                <View style={[styles.phScaleSegment, { backgroundColor: '#3B82F6' }]} />
                <View style={[styles.phScaleSegment, { backgroundColor: '#6366F1' }]} />
                <View style={[styles.phScaleSegment, { backgroundColor: '#8B5CF6' }]} />
              </View>
              <View style={styles.phScaleLabels}>
                <Text style={styles.phScaleLabel}>0</Text>
                <Text style={styles.phScaleLabel}>7</Text>
                <Text style={styles.phScaleLabel}>14</Text>
              </View>
              <View style={styles.phScaleDescriptions}>
                <Text style={styles.phScaleDescLeft}>Asam Kuat</Text>
                <Text style={styles.phScaleDescCenter}>Netral</Text>
                <Text style={styles.phScaleDescRight}>Basa Kuat</Text>
              </View>
            </View>

            {/* pH Examples */}
            <View style={styles.phExamples}>
              <Text style={styles.phExamplesTitle}>Contoh pH Larutan:</Text>
              <View style={styles.phExampleRow}>
                <Text style={styles.phExampleItem}>• Asam lambung: pH 1-2</Text>
                <Text style={styles.phExampleItem}>• Lemon: pH 2-3</Text>
              </View>
              <View style={styles.phExampleRow}>
                <Text style={styles.phExampleItem}>• Air murni: pH 7</Text>
                <Text style={styles.phExampleItem}>• Darah: pH 7.4</Text>
              </View>
              <View style={styles.phExampleRow}>
                <Text style={styles.phExampleItem}>• Sabun: pH 9-10</Text>
                <Text style={styles.phExampleItem}>• Pemutih: pH 12-13</Text>
              </View>
            </View>
          </View>

          {/* Indikator Asam Basa Card */}
          <View style={styles.indicatorCard}>
            <View style={styles.indicatorHeader}>
              <View style={styles.indicatorIconContainer}>
                <MaterialIcons name="colorize" size={24} color="#EC4899" />
              </View>
              <Text style={styles.indicatorTitle}>Indikator Asam-Basa</Text>
            </View>

            <View style={styles.indicatorTable}>
              {/* Header */}
              <View style={styles.indicatorTableHeader}>
                <Text style={styles.indicatorTableHeaderText}>Indikator</Text>
                <Text style={styles.indicatorTableHeaderText}>Asam</Text>
                <Text style={styles.indicatorTableHeaderText}>Basa</Text>
              </View>
              
              {/* Lakmus */}
              <View style={styles.indicatorTableRow}>
                <Text style={styles.indicatorTableCell}>Lakmus</Text>
                <View style={[styles.indicatorColor, { backgroundColor: '#EF4444' }]}>
                  <Text style={styles.indicatorColorText}>Merah</Text>
                </View>
                <View style={[styles.indicatorColor, { backgroundColor: '#3B82F6' }]}>
                  <Text style={styles.indicatorColorText}>Biru</Text>
                </View>
              </View>

              {/* Fenolftalein */}
              <View style={styles.indicatorTableRow}>
                <Text style={styles.indicatorTableCell}>Fenolftalein</Text>
                <View style={[styles.indicatorColor, { backgroundColor: '#E5E7EB' }]}>
                  <Text style={[styles.indicatorColorText, { color: '#6B7280' }]}>Bening</Text>
                </View>
                <View style={[styles.indicatorColor, { backgroundColor: '#EC4899' }]}>
                  <Text style={styles.indicatorColorText}>Pink</Text>
                </View>
              </View>

              {/* Metil Orange */}
              <View style={styles.indicatorTableRow}>
                <Text style={styles.indicatorTableCell}>Metil Orange</Text>
                <View style={[styles.indicatorColor, { backgroundColor: '#EF4444' }]}>
                  <Text style={styles.indicatorColorText}>Merah</Text>
                </View>
                <View style={[styles.indicatorColor, { backgroundColor: '#F59E0B' }]}>
                  <Text style={styles.indicatorColorText}>Kuning</Text>
                </View>
              </View>

              {/* BTB */}
              <View style={styles.indicatorTableRow}>
                <Text style={styles.indicatorTableCell}>BTB</Text>
                <View style={[styles.indicatorColor, { backgroundColor: '#EAB308' }]}>
                  <Text style={styles.indicatorColorText}>Kuning</Text>
                </View>
                <View style={[styles.indicatorColor, { backgroundColor: '#3B82F6' }]}>
                  <Text style={styles.indicatorColorText}>Biru</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Rumus Perhitungan Card */}
          <View style={styles.formulaCard}>
            <View style={styles.formulaHeader}>
              <View style={styles.formulaIconContainer}>
                <MaterialIcons name="calculate" size={24} color="#06B6D4" />
              </View>
              <Text style={styles.formulaTitle}>Rumus Perhitungan pH</Text>
            </View>

            <View style={styles.formulaItem}>
              <Text style={styles.formulaName}>pH Asam Kuat:</Text>
              <View style={styles.formulaBox}>
                <Text style={styles.formulaText}>pH = -log [H⁺]</Text>
              </View>
              <Text style={styles.formulaExample}>Contoh: HCl 0.01 M → pH = -log(0.01) = 2</Text>
            </View>

            <View style={styles.formulaItem}>
              <Text style={styles.formulaName}>pH Basa Kuat:</Text>
              <View style={styles.formulaBox}>
                <Text style={styles.formulaText}>pOH = -log [OH⁻]</Text>
                <Text style={styles.formulaText}>pH = 14 - pOH</Text>
              </View>
              <Text style={styles.formulaExample}>Contoh: NaOH 0.001 M → pOH = 3, pH = 11</Text>
            </View>

            <View style={styles.formulaItem}>
              <Text style={styles.formulaName}>Hubungan pH dan pOH:</Text>
              <View style={styles.formulaBox}>
                <Text style={styles.formulaText}>pH + pOH = 14 (pada 25°C)</Text>
              </View>
            </View>
          </View>

          {/* Contoh Soal Card */}
          <View style={styles.exampleCard}>
            <View style={styles.exampleHeader}>
              <View style={styles.exampleIconContainer}>
                <MaterialIcons name="quiz" size={24} color="#10B981" />
              </View>
              <Text style={styles.exampleTitle}>Contoh Soal</Text>
            </View>

            <View style={styles.exampleItem}>
              <Text style={styles.exampleQuestion}>
                Tentukan pH larutan HCl dengan konsentrasi 0.001 M!
              </Text>
              <View style={styles.exampleSolution}>
                <Text style={styles.exampleSolutionTitle}>Penyelesaian:</Text>
                <Text style={styles.exampleSolutionText}>
                  • [H⁺] = 0.001 M = 10⁻³ M{'\n'}
                  • pH = -log [H⁺]{'\n'}
                  • pH = -log (10⁻³){'\n'}
                  • pH = 3
                </Text>
              </View>
            </View>

            <View style={styles.exampleItem}>
              <Text style={styles.exampleQuestion}>
                Larutan NaOH memiliki pOH = 4. Berapa pH-nya?
              </Text>
              <View style={styles.exampleSolution}>
                <Text style={styles.exampleSolutionTitle}>Penyelesaian:</Text>
                <Text style={styles.exampleSolutionText}>
                  • pH + pOH = 14{'\n'}
                  • pH = 14 - pOH{'\n'}
                  • pH = 14 - 4{'\n'}
                  • pH = 10
                </Text>
              </View>
            </View>
          </View>

          {/* Next Module Button */}
          <View style={styles.navigationButtons}>
            <TouchableOpacity 
              style={styles.backModuleButton}
              onPress={() => navigation.navigate('Teori')}
            >
              <MaterialIcons name="arrow-back" size={20} color="#6366F1" />
              <Text style={styles.backModuleText}>Kembali ke Teori</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.nextModuleButton}
              onPress={() => navigation.navigate('Titrasi')}
            >
              <Text style={styles.nextModuleText}>Titrasi</Text>
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
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1E1F35',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6B7280',
  },
  progressCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 4,
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
    borderRadius: 20,
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
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#FFFFFF',
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
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
    marginBottom: 16,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroMetaText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  heroMetaDot: {
    fontSize: 13,
    color: '#FFFFFF',
    marginHorizontal: 8,
  },
  conceptCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  conceptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  conceptIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  conceptTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1E1F35',
  },
  conceptItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  conceptItemIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  conceptItemIconBase: {
    backgroundColor: '#DBEAFE',
  },
  conceptItemIconPH: {
    backgroundColor: '#F3E8FF',
  },
  conceptItemIconText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1E1F35',
  },
  conceptItemIconTextSmall: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1E1F35',
  },
  conceptItemContent: {
    flex: 1,
  },
  conceptItemTitle: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1E1F35',
    marginBottom: 4,
  },
  conceptItemDescription: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  italicText: {
    fontStyle: 'italic',
    color: '#6366F1',
  },
  propertiesRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  propertyCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  propertyIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1E1F35',
    marginBottom: 4,
  },
  propertyPH: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#EF4444',
    marginBottom: 12,
  },
  propertyList: {
    gap: 8,
  },
  propertyListItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  propertyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  propertyListText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6B7280',
  },
  safetyCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  safetyIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  safetyContent: {
    flex: 1,
  },
  safetyTitle: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#92400E',
    marginBottom: 4,
  },
  safetyDescription: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#A16207',
    lineHeight: 20,
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
  // Teori Card Styles
  theoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginTop: 16,
    marginBottom: 16,
  },
  theoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  theoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  theoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1E1F35',
  },
  theoryItem: {
    marginBottom: 16,
  },
  theoryItemTitle: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1E1F35',
    marginBottom: 8,
  },
  theoryItemDescription: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6B7280',
    lineHeight: 22,
  },
  boldText: {
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1E1F35',
  },
  // pH Scale Card Styles
  phScaleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  phScaleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  phScaleIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  phScaleTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1E1F35',
  },
  phScaleVisual: {
    marginBottom: 20,
  },
  phScaleBar: {
    flexDirection: 'row',
    height: 24,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  phScaleSegment: {
    flex: 1,
  },
  phScaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  phScaleLabel: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#6B7280',
  },
  phScaleDescriptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  phScaleDescLeft: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#EF4444',
  },
  phScaleDescCenter: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#22C55E',
  },
  phScaleDescRight: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6366F1',
  },
  phExamples: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  phExamplesTitle: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#1E1F35',
    marginBottom: 12,
  },
  phExampleRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  phExampleItem: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6B7280',
  },
  // Indicator Card Styles
  indicatorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  indicatorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  indicatorIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FCE7F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  indicatorTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1E1F35',
  },
  indicatorTable: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  indicatorTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  indicatorTableHeaderText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#1E1F35',
    textAlign: 'center',
  },
  indicatorTableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'center',
  },
  indicatorTableCell: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#1E1F35',
  },
  indicatorColor: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  indicatorColorText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  // Formula Card Styles
  formulaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  formulaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  formulaIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#CFFAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  formulaTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1E1F35',
  },
  formulaItem: {
    marginBottom: 20,
  },
  formulaName: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#1E1F35',
    marginBottom: 8,
  },
  formulaBox: {
    backgroundColor: '#F0FDFA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#99F6E4',
    marginBottom: 8,
  },
  formulaText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#0D9488',
    textAlign: 'center',
    marginVertical: 2,
  },
  formulaExample: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6B7280',
    fontStyle: 'italic',
  },
  // Example Card Styles
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
  // Navigation Buttons
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
