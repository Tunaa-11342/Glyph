'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'
import type { ProfileSettings, LinkItem } from '@/types'
import ValorantCard from '@/components/gamer/valorant-card'
import GearCard from '@/components/gamer/gear-card'
import {
  FaTwitter, FaInstagram, FaYoutube, FaTwitch, FaDiscord,
  FaGithub, FaLinkedin, FaFacebook, FaTiktok, FaSpotify,
  FaEnvelope, FaLink, FaGlobe, FaStar, FaHeart,
  FaCamera, FaVideo, FaMicrophone, FaGamepad
} from 'react-icons/fa'

/* ─── Types ──────────────────────────────────────────────────────────────── */

interface User {
  username: string
  displayName?: string | null
  bio?: string | null
  avatar?: string | null
  avatarUrl?: string | null
}

interface Props {
  settings: ProfileSettings
  user: User
  links: LinkItem[]
  gamerProfile?: any | null
  isPreview?: boolean
  onLinkClick?: (id: string) => void
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */

const ICON_COMPONENT: Record<string, JSX.Element> = {
  twitter: <FaTwitter />,
  instagram: <FaInstagram />,
  youtube: <FaYoutube />,
  twitch: <FaTwitch />,
  discord: <FaDiscord />,
  github: <FaGithub />,
  linkedin: <FaLinkedin />,
  facebook: <FaFacebook />,
  tiktok: <FaTiktok />,
  spotify: <FaSpotify />,
  mail: <FaEnvelope />,
  link: <FaLink />,
  globe: <FaGlobe />,
  star: <FaStar />,
  heart: <FaHeart />,
  camera: <FaCamera />,
  video: <FaVideo />,
  mic: <FaMicrophone />,
  gamepad: <FaGamepad />,
}
function fmtNum(n: number) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`
  return `${n}`
}

function hexToRgb(value: string) {
  const fallback = { r: 139, g: 92, b: 246 }
  if (!value || !value.startsWith('#')) return fallback
  const hex = value.length === 4
    ? `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`
    : value
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return fallback
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  }
}

/* ─── Canvas BG Effect ───────────────────────────────────────────────────── */

function CanvasBgEffect({ type, accentColor }: { type: string; accentColor: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || type === 'none') return
    const ctx = canvas.getContext('2d')!
    const parent = canvas.parentElement!
    const resize = () => { canvas.width = parent.offsetWidth || 800; canvas.height = parent.offsetHeight || 600 }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(parent)
    let id: number; let t = 0
    const W = () => canvas.width, H = () => canvas.height
    const rgb = hexToRgb(accentColor)

    if (type === 'plasma') {
      const draw = () => {
        t += 0.018; ctx.clearRect(0, 0, W(), H())
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2 + t * (0.25 + i * 0.07)
          const cx = W() / 2 + Math.cos(a) * W() * 0.32
          const cy = H() / 2 + Math.sin(a * 0.73) * H() * 0.32
          const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, W() * 0.38)
          const h = (i * 62 + t * 25) % 360
          g.addColorStop(0, `hsla(${h},100%,60%,0.32)`)
          g.addColorStop(0.5, `hsla(${h + 40},100%,55%,0.14)`)
          g.addColorStop(1, 'transparent')
          ctx.fillStyle = g; ctx.fillRect(0, 0, W(), H())
        }
        for (let y = 0; y < H(); y += 4) {
          const a = Math.sin(y * 0.05 + t * 2) * 0.035
          ctx.fillStyle = `rgba(255,255,255,${Math.max(0, a)})`
          ctx.fillRect(0, y, W(), 2)
        }
        id = requestAnimationFrame(draw)
      }; draw()
    }

    if (type === 'snowflakes') {
      const flakes = Array.from({ length: 140 }, () => ({
        x: Math.random() * 3000, y: Math.random() * 2000,
        r: Math.random() * 3.5 + 0.8, speed: Math.random() * 1.4 + 0.4,
        drift: (Math.random() - 0.5) * 0.7, opacity: Math.random() * 0.7 + 0.15,
        phase: Math.random() * Math.PI * 2,
      }))
      const draw = () => {
        t += 0.016; ctx.clearRect(0, 0, W(), H())
        for (const f of flakes) {
          f.y += f.speed; f.x += f.drift + Math.sin(t + f.phase) * 0.45
          if (f.y > H() + 10) { f.y = -10; f.x = Math.random() * W() }
          if (f.x > W() + 10) f.x = -10; if (f.x < -10) f.x = W() + 10
          ctx.save(); ctx.translate(f.x, f.y); ctx.globalAlpha = f.opacity
          for (let a = 0; a < 3; a++) {
            ctx.save(); ctx.rotate(a * Math.PI / 3)
            ctx.beginPath(); ctx.moveTo(0, -f.r * 2.2); ctx.lineTo(0, f.r * 2.2)
            ctx.strokeStyle = `rgba(200,220,255,${f.opacity})`
            ctx.lineWidth = f.r * 0.55; ctx.stroke()
            for (const s of [-1, 1]) {
              ctx.beginPath()
              ctx.moveTo(s * f.r * 0.6, -f.r); ctx.lineTo(0, -f.r * 1.5)
              ctx.stroke()
            }
            ctx.restore()
          }
          ctx.restore()
        }
        id = requestAnimationFrame(draw)
      }; draw()
    }

    if (type === 'aurora') {
      const bands = [
        { by: 0.25, hue: 140, sp: 0.003, amp: 0.12, w: 0.32 },
        { by: 0.40, hue: 185, sp: 0.005, amp: 0.08, w: 0.26 },
        { by: 0.55, hue: 275, sp: 0.004, amp: 0.10, w: 0.30 },
        { by: 0.35, hue: 200, sp: 0.006, amp: 0.06, w: 0.18 },
      ]
      let fr = 0
      const draw = () => {
        fr++; ctx.clearRect(0, 0, W(), H())
        for (const b of bands) {
          const pts: [number, number][] = []
          for (let x = 0; x <= W(); x += 8) {
            const p = x / W()
            const wave = Math.sin(p * Math.PI * 3 + fr * b.sp * 60) * b.amp * H()
              + Math.sin(p * Math.PI * 5 + fr * b.sp * 40) * b.amp * 0.45 * H()
            pts.push([x, b.by * H() + wave])
          }
          const spread = b.w * H()
          ctx.beginPath()
          ctx.moveTo(pts[0][0], pts[0][1] - spread)
          for (const [px, py] of pts) ctx.lineTo(px, py - spread)
          for (let i = pts.length - 1; i >= 0; i--) ctx.lineTo(pts[i][0], pts[i][1] + spread)
          ctx.closePath()
          const g = ctx.createLinearGradient(0, b.by * H() - spread, 0, b.by * H() + spread)
          const pulse = 0.11 + Math.sin(fr * b.sp * 40) * 0.04
          g.addColorStop(0, 'transparent')
          g.addColorStop(0.3, `hsla(${b.hue},100%,65%,${pulse * 0.5})`)
          g.addColorStop(0.5, `hsla(${b.hue},100%,70%,${pulse})`)
          g.addColorStop(0.7, `hsla(${b.hue + 30},100%,65%,${pulse * 0.5})`)
          g.addColorStop(1, 'transparent')
          ctx.fillStyle = g; ctx.fill()
        }
        id = requestAnimationFrame(draw)
      }; draw()
    }

    if (type === 'rain') {
      const drops = Array.from({ length: 240 }, () => ({
        x: Math.random() * 3000, y: Math.random() * 2000,
        len: Math.random() * 22 + 9, speed: Math.random() * 7 + 5,
        opacity: Math.random() * 0.4 + 0.1, w: Math.random() * 1.1 + 0.3,
      }))
      const splashes: { x: number; y: number; r: number; maxR: number }[] = []
      const draw = () => {
        ctx.clearRect(0, 0, W(), H())
        for (const d of drops) {
          d.y += d.speed; d.x += d.speed * 0.14
          if (d.y - d.len > H()) {
            if (Math.random() < 0.25) splashes.push({ x: d.x, y: H(), r: 0, maxR: 7 + Math.random() * 9 })
            d.y = -d.len; d.x = Math.random() * W()
          }
          ctx.beginPath()
          ctx.moveTo(d.x, d.y)
          ctx.lineTo(d.x + d.speed * 0.14 * (d.len / d.speed), d.y + d.len)
          ctx.strokeStyle = `rgba(${rgb.r},${rgb.g + 20},${rgb.b + 20},${d.opacity})`
          ctx.lineWidth = d.w; ctx.stroke()
        }
        for (let i = splashes.length - 1; i >= 0; i--) {
          const sp = splashes[i]; sp.r += 1.1
          const a = (1 - sp.r / sp.maxR) * 0.35
          if (a <= 0) { splashes.splice(i, 1); continue }
          ctx.beginPath()
          ctx.ellipse(sp.x, sp.y, sp.r, sp.r * 0.32, 0, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${a})`
          ctx.lineWidth = 1; ctx.stroke()
        }
        id = requestAnimationFrame(draw)
      }; draw()
    }

    if (type === 'nighttime') {
      const stars = Array.from({ length: 260 }, () => ({
        x: Math.random() * 3000, y: Math.random() * 2000,
        r: Math.random() * 2 + 0.2, phase: Math.random() * Math.PI * 2,
        sp: Math.random() * 0.04 + 0.006, bright: Math.random(),
      }))
      const shoots: { x: number; y: number; dx: number; dy: number; life: number; maxL: number; trail: [number, number][] }[] = []
      let next = 80
      const draw = () => {
        t += 0.016; ctx.clearRect(0, 0, W(), H())
        for (const s of stars) {
          s.phase += s.sp
          const a = Math.max(0, Math.min(1, 0.15 + Math.sin(s.phase) * 0.5 * s.bright + s.bright * 0.35))
          const sz = s.r * (1 + Math.sin(s.phase * 0.7) * 0.18)
          if (s.bright > 0.68) {
            const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, sz * 5)
            g.addColorStop(0, `rgba(255,255,240,${a * 0.45})`); g.addColorStop(1, 'transparent')
            ctx.fillStyle = g; ctx.fillRect(s.x - sz * 5, s.y - sz * 5, sz * 10, sz * 10)
          }
          ctx.beginPath(); ctx.arc(s.x, s.y, sz, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255,255,220,${a})`; ctx.fill()
        }
        if (--next <= 0) {
          shoots.push({
            x: Math.random() * W() * 0.6 + W() * 0.1, y: Math.random() * H() * 0.4,
            dx: 3 + Math.random() * 5, dy: 1.5 + Math.random() * 3, life: 0,
            maxL: 50 + Math.random() * 40, trail: []
          })
          next = 130 + Math.random() * 220
        }
        for (let i = shoots.length - 1; i >= 0; i--) {
          const ss = shoots[i]
          ss.trail.push([ss.x, ss.y])
          if (ss.trail.length > 22) ss.trail.shift()
          ss.x += ss.dx; ss.y += ss.dy; ss.life++
          const prog = ss.life / ss.maxL
          if (prog >= 1) { shoots.splice(i, 1); continue }
          for (let j = 1; j < ss.trail.length; j++) {
            const a = (j / ss.trail.length) * (1 - prog) * 0.85
            ctx.beginPath()
            ctx.moveTo(ss.trail[j - 1][0], ss.trail[j - 1][1])
            ctx.lineTo(ss.trail[j][0], ss.trail[j][1])
            ctx.strokeStyle = `rgba(255,255,200,${a})`
            ctx.lineWidth = (j / ss.trail.length) * 2.5; ctx.stroke()
          }
          const ha = prog < 0.5 ? prog * 2 : (1 - prog) * 2
          const hg = ctx.createRadialGradient(ss.x, ss.y, 0, ss.x, ss.y, 6)
          hg.addColorStop(0, `rgba(255,255,255,${ha})`); hg.addColorStop(1, 'transparent')
          ctx.fillStyle = hg; ctx.fillRect(ss.x - 6, ss.y - 6, 12, 12)
        }
        id = requestAnimationFrame(draw)
      }; draw()
    }

    if (type === 'oldtv') {
      let fr = 0
      const draw = () => {
        fr++; ctx.clearRect(0, 0, W(), H())
        ctx.fillStyle = 'rgba(0,18,0,0.07)'; ctx.fillRect(0, 0, W(), H())
        const img = ctx.createImageData(W(), H())
        const d = img.data
        for (let i = 0; i < d.length; i += 4) { const v = Math.random() * 38; d[i] = v * 0.5; d[i + 1] = v; d[i + 2] = v * 0.5; d[i + 3] = 22 }
        ctx.putImageData(img, 0, 0)
        for (let y = 0; y < H(); y += 2) { ctx.fillStyle = 'rgba(0,0,0,0.16)'; ctx.fillRect(0, y, W(), 1) }
        if (fr % 55 < 3) {
          ctx.fillStyle = 'rgba(255,0,0,0.035)'; ctx.fillRect(-2, 0, W(), H())
          ctx.fillStyle = 'rgba(0,0,255,0.035)'; ctx.fillRect(2, 0, W(), H())
        }
        const bY = (fr * 1.5) % (H() + 60) - 30
        const bg = ctx.createLinearGradient(0, bY, 0, bY + 60)
        bg.addColorStop(0, 'transparent'); bg.addColorStop(0.5, 'rgba(160,255,160,0.055)'); bg.addColorStop(1, 'transparent')
        ctx.fillStyle = bg; ctx.fillRect(0, bY, W(), 60)
        const vg = ctx.createRadialGradient(W() / 2, H() / 2, H() * 0.25, W() / 2, H() / 2, H())
        vg.addColorStop(0, 'transparent'); vg.addColorStop(1, 'rgba(0,0,0,0.5)')
        ctx.fillStyle = vg; ctx.fillRect(0, 0, W(), H())
        id = requestAnimationFrame(draw)
      }; draw()
    }

    return () => { cancelAnimationFrame(id); ro.disconnect() }
  }, [type, accentColor])

  if (type === 'none') return null
  return <canvas ref={ref} style={{
    position: 'absolute', inset: 0, width: '100%', height: '100%',
    pointerEvents: 'none', zIndex: 2,
    mixBlendMode: type === 'plasma' ? 'screen' : 'normal',
  }} />
}

/* ─── Particles ──────────────────────────────────────────────────────────── */

function ParticlesEffect({ color }: { color: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const parent = canvas.parentElement!
    const resize = () => { canvas.width = parent.offsetWidth || 800; canvas.height = parent.offsetHeight || 600 }
    resize(); const ro = new ResizeObserver(resize); ro.observe(parent)
    const rgb = hexToRgb(color)
    const pts = Array.from({ length: 65 }, () => ({
      x: Math.random() * 3000, y: Math.random() * 2000,
      vx: (Math.random() - 0.5) * 0.45, vy: (Math.random() - 0.5) * 0.45,
      size: Math.random() * 2.2 + 0.4, opacity: Math.random() * 0.55 + 0.1,
    }))
    let id: number
    const W = () => canvas.width, H = () => canvas.height
    const draw = () => {
      ctx.clearRect(0, 0, W(), H())
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = W(); if (p.x > W()) p.x = 0
        if (p.y < 0) p.y = H(); if (p.y > H()) p.y = 0
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.5)
        g.addColorStop(0, `rgba(${rgb.r},${rgb.g},${rgb.b},${p.opacity})`)
        g.addColorStop(1, 'transparent')
        ctx.fillStyle = g; ctx.fillRect(p.x - p.size * 3, p.y - p.size * 3, p.size * 6, p.size * 6)
      }
      id = requestAnimationFrame(draw)
    }; draw()
    return () => { cancelAnimationFrame(id); ro.disconnect() }
  }, [color])
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }} />
}

/* ─── Username Effects ───────────────────────────────────────────────────── */

function UsernameDisplay({ name, effect, color, fontSize }: { name: string; effect: string; color: string; fontSize: number }) {
  const [display, setDisplay] = useState(name)
  const [glitchOn, setGlitchOn] = useState(false)
  const CHARS = 'アイウエオカキABCDEFGHIJKLMNOP0123456789!@#$%^'

  useEffect(() => {
    setDisplay(name)
    if (effect === 'none') return
    if (effect === 'typewriter') {
      let i = 0; let del = false; setDisplay('')
      const tick = setInterval(() => {
        if (!del) { setDisplay(name.slice(0, i + 1)); i++; if (i >= name.length) { del = false; setTimeout(() => { del = true }, 2800) } }
        else { setDisplay(name.slice(0, i - 1)); i--; if (i <= 0) del = false }
      }, 85)
      return () => clearInterval(tick)
    }
    if (effect === 'shuffle') {
      let prog = 0
      const tick = setInterval(() => {
        prog += 0.22
        setDisplay(name.split('').map((ch, i) => i < prog ? ch : CHARS[Math.floor(Math.random() * CHARS.length)]).join(''))
        if (prog >= name.length) { setDisplay(name); clearInterval(tick); setTimeout(() => { prog = 0 }, 4000) }
      }, 36)
      return () => clearInterval(tick)
    }
    if (effect === 'fuzzy') {
      const tick = setInterval(() => {
        setDisplay(name.split('').map(ch => ch === ' ' ? ' ' : Math.random() > 0.83 ? CHARS[Math.floor(Math.random() * CHARS.length)] : ch).join(''))
      }, 72)
      return () => clearInterval(tick)
    }
    if (effect === 'glitch') {
      const tick = setInterval(() => {
        setGlitchOn(true); setTimeout(() => setGlitchOn(false), 100 + Math.random() * 90)
      }, 2200 + Math.random() * 1600)
      return () => clearInterval(tick)
    }
  }, [effect, name])

  const base: React.CSSProperties = { fontWeight: 800, fontSize, lineHeight: 1.1, color }

  if (effect === 'rainbow') {
    return (
      <div style={{ ...base, display: 'flex', flexWrap: 'wrap', gap: 0 }}>
        {name.split('').map((ch, i) => (
          <span key={i} style={{
            display: 'inline-block', color: `hsl(${(i / name.length) * 360},100%,65%)`,
            animation: 'rainbowChar 3s linear infinite', animationDelay: `${-i * 0.2}s`,
          }}>{ch === ' ' ? '\u00A0' : ch}</span>
        ))}
      </div>
    )
  }
  if (effect === 'sparkles_w' || effect === 'sparkles_g') {
    const sc = effect === 'sparkles_g' ? '#4ade80' : '#ffffff'
    const syms = ['✦', '✧', '★', '✵', '✸', '✹']
    return (
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <div style={base}>{name}</div>
        {[0, 1, 2, 3, 4, 5].map(i => (
          <span key={i} style={{
            position: 'absolute',
            top: `${-14 + Math.sin(i * 1.2) * 18}px`,
            left: `${(i / 6) * 110 - 8}%`,
            fontSize: `${7 + (i % 3) * 4}px`, color: sc,
            pointerEvents: 'none', textShadow: `0 0 8px ${sc}`,
            animation: `sparkFloat3D ${1.1 + i * 0.22}s ease-in-out infinite`,
            animationDelay: `${i * 0.32}s`,
          }}>{syms[i]}</span>
        ))}
      </div>
    )
  }
  if (effect === 'neon') {
    return (
      <div style={{
        ...base, color,
        textShadow: `0 0 7px ${color},0 0 18px ${color},0 0 35px ${color}aa,0 0 70px ${color}44`,
        animation: 'neonFlicker 4s ease-in-out infinite',
      }}>{name}</div>
    )
  }
  if (effect === 'glitch') {
    return (
      <div style={{ ...base, position: 'relative' }}>
        {display}
        {glitchOn && <>
          <span style={{
            position: 'absolute', inset: 0, color: '#ff00aa',
            clipPath: `inset(${15 + Math.random() * 30}% 0 ${18 + Math.random() * 20}% 0)`,
            transform: `translateX(${-3 - Math.random() * 4}px) skewX(-2deg)`, opacity: 0.82
          }}>{name}</span>
          <span style={{
            position: 'absolute', inset: 0, color: '#00ffff',
            clipPath: `inset(${42 + Math.random() * 18}% 0 ${10 + Math.random() * 14}% 0)`,
            transform: `translateX(${3 + Math.random() * 4}px) skewX(2deg)`, opacity: 0.82
          }}>{name}</span>
        </>}
      </div>
    )
  }
  return <div style={base}>{display}</div>
}

/* ─── Expandable Gamer Cards (real page only) ────────────────────────────── */

function SideGamerCards({ gp, cardBlur, side, compact = false }: { gp: any; cardBlur: number; side: 'left' | 'right'; compact?: boolean }) {
  const desktopTilt = side === 'left' ? 15 : -15
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotateY: compact ? 0 : side === 'left' ? 22 : -22 }}
      animate={{ opacity: 1, y: 0, rotateY: compact ? 0 : desktopTilt }}
      transition={{ delay: side === 'left' ? 0.24 : 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      whileHover={compact ? undefined : { rotateY: side === 'left' ? 8 : -8, y: -4 }}
      style={{
        width: compact ? '100%' : 'min(400px, calc((100vw - 92px) / 3))',
        minWidth: compact ? undefined : 340,
        maxWidth: compact ? 'calc(100vw - 48px)' : 400,
        order: compact ? (side === 'right' ? 2 : 3) : (side === 'left' ? 1 : 3),
        scrollSnapAlign: compact ? 'center' : undefined,
        flexShrink: compact ? 0 : undefined,
        transformStyle: 'preserve-3d',
        transformOrigin: side === 'left' ? 'right center' : 'left center',
      }}
    >
      {side === 'left' ? (
        <ValorantCard gp={gp} isPreview={false} cardBlur={cardBlur} animDelay={0} />
      ) : (
        <GearCard gp={gp} isPreview={false} cardBlur={cardBlur} animDelay={0} />
      )}
    </motion.div>
  )
}

function SwipeHint({ active, total }: { active: number; total: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      style={{
        margin: '12px auto 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 9,
        border: '1px solid rgba(255,255,255,0.11)',
        background: 'linear-gradient(135deg,rgba(255,255,255,0.075),rgba(255,255,255,0.028))',
        color: 'rgba(255,255,255,0.62)',
        borderRadius: 18,
        padding: '8px 12px',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.02em',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        boxShadow: '0 12px 34px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.07)',
        pointerEvents: 'none',
      }}
    >
      <span>Swipe for more</span>
      <span style={{ display: 'flex', gap: 4 }}>
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            style={{
              width: i === active ? 13 : 5,
              height: 5,
              borderRadius: 999,
              background: i === active ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.22)',
              transition: 'all 0.18s ease',
            }}
          />
        ))}
      </span>
    </motion.div>
  )
}

/* ─── Main ProfileRenderer ───────────────────────────────────────────────── */

export default function ProfileRenderer({ settings: s, user, links, gamerProfile, isPreview = false, onLinkClick }: Props) {
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [compactProfile, setCompactProfile] = useState(false)
  const [mobileCardIndex, setMobileCardIndex] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (isPreview) return
    const media = window.matchMedia('(max-width: 1180px)')
    const sync = () => setCompactProfile(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [isPreview])

  // Google Font injection
  useEffect(() => {
    const f = s.fontFamily; if (!f || f === 'Inter') return
    const id = `gf-${f.replace(/\s/g, '_')}`
    if (document.getElementById(id)) return
    const el = document.createElement('link')
    el.id = id; el.rel = 'stylesheet'
    el.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(f)}:wght@400;500;600;700;800&display=swap`
    document.head.appendChild(el)
  }, [s.fontFamily])

  // Audio setup
  useEffect(() => {
    if (!s.audioUrl || !audioRef.current || isPreview) return
    const audio = audioRef.current
    audio.volume = s.audioVolume ?? 0.5; audio.loop = true
    const onReady = () => {
      if (s.audioAutoplay) audio.play().then(() => setAudioPlaying(true)).catch(() => { })
    }
    audio.addEventListener('canplaythrough', onReady)
    return () => audio.removeEventListener('canplaythrough', onReady)
  }, [s.audioUrl, s.audioVolume, s.audioAutoplay, isPreview])

  /* Derived values */
  const accent = s.accentColor || '#8b5cf6'
  const usernameClr = s.usernameColor || '#ffffff'
  const handleClr = s.handleColor || 'rgba(255,255,255,0.45)'
  const bioClr = s.bioColor || 'rgba(255,255,255,0.75)'
  const linkTextClr = s.linkTextColor || '#ffffff'
  const linkIconClr = s.monochrome ? (s.textColor || '#fff') : (s.linkIconColor || accent)
  const font = s.fontFamily || 'Inter'
  const radius = s.borderRadius ?? 18
  const cardBlur = s.cardBlur ?? 20
  const cardOpacity = s.cardOpacity ?? 0.08
  const glow = s.glowEnabled
  const glowClr = s.glowColor || accent
  const layout = s.layoutStyle || 'centered'
  const align = layout === 'left' ? 'flex-start' : layout === 'right' ? 'flex-end' : 'center'
  const textAlign = layout === 'left' ? 'left' as const : layout === 'right' ? 'right' as const : 'center' as const
  const bgBlur = s.bgBlur ?? 0

  // Avatar: prefer uploaded avatarUrl, then Clerk avatar
  const avatarSrc = (s as any).avatarUrl || user.avatarUrl || user.avatar

  // Card background (frosted glass)
  const cardBg = s.swapBoxColors ? accent : `rgba(255,255,255,${cardOpacity})`
  const linkBg = s.swapBoxColors ? `rgba(255,255,255,0.15)` : `rgba(255,255,255,${Math.max(cardOpacity - 0.03, 0.04)})`

  // Page background
  const getBg = (): React.CSSProperties => {
    if (s.bgType === 'gradient') return { background: s.bgGradient || s.bgColor || '#0a0a0a' }
    if (s.bgType === 'image' && s.bgImage) return { backgroundImage: `url(${s.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    return { background: s.bgColor || '#0a0a0a' }
  }

  // Animation
  const getAnim = (delay = 0) => {
    if (s.animationStyle === 'none') return {}
    if (s.animationStyle === 'slide') return {
      initial: { opacity: 0, x: -28 }, animate: { opacity: 1, x: 0 },
      transition: { delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    }
    if (s.animationStyle === 'bounce') return {
      initial: { opacity: 0, scale: 0.78, y: 18 }, animate: { opacity: 1, scale: 1, y: 0 },
      transition: { delay, type: 'spring' as const, stiffness: 260, damping: 18 },
    }
    return {
      initial: { opacity: 0, y: 22 }, animate: { opacity: 1, y: 0 },
      transition: { delay, duration: 0.55, ease: [0.16, 1, 0.3, 1] },
    }
  }

  const nameFontSize = isPreview ? 18 : 26
  const hasGamerCards = !!gamerProfile && (gamerProfile.valorantEnabled || gamerProfile.gearEnabled)
  const mobileCards = [
    'bio',
    ...(gamerProfile?.gearEnabled ? ['gear'] : []),
    ...(gamerProfile?.valorantEnabled ? ['stats'] : []),
  ] as const
  const showMobileCarousel = !isPreview && compactProfile && hasGamerCards
  const scrollMobileCard = (next: number) => {
    if (mobileCards.length <= 1) return
    const normalized = (next + mobileCards.length) % mobileCards.length
    setMobileCardIndex(normalized)
    const el = carouselRef.current
    if (el) {
      const target = Array.from(el.children)[normalized] as HTMLElement | undefined
      target?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      fontFamily: `'${font}',-apple-system,sans-serif`,
      overflow: 'hidden', ...getBg(),
    }}>
      {/* Global keyframes */}
      <style>{`
        @keyframes rainbowChar{0%{filter:hue-rotate(0deg)}100%{filter:hue-rotate(360deg)}}
        @keyframes sparkFloat3D{0%,100%{transform:translateY(0) scale(0.8) rotate(0deg);opacity:0.25}50%{transform:translateY(-12px) scale(1.3) rotate(18deg);opacity:1}}
        @keyframes neonFlicker{0%,100%{opacity:1}90%{opacity:1}92%{opacity:0.55}94%{opacity:1}97%{opacity:0.35}98%{opacity:1}}
        @keyframes glowPulse{0%,100%{opacity:0.18;transform:scale(1)}50%{opacity:0.3;transform:scale(1.08)}}
        @keyframes waveBar{0%,100%{height:3px}50%{height:14px}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      `}</style>

      {/* Video background */}
      {s.bgType === 'video' && s.bgVideo && (
        <video autoPlay muted loop playsInline src={s.bgVideo}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
      )}

      {/* Dark overlay for image/video */}
      {(s.bgType === 'image' || s.bgType === 'video') && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.38)', zIndex: 1 }} />
      )}

      {/* Background blur layer */}
      {bgBlur > 0 && (
        <div style={{ position: 'absolute', inset: 0, backdropFilter: `blur(${bgBlur}px)`, WebkitBackdropFilter: `blur(${bgBlur}px)`, zIndex: 1 }} />
      )}

      {/* Canvas effect */}
      <CanvasBgEffect type={s.bgEffect || 'none'} accentColor={accent} />

      {/* Particles */}
      {s.particlesEnabled && <ParticlesEffect color={accent} />}

      {/* Glow blob */}
      {glow && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <div style={{
            width: '60%', height: '60%', borderRadius: '50%',
            background: `radial-gradient(circle,${glowClr}50 0%,transparent 70%)`,
            animation: 'glowPulse 3s ease-in-out infinite',
          }} />
        </div>
      )}

      {/* Audio element */}
      {s.audioUrl && !isPreview && <audio ref={audioRef} preload="none" src={s.audioUrl} />}

      {/* ── OUTER LAYOUT: center the card ─────────────────────────────────── */}
      <motion.div
        ref={carouselRef}
        onTouchStart={showMobileCarousel ? e => {
          const t = e.touches[0]
          touchStartRef.current = { x: t.clientX, y: t.clientY }
        } : undefined}
        onTouchEnd={showMobileCarousel ? e => {
          const start = touchStartRef.current
          touchStartRef.current = null
          if (!start || mobileCards.length <= 1) return
          const t = e.changedTouches[0]
          const dx = t.clientX - start.x
          const dy = t.clientY - start.y
          if (Math.abs(dx) < 42 || Math.abs(dx) < Math.abs(dy) * 1.2) return
          const atLast = mobileCardIndex === mobileCards.length - 1
          const atFirst = mobileCardIndex === 0
          if (atLast && dx < 0) scrollMobileCard(0)
          if (atFirst && dx > 0) scrollMobileCard(mobileCards.length - 1)
        } : undefined}
        onScroll={showMobileCarousel ? e => {
          const el = e.currentTarget
          const center = el.scrollLeft + el.clientWidth / 2
          let closest = 0
          let distance = Number.POSITIVE_INFINITY
          Array.from(el.children).forEach((child, index) => {
            const node = child as HTMLElement
            const childCenter = node.offsetLeft + node.offsetWidth / 2
            const d = Math.abs(childCenter - center)
            if (d < distance) {
              distance = d
              closest = index
            }
          })
          if (closest !== mobileCardIndex) setMobileCardIndex(closest % mobileCards.length)
        } : undefined}
        style={{
        position: 'relative', zIndex: 10,
        width: '100%', height: '100%',
        display: 'flex',
        flexDirection: showMobileCarousel ? 'row' : !isPreview && hasGamerCards && !compactProfile ? 'row' : 'column',
        flexWrap: showMobileCarousel ? 'nowrap' : !isPreview && hasGamerCards && !compactProfile ? 'wrap' : 'nowrap',
        alignItems: !isPreview && hasGamerCards && !compactProfile ? 'center' : showMobileCarousel ? 'center' : align,
        justifyContent: showMobileCarousel ? 'flex-start' : 'center',
        gap: showMobileCarousel ? 16 : !isPreview && hasGamerCards && !compactProfile ? 28 : 0,
        perspective: !isPreview && hasGamerCards && !compactProfile ? '1600px' : undefined,
        padding: showMobileCarousel ? '24px max(24px, calc((100vw - 400px) / 2)) 70px' : isPreview ? '16px' : '24px',
        overflowY: showMobileCarousel ? 'hidden' : 'auto',
        overflowX: showMobileCarousel ? 'auto' : 'hidden',
        scrollSnapType: showMobileCarousel ? 'x mandatory' : undefined,
        scrollBehavior: showMobileCarousel ? 'smooth' : undefined,
        boxSizing: 'border-box',
        touchAction: showMobileCarousel ? 'pan-x' : undefined,
        scrollbarWidth: showMobileCarousel ? 'none' : undefined,
      }}>

        {/* ── FROSTED GLASS CARD ─────────────────────────────────────────── */}
        {!isPreview && hasGamerCards && gamerProfile.valorantEnabled && !compactProfile && (
          <SideGamerCards gp={gamerProfile} cardBlur={cardBlur} side="left" />
        )}

        <motion.div
          {...getAnim(0)}
          style={{
            background: cardBg,
            backdropFilter: `blur(${cardBlur}px)`,
            WebkitBackdropFilter: `blur(${cardBlur}px)`,
            border: `1px solid rgba(255,255,255,${cardOpacity * 1.5 + 0.06})`,
            borderRadius: radius + 8,
            boxShadow: glow
              ? `0 0 40px ${glowClr}30,0 16px 48px rgba(0,0,0,0.55)`
              : '0 16px 48px rgba(0,0,0,0.5),0 2px 0 rgba(255,255,255,0.06) inset',
            padding: isPreview ? '18px 18px 16px' : '28px 28px 24px',
            width: showMobileCarousel ? 'min(400px, calc(100vw - 48px))' : '100%',
            maxWidth: isPreview ? 300 : 400,
            order: showMobileCarousel ? 1 : !isPreview && hasGamerCards ? 2 : undefined,
            scrollSnapAlign: showMobileCarousel ? 'center' : undefined,
            flexShrink: showMobileCarousel ? 0 : undefined,
            display: 'flex',
            flexDirection: 'column',
            alignItems: align,
            textAlign,
          }}
        >
          {/* Avatar row */}
          <motion.div {...getAnim(0.05)} style={{ marginBottom: isPreview ? 12 : 16, display: 'flex', justifyContent: align }}>
            <div style={{
              width: isPreview ? 64 : 88, height: isPreview ? 64 : 88,
              borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
              border: `2.5px solid ${accent}60`,
              boxShadow: glow
                ? `0 0 22px ${glowClr}70,0 0 44px ${glowClr}30`
                : `0 4px 16px rgba(0,0,0,0.5)`,
              filter: s.profileBlur > 0 ? `blur(${s.profileBlur}px)` : undefined,
            }}>
              {avatarSrc ? (
                <img src={avatarSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              ) : (
                <div style={{
                  width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `linear-gradient(135deg,${accent}80,${accent}28)`,
                  color: accent, fontWeight: 800, fontSize: isPreview ? 26 : 36,
                }}>
                  {(user.displayName || user.username)[0].toUpperCase()}
                </div>
              )}
            </div>
          </motion.div>

          {/* Display name */}
          <motion.div {...getAnim(0.08)} style={{ marginBottom: 4 }}>
            <UsernameDisplay
              name={user.displayName || user.username}
              effect={s.usernameEffect || 'none'}
              color={usernameClr}
              fontSize={nameFontSize}
            />
          </motion.div>

          {/* Handle */}
          <motion.div {...getAnim(0.11)} style={{
            fontSize: isPreview ? 11 : 13, color: handleClr, marginBottom: 10,
          }}>
            @{user.username}
          </motion.div>

          {/* Bio */}
          {user.bio && (
            <motion.p {...getAnim(0.14)} style={{
              fontSize: isPreview ? 11 : 13, color: bioClr,
              marginBottom: isPreview ? 12 : 16, maxWidth: 300,
              lineHeight: 1.6, margin: `0 0 ${isPreview ? 12 : 16}px`,
            }}>
              {user.bio}
            </motion.p>
          )}

          {/* Location + views */}
          {(s.location || (s.viewCount ?? 0) > 0) && (
            <motion.div {...getAnim(0.16)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              marginBottom: isPreview ? 10 : 14,
              justifyContent: align === 'center' ? 'center' : 'flex-start',
              flexWrap: 'wrap',
            }}>
              {s.location && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: `${usernameClr}50` }}>
                  📍 {s.location}
                </span>
              )}
              {(s.viewCount ?? 0) > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: `${usernameClr}35` }}>
                  👁 {fmtNum(s.viewCount ?? 0)}
                </span>
              )}
            </motion.div>
          )}

          {/* Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: isPreview ? 6 : 8, width: '100%' }}>
            {links.map((link, i) => (
              <motion.a
                key={link.id}
                {...getAnim(0.2 + i * 0.07)}
                href={isPreview ? undefined : link.url}
                target={isPreview ? undefined : '_blank'}
                rel="noopener noreferrer"
                onClick={() => { if (!isPreview && onLinkClick) onLinkClick(link.id) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: isPreview ? 8 : 11,
                  padding: isPreview ? '8px 11px' : '11px 14px',
                  background: linkBg,
                  backdropFilter: `blur(10px)`, WebkitBackdropFilter: `blur(10px)`,
                  border: `1px solid ${accent}22`,
                  borderRadius: Math.max(radius - 2, 8),
                  color: s.swapBoxColors ? (s.bgColor || '#000') : linkTextClr,
                  textDecoration: 'none',
                  cursor: isPreview ? 'default' : 'pointer',
                  boxShadow: glow ? `0 0 10px ${glowClr}15` : '0 2px 8px rgba(0,0,0,0.22)',
                  transition: 'transform 0.15s ease',
                }}
                whileHover={isPreview ? undefined : { y: -2, transition: { duration: 0.15 } }}
                whileTap={isPreview ? undefined : { scale: 0.98 }}
              >
                <span style={{
                  width: isPreview ? 26 : 33, height: isPreview ? 26 : 33,
                  borderRadius: Math.max(radius - 8, 6),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: isPreview ? 12 : 15, flexShrink: 0,
                  background: s.swapBoxColors ? 'rgba(0,0,0,0.18)' : `${linkIconClr}22`,
                  color: s.swapBoxColors ? (s.bgColor || '#000') : linkIconClr,
                }}>
                  {ICON_COMPONENT[link.icon] || '🔗'}
                </span>
                <span style={{ fontSize: isPreview ? 12 : 14, fontWeight: 600, flex: 1, color: 'inherit' }}>
                  {link.title}
                </span>
                {!isPreview && <span style={{ opacity: 0.22, fontSize: 11 }}>↗</span>}
              </motion.a>
            ))}
            {links.length === 0 && (
              <p style={{ textAlign: 'center', fontSize: 12, color: `${usernameClr}25`, padding: '14px 0', margin: 0 }}>
                No links yet
              </p>
            )}
          </div>

          {/* Branding */}
          <motion.div {...getAnim(0.85)} style={{ marginTop: isPreview ? 12 : 16 }}>
            <a href="/" style={{ fontSize: 10, color: `${usernameClr}18`, textDecoration: 'none' }}>
              made with Glyph
            </a>
          </motion.div>
        </motion.div>

        {/* ── GAMER CARDS: outside & below the bio card ──────────────────── */}
        {isPreview && hasGamerCards && (
          <div style={{
            width: '100%',
            maxWidth: 300,
            marginTop: 8,
          }}>
            <ValorantCard gp={gamerProfile} isPreview cardBlur={cardBlur} animDelay={0.4} />
            <GearCard gp={gamerProfile} isPreview cardBlur={cardBlur} animDelay={0.46} />
          </div>
        )}

        {showMobileCarousel && gamerProfile.gearEnabled && (
          <SideGamerCards gp={gamerProfile} cardBlur={cardBlur} side="right" compact />
        )}

        {showMobileCarousel && gamerProfile.valorantEnabled && (
          <SideGamerCards gp={gamerProfile} cardBlur={cardBlur} side="left" compact />
        )}

        {!isPreview && hasGamerCards && gamerProfile.gearEnabled && !compactProfile && (
          <SideGamerCards gp={gamerProfile} cardBlur={cardBlur} side="right" />
        )}
      </motion.div>

      {/* Floating mute button — corner of screen, only on real page */}
      {showMobileCarousel && mobileCards.length > 1 && (
        <div style={{ position: 'fixed', left: 0, right: 0, bottom: 22, zIndex: 40, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
          <div style={{ pointerEvents: 'auto' }}>
            <SwipeHint active={mobileCardIndex % mobileCards.length} total={mobileCards.length} />
          </div>
        </div>
      )}

      {!isPreview && s.audioUrl && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.3 }}
          onClick={() => {
            if (!audioRef.current) return
            if (!audioPlaying) {
              audioRef.current.muted = false
              audioRef.current.play().then(() => {
                setMuted(false)
                setAudioPlaying(true)
              }).catch(() => { })
              return
            }
            audioRef.current.muted = !muted
            setMuted(p => !p)
          }}
          style={{
            position: 'fixed', bottom: 20, right: 20, zIndex: 50,
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            border: `1px solid rgba(255,255,255,0.12)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: muted ? 'rgba(255,255,255,0.4)' : '#fff',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            transition: 'transform 0.15s ease, background 0.15s ease',
          }}
          whileHover={{ scale: 1.1, background: 'rgba(0,0,0,0.75)' } as any}
          whileTap={{ scale: 0.95 } as any}
          title={!audioPlaying ? 'Play music' : muted ? 'Unmute' : 'Mute'}
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </motion.button>
      )}
    </div>
  )
}
