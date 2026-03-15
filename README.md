# NullSpace Studio LLC — Project Directory

Black + green project directory site for NullSpace Studio LLC.

## Deploy to Vercel (recommended, free)

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click **"Add New Project"** → import your repo
4. Vercel auto-detects Vite — just click **Deploy**
5. Your site goes live at `your-project.vercel.app`

## Deploy to Netlify (also free)

1. Push this folder to a GitHub repo
2. Go to [netlify.com](https://netlify.com) and sign in with GitHub
3. Click **"Add new site"** → **"Import an existing project"**
4. Pick your repo, set build command to `npm run build` and publish directory to `dist`
5. Click **Deploy site**

## Run locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`

## Custom domain

Both Vercel and Netlify let you connect a custom domain (like `nullspacestudio.com`) for free. Buy one from Namecheap, Cloudflare, or Google Domains (~$10-15/year).

## Project structure

```
nullspace-site/
├── index.html          ← HTML entry point
├── package.json        ← Dependencies
├── vite.config.js      ← Vite bundler config
├── .gitignore
└── src/
    ├── main.jsx        ← React mount point
    └── App.jsx         ← The entire site (all pages, components, styles)
```

## Admin access

- Lock icon (top-right) → Passkey → Email + Password
- Default passkey: `332347213323`
- Default email: `badassinc21@gmail.com`
- Default password: `Blake101`
- Change all three from Admin → Settings tab after logging in
- Note: credential changes are session-only until you add a backend/database
