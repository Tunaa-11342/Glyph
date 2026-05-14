import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: Request,
  { params }: { params: { username: string } }
) {
  const user = await prisma.user.findUnique({
    where: { username: params.username.toLowerCase() },
    select: { id: true },
  })
  if (!user) return NextResponse.json({ gamerProfile: null })

  const gp = await prisma.gamerProfile.findUnique({
    where: { userId: user.id },
  })

  return NextResponse.json({ gamerProfile: gp })
}
