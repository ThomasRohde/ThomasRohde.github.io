import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="bg-muted mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full">
              <span className="text-muted-foreground text-4xl font-bold">
                404
              </span>
            </div>
            <CardTitle className="text-2xl">Page Not Found</CardTitle>
            <CardDescription className="text-base">
              The page you're looking for doesn't exist or has been moved.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild className="flex-1">
                <Link to="/" aria-label="Go to homepage">
                  <Home className="mr-2 h-4 w-4" aria-hidden="true" />
                  Go Home
                </Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link to="/blog" aria-label="Browse blog posts">
                  <Search className="mr-2 h-4 w-4" aria-label="true" />
                  Browse Blog
                </Link>
              </Button>
            </div>
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="w-full"
              aria-label="Go back to previous page"
            >
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
