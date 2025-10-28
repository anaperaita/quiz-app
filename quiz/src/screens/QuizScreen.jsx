import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../hooks/useQuiz';
import { useToast } from '../hooks/useToast';
import { useQuestionInteraction } from '../hooks/useQuestionInteraction';
import { calculateSessionAccuracy } from '../utils/calculations';
import Toast from '../components/Toast';
import './QuizScreen.css';

export default function QuizScreen() {
  const navigate = useNavigate();
  const {
    getWeightedRandomQuestion,
    recordAnswer,
    toggleBookmark,
    bookmarks,
    stats,
  } = useQuiz();

  const { toast, showInfo, showWarning, hideToast } = useToast();

  const {
    selectedAnswer,
    showResult,
    handleAnswerSelect,
    handleSubmit: submitAnswer,
    resetInteraction,
    getOptionClass,
  } = useQuestionInteraction(recordAnswer);

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [askedQuestions, setAskedQuestions] = useState([]);
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 });

  /**
   * Load next weighted random question
   * Uses functional state updates to avoid dependency on askedQuestions
   */
  const loadNextQuestion = useCallback(() => {
    setAskedQuestions(prevAsked => {
      const question = getWeightedRandomQuestion(prevAsked);
      if (!question) {
        showInfo('¡Has practicado todas las preguntas disponibles! Volviendo al inicio...', 4000);
        setTimeout(() => navigate('/'), 1000);
        return prevAsked;
      }
      setCurrentQuestion(question);
      resetInteraction();
      return [...prevAsked, question.id];
    });
  }, [getWeightedRandomQuestion, navigate, showInfo, resetInteraction]);

  // Load first question on mount only
  useEffect(() => {
    loadNextQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = () => {
    const result = submitAnswer(currentQuestion, (isCorrect) => {
      // Update session stats
      setSessionStats(prev => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        incorrect: prev.incorrect + (isCorrect ? 0 : 1)
      }));
    });

    if (result === null) {
      showWarning('Por favor selecciona una respuesta');
    }
  };

  const handleNext = () => {
    loadNextQuestion();
  };

  const handleBookmark = () => {
    toggleBookmark(currentQuestion.id);
  };

  if (!currentQuestion) {
    return (
      <div className="container">
        <p>Cargando...</p>
      </div>
    );
  }

  const isBookmarked = bookmarks.includes(currentQuestion.id);
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
  const questionStats = stats[currentQuestion.id] || { correct: 0, incorrect: 0 };

  return (
    <div className="container quiz-container">
      {toast && <Toast {...toast} onClose={hideToast} />}
      <div className="content">
        {/* Header */}
        <div className="header">
          <div className="block-tag">
            <span className="block-text">{currentQuestion.block}</span>
          </div>
          <button onClick={handleBookmark} className="bookmark-button">
            <span className="bookmark-icon">{isBookmarked ? '⭐' : '☆'}</span>
          </button>
        </div>

        {/* Question Stats */}
        {(questionStats.correct > 0 || questionStats.incorrect > 0) && (
          <div className="question-stats">
            <p className="question-stats-text">
              ✅ {questionStats.correct} | ❌ {questionStats.incorrect}
            </p>
          </div>
        )}

        {/* Question */}
        <div className="question-card">
          <p className="question-text">{currentQuestion.question}</p>
        </div>

        {/* Options */}
        <div className="options-container">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={getOptionClass(index, currentQuestion.correctAnswer)}
              onClick={() => handleAnswerSelect(index)}
              disabled={showResult}
            >
              <span className="option-text">{option}</span>
            </button>
          ))}
        </div>

        {/* Explanation */}
        {showResult && (
          <div className={`explanation-card ${isCorrect ? 'correct-card' : 'incorrect-card'}`}>
            <p className="result-title">
              {isCorrect ? '✅ ¡Correcto!' : '❌ Incorrecto'}
            </p>
            <p className="explanation-text">{currentQuestion.explanation}</p>
          </div>
        )}

        {/* Actions */}
        <div className="actions-container">
          {!showResult ? (
            <button className="submit-button" onClick={handleSubmit}>
              Validar Respuesta
            </button>
          ) : (
            <button className="next-button" onClick={handleNext}>
              Siguiente Pregunta →
            </button>
          )}
        </div>

        {/* Session Stats */}
        <div className="session-stats">
          <div className="session-stat-item">
            <span className="session-stat-label">Sesión:</span>
            <span className="session-stat-value">
              {askedQuestions.length} preguntas
            </span>
          </div>
          {(sessionStats.correct > 0 || sessionStats.incorrect > 0) && (
            <>
              <div className="session-stat-item">
                <span className="session-stat-icon">✅</span>
                <span className="session-stat-value">{sessionStats.correct}</span>
              </div>
              <div className="session-stat-item">
                <span className="session-stat-icon">❌</span>
                <span className="session-stat-value">{sessionStats.incorrect}</span>
              </div>
              <div className="session-stat-item">
                <span className="session-stat-icon">🎯</span>
                <span className="session-stat-value">
                  {calculateSessionAccuracy(sessionStats)}%
                </span>
              </div>
            </>
          )}
        </div>

        {/* Back button */}
        <button className="back-button" onClick={() => navigate('/')}>
          ← Volver al inicio
        </button>
      </div>
    </div>
  );
}
