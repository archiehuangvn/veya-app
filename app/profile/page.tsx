'use client'

import { useRouter } from 'next/navigation'
import { profiles } from '@/data/mockData'
import AudioPlayer from '@/components/AudioPlayer'

// Use first profile as "current user" for demo
const currentUser = profiles[0]

export default function ProfilePage() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    router.replace('/auth')
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div className="screen-header" style={{ borderBottom: '1px solid var(--border)' }}>
        <h1 style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 22, fontWeight: 700 }}>
          Hồ sơ của tôi
        </h1>
        <button
          onClick={handleLogout}
          style={{
            fontSize: 12,
            color: 'var(--text-muted)',
            background: 'none',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-full)',
            padding: '6px 12px',
            cursor: 'pointer',
          }}
          id="logout-btn"
        >
          Đăng xuất
        </button>
      </div>

      <div className="screen-scroll">
        {/* Avatar */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '32px 20px 24px',
          gap: 16,
        }}>
          <div style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: `linear-gradient(135deg, hsl(${(currentUser.id.charCodeAt(5) * 37) % 360}, 60%, 40%) 0%, hsl(${(currentUser.id.charCodeAt(5) * 71) % 360}, 50%, 30%) 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 40,
            fontWeight: 700,
            color: '#fff',
            border: '3px solid var(--brand-primary)',
            boxShadow: '0 0 24px rgba(255,78,106,0.35)',
          }}>
            {currentUser.name[0]}
          </div>

          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 24, fontWeight: 700 }}>
              {currentUser.name}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
              {currentUser.age} tuổi · {currentUser.district}
            </p>
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {currentUser.tags.map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </div>

        {/* Audio intro */}
        <div style={{ padding: '0 20px 20px' }}>
          <p style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--text-secondary)',
            marginBottom: 10,
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}>
            Giới thiệu giọng nói
          </p>
          <AudioPlayer src={currentUser.audioUrl} />

          <button
            className="btn btn-outline"
            style={{ width: '100%', marginTop: 12 }}
            onClick={() => alert('Tính năng sắp ra mắt 🎙️')}
            id="re-record-btn"
          >
            🎙️ Ghi lại giọng
          </button>
        </div>

        {/* Stats */}
        <div style={{
          margin: '0 20px 20px',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          padding: '20px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 16,
          textAlign: 'center',
        }}>
          {[
            { label: 'Lượt nghe', value: '142' },
            { label: 'Matches', value: '2' },
            { label: 'Ngày tham gia', value: '15' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 22, fontWeight: 700, color: 'var(--brand-primary)' }}>
                {value}
              </p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Settings stubs */}
        <div style={{ padding: '0 20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { icon: '🔔', label: 'Thông báo' },
            { icon: '🔒', label: 'Quyền riêng tư' },
            { icon: '⭐', label: 'Nâng cấp VIP' },
            { icon: '🆘', label: 'Hỗ trợ' },
          ].map(({ icon, label }) => (
            <button
              key={label}
              className="card"
              onClick={() => {}}
              style={{
                width: '100%',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                cursor: 'pointer',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                textAlign: 'left',
                fontSize: 14,
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--brand-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <span style={{ fontSize: 18 }}>{icon}</span>
              <span>{label}</span>
              <span style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
