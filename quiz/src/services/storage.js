/**
 * Storage Service
 * Abstraction layer for data persistence
 * Makes it easy to swap storage mechanisms (LocalStorage, SessionStorage, IndexedDB, etc.)
 */

const STORAGE_KEYS = {
  QUIZ_STATS: 'quizStats',
  BOOKMARKS: 'bookmarks',
};

/**
 * Get item from storage
 * @param {string} key - Storage key
 * @returns {any|null} Parsed value or null if not found/error
 */
export const getItem = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error reading from storage (key: ${key}):`, error);
    return null;
  }
};

/**
 * Set item in storage
 * @param {string} key - Storage key
 * @param {any} value - Value to store (will be JSON stringified)
 * @returns {boolean} Success status
 */
export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to storage (key: ${key}):`, error);
    return false;
  }
};

/**
 * Remove item from storage
 * @param {string} key - Storage key
 * @returns {boolean} Success status
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from storage (key: ${key}):`, error);
    return false;
  }
};

/**
 * Clear all storage
 * @returns {boolean} Success status
 */
export const clear = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
};

/**
 * Get quiz statistics
 * @returns {Object} Statistics object
 */
export const getStats = () => {
  return getItem(STORAGE_KEYS.QUIZ_STATS) || {};
};

/**
 * Save quiz statistics
 * @param {Object} stats - Statistics object
 * @returns {boolean} Success status
 */
export const saveStats = (stats) => {
  return setItem(STORAGE_KEYS.QUIZ_STATS, stats);
};

/**
 * Get bookmarked questions
 * @returns {Array} Array of question IDs
 */
export const getBookmarks = () => {
  return getItem(STORAGE_KEYS.BOOKMARKS) || [];
};

/**
 * Save bookmarked questions
 * @param {Array} bookmarks - Array of question IDs
 * @returns {boolean} Success status
 */
export const saveBookmarks = (bookmarks) => {
  return setItem(STORAGE_KEYS.BOOKMARKS, bookmarks);
};

/**
 * Reset all quiz data
 * @returns {boolean} Success status
 */
export const resetAllData = () => {
  const statsRemoved = removeItem(STORAGE_KEYS.QUIZ_STATS);
  const bookmarksRemoved = removeItem(STORAGE_KEYS.BOOKMARKS);
  return statsRemoved && bookmarksRemoved;
};

export default {
  getItem,
  setItem,
  removeItem,
  clear,
  getStats,
  saveStats,
  getBookmarks,
  saveBookmarks,
  resetAllData,
  STORAGE_KEYS,
};
