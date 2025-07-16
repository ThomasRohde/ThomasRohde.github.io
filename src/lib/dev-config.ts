/**
 * Development configuration and utilities
 */

import { config } from './config';

export interface DevConfig {
  // Hot Module Replacement
  hmr: {
    enabled: boolean;
    port: number;
    overlay: boolean;
  };

  // Performance monitoring
  performance: {
    enabled: boolean;
    measureComponents: boolean;
    measureRoutes: boolean;
    logSlowOperations: boolean;
    slowOperationThreshold: number; // ms
  };

  // Error handling
  errorHandling: {
    showErrorBoundary: boolean;
    logToConsole: boolean;
    logToServer: boolean;
    showStackTrace: boolean;
  };

  // Debugging
  debugging: {
    enableReactDevTools: boolean;
    enableReduxDevTools: boolean;
    verboseLogging: boolean;
    logStateChanges: boolean;
    logNetworkRequests: boolean;
  };

  // Build optimization
  build: {
    sourceMaps: boolean;
    bundleAnalysis: boolean;
    treeShaking: boolean;
    codesplitting: boolean;
  };
}

export const devConfig: DevConfig = {
  hmr: {
    enabled: config.isDevelopment,
    port: 3001,
    overlay: true,
  },

  performance: {
    enabled: config.app.debug,
    measureComponents: config.app.debug,
    measureRoutes: config.app.debug,
    logSlowOperations: config.app.debug,
    slowOperationThreshold: 100,
  },

  errorHandling: {
    showErrorBoundary: true,
    logToConsole: config.isDevelopment,
    logToServer: config.isProduction,
    showStackTrace: config.isDevelopment,
  },

  debugging: {
    enableReactDevTools: config.isDevelopment,
    enableReduxDevTools: config.isDevelopment,
    verboseLogging: config.app.debug,
    logStateChanges: config.app.debug,
    logNetworkRequests: config.app.debug,
  },

  build: {
    sourceMaps: true,
    bundleAnalysis: config.isDevelopment,
    treeShaking: true,
    codesplitting: true,
  },
};

// Development utilities
export const devUtils = {
  // Measure execution time
  time: <T>(label: string, fn: () => T): T => {
    if (!devConfig.performance.enabled) {
      return fn();
    }

    console.time(label);
    const result = fn();
    console.timeEnd(label);
    return result;
  },

  // Measure async execution time
  timeAsync: async <T>(label: string, fn: () => Promise<T>): Promise<T> => {
    if (!devConfig.performance.enabled) {
      return fn();
    }

    console.time(label);
    const result = await fn();
    console.timeEnd(label);
    return result;
  },

  // Log only in development
  log: (...args: unknown[]) => {
    if (devConfig.debugging.verboseLogging) {
      console.log('[DEV]', ...args);
    }
  },

  // Warn only in development
  warn: (...args: unknown[]) => {
    if (devConfig.debugging.verboseLogging) {
      console.warn('[DEV]', ...args);
    }
  },

  // Error logging
  error: (...args: unknown[]) => {
    if (devConfig.errorHandling.logToConsole) {
      console.error('[DEV]', ...args);
    }
  },

  // Performance mark
  mark: (name: string) => {
    if (devConfig.performance.enabled && 'performance' in window) {
      performance.mark(name);
    }
  },

  // Performance measure
  measure: (name: string, startMark: string, endMark?: string) => {
    if (devConfig.performance.enabled && 'performance' in window) {
      try {
        performance.measure(name, startMark, endMark);
        const measure = performance.getEntriesByName(name)[0];
        if (
          measure &&
          measure.duration > devConfig.performance.slowOperationThreshold
        ) {
          console.warn(
            `[PERF] Slow operation detected: ${name} took ${measure.duration.toFixed(2)}ms`
          );
        }
      } catch (error) {
        console.warn('[PERF] Failed to measure:', name, error);
      }
    }
  },

  // Component render tracking
  trackRender: (componentName: string, props?: Record<string, unknown>) => {
    if (devConfig.performance.measureComponents) {
      console.log(`[RENDER] ${componentName}`, props ? { props } : '');
    }
  },

  // Route change tracking
  trackRoute: (from: string, to: string) => {
    if (devConfig.performance.measureRoutes) {
      console.log(`[ROUTE] ${from} → ${to}`);
    }
  },

  // Network request tracking
  trackRequest: (method: string, url: string, duration?: number) => {
    if (devConfig.debugging.logNetworkRequests) {
      console.log(
        `[NETWORK] ${method} ${url}${duration ? ` (${duration}ms)` : ''}`
      );
    }
  },

  // State change tracking
  trackStateChange: (
    component: string,
    oldState: unknown,
    newState: unknown
  ) => {
    if (devConfig.debugging.logStateChanges) {
      console.log(`[STATE] ${component}`, { oldState, newState });
    }
  },
};

// React DevTools integration
export const setupReactDevTools = () => {
  if (
    !devConfig.debugging.enableReactDevTools ||
    typeof window === 'undefined'
  ) {
    return;
  }

  // Add React DevTools detection
  if (
    (window as unknown as { __REACT_DEVTOOLS_GLOBAL_HOOK__?: unknown })
      .__REACT_DEVTOOLS_GLOBAL_HOOK__
  ) {
    console.log('[DEV] React DevTools detected');
  } else {
    console.log(
      '[DEV] React DevTools not detected. Install the browser extension for better debugging.'
    );
  }
};

// Hot reload handlers
export const setupHotReload = () => {
  if (!devConfig.hmr.enabled || !import.meta.hot) {
    return;
  }

  import.meta.hot.on('vite:beforeUpdate', () => {
    devUtils.log('Hot reload: Update incoming...');
  });

  import.meta.hot.on('vite:afterUpdate', () => {
    devUtils.log('Hot reload: Update completed');
  });

  import.meta.hot.on('vite:error', (error) => {
    devUtils.error('Hot reload error:', error);
  });
};

// Initialize development tools
export const initDevTools = () => {
  if (!config.isDevelopment) {
    return;
  }

  setupReactDevTools();
  setupHotReload();

  // Add global dev utilities
  if (typeof window !== 'undefined') {
    (
      window as unknown as {
        __DEV_CONFIG__: DevConfig;
        __DEV_UTILS__: typeof devUtils;
      }
    ).__DEV_CONFIG__ = devConfig;
    (
      window as unknown as {
        __DEV_CONFIG__: DevConfig;
        __DEV_UTILS__: typeof devUtils;
      }
    ).__DEV_UTILS__ = devUtils;
  }

  devUtils.log('Development tools initialized', {
    config: devConfig,
    environment: config.app.env,
    debug: config.app.debug,
  });
};

export default devConfig;
