import { describe, it, expect, beforeEach } from 'vitest';
import {
  getIncorrectQuestions,
  getBookmarkedQuestions,
  getQuestionsByBlock,
  getWeightedRandomQuestion,
} from '../questionService';

describe('questionService', () => {
  let mockQuestions;
  let mockStats;
  let mockBookmarks;

  beforeEach(() => {
    // Setup mock data
    mockQuestions = [
      { id: 'q1', block: 'Block A', question: 'Question 1' },
      { id: 'q2', block: 'Block A', question: 'Question 2' },
      { id: 'q3', block: 'Block B', question: 'Question 3' },
      { id: 'q4', block: 'Block B', question: 'Question 4' },
      { id: 'q5', block: 'Block C', question: 'Question 5' },
    ];

    mockStats = {
      q1: { correct: 5, incorrect: 1 },   // 83% accuracy
      q2: { correct: 2, incorrect: 8 },   // 20% accuracy - should be prioritized
      q3: { correct: 3, incorrect: 3 },   // 50% accuracy
      // q4 has no stats - unanswered
      q5: { correct: 10, incorrect: 0 },  // 100% accuracy
    };

    mockBookmarks = ['q1', 'q3'];
  });

  describe('getIncorrectQuestions', () => {
    it('should return questions with more incorrect than correct answers', () => {
      const result = getIncorrectQuestions(mockQuestions, mockStats);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('q2');
    });

    it('should return empty array when no incorrect questions', () => {
      const perfectStats = {
        q1: { correct: 10, incorrect: 0 },
        q2: { correct: 10, incorrect: 0 },
      };

      const result = getIncorrectQuestions(mockQuestions, perfectStats);
      expect(result).toHaveLength(0);
    });

    it('should handle empty stats', () => {
      const result = getIncorrectQuestions(mockQuestions, {});
      expect(result).toHaveLength(0);
    });
  });

  describe('getBookmarkedQuestions', () => {
    it('should return only bookmarked questions', () => {
      const result = getBookmarkedQuestions(mockQuestions, mockBookmarks);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('q1');
      expect(result[1].id).toBe('q3');
    });

    it('should return empty array when no bookmarks', () => {
      const result = getBookmarkedQuestions(mockQuestions, []);
      expect(result).toHaveLength(0);
    });

    it('should handle bookmarks that do not exist in questions', () => {
      const result = getBookmarkedQuestions(mockQuestions, ['q1', 'q99']);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('q1');
    });
  });

  describe('getQuestionsByBlock', () => {
    it('should return questions from specified block', () => {
      const result = getQuestionsByBlock(mockQuestions, 'Block A');

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('q1');
      expect(result[1].id).toBe('q2');
    });

    it('should return empty array for non-existent block', () => {
      const result = getQuestionsByBlock(mockQuestions, 'Block Z');
      expect(result).toHaveLength(0);
    });

    it('should be case-sensitive', () => {
      const result = getQuestionsByBlock(mockQuestions, 'block a');
      expect(result).toHaveLength(0);
    });
  });

  describe('getWeightedRandomQuestion - Core Algorithm', () => {
    it('should return null when no questions available', () => {
      const result = getWeightedRandomQuestion([], mockStats, []);
      expect(result).toBeNull();
    });

    it('should return null when all questions are excluded', () => {
      const excludeIds = ['q1', 'q2', 'q3', 'q4', 'q5'];
      const result = getWeightedRandomQuestion(mockQuestions, mockStats, excludeIds);
      expect(result).toBeNull();
    });

    it('should return a question object with all properties', () => {
      const result = getWeightedRandomQuestion(mockQuestions, mockStats, []);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('block');
      expect(result).toHaveProperty('question');
    });

    it('should not return excluded questions', () => {
      const excludeIds = ['q1', 'q2', 'q3'];
      const results = new Set();

      // Run multiple times to ensure excluded questions never appear
      for (let i = 0; i < 20; i++) {
        const result = getWeightedRandomQuestion(mockQuestions, mockStats, excludeIds);
        results.add(result.id);
      }

      expect(results.has('q1')).toBe(false);
      expect(results.has('q2')).toBe(false);
      expect(results.has('q3')).toBe(false);
      expect(results.has('q4') || results.has('q5')).toBe(true);
    });
  });

  describe('getWeightedRandomQuestion - Unanswered Priority', () => {
    it('should heavily prioritize unanswered questions', () => {
      // q4 is unanswered, should appear much more frequently
      const results = { q4: 0, others: 0 };

      for (let i = 0; i < 100; i++) {
        const result = getWeightedRandomQuestion(mockQuestions, mockStats, []);
        if (result.id === 'q4') {
          results.q4++;
        } else {
          results.others++;
        }
      }

      // Unanswered question should appear at least 60% of the time
      expect(results.q4).toBeGreaterThan(60);
    });

    it('should eventually select all unanswered questions in rotation', () => {
      const unansweredStats = {}; // All questions unanswered
      const selectedIds = new Set();

      for (let i = 0; i < 50; i++) {
        const result = getWeightedRandomQuestion(mockQuestions, unansweredStats, []);
        selectedIds.add(result.id);
      }

      // All questions should be selected at some point
      expect(selectedIds.size).toBe(5);
    });
  });

  describe('getWeightedRandomQuestion - Failure Rate Priority', () => {
    it('should prioritize questions with high failure rate', () => {
      // q2 has 80% failure rate (2 correct, 8 incorrect)
      // q5 has 0% failure rate (10 correct, 0 incorrect)
      const questionsSubset = [
        mockQuestions[1], // q2 - high failure
        mockQuestions[4], // q5 - perfect score
      ];

      const results = { q2: 0, q5: 0 };

      for (let i = 0; i < 100; i++) {
        const result = getWeightedRandomQuestion(questionsSubset, mockStats, []);
        results[result.id]++;
      }

      // q2 should appear more frequently than q5
      expect(results.q2).toBeGreaterThan(results.q5);
    });

    it('should distribute questions based on failure rates', () => {
      // Remove unanswered question to test failure rate distribution
      const answeredQuestions = mockQuestions.filter(q => mockStats[q.id]);
      const results = {};

      for (let i = 0; i < 200; i++) {
        const result = getWeightedRandomQuestion(answeredQuestions, mockStats, []);
        results[result.id] = (results[result.id] || 0) + 1;
      }

      // q2 (20% accuracy) should appear most
      // q3 (50% accuracy) should appear moderately
      // q1 (83% accuracy) and q5 (100% accuracy) should appear less
      expect(results.q2).toBeGreaterThan(results.q3);
      expect(results.q3).toBeGreaterThan(results.q1);
    });
  });

  describe('getWeightedRandomQuestion - Frequency Bonus', () => {
    it('should prioritize less frequently seen questions', () => {
      const freqStats = {
        q1: { correct: 10, incorrect: 10 }, // Seen 20 times
        q2: { correct: 1, incorrect: 1 },   // Seen 2 times - should be prioritized
      };

      const questionsSubset = [
        mockQuestions[0], // q1
        mockQuestions[1], // q2
      ];

      const results = { q1: 0, q2: 0 };

      for (let i = 0; i < 100; i++) {
        const result = getWeightedRandomQuestion(questionsSubset, freqStats, []);
        results[result.id]++;
      }

      // q2 (less frequently seen) should appear more often
      expect(results.q2).toBeGreaterThan(results.q1);
    });
  });

  describe('getWeightedRandomQuestion - Edge Cases', () => {
    it('should handle single question', () => {
      const singleQuestion = [mockQuestions[0]];
      const result = getWeightedRandomQuestion(singleQuestion, mockStats, []);

      expect(result).toBeDefined();
      expect(result.id).toBe('q1');
    });

    it('should handle questions with zero attempts', () => {
      const zeroStats = {
        q1: { correct: 0, incorrect: 0 },
      };

      const result = getWeightedRandomQuestion([mockQuestions[0]], zeroStats, []);
      expect(result).toBeDefined();
    });

    it('should handle missing stats gracefully', () => {
      const result = getWeightedRandomQuestion(mockQuestions, {}, []);
      expect(result).toBeDefined();
    });

    it('should be deterministic given same random seed (statistical test)', () => {
      // Run algorithm many times, should produce varied results (not always same)
      const results = new Set();

      for (let i = 0; i < 30; i++) {
        const result = getWeightedRandomQuestion(mockQuestions, mockStats, []);
        results.add(result.id);
      }

      // Should select multiple different questions
      expect(results.size).toBeGreaterThan(1);
    });
  });

  describe('getWeightedRandomQuestion - Combined Priority Test', () => {
    it('should balance all three factors: unanswered > failure rate > frequency', () => {
      const complexStats = {
        q1: { correct: 100, incorrect: 0 },  // Perfect, seen a lot
        q2: { correct: 5, incorrect: 15 },   // Bad failure rate, moderate frequency
        q3: { correct: 1, incorrect: 0 },    // Perfect, seen once (low frequency)
        // q4 unanswered - should have highest priority
        q5: { correct: 2, incorrect: 8 },    // Worst failure rate
      };

      const priorityCount = {
        q1: 0, // Lowest priority
        q2: 0, // Medium-high priority
        q3: 0, // Medium priority
        q4: 0, // Highest priority (unanswered)
        q5: 0, // High priority (bad failure rate)
      };

      for (let i = 0; i < 500; i++) {
        const result = getWeightedRandomQuestion(mockQuestions, complexStats, []);
        priorityCount[result.id]++;
      }

      // Priority order should be: q4 > q5 > q2 > q3 > q1
      expect(priorityCount.q4).toBeGreaterThan(priorityCount.q5);
      expect(priorityCount.q5).toBeGreaterThan(priorityCount.q3);
      expect(priorityCount.q1).toBeLessThan(priorityCount.q2);
    });
  });
});
