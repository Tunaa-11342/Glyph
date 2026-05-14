import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function sanitizeCSS(css: string): string {
  // Remove dangerous CSS patterns
  const dangerous = [
    /javascript\s*:/gi,
    /expression\s*\(/gi,
    /url\s*\(\s*["']?\s*javascript/gi,
    /@import/gi,
    /behavior\s*:/gi,
    /binding\s*:/gi,
    /-moz-binding/gi,
    /position\s*:\s*fixed/gi,
  ]
  let safe = css
  for (const pattern of dangerous) {
    safe = safe.replace(pattern, '')
  }
  // Only allow safe properties whitelist approach
  return safe
}

export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

export function getRelativeTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 30) return `${days}d ago`
  return date.toLocaleDateString()
}

export const SOCIAL_ICONS: Record<string, string> = {
  twitter: 'twitter',
  x: 'twitter',
  instagram: 'instagram',
  youtube: 'youtube',
  twitch: 'twitch',
  discord: 'discord',
  github: 'github',
  tiktok: 'music',
  spotify: 'music',
  linkedin: 'linkedin',
  facebook: 'facebook',
  website: 'globe',
  email: 'mail',
  link: 'link',
}

export function detectSocialIcon(url: string): string {
  const lower = url.toLowerCase()
  if (lower.includes('twitter.com') || lower.includes('x.com')) return 'twitter'
  if (lower.includes('instagram.com')) return 'instagram'
  if (lower.includes('youtube.com')) return 'youtube'
  if (lower.includes('twitch.tv')) return 'twitch'
  if (lower.includes('discord')) return 'discord'
  if (lower.includes('github.com')) return 'github'
  if (lower.includes('tiktok.com')) return 'music'
  if (lower.includes('spotify.com')) return 'music'
  if (lower.includes('linkedin.com')) return 'linkedin'
  if (lower.includes('facebook.com')) return 'facebook'
  if (lower.includes('mailto:')) return 'mail'
  return 'link'
}
