#!/usr/bin/env node

/**
 * Setup script for JUCE Plugin Generator Studio
 * Installs dependencies for both frontend and backend
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎛️ JUCE Plugin Generator Studio - Setup\n');

const projectRoot = __dirname;
const backendDir = path.join(projectRoot, 'backend');
const frontendDir = path.join(projectRoot, 'frontend');

function runCommand(command, cwd, label) {
  try {
    console.log(`⏳ ${label}...`);
    execSync(command, { cwd, stdio: 'inherit' });
    console.log(`✅ ${label} complete\n`);
    return true;
  } catch (error) {
    console.error(`❌ ${label} failed\n`);
    return false;
  }
}

// Install backend dependencies
const backendOk = runCommand(
  'npm install',
  backendDir,
  'Installing backend dependencies'
);

// Install frontend dependencies
const frontendOk = runCommand(
  'npm install',
  frontendDir,
  'Installing frontend dependencies'
);

if (backendOk && frontendOk) {
  console.log('✨ Setup complete!\n');
  console.log('🚀 Next steps:\n');
  console.log('Terminal 1 - Start backend:');
  console.log('  cd backend && npm run dev\n');
  console.log('Terminal 2 - Start frontend:');
  console.log('  cd frontend && npm run dev\n');
  console.log('Then open: http://localhost:3000\n');
} else {
  console.error('❌ Setup encountered errors. Please check above.');
  process.exit(1);
}
