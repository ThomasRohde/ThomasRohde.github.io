/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            // Heading styles with proper hierarchy
            h1: {
              fontSize: '2.25rem',
              fontWeight: '800',
              lineHeight: '2.5rem',
              marginTop: '0',
              marginBottom: '1rem',
            },
            h2: {
              fontSize: '1.875rem',
              fontWeight: '700',
              lineHeight: '2.25rem',
              marginTop: '2rem',
              marginBottom: '1rem',
            },
            h3: {
              fontSize: '1.5rem',
              fontWeight: '600',
              lineHeight: '2rem',
              marginTop: '1.5rem',
              marginBottom: '0.75rem',
            },
            h4: {
              fontSize: '1.25rem',
              fontWeight: '600',
              lineHeight: '1.75rem',
              marginTop: '1.25rem',
              marginBottom: '0.5rem',
            },
            h5: {
              fontSize: '1.125rem',
              fontWeight: '600',
              lineHeight: '1.75rem',
              marginTop: '1rem',
              marginBottom: '0.5rem',
            },
            h6: {
              fontSize: '1rem',
              fontWeight: '600',
              lineHeight: '1.5rem',
              marginTop: '1rem',
              marginBottom: '0.5rem',
            },
            // Links
            a: {
              color: 'hsl(var(--primary))',
              textDecoration: 'none',
              fontWeight: '500',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            // Code blocks
            pre: {
              backgroundColor: 'hsl(var(--muted))',
              color: 'hsl(var(--muted-foreground))',
              borderRadius: '0.5rem',
              padding: '1rem',
              overflow: 'auto',
            },
            code: {
              backgroundColor: 'hsl(var(--muted))',
              color: 'hsl(var(--foreground))',
              padding: '0.125rem 0.25rem',
              borderRadius: '0.25rem',
              fontSize: '0.875em',
              fontWeight: '400',
            },
            'pre code': {
              backgroundColor: 'transparent',
              padding: '0',
            },
            // Tables
            table: {
              width: '100%',
              borderCollapse: 'collapse',
              border: '1px solid hsl(var(--border))',
            },
            th: {
              border: '1px solid hsl(var(--border))',
              padding: '0.5rem 1rem',
              backgroundColor: 'hsl(var(--muted))',
              fontWeight: '600',
              textAlign: 'left',
            },
            td: {
              border: '1px solid hsl(var(--border))',
              padding: '0.5rem 1rem',
            },
            // Images
            img: {
              maxWidth: '100%',
              height: 'auto',
              borderRadius: '0.5rem',
              margin: '1.5rem 0',
            },
            // Horizontal rules
            hr: {
              margin: '2rem 0',
              borderColor: 'hsl(var(--border))',
            },
            // Blockquotes
            blockquote: {
              borderLeft: '4px solid hsl(var(--primary))',
              paddingLeft: '1rem',
              fontStyle: 'italic',
              color: 'hsl(var(--muted-foreground))',
            },
            // Lists
            ul: {
              paddingLeft: '1.5rem',
            },
            ol: {
              paddingLeft: '1.5rem',
            },
            li: {
              marginTop: '0.5rem',
              marginBottom: '0.5rem',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
