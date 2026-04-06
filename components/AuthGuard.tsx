'use client'
// ============================================================
// components/AuthGuard.tsx — Firebase-based route protection
// ============================================================
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

const PUBLIC_ROUTES = ['/auth']

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const { user, loading } = useFirebaseAuth()
  
  const [checkingProfile, setCheckingProfile] = useState(false)

  useEffect(() => {
    if (loading) return
    const isPublic = PUBLIC_ROUTES.includes(pathname)

    const checkProfile = async () => {
      if (!user) {
        if (!isPublic) router.replace('/auth')
        return
      }

      // User logged in: Check Firestore for profileComplete
      setCheckingProfile(true)
      try {
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 8000))
        const snap = await Promise.race([
          getDoc(doc(db, 'users', user.uid)),
          timeoutPromise
        ]) as any
        
        const data = snap.data()
        const isCompleted = data?.profileCompleted === true

        if (!isCompleted && pathname !== '/onboarding') {
          router.replace('/onboarding')
        } else if (isCompleted && (pathname === '/auth' || pathname === '/onboarding')) {
          router.replace('/discover')
        }
      } catch (err) {
        console.error('Failed to check profile status', err)
      } finally {
        setCheckingProfile(false)
      }
    }

    checkProfile()
  }, [user, loading, pathname, router])

  // Show spinner while Firebase resolves auth state or we fetch profile status
  if (loading || checkingProfile) {
    return (
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', minHeight: '100dvh',
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          border: '3px solid var(--brand-primary)',
          borderTopColor: 'transparent',
          animation: 'spin 0.8s linear infinite',
        }}/>
        <p style={{ marginTop: 24, fontSize: 13, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.5px' }}>
          {loading ? 'Đang tải xác thực...' : 'Đang kiểm tra hồ sơ...'}
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return <>{children}</>
}
