import { cn } from '@/lib/utils';

interface SkipLink {
  href: string;
  label: string;
}

interface SkipLinksProps {
  links?: SkipLink[];
  className?: string;
}

const defaultLinks: SkipLink[] = [
  { href: '#main-content', label: 'Skip to main content' },
  { href: '#navigation', label: 'Skip to navigation' },
  { href: '#footer', label: 'Skip to footer' },
];

export default function SkipLinks({
  links = defaultLinks,
  className,
}: SkipLinksProps) {
  return (
    <div className={cn('sr-only focus-within:not-sr-only', className)}>
      <div className="bg-primary text-primary-foreground fixed top-0 left-0 z-[9999] rounded-br-md p-2">
        <nav aria-label="Skip links">
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary/90 focus:ring-primary-foreground focus:ring-offset-primary inline-block rounded px-3 py-2 text-sm font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
                  onFocus={(e) => {
                    // Ensure the skip link is visible when focused
                    e.currentTarget.scrollIntoView({ block: 'nearest' });
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

// Hook for managing focus
export function useFocusManagement() {
  const focusElement = (selector: string, options?: FocusOptions) => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      element.focus(options);
      return true;
    }
    return false;
  };

  const focusById = (id: string, options?: FocusOptions) => {
    return focusElement(`#${id}`, options);
  };

  const focusFirstFocusable = (container: HTMLElement | string) => {
    const containerElement =
      typeof container === 'string'
        ? (document.querySelector(container) as HTMLElement)
        : container;

    if (!containerElement) return false;

    const focusableElements = containerElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstFocusable = focusableElements[0] as HTMLElement;
    if (firstFocusable) {
      firstFocusable.focus();
      return true;
    }
    return false;
  };

  const trapFocus = (container: HTMLElement, event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

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
  };

  return {
    focusElement,
    focusById,
    focusFirstFocusable,
    trapFocus,
  };
}
