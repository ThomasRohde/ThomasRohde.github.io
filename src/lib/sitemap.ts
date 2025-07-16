import { loadBlogPosts } from '@/lib/blogService';
import { seoConfig } from '@/lib/seo';

export interface SitemapEntry {
  url: string;
  lastModified: string;
  changeFrequency:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never';
  priority: number;
}

/**
 * Generate sitemap entries for all pages
 */
export async function generateSitemapEntries(): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [];

  // Static pages
  const staticPages = [
    { url: '/', priority: 1.0, changeFreq: 'weekly' as const },
    { url: '/blog', priority: 0.8, changeFreq: 'daily' as const },
  ];

  staticPages.forEach((page) => {
    entries.push({
      url: `${seoConfig.siteUrl}${page.url}`,
      lastModified: new Date().toISOString(),
      changeFrequency: page.changeFreq,
      priority: page.priority,
    });
  });

  // Blog posts
  try {
    const posts = await loadBlogPosts();
    posts.forEach((post) => {
      entries.push({
        url: `${seoConfig.siteUrl}/blog/${post.slug}`,
        lastModified: (post.updatedDate || post.publishedDate).toISOString(),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    });
  } catch (error) {
    console.error('Error loading blog posts for sitemap:', error);
  }

  return entries;
}

/**
 * Generate XML sitemap content
 */
export async function generateSitemapXML(): Promise<string> {
  const entries = await generateSitemapEntries();

  const xmlEntries = entries
    .map(
      (entry) => `
  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>`;
}

/**
 * Generate robots.txt content
 */
export function generateRobotsTxt(): string {
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: ${seoConfig.siteUrl}/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Block access to development files
Disallow: /src/
Disallow: /.git/
Disallow: /node_modules/
Disallow: /dist/
Disallow: /.env*

# Allow access to important files
Allow: /robots.txt
Allow: /sitemap.xml
Allow: /favicon.ico
Allow: /*.css
Allow: /*.js
Allow: /*.jpg
Allow: /*.png
Allow: /*.svg
Allow: /*.webp`;
}
