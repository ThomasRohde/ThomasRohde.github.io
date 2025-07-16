// Bundle optimization utilities and analysis

export interface BundleAnalysis {
  totalSize: number;
  gzippedSize: number;
  chunks: ChunkInfo[];
  recommendations: OptimizationRecommendation[];
}

export interface ChunkInfo {
  name: string;
  size: number;
  gzippedSize: number;
  modules: string[];
  isVendor: boolean;
  isAsync: boolean;
}

export interface OptimizationRecommendation {
  type: 'warning' | 'error' | 'info';
  category: 'size' | 'performance' | 'caching' | 'loading';
  message: string;
  impact: 'high' | 'medium' | 'low';
  solution?: string;
}

export class BundleOptimizer {
  private recommendations: OptimizationRecommendation[] = [];

  // Analyze current bundle performance
  analyzeBundlePerformance(): BundleAnalysis {
    this.recommendations = [];

    // In a real implementation, this would analyze the actual bundle
    // For now, we'll provide general optimization recommendations
    this.addGeneralRecommendations();

    return {
      totalSize: 0, // Would be calculated from actual bundle
      gzippedSize: 0,
      chunks: [],
      recommendations: this.recommendations,
    };
  }

  private addGeneralRecommendations(): void {
    // Check for common optimization opportunities
    this.checkLargeLibraries();
    this.checkCodeSplitting();
    this.checkTreeShaking();
    this.checkImageOptimization();
    this.checkCSSOptimization();
  }

  private addRecommendation(recommendation: OptimizationRecommendation): void {
    this.recommendations.push(recommendation);
  }

  private checkLargeLibraries(): void {
    // Check for commonly large libraries that might need alternatives
    const largeLibraries = [
      { name: 'moment', alternative: 'date-fns or dayjs', size: '67KB' },
      {
        name: 'lodash',
        alternative: 'individual lodash functions',
        size: '71KB',
      },
      { name: 'axios', alternative: 'native fetch', size: '15KB' },
    ];

    largeLibraries.forEach((lib) => {
      this.addRecommendation({
        type: 'info',
        category: 'size',
        message: `Consider replacing ${lib.name} (${lib.size}) with ${lib.alternative}`,
        impact: 'medium',
        solution: `Replace ${lib.name} with lighter alternatives to reduce bundle size`,
      });
    });
  }

  private checkCodeSplitting(): void {
    this.addRecommendation({
      type: 'info',
      category: 'performance',
      message:
        'Implement route-based code splitting for better loading performance',
      impact: 'high',
      solution: 'Use React.lazy() and Suspense for route components',
    });

    this.addRecommendation({
      type: 'info',
      category: 'performance',
      message: 'Consider component-level code splitting for large components',
      impact: 'medium',
      solution: 'Split large components that are not immediately visible',
    });
  }

  private checkTreeShaking(): void {
    this.addRecommendation({
      type: 'info',
      category: 'size',
      message: 'Ensure proper tree shaking by using ES6 imports',
      impact: 'medium',
      solution:
        'Import only specific functions: import { specific } from "library"',
    });
  }

  private checkImageOptimization(): void {
    this.addRecommendation({
      type: 'info',
      category: 'performance',
      message: 'Optimize images with modern formats (WebP, AVIF)',
      impact: 'high',
      solution: 'Use responsive images and modern formats with fallbacks',
    });
  }

  private checkCSSOptimization(): void {
    this.addRecommendation({
      type: 'info',
      category: 'size',
      message: 'Purge unused CSS classes in production',
      impact: 'medium',
      solution: 'Configure Tailwind CSS purging and remove unused styles',
    });
  }

  // Generate optimization report
  generateOptimizationReport(): string {
    const analysis = this.analyzeBundlePerformance();

    const highImpact = analysis.recommendations.filter(
      (r) => r.impact === 'high'
    );
    const mediumImpact = analysis.recommendations.filter(
      (r) => r.impact === 'medium'
    );
    const lowImpact = analysis.recommendations.filter(
      (r) => r.impact === 'low'
    );

    return `
Bundle Optimization Report
=========================

High Impact Optimizations (${highImpact.length}):
${highImpact.map((r) => `• ${r.message}`).join('\n')}

Medium Impact Optimizations (${mediumImpact.length}):
${mediumImpact.map((r) => `• ${r.message}`).join('\n')}

Low Impact Optimizations (${lowImpact.length}):
${lowImpact.map((r) => `• ${r.message}`).join('\n')}

Recommendations:
${analysis.recommendations
  .map((r) =>
    r.solution ? `• ${r.message}\n  Solution: ${r.solution}` : `• ${r.message}`
  )
  .join('\n\n')}
    `.trim();
  }
}

// Performance optimization utilities
export const performanceOptimizations = {
  // Preload critical resources
  preloadCriticalResources: (): void => {
    const criticalResources = [
      { href: '/fonts/inter.woff2', as: 'font', type: 'font/woff2' },
      // Add other critical resources
    ];

    criticalResources.forEach((resource) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.type) link.type = resource.type;
      if (resource.as === 'font') link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  },

  // Prefetch next page resources
  prefetchNextPageResources: (routes: string[]): void => {
    routes.forEach((route) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    });
  },

  // Optimize images with intersection observer
  optimizeImages: (): void => {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach((img) => {
        imageObserver.observe(img);
      });
    }
  },

  // Implement service worker for caching
  registerServiceWorker: async (): Promise<void> => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  },

  // Critical CSS inlining
  inlineCriticalCSS: (): void => {
    // This would typically be done at build time
    // Here we can add critical styles for above-the-fold content
    const criticalCSS = `
      /* Critical CSS for above-the-fold content */
      body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }
      .hero { min-height: 100vh; display: flex; align-items: center; }
    `;

    const style = document.createElement('style');
    style.textContent = criticalCSS;
    document.head.insertBefore(style, document.head.firstChild);
  },

  // Optimize third-party scripts
  optimizeThirdPartyScripts: (): void => {
    // Defer non-critical third-party scripts
    const scripts = document.querySelectorAll(
      'script[src*="analytics"], script[src*="tracking"]'
    );
    scripts.forEach((script) => {
      script.setAttribute('defer', '');
    });
  },

  // Resource hints for better loading
  addResourceHints: (): void => {
    const hints = [
      { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: true,
      },
    ];

    hints.forEach((hint) => {
      const link = document.createElement('link');
      link.rel = hint.rel;
      link.href = hint.href;
      if (hint.crossorigin) link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  },
};

// Initialize all performance optimizations
export function initPerformanceOptimizations(): void {
  // Run optimizations after DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runOptimizations);
  } else {
    runOptimizations();
  }
}

function runOptimizations(): void {
  performanceOptimizations.addResourceHints();
  performanceOptimizations.preloadCriticalResources();
  performanceOptimizations.optimizeImages();
  performanceOptimizations.optimizeThirdPartyScripts();
  performanceOptimizations.registerServiceWorker();
}

// Export singleton
export const bundleOptimizer = new BundleOptimizer();
