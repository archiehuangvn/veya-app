// ============================================================
// lib/firestoreMatches.ts — Match & message Firestore helpers
// ============================================================
import {
  collection, doc, addDoc, getDocs, query, where,
  orderBy, onSnapshot, serverTimestamp, type Unsubscribe,
} from 'firebase/firestore'
import { db } from './firebase'

// ---- Types --------------------------------------------------

export interface FirestoreMatch {
  id: string
  userA: string
  userB: string
  createdAt: unknown
}

export interface FirestoreMessage {
  id: string
  matchId: string
  senderId: string
  type: 'text' | 'audio'
  content: string   // text content OR audio download URL
  createdAt: unknown
}

// ---- Matches ------------------------------------------------

/**
 * Create a match between two users. Idempotent — checks for existing match first.
 */
export async function createMatch(userA: string, userB: string): Promise<string> {
  const col = collection(db, 'matches')

  // Check A→B
  const q1 = query(col, where('userA', '==', userA), where('userB', '==', userB))
  const snap1 = await getDocs(q1)
  if (!snap1.empty) return snap1.docs[0].id

  // Check B→A
  const q2 = query(col, where('userA', '==', userB), where('userB', '==', userA))
  const snap2 = await getDocs(q2)
  if (!snap2.empty) return snap2.docs[0].id

  const ref = await addDoc(col, { userA, userB, createdAt: serverTimestamp() })
  return ref.id
}

/**
 * Get all matches for a user (as either userA or userB).
 */
export async function getMatches(uid: string): Promise<FirestoreMatch[]> {
  const col = collection(db, 'matches')
  const [snapA, snapB] = await Promise.all([
    getDocs(query(col, where('userA', '==', uid))),
    getDocs(query(col, where('userB', '==', uid))),
  ])
  return [...snapA.docs, ...snapB.docs].map((d) => ({
    id: d.id,
    ...(d.data() as Omit<FirestoreMatch, 'id'>),
  }))
}

// ---- Messages -----------------------------------------------

/**
 * Send a message in a match thread.
 */
export async function sendMessage(
  matchId: string,
  senderId: string,
  type: 'text' | 'audio',
  content: string,
): Promise<string> {
  const ref = await addDoc(collection(db, 'messages'), {
    matchId,
    senderId,
    type,
    content,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

/**
 * Subscribe to realtime messages in a match thread.
 * Returns an unsubscribe function.
 */
export function subscribeToMessages(
  matchId: string,
  callback: (messages: FirestoreMessage[]) => void,
): Unsubscribe {
  const q = query(
    collection(db, 'messages'),
    where('matchId', '==', matchId),
    orderBy('createdAt', 'asc'),
  )
  return onSnapshot(q, (snap) => {
    callback(
      snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<FirestoreMessage, 'id'>),
      })),
    )
  })
}
