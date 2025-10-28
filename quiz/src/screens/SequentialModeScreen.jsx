import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../hooks/useQuiz';
import './SequentialModeScreen.css';

export default function SequentialModeScreen() {
  const navigate = useNavigate();
  const { questions } = useQuiz();

  // Obtener bloques únicos
  const blocks = [...new Set(questions.map(q => q.block))];

  return (
    <div className="container sequential-mode-container">
      <div className="content">
        <h1 className="sequential-title">📋 Práctica en Orden</h1>
        <p className="sequential-subtitle">
          Elige qué preguntas quieres practicar en orden secuencial
        </p>

        <div className="sequential-options">
          {/* Opción: Todas las preguntas */}
          <button
            className="sequential-option-card all-questions"
            onClick={() => navigate('/review/sequential')}
          >
            <div className="option-icon">📚</div>
            <div className="option-content">
              <h3 className="option-title">Todas las Preguntas</h3>
              <p className="option-description">
                Practica las {questions.length} preguntas del módulo en orden
              </p>
            </div>
          </button>

          {/* Opción: Por bloques */}
          <div className="blocks-section">
            <h2 className="blocks-title">O selecciona un bloque:</h2>
            <div className="blocks-list">
              {blocks.map((block, index) => {
                const blockQuestions = questions.filter(q => q.block === block);
                return (
                  <button
                    key={index}
                    className="sequential-option-card block-card"
                    onClick={() => navigate(`/review/block/${encodeURIComponent(block)}`)}
                  >
                    <div className="option-icon">📘</div>
                    <div className="option-content">
                      <h3 className="option-title">{block}</h3>
                      <p className="option-description">
                        {blockQuestions.length} preguntas
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Back button */}
        <button className="back-button" onClick={() => navigate('/')}>
          ← Volver al inicio
        </button>
      </div>
    </div>
  );
}
