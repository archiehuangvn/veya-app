'use client'
// ============================================================
// components/AuthGuard.tsx — Firebase-based route protection
// ============================================================
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth'

const PUBLIC_ROUTES = ['/auth']

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const { user, loading } = useFirebaseAuth()

  useEffect(() => {
    if (loading) return
    const isPublic = PUBLIC_ROUTES.includes(pathname)
    if (!user && !isPublic) router.replace('/auth')
    if (user && isPublic)   router.replace('/discover')
  }, [user, loading, pathname, router])

  // Show spinner while Firebase resolves auth state
  if (loading) {
    return (
      <div style={{
        flex: 1, display: 'flex',
        alignItems: 'center', justifyContent: 'center', minHeight: '100dvh',
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          border: '3px solid var(--brand-primary)',
          borderTopColor: 'transparent',
          animation: 'spin 0.8s linear infinite',
        }}/>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return <>{children}</>
}
