'use client'
// ============================================================
// store/appState.tsx — App state with Firestore match sync
// ============================================================
import React, { createContext, useContext, useState, useCallback } from 'react'
import { seedMatches, type Match } from '@/data/mockData'
import { Analytics } from '@/utils/analytics'
import { createMatch } from '@/lib/firestoreMatches'
import { auth } from '@/lib/firebase'

interface AppState {
  matchedUserIds: string[]
  swipedUserIds:  string[]
  matches:        Match[]
}

interface AppActions {
  swipeRight: (userId: string) => void
  swipeLeft:  (userId: string) => void
}

const AppContext = createContext<(AppState & AppActions) | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [matchedUserIds, setMatchedUserIds] = useState<string[]>(
    seedMatches.map((m) => m.userId)
  )
  const [swipedUserIds, setSwipedUserIds] = useState<string[]>(
    seedMatches.map((m) => m.userId)
  )
  const [matches, setMatches] = useState<Match[]>(seedMatches)

  const swipeRight = useCallback((userId: string) => {
    if (swipedUserIds.includes(userId)) return

    const newMatch: Match = { userId, matchedAt: new Date().toISOString() }
    Analytics.matchCreated(userId)
    setMatchedUserIds((prev) => [...prev, userId])
    setSwipedUserIds((prev)  => [...prev, userId])
    setMatches((prev)        => [...prev, newMatch])

    // Persist match in Firestore (fire-and-forget; non-blocking)
    const uid = auth.currentUser?.uid
    if (uid) {
      createMatch(uid, userId).catch((err) =>
        console.warn('[Firestore] createMatch failed:', err)
      )
    }
  }, [swipedUserIds])

  const swipeLeft = useCallback((userId: string) => {
    if (swipedUserIds.includes(userId)) return
    setSwipedUserIds((prev) => [...prev, userId])
  }, [swipedUserIds])

  return (
    <AppContext.Provider value={{ matchedUserIds, swipedUserIds, matches, swipeRight, swipeLeft }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppState() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppState must be used within AppProvider')
  return ctx
}
