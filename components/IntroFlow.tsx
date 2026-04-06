'use client'

import { useEffect, useState } from 'react'

type IntroStep = 'slogan' | 'disclaimer'

interface Section {
  heading: string
  body?: string
  bullets?: string[]
  footer?: string
}

const SECTIONS: Section[] = [
  {
    heading: 'Về ứng dụng',
    body: 'Veya – LắngNgheNhau là ứng dụng kết nối dành cho người Việt tại Đài Loan, giúp bạn gặp gỡ và tìm hiểu nhau thông qua giọng nói.',
  },
  {
    heading: 'Điều kiện sử dụng',
    body: 'Bằng cách tiếp tục, bạn xác nhận rằng:',
    bullets: [
      'Bạn từ 18 tuổi trở lên',
      'Thông tin bạn cung cấp là trung thực và chính xác',
      'Bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của Veya',
    ],
  },
  {
    heading: 'Cam kết cộng đồng',
    body: 'Để giữ môi trường an toàn và tôn trọng, bạn đồng ý:',
    bullets: [
      'Giao tiếp văn minh, tôn trọng người khác',
      'Không quấy rối, xúc phạm, lừa đảo hoặc có hành vi không phù hợp',
      'Không chia sẻ nội dung nhạy cảm, phản cảm hoặc vi phạm pháp luật',
    ],
    footer: 'Vi phạm có thể dẫn đến khóa tài khoản vĩnh viễn.',
  },
  {
    heading: 'Quyền riêng tư',
    body: 'Veya cam kết bảo vệ thông tin cá nhân của bạn. Chúng tôi không chia sẻ dữ liệu với bên thứ ba nếu không có sự đồng ý của bạn, trừ khi có yêu cầu pháp lý.',
  },
  {
    heading: 'Lưu ý quan trọng',
    bullets: [
      'Veya chỉ là nền tảng kết nối, không chịu trách nhiệm cho các tương tác hoặc gặp gỡ ngoài đời thực',
      'Hãy luôn cẩn trọng và tự bảo vệ bản thân khi gặp người lạ',
    ],
    footer: 'Nếu bạn gặp hành vi không phù hợp, hãy sử dụng tính năng Báo cáo trong ứng dụng.',
  },
]

export default function IntroFlow({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState<IntroStep>('slogan')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Fade in slogan
    const t1 = setTimeout(() => setVisible(true), 80)
    // After 2.5s, fade out and switch to disclaimer
    const t2 = setTimeout(() => {
      setVisible(false)
      setTimeout(() => {
        setStep('disclaimer')
        setTimeout(() => setVisible(true), 80)
      }, 300)
    }, 2500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const handleAgree = () => {
    setVisible(false)
    setTimeout(() => onDone(), 250)
  }

  const cardStyle: React.CSSProperties = {
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius-md)',
    padding: '16px',
    border: '1px solid rgba(255,255,255,0.07)',
  }

  const headingStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 700,
    color: 'var(--pink)',
    marginBottom: 8,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  }

  const bodyStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 400,
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
  }

  const bulletStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 400,
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
    paddingLeft: 4,
    display: 'flex',
    gap: 8,
    alignItems: 'flex-start',
  }

  /* ---- SLOGAN SCREEN ---- */
  if (step === 'slogan') {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--bg-base)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.25s ease',
        padding: '0 32px',
      }}>
        {/* Logo */}
        <div style={{
          width: 80,
          height: 80,
          borderRadius: 28,
          background: 'var(--brand-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 38,
          boxShadow: 'var(--shadow-glow)',
          marginBottom: 28,
        }}>
          🎧
        </div>

        <p style={{
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--text-muted)',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          marginBottom: 16,
        }}>
          Veya
        </p>

        <h1 style={{
          fontSize: 30,
          fontWeight: 700,
          textAlign: 'center',
          lineHeight: 1.25,
          letterSpacing: '-0.2px',
          background: 'var(--brand-gradient)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          maxWidth: 280,
        }}>
          Lắng nghe nhau tới khi về già
        </h1>

        <div style={{ display: 'flex', gap: 8, marginTop: 40 }}>
          {['var(--pink)', 'var(--purple)', 'var(--blue)'].map((c, i) => (
            <div key={i} style={{
              width: 6, height: 6, borderRadius: '50%',
              background: c, opacity: 0.6,
            }}/>
          ))}
        </div>
      </div>
    )
  }

  /* ---- DISCLAIMER SCREEN ---- */
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--bg-base)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 9999,
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.25s ease',
      maxWidth: 420,
      margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{ padding: '48px 20px 12px', flexShrink: 0 }}>
        <h1 style={{
          fontSize: 24,
          fontWeight: 700,
          lineHeight: 1.25,
          letterSpacing: '-0.2px',
          background: 'var(--brand-gradient)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: 6,
        }}>
          Trước khi bắt đầu
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.55 }}>
          Vui lòng đọc và đồng ý với các điều khoản dưới đây để tiếp tục sử dụng Veya – LắngNgheNhau.
        </p>
      </div>

      {/* Scrollable sections */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '4px 20px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}>
        {SECTIONS.map((s) => (
          <div key={s.heading} style={cardStyle}>
            <p style={headingStyle}>{s.heading}</p>
            {s.body && <p style={{ ...bodyStyle, marginBottom: s.bullets ? 8 : 0 }}>{s.body}</p>}
            {s.bullets && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: s.footer ? 8 : 0 }}>
                {s.bullets.map((b, i) => (
                  <div key={i} style={bulletStyle}>
                    <span style={{ color: 'var(--pink)', flexShrink: 0, marginTop: 1 }}>•</span>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            )}
            {s.footer && (
              <p style={{ ...bodyStyle, color: 'var(--text-muted)', fontSize: 13, fontStyle: 'italic' }}>
                {s.footer}
              </p>
            )}
          </div>
        ))}

        {/* Bottom note */}
        <div style={{
          padding: '12px 16px',
          border: '1px solid rgba(255,60,172,0.2)',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(255,60,172,0.05)',
        }}>
          <p style={{ ...bodyStyle, fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>
            Bằng cách tiếp tục, bạn đồng ý với các điều khoản trên.
          </p>
        </div>
      </div>

      {/* Fixed CTA */}
      <div style={{
        flexShrink: 0,
        padding: '14px 20px',
        paddingBottom: 'calc(20px + env(safe-area-inset-bottom, 0px))',
        background: 'linear-gradient(to top, var(--bg-base) 75%, transparent)',
      }}>
        <button
          onClick={handleAgree}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--brand-gradient)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 16,
            lineHeight: 1,
            letterSpacing: '0px',
            boxShadow: 'var(--shadow-btn)',
            transition: 'transform 0.15s ease',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          ✓ Tôi đồng ý, bắt đầu thôi!
        </button>
      </div>
    </div>
  )
}
