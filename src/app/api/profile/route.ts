import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const ALLOWED = [
  'bgColor','bgImage','bgVideo','bgType','bgGradient',
  'accentColor','textColor','usernameColor','handleColor','bioColor',
  'linkTextColor','linkBgColor','linkIconColor',
  'fontFamily','cardOpacity','cardBlur','borderRadius',
  'audioUrl','audioName','audioVolume','audioAutoplay',
  'particlesEnabled','glowEnabled','glowColor','animationStyle',
  'layoutStyle','profileBlur','location','discordUser',
  'bgEffect','bgBlur','usernameEffect',
  'monochrome','animatedTitle','swapBoxColors','iconColor','avatarUrl',
]

export async function GET() {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = await prisma.user.findUnique({
    where: { clerkId: userId }, include: { profile: true },
  })
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({
    user: { username: user.username, displayName: user.displayName, bio: user.bio, avatar: user.avatar },
    profile: user.profile,
  })
}

export async function PUT(req: Request) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const body = await req.json()
  const data: Record<string, unknown> = {}
  for (const key of ALLOWED) {
    if (body[key] !== undefined) data[key] = body[key]
  }
  try {
    const profile = await prisma.profile.upsert({
      where: { userId: user.id },
      create: { userId: user.id, bgColor: '#0a0a0a', accentColor: '#8b5cf6', textColor: '#ffffff', ...data },
      update: data,
    })
    return NextResponse.json({ profile })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const { displayName, bio, avatar } = await req.json()
  const updated = await prisma.user.update({
    where: { id: user.id }, data: { displayName, bio, avatar },
  })
  return NextResponse.json({ user: updated })
}
