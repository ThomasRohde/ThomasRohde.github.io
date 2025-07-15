import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootLayout from '@/components/RootLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorBoundary from '@/components/ErrorBoundary';
import { AccessibilityProvider } from '@/components/AccessibilityProvider';
import { DevToolsToggle } from '@/components/DevTools';

// Lazy load route components for code splitting
const Home = lazy(() => import('@/pages/Home'));
const Blog = lazy(() => import('@/pages/Blog'));
const BlogPost = lazy(() => import('@/pages/BlogPost'));

function App() {
  return (
    <ErrorBoundary>
      <AccessibilityProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootLayout />}>
              <Route
                index
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <Home />
                  </Suspense>
                }
              />
              <Route
                path="blog"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <Blog />
                  </Suspense>
                }
              />
              <Route
                path="blog/:slug"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <BlogPost />
                  </Suspense>
                }
              />
            </Route>
          </Routes>
          <DevToolsToggle />
        </BrowserRouter>
      </AccessibilityProvider>
    </ErrorBoundary>
  );
}

export default App;
