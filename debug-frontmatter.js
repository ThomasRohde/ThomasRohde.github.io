import fs from 'fs';
import { z } from 'zod';

// Read the actual blog post
const content = fs.readFileSync(
  'src/content/blog/project-foundation-modern-react-typescript-vite.mdx',
  'utf8'
);

// Extract frontmatter
const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
const match = content.match(frontmatterRegex);

if (!match) {
  console.log('No frontmatter found');
  process.exit(1);
}

const frontmatterYaml = match[1];
console.log('Raw frontmatter YAML:');
console.log(frontmatterYaml);
console.log('\n--- Parsing ---\n');

// Parse frontmatter
const frontmatterObj = {};
const lines = frontmatterYaml.split('\n');
let i = 0;

while (i < lines.length) {
  const line = lines[i].trim();

  if (!line || line.startsWith('#')) {
    i++;
    continue;
  }

  const colonIndex = line.indexOf(':');
  if (colonIndex > 0) {
    const key = line.substring(0, colonIndex).trim();
    let value = line.substring(colonIndex + 1).trim();

    console.log(`Processing key: "${key}", value: "${value}"`);

    if (value.startsWith('[')) {
      let arrayContent = value;

      if (!value.endsWith(']')) {
        i++;
        while (i < lines.length) {
          const nextLine = lines[i].trim();
          arrayContent += ' ' + nextLine;
          if (nextLine.endsWith(']')) {
            break;
          }
          i++;
        }
      }

      console.log(`Array content: "${arrayContent}"`);

      if (arrayContent.startsWith('[') && arrayContent.endsWith(']')) {
        const innerContent = arrayContent.slice(1, -1);
        if (innerContent.trim()) {
          frontmatterObj[key] = innerContent
            .split(',')
            .map((item) => item.trim().replace(/^["']|["']$/g, ''))
            .filter((item) => item.length > 0);
        } else {
          frontmatterObj[key] = [];
        }
      }
    } else {
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      if (/^\d+$/.test(value)) {
        frontmatterObj[key] = parseInt(value, 10);
      } else if (value === 'true' || value === 'false') {
        frontmatterObj[key] = value === 'true';
      } else {
        frontmatterObj[key] = value;
      }
    }
  }

  i++;
}

console.log('\nParsed frontmatter object:');
console.log(JSON.stringify(frontmatterObj, null, 2));

// Test Zod validation

const BlogPostFrontmatterSchema = z.object({
  title: z.string(),
  excerpt: z.string(),
  publishedDate: z.string(),
  updatedDate: z.string().optional(),
  tags: z.array(z.string()).default([]),
  category: z.string().default('general'),
  series: z.string().optional(),
  seriesOrder: z.number().optional(),
  featuredImage: z.string().optional(),
  published: z.boolean().default(true),
});

try {
  const result = BlogPostFrontmatterSchema.parse(frontmatterObj);
  console.log('\n✅ Zod validation passed!');
  console.log('Validated result:', JSON.stringify(result, null, 2));
} catch (error) {
  console.log('\n❌ Zod validation failed:');
  console.log(error.message);
  console.log('Issues:', error.issues);
}
