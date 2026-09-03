# Vidora Frontend 🎬

**Premium YouTube media downloader & converter** — Next.js frontend (deploy to Vercel)

This is the frontend for [Vidora](https://github.com/ariX08/vidora-frontend).  
Backend lives in a separate repo: **[vidora-api](https://github.com/ariX08/vidora-api)**

## Features

- Beautiful light, colorful UI (violet / purple / fuchsia accents)
- Paste YouTube URL → choose Video (MP4) or Audio (MP3) → select quality
- Real-time progress + auto download
- Fully responsive, Framer Motion animations
- Supabase-ready (schema included) for future auth & history
- No authentication required

## Tech Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4 + Framer Motion
- Lucide React + Zod
- Supabase client (optional)

## Setup

1. Clone this repo
2. `npm install`
3. Copy `.env.example` → `.env.local` and fill:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # server only

NEXT_PUBLIC_API_URL=https://your-vidora-api.up.railway.app   # or http://localhost:4000
```

4. Run Supabase SQL from `supabase/schema.sql` in your Supabase project
5. `npm run dev`

## Deploy to Vercel

1. Import this repo in Vercel
2. Add the environment variables above
3. Set `NEXT_PUBLIC_API_URL` to your Railway backend URL
4. Deploy

## Related

- Backend API: https://github.com/ariX08/vidora-api

## Legal

For personal / educational use. Respect YouTube ToS and copyright law.
