#!/bin/bash

# Patent Cliff Intelligence Platform — Setup Script
# Run: chmod +x setup.sh && ./setup.sh

echo ""
echo "🧬 Patent Cliff Intelligence Platform"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found."
    echo ""
    echo "Install it using one of these methods:"
    echo "  Option 1: brew install node"
    echo "  Option 2: Download from https://nodejs.org"
    echo ""
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
echo "✅ Node.js $(node -v) detected"

if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Node.js v18+ recommended. You have $(node -v)"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ npm install failed. Try: rm -rf node_modules && npm install"
    exit 1
fi

echo ""
echo "✅ Dependencies installed successfully!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🚀 Starting the development server..."
echo "   App will open at: http://localhost:3000"
echo ""
echo "   Press Ctrl+C to stop"
echo ""

npm run dev
