# Personal Landing Page & Blog

A modern, high-performance personal website built with React 19, TypeScript, and Vite. Features a professional landing page with an integrated MDX-powered blog system, optimized for performance, accessibility, and SEO.

## 🚀 Features

### Core Functionality

- **Professional Landing Page**: Hero section, about, skills, experience, and contact
- **MDX Blog System**: Write blog posts in Markdown with React components
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **SEO Optimized**: Meta tags, structured data, and sitemap generation

### Performance & Optimization

- **Core Web Vitals Monitoring**: Real-time performance tracking
- **Bundle Optimization**: Code splitting and tree shaking
- **Lazy Loading**: Route-based code splitting with React Suspense
- **Error Handling**: Comprehensive error boundaries and 404 page

### Accessibility & UX

- **WCAG 2.1 AA Compliant**: Full accessibility compliance
- **Keyboard Navigation**: Complete keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Loading States**: Skeleton screens and smooth transitions

### Developer Experience

- **TypeScript**: Full type safety throughout the application
- **Modern Tooling**: Vite, ESLint, Prettier, Husky
- **Comprehensive Testing**: Unit, integration, accessibility, and performance tests

## 🛠️ Tech Stack

- **React 19** - UI framework with latest concurrent features
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **MDX** - Markdown with JSX support for blog posts

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone and install**

   ```bash
   git clone <repository-url>
   cd personal-landing-page
   npm install
   ```

2. **Start development server**

   ```bash
   npm run dev
   ```

3. **Open in browser**
   Navigate to `http://localhost:3000`

### Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run type-check   # TypeScript type checking

# Testing
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:coverage # Run tests with coverage

# Deployment
npm run deploy       # Deploy to GitHub Pages
```

## ✍️ Blog Management

### Creating Blog Posts

1. **Create a new MDX file** in `src/content/blog/`:

   ```bash
   touch src/content/blog/my-new-post.mdx
   ```

2. **Add frontmatter** at the top of your MDX file:

   ```mdx
   ---
   title: 'My Awesome Blog Post'
   excerpt: 'A brief description of your post'
   publishedDate: '2025-01-15'
   tags: ['react', 'typescript', 'web-development']
   category: 'tutorial'
   published: true
   readTime: 5
   ---

   # Your Blog Content Here

   Write your content using Markdown syntax with the power of JSX components.
   ```

### Blog Post Properties

| Property        | Type     | Required | Description                    |
| --------------- | -------- | -------- | ------------------------------ |
| `title`         | string   | ✅       | Post title                     |
| `excerpt`       | string   | ✅       | Brief description for previews |
| `publishedDate` | string   | ✅       | Publication date (YYYY-MM-DD)  |
| `tags`          | string[] | ✅       | Array of tags                  |
| `category`      | string   | ✅       | Post category                  |
| `published`     | boolean  | ✅       | Whether post is published      |
| `readTime`      | number   | ✅       | Estimated read time in minutes |

### Managing Content

- **Draft posts**: Set `published: false` to keep posts as drafts
- **Scheduling**: Posts with future dates won't appear until that date
- **Categories**: Organize posts by category for better navigation
- **Tags**: Use tags for cross-referencing and filtering

## 🎨 Customization

### Personal Information

Update your personal information in these components:

1. **Hero Section** (`src/components/Hero.tsx`) - Name, title, profile image
2. **About Section** (`src/components/About.tsx`) - Bio and background
3. **Skills Section** (`src/components/Skills.tsx`) - Technical skills
4. **Experience Section** (`src/components/Experience.tsx`) - Work history
5. **Contact Section** (`src/components/Contact.tsx`) - Contact info and social links

### SEO Configuration

Update SEO settings in:

- `src/lib/seo.ts` - Meta tags and structured data
- `public/site.webmanifest` - PWA configuration
- `public/robots.txt` - Search engine directives

## 🧪 Testing

### Running Tests

```bash
npm run test:run     # Run all tests
npm run test:coverage # Run with coverage report
```

### Test Coverage Targets

- **Statements**: >90%
- **Branches**: >85%
- **Functions**: >90%
- **Lines**: >90%

## 🚀 Deployment

### GitHub Pages

The site is configured for automatic deployment:

1. **Automatic**: Push to `main` branch triggers deployment
2. **Manual**: Run `npm run deploy`

### Performance Targets

- **First Contentful Paint**: <1.8s
- **Largest Contentful Paint**: <2.5s
- **Cumulative Layout Shift**: <0.1
- **Time to First Byte**: <0.8s

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**:

   ```bash
   rm -rf node_modules dist
   npm install
   npm run build
   ```

2. **Type Errors**:

   ```bash
   npm run type-check
   ```

3. **Test Failures**:
   ```bash
   npm run test:run -- --reporter=verbose
   ```

## 📚 Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MDX Documentation](https://mdxjs.com/)
- [shadcn/ui Components](https://ui.shadcn.com/)

---

**Happy coding! 🎉**

For questions or support, please open an issue or start a discussion.
