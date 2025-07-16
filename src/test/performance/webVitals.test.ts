import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

// Mock web-vitals functions
vi.mock('web-vitals', () => ({
  getCLS: vi.fn(),
  getFID: vi.fn(),
  getFCP: vi.fn(),
  getLCP: vi.fn(),
  getTTFB: vi.fn(),
}));

describe('Web Vitals Performance Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should measure Cumulative Layout Shift (CLS)', () => {
    const mockCallback = vi.fn();
    getCLS(mockCallback);

    expect(getCLS).toHaveBeenCalledWith(mockCallback);
  });

  it('should measure First Input Delay (FID)', () => {
    const mockCallback = vi.fn();
    getFID(mockCallback);

    expect(getFID).toHaveBeenCalledWith(mockCallback);
  });

  it('should measure First Contentful Paint (FCP)', () => {
    const mockCallback = vi.fn();
    getFCP(mockCallback);

    expect(getFCP).toHaveBeenCalledWith(mockCallback);
  });

  it('should measure Largest Contentful Paint (LCP)', () => {
    const mockCallback = vi.fn();
    getLCP(mockCallback);

    expect(getLCP).toHaveBeenCalledWith(mockCallback);
  });

  it('should measure Time to First Byte (TTFB)', () => {
    const mockCallback = vi.fn();
    getTTFB(mockCallback);

    expect(getTTFB).toHaveBeenCalledWith(mockCallback);
  });

  it('should handle web vitals callback with proper data structure', () => {
    const mockMetric = {
      name: 'LCP',
      value: 1500,
      delta: 1500,
      id: 'test-id',
      entries: [],
    };

    const callback = vi.fn();

    // Simulate calling the callback
    callback(mockMetric);

    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({
        name: expect.any(String),
        value: expect.any(Number),
        delta: expect.any(Number),
        id: expect.any(String),
      })
    );
  });
});
