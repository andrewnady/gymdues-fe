# cPanel Node.js Deployment Guide

This guide will help you deploy the GymDues Next.js application to cPanel.

## Prerequisites

- cPanel hosting with Node.js support enabled
- SSH access (recommended) or File Manager access
- Node.js version 18.x or higher (check with your hosting provider)

## Deployment Steps

### 1. Prepare Your Files

Ensure you have a production build:
```bash
npm run build
# or
pnpm build
```

### 2. Upload Files to cPanel

Upload the following files and folders to your cPanel public_html directory (or subdirectory):

**Required Files:**
- `.next/` (build output folder)
- `node_modules/` (or install via cPanel)
- `package.json`
- `package-lock.json` or `pnpm-lock.yaml`
- `next.config.ts`
- `tsconfig.json`
- `tailwind.config.ts`
- `postcss.config.mjs`
- `public/` (static assets)
- `src/` (source code)
- `.htaccess` (for Apache routing)
- `.env` (create from `.env.example`)

**Optional Files:**
- `server.js` (if cPanel requires a specific entry point)
- `README.md`

### 3. Create Node.js Application in cPanel

1. Log into cPanel
2. Navigate to **Software** → **Setup Node.js App**
3. Click **Create Application**
4. Configure the application:
   - **Node.js version**: Select 18.x or higher
   - **Application mode**: Production
   - **Application root**: `/home/username/public_html` (or your subdirectory)
   - **Application URL**: `/` (or your subdirectory path)
   - **Application startup file**: `server.js` (or leave default if using `package.json` start script)
   - **Application entry point**: `server.js` (if using custom server) or leave blank for `npm start`

### 4. Set Environment Variables

In the Node.js App setup:
1. Click **Edit** on your application
2. Scroll to **Environment Variables**
3. Add the following variables:
   ```
   NODE_ENV=production
   PORT=3000
   NEXT_PUBLIC_API_BASE_URL=https://cms.dev.gymdues.com
   HOSTNAME=localhost
   ```

### 5. Install Dependencies

**Option A: Via cPanel Node.js App Interface**
1. In the Node.js App setup, click **Run NPM Install**
2. Wait for dependencies to install

**Option B: Via SSH**
```bash
cd /home/username/public_html
npm install --production
# or
pnpm install --production
```

### 6. Start the Application

1. In cPanel Node.js App setup, click **Run NPM Start** or click **Start App**
2. The application should now be running on the configured port

### 7. Configure Apache (if needed)

If you're using Apache with `.htaccess`, ensure:
- `mod_rewrite` is enabled
- `mod_proxy` is enabled (for proxying to Node.js)
- Your `.htaccess` file is in the root directory

### 8. Verify Deployment

1. Visit your domain in a browser
2. Check the application loads correctly
3. Verify API connections are working
4. Check browser console for any errors

## Troubleshooting

### Application Won't Start

1. **Check Node.js version**: Ensure you're using Node.js 18.x or higher
2. **Check logs**: View application logs in cPanel Node.js App interface
3. **Check port**: Ensure the port isn't already in use
4. **Check environment variables**: Verify all required env vars are set

### 404 Errors

1. **Check `.htaccess`**: Ensure rewrite rules are correct
2. **Check routing**: Verify Next.js routing is working
3. **Check build**: Ensure `.next` folder exists and is complete

### API Connection Issues

1. **Check API URL**: Verify `NEXT_PUBLIC_API_BASE_URL` is correct
2. **Check CORS**: Ensure your API allows requests from your domain
3. **Check SSL**: If using HTTPS, ensure API URL uses HTTPS

### Build Errors

1. **Check Node.js version**: Use Node.js 18.x or higher
2. **Clear cache**: Delete `.next` folder and rebuild
3. **Check dependencies**: Ensure all packages are installed

## File Structure for cPanel

```
public_html/
├── .next/              # Build output (generated)
├── node_modules/       # Dependencies
├── public/             # Static files
├── src/                # Source code
├── .env                # Environment variables
├── .htaccess           # Apache configuration
├── server.js           # Custom server (optional)
├── package.json        # Dependencies and scripts
├── next.config.ts      # Next.js configuration
├── tsconfig.json       # TypeScript configuration
└── tailwind.config.ts  # Tailwind configuration
```

## Important Notes

- **Port Configuration**: cPanel will automatically assign a port. Make sure your `.htaccess` or proxy configuration uses the correct port.
- **Environment Variables**: Variables starting with `NEXT_PUBLIC_` are exposed to the browser. Keep sensitive data in server-side only variables.
- **Build Size**: The `.next` folder can be large. Ensure you have enough disk space.
- **Performance**: Consider enabling caching and CDN for static assets.

## Support

If you encounter issues:
1. Check cPanel error logs
2. Check Node.js application logs
3. Verify all configuration files are correct
4. Contact your hosting provider for cPanel-specific issues

