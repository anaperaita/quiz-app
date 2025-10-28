import { useState } from 'react';

/**
 * Custom hook for question interaction logic
 * Shared between QuizScreen and ReviewScreen
 * Handles answer selection, submission, and result display
 *
 * @param {Function} onAnswerSubmit - Callback when answer is submitted (questionId, isCorrect)
 * @returns {Object} Question interaction state and handlers
 */
export const useQuestionInteraction = (onAnswerSubmit) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  /**
   * Handle answer selection
   * @param {number} index - Selected answer index
   */
  const handleAnswerSelect = (index) => {
    if (showResult) return; // Prevent selection after submission
    setSelectedAnswer(index);
  };

  /**
   * Submit the selected answer
   * @param {Object} currentQuestion - Current question object
   * @param {Function} onSuccess - Optional callback on successful submission
   * @returns {boolean|null} True if correct, false if incorrect, null if no answer selected
   */
  const handleSubmit = (currentQuestion, onSuccess) => {
    if (selectedAnswer === null) {
      return null; // No answer selected
    }

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    // Call the submission callback
    if (onAnswerSubmit) {
      onAnswerSubmit(currentQuestion.id, isCorrect);
    }

    setShowResult(true);

    // Call optional success callback
    if (onSuccess) {
      onSuccess(isCorrect);
    }

    return isCorrect;
  };

  /**
   * Reset state for next question
   */
  const resetInteraction = () => {
    setSelectedAnswer(null);
    setShowResult(false);
  };

  /**
   * Get CSS class for option button
   * @param {number} index - Option index
   * @param {number} correctAnswer - Correct answer index
   * @returns {string} CSS class name
   */
  const getOptionClass = (index, correctAnswer) => {
    let className = 'option-button';

    if (showResult) {
      if (index === correctAnswer) {
        className += ' correct-option';
      } else if (index === selectedAnswer && selectedAnswer !== correctAnswer) {
        className += ' incorrect-option';
      }
    } else if (selectedAnswer === index) {
      className += ' selected-option';
    }

    return className;
  };

  return {
    selectedAnswer,
    showResult,
    handleAnswerSelect,
    handleSubmit,
    resetInteraction,
    getOptionClass,
  };
};

export default useQuestionInteraction;
