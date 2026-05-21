import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { randomUUID } from 'crypto'

const MAX_FILE_SIZE = 25 * 1024 * 1024

function getR2Client() {
  const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error('Cloudflare R2 env vars are missing')
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  })
}

function publicUrlFor(key: string) {
  const baseUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL
  if (!baseUrl) throw new Error('CLOUDFLARE_R2_PUBLIC_URL is missing')
  return `${baseUrl.replace(/\/$/, '')}/${key}`
}

function extensionFromFile(file: File) {
  const fromName = file.name.split('.').pop()?.toLowerCase()
  if (fromName && /^[a-z0-9]{2,8}$/.test(fromName)) return fromName
  const fromType = file.type.split('/').pop()?.toLowerCase()
  return fromType && /^[a-z0-9]{2,8}$/.test(fromType) ? fromType : 'bin'
}

export async function POST(req: Request) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const bucket = process.env.CLOUDFLARE_R2_BUCKET
  if (!bucket) return NextResponse.json({ error: 'CLOUDFLARE_R2_BUCKET is missing' }, { status: 500 })

  const form = await req.formData().catch(() => null)
  const file = form?.get('file')
  const scope = String(form?.get('scope') || 'profile')

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
    return NextResponse.json({ error: 'Only image and video uploads are supported' }, { status: 400 })
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: 'File is too large' }, { status: 413 })
  }

  const safeScope = scope.replace(/[^a-z0-9-]/gi, '').toLowerCase() || 'profile'
  const key = `${safeScope}/${userId}/${randomUUID()}.${extensionFromFile(file)}`
  const body = Buffer.from(await file.arrayBuffer())

  try {
    await getR2Client().send(new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: file.type || 'application/octet-stream',
      CacheControl: 'public, max-age=31536000, immutable',
    }))

    return NextResponse.json({ url: publicUrlFor(key), key })
  } catch (err) {
    console.error('[R2 upload failed]', err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Upload failed' }, { status: 500 })
  }
}
