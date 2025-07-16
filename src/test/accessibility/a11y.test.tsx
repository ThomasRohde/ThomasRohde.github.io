import { describe, it, expect } from 'vitest';
import { render } from '../utils';
import { axe } from 'jest-axe';
import Hero from '@/components/Hero';
import Navigation from '@/components/Navigation';
import { BlogCard } from '@/components/BlogCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { mockBlogPost } from '../utils';

// jest-axe matchers are extended in setup.ts

describe('Accessibility Tests', () => {
  it('Hero component should be accessible', async () => {
    const { container } = render(<Hero />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Navigation component should be accessible', async () => {
    const { container } = render(<Navigation />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('BlogCard component should be accessible', async () => {
    const { container } = render(<BlogCard post={mockBlogPost} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('LoadingSpinner component should be accessible', async () => {
    const { container } = render(<LoadingSpinner />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('LoadingSpinner with text should be accessible', async () => {
    const { container } = render(<LoadingSpinner text="Loading content..." />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should handle focus management', async () => {
    const { container } = render(<Navigation />);

    // Check that interactive elements are focusable
    const links = container.querySelectorAll('a');
    links.forEach((link) => {
      expect(link).not.toHaveAttribute('tabindex', '-1');
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper heading hierarchy', async () => {
    const { container } = render(<Hero />);

    // Check for proper heading structure
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    expect(headings.length).toBeGreaterThan(0);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have sufficient color contrast', async () => {
    const { container } = render(
      <div>
        <Hero />
        <BlogCard post={mockBlogPost} />
      </div>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper ARIA labels and roles', async () => {
    const { container } = render(
      <div>
        <Navigation />
        <LoadingSpinner />
      </div>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
