'use client'

import dynamic from 'next/dynamic'

const AuthGuard      = dynamic(() => import('./AuthGuard'),      { ssr: false })
const IntroGuard     = dynamic(() => import('./IntroGuard'),     { ssr: false })
const FeedbackButton = dynamic(() => import('./FeedbackButton'), { ssr: false })

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <IntroGuard>
        <AuthGuard>
          {children}
        </AuthGuard>
      </IntroGuard>
      <FeedbackButton />
    </>
  )
}
