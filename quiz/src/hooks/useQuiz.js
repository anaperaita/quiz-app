import { useContext } from 'react';
import { QuizContext } from '../context/QuizContext';

/**
 * Custom hook to access Quiz context
 * Must be used within a QuizProvider
 * @returns {Object} Quiz context value containing:
 *   - questions: Array of current module questions
 *   - stats: User statistics object
 *   - bookmarks: Array of bookmarked question IDs
 *   - loading: Boolean loading state
 *   - selectedModule: Current module ID
 *   - setSelectedModule: Function to change module
 *   - availableModules: Array of available modules
 *   - recordAnswer: Function to record answer
 *   - toggleBookmark: Function to toggle bookmark
 *   - getWeightedRandomQuestion: Function to get weighted random question
 *   - getIncorrectQuestions: Function to get failed questions
 *   - getBookmarkedQuestions: Function to get bookmarked questions
 *   - getQuestionsByBlock: Function to get questions by block
 *   - getGlobalStats: Function to calculate global statistics
 *   - resetStats: Function to reset all statistics
 */
export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
