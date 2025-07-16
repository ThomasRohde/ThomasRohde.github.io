import { Link } from 'react-router-dom';
import { Calendar, Clock, Tag, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/blog';
import type { BlogCardProps } from '@/types/blog';
import { cn } from '@/lib/utils';

export function BlogCard({ post, className }: BlogCardProps) {
  return (
    <Card
      className={cn(
        'group transition-shadow duration-200 hover:shadow-lg',
        className
      )}
    >
      <CardHeader className="pb-4">
        <div className="text-muted-foreground mb-3 flex flex-wrap items-center gap-4 text-sm">
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
          {post.series && (
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <Link
                to={`/series/${post.series}`}
                className="hover:text-foreground transition-colors"
              >
                {post.series
                  .split('-')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
                {post.seriesOrder && ` (Part ${post.seriesOrder})`}
              </Link>
            </div>
          )}
        </div>

        <Link
          to={`/blog/${post.slug}`}
          className="group-hover:text-primary block transition-colors"
        >
          <h2 className="mb-3 text-2xl leading-tight font-bold group-hover:underline">
            {post.title}
          </h2>
        </Link>

        <p className="text-muted-foreground leading-relaxed">{post.excerpt}</p>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">
              {post.category}
            </Badge>
            {post.tags.slice(0, 3).map((tag: string) => (
              <Badge key={tag} variant="outline" className="text-xs">
                <Tag className="mr-1 h-3 w-3" />
                {tag}
              </Badge>
            ))}
            {post.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{post.tags.length - 3} more
              </Badge>
            )}
          </div>

          <Link
            to={`/blog/${post.slug}`}
            className="text-primary text-sm font-medium hover:underline"
          >
            Read more →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
