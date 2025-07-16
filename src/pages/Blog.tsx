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
        setError(null);
        const blogPosts = await loadBlogPosts();
        setPosts(blogPosts);
      } catch (err) {
        console.error('Error loading blog posts:', err);
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
      <ErrorBoundary>
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-4xl">
            <h1 className="mb-8 text-4xl font-bold">Blog</h1>
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="text-destructive mb-4 text-lg">
                  Unable to load blog posts: {error}
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded px-4 py-2"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </ErrorBoundary>
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
