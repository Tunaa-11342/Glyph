import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center text-center px-6">
      <div>
        <div className="text-8xl font-display font-bold text-white/5 mb-4">404</div>
        <h1 className="text-2xl font-display font-bold mb-3">Page not found</h1>
        <p className="text-white/40 mb-8">
          This profile doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-accent rounded-xl text-sm font-medium hover:bg-purple-500 transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}
