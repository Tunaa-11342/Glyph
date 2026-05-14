export interface UserProfile {
  id: string
  username: string
  displayName?: string | null
  bio?: string | null
  avatar?: string | null
  profile?: ProfileSettings | null
  links: LinkItem[]
}

export interface ProfileSettings {
  id: string
  bgColor: string
  bgImage?: string | null
  bgVideo?: string | null
  bgType: 'color' | 'image' | 'video' | 'gradient'
  bgGradient?: string | null
  accentColor: string
  textColor: string
  usernameColor: string
  handleColor: string
  bioColor: string
  linkTextColor: string
  linkBgColor: string
  linkIconColor: string
  fontFamily: string
  cardOpacity: number
  cardBlur: number
  borderRadius: number
  audioUrl?: string | null
  audioName?: string | null
  audioVolume: number
  audioAutoplay: boolean
  particlesEnabled: boolean
  glowEnabled: boolean
  glowColor: string
  animationStyle: 'fade' | 'slide' | 'bounce' | 'none'
  customCss?: string | null
  layoutStyle: 'centered' | 'left' | 'right'
  profileBlur: number
  location?: string | null
  discordUser?: string | null
  viewCount: number
  bgEffect: string
  bgBlur: number
  usernameEffect: string
  monochrome: boolean
  animatedTitle: boolean
  swapBoxColors: boolean
  iconColor: string
  avatarUrl?: string | null
}

export interface LinkItem {
  id: string
  title: string
  url: string
  icon: string
  color?: string | null
  bgColor?: string | null
  order: number
  enabled: boolean
  clickCount: number
}

export interface AnalyticsData {
  totalViews: number
  todayViews: number
  totalClicks: number
  topLinks: { id: string; title: string; clicks: number }[]
  deviceBreakdown: { device: string; count: number }[]
  browserBreakdown: { browser: string; count: number }[]
  viewsOverTime: { date: string; views: number }[]
}
