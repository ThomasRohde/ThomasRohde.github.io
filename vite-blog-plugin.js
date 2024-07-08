// vite-blog-plugin.js
import { spawn } from 'child_process';
import { watch } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default function viteBlogPlugin() {
  return {
    name: 'vite-blog-plugin',
    configureServer(server) {
      const postsDirectory = join(__dirname, 'src', 'blog-posts');
      
      console.log(`Watching directory: ${postsDirectory}`);
      
      watch(postsDirectory, { recursive: true }, (eventType, filename) => {
        if (filename && filename.endsWith('.md')) {
          console.log(`Change detected in file: ${filename}`);
          console.log('Processing blog posts...');
          
          const process = spawn('npm', ['run', 'process-posts'], { stdio: 'inherit', shell: true });
          
          process.on('close', (code) => {
            if (code === 0) {
              console.log('Blog posts processed successfully.');
              // Force Vite to re-read the posts.json file
              const postsJsonPath = join(__dirname, 'src', 'assets', 'blog-data', 'posts.json');
              server.watcher.add(postsJsonPath);
              server.watcher.emit('change', postsJsonPath);
              
              // Trigger HMR update
              server.ws.send({
                type: 'full-reload',
                path: '*'
              });
            } else {
              console.error('Failed to process blog posts.');
            }
          });
        }
      });
    }
  };
}