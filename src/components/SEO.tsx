import { useEffect } from 'react';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedDate?: string;
  updatedDate?: string;
  author?: string;
  tags?: string[];
  category?: string;
  series?: string;
  seriesOrder?: number;
  readTime?: number;
  wordCount?: number;
}

const DEFAULT_SEO = {
  title: 'Thomas Klok Rohde - Full Stack Developer & Tech Enthusiast',
  description:
    'Personal portfolio and blog of Thomas Klok Rohde, a passionate full stack developer sharing insights on modern web development, React, TypeScript, and more.',
  keywords: [
    'Thomas Klok Rohde',
    'Full Stack Developer',
    'React',
    'TypeScript',
    'Web Development',
    'JavaScript',
    'Frontend',
    'Backend',
  ],
  image: '/images/og-image.jpg',
  author: 'Thomas Klok Rohde',
  type: 'website' as const,
};

export function SEO({
  title,
  description = DEFAULT_SEO.description,
  keywords = DEFAULT_SEO.keywords,
  image = DEFAULT_SEO.image,
  url,
  type = DEFAULT_SEO.type,
  publishedDate,
  updatedDate,
  author = DEFAULT_SEO.author,
  tags,
  category,
  series,
  seriesOrder,
  readTime,
  wordCount,
}: SEOProps) {
  useEffect(() => {
    // Construct full title
    const fullTitle = title
      ? `${title} | Thomas Klok Rohde`
      : DEFAULT_SEO.title;

    // Construct canonical URL
    const canonicalUrl = url
      ? `https://thomasrohde.github.io${url}`
      : 'https://thomasrohde.github.io';

    // Construct full image URL
    const fullImageUrl = image.startsWith('http')
      ? image
      : `https://thomasrohde.github.io${image}`;

    // Combine keywords with tags if provided
    const allKeywords = tags ? [...keywords, ...tags] : keywords;

    // Update document title
    document.title = fullTitle;

    // Helper function to update or create meta tag
    const updateMetaTag = (
      selector: string,
      content: string,
      property?: string
    ) => {
      let meta = document.querySelector(selector) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute(
            property,
            selector.replace(`[${property}="`, '').replace('"]', '')
          );
        } else {
          meta.setAttribute(
            'name',
            selector.replace('[name="', '').replace('"]', '')
          );
        }
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Helper function to update or create link tag
    const updateLinkTag = (rel: string, href: string) => {
      let link = document.querySelector(
        `link[rel="${rel}"]`
      ) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = rel;
        document.head.appendChild(link);
      }
      link.href = href;
    };

    // Basic Meta Tags
    updateMetaTag('[name="description"]', description);
    updateMetaTag('[name="keywords"]', allKeywords.join(', '));
    updateMetaTag('[name="author"]', author);
    updateLinkTag('canonical', canonicalUrl);

    // Open Graph Tags
    updateMetaTag('[property="og:title"]', fullTitle, 'property');
    updateMetaTag('[property="og:description"]', description, 'property');
    updateMetaTag('[property="og:image"]', fullImageUrl, 'property');
    updateMetaTag('[property="og:url"]', canonicalUrl, 'property');
    updateMetaTag('[property="og:type"]', type, 'property');
    updateMetaTag('[property="og:site_name"]', 'Thomas Klok Rohde', 'property');
    updateMetaTag('[property="og:locale"]', 'en_US', 'property');

    // Twitter Card Tags
    updateMetaTag('[name="twitter:card"]', 'summary_large_image');
    updateMetaTag('[name="twitter:title"]', fullTitle);
    updateMetaTag('[name="twitter:description"]', description);
    updateMetaTag('[name="twitter:image"]', fullImageUrl);
    updateMetaTag('[name="twitter:creator"]', '@thomasrohde');
    updateMetaTag('[name="twitter:site"]', '@thomasrohde');

    // Article-specific meta tags
    if (type === 'article') {
      updateMetaTag('[property="article:author"]', author, 'property');

      if (publishedDate) {
        updateMetaTag(
          '[property="article:published_time"]',
          publishedDate,
          'property'
        );
      }

      if (updatedDate) {
        updateMetaTag(
          '[property="article:modified_time"]',
          updatedDate,
          'property'
        );
      }

      if (category) {
        updateMetaTag('[property="article:section"]', category, 'property');
      }

      // Remove existing article:tag meta tags
      const existingTags = document.querySelectorAll(
        '[property="article:tag"]'
      );
      existingTags.forEach((tag) => tag.remove());

      // Add new article:tag meta tags
      if (tags) {
        tags.forEach((tag) => {
          const meta = document.createElement('meta');
          meta.setAttribute('property', 'article:tag');
          meta.content = tag;
          document.head.appendChild(meta);
        });
      }
    }

    // Additional SEO Meta Tags
    updateMetaTag('[name="robots"]', 'index, follow');
    updateMetaTag('[name="googlebot"]', 'index, follow');
    updateMetaTag('[name="format-detection"]', 'telephone=no');
    updateMetaTag('[name="theme-color"]', '#000000');

    // Add reading time and word count for articles
    if (type === 'article' && readTime) {
      updateMetaTag('[name="twitter:label1"]', 'Reading time');
      updateMetaTag('[name="twitter:data1"]', `${readTime} min read`);
    }

    if (type === 'article' && wordCount) {
      updateMetaTag('[name="twitter:label2"]', 'Word count');
      updateMetaTag('[name="twitter:data2"]', wordCount.toString());
    }

    // Structured Data (JSON-LD)
    const addStructuredData = () => {
      // Remove existing structured data
      const existingScript = document.querySelector(
        'script[type="application/ld+json"]'
      );
      if (existingScript) {
        existingScript.remove();
      }

      let structuredData: Record<string, unknown> = {
        '@context': 'https://schema.org',
      };

      if (type === 'article') {
        structuredData = {
          ...structuredData,
          '@type': 'BlogPosting',
          headline: title || DEFAULT_SEO.title,
          description: description,
          image: fullImageUrl,
          url: canonicalUrl,
          datePublished: publishedDate,
          dateModified: updatedDate || publishedDate,
          author: {
            '@type': 'Person',
            name: author,
            url: 'https://thomasrohde.github.io',
          },
          publisher: {
            '@type': 'Person',
            name: 'Thomas Klok Rohde',
            url: 'https://thomasrohde.github.io',
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': canonicalUrl,
          },
        };

        // Add series information if available
        if (series) {
          structuredData.isPartOf = {
            '@type': 'BlogPosting',
            name: series,
            url: `https://thomasrohde.github.io/series/${series}`,
          };

          if (seriesOrder) {
            structuredData.position = seriesOrder;
          }
        }

        // Add keywords/tags
        if (tags && tags.length > 0) {
          structuredData.keywords = tags.join(', ');
        }

        // Add reading time
        if (readTime) {
          structuredData.timeRequired = `PT${readTime}M`;
        }

        // Add word count
        if (wordCount) {
          structuredData.wordCount = wordCount;
        }

        // Add category
        if (category) {
          structuredData.articleSection = category;
        }
      } else {
        // Website/Person structured data
        structuredData = {
          ...structuredData,
          '@type': 'Person',
          name: 'Thomas Klok Rohde',
          url: 'https://thomasrohde.github.io',
          image: fullImageUrl,
          description: description,
          jobTitle: 'Full Stack Developer',
          knowsAbout: keywords,
          sameAs: [
            'https://github.com/thomasrohde',
            'https://linkedin.com/in/thomasrohde',
          ],
        };
      }

      // Create and append structured data script
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData, null, 2);
      document.head.appendChild(script);
    };

    addStructuredData();

    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = DEFAULT_SEO.title;
      // Remove structured data on cleanup
      const structuredDataScript = document.querySelector(
        'script[type="application/ld+json"]'
      );
      if (structuredDataScript) {
        structuredDataScript.remove();
      }
    };
  }, [
    title,
    description,
    keywords,
    image,
    url,
    type,
    publishedDate,
    updatedDate,
    author,
    tags,
    category,
    series,
    seriesOrder,
    readTime,
    wordCount,
  ]);

  return null;
}
