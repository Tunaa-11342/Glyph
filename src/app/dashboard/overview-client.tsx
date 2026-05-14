'use client'

import Link from 'next/link'
import { BarChart3, CheckCircle2, ExternalLink, Gamepad2, Link2, MousePointerClick, Palette, TrendingUp, Eye } from 'lucide-react'
import { formatNumber } from '@/lib/utils'

interface Props {
  data: {
    user: {
      username: string
      displayName?: string | null
      avatar?: string | null
    }
    stats: {
      totalViews: number
      totalLinks: number
      totalClicks: number
      viewsToday: number
    }
    links: {
      id: string
      title: string
      url: string
      clickCount: number
    }[]
  }
}

export default function DashboardOverviewClient({ data }: Props) {
  const { user, stats, links } = data
  const firstName = user.displayName?.split(' ')[0] || user.username

  const statItems = [
    { label: 'Total views', value: stats.totalViews, sub: `${formatNumber(stats.viewsToday)} today`, icon: Eye, accent: '#a855f7', tint: 'rgba(168,85,247,0.18)' },
    { label: 'Active links', value: stats.totalLinks, sub: 'Published on profile', icon: Link2, accent: '#38bdf8', tint: 'rgba(56,189,248,0.16)' },
    { label: 'Total clicks', value: stats.totalClicks, sub: 'Across all links', icon: MousePointerClick, accent: '#34d399', tint: 'rgba(52,211,153,0.16)' },
    { label: 'Click rate', value: stats.totalViews ? Math.round((stats.totalClicks / stats.totalViews) * 100) : 0, suffix: '%', sub: 'Clicks / views', icon: TrendingUp, accent: '#f59e0b', tint: 'rgba(245,158,11,0.16)' },
  ]

  const quickActions = [
    { href: '/dashboard/customize', label: 'Customize profile', desc: 'Theme, background, audio, effects', icon: Palette },
    { href: '/dashboard/links', label: 'Manage links', desc: 'Add, reorder, enable, disable', icon: Link2 },
    { href: '/dashboard/analytics', label: 'Open analytics', desc: 'Views, clicks, devices', icon: BarChart3 },
    { href: '/dashboard/gamer', label: 'Gamer cards', desc: 'Valorant stats and gear', icon: Gamepad2 },
  ]

  return (
    <div className="dashboard-surface min-h-screen">
      <div className="mx-auto max-w-[1420px] px-6 py-8 lg:px-10">
        <header className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-300/80">Dashboard</p>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Welcome back, {firstName}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 dashboard-muted">
              Manage the public page people see, keep links current, and watch the numbers that matter.
            </p>
          </div>

          <Link
            href={`/u/${user.username}`}
            target="_blank"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            <ExternalLink size={16} />
            View public profile
          </Link>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statItems.map(({ label, value, suffix, sub, icon: Icon, accent, tint }) => (
            <div
              key={label}
              className="relative overflow-hidden rounded-3xl border p-5"
              style={{
                background: `linear-gradient(135deg, ${tint}, rgba(21,25,35,0.96) 58%)`,
                borderColor: `${accent}44`,
                boxShadow: `0 18px 42px ${accent}12`,
              }}
            >
              <div className="absolute right-[-36px] top-[-42px] h-32 w-32 rounded-full opacity-25 blur-2xl" style={{ background: accent }} />
              <div className="mb-5 flex items-center justify-between">
                <span className="text-sm text-white/70">{label}</span>
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10" style={{ background: `${accent}22`, color: accent }}>
                  <Icon size={17} />
                </span>
              </div>
              <div className="text-3xl font-semibold tracking-tight">
                {formatNumber(value)}{suffix || ''}
              </div>
              <p className="mt-2 text-xs text-white/48">{sub}</p>
            </div>
          ))}
        </section>

        <section className="dashboard-panel mt-6 rounded-3xl p-6">
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Profile completion</h2>
              <p className="mt-1 text-sm dashboard-muted">A quick checklist for a stronger public page.</p>
            </div>
            <div className="text-sm font-semibold text-violet-200">3 of 5 ready</div>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-white/[0.06]">
            <div className="h-full w-[60%] rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-400 to-cyan-300" />
          </div>
          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
            {[
              ['Add avatar', Boolean(user.avatar)],
              ['Write bio', Boolean(user.displayName)],
              ['Publish links', stats.totalLinks > 0],
              ['Enable gaming', false],
              ['Reach 10 views', stats.totalViews >= 10],
            ].map(([label, done]) => (
              <div key={String(label)} className="flex items-center gap-2 rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3 text-sm">
                <CheckCircle2 size={16} className={done ? 'text-emerald-300' : 'text-white/28'} />
                <span className={done ? 'text-white/80' : 'text-white/45'}>{label}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <section className="dashboard-panel rounded-2xl p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Top links</h2>
                <p className="mt-1 text-sm dashboard-muted">The five active links with the most clicks.</p>
              </div>
              <Link href="/dashboard/links" className="rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-white/70 hover:bg-white/[0.05]">
                Edit links
              </Link>
            </div>

            {links.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-10 text-center">
                <p className="text-sm text-white/70">No active links yet.</p>
                <Link href="/dashboard/links" className="mt-4 inline-flex rounded-lg bg-violet-500 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-400">
                  Add your first link
                </Link>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-white/8">
                {links.map((link, index) => (
                  <div key={link.id} className="grid grid-cols-[42px_1fr_auto] items-center gap-4 border-b border-white/8 px-4 py-4 last:border-b-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05] text-sm font-semibold text-white/45">
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white/90">{link.title}</p>
                      <p className="mt-1 truncate text-xs dashboard-muted">{link.url}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatNumber(link.clickCount)}</p>
                      <p className="text-[11px] dashboard-muted">clicks</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <aside className="dashboard-panel rounded-2xl p-6">
            <h2 className="text-xl font-semibold tracking-tight">Next actions</h2>
            <p className="mt-1 text-sm dashboard-muted">Shortcuts for the core editing flow.</p>

            <div className="mt-6 space-y-3">
              {quickActions.map(({ href, label, desc, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-4 rounded-xl border border-white/8 bg-white/[0.025] p-4 transition hover:bg-white/[0.055]"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/12 text-violet-200">
                    <Icon size={18} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-white/90">{label}</span>
                    <span className="mt-0.5 block truncate text-xs dashboard-muted">{desc}</span>
                  </span>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
