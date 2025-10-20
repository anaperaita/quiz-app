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

export default function QuizScreen({ navigation, route }) {
  const {
    getWeightedRandomQuestion,
    recordAnswer,
    toggleBookmark,
    bookmarks,
    stats,
  } = useQuiz();

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [askedQuestions, setAskedQuestions] = useState([]);

  useEffect(() => {
    loadNextQuestion();
  }, []);

  const loadNextQuestion = () => {
    const question = getWeightedRandomQuestion(askedQuestions);
    if (!question) {
      Alert.alert(
        '¡Completado!',
        'Has practicado todas las preguntas disponibles.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
      return;
    }
    setCurrentQuestion(question);
    setSelectedAnswer(null);
    setShowResult(false);
    setAskedQuestions([...askedQuestions, question.id]);
  };

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
    loadNextQuestion();
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
          <View style={styles.blockTag}>
            <Text style={styles.blockText}>{currentQuestion.block}</Text>
          </View>
          <TouchableOpacity onPress={handleBookmark} style={styles.bookmarkButton}>
            <Text style={styles.bookmarkIcon}>{isBookmarked ? '⭐' : '☆'}</Text>
          </TouchableOpacity>
        </View>

        {/* Question Stats */}
        {(questionStats.correct > 0 || questionStats.incorrect > 0) && (
          <View style={styles.questionStats}>
            <Text style={styles.questionStatsText}>
              ✅ {questionStats.correct} | ❌ {questionStats.incorrect}
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
          <View style={[styles.explanationCard, isCorrect ? styles.correctCard : styles.incorrectCard]}>
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
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Siguiente Pregunta →</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Progress */}
        <Text style={styles.progressText}>
          Preguntas respondidas en esta sesión: {askedQuestions.length}
        </Text>
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
  blockTag: {
    backgroundColor: '#3498db',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flex: 1,
    marginRight: 10,
  },
  blockText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bookmarkButton: {
    padding: 5,
  },
  bookmarkIcon: {
    fontSize: 28,
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
    alignItems: 'flex-start',
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginRight: 4,
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
  nextButton: {
    backgroundColor: '#27ae60',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressText: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontSize: 14,
  },
});
