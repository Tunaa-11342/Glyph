import { useState, useEffect } from 'react'
import type { ProfileSettings, LinkItem } from '@/types'

interface ProfileData {
  user: { username: string; displayName?: string | null; bio?: string | null; avatar?: string | null } | null
  profile: ProfileSettings | null
  loading: boolean
  error: string | null
}

export function useProfile(): ProfileData {
  const [data, setData] = useState<ProfileData>({
    user: null,
    profile: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.json())
      .then(json => {
        setData({
          user: json.user || null,
          profile: json.profile || null,
          loading: false,
          error: null,
        })
      })
      .catch(() => {
        setData(prev => ({ ...prev, loading: false, error: 'Failed to load' }))
      })
  }, [])

  return data
}

interface LinksData {
  links: LinkItem[]
  loading: boolean
  refetch: () => void
}

export function useLinks(): LinksData {
  const [links, setLinks] = useState<LinkItem[]>([])
  const [loading, setLoading] = useState(true)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    setLoading(true)
    fetch('/api/links')
      .then(r => r.json())
      .then(json => {
        setLinks(json.links || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [tick])

  return { links, loading, refetch: () => setTick(t => t + 1) }
}
