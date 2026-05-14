'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { Zap, AtSign, ArrowRight, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function OnboardingPage() {
  const { user } = useUser()
  const router = useRouter()
  const [username, setUsername] = useState(
    user?.username || user?.firstName?.toLowerCase() || ''
  )
  const [displayName, setDisplayName] = useState(
    user?.fullName || ''
  )
  const [checking, setChecking] = useState(false)
  const [available, setAvailable] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)

  const checkUsername = async (val: string) => {
    if (val.length < 3) { setAvailable(null); return }
    setChecking(true)
    try {
      const res = await fetch(`/api/user/check-username?username=${encodeURIComponent(val)}`)
      const data = await res.json()
      setAvailable(data.available)
    } finally {
      setChecking(false)
    }
  }

  const handleSubmit = async () => {
    if (!username || !available) return
    setLoading(true)
    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, displayName }),
      })
      if (!res.ok) throw new Error('Failed to create profile')
      toast.success('Profile created!')
      router.push('/dashboard')
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-6">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-20" style={{ background: '#8b5cf6' }} />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full blur-3xl opacity-10" style={{ background: '#c084fc' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg">BioSite</span>
        </div>

        <h1 className="text-4xl font-display font-bold mb-2">Set up your page</h1>
        <p className="text-white/40 mb-10">Choose your unique username to get started.</p>

        <div className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Username</label>
            <div className="relative">
              <AtSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  const val = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '')
                  setUsername(val)
                  setAvailable(null)
                  if (val.length >= 3) {
                    const timer = setTimeout(() => checkUsername(val), 500)
                    return () => clearTimeout(timer)
                  }
                }}
                placeholder="yourname"
                maxLength={30}
                className="w-full bg-surface-2 border border-white/8 rounded-xl px-4 py-3 pl-9 text-white placeholder-white/20 focus:outline-none focus:border-accent transition-colors"
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                {checking && (
                  <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                )}
                {!checking && available === true && (
                  <Check size={16} className="text-green-400" />
                )}
                {!checking && available === false && (
                  <X size={16} className="text-red-400" />
                )}
              </div>
            </div>
            <div className="mt-1.5 text-xs">
              {available === true && <span className="text-green-400">✓ Available!</span>}
              {available === false && <span className="text-red-400">✗ Already taken</span>}
              {!available && username.length >= 1 && username.length < 3 && (
                <span className="text-white/30">Minimum 3 characters</span>
              )}
            </div>
            <p className="mt-1 text-xs text-white/30">
              biosite.app/u/{username || 'yourname'}
            </p>
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your Name"
              maxLength={50}
              className="w-full bg-surface-2 border border-white/8 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!username || !available || loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-accent text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-purple-500 transition-all hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Create my page <ArrowRight size={16} /></>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
