# Technology Stack

## Core Technologies

- **React 19** - UI framework with latest features
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing

## Styling & UI

- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components built on Radix UI
- **Radix UI** - Unstyled, accessible UI primitives
- **class-variance-authority** - Component variant management
- **clsx & tailwind-merge** - Conditional class name utilities

## Content & Documentation

- **MDX** - Markdown with JSX support for blog posts
- **remark-gfm** - GitHub Flavored Markdown support
- **rehype-pretty-code** - Syntax highlighting for code blocks

## Development Tools

- **ESLint** - Code linting with TypeScript and React rules
- **Prettier** - Code formatting
- **TypeScript ESLint** - TypeScript-specific linting rules

## Common Commands

### Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Project Structure

- Path aliases configured: `@/` maps to `./src/`
- TypeScript strict mode enabled
- ES modules used throughout

## Build Configuration

- Vite with React plugin and Tailwind CSS integration
- MDX processing with GitHub-flavored markdown
- Code syntax highlighting with `github-dark` theme
- Path resolution for clean imports using `@/` alias
