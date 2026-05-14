import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const username = searchParams.get('username')

  if (!username || username.length < 3) {
    return NextResponse.json({ available: false })
  }

  // Block reserved words
  const reserved = ['admin', 'api', 'dashboard', 'u', 'sign-in', 'sign-up', 'onboarding', 'home', 'demo', 'www', 'app']
  if (reserved.includes(username.toLowerCase())) {
    return NextResponse.json({ available: false })
  }

  const existing = await prisma.user.findUnique({
    where: { username: username.toLowerCase() },
    select: { id: true },
  })

  return NextResponse.json({ available: !existing })
}
