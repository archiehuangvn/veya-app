'use client'

import { useState } from 'react'
import IntroFlow from './IntroFlow'

export default function IntroGuard({ children }: { children: React.ReactNode }) {
  // Always start with intro shown — no localStorage check
  const [showIntro, setShowIntro] = useState(true)

  if (showIntro) {
    return (
      <>
        <div style={{ visibility: 'hidden', pointerEvents: 'none' }}>
          {children}
        </div>
        <IntroFlow onDone={() => setShowIntro(false)} />
      </>
    )
  }

  return <>{children}</>
}
