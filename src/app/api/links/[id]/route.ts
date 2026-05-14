import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const link = await prisma.link.findFirst({
    where: { id: params.id, userId: user.id },
  })
  if (!link) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const { title, url, icon, color, bgColor, enabled } = body

  const updated = await prisma.link.update({
    where: { id: params.id },
    data: { title, url, icon, color, bgColor, enabled },
  })

  return NextResponse.json({ link: updated })
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.link.deleteMany({
    where: { id: params.id, userId: user.id },
  })

  return NextResponse.json({ ok: true })
}
