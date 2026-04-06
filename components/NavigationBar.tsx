'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { href: '/discover', label: 'Khám phá', icon: '🔥' },
  { href: '/matches',  label: 'Match',    icon: '💞' },
  { href: '/chat',     label: 'Tin nhắn', icon: '💬' },
  { href: '/profile',  label: 'Tôi',      icon: '👤' },
]

export default function NavigationBar() {
  const pathname = usePathname()

  return (
    <nav style={{
      height: 'var(--nav-height)',
      display: 'flex',
      alignItems: 'stretch',
      background: 'var(--bg-surface)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      flexShrink: 0,
      position: 'relative',
    }}>
      {/* Top gradient accent line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 1,
        background: 'var(--brand-gradient)',
        opacity: 0.3,
      }}/>

      {TABS.map((tab) => {
        const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/')
        return (
          <Link
            key={tab.href}
            href={tab.href}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              textDecoration: 'none',
              position: 'relative',
              transition: 'opacity 0.15s',
            }}
          >
            {/* Active indicator pill */}
            {isActive && (
              <div style={{
                position: 'absolute',
                top: 0,
                width: 32,
                height: 2,
                background: 'var(--brand-gradient)',
                borderRadius: '0 0 2px 2px',
              }}/>
            )}

            <span style={{
              fontSize: 21,
              transition: 'transform 0.15s ease',
              transform: isActive ? 'scale(1.1)' : 'scale(1)',
              filter: isActive ? 'drop-shadow(0 0 4px rgba(255,60,172,0.4))' : 'none',
            }}>
              {tab.icon}
            </span>
            <span style={{
              fontSize: 10,
              fontWeight: 600,
              color: isActive ? 'var(--pink)' : 'var(--text-muted)',
              transition: 'color 0.15s',
              letterSpacing: 0.3,
            }}>
              {tab.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
