# Design Document

## Overview

This design document outlines the architecture and implementation approach for Thomas Rohde's personal landing page. The application will be built as a modern single-page application (SPA) using React 18+ with Vite as the build tool, Tailwind CSS for styling, shadcn/ui for component library, and MDX for blog content management. The site will be deployed on GitHub Pages with automated CI/CD.

The landing page serves dual purposes: a professional portfolio showcasing Thomas Rohde's background and expertise, and a blog platform for sharing technical content and thoughts. The design emphasizes performance, accessibility, and maintainability while providing an excellent user experience across all devices.

## Architecture

### Technology Stack

- **Frontend Framework**: React 18+ with TypeScript for type safety and modern React features
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS for utility-first styling with shadcn/ui component library
- **Routing**: React Router DOM v6+ for client-side navigation
- **Content Management**: MDX with remark-gfm and rehype-pretty-code for enhanced markdown processing
- **Deployment**: GitHub Pages with GitHub Actions for automated CI/CD
- **Development Tools**: ESLint, Prettier, and TypeScript for code quality

### Application Structure

```
src/
├── main.tsx                 # Application entry point
├── App.tsx                  # Root application component
├── layouts/
│   └── RootLayout.tsx       # Main layout wrapper
├── pages/
│   ├── Home.tsx             # Landing page component
│   └── blog/
│       ├── index.tsx        # Blog listing page
│       └── posts/
│           ├── hello-world.mdx
│           └── [other-posts].mdx
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── Navigation.tsx       # Main navigation component
│   ├── Hero.tsx             # Hero section component
│   ├── About.tsx            # About section component
│   ├── Skills.tsx           # Skills section component
│   ├── Experience.tsx       # Experience section component
│   ├── Contact.tsx          # Contact section component
│   └── BlogCard.tsx         # Blog post card component
├── lib/
│   ├── utils.ts             # Utility functions
│   └── blog.ts              # Blog post utilities
└── styles/
    └── globals.css          # Global styles and Tailwind imports
```

### Routing Architecture

The application uses React Router DOM with the following route structure:

- `/` - Home page with hero, about, skills, experience, and contact sections
- `/blog` - Blog listing page showing all published posts
- `/blog/[slug]` - Individual blog post pages rendered from MDX files

## Components and Interfaces

### Core Components

#### RootLayout Component

- Provides consistent layout structure across all pages
- Includes navigation header and footer
- Manages responsive design breakpoints
- Handles theme and accessibility features

#### Navigation Component

- Responsive navigation menu with mobile hamburger menu
- Smooth scrolling to page sections
- Active state management for current page/section
- Built with shadcn/ui components for consistency

#### Home Page Components

**Hero Section**

- Professional headshot or avatar
- Name, title, and compelling tagline
- Call-to-action buttons (Contact, Resume, etc.)
- Animated elements for visual appeal

**About Section**

- Professional background and story
- Personal interests and values
- High-quality imagery
- Responsive layout with text and visual elements

**Skills Section**

- Technical skills with proficiency indicators
- Categorized skill groups (Frontend, Backend, Tools, etc.)
- Interactive elements or progress bars
- Icons for visual representation

**Experience Section**

- Professional experience timeline
- Company logos and descriptions
- Key achievements and responsibilities
- Expandable/collapsible details

**Contact Section**

- Contact form with validation
- Social media links
- Professional contact information
- Location and availability status

#### Blog Components

**BlogCard Component**

- Post preview with title, excerpt, and metadata
- Featured image support
- Read time estimation
- Tags and categories
- Responsive grid layout

**BlogPost Component**

- MDX content rendering with syntax highlighting
- Table of contents generation
- Social sharing buttons
- Navigation to previous/next posts
- Comment system integration (future enhancement)

### Data Interfaces

```typescript
interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedDate: Date;
  updatedDate?: Date;
  tags: string[];
  category: string;
  featuredImage?: string;
  readTime: number;
  published: boolean;
}

interface PersonalInfo {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  location: string;
  email: string;
  social: {
    github: string;
    linkedin: string;
    twitter?: string;
  };
}

interface Skill {
  name: string;
  category: 'frontend' | 'backend' | 'tools' | 'other';
  proficiency: number; // 1-5 scale
  icon?: string;
}

interface Experience {
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  achievements: string[];
  technologies: string[];
  logo?: string;
}
```

## Data Models

### Blog Post Management

Blog posts are authored in MDX format with frontmatter metadata:

```markdown
---
title: 'Post Title'
excerpt: 'Brief description of the post'
publishedDate: '2025-01-15'
tags: ['react', 'typescript', 'web-development']
category: 'tutorial'
featuredImage: '/images/post-featured.jpg'
published: true
---

# Post Content

MDX content with React components...
```

### Content Organization

- **Static Content**: Personal information, skills, and experience stored in TypeScript constants or JSON files
- **Blog Content**: MDX files in the `src/pages/blog/posts/` directory
- **Images**: Optimized images stored in `public/images/` with appropriate sizing
- **Assets**: Icons, logos, and other static assets in `public/assets/`

## Error Handling

### Client-Side Error Boundaries

- React Error Boundaries for graceful error handling
- Fallback UI components for different error scenarios
- Error logging and reporting for debugging

### Route Error Handling

- 404 pages for non-existent routes
- Error pages for blog posts that fail to load
- Graceful degradation for missing content

### Form Validation

- Client-side validation for contact forms
- User-friendly error messages
- Accessibility-compliant error states

## Testing Strategy

### Unit Testing

- Component testing with React Testing Library
- Utility function testing with Jest
- Blog post parsing and rendering tests
- Form validation logic tests

### Integration Testing

- Route navigation testing
- Blog post loading and rendering
- Contact form submission flow
- Responsive design testing

### End-to-End Testing

- Critical user journeys (navigation, blog reading, contact)
- Cross-browser compatibility testing
- Performance testing with Lighthouse
- Accessibility testing with axe-core

### Performance Testing

- Core Web Vitals monitoring
- Bundle size analysis
- Image optimization verification
- Loading performance across different network conditions

## SEO and Performance Optimization

### Search Engine Optimization

- Semantic HTML structure with proper heading hierarchy
- Meta tags for each page with dynamic content
- Open Graph tags for social media sharing
- Structured data markup for blog posts
- XML sitemap generation
- Robots.txt configuration

### Performance Optimization

- Code splitting with React.lazy for route-based chunks
- Image optimization with modern formats (WebP, AVIF)
- Font optimization with font-display: swap
- Critical CSS inlining for above-the-fold content
- Service worker for caching (future enhancement)

### Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance
- Focus management for SPA navigation
- Alt text for all images

## Deployment and CI/CD

### GitHub Pages Configuration

- Repository configured as `thomasrohde.github.io` for root domain
- Base path configuration for proper asset loading
- Custom domain support (optional)

### GitHub Actions Workflow

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - uses: peaceiris/actions-gh-pages@v4
        if: github.ref == 'refs/heads/main'
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Build Optimization

- Production build with Vite optimization
- Asset minification and compression
- Tree shaking for unused code elimination
- Bundle analysis and size monitoring

## Security Considerations

### Content Security Policy

- Strict CSP headers for XSS protection
- Trusted sources for external resources
- Inline script restrictions

### Form Security

- Input sanitization and validation
- CSRF protection for form submissions
- Rate limiting for contact form

### Dependency Security

- Regular dependency updates
- Security vulnerability scanning
- Minimal dependency footprint

## Future Enhancements

### Phase 2 Features

- Dark mode toggle with system preference detection
- Blog search functionality
- Comment system integration
- Newsletter subscription
- Analytics integration (privacy-focused)

### Phase 3 Features

- Progressive Web App (PWA) capabilities
- Offline reading for blog posts
- Advanced blog features (series, related posts)
- Multi-language support
- Content management system integration

## Development Workflow

### Local Development

- Hot module replacement for instant feedback
- TypeScript type checking in development
- ESLint and Prettier integration
- Pre-commit hooks for code quality

### Content Creation

- MDX authoring with live preview
- Image optimization workflow
- Content validation and linting
- Draft post management

### Deployment Process

- Feature branch development
- Pull request reviews
- Automated testing and building
- Staging environment for preview
- Production deployment with rollback capability
