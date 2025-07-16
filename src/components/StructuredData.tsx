import { useEffect } from 'react';
import type { BlogPost } from '@/types/blog';

interface StructuredDataProps {
  type: 'website' | 'article' | 'person' | 'breadcrumb';
  data: WebsiteData | ArticleData | PersonData | BreadcrumbData;
}

interface WebsiteData {
  name: string;
  description: string;
  url: string;
  author: PersonData;
}

interface ArticleData {
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author: PersonData;
  publisher: PersonData;
  url: string;
  keywords?: string[];
  articleSection?: string;
  wordCount?: number;
}

interface PersonData {
  name: string;
  url?: string;
  sameAs?: string[];
  jobTitle?: string;
  description?: string;
}

interface BreadcrumbData {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  useEffect(() => {
    let structuredData: Record<string, unknown> = {
      '@context': 'https://schema.org',
    };

    switch (type) {
      case 'website': {
        const websiteData = data as WebsiteData;
        structuredData = {
          ...structuredData,
          '@type': 'WebSite',
          name: websiteData.name,
          description: websiteData.description,
          url: websiteData.url,
          author: {
            '@type': 'Person',
            name: websiteData.author.name,
            url: websiteData.author.url,
            sameAs: websiteData.author.sameAs,
            jobTitle: websiteData.author.jobTitle,
          },
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${websiteData.url}/blog?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
          },
        };
        break;
      }

      case 'article': {
        const articleData = data as ArticleData;
        structuredData = {
          ...structuredData,
          '@type': 'BlogPosting',
          headline: articleData.headline,
          description: articleData.description,
          image: articleData.image,
          datePublished: articleData.datePublished,
          dateModified: articleData.dateModified || articleData.datePublished,
          author: {
            '@type': 'Person',
            name: articleData.author.name,
            url: articleData.author.url,
            sameAs: articleData.author.sameAs,
          },
          publisher: {
            '@type': 'Person',
            name: articleData.publisher.name,
            url: articleData.publisher.url,
          },
          url: articleData.url,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': articleData.url,
          },
          keywords: articleData.keywords,
          articleSection: articleData.articleSection,
          wordCount: articleData.wordCount,
        };
        break;
      }

      case 'person': {
        const personData = data as PersonData;
        structuredData = {
          ...structuredData,
          '@type': 'Person',
          name: personData.name,
          url: personData.url,
          sameAs: personData.sameAs,
          jobTitle: personData.jobTitle,
          description: personData.description,
        };
        break;
      }

      case 'breadcrumb': {
        const breadcrumbData = data as BreadcrumbData;
        structuredData = {
          ...structuredData,
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbData.items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
          })),
        };
        break;
      }
    }

    // Remove existing structured data script with the same type
    const existingScript = document.querySelector(
      `script[data-structured-data="${type}"]`
    );
    if (existingScript) {
      existingScript.remove();
    }

    // Create and append new structured data script
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-structured-data', type);
    script.textContent = JSON.stringify(structuredData, null, 2);
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      const scriptToRemove = document.querySelector(
        `script[data-structured-data="${type}"]`
      );
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [type, data]);

  return null;
}

// Helper function to create structured data for blog posts
export function createBlogPostStructuredData(
  post: BlogPost,
  baseUrl: string = 'https://thomasrohde.github.io'
): ArticleData {
  const author: PersonData = {
    name: 'Thomas Rohde',
    url: baseUrl,
    sameAs: [
      'https://github.com/thomasrohde',
      'https://linkedin.com/in/throhde',
      'https://twitter.com/trohde',
    ],
    jobTitle: 'Full Stack Developer',
    description:
      'Passionate full stack developer sharing insights on modern web development',
  };

  return {
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage
      ? `${baseUrl}${post.featuredImage}`
      : `${baseUrl}/images/og-image.jpg`,
    datePublished: post.publishedDate.toISOString(),
    dateModified: post.updatedDate?.toISOString(),
    author,
    publisher: author,
    url: `${baseUrl}/blog/${post.slug}`,
    keywords: post.tags,
    articleSection: post.category,
    wordCount: Math.ceil(post.content.length / 5), // Rough estimate: 5 characters per word
  };
}

// Helper function to create website structured data
export function createWebsiteStructuredData(
  baseUrl: string = 'https://thomasrohde.github.io'
): WebsiteData {
  return {
    name: 'Thomas Rohde - Full Stack Developer',
    description:
      'Personal portfolio and blog of Thomas Rohde, a passionate full stack developer sharing insights on modern web development, React, TypeScript, and more.',
    url: baseUrl,
    author: {
      name: 'Thomas Rohde',
      url: baseUrl,
      sameAs: [
        'https://github.com/thomasrohde',
        'https://linkedin.com/in/thomasrohde',
        'https://twitter.com/thomasrohde',
      ],
      jobTitle: 'Full Stack Developer',
      description:
        'Passionate full stack developer sharing insights on modern web development',
    },
  };
}

// Helper function to create person structured data
export function createPersonStructuredData(
  baseUrl: string = 'https://thomasrohde.github.io'
): PersonData {
  return {
    name: 'Thomas Rohde',
    url: baseUrl,
    sameAs: [
      'https://github.com/thomasrohde',
      'https://linkedin.com/in/thomasrohde',
      'https://twitter.com/thomasrohde',
    ],
    jobTitle: 'Full Stack Developer',
    description:
      'Passionate full stack developer sharing insights on modern web development, React, TypeScript, and more.',
  };
}

// Helper function to create breadcrumb structured data
export function createBreadcrumbStructuredData(
  items: Array<{ name: string; url: string }>
): BreadcrumbData {
  return { items };
}
