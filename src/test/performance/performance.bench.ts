import { bench, describe } from 'vitest';
import { calculateReadTime, createSlug, parseFrontmatter } from '@/lib/blog';
import { cn } from '@/lib/utils';

describe('Performance Benchmarks', () => {
  const longContent = Array(10000).fill('word').join(' ');
  const complexTitle =
    'This is a very long title with many special characters!@#$%^&*()_+-=[]{}|;:,.<>?';

  const sampleMDX = `---
title: Performance Test Post
excerpt: This is a performance test post with a longer excerpt to test parsing performance
publishedDate: 2025-01-15
updatedDate: 2025-01-20
tags: [performance, testing, benchmark, react, typescript, web-development]
category: performance
featuredImage: /images/performance-test.jpg
published: true
---

# Performance Test Content

This is a sample MDX content for performance testing. It includes multiple paragraphs,
code blocks, and various markdown elements to simulate real-world blog post content.

## Code Example

\`\`\`typescript
function performanceTest() {
  const start = performance.now();
  // Some complex operation
  const end = performance.now();
  return end - start;
}
\`\`\`

## Lists and More Content

- Item 1
- Item 2
- Item 3

More content here to make the parsing more realistic...`;

  bench('calculateReadTime with long content', () => {
    calculateReadTime(longContent);
  });

  bench('createSlug with complex title', () => {
    createSlug(complexTitle);
  });

  bench('parseFrontmatter with complex MDX', () => {
    parseFrontmatter(sampleMDX);
  });

  bench('cn utility with many classes', () => {
    const condition1 = true;
    const condition2 = false;
    cn(
      'base-class',
      'text-red-500',
      'bg-blue-100',
      'p-4',
      'm-2',
      'rounded-lg',
      'shadow-md',
      'hover:shadow-lg',
      'transition-all',
      'duration-300',
      condition1 && 'conditional-class',
      condition2 && 'hidden-class',
      ['array-class-1', 'array-class-2'],
      {
        'object-class-1': true,
        'object-class-2': false,
      }
    );
  });

  bench('Multiple slug generations', () => {
    for (let i = 0; i < 100; i++) {
      createSlug(`Test Title ${i} with Special Characters!@#$`);
    }
  });

  bench('Multiple read time calculations', () => {
    const contents = Array(50)
      .fill(0)
      .map((_, i) =>
        Array(200 + i * 10)
          .fill('word')
          .join(' ')
      );

    contents.forEach((content) => {
      calculateReadTime(content);
    });
  });
});
