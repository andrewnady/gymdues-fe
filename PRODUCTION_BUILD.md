# Production Build Configuration

This document outlines the production build settings for cPanel deployment.

## Production Environment Variables

The application is configured to use the following production settings:

```
NODE_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://cms.gymdues.staging-apps.net
HOSTNAME=localhost
PORT=3000 (cPanel will set this automatically)
```

## Building for Production

### Option 1: Use the Deployment Script (Recommended)

```bash
./prepare-deploy.sh
```

This script will:
- Clean previous builds
- Install dependencies
- Build in production mode with correct API URL
- Create/update .env file with production values
- Generate deployment information

### Option 2: Manual Build

```bash
# Set production environment variables
export NODE_ENV=production
export NEXT_PUBLIC_API_BASE_URL=https://cms.gymdues.staging-apps.net

# Build
pnpm build
# or
npm run build
```

### Option 3: Using npm Script

```bash
pnpm build:production
# or
npm run build:production
```

## Verification

After building, verify the production settings:

1. Check that `.next` folder exists
2. Verify `.env` file contains:
   - `NODE_ENV=production`
   - `NEXT_PUBLIC_API_BASE_URL=https://cms.gymdues.staging-apps.net`
3. Check build output for any warnings or errors

## Important Notes

- **Always build in production mode** for cPanel deployment
- The API URL `https://cms.gymdues.staging-apps.net` is hardcoded in the build
- Environment variables starting with `NEXT_PUBLIC_` are embedded at build time
- Make sure to set the same environment variables in cPanel Node.js App settings

## cPanel Configuration

When setting up the Node.js App in cPanel, ensure these environment variables are set:

```
NODE_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://cms.gymdues.staging-apps.net
HOSTNAME=localhost
```

The `PORT` variable will be automatically set by cPanel.

