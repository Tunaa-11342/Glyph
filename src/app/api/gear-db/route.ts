import { NextResponse } from 'next/server'
import gearDb from '@/../../data/gear-database.json'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') // mouse | keyboard | monitor | headset | mousepad

  const db = gearDb as any
  
  if (type) {
    const key = `${type}s` // e.g. "mice", "keyboards"
    const special: Record<string,string> = { mouse: 'mice', keyboard: 'keyboards', monitor: 'monitors', headset: 'headsets', mousepad: 'mousepads' }
    const items = db[special[type] || key] || []
    return NextResponse.json({ items })
  }

  // Return all
  return NextResponse.json({
    mice: db.mice || [],
    keyboards: db.keyboards || [],
    monitors: db.monitors || [],
    headsets: db.headsets || [],
    mousepads: db.mousepads || [],
  })
}
