#!/usr/bin/env node

/**
 * Development environment setup script
 * Configures the development environment and validates setup
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  const exists = fs.existsSync(filePath);
  log(
    `${exists ? '✅' : '❌'} ${description}: ${filePath}`,
    exists ? colors.green : colors.red
  );
  return exists;
}

function checkCommand(command, description) {
  try {
    execSync(command, { stdio: 'ignore' });
    log(`✅ ${description}`, colors.green);
    return true;
  } catch (error) {
    log(`❌ ${description}`, colors.red);
    return false;
  }
}

function main() {
  log(
    '\n🚀 Development Environment Setup Check\n',
    colors.bright + colors.cyan
  );

  // Check required files
  log('📁 Checking configuration files:', colors.yellow);
  const configFiles = [
    ['package.json', 'Package configuration'],
    ['vite.config.ts', 'Vite configuration'],
    ['vite.config.dev.ts', 'Development Vite configuration'],
    ['tsconfig.json', 'TypeScript configuration'],
    ['tailwind.config.js', 'Tailwind CSS configuration'],
    ['.eslintrc.json', 'ESLint configuration'],
    ['.prettierrc', 'Prettier configuration'],
    ['.env.development', 'Development environment variables'],
    ['.env.production', 'Production environment variables'],
  ];

  let allConfigsExist = true;
  configFiles.forEach(([file, desc]) => {
    if (!checkFile(file, desc)) {
      allConfigsExist = false;
    }
  });

  // Check Husky setup
  log('\n🪝 Checking Git hooks:', colors.yellow);
  const huskyFiles = [
    ['.husky/pre-commit', 'Pre-commit hook'],
    ['.husky/_/husky.sh', 'Husky shell script'],
  ];

  let huskySetup = true;
  huskyFiles.forEach(([file, desc]) => {
    if (!checkFile(file, desc)) {
      huskySetup = false;
    }
  });

  // Check development tools
  log('\n🛠️ Checking development tools:', colors.yellow);
  const devFiles = [
    ['src/lib/logger.ts', 'Logger utility'],
    ['src/lib/config.ts', 'Configuration utility'],
    ['src/lib/dev-tools.ts', 'Development tools'],
    ['src/lib/dev-config.ts', 'Development configuration'],
    ['src/components/ErrorBoundary.tsx', 'Error boundary component'],
    ['src/components/DevPanel.tsx', 'Development panel'],
  ];

  let devToolsSetup = true;
  devFiles.forEach(([file, desc]) => {
    if (!checkFile(file, desc)) {
      devToolsSetup = false;
    }
  });

  // Check commands
  log('\n⚡ Checking available commands:', colors.yellow);
  const commands = [
    ['node --version', 'Node.js'],
    ['npm --version', 'npm'],
    ['npx tsc --version', 'TypeScript'],
    ['npx eslint --version', 'ESLint'],
    ['npx prettier --version', 'Prettier'],
  ];

  let allCommandsWork = true;
  commands.forEach(([cmd, desc]) => {
    if (!checkCommand(cmd, desc)) {
      allCommandsWork = false;
    }
  });

  // Check npm scripts
  log('\n📜 Checking npm scripts:', colors.yellow);
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredScripts = [
      'dev',
      'build',
      'lint',
      'format',
      'type-check',
      'preview',
      'deploy',
    ];

    let allScriptsExist = true;
    requiredScripts.forEach((script) => {
      const exists = packageJson.scripts && packageJson.scripts[script];
      log(
        `${exists ? '✅' : '❌'} ${script}`,
        exists ? colors.green : colors.red
      );
      if (!exists) allScriptsExist = false;
    });

    // Summary
    log('\n📊 Setup Summary:', colors.bright + colors.magenta);
    log(
      `Configuration files: ${allConfigsExist ? '✅ Complete' : '❌ Incomplete'}`,
      allConfigsExist ? colors.green : colors.red
    );
    log(
      `Git hooks (Husky): ${huskySetup ? '✅ Complete' : '❌ Incomplete'}`,
      huskySetup ? colors.green : colors.red
    );
    log(
      `Development tools: ${devToolsSetup ? '✅ Complete' : '❌ Incomplete'}`,
      devToolsSetup ? colors.green : colors.red
    );
    log(
      `System commands: ${allCommandsWork ? '✅ Working' : '❌ Issues found'}`,
      allCommandsWork ? colors.green : colors.red
    );
    log(
      `NPM scripts: ${allScriptsExist ? '✅ Complete' : '❌ Missing scripts'}`,
      allScriptsExist ? colors.green : colors.red
    );

    const overallSuccess =
      allConfigsExist &&
      huskySetup &&
      devToolsSetup &&
      allCommandsWork &&
      allScriptsExist;

    log(
      `\n🎯 Overall Status: ${overallSuccess ? '✅ Ready for development!' : '❌ Setup needs attention'}`,
      overallSuccess ? colors.bright + colors.green : colors.bright + colors.red
    );

    if (overallSuccess) {
      log('\n🚀 Quick start commands:', colors.cyan);
      log('  npm run dev          # Start development server');
      log('  npm run dev:debug    # Start with debug mode');
      log('  npm run build        # Build for production');
      log('  npm run lint         # Run linting');
      log('  npm run type-check   # Check TypeScript');
      log('  npm run check-all    # Run all checks');
      log('\n💡 Development tips:', colors.cyan);
      log('  • Press Ctrl+Shift+D to toggle dev tools');
      log('  • Check browser console for development logs');
      log('  • Use React DevTools browser extension');
      log('  • Pre-commit hooks will run automatically');
    }
  } catch (error) {
    log(`❌ Error reading package.json: ${error.message}`, colors.red);
  }
}

// Run main function
main();
