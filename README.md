# Glyph

Glyph is a customizable personal profile site builder. Think link-in-bio, but with a proper dashboard, public profile pages, theme controls, analytics, audio, and a couple of gamer-focused cards for Valorant stats and gear setup.

It is still a work in progress, but the core loop is already here: sign in, set up your profile, customize the page, add links, and share `/u/yourname`.

## What It Does

- Clerk auth for sign in, sign up, protected dashboard routes, and webhooks.
- Public profile pages at `/u/[username]`.
- Dashboard pages for overview, links, analytics, profile customization, Valorant stats, and gear setup.
- Profile customization for colors, backgrounds, gradients, audio, effects, layout, blur, username effects, and link styling.
- Link management with ordering, enable/disable state, icons, and click tracking.
- Analytics for page views, link clicks, devices, browsers, operating systems, referrers, and basic location fields.
- Valorant rank/stat refresh using HenrikDev.
- Gear setup cards backed by a local gear database and local image assets.
- Prisma models for users, profiles, links, analytics, and gamer profiles.

## Tech Stack

- Next.js 14 App Router
- React 18
- TypeScript
- Tailwind CSS
- Clerk
- Prisma
- PostgreSQL
- Framer Motion
- Radix UI
- Lucide React and React Icons

## Environment Variables

These are the important variables used by the app:

- `DATABASE_URL`: PostgreSQL connection string used by Prisma.
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk publishable key for the frontend.
- `CLERK_SECRET_KEY`: Clerk secret key for server-side auth.
- `CLERK_WEBHOOK_SECRET`: Used by the Clerk webhook route.
- `HENRIKDEV_API_KEY`: Used by the current Valorant refresh endpoint.
- `TRACKER_API_KEY`: There is still some legacy Tracker.gg code in the gamer API, but the current manual Valorant refresh flow uses HenrikDev.


## Current Status

Glyph is actively being shaped. The dashboard, customize studio, public profile renderer, Valorant card, and gear card are the main areas getting polished right now.

There is no big fake roadmap here. The goal is simple: keep the profile page flexible, make the dashboard easier to use, and avoid letting the UI turn into a pile of random styles.
