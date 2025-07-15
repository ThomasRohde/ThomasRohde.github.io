/**
 * Development tools component - only rendered in development mode
 */

import { useState, useEffect } from 'react';
import { config } from '@/lib/config';
import { logger, LogLevel } from '@/lib/logger';

interface DevToolsProps {
  enabled?: boolean;
}

export function DevTools({ enabled = config.isDevelopment }: DevToolsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState(logger.getLogs());

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      setLogs(logger.getLogs());
    }, 1000);

    return () => clearInterval(interval);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Toggle dev tools with Ctrl+Shift+D
      if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        event.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled]);

  if (!enabled || !isOpen) {
    return null;
  }

  const errorLogs = logs.filter((log) => log.level === LogLevel.ERROR);
  const warnLogs = logs.filter((log) => log.level === LogLevel.WARN);

  return (
    <div className="fixed right-4 bottom-4 z-50 max-w-md">
      <div className="rounded-lg border border-gray-700 bg-gray-900 text-white shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-700 p-3">
          <h3 className="text-sm font-semibold">Dev Tools</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="space-y-2 p-3">
          <div className="text-xs">
            <div className="flex justify-between">
              <span>Environment:</span>
              <span className="font-mono">{config.app.env}</span>
            </div>
            <div className="flex justify-between">
              <span>Version:</span>
              <span className="font-mono">{config.app.version}</span>
            </div>
            <div className="flex justify-between">
              <span>Debug:</span>
              <span className="font-mono">
                {config.app.debug ? 'ON' : 'OFF'}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-2">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Total Logs:</span>
                <span className="font-mono">{logs.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-400">Warnings:</span>
                <span className="font-mono">{warnLogs.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-400">Errors:</span>
                <span className="font-mono">{errorLogs.length}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-2">
            <button
              onClick={() => logger.clearLogs()}
              className="rounded bg-gray-700 px-2 py-1 text-xs hover:bg-gray-600"
            >
              Clear Logs
            </button>
          </div>

          {errorLogs.length > 0 && (
            <div className="border-t border-gray-700 pt-2">
              <div className="mb-1 text-xs font-semibold text-red-400">
                Recent Errors:
              </div>
              <div className="max-h-32 space-y-1 overflow-y-auto">
                {errorLogs.slice(-3).map((log, index) => (
                  <div
                    key={index}
                    className="rounded bg-red-900/20 p-1 text-xs text-red-300"
                  >
                    {log.message}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Development-only floating toggle button
export function DevToolsToggle({
  enabled = config.isDevelopment,
}: DevToolsProps) {
  const [showDevTools, setShowDevTools] = useState(false);

  if (!enabled) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setShowDevTools(true)}
        className="fixed bottom-4 left-4 z-40 rounded-full bg-gray-800 p-2 text-xs text-white shadow-lg hover:bg-gray-700"
        title="Open Dev Tools (Ctrl+Shift+D)"
      >
        🛠️
      </button>

      {showDevTools && <DevTools enabled={enabled} />}
    </>
  );
}
