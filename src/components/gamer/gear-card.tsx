'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface GamerProfile {
  gearEnabled: boolean
  mouse: string | null; mouseDpi: string | null; mouseSens: string | null
  keyboard: string | null; keySwitches: string | null
  monitor: string | null; monitorHz: string | null; monitorRes: string | null
  headset: string | null; mousepad: string | null
  statCardBg: string; statCardAccent: string; statCardGlow: boolean
}

interface Props {
  gp: GamerProfile; isPreview?: boolean; cardBlur?: number; animDelay?: number
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function GearImage({ type, name, size = 28, mode = 'icon' }: { type: string; name?: string; size: number; mode?: 'icon' | 'hero' }) {
  const candidates = [
    name ? `/gear-images/${type}-${slugify(name)}.png` : '',
    `/gear-images/gear-${type}.png`,
    `/gear-images/${type}.png`,
  ].filter(Boolean)
  const [index, setIndex] = useState(0)
  if (index >= candidates.length) return null
  const src = candidates[index]

  if (!src) return null

  return (
    <img
      src={src}
      alt={name || type}
      width={size}
      height={size}
      style={{
        width: mode === 'hero' ? '100%' : size,
        height: mode === 'hero' ? '100%' : size,
        objectFit: 'contain',
        display: 'block',
        filter: mode === 'hero' ? 'drop-shadow(0 18px 28px rgba(0,0,0,0.38))' : undefined,
      }}
      onError={() => {
        setIndex(index + 1)
      }}
    />
  )
}

// Admin-placed PNGs in /public/gear-images/
// Falls back to a simple category icon shape
function GearIcon({ type, name, size = 28 }: { type: string; name?: string; size: number }) {
  // SVG fallback shapes per category
  const fallback: Record<string, JSX.Element> = {
    mouse: (
      <svg width={size * 0.55} height={size * 0.7} viewBox="0 0 22 28" fill="none">
        <rect x="1" y="1" width="20" height="26" rx="10" stroke="rgba(255,255,255,0.4)" strokeWidth="1.8"/>
        <line x1="11" y1="1" x2="11" y2="13" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
        <circle cx="11" cy="16" r="2" fill="rgba(255,255,255,0.3)"/>
      </svg>
    ),
    keyboard: (
      <svg width={size * 0.8} height={size * 0.5} viewBox="0 0 32 20" fill="none">
        <rect x="1" y="1" width="30" height="18" rx="3" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
        {[5,10,15,20,25].map(x => (
          <rect key={x} x={x} y="5" width="3" height="3" rx="0.8" fill="rgba(255,255,255,0.3)"/>
        ))}
        <rect x="7" y="12" width="18" height="3" rx="0.8" fill="rgba(255,255,255,0.25)"/>
      </svg>
    ),
    monitor: (
      <svg width={size * 0.8} height={size * 0.65} viewBox="0 0 32 26" fill="none">
        <rect x="1" y="1" width="30" height="20" rx="2" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
        <line x1="16" y1="21" x2="16" y2="25" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"/>
        <line x1="10" y1="25" x2="22" y2="25" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"/>
      </svg>
    ),
    headset: (
      <svg width={size * 0.65} height={size * 0.7} viewBox="0 0 26 28" fill="none">
        <path d="M3 14C3 7.37 8.37 2 15 2S27 7.37 27 14" stroke="rgba(255,255,255,0.4)" strokeWidth="1.8" fill="none" transform="scale(0.88) translate(1,0)"/>
        <rect x="1" y="13" width="5" height="8" rx="2.5" fill="rgba(255,255,255,0.3)"/>
        <rect x="20" y="13" width="5" height="8" rx="2.5" fill="rgba(255,255,255,0.3)"/>
      </svg>
    ),
    mousepad: (
      <svg width={size * 0.8} height={size * 0.55} viewBox="0 0 32 22" fill="none">
        <rect x="1" y="1" width="30" height="20" rx="4" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" fill="rgba(255,255,255,0.05)"/>
        <rect x="4" y="4" width="8" height="6" rx="1.5" fill="rgba(255,255,255,0.12)"/>
      </svg>
    ),
  }

  return (
    <div style={{ width: size, height: size, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center', display: 'flex', opacity: 0.75 }}>
        {fallback[type] ?? null}
      </div>
      <GearImage type={type} name={name} size={size} />
    </div>
  )
}

export default function GearCard({ gp, isPreview = false, cardBlur = 16, animDelay = 0 }: Props) {
  if (!gp.gearEnabled) return null

  const accent = gp.statCardAccent || '#ff4655'
  const bg     = gp.statCardBg || 'rgba(255,255,255,0.06)'
  const fs     = isPreview ? 11 : 13
  const iconSz = isPreview ? 26 : 38

  const items = [
    gp.mouse    && { type: 'mouse',    name: gp.mouse,    detail: [gp.mouseDpi && `${gp.mouseDpi} DPI`, gp.mouseSens && `${gp.mouseSens} Sen`].filter(Boolean).join(' · ') },
    gp.keyboard && { type: 'keyboard', name: gp.keyboard, detail: gp.keySwitches || '' },
    gp.monitor  && { type: 'monitor',  name: gp.monitor,  detail: [gp.monitorRes, gp.monitorHz && `${gp.monitorHz}Hz`].filter(Boolean).join(' · ') },
    gp.headset  && { type: 'headset',  name: gp.headset,  detail: '' },
    gp.mousepad && { type: 'mousepad', name: gp.mousepad, detail: '' },
  ].filter(Boolean) as { type: string; name: string; detail: string }[]

  if (items.length === 0) return null

  const pad = isPreview ? '10px 12px' : '18px'

  return (
    <motion.div
      initial={isPreview ? undefined : { opacity: 0, y: 12 }}
      animate={isPreview ? undefined : { opacity: 1, y: 0 }}
      transition={{ delay: animDelay, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      style={{ width: '100%', marginTop: isPreview ? 6 : 8 }}
    >
      <div style={{
        background: bg,
        backdropFilter: `blur(${cardBlur}px)`,
        WebkitBackdropFilter: `blur(${cardBlur}px)`,
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14,
        overflow: 'hidden',
        minHeight: isPreview ? undefined : 378,
        boxShadow: gp.statCardGlow
          ? `0 0 18px ${accent}15, 0 4px 16px rgba(0,0,0,0.22)`
          : '0 4px 16px rgba(0,0,0,0.2)',
      }}>

        {/* Header */}
        <div style={{
          padding: isPreview ? '7px 12px' : '9px 16px',
          background: 'rgba(255,255,255,0.025)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', gap: 7,
        }}>
          {/* Setup icon */}
          <div style={{ width: isPreview ? 16 : 20, height: isPreview ? 16 : 20, position: 'relative' }}>
            <img
              src="/game-icons/gear-setup.png"
              alt="Setup"
              width={isPreview ? 16 : 20}
              height={isPreview ? 16 : 20}
              style={{ objectFit: 'contain', display: 'block' }}
              onError={e => {
                e.currentTarget.style.display = 'none'
                // Fallback: small gear shape
                const fb = e.currentTarget.nextElementSibling as HTMLElement | null
                if (fb) fb.style.display = 'block'
              }}
            />
            <svg
              style={{ display: 'none', position: 'absolute', inset: 0 }}
              width={isPreview ? 16 : 20} height={isPreview ? 16 : 20}
              viewBox="0 0 20 20" fill="none"
            >
              <circle cx="10" cy="10" r="3" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
              <path d="M10 1v2M10 17v2M1 10h2M17 10h2M3.22 3.22l1.42 1.42M15.36 15.36l1.42 1.42M3.22 16.78l1.42-1.42M15.36 4.64l1.42-1.42"
                stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{
            fontSize: isPreview ? 10 : 11,
            fontWeight: 700,
            color: 'rgba(255,255,255,0.7)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
            Setup
          </span>
        </div>

        {/* Items */}
        <div style={{ padding: pad, display: 'flex', flexDirection: 'column', gap: isPreview ? 5 : 10 }}>
          {items.map(item => (
            <div key={item.type} style={{
              display: 'flex', alignItems: 'center', gap: isPreview ? 8 : 11,
              padding: isPreview ? '5px 8px' : '12px',
              minHeight: isPreview ? undefined : 62,
              background: `linear-gradient(135deg, rgba(255,255,255,0.052), ${accent}08)`,
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 12,
            }}>
              {/* Icon */}
              <div style={{
                width: iconSz, height: iconSz, borderRadius: isPreview ? 7 : 10,
                background: 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03))',
                border: '1px solid rgba(255,255,255,0.055)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <GearIcon type={item.type} name={item.name} size={iconSz * 0.72} />
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: fs, fontWeight: 600,
                  color: 'rgba(255,255,255,0.85)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {item.name}
                </div>
                {item.detail && (
                  <div style={{
                    fontSize: isPreview ? 9 : 10,
                    color: 'rgba(255,255,255,0.32)',
                    fontFamily: 'monospace',
                    marginTop: 1,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {item.detail}
                  </div>
                )}
              </div>

              {/* Category label */}
              <div style={{
                fontSize: isPreview ? 8 : 9, fontWeight: 700,
                color: 'rgba(255,255,255,0.2)',
                textTransform: 'uppercase', letterSpacing: '0.07em',
                flexShrink: 0,
              }}>
                {item.type === 'mousepad' ? 'PAD' : item.type.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
