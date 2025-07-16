import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// Initialize development tools and performance monitoring
import { initDevTools } from '@/lib/dev-config';
import { performanceMonitor } from '@/lib/performance';
import { config } from '@/lib/config';
import {
  initBrowserCompatibility,
  responsiveUtils,
} from '@/lib/browser-compatibility';
import { initPerformanceOptimizations } from '@/lib/bundle-optimizer';

initDevTools();
initBrowserCompatibility();
responsiveUtils.addResponsiveClasses();
initPerformanceOptimizations();

// Initialize performance monitoring
if (config.isProduction) {
  performanceMonitor.onMetricsUpdate((metrics) => {
    // In production, you might want to send metrics to an analytics service
    console.log('Performance metrics:', metrics);
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
