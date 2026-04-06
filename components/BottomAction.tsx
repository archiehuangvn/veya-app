'use client'

interface BottomActionProps {
  onSkip: () => void
  onLike: () => void
}

export default function BottomAction({ onSkip, onLike }: BottomActionProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '28px',
      padding: '16px 24px 24px',
      flexShrink: 0,
    }}>
      {/* Skip */}
      <button
        onClick={onSkip}
        aria-label="Skip"
        style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'transparent',
          border: '1.5px solid rgba(255,255,255,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: 22,
          color: 'var(--text-secondary)',
          transition: 'transform 0.15s ease, border-color 0.15s ease',
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
          e.currentTarget.style.transform = 'scale(1.05)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
          e.currentTarget.style.transform = 'scale(1)'
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.94)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        ✕
      </button>

      {/* Like — gradient, larger */}
      <button
        onClick={onLike}
        aria-label="Like"
        style={{
          width: 76,
          height: 76,
          borderRadius: '50%',
          background: 'var(--brand-gradient)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: 30,
          flexShrink: 0,
          boxShadow: '0 6px 28px rgba(255,60,172,0.5), 0 0 0 0 rgba(255,60,172,0)',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.06)'
          e.currentTarget.style.boxShadow = '0 8px 36px rgba(255,60,172,0.65)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = '0 6px 28px rgba(255,60,172,0.5)'
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.94)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
      >
        ♥
      </button>

      {/* Boost */}
      <button
        aria-label="Boost"
        onClick={() => {}}
        style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'transparent',
          border: '1.5px solid rgba(255,255,255,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: 20,
          color: 'var(--text-secondary)',
          transition: 'transform 0.15s ease, border-color 0.15s ease',
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(120,75,160,0.5)'
          e.currentTarget.style.transform = 'scale(1.05)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
          e.currentTarget.style.transform = 'scale(1)'
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.94)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        ⚡
      </button>
    </div>
  )
}
