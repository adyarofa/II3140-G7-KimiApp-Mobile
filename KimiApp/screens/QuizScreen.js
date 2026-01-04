import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { auth, db } from "../config/firebase";
import { doc, getDoc, updateDoc, setDoc, collection, getDocs } from "firebase/firestore";

const TOTAL_QUESTIONS = 8;
const POINTS_PER_QUESTION = 4;

// Function untuk ambil random questions dari Firestore
const getRandomQuestions = async (count = 8) => {
  try {
    const querySnapshot = await getDocs(collection(db, "quizQuestions"));
    
    if (!querySnapshot.empty) {
      const firebaseQuestions = [];
      querySnapshot.forEach((doc) => {
        firebaseQuestions.push(doc.data());
      });
      
      // Shuffle dan ambil sejumlah count
      const shuffled = [...firebaseQuestions].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, count);
    } else {
      return [];
    }
  } catch (error) {
    console.error("❌ Error fetching questions:", error.message);
    return [];
  }
};

// Bottom Navigation Component
const BottomNavBar = ({ navigation, activeTab = "Kuis" }) => {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Home")}>
        <MaterialIcons name="home" size={26} color="#9CA3AF" />
        <Text style={styles.navLabel}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Teori")}>
        <MaterialIcons name="book" size={26} color="#9CA3AF" />
        <Text style={styles.navLabel}>Teori</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("VirtualLab")}> 
        <MaterialIcons name="science" size={26} color="#9CA3AF" />
        <Text style={styles.navLabel}>Simulasi</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <View style={styles.activeIndicator} />
        <MaterialIcons name="quiz" size={26} color="#6366F1" />
        <Text style={[styles.navLabel, styles.navLabelActive]}>Kuis</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Profile")}>
        <MaterialIcons name="person" size={26} color="#9CA3AF" />
        <Text style={styles.navLabel}>Profil</Text>
      </TouchableOpacity>
    </View>
  );
};

const QuizScreen = ({ navigation }) => {
  const user = auth.currentUser;
  const [gameState, setGameState] = useState("start");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [maxScore, setMaxScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchMaxScore();
    }, [user])
  );

  const fetchMaxScore = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userProgressRef = doc(db, "userProgress", user.uid);
      const docSnap = await getDoc(userProgressRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setMaxScore(data.maxQuizScore || 0);
      } else {
        setMaxScore(0);
      }
    } catch (error) {
      console.error("Error fetching max score:", error);
      setMaxScore(0);
    } finally {
      setLoading(false);
    }
  };

  const saveScoreToFirebase = async (finalScore) => {
    if (!user) return;

    try {
      setSaving(true);
      const userProgressRef = doc(db, "userProgress", user.uid);
      const docSnap = await getDoc(userProgressRef);

      if (docSnap.exists()) {
        const currentMaxScore = docSnap.data().maxQuizScore || 0;
        
        if (finalScore > currentMaxScore) {
          await updateDoc(userProgressRef, {
            maxQuizScore: finalScore,
            lastQuizDate: new Date().toISOString(),
            hasNewHighScore: true,
          });
          setMaxScore(finalScore);
        }
      } else {
        await setDoc(userProgressRef, {
          maxQuizScore: finalScore,
          lastQuizDate: new Date().toISOString(),
          hasNewHighScore: true,
        });
        setMaxScore(finalScore);
      }
    } catch (error) {
    } finally {
      setSaving(false);
    }
  };

  const startQuiz = async () => {
    setLoading(true);
    try {
      const randomQuestions = await getRandomQuestions(TOTAL_QUESTIONS);
      setQuestions(randomQuestions);
      setCurrentQuestionIndex(0);
      setScore(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setGameState("playing");
    } catch (error) {
      console.error("Error starting quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    if (selectedAnswer !== null) return; // Sudah memilih

    setSelectedAnswer(answerIndex);
    setShowExplanation(true);

    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion.answers[answerIndex].correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      const finalScore = (score + (questions[currentQuestionIndex].answers[selectedAnswer]?.correct ? 1 : 0)) * POINTS_PER_QUESTION;
      const actualFinalScore = (score) * POINTS_PER_QUESTION;
      setGameState("finished");
      saveScoreToFirebase(actualFinalScore);
    }
  };

  const restartQuiz = () => {
    setGameState("start");
  };

  const getScoreMessage = () => {
    const percentage = (score / TOTAL_QUESTIONS) * 100;
    if (percentage >= 80) {
      return "Bagus sekali! Anda menguasai materi dengan baik. 🎉";
    } else if (percentage >= 60) {
      return "Cukup baik! Teruslah berlatih untuk meningkatkan pemahaman Anda. 💪";
    } else {
      return "Jangan menyerah! Cobalah lagi setelah mempelajari materi dengan lebih baik. 📚";
    }
  };

  const getAnswerStyle = (index) => {
    if (selectedAnswer === null) return styles.answerButton;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = currentQuestion.answers[index].correct;
    const isSelected = selectedAnswer === index;

    if (isCorrect) {
      return [styles.answerButton, styles.correctAnswer];
    }
    if (isSelected && !isCorrect) {
      return [styles.answerButton, styles.wrongAnswer];
    }
    return [styles.answerButton, styles.disabledAnswer];
  };

  // START SCREEN
  if (gameState === "start") {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            {/* Header with Icon */}
            <View style={styles.headerSection}>
              <View style={styles.iconCircle}>
                <MaterialIcons name="psychology" size={50} color="#6366F1" />
              </View>
              <Text style={styles.title}>Kuis Kimia</Text>
              <Text style={styles.subtitle}>Uji pemahamanmu!</Text>
            </View>

            {/* Stats Card */}
            <View style={styles.statsCard}>
              {loading ? (
                <ActivityIndicator size="small" color="#6470ea" />
              ) : (
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <MaterialIcons name="emoji-events" size={28} color="#F59E0B" />
                    <Text style={styles.statValue}>{maxScore}</Text>
                    <Text style={styles.statLabel}>Skor Tertinggi</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <MaterialIcons name="help-outline" size={28} color="#6366F1" />
                    <Text style={styles.statValue}>{TOTAL_QUESTIONS}</Text>
                    <Text style={styles.statLabel}>Pertanyaan</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <MaterialIcons name="stars" size={28} color="#10B981" />
                    <Text style={styles.statValue}>{TOTAL_QUESTIONS * POINTS_PER_QUESTION}</Text>
                    <Text style={styles.statLabel}>Maks Poin</Text>
                  </View>
                </View>
              )}
            </View>

            {/* Rules Section */}
            <View style={styles.rulesBox}>
              <View style={styles.ruleRow}>
                <View style={styles.ruleIcon}>
                  <MaterialIcons name="touch-app" size={20} color="#6366F1" />
                </View>
                <Text style={styles.ruleItem}>Pilih satu jawaban yang paling tepat</Text>
              </View>
              <View style={styles.ruleRow}>
                <View style={styles.ruleIcon}>
                  <MaterialIcons name="lightbulb" size={20} color="#F59E0B" />
                </View>
                <Text style={styles.ruleItem}>Lihat penjelasan setiap jawaban</Text>
              </View>
              <View style={styles.ruleRow}>
                <View style={styles.ruleIcon}>
                  <MaterialIcons name="arrow-forward" size={20} color="#10B981" />
                </View>
                <Text style={styles.ruleItem}>Klik "Lanjut" untuk melanjutkan</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.startButton} onPress={startQuiz}>
              <MaterialIcons name="play-arrow" size={24} color="#fff" />
              <Text style={styles.startButtonText}>Mulai Kuis</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <BottomNavBar navigation={navigation} />
      </View>
    );
  }

  // PLAYING SCREEN
  if (gameState === "playing" && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / TOTAL_QUESTIONS) * 100;
    const answerLabels = ['A', 'B', 'C', 'D'];

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            {/* Header */}
            <View style={styles.playingHeader}>
              <View style={styles.questionCounter}>
                <Text style={styles.questionCounterText}>
                  {currentQuestionIndex + 1}/{TOTAL_QUESTIONS}
                </Text>
              </View>
              <View style={styles.scoreDisplay}>
                <MaterialIcons name="stars" size={18} color="#F59E0B" />
                <Text style={styles.currentScore}>{score * POINTS_PER_QUESTION} poin</Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBar, { width: `${progress}%` }]} />
            </View>

            {/* Category Badge */}
            <View style={styles.categoryBadge}>
              <MaterialIcons name="category" size={14} color="#6366F1" />
              <Text style={styles.categoryText}>{currentQuestion.category}</Text>
            </View>

            {/* Question Card */}
            <View style={styles.questionCard}>
              <Text style={styles.questionText}>
                {currentQuestion.question}
              </Text>
            </View>

            {/* Answer Choices */}
            <View style={styles.answersContainer}>
              {currentQuestion.answers.map((answer, index) => (
                <TouchableOpacity
                  key={index}
                  style={getAnswerStyle(index)}
                  onPress={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                >
                  <View style={[
                    styles.answerLabel,
                    selectedAnswer !== null && currentQuestion.answers[index].correct && styles.correctLabel,
                    selectedAnswer === index && !currentQuestion.answers[index].correct && styles.wrongLabel,
                  ]}>
                    <Text style={[
                      styles.answerLabelText,
                      selectedAnswer !== null && currentQuestion.answers[index].correct && styles.correctLabelText,
                      selectedAnswer === index && !currentQuestion.answers[index].correct && styles.wrongLabelText,
                    ]}>{answerLabels[index]}</Text>
                  </View>
                  <Text
                    style={[
                      styles.answerText,
                      selectedAnswer !== null &&
                        currentQuestion.answers[index].correct &&
                        styles.correctAnswerText,
                      selectedAnswer === index &&
                        !currentQuestion.answers[index].correct &&
                        styles.wrongAnswerText,
                    ]}
                  >
                    {answer.text}
                  </Text>
                  {selectedAnswer !== null && currentQuestion.answers[index].correct && (
                    <MaterialIcons name="check-circle" size={24} color="#10B981" style={styles.answerIcon} />
                  )}
                  {selectedAnswer === index && !currentQuestion.answers[index].correct && (
                    <MaterialIcons name="cancel" size={24} color="#EF4444" style={styles.answerIcon} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Explanation */}
            {showExplanation && (
              <View
                style={[
                  styles.explanationBox,
                  currentQuestion.answers[selectedAnswer].correct
                    ? styles.correctExplanation
                    : styles.wrongExplanation,
                ]}
              >
                <View style={styles.explanationHeader}>
                  <MaterialIcons 
                    name={currentQuestion.answers[selectedAnswer].correct ? "check-circle" : "cancel"} 
                    size={24} 
                    color={currentQuestion.answers[selectedAnswer].correct ? "#10B981" : "#EF4444"} 
                  />
                  <Text style={[
                    styles.explanationTitle,
                    { color: currentQuestion.answers[selectedAnswer].correct ? "#10B981" : "#EF4444" }
                  ]}>
                    {currentQuestion.answers[selectedAnswer].correct
                      ? "Benar! +4 poin"
                      : "Salah!"}
                  </Text>
                </View>
                <Text style={styles.explanationText}>
                  {currentQuestion.explanation}
                </Text>
              </View>
            )}

            {/* Next Button */}
            {showExplanation && (
              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleNextQuestion}
              >
                <Text style={styles.nextButtonText}>
                  {currentQuestionIndex < TOTAL_QUESTIONS - 1
                    ? "Lanjut"
                    : "Lihat Hasil"}
                </Text>
                <MaterialIcons name="arrow-forward" size={20} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (gameState === "finished") {
    const finalPoints = score * POINTS_PER_QUESTION;
    const percentage = (score / TOTAL_QUESTIONS) * 100;

    const getResultColor = () => {
      if (percentage >= 80) return "#10B981";
      if (percentage >= 60) return "#F59E0B";
      return "#6366F1";
    };

    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            {/* Result Header */}
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>
                {percentage >= 80 ? "Luar Biasa!" : percentage >= 60 ? "Bagus!" : "Tetap Semangat!"}
              </Text>
            </View>

            {/* Score Circle */}
            <View style={[styles.scoreCircle, { borderColor: getResultColor() }]}>
              <Text style={[styles.scorePercentage, { color: getResultColor() }]}>{Math.round(percentage)}%</Text>
              <Text style={styles.scoreSubtext}>{score}/{TOTAL_QUESTIONS} Benar</Text>
            </View>

            {/* Points Earned */}
            <View style={styles.pointsEarned}>
              <MaterialIcons name="stars" size={28} color="#F59E0B" />
              <Text style={styles.pointsValue}>{finalPoints}</Text>
              <Text style={styles.pointsLabel}>poin diperoleh</Text>
            </View>

            {/* High Score Badge */}
            {saving ? (
              <View style={styles.savingContainer}>
                <ActivityIndicator size="small" color="#6470ea" />
                <Text style={styles.savingText}>Menyimpan skor...</Text>
              </View>
            ) : finalPoints >= maxScore && finalPoints > 0 ? (
              <View style={styles.highScoreBadge}>
                <MaterialIcons name="emoji-events" size={20} color="#F59E0B" />
                <Text style={styles.highScoreText}>Skor Tertinggi Baru!</Text>
              </View>
            ) : null}

            {/* Message */}
            <Text style={styles.resultMessage}>{getScoreMessage()}</Text>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.restartButton}
                onPress={restartQuiz}
              >
                <MaterialIcons name="replay" size={20} color="#fff" />
                <Text style={styles.restartButtonText}>Coba Lagi</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.homeButton}
                onPress={() => navigation.navigate('Home')}
              >
                <MaterialIcons name="home" size={20} color="#6366F1" />
                <Text style={styles.homeButtonText}>Beranda</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <BottomNavBar navigation={navigation} />
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E1E5FD",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 50,
    paddingBottom: 120,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 24,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },

  headerSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1E1F35",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 4,
  },
  statsCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E1F35",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 50,
    backgroundColor: "#E5E7EB",
  },
  rulesBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  ruleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  ruleIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  ruleItem: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: "#6366F1",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    gap: 8,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  startButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  playingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  questionCounter: {
    backgroundColor: "#6366F1",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  questionCounterText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  scoreDisplay: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  currentScore: {
    fontSize: 14,
    fontWeight: "700",
    color: "#92400E",
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 20,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#6366F1",
    borderRadius: 8,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 16,
    gap: 6,
  },
  categoryText: {
    fontSize: 13,
    color: "#6366F1",
    fontWeight: "600",
  },
  questionCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#6366F1",
  },
  questionText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1E1F35",
    lineHeight: 26,
  },
  answersContainer: {
    gap: 12,
  },
  answerButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  answerLabel: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  answerLabelText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6B7280",
  },
  correctLabel: {
    backgroundColor: "#10B981",
  },
  correctLabelText: {
    color: "#fff",
  },
  wrongLabel: {
    backgroundColor: "#EF4444",
  },
  wrongLabelText: {
    color: "#fff",
  },
  answerText: {
    flex: 1,
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
  },
  answerIcon: {
    marginLeft: 8,
  },
  correctAnswer: {
    backgroundColor: "#ECFDF5",
    borderColor: "#10B981",
  },
  correctAnswerText: {
    color: "#065F46",
    fontWeight: "600",
  },
  wrongAnswer: {
    backgroundColor: "#FEF2F2",
    borderColor: "#EF4444",
  },
  wrongAnswerText: {
    color: "#991B1B",
  },
  disabledAnswer: {
    opacity: 0.5,
  },
  explanationBox: {
    marginTop: 20,
    padding: 18,
    borderRadius: 16,
  },
  explanationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  correctExplanation: {
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  wrongExplanation: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  explanationTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#374151",
  },
  nextButton: {
    backgroundColor: "#6366F1",
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },

  resultHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1E1F35",
  },
  scoreCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 8,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 24,
    backgroundColor: "#F8FAFC",
  },
  scorePercentage: {
    fontSize: 42,
    fontWeight: "800",
  },
  scoreSubtext: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  pointsEarned: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    alignSelf: "center",
    marginBottom: 16,
    gap: 8,
  },
  pointsValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#92400E",
  },
  pointsLabel: {
    fontSize: 14,
    color: "#92400E",
  },
  highScoreBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: "center",
    marginBottom: 16,
    gap: 8,
  },
  highScoreText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#92400E",
  },
  savingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  savingText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#6366F1",
  },
  resultMessage: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 28,
    paddingHorizontal: 10,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  restartButton: {
    flex: 1,
    backgroundColor: "#6366F1",
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  restartButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  homeButton: {
    flex: 1,
    backgroundColor: "#EEF2FF",
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  homeButtonText: {
    color: "#6366F1",
    fontSize: 16,
    fontWeight: "700",
  },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingBottom: 20,
    paddingHorizontal: 8,
    paddingTop: 12,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    position: "relative",
  },
  activeIndicator: {
    position: "absolute",
    top: -12,
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#6366F1",
  },
  navLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9CA3AF",
    marginTop: 4,
  },
  navLabelActive: {
    color: "#6366F1",
  },
});

export default QuizScreen;
