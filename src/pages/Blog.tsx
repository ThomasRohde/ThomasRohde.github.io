import { useEffect, useState } from 'react';
import { loadBlogPosts } from '@/lib/blogService';
import { BlogCard } from '@/components/BlogCard';
import { SEO } from '@/components/SEO';
import {
  StructuredData,
  createBreadcrumbStructuredData,
} from '@/components/StructuredData';
import { generateBlogListingSEO, seoConfig } from '@/lib/seo';
import { BlogListSkeleton } from '@/components/LoadingSpinner';
import ErrorBoundary from '@/components/ErrorBoundary';
import type { BlogPost } from '@/types/blog';

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const blogPosts = await loadBlogPosts();
        setPosts(blogPosts);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load blog posts'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) {
    return <BlogListSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-8 text-4xl font-bold">Blog</h1>
          <div className="flex items-center justify-center py-12">
            <div className="text-destructive text-lg">Error: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  const seoData = generateBlogListingSEO();

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <SEO {...seoData} />
        <StructuredData
          type="breadcrumb"
          data={createBreadcrumbStructuredData([
            { name: 'Home', url: seoConfig.siteUrl },
            { name: 'Blog', url: `${seoConfig.siteUrl}/blog` },
          ])}
        />
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="mb-4 text-4xl font-bold">Blog</h1>
            <p className="text-muted-foreground text-lg">
              Thoughts, tutorials, and insights on web development and
              technology.
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <h2 className="mb-2 text-2xl font-semibold">No posts yet</h2>
                <p className="text-muted-foreground">
                  Check back soon for new content!
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-8 md:gap-12">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
