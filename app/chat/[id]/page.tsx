'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { messagesByUserId, profiles, type Message } from '@/data/mockData'
import AudioPlayer from '@/components/AudioPlayer'
import { Analytics } from '@/utils/analytics'

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [userId, setUserId] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    params.then(({ id }) => {
      setUserId(id)
      setMessages(messagesByUserId[id] ?? [])
      Analytics.pageView(`/chat/${id}`)
    })
  }, [params])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const profile = profiles.find((p) => p.id === userId)

  const sendMessage = () => {
    const text = inputText.trim()
    if (!text) return
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      type: 'text',
      content: text,
      timestamp: new Date().toISOString(),
    }
    Analytics.messageSent('text', userId)
    setMessages((prev) => [...prev, newMsg])
    setInputText('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage()
  }

  if (!profile) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Không tìm thấy người dùng</p>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div className="screen-header" style={{ borderBottom: '1px solid var(--border)' }}>
        <button
          onClick={() => router.back()}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: 22,
            cursor: 'pointer',
            padding: '4px 8px',
          }}
          aria-label="Back"
        >
          ←
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: `linear-gradient(135deg, hsl(${(profile.id.charCodeAt(5) * 37) % 360}, 60%, 40%) 0%, hsl(${(profile.id.charCodeAt(5) * 71) % 360}, 50%, 30%) 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            fontWeight: 700,
            color: '#fff',
            border: '1.5px solid var(--brand-primary)',
          }}>
            {profile.name[0]}
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: 15 }}>{profile.name}</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>● Online</p>
          </div>
        </div>

        <div style={{ width: 40 }} />
      </div>

      {/* Message List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>
        {messages.map((msg) => {
          const isMine = msg.senderId === 'me'
          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: isMine ? 'flex-end' : 'flex-start',
              }}
            >
              {msg.type === 'voice' ? (
                <div style={{
                  background: isMine ? 'var(--brand-gradient)' : 'var(--bg-card)',
                  borderRadius: isMine
                    ? 'var(--radius-md) var(--radius-md) 4px var(--radius-md)'
                    : 'var(--radius-md) var(--radius-md) var(--radius-md) 4px',
                  padding: '10px 14px',
                  border: '1px solid var(--border)',
                  maxWidth: '75%',
                }}>
                  <AudioPlayer src={msg.content} mini />
                  {msg.duration && (
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>
                      {msg.duration}s
                    </p>
                  )}
                </div>
              ) : (
                <div style={{
                  background: isMine ? 'var(--brand-gradient)' : 'var(--bg-card)',
                  color: isMine ? '#fff' : 'var(--text-primary)',
                  borderRadius: isMine
                    ? 'var(--radius-md) var(--radius-md) 4px var(--radius-md)'
                    : 'var(--radius-md) var(--radius-md) var(--radius-md) 4px',
                  padding: '10px 14px',
                  fontSize: 14,
                  lineHeight: 1.5,
                  maxWidth: '75%',
                  border: isMine ? 'none' : '1px solid var(--border)',
                  boxShadow: isMine ? 'var(--shadow-btn)' : 'none',
                }}>
                  {msg.content}
                </div>
              )}
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        background: 'var(--bg-surface)',
        flexShrink: 0,
      }}>
        <input
          className="input"
          type="text"
          placeholder="Nhắn tin..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ flex: 1 }}
        />
        <button
          onClick={sendMessage}
          disabled={!inputText.trim()}
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: inputText.trim() ? 'var(--brand-gradient)' : 'var(--bg-input)',
            border: 'none',
            cursor: inputText.trim() ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            transition: 'background 0.2s',
            flexShrink: 0,
          }}
          aria-label="Send"
        >
          ➤
        </button>
      </div>
    </div>
  )
}
