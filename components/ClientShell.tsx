'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'

const AuthGuard      = dynamic(() => import('./AuthGuard'),      { ssr: false })
const IntroGuard     = dynamic(() => import('./IntroGuard'),     { ssr: false })
const FeedbackButton = dynamic(() => import('./FeedbackButton'), { ssr: false })
const NavigationBar  = dynamic(() => import('./NavigationBar'),  { ssr: false })

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Show bottom nav everywhere EXCEPT intro, auth, admin, and individual chat pages
  const hideNav = pathname === '/' || 
                  pathname === '/auth' || 
                  pathname === '/admin' || 
                  pathname.startsWith('/chat/')
                  
  return (
    <>
      <IntroGuard>
        <AuthGuard>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100dvh', overflow: 'hidden' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {children}
            </div>
            {!hideNav && <NavigationBar />}
          </div>
        </AuthGuard>
      </IntroGuard>
      <FeedbackButton />
    </>
  )
}
