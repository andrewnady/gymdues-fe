# Quick Start Guide - cPanel Deployment

## Fast Deployment Steps

### 1. Build the Application
```bash
pnpm build
# or
npm run build
```

### 2. Upload to cPanel
Upload these folders/files to `public_html`:
- `.next/` (build output)
- `node_modules/` (or install via cPanel)
- `src/`
- `public/`
- `package.json`
- `next.config.ts`
- `tsconfig.json`
- `tailwind.config.ts`
- `postcss.config.mjs`
- `.htaccess`
- `server.js`
- `.env` (create from `env.example`)

### 3. Create Node.js App in cPanel
1. Go to **Software** → **Setup Node.js App**
2. Click **Create Application**
3. Set:
   - Node.js version: **18.x or higher**
   - Mode: **Production**
   - Root: `/home/username/public_html`
   - URL: `/`
   - Startup file: `server.js` (or leave blank for `npm start`)

### 4. Set Environment Variables
In Node.js App settings, add:
```
NODE_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://cms.dev.gymdues.com
```

### 5. Install & Start
- Click **Run NPM Install**
- Click **Start App**

## Quick Commands

```bash
# Build
pnpm build

# Start (for testing)
pnpm start

# Start with custom server
pnpm start:server
```

## Troubleshooting

**App won't start?**
- Check Node.js version (need 18+)
- Check application logs in cPanel
- Verify port isn't in use

**404 errors?**
- Check `.htaccess` file exists
- Verify routing configuration
- Check `.next` folder is uploaded

**API not working?**
- Verify `NEXT_PUBLIC_API_BASE_URL` is set correctly
- Check CORS settings on API
- Ensure API URL uses correct protocol (http/https)

## Need More Help?

See `CPANEL_DEPLOYMENT.md` for detailed instructions.

