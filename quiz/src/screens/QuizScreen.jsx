import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
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
      alert('¡Has practicado todas las preguntas disponibles!');
      navigate('/');
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
      alert('Por favor selecciona una respuesta');
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
          {currentQuestion.options.map((option, index) => {
            let className = 'option-button';

            if (showResult) {
              if (index === currentQuestion.correctAnswer) {
                className += ' correct-option';
              } else if (index === selectedAnswer && !isCorrect) {
                className += ' incorrect-option';
              }
            } else if (selectedAnswer === index) {
              className += ' selected-option';
            }

            return (
              <button
                key={index}
                className={className}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
              >
                <span className="option-text">{option}</span>
              </button>
            );
          })}
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

        {/* Progress */}
        <p className="progress-text">
          Preguntas respondidas en esta sesión: {askedQuestions.length}
        </p>

        {/* Back button */}
        <button className="back-button" onClick={() => navigate('/')}>
          ← Volver al inicio
        </button>
      </div>
    </div>
  );
}
