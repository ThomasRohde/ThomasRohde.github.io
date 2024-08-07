import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import viteBlogPlugin from './vite-blog-plugin'

export default defineConfig({
  plugins: [react(), viteBlogPlugin(),
  VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['icon-192x192.png', 'icon-512x512.png', 'icon-180x180.png', 'icon-167x167.png', 'icon-152x152.png'],
    manifest: {
      name: 'Thomas Klok Rohde Portfolio',
      short_name: 'TKR Portfolio',
      description: 'Portfolio and blog of Thomas Klok Rohde',
      theme_color: '#1976d2',
      icons: [
        {
          src: '/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: '/icon-180x180.png',
          sizes: '180x180',
          type: 'image/png'
        },
        {
          src: '/icon-167x167.png',
          sizes: '167x167',
          type: 'image/png'
        },
        {
          src: '/icon-152x152.png',
          sizes: '152x152',
          type: 'image/png'
        }
      ]
    }
  })
  ],
  base: '/',
  server: {
    watch: {
      ignored: ['**/src/assets/blog-data/**']
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html'
      },
      output: {
        entryFileNames: `assets/[name]-[hash].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`
      }
    }
  }
})