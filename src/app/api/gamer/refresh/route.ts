import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json().catch(() => ({}))
  const gp = await prisma.gamerProfile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      valorantId: typeof body.valorantId === 'string' ? body.valorantId.trim() : '',
      valorantRegion: typeof body.valorantRegion === 'string' ? body.valorantRegion : 'ap',
    },
    update: {
      ...(typeof body.valorantId === 'string' ? { valorantId: body.valorantId.trim() } : {}),
      ...(typeof body.valorantRegion === 'string' ? { valorantRegion: body.valorantRegion } : {}),
    },
  })
  if (!gp?.valorantId) return NextResponse.json({ error: 'No Valorant ID' }, { status: 400 })

  // ── Rate limit ────────────────────────────────────────────────────────────
  const apiKey = process.env.HENRIKDEV_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'HENRIKDEV_API_KEY not set in .env.local' }, { status: 500 })
  }

  const parts = gp.valorantId.split('#')
  if (parts.length < 2 || !parts[0] || !parts[1]) {
    return NextResponse.json({ error: 'Invalid format. Use Name#TAG' }, { status: 400 })
  }
  const [name, tag] = parts
  const encName = encodeURIComponent(name)
  const encTag  = encodeURIComponent(tag)
  let region = (gp as any).valorantRegion ?? 'ap'

  const H: HeadersInit = {
    'Authorization': apiKey,
    'Accept': 'application/json',
  }

  try {
    let rankTier  = 'Unranked'
    let rr: number | null = null
    let puuid: string | null = null
    let kd: string | null = null
    let winRate: string | null = null
    let hs: string | null = null

    // ── STEP 1: Account → PUUID + region auto-detect ─────────────────────
    // GET /valorant/v1/account/{name}/{tag}
    // Response: { status, data: { puuid, region, account_level, name, tag, card, ... } }
    const acctRes = await fetch(
      `https://api.henrikdev.xyz/valorant/v1/account/${encName}/${encTag}`,
      { headers: H, cache: 'no-store' }
    )
    if (acctRes.ok) {
      const acctData = await acctRes.json()
      puuid = acctData?.data?.puuid ?? null
      region = acctData?.data?.region ?? region
    } else {
      console.warn('[Henrik Account]', acctRes.status, await acctRes.text().catch(() => ''))
    }

    // ── STEP 2: MMR v3 → current rank + RR ───────────────────────────────
    // GET /valorant/v3/mmr/{region}/{platform}/{name}/{tag}
    // Header: Authorization: YOUR_API_KEY
    // Response: {
    //   status, data: {
    //     puuid, current: { tier: { id, name }, rr, last_change, elo, games_needed_for_rating },
    //     peak: { ... }, ...
    //   }
    // }
    const mmrUrl = `https://api.henrikdev.xyz/valorant/v3/mmr/${region}/pc/${encName}/${encTag}`
    const mmrRes = await fetch(mmrUrl, { headers: H, cache: 'no-store' })

    if (mmrRes.status === 401) {
      return NextResponse.json({ error: 'Invalid HENRIKDEV_API_KEY.' }, { status: 401 })
    }
    if (mmrRes.status === 404) {
      return NextResponse.json({ error: `Player "${gp.valorantId}" not found.` }, { status: 404 })
    }
    if (mmrRes.status === 403) {
      return NextResponse.json({ error: 'API key lacks permission. Check key scope.' }, { status: 403 })
    }
    if (mmrRes.status === 429) {
      return NextResponse.json({ error: 'Henrik API rate limit hit. Try again shortly.' }, { status: 429 })
    }

    if (mmrRes.ok) {
      const mmrData = await mmrRes.json()
      const current = mmrData?.data?.current
      if (current) {
        // tier.name is e.g. "Diamond 3", "Unranked", "Radiant"
        rankTier = current.tier?.name ?? 'Unranked'
        rr       = typeof current.rr === 'number' ? current.rr : null
      }
      // Grab puuid from MMR response as backup
      if (!puuid) puuid = mmrData?.data?.puuid ?? null
    } else {
      const errBody = await mmrRes.text().catch(() => '')
      console.error('[Henrik MMR]', mmrRes.status, errBody)
    }

    // ── STEP 3: Matches v3 → K/D, HS%, Win% ──────────────────────────────
    // GET /valorant/v3/matches/{region}/{name}/{tag}?mode=competitive&size=5
    // Response: { status, data: [ { metadata, players, teams, rounds } ] }
    // players.all_players[]: { puuid, name, tag, stats: { kills, deaths, assists, headshots, bodyshots, legshots }, team, ... }
    // teams: [ { team_id: "Red"|"Blue", won: true|false, rounds_won, rounds_lost } ]
    if (puuid) {
      const matchesUrl = `https://api.henrikdev.xyz/valorant/v3/matches/${region}/${encName}/${encTag}?mode=competitive&size=5`
      const matchesRes = await fetch(matchesUrl, { headers: H, cache: 'no-store' })

      if (matchesRes.ok) {
        const matchesData = await matchesRes.json()
        const matches: any[] = matchesData?.data ?? []

        if (matches.length > 0) {
          let totalKills = 0, totalDeaths = 0, totalHeadshots = 0, totalBodyshots = 0, totalLegshots = 0
          let wins = 0, matchCount = 0

          for (const match of matches) {
            // Find this player in all_players by puuid
            const allPlayers: any[] = match?.players?.all_players ?? []
            const me = allPlayers.find((p: any) => p.puuid === puuid)
            if (!me) continue

            matchCount++
            const stats = me.stats ?? {}
            totalKills      += stats.kills      ?? 0
            totalDeaths     += stats.deaths     ?? 0
            totalHeadshots  += stats.headshots  ?? 0
            totalBodyshots  += stats.bodyshots  ?? 0
            totalLegshots   += stats.legshots   ?? 0

            // Check if player's team won
            // me.team: "Red" | "Blue"
            // match.teams: [ { team_id: "Red"|"Blue", won: true|false }, ... ]
            const teams = match?.teams ?? {}
            const myTeamId = String(me.team || '').toLowerCase()
            const myTeam = teams[myTeamId]
            if (myTeam?.has_won === true || myTeam?.won === true) wins++
          }

          if (matchCount > 0) {
            if (totalDeaths > 0)
              kd = (totalKills / totalDeaths).toFixed(2)

            const totalShots = totalHeadshots + totalBodyshots + totalLegshots
            if (totalShots > 0)
              hs = `${Math.round((totalHeadshots / totalShots) * 100)}%`

            winRate = `${Math.round((wins / matchCount) * 100)}%`
          }
        }
      } else {
        console.warn('[Henrik Matches]', matchesRes.status)
      }
    }

    // ── STEP 4: Save to DB ────────────────────────────────────────────────
    const trackerUrl = `https://tracker.gg/valorant/profile/riot/${encName}%23${encTag}/overview`

    const updated = await prisma.gamerProfile.update({
      where: { userId: user.id },
      data: {
        valRank:       rankTier,
        valRankTier:   rankTier,
        valRR:         rr,
        valWinRate:    winRate,
        valKD:         kd,
        valHS:         hs,
        valTrackerUrl: trackerUrl,
        valCachedAt:   new Date(),
      },
    })

    return NextResponse.json({ gamerProfile: updated })

  } catch (err) {
    console.error('[Valorant fatal]', err)
    return NextResponse.json(
      { error: 'Failed to fetch stats. Check Riot ID and region.' },
      { status: 500 }
    )
  }
}
