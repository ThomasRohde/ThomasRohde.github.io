import React, { useState, useEffect } from 'react';
import { logger, LogLevel } from '@/lib/logger';
import { config } from '@/lib/config';

interface DevPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

const DevPanel: React.FC<DevPanelProps> = ({ isOpen, onToggle }) => {
  const [logs, setLogs] = useState(logger.getLogs());
  const [selectedLogLevel, setSelectedLogLevel] = useState<LogLevel>(
    LogLevel.DEBUG
  );
  const [performanceEntries, setPerformanceEntries] = useState<
    PerformanceEntry[]
  >([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(logger.getLogs());
      if ('performance' in window) {
        setPerformanceEntries(performance.getEntries().slice(-10));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const filteredLogs = logs.filter((log) => log.level >= selectedLogLevel);

  const getLogLevelColor = (level: LogLevel) => {
    switch (level) {
      case LogLevel.DEBUG:
        return 'text-gray-600';
      case LogLevel.INFO:
        return 'text-blue-600';
      case LogLevel.WARN:
        return 'text-yellow-600';
      case LogLevel.ERROR:
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getLogLevelBg = (level: LogLevel) => {
    switch (level) {
      case LogLevel.DEBUG:
        return 'bg-gray-100';
      case LogLevel.INFO:
        return 'bg-blue-100';
      case LogLevel.WARN:
        return 'bg-yellow-100';
      case LogLevel.ERROR:
        return 'bg-red-100';
      default:
        return 'bg-gray-100';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    });
  };

  const getMemoryInfo = () => {
    if ('memory' in performance) {
      const memory = (
        performance as unknown as {
          memory: {
            usedJSHeapSize: number;
            totalJSHeapSize: number;
            jsHeapSizeLimit: number;
          };
        }
      ).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1048576),
        total: Math.round(memory.totalJSHeapSize / 1048576),
        limit: Math.round(memory.jsHeapSizeLimit / 1048576),
      };
    }
    return null;
  };

  if (!config.isDevelopment) {
    return null;
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed right-4 bottom-4 z-50 rounded-full bg-gray-800 p-3 text-white shadow-lg transition-colors hover:bg-gray-700"
        title="Toggle Dev Panel"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>

      {/* Dev Panel */}
      {isOpen && (
        <div
          className="bg-opacity-50 fixed inset-0 z-40 bg-black"
          onClick={onToggle}
        >
          <div
            className="absolute top-0 right-0 flex h-full w-96 flex-col overflow-hidden bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-gray-800 p-4 text-white">
              <h2 className="text-lg font-semibold">Dev Panel</h2>
              <button
                onClick={onToggle}
                className="text-gray-300 hover:text-white"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Environment Info */}
              <div className="border-b p-4">
                <h3 className="mb-2 font-semibold">Environment</h3>
                <div className="space-y-1 text-sm">
                  <div>
                    Mode: <span className="font-mono">{config.app.env}</span>
                  </div>
                  <div>
                    Debug:{' '}
                    <span className="font-mono">
                      {config.app.debug ? 'ON' : 'OFF'}
                    </span>
                  </div>
                  <div>
                    Version:{' '}
                    <span className="font-mono">{config.app.version}</span>
                  </div>
                </div>
              </div>

              {/* Memory Info */}
              {getMemoryInfo() && (
                <div className="border-b p-4">
                  <h3 className="mb-2 font-semibold">Memory Usage</h3>
                  <div className="space-y-1 text-sm">
                    <div>
                      Used:{' '}
                      <span className="font-mono">
                        {getMemoryInfo()!.used} MB
                      </span>
                    </div>
                    <div>
                      Total:{' '}
                      <span className="font-mono">
                        {getMemoryInfo()!.total} MB
                      </span>
                    </div>
                    <div>
                      Limit:{' '}
                      <span className="font-mono">
                        {getMemoryInfo()!.limit} MB
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Performance */}
              <div className="border-b p-4">
                <h3 className="mb-2 font-semibold">Recent Performance</h3>
                <div className="max-h-32 space-y-1 overflow-y-auto text-xs">
                  {performanceEntries.slice(-5).map((entry, index) => (
                    <div key={index} className="font-mono">
                      <span className="text-gray-600">{entry.entryType}:</span>{' '}
                      {entry.name}
                      {entry.duration && (
                        <span className="text-blue-600">
                          {' '}
                          ({entry.duration.toFixed(2)}ms)
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Logs */}
              <div className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-semibold">
                    Logs ({filteredLogs.length})
                  </h3>
                  <div className="flex gap-2">
                    <select
                      value={selectedLogLevel}
                      onChange={(e) =>
                        setSelectedLogLevel(Number(e.target.value) as LogLevel)
                      }
                      className="rounded border px-2 py-1 text-xs"
                    >
                      <option value={LogLevel.DEBUG}>Debug+</option>
                      <option value={LogLevel.INFO}>Info+</option>
                      <option value={LogLevel.WARN}>Warn+</option>
                      <option value={LogLevel.ERROR}>Error</option>
                    </select>
                    <button
                      onClick={() => {
                        logger.clearLogs();
                        setLogs([]);
                      }}
                      className="rounded bg-gray-200 px-2 py-1 text-xs hover:bg-gray-300"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="max-h-96 space-y-1 overflow-y-auto text-xs">
                  {filteredLogs
                    .slice(-50)
                    .reverse()
                    .map((log, index) => (
                      <div
                        key={index}
                        className={`rounded border-l-2 p-2 ${getLogLevelBg(log.level)} border-l-current ${getLogLevelColor(log.level)}`}
                      >
                        <div className="flex items-start justify-between">
                          <span className="font-semibold">
                            {LogLevel[log.level]}
                          </span>
                          <span className="font-mono text-gray-500">
                            {formatTime(log.timestamp)}
                          </span>
                        </div>
                        <div className="mt-1">{log.message}</div>
                        {log.context && (
                          <details className="mt-1">
                            <summary className="cursor-pointer text-gray-600">
                              Context
                            </summary>
                            <pre className="mt-1 overflow-auto rounded bg-gray-50 p-1 text-xs">
                              {JSON.stringify(log.context, null, 2)}
                            </pre>
                          </details>
                        )}
                        {log.error && (
                          <details className="mt-1">
                            <summary className="cursor-pointer text-red-600">
                              Error
                            </summary>
                            <pre className="mt-1 overflow-auto rounded bg-red-50 p-1 text-xs">
                              {log.error.stack || log.error.message}
                            </pre>
                          </details>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DevPanel;
