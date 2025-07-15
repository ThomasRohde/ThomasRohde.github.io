import type { BlogPost } from '@/types/blog';

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never';
  priority?: number;
}

/**
 * Generate sitemap URLs for the website
 */
export function generateSitemapUrls(
  blogPosts: BlogPost[],
  baseUrl: string = 'https://thomasrohde.github.io'
): SitemapUrl[] {
  const urls: SitemapUrl[] = [];

  // Homepage
  urls.push({
    loc: baseUrl,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 1.0,
  });

  // Blog index page
  urls.push({
    loc: `${baseUrl}/blog`,
    lastmod:
      blogPosts.length > 0
        ? blogPosts[0].publishedDate.toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.8,
  });

  // Individual blog posts
  blogPosts.forEach((post) => {
    urls.push({
      loc: `${baseUrl}/blog/${post.slug}`,
      lastmod: (post.updatedDate || post.publishedDate)
        .toISOString()
        .split('T')[0],
      changefreq: 'monthly',
      priority: 0.6,
    });
  });

  return urls;
}

/**
 * Generate XML sitemap content
 */
export function generateSitemapXml(urls: SitemapUrl[]): string {
  const urlElements = urls
    .map((url) => {
      let urlXml = `  <url>\n    <loc>${url.loc}</loc>`;

      if (url.lastmod) {
        urlXml += `\n    <lastmod>${url.lastmod}</lastmod>`;
      }

      if (url.changefreq) {
        urlXml += `\n    <changefreq>${url.changefreq}</changefreq>`;
      }

      if (url.priority !== undefined) {
        urlXml += `\n    <priority>${url.priority}</priority>`;
      }

      urlXml += '\n  </url>';
      return urlXml;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}

/**
 * Generate RSS feed for blog posts
 */
export function generateRssFeed(
  blogPosts: BlogPost[],
  baseUrl: string = 'https://thomasrohde.github.io'
): string {
  const items = blogPosts
    .slice(0, 20)
    .map((post) => {
      const pubDate = post.publishedDate.toUTCString();
      const link = `${baseUrl}/blog/${post.slug}`;

      return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt}]]></description>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <category><![CDATA[${post.category}]]></category>
      ${post.tags.map((tag) => `<category><![CDATA[${tag}]]></category>`).join('\n      ')}
    </item>`;
    })
    .join('\n');

  const lastBuildDate =
    blogPosts.length > 0
      ? blogPosts[0].publishedDate.toUTCString()
      : new Date().toUTCString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Thomas Rohde - Blog</title>
    <description>Thoughts, tutorials, and insights on web development and technology</description>
    <link>${baseUrl}/blog</link>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <managingEditor>thomas@thomasrohde.com (Thomas Rohde)</managingEditor>
    <webMaster>thomas@thomasrohde.com (Thomas Rohde)</webMaster>
${items}
  </channel>
</rss>`;
}
