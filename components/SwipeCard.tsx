'use client'

import { useCallback } from 'react'
import TinderCard from 'react-tinder-card'
import AudioPlayer from './AudioPlayer'
import type { UserProfile } from '@/types/user'

interface SwipeCardProps {
  profile: UserProfile
  onSwipe: (direction: string) => void
}

// Deterministic hue from profile id
function profileHue(id: string) {
  return (id.charCodeAt(5) * 47 + id.charCodeAt(6) * 23) % 360
}

export default function SwipeCard({ profile, onSwipe }: SwipeCardProps) {
  const handleSwipe = useCallback(
    (dir: string) => { onSwipe(dir) },
    [onSwipe]
  )

  const hue = profileHue(profile.id)

  return (
    <TinderCard
      key={profile.id}
      onSwipe={handleSwipe}
      preventSwipe={['up', 'down']}
      swipeRequirementType="position"
      swipeThreshold={80}
    >
      <div
        className="fade-in-up"
        style={{
          position: 'relative',
          width: '100%',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          background: 'var(--bg-card)',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: 'var(--shadow-card)',
          userSelect: 'none',
          touchAction: 'none',
        }}
      >
        {/* Avatar area — blurred gradient */}
        <div style={{ height: 240, position: 'relative', overflow: 'hidden' }}>
          {/* Blurred color bg */}
          <div style={{
            width: '100%',
            height: '100%',
            background: `linear-gradient(135deg,
              hsl(${hue}, 60%, 22%) 0%,
              hsl(${(hue + 40) % 360}, 50%, 15%) 100%)`,
            filter: 'blur(22px)',
            transform: 'scale(1.2)',
          }}/>

          {/* Gradient overlay bottom fade */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '60%',
            background: 'linear-gradient(to bottom, rgba(26,26,53,0) 0%, var(--bg-card) 100%)',
          }}/>

          {/* Lock badge */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: 'rgba(13,13,26,0.6)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
              🔒
            </div>
            <span style={{
              fontSize: 11,
              color: 'rgba(255,255,255,0.55)',
              background: 'rgba(13,13,26,0.5)',
              backdropFilter: 'blur(6px)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}>
              Match 3 ngày để xem ảnh
            </span>
          </div>
        </div>

        {/* Info Section */}
        <div style={{ padding: '14px 18px 18px' }}>
          {/* Name + Age */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
            <h2 style={{
              fontFamily: 'Be Vietnam Pro, sans-serif',
              fontSize: 22,
              fontWeight: 700,
              background: 'var(--brand-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {profile.name}
            </h2>
            <span style={{ fontSize: 17, color: 'var(--text-secondary)', fontWeight: 500 }}>
              {profile.age}
            </span>
          </div>

          {/* District */}
          <p style={{
            fontSize: 12,
            color: 'var(--text-muted)',
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}>
            📍 {profile.district}
          </p>

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
            {(profile.tags || []).map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>

          {/* Audio Player — prominent */}
          {profile.audioUrl && <AudioPlayer src={profile.audioUrl} />}
        </div>
      </div>
    </TinderCard>
  )
}
