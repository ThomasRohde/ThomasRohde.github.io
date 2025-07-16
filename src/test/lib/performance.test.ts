import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getPerformanceRating,
  PerformanceMonitor,
  measurePerformance,
  measureAsyncPerformance,
  PERFORMANCE_THRESHOLDS,
} from '@/lib/performance';

// Mock web-vitals
vi.mock('web-vitals', () => ({
  getCLS: vi.fn(),
  getFID: vi.fn(),
  getFCP: vi.fn(),
  getLCP: vi.fn(),
  getTTFB: vi.fn(),
}));

describe('Performance utilities', () => {
  describe('getPerformanceRating', () => {
    it('should return "good" for values within good threshold', () => {
      expect(getPerformanceRating('lcp', 2000)).toBe('good');
      expect(getPerformanceRating('cls', 0.05)).toBe('good');
      expect(getPerformanceRating('fid', 50)).toBe('good');
    });

    it('should return "needs-improvement" for values within needs improvement threshold', () => {
      expect(getPerformanceRating('lcp', 3000)).toBe('needs-improvement');
      expect(getPerformanceRating('cls', 0.15)).toBe('needs-improvement');
      expect(getPerformanceRating('fid', 200)).toBe('needs-improvement');
    });

    it('should return "poor" for values above needs improvement threshold', () => {
      expect(getPerformanceRating('lcp', 5000)).toBe('poor');
      expect(getPerformanceRating('cls', 0.3)).toBe('poor');
      expect(getPerformanceRating('fid', 400)).toBe('poor');
    });
  });

  describe('PerformanceMonitor', () => {
    let monitor: PerformanceMonitor;

    beforeEach(() => {
      monitor = new PerformanceMonitor();
    });

    it('should initialize with empty metrics', () => {
      const metrics = monitor.getMetrics();
      expect(metrics).toEqual({});
    });

    it('should allow registering callbacks', () => {
      const callback = vi.fn();
      monitor.onMetricsUpdate(callback);

      // Simulate metric update
      const mockMetric = {
        name: 'LCP',
        value: 2000,
        delta: 2000,
        id: 'test-id',
        entries: [],
      };

      // Access private method for testing
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (monitor as any).handleMetric(mockMetric);

      expect(callback).toHaveBeenCalledWith({ lcp: 2000 });
    });

    it('should calculate metric ratings correctly', () => {
      // Simulate metrics
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (monitor as any).metrics = {
        lcp: 2000,
        cls: 0.05,
        fid: 50,
      };

      const ratings = monitor.getMetricRatings();

      expect(ratings.lcp).toBe('good');
      expect(ratings.cls).toBe('good');
      expect(ratings.fid).toBe('good');
    });
  });

  describe('measurePerformance', () => {
    it('should measure synchronous function performance', () => {
      const testFunction = () => {
        // Simulate some work
        let sum = 0;
        for (let i = 0; i < 1000; i++) {
          sum += i;
        }
        return sum;
      };

      const result = measurePerformance('test-function', testFunction);

      expect(result).toBe(499500); // Sum of 0 to 999
    });

    it('should return the original function result', () => {
      const testFunction = () => 'test-result';
      const result = measurePerformance('test-function', testFunction);

      expect(result).toBe('test-result');
    });
  });

  describe('measureAsyncPerformance', () => {
    it('should measure asynchronous function performance', async () => {
      const testAsyncFunction = async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return 'async-result';
      };

      const result = await measureAsyncPerformance(
        'test-async-function',
        testAsyncFunction
      );

      expect(result).toBe('async-result');
    });

    it('should handle rejected promises', async () => {
      const testAsyncFunction = async () => {
        throw new Error('Test error');
      };

      await expect(
        measureAsyncPerformance('test-async-function', testAsyncFunction)
      ).rejects.toThrow('Test error');
    });
  });

  describe('PERFORMANCE_THRESHOLDS', () => {
    it('should have correct threshold values', () => {
      expect(PERFORMANCE_THRESHOLDS.lcp.good).toBe(2500);
      expect(PERFORMANCE_THRESHOLDS.lcp.needsImprovement).toBe(4000);
      expect(PERFORMANCE_THRESHOLDS.cls.good).toBe(0.1);
      expect(PERFORMANCE_THRESHOLDS.cls.needsImprovement).toBe(0.25);
      expect(PERFORMANCE_THRESHOLDS.fid.good).toBe(100);
      expect(PERFORMANCE_THRESHOLDS.fid.needsImprovement).toBe(300);
    });
  });
});
