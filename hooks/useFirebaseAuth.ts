'use client'
// ============================================================
// hooks/useFirebaseAuth.ts — Firebase Auth hook
// Handles Google login
// ============================================================
import { useState, useEffect, useCallback } from 'react'
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  type User,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { upsertUser } from '@/lib/firestoreUser'

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

  const logout = useCallback(() => signOut(auth), [])

  return { user, loading, error, setError, loginWithGoogle, logout }
}
