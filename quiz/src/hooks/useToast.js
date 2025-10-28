import { useState, useCallback } from 'react';

/**
 * Custom hook for managing toast notifications
 * @returns {Object} Toast state and control functions
 */
export const useToast = () => {
  const [toast, setToast] = useState(null);

  /**
   * Show a toast notification
   * @param {string} message - Message to display
   * @param {string} type - Type: 'info' | 'success' | 'warning' | 'error'
   * @param {number} duration - Duration in ms (default: 3000)
   */
  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    setToast({ message, type, duration });
  }, []);

  /**
   * Show info toast
   */
  const showInfo = useCallback((message, duration) => {
    showToast(message, 'info', duration);
  }, [showToast]);

  /**
   * Show success toast
   */
  const showSuccess = useCallback((message, duration) => {
    showToast(message, 'success', duration);
  }, [showToast]);

  /**
   * Show warning toast
   */
  const showWarning = useCallback((message, duration) => {
    showToast(message, 'warning', duration);
  }, [showToast]);

  /**
   * Show error toast
   */
  const showError = useCallback((message, duration) => {
    showToast(message, 'error', duration);
  }, [showToast]);

  /**
   * Hide current toast
   */
  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return {
    toast,
    showToast,
    showInfo,
    showSuccess,
    showWarning,
    showError,
    hideToast,
  };
};
