import { z } from 'zod';

// Blog post frontmatter schema
export const BlogPostFrontmatterSchema = z.object({
  title: z.string(),
  excerpt: z.string(),
  publishedDate: z.string(),
  updatedDate: z.string().optional(),
  tags: z.array(z.string()).default([]),
  category: z.string().default('general'),
  series: z.string().optional(),
  seriesOrder: z.number().optional(),
  featuredImage: z.string().optional(),
  published: z.boolean().default(true),
});

export type BlogPostFrontmatter = z.infer<typeof BlogPostFrontmatterSchema>;

// Complete blog post interface
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  readTime: number;
  publishedDate: Date;
  updatedDate?: Date;
  tags: string[];
  category: string;
  series?: string;
  seriesOrder?: number;
  featuredImage?: string;
  published: boolean;
}

// Utility to calculate read time (average 200 words per minute)
export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Utility to format date for display
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

// Utility to create slug from title
export function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Series information interface
export interface SeriesInfo {
  name: string;
  description: string;
  posts: BlogPost[];
  totalPosts: number;
}

// Table of contents entry interface
export interface TocEntry {
  id: string;
  title: string;
  level: number;
}

// Utility to extract table of contents from content
export function extractTableOfContents(content: string): TocEntry[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const toc: TocEntry[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const title = match[2].trim();
    const id = createSlug(title);

    toc.push({
      id,
      title,
      level,
    });
  }

  return toc;
}

// Utility to parse frontmatter from MDX content
export function parseFrontmatter(content: string): {
  frontmatter: BlogPostFrontmatter;
  content: string;
} {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    throw new Error('Invalid MDX format: frontmatter not found');
  }

  const [, frontmatterYaml, mdxContent] = match;

  // Simple YAML parser for frontmatter (basic key-value pairs)
  const frontmatterObj: Record<string, unknown> = {};

  frontmatterYaml.split('\n').forEach((line) => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const colonIndex = trimmedLine.indexOf(':');
      if (colonIndex > 0) {
        const key = trimmedLine.substring(0, colonIndex).trim();
        let value = trimmedLine.substring(colonIndex + 1).trim();

        // Remove quotes if present
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }

        // Parse arrays (simple format: [item1, item2])
        if (value.startsWith('[') && value.endsWith(']')) {
          const arrayContent = value.slice(1, -1);
          if (arrayContent.trim()) {
            frontmatterObj[key] = arrayContent
              .split(',')
              .map((item) => item.trim().replace(/^["']|["']$/g, ''));
          } else {
            frontmatterObj[key] = [];
          }
        }
        // Parse numbers
        else if (/^\d+$/.test(value)) {
          frontmatterObj[key] = parseInt(value, 10);
        }
        // Parse booleans
        else if (value === 'true' || value === 'false') {
          frontmatterObj[key] = value === 'true';
        }
        // Keep as string
        else {
          frontmatterObj[key] = value;
        }
      }
    }
  });

  const frontmatter = BlogPostFrontmatterSchema.parse(frontmatterObj);

  return {
    frontmatter,
    content: mdxContent.trim(),
  };
}
