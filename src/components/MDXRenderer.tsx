import { useEffect, useState } from 'react';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypePrettyCode from 'rehype-pretty-code';

interface MDXRendererProps {
  content: string;
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
      className="mdx-content prose prose-lg dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-4 prose-h1:first:mt-0 prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:first:mt-0 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-h3:first:mt-0 prose-h4:text-lg prose-h4:mt-6 prose-h4:mb-3 prose-h4:first:mt-0 prose-p:mb-4 prose-p:leading-relaxed prose-ul:mb-4 prose-ul:ml-6 prose-ul:list-disc prose-ol:mb-4 prose-ol:ml-6 prose-ol:list-decimal prose-li:leading-relaxed prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:bg-muted prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none prose-pre:overflow-x-auto prose-pre:p-4 prose-pre:rounded-lg prose-pre:bg-muted prose-pre:border prose-pre:text-sm prose-pre:leading-relaxed prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:my-6 prose-blockquote:italic prose-blockquote:text-muted-foreground prose-hr:my-8 prose-hr:border-border prose-table:w-full prose-table:border-collapse prose-table:border prose-table:border-border prose-th:border prose-th:border-border prose-th:px-4 prose-th:py-2 prose-th:bg-muted prose-th:font-semibold prose-th:text-left prose-td:border prose-td:border-border prose-td:px-4 prose-td:py-2 prose-img:max-w-full prose-img:h-auto prose-img:rounded-lg prose-img:my-6 max-w-none"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
