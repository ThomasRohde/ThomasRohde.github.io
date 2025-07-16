#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to extract imports from a TypeScript/JavaScript file
function extractImports(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const imports = [];

    // Match import statements
    const importRegex =
      /import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)(?:\s*,\s*(?:\{[^}]*\}|\*\s+as\s+\w+|\w+))*\s+from\s+)?['"]([^'"]+)['"]/g;

    let match;
    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];

      // Only track local imports (starting with ./ or @/)
      if (
        importPath.startsWith('./') ||
        importPath.startsWith('../') ||
        importPath.startsWith('@/')
      ) {
        imports.push(importPath);
      }
    }

    return imports;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return [];
  }
}

// Function to resolve import path to actual file path
function resolveImportPath(importPath, currentDir) {
  if (importPath.startsWith('@/')) {
    // Handle path alias @/ -> src/
    return path.resolve('src', importPath.substring(2));
  } else if (importPath.startsWith('./') || importPath.startsWith('../')) {
    // Handle relative imports
    return path.resolve(currentDir, importPath);
  }
  return null;
}

// Function to find all TypeScript/JavaScript files
function findSourceFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (
      entry.isDirectory() &&
      !entry.name.startsWith('.') &&
      entry.name !== 'node_modules'
    ) {
      findSourceFiles(fullPath, files);
    } else if (entry.isFile() && /\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

// Function to build dependency graph
function buildDependencyGraph() {
  const files = findSourceFiles('src');
  const graph = new Map();

  for (const file of files) {
    const imports = extractImports(file);
    const resolvedImports = [];

    for (const importPath of imports) {
      const resolved = resolveImportPath(importPath, path.dirname(file));
      if (resolved) {
        // Try different extensions
        const extensions = ['', '.ts', '.tsx', '.js', '.jsx'];
        let actualPath = null;

        for (const ext of extensions) {
          const testPath = resolved + ext;
          if (fs.existsSync(testPath)) {
            actualPath = testPath;
            break;
          }
        }

        // Also check for index files
        if (!actualPath) {
          for (const ext of [
            '/index.ts',
            '/index.tsx',
            '/index.js',
            '/index.jsx',
          ]) {
            const testPath = resolved + ext;
            if (fs.existsSync(testPath)) {
              actualPath = testPath;
              break;
            }
          }
        }

        if (actualPath) {
          resolvedImports.push(path.normalize(actualPath));
        }
      }
    }

    graph.set(path.normalize(file), resolvedImports);
  }

  return graph;
}

// Function to detect circular dependencies using DFS
function detectCircularDependencies(graph) {
  const visited = new Set();
  const recursionStack = new Set();
  const cycles = [];

  function dfs(node, path = []) {
    if (recursionStack.has(node)) {
      // Found a cycle
      const cycleStart = path.indexOf(node);
      const cycle = path.slice(cycleStart).concat([node]);
      cycles.push(cycle);
      return;
    }

    if (visited.has(node)) {
      return;
    }

    visited.add(node);
    recursionStack.add(node);
    path.push(node);

    const dependencies = graph.get(node) || [];
    for (const dep of dependencies) {
      if (graph.has(dep)) {
        dfs(dep, [...path]);
      }
    }

    recursionStack.delete(node);
  }

  for (const node of graph.keys()) {
    if (!visited.has(node)) {
      dfs(node);
    }
  }

  return cycles;
}

// Main analysis function
function analyzeDependencies() {
  console.log('🔍 Analyzing dependencies for circular imports...\n');

  const graph = buildDependencyGraph();
  const cycles = detectCircularDependencies(graph);

  if (cycles.length === 0) {
    console.log('✅ No circular dependencies found!');
    return;
  }

  console.log(`❌ Found ${cycles.length} circular dependency cycle(s):\n`);

  cycles.forEach((cycle, index) => {
    console.log(`Cycle ${index + 1}:`);
    cycle.forEach((file, i) => {
      const relativePath = path.relative(process.cwd(), file);
      if (i === cycle.length - 1) {
        console.log(`  └─ ${relativePath} (back to start)`);
      } else {
        console.log(`  ${i === 0 ? '┌─' : '├─'} ${relativePath}`);
      }
    });
    console.log();
  });

  // Analyze blog-related modules specifically
  console.log('📝 Blog-related module analysis:');
  const blogFiles = Array.from(graph.keys()).filter(
    (file) => file.includes('blog') || file.includes('Blog')
  );

  console.log('\nBlog-related files and their dependencies:');
  blogFiles.forEach((file) => {
    const relativePath = path.relative(process.cwd(), file);
    const deps = graph.get(file) || [];
    const blogDeps = deps.filter(
      (dep) => dep.includes('blog') || dep.includes('Blog')
    );

    console.log(`\n${relativePath}:`);
    if (blogDeps.length > 0) {
      blogDeps.forEach((dep) => {
        const relativeDepPath = path.relative(process.cwd(), dep);
        console.log(`  → ${relativeDepPath}`);
      });
    } else {
      console.log('  (no blog-related dependencies)');
    }
  });
}

// Run the analysis
analyzeDependencies();
