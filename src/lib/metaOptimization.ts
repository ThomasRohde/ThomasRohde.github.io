import type { BlogPost } from '@/types/blog';
import { generateMetaDescription } from '@/lib/seo';

/**
 * Meta tag optimization utilities
 */

export interface OptimizedMetaTags {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  twitterTitle: string;
  twitterDescription: string;
}

/**
 * Generate optimized meta tags for a blog post
 */
export function generateOptimizedMetaTags(post: BlogPost): OptimizedMetaTags {
  // Optimize title for different contexts
  const baseTitle = post.title;
  const shortTitle =
    baseTitle.length > 50 ? baseTitle.substring(0, 47) + '...' : baseTitle;

  // Generate optimized descriptions
  const metaDescription =
    post.excerpt.length <= 160
      ? post.excerpt
      : generateMetaDescription(post.content, 160);

  const ogDescription =
    post.excerpt.length <= 200
      ? post.excerpt
      : generateMetaDescription(post.content, 200);

  const twitterDescription =
    post.excerpt.length <= 140
      ? post.excerpt
      : generateMetaDescription(post.content, 140);

  // Optimize keywords - combine tags with content-derived keywords
  const contentKeywords = extractKeywordsFromContent(post.content);
  const optimizedKeywords = [
    ...new Set([...post.tags, ...contentKeywords]),
  ].slice(0, 10);

  return {
    title: baseTitle,
    description: metaDescription,
    keywords: optimizedKeywords,
    ogTitle: baseTitle,
    ogDescription: ogDescription,
    twitterTitle: shortTitle,
    twitterDescription: twitterDescription,
  };
}

/**
 * Extract relevant keywords from content
 */
function extractKeywordsFromContent(content: string): string[] {
  // Common technical terms that are likely to be important keywords
  const technicalTerms = [
    'react',
    'typescript',
    'javascript',
    'vite',
    'tailwind',
    'css',
    'html',
    'node',
    'npm',
    'git',
    'github',
    'api',
    'component',
    'hook',
    'state',
    'props',
    'jsx',
    'tsx',
    'frontend',
    'backend',
    'fullstack',
    'development',
    'programming',
    'coding',
    'software',
    'web',
    'mobile',
    'responsive',
    'design',
    'ui',
    'ux',
    'seo',
    'performance',
    'optimization',
    'accessibility',
    'testing',
    'deployment',
    'ci',
    'cd',
    'docker',
    'kubernetes',
    'aws',
    'azure',
    'gcp',
    'database',
    'sql',
    'nosql',
    'mongodb',
    'postgresql',
    'redis',
    'graphql',
    'rest',
    'microservices',
    'architecture',
    'patterns',
    'best-practices',
    'methodology',
    'agile',
    'scrum',
    'kanban',
    'devops',
    'automation',
  ];

  const contentLower = content.toLowerCase();
  const foundTerms: string[] = [];

  technicalTerms.forEach((term) => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    if (regex.test(contentLower)) {
      foundTerms.push(term);
    }
  });

  return foundTerms.slice(0, 5); // Return top 5 found terms
}

/**
 * Validate meta tag optimization
 */
export function validateMetaTags(tags: OptimizedMetaTags): {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];

  // Title validation
  if (tags.title.length < 30) {
    issues.push('Title is too short (less than 30 characters)');
  } else if (tags.title.length > 60) {
    issues.push('Title is too long (more than 60 characters)');
  }

  // Description validation
  if (tags.description.length < 120) {
    issues.push('Meta description is too short (less than 120 characters)');
  } else if (tags.description.length > 160) {
    issues.push('Meta description is too long (more than 160 characters)');
  }

  // Keywords validation
  if (tags.keywords.length < 3) {
    suggestions.push('Consider adding more relevant keywords');
  } else if (tags.keywords.length > 10) {
    suggestions.push(
      'Consider reducing the number of keywords to focus on the most important ones'
    );
  }

  // Social media validation
  if (tags.ogDescription.length > 200) {
    issues.push(
      'Open Graph description is too long (more than 200 characters)'
    );
  }

  if (tags.twitterDescription.length > 140) {
    issues.push('Twitter description is too long (more than 140 characters)');
  }

  return {
    isValid: issues.length === 0,
    issues,
    suggestions,
  };
}

/**
 * Generate schema.org Article structured data
 */
export function generateArticleStructuredData(
  post: BlogPost
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage
      ? `https://thomasrohde.github.io${post.featuredImage}`
      : 'https://thomasrohde.github.io/images/blog-hero.jpg',
    author: {
      '@type': 'Person',
      name: 'Thomas Klok Rohde',
      url: 'https://thomasrohde.github.io',
    },
    publisher: {
      '@type': 'Person',
      name: 'Thomas Klok Rohde',
      url: 'https://thomasrohde.github.io',
    },
    datePublished: post.publishedDate.toISOString(),
    dateModified: (post.updatedDate || post.publishedDate).toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://thomasrohde.github.io/blog/${post.slug}`,
    },
    keywords: post.tags.join(', '),
    articleSection: post.category,
    wordCount: post.content
      ? post.content.trim().split(/\s+/).length
      : undefined,
    timeRequired: `PT${post.readTime}M`,
    ...(post.series && {
      isPartOf: {
        '@type': 'BlogPosting',
        name: post.series,
        url: `https://thomasrohde.github.io/blog?series=${encodeURIComponent(post.series)}`,
      },
      position: post.seriesOrder,
    }),
  };
}

/**
 * Generate comprehensive SEO report for a blog post
 */
export function generateSEOReport(post: BlogPost): string {
  const optimizedTags = generateOptimizedMetaTags(post);
  const validation = validateMetaTags(optimizedTags);

  let report = `# SEO Optimization Report: ${post.title}\n\n`;

  report += `## Meta Tags Analysis\n\n`;
  report += `- **Title Length**: ${post.title.length} characters\n`;
  report += `- **Description Length**: ${post.excerpt.length} characters\n`;
  report += `- **Keywords Count**: ${optimizedTags.keywords.length}\n`;
  report += `- **Reading Time**: ${post.readTime} minutes\n`;
  report += `- **Word Count**: ${post.content ? post.content.trim().split(/\s+/).length : 0}\n\n`;

  if (validation.issues.length > 0) {
    report += `## Issues Found\n\n`;
    validation.issues.forEach((issue, index) => {
      report += `${index + 1}. ❌ ${issue}\n`;
    });
    report += `\n`;
  }

  if (validation.suggestions.length > 0) {
    report += `## Suggestions\n\n`;
    validation.suggestions.forEach((suggestion, index) => {
      report += `${index + 1}. 💡 ${suggestion}\n`;
    });
    report += `\n`;
  }

  report += `## Optimized Keywords\n\n`;
  optimizedTags.keywords.forEach((keyword) => {
    report += `- ${keyword}\n`;
  });

  report += `\n## Social Media Optimization\n\n`;
  report += `- **Open Graph Title**: ${optimizedTags.ogTitle}\n`;
  report += `- **Open Graph Description**: ${optimizedTags.ogDescription}\n`;
  report += `- **Twitter Title**: ${optimizedTags.twitterTitle}\n`;
  report += `- **Twitter Description**: ${optimizedTags.twitterDescription}\n`;

  return report;
}
