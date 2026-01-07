# GitHub Actions Deployment Setup

This guide will help you set up automated deployments to your DigitalOcean droplet using GitHub Actions.

## Prerequisites

1. A DigitalOcean droplet with SSH access
2. Node.js, pnpm, and PM2 installed on the droplet
3. GitHub repository with Actions enabled

## Step 1: Generate SSH Key on Droplet

SSH into your DigitalOcean droplet and run:

```bash
# Generate SSH key for GitHub Actions (press Enter to accept defaults, no passphrase)
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions_deploy -N ""

# Set correct permissions
chmod 600 ~/.ssh/github_actions_deploy
chmod 644 ~/.ssh/github_actions_deploy.pub

# Ensure .ssh directory has correct permissions
chmod 700 ~/.ssh

# Add public key to authorized_keys
cat ~/.ssh/github_actions_deploy.pub >> ~/.ssh/authorized_keys

# Set correct permissions for authorized_keys
chmod 600 ~/.ssh/authorized_keys

# Verify the public key was added
echo "Public key added to authorized_keys:"
tail -1 ~/.ssh/authorized_keys

# Display private key (copy the ENTIRE output including BEGIN/END lines)
echo "=== PRIVATE KEY (copy everything below) ==="
cat ~/.ssh/github_actions_deploy
echo "=== END OF PRIVATE KEY ==="
```

**Important**: When copying the private key to GitHub Secrets:
- Copy the ENTIRE key including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`
- Make sure there are no extra spaces or line breaks
- The key should be on multiple lines

## Step 2: Add GitHub Secrets

⚠️ **IMPORTANT**: All secrets must be set before the workflow can run. The workflow will fail if any secret is missing.

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add the following secrets (all are required):

### Required Secrets

1. **DEPLOY_HOST**
   - Value: Your droplet IP address or domain (e.g., `123.456.789.0` or `yourdomain.com`)
   - Description: DigitalOcean droplet hostname or IP

2. **DEPLOY_USER**
   - Value: SSH username (usually `root` or `deploy`)
   - Description: SSH user for deployment

3. **DEPLOY_SSH_KEY** (Secret)
   - Value: The COMPLETE private key from Step 1 (must include BEGIN and END lines)
   - Format should look like:
     ```
     -----BEGIN OPENSSH PRIVATE KEY-----
     b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAlwAAAAdzc2gtcn
     ... (multiple lines) ...
     -----END OPENSSH PRIVATE KEY-----
     ```
   - Description: Private SSH key for authentication
   - ⚠️ Make sure to copy the ENTIRE key, including all lines

4. **DEPLOY_PATH**
   - Value: Path to your Next.js app on the server (e.g., `/var/www/gymdues-next-js`)
   - Description: Deployment path on the droplet

## Step 3: Verify PM2 Setup

On your droplet, ensure PM2 is installed and configured:

```bash
# Install PM2 globally
npm install -g pm2

# Check if app is already running
pm2 list

# If not running, start it manually first:
cd /var/www/gymdues-next-js
pm2 start npm --name "gymdues-nextjs" -- start
pm2 save
```

## Step 4: Test the Workflow

1. Push to `dev` or `main` branch to trigger automatic deployment
2. Or manually trigger via **Actions** tab → **Build and Deploy Next.js** → **Run workflow**

## Workflow Features

- ✅ Builds on GitHub Actions (faster, more resources)
- ✅ Automatic deployments on push to `dev` or `main`
- ✅ Creates backups before deployment
- ✅ Installs only production dependencies on server
- ✅ Automatically restarts PM2 process
- ✅ Cleans up old backups (keeps last 3)

## Troubleshooting

### Deployment fails with SSH connection error (Permission denied)

**Common causes and fixes:**

1. **Public key not in authorized_keys**
   ```bash
   # On your droplet, verify the public key is there
   cat ~/.ssh/authorized_keys | grep github-actions
   
   # If missing, add it:
   cat ~/.ssh/github_actions_deploy.pub >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   ```

2. **Wrong private key format in GitHub Secrets**
   - The key must include BEGIN and END lines
   - No extra spaces or characters
   - Copy the ENTIRE output from `cat ~/.ssh/github_actions_deploy`

3. **File permissions incorrect**
   ```bash
   # On your droplet, fix permissions:
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/github_actions_deploy
   chmod 644 ~/.ssh/github_actions_deploy.pub
   chmod 600 ~/.ssh/authorized_keys
   ```

4. **Test SSH connection manually**
   ```bash
   # From your local machine, test the connection:
   ssh -i ~/.ssh/github_actions_deploy deploy@164.92.68.66
   ```

5. **Verify DEPLOY_USER has correct permissions**
   - Ensure the user can write to the deployment path
   - Check: `ls -la /var/www/gymdues-next-js`

### PM2 restart fails
- SSH into droplet and check PM2 status: `pm2 list`
- Manually start the app: `pm2 start npm --name "gymdues-nextjs" -- start`
- Check PM2 logs: `pm2 logs gymdues-nextjs`

### Build fails
- Check GitHub Actions logs for specific errors
- Verify `package.json` and `pnpm-lock.yaml` are committed
- Ensure all environment variables are set in `.env.production`

### Permission errors
- Ensure deployment user has write access to deployment path
- Check file permissions: `ls -la /var/www/gymdues-next-js`

## Manual Deployment

If you need to deploy manually:

```bash
# On your local machine
cd gymdues-next-js
pnpm install
pnpm run build:production
tar -czf deploy.tar.gz .next public package.json pnpm-lock.yaml server.js next.config.ts

# Copy to server
scp deploy.tar.gz user@your-droplet:/tmp/

# SSH and extract
ssh user@your-droplet
cd /var/www/gymdues-next-js
tar -xzf /tmp/deploy.tar.gz
pnpm install --prod
pm2 restart gymdues-nextjs
```

