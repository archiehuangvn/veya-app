'use client'
// ============================================================
// hooks/useFirebaseAuth.ts — Firebase Auth hook
// Handles Google login + Phone OTP (Taiwan +886 format)
// ============================================================
import { useState, useEffect, useCallback } from 'react'
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  onAuthStateChanged,
  signOut,
  type User,
  type ConfirmationResult,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { upsertUser } from '@/lib/firestoreUser'

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier
    confirmationResult?: ConfirmationResult
  }
}

// ---- Helpers ------------------------------------------------

/** Convert Vietnamese phone to E.164 Taiwan format */
export function toE164Taiwan(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  // Already in E.164
  if (digits.startsWith('886')) return `+${digits}`
  // Strip leading 0 (local format 09XXXXXXXX → +8869XXXXXXXX)
  if (digits.startsWith('0')) return `+886${digits.slice(1)}`
  return `+886${digits}`
}

// ---- Hook ---------------------------------------------------

export function useFirebaseAuth() {
  const [user, setUser]       = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  // Persist auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      setLoading(false)
      if (u) {
        try { await upsertUser(u) } catch { /* non-fatal */ }
      }
    })
    return unsub
  }, [])

  // ---- Google Login -------------------------------------------
  const loginWithGoogle = useCallback(async () => {
    setError(null)
    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({ prompt: 'select_account' })
      const result = await signInWithPopup(auth, provider)
      await upsertUser(result.user)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Đăng nhập Google thất bại'
      // Ignore popup-closed-by-user
      if (!msg.includes('popup-closed')) setError(msg)
    }
  }, [])

  // ---- Phone OTP — Step 1: Send --------------------------------
  const sendOtp = useCallback(async (rawPhone: string): Promise<boolean> => {
    setError(null)
    const phone = toE164Taiwan(rawPhone)

    try {
      // Create or reuse reCAPTCHA verifier (invisible)
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {},
        })
      }

      const confirmation = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier)
      window.confirmationResult = confirmation
      return true
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Không thể gửi OTP'
      setError(formatPhoneError(msg))

      // Reset reCAPTCHA on error
      window.recaptchaVerifier?.clear()
      window.recaptchaVerifier = undefined
      return false
    }
  }, [])

  // ---- Phone OTP — Step 2: Verify ------------------------------
  const verifyOtp = useCallback(async (code: string): Promise<boolean> => {
    setError(null)
    if (!window.confirmationResult) {
      setError('Phiên OTP đã hết hạn. Vui lòng thử lại.')
      return false
    }
    try {
      const result = await window.confirmationResult.confirm(code)
      await upsertUser(result.user)
      return true
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Mã OTP không đúng'
      setError(formatOtpError(msg))
      return false
    }
  }, [])

  const logout = useCallback(() => signOut(auth), [])

  return { user, loading, error, setError, loginWithGoogle, sendOtp, verifyOtp, logout }
}

// ---- Error message formatting --------------------------------

function formatPhoneError(msg: string): string {
  if (msg.includes('invalid-phone-number')) return 'Số điện thoại không hợp lệ. Vui lòng kiểm tra lại.'
  if (msg.includes('too-many-requests'))    return 'Quá nhiều yêu cầu. Vui lòng thử lại sau.'
  if (msg.includes('quota-exceeded'))       return 'Đã đạt giới hạn SMS. Vui lòng thử sau.'
  return 'Không thể gửi OTP. Kiểm tra số điện thoại và thử lại.'
}

function formatOtpError(msg: string): string {
  if (msg.includes('invalid-verification-code')) return 'Mã OTP không đúng. Vui lòng kiểm tra lại.'
  if (msg.includes('code-expired'))              return 'Mã OTP đã hết hạn. Vui lòng gửi lại.'
  if (msg.includes('session-expired'))           return 'Phiên đã hết hạn. Vui lòng thử lại từ đầu.'
  return 'Xác thực thất bại. Vui lòng thử lại.'
}
