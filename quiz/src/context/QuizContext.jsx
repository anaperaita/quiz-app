import React, { createContext, useState, useEffect } from 'react';
import modulesConfig from '../data/modules.config.json';
import * as storage from '../services/storage';
import * as questionService from '../services/questionService';
import * as statsService from '../services/statsService';

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
    const newStats = statsService.recordAnswer(stats, questionId, isCorrect);
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
    return questionService.getWeightedRandomQuestion(questions, stats, excludeIds);
  };

  // Obtener preguntas incorrectas
  const getIncorrectQuestions = () => {
    return questionService.getIncorrectQuestions(questions, stats);
  };

  // Obtener preguntas marcadas
  const getBookmarkedQuestions = () => {
    return questionService.getBookmarkedQuestions(questions, bookmarks);
  };

  // Obtener preguntas por bloque
  const getQuestionsByBlock = (blockName) => {
    return questionService.getQuestionsByBlock(questions, blockName);
  };

  // Calcular estadísticas globales (solo para el módulo actual)
  const getGlobalStats = () => {
    return statsService.calculateGlobalStats(questions, stats);
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
