import { describe, it, expect } from 'vitest';
import {
  calculateAccuracy,
  calculateAccuracyString,
  formatPercentage,
  calculateCompletionPercentage,
  calculateSessionAccuracy,
} from '../calculations';

describe('calculations', () => {
  describe('calculateAccuracy', () => {
    it('should calculate accuracy as number', () => {
      expect(calculateAccuracy(8, 2)).toBe(80);
      expect(calculateAccuracy(5, 5)).toBe(50);
      expect(calculateAccuracy(1, 9)).toBe(10);
    });

    it('should return 0 when no attempts', () => {
      expect(calculateAccuracy(0, 0)).toBe(0);
    });

    it('should handle 100% accuracy', () => {
      expect(calculateAccuracy(10, 0)).toBe(100);
    });

    it('should handle 0% accuracy', () => {
      expect(calculateAccuracy(0, 10)).toBe(0);
    });

    it('should round to 1 decimal by default', () => {
      expect(calculateAccuracy(1, 2, 1)).toBe(33.3);
      expect(calculateAccuracy(2, 1, 1)).toBe(66.7);
    });

    it('should support custom decimal places', () => {
      expect(calculateAccuracy(1, 2, 0)).toBe(33);
      expect(calculateAccuracy(1, 2, 2)).toBe(33.33);
      expect(calculateAccuracy(1, 3, 3)).toBe(25.000);
    });
  });

  describe('calculateAccuracyString', () => {
    it('should return accuracy as formatted string', () => {
      expect(calculateAccuracyString(8, 2)).toBe('80%');
      expect(calculateAccuracyString(5, 5)).toBe('50%');
    });

    it('should use 0 decimals by default', () => {
      expect(calculateAccuracyString(1, 2)).toBe('33%');
      expect(calculateAccuracyString(2, 1)).toBe('67%');
    });

    it('should support custom decimal places', () => {
      expect(calculateAccuracyString(1, 2, 1)).toBe('33.3%');
      expect(calculateAccuracyString(1, 2, 2)).toBe('33.33%');
    });

    it('should handle edge cases', () => {
      expect(calculateAccuracyString(0, 0)).toBe('0%');
      expect(calculateAccuracyString(10, 0)).toBe('100%');
      expect(calculateAccuracyString(0, 10)).toBe('0%');
    });
  });

  describe('formatPercentage', () => {
    it('should format number as percentage string', () => {
      expect(formatPercentage(80)).toBe('80%');
      expect(formatPercentage(50.5)).toBe('51%');
    });

    it('should round to specified decimals', () => {
      expect(formatPercentage(33.3333, 0)).toBe('33%');
      expect(formatPercentage(33.3333, 1)).toBe('33.3%');
      expect(formatPercentage(33.3333, 2)).toBe('33.33%');
    });

    it('should handle 0 and 100', () => {
      expect(formatPercentage(0)).toBe('0%');
      expect(formatPercentage(100)).toBe('100%');
    });

    it('should handle decimal inputs', () => {
      expect(formatPercentage(99.9, 1)).toBe('99.9%');
      expect(formatPercentage(0.1, 1)).toBe('0.1%');
    });
  });

  describe('calculateCompletionPercentage', () => {
    it('should calculate completion percentage', () => {
      expect(calculateCompletionPercentage(5, 10)).toBe(50);
      expect(calculateCompletionPercentage(8, 10)).toBe(80);
      expect(calculateCompletionPercentage(1, 4)).toBe(25);
    });

    it('should return 0 when total is 0', () => {
      expect(calculateCompletionPercentage(0, 0)).toBe(0);
      expect(calculateCompletionPercentage(5, 0)).toBe(0);
    });

    it('should handle 100% completion', () => {
      expect(calculateCompletionPercentage(10, 10)).toBe(100);
      expect(calculateCompletionPercentage(50, 50)).toBe(100);
    });

    it('should round to 1 decimal by default', () => {
      expect(calculateCompletionPercentage(1, 3, 1)).toBe(33.3);
      expect(calculateCompletionPercentage(2, 3, 1)).toBe(66.7);
    });

    it('should support custom decimal places', () => {
      expect(calculateCompletionPercentage(1, 3, 0)).toBe(33);
      expect(calculateCompletionPercentage(1, 3, 2)).toBe(33.33);
    });
  });

  describe('calculateSessionAccuracy', () => {
    it('should calculate accuracy from session stats object', () => {
      expect(calculateSessionAccuracy({ correct: 8, incorrect: 2 })).toBe(80);
      expect(calculateSessionAccuracy({ correct: 5, incorrect: 5 })).toBe(50);
    });

    it('should use 0 decimals by default', () => {
      expect(calculateSessionAccuracy({ correct: 1, incorrect: 2 })).toBe(33);
      expect(calculateSessionAccuracy({ correct: 2, incorrect: 1 })).toBe(67);
    });

    it('should support custom decimal places', () => {
      expect(calculateSessionAccuracy({ correct: 1, incorrect: 2 }, 1)).toBe(33.3);
      expect(calculateSessionAccuracy({ correct: 1, incorrect: 2 }, 2)).toBe(33.33);
    });

    it('should handle no attempts', () => {
      expect(calculateSessionAccuracy({ correct: 0, incorrect: 0 })).toBe(0);
    });

    it('should handle perfect score', () => {
      expect(calculateSessionAccuracy({ correct: 10, incorrect: 0 })).toBe(100);
    });

    it('should handle zero score', () => {
      expect(calculateSessionAccuracy({ correct: 0, incorrect: 10 })).toBe(0);
    });
  });

  describe('Edge cases and precision', () => {
    it('should handle very large numbers', () => {
      expect(calculateAccuracy(9999, 1)).toBe(100);
      expect(calculateCompletionPercentage(9999, 10000, 1)).toBe(100);
    });

    it('should handle very small percentages', () => {
      expect(calculateAccuracy(1, 999, 1)).toBe(0.1);
      expect(calculateCompletionPercentage(1, 1000, 1)).toBe(0.1);
    });

    it('should maintain precision with rounding', () => {
      // Test that rounding works correctly at boundaries
      expect(calculateAccuracy(1, 2, 0)).toBe(33); // 33.333... rounds down
      expect(calculateAccuracy(2, 1, 0)).toBe(67); // 66.666... rounds up
    });

    it('should be consistent across functions', () => {
      // calculateAccuracy and calculateSessionAccuracy should give same results
      const accuracy1 = calculateAccuracy(5, 5, 0);
      const accuracy2 = calculateSessionAccuracy({ correct: 5, incorrect: 5 }, 0);
      expect(accuracy1).toBe(accuracy2);
    });
  });
});
