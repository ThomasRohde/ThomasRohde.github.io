/**
 * Development tools and utilities for debugging and monitoring
 */

import React from 'react';
import { config } from './config';
import { logger } from './logger';

interface DevToolsConfig {
  enableReactDevTools: boolean;
  enableReduxDevTools: boolean;
  enablePerformanceMonitoring: boolean;
  enableErrorBoundaryLogging: boolean;
  enableHotReload: boolean;
}

class DevTools {
  private config: DevToolsConfig;
  private performanceObserver?: PerformanceObserver;

  constructor() {
    this.config = {
      enableReactDevTools: config.isDevelopment,
      enableReduxDevTools: config.isDevelopment,
      enablePerformanceMonitoring: config.app.debug,
      enableErrorBoundaryLogging: true,
      enableHotReload: config.isDevelopment,
    };

    this.init();
  }

  private init() {
    if (!config.isDevelopment) return;

    this.setupPerformanceMonitoring();
    this.setupHotReloadHandlers();
    this.setupGlobalDevHelpers();
    this.logEnvironmentInfo();
  }

  private setupPerformanceMonitoring() {
    if (
      !this.config.enablePerformanceMonitoring ||
      !('PerformanceObserver' in window)
    ) {
      return;
    }

    try {
      this.performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            logger.debug('Navigation Performance', {
              domContentLoaded:
                navEntry.domContentLoadedEventEnd -
                navEntry.domContentLoadedEventStart,
              loadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
              totalTime: navEntry.loadEventEnd - navEntry.fetchStart,
            });
          }

          if (entry.entryType === 'paint') {
            logger.debug(`Paint Performance: ${entry.name}`, {
              startTime: entry.startTime,
              duration: entry.duration,
            });
          }

          if (entry.entryType === 'largest-contentful-paint') {
            logger.debug('Largest Contentful Paint', {
              startTime: entry.startTime,
              size: (entry as unknown as { size: number }).size,
            });
          }
        });
      });

      this.performanceObserver.observe({
        entryTypes: ['navigation', 'paint', 'largest-contentful-paint'],
      });
    } catch (error) {
      logger.warn('Failed to setup performance monitoring', { error });
    }
  }

  private setupHotReloadHandlers() {
    if (!this.config.enableHotReload || !import.meta.hot) return;

    import.meta.hot.on('vite:beforeUpdate', () => {
      logger.debug('Hot reload: Module update incoming');
    });

    import.meta.hot.on('vite:afterUpdate', () => {
      logger.debug('Hot reload: Module updated successfully');
    });

    import.meta.hot.on('vite:error', (error) => {
      logger.error('Hot reload error', new Error(String(error)));
    });
  }

  private setupGlobalDevHelpers() {
    if (typeof window === 'undefined') return;

    // Add global dev helpers to window object
    const devToolsGlobal = {
      config: this.config,
      logger,
      clearLogs: () => logger.clearLogs(),
      getLogs: (level?: number) => logger.getLogs(level),
      performance: {
        mark: (name: string) => performance.mark?.(name),
        measure: (name: string, start?: string, end?: string) => {
          try {
            performance.measure?.(name, start, end);
            const measure = performance.getEntriesByName(name)[0];
            logger.debug(`Performance measure: ${name}`, {
              duration: measure?.duration,
            });
          } catch (error) {
            logger.warn('Performance measure failed', { name, error });
          }
        },
        getEntries: () => performance.getEntries(),
      },
      memory: () => {
        if ('memory' in performance) {
          return (
            performance as unknown as {
              memory: {
                usedJSHeapSize: number;
                totalJSHeapSize: number;
                jsHeapSizeLimit: number;
              };
            }
          ).memory;
        }
        return null;
      },
      reload: () => window.location.reload(),
      inspect: (element: Element) => {
        if (config.isDevelopment) {
          console.log('Element inspection:', element);
          console.log('Computed styles:', window.getComputedStyle(element));
        }
      },
    };

    (
      window as unknown as { __DEV_TOOLS__: typeof devToolsGlobal }
    ).__DEV_TOOLS__ = devToolsGlobal;

    logger.debug('Development tools initialized', {
      tools: Object.keys(devToolsGlobal),
    });
  }

  private logEnvironmentInfo() {
    logger.info('Development Environment Info', {
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth,
      },
      connection: (
        navigator as unknown as {
          connection?: { effectiveType: string; downlink: number };
        }
      ).connection
        ? {
            effectiveType: (
              navigator as unknown as {
                connection: { effectiveType: string; downlink: number };
              }
            ).connection.effectiveType,
            downlink: (
              navigator as unknown as {
                connection: { effectiveType: string; downlink: number };
              }
            ).connection.downlink,
          }
        : 'unknown',
      memory: (
        performance as unknown as {
          memory?: {
            usedJSHeapSize: number;
            totalJSHeapSize: number;
            jsHeapSizeLimit: number;
          };
        }
      ).memory
        ? {
            used: Math.round(
              (
                performance as unknown as {
                  memory: {
                    usedJSHeapSize: number;
                    totalJSHeapSize: number;
                    jsHeapSizeLimit: number;
                  };
                }
              ).memory.usedJSHeapSize / 1048576
            ),
            total: Math.round(
              (
                performance as unknown as {
                  memory: {
                    usedJSHeapSize: number;
                    totalJSHeapSize: number;
                    jsHeapSizeLimit: number;
                  };
                }
              ).memory.totalJSHeapSize / 1048576
            ),
            limit: Math.round(
              (
                performance as unknown as {
                  memory: {
                    usedJSHeapSize: number;
                    totalJSHeapSize: number;
                    jsHeapSizeLimit: number;
                  };
                }
              ).memory.jsHeapSizeLimit / 1048576
            ),
          }
        : 'unknown',
    });
  }

  // Public methods for manual debugging
  public measureRender(componentName: string, renderFn: () => void) {
    if (!config.app.debug) {
      renderFn();
      return;
    }

    const startMark = `${componentName}-render-start`;
    const endMark = `${componentName}-render-end`;
    const measureName = `${componentName}-render-time`;

    performance.mark?.(startMark);
    renderFn();
    performance.mark?.(endMark);

    try {
      performance.measure?.(measureName, startMark, endMark);
      const measure = performance.getEntriesByName(measureName)[0];
      logger.debug(`Component render time: ${componentName}`, {
        duration: measure?.duration,
      });
    } catch (error) {
      logger.warn('Render measurement failed', { componentName, error });
    }
  }

  public logComponentMount(
    componentName: string,
    props?: Record<string, unknown>
  ) {
    if (config.app.debug) {
      logger.debug(`Component mounted: ${componentName}`, { props });
    }
  }

  public logComponentUnmount(componentName: string) {
    if (config.app.debug) {
      logger.debug(`Component unmounted: ${componentName}`);
    }
  }

  public logStateChange(
    componentName: string,
    oldState: unknown,
    newState: unknown
  ) {
    if (config.app.debug) {
      logger.debug(`State change in ${componentName}`, {
        oldState,
        newState,
      });
    }
  }

  public dispose() {
    this.performanceObserver?.disconnect();
  }
}

// Create singleton instance
export const devTools = new DevTools();

// React DevTools integration
export const withDevTools = <T extends Record<string, unknown>>(
  Component: React.ComponentType<T>,
  displayName?: string
) => {
  if (!config.isDevelopment) return Component;

  const WrappedComponent = (props: T) => {
    const componentName =
      displayName || Component.displayName || Component.name || 'Unknown';

    React.useEffect(() => {
      devTools.logComponentMount(componentName, props);
      return () => devTools.logComponentUnmount(componentName);
    }, [componentName, props]);

    return React.createElement(Component, props);
  };

  WrappedComponent.displayName = `withDevTools(${displayName || Component.displayName || Component.name})`;

  return WrappedComponent;
};

// Performance monitoring hook
export const usePerformanceMonitor = (componentName: string) => {
  const renderCount = React.useRef(0);
  const mountTime = React.useRef(Date.now());

  React.useEffect(() => {
    renderCount.current += 1;

    if (config.app.debug) {
      logger.debug(
        `Component render #${renderCount.current}: ${componentName}`,
        {
          timeSinceMount: Date.now() - mountTime.current,
        }
      );
    }
  });

  return {
    renderCount: renderCount.current,
    timeSinceMount: Date.now() - mountTime.current,
  };
};

// Error boundary logging
export const logErrorBoundary = (
  error: Error,
  errorInfo: React.ErrorInfo,
  componentStack?: string
) => {
  logger.error('React Error Boundary caught an error', error, {
    errorInfo,
    componentStack,
    timestamp: new Date().toISOString(),
  });
};

export default devTools;
