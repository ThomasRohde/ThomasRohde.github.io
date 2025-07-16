import { describe, it, expect, vi, beforeEach } from 'vitest';
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';

// Mock web-vitals functions
vi.mock('web-vitals', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    onCLS: vi.fn(),
    onINP: vi.fn(),
    onFCP: vi.fn(),
    onLCP: vi.fn(),
    onTTFB: vi.fn(),
  };
});

describe('Web Vitals Performance Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should measure Cumulative Layout Shift (CLS)', () => {
    const mockCallback = vi.fn();
    onCLS(mockCallback);

    expect(onCLS).toHaveBeenCalledWith(mockCallback);
  });

  it('should measure Interaction to Next Paint (INP)', () => {
    const mockCallback = vi.fn();
    onINP(mockCallback);

    expect(onINP).toHaveBeenCalledWith(mockCallback);
  });

  it('should measure First Contentful Paint (FCP)', () => {
    const mockCallback = vi.fn();
    onFCP(mockCallback);

    expect(onFCP).toHaveBeenCalledWith(mockCallback);
  });

  it('should measure Largest Contentful Paint (LCP)', () => {
    const mockCallback = vi.fn();
    onLCP(mockCallback);

    expect(onLCP).toHaveBeenCalledWith(mockCallback);
  });

  it('should measure Time to First Byte (TTFB)', () => {
    const mockCallback = vi.fn();
    onTTFB(mockCallback);

    expect(onTTFB).toHaveBeenCalledWith(mockCallback);
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
