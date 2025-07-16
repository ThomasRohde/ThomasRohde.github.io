import { describe, it, expect } from 'vitest';
import { render, screen } from '../utils';
import { BlogCard } from '@/components/BlogCard';
import { mockBlogPost } from '../utils';

describe('BlogCard', () => {
  it('should render blog post information correctly', () => {
    render(<BlogCard post={mockBlogPost} />);

    expect(screen.getByText(mockBlogPost.title)).toBeInTheDocument();
    expect(screen.getByText(mockBlogPost.excerpt)).toBeInTheDocument();
    expect(
      screen.getByText(`${mockBlogPost.readTime} min read`)
    ).toBeInTheDocument();
  });

  it('should render tags', () => {
    render(<BlogCard post={mockBlogPost} />);

    mockBlogPost.tags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it('should have correct link to blog post', () => {
    render(<BlogCard post={mockBlogPost} />);

    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
    links.forEach((link) => {
      expect(link).toHaveAttribute('href', `/blog/${mockBlogPost.slug}`);
    });
  });

  it('should render published date', () => {
    render(<BlogCard post={mockBlogPost} />);

    expect(screen.getByText('January 15, 2025')).toBeInTheDocument();
  });

  it('should handle post without tags', () => {
    const postWithoutTags = {
      ...mockBlogPost,
      tags: [],
    };

    render(<BlogCard post={postWithoutTags} />);

    expect(screen.getByText(postWithoutTags.title)).toBeInTheDocument();
    expect(screen.getByText(postWithoutTags.excerpt)).toBeInTheDocument();
  });

  it('should be accessible', () => {
    render(<BlogCard post={mockBlogPost} />);

    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
    links.forEach((link) => {
      expect(link).toHaveAccessibleName();
    });
  });
});
