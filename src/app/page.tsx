'use client'

import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, Palette, BarChart3, Music, Globe, Star } from 'lucide-react'

export default function HomePage() {
  const { isSignedIn } = useUser()

  return (
    <div className="min-h-screen bg-surface overflow-hidden">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #c084fc, transparent)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 blur-3xl"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }}
        />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">BioSite</span>
        </div>
        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:bg-purple-500 transition-colors"
            >
              Dashboard <ArrowRight size={14} />
            </Link>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:bg-purple-500 transition-colors"
              >
                Get Started Free
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 text-center pt-24 pb-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-white/60 mb-8">
            <Star size={12} className="text-accent" />
            <span>Your personal site engine</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tight mb-6 leading-[0.95]">
            One link.{' '}
            <span className="accent-gradient-text">Infinite</span>
            <br />
            personality.
          </h1>

          <p className="text-lg text-white/50 max-w-xl mx-auto mb-10 leading-relaxed">
            Build a stunning personal profile page with custom themes, background music, link management, and real-time analytics. Not just a link-in-bio — your mini personal site.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/sign-up"
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-accent text-white font-semibold hover:bg-purple-500 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]"
            >
              Create your page <ArrowRight size={16} />
            </Link>
            <Link
              href="/u/demo"
              className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-white/10 text-white/70 font-medium hover:bg-white/5 hover:text-white transition-all"
            >
              View demo
            </Link>
          </div>
        </motion.div>

        {/* Preview mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 max-w-4xl mx-auto"
        >
          <div className="relative rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 px-4 py-3 bg-surface-2 border-b border-white/6">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-surface-3 rounded-md px-3 py-1 text-xs text-white/30 text-center max-w-48 mx-auto">
                  biosite.app/u/yourname
                </div>
              </div>
            </div>
            <div
              className="relative h-80 flex flex-col items-center justify-center gap-4"
              style={{ background: 'linear-gradient(135deg, #0d0d1a 0%, #0a0a14 100%)' }}
            >
              {/* Ambient glow */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 rounded-full blur-3xl opacity-20" style={{ background: '#8b5cf6' }} />
              </div>
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-900 mx-auto mb-3 ring-2 ring-white/10" />
                <div className="font-display font-bold text-xl mb-1">yourname</div>
                <div className="text-white/40 text-sm mb-5">✨ your bio goes here</div>
                <div className="flex flex-col gap-2 w-56 mx-auto">
                  {['🐦 Twitter', '📸 Instagram', '🎵 Spotify'].map((label, i) => (
                    <div
                      key={i}
                      className="rounded-xl py-2.5 text-sm font-medium text-center"
                      style={{
                        background: 'rgba(139,92,246,0.15)',
                        border: '1px solid rgba(139,92,246,0.3)',
                      }}
                    >
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-display font-bold mb-4">Everything you need</h2>
          <p className="text-white/40 text-lg">Built for creators, streamers, and everyone in between.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: Palette,
              title: 'Full Customization',
              desc: 'Custom colors, fonts, backgrounds, gradients, blur effects, and particle animations.',
            },
            {
              icon: Music,
              title: 'Background Music',
              desc: 'Add ambient music that autoplays when visitors land on your page. Volume control included.',
            },
            {
              icon: Globe,
              title: 'Link Management',
              desc: 'Drag-and-drop link ordering, custom icons, click tracking, and enable/disable toggles.',
            },
            {
              icon: BarChart3,
              title: 'Real Analytics',
              desc: 'View counts, device breakdown, browser stats, geographic data, and link click tracking.',
            },
            {
              icon: Zap,
              title: 'Instant Preview',
              desc: 'Real-time preview as you customize. See every change instantly without saving.',
            },
            {
              icon: Star,
              title: 'Mini Personal Site',
              desc: 'Not just a link-in-bio. A complete mini personal site engine with your own URL.',
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass glass-hover rounded-2xl p-6"
            >
              <div className="w-10 h-10 rounded-xl bg-accent-dim flex items-center justify-center mb-4">
                <feature.icon size={20} className="text-accent" />
              </div>
              <h3 className="font-display font-semibold mb-2">{feature.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-2xl mx-auto px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-display font-bold mb-6">
            Ready to stand out?
          </h2>
          <p className="text-white/40 mb-8">
            Create your free personal page in under 2 minutes.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-accent text-white font-semibold text-lg hover:bg-purple-500 transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(139,92,246,0.4)]"
          >
            Start for free <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/6 py-8 px-6 text-center text-white/30 text-sm">
        <p>© 2025 BioSite. Built with ❤️</p>
      </footer>
    </div>
  )
}
