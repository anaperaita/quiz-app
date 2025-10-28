/**
 * Question Service
 * Handles question filtering and selection logic
 */

import {
  UNANSWERED_QUESTION_WEIGHT,
  FAILURE_RATE_MULTIPLIER,
  BASE_WEIGHT,
} from '../constants/quiz';

/**
 * Get questions that have been answered incorrectly more than correctly
 * @param {Array} questions - All questions
 * @param {Object} stats - Statistics object
 * @returns {Array} Failed questions
 */
export const getIncorrectQuestions = (questions, stats) => {
  return questions.filter(q => {
    const questionStats = stats[q.id];
    return questionStats && questionStats.incorrect > questionStats.correct;
  });
};

/**
 * Get bookmarked questions
 * @param {Array} questions - All questions
 * @param {Array} bookmarks - Array of bookmarked question IDs
 * @returns {Array} Bookmarked questions
 */
export const getBookmarkedQuestions = (questions, bookmarks) => {
  return questions.filter(q => bookmarks.includes(q.id));
};

/**
 * Get questions by block name
 * @param {Array} questions - All questions
 * @param {string} blockName - Block name to filter by
 * @returns {Array} Questions in the block
 */
export const getQuestionsByBlock = (questions, blockName) => {
  return questions.filter(q => q.block === blockName);
};

/**
 * Calculate weighted random question selection
 * Uses adaptive algorithm that prioritizes:
 * 1. Unanswered questions (highest priority)
 * 2. Questions with high failure rate
 * 3. Questions seen less frequently
 *
 * @param {Array} questions - Available questions
 * @param {Object} stats - Statistics object
 * @param {Array} excludeIds - Question IDs to exclude
 * @returns {Object|null} Selected question or null if none available
 */
export const getWeightedRandomQuestion = (questions, stats, excludeIds = []) => {
  const availableQuestions = questions.filter(q => !excludeIds.includes(q.id));

  if (availableQuestions.length === 0) return null;

  // Find minimum frequency (least seen question)
  const frequencies = availableQuestions.map(q => {
    const questionStats = stats[q.id] || { correct: 0, incorrect: 0 };
    return questionStats.correct + questionStats.incorrect;
  });
  const minFrequency = Math.min(...frequencies);

  // Calculate weight for each question
  const weightedQuestions = availableQuestions.map(q => {
    const questionStats = stats[q.id] || { correct: 0, incorrect: 0 };
    const totalAttempts = questionStats.correct + questionStats.incorrect;

    // Unanswered questions get maximum priority
    if (totalAttempts === 0) {
      return { question: q, weight: UNANSWERED_QUESTION_WEIGHT };
    }

    // Calculate weight based on failure rate
    const failureRate = questionStats.incorrect / totalAttempts;
    let weight = failureRate * FAILURE_RATE_MULTIPLIER + BASE_WEIGHT;

    // Bonus: inversely proportional to relative frequency
    // Less frequently seen questions get higher priority
    const frequencyBonus = 1 / (totalAttempts - minFrequency + 1);
    weight = weight * (1 + frequencyBonus);

    return { question: q, weight };
  });

  // Select random question using weighted probability
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

export default {
  getIncorrectQuestions,
  getBookmarkedQuestions,
  getQuestionsByBlock,
  getWeightedRandomQuestion,
};
