import React, { createContext, useState, useEffect } from 'react';
import modulesConfig from '../data/modules.config.json';
import * as storage from '../services/storage';
import {
  UNANSWERED_QUESTION_WEIGHT,
  FAILURE_RATE_MULTIPLIER,
  BASE_WEIGHT,
} from '../constants/quiz';

// eslint-disable-next-line react-refresh/only-export-components
export const QuizContext = createContext();

/**
 * Dynamically load all modules based on modules.config.json
 * Uses Vite's glob import for efficient module loading
 * Returns an array of module objects
 */
const loadModules = () => {
  try {
    // Vite's glob import - eagerly imports all JSON files in /data directory
    const moduleFiles = import.meta.glob('../data/*.json', { eager: true });

    // Map config modules to their loaded data
    const modules = modulesConfig.modules.map((moduleInfo) => {
      const modulePath = `../data/${moduleInfo.file}`;
      const moduleData = moduleFiles[modulePath];

      if (!moduleData) {
        console.warn(`Module file not found: ${moduleInfo.file}`);
        return null;
      }

      return {
        id: moduleInfo.id,
        name: moduleInfo.name,
        data: moduleData.default,
      };
    }).filter(Boolean); // Remove any null entries

    return modules;
  } catch (error) {
    console.error('Error loading modules:', error);
    return [];
  }
};

export const QuizProvider = ({ children }) => {
  const [availableModules, setAvailableModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [stats, setStats] = useState({});
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar módulos dinámicamente al iniciar
  useEffect(() => {
    const modules = loadModules();
    setAvailableModules(modules);

    // Set default module to first available module
    if (modules.length > 0) {
      const defaultModuleId = modules[0].id;
      setSelectedModule(defaultModuleId);
      setQuestions(modules[0].data.questions);
    }

    loadData();
  }, []);

  // Actualizar preguntas cuando cambia el módulo
  useEffect(() => {
    if (selectedModule && availableModules.length > 0) {
      const module = availableModules.find(m => m.id === selectedModule);
      if (module) {
        setQuestions(module.data.questions);
      }
    }
  }, [selectedModule, availableModules]);

  const loadData = () => {
    try {
      const savedStats = storage.getStats();
      const savedBookmarks = storage.getBookmarks();

      if (savedStats) {
        setStats(savedStats);
      }
      if (savedBookmarks) {
        setBookmarks(savedBookmarks);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveStatsToStorage = (newStats) => {
    const success = storage.saveStats(newStats);
    if (success) {
      setStats(newStats);
    }
  };

  const saveBookmarksToStorage = (newBookmarks) => {
    const success = storage.saveBookmarks(newBookmarks);
    if (success) {
      setBookmarks(newBookmarks);
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
    saveStatsToStorage(newStats);
  };

  // Toggle bookmark
  const toggleBookmark = (questionId) => {
    let newBookmarks;
    if (bookmarks.includes(questionId)) {
      newBookmarks = bookmarks.filter(id => id !== questionId);
    } else {
      newBookmarks = [...bookmarks, questionId];
    }
    saveBookmarksToStorage(newBookmarks);
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
        return { question: q, weight: UNANSWERED_QUESTION_WEIGHT };
      }

      // Calcular peso basado en tasa de fallos
      const failureRate = questionStats.incorrect / totalAttempts;
      let weight = failureRate * FAILURE_RATE_MULTIPLIER + BASE_WEIGHT;

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
    const success = storage.resetAllData();
    if (success) {
      setStats({});
      setBookmarks([]);
    }
  };

  const value = {
    questions,
    stats,
    bookmarks,
    loading,
    selectedModule,
    setSelectedModule,
    availableModules,
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
