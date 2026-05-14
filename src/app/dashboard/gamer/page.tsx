'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Gamepad2, RefreshCw, Check,
  Search, X, ChevronRight, Save, ExternalLink,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { debounce } from '@/lib/utils'
import ValorantCard from '@/components/gamer/valorant-card'
import GearCard from '@/components/gamer/gear-card'

/* ─── Types ──────────────────────────────────────────────────────────────── */

interface GearItem { id: string; name: string; brand: string; type: string; specs: Record<string,string> }

interface GearProfile {
  valorantId: string
  valorantRegion: string
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
  gearEnabled: boolean
  mouse: string
  mouseDpi: string
  mouseSens: string
  keyboard: string
  keySwitches: string
  monitor: string
  monitorHz: string
  monitorRes: string
  headset: string
  mousepad: string
}

const DEFAULT: GearProfile = {
  valorantId: '', valorantRegion: 'eu', valorantEnabled: false,
  valRank: null, valRankTier: null, valRR: null,
  valWinRate: null, valKD: null, valHS: null,
  valTrackerUrl: null, valCachedAt: null,
  statCardBg: 'rgba(255,255,255,0.06)',
  statCardAccent: '#ff4655',
  statCardGlow: false,
  gearEnabled: false,
  mouse: '', mouseDpi: '', mouseSens: '',
  keyboard: '', keySwitches: '',
  monitor: '', monitorHz: '', monitorRes: '',
  headset: '', mousepad: '',
}

/* ─── Gear Picker Dialog ─────────────────────────────────────────────────── */

function GearPicker({
  type, label, currentId, currentName,
  onSelect, onClose,
}: {
  type: string; label: string; currentId: string; currentName: string
  onSelect: (item: GearItem) => void; onClose: () => void
}) {
  const [items, setItems] = useState<GearItem[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/gear-db?type=${type}`)
      .then(r => r.json())
      .then(d => setItems(d.items || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [type])

  const filtered = query
    ? items.filter(i =>
        i.name.toLowerCase().includes(query.toLowerCase()) ||
        i.brand.toLowerCase().includes(query.toLowerCase())
      )
    : items

  const grouped = filtered.reduce<Record<string, GearItem[]>>((acc, item) => {
    if (!acc[item.brand]) acc[item.brand] = []
    acc[item.brand].push(item)
    return acc
  }, {})

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-[#151518] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
        style={{ maxHeight: '70vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
          <div>
            <h2 className="font-semibold text-white text-sm">Select {label}</h2>
            {currentName && (
              <p className="text-[11px] text-white/30 mt-0.5">Current: {currentName}</p>
            )}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/40 hover:text-white transition-all">
            <X size={15} />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-white/[0.06]">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={`Search ${label.toLowerCase()}…`}
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl pl-8 pr-3 py-2 text-sm text-white/80 placeholder-white/20 focus:outline-none focus:border-purple-500/40"
            />
          </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(70vh - 130px)', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent' }}>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-5 h-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-white/25 text-sm py-10">No results</p>
          ) : (
            Object.entries(grouped).map(([brand, brandItems]) => (
              <div key={brand}>
                <div className="px-4 py-2 bg-white/[0.02] border-b border-white/[0.04]">
                  <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">{brand}</p>
                </div>
                {brandItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => { onSelect(item); onClose() }}
                    className={`w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.05] transition-colors border-b border-white/[0.04] group ${currentId === item.id ? 'bg-purple-500/10' : ''}`}
                  >
                    <div className="text-left min-w-0">
                      <p className="text-sm font-medium text-white/85">{item.name}</p>
                      <p className="text-[10px] text-white/30 mt-0.5 font-mono">
                        {Object.entries(item.specs).map(([k,v]) => `${v}`).join(' · ')}
                      </p>
                    </div>
                    {currentId === item.id ? (
                      <Check size={13} className="text-purple-400 flex-shrink-0 ml-3" />
                    ) : (
                      <ChevronRight size={13} className="text-white/15 flex-shrink-0 ml-3 group-hover:text-white/40 transition-colors" />
                    )}
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  )
}

/* ─── Gear Selector Row ──────────────────────────────────────────────────── */

function GearSelector({
  type, label, value, onSelect,
}: {
  type: string; label: string; value: string; onSelect: (item: GearItem) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div>
        <p className="text-xs text-white/35 mb-1.5">{label}</p>
        <button
          onClick={() => setOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#1a1a1f] border border-white/[0.08] rounded-xl hover:border-white/20 transition-all group text-left"
        >
          <span className={`text-sm ${value ? 'text-white/80' : 'text-white/20'}`}>
            {value || `Choose ${label.toLowerCase()}…`}
          </span>
          <ChevronRight size={14} className="text-white/25 group-hover:text-white/60 transition-colors flex-shrink-0" />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <GearPicker
            type={type}
            label={label}
            currentId=""
            currentName={value}
            onSelect={onSelect}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

/* ─── Shared primitives ──────────────────────────────────────────────────── */

function SLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest mb-2.5">{children}</p>
}

function Divider() { return <div className="h-px bg-white/[0.06]" /> }

function Toggle({ label, desc, value, onChange }: { label: string; desc?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm text-white/80">{label}</p>
        {desc && <p className="text-[11px] text-white/30 mt-0.5">{desc}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative rounded-full transition-colors flex-shrink-0 ${value ? 'bg-purple-500' : 'bg-white/10'}`}
        style={{ width: 40, height: 22 }}
      >
        <div className={`absolute top-[3px] w-4 h-4 rounded-full bg-white shadow transition-all ${value ? 'left-[22px]' : 'left-[3px]'}`} />
      </button>
    </div>
  )
}

function TextInput({ label, value, onChange, placeholder, mono = false }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; mono?: boolean
}) {
  return (
    <div>
      <p className="text-xs text-white/35 mb-1.5">{label}</p>
      <input
        type="text" value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-[#1a1a1f] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white/80 placeholder-white/20 focus:outline-none focus:border-purple-500/40 transition-colors ${mono ? 'font-mono' : ''}`}
      />
    </div>
  )
}

const TABS = [
  { id: 'valorant', label: 'Valorant' },
  { id: 'gear', label: 'Setup & Gear' },
  { id: 'style', label: 'Card Style' },
]

const ACCENT_PRESETS = [
  { color: '#ff4655', name: 'Val Red' },
  { color: '#8b5cf6', name: 'Purple' },
  { color: '#06b6d4', name: 'Cyan' },
  { color: '#10b981', name: 'Green' },
  { color: '#f59e0b', name: 'Amber' },
  { color: '#ec4899', name: 'Pink' },
  { color: '#ffffff', name: 'White' },
]

/* ─── Main ───────────────────────────────────────────────────────────────── */

export default function GamerPage() {
  const searchParams = useSearchParams()
  const [gp, setGp] = useState<GearProfile>(DEFAULT)
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState('valorant')
  const [autoSaved, setAutoSaved] = useState(false)

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'gear') setActiveTab('gear')
    if (tab === 'gaming' || tab === 'valorant') setActiveTab('valorant')
    if (tab === 'style') setActiveTab('style')
  }, [searchParams])

  useEffect(() => {
    fetch('/api/gamer')
      .then(r => r.json())
      .then(d => { if (d.gamerProfile) setGp({ ...DEFAULT, ...d.gamerProfile }) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(debounce((...args: unknown[]) => {
    const data = args[0] as GearProfile
    fetch('/api/gamer', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(() => {
      setAutoSaved(true)
      setTimeout(() => setAutoSaved(false), 2000)
    }).catch(() => {})
  }, 900), [])

  const update = (key: keyof GearProfile, value: unknown) => {
    setGp(prev => {
      const next = { ...prev, [key]: value }
      debouncedSave(next)
      return next
    })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch('/api/gamer', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gp),
      })
      toast.success('Saved!')
    } catch { toast.error('Failed to save') }
    finally { setSaving(false) }
  }

  const handleRefreshValorant = async () => {
    if (!gp.valorantId.trim()) { toast.error('Enter your Riot ID first'); return }
    setRefreshing(true)
    try {
      const res = await fetch('/api/gamer/refresh', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setGp(prev => ({ ...prev, ...data.gamerProfile }))
      toast.success('Stats loaded!')
    } catch (e: any) {
      toast.error(e.message || 'Failed to fetch stats')
    } finally { setRefreshing(false) }
  }

  if (loading) return (
    <div className="dashboard-surface flex h-full min-h-[400px] items-center justify-center">
      <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="dashboard-surface flex h-screen overflow-hidden">
      {/* ── LEFT ── */}
      <div className="w-[340px] flex-shrink-0 flex flex-col bg-[#111114] border-r border-white/[0.06]">

        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-white/[0.06] flex items-center justify-between flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Gamepad2 size={15} className="text-purple-400" />
              <h1 className="font-semibold text-white text-[15px]">Gamer Profile</h1>
            </div>
            <p className="text-[11px] text-white/25">
              {autoSaved ? <span className="text-green-400 flex items-center gap-1"><Check size={9} /> Saved</span> : 'Valorant stats & gear'}
            </p>
          </div>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-xs font-medium text-white transition-colors disabled:opacity-50">
            <Save size={12} /> {saving ? 'Saving…' : 'Save'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/[0.06] flex-shrink-0">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex-1 py-3 text-[11px] font-medium transition-all ${activeTab === t.id ? 'text-purple-400 border-b-2 border-purple-500' : 'text-white/30 hover:text-white/60'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.07) transparent' }}>
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.14 }} className="space-y-5">

              {/* ── VALORANT ── */}
              {activeTab === 'valorant' && (
                <>
                  <Toggle label="Show Valorant Stats" desc="Display rank card on profile" value={gp.valorantEnabled} onChange={v => update('valorantEnabled', v)} />
                  <Divider />

                  {/* Region */}
                  <div>
                    <SLabel>Region</SLabel>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['eu','na','ap','kr','latam','br'] as const).map(r => (
                        <button
                          key={r}
                          onClick={() => update('valorantRegion', r)}
                          className={`py-2 rounded-xl text-xs font-mono font-bold uppercase border transition-all ${
                            gp.valorantRegion === r
                              ? 'bg-[#ff4655]/15 border-[#ff4655]/40 text-[#ff4655]'
                              : 'bg-white/[0.03] border-white/[0.06] text-white/35 hover:text-white/60'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Riot ID + Fetch */}
                  <div>
                    <SLabel>Riot ID</SLabel>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={gp.valorantId}
                        onChange={e => update('valorantId', e.target.value)}
                        placeholder="Name#TAG"
                        className="flex-1 bg-[#1a1a1f] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm font-mono text-white/80 placeholder-white/20 focus:outline-none focus:border-[#ff4655]/40 transition-colors"
                      />
                      <button
                        onClick={handleRefreshValorant}
                        disabled={refreshing || !gp.valorantId.trim()}
                        title="Fetch stats"
                        className="flex items-center gap-1.5 px-3.5 py-2.5 bg-[#ff4655]/12 hover:bg-[#ff4655]/22 border border-[#ff4655]/25 hover:border-[#ff4655]/50 rounded-xl text-xs font-semibold text-[#ff4655] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
                        {refreshing ? '...' : 'Fetch'}
                      </button>
                    </div>
                  </div>

                  {/* Cached stats — only if loaded */}
                  {gp.valRank && (
                    <>
                      <Divider />
                      <div>
                        <SLabel>Stats</SLabel>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            ['Rank', gp.valRankTier || gp.valRank],
                            ['RR',   gp.valRR !== null ? `${gp.valRR} RR` : '—'],
                            ['K/D',  gp.valKD || '—'],
                            ['Win%', gp.valWinRate || '—'],
                          ].map(([k, v]) => (
                            <div key={k} className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.05]">
                              <p className="text-[9px] text-white/25 uppercase tracking-wider font-semibold">{k}</p>
                              <p className="text-sm font-bold text-white mt-0.5">{v}</p>
                            </div>
                          ))}
                        </div>
                        {gp.valTrackerUrl && (
                          <a
                            href={gp.valTrackerUrl} target="_blank" rel="noopener noreferrer"
                            className="mt-2 flex items-center justify-center gap-2 py-2 rounded-xl text-[11px] text-white/30 hover:text-white/60 hover:bg-white/[0.03] transition-all border border-white/[0.05]"
                          >
                            <ExternalLink size={10} /> tracker.gg
                          </a>
                        )}
                      </div>
                    </>
                  )}
                </>
              )}

              {/* ── GEAR ── */}
              {activeTab === 'gear' && (
                <>
                  <Toggle label="Show Setup Card" desc="Display your peripherals on profile" value={gp.gearEnabled} onChange={v => update('gearEnabled', v)} />
                  <Divider />

                  <div>
                    <SLabel>Mouse</SLabel>
                    <GearSelector type="mouse" label="Mouse model" value={gp.mouse} onSelect={item => { update('mouse', item.name) }} />
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <TextInput label="DPI" value={gp.mouseDpi} onChange={v => update('mouseDpi', v)} placeholder="800" mono />
                      <TextInput label="Sensitivity" value={gp.mouseSens} onChange={v => update('mouseSens', v)} placeholder="0.20" mono />
                    </div>
                  </div>

                  <Divider />

                  <div>
                    <SLabel>Keyboard</SLabel>
                    <GearSelector type="keyboard" label="Keyboard model" value={gp.keyboard} onSelect={item => update('keyboard', item.name)} />
                    <div className="mt-2">
                      <TextInput label="Switches" value={gp.keySwitches} onChange={v => update('keySwitches', v)} placeholder="Lekker 45g" />
                    </div>
                  </div>

                  <Divider />

                  <div>
                    <SLabel>Monitor</SLabel>
                    <GearSelector type="monitor" label="Monitor model" value={gp.monitor} onSelect={item => {
                      update('monitor', item.name)
                      if (item.specs.hz) update('monitorHz', item.specs.hz)
                      if (item.specs.resolution) update('monitorRes', item.specs.resolution)
                    }} />
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <TextInput label="Resolution" value={gp.monitorRes} onChange={v => update('monitorRes', v)} placeholder="1440p" mono />
                      <TextInput label="Hz" value={gp.monitorHz} onChange={v => update('monitorHz', v)} placeholder="165" mono />
                    </div>
                  </div>

                  <Divider />

                  <div>
                    <SLabel>Headset</SLabel>
                    <GearSelector type="headset" label="Headset model" value={gp.headset} onSelect={item => update('headset', item.name)} />
                  </div>

                  <Divider />

                  <div>
                    <SLabel>Mousepad</SLabel>
                    <GearSelector type="mousepad" label="Mousepad model" value={gp.mousepad} onSelect={item => update('mousepad', item.name)} />
                  </div>
                </>
              )}

              {/* ── STYLE ── */}
              {activeTab === 'style' && (
                <>
                  <div>
                    <SLabel>Accent Color</SLabel>
                    <div className="flex gap-2 flex-wrap mb-3">
                      {ACCENT_PRESETS.map(p => (
                        <button key={p.color} onClick={() => update('statCardAccent', p.color)}
                          className="relative w-8 h-8 rounded-xl ring-1 ring-white/10 hover:scale-110 transition-transform"
                          style={{ background: p.color }} title={p.name}>
                          {gp.statCardAccent === p.color && <Check size={11} className="absolute inset-0 m-auto text-white drop-shadow" />}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2.5 bg-[#1a1a1f] border border-white/[0.08] rounded-xl px-3.5 py-2.5">
                      <input type="color" value={gp.statCardAccent.startsWith('#') ? gp.statCardAccent : '#ff4655'}
                        onChange={e => update('statCardAccent', e.target.value)}
                        className="w-6 h-6 rounded cursor-pointer bg-transparent border-0" />
                      <span className="font-mono text-sm text-white/60">{gp.statCardAccent}</span>
                    </div>
                  </div>

                  <Divider />

                  <div>
                    <SLabel>Card Background</SLabel>
                    <div className="space-y-1.5">
                      {[
                        { label: 'Glass', value: 'rgba(255,255,255,0.06)' },
                        { label: 'Dark glass', value: 'rgba(0,0,0,0.35)' },
                        { label: 'Solid', value: '#111114' },
                        { label: 'Accent tint', value: `${gp.statCardAccent}18` },
                      ].map(opt => (
                        <button key={opt.value} onClick={() => update('statCardBg', opt.value)}
                          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm border transition-all ${gp.statCardBg === opt.value ? 'border-purple-500/40 bg-purple-500/10 text-white' : 'border-white/[0.06] bg-white/[0.02] text-white/45 hover:text-white/75'}`}>
                          <div className="w-5 h-5 rounded-lg ring-1 ring-white/10" style={{ background: opt.value }} />
                          {opt.label}
                          {gp.statCardBg === opt.value && <Check size={12} className="ml-auto text-purple-400" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Divider />
                  <Toggle label="Glow Effect" desc="Accent glow shadow around cards" value={gp.statCardGlow} onChange={v => update('statCardGlow', v)} />
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── RIGHT: Preview ── */}
      <div className="dashboard-surface flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06] bg-[#111114] flex-shrink-0">
          <span className="text-xs text-white/30 font-medium">Card Preview</span>
          <span className="text-[11px] text-white/15">Updates as you type</span>
        </div>

        <div className="flex-1 overflow-auto flex items-center justify-center p-8 relative">
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-sm">
            {/* Mock context card */}
            <div style={{
              background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.09)', borderRadius: 20, padding: '18px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                  background: `linear-gradient(135deg, ${gp.statCardAccent}80, ${gp.statCardAccent}25)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: gp.statCardAccent, fontWeight: 800, fontSize: 18,
                }}>G</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>GamerUser</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>@gameruser</div>
                </div>
              </div>

              <ValorantCard
                gp={{
                  ...gp,
                  valorantEnabled: true,
                  valorantId: gp.valorantId || 'PlayerName#TAG',
                  valRankTier: gp.valRankTier || 'Diamond 2',
                  valRank: gp.valRank || 'Diamond 2',
                  valRR: gp.valRR ?? 68,
                  valKD: gp.valKD || '1.42',
                  valWinRate: gp.valWinRate || '54%',
                  valHS: gp.valHS || '22%',
                }}
                isPreview={true}
                cardBlur={16}
              />

              <GearCard
                gp={{
                  ...gp,
                  gearEnabled: true,
                  mouse: gp.mouse || 'Logitech G Pro X Superlight 2',
                  mouseDpi: gp.mouseDpi || '800',
                  mouseSens: gp.mouseSens || '0.20',
                  keyboard: gp.keyboard || 'Wooting 60HE',
                  monitor: gp.monitor || 'LG 27GP850-B',
                  monitorHz: gp.monitorHz || '165',
                }}
                isPreview={true}
                cardBlur={16}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
