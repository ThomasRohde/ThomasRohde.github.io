import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import viteBlogPlugin from './vite-blog-plugin'

export default defineConfig({
  plugins: [react(), viteBlogPlugin(),
  VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.ico', 'icon-192x192.png', 'icon-512x512.png'],
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
      }
    }
  }
})