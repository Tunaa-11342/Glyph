import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/3 w-80 h-80 rounded-full blur-3xl opacity-15" style={{ background: '#8b5cf6' }} />
      </div>
      <SignIn
        appearance={{
          elements: {
            card: 'bg-surface-2 border border-white/8 shadow-2xl rounded-2xl',
            headerTitle: 'text-white font-display',
            headerSubtitle: 'text-white/40',
            formButtonPrimary: 'bg-accent hover:bg-purple-500',
            formFieldInput: 'bg-surface-3 border-white/10 text-white',
            formFieldLabel: 'text-white/60',
            footerActionLink: 'text-accent',
            dividerText: 'text-white/30',
            socialButtonsBlockButton: 'bg-surface-3 border-white/10 text-white hover:bg-surface-4',
          },
        }}
      />
    </div>
  )
}
