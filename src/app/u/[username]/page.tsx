import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProfilePageClient from './profile-client'
import type { UserProfile } from '@/types'

interface Props {
  params: { username: string }
}

async function getProfile(username: string, trackView = false): Promise<UserProfile | null> {
  const user = await prisma.user.findUnique({
    where: { username: username.toLowerCase() },
    include: {
      profile: true,
      links: {
        where: { enabled: true },
        orderBy: { order: 'asc' },
      },
    },
  })

  if (!user) return null

  if (trackView) {
    prisma.profile.update({
      where: { userId: user.id },
      data: { viewCount: { increment: 1 } },
    }).catch(() => {})

    prisma.analytics.create({
      data: {
        userId: user.id,
        type: 'pageview',
      },
    }).catch(() => {})
  }

  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    bio: user.bio,
    avatar: user.avatar,
    profile: user.profile ? {
      ...user.profile,
      bgType: user.profile.bgType as 'color' | 'image' | 'video' | 'gradient',
      animationStyle: user.profile.animationStyle as 'fade' | 'slide' | 'bounce' | 'none',
      layoutStyle: user.profile.layoutStyle as 'centered' | 'left' | 'right',
    } : null,
    links: user.links.map(l => ({
      id: l.id,
      title: l.title,
      url: l.url,
      icon: l.icon,
      color: l.color,
      bgColor: l.bgColor,
      order: l.order,
      enabled: l.enabled,
      clickCount: l.clickCount,
    })),
  }
}

export async function generateMetadata({ params }: Props) {
  const profile = await getProfile(params.username)
  if (!profile) return { title: 'Not Found' }

  return {
    title: `${profile.displayName || profile.username} | Glyph`,
    description: profile.bio || `Check out ${profile.username}'s profile on Glyph`,
    openGraph: {
      title: profile.displayName || profile.username,
      description: profile.bio || '',
      images: profile.avatar ? [profile.avatar] : [],
    },
  }
}

export default async function UserProfilePage({ params }: Props) {
  const profile = await getProfile(params.username, true)
  if (!profile) notFound()

  return <ProfilePageClient profile={profile} />
}
