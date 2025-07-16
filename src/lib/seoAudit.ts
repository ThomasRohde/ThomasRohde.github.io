import type { BlogPost } from '@/types/blog';
import {
  analyzeKeywordDensity,
  extractHeadingStructure,
  extractLinks,
  calculateReadabilityScore,
  generateSEORecommendations,
} from '@/lib/seoOptimization';

export interface SEOAuditResult {
  score: number;
  maxScore: number;
  percentage: number;
  checks: SEOCheck[];
  recommendations: string[];
  summary: {
    passed: number;
    failed: number;
    warnings: number;
  };
}

export interface SEOCheck {
  name: string;
  description: string;
  status: 'pass' | 'fail' | 'warning';
  score: number;
  maxScore: number;
  details?: string;
}

/**
 * Perform comprehensive SEO audit on a blog post
 */
export function auditBlogPostSEO(post: BlogPost): SEOAuditResult {
  const checks: SEOCheck[] = [];

  // Title optimization
  checks.push(auditTitle(post.title));

  // Meta description optimization
  checks.push(auditMetaDescription(post.excerpt));

  // Content length
  checks.push(auditContentLength(post.content));

  // Heading structure
  checks.push(auditHeadingStructure(post.content));

  // Keyword optimization
  checks.push(auditKeywordUsage(post.content, post.tags));

  // Internal linking
  checks.push(auditInternalLinks(post.content));

  // Readability
  checks.push(auditReadability(post.content));

  // Image optimization
  checks.push(auditImages(post));

  // URL structure
  checks.push(auditURL(post.slug));

  // Social media optimization
  checks.push(auditSocialMedia(post));

  // Calculate scores
  const totalScore = checks.reduce((sum, check) => sum + check.score, 0);
  const maxScore = checks.reduce((sum, check) => sum + check.maxScore, 0);
  const percentage = Math.round((totalScore / maxScore) * 100);

  // Count status types
  const summary = {
    passed: checks.filter((c) => c.status === 'pass').length,
    failed: checks.filter((c) => c.status === 'fail').length,
    warnings: checks.filter((c) => c.status === 'warning').length,
  };

  // Generate recommendations
  const recommendations = generateSEORecommendations(post);

  return {
    score: totalScore,
    maxScore,
    percentage,
    checks,
    recommendations,
    summary,
  };
}

function auditTitle(title: string): SEOCheck {
  const length = title.length;

  if (length >= 30 && length <= 60) {
    return {
      name: 'Title Length',
      description: 'Title should be 30-60 characters for optimal SEO',
      status: 'pass',
      score: 10,
      maxScore: 10,
      details: `Title is ${length} characters (optimal)`,
    };
  } else if (length < 30) {
    return {
      name: 'Title Length',
      description: 'Title should be 30-60 characters for optimal SEO',
      status: 'warning',
      score: 5,
      maxScore: 10,
      details: `Title is ${length} characters (too short)`,
    };
  } else {
    return {
      name: 'Title Length',
      description: 'Title should be 30-60 characters for optimal SEO',
      status: 'fail',
      score: 0,
      maxScore: 10,
      details: `Title is ${length} characters (too long)`,
    };
  }
}

function auditMetaDescription(excerpt: string): SEOCheck {
  const length = excerpt.length;

  if (length >= 120 && length <= 160) {
    return {
      name: 'Meta Description',
      description: 'Meta description should be 120-160 characters',
      status: 'pass',
      score: 10,
      maxScore: 10,
      details: `Meta description is ${length} characters (optimal)`,
    };
  } else if (length < 120) {
    return {
      name: 'Meta Description',
      description: 'Meta description should be 120-160 characters',
      status: 'warning',
      score: 5,
      maxScore: 10,
      details: `Meta description is ${length} characters (too short)`,
    };
  } else {
    return {
      name: 'Meta Description',
      description: 'Meta description should be 120-160 characters',
      status: 'fail',
      score: 0,
      maxScore: 10,
      details: `Meta description is ${length} characters (too long)`,
    };
  }
}

function auditContentLength(content: string): SEOCheck {
  const wordCount = content.split(/\s+/).length;

  if (wordCount >= 300) {
    return {
      name: 'Content Length',
      description: 'Content should be at least 300 words',
      status: 'pass',
      score: 10,
      maxScore: 10,
      details: `Content has ${wordCount} words`,
    };
  } else {
    return {
      name: 'Content Length',
      description: 'Content should be at least 300 words',
      status: 'fail',
      score: 0,
      maxScore: 10,
      details: `Content has ${wordCount} words (too short)`,
    };
  }
}

function auditHeadingStructure(content: string): SEOCheck {
  const headings = extractHeadingStructure(content);
  const h1Count = headings.filter((h) => h.level === 1).length;

  if (headings.length >= 2 && h1Count <= 1) {
    return {
      name: 'Heading Structure',
      description: 'Content should have proper heading hierarchy',
      status: 'pass',
      score: 10,
      maxScore: 10,
      details: `Found ${headings.length} headings with proper H1 usage`,
    };
  } else if (headings.length === 0) {
    return {
      name: 'Heading Structure',
      description: 'Content should have proper heading hierarchy',
      status: 'fail',
      score: 0,
      maxScore: 10,
      details: 'No headings found',
    };
  } else if (h1Count > 1) {
    return {
      name: 'Heading Structure',
      description: 'Content should have proper heading hierarchy',
      status: 'warning',
      score: 5,
      maxScore: 10,
      details: `Multiple H1 headings found (${h1Count})`,
    };
  } else {
    return {
      name: 'Heading Structure',
      description: 'Content should have proper heading hierarchy',
      status: 'warning',
      score: 5,
      maxScore: 10,
      details: `Only ${headings.length} heading(s) found`,
    };
  }
}

function auditKeywordUsage(content: string, tags: string[]): SEOCheck {
  const keywordDensity = analyzeKeywordDensity(content, tags);
  const optimalKeywords = Object.entries(keywordDensity).filter(
    ([, density]) => density >= 0.5 && density <= 3
  );

  if (optimalKeywords.length >= tags.length * 0.7) {
    return {
      name: 'Keyword Usage',
      description: 'Keywords should appear naturally throughout content',
      status: 'pass',
      score: 15,
      maxScore: 15,
      details: `${optimalKeywords.length}/${tags.length} keywords have optimal density`,
    };
  } else if (optimalKeywords.length >= tags.length * 0.4) {
    return {
      name: 'Keyword Usage',
      description: 'Keywords should appear naturally throughout content',
      status: 'warning',
      score: 8,
      maxScore: 15,
      details: `${optimalKeywords.length}/${tags.length} keywords have optimal density`,
    };
  } else {
    return {
      name: 'Keyword Usage',
      description: 'Keywords should appear naturally throughout content',
      status: 'fail',
      score: 0,
      maxScore: 15,
      details: `Only ${optimalKeywords.length}/${tags.length} keywords have optimal density`,
    };
  }
}

function auditInternalLinks(content: string): SEOCheck {
  const { internal } = extractLinks(content);

  if (internal.length >= 2) {
    return {
      name: 'Internal Linking',
      description: 'Content should include internal links',
      status: 'pass',
      score: 10,
      maxScore: 10,
      details: `Found ${internal.length} internal links`,
    };
  } else if (internal.length === 1) {
    return {
      name: 'Internal Linking',
      description: 'Content should include internal links',
      status: 'warning',
      score: 5,
      maxScore: 10,
      details: 'Found 1 internal link (consider adding more)',
    };
  } else {
    return {
      name: 'Internal Linking',
      description: 'Content should include internal links',
      status: 'fail',
      score: 0,
      maxScore: 10,
      details: 'No internal links found',
    };
  }
}

function auditReadability(content: string): SEOCheck {
  const score = calculateReadabilityScore(content);

  if (score >= 60) {
    return {
      name: 'Readability',
      description: 'Content should be easily readable',
      status: 'pass',
      score: 10,
      maxScore: 10,
      details: `Readability score: ${score.toFixed(1)} (good)`,
    };
  } else if (score >= 30) {
    return {
      name: 'Readability',
      description: 'Content should be easily readable',
      status: 'warning',
      score: 5,
      maxScore: 10,
      details: `Readability score: ${score.toFixed(1)} (fair)`,
    };
  } else {
    return {
      name: 'Readability',
      description: 'Content should be easily readable',
      status: 'fail',
      score: 0,
      maxScore: 10,
      details: `Readability score: ${score.toFixed(1)} (difficult)`,
    };
  }
}

function auditImages(post: BlogPost): SEOCheck {
  if (post.featuredImage) {
    return {
      name: 'Featured Image',
      description: 'Post should have a featured image for social sharing',
      status: 'pass',
      score: 5,
      maxScore: 5,
      details: 'Featured image is set',
    };
  } else {
    return {
      name: 'Featured Image',
      description: 'Post should have a featured image for social sharing',
      status: 'warning',
      score: 0,
      maxScore: 5,
      details: 'No featured image set',
    };
  }
}

function auditURL(slug: string): SEOCheck {
  const isOptimal =
    slug.length <= 60 && /^[a-z0-9-]+$/.test(slug) && !slug.includes('--');

  if (isOptimal) {
    return {
      name: 'URL Structure',
      description: 'URL should be clean and descriptive',
      status: 'pass',
      score: 5,
      maxScore: 5,
      details: 'URL structure is optimal',
    };
  } else {
    return {
      name: 'URL Structure',
      description: 'URL should be clean and descriptive',
      status: 'warning',
      score: 2,
      maxScore: 5,
      details: 'URL could be improved',
    };
  }
}

function auditSocialMedia(post: BlogPost): SEOCheck {
  const hasImage = !!post.featuredImage;
  const hasGoodExcerpt =
    post.excerpt.length >= 120 && post.excerpt.length <= 160;

  if (hasImage && hasGoodExcerpt) {
    return {
      name: 'Social Media',
      description: 'Post should be optimized for social sharing',
      status: 'pass',
      score: 10,
      maxScore: 10,
      details: 'Social media optimization is complete',
    };
  } else if (hasImage || hasGoodExcerpt) {
    return {
      name: 'Social Media',
      description: 'Post should be optimized for social sharing',
      status: 'warning',
      score: 5,
      maxScore: 10,
      details: 'Partial social media optimization',
    };
  } else {
    return {
      name: 'Social Media',
      description: 'Post should be optimized for social sharing',
      status: 'fail',
      score: 0,
      maxScore: 10,
      details: 'Social media optimization needed',
    };
  }
}

/**
 * Generate SEO audit report as markdown
 */
export function generateSEOAuditReport(post: BlogPost): string {
  const audit = auditBlogPostSEO(post);

  let report = `# SEO Audit Report: ${post.title}\n\n`;
  report += `**Overall Score:** ${audit.score}/${audit.maxScore} (${audit.percentage}%)\n\n`;
  report += `**Summary:** ${audit.summary.passed} passed, ${audit.summary.warnings} warnings, ${audit.summary.failed} failed\n\n`;

  report += `## Detailed Results\n\n`;

  audit.checks.forEach((check) => {
    const icon =
      check.status === 'pass' ? '✅' : check.status === 'warning' ? '⚠️' : '❌';
    report += `${icon} **${check.name}** (${check.score}/${check.maxScore})\n`;
    report += `   ${check.description}\n`;
    if (check.details) {
      report += `   *${check.details}*\n`;
    }
    report += `\n`;
  });

  if (audit.recommendations.length > 0) {
    report += `## Recommendations\n\n`;
    audit.recommendations.forEach((rec, index) => {
      report += `${index + 1}. ${rec}\n`;
    });
  }

  return report;
}
