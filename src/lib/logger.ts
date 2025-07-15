/**
 * Logging and error handling utilities
 */

import { config } from './config';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, unknown>;
  error?: Error;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  private shouldLog(level: LogLevel): boolean {
    if (config.isProduction && level < LogLevel.WARN) {
      return false;
    }
    return true;
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  debug(message: string, context?: Record<string, unknown>) {
    if (!this.shouldLog(LogLevel.DEBUG)) return;

    const entry: LogEntry = {
      level: LogLevel.DEBUG,
      message,
      timestamp: new Date(),
      context,
    };

    this.addLog(entry);
    console.debug(`[DEBUG] ${message}`, context || '');
  }

  info(message: string, context?: Record<string, unknown>) {
    if (!this.shouldLog(LogLevel.INFO)) return;

    const entry: LogEntry = {
      level: LogLevel.INFO,
      message,
      timestamp: new Date(),
      context,
    };

    this.addLog(entry);
    console.info(`[INFO] ${message}`, context || '');
  }

  warn(message: string, context?: Record<string, unknown>) {
    if (!this.shouldLog(LogLevel.WARN)) return;

    const entry: LogEntry = {
      level: LogLevel.WARN,
      message,
      timestamp: new Date(),
      context,
    };

    this.addLog(entry);
    console.warn(`[WARN] ${message}`, context || '');
  }

  error(message: string, error?: Error, context?: Record<string, unknown>) {
    const entry: LogEntry = {
      level: LogLevel.ERROR,
      message,
      timestamp: new Date(),
      context,
      error,
    };

    this.addLog(entry);
    console.error(`[ERROR] ${message}`, error || '', context || '');

    // In production, you might want to send errors to a logging service
    if (config.isProduction) {
      this.reportError(entry);
    }
  }

  private reportError(entry: LogEntry) {
    // Placeholder for error reporting service integration
    // e.g., Sentry, LogRocket, etc.
    if (config.app.debug) {
      console.log('Would report error to logging service:', entry);
    }
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (level !== undefined) {
      return this.logs.filter((log) => log.level >= level);
    }
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = new Logger();

// Global error handler
window.addEventListener('error', (event) => {
  logger.error('Uncaught error', event.error, {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
  });
});

window.addEventListener('unhandledrejection', (event) => {
  logger.error('Unhandled promise rejection', event.reason);
});

// Performance monitoring
export const performance = {
  mark: (name: string) => {
    if (config.app.debug && 'performance' in window) {
      window.performance.mark(name);
    }
  },
  measure: (name: string, startMark: string, endMark?: string) => {
    if (config.app.debug && 'performance' in window) {
      try {
        window.performance.measure(name, startMark, endMark);
        const measure = window.performance.getEntriesByName(name)[0];
        logger.debug(`Performance: ${name}`, {
          duration: measure.duration,
          startTime: measure.startTime,
        });
      } catch (error) {
        logger.warn('Performance measurement failed', {
          name,
          startMark,
          endMark,
          error,
        });
      }
    }
  },
};
