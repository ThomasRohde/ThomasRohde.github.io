// Accessibility testing and validation utilities

export interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info';
  rule: string;
  message: string;
  element?: Element;
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
}

export class AccessibilityChecker {
  private issues: AccessibilityIssue[] = [];

  // Check for common accessibility issues
  checkAccessibility(container: Element = document.body): AccessibilityIssue[] {
    this.issues = [];

    this.checkImages(container);
    this.checkHeadings(container);
    this.checkLinks(container);
    this.checkForms(container);
    this.checkButtons(container);
    this.checkLandmarks(container);
    this.checkColorContrast(container);
    this.checkKeyboardNavigation(container);

    return this.issues;
  }

  private addIssue(issue: AccessibilityIssue) {
    this.issues.push(issue);
  }

  // Check images for alt text
  private checkImages(container: Element) {
    const images = container.querySelectorAll('img');
    images.forEach((img) => {
      if (!img.hasAttribute('alt')) {
        this.addIssue({
          type: 'error',
          rule: 'img-alt',
          message: 'Image missing alt attribute',
          element: img,
          severity: 'serious',
        });
      } else if (img.getAttribute('alt') === '') {
        // Empty alt is okay for decorative images, but check if it should be decorative
        const hasAriaHidden = img.hasAttribute('aria-hidden');
        if (!hasAriaHidden) {
          this.addIssue({
            type: 'warning',
            rule: 'img-alt-empty',
            message: 'Image has empty alt text but is not marked as decorative',
            element: img,
            severity: 'moderate',
          });
        }
      }
    });
  }

  // Check heading hierarchy
  private checkHeadings(container: Element) {
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let previousLevel = 0;

    headings.forEach((heading) => {
      const level = parseInt(heading.tagName.charAt(1));

      if (level - previousLevel > 1) {
        this.addIssue({
          type: 'warning',
          rule: 'heading-hierarchy',
          message: `Heading level skipped from h${previousLevel} to h${level}`,
          element: heading,
          severity: 'moderate',
        });
      }

      previousLevel = level;
    });

    // Check for multiple h1s
    const h1s = container.querySelectorAll('h1');
    if (h1s.length > 1) {
      this.addIssue({
        type: 'warning',
        rule: 'multiple-h1',
        message: 'Multiple h1 elements found on page',
        severity: 'moderate',
      });
    }
  }

  // Check links
  private checkLinks(container: Element) {
    const links = container.querySelectorAll('a');
    links.forEach((link) => {
      // Check for empty links
      const text = link.textContent?.trim();
      const ariaLabel = link.getAttribute('aria-label');
      const ariaLabelledby = link.getAttribute('aria-labelledby');

      if (!text && !ariaLabel && !ariaLabelledby) {
        this.addIssue({
          type: 'error',
          rule: 'link-name',
          message: 'Link has no accessible name',
          element: link,
          severity: 'serious',
        });
      }

      // Check for generic link text
      if (
        text &&
        ['click here', 'read more', 'more', 'here'].includes(text.toLowerCase())
      ) {
        this.addIssue({
          type: 'warning',
          rule: 'link-text',
          message: 'Link text is not descriptive',
          element: link,
          severity: 'moderate',
        });
      }

      // Check external links
      const href = link.getAttribute('href');
      if (
        href &&
        href.startsWith('http') &&
        !href.includes(window.location.hostname)
      ) {
        const hasExternalIndicator =
          link.querySelector('[aria-hidden="true"]') ||
          link.getAttribute('aria-label')?.includes('external') ||
          link.getAttribute('title')?.includes('external');

        if (!hasExternalIndicator) {
          this.addIssue({
            type: 'info',
            rule: 'external-link',
            message: 'External link should indicate it opens in new context',
            element: link,
            severity: 'minor',
          });
        }
      }
    });
  }

  // Check form elements
  private checkForms(container: Element) {
    const inputs = container.querySelectorAll('input, textarea, select');
    inputs.forEach((input) => {
      const id = input.getAttribute('id');
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledby = input.getAttribute('aria-labelledby');

      // Check for labels
      let hasLabel = false;
      if (id) {
        const label = container.querySelector(`label[for="${id}"]`);
        hasLabel = !!label;
      }

      if (!hasLabel && !ariaLabel && !ariaLabelledby) {
        this.addIssue({
          type: 'error',
          rule: 'form-label',
          message: 'Form control has no accessible label',
          element: input,
          severity: 'serious',
        });
      }

      // Check required fields
      if (input.hasAttribute('required')) {
        const hasRequiredIndicator =
          ariaLabel?.includes('required') ||
          container
            .querySelector(`label[for="${id}"]`)
            ?.textContent?.includes('*') ||
          input.getAttribute('aria-describedby');

        if (!hasRequiredIndicator) {
          this.addIssue({
            type: 'warning',
            rule: 'required-field',
            message: 'Required field should be clearly indicated',
            element: input,
            severity: 'moderate',
          });
        }
      }
    });
  }

  // Check buttons
  private checkButtons(container: Element) {
    const buttons = container.querySelectorAll('button, [role="button"]');
    buttons.forEach((button) => {
      const text = button.textContent?.trim();
      const ariaLabel = button.getAttribute('aria-label');
      const ariaLabelledby = button.getAttribute('aria-labelledby');

      if (!text && !ariaLabel && !ariaLabelledby) {
        this.addIssue({
          type: 'error',
          rule: 'button-name',
          message: 'Button has no accessible name',
          element: button,
          severity: 'serious',
        });
      }
    });
  }

  // Check landmarks
  private checkLandmarks(container: Element) {
    const main = container.querySelectorAll('main, [role="main"]');
    if (main.length === 0) {
      this.addIssue({
        type: 'error',
        rule: 'landmark-main',
        message: 'Page should have a main landmark',
        severity: 'serious',
      });
    } else if (main.length > 1) {
      this.addIssue({
        type: 'warning',
        rule: 'landmark-main-multiple',
        message: 'Page should have only one main landmark',
        severity: 'moderate',
      });
    }

    // Check for navigation landmarks
    const nav = container.querySelectorAll('nav, [role="navigation"]');
    if (nav.length === 0) {
      this.addIssue({
        type: 'warning',
        rule: 'landmark-navigation',
        message: 'Page should have navigation landmarks',
        severity: 'moderate',
      });
    }
  }

  // Basic color contrast check (simplified)
  private checkColorContrast(container: Element) {
    const textElements = container.querySelectorAll(
      'p, span, div, h1, h2, h3, h4, h5, h6, a, button'
    );

    textElements.forEach((element) => {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;

      // This is a simplified check - in a real implementation, you'd calculate actual contrast ratios
      if (color === backgroundColor) {
        this.addIssue({
          type: 'error',
          rule: 'color-contrast',
          message: 'Text color and background color are the same',
          element: element,
          severity: 'critical',
        });
      }
    });
  }

  // Check keyboard navigation
  private checkKeyboardNavigation(container: Element) {
    const focusableElements = container.querySelectorAll(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );

    focusableElements.forEach((element) => {
      const tabIndex = element.getAttribute('tabindex');

      // Check for positive tabindex (anti-pattern)
      if (tabIndex && parseInt(tabIndex) > 0) {
        this.addIssue({
          type: 'warning',
          rule: 'tabindex-positive',
          message: 'Avoid positive tabindex values',
          element: element,
          severity: 'moderate',
        });
      }

      // Check for focus indicators
      const styles = window.getComputedStyle(element, ':focus');
      const outline = styles.outline;
      const boxShadow = styles.boxShadow;

      if (outline === 'none' && !boxShadow.includes('inset')) {
        this.addIssue({
          type: 'warning',
          rule: 'focus-indicator',
          message: 'Element may not have visible focus indicator',
          element: element,
          severity: 'moderate',
        });
      }
    });
  }

  // Generate accessibility report
  generateReport(): string {
    const criticalIssues = this.issues.filter((i) => i.severity === 'critical');
    const seriousIssues = this.issues.filter((i) => i.severity === 'serious');
    const moderateIssues = this.issues.filter((i) => i.severity === 'moderate');
    const minorIssues = this.issues.filter((i) => i.severity === 'minor');

    return `
Accessibility Report
===================
Total Issues: ${this.issues.length}

Critical: ${criticalIssues.length}
Serious: ${seriousIssues.length}
Moderate: ${moderateIssues.length}
Minor: ${minorIssues.length}

${this.issues
  .map(
    (issue) =>
      `${issue.severity.toUpperCase()}: ${issue.message} (${issue.rule})`
  )
  .join('\n')}
    `.trim();
  }
}

// Hook for accessibility checking
export function useAccessibilityChecker() {
  const checker = new AccessibilityChecker();

  const checkPage = () => {
    return checker.checkAccessibility();
  };

  const checkElement = (element: Element) => {
    return checker.checkAccessibility(element);
  };

  const generateReport = () => {
    checker.checkAccessibility();
    return checker.generateReport();
  };

  return {
    checkPage,
    checkElement,
    generateReport,
  };
}

// Utility functions for accessibility
export const a11yUtils = {
  // Generate unique IDs for form associations
  generateId: (prefix: string = 'a11y') => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  },

  // Check if element is focusable
  isFocusable: (element: Element): boolean => {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ];

    return focusableSelectors.some((selector) => element.matches(selector));
  },

  // Get all focusable elements within a container
  getFocusableElements: (container: Element): Element[] => {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    return Array.from(container.querySelectorAll(focusableSelectors));
  },

  // Announce to screen readers
  announce: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);
  },
};
