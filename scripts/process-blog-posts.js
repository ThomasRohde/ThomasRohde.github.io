import { access, mkdir, readdir, readFile, writeFile } from 'fs/promises';
import matter from 'gray-matter';
import { marked } from 'marked';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const postsDirectory = join(__dirname, '..', 'src', 'blog-posts');
const outputDirectory = join(__dirname, '..', 'src', 'assets', 'blog-data');

const checkDirectory = async (path) => {
  try {
    await access(path);
    console.log(`Directory exists: ${path}`);
  } catch {
    console.error(`Directory does not exist: ${path}`);
    throw new Error(`Directory does not exist: ${path}`);
  }
};

export const processPosts = async () => {
  try {
    console.log('Starting blog post processing...');
    console.log(`Current directory: ${__dirname}`);
    console.log(`Posts directory: ${postsDirectory}`);
    console.log(`Output directory: ${outputDirectory}`);

    await checkDirectory(postsDirectory);

    await mkdir(outputDirectory, { recursive: true });
    console.log('Output directory created/confirmed.');

    const postFiles = await readdir(postsDirectory);
    console.log(`Found ${postFiles.length} files in posts directory:`, postFiles);

    if (postFiles.length === 0) {
      console.warn('No markdown files found in the posts directory.');
      return;
    }

    const posts = await Promise.all(postFiles.map(async (filename) => {
      if (!filename.endsWith('.md')) {
        console.log(`Skipping non-markdown file: ${filename}`);
        return null;
      }

      const filePath = join(postsDirectory, filename);
      console.log(`Processing file: ${filePath}`);
      const fileContent = await readFile(filePath, 'utf8');
      const { data, content } = matter(fileContent);

      return {
        slug: filename.replace('.md', ''),
        title: data.title || 'Untitled',
        date: data.date || new Date().toISOString().split('T')[0],
        content: marked(content),
      };
    }));

    const validPosts = posts.filter(post => post !== null);
    validPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    console.log(`Processed ${validPosts.length} valid posts.`);

    const outputPath = join(outputDirectory, 'posts.json');
    await writeFile(outputPath, JSON.stringify(validPosts, null, 2));
    console.log(`Blog posts processed successfully. Output written to: ${outputPath}`);
  } catch (error) {
    console.error('Error processing blog posts:', error);
  }
};

// Run the function regardless of how it's invoked
processPosts();