import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  recordAnswer,
  calculateGlobalStats,
  calculateBlockStats,
  calculateAccuracy,
} from '../statsService';

describe('statsService', () => {
  describe('recordAnswer', () => {
    it('should create new stat entry for first answer', () => {
      const stats = {};
      const result = recordAnswer(stats, 'q1', true);

      expect(result.q1).toBeDefined();
      expect(result.q1.correct).toBe(1);
      expect(result.q1.incorrect).toBe(0);
      expect(result.q1.lastAttempt).toBeDefined();
    });

    it('should increment correct count when answer is correct', () => {
      const stats = {
        q1: { correct: 2, incorrect: 1, lastAttempt: '2024-01-01' }
      };

      const result = recordAnswer(stats, 'q1', true);

      expect(result.q1.correct).toBe(3);
      expect(result.q1.incorrect).toBe(1);
    });

    it('should increment incorrect count when answer is wrong', () => {
      const stats = {
        q1: { correct: 2, incorrect: 1, lastAttempt: '2024-01-01' }
      };

      const result = recordAnswer(stats, 'q1', false);

      expect(result.q1.correct).toBe(2);
      expect(result.q1.incorrect).toBe(2);
    });

    it('should update lastAttempt timestamp', () => {
      const stats = {};
      const beforeTest = new Date().toISOString();

      const result = recordAnswer(stats, 'q1', true);

      const afterTest = new Date().toISOString();
      expect(result.q1.lastAttempt).toBeDefined();
      expect(result.q1.lastAttempt >= beforeTest).toBe(true);
      expect(result.q1.lastAttempt <= afterTest).toBe(true);
    });

    it('should not mutate original stats object', () => {
      const stats = {
        q1: { correct: 1, incorrect: 0, lastAttempt: '2024-01-01' }
      };
      const originalCorrect = stats.q1.correct;

      recordAnswer(stats, 'q1', true);

      expect(stats.q1.correct).toBe(originalCorrect);
    });

    it('should handle multiple different questions', () => {
      let stats = {};

      stats = recordAnswer(stats, 'q1', true);
      stats = recordAnswer(stats, 'q2', false);
      stats = recordAnswer(stats, 'q3', true);

      expect(Object.keys(stats)).toHaveLength(3);
      expect(stats.q1.correct).toBe(1);
      expect(stats.q2.incorrect).toBe(1);
      expect(stats.q3.correct).toBe(1);
    });
  });

  describe('calculateGlobalStats', () => {
    let mockQuestions;
    let mockStats;

    beforeEach(() => {
      mockQuestions = [
        { id: 'q1' },
        { id: 'q2' },
        { id: 'q3' },
        { id: 'q4' },
        { id: 'q5' },
      ];

      mockStats = {
        q1: { correct: 8, incorrect: 2 },  // 10 attempts, 80%
        q2: { correct: 3, incorrect: 7 },  // 10 attempts, 30%
        q3: { correct: 5, incorrect: 5 },  // 10 attempts, 50%
        // q4 and q5 not answered
      };
    });

    it('should calculate total questions correctly', () => {
      const result = calculateGlobalStats(mockQuestions, mockStats);
      expect(result.totalQuestions).toBe(5);
    });

    it('should calculate answered questions correctly', () => {
      const result = calculateGlobalStats(mockQuestions, mockStats);
      expect(result.answeredQuestions).toBe(3);
    });

    it('should calculate total correct answers', () => {
      const result = calculateGlobalStats(mockQuestions, mockStats);
      expect(result.totalCorrect).toBe(16); // 8 + 3 + 5
    });

    it('should calculate total incorrect answers', () => {
      const result = calculateGlobalStats(mockQuestions, mockStats);
      expect(result.totalIncorrect).toBe(14); // 2 + 7 + 5
    });

    it('should calculate total attempts', () => {
      const result = calculateGlobalStats(mockQuestions, mockStats);
      expect(result.totalAttempts).toBe(30); // 10 + 10 + 10
    });

    it('should calculate accuracy as percentage string', () => {
      const result = calculateGlobalStats(mockQuestions, mockStats);
      expect(result.accuracy).toBe('53.3'); // 16/30 * 100 = 53.33...
    });

    it('should return 0 accuracy when no attempts', () => {
      const result = calculateGlobalStats(mockQuestions, {});
      expect(result.accuracy).toBe(0);
      expect(result.totalAttempts).toBe(0);
    });

    it('should filter out stats from other modules', () => {
      const statsWithOtherModule = {
        ...mockStats,
        otherModuleQ1: { correct: 100, incorrect: 0 },
        otherModuleQ2: { correct: 50, incorrect: 50 },
      };

      const result = calculateGlobalStats(mockQuestions, statsWithOtherModule);

      // Should not include stats from other module questions
      expect(result.totalCorrect).toBe(16); // Not 166
      expect(result.answeredQuestions).toBe(3); // Not 5
    });

    it('should handle empty questions array', () => {
      const result = calculateGlobalStats([], mockStats);

      expect(result.totalQuestions).toBe(0);
      expect(result.answeredQuestions).toBe(0);
      expect(result.totalCorrect).toBe(0);
      expect(result.totalIncorrect).toBe(0);
      expect(result.accuracy).toBe(0);
    });
  });

  describe('calculateBlockStats', () => {
    let mockQuestions;
    let mockStats;

    beforeEach(() => {
      mockQuestions = [
        { id: 'q1', block: 'Block A' },
        { id: 'q2', block: 'Block A' },
        { id: 'q3', block: 'Block B' },
        { id: 'q4', block: 'Block B' },
        { id: 'q5', block: 'Block C' },
      ];

      mockStats = {
        q1: { correct: 5, incorrect: 1 },
        q2: { correct: 3, incorrect: 3 },
        q3: { correct: 8, incorrect: 2 },
        // q4 and q5 not answered
      };
    });

    it('should group questions by block', () => {
      const result = calculateBlockStats(mockQuestions, mockStats);

      expect(result['Block A']).toBeDefined();
      expect(result['Block B']).toBeDefined();
      expect(result['Block C']).toBeDefined();
    });

    it('should count total questions per block', () => {
      const result = calculateBlockStats(mockQuestions, mockStats);

      expect(result['Block A'].total).toBe(2);
      expect(result['Block B'].total).toBe(2);
      expect(result['Block C'].total).toBe(1);
    });

    it('should count answered questions per block', () => {
      const result = calculateBlockStats(mockQuestions, mockStats);

      expect(result['Block A'].answered).toBe(2); // q1, q2
      expect(result['Block B'].answered).toBe(1); // q3 only
      expect(result['Block C'].answered).toBe(0); // q5 not answered
    });

    it('should sum correct answers per block', () => {
      const result = calculateBlockStats(mockQuestions, mockStats);

      expect(result['Block A'].correct).toBe(8); // 5 + 3
      expect(result['Block B'].correct).toBe(8); // 8
      expect(result['Block C'].correct).toBe(0);
    });

    it('should sum incorrect answers per block', () => {
      const result = calculateBlockStats(mockQuestions, mockStats);

      expect(result['Block A'].incorrect).toBe(4); // 1 + 3
      expect(result['Block B'].incorrect).toBe(2); // 2
      expect(result['Block C'].incorrect).toBe(0);
    });

    it('should handle empty questions', () => {
      const result = calculateBlockStats([], mockStats);
      expect(Object.keys(result)).toHaveLength(0);
    });

    it('should handle empty stats', () => {
      const result = calculateBlockStats(mockQuestions, {});

      expect(result['Block A'].total).toBe(2);
      expect(result['Block A'].answered).toBe(0);
      expect(result['Block A'].correct).toBe(0);
      expect(result['Block A'].incorrect).toBe(0);
    });
  });

  describe('calculateAccuracy', () => {
    it('should calculate accuracy correctly', () => {
      expect(calculateAccuracy(8, 2)).toBe('80.0');
      expect(calculateAccuracy(5, 5)).toBe('50.0');
      expect(calculateAccuracy(1, 9)).toBe('10.0');
    });

    it('should return 0.0 when no attempts', () => {
      expect(calculateAccuracy(0, 0)).toBe('0.0');
    });

    it('should handle 100% accuracy', () => {
      expect(calculateAccuracy(10, 0)).toBe('100.0');
    });

    it('should handle 0% accuracy', () => {
      expect(calculateAccuracy(0, 10)).toBe('0.0');
    });

    it('should round to 1 decimal place by default', () => {
      expect(calculateAccuracy(1, 2)).toBe('33.3');
      expect(calculateAccuracy(2, 1)).toBe('66.7');
    });

    it('should handle edge case with very small numbers', () => {
      expect(calculateAccuracy(1, 99)).toBe('1.0');
    });

    it('should handle edge case with very large numbers', () => {
      expect(calculateAccuracy(999, 1)).toBe('99.9');
    });
  });
});
