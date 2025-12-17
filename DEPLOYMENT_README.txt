================================================================================
  GymDues Next.js Application - cPanel Deployment Package
================================================================================

Package Name: gymdues-cpanel-deployment.zip
Created: $(date)
Size: ~16MB

================================================================================
  CONTENTS
================================================================================

This package contains all files necessary for cPanel deployment:

✓ .next/              - Production build output (required)
✓ src/                - Source code (required)
✓ public/             - Static assets (required)
✓ package.json        - Dependencies and scripts (required)
✓ pnpm-lock.yaml      - Dependency lock file (required)
✓ next.config.ts      - Next.js configuration (required)
✓ tsconfig.json       - TypeScript configuration (required)
✓ tailwind.config.ts  - Tailwind CSS configuration (required)
✓ postcss.config.mjs  - PostCSS configuration (required)
✓ components.json     - UI components configuration (required)
✓ .htaccess           - Apache routing rules (required)
✓ server.js           - Custom Node.js server (required)
✓ env.example         - Environment variables template (required)
✓ CPANEL_DEPLOYMENT.md - Full deployment guide
✓ QUICK_START_CPANEL.md - Quick reference guide
✓ DEPLOYMENT_CHECKLIST.md - Deployment checklist
✓ .cpanel.yml         - cPanel configuration

================================================================================
  QUICK DEPLOYMENT STEPS
================================================================================

1. EXTRACT the zip file to your cPanel public_html directory

2. CREATE Node.js Application in cPanel:
   - Go to: Software → Setup Node.js App
   - Click: Create Application
   - Set Node.js version: 18.x or higher
   - Set Mode: Production
   - Set Startup file: server.js (or leave blank for npm start)

3. SET Environment Variables:
   NODE_ENV=production
   NEXT_PUBLIC_API_BASE_URL=https://cms.dev.gymdues.com
   PORT=3000 (cPanel will set this automatically)

4. INSTALL Dependencies:
   - Click "Run NPM Install" in cPanel
   - Or via SSH: npm install --production

5. START Application:
   - Click "Start App" in cPanel

================================================================================
  IMPORTANT NOTES
================================================================================

⚠️  DO NOT upload node_modules folder - install via cPanel
⚠️  DO NOT upload .env file - create from env.example
⚠️  DO NOT upload .git folder - not needed for production
⚠️  DO NOT upload development files (.DS_Store, logs, etc.)

📝 After extraction, create .env file from env.example:
   cp env.example .env
   (Then edit .env with your actual values)

📖 For detailed instructions, see CPANEL_DEPLOYMENT.md

================================================================================
  SUPPORT
================================================================================

If you encounter issues:
1. Check CPANEL_DEPLOYMENT.md for troubleshooting
2. Verify Node.js version (need 18.x or higher)
3. Check application logs in cPanel
4. Verify environment variables are set correctly

================================================================================



