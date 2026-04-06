'use client'

import Link from 'next/link'
import { AppProvider, useAppState } from '@/store/appState'
import { profiles } from '@/data/mockData'
import NavigationBar from '@/components/NavigationBar'

function formatMatchDate(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffDays === 0) return 'Hôm nay'
  if (diffDays === 1) return 'Hôm qua'
  return `${diffDays} ngày trước`
}

function MatchesContent() {
  const { matches } = useAppState()

  const matchedProfiles = matches
    .map((m) => ({
      match: m,
      profile: profiles.find((p) => p.id === m.userId),
    }))
    .filter((x) => x.profile !== undefined)

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div className="screen-header" style={{ borderBottom: '1px solid var(--border)' }}>
        <h1 style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 22, fontWeight: 700 }}>
          <span className="text-gradient">Matches</span>
        </h1>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          {matchedProfiles.length} kết nối 💞
        </span>
      </div>

      {/* Content */}
      <div className="screen-scroll" style={{ padding: '16px 20px' }}>
        {matchedProfiles.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 80, color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎵</div>
            <p style={{ fontSize: 16, fontWeight: 600 }}>Chưa có match nào</p>
            <p style={{ fontSize: 13, marginTop: 6, color: 'var(--text-muted)' }}>
              Hãy tiếp tục nghe và thả tim nhé
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {matchedProfiles.map(({ match, profile }) => (
              <Link
                key={match.userId}
                href={`/chat/${match.userId}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  className="card"
                  style={{
                    padding: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 10,
                    transition: 'transform 0.15s, border-color 0.15s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.borderColor = 'var(--brand-primary)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.borderColor = 'var(--border)'
                  }}
                >
                  {/* Avatar revealed */}
                  <div style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, hsl(${(profile!.id.charCodeAt(5) * 37) % 360}, 60%, 40%) 0%, hsl(${(profile!.id.charCodeAt(5) * 71) % 360}, 50%, 30%) 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                    border: '2px solid var(--brand-primary)',
                    boxShadow: '0 0 12px rgba(255,78,106,0.3)',
                  }}>
                    {profile!.name[0]}
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>
                      {profile!.name}
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                      {formatMatchDate(match.matchedAt)}
                    </p>
                  </div>

                  <span className="badge badge-pink" style={{ fontSize: 11 }}>
                    Nhắn tin →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <NavigationBar />
    </div>
  )
}

export default function MatchesPage() {
  return (
    <AppProvider>
      <MatchesContent />
    </AppProvider>
  )
}
