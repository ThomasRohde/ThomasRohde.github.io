import type { BlogPost } from '@/types/blog';

export interface SEOConfig {
  siteName: string;
  siteUrl: string;
  author: {
    name: string;
    email: string;
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  defaultImage: string;
  defaultDescription: string;
  defaultKeywords: string[];
}

export const seoConfig: SEOConfig = {
  siteName: 'Thomas Rohde',
  siteUrl: 'https://thomasrohde.github.io',
  author: {
    name: 'Thomas Rohde',
    email: 'thomas@thomasrohde.com',
    twitter: '@thomasrohde',
    github: 'https://github.com/thomasrohde',
    linkedin: 'https://linkedin.com/in/thomasrohde',
  },
  defaultImage: '/images/og-image.jpg',
  defaultDescription:
    'Personal portfolio and blog of Thomas Rohde, a passionate full stack developer sharing insights on modern web development, React, TypeScript, and more.',
  defaultKeywords: [
    'Thomas Rohde',
    'Full Stack Developer',
    'React',
    'TypeScript',
    'Web Development',
    'JavaScript',
    'Frontend',
    'Backend',
  ],
};

/**
 * Generate SEO title with site name
 */
export function generateSEOTitle(title?: string): string {
  return title
    ? `${title} | ${seoConfig.siteName}`
    : `${seoConfig.siteName} - Full Stack Developer & Tech Enthusiast`;
}

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(path: string = ''): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${seoConfig.siteUrl}${cleanPath}`;
}

/**
 * Generate full image URL
 */
export function generateImageUrl(image?: string): string {
  if (!image) return `${seoConfig.siteUrl}${seoConfig.defaultImage}`;
  return image.startsWith('http') ? image : `${seoConfig.siteUrl}${image}`;
}

/**
 * Generate SEO data for blog post
 */
export function generateBlogPostSEO(post: BlogPost) {
  return {
    title: post.title,
    description: post.excerpt,
    keywords: [...seoConfig.defaultKeywords, ...post.tags],
    image: post.featuredImage,
    url: `/blog/${post.slug}`,
    type: 'article' as const,
    publishedDate: post.publishedDate.toISOString(),
    updatedDate: post.updatedDate?.toISOString(),
    tags: post.tags,
    category: post.category,
  };
}

/**
 * Generate SEO data for blog listing page
 */
export function generateBlogListingSEO() {
  return {
    title: 'Blog',
    description:
      'Thoughts, tutorials, and insights on web development and technology. Read about React, TypeScript, modern web development practices, and more.',
    keywords: [
      ...seoConfig.defaultKeywords,
      'Blog',
      'Tutorials',
      'Web Development',
      'Programming',
    ],
    url: '/blog',
    type: 'website' as const,
  };
}

/**
 * Generate SEO data for home page
 */
export function generateHomeSEO() {
  return {
    title: 'Home',
    description: `Welcome to ${seoConfig.author.name}'s personal portfolio. Full stack developer passionate about modern web development, React, TypeScript, and creating exceptional user experiences.`,
    keywords: [...seoConfig.defaultKeywords, 'Portfolio', 'Personal Website'],
    url: '/',
    type: 'website' as const,
  };
}

/**
 * Extract reading time from content
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Generate meta description from content
 */
export function generateMetaDescription(
  content: string,
  maxLength: number = 160
): string {
  // Remove markdown syntax and HTML tags
  const cleanContent = content
    .replace(/#{1,6}\s+/g, '') // Remove markdown headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
    .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove markdown links
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }

  // Truncate at word boundary
  const truncated = cleanContent.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  return lastSpace > 0
    ? `${truncated.substring(0, lastSpace)}...`
    : `${truncated}...`;
}

/**
 * Generate structured data for organization
 */
export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: seoConfig.author.name,
    url: seoConfig.siteUrl,
    sameAs: [seoConfig.author.github, seoConfig.author.linkedin].filter(
      Boolean
    ),
    jobTitle: 'Full Stack Developer',
    description: seoConfig.defaultDescription,
    knowsAbout: [
      'Web Development',
      'React',
      'TypeScript',
      'JavaScript',
      'Node.js',
      'Frontend Development',
      'Backend Development',
      'Full Stack Development',
    ],
  };
}
