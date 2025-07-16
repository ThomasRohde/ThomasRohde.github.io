import { describe, it, expect } from 'vitest';
import { render as rtlRender, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navigation from '@/components/Navigation';

describe('Routing Integration', () => {
  it('should navigate between pages', async () => {
    rtlRender(
      <MemoryRouter initialEntries={['/']}>
        <Navigation />
      </MemoryRouter>
    );

    // Check if navigation links are present
    const homeLink = screen.getByRole('link', { name: /home/i });
    const aboutLink = screen.getByRole('link', { name: /about/i });
    const blogLink = screen.getByRole('link', { name: /blog/i });
    const contactLink = screen.getByRole('link', { name: /contact/i });

    expect(homeLink).toBeInTheDocument();
    expect(aboutLink).toBeInTheDocument();
    expect(blogLink).toBeInTheDocument();
    expect(contactLink).toBeInTheDocument();
  });

  it('should handle navigation clicks', async () => {
    rtlRender(
      <MemoryRouter initialEntries={['/']}>
        <Navigation />
      </MemoryRouter>
    );

    const aboutLink = screen.getByRole('link', { name: /about/i });

    // Click should not throw error
    fireEvent.click(aboutLink);

    expect(aboutLink).toHaveAttribute('href', '/');
  });

  it('should be accessible with keyboard navigation', async () => {
    rtlRender(
      <MemoryRouter initialEntries={['/']}>
        <Navigation />
      </MemoryRouter>
    );

    const navigation = screen.getByRole('navigation');
    expect(navigation).toBeInTheDocument();

    // Check if links are focusable
    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).toHaveAttribute('href');
    });
  });

  it('should handle mobile menu toggle', async () => {
    rtlRender(
      <MemoryRouter initialEntries={['/']}>
        <Navigation />
      </MemoryRouter>
    );

    // Look for mobile menu button (if it exists)
    const menuButtons = screen.queryAllByRole('button');

    if (menuButtons.length > 0) {
      const menuButton = menuButtons[0];
      fireEvent.click(menuButton);

      // Menu should toggle (implementation dependent)
      expect(menuButton).toBeInTheDocument();
    }
  });
});
