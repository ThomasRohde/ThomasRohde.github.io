# Deployment Guide

This project is configured for deployment to GitHub Pages with both automated and manual deployment options.

## Automated Deployment (Recommended)

The project includes a GitHub Actions workflow that automatically deploys to GitHub Pages when code is pushed to the `main` branch.

### Setup Requirements:

1. Repository must be named `thomasrohde.github.io` for root domain deployment
2. GitHub Pages must be enabled in repository settings
3. GitHub Pages source should be set to "GitHub Actions"

### Workflow Features:

- Triggers on push to `main` branch
- Runs linting and builds the project
- Deploys to GitHub Pages using official GitHub Actions
- Includes proper permissions and concurrency controls

## Manual Deployment

For manual deployment, use the following commands:

```bash
# Build and deploy in one command
npm run deploy

# Or run steps separately
npm run build
npx gh-pages -d dist
```

## Build Configuration

- **Base Path**: Configured for root repository (`/`)
- **Build Output**: `dist/` directory
- **Assets**: All assets are properly hashed and optimized
- **Jekyll**: Disabled with `.nojekyll` file

## Verification

After deployment, the site will be available at:

- **Production**: https://thomasrohde.github.io
- **Local Preview**: `npm run preview` (after building)

## Troubleshooting

1. **404 Errors**: Ensure `.nojekyll` file exists in the build output
2. **Asset Loading Issues**: Verify base path is set to `/` in `vite.config.ts`
3. **Build Failures**: Check that all dependencies are installed and TypeScript compiles without errors
4. **GitHub Actions Failures**: Verify repository has proper GitHub Pages permissions enabled

## Scripts

- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run predeploy` - Pre-deployment build (runs automatically)
- `npm run deploy` - Deploy to GitHub Pages manually
