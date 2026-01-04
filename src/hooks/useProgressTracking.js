import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'learning-path-progress';

/**
 * Check if localStorage is available
 * @returns {boolean}
 */
function isLocalStorageAvailable() {
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Custom hook for tracking learning path progress with localStorage persistence
 * @returns {{
 *   completedModules: string[],
 *   toggleModuleComplete: (moduleId: string) => void,
 *   markComplete: (moduleId: string) => void,
 *   markIncomplete: (moduleId: string) => void,
 *   isModuleComplete: (moduleId: string) => boolean,
 *   getCompletedCount: () => number,
 *   getProgressPercentage: (totalModules: number) => number,
 *   clearProgress: () => void,
 *   isStorageAvailable: boolean
 * }}
 */
export default function useProgressTracking() {
  const [completedModules, setCompletedModules] = useState([]);
  const [isStorageAvailable, setIsStorageAvailable] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    const storageAvailable = isLocalStorageAvailable();
    setIsStorageAvailable(storageAvailable);

    if (storageAvailable) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setCompletedModules(parsed);
          }
        }
      } catch (e) {
        // If parsing fails, start with empty array
        setCompletedModules([]);
      }
    }

    setIsInitialized(true);
  }, []);

  // Persist to localStorage when completedModules changes
  useEffect(() => {
    if (!isInitialized || !isStorageAvailable) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedModules));
    } catch (e) {
      // Storage quota exceeded or other error - fail silently
    }
  }, [completedModules, isInitialized, isStorageAvailable]);

  /**
   * Toggle module completion status
   * @param {string} moduleId
   */
  const toggleModuleComplete = useCallback((moduleId) => {
    setCompletedModules((prev) => {
      if (prev.includes(moduleId)) {
        return prev.filter((id) => id !== moduleId);
      }
      return [...prev, moduleId];
    });
  }, []);

  /**
   * Mark a module as completed
   * @param {string} moduleId
   */
  const markComplete = useCallback((moduleId) => {
    setCompletedModules((prev) => {
      if (prev.includes(moduleId)) {
        return prev;
      }
      return [...prev, moduleId];
    });
  }, []);

  /**
   * Mark a module as incomplete
   * @param {string} moduleId
   */
  const markIncomplete = useCallback((moduleId) => {
    setCompletedModules((prev) => prev.filter((id) => id !== moduleId));
  }, []);

  /**
   * Check if a module is completed
   * @param {string} moduleId
   * @returns {boolean}
   */
  const isModuleComplete = useCallback(
    (moduleId) => completedModules.includes(moduleId),
    [completedModules]
  );

  /**
   * Get the count of completed modules
   * @returns {number}
   */
  const getCompletedCount = useCallback(
    () => completedModules.length,
    [completedModules]
  );

  /**
   * Get progress percentage
   * @param {number} totalModules
   * @returns {number}
   */
  const getProgressPercentage = useCallback(
    (totalModules) => {
      if (totalModules === 0) return 0;
      return Math.round((completedModules.length / totalModules) * 100);
    },
    [completedModules]
  );

  /**
   * Clear all progress
   */
  const clearProgress = useCallback(() => {
    setCompletedModules([]);
    if (isStorageAvailable) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        // Fail silently
      }
    }
  }, [isStorageAvailable]);

  return {
    completedModules,
    toggleModuleComplete,
    markComplete,
    markIncomplete,
    isModuleComplete,
    getCompletedCount,
    getProgressPercentage,
    clearProgress,
    isStorageAvailable,
  };
}
