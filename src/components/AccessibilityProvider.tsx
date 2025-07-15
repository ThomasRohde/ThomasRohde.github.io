import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface AccessibilityContextType {
  announceToScreenReader: (
    message: string,
    priority?: 'polite' | 'assertive'
  ) => void;
  reducedMotion: boolean;
  highContrast: boolean;
}

const AccessibilityContext = createContext<
  AccessibilityContextType | undefined
>(undefined);

interface AccessibilityProviderProps {
  children: ReactNode;
}

export function AccessibilityProvider({
  children,
}: AccessibilityProviderProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  // Check for user preferences
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setHighContrast(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setHighContrast(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const announceToScreenReader = (
    message: string,
    priority: 'polite' | 'assertive' = 'polite'
  ) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove the announcement after a short delay
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  const value = {
    announceToScreenReader,
    reducedMotion,
    highContrast,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
      {/* Screen reader announcements container */}
      <div
        id="sr-announcements"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
      <div
        id="sr-announcements-assertive"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      />
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error(
      'useAccessibility must be used within an AccessibilityProvider'
    );
  }
  return context;
}

// Hook for keyboard navigation
export function useKeyboardNavigation() {
  const handleKeyDown = (
    event: KeyboardEvent,
    callbacks: {
      onEscape?: () => void;
      onEnter?: () => void;
      onSpace?: () => void;
      onArrowUp?: () => void;
      onArrowDown?: () => void;
      onArrowLeft?: () => void;
      onArrowRight?: () => void;
      onHome?: () => void;
      onEnd?: () => void;
      onTab?: (shiftKey: boolean) => void;
    }
  ) => {
    switch (event.key) {
      case 'Escape':
        callbacks.onEscape?.();
        break;
      case 'Enter':
        callbacks.onEnter?.();
        break;
      case ' ':
        callbacks.onSpace?.();
        break;
      case 'ArrowUp':
        callbacks.onArrowUp?.();
        break;
      case 'ArrowDown':
        callbacks.onArrowDown?.();
        break;
      case 'ArrowLeft':
        callbacks.onArrowLeft?.();
        break;
      case 'ArrowRight':
        callbacks.onArrowRight?.();
        break;
      case 'Home':
        callbacks.onHome?.();
        break;
      case 'End':
        callbacks.onEnd?.();
        break;
      case 'Tab':
        callbacks.onTab?.(event.shiftKey);
        break;
    }
  };

  return { handleKeyDown };
}

// Hook for managing focus trapping
export function useFocusTrap(isActive: boolean) {
  useEffect(() => {
    if (!isActive) return;

    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstFocusable) {
            event.preventDefault();
            lastFocusable.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            event.preventDefault();
            firstFocusable.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive]);
}
