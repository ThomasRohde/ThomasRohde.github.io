import { useEffect } from 'react';
import type { BlogPost } from '@/types/blog';
import { seoConfig } from '@/lib/seo';

export interface StructuredDataProps {
  type: 'article' | 'breadcrumb' | 'person' | 'website';
  data: Record<string, unknown>;
}

/**
 * Component to inject structured data (JSON-LD) into the page head
 */
export function StructuredData({ type, data }: StructuredDataProps) {
  useEffect(() => {
    const scriptId = `structured-data-${type}`;

    // Remove existing structured data of this type
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    // Create and append new structured data script
    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data, null, 2);
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      const scriptToRemove = document.getElementById(scriptId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [type, data]);

  return null;
}

/**
 * Create structured data for blog post
 */
export function createBlogPostStructuredData(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage
      ? `${seoConfig.siteUrl}${post.featuredImage}`
      : `${seoConfig.siteUrl}${seoConfig.defaultImage}`,
    url: `${seoConfig.siteUrl}/blog/${post.slug}`,
    datePublished: post.publishedDate.toISOString(),
    dateModified: (post.updatedDate || post.publishedDate).toISOString(),
    author: {
      '@type': 'Person',
      name: seoConfig.author.name,
      url: seoConfig.siteUrl,
      sameAs: [seoConfig.author.github, seoConfig.author.linkedin].filter(
        Boolean
      ),
    },
    publisher: {
      '@type': 'Person',
      name: seoConfig.author.name,
      url: seoConfig.siteUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${seoConfig.siteUrl}/blog/${post.slug}`,
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
        url: `${seoConfig.siteUrl}/blog?series=${encodeURIComponent(post.series)}`,
      },
      position: post.seriesOrder,
    }),
  };
}

/**
 * Create breadcrumb structured data
 */
export function createBreadcrumbStructuredData(
  breadcrumbs: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

/**
 * Create person structured data
 */
export function createPersonStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: seoConfig.author.name,
    url: seoConfig.siteUrl,
    image: `${seoConfig.siteUrl}/images/profile-photo.jpg`,
    description: seoConfig.defaultDescription,
    jobTitle: 'Full Stack Developer',
    knowsAbout: [
      'Web Development',
      'React',
      'TypeScript',
      'JavaScript',
      'Node.js',
      'Frontend Development',
      'Backend Development',
      'Software Architecture',
      'AI-Assisted Development',
      'Spec-Driven Development',
    ],
    sameAs: [seoConfig.author.github, seoConfig.author.linkedin].filter(
      Boolean
    ),
    alumniOf: {
      '@type': 'Organization',
      name: 'Technical University',
    },
    worksFor: {
      '@type': 'Organization',
      name: 'Freelance',
    },
  };
}

/**
 * Create website structured data
 */
export function createWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Website',
    name: seoConfig.siteName,
    url: seoConfig.siteUrl,
    description: seoConfig.defaultDescription,
    author: {
      '@type': 'Person',
      name: seoConfig.author.name,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${seoConfig.siteUrl}/blog?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Create blog series structured data
 */
export function createBlogSeriesStructuredData(
  seriesName: string,
  posts: BlogPost[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    name: seriesName,
    description: `A comprehensive series about ${seriesName.replace(/-/g, ' ')}`,
    url: `${seoConfig.siteUrl}/blog?series=${encodeURIComponent(seriesName)}`,
    hasPart: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `${seoConfig.siteUrl}/blog/${post.slug}`,
      datePublished: post.publishedDate.toISOString(),
      position: post.seriesOrder,
    })),
    author: {
      '@type': 'Person',
      name: seoConfig.author.name,
      url: seoConfig.siteUrl,
    },
  };
}
