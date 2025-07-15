// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Mark the start of a performance measurement
  mark(name: string): void {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(`${name}-start`);
    }
    this.metrics.set(`${name}-start`, Date.now());
  }

  // Measure the time since the mark was set
  measure(name: string): number {
    const startTime = this.metrics.get(`${name}-start`);
    if (!startTime) {
      console.warn(`No start mark found for ${name}`);
      return 0;
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    if (
      typeof performance !== 'undefined' &&
      performance.mark &&
      performance.measure
    ) {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
    }

    this.metrics.set(name, duration);
    return duration;
  }

  // Get Core Web Vitals
  getCoreWebVitals(): Promise<{
    lcp?: number;
    fid?: number;
    cls?: number;
    fcp?: number;
    ttfb?: number;
  }> {
    return new Promise((resolve) => {
      const vitals: Record<string, number> = {};

      // Largest Contentful Paint
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            vitals.lcp = lastEntry.startTime;
          });
          lcpObserver.observe({
            type: 'largest-contentful-paint',
            buffered: true,
          });
        } catch {
          console.warn('LCP measurement not supported');
        }

        // First Input Delay
        try {
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              const perfEntry = entry as PerformanceEventTiming;
              vitals.fid = perfEntry.processingStart - perfEntry.startTime;
            });
          });
          fidObserver.observe({ type: 'first-input', buffered: true });
        } catch {
          console.warn('FID measurement not supported');
        }

        // Cumulative Layout Shift
        try {
          const clsObserver = new PerformanceObserver((list) => {
            let clsValue = 0;
            const entries = list.getEntries();
            entries.forEach((entry) => {
              const layoutEntry = entry as PerformanceEntry & {
                hadRecentInput: boolean;
                value: number;
              };
              if (!layoutEntry.hadRecentInput) {
                clsValue += layoutEntry.value;
              }
            });
            vitals.cls = clsValue;
          });
          clsObserver.observe({ type: 'layout-shift', buffered: true });
        } catch {
          console.warn('CLS measurement not supported');
        }

        // First Contentful Paint
        try {
          const fcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              if (entry.name === 'first-contentful-paint') {
                vitals.fcp = entry.startTime;
              }
            });
          });
          fcpObserver.observe({ type: 'paint', buffered: true });
        } catch {
          console.warn('FCP measurement not supported');
        }
      }

      // Time to First Byte
      if (performance.timing) {
        vitals.ttfb =
          performance.timing.responseStart - performance.timing.navigationStart;
      }

      // Return vitals after a short delay to allow measurements to complete
      setTimeout(() => resolve(vitals), 1000);
    });
  }

  // Log performance metrics
  logMetrics(): void {
    console.group('Performance Metrics');
    this.metrics.forEach((value, key) => {
      if (!key.endsWith('-start')) {
        console.log(`${key}: ${value}ms`);
      }
    });
    console.groupEnd();
  }

  // Clear all metrics
  clear(): void {
    this.metrics.clear();
    if (typeof performance !== 'undefined' && performance.clearMarks) {
      performance.clearMarks();
      performance.clearMeasures();
    }
  }
}

// Hook for using performance monitoring
export function usePerformanceMonitor() {
  const monitor = PerformanceMonitor.getInstance();

  const startMeasurement = (name: string) => {
    monitor.mark(name);
  };

  const endMeasurement = (name: string) => {
    return monitor.measure(name);
  };

  const getCoreWebVitals = () => {
    return monitor.getCoreWebVitals();
  };

  return {
    startMeasurement,
    endMeasurement,
    getCoreWebVitals,
    logMetrics: () => monitor.logMetrics(),
    clearMetrics: () => monitor.clear(),
  };
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
) {
  const observer = new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  });

  const observe = (element: Element) => {
    observer.observe(element);
  };

  const unobserve = (element: Element) => {
    observer.unobserve(element);
  };

  const disconnect = () => {
    observer.disconnect();
  };

  return { observe, unobserve, disconnect };
}

// Debounce utility for performance optimization
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle utility for performance optimization
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
