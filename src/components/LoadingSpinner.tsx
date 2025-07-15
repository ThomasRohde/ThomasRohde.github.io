import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export default function LoadingSpinner({
  size = 'md',
  text = 'Loading...',
  className = '',
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div
      className={`flex flex-col items-center justify-center py-12 ${className}`}
      role="status"
      aria-live="polite"
      aria-label={text}
    >
      <Loader2
        className={`text-primary animate-spin ${sizeClasses[size]}`}
        aria-hidden="true"
      />
      <span className="text-muted-foreground mt-2 text-sm">{text}</span>
    </div>
  );
}

// Skeleton loading components for different content types
export function BlogPostSkeleton() {
  return (
    <div
      className="container mx-auto px-4 py-8"
      role="status"
      aria-label="Loading blog post"
    >
      <div className="mx-auto max-w-4xl">
        {/* Back link skeleton */}
        <div className="mb-8">
          <div className="bg-muted h-4 w-24 animate-pulse rounded" />
        </div>

        {/* Title skeleton */}
        <div className="mb-8">
          <div className="bg-muted mb-6 h-12 w-3/4 animate-pulse rounded" />
          <div className="mb-6 flex gap-4">
            <div className="bg-muted h-4 w-20 animate-pulse rounded" />
            <div className="bg-muted h-4 w-16 animate-pulse rounded" />
          </div>
          <div className="mb-6 flex gap-2">
            <div className="bg-muted h-6 w-16 animate-pulse rounded" />
            <div className="bg-muted h-6 w-20 animate-pulse rounded" />
          </div>
          <div className="bg-muted h-4 w-full animate-pulse rounded" />
        </div>

        {/* Content skeleton */}
        <div className="space-y-4">
          <div className="bg-muted h-4 w-full animate-pulse rounded" />
          <div className="bg-muted h-4 w-5/6 animate-pulse rounded" />
          <div className="bg-muted h-4 w-4/5 animate-pulse rounded" />
          <div className="bg-muted h-4 w-full animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}

export function BlogListSkeleton() {
  return (
    <div
      className="container mx-auto px-4 py-8"
      role="status"
      aria-label="Loading blog posts"
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <div className="bg-muted mb-4 h-10 w-32 animate-pulse rounded" />
          <div className="bg-muted h-4 w-2/3 animate-pulse rounded" />
        </div>

        <div className="grid gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-lg border p-6">
              <div className="bg-muted mb-4 h-8 w-3/4 animate-pulse rounded" />
              <div className="bg-muted mb-2 h-4 w-full animate-pulse rounded" />
              <div className="bg-muted mb-4 h-4 w-5/6 animate-pulse rounded" />
              <div className="flex gap-2">
                <div className="bg-muted h-6 w-16 animate-pulse rounded" />
                <div className="bg-muted h-6 w-20 animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
