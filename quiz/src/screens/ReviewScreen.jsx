import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuiz } from '../hooks/useQuiz';
import { useToast } from '../hooks/useToast';
import { useQuestionInteraction } from '../hooks/useQuestionInteraction';
import Toast from '../components/Toast';
import './ReviewScreen.css';

export default function ReviewScreen() {
  const navigate = useNavigate();
  const { mode, blockName } = useParams();
  const {
    questions,
    getIncorrectQuestions,
    getBookmarkedQuestions,
    getQuestionsByBlock,
    recordAnswer,
    toggleBookmark,
    bookmarks,
    stats,
  } = useQuiz();

  const { toast, showInfo, showWarning, showSuccess, hideToast } = useToast();

  const {
    selectedAnswer,
    showResult,
    navEnabled,
    handleAnswerSelect,
    handleSubmit: submitAnswer,
    resetInteraction,
    getOptionClass,
  } = useQuestionInteraction(recordAnswer);

  const isBookmarkedMode = mode === 'bookmarked';
  const isBlockMode = mode === 'block';
  const isSequentialMode = mode === 'sequential';
  const [questionsList, setQuestionsList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Load questions only once on mount — NOT reactively on stats changes.
  // Re-loading on stats changes caused the list to reshuffle mid-session,
  // making the current question change under the user after answering.
  useEffect(() => {
    let questionList;

    if (isSequentialMode) {
      questionList = [...questions];
    } else if (isBlockMode) {
      const decodedBlockName = decodeURIComponent(blockName);
      questionList = getQuestionsByBlock(decodedBlockName);
    } else if (isBookmarkedMode) {
      questionList = getBookmarkedQuestions();
    } else {
      questionList = getIncorrectQuestions();
    }

    if (questionList.length === 0) {
      let message;
      if (isSequentialMode) {
        message = 'No hay preguntas disponibles';
      } else if (isBlockMode) {
        message = 'No se encontraron preguntas para este bloque';
      } else if (isBookmarkedMode) {
        message = 'No tienes preguntas marcadas';
      } else {
        message = 'No tienes preguntas falladas para repasar';
      }
      showInfo(`${message}. Volviendo al inicio...`, 3000);
      setTimeout(() => navigate('/'), 1000);
      return;
    }

    setQuestionsList(questionList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentQuestion = questionsList[currentIndex];

  const handleSubmit = () => {
    const result = submitAnswer(currentQuestion);

    if (result === null) {
      showWarning('Por favor selecciona una respuesta');
    }
  };

  const handleNext = () => {
    const wasCorrect = selectedAnswer === currentQuestion.correctAnswer;

    // In failures mode, remove correctly answered questions from the list
    // on navigation (not reactively) to avoid mid-session jumps.
    let updatedList = questionsList;
    let nextIndex = currentIndex + 1;

    if (wasCorrect && !isSequentialMode && !isBlockMode) {
      updatedList = questionsList.filter((_, idx) => idx !== currentIndex);
      nextIndex = currentIndex; // same index now points to the next question
      setQuestionsList(updatedList);
    }

    if (updatedList.length === 0 || nextIndex >= updatedList.length) {
      showSuccess(`¡Has completado la revisión!`, 3000);
      setTimeout(() => navigate('/'), 1500);
      return;
    }

    setCurrentIndex(nextIndex);
    resetInteraction();
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      resetInteraction();
    }
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
    <div className="container review-container">
      {toast && <Toast {...toast} onClose={hideToast} />}
      <div className="content">
        {/* Header */}
        <div className="review-header">
          <div className="header-info">
            <p className="mode-text">
              {isSequentialMode
                ? '📋 Modo Secuencial'
                : isBlockMode
                ? `📘 ${decodeURIComponent(blockName)}`
                : isBookmarkedMode
                ? '⭐ Marcadas'
                : '🔄 Repaso de Fallos'}
            </p>
            <p className="progress-text-review">
              {currentIndex + 1} / {questionsList.length}
            </p>
          </div>
          <button onClick={handleBookmark} className="bookmark-button">
            <span className="bookmark-icon">{isBookmarked ? '⭐' : '☆'}</span>
          </button>
        </div>

        {/* Block Tag */}
        <div className="block-tag-review">
          <span className="block-text">{currentQuestion.block}</span>
        </div>

        {/* Question Stats */}
        {(questionStats.correct > 0 || questionStats.incorrect > 0) && (
          <div className="question-stats">
            <p className="question-stats-text">
              Historial: ✅ {questionStats.correct} | ❌ {questionStats.incorrect}
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
            <div className="navigation-buttons">
              <button
                className={`nav-button ${currentIndex === 0 || !navEnabled ? 'disabled' : ''}`}
                onClick={handlePrevious}
                disabled={currentIndex === 0 || !navEnabled}
              >
                ← Anterior
              </button>

              <button className="next-button-nav" onClick={handleNext} disabled={!navEnabled}>
                {currentIndex < questionsList.length - 1 ? 'Siguiente →' : 'Finalizar'}
              </button>
            </div>
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
