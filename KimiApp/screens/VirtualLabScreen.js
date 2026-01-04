import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, PlusJakartaSans_400Regular, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans';

const { width } = Dimensions.get('window');

const indicatorData = {
  'fenolftalein': {
    name: 'Fenolftalein',
    ph: '8.3 - 10.0',
    colors: {
      'hcl': { color: '#FFFFFF', name: 'Tidak berwarna', hasBorder: true },
      'ch3cooh': { color: '#FFFFFF', name: 'Tidak berwarna', hasBorder: true },
      'h2o': { color: '#FFFFFF', name: 'Tidak berwarna', hasBorder: true },
      'nh4oh': { color: '#FFB6C1', name: 'Merah Muda Pucat', hasBorder: false },
      'naoh': { color: '#FF69B4', name: 'Merah Muda', hasBorder: false }
    },
    explanation: {
      'hcl': 'Fenolftalein tidak berubah warna di lingkungan asam kuat (HCl, pH ~1). Indikator ini hanya berubah warna di lingkungan basa dengan pH > 8.3.',
      'ch3cooh': 'Fenolftalein tetap tidak berwarna di asam asetat (pH ~3). Meskipun asam lemah, pH-nya masih jauh di bawah titik transisi fenolftalein.',
      'h2o': 'Fenolftalein tidak berubah warna di lingkungan netral (H₂O, pH 7). Indikator ini memerlukan pH yang cukup tinggi untuk menunjukkan warna merah muda.',
      'nh4oh': 'Fenolftalein berubah menjadi merah muda pucat di amonia (pH ~11). Warnanya lebih pudar karena amonia adalah basa lemah.',
      'naoh': 'Fenolftalein berubah menjadi merah muda pekat di lingkungan basa kuat (NaOH, pH ~14). Ini menunjukkan pH larutan berada jauh di atas 8.3.'
    }
  },
  'metil-jingga': {
    name: 'Metil Jingga',
    ph: '3.1 - 4.4',
    colors: {
      'hcl': { color: '#FF4444', name: 'Merah', hasBorder: false },
      'ch3cooh': { color: '#FF6B35', name: 'Merah-Orange', hasBorder: false },
      'h2o': { color: '#FF8C00', name: 'Orange', hasBorder: false },
      'nh4oh': { color: '#FFD700', name: 'Kuning', hasBorder: false },
      'naoh': { color: '#FFD700', name: 'Kuning', hasBorder: false }
    },
    explanation: {
      'hcl': 'Metil jingga berubah menjadi merah di asam klorida (pH ~1). Ini menunjukkan pH yang sangat rendah, jauh di bawah titik transisi 3.1.',
      'ch3cooh': 'Metil jingga menunjukkan warna merah-orange di asam asetat (pH ~3). Warna transisi karena pH mendekati rentang perubahan warna.',
      'h2o': 'Metil jingga menunjukkan warna orange di air netral (pH 7). Ini adalah warna di atas titik transisi indikator.',
      'nh4oh': 'Metil jingga berubah kuning di amonia (pH ~11). pH jauh di atas rentang transisi sehingga warnanya kuning cerah.',
      'naoh': 'Metil jingga berubah menjadi kuning di NaOH (pH ~14). Ini menunjukkan bahwa pH larutan berada jauh di atas 4.4.'
    }
  },
  'bromtimol-biru': {
    name: 'Bromtimol Biru',
    ph: '6.0 - 7.6',
    colors: {
      'hcl': { color: '#FFD700', name: 'Kuning', hasBorder: false },
      'ch3cooh': { color: '#FFD700', name: 'Kuning', hasBorder: false },
      'h2o': { color: '#00AA00', name: 'Hijau', hasBorder: false },
      'nh4oh': { color: '#4169E1', name: 'Biru', hasBorder: false },
      'naoh': { color: '#4169E1', name: 'Biru', hasBorder: false }
    },
    explanation: {
      'hcl': 'Bromtimol biru berubah kuning di HCl (pH ~1). pH sangat rendah, jauh di bawah rentang transisi 6.0.',
      'ch3cooh': 'Bromtimol biru berubah kuning di asam asetat (pH ~3). Meskipun asam lemah, pH masih di bawah 6.0.',
      'h2o': 'Bromtimol biru menunjukkan warna hijau di air netral (pH 7). Ini adalah titik transisi sempurna untuk pH netral.',
      'nh4oh': 'Bromtimol biru berubah biru di amonia (pH ~11). pH berada di atas rentang transisi 7.6.',
      'naoh': 'Bromtimol biru berubah menjadi biru pekat di NaOH (pH ~14). Ini menunjukkan pH larutan berada jauh di atas 7.6.'
    }
  },
  'lakmus': {
    name: 'Lakmus',
    ph: '4.5 - 8.3',
    colors: {
      'hcl': { color: '#DC2626', name: 'Merah', hasBorder: false },
      'ch3cooh': { color: '#DC2626', name: 'Merah', hasBorder: false },
      'h2o': { color: '#9333EA', name: 'Ungu', hasBorder: false },
      'nh4oh': { color: '#2563EB', name: 'Biru', hasBorder: false },
      'naoh': { color: '#2563EB', name: 'Biru', hasBorder: false }
    },
    explanation: {
      'hcl': 'Lakmus berubah merah di HCl (pH ~1). Kertas lakmus biru akan berubah merah menandakan larutan bersifat asam kuat.',
      'ch3cooh': 'Lakmus berubah merah di asam asetat (pH ~3). Meskipun asam lemah, tetap cukup untuk mengubah lakmus menjadi merah.',
      'h2o': 'Lakmus tetap ungu (tidak berubah) di air netral (pH 7). Ini menunjukkan larutan bersifat netral.',
      'nh4oh': 'Lakmus berubah biru di amonia (pH ~11). Kertas lakmus merah akan berubah biru menandakan basa.',
      'naoh': 'Lakmus berubah biru pekat di NaOH (pH ~14). Ini menunjukkan larutan bersifat basa kuat.'
    }
  },
  'metil-merah': {
    name: 'Metil Merah',
    ph: '4.4 - 6.2',
    colors: {
      'hcl': { color: '#DC2626', name: 'Merah', hasBorder: false },
      'ch3cooh': { color: '#DC2626', name: 'Merah', hasBorder: false },
      'h2o': { color: '#FBBF24', name: 'Kuning', hasBorder: false },
      'nh4oh': { color: '#FBBF24', name: 'Kuning', hasBorder: false },
      'naoh': { color: '#FBBF24', name: 'Kuning', hasBorder: false }
    },
    explanation: {
      'hcl': 'Metil merah berubah merah di HCl (pH ~1). pH jauh di bawah titik transisi 4.4 sehingga warna merah pekat.',
      'ch3cooh': 'Metil merah berubah merah di asam asetat (pH ~3). pH masih di bawah rentang transisi indikator.',
      'h2o': 'Metil merah berubah kuning di air netral (pH 7). pH di atas rentang transisi 6.2.',
      'nh4oh': 'Metil merah tetap kuning di amonia (pH ~11). pH jauh di atas titik transisi.',
      'naoh': 'Metil merah tetap kuning di NaOH (pH ~14). Indikator ini tidak sensitif terhadap basa kuat.'
    }
  }
};

const solutionData = {
  'hcl': { name: 'HCl', fullName: 'Asam Klorida', type: 'Asam Kuat', icon: 'science', color: '#EF4444', ph: '~1' },
  'ch3cooh': { name: 'CH₃COOH', fullName: 'Asam Asetat', type: 'Asam Lemah', icon: 'local-cafe', color: '#F97316', ph: '~3' },
  'h2o': { name: 'H₂O', fullName: 'Air Murni', type: 'Netral', icon: 'water-drop', color: '#3B82F6', ph: '7' },
  'nh4oh': { name: 'NH₄OH', fullName: 'Amonia', type: 'Basa Lemah', icon: 'air', color: '#06B6D4', ph: '~11' },
  'naoh': { name: 'NaOH', fullName: 'Natrium Hidroksida', type: 'Basa Kuat', icon: 'blur-on', color: '#8B5CF6', ph: '~14' }
};

const TestTube = ({ color, hasBorder, colorName }) => {
  const bubbleAnim = useRef(new Animated.Value(0)).current;
  
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bubbleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(bubbleAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const bubbleTranslate = bubbleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  return (
    <View style={styles.testTubeContainer}>
      <View style={styles.testTubeWrapper}>
        {/* Bagian atas tabung */}
        <View style={styles.tubeTop}>
          <View style={styles.tubeRim} />
        </View>
        
        {/* Badan tabung */}
        <View style={[
          styles.tubeBody,
          hasBorder && { borderColor: '#ccc', borderWidth: 2 }
        ]}>
          {/* Cairan */}
          <View style={[styles.liquid, { backgroundColor: color }]}>
            {/* Gelembung animasi */}
            <Animated.View 
              style={[
                styles.bubble, 
                { transform: [{ translateY: bubbleTranslate }], left: '20%' }
              ]} 
            />
            <Animated.View 
              style={[
                styles.bubble, 
                styles.bubbleSmall,
                { transform: [{ translateY: bubbleTranslate }], left: '60%', top: '30%' }
              ]} 
            />
            <Animated.View 
              style={[
                styles.bubble, 
                styles.bubbleMedium,
                { transform: [{ translateY: bubbleTranslate }], left: '40%', top: '50%' }
              ]} 
            />
          </View>
          
          {/* Refleksi cahaya */}
          <View style={styles.reflection} />
        </View>
        
        {/* Bagian bawah tabung (melengkung) */}
        <View style={[styles.tubeBottom, { backgroundColor: color }]}>
          {hasBorder && <View style={styles.tubeBottomBorder} />}
        </View>
      </View>
      
      <Text style={styles.colorLabel}>{colorName}</Text>
    </View>
  );
};

export default function VirtualLabScreen({ navigation }) {
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  let [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  const showResult = selectedSolution && selectedIndicator;

  React.useEffect(() => {
    if (showResult) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [showResult]);

  const getResultData = () => {
    if (!showResult) return null;
    const indicator = indicatorData[selectedIndicator];
    const solution = solutionData[selectedSolution];
    const colorData = indicator.colors[selectedSolution];
    return { indicator, solution, colorData };
  };

  const resetExperiment = () => {
    setSelectedSolution(null);
    setSelectedIndicator(null);
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#EEF2FF', '#E0E7FF', '#C7D2FE']} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#4338CA" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <MaterialIcons name="science" size={28} color="#4338CA" />
            <Text style={styles.headerTitle}>Lab Virtual</Text>
          </View>
          <TouchableOpacity onPress={resetExperiment} style={styles.resetButton}>
            <MaterialIcons name="refresh" size={24} color="#4338CA" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
        >
          {/* Title Card */}
          <View style={styles.titleCard}>
            <LinearGradient 
              colors={['#4338CA', '#6366F1']} 
              style={styles.titleGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <MaterialIcons name="biotech" size={40} color="#fff" />
              <Text style={styles.titleText}>Simulasi Indikator Asam-Basa</Text>
              <Text style={styles.subtitleText}>Pilih larutan dan indikator untuk melihat perubahan warna</Text>
            </LinearGradient>
          </View>

          {/* Pilih Larutan */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="local-drink" size={24} color="#4338CA" />
              <Text style={styles.sectionTitle}>Pilih Larutan</Text>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionsScrollContent}>
              {Object.entries(solutionData).map(([key, solution]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.optionCard,
                    selectedSolution === key && styles.optionCardActive,
                    { borderColor: selectedSolution === key ? solution.color : '#E2E8F0' }
                  ]}
                  onPress={() => setSelectedSolution(key)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.optionIconBg, { backgroundColor: solution.color + '20' }]}>
                    <MaterialIcons name={solution.icon} size={24} color={solution.color} />
                  </View>
                  <Text style={[styles.optionName, selectedSolution === key && { color: solution.color }]}>
                    {solution.name}
                  </Text>
                  <Text style={styles.optionDesc}>{solution.fullName}</Text>
                  <View style={[styles.typeTag, { backgroundColor: solution.color + '20' }]}>
                    <Text style={[styles.typeTagText, { color: solution.color }]}>{solution.type}</Text>
                  </View>
                  <Text style={styles.phLabel}>pH {solution.ph}</Text>
                  {selectedSolution === key && (
                    <View style={[styles.checkBadge, { backgroundColor: solution.color }]}>
                      <MaterialIcons name="check" size={14} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Pilih Indikator */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="colorize" size={24} color="#4338CA" />
              <Text style={styles.sectionTitle}>Pilih Indikator</Text>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionsScrollContent}>
              {Object.entries(indicatorData).map(([key, indicator]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.indicatorCard,
                    selectedIndicator === key && styles.indicatorCardActive
                  ]}
                  onPress={() => setSelectedIndicator(key)}
                  activeOpacity={0.7}
                >
                  <View style={styles.indicatorColorsRow}>
                    {Object.values(indicator.colors).slice(0, 3).map((c, i) => (
                      <View 
                        key={i} 
                        style={[
                          styles.colorDotSmall, 
                          { backgroundColor: c.color },
                          c.hasBorder && { borderWidth: 1, borderColor: '#ccc' }
                        ]} 
                      />
                    ))}
                  </View>
                  <Text style={[styles.indicatorName, selectedIndicator === key && styles.indicatorNameActive]}>
                    {indicator.name}
                  </Text>
                  <Text style={styles.indicatorPh}>pH: {indicator.ph}</Text>
                  {selectedIndicator === key && (
                    <View style={styles.checkBadgeIndicator}>
                      <MaterialIcons name="check" size={14} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Hasil Eksperimen */}
          {showResult && (
            <Animated.View style={[styles.resultSection, { opacity: fadeAnim }]}>
              <LinearGradient 
                colors={['#ffffff', '#F8FAFC']} 
                style={styles.resultCard}
              >
                <View style={styles.resultHeader}>
                  <MaterialIcons name="emoji-objects" size={28} color="#F59E0B" />
                  <Text style={styles.resultTitle}>Hasil Eksperimen</Text>
                </View>

                {/* Tabung Reaksi */}
                <TestTube 
                  color={getResultData().colorData.color}
                  hasBorder={getResultData().colorData.hasBorder}
                  colorName={getResultData().colorData.name}
                />

                {/* Info */}
                <View style={styles.resultInfo}>
                  <View style={styles.infoRow}>
                    <MaterialIcons name="local-drink" size={20} color="#4338CA" />
                    <Text style={styles.infoLabel}>Larutan:</Text>
                    <Text style={styles.infoValue}>{getResultData().solution.fullName}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <MaterialIcons name="colorize" size={20} color="#4338CA" />
                    <Text style={styles.infoLabel}>Indikator:</Text>
                    <Text style={styles.infoValue}>{getResultData().indicator.name}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <MaterialIcons name="speed" size={20} color="#4338CA" />
                    <Text style={styles.infoLabel}>Rentang pH:</Text>
                    <Text style={styles.infoValue}>{getResultData().indicator.ph}</Text>
                  </View>
                </View>

                {/* Penjelasan */}
                <View style={styles.explanationBox}>
                  <View style={styles.explanationHeader}>
                    <MaterialIcons name="lightbulb" size={20} color="#F59E0B" />
                    <Text style={styles.explanationTitle}>Penjelasan</Text>
                  </View>
                  <Text style={styles.explanationText}>
                    {getResultData().indicator.explanation[selectedSolution]}
                  </Text>
                </View>
              </LinearGradient>
            </Animated.View>
          )}

          {/* Tabel Referensi */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="table-chart" size={24} color="#4338CA" />
              <Text style={styles.sectionTitle}>Tabel Referensi</Text>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.tableCard}>
                {/* Header Tabel */}
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderText, { width: 90 }]}>Indikator</Text>
                  <Text style={[styles.tableHeaderText, { width: 65 }]}>HCl</Text>
                  <Text style={[styles.tableHeaderText, { width: 65 }]}>CH₃COOH</Text>
                  <Text style={[styles.tableHeaderText, { width: 65 }]}>H₂O</Text>
                  <Text style={[styles.tableHeaderText, { width: 65 }]}>NH₄OH</Text>
                  <Text style={[styles.tableHeaderText, { width: 65 }]}>NaOH</Text>
                </View>
                
                {/* Baris Tabel */}
                {Object.entries(indicatorData).map(([key, indicator], index) => (
                  <View 
                    key={key} 
                    style={[
                      styles.tableRow,
                      index % 2 === 0 && styles.tableRowAlt
                    ]}
                  >
                    <Text style={[styles.tableCellName, { width: 90 }]}>
                      {indicator.name}
                    </Text>
                    {['hcl', 'ch3cooh', 'h2o', 'nh4oh', 'naoh'].map(sol => (
                      <View key={sol} style={[styles.tableCell, { width: 65 }]}>
                        <View 
                          style={[
                            styles.tableColorDot,
                            { backgroundColor: indicator.colors[sol].color },
                            indicator.colors[sol].hasBorder && { borderWidth: 1, borderColor: '#ccc' }
                          ]} 
                        />
                        <Text style={styles.tableColorName} numberOfLines={1}>
                          {indicator.colors[sol].name}
                        </Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
            <MaterialIcons name="home" size={24} color="#9CA3AF" />
            <Text style={styles.navText}>Beranda</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Teori')}>
            <MaterialIcons name="menu-book" size={24} color="#9CA3AF" />
            <Text style={styles.navText}>Modul</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
            <View style={styles.navActiveIcon}>
              <MaterialIcons name="science" size={24} color="#fff" />
            </View>
            <Text style={styles.navTextActive}>Lab</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Quiz')}>
            <MaterialIcons name="quiz" size={24} color="#9CA3AF" />
            <Text style={styles.navText}>Kuis</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
            <MaterialIcons name="person" size={24} color="#9CA3AF" />
            <Text style={styles.navText}>Profil</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4338CA',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#4338CA',
  },
  resetButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4338CA',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  titleCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#4338CA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  titleGradient: {
    padding: 24,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 22,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
    marginTop: 12,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.9)',
    marginTop: 8,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1E293B',
  },
  optionsScrollContent: {
    paddingRight: 20,
    gap: 10,
  },
  optionCard: {
    width: 110,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionCardActive: {
    borderWidth: 2,
    shadowOpacity: 0.15,
    elevation: 4,
  },
  optionIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionName: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1E293B',
    marginBottom: 2,
    textAlign: 'center',
  },
  optionDesc: {
    fontSize: 9,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 6,
  },
  typeTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 4,
  },
  typeTagText: {
    fontSize: 8,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  phLabel: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#94A3B8',
  },
  checkBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorCard: {
    width: 100,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  indicatorCardActive: {
    borderColor: '#4338CA',
    backgroundColor: '#EEF2FF',
  },
  indicatorColorsRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
  },
  colorDotSmall: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  indicatorName: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 4,
  },
  indicatorNameActive: {
    color: '#4338CA',
  },
  indicatorPh: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#64748B',
  },
  checkBadgeIndicator: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4338CA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultSection: {
    marginBottom: 24,
  },
  resultCard: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#4338CA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1E293B',
  },
  testTubeContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  testTubeWrapper: {
    alignItems: 'center',
  },
  tubeTop: {
    width: 70,
    alignItems: 'center',
  },
  tubeRim: {
    width: 80,
    height: 12,
    backgroundColor: '#94A3B8',
    borderRadius: 6,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  tubeBody: {
    width: 60,
    height: 150,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderColor: '#94A3B8',
    overflow: 'hidden',
    position: 'relative',
  },
  liquid: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '85%',
    overflow: 'hidden',
  },
  bubble: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.6)',
    top: '70%',
  },
  bubbleSmall: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  bubbleMedium: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  reflection: {
    position: 'absolute',
    left: 5,
    top: 10,
    width: 8,
    height: '60%',
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 4,
  },
  tubeBottom: {
    width: 60,
    height: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: '#94A3B8',
  },
  tubeBottomBorder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
    borderBottomLeftRadius: 27,
    borderBottomRightRadius: 27,
    borderWidth: 2,
    borderColor: '#ccc',
    borderTopWidth: 0,
  },
  colorLabel: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#4338CA',
  },
  resultInfo: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#64748B',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#1E293B',
  },
  explanationBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  explanationTitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#92400E',
  },
  explanationText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#78350F',
    lineHeight: 20,
  },
  tableCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#4338CA',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  tableHeaderText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  tableRowAlt: {
    backgroundColor: '#F8FAFC',
  },
  tableCell: {
    alignItems: 'center',
    gap: 4,
  },
  tableCellName: {
    alignItems: 'flex-start',
  },
  tableColorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  tableColorName: {
    fontSize: 8,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#64748B',
    textAlign: 'center',
  },
  tableCellName: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#1E293B',
  },
  scrollHint: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navItemActive: {
    marginTop: -20,
  },
  navActiveIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4338CA',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4338CA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  navText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#9CA3AF',
    marginTop: 4,
  },
  navTextActive: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#4338CA',
    marginTop: 6,
  },
});
