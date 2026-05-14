import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UAParser } from 'ua-parser-js'

// POST - record analytics event (public, no auth needed)
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { type, linkId, profileId } = body

    if (!profileId || !type) return NextResponse.json({ ok: true })

    // Get user from profileId (it's the user.id)
    const user = await prisma.user.findUnique({
      where: { id: profileId },
      select: { id: true },
    })
    if (!user) return NextResponse.json({ ok: true })

    // Parse UA
    const ua = req.headers.get('user-agent') || ''
    const parser = new UAParser(ua)
    const result = parser.getResult()

    const device =
      result.device.type === 'mobile' ? 'mobile'
      : result.device.type === 'tablet' ? 'tablet'
      : 'desktop'

    await prisma.analytics.create({
      data: {
        userId: user.id,
        type,
        linkId: linkId || null,
        device,
        browser: result.browser.name || null,
        os: result.os.name || null,
        referrer: req.headers.get('referer') || null,
      },
    })

    // Increment link click count
    if (type === 'link_click' && linkId) {
      await prisma.link.updateMany({
        where: { id: linkId, userId: user.id },
        data: { clickCount: { increment: 1 } },
      })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true })
  }
}

// GET - fetch analytics for authenticated user
export async function GET(req: Request) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { searchParams } = new URL(req.url)
  const days = parseInt(searchParams.get('days') || '30')

  const since = new Date()
  since.setDate(since.getDate() - days)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [totalViews, todayViews, totalClicks, deviceRows, browserRows, links, viewsRaw] =
    await Promise.all([
      prisma.analytics.count({ where: { userId: user.id, type: 'pageview', createdAt: { gte: since } } }),
      prisma.analytics.count({ where: { userId: user.id, type: 'pageview', createdAt: { gte: today } } }),
      prisma.analytics.count({ where: { userId: user.id, type: 'link_click', createdAt: { gte: since } } }),
      prisma.analytics.groupBy({
        by: ['device'],
        where: { userId: user.id, type: 'pageview', createdAt: { gte: since }, device: { not: null } },
        _count: { device: true },
      }),
      prisma.analytics.groupBy({
        by: ['browser'],
        where: { userId: user.id, type: 'pageview', createdAt: { gte: since }, browser: { not: null } },
        _count: { browser: true },
      }),
      prisma.link.findMany({
        where: { userId: user.id },
        select: { id: true, title: true, clickCount: true },
        orderBy: { clickCount: 'desc' },
        take: 5,
      }),
      // Get views per day for chart
      prisma.$queryRaw<{ date: string; views: bigint }[]>`
        SELECT DATE("createdAt") as date, COUNT(*) as views
        FROM "Analytics"
        WHERE "userId" = ${user.id}
          AND type = 'pageview'
          AND "createdAt" >= ${since}
        GROUP BY DATE("createdAt")
        ORDER BY date ASC
      `,
    ])

  return NextResponse.json({
    totalViews,
    todayViews,
    totalClicks,
    deviceBreakdown: deviceRows.map(r => ({ device: r.device || 'unknown', count: r._count.device })),
    browserBreakdown: browserRows.map(r => ({ browser: r.browser || 'unknown', count: r._count.browser })),
    topLinks: links.map(l => ({ id: l.id, title: l.title, clicks: l.clickCount })),
    viewsOverTime: viewsRaw.map(r => ({ date: r.date, views: Number(r.views) })),
  })
}
