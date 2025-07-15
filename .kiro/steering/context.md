---
inclusion: always
---

# Development Context & Guidelines

## Code Style & Conventions

- Use TypeScript strict mode throughout the project
- Prefer functional components with hooks over class components
- Use descriptive variable and function names
- Implement proper error boundaries for React components
- Follow React 19 best practices including concurrent features

## Architecture Patterns

- Component composition over inheritance
- Custom hooks for reusable logic
- Separation of concerns: UI components, business logic, and data fetching
- Use React Router DOM for client-side navigation
- Implement proper loading and error states

## File Organization Rules

- Group related components in feature-based folders when appropriate
- Keep components small and focused on single responsibility
- Extract complex logic into custom hooks or utility functions
- Use barrel exports (index.ts) for cleaner imports

## Styling Guidelines

- Use Tailwind CSS utility classes for styling
- Leverage shadcn/ui components for consistent design system
- Implement responsive design with mobile-first approach
- Use CSS custom properties for theme variables when needed

## Content Management

- Blog posts written in MDX format with frontmatter metadata
- Include proper meta tags for SEO optimization
- Ensure accessibility compliance (WCAG guidelines)
- Optimize images and assets for web performance

## Development Workflow

- Run `npm run lint` before committing changes
- Use Prettier for consistent code formatting
- Test components in isolation when possible
- Ensure TypeScript compilation passes without errors

## Documentation & Research

- Always use Context7 MCP tool to lookup the newest documentation for libraries and frameworks
- Reference official documentation for React 19, TypeScript, and Tailwind CSS features
- Stay updated with latest best practices and security recommendations
