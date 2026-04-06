'use client'

import { useState } from 'react'

export default function FeedbackButton() {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!text.trim()) return
    console.log('[Veya Feedback]', { message: text.trim(), timestamp: new Date().toISOString() })
    setSubmitted(true)
    setTimeout(() => {
      setOpen(false)
      setText('')
      setSubmitted(false)
    }, 1200)
  }

  return (
    <>
      {/*
        Position INSIDE phone frame on desktop.
        Phone frame is max-width 390px, centered.
        right = max(14px, (100vw - 390px)/2 + 14px)
        → on mobile (≤390px): 14px
        → on desktop (>390px): positions inside right edge of phone frame
      */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Góp ý"
        style={{
          position: 'fixed',
          bottom: 'calc(var(--nav-height) + 14px)',
          right: 'max(14px, calc((100vw - 390px) / 2 + 14px))',
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: 'var(--brand-gradient)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 15,
          boxShadow: '0 2px 10px rgba(255,60,172,0.35)',
          zIndex: 8000,
          opacity: 0.82,
          transition: 'transform 0.15s ease, opacity 0.15s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1'
          e.currentTarget.style.transform = 'scale(1.1)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0.82'
          e.currentTarget.style.transform = 'scale(1)'
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
      >
        💬
      </button>

      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            zIndex: 8001,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 390,
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
              padding: '20px 20px',
              paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
              border: '1px solid rgba(255,255,255,0.07)',
              borderBottom: 'none',
              boxShadow: '0 -4px 32px rgba(0,0,0,0.4)',
            }}
          >
            {/* Drag handle */}
            <div style={{
              width: 32, height: 3,
              background: 'rgba(255,255,255,0.12)',
              borderRadius: 2,
              margin: '0 auto 18px',
            }}/>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '16px 0 8px' }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>✅</div>
                <p style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>
                  Cảm ơn bạn!
                </p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                  Góp ý của bạn rất có giá trị với Veya 💜
                </p>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                  💬 Góp ý nhanh
                </h2>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14, lineHeight: 1.5 }}>
                  Chia sẻ trải nghiệm để Veya tốt hơn
                </p>

                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Bạn thấy app thế nào? Có gì cần cải thiện không? 🙂"
                  rows={4}
                  style={{
                    width: '100%',
                    background: 'var(--bg-input)',
                    border: '1.5px solid rgba(255,255,255,0.07)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 14px',
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: 'var(--text-primary)',
                    resize: 'none',
                    outline: 'none',
                    marginBottom: 12,
                    display: 'block',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--pink)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
                />

                <button
                  onClick={handleSubmit}
                  disabled={!text.trim()}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: 'var(--radius-full)',
                    background: text.trim() ? 'var(--brand-gradient)' : 'rgba(255,255,255,0.05)',
                    color: text.trim() ? '#fff' : 'var(--text-muted)',
                    border: 'none',
                    cursor: text.trim() ? 'pointer' : 'default',
                    fontWeight: 600,
                    fontSize: 15,
                    boxShadow: text.trim() ? 'var(--shadow-btn)' : 'none',
                    transition: 'background 0.2s, transform 0.15s',
                  }}
                  onMouseDown={(e) => text.trim() && (e.currentTarget.style.transform = 'scale(0.97)')}
                  onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  Gửi góp ý
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
