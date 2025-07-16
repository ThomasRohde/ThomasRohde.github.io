import type { BlogPost } from '@/types/blog';
import { parseFrontmatter, calculateReadTime, createSlug } from '@/lib/blog';

// Blog post modules - this will be populated by Vite's glob import
const blogModules = import.meta.glob('/src/content/blog/*.mdx', {
  query: '?raw',
  import: 'default',
  eager: false,
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

  try {
    for (const [path, loader] of Object.entries(blogModules)) {
      try {
        const rawContent = await loader();

        if (!rawContent || typeof rawContent !== 'string') {
          console.warn(`Invalid content for ${path}:`, rawContent);
          continue;
        }

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
  } catch (error) {
    console.error('Error loading blog modules:', error);
    // Return empty array as fallback
    return [];
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
  try {
    const posts = await loadBlogPosts();
    return posts.find((post) => post.slug === slug) || null;
  } catch (error) {
    console.error(`Error getting blog post with slug ${slug}:`, error);
    return null;
  }
}

/**
 * Get blog posts filtered by category
 */
export async function getBlogPostsByCategory(
  category: string
): Promise<BlogPost[]> {
  try {
    const posts = await loadBlogPosts();
    return posts.filter((post) => post.category === category);
  } catch (error) {
    console.error(`Error getting blog posts by category ${category}:`, error);
    return [];
  }
}

/**
 * Get blog posts filtered by tag
 */
export async function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  try {
    const posts = await loadBlogPosts();
    return posts.filter((post) => post.tags.includes(tag));
  } catch (error) {
    console.error(`Error getting blog posts by tag ${tag}:`, error);
    return [];
  }
}

/**
 * Get all unique categories from blog posts
 */
export async function getBlogCategories(): Promise<string[]> {
  try {
    const posts = await loadBlogPosts();
    const categories = new Set(posts.map((post) => post.category));
    return Array.from(categories).sort();
  } catch (error) {
    console.error('Error getting blog categories:', error);
    return [];
  }
}

/**
 * Get all unique tags from blog posts
 */
export async function getBlogTags(): Promise<string[]> {
  try {
    const posts = await loadBlogPosts();
    const tags = new Set(posts.flatMap((post) => post.tags));
    return Array.from(tags).sort();
  } catch (error) {
    console.error('Error getting blog tags:', error);
    return [];
  }
}

/**
 * Clear the blog posts cache (useful for development)
 */
export function clearBlogCache(): void {
  blogPostsCache = null;
}
