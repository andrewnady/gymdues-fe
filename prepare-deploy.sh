#!/bin/bash

# Deployment Preparation Script for cPanel
# This script prepares the Next.js application for cPanel deployment

set -e

echo "🚀 Preparing GymDues Next.js application for cPanel deployment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run this script from the project root.${NC}"
    exit 1
fi

# Step 1: Clean previous builds
echo -e "${YELLOW}📦 Step 1: Cleaning previous builds...${NC}"
if [ -d ".next" ]; then
    rm -rf .next
    echo "✅ Removed .next directory"
fi

# Step 2: Install dependencies
echo -e "${YELLOW}📦 Step 2: Installing dependencies...${NC}"
if command -v pnpm &> /dev/null; then
    echo "Using pnpm..."
    pnpm install
else
    echo "Using npm..."
    npm install
fi

# Step 3: Set production environment and build the application
echo -e "${YELLOW}📦 Step 3: Building application in PRODUCTION mode...${NC}"
export NODE_ENV=production
export NEXT_PUBLIC_API_BASE_URL=https://cms.gymdues.com

if command -v pnpm &> /dev/null; then
    pnpm build:production || pnpm build
else
    npm run build:production || npm run build
fi

if [ ! -d ".next" ]; then
    echo -e "${RED}❌ Error: Build failed. .next directory not found.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed successfully${NC}"

# Step 4: Create/Update .env file with production values
echo -e "${YELLOW}📝 Step 4: Setting up production environment configuration...${NC}"
if [ ! -f ".env" ]; then
    if [ -f "env.example" ]; then
        cp env.example .env
        echo -e "${GREEN}✅ Created .env file from env.example${NC}"
    else
        cat > .env << EOF
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_API_BASE_URL=https://cms.gymdues.com
HOSTNAME=localhost
EOF
        echo -e "${GREEN}✅ Created .env file with production values${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  .env file already exists${NC}"
    # Update API URL if it's not set correctly
    if ! grep -q "NEXT_PUBLIC_API_BASE_URL=https://cms.gymdues.com" .env; then
        echo -e "${YELLOW}⚠️  Updating NEXT_PUBLIC_API_BASE_URL in .env to production URL${NC}"
        # Remove old API URL line if exists
        sed -i.bak '/NEXT_PUBLIC_API_BASE_URL/d' .env
        # Add production API URL
        echo "NEXT_PUBLIC_API_BASE_URL=https://cms.gymdues.com" >> .env
        rm -f .env.bak
    fi
    # Ensure NODE_ENV is set to production
    if ! grep -q "NODE_ENV=production" .env; then
        sed -i.bak '/NODE_ENV/d' .env
        echo "NODE_ENV=production" >> .env
        rm -f .env.bak
    fi
fi

# Verify production settings
echo ""
echo -e "${GREEN}📋 Production Environment Configuration:${NC}"
grep -E "NODE_ENV|NEXT_PUBLIC_API_BASE_URL" .env | while read line; do
    echo -e "   ${GREEN}✓${NC} $line"
done

# Step 5: Make server.js executable
echo -e "${YELLOW}📝 Step 5: Setting permissions...${NC}"
if [ -f "server.js" ]; then
    chmod +x server.js
    echo -e "${GREEN}✅ server.js is executable${NC}"
fi

# Step 6: Create deployment checklist
echo -e "${YELLOW}📋 Step 6: Creating deployment package info...${NC}"

# Calculate sizes
NEXT_SIZE=$(du -sh .next 2>/dev/null | cut -f1 || echo "N/A")
NODE_MODULES_SIZE=$(du -sh node_modules 2>/dev/null | cut -f1 || echo "N/A")
TOTAL_SIZE=$(du -sh . 2>/dev/null | cut -f1 || echo "N/A")

cat > DEPLOYMENT_INFO.txt << EOF
========================================
GymDues Next.js - Deployment Package
========================================

Build Date: $(date)
Build Size: $NEXT_SIZE (.next folder)
Dependencies: $NODE_MODULES_SIZE (node_modules)
Total Size: $TOTAL_SIZE

Files to Upload:
----------------
✓ .next/                    (Build output - REQUIRED)
✓ node_modules/             (Dependencies - REQUIRED)
✓ src/                      (Source code - REQUIRED)
✓ public/                   (Static assets - REQUIRED)
✓ package.json              (Dependencies config - REQUIRED)
✓ pnpm-lock.yaml            (Lock file - if using pnpm)
✓ next.config.ts            (Next.js config - REQUIRED)
✓ tsconfig.json             (TypeScript config - REQUIRED)
✓ tailwind.config.ts        (Tailwind config - REQUIRED)
✓ postcss.config.mjs        (PostCSS config - REQUIRED)
✓ .htaccess                 (Apache config - REQUIRED)
✓ server.js                 (Custom server - REQUIRED)
✓ .env                      (Environment variables - REQUIRED)

cPanel Configuration:
--------------------
1. Create Node.js App in cPanel:
   - Software → Setup Node.js App
   - Node.js version: 18.x or higher
   - Mode: Production
   - Application root: /home/username/public_html
   - Application URL: / (or your subdirectory)
   - Startup file: server.js

2. Set Environment Variables:
   - NODE_ENV=production
   - NEXT_PUBLIC_API_BASE_URL=https://cms.gymdues.com
   - HOSTNAME=localhost
   - PORT (cPanel will set this automatically)

3. Install Dependencies:
   - Click "Run NPM Install" in cPanel
   - Or via SSH: npm install --production

4. Start Application:
   - Click "Start App" in cPanel

Important Notes:
----------------
- Build was created with NODE_ENV=production
- API URL is set to: https://cms.gymdues.com
- Ensure .env file is configured with production values
- Verify API URL in NEXT_PUBLIC_API_BASE_URL matches production
- Check that all required Node.js modules are installed
- Monitor application logs in cPanel for any errors

For detailed instructions, see:
- CPANEL_DEPLOYMENT.md
- QUICK_START_CPANEL.md
- DEPLOYMENT_CHECKLIST.md

EOF

echo -e "${GREEN}✅ Created DEPLOYMENT_INFO.txt${NC}"

# Step 7: Summary
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Deployment preparation complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "📋 Next steps:"
echo "1. Review and update .env file with production values"
echo "2. Upload all files to your cPanel public_html directory"
echo "3. Create Node.js application in cPanel"
echo "4. Set environment variables in cPanel"
echo "5. Install dependencies (Run NPM Install)"
echo "6. Start the application"
echo ""
echo "📖 See DEPLOYMENT_INFO.txt for detailed information"
echo "📖 See CPANEL_DEPLOYMENT.md for step-by-step guide"
echo ""

