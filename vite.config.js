import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import viteBlogPlugin from './vite-blog-plugin'

export default defineConfig({
  plugins: [react(), viteBlogPlugin()],
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