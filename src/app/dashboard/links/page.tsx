'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import {
  Plus, Trash2, GripVertical, Edit3, Check, X, ExternalLink,
  Link2, Eye, EyeOff, MousePointerClick
} from 'lucide-react'
import toast from 'react-hot-toast'
import { detectSocialIcon, formatNumber } from '@/lib/utils'

interface LinkItem {
  id: string
  title: string
  url: string
  icon: string
  color?: string | null
  order: number
  enabled: boolean
  clickCount: number
}

const ICON_OPTIONS = [
  'link', 'twitter', 'instagram', 'youtube', 'twitch', 'discord',
  'github', 'music', 'linkedin', 'facebook', 'mail', 'globe',
  'star', 'heart', 'camera', 'video', 'mic', 'gamepad',
]

export default function LinksPage() {
  const [links, setLinks] = useState<LinkItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [newLink, setNewLink] = useState({ title: '', url: '', icon: 'link', color: '' })
  const [saving, setSaving] = useState(false)

  const fetchLinks = useCallback(async () => {
    try {
      const res = await fetch('/api/links')
      const data = await res.json()
      // Filter out any invalid links
      const validLinks = (data.links || []).filter((link: any) => link && link.id)
      setLinks(validLinks)
    } catch {
      toast.error('Failed to load links')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchLinks() }, [fetchLinks])

  const addLink = async () => {
    if (!newLink.title || !newLink.url) return
    setSaving(true)
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newLink,
          icon: newLink.icon || detectSocialIcon(newLink.url),
        }),
      })
      const data = await res.json()
      setLinks(prev => [...prev, data.link].filter(link => link && link.id))
      setNewLink({ title: '', url: '', icon: 'link', color: '' })
      setShowAdd(false)
      toast.success('Link added!')
    } catch {
      toast.error('Failed to add link')
    } finally {
      setSaving(false)
    }
  }

  const updateLink = async (id: string, updates: Partial<LinkItem>) => {
    try {
      await fetch(`/api/links/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      setLinks(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l).filter(link => link && link.id))
    } catch {
      toast.error('Failed to update link')
    }
  }

  const deleteLink = async (id: string) => {
    try {
      await fetch(`/api/links/${id}`, { method: 'DELETE' })
      setLinks(prev => prev.filter(l => l.id !== id))
      toast.success('Link deleted')
    } catch {
      toast.error('Failed to delete link')
    }
  }

  const handleReorder = async (newOrder: LinkItem[]) => {
    // Filter out any invalid items before setting state
    const validOrder = newOrder.filter(link => link && link.id)
    setLinks(validOrder)

    // Only send reorder request if there are valid items
    if (validOrder.length > 0) {
      await fetch('/api/links/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: validOrder.map((l, i) => ({ id: l.id, order: i })) }),
      })
    }
  }

  // Helper function to check if link is valid
  const isValidLink = (link: any): link is LinkItem => {
    return link && typeof link === 'object' && link.id && link.title
  }

  // Get valid links for rendering
  const validLinks = links.filter(isValidLink)

  return (
    <div className="dashboard-surface min-h-full w-full p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold mb-1">Links</h1>
          <p className="text-white/40 text-sm">Manage and reorder your profile links</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-accent rounded-xl text-sm font-medium hover:bg-purple-500 transition-colors"
        >
          <Plus size={16} /> Add Link
        </button>
      </div>

      {/* Add Link Form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="glass rounded-2xl p-6 mb-6 overflow-hidden"
          >
            <h3 className="font-semibold mb-5">Add New Link</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-white/40 mb-1.5">Title</label>
                <input
                  type="text"
                  value={newLink.title}
                  onChange={e => setNewLink(p => ({ ...p, title: e.target.value }))}
                  placeholder="My Twitter"
                  className="w-full bg-surface-3 border border-white/8 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1.5">URL</label>
                <input
                  type="url"
                  value={newLink.url}
                  onChange={e => {
                    const url = e.target.value
                    setNewLink(p => ({ ...p, url, icon: detectSocialIcon(url) }))
                  }}
                  placeholder="https://twitter.com/..."
                  className="w-full bg-surface-3 border border-white/8 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-accent"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-xs text-white/40 mb-1.5">Icon</label>
              <div className="flex flex-wrap gap-2">
                {ICON_OPTIONS.map(ico => (
                  <button
                    key={ico}
                    onClick={() => setNewLink(p => ({ ...p, icon: ico }))}
                    className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${newLink.icon === ico
                      ? 'bg-accent border-accent text-white'
                      : 'border-white/8 text-white/40 hover:text-white hover:border-white/20'
                      }`}
                  >
                    {ico}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={addLink}
                disabled={saving || !newLink.title || !newLink.url}
                className="flex items-center gap-2 px-4 py-2 bg-accent rounded-xl text-sm font-medium disabled:opacity-40"
              >
                {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={14} />}
                Add Link
              </button>
              <button
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/5"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Links list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass rounded-2xl h-20 shimmer" />
          ))}
        </div>
      ) : validLinks.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center">
          <Link2 size={40} className="text-white/10 mx-auto mb-4" />
          <p className="text-white/30">No links yet. Add your first one!</p>
        </div>
      ) : (
        <Reorder.Group axis="y" values={validLinks} onReorder={handleReorder} className="space-y-3">
          {validLinks.map(link => (
            <Reorder.Item key={link.id} value={link}>
              <motion.div
                layout
                className="glass glass-hover rounded-2xl p-4 flex items-center gap-4"
              >
                <div className="cursor-grab active:cursor-grabbing text-white/20 hover:text-white/50 transition-colors">
                  <GripVertical size={18} />
                </div>

                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-mono"
                  style={{
                    background: link.color ? `${link.color}25` : 'rgba(139,92,246,0.15)',
                    color: link.color || '#8b5cf6'
                  }}
                >
                  {link.icon?.substring(0, 2) || '??'}
                </div>

                {editingId === link.id ? (
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <input
                      defaultValue={link.title}
                      onBlur={e => updateLink(link.id, { title: e.target.value })}
                      className="bg-surface-3 border border-accent/50 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none"
                      autoFocus
                    />
                    <input
                      defaultValue={link.url}
                      onBlur={e => updateLink(link.id, { url: e.target.value })}
                      className="bg-surface-3 border border-accent/50 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none"
                    />
                  </div>
                ) : (
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{link.title}</div>
                    <div className="text-xs text-white/30 truncate">{link.url}</div>
                  </div>
                )}

                <div className="flex items-center gap-1 flex-shrink-0">
                  <div className="text-xs text-white/30 font-mono px-2 flex items-center gap-1">
                    <MousePointerClick size={12} />
                    {formatNumber(link.clickCount || 0)}
                  </div>

                  <button
                    onClick={() => updateLink(link.id, { enabled: !link.enabled })}
                    className={`p-1.5 rounded-lg transition-colors ${link.enabled ? 'text-green-400 hover:bg-green-400/10' : 'text-white/20 hover:bg-white/5'}`}
                  >
                    {link.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>

                  <button
                    onClick={() => setEditingId(editingId === link.id ? null : link.id)}
                    className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    {editingId === link.id ? <X size={14} /> : <Edit3 size={14} />}
                  </button>

                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <ExternalLink size={14} />
                  </a>

                  <button
                    onClick={() => deleteLink(link.id)}
                    className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}
    </div>
  )
}
