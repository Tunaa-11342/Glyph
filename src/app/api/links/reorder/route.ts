import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const reorderSchema = z.object({
  order: z.array(z.object({ id: z.string(), order: z.number() })),
})

export async function POST(req: Request) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const parsed = reorderSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })

  // Update all orders in a transaction
  await prisma.$transaction(
    parsed.data.order.map(({ id, order }) =>
      prisma.link.updateMany({
        where: { id, userId: user.id },
        data: { order },
      })
    )
  )

  return NextResponse.json({ ok: true })
}
