import { useEffect, useState } from 'react';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypePrettyCode from 'rehype-pretty-code';
import { createSlug } from '@/lib/blog';

interface MDXRendererProps {
  content: string;
}

interface HastNode {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
  value?: string;
}

// Custom rehype plugin to add IDs to headings
function rehypeAddHeadingIds() {
  return (tree: HastNode) => {
    const visit = (node: HastNode) => {
      if (
        node.type === 'element' &&
        node.tagName &&
        /^h[1-6]$/.test(node.tagName)
      ) {
        const textContent = extractTextContent(node);
        if (textContent) {
          node.properties = node.properties || {};
          node.properties.id = createSlug(textContent);
        }
      }

      if (node.children) {
        node.children.forEach(visit);
      }
    };

    visit(tree);
  };
}

// Helper function to extract text content from a node
function extractTextContent(node: HastNode): string {
  if (node.type === 'text' && node.value) {
    return node.value;
  }

  if (node.children) {
    return node.children.map(extractTextContent).join('');
  }

  return '';
}

export function MDXRenderer({ content }: MDXRendererProps) {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function processContent() {
      try {
        setLoading(true);
        setError(null);

        const processor = unified()
          .use(remarkParse)
          .use(remarkGfm)
          .use(remarkRehype, { allowDangerousHtml: true })
          .use(rehypeAddHeadingIds)
          .use(rehypePrettyCode, {
            theme: 'github-dark',
            keepBackground: false,
          })
          .use(rehypeStringify, { allowDangerousHtml: true });

        const result = await processor.process(content);
        setHtmlContent(String(result));
      } catch (err) {
        console.error('Error processing MDX content:', err);
        setError('Failed to render content');
      } finally {
        setLoading(false);
      }
    }

    processContent();
  }, [content]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading content...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-destructive bg-destructive/10 rounded-lg border p-4">
        <p className="text-destructive font-medium">Error rendering content</p>
        <p className="text-muted-foreground mt-1 text-sm">
          There was an error processing this blog post content.
        </p>
      </div>
    );
  }

  return (
    <div
      className="mdx-content prose prose-lg dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-hr:my-8 prose-hr:border-border prose-table:w-full prose-table:border-collapse prose-table:border prose-table:border-border prose-th:border prose-th:border-border prose-th:px-4 prose-th:py-2 prose-th:bg-muted prose-th:font-semibold prose-th:text-left prose-td:border prose-td:border-border prose-td:px-4 prose-td:py-2 prose-img:max-w-full prose-img:h-auto prose-img:rounded-lg prose-img:my-6 max-w-none"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
