import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const location = useLocation();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const navigationItems = [
    { name: 'Home', href: '/', section: 'hero' },
    { name: 'About', href: '/', section: 'about' },
    { name: 'Blog', href: '/blog' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const handleNavigation = (item: (typeof navigationItems)[0]) => {
    if (item.section && location.pathname === '/') {
      // If we're on the home page and clicking a section link, scroll to section
      const element = document.getElementById(item.section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Focus the section for screen readers
        element.focus({ preventScroll: true });
      }
    }
    // For regular navigation (like Blog), React Router will handle it
  };

  // Handle keyboard navigation for mobile menu
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isMenuOpen) return;

    switch (event.key) {
      case 'Escape':
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
        break;
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex((prev) =>
          prev < navigationItems.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex((prev) =>
          prev > 0 ? prev - 1 : navigationItems.length - 1
        );
        break;
      case 'Home':
        event.preventDefault();
        setFocusedIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setFocusedIndex(navigationItems.length - 1);
        break;
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !menuButtonRef.current?.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Reset focus index when menu closes
  useEffect(() => {
    if (!isMenuOpen) {
      setFocusedIndex(-1);
    }
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      id="navigation"
      className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur"
      role="banner"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo/Brand */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">Thomas Klok Rohde</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {navigationItems.map((item) => (
              <NavigationMenuItem key={item.name}>
                <NavigationMenuLink asChild>
                  <Link
                    to={item.href}
                    onClick={() => handleNavigation(item)}
                    className={cn(
                      'group bg-background hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50',
                      isActive(item.href) && 'bg-accent text-accent-foreground'
                    )}
                  >
                    {item.name}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile Menu Button */}
        <Button
          ref={menuButtonRef}
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          aria-haspopup="true"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </Button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="bg-background border-t md:hidden"
          onKeyDown={handleKeyDown}
        >
          <nav
            id="mobile-navigation"
            className="container mx-auto px-4 py-4"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col space-y-2" role="menu">
              {navigationItems.map((item, index) => (
                <Link
                  key={item.name}
                  to={item.href}
                  role="menuitem"
                  tabIndex={focusedIndex === index ? 0 : -1}
                  className={cn(
                    'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:ring-primary rounded-md px-3 py-2 text-sm font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none',
                    isActive(item.href) && 'bg-accent text-accent-foreground',
                    focusedIndex === index && 'bg-accent text-accent-foreground'
                  )}
                  onClick={() => {
                    handleNavigation(item);
                    setIsMenuOpen(false);
                  }}
                  onFocus={() => setFocusedIndex(index)}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
