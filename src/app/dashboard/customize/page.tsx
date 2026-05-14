'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Save, Palette, Music, Sparkles, Layout, User,
  Upload, X, Check, ChevronDown,
  Zap, Star, Droplets, Cloud, Tv, Snowflake,
  AlignCenter, AlignLeft, AlignRight,
  Monitor, Smartphone, ImageIcon,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { debounce } from '@/lib/utils'
import ProfilePreview from '@/components/dashboard/profile-preview'
import type { ProfileSettings } from '@/types'

// ── Constants ────────────────────────────────────────────────────────────────

const FONTS = [
  'Inter', 'Space Grotesk', 'Outfit', 'Plus Jakarta Sans',
  'Syne', 'Raleway', 'Poppins', 'Nunito', 'DM Sans',
]

const PRESET_COLORS = [
  '#ffffff', '#e2e8f0', '#94a3b8', '#64748b',
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
  '#10b981', '#14b8a6', '#6366f1', '#f43f5e',
  '#0a0a0a', '#111114', '#1e1e23', '#2d2d35',
]

const GRADIENT_PRESETS = [
  { name: 'Midnight', value: 'linear-gradient(135deg,#0d0d1a 0%,#1a0d2e 100%)', from: '#0d0d1a', to: '#1a0d2e' },
  { name: 'Ocean', value: 'linear-gradient(135deg,#0c1445 0%,#0f4c75 100%)', from: '#0c1445', to: '#0f4c75' },
  { name: 'Dusk', value: 'linear-gradient(135deg,#1a0533 0%,#330d1a 100%)', from: '#1a0533', to: '#330d1a' },
  { name: 'Forest', value: 'linear-gradient(135deg,#0a1628 0%,#0d2b1a 100%)', from: '#0a1628', to: '#0d2b1a' },
  { name: 'Crimson', value: 'linear-gradient(135deg,#1a0a0a 0%,#2d0f0f 100%)', from: '#1a0a0a', to: '#2d0f0f' },
  { name: 'Steel', value: 'linear-gradient(135deg,#0f172a 0%,#1e293b 100%)', from: '#0f172a', to: '#1e293b' },
  { name: 'Aurora', value: 'linear-gradient(135deg,#0a1628 0%,#0d2b2e 50%,#1a0a2e 100%)', from: '#0a1628', to: '#1a0a2e' },
  { name: 'Amber', value: 'linear-gradient(135deg,#1c0f00 0%,#2d1a00 100%)', from: '#1c0f00', to: '#2d1a00' },
]

const BG_EFFECTS = [
  { id: 'none', label: 'None', icon: X },
  { id: 'plasma', label: 'Plasma', icon: Zap },
  { id: 'snowflakes', label: 'Snowflakes', icon: Snowflake },
  { id: 'aurora', label: 'Aurora', icon: Cloud },
  { id: 'rain', label: 'Rain', icon: Droplets },
  { id: 'nighttime', label: 'Nighttime', icon: Star },
  { id: 'oldtv', label: 'Old TV', icon: Tv },
]

const USERNAME_EFFECTS = [
  { id: 'none', label: 'None', icon: '—' },
  { id: 'shuffle', label: 'Shuffle', icon: '🔀' },
  { id: 'typewriter', label: 'Typewriter', icon: '⌨️' },
  { id: 'fuzzy', label: 'Fuzzy', icon: '〰️' },
  { id: 'rainbow', label: 'Rainbow', icon: '🌈' },
  { id: 'sparkles_w', label: 'White Sparkles', icon: '✨' },
  { id: 'sparkles_g', label: 'Green Sparkles', icon: '💚' },
  { id: 'glitch', label: 'Glitch', icon: '📺' },
  { id: 'neon', label: 'Neon', icon: '💡' },
]

const ANIMATION_STYLES = [
  { id: 'fade', label: 'Fade', emoji: '✦' },
  { id: 'slide', label: 'Slide', emoji: '→' },
  { id: 'bounce', label: 'Bounce', emoji: '↕' },
  { id: 'none', label: 'None', emoji: '◼' },
]

const TABS = [
  { id: 'general', label: 'General', icon: User },
  { id: 'colors', label: 'Colors', icon: Palette },
  { id: 'background', label: 'Background', icon: ImageIcon },
  { id: 'audio', label: 'Audio', icon: Music },
  { id: 'effects', label: 'Effects', icon: Sparkles },
  { id: 'layout', label: 'Layout', icon: Layout },
]

const DEFAULT_SETTINGS: ProfileSettings = {
  id: '',
  bgColor: '#0a0a0a',
  bgType: 'color',
  bgGradient: 'linear-gradient(135deg,#0d0d1a 0%,#1a0d2e 100%)',
  accentColor: '#8b5cf6',
  textColor: '#ffffff',
  usernameColor: '#ffffff',
  handleColor: 'rgba(255,255,255,0.45)',
  bioColor: 'rgba(255,255,255,0.75)',
  linkTextColor: '#ffffff',
  linkBgColor: 'rgba(255,255,255,0.08)',
  linkIconColor: '#8b5cf6',
  fontFamily: 'Inter',
  cardOpacity: 0.08,
  cardBlur: 16,
  borderRadius: 18,
  audioUrl: null,
  audioName: null,
  audioVolume: 0.5,
  audioAutoplay: false,
  particlesEnabled: false,
  glowEnabled: false,
  glowColor: '#8b5cf6',
  animationStyle: 'fade',
  customCss: null,
  layoutStyle: 'centered',
  profileBlur: 0,
  location: null,
  discordUser: null,
  viewCount: 0,
  bgEffect: 'none',
  bgBlur: 0,
  usernameEffect: 'none',
  monochrome: false,
  animatedTitle: false,
  swapBoxColors: false,
  iconColor: '#8b5cf6',
  avatarUrl: null,
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function CustomizePage() {
  const [settings, setSettings] = useState<ProfileSettings>(DEFAULT_SETTINGS)
  const [activeTab, setActiveTab] = useState('general')
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState(false)
  const [autoSaved, setAutoSaved] = useState(false)
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [profile, setProfile] = useState<{
    username: string; displayName?: string | null; bio?: string | null; avatar?: string | null
  } | null>(null)
  const [links, setLinks] = useState<{
    id: string; title: string; url: string; icon: string
    enabled: boolean; order: number; clickCount: number
  }[]>([])
  const [description, setDescription] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const [pr, lr] = await Promise.all([fetch('/api/profile'), fetch('/api/links')])
        const pd = await pr.json()
        const ld = await lr.json()
        if (pd.profile) setSettings({ ...DEFAULT_SETTINGS, ...pd.profile })
        if (pd.user) { setProfile(pd.user); setDescription(pd.user.bio || '') }
        if (ld.links) setLinks(ld.links)
      } catch { toast.error('Failed to load settings') }
      finally { setLoading(false) }
    }
    load()
  }, [])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSaveBio = useCallback(
    debounce((...args: unknown[]) => {
      const bio = args[0] as string
      fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio }),
      }).catch(() => { })
    }, 800),
    []
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(debounce(async (data: ProfileSettings) => {
    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      setAutoSaved(true)
      setTimeout(() => setAutoSaved(false), 2000)
    } catch { /* silent */ }
  }, 800), [])

  const update = (key: keyof ProfileSettings, value: unknown) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value }
      debouncedSave(next)
      return next
    })
  }

  const handleSetDescription = (val: string) => {
    setDescription(val)
    debouncedSaveBio(val)
  }
  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      toast.success('Saved!');
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };


  if (loading) return (
    <div className="dashboard-surface flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-7 h-7 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        <p className="text-white/30 text-sm">Loading your settings…</p>
      </div>
    </div>
  )

  return (
    <div className="dashboard-surface flex h-screen overflow-hidden">

      {/* ── Left panel ─────────────────────────────────────── */}
      <aside className="w-[336px] flex-shrink-0 flex flex-col" style={{
        background: '#0f1117',
        borderRight: '1px solid rgba(255,255,255,0.08)',
      }}>

        {/* Header */}
        <div style={{
          padding: '20px 18px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div>
            <p style={{ fontSize: 11, color: 'rgba(167,139,250,0.85)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 5px', fontWeight: 700 }}>
              Customize
            </p>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.42)', height: 14 }}>
              {autoSaved && <span style={{ color: 'rgba(110,231,183,0.7)' }}>✓ Saved</span>}
            </div>
          </div>
          <button
            onClick={handleSave} disabled={saving}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', borderRadius: 10,
              fontSize: 12, fontWeight: 500, border: 'none', cursor: 'pointer',
              background: '#ffffff',
              color: '#080809',
              transition: 'background 0.2s', opacity: saving ? 0.5 : 1,
            }}
          >
            <Save size={11} /> {saving ? 'Saving…' : 'Save'}
          </button>
        </div>

        {/* Tab grid */}
        <div style={{
          flexShrink: 0, padding: '12px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 4,
        }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                padding: '9px 4px', borderRadius: 10,
                fontSize: 10, fontWeight: 500, cursor: 'pointer',
                background: activeTab === tab.id ? 'rgba(139,92,246,0.16)' : 'rgba(255,255,255,0.025)',
                color: activeTab === tab.id ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.42)',
                border: activeTab === tab.id ? '1px solid rgba(139,92,246,0.28)' : '1px solid transparent',
                transition: 'all 0.18s',
                letterSpacing: '0.02em',
              }}
            >
              <tab.icon size={13} style={{ opacity: activeTab === tab.id ? 0.85 : 0.4 }} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="p-4 space-y-5 pb-8"
            >
              {activeTab === 'general' && (
                <GeneralTab
                  settings={settings} update={update}
                  description={description} setDescription={handleSetDescription}
                />
              )}
              {activeTab === 'colors' && <ColorsTab settings={settings} update={update} />}
              {activeTab === 'background' && <BackgroundTab settings={settings} update={update} />}
              {activeTab === 'audio' && <AudioTab settings={settings} update={update} />}
              {activeTab === 'effects' && <EffectsTab settings={settings} update={update} />}
              {activeTab === 'layout' && <LayoutTab settings={settings} update={update} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </aside>

      {/* ── Right preview — VisionOS 3D Studio ─────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#0b0c0f' }}>

        {/* Studio toolbar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 20px',
          background: '#101217',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Live preview
          </span>
          <div style={{
            display: 'flex', gap: 4,
            background: 'rgba(255,255,255,0.035)',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 9, padding: 3,
          }}>
            {(['desktop', 'mobile'] as const).map(d => (
              <button
                key={d}
                onClick={() => setPreviewDevice(d)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '5px 12px', borderRadius: 7,
                  fontSize: 11, fontWeight: 500, border: 'none', cursor: 'pointer',
                  background: previewDevice === d ? '#ffffff' : 'transparent',
                  color: previewDevice === d ? '#080809' : 'rgba(255,255,255,0.45)',
                  transition: 'all 0.18s',
                }}
              >
                {d === 'desktop' ? <Monitor size={11} /> : <Smartphone size={11} />}
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Card Preview canvas */}
        <div
          className="flex-1 overflow-hidden flex items-center justify-center"
          style={{
            perspective: '1400px',
            perspectiveOrigin: '50% 45%',
            background: '#0b0c0f',
            position: 'relative',
          }}
        >
          {/* Ambient glow */}
          <div style={{
            position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)',
            width: 500, height: 400, borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(139,92,246,0.07) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <AnimatePresence mode="wait">
            <motion.div
              key={previewDevice}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: previewDevice === 'desktop' ? 24 : 0,
                transformStyle: 'preserve-3d',
                width: '100%', height: '100%',
                padding: previewDevice === 'desktop' ? '40px 60px' : '24px',
              }}
            >
              {previewDevice === 'desktop' ? (

                <>

                  {/* Center card — primary focus */}
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.05, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -4 }}
                    style={{
                      transformStyle: 'preserve-3d',
                      width: '80%',
                      maxWidth: 1100,
                      aspectRatio: '16/9', // tỷ lệ màn hình desktop ngang
                      borderRadius: 16,
                      overflow: 'hidden',
                      boxShadow: '0 32px 64px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1)',
                      zIndex: 10,
                      flexShrink: 0,
                      cursor: 'default',
                      transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                    }}
                  >
                    {/* Browser chrome */}
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20,
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '8px 12px',
                      background: 'rgba(0,0,0,0.4)',
                      backdropFilter: 'blur(12px)',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                    }}>
                      <div style={{ display: 'flex', gap: 5 }}>
                        {['rgba(255,95,87,0.7)', 'rgba(255,189,68,0.7)', 'rgba(39,201,63,0.7)'].map((c, i) => (
                          <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
                        ))}
                      </div>
                      <div style={{
                        flex: 1, textAlign: 'center',
                        background: 'rgba(255,255,255,0.05)', borderRadius: 6,
                        padding: '2px 8px', fontSize: 9, color: 'rgba(255,255,255,0.2)',
                        maxWidth: 140, margin: '0 auto',
                      }}>
                        biosite.app/u/{profile?.username || 'you'}
                      </div>
                    </div>

                    <div style={{ position: 'absolute', inset: 0, paddingTop: 28 }}>
                      {profile && (
                        <ProfilePreview
                          settings={settings}
                          user={{ ...profile, bio: description || profile.bio, avatarUrl: (settings as any).avatarUrl ?? null }}
                          links={links.filter(l => l.enabled)}
                        />
                      )}
                    </div>
                  </motion.div>
                </>
              ) : (
                /* Mobile single card */
                <motion.div
                  key="mobile"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    width: 300, height: 580,
                    borderRadius: 32, overflow: 'hidden',
                    boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.09)',
                  }}
                >
                  {profile && (
                    <ProfilePreview
                      settings={settings}
                      user={{ ...profile, bio: description || profile.bio, avatarUrl: (settings as any).avatarUrl ?? null }}
                      links={links.filter(l => l.enabled)}
                    />
                  )}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Auto-save indicator */}
          <div style={{
            position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
            fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.06em',
          }}>
            {autoSaved ? '✓ Saved' : 'Changes save automatically'}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Shared UI primitives ─────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.22)',
      letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 8px',
    }}>
      {children}
    </p>
  )
}

function Divider() {
  return <div style={{ height: 1, background: 'rgba(255,255,255,0.045)', margin: '4px 0' }} />
}

function Toggle({ label, desc, value, onChange }: {
  label: string; desc?: string; value: boolean; onChange: (v: boolean) => void
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.72)', margin: 0 }}>{label}</p>
        {desc && <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 2, margin: '2px 0 0', lineHeight: 1.4 }}>{desc}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        style={{
          position: 'relative', flexShrink: 0,
          width: 36, height: 20, borderRadius: 10,
          background: value ? 'rgba(167,139,250,0.5)' : 'rgba(255,255,255,0.1)',
          border: value ? '1px solid rgba(167,139,250,0.4)' : '1px solid rgba(255,255,255,0.08)',
          cursor: 'pointer', transition: 'all 0.2s',
        }}
      >
        <div style={{
          position: 'absolute', top: 2,
          width: 14, height: 14, borderRadius: '50%',
          background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
          transition: 'left 0.2s cubic-bezier(0.34,1.56,0.64,1)',
          left: value ? 19 : 3,
        }} />
      </button>
    </div>
  )
}

function SliderInput({ label, value, min, max, step = 1, onChange, unit = '' }: {
  label: string; value: number; min: number; max: number
  step?: number; onChange: (v: number) => void; unit?: string
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', margin: 0 }}>{label}</p>
          <span style={{
            fontSize: 10, fontFamily: 'monospace',
            color: 'rgba(255,255,255,0.4)',
            background: 'rgba(255,255,255,0.06)',
            padding: '2px 7px', borderRadius: 6,
          }}>{value}{unit}</span>
        </div>
      )}
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{
          width: '100%', height: 3, borderRadius: 2,
          appearance: 'none', outline: 'none', cursor: 'pointer',
          background: `linear-gradient(to right, rgba(167,139,250,0.7) 0%, rgba(167,139,250,0.7) ${pct}%, rgba(255,255,255,0.1) ${pct}%, rgba(255,255,255,0.1) 100%)`,
        }}
      />
    </div>
  )
}

// ── Color Picker ─────────────────────────────────────────────────────────────

function ColorPicker({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [hex, setHex] = useState(value)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => { setHex(value) }, [value])

  useEffect(() => {
    if (!open) return
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [open])

  const applyHex = (v: string) => {
    setHex(v)
    if (/^#[0-9a-fA-F]{6}$/.test(v)) onChange(v)
  }

  return (
    <div style={{ position: 'relative' }} ref={ref}>
      {label && <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 6, letterSpacing: '0.05em', margin: '0 0 6px' }}>{label}</p>}

      <button
        onClick={() => setOpen(p => !p)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 11px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 11, cursor: 'pointer', transition: 'all 0.18s',
        }}
      >
        <div style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, background: value, boxShadow: '0 0 0 1px rgba(255,255,255,0.1) inset' }} />
        <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'rgba(255,255,255,0.5)', flex: 1, textAlign: 'left' }}>{value.toUpperCase()}</span>
        <ChevronDown size={11} style={{ color: 'rgba(255,255,255,0.2)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.14 }}
            style={{
              position: 'absolute', zIndex: 50, top: 'calc(100% + 6px)', left: 0, right: 0,
              background: 'rgba(18,18,22,0.97)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 14, padding: 12,
              boxShadow: '0 24px 60px rgba(0,0,0,0.7)',
            }}
          >
            <div style={{ position: 'relative', marginBottom: 9, borderRadius: 8, overflow: 'hidden', height: 36, cursor: 'pointer' }}>
              <input type="color" value={value} onChange={e => { onChange(e.target.value); setHex(e.target.value) }}
                style={{ position: 'absolute', inset: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right,#ff0000,#ffff00,#00ff00,#00ffff,#0000ff,#ff00ff,#ff0000)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', pointerEvents: 'none', fontSize: 9, color: 'rgba(255,255,255,0.45)' }}>
                Click to pick color
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 9 }}>
              <div style={{ width: 24, height: 24, borderRadius: 7, background: value, flexShrink: 0 }} />
              <input type="text" value={hex} onChange={e => applyHex(e.target.value)} maxLength={7} placeholder="#000000"
                style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 7, padding: '4px 9px', fontSize: 11, fontFamily: 'monospace', color: 'rgba(255,255,255,0.7)', outline: 'none' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10,1fr)', gap: 4 }}>
              {PRESET_COLORS.map(c => (
                <button key={c} onClick={() => { onChange(c); setHex(c); setOpen(false) }} title={c}
                  style={{
                    width: '100%', aspectRatio: '1/1', borderRadius: 5, background: c, cursor: 'pointer',
                    border: value.toLowerCase() === c ? '2px solid rgba(255,255,255,0.6)' : '1px solid rgba(255,255,255,0.06)',
                    transition: 'transform 0.12s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.15)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Gradient Builder ─────────────────────────────────────────────────────────

function GradientBuilder({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [angle, setAngle] = useState(135)
  const [from, setFrom] = useState('#0d0d1a')
  const [to, setTo] = useState('#1a0d2e')

  const build = (a: number, f: string, t: string) => `linear-gradient(${a}deg,${f} 0%,${t} 100%)`

  const apply = (a: number, f: string, t: string) => {
    setAngle(a); setFrom(f); setTo(t)
    onChange(build(a, f, t))
  }

  const preview = value || build(angle, from, to)

  return (
    <div className="space-y-4">
      <div className="w-full h-20 rounded-2xl ring-1 ring-white/10 transition-all duration-300" style={{ background: preview }} />

      <div>
        <SectionLabel>Presets</SectionLabel>
        <div className="grid grid-cols-4 gap-2">
          {GRADIENT_PRESETS.map(p => (
            <button
              key={p.name}
              onClick={() => { setFrom(p.from); setTo(p.to); setAngle(135); onChange(p.value) }}
              className="group relative h-12 rounded-xl ring-1 ring-white/10 hover:ring-purple-500/40 overflow-hidden transition-all"
              style={{ background: p.value }}
              title={p.name}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/40 flex items-end justify-center pb-1 transition-opacity">
                <span className="text-[10px] text-white font-medium">{p.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>Custom</SectionLabel>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <ColorPicker label="From" value={from} onChange={c => apply(angle, c, to)} />
          <ColorPicker label="To" value={to} onChange={c => apply(angle, from, c)} />
        </div>
        <SliderInput label="Angle" value={angle} min={0} max={360} onChange={a => apply(a, from, to)} unit="°" />
      </div>
    </div>
  )
}

// ── Image Uploader ───────────────────────────────────────────────────────────

function ImageUploader({ label, value, onChange, accept = 'image/*' }: {
  label: string; value: string | null; onChange: (v: string) => void; accept?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleFile = (file: File) => {
    setLoading(true)
    const reader = new FileReader()
    reader.onload = e => { onChange(e.target?.result as string); setLoading(false) }
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <p className="text-xs text-white/35 mb-1.5">{label}</p>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
        className={`relative w-full rounded-2xl border-2 border-dashed cursor-pointer overflow-hidden transition-all ${dragging ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 hover:border-white/25 bg-white/[0.02] hover:bg-white/[0.04]'
          }`}
        style={{ minHeight: value ? 120 : 80 }}
      >
        {value ? (
          <>
            <img src={value} alt="" className="w-full object-cover" style={{ maxHeight: 140 }} />
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
              <Upload size={18} className="text-white" />
              <span className="text-xs text-white/80">Click to change</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 gap-2">
            {loading
              ? <div className="w-5 h-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
              : <>
                <Upload size={18} className="text-white/25" />
                <p className="text-xs text-white/35">Click to upload a file</p>
                <p className="text-[10px] text-white/20">or drag & drop</p>
              </>
            }
          </div>
        )}
        <input ref={inputRef} type="file" accept={accept} className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
      </div>
      {value && (
        <button onClick={() => onChange('')} className="mt-1.5 text-[11px] text-red-400/50 hover:text-red-400 flex items-center gap-1 transition-colors">
          <X size={10} /> Remove
        </button>
      )}
    </div>
  )
}

// ── Tab: General ─────────────────────────────────────────────────────────────

function GeneralTab({
  settings, update, description, setDescription,
}: {
  settings: ProfileSettings; update: (k: keyof ProfileSettings, v: unknown) => void
  description: string; setDescription: (v: string) => void
}) {
  return (
    <div className="space-y-5">
      {/* Description */}
      <div>
        <SectionLabel>Description</SectionLabel>
        <textarea
          value={description} onChange={e => setDescription(e.target.value)}
          placeholder="this is my description" maxLength={160} rows={3}
          style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 11, padding: "10px 13px", fontSize: 12, color: "rgba(255,255,255,0.78)", outline: "none", resize: "none" }}
        />
        <p className="text-right text-[10px] text-white/20 mt-1">{description.length}/160</p>
      </div>

      <Divider />

      {/* Background Effects */}
      <div>
        <SectionLabel>Background Effects</SectionLabel>
        <div className="grid grid-cols-2 gap-1.5">
          {BG_EFFECTS.map(e => (
            <button key={e.id} onClick={() => update('bgEffect', e.id)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium border transition-all ${settings.bgEffect === e.id
                ? 'bg-purple-500/15 border-purple-500/40 text-purple-300'
                : 'bg-white/[0.03] border-white/[0.06] text-white/45 hover:text-white/75 hover:bg-white/[0.05]'
                }`}
            >
              <e.icon size={13} /> {e.label}
            </button>
          ))}
        </div>
      </div>

      {/* Background Blur */}
      <div>
        <SectionLabel>Background Blur</SectionLabel>
        <p className="text-[11px] text-white/30 mb-3 leading-relaxed">
          Blur the background to make your card pop.
        </p>
        <SliderInput label="" value={settings.bgBlur ?? 0} min={0} max={20}
          onChange={v => update('bgBlur', v)} unit="px" />
      </div>

      <Divider />

      {/* Username Effects */}
      <div>
        <SectionLabel>Username Effects</SectionLabel>
        <div className="grid grid-cols-2 gap-1.5">
          {USERNAME_EFFECTS.map(e => (
            <button key={e.id} onClick={() => update('usernameEffect', e.id)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium border transition-all ${settings.usernameEffect === e.id
                ? 'bg-purple-500/15 border-purple-500/40 text-purple-300'
                : 'bg-white/[0.03] border-white/[0.06] text-white/45 hover:text-white/75 hover:bg-white/[0.05]'
                }`}
            >
              <span>{e.icon}</span> {e.label}
            </button>
          ))}
        </div>
      </div>

      <Divider />

      {/* Profile Opacity */}
      <div>
        <SectionLabel>Profile Opacity</SectionLabel>
        <p className="text-[11px] text-white/30 mb-3 leading-relaxed">
          Change how transparent your profile container background looks.
        </p>
        <SliderInput label="" value={Math.round(settings.cardOpacity * 100)} min={0} max={100}
          onChange={v => update('cardOpacity', v / 100)} unit="%" />
      </div>

      {/* Profile Blur */}
      <div>
        <SectionLabel>Profile Blur</SectionLabel>
        <p className="text-[11px] text-white/30 mb-3 leading-relaxed">
          Adjust blur on your profile container background for a softer or sharper look.
        </p>
        <SliderInput label="" value={settings.cardBlur} min={0} max={40}
          onChange={v => update('cardBlur', v)} unit="px" />
      </div>

      <Divider />

      {/* Other */}
      <div>
        <SectionLabel>Other Customization</SectionLabel>
        <div className="space-y-4">
          <Toggle label="Monochrome Icons" desc="Make all icons the same color as your text"
            value={settings.monochrome ?? false} onChange={v => update('monochrome', v)} />
          <Toggle label="Animated Title" desc="Add animation to your display name"
            value={settings.animatedTitle ?? false} onChange={v => update('animatedTitle', v)} />
          <Toggle label="Swap Box Colors" desc="Invert the colors of your link boxes"
            value={settings.swapBoxColors ?? false} onChange={v => update('swapBoxColors', v)} />
        </div>
      </div>

      <Divider />

      {/* Location */}
      <div>
        <SectionLabel>Location</SectionLabel>
        <input type="text" value={settings.location || ''} onChange={e => update('location', e.target.value)}
          placeholder="My Location"
          style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 11, padding: "9px 13px", fontSize: 12, color: "rgba(255,255,255,0.78)", outline: "none" }}
        />
      </div>
    </div>
  )
}

// ── Tab: Colors ──────────────────────────────────────────────────────────────

function ColorsTab({ settings, update }: {
  settings: ProfileSettings; update: (k: keyof ProfileSettings, v: unknown) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  const handleAvatarFile = (file: File) => {
    setUploadingAvatar(true)
    const reader = new FileReader()
    reader.onload = e => {
      update('avatarUrl', e.target?.result as string)
      setUploadingAvatar(false)
    }
    reader.readAsDataURL(file)
  }

  const avatarSrc = (settings as any).avatarUrl

  return (
    <div className="space-y-5">

      {/* Avatar Upload */}
      <div>
        <SectionLabel>Profile Avatar</SectionLabel>
        <div className="flex items-center gap-4">
          {/* Preview circle */}
          <div
            className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white/10 cursor-pointer relative group"
            onClick={() => inputRef.current?.click()}
          >
            {avatarSrc ? (
              <>
                <img src={avatarSrc} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Upload size={16} className="text-white" />
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-white/[0.05] hover:bg-white/[0.08] transition-colors">
                {uploadingAvatar
                  ? <div className="w-4 h-4 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                  : <Upload size={14} className="text-white/30" />
                }
              </div>
            )}
          </div>
          <div className="flex-1">
            <button
              onClick={() => inputRef.current?.click()}
              className="w-full py-2.5 rounded-xl text-xs font-medium border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] text-white/60 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <Upload size={12} /> Click to upload a file
            </button>
            {avatarSrc && (
              <button
                onClick={() => update('avatarUrl', null)}
                className="mt-1.5 text-[11px] text-red-400/50 hover:text-red-400 transition-colors flex items-center gap-1"
              >
                <X size={10} /> Remove avatar
              </button>
            )}
          </div>
          <input
            ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleAvatarFile(f) }}
          />
        </div>
      </div>

      <Divider />

      {/* Text Colors */}
      <div>
        <SectionLabel>Text Colors</SectionLabel>
        <div className="space-y-3">
          <ColorPicker label="Username / Display Name" value={settings.usernameColor || '#ffffff'} onChange={v => update('usernameColor', v)} />
          <ColorPicker label="Handle (@username)" value={settings.handleColor || 'rgba(255,255,255,0.45)'} onChange={v => update('handleColor', v)} />
          <ColorPicker label="Bio / Description" value={settings.bioColor || 'rgba(255,255,255,0.75)'} onChange={v => update('bioColor', v)} />
        </div>
      </div>

      <Divider />

      {/* Link Colors */}
      <div>
        <SectionLabel>Link Colors</SectionLabel>
        <div className="space-y-3">
          <ColorPicker label="Link Text" value={settings.linkTextColor || '#ffffff'} onChange={v => update('linkTextColor', v)} />
          <ColorPicker label="Link Icon" value={settings.linkIconColor || settings.accentColor} onChange={v => update('linkIconColor', v)} />
          <ColorPicker label="Accent / Glow Color" value={settings.accentColor} onChange={v => update('accentColor', v)} />
        </div>
      </div>

      <Divider />

      {/* Font family */}
      <div>
        <SectionLabel>Font Family</SectionLabel>
        <div className="space-y-1.5">
          {FONTS.map(f => (
            <button key={f} onClick={() => update('fontFamily', f)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm border transition-all ${settings.fontFamily === f
                ? 'bg-purple-500/15 border-purple-500/40 text-white'
                : 'bg-white/[0.02] border-white/[0.06] text-white/45 hover:text-white/75 hover:bg-white/[0.04]'
                }`}
            >
              <span className="text-base font-bold w-8 text-center" style={{ fontFamily: f }}>Aa</span>
              <span>{f}</span>
              {settings.fontFamily === f && <Check size={12} className="ml-auto text-purple-400" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Tab: Background ──────────────────────────────────────────────────────────

function BackgroundTab({ settings, update }: {
  settings: ProfileSettings; update: (k: keyof ProfileSettings, v: unknown) => void
}) {
  return (
    <div className="space-y-5">
      <div>
        <SectionLabel>Type</SectionLabel>
        <div className="grid grid-cols-4 gap-1.5">
          {(['color', 'gradient', 'image', 'video'] as const).map(t => (
            <button key={t} onClick={() => update('bgType', t)}
              className={`py-2.5 rounded-xl text-xs font-medium border transition-all capitalize ${settings.bgType === t
                ? 'bg-purple-500/15 border-purple-500/40 text-purple-300'
                : 'bg-white/[0.03] border-white/[0.06] text-white/40 hover:text-white/70'
                }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {settings.bgType === 'color' && (
        <ColorPicker label="Background Color" value={settings.bgColor} onChange={v => update('bgColor', v)} />
      )}
      {settings.bgType === 'gradient' && (
        <GradientBuilder value={settings.bgGradient || ''} onChange={v => update('bgGradient', v)} />
      )}
      {settings.bgType === 'image' && (
        <ImageUploader label="Background Image" value={settings.bgImage || null} onChange={v => update('bgImage', v)} />
      )}
      {settings.bgType === 'video' && (
        <div className="space-y-3">
          <ImageUploader label="Background Video" value={null} onChange={v => update('bgVideo', v)} accept="video/*" />
          <p className="text-[11px] text-white/25">Supports MP4, WebM. Will loop & autoplay muted.</p>
        </div>
      )}
    </div>
  )
}

// ── Tab: Audio ───────────────────────────────────────────────────────────────

function AudioTab({ settings, update }: {
  settings: ProfileSettings; update: (k: keyof ProfileSettings, v: unknown) => void
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
          <Music size={18} className="text-purple-400" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white/80">Background Music</p>
          <p className="text-xs text-white/30 truncate">{settings.audioName || settings.audioUrl || 'No track selected'}</p>
        </div>
      </div>

      <div>
        <SectionLabel>Audio URL</SectionLabel>
        <input type="url" value={settings.audioUrl || ''} onChange={e => update('audioUrl', e.target.value)}
          placeholder="https://example.com/music.mp3"
          style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 11, padding: "9px 13px", fontSize: 12, color: "rgba(255,255,255,0.78)", outline: "none" }}
        />
        <p className="text-[10px] text-white/20 mt-1">Supports .mp3, .ogg, .wav</p>
      </div>

      <div>
        <SectionLabel>Track Name</SectionLabel>
        <input type="text" value={settings.audioName || ''} onChange={e => update('audioName', e.target.value)}
          placeholder="Song — Artist"
          style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 11, padding: "9px 13px", fontSize: 12, color: "rgba(255,255,255,0.78)", outline: "none" }}
        />
      </div>

      <SliderInput label="Volume" value={Math.round(settings.audioVolume * 100)} min={0} max={100}
        onChange={v => update('audioVolume', v / 100)} unit="%" />

      <Divider />

      <Toggle label="Autoplay" desc="Automatically play music when visitors arrive" value={settings.audioAutoplay} onChange={v => update('audioAutoplay', v)} />
    </div>
  )
}

// ── Tab: Effects ─────────────────────────────────────────────────────────────

function EffectsTab({ settings, update }: {
  settings: ProfileSettings; update: (k: keyof ProfileSettings, v: unknown) => void
}) {
  return (
    <div className="space-y-5">
      <div>
        <SectionLabel>Animation Style</SectionLabel>
        <div className="grid grid-cols-2 gap-2">
          {ANIMATION_STYLES.map(s => (
            <button key={s.id} onClick={() => update('animationStyle', s.id)}
              className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-sm border font-medium transition-all ${settings.animationStyle === s.id
                ? 'bg-purple-500/15 border-purple-500/40 text-purple-300'
                : 'bg-white/[0.03] border-white/[0.06] text-white/45 hover:text-white/75'
                }`}
            >
              <span>{s.emoji}</span> {s.label}
            </button>
          ))}
        </div>
      </div>

      <Divider />

      <Toggle label="Particles" desc="Floating particle effects in your background" value={settings.particlesEnabled} onChange={v => update('particlesEnabled', v)} />
      <Toggle label="Glow Effect" desc="Atmospheric glow around your profile card" value={settings.glowEnabled} onChange={v => update('glowEnabled', v)} />

      <AnimatePresence>
        {settings.glowEnabled && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <ColorPicker label="Glow Color" value={settings.glowColor} onChange={v => update('glowColor', v)} />
          </motion.div>
        )}
      </AnimatePresence>

      <Divider />

      <SliderInput label="Border Radius" value={settings.borderRadius} min={0} max={32} onChange={v => update('borderRadius', v)} unit="px" />
    </div>
  )
}

// ── Tab: Layout ──────────────────────────────────────────────────────────────

function LayoutTab({ settings, update }: {
  settings: ProfileSettings; update: (k: keyof ProfileSettings, v: unknown) => void
}) {
  return (
    <div className="space-y-5">
      <div>
        <SectionLabel>Content Alignment</SectionLabel>
        <div className="grid grid-cols-3 gap-2">
          {([
            { id: 'left', label: 'Left', icon: AlignLeft },
            { id: 'centered', label: 'Center', icon: AlignCenter },
            { id: 'right', label: 'Right', icon: AlignRight },
          ] as const).map(o => (
            <button key={o.id} onClick={() => update('layoutStyle', o.id)}
              className={`flex flex-col items-center gap-2 py-3.5 rounded-xl text-xs border font-medium transition-all ${settings.layoutStyle === o.id
                ? 'bg-purple-500/15 border-purple-500/40 text-purple-300'
                : 'bg-white/[0.03] border-white/[0.06] text-white/40 hover:text-white/70'
                }`}
            >
              <o.icon size={15} /> {o.label}
            </button>
          ))}
        </div>
      </div>

      <SliderInput label="Card Opacity" value={Math.round(settings.cardOpacity * 100)} min={0} max={100} onChange={v => update('cardOpacity', v / 100)} unit="%" />
      <SliderInput label="Card Blur" value={settings.cardBlur} min={0} max={40} onChange={v => update('cardBlur', v)} unit="px" />
      <SliderInput label="Profile Blur" value={settings.profileBlur} min={0} max={20} onChange={v => update('profileBlur', v)} unit="px" />
    </div>
  )
}
