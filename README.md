# Gymdues Next.js (Frontend)

## Overview

**Gymdues** frontend is a Next.js application that powers the gym directory site. It fetches content from the Gymdues Winter CMS API and serves the public-facing pages (gym listings, gym details, reviews, etc.).

## Requirements

- **Node.js**: ^18.0.0
- **pnpm**

---

## Onboarding

### 1. Clone and install

This repo may live inside a parent folder (e.g. `gymdues-app`) alongside the CMS repo. Clone and install:

```bash
git clone <repository-url>
cd gymdues-nextjs
pnpm install
```

### 2. Environment

Create `.env` or `.env.local` and set the CMS API URL:

- **Production**: `NEXT_PUBLIC_API_BASE_URL=https://cms.gymdues.com`
- **Local development** (with CMS running locally): `NEXT_PUBLIC_API_BASE_URL=http://localhost:8080` (or your CMS URL)

Other optional vars: `HOSTNAME`, `PORT`.

### 3. Commands

| Command | Description |
|--------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm run build:production` | Production build (used by CI) |
| `pnpm run type-check` | Run TypeScript check |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Fix lint issues |
| `pnpm format` | Format with Prettier |

---

## Deployment

Deployment is automated via **GitHub Actions**. Only the **main** branch triggers a deploy.

### How it works

1. **Trigger**: Push to `main` (or manually run the workflow).
2. **Build**: `.github/workflows/deploy.yml` runs type-check, production build, creates a deployment tarball.
3. **Deploy**: Artifact is uploaded to the server via SSH; PM2 reloads the Next.js app (`gymdues-nextjs`).

### GitHub setup

Configure in the repo **Settings → Secrets and variables → Actions**:

| Type | Name | Description |
|------|------|-------------|
| Variables | `DEPLOY_HOST` | Server hostname or IP |
| Variables | `DEPLOY_USER` | SSH user for deploy |
| Variables | `DEPLOY_PATH` | App directory on server (e.g. `/var/www/gymdues-nextjs`) |
| Secret | `DEPLOY_SSH_KEY` | Private key for SSH deploy (contents of the key file) |

### Manual deploy

To run a deployment without pushing to `main`: **Actions → Build and Deploy Next.js → Run workflow**.

---

## Project structure

```
.
├── src/
│   ├── app/          # Next.js App Router pages and layout
│   ├── components/   # React components
│   └── ...
├── public/           # Static assets
├── .github/workflows/deploy.yml
└── package.json
```

---

## Tech stack

- **Next.js** (App Router), **React**, **TypeScript**
- **TailwindCSS**, **shadcn/ui**
- **Zustand** (state), **ESLint**, **Prettier**

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.

Developed by [websquids LLC](https://websquids.com). For questions: [info@websquids.com](mailto:info@websquids.com).
