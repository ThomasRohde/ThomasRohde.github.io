/**
 * Application configuration based on environment variables
 */

export const config = {
  app: {
    name:
      import.meta.env.VITE_APP_NAME || 'Thomas Rohde - Personal Landing Page',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    env: import.meta.env.VITE_APP_ENV || 'development',
    debug: import.meta.env.VITE_APP_DEBUG === 'true',
    apiUrl: import.meta.env.VITE_APP_API_URL || 'http://localhost:3000',
    enableAnalytics: import.meta.env.VITE_APP_ENABLE_ANALYTICS === 'true',
  },
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;

export type Config = typeof config;

// Development-only utilities
export const devTools = {
  log: (...args: unknown[]) => {
    if (config.app.debug) {
      console.log('[DEV]', ...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (config.app.debug) {
      console.warn('[DEV]', ...args);
    }
  },
  error: (...args: unknown[]) => {
    if (config.app.debug) {
      console.error('[DEV]', ...args);
    }
  },
};
