import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Tag,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  getBlogPost,
  loadBlogPosts,
  getSeriesNavigation,
} from '@/lib/blogService';
import { formatDate, extractTableOfContents } from '@/lib/blog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SEO } from '@/components/SEO';
import {
  StructuredData,
  createBlogPostStructuredData,
  createBreadcrumbStructuredData,
} from '@/components/StructuredData';
import { generateBlogPostSEO, seoConfig } from '@/lib/seo';
import { BlogPostSkeleton } from '@/components/LoadingSpinner';
import ErrorBoundary from '@/components/ErrorBoundary';
import { SeriesNavigation } from '@/components/SeriesNavigation';
import { TableOfContents } from '@/components/TableOfContents';
import type {
  BlogPost as BlogPostType,
  SeriesNavigation as SeriesNavigationType,
  TocEntry,
} from '@/types/blog';
import { MDXRenderer } from '@/components/MDXRenderer';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [navigation, setNavigation] = useState<{
    previous: BlogPostType | null;
    next: BlogPostType | null;
  }>({ previous: null, next: null });
  const [seriesNavigation, setSeriesNavigation] =
    useState<SeriesNavigationType | null>(null);
  const [tableOfContents, setTableOfContents] = useState<TocEntry[]>([]);

  useEffect(() => {
    async function fetchPost() {
      if (!slug) {
        setError('No blog post slug provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Get the current post
        const currentPost = await getBlogPost(slug);
        if (!currentPost) {
          setError('Blog post not found');
          setLoading(false);
          return;
        }

        setPost(currentPost);

        // Extract table of contents
        const toc = extractTableOfContents(currentPost.content);
        setTableOfContents(toc);

        // Get series navigation if post is part of a series
        if (currentPost.series) {
          const seriesNav = await getSeriesNavigation(currentPost);
          setSeriesNavigation(seriesNav);
        }

        // Get all posts for general navigation
        const allPosts = await loadBlogPosts();
        const currentIndex = allPosts.findIndex((p) => p.slug === slug);

        if (currentIndex !== -1) {
          setNavigation({
            previous: currentIndex > 0 ? allPosts[currentIndex - 1] : null,
            next:
              currentIndex < allPosts.length - 1
                ? allPosts[currentIndex + 1]
                : null,
          });
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load blog post'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [slug]);

  if (loading) {
    return <BlogPostSkeleton />;
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="py-12 text-center">
            <h1 className="mb-4 text-3xl font-bold">Post Not Found</h1>
            <p className="text-muted-foreground mb-6">
              {error || 'The blog post you are looking for does not exist.'}
            </p>
            <Button onClick={() => navigate('/blog')} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const seoData = generateBlogPostSEO(post);

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <SEO {...seoData} />
        <StructuredData
          type="article"
          data={createBlogPostStructuredData(post)}
        />
        <StructuredData
          type="breadcrumb"
          data={createBreadcrumbStructuredData([
            { name: 'Home', url: seoConfig.siteUrl },
            { name: 'Blog', url: `${seoConfig.siteUrl}/blog` },
            { name: post.title, url: `${seoConfig.siteUrl}/blog/${post.slug}` },
          ])}
        />
        <div className="mx-auto max-w-4xl">
          {/* Back to blog link */}
          <div className="mb-8">
            <Link
              to="/blog"
              className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </div>

          {/* Post header */}
          <header className="mb-8">
            <h1 className="mb-6 text-4xl leading-tight font-bold md:text-5xl">
              {post.title}
            </h1>

            {/* Post metadata */}
            <div className="text-muted-foreground mb-6 flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.publishedDate.toISOString()}>
                  {formatDate(post.publishedDate)}
                </time>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{post.readTime} min read</span>
              </div>
            </div>

            {/* Tags and category */}
            <div className="mb-6 flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-sm">
                {post.category}
              </Badge>
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-sm">
                  <Tag className="mr-1 h-3 w-3" />
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Post excerpt */}
            <p className="text-muted-foreground text-lg leading-relaxed">
              {post.excerpt}
            </p>
          </header>

          {/* Series navigation */}
          {post.series && seriesNavigation && (
            <>
              <SeriesNavigation
                post={post}
                navigation={seriesNavigation}
                className="mb-8"
              />
              <Separator className="mb-8" />
            </>
          )}

          {/* Main content area with sidebar */}
          <div className="grid gap-8 lg:grid-cols-4">
            {/* Main content */}
            <div className="lg:col-span-3">
              <article className="prose prose-lg dark:prose-invert max-w-none">
                <MDXRenderer content={post.content} />
              </article>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Table of contents */}
                {tableOfContents.length > 0 && (
                  <div className="bg-muted/30 rounded-lg p-4">
                    <TableOfContents entries={tableOfContents} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator className="my-12" />

          {/* Post navigation */}
          <nav className="flex flex-col justify-between gap-4 sm:flex-row">
            <div className="flex-1">
              {navigation.previous && (
                <Link
                  to={`/blog/${navigation.previous.slug}`}
                  className="group hover:bg-muted/50 flex items-start gap-3 rounded-lg border p-4 transition-colors"
                >
                  <ChevronLeft className="text-muted-foreground group-hover:text-foreground mt-1 h-5 w-5" />
                  <div className="min-w-0 flex-1">
                    <div className="text-muted-foreground mb-1 text-sm">
                      Previous
                    </div>
                    <div className="group-hover:text-primary line-clamp-2 font-medium transition-colors">
                      {navigation.previous.title}
                    </div>
                  </div>
                </Link>
              )}
            </div>

            <div className="flex-1">
              {navigation.next && (
                <Link
                  to={`/blog/${navigation.next.slug}`}
                  className="group hover:bg-muted/50 flex items-start gap-3 rounded-lg border p-4 text-right transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-muted-foreground mb-1 text-sm">
                      Next
                    </div>
                    <div className="group-hover:text-primary line-clamp-2 font-medium transition-colors">
                      {navigation.next.title}
                    </div>
                  </div>
                  <ChevronRight className="text-muted-foreground group-hover:text-foreground mt-1 h-5 w-5" />
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </ErrorBoundary>
  );
}
