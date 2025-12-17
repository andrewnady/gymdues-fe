# Deployment Checklist for cPanel

Use this checklist to ensure a smooth deployment to cPanel.

## Pre-Deployment

- [ ] Build completed successfully (`pnpm build` or `npm run build`)
- [ ] All tests pass (if applicable)
- [ ] Environment variables documented in `.env.example`
- [ ] All dependencies listed in `package.json`
- [ ] No sensitive data in code (API keys, passwords, etc.)

## Files to Upload

- [ ] `.next/` folder (build output)
- [ ] `node_modules/` (or plan to install via cPanel)
- [ ] `src/` folder (source code)
- [ ] `public/` folder (static assets)
- [ ] `package.json`
- [ ] `package-lock.json` or `pnpm-lock.yaml`
- [ ] `next.config.ts`
- [ ] `tsconfig.json`
- [ ] `tailwind.config.ts`
- [ ] `postcss.config.mjs`
- [ ] `.htaccess` (for Apache routing)
- [ ] `server.js` (optional, for custom server)
- [ ] `.env` (create from `.env.example`)

## cPanel Configuration

- [ ] Node.js application created in cPanel
- [ ] Node.js version set to 18.x or higher
- [ ] Application mode set to Production
- [ ] Application root path configured correctly
- [ ] Application URL configured correctly
- [ ] Startup file set (`server.js` or `package.json` start script)
- [ ] Environment variables configured:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT` (cPanel will set this automatically)
  - [ ] `NEXT_PUBLIC_API_BASE_URL` (your API URL)
  - [ ] `HOSTNAME=localhost`

## Installation

- [ ] Dependencies installed (`npm install --production` or via cPanel)
- [ ] Application started successfully
- [ ] No errors in application logs

## Post-Deployment Verification

- [ ] Website loads correctly
- [ ] All pages accessible
- [ ] API connections working
- [ ] Static assets loading (images, CSS, JS)
- [ ] No console errors in browser
- [ ] Mobile responsiveness working
- [ ] Forms and interactions working

## Performance

- [ ] Page load times acceptable
- [ ] Images optimized
- [ ] Caching configured (if applicable)
- [ ] CDN configured (if applicable)

## Security

- [ ] HTTPS enabled
- [ ] Environment variables not exposed
- [ ] API keys secured
- [ ] `.env` file not in public directory
- [ ] `.htaccess` configured correctly

## Backup

- [ ] Backup created before deployment
- [ ] Rollback plan prepared

## Documentation

- [ ] Deployment steps documented
- [ ] Environment variables documented
- [ ] Troubleshooting guide available




