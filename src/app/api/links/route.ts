import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const linkSchema = z.object({
  title: z.string().min(1).max(100),
  url: z.string().url(),
  icon: z.string().max(30).default('link'),
  color: z.string().optional(),
  bgColor: z.string().optional(),
})

export async function GET() {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) return NextResponse.json({ links: [] })

  const links = await prisma.link.findMany({
    where: { userId: user.id },
    orderBy: { order: 'asc' },
  })

  return NextResponse.json({ links })
}

export async function POST(req: Request) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const body = await req.json()
  const parsed = linkSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })

  // Get max order
  const maxOrderLink = await prisma.link.findFirst({
    where: { userId: user.id },
    orderBy: { order: 'desc' },
  })

  const link = await prisma.link.create({
    data: {
      ...parsed.data,
      userId: user.id,
      order: (maxOrderLink?.order ?? -1) + 1,
    },
  })

  return NextResponse.json({ link }, { status: 201 })
}
