// Browser compatibility detection and polyfills

export interface BrowserInfo {
  name: string;
  version: string;
  isSupported: boolean;
  missingFeatures: string[];
}

export interface CompatibilityCheck {
  feature: string;
  isSupported: boolean;
  fallback?: () => void;
}

export class BrowserCompatibilityChecker {
  private userAgent: string;
  private browserInfo: BrowserInfo;

  constructor() {
    this.userAgent = navigator.userAgent;
    this.browserInfo = this.detectBrowser();
  }

  private detectBrowser(): BrowserInfo {
    const ua = this.userAgent;
    let name = 'Unknown';
    let version = '0';
    let isSupported = true;
    const missingFeatures: string[] = [];

    // Detect browser
    if (ua.includes('Chrome') && !ua.includes('Edg')) {
      name = 'Chrome';
      version = ua.match(/Chrome\/(\d+)/)?.[1] || '0';
      isSupported = parseInt(version) >= 90;
    } else if (ua.includes('Firefox')) {
      name = 'Firefox';
      version = ua.match(/Firefox\/(\d+)/)?.[1] || '0';
      isSupported = parseInt(version) >= 88;
    } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
      name = 'Safari';
      version = ua.match(/Version\/(\d+)/)?.[1] || '0';
      isSupported = parseInt(version) >= 14;
    } else if (ua.includes('Edg')) {
      name = 'Edge';
      version = ua.match(/Edg\/(\d+)/)?.[1] || '0';
      isSupported = parseInt(version) >= 90;
    } else if (ua.includes('MSIE') || ua.includes('Trident')) {
      name = 'Internet Explorer';
      version = ua.match(/(?:MSIE |rv:)(\d+)/)?.[1] || '0';
      isSupported = false;
      missingFeatures.push('Modern JavaScript', 'CSS Grid', 'Flexbox', 'ES6+');
    }

    return { name, version, isSupported, missingFeatures };
  }

  public getBrowserInfo(): BrowserInfo {
    return this.browserInfo;
  }

  public checkFeatureSupport(): CompatibilityCheck[] {
    const checks: CompatibilityCheck[] = [];

    // Check for modern JavaScript features
    checks.push({
      feature: 'ES6 Modules',
      isSupported: typeof Symbol !== 'undefined',
    });

    checks.push({
      feature: 'Async/Await',
      isSupported: (async () => {})().constructor.name === 'AsyncFunction',
    });

    checks.push({
      feature: 'Fetch API',
      isSupported: typeof fetch !== 'undefined',
      fallback: () => {
        // Could load a fetch polyfill here
        console.warn('Fetch API not supported, consider using a polyfill');
      },
    });

    // Check for CSS features
    checks.push({
      feature: 'CSS Grid',
      isSupported: CSS.supports('display', 'grid'),
      fallback: () => {
        document.documentElement.classList.add('no-css-grid');
      },
    });

    checks.push({
      feature: 'CSS Custom Properties',
      isSupported: CSS.supports('--custom-property', 'value'),
      fallback: () => {
        document.documentElement.classList.add('no-css-custom-properties');
      },
    });

    checks.push({
      feature: 'Flexbox',
      isSupported: CSS.supports('display', 'flex'),
      fallback: () => {
        document.documentElement.classList.add('no-flexbox');
      },
    });

    // Check for Web APIs
    checks.push({
      feature: 'Intersection Observer',
      isSupported: 'IntersectionObserver' in window,
      fallback: () => {
        // Could load intersection observer polyfill
        console.warn('IntersectionObserver not supported');
      },
    });

    checks.push({
      feature: 'Web Vitals',
      isSupported: 'PerformanceObserver' in window,
    });

    checks.push({
      feature: 'Local Storage',
      isSupported: (() => {
        try {
          const test = '__localStorage_test__';
          localStorage.setItem(test, test);
          localStorage.removeItem(test);
          return true;
        } catch {
          return false;
        }
      })(),
    });

    return checks;
  }

  public runCompatibilityChecks(): void {
    const checks = this.checkFeatureSupport();
    const unsupportedFeatures = checks.filter((check) => !check.isSupported);

    if (unsupportedFeatures.length > 0) {
      console.warn(
        'Unsupported features detected:',
        unsupportedFeatures.map((f) => f.feature)
      );

      // Run fallbacks
      unsupportedFeatures.forEach((check) => {
        if (check.fallback) {
          check.fallback();
        }
      });
    }

    // Show warning for unsupported browsers
    if (!this.browserInfo.isSupported) {
      this.showBrowserWarning();
    }
  }

  private showBrowserWarning(): void {
    const warningDiv = document.createElement('div');
    warningDiv.id = 'browser-warning';
    warningDiv.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #f59e0b;
        color: #92400e;
        padding: 12px;
        text-align: center;
        z-index: 9999;
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 14px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      ">
        <strong>Browser Compatibility Warning:</strong>
        You are using ${this.browserInfo.name} ${this.browserInfo.version}, which may not support all features of this website.
        For the best experience, please update your browser or use a modern browser like Chrome, Firefox, Safari, or Edge.
        <button onclick="this.parentElement.parentElement.remove()" style="
          margin-left: 12px;
          background: #92400e;
          color: white;
          border: none;
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
        ">×</button>
      </div>
    `;

    document.body.insertBefore(warningDiv, document.body.firstChild);

    // Auto-hide after 10 seconds
    setTimeout(() => {
      const warning = document.getElementById('browser-warning');
      if (warning) {
        warning.remove();
      }
    }, 10000);
  }

  public addPolyfills(): void {
    // Add basic polyfills for older browsers
    if (!Array.prototype.includes) {
      Array.prototype.includes = function (searchElement, fromIndex) {
        return this.indexOf(searchElement, fromIndex) !== -1;
      };
    }

    if (!String.prototype.includes) {
      String.prototype.includes = function (search, start) {
        if (typeof start !== 'number') {
          start = 0;
        }
        return (
          start + search.length <= this.length &&
          this.indexOf(search, start) !== -1
        );
      };
    }

    // Object.assign polyfill
    if (typeof Object.assign !== 'function') {
      Object.assign = function (
        target: Record<string, unknown>,
        ...sources: Record<string, unknown>[]
      ) {
        if (target == null) {
          throw new TypeError('Cannot convert undefined or null to object');
        }
        const to = Object(target);
        for (let index = 0; index < sources.length; index++) {
          const nextSource = sources[index];
          if (nextSource != null) {
            for (const nextKey in nextSource) {
              if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                to[nextKey] = nextSource[nextKey];
              }
            }
          }
        }
        return to;
      };
    }
  }
}

// Singleton instance
export const browserCompatibility = new BrowserCompatibilityChecker();

// Initialize compatibility checks
export function initBrowserCompatibility(): void {
  browserCompatibility.addPolyfills();
  browserCompatibility.runCompatibilityChecks();
}

// Responsive design utilities
export const responsiveUtils = {
  // Check if device is mobile
  isMobile: (): boolean => {
    return (
      window.innerWidth <= 768 ||
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    );
  },

  // Check if device is tablet
  isTablet: (): boolean => {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
  },

  // Check if device is desktop
  isDesktop: (): boolean => {
    return window.innerWidth > 1024;
  },

  // Check if device supports touch
  isTouchDevice: (): boolean => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },

  // Check if user prefers reduced motion
  prefersReducedMotion: (): boolean => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Check if user prefers dark mode
  prefersDarkMode: (): boolean => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  },

  // Get viewport dimensions
  getViewportSize: () => ({
    width: window.innerWidth,
    height: window.innerHeight,
  }),

  // Add responsive classes to document
  addResponsiveClasses: (): void => {
    const classes = [];

    if (responsiveUtils.isMobile()) classes.push('is-mobile');
    if (responsiveUtils.isTablet()) classes.push('is-tablet');
    if (responsiveUtils.isDesktop()) classes.push('is-desktop');
    if (responsiveUtils.isTouchDevice()) classes.push('is-touch');
    if (responsiveUtils.prefersReducedMotion())
      classes.push('prefers-reduced-motion');
    if (responsiveUtils.prefersDarkMode()) classes.push('prefers-dark-mode');

    document.documentElement.classList.add(...classes);
  },
};
