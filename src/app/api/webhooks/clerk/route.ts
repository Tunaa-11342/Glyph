import { NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'

interface ClerkUserEvent {
  type: string
  data: {
    id: string
    email_addresses: { email_address: string; id: string }[]
    primary_email_address_id: string
    username: string | null
    first_name: string | null
    last_name: string | null
    image_url: string | null
    public_metadata: Record<string, unknown>
  }
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'No webhook secret' }, { status: 500 })
  }

  const headerPayload = headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)

  const wh = new Webhook(WEBHOOK_SECRET)
  let evt: ClerkUserEvent

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as ClerkUserEvent
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const { type, data } = evt

  if (type === 'user.updated') {
    const primaryEmail = data.email_addresses.find(
      e => e.id === data.primary_email_address_id
    )?.email_address || ''

    const displayName = [data.first_name, data.last_name].filter(Boolean).join(' ') || null

    await prisma.user.updateMany({
      where: { clerkId: data.id },
      data: {
        email: primaryEmail,
        displayName,
        avatar: data.image_url,
      },
    })
  }

  if (type === 'user.deleted') {
    await prisma.user.deleteMany({ where: { clerkId: data.id } })
  }

  return NextResponse.json({ ok: true })
}
