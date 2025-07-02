#!/bin/bash

echo "🚀 Building AI Code Reviewer for Vercel..."

# Build frontend
echo "📦 Building frontend..."
cd frontend
npm install
npm run build

# Ensure backend static directory exists
echo "📋 Preparing backend static directory..."
cd ../backend/src
mkdir -p static

# Copy built files to backend static directory
echo "📋 Copying built files to backend..."
cp -r ../../frontend/dist/* static/

# Install Python dependencies
echo "🐍 Installing Python dependencies..."
cd ..
pip install -r requirements.txt

echo "✅ Build complete!" 