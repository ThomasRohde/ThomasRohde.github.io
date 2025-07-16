import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Filter } from 'lucide-react';
import { loadBlogPosts, getBlogSeries } from '@/lib/blogService';
import { BlogCard } from '@/components/BlogCard';
import { SEO } from '@/components/SEO';
import {
  StructuredData,
  createBreadcrumbStructuredData,
} from '@/components/StructuredData';
import { generateBlogListingSEO, seoConfig } from '@/lib/seo';
import { BlogListSkeleton } from '@/components/LoadingSpinner';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { BlogPost } from '@/types/blog';

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [series, setSeries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const [blogPosts, blogSeries] = await Promise.all([
          loadBlogPosts(),
          getBlogSeries(),
        ]);
        setPosts(blogPosts);
        setSeries(blogSeries);
      } catch (err) {
        console.error('Error loading blog data:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to load blog data'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
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

          {/* Series section */}
          {series.length > 0 && (
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-semibold">Blog Series</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {series.map((seriesName) => {
                  const seriesTitle = seriesName
                    .split('-')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

                  const seriesPosts = posts.filter(
                    (post) => post.series === seriesName
                  );
                  const totalReadTime = seriesPosts.reduce(
                    (total, post) => total + post.readTime,
                    0
                  );

                  return (
                    <Card
                      key={seriesName}
                      className="group transition-shadow hover:shadow-md"
                    >
                      <CardHeader>
                        <div className="mb-2 flex items-center gap-2">
                          <BookOpen className="h-5 w-5" />
                          <Badge variant="secondary">Series</Badge>
                        </div>
                        <CardTitle className="group-hover:text-primary transition-colors">
                          <Link to={`/series/${seriesName}`}>
                            {seriesTitle}
                          </Link>
                        </CardTitle>
                        <CardDescription>
                          {seriesName === 'kiro-spec-driven-development'
                            ? 'A comprehensive guide to Kiro\'s spec-driven development methodology, demonstrating how to transform AI-assisted development from ad-hoc "vibe coding" into structured, repeatable processes.'
                            : `A series of blog posts about ${seriesTitle.toLowerCase()}.`}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-muted-foreground flex items-center gap-4 text-sm">
                          <span>{seriesPosts.length} posts</span>
                          <span>{totalReadTime} min total read</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Filter section */}
          {series.length > 0 && (
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">Filter by series:</span>
                <Button
                  variant={selectedSeries === null ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSeries(null)}
                >
                  All Posts
                </Button>
                {series.map((seriesName) => {
                  const seriesTitle = seriesName
                    .split('-')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

                  return (
                    <Button
                      key={seriesName}
                      variant={
                        selectedSeries === seriesName ? 'default' : 'outline'
                      }
                      size="sm"
                      onClick={() => setSelectedSeries(seriesName)}
                    >
                      {seriesTitle}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Posts section */}
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
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold">
                  {selectedSeries
                    ? `${selectedSeries
                        .split('-')
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(' ')} Posts`
                    : 'All Posts'}
                </h2>
              </div>
              <div className="grid gap-8 md:gap-12">
                {posts
                  .filter(
                    (post) =>
                      selectedSeries === null || post.series === selectedSeries
                  )
                  .map((post) => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
