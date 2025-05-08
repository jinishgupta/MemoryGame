#!/bin/bash

# Clean the dist directory
rm -rf dist

# Build the project
npm run build

# Ensure dist directory exists
mkdir -p dist

# Copy GitHub Pages specific files
cp public/.nojekyll dist/
cp public/404.html dist/

# Copy any static assets directly to dist
# cp -r public/* dist/ 2>/dev/null || :

echo "Build completed. Deploying to GitHub Pages..."

# Deploy to GitHub Pages
npx gh-pages -d dist

echo "Deployment complete! Your site should be available at https://jinishgupta.github.io/MemoryGame/" 