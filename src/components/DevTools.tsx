/**
 * Development tools component - only rendered in development mode
 */

import { useState, useEffect } from 'react';
import { config } from '@/lib/config';
import DevPanel from './DevPanel';

// Initialize dev tools
import '@/lib/dev-tools';

interface DevToolsProps {
  enabled?: boolean;
}

// Development-only floating toggle button
export function DevToolsToggle({
  enabled = config.isDevelopment,
}: DevToolsProps) {
  const [showDevTools, setShowDevTools] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Toggle dev tools with Ctrl+Shift+D
      if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        event.preventDefault();
        setShowDevTools((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <DevPanel
      isOpen={showDevTools}
      onToggle={() => setShowDevTools(!showDevTools)}
    />
  );
}
