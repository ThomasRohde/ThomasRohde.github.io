// Re-export blog types for better organization
import type { BlogPost, BlogPostFrontmatter } from '@/lib/blog';

export type { BlogPost, BlogPostFrontmatter };

// Additional types for blog components
export interface BlogCardProps {
  post: BlogPost;
  className?: string;
}

export interface BlogListProps {
  posts: BlogPost[];
  className?: string;
}

// Blog filter and sort options
export type BlogSortOption =
  | 'date-desc'
  | 'date-asc'
  | 'title-asc'
  | 'title-desc';

export interface BlogFilters {
  category?: string;
  tags?: string[];
  published?: boolean;
}
