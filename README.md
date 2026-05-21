# Glyph

Glyph is a customizable personal profile site builder. It is built around one public page per user, a dashboard for editing the page, link management, analytics, profile effects, audio, Valorant stats, and gear cards.

The current deployment target is intentionally simple:

- **Frontend/API:** Vercel
- **Database:** Neon free tier PostgreSQL
- **Image/video storage:** Cloudflare R2
- **Auth:** Clerk free tier

## What It Does

- Clerk auth for sign in, sign up, protected dashboard routes, and webhooks.
- Public profile pages at `/u/[username]`.
- Dashboard pages for overview, links, analytics, customization, Valorant stats, and gear setup.
- Profile customization for colors, backgrounds, gradients, uploaded media, audio, effects, layout, blur, username effects, and link styling.
- Cloudflare R2 uploads for avatar, background image, and background video files.
- Link management with ordering, enable/disable state, icons, and click tracking.
- Analytics for page views, link clicks, devices, browsers, operating systems, referrers, and basic location fields.
- Valorant rank/stat refresh using HenrikDev.
- Prisma models for users, profiles, links, analytics, and gamer profiles.

## Tech Stack

- Next.js 14 App Router on Vercel
- React 18 + TypeScript
- Tailwind CSS
- Clerk free tier
- Prisma + Neon PostgreSQL
- Cloudflare R2 for image/video storage
- Framer Motion
- Radix UI
- Lucide React and React Icons

## Local Setup

```bash
npm install
cp .env.example .env
npx prisma generate
npm run db:push
npm run dev
```

Fill `.env` before running the app. Do not commit `.env`.

## Environment Variables

### Vercel / app

- `NEXT_PUBLIC_APP_URL`: public app URL, for example `https://glyph.vercel.app`.

### Neon

- `DATABASE_URL`: Neon PostgreSQL connection string.

### Clerk

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `CLERK_WEBHOOK_SECRET`

### Cloudflare R2

- `CLOUDFLARE_R2_ACCOUNT_ID`
- `CLOUDFLARE_R2_ACCESS_KEY_ID`
- `CLOUDFLARE_R2_SECRET_ACCESS_KEY`
- `CLOUDFLARE_R2_BUCKET`
- `CLOUDFLARE_R2_PUBLIC_URL`

`CLOUDFLARE_R2_PUBLIC_URL` should be the public base URL for uploaded files, without a trailing slash. It can be an R2 public `r2.dev` URL or your custom domain.

### Valorant

- `HENRIKDEV_API_KEY`: used by the current manual Valorant refresh endpoint.
- `TRACKER_API_KEY`: legacy optional value. The current manual refresh flow uses HenrikDev.

## Deploy Notes

1. Create a Neon project and put its pooled PostgreSQL URL in `DATABASE_URL`.
2. Create a Cloudflare R2 bucket and an API token with object read/write access for that bucket.
3. Set up a public R2 URL or custom domain and place it in `CLOUDFLARE_R2_PUBLIC_URL`.
4. Create a Clerk app and add the Clerk keys to Vercel.
5. Add the Clerk webhook endpoint in Clerk: `/api/webhooks/clerk`.
6. Add every variable from `.env.example` to Vercel Project Settings.
7. Run `npm run db:push` against the Neon database before using the app.

## Current Status

Glyph is actively being shaped. The dashboard, customize studio, public profile renderer, Valorant card, gear card, and landing page are the main areas getting polished right now.
