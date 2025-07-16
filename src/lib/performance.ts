import { getCLS, getFID, getFCP, getLCP, getTTFB, Metric } from 'web-vitals';

export interface PerformanceMetrics {
  cls?: number;
  fid?: number;
  fcp?: number;
  lcp?: number;
  ttfb?: number;
}

export interface PerformanceThresholds {
  cls: { good: number; needsImprovement: number };
  fid: { good: number; needsImprovement: number };
  fcp: { good: number; needsImprovement: number };
  lcp: { good: number; needsImprovement: number };
  ttfb: { good: number; needsImprovement: number };
}

// Web Vitals thresholds (in milliseconds, except CLS which is unitless)
export const PERFORMANCE_THRESHOLDS: PerformanceThresholds = {
  cls: { good: 0.1, needsImprovement: 0.25 },
  fid: { good: 100, needsImprovement: 300 },
  fcp: { good: 1800, needsImprovement: 3000 },
  lcp: { good: 2500, needsImprovement: 4000 },
  ttfb: { good: 800, needsImprovement: 1800 },
};

export type PerformanceRating = 'good' | 'needs-improvement' | 'poor';

export function getPerformanceRating(
  metricName: keyof PerformanceThresholds,
  value: number
): PerformanceRating {
  const thresholds = PERFORMANCE_THRESHOLDS[metricName];

  if (value <= thresholds.good) {
    return 'good';
  } else if (value <= thresholds.needsImprovement) {
    return 'needs-improvement';
  } else {
    return 'poor';
  }
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private callbacks: Array<(metrics: PerformanceMetrics) => void> = [];

  constructor() {
    this.initializeWebVitals();
  }

  private initializeWebVitals() {
    getCLS(this.handleMetric.bind(this));
    getFID(this.handleMetric.bind(this));
    getFCP(this.handleMetric.bind(this));
    getLCP(this.handleMetric.bind(this));
    getTTFB(this.handleMetric.bind(this));
  }

  private handleMetric(metric: Metric) {
    const metricName = metric.name.toLowerCase() as keyof PerformanceMetrics;
    this.metrics[metricName] = metric.value;

    // Log performance metrics in development
    if (process.env.NODE_ENV === 'development') {
      const rating = getPerformanceRating(metricName, metric.value);
      console.log(`${metric.name}: ${metric.value} (${rating})`);
    }

    // Notify callbacks
    this.callbacks.forEach((callback) => callback({ ...this.metrics }));
  }

  public onMetricsUpdate(callback: (metrics: PerformanceMetrics) => void) {
    this.callbacks.push(callback);
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public getMetricRatings(): Record<
    keyof PerformanceMetrics,
    PerformanceRating | null
  > {
    const ratings: Record<keyof PerformanceMetrics, PerformanceRating | null> =
      {
        cls: null,
        fid: null,
        fcp: null,
        lcp: null,
        ttfb: null,
      };

    Object.entries(this.metrics).forEach(([key, value]) => {
      if (value !== undefined) {
        ratings[key as keyof PerformanceMetrics] = getPerformanceRating(
          key as keyof PerformanceThresholds,
          value
        );
      }
    });

    return ratings;
  }

  public logPerformanceReport() {
    const metrics = this.getMetrics();
    const ratings = this.getMetricRatings();

    console.group('Performance Report');
    Object.entries(metrics).forEach(([key, value]) => {
      if (value !== undefined) {
        const rating = ratings[key as keyof PerformanceMetrics];
        const unit = key === 'cls' ? '' : 'ms';
        console.log(`${key.toUpperCase()}: ${value}${unit} (${rating})`);
      }
    });
    console.groupEnd();
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Utility function to measure custom performance
export function measurePerformance<T>(name: string, fn: () => T): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  const duration = end - start;

  if (process.env.NODE_ENV === 'development') {
    console.log(`${name}: ${duration.toFixed(2)}ms`);
  }

  return result;
}

// Utility function to measure async performance
export async function measureAsyncPerformance<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  const duration = end - start;

  if (process.env.NODE_ENV === 'development') {
    console.log(`${name}: ${duration.toFixed(2)}ms`);
  }

  return result;
}
