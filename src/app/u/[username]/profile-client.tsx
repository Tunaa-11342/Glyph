'use client'
import { useState, useEffect } from 'react'
import ProfileRenderer from '@/components/profile-renderer'
import type { UserProfile } from '@/types'

const DEFAULTS = {
  bgEffect:'none', bgBlur:0, usernameEffect:'none',
  monochrome:false, animatedTitle:false, swapBoxColors:false,
  iconColor:'#8b5cf6', avatarUrl:null,
  usernameColor:'#ffffff', handleColor:'rgba(255,255,255,0.45)',
  bioColor:'rgba(255,255,255,0.75)',
  linkTextColor:'#ffffff', linkBgColor:'rgba(255,255,255,0.08)', linkIconColor:'#8b5cf6',
}

export default function ProfilePageClient({ profile }: { profile: UserProfile }) {
  const [gamerProfile, setGamerProfile] = useState<any>(null)

  useEffect(() => {
    fetch(`/api/gamer/${profile.username}`)
      .then(r => r.json())
      .then(d => { if (d.gamerProfile) setGamerProfile(d.gamerProfile) })
      .catch(() => {})
  }, [profile.username])

  const settings = profile.profile ? { ...DEFAULTS, ...profile.profile } : null
  if (!settings) return (
    <div style={{ position:'fixed', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'#0a0a0a', color:'rgba(255,255,255,0.3)', fontFamily:'Inter,sans-serif' }}>
      Profile not set up yet.
    </div>
  )

  return (
    <div style={{ position:'fixed', inset:0, overflow:'hidden' }}>
      <ProfileRenderer
        settings={settings as any}
        user={profile}
        links={profile.links}
        gamerProfile={gamerProfile}
        isPreview={false}
        onLinkClick={id => {
          fetch('/api/analytics', {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({ type:'link_click', linkId:id, profileId:profile.id }),
          }).catch(()=>{})
        }}
      />
    </div>
  )
}
