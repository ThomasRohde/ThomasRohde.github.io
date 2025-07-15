import type { BlogPost } from '@/types/blog';
import { parseFrontmatter, calculateReadTime, createSlug } from '@/lib/blog';

// Blog post modules - this will be populated by Vite's glob import
const blogModules = import.meta.glob('/src/content/blog/*.mdx', {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>;

// Cache for loaded blog posts
let blogPostsCache: BlogPost[] | null = null;

/**
 * Load all blog posts from MDX files
 */
export async function loadBlogPosts(): Promise<BlogPost[]> {
  if (blogPostsCache) {
    return blogPostsCache;
  }

  const posts: BlogPost[] = [];

  for (const [path, loader] of Object.entries(blogModules)) {
    try {
      const rawContent = await loader();
      const { frontmatter, content } = parseFrontmatter(rawContent);

      // Extract filename for slug
      const filename = path.split('/').pop()?.replace('.mdx', '') || '';
      const slug = filename || createSlug(frontmatter.title);

      const post: BlogPost = {
        ...frontmatter,
        slug,
        content,
        readTime: calculateReadTime(content),
        publishedDate: new Date(frontmatter.publishedDate),
        updatedDate: frontmatter.updatedDate
          ? new Date(frontmatter.updatedDate)
          : undefined,
      };

      // Only include published posts
      if (post.published) {
        posts.push(post);
      }
    } catch (error) {
      console.error(`Error loading blog post from ${path}:`, error);
    }
  }

  // Sort posts by published date (newest first)
  posts.sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime());

  blogPostsCache = posts;
  return posts;
}

/**
 * Get a single blog post by slug
 */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const posts = await loadBlogPosts();
  return posts.find((post) => post.slug === slug) || null;
}

/**
 * Get blog posts filtered by category
 */
export async function getBlogPostsByCategory(
  category: string
): Promise<BlogPost[]> {
  const posts = await loadBlogPosts();
  return posts.filter((post) => post.category === category);
}

/**
 * Get blog posts filtered by tag
 */
export async function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await loadBlogPosts();
  return posts.filter((post) => post.tags.includes(tag));
}

/**
 * Get all unique categories from blog posts
 */
export async function getBlogCategories(): Promise<string[]> {
  const posts = await loadBlogPosts();
  const categories = new Set(posts.map((post) => post.category));
  return Array.from(categories).sort();
}

/**
 * Get all unique tags from blog posts
 */
export async function getBlogTags(): Promise<string[]> {
  const posts = await loadBlogPosts();
  const tags = new Set(posts.flatMap((post) => post.tags));
  return Array.from(tags).sort();
}

/**
 * Clear the blog posts cache (useful for development)
 */
export function clearBlogCache(): void {
  blogPostsCache = null;
}
