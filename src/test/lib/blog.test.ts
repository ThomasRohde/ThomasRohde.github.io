import { describe, it, expect } from 'vitest';
import {
  calculateReadTime,
  formatDate,
  createSlug,
  parseFrontmatter,
  BlogPostFrontmatterSchema,
} from '@/lib/blog';

describe('blog utilities', () => {
  describe('calculateReadTime', () => {
    it('should calculate read time correctly for short content', () => {
      const shortContent = 'This is a short piece of content with ten words.';
      expect(calculateReadTime(shortContent)).toBe(1);
    });

    it('should calculate read time correctly for longer content', () => {
      const longContent = Array(400).fill('word').join(' ');
      expect(calculateReadTime(longContent)).toBe(2);
    });

    it('should handle empty content', () => {
      expect(calculateReadTime('')).toBe(1); // Math.ceil(0/200) = 1
    });

    it('should handle content with multiple spaces', () => {
      const content = 'Word    with    multiple    spaces';
      expect(calculateReadTime(content)).toBe(1);
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2025-01-15');
      expect(formatDate(date)).toBe('January 15, 2025');
    });

    it('should handle different dates', () => {
      const date = new Date('2024-12-25');
      expect(formatDate(date)).toBe('December 25, 2024');
    });
  });

  describe('createSlug', () => {
    it('should create slug from simple title', () => {
      expect(createSlug('Hello World')).toBe('hello-world');
    });

    it('should handle special characters', () => {
      expect(createSlug('Hello, World! How are you?')).toBe(
        'hello-world-how-are-you'
      );
    });

    it('should handle numbers', () => {
      expect(createSlug('React 19 Features')).toBe('react-19-features');
    });

    it('should handle leading and trailing spaces', () => {
      expect(createSlug('  Hello World  ')).toBe('hello-world');
    });

    it('should handle multiple consecutive special characters', () => {
      expect(createSlug('Hello---World!!!')).toBe('hello-world');
    });

    it('should handle empty string', () => {
      expect(createSlug('')).toBe('');
    });
  });

  describe('parseFrontmatter', () => {
    it('should parse valid frontmatter', () => {
      const content = `---
title: Test Post
excerpt: This is a test post
publishedDate: 2025-01-15
tags: [react, typescript]
published: true
---

# Test Content

This is the main content.`;

      const result = parseFrontmatter(content);

      expect(result.frontmatter.title).toBe('Test Post');
      expect(result.frontmatter.excerpt).toBe('This is a test post');
      expect(result.frontmatter.publishedDate).toBe('2025-01-15');
      expect(result.frontmatter.tags).toEqual(['react', 'typescript']);
      expect(result.frontmatter.published).toBe(true);
      expect(result.content).toBe(
        '# Test Content\n\nThis is the main content.'
      );
    });

    it('should handle quoted values', () => {
      const content = `---
title: "Test Post with Quotes"
excerpt: 'Single quoted excerpt'
publishedDate: 2025-01-15
---

Content here.`;

      const result = parseFrontmatter(content);

      expect(result.frontmatter.title).toBe('Test Post with Quotes');
      expect(result.frontmatter.excerpt).toBe('Single quoted excerpt');
      expect(result.frontmatter.publishedDate).toBe('2025-01-15');
    });

    it('should handle empty arrays', () => {
      const content = `---
title: Test Post
excerpt: Test excerpt
publishedDate: 2025-01-15
tags: []
---

Content here.`;

      const result = parseFrontmatter(content);
      expect(result.frontmatter.tags).toEqual([]);
    });

    it('should throw error for invalid frontmatter', () => {
      const content = `# No frontmatter here

Just content.`;

      expect(() => parseFrontmatter(content)).toThrow(
        'Invalid MDX format: frontmatter not found'
      );
    });

    it('should handle comments in frontmatter', () => {
      const content = `---
# This is a comment
title: Test Post
excerpt: Test excerpt
publishedDate: 2025-01-15
# Another comment
tags: [test]
---

Content here.`;

      const result = parseFrontmatter(content);
      expect(result.frontmatter.title).toBe('Test Post');
      expect(result.frontmatter.tags).toEqual(['test']);
    });
  });

  describe('BlogPostFrontmatterSchema', () => {
    it('should validate correct frontmatter', () => {
      const validFrontmatter = {
        title: 'Test Post',
        excerpt: 'Test excerpt',
        publishedDate: '2025-01-15',
        tags: ['react', 'typescript'],
        published: true,
      };

      const result = BlogPostFrontmatterSchema.parse(validFrontmatter);
      expect(result).toEqual({
        ...validFrontmatter,
        category: 'general', // default value
      });
    });

    it('should apply default values', () => {
      const minimalFrontmatter = {
        title: 'Test Post',
        excerpt: 'Test excerpt',
        publishedDate: '2025-01-15',
      };

      const result = BlogPostFrontmatterSchema.parse(minimalFrontmatter);
      expect(result.tags).toEqual([]);
      expect(result.category).toBe('general');
      expect(result.published).toBe(true);
    });

    it('should throw error for missing required fields', () => {
      const invalidFrontmatter = {
        title: 'Test Post',
        // missing excerpt and publishedDate
      };

      expect(() =>
        BlogPostFrontmatterSchema.parse(invalidFrontmatter)
      ).toThrow();
    });
  });
});
