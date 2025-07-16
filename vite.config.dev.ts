import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';

// Development-specific Vite configuration
export default defineConfig({
  base: '/',
  plugins: [
    react({
      // Enable Fast Refresh
      fastRefresh: true,
      // Include development helpers
      include: '**/*.{jsx,tsx}',
    }),
    tailwindcss(),
    mdx({
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        [
          rehypePrettyCode,
          {
            theme: 'github-dark',
            keepBackground: false,
          },
        ],
      ],
    }),
    // Bundle analyzer for development
    visualizer({
      filename: 'dist/dev-stats.html',
      open: false, // Don't auto-open in dev
      gzipSize: true,
      brotliSize: true,
      template: 'treemap', // Better for development analysis
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
    open: true,
    cors: true,
    hmr: {
      overlay: true,
      port: 3001,
    },
    watch: {
      usePolling: false,
      interval: 100,
      ignored: ['**/node_modules/**', '**/dist/**'],
    },
    // Proxy configuration for API calls (if needed)
    proxy: {
      // '/api': {
      //   target: 'http://localhost:8080',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, ''),
      // },
    },
  },
  build: {
    // Enable source maps for development builds
    sourcemap: true,
    // Don't minify in development
    minify: false,
    // Faster builds
    target: 'esnext',
    rollupOptions: {
      output: {
        // Simple chunk naming for development
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
  define: {
    __DEV__: JSON.stringify(true),
    __PROD__: JSON.stringify(false),
    __VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'lucide-react'],
    exclude: [
      // Exclude large dependencies that don't need pre-bundling
    ],
  },
  // CSS configuration
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },
  // Environment variables
  envPrefix: 'VITE_',
  envDir: '.',
});
