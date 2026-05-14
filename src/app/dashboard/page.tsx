import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import DashboardOverviewClient from './overview-client'

async function getDashboardData(clerkId: string) {
  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: {
      profile: true,
      links: { where: { enabled: true } },
    },
  })

  if (!user) return null

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [totalClicks, todayViews] = await Promise.all([
    prisma.analytics.count({
      where: { userId: user.id, type: 'link_click' },
    }),
    prisma.analytics.count({
      where: { userId: user.id, type: 'pageview', createdAt: { gte: today } },
    }),
  ])

  return {
    user: {
      username: user.username,
      displayName: user.displayName,
      avatar: user.avatar,
    },
    stats: {
      totalViews: user.profile?.viewCount ?? 0,
      totalLinks: user.links.length,
      totalClicks,
      viewsToday: todayViews,
    },
    links: user.links.slice(0, 5),
  }
}

export default async function DashboardPage() {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')

  const data = await getDashboardData(userId)
  if (!data) redirect('/onboarding')

  return <DashboardOverviewClient data={data} />
}
