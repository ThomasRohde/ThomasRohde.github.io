# Project Structure

## Root Directory

```
├── src/                    # Source code
├── public/                 # Static assets
├── dist/                   # Build output (generated)
├── .kiro/                  # Kiro configuration and specs
├── node_modules/           # Dependencies (generated)
└── [config files]          # Various configuration files
```

## Source Code Organization (`src/`)

```
src/
├── components/             # React components
│   └── ui/                # shadcn/ui components
├── lib/                   # Utility functions and helpers
├── assets/                # Images, icons, and static resources
├── App.tsx                # Main application component
├── main.tsx               # Application entry point
├── index.css              # Global styles and Tailwind imports
└── vite-env.d.ts          # Vite type definitions
```

## Configuration Files

- `components.json` - shadcn/ui configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `vite.config.ts` - Vite build configuration with MDX support
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint configuration
- `.prettierrc` - Prettier formatting rules

## Component Organization

- **UI Components**: Located in `src/components/ui/` (shadcn/ui components)
- **Custom Components**: Located in `src/components/` (application-specific components)
- **Utilities**: Located in `src/lib/` (helper functions, utilities)

## Import Conventions

- Use `@/` alias for imports from `src/` directory
- Example: `import { Button } from '@/components/ui/button'`
- Example: `import { cn } from '@/lib/utils'`

## File Naming

- React components: PascalCase (e.g., `BlogCard.tsx`)
- Utility files: camelCase (e.g., `utils.ts`)
- Configuration files: kebab-case or standard names

## Content Structure (Future)

- Blog posts will be stored as `.mdx` files
- Frontmatter used for metadata (title, date, tags, etc.)
- MDX allows mixing Markdown with React components
