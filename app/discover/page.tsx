'use client'

import { useState, useCallback, useEffect } from 'react'
import { AppProvider, useAppState } from '@/store/appState'
import { profiles } from '@/data/mockData'
import SwipeCard from '@/components/SwipeCard'
import BottomAction from '@/components/BottomAction'
import NavigationBar from '@/components/NavigationBar'
import { Analytics } from '@/utils/analytics'

function DiscoverContent() {
  const { swipedUserIds, swipeRight, swipeLeft } = useAppState()
  const [likedFeedback, setLikedFeedback] = useState(false)

  useEffect(() => { Analytics.pageView('/discover') }, [])

  const available = profiles.filter((p) => !swipedUserIds.includes(p.id))
  const stack = available.slice(0, 3)

  const handleCardSwipe = useCallback(
    (userId: string, direction: string) => {
      if (direction === 'right') {
        Analytics.swipeRight(userId)
        swipeRight(userId)
        setLikedFeedback(true)
        setTimeout(() => setLikedFeedback(false), 600)
      } else {
        Analytics.swipeLeft(userId)
        swipeLeft(userId)
      }
    },
    [swipeRight, swipeLeft]
  )

  const handleLike = () => { if (stack[0]) handleCardSwipe(stack[0].id, 'right') }
  const handleSkip = () => { if (stack[0]) handleCardSwipe(stack[0].id, 'left') }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div className="screen-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <h1 style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 24, fontWeight: 800 }}>
          <span className="text-gradient">Veya</span>
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {likedFeedback ? (
            <span style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--pink)',
              background: 'rgba(255,60,172,0.12)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(255,60,172,0.2)',
              transition: 'all 0.2s',
            }}>
              ♥ Đã thích!
            </span>
          ) : (
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {available.length} người đang chờ 🎧
            </span>
          )}
        </div>
      </div>

      {/* Card Stack */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {stack.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '0 32px' }}>
            <div style={{ fontSize: 56, marginBottom: 20 }}>🌙</div>
            <h3 style={{
              fontFamily: 'Be Vietnam Pro, sans-serif',
              fontSize: 20,
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: 10,
            }}>
              Hết người mới rồi!
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Bạn đã nghe qua tất cả mọi người.<br/>
              Quay lại sau để gặp thêm người mới nhé 😊
            </p>
            <div style={{
              marginTop: 24,
              display: 'inline-flex',
              padding: '10px 20px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--brand-gradient-soft)',
              border: '1px solid rgba(255,60,172,0.2)',
              fontSize: 13,
              color: 'var(--pink)',
              fontWeight: 600,
            }}>
              ✨ Xem những match của bạn →
            </div>
          </div>
        ) : (
          <div style={{ position: 'relative', width: '100%', maxWidth: 360 }}>
            {/* Background stack cards */}
            {stack.slice(1, 3).reverse().map((profile, idx) => (
              <div
                key={profile.id}
                style={{
                  position: 'absolute',
                  inset: 0,
                  transform: `scale(${0.94 - idx * 0.025}) translateY(${-(idx + 1) * 8}px)`,
                  transformOrigin: 'bottom center',
                  zIndex: idx,
                  borderRadius: 'var(--radius-xl)',
                  background: 'var(--bg-card)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  opacity: 0.7 - idx * 0.15,
                  height: '100%',
                }}
              />
            ))}

            {/* Top card */}
            <div style={{ position: 'relative', zIndex: 10 }}>
              <SwipeCard
                profile={stack[0]}
                onSwipe={(dir) => handleCardSwipe(stack[0].id, dir)}
              />
            </div>
          </div>
        )}
      </div>

      {stack.length > 0 && <BottomAction onSkip={handleSkip} onLike={handleLike} />}
      <NavigationBar />
    </div>
  )
}

export default function DiscoverPage() {
  return (
    <AppProvider>
      <DiscoverContent />
    </AppProvider>
  )
}
