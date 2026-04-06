'use client'
// ============================================================
// app/auth/page.tsx — Firebase-connected Auth screen
// Google login only
// ============================================================
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth'

export default function AuthPage() {
  const router = useRouter()
  const { user, loading, error, loginWithGoogle } = useFirebaseAuth()

  // Redirect after successful login is handled by AuthGuard.
  // We can also double check here.
  useEffect(() => {
    if (!loading && user) router.replace('/discover') // Fallback redirect
  }, [user, loading, router])

  const handleGoogle = async () => {
    await loginWithGoogle()
  }

  if (loading) return null // wait for auth state

  // ---- Render -------------------------------------------------
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 28px',
      gap: 32,
    }}>
      {/* Logo */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 72, height: 72,
          borderRadius: 24,
          background: 'var(--brand-gradient)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 36, margin: '0 auto 16px',
          boxShadow: 'var(--shadow-btn)',
        }}>🎧</div>
        <h1 className="text-gradient" style={{ fontSize: 32, fontWeight: 700, lineHeight: 1 }}>
          Bắt đầu với Veya
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 10 }}>
          Đăng nhập để tiếp tục
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div style={{
          width: '100%',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(255,60,100,0.12)',
          border: '1px solid rgba(255,60,100,0.25)',
          color: '#ff6b8a',
          fontSize: 14,
          textAlign: 'center',
        }}>
          {error}
        </div>
      )}

      {/* Actions */}
      <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button
          onClick={handleGoogle}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: 'var(--radius-full)',
            background: '#1A1A2E',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.15)',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#2A2A4A'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#1A1A2E'}
        >
          <span style={{ fontSize: 18 }}>G</span> Tiếp tục với Google
        </button>
      </div>

      {/* Terms */}
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          Bằng cách đăng nhập, bạn đồng ý với
        </p>
        <p style={{ fontSize: 11, color: 'var(--brand-primary)', marginTop: 4 }}>
          Điều khoản dịch vụ <span style={{ color: 'var(--text-muted)' }}>và</span> Chính sách bảo mật
        </p>
      </div>
    </div>
  )
}
