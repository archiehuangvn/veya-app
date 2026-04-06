'use client'

import { useRef, useState } from 'react'
import { useAudio } from '@/hooks/useAudio'
import { Analytics } from '@/utils/analytics'

interface AudioPlayerProps {
  src: string
  mini?: boolean
}

function formatTime(s: number): string {
  if (!isFinite(s) || isNaN(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export default function AudioPlayer({ src, mini = false }: AudioPlayerProps) {
  const { isPlaying, currentTime, duration, toggle, seek } = useAudio(src)
  const hasTracked = useRef(false)
  const [pulsing, setPulsing] = useState(false)

  const handleToggle = () => {
    if (!isPlaying && !hasTracked.current) {
      hasTracked.current = true
      Analytics.audioPlay('unknown', src)
    }
    if (!isPlaying) {
      setPulsing(true)
      setTimeout(() => setPulsing(false), 300)
    }
    toggle()
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  if (mini) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={handleToggle}
          className={pulsing ? 'pulse-once' : ''}
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: 'var(--brand-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            border: 'none',
            cursor: 'pointer',
            boxShadow: isPlaying ? '0 0 12px rgba(255,60,172,0.45)' : 'none',
            transition: 'box-shadow 0.2s, transform 0.15s',
          }}
        >
          {isPlaying ? (
            <svg width="11" height="11" viewBox="0 0 12 12" fill="white">
              <rect x="1" y="1" width="4" height="10" rx="1"/>
              <rect x="7" y="1" width="4" height="10" rx="1"/>
            </svg>
          ) : (
            <svg width="11" height="11" viewBox="0 0 12 12" fill="white">
              <path d="M2 1.5L10 6L2 10.5V1.5Z"/>
            </svg>
          )}
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
          <div style={{
            height: 3,
            borderRadius: 2,
            background: 'rgba(255,255,255,0.1)',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'var(--brand-gradient)',
              borderRadius: 2,
              transition: 'width 0.1s linear',
            }}/>
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            🎵 {duration > 0 ? formatTime(duration) : '—'}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      borderRadius: 'var(--radius-md)',
      padding: '14px 16px',
      border: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}>
      {/* Hint text */}
      <p style={{
        fontSize: 11,
        color: 'var(--text-muted)',
        textAlign: 'center',
        fontStyle: 'italic',
      }}>
        👂 Nghe giọng trước khi quyết định
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Play/Pause */}
        <button
          onClick={handleToggle}
          className={pulsing ? 'pulse-once' : ''}
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: 'var(--brand-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            border: 'none',
            cursor: 'pointer',
            boxShadow: isPlaying
              ? '0 0 24px rgba(255,60,172,0.55), var(--shadow-btn)'
              : 'var(--shadow-btn)',
            transition: 'transform 0.15s ease, box-shadow 0.2s ease',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.93)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {isPlaying ? (
            <svg width="18" height="18" viewBox="0 0 16 16" fill="white">
              <rect x="2" y="2" width="5" height="12" rx="1.5"/>
              <rect x="9" y="2" width="5" height="12" rx="1.5"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 16 16" fill="white">
              <path d="M3 2.5L13 8L3 13.5V2.5Z"/>
            </svg>
          )}
        </button>

        {/* Progress & Time */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {/* Custom progress bar */}
          <div
            style={{
              height: 4,
              borderRadius: 2,
              background: 'rgba(255,255,255,0.08)',
              overflow: 'hidden',
              cursor: 'pointer',
              position: 'relative',
            }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const pct = (e.clientX - rect.left) / rect.width
              seek(pct * (duration || 1))
            }}
          >
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'var(--brand-gradient)',
              borderRadius: 2,
              transition: 'width 0.1s linear',
            }}/>
          </div>

          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  )
}
