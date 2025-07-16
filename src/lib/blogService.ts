import type { BlogPost } from '@/types/blog';
import { parseFrontmatter, calculateReadTime, createSlug } from '@/lib/blog';

// Blog post modules - this will be populated by Vite's glob import
// Using eager loading to avoid temporal dead zone issues in production
let blogModules: Record<string, string> = {};

// Safe module loading with error handling
function loadBlogModules(): Record<string, string> {
  try {
    return import.meta.glob('/src/content/blog/*.mdx', {
      query: '?raw',
      import: 'default',
      eager: true,
    }) as Record<string, string>;
  } catch (error) {
    console.error('Failed to load blog modules:', error);
    return {};
  }
}

// Initialize modules
try {
  blogModules = loadBlogModules();
} catch (error) {
  console.error('Error during blog module initialization:', error);
  blogModules = {};
}

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
    // Check if we have any blog modules
    if (!blogModules || Object.keys(blogModules).length === 0) {
      console.warn('No blog modules found');
      return [];
    }

    for (const [path, rawContent] of Object.entries(blogModules)) {
      try {
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
 * Get blog posts by series
 */
export async function getBlogPostsBySeries(
  seriesName: string
): Promise<BlogPost[]> {
  try {
    const posts = await loadBlogPosts();
    return posts
      .filter((post) => post.series === seriesName)
      .sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0));
  } catch (error) {
    console.error(`Error getting blog posts by series ${seriesName}:`, error);
    return [];
  }
}

/**
 * Get all unique series from blog posts
 */
export async function getBlogSeries(): Promise<string[]> {
  try {
    const posts = await loadBlogPosts();
    const series = new Set(
      posts.filter((post) => post.series).map((post) => post.series!)
    );
    return Array.from(series).sort();
  } catch (error) {
    console.error('Error getting blog series:', error);
    return [];
  }
}

/**
 * Get series information including all posts
 */
export async function getSeriesInfo(
  seriesName: string
): Promise<import('@/lib/blog').SeriesInfo | null> {
  try {
    const posts = await getBlogPostsBySeries(seriesName);
    if (posts.length === 0) return null;

    // Get series description from the first post or use a default
    const description = getSeriesDescription(seriesName);

    return {
      name: seriesName,
      description,
      posts,
      totalPosts: posts.length,
    };
  } catch (error) {
    console.error(`Error getting series info for ${seriesName}:`, error);
    return null;
  }
}

/**
 * Get series navigation for a specific post
 */
export async function getSeriesNavigation(post: BlogPost): Promise<{
  previous: BlogPost | null;
  next: BlogPost | null;
  currentIndex: number;
  totalPosts: number;
} | null> {
  if (!post.series) return null;

  try {
    const seriesPosts = await getBlogPostsBySeries(post.series);
    const currentIndex = seriesPosts.findIndex((p) => p.slug === post.slug);

    if (currentIndex === -1) return null;

    return {
      previous: currentIndex > 0 ? seriesPosts[currentIndex - 1] : null,
      next:
        currentIndex < seriesPosts.length - 1
          ? seriesPosts[currentIndex + 1]
          : null,
      currentIndex: currentIndex + 1, // 1-based index for display
      totalPosts: seriesPosts.length,
    };
  } catch (error) {
    console.error(`Error getting series navigation for ${post.slug}:`, error);
    return null;
  }
}

/**
 * Get series description based on series name
 */
function getSeriesDescription(seriesName: string): string {
  const descriptions: Record<string, string> = {
    'kiro-spec-driven-development':
      'A comprehensive guide to Kiro\'s spec-driven development methodology, demonstrating how to transform AI-assisted development from ad-hoc "vibe coding" into structured, repeatable processes through practical examples.',
  };

  return (
    descriptions[seriesName] || `A series of blog posts about ${seriesName}.`
  );
}

/**
 * Clear the blog posts cache (useful for development)
 */
export function clearBlogCache(): void {
  blogPostsCache = null;
}
