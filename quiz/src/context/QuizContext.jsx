import React, { createContext, useState, useEffect, useContext } from 'react';
import modulo4Data from '../data/modulo4.json';
import modulo5Data from '../data/modulo5.json';
import modulo6Data from '../data/modulo6.json';

const QuizContext = createContext();

// Disponibilidad de módulos
const MODULES = [
  { id: 'modulo4', name: 'Módulo 4: Renta Variable', data: modulo4Data },
  { id: 'modulo5', name: 'Módulo 5: Renta Fija', data: modulo5Data },
  { id: 'modulo6', name: 'Módulo 6: Materias Primas', data: modulo6Data },
];

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

export const QuizProvider = ({ children }) => {
  const [selectedModule, setSelectedModule] = useState('modulo4');
  const [questions, setQuestions] = useState(modulo4Data.questions);
  const [stats, setStats] = useState({});
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos guardados al iniciar
  useEffect(() => {
    loadData();
  }, []);

  // Actualizar preguntas cuando cambia el módulo
  useEffect(() => {
    const module = MODULES.find(m => m.id === selectedModule);
    if (module) {
      setQuestions(module.data.questions);
    }
  }, [selectedModule]);

  const loadData = () => {
    try {
      const savedStats = localStorage.getItem('quizStats');
      const savedBookmarks = localStorage.getItem('bookmarks');

      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }
      if (savedBookmarks) {
        setBookmarks(JSON.parse(savedBookmarks));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveStats = (newStats) => {
    try {
      localStorage.setItem('quizStats', JSON.stringify(newStats));
      setStats(newStats);
    } catch (error) {
      console.error('Error saving stats:', error);
    }
  };

  const saveBookmarks = (newBookmarks) => {
    try {
      localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
      setBookmarks(newBookmarks);
    } catch (error) {
      console.error('Error saving bookmarks:', error);
    }
  };

  // Registrar respuesta de una pregunta
  const recordAnswer = (questionId, isCorrect) => {
    const newStats = { ...stats };

    if (!newStats[questionId]) {
      newStats[questionId] = {
        correct: 0,
        incorrect: 0,
        lastAttempt: null,
      };
    }

    if (isCorrect) {
      newStats[questionId].correct += 1;
    } else {
      newStats[questionId].incorrect += 1;
    }

    newStats[questionId].lastAttempt = new Date().toISOString();
    saveStats(newStats);
  };

  // Toggle bookmark
  const toggleBookmark = (questionId) => {
    let newBookmarks;
    if (bookmarks.includes(questionId)) {
      newBookmarks = bookmarks.filter(id => id !== questionId);
    } else {
      newBookmarks = [...bookmarks, questionId];
    }
    saveBookmarks(newBookmarks);
  };

  // Obtener preguntas con peso según fallos y frecuencia
  const getWeightedRandomQuestion = (excludeIds = []) => {
    const availableQuestions = questions.filter(q => !excludeIds.includes(q.id));

    if (availableQuestions.length === 0) return null;

    // Encontrar la frecuencia mínima (pregunta menos vista)
    const frequencies = availableQuestions.map(q => {
      const questionStats = stats[q.id] || { correct: 0, incorrect: 0 };
      return questionStats.correct + questionStats.incorrect;
    });
    const minFrequency = Math.min(...frequencies);

    // Calcular peso para cada pregunta
    const weightedQuestions = availableQuestions.map(q => {
      const questionStats = stats[q.id] || { correct: 0, incorrect: 0 };
      const totalAttempts = questionStats.correct + questionStats.incorrect;

      // Si nunca se ha respondido, peso MUY alto (máxima prioridad)
      if (totalAttempts === 0) {
        return { question: q, weight: 5 };
      }

      // Calcular peso basado en tasa de fallos
      const failureRate = questionStats.incorrect / totalAttempts;
      let weight = failureRate * 3 + 0.5;

      // Bonus: inversamente proporcional a la frecuencia relativa
      // 1 / (frecuencia - frecuencia_minima + 1)
      const frequencyBonus = 1 / (totalAttempts - minFrequency + 1);
      weight = weight * (1 + frequencyBonus);

      return { question: q, weight };
    });

    // Seleccionar pregunta aleatoria ponderada
    const totalWeight = weightedQuestions.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;

    for (const item of weightedQuestions) {
      random -= item.weight;
      if (random <= 0) {
        return item.question;
      }
    }

    return weightedQuestions[0].question;
  };

  // Obtener preguntas incorrectas
  const getIncorrectQuestions = () => {
    return questions.filter(q => {
      const questionStats = stats[q.id];
      return questionStats && questionStats.incorrect > questionStats.correct;
    });
  };

  // Obtener preguntas marcadas
  const getBookmarkedQuestions = () => {
    return questions.filter(q => bookmarks.includes(q.id));
  };

  // Obtener preguntas por bloque
  const getQuestionsByBlock = (blockName) => {
    return questions.filter(q => q.block === blockName);
  };

  // Calcular estadísticas globales (solo para el módulo actual)
  const getGlobalStats = () => {
    const totalQuestions = questions.length;

    // Filtrar solo las preguntas del módulo actual
    const currentModuleQuestionIds = questions.map(q => q.id);
    const currentModuleStats = Object.entries(stats)
      .filter(([questionId]) => currentModuleQuestionIds.includes(questionId));

    const answeredQuestions = currentModuleStats.length;
    let totalCorrect = 0;
    let totalIncorrect = 0;

    currentModuleStats.forEach(([, s]) => {
      totalCorrect += s.correct;
      totalIncorrect += s.incorrect;
    });

    const totalAttempts = totalCorrect + totalIncorrect;
    const accuracy = totalAttempts > 0 ? (totalCorrect / totalAttempts * 100).toFixed(1) : 0;

    return {
      totalQuestions,
      answeredQuestions,
      totalCorrect,
      totalIncorrect,
      totalAttempts,
      accuracy,
    };
  };

  // Resetear estadísticas
  const resetStats = () => {
    try {
      localStorage.removeItem('quizStats');
      setStats({});
    } catch (error) {
      console.error('Error resetting stats:', error);
    }
  };

  const value = {
    questions,
    stats,
    bookmarks,
    loading,
    selectedModule,
    setSelectedModule,
    availableModules: MODULES,
    recordAnswer,
    toggleBookmark,
    getWeightedRandomQuestion,
    getIncorrectQuestions,
    getBookmarkedQuestions,
    getQuestionsByBlock,
    getGlobalStats,
    resetStats,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};
