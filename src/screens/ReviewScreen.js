import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useQuiz } from '../context/QuizContext';

export default function ReviewScreen({ navigation, route }) {
  const {
    getIncorrectQuestions,
    getBookmarkedQuestions,
    recordAnswer,
    toggleBookmark,
    bookmarks,
    stats,
  } = useQuiz();

  const isBookmarkedMode = route.params?.bookmarked;
  const [questionsList, setQuestionsList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const questions = isBookmarkedMode
      ? getBookmarkedQuestions()
      : getIncorrectQuestions();

    if (questions.length === 0) {
      Alert.alert(
        'No hay preguntas',
        isBookmarkedMode
          ? 'No tienes preguntas marcadas'
          : 'No tienes preguntas falladas para repasar',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
      return;
    }

    setQuestionsList(questions);
  }, []);

  const currentQuestion = questionsList[currentIndex];

  const handleAnswerSelect = (index) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) {
      Alert.alert('Atención', 'Por favor selecciona una respuesta');
      return;
    }

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    recordAnswer(currentQuestion.id, isCorrect);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentIndex < questionsList.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      Alert.alert(
        '¡Completado!',
        `Has completado la revisión de ${questionsList.length} preguntas.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handleBookmark = () => {
    toggleBookmark(currentQuestion.id);
  };

  if (!currentQuestion) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  const isBookmarked = bookmarks.includes(currentQuestion.id);
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
  const questionStats = stats[currentQuestion.id] || { correct: 0, incorrect: 0 };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <Text style={styles.modeText}>
              {isBookmarkedMode ? '⭐ Marcadas' : '🔄 Repaso de Fallos'}
            </Text>
            <Text style={styles.progressText}>
              {currentIndex + 1} / {questionsList.length}
            </Text>
          </View>
          <TouchableOpacity onPress={handleBookmark} style={styles.bookmarkButton}>
            <Text style={styles.bookmarkIcon}>{isBookmarked ? '⭐' : '☆'}</Text>
          </TouchableOpacity>
        </View>

        {/* Block Tag */}
        <View style={styles.blockTag}>
          <Text style={styles.blockText}>{currentQuestion.block}</Text>
        </View>

        {/* Question Stats */}
        {(questionStats.correct > 0 || questionStats.incorrect > 0) && (
          <View style={styles.questionStats}>
            <Text style={styles.questionStatsText}>
              Historial: ✅ {questionStats.correct} | ❌ {questionStats.incorrect}
            </Text>
          </View>
        )}

        {/* Question */}
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => {
            let buttonStyle = [styles.optionButton];
            let textStyle = [styles.optionText];

            if (showResult) {
              if (index === currentQuestion.correctAnswer) {
                buttonStyle.push(styles.correctOption);
                textStyle.push(styles.correctOptionText);
              } else if (index === selectedAnswer && !isCorrect) {
                buttonStyle.push(styles.incorrectOption);
                textStyle.push(styles.incorrectOptionText);
              }
            } else if (selectedAnswer === index) {
              buttonStyle.push(styles.selectedOption);
            }

            return (
              <TouchableOpacity
                key={index}
                style={buttonStyle}
                onPress={() => handleAnswerSelect(index)}
                disabled={showResult}
              >
                <Text style={[styles.optionText, textStyle]}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Explanation */}
        {showResult && (
          <View
            style={[
              styles.explanationCard,
              isCorrect ? styles.correctCard : styles.incorrectCard,
            ]}
          >
            <Text style={styles.resultTitle}>
              {isCorrect ? '✅ ¡Correcto!' : '❌ Incorrecto'}
            </Text>
            <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionsContainer}>
          {!showResult ? (
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Validar Respuesta</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.navigationButtons}>
              <TouchableOpacity
                style={[styles.navButton, currentIndex === 0 && styles.disabledButton]}
                onPress={handlePrevious}
                disabled={currentIndex === 0}
              >
                <Text
                  style={[
                    styles.navButtonText,
                    currentIndex === 0 && styles.disabledButtonText,
                  ]}
                >
                  ← Anterior
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>
                  {currentIndex < questionsList.length - 1 ? 'Siguiente →' : 'Finalizar'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerInfo: {
    flex: 1,
  },
  modeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  bookmarkButton: {
    padding: 5,
  },
  bookmarkIcon: {
    fontSize: 28,
  },
  blockTag: {
    backgroundColor: '#3498db',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  blockText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  questionStats: {
    backgroundColor: '#ecf0f1',
    padding: 8,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  questionStatsText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionText: {
    fontSize: 18,
    color: '#2c3e50',
    lineHeight: 26,
    fontWeight: '500',
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  optionContent: {
    flexDirection: 'row',
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginRight: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#2c3e50',
    flex: 1,
    lineHeight: 22,
  },
  selectedOption: {
    borderColor: '#3498db',
    backgroundColor: '#e8f4f8',
  },
  correctOption: {
    borderColor: '#27ae60',
    backgroundColor: '#d5f4e6',
  },
  correctOptionText: {
    color: '#27ae60',
  },
  incorrectOption: {
    borderColor: '#e74c3c',
    backgroundColor: '#fadbd8',
  },
  incorrectOptionText: {
    color: '#e74c3c',
  },
  explanationCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  correctCard: {
    backgroundColor: '#d5f4e6',
  },
  incorrectCard: {
    backgroundColor: '#fadbd8',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  explanationText: {
    fontSize: 16,
    color: '#2c3e50',
    lineHeight: 24,
  },
  actionsContainer: {
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#3498db',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  navButton: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  navButtonText: {
    color: '#2c3e50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#27ae60',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
  },
  disabledButtonText: {
    color: '#ecf0f1',
  },
});
