'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, Eye, Monitor, MousePointerClick, Smartphone, Tablet, TrendingUp } from 'lucide-react'
import { formatNumber } from '@/lib/utils'
import type { AnalyticsData } from '@/types'

const deviceIcons = {
  mobile: Smartphone,
  desktop: Monitor,
  tablet: Tablet,
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState<'7' | '30' | '90'>('30')

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/analytics?days=${range}`)
        setData(await res.json())
      } catch {
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [range])

  const maxViews = useMemo(() => {
    if (!data?.viewsOverTime?.length) return 1
    return Math.max(...data.viewsOverTime.map((d) => d.views), 1)
  }, [data])

  if (loading) {
    return (
      <div className="dashboard-surface min-h-screen p-6 lg:p-10">
        <div className="mb-8 h-9 w-56 animate-pulse rounded-xl bg-white/[0.05]" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-white/[0.05]" />
          ))}
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <div className="h-96 animate-pulse rounded-2xl bg-white/[0.05]" />
          <div className="h-96 animate-pulse rounded-2xl bg-white/[0.05]" />
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="dashboard-surface min-h-screen p-6 lg:p-10">
        <div className="dashboard-panel rounded-2xl p-8">
          <h1 className="text-2xl font-semibold">Analytics unavailable</h1>
          <p className="mt-2 text-sm dashboard-muted">Could not load analytics data right now.</p>
        </div>
      </div>
    )
  }

  const stats = [
    { label: 'Total views', value: formatNumber(data.totalViews), icon: Eye, sub: `${range} day range` },
    { label: 'Today', value: formatNumber(data.todayViews), icon: TrendingUp, sub: 'Views since midnight' },
    { label: 'Total clicks', value: formatNumber(data.totalClicks), icon: MousePointerClick, sub: 'Tracked link events' },
    {
      label: 'CTR',
      value: data.totalViews > 0 ? `${Math.round((data.totalClicks / data.totalViews) * 100)}%` : '0%',
      icon: ArrowUpRight,
      sub: 'Clicks / views',
    },
  ]

  const totalDeviceViews = data.deviceBreakdown.reduce((sum, d) => sum + d.count, 0)

  return (
    <div className="dashboard-surface min-h-screen">
      <div className="mx-auto max-w-[1420px] px-6 py-8 lg:px-10">
        <header className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-300/80">Analytics</p>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Traffic and engagement</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 dashboard-muted">
              A cleaner view of audience activity, link performance, and device mix.
            </p>
          </div>

          <div className="inline-flex w-fit rounded-xl border border-white/10 bg-white/[0.04] p-1">
            {(['7', '30', '90'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setRange(d)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  range === d ? 'bg-white text-black' : 'text-white/55 hover:bg-white/[0.05] hover:text-white'
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, icon: Icon, sub }) => (
            <div key={label} className="dashboard-card rounded-2xl p-5">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-sm dashboard-muted">{label}</span>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] text-violet-200">
                  <Icon size={17} />
                </span>
              </div>
              <div className="text-3xl font-semibold tracking-tight">{value}</div>
              <p className="mt-2 text-xs dashboard-muted">{sub}</p>
            </div>
          ))}
        </section>

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <section className="dashboard-panel rounded-2xl p-6">
            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Views over time</h2>
                <p className="mt-1 text-sm dashboard-muted">Daily page views in the selected range.</p>
              </div>
              <div className="rounded-xl bg-white/[0.05] px-3 py-2 text-right">
                <p className="text-xs dashboard-muted">Peak day</p>
                <p className="text-sm font-semibold">{formatNumber(maxViews)}</p>
              </div>
            </div>

            {data.viewsOverTime.length === 0 ? (
              <div className="flex h-80 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.025] text-sm dashboard-muted">
                No view data yet
              </div>
            ) : (
              <div className="flex h-80 items-end gap-2 rounded-2xl border border-white/8 bg-black/10 p-4">
                {data.viewsOverTime.map((item, i) => {
                  const pct = Math.max((item.views / maxViews) * 100, 3)
                  return (
                    <div key={`${item.date}-${i}`} className="group flex h-full flex-1 flex-col justify-end gap-2">
                      <div
                        className="rounded-t-lg bg-violet-400/80 transition group-hover:bg-violet-300"
                        style={{ height: `${pct}%` }}
                        title={`${item.views} views`}
                      />
                      {i % Math.ceil(data.viewsOverTime.length / 7) === 0 && (
                        <span className="truncate text-[10px] text-white/30">
                          {new Date(item.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          <section className="dashboard-panel rounded-2xl p-6">
            <h2 className="text-xl font-semibold tracking-tight">Devices</h2>
            <p className="mt-1 text-sm dashboard-muted">Where visitors are opening your page.</p>

            <div className="mt-6 space-y-4">
              {data.deviceBreakdown.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.025] p-8 text-center text-sm dashboard-muted">
                  No device data yet
                </div>
              ) : (
                data.deviceBreakdown.map((item) => {
                  const Icon = deviceIcons[item.device as keyof typeof deviceIcons] || Monitor
                  const pct = totalDeviceViews > 0 ? Math.round((item.count / totalDeviceViews) * 100) : 0
                  return (
                    <div key={item.device} className="rounded-xl border border-white/8 bg-white/[0.025] p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05] text-white/70">
                            <Icon size={17} />
                          </span>
                          <span className="capitalize text-sm font-medium">{item.device}</span>
                        </div>
                        <span className="text-sm dashboard-muted">{pct}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                        <div className="h-full rounded-full bg-violet-400" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </section>
        </div>

        <section className="dashboard-panel mt-6 rounded-2xl p-6">
          <h2 className="text-xl font-semibold tracking-tight">Top performing links</h2>
          <p className="mt-1 text-sm dashboard-muted">Ranked by total click count.</p>

          <div className="mt-6 overflow-hidden rounded-xl border border-white/8">
            {data.topLinks.length === 0 ? (
              <div className="p-8 text-center text-sm dashboard-muted">No clicks recorded yet</div>
            ) : (
              data.topLinks.map((link, index) => (
                <div key={link.id} className="grid grid-cols-[42px_1fr_auto] items-center gap-4 border-b border-white/8 px-4 py-4 last:border-b-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05] text-sm font-semibold text-white/45">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white/90">{link.title}</p>
                    <p className="mt-1 text-xs dashboard-muted">Link engagement</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatNumber(link.clicks)}</p>
                    <p className="text-[11px] dashboard-muted">clicks</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
