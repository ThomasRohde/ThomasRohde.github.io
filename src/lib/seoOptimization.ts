import type { BlogPost } from '@/types/blog';

/**
 * SEO optimization utilities for blog posts
 */

export interface SEOAnalysis {
  keywordDensity: Record<string, number>;
  readabilityScore: number;
  metaDescriptionLength: number;
  titleLength: number;
  headingStructure: Array<{ level: number; text: string }>;
  internalLinks: string[];
  externalLinks: string[];
  imageAltTexts: string[];
  recommendations: string[];
}

/**
 * Analyze keyword density in content
 */
export function analyzeKeywordDensity(
  content: string,
  keywords: string[]
): Record<string, number> {
  const wordCount = content.toLowerCase().split(/\s+/).length;
  const density: Record<string, number> = {};

  keywords.forEach((keyword) => {
    const keywordRegex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'gi');
    const matches = content.match(keywordRegex) || [];
    density[keyword] = (matches.length / wordCount) * 100;
  });

  return density;
}

/**
 * Extract heading structure from markdown content
 */
export function extractHeadingStructure(
  content: string
): Array<{ level: number; text: string }> {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: Array<{ level: number; text: string }> = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    headings.push({
      level: match[1].length,
      text: match[2].trim(),
    });
  }

  return headings;
}

/**
 * Extract links from markdown content
 */
export function extractLinks(content: string): {
  internal: string[];
  external: string[];
} {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const internal: string[] = [];
  const external: string[] = [];
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    const url = match[2];
    if (url.startsWith('http') || url.startsWith('//')) {
      external.push(url);
    } else {
      internal.push(url);
    }
  }

  return { internal, external };
}

/**
 * Calculate readability score (simplified Flesch Reading Ease)
 */
export function calculateReadabilityScore(content: string): number {
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const words = content.split(/\s+/).filter((w) => w.length > 0);
  const syllables = words.reduce((count, word) => {
    return count + countSyllables(word);
  }, 0);

  if (sentences.length === 0 || words.length === 0) return 0;

  const avgSentenceLength = words.length / sentences.length;
  const avgSyllablesPerWord = syllables / words.length;

  // Simplified Flesch Reading Ease formula
  return 206.835 - 1.015 * avgSentenceLength - 84.6 * avgSyllablesPerWord;
}

/**
 * Count syllables in a word (simplified)
 */
function countSyllables(word: string): number {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;

  const vowels = 'aeiouy';
  let count = 0;
  let previousWasVowel = false;

  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.includes(word[i]);
    if (isVowel && !previousWasVowel) {
      count++;
    }
    previousWasVowel = isVowel;
  }

  // Handle silent 'e'
  if (word.endsWith('e')) {
    count--;
  }

  return Math.max(1, count);
}

/**
 * Generate SEO recommendations for a blog post
 */
export function generateSEORecommendations(post: BlogPost): string[] {
  const recommendations: string[] = [];
  const { content, title, excerpt, tags } = post;

  // Title length check
  if (title.length < 30) {
    recommendations.push(
      'Consider making the title longer (30-60 characters) for better SEO'
    );
  } else if (title.length > 60) {
    recommendations.push(
      'Consider shortening the title (under 60 characters) to prevent truncation in search results'
    );
  }

  // Meta description length check
  if (excerpt.length < 120) {
    recommendations.push(
      'Consider expanding the excerpt/meta description (120-160 characters) for better search snippets'
    );
  } else if (excerpt.length > 160) {
    recommendations.push(
      'Consider shortening the excerpt/meta description (under 160 characters) to prevent truncation'
    );
  }

  // Keyword density analysis
  const keywordDensity = analyzeKeywordDensity(content, tags);
  Object.entries(keywordDensity).forEach(([keyword, density]) => {
    if (density < 0.5) {
      recommendations.push(
        `Consider using the keyword "${keyword}" more frequently (current density: ${density.toFixed(2)}%)`
      );
    } else if (density > 3) {
      recommendations.push(
        `Consider reducing usage of "${keyword}" to avoid keyword stuffing (current density: ${density.toFixed(2)}%)`
      );
    }
  });

  // Heading structure analysis
  const headings = extractHeadingStructure(content);
  if (headings.length === 0) {
    recommendations.push(
      'Add headings (H2, H3, etc.) to improve content structure and SEO'
    );
  } else {
    const h1Count = headings.filter((h) => h.level === 1).length;
    if (h1Count > 1) {
      recommendations.push(
        'Use only one H1 heading per page for better SEO structure'
      );
    }
  }

  // Internal linking analysis
  const { internal } = extractLinks(content);
  if (internal.length < 2) {
    recommendations.push(
      'Add more internal links to improve site navigation and SEO'
    );
  }

  // Readability analysis
  const readabilityScore = calculateReadabilityScore(content);
  if (readabilityScore < 60) {
    recommendations.push(
      'Consider simplifying sentences and vocabulary to improve readability'
    );
  }

  // Content length analysis
  const wordCount = content.split(/\s+/).length;
  if (wordCount < 300) {
    recommendations.push(
      'Consider expanding the content (aim for 300+ words) for better SEO performance'
    );
  }

  return recommendations;
}

/**
 * Optimize meta description by extracting key sentences
 */
export function optimizeMetaDescription(
  content: string,
  maxLength: number = 160
): string {
  // Remove markdown formatting
  const cleanContent = content
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/`(.*?)`/g, '$1') // Remove code
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();

  // Split into sentences
  const sentences = cleanContent
    .split(/[.!?]+/)
    .filter((s) => s.trim().length > 0);

  if (sentences.length === 0) return '';

  // Start with the first sentence
  let description = sentences[0].trim();

  // Add more sentences if they fit
  for (
    let i = 1;
    i < sentences.length && description.length < maxLength - 50;
    i++
  ) {
    const nextSentence = sentences[i].trim();
    if (description.length + nextSentence.length + 2 <= maxLength) {
      description += '. ' + nextSentence;
    } else {
      break;
    }
  }

  // Ensure it ends properly
  if (
    !description.endsWith('.') &&
    !description.endsWith('!') &&
    !description.endsWith('?')
  ) {
    description += '...';
  }

  return description.length > maxLength
    ? description.substring(0, maxLength - 3) + '...'
    : description;
}

/**
 * Generate schema.org FAQ structured data from content
 */
export function extractFAQStructuredData(
  content: string
): Record<string, unknown> | null {
  const faqRegex = /##\s+(.+\?)\s*\n\n((?:(?!##).)+)/g;
  const faqs: Array<{ question: string; answer: string }> = [];
  let match;

  while ((match = faqRegex.exec(content)) !== null) {
    faqs.push({
      question: match[1].trim(),
      answer: match[2].trim().replace(/\n+/g, ' '),
    });
  }

  if (faqs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate related posts suggestions based on tags and category
 */
export function generateRelatedPosts(
  currentPost: BlogPost,
  allPosts: BlogPost[]
): BlogPost[] {
  const related = allPosts
    .filter((post) => post.slug !== currentPost.slug && post.published)
    .map((post) => {
      let score = 0;

      // Same category gets high score
      if (post.category === currentPost.category) {
        score += 10;
      }

      // Same series gets very high score
      if (post.series === currentPost.series) {
        score += 20;
      }

      // Shared tags get points
      const sharedTags = post.tags.filter((tag) =>
        currentPost.tags.includes(tag)
      );
      score += sharedTags.length * 2;

      return { post, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.post);

  return related;
}
