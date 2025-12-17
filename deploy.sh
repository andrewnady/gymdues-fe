#!/bin/bash

# Deployment script for cPanel
# This script prepares the application for deployment

echo "🚀 Preparing GymDues Next.js application for cPanel deployment..."

# Check if build exists
if [ ! -d ".next" ]; then
    echo "📦 Building application..."
    npm run build || pnpm build
else
    echo "✅ Build already exists"
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please update .env with your actual values"
fi

# Make server.js executable
chmod +x server.js

echo "✅ Deployment preparation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Upload all files to your cPanel public_html directory"
echo "2. Create Node.js application in cPanel"
echo "3. Set environment variables in cPanel"
echo "4. Install dependencies (npm install --production)"
echo "5. Start the application"
echo ""
echo "📖 See CPANEL_DEPLOYMENT.md for detailed instructions"



