// ============================================================
// lib/firestoreUser.ts — Firestore user helpers
// ============================================================
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'
import type { User as FirebaseUser } from 'firebase/auth'

export interface VeyaUser {
  uid: string
  name: string
  avatar: string
  audioUrl: string
  createdAt: unknown
  lastActive: unknown
}

/**
 * Upsert user in Firestore after login.
 * Only writes if the user does not exist yet (preserves existing profile data).
 */
export async function upsertUser(firebaseUser: FirebaseUser): Promise<void> {
  const ref = doc(db, 'users', firebaseUser.uid)
  const snap = await getDoc(ref)

  if (!snap.exists()) {
    await setDoc(ref, {
      uid:       firebaseUser.uid,
      name:      firebaseUser.displayName ?? '',
      avatar:    firebaseUser.photoURL ?? '',
      audioUrl:  '',
      createdAt: serverTimestamp(),
      lastActive: serverTimestamp(),
    })
  } else {
    // Always update lastActive
    await setDoc(ref, { lastActive: serverTimestamp() }, { merge: true })
  }
}
