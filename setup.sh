#!/bin/bash

# JUCE Plugin Generator Studio - Quick Start Script
# Run this to set up and start the application

set -e

echo "🎛️  JUCE Plugin Generator Studio - Quick Start"
echo "=============================================="
echo ""

# Check for Node.js
echo "Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+"
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node --version) found"

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm $(npm --version) found"

# Get project root
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

echo ""
echo "📦 Installing dependencies..."

# Install backend
echo "  Backend..."
cd backend
npm install > /dev/null 2>&1
cd ..

# Install frontend
echo "  Frontend..."
cd frontend
npm install > /dev/null 2>&1
cd ..

echo "✅ Dependencies installed"

echo ""
echo "=============================================="
echo "✨ Setup Complete!"
echo "=============================================="
echo ""
echo "🚀 To start the application:"
echo ""
echo "   Terminal 1 - Backend:"
echo "     cd backend && npm run dev"
echo ""
echo "   Terminal 2 - Frontend:"
echo "     cd frontend && npm run dev"
echo ""
echo "   Then open: http://localhost:3000"
echo ""
echo "📚 Documentation:"
echo "   Quick Start: cat QUICKSTART.md"
echo "   Full Guide: cat README.md"
echo ""
echo "Happy plugin development! 🎵"
echo ""
