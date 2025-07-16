// Re-export blog types for better organization
import type {
  BlogPost,
  BlogPostFrontmatter,
  SeriesInfo,
  TocEntry,
} from '@/lib/blog';

export type { BlogPost, BlogPostFrontmatter, SeriesInfo, TocEntry };

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
  series?: string;
  published?: boolean;
}

// Series navigation types
export interface SeriesNavigation {
  previous: BlogPost | null;
  next: BlogPost | null;
  currentIndex: number;
  totalPosts: number;
}

// Table of contents component props
export interface TableOfContentsProps {
  entries: TocEntry[];
  className?: string;
}
