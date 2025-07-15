# 🚀 Thomas Rohde Landing Page – Bootstrap Guide (July 2025)

This README walks you through setting up and deploying your personal landing page to **[https://thomasrohde.github.io](https://thomasrohde.github.io)** using the modern React + Vite + Tailwind + shadcn/ui stack.

## Prerequisites

- **Node.js** ≥ 20 (LTS).
  `nvm install --lts`
- **Git** and a GitHub repository named **thomasrohde.github.io**.

---

## 1 — Bootstrap in the current directory

```bash
# Initialise Vite + React + TypeScript directly into the current folder
npm create vite@latest . -- --template react-ts
```

## 2 — Install runtime & tooling

```bash
# Core libraries
npm i react@latest react-dom@latest react-router-dom@latest

# Styling & components
npm i -D tailwindcss@latest postcss autoprefixer
npm i -D shadcn-ui@latest

# Markdown pipeline
npm i -D @mdx-js/rollup remark-gfm rehype-pretty-code github-markdown-css

# Quality tools (optional)
npm i -D typescript eslint prettier prettier-plugin-tailwindcss
```

## 3 — Configure Tailwind

```bash
npx tailwindcss init -p
```

Update **tailwind.config.ts**:

```ts
import type { Config } from 'tailwindcss';
export default <Partial<Config>>{
  content: ['./index.html', './src/**/*.{ts,tsx,md,mdx}'],
  theme: { extend: {} },
  plugins: [],
};
```

## 4 — Set up shadcn/ui

```bash
npx shadcn init --template react --tailwind-config tailwind.config.ts
# Example components
npx shadcn add button
npx shadcn add card
```

## 5 — Wire MDX & React Router (**vite.config.ts**)

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';

export default defineConfig({
  plugins: [
    react(),
    mdx({
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypePrettyCode],
    }),
  ],
  base: '/', // root‑repo GitHub Pages
});
```

## 6 — Minimal file structure

```
src/
├─ main.tsx
├─ App.tsx
├─ layouts/RootLayout.tsx
├─ pages/Home.tsx
└─ pages/blog/
   ├─ index.tsx
   └─ posts/
      ├─ hello-world.mdx
      └─ second-post.mdx
```

_(See /src/pages/blog/index.tsx template for a quick post listing.)_

## 7 — GitHub Pages deploy script

```bash
npm i -D gh-pages
```

`package.json`:

```jsonc
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "npm run build && gh-pages -d dist -b main",
  },
}
```

Optionally add `.github/workflows/gh-pages.yml` for automatic deploys:

```yaml
name: Deploy to GitHub Pages
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          publish_dir: ./dist
```

## 8 — Run & Release

```bash
npm run dev       # local dev server
npm run build     # static build in dist/
npm run preview   # preview production build locally
npm run deploy    # push dist/ → GitHub Pages
```
