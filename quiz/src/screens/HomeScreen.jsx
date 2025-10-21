import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import './HomeScreen.css';

export default function HomeScreen() {
  const navigate = useNavigate();
  const {
    getGlobalStats,
    loading,
    bookmarks,
    getIncorrectQuestions,
    selectedModule,
    setSelectedModule,
    availableModules,
  } = useQuiz();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  const globalStats = getGlobalStats();
  const incorrectCount = getIncorrectQuestions().length;

  return (
    <div className="container">
      <div className="content">
        {/* Header */}
        <h1 className="title">Visual Quiz</h1>

        {/* Module Selector */}
        <div className="module-selector-container">
          <p className="module-selector-label">Selecciona Módulo:</p>
          <div className="module-buttons">
            {availableModules.map(module => (
              <button
                key={module.id}
                className={`module-button ${selectedModule === module.id ? 'active' : ''}`}
                onClick={() => setSelectedModule(module.id)}
              >
                {module.name}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Layout */}
        <div className="dashboard-layout">
          {/* Left Panel - Stats & Info */}
          <div className="left-panel">
            {/* Statistics Card */}
            <div className="card stats-card">
              <h2 className="card-title">Tu Progreso</h2>
              <div className="stats-list">
                <div className="stat-row-item">
                  <span className="stat-icon">📝</span>
                  <div className="stat-info">
                    <p className="stat-value">{globalStats.answeredQuestions}</p>
                    <p className="stat-label">Respondidas</p>
                  </div>
                </div>
                <div className="stat-row-item">
                  <span className="stat-icon">📚</span>
                  <div className="stat-info">
                    <p className="stat-value">{globalStats.totalQuestions}</p>
                    <p className="stat-label">Total</p>
                  </div>
                </div>
                <div className="stat-row-item">
                  <span className="stat-icon">🎯</span>
                  <div className="stat-info">
                    <p className="stat-value accuracy">{globalStats.accuracy}%</p>
                    <p className="stat-label">Precisión</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="info-card">
              <p className="info-text">
                💡 El sistema prioriza automáticamente las preguntas que has fallado más veces
              </p>
            </div>
          </div>

          {/* Right Panel - Actions */}
          <div className="right-panel">
            <div className="buttons-grid">
              <button
                className="button primary-button"
                onClick={() => navigate('/quiz')}
              >
                <span className="button-text primary">📚 Practicar</span>
                <span className="button-subtext primary">Preguntas aleatorias inteligentes</span>
              </button>

              <button
                className="button secondary-button"
                onClick={() => navigate('/review')}
                disabled={incorrectCount === 0}
              >
                <span className={`button-text ${incorrectCount === 0 ? 'disabled' : ''}`}>
                  🔄 Repasar Fallos ({incorrectCount})
                </span>
                <span className={`button-subtext ${incorrectCount === 0 ? 'disabled' : ''}`}>
                  {incorrectCount === 0
                    ? 'No tienes preguntas falladas'
                    : 'Practica tus preguntas difíciles'}
                </span>
              </button>

              <button
                className="button secondary-button"
                onClick={() => navigate('/review/bookmarked')}
                disabled={bookmarks.length === 0}
              >
                <span className={`button-text ${bookmarks.length === 0 ? 'disabled' : ''}`}>
                  ⭐ Marcadas ({bookmarks.length})
                </span>
                <span className={`button-subtext ${bookmarks.length === 0 ? 'disabled' : ''}`}>
                  {bookmarks.length === 0
                    ? 'No has marcado preguntas'
                    : 'Repasa preguntas marcadas'}
                </span>
              </button>

              <button
                className="button stats-button"
                onClick={() => navigate('/statistics')}
              >
                <span className="button-text stats">📊 Estadísticas</span>
                <span className="button-subtext stats">Ver tu rendimiento detallado</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
