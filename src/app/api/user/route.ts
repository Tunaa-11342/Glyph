import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createSchema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-z0-9_-]+$/),
  displayName: z.string().max(50).optional(),
})

export async function POST(req: Request) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })

  const { username, displayName } = parsed.data

  try {
    // Check username taken
    const existing = await prisma.user.findUnique({ where: { username } })
    if (existing) return NextResponse.json({ error: 'Username taken' }, { status: 409 })

    // Create user + profile
    const user = await prisma.user.create({
      data: {
        clerkId: userId,
        username,
        email: '',
        displayName,
        profile: {
          create: {
            bgColor: '#0a0a0a',
            accentColor: '#8b5cf6',
            textColor: '#ffffff',
          },
        },
      },
    })

    return NextResponse.json({ user })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}

export async function GET() {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true, username: true, displayName: true, email: true },
  })

  return NextResponse.json({ user })
}
