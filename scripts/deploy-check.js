#!/usr/bin/env node

/**
 * Deployment verification script
 * This script helps verify that the build is ready for deployment
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

console.log('🚀 Deployment verification started...');

// Check if dist directory exists
const distPath = path.join(projectRoot, 'dist');
if (!fs.existsSync(distPath)) {
  console.error('❌ dist directory not found. Run `npm run build` first.');
  process.exit(1);
}

// Check if index.html exists
const indexPath = path.join(distPath, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error('❌ index.html not found in dist directory.');
  process.exit(1);
}

// Check if assets directory exists
const assetsPath = path.join(distPath, 'assets');
if (!fs.existsSync(assetsPath)) {
  console.error('❌ assets directory not found in dist directory.');
  process.exit(1);
}

// Check for key JavaScript files
const jsFiles = fs.readdirSync(path.join(assetsPath, 'js'));
const hasMainBundle = jsFiles.some((file) => file.includes('index-'));
const hasBlogBundle = jsFiles.some((file) => file.includes('blog-lib-'));

if (!hasMainBundle) {
  console.error('❌ Main bundle not found.');
  process.exit(1);
}

if (!hasBlogBundle) {
  console.error('❌ Blog bundle not found.');
  process.exit(1);
}

console.log('✅ Build verification passed!');
console.log('📦 Found bundles:');
jsFiles.forEach((file) => {
  console.log(`  - ${file}`);
});

console.log('\n🎉 Ready for deployment!');
console.log('Next steps:');
console.log(
  '1. Commit your changes: git add . && git commit -m "Fix blog deployment"'
);
console.log('2. Push to main branch: git push origin main');
console.log('3. GitHub Actions will automatically deploy to GitHub Pages');
