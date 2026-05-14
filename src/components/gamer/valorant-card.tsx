'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Crosshair, TrendingUp, Target } from 'lucide-react'

interface GamerProfile {
  valorantId: string | null
  valorantEnabled: boolean
  valRank: string | null
  valRankTier: string | null
  valRR: number | null
  valWinRate: string | null
  valKD: string | null
  valHS: string | null
  valTrackerUrl: string | null
  valCachedAt: string | null
  statCardBg: string
  statCardAccent: string
  statCardGlow: boolean
}

// Tier → gradient fallback colors (used when PNG missing)
const RANK_GRADIENT: Record<string, [string, string]> = {
  iron: ['#6b7280', '#4b5563'],
  bronze: ['#cd7f32', '#8B4513'],
  silver: ['#c0c0c0', '#9ca3af'],
  gold: ['#fbbf24', '#d97706'],
  platinum: ['#22d3ee', '#0891b2'],
  diamond: ['#a78bfa', '#7c3aed'],
  ascendant: ['#34d399', '#059669'],
  immortal: ['#f87171', '#dc2626'],
  radiant: ['#fde68a', '#fbbf24'],
  unranked: ['#374151', '#1f2937'],
}

function getTierSlug(tier: string | null): string {
  if (!tier) return 'unranked'
  const t = tier.toLowerCase().trim()

  // Radiant và unranked không có số
  if (t === 'radiant') return 'radiant'
  if (t === 'unranked') return 'unranked'

  // Match rank + số: "bronze 2" -> bronze_2, "iron3" -> iron_3
  const match = t.match(/^(iron|bronze|silver|gold|platinum|diamond|ascendant|immortal)\s*([1-3])$/i)
  if (match) {
    return `${match[1].toLowerCase()}_${match[2]}`
  }

  // Fallback: nếu không có số thì trả về rank không số (vd: "iron" -> "iron")
  for (const key of Object.keys(RANK_GRADIENT)) {
    if (t.includes(key)) return key
  }
  return 'unranked'
}

function getRankColors(slug: string): [string, string] {
  // Lấy rank chính (bỏ số) để lấy gradient
  const mainRank = slug.split('_')[0]
  return RANK_GRADIENT[mainRank] ?? RANK_GRADIENT.unranked
}

// Rank badge — tries /game-icons/valorant-{slug}.png, falls back to gradient box
function RankBadge({ tier, size = 48 }: { tier: string | null; size: number }) {
  const slug = getTierSlug(tier)  // Ví dụ: "bronze_2"
  const [c1, c2] = getRankColors(slug)
  const abbr = slug.split('_')[0].slice(0, 2).toUpperCase() // "BR" cho bronze
  const imgSrc = `/game-icons/valorant-${slug}.png`  // valorant-bronze_2.png

  return (
    <div style={{
      width: size, height: size, flexShrink: 0, position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Attempt PNG — onerror falls back to gradient */}
      <img
        src={imgSrc}
        alt={tier ?? 'Unranked'}
        width={size}
        height={size}
        style={{ objectFit: 'contain', display: 'block' }}
        onError={e => {
          const el = e.currentTarget
          el.style.display = 'none'
          const fb = el.nextElementSibling as HTMLElement | null
          if (fb) fb.style.display = 'flex'
        }}
      />
      {/* Fallback gradient badge */}
      <div style={{
        display: 'none',
        width: size, height: size,
        borderRadius: size * 0.22,
        background: `linear-gradient(135deg,${c1},${c2})`,
        alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.28, fontWeight: 800, color: '#fff',
        boxShadow: `0 4px 14px ${c1}55`,
        letterSpacing: '-0.03em',
        position: 'absolute', inset: 0,
      }}>
        {abbr}
      </div>
    </div>
  )
}

// Valorant logo mark — tries /game-icons/valorant.png, falls back to minimal mark
function ValorantLogo({ size = 20, accent }: { size: number; accent: string }) {
  return (
    <div style={{ width: size, height: size, flexShrink: 0, position: 'relative' }}>
      <img
        src="/game-icons/valorant.png"
        alt="Valorant"
        width={size}
        height={size}
        style={{ objectFit: 'contain', display: 'block' }}
        onError={e => {
          const el = e.currentTarget
          el.style.display = 'none'
          const fb = el.nextElementSibling as HTMLElement | null
          if (fb) fb.style.display = 'flex'
        }}
      />
      {/* Fallback: simple diamond mark */}
      <div style={{
        display: 'none', position: 'absolute', inset: 0,
        alignItems: 'center', justifyContent: 'center',
        background: `linear-gradient(135deg,${accent},${accent}99)`,
        borderRadius: size * 0.28,
      }}>
        <div style={{
          width: size * 0.5, height: size * 0.5,
          background: '#fff',
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
        }} />
      </div>
    </div>
  )
}

interface Props {
  gp: GamerProfile
  isPreview?: boolean
  cardBlur?: number
  animDelay?: number
}

export default function ValorantCard({ gp, isPreview = false, cardBlur = 16, animDelay = 0 }: Props) {
  if (!gp.valorantEnabled || !gp.valorantId) return null

  const accent = gp.statCardAccent || '#ff4655'
  const bg = gp.statCardBg || 'rgba(255,255,255,0.06)'
  const hasStats = !!(gp.valRankTier || gp.valRank)
  const slug = getTierSlug(gp.valRankTier)
  const [rankC1] = getRankColors(slug)
  const pad = isPreview ? '10px 12px' : '14px 16px'
  const fs = isPreview ? 11 : 13
  const stats = [
    { label: 'K/D', value: gp.valKD ?? '—', icon: Crosshair, color: '#f87171' },
    { label: 'WIN%', value: gp.valWinRate ?? '—', icon: TrendingUp, color: '#34d399' },
    { label: 'HS%', value: gp.valHS ?? '—', icon: Target, color: '#fbbf24' },
  ]

  return (
    <motion.div
      initial={isPreview ? undefined : { opacity: 0, y: 12 }}
      animate={isPreview ? undefined : { opacity: 1, y: 0 }}
      transition={{ delay: animDelay, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      style={{ width: '100%', marginTop: isPreview ? 6 : 0 }}
    >
      <div style={{
        background: bg,
        backdropFilter: `blur(${cardBlur}px)`,
        WebkitBackdropFilter: `blur(${cardBlur}px)`,
        border: `1px solid ${accent}28`,
        borderRadius: 14,
        overflow: 'hidden',
        minHeight: isPreview ? undefined : 378,
        boxShadow: gp.statCardGlow
          ? `0 0 18px ${accent}20, 0 4px 20px rgba(0,0,0,0.3)`
          : '0 4px 16px rgba(0,0,0,0.25)',
      }}>

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div style={{
          padding: isPreview ? '7px 12px' : '9px 16px',
          background: `linear-gradient(90deg,${accent}12,transparent)`,
          borderBottom: `1px solid ${accent}15`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <ValorantLogo size={isPreview ? 16 : 20} accent={accent} />
            <span style={{
              fontSize: isPreview ? 10 : 11,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.75)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              Valorant
            </span>
          </div>
          <span style={{
            fontSize: isPreview ? 9 : 10,
            color: 'rgba(255,255,255,0.25)',
            fontFamily: 'monospace',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            maxWidth: isPreview ? 90 : 140,
          }}>
            {gp.valorantId}
          </span>
        </div>

        {/* ── Body ───────────────────────────────────────────────────── */}
        <div style={{ padding: isPreview ? pad : '18px', display: 'flex', flexDirection: 'column', gap: isPreview ? 0 : 14 }}>
          {hasStats ? (
            <>
              {/* Rank row */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: isPreview ? 10 : 16,
                marginBottom: isPreview ? 9 : 0,
                padding: isPreview ? 0 : '14px',
                borderRadius: isPreview ? undefined : 13,
                background: isPreview ? undefined : `radial-gradient(circle at 24% 22%, ${rankC1}22, transparent 50%), rgba(255,255,255,0.035)`,
                border: isPreview ? undefined : '1px solid rgba(255,255,255,0.06)',
              }}>
                <RankBadge tier={gp.valRankTier} size={isPreview ? 38 : 74} />
                <div>
                  <div style={{
                    fontSize: isPreview ? 14 : 24,
                    fontWeight: 800, color: '#fff',
                    lineHeight: 1.1, letterSpacing: '-0.02em',
                  }}>
                    {gp.valRankTier || gp.valRank || 'Unranked'}
                  </div>
                  {gp.valRR !== null && (
                    <div style={{
                      fontSize: isPreview ? 11 : 15,
                      color: rankC1, fontWeight: 600, marginTop: 2,
                    }}>
                      {gp.valRR} RR
                    </div>
                  )}
                </div>
                {gp.valTrackerUrl && !isPreview && (
                  <a
                    href={gp.valTrackerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      marginLeft: 'auto',
                      display: 'flex', alignItems: 'center', gap: 4,
                      fontSize: 10, color: accent,
                      background: `${accent}12`, border: `1px solid ${accent}28`,
                      borderRadius: 8, padding: '4px 9px', textDecoration: 'none',
                      fontWeight: 600, whiteSpace: 'nowrap',
                    }}
                  >
                    <ExternalLink size={10} />
                    Tracker.gg
                  </a>
                )}
              </div>

              {/* Stats grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: isPreview ? 5 : 8 }}>
                {stats.map(({ label, value, icon: Icon, color }) => (
                  <div key={label} style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: 10,
                    padding: isPreview ? '6px 7px' : '12px 10px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                  }}>
                    <Icon size={isPreview ? 10 : 14} color={color} strokeWidth={2.5} />
                    <div style={{
                      fontSize: isPreview ? 13 : 18,
                      fontWeight: 800, color: '#fff', lineHeight: 1,
                    }}>
                      {value}
                    </div>
                    <div style={{
                      fontSize: isPreview ? 8 : 9,
                      color: 'rgba(255,255,255,0.3)',
                      fontWeight: 700, letterSpacing: '0.07em',
                    }}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <p style={{ fontSize: fs, color: 'rgba(255,255,255,0.3)', margin: 0 }}>
                No stats loaded
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
