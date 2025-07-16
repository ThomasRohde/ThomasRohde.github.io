import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';

export interface PerformanceMetrics {
  cls?: number;
  inp?: number; // INP replaced FID in web-vitals v4
  fcp?: number;
  lcp?: number;
  ttfb?: number;
}

export interface PerformanceThresholds {
  cls: { good: number; needsImprovement: number };
  inp: { good: number; needsImprovement: number }; // INP replaced FID
  fcp: { good: number; needsImprovement: number };
  lcp: { good: number; needsImprovement: number };
  ttfb: { good: number; needsImprovement: number };
}

// Web Vitals thresholds (in milliseconds, except CLS which is unitless)
export const PERFORMANCE_THRESHOLDS: PerformanceThresholds = {
  cls: { good: 0.1, needsImprovement: 0.25 },
  inp: { good: 200, needsImprovement: 500 }, // INP thresholds
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
    onCLS(this.handleMetric.bind(this));
    onINP(this.handleMetric.bind(this)); // INP replaced FID in web-vitals v4
    onFCP(this.handleMetric.bind(this));
    onLCP(this.handleMetric.bind(this));
    onTTFB(this.handleMetric.bind(this));
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
        inp: null, // Updated from fid to inp
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

// Singleton instance - lazy initialization to avoid issues with mocking
let performanceMonitorInstance: PerformanceMonitor | null = null;

export const performanceMonitor = {
  getInstance(): PerformanceMonitor {
    if (!performanceMonitorInstance) {
      performanceMonitorInstance = new PerformanceMonitor();
    }
    return performanceMonitorInstance;
  },
  onMetricsUpdate(callback: (metrics: PerformanceMetrics) => void) {
    return this.getInstance().onMetricsUpdate(callback);
  },
  getMetrics() {
    return this.getInstance().getMetrics();
  },
  getMetricRatings() {
    return this.getInstance().getMetricRatings();
  },
  logPerformanceReport() {
    return this.getInstance().logPerformanceReport();
  },
};

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
