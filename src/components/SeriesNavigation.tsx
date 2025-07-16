import { Link } from 'react-router-dom';
import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type {
  BlogPost,
  SeriesNavigation as SeriesNavigationType,
} from '@/types/blog';

interface SeriesNavigationProps {
  post: BlogPost;
  navigation: SeriesNavigationType;
  className?: string;
}

export function SeriesNavigation({
  post,
  navigation,
  className,
}: SeriesNavigationProps) {
  if (!post.series) return null;

  const seriesTitle = post.series
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const progressPercentage =
    (navigation.currentIndex / navigation.totalPosts) * 100;

  return (
    <div className={className}>
      {/* Series info card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="mb-2 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <Badge variant="secondary">Series</Badge>
          </div>

          <CardTitle className="text-lg">
            <Link
              to={`/series/${post.series}`}
              className="hover:text-primary transition-colors"
            >
              {seriesTitle}
            </Link>
          </CardTitle>

          <div className="space-y-2">
            <div className="text-muted-foreground flex items-center justify-between text-sm">
              <span>
                Part {navigation.currentIndex} of {navigation.totalPosts}
              </span>
              <span>{Math.round(progressPercentage)}% complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Previous/Next navigation */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          {navigation.previous && (
            <Link
              to={`/blog/${navigation.previous.slug}`}
              className="group hover:bg-muted/50 flex h-full items-start gap-3 rounded-lg border p-4 transition-colors"
            >
              <ChevronLeft className="text-muted-foreground group-hover:text-foreground mt-1 h-5 w-5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-muted-foreground mb-1 text-sm">
                  Previous in series
                </div>
                <div className="group-hover:text-primary line-clamp-2 font-medium transition-colors">
                  {navigation.previous.title}
                </div>
                <div className="text-muted-foreground mt-1 text-xs">
                  Part {navigation.currentIndex - 1} of {navigation.totalPosts}
                </div>
              </div>
            </Link>
          )}
        </div>

        <div>
          {navigation.next && (
            <Link
              to={`/blog/${navigation.next.slug}`}
              className="group hover:bg-muted/50 flex h-full items-start gap-3 rounded-lg border p-4 text-right transition-colors"
            >
              <div className="min-w-0 flex-1">
                <div className="text-muted-foreground mb-1 text-sm">
                  Next in series
                </div>
                <div className="group-hover:text-primary line-clamp-2 font-medium transition-colors">
                  {navigation.next.title}
                </div>
                <div className="text-muted-foreground mt-1 text-xs">
                  Part {navigation.currentIndex + 1} of {navigation.totalPosts}
                </div>
              </div>
              <ChevronRight className="text-muted-foreground group-hover:text-foreground mt-1 h-5 w-5 flex-shrink-0" />
            </Link>
          )}
        </div>
      </div>

      {/* View all posts in series */}
      <div className="mt-4 text-center">
        <Link
          to={`/series/${post.series}`}
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          View all posts in this series →
        </Link>
      </div>
    </div>
  );
}
