import { Outlet } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import SkipLinks from '@/components/SkipLinks';

export default function RootLayout() {
  return (
    <div className="bg-background min-h-screen">
      <SkipLinks />
      <Navigation />
      <main id="main-content" role="main" tabIndex={-1}>
        <Outlet />
      </main>
      <footer id="footer" role="contentinfo" className="bg-muted/30 mt-20 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Thomas Rohde. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
