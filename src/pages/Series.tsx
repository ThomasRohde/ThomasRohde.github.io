import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, BookOpen, ArrowLeft } from 'lucide-react';
import { getSeriesInfo } from '@/lib/blogService';
import { formatDate } from '@/lib/blog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SEO } from '@/components/SEO';
import { BlogListSkeleton } from '@/components/LoadingSpinner';
import ErrorBoundary from '@/components/ErrorBoundary';
import type { SeriesInfo } from '@/types/blog';

export default function Series() {
  const { seriesName } = useParams<{ seriesName: string }>();
  const [seriesInfo, setSeriesInfo] = useState<SeriesInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSeriesInfo() {
      if (!seriesName) {
        setError('No series name provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const info = await getSeriesInfo(seriesName);

        if (!info) {
          setError('Series not found');
          setLoading(false);
          return;
        }

        setSeriesInfo(info);
      } catch (err) {
        console.error('Error loading series info:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load series information'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchSeriesInfo();
  }, [seriesName]);

  if (loading) {
    return <BlogListSkeleton />;
  }

  if (error || !seriesInfo) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="py-12 text-center">
            <h1 className="mb-4 text-3xl font-bold">Series Not Found</h1>
            <p className="text-muted-foreground mb-6">
              {error || 'The blog series you are looking for does not exist.'}
            </p>
            <Button asChild variant="outline">
              <Link to="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const seriesTitle = seriesInfo.name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <SEO
          title={`${seriesTitle} Series`}
          description={seriesInfo.description}
          type="website"
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

          {/* Series header */}
          <header className="mb-8">
            <div className="mb-4 flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              <Badge variant="secondary">Series</Badge>
            </div>

            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              {seriesTitle}
            </h1>

            <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
              {seriesInfo.description}
            </p>

            <div className="text-muted-foreground flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>{seriesInfo.totalPosts} posts</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>
                  {seriesInfo.posts.reduce(
                    (total, post) => total + post.readTime,
                    0
                  )}{' '}
                  min total read
                </span>
              </div>
            </div>
          </header>

          {/* Series posts */}
          <div className="space-y-6">
            {seriesInfo.posts.map((post, index) => (
              <Card
                key={post.slug}
                className="group transition-shadow hover:shadow-md"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          Part {index + 1} of {seriesInfo.totalPosts}
                        </Badge>
                        <Progress
                          value={((index + 1) / seriesInfo.totalPosts) * 100}
                          className="h-2 w-20"
                        />
                      </div>

                      <CardTitle className="group-hover:text-primary transition-colors">
                        <Link to={`/blog/${post.slug}`} className="block">
                          {post.title}
                        </Link>
                      </CardTitle>

                      <CardDescription className="mt-2">
                        {post.excerpt}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
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

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {post.category}
                    </Badge>
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{post.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Series completion indicator */}
          <div className="mt-12 text-center">
            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="mb-2 text-lg font-semibold">Series Progress</h3>
              <Progress value={100} className="mx-auto mb-2 w-64" />
              <p className="text-muted-foreground text-sm">
                {seriesInfo.totalPosts} of {seriesInfo.totalPosts} posts
                completed
              </p>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
