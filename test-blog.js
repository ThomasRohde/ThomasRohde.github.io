// Simple test script to verify blog functionality
import { readFileSync } from 'fs';
import { join } from 'path';

// Test the frontmatter parsing
const blogContent = readFileSync(
  join(process.cwd(), 'src/content/blog/hello-world.mdx'),
  'utf8'
);

console.log('Testing frontmatter parsing...');
console.log('Blog content length:', blogContent.length);

const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
const match = blogContent.match(frontmatterRegex);

if (match) {
  console.log('✅ Frontmatter parsing successful');
  console.log('Frontmatter:', match[1]);
  console.log('Content preview:', match[2].substring(0, 100) + '...');
} else {
  console.log('❌ Frontmatter parsing failed');
}
