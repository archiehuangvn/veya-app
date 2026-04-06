'use client'
// ============================================================
// app/auth/page.tsx — Firebase-connected Auth screen
// Google login + Phone OTP (Taiwan +886 format)
// ============================================================
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth'

type Step = 'phone' | 'otp'

export default function AuthPage() {
  const router = useRouter()
  const { user, loading, error, setError, loginWithGoogle, sendOtp, verifyOtp } = useFirebaseAuth()

  const [step, setStep]           = useState<Step>('phone')
  const [phone, setPhone]         = useState('')
  const [otp, setOtp]             = useState('')
  const [sending, setSending]     = useState(false)
  const [verifying, setVerifying] = useState(false)
  const recaptchaRef              = useRef<HTMLDivElement>(null)

  // Redirect after successful login
  useEffect(() => {
    if (!loading && user) router.replace('/discover')
  }, [user, loading, router])

  // ---- Handlers -----------------------------------------------

  const handleSendOtp = async () => {
    if (!phone.trim() || sending) return
    setSending(true)
    const ok = await sendOtp(phone)
    setSending(false)
    if (ok) setStep('otp')
  }

  const handleVerifyOtp = async () => {
    if (otp.length < 6 || verifying) return
    setVerifying(true)
    await verifyOtp(otp)
    setVerifying(false)
    // redirect handled by useEffect above
  }

  const handleGoogle = async () => {
    await loginWithGoogle()
    // redirect handled by useEffect above
  }

  const handleChangePhone = () => {
    setStep('phone')
    setOtp('')
    setError(null)
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
      {/* Invisible reCAPTCHA mount point */}
      <div id="recaptcha-container" ref={recaptchaRef} />

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
          Veya
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 6 }}>
          LắngNgheNhau — Kết nối qua giọng nói
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
          lineHeight: 1.5,
        }}>
          {error}
        </div>
      )}

      {/* Form */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {step === 'phone' ? (
          <>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-muted)', fontSize: 15, pointerEvents: 'none',
              }}>🇹🇼</span>
              <input
                id="phone-input"
                className="input"
                type="tel"
                placeholder="09XXXXXXXX hoặc +886..."
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setError(null) }}
                onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                style={{ paddingLeft: 42 }}
                autoComplete="tel"
              />
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: -6 }}>
              Nhập số điện thoại Đài Loan. Mã +886 sẽ được thêm tự động.
            </p>
            <button
              id="send-otp-btn"
              className="btn btn-primary"
              onClick={handleSendOtp}
              disabled={sending || !phone.trim()}
              style={{ width: '100%', opacity: (sending || !phone.trim()) ? 0.6 : 1 }}
            >
              {sending ? 'Đang gửi...' : 'Gửi mã OTP →'}
            </button>
          </>
        ) : (
          <>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', textAlign: 'center' }}>
              Mã OTP đã gửi đến{' '}
              <strong style={{ color: 'var(--text-primary)' }}>{phone}</strong>
            </p>
            <input
              id="otp-input"
              className="input"
              type="number"
              inputMode="numeric"
              placeholder="Nhập mã 6 số"
              value={otp}
              onChange={(e) => { setOtp(e.target.value.slice(0, 6)); setError(null) }}
              onKeyDown={(e) => e.key === 'Enter' && handleVerifyOtp()}
              style={{ textAlign: 'center', letterSpacing: 8, fontSize: 20 }}
              autoComplete="one-time-code"
            />
            <button
              id="verify-otp-btn"
              className="btn btn-primary"
              onClick={handleVerifyOtp}
              disabled={verifying || otp.length < 6}
              style={{ width: '100%', opacity: (verifying || otp.length < 6) ? 0.6 : 1 }}
            >
              {verifying ? 'Đang xác thực...' : 'Xác nhận ✓'}
            </button>
            <button
              className="btn btn-ghost"
              onClick={handleChangePhone}
              style={{ width: '100%', color: 'var(--text-muted)', fontSize: 13 }}
            >
              ← Đổi số điện thoại
            </button>
          </>
        )}

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)', fontSize: 12 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
          hoặc
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
        </div>

        {/* Google Login */}
        <button
          id="google-login-btn"
          className="btn btn-outline"
          onClick={handleGoogle}
          style={{ width: '100%', gap: 10 }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
            <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Tiếp tục với Google
        </button>
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
        Bằng cách đăng nhập, bạn đồng ý với<br />
        <span style={{ color: 'var(--brand-primary)' }}>Điều khoản dịch vụ</span> và{' '}
        <span style={{ color: 'var(--brand-primary)' }}>Chính sách bảo mật</span>
      </p>
    </div>
  )
}
