'use client'
import ProfileRenderer from '@/components/profile-renderer'
import type { ProfileSettings } from '@/types'

interface Link { id:string;title:string;url:string;icon:string;enabled:boolean;order:number;clickCount:number }
interface User { username:string;displayName?:string|null;bio?:string|null;avatar?:string|null;avatarUrl?:string|null }

export default function ProfilePreview({
  settings, user, links,
}: {
  settings: ProfileSettings; user: User; links: Link[]
}) {
  // Merge in the avatarUrl from settings if user doesn't have it
  const enrichedUser = {
    ...user,
    avatarUrl: (settings as any).avatarUrl ?? user.avatarUrl ?? user.avatar,
  }

  return (
    <div style={{ width:'100%', height:'100%', overflow:'hidden', borderRadius:'inherit' }}>
      <ProfileRenderer
        settings={settings}
        user={enrichedUser}
        links={links}
        isPreview={true}
      />
    </div>
  )
}
