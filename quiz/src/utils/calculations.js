/**
 * Utility functions for common calculations
 */

/**
 * Calculate accuracy percentage
 * @param {number} correct - Number of correct answers
 * @param {number} incorrect - Number of incorrect answers
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {number} Accuracy percentage
 */
export const calculateAccuracy = (correct, incorrect, decimals = 1) => {
  const total = correct + incorrect;
  if (total === 0) return 0;

  const accuracy = (correct / total) * 100;
  return Number(accuracy.toFixed(decimals));
};

/**
 * Calculate accuracy percentage and return as string
 * @param {number} correct - Number of correct answers
 * @param {number} incorrect - Number of incorrect answers
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} Accuracy percentage as string (e.g. "85%")
 */
export const calculateAccuracyString = (correct, incorrect, decimals = 0) => {
  const accuracy = calculateAccuracy(correct, incorrect, decimals);
  return `${accuracy}%`;
};

/**
 * Format percentage value
 * @param {number} value - Numeric value (0-100)
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} Formatted percentage (e.g. "85%")
 */
export const formatPercentage = (value, decimals = 0) => {
  return `${Number(value).toFixed(decimals)}%`;
};

/**
 * Calculate completion percentage
 * @param {number} completed - Number of completed items
 * @param {number} total - Total number of items
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {number} Completion percentage
 */
export const calculateCompletionPercentage = (completed, total, decimals = 1) => {
  if (total === 0) return 0;

  const percentage = (completed / total) * 100;
  return Number(percentage.toFixed(decimals));
};

/**
 * Calculate session accuracy from session stats
 * @param {Object} sessionStats - Object with correct and incorrect counts
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {number} Accuracy percentage
 */
export const calculateSessionAccuracy = (sessionStats, decimals = 0) => {
  return calculateAccuracy(
    sessionStats.correct,
    sessionStats.incorrect,
    decimals
  );
};

export default {
  calculateAccuracy,
  calculateAccuracyString,
  formatPercentage,
  calculateCompletionPercentage,
  calculateSessionAccuracy,
};
