#!/bin/bash

echo "🚀 Building AI Code Reviewer for Vercel..."

# Build frontend
echo "📦 Building frontend..."
cd frontend
npm install
npm run build

# Copy built files to backend static directory
echo "📋 Copying built files to backend..."
cp -r dist/* ../backend/src/static/

# Install Python dependencies
echo "🐍 Installing Python dependencies..."
cd ../backend
pip install -r requirements.txt

echo "✅ Build complete!" 