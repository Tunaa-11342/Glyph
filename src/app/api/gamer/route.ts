import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/* ─── GET own gamer profile ────────────────────────────────────────────── */
export async function GET() {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const gp = await prisma.gamerProfile.findUnique({ where: { userId: user.id } })
  return NextResponse.json({ gamerProfile: gp })
}

/* ─── PUT save gamer settings ──────────────────────────────────────────── */
export async function PUT(req: Request) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const allowed = [
    'valorantId', 'valorantRegion', 'valorantEnabled',
    'statCardBg', 'statCardAccent', 'statCardGlow',
    'gearEnabled',
    'mouse', 'mouseDpi', 'mouseSens',
    'keyboard', 'keySwitches',
    'monitor', 'monitorHz', 'monitorRes',
    'headset', 'mousepad',
  ]
  const data: Record<string, unknown> = {}
  for (const k of allowed) {
    if (body[k] !== undefined) data[k] = body[k]
  }

  const gp = await prisma.gamerProfile.upsert({
    where: { userId: user.id },
    create: { userId: user.id, ...data },
    update: data,
  })

  // If valorantId changed, trigger a refresh
  if (body.valorantId && body.valorantId !== gp.valorantId) {
    fetchAndCacheValorant(user.id, body.valorantId).catch(() => {})
  }

  return NextResponse.json({ gamerProfile: gp })
}

/* ─── Internal: fetch Valorant stats from Tracker.gg and cache ─────────── */
async function fetchAndCacheValorant(userId: string, riotId: string) {
  const apiKey = process.env.TRACKER_API_KEY
  if (!apiKey) return

  // riotId format: "name#tag"  →  encode for URL
  const encoded = encodeURIComponent(riotId)
  const url = `https://public-api.tracker.gg/v2/valorant/standard/profile/riot/${encoded}`

  const res = await fetch(url, {
    headers: {
      'TRN-Api-Key': apiKey,
      'Accept': 'application/json',
      'Accept-Encoding': 'gzip',
    },
    next: { revalidate: 0 },
  })

  if (!res.ok) {
    console.error('Tracker API error', res.status, await res.text())
    return
  }

  const json = await res.json()
  const segments: any[] = json?.data?.segments ?? []

  // Overview segment
  const overview = segments.find((s: any) => s.type === 'overview')
  const stats = overview?.stats ?? {}

  // Current rank from "rank" segment
  const ranked = segments.find((s: any) => s.type === 'playlist' && s.metadata?.name === 'Competitive')
  const rankMeta = ranked?.stats?.rank?.metadata ?? {}
  const rankTier = ranked?.stats?.rank?.displayValue ?? stats?.rank?.displayValue ?? 'Unranked'
  const rr = ranked?.stats?.rankScore?.value ?? null
  const winRate = stats?.matchesWinPct?.displayValue ?? null
  const kd = stats?.kDRatio?.displayValue ?? null
  const hs = stats?.headshotsPercentage?.displayValue ?? null

  await prisma.gamerProfile.updateMany({
    where: { userId },
    data: {
      valRank: rankTier,
      valRankTier: rankMeta.tierName ?? rankTier,
      valRR: rr ? Math.round(rr) : null,
      valWinRate: winRate,
      valKD: kd,
      valHS: hs,
      valTrackerUrl: `https://tracker.gg/valorant/profile/riot/${encoded}/overview`,
      valCachedAt: new Date(),
    },
  })
}
