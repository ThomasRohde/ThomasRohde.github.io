import { describe, it, expect } from 'vitest';
import {
  generateBlogPostSEO,
  generateBlogListingSEO,
  seoConfig,
} from '@/lib/seo';
import { mockBlogPost } from '../utils';

describe('SEO utilities', () => {
  describe('generateBlogPostSEO', () => {
    it('should generate correct SEO data for blog post', () => {
      const seoData = generateBlogPostSEO(mockBlogPost);

      expect(seoData.title).toBe(mockBlogPost.title);
      expect(seoData.description).toBe(mockBlogPost.excerpt);
      expect(seoData.keywords).toEqual([
        ...seoConfig.defaultKeywords,
        ...mockBlogPost.tags,
      ]);
      expect(seoData.url).toBe(`/blog/${mockBlogPost.slug}`);
      expect(seoData.type).toBe('article');
      expect(seoData.publishedDate).toBe(
        mockBlogPost.publishedDate.toISOString()
      );
    });

    it('should handle blog post with featured image', () => {
      const postWithImage = {
        ...mockBlogPost,
        featuredImage: '/images/featured.jpg',
      };

      const seoData = generateBlogPostSEO(postWithImage);
      expect(seoData.image).toBe('/images/featured.jpg');
    });

    it('should handle blog post with updated date', () => {
      const updatedDate = new Date('2025-01-20');
      const postWithUpdate = {
        ...mockBlogPost,
        updatedDate,
      };

      const seoData = generateBlogPostSEO(postWithUpdate);
      expect(seoData.updatedDate).toBe(updatedDate.toISOString());
    });
  });

  describe('generateBlogListingSEO', () => {
    it('should generate correct SEO data for blog listing', () => {
      const seoData = generateBlogListingSEO();

      expect(seoData.title).toBe('Blog');
      expect(seoData.description).toContain(
        'Thoughts, tutorials, and insights'
      );
      expect(seoData.keywords).toContain('Blog');
      expect(seoData.keywords).toContain('Tutorials');
      expect(seoData.url).toBe('/blog');
      expect(seoData.type).toBe('website');
    });

    it('should include default keywords', () => {
      const seoData = generateBlogListingSEO();

      seoConfig.defaultKeywords.forEach((keyword) => {
        expect(seoData.keywords).toContain(keyword);
      });
    });
  });
});
