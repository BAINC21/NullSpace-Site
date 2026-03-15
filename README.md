# NullSpace Studio LLC — Project Directory

Black + green project directory site with Supabase backend for persistent storage.

## Setup (one time)

### 1. Create a Supabase project (free)

1. Go to [supabase.com](https://supabase.com) → sign up → **New Project**
2. Pick a name (e.g. `nullspace`), set a database password, choose a region
3. Wait ~30 seconds for it to spin up

### 2. Create the database tables

1. In your Supabase dashboard → **SQL Editor** (left sidebar)
2. Click **New Query**
3. Open the `supabase-setup.sql` file from this project, copy everything, paste it in
4. Click **Run** — you should see "Success" for each statement

### 3. Connect the site to Supabase

1. In Supabase → **Settings** → **API** (left sidebar)
2. Copy your **Project URL** and **anon/public key**
3. Open `src/supabase.js` and replace the two placeholder values:

```js
const SUPABASE_URL = 'https://abcdefg.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI...'
```

### 4. Deploy to Vercel

1. Push this folder to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your repo
3. Vercel auto-detects Vite → click **Deploy**
4. Done — your site is live with persistent data

## Run locally

```bash
npm install
npm run dev
```

## What persists in Supabase

- **projects** — All your websites, apps, APIs, tools
- **media** — YouTube links, images, videos, announcements
- **messages** — Visitor messages with email addresses
- **site_settings** — Passkey, login email, password
- **analytics** — Page visitor and click counts

## Admin access

- Lock icon (top-right) → Passkey → Email + Password
- Default passkey: `332347213323`
- Change credentials from Admin → Settings tab
