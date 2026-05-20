'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useUser, UserButton } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BarChart3,
  Check,
  ExternalLink,
  Gamepad2,
  LayoutDashboard,
  Link2,
  Palette,
  Share2,
  SlidersHorizontal,
} from 'lucide-react'
import toast from 'react-hot-toast'

const navGroups = [
  {
    label: 'Studio',
    items: [
      { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
      { href: '/dashboard/customize', label: 'Identity', icon: Palette },
      { href: '/dashboard/links', label: 'Links', icon: Link2 },
      { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Gaming',
    items: [{ href: '/dashboard/gamer?tab=gaming', label: 'Gaming', icon: Gamepad2 }],
  },
  {
    label: 'Gear',
    items: [{ href: '/dashboard/gamer?tab=gear', label: 'Gear setup', icon: SlidersHorizontal }],
  },
]

const mobileItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/customize', label: 'Identity', icon: Palette },
  { href: '/dashboard/links', label: 'Links', icon: Link2 },
  { href: '/dashboard/gamer?tab=gaming', label: 'Gaming', icon: Gamepad2 },
  { href: '/dashboard/gamer?tab=gear', label: 'Gear', icon: SlidersHorizontal },
]

function isActive(pathname: string, href: string, searchParams?: URLSearchParams) {
  const baseHref = href.split('?')[0]
  if (href.includes('tab=gear')) return pathname === baseHref && searchParams?.get('tab') === 'gear'
  if (href.includes('tab=gaming')) return pathname === baseHref && searchParams?.get('tab') !== 'gear'
  if (baseHref === '/dashboard') return pathname === baseHref
  return pathname.startsWith(baseHref)
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const routeKey = `${pathname}?${searchParams.toString()}`
  const { user } = useUser()
  const [dbUsername, setDbUsername] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch('/api/user').then(r => r.json()).then(d => {
      if (d.user?.username) setDbUsername(d.user.username)
    }).catch(() => {})
  }, [])

  const username = dbUsername || (user?.publicMetadata?.username as string) || user?.username

  const handleShare = async () => {
    if (!username) return
    const url = `${window.location.origin}/u/${username}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('Profile link copied')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Could not copy')
    }
  }

  return (
    <div className="dashboard-surface min-h-screen md:flex">
      <aside className="hidden w-72 flex-shrink-0 flex-col border-r border-white/10 bg-[#090a0d] p-5 md:flex">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-violet-400/30 bg-violet-500/18">
            <div className="h-4 w-4 rounded-md bg-violet-300" />
          </div>
          <div>
            <div className="text-lg font-bold tracking-tight">Glyph</div>
            <div className="text-xs text-white/35">Creator studio</div>
          </div>
        </div>

        <nav className="flex-1 space-y-6">
          {navGroups.map(group => (
            <div key={group.label}>
              <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/28">
                {group.label}
              </div>
              <div className="space-y-1">
                {group.items.map(({ href, label, icon: Icon }) => {
                  const active = isActive(pathname, href, searchParams)
                  return (
                    <Link
                      key={`${group.label}-${href}`}
                      href={href}
                      className={`flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm transition ${
                        active
                          ? 'border-violet-400/30 bg-violet-500/18 text-white shadow-[0_0_26px_rgba(139,92,246,0.12)]'
                          : 'border-transparent text-white/48 hover:border-white/8 hover:bg-white/[0.035] hover:text-white/80'
                      }`}
                    >
                      <Icon size={17} className={active ? 'text-violet-200' : 'text-white/35'} />
                      <span>{label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {username && (
          <div className="space-y-3 rounded-3xl border border-white/8 bg-white/[0.035] p-4">
            <Link
              href={`/u/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-violet-500/22 px-4 py-3 text-sm font-semibold text-violet-100 hover:bg-violet-500/30"
            >
              <ExternalLink size={15} />
              My page
            </Link>
            <button
              onClick={handleShare}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-white/70 hover:bg-white/[0.05]"
            >
              {copied ? <Check size={15} /> : <Share2 size={15} />}
              {copied ? 'Copied' : 'Share profile'}
            </button>
          </div>
        )}

        <div className="mt-4 flex items-center gap-3 rounded-3xl bg-white/[0.035] p-3">
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'w-9 h-9',
                userButtonPopoverCard: 'bg-[#1a1a1e] border border-white/10',
              },
            }}
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white/85">{user?.fullName || user?.username || 'User'}</p>
            <p className="truncate text-xs text-white/35">{username ? `@${username}` : 'No username'}</p>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-40 border-b border-white/10 bg-[#090a0d]/95 px-4 py-3 backdrop-blur md:hidden">
          <div className="mb-3 flex items-center justify-between">
            <div className="font-bold">Glyph</div>
            <UserButton />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {mobileItems.map(({ href, label, icon: Icon }) => {
              const active = isActive(pathname, href, searchParams)
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold ${
                    active ? 'border-violet-400/35 bg-violet-500/22 text-white' : 'border-white/8 bg-white/[0.035] text-white/55'
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </Link>
              )
            })}
          </div>
        </div>

        <main className="min-w-0 flex-1 overflow-auto dashboard-surface">
          <AnimatePresence mode="wait">
            <motion.div
              key={routeKey}
              initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="min-h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
