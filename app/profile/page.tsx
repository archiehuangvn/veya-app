'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import AudioPlayer from '@/components/AudioPlayer'
import type { UserProfile } from '@/types/user'

const ALL_PERSONALITIES = [
  'Tích cực', 'Cảm xúc', 'Dễ gần', 'Độc lập', 'Tự tin', 
  'Nhẹ nhàng', 'Hài hước', 'Sâu sắc', 'Năng động', 'Truyền thống'
]

const ALL_TAGS = [
  'Nghệ thuật & sáng tạo', 'Công nghệ', 'Ngôn ngữ', 'Giải trí', 
  'Thể thao', 'Lối sống', 'Xã hội', 'Thiện nguyện', 'Ẩm thực', 'Chụp ảnh', 'Du lịch'
]

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout } = useFirebaseAuth()

  const [profile, setProfile] = useState<Partial<UserProfile> | null>(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState<Partial<UserProfile>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) return
    const fetchProfile = async () => {
      const snap = await getDoc(doc(db, 'users', user.uid))
      if (snap.exists()) {
        const data = snap.data() as UserProfile
        setProfile(data)
        setFormData(data)
      }
      setLoading(false)
    }
    fetchProfile()
  }, [user])

  const handleLogout = async () => {
    await logout()
    router.replace('/auth')
  }

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    await setDoc(doc(db, 'users', user.uid), formData, { merge: true })
    setProfile(formData)
    setEditMode(false)
    setSaving(false)
  }

  const handleCancel = () => {
    setFormData(profile || {})
    setEditMode(false)
  }

  // --- Calculations ---
  const calcCompletion = () => {
    if (!profile) return 0
    let score = 0
    // Basic Info: 25%
    if (profile.name && profile.age && profile.gender) score += 25
    // Bio: 25%
    if (profile.bio && profile.bio.trim().length > 0) score += 25
    // Audio: 25%
    if (profile.audioUrl) score += 25
    // Tags (>= 3): 25%
    if (profile.tags && profile.tags.length >= 3) score += 25
    return score
  }

  const completionPercent = calcCompletion()

  if (loading) {
    return <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Đang tải...</div>
  }

  if (!profile) return null

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', background: 'var(--bg-base)', paddingBottom: 100 }}>
      {/* Header */}
      <div className="screen-header" style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(13,13,26,0.85)', backdropFilter: 'blur(10px)' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Hồ sơ của tôi</h1>
        {editMode ? (
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={handleCancel} className="btn-ghost" style={{ fontSize: 13 }}>Huỷ</button>
            <button onClick={handleSave} className="btn-ghost" style={{ color: 'var(--brand-primary)', fontWeight: 600, fontSize: 13 }}>
              {saving ? 'Lưu...' : 'Lưu'}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => setEditMode(true)} className="btn-ghost" style={{ fontSize: 13 }}>Sửa</button>
            <button onClick={handleLogout} className="btn-ghost" style={{ color: '#ff6b8a', fontSize: 13 }}>Đăng xuất</button>
          </div>
        )}
      </div>

      <div style={{ padding: '20px' }}>
        {/* Avatar & Completion */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
          <div style={{
            width: 100, height: 100, borderRadius: '50%',
            background: 'var(--brand-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 40, fontWeight: 700, color: '#fff', marginBottom: 16
          }}>{profile.name?.charAt(0) || '?'}</div>

          {!editMode && (
            <div style={{ textAlign: 'center', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                <span style={{ color: 'var(--text-muted)' }}>Mức độ hoàn thiện</span>
                <span style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>{completionPercent}%</span>
              </div>
              <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${completionPercent}%`, height: '100%', background: 'var(--brand-gradient)', transition: 'width 0.4s ease' }} />
              </div>
            </div>
          )}
        </div>

        {/* Form or View Mode */}
        {editMode ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <Section title="Thông tin cơ bản">
              <label className="block text-sm text-gray-400 mb-1">Tên</label>
              <input className="input" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} style={{marginBottom:12}} />
              
              <div style={{ display: 'flex', gap: 12, marginBottom:12 }}>
                <div style={{ flex: 1 }}>
                  <label className="block text-sm text-gray-400 mb-1">Tuổi</label>
                  <input className="input" type="number" value={formData.age || ''} onChange={e => setFormData({...formData, age: Number(e.target.value)})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="block text-sm text-gray-400 mb-1">Chiều cao (cm)</label>
                  <input className="input" type="number" value={formData.height || ''} onChange={e => setFormData({...formData, height: Number(e.target.value)})} />
                </div>
              </div>

              <label className="block text-sm text-gray-400 mb-1">Khu vực</label>
              <input className="input" value={formData.district || ''} onChange={e => setFormData({...formData, district: e.target.value})} style={{marginBottom:12}} />
              
              <label className="block text-sm text-gray-400 mb-1">Nghề nghiệp</label>
              <input className="input" value={formData.occupation || ''} onChange={e => setFormData({...formData, occupation: e.target.value})} style={{marginBottom:12}} />
              
              <label className="block text-sm text-gray-400 mb-1">Trường học</label>
              <input className="input" value={formData.school || ''} onChange={e => setFormData({...formData, school: e.target.value})} />
            </Section>

            <Section title="Giới thiệu">
              <label className="block text-sm text-gray-400 mb-1">Trạng thái (Status)</label>
              <input className="input" value={formData.status || ''} onChange={e => setFormData({...formData, status: e.target.value})} style={{marginBottom:12}} />
              
              <label className="block text-sm text-gray-400 mb-1">Bio</label>
              <textarea className="input" rows={3} value={formData.bio || ''} onChange={e => setFormData({...formData, bio: e.target.value})} />
            </Section>

            <Section title="Mục tiêu hẹn hò">
              <label className="block text-sm text-gray-400 mb-1">Tình trạng</label>
              <select className="input" value={formData.relationshipStatus || 'single'} onChange={e => setFormData({...formData, relationshipStatus: e.target.value as 'single' | 'complicated'})} style={{marginBottom:12}}>
                <option value="single">Độc thân</option>
                <option value="complicated">Đang phức tạp</option>
              </select>

              <label className="block text-sm text-gray-400 mb-1">Mục tiêu</label>
              <select className="input" value={formData.datingGoal || 'dating'} onChange={e => setFormData({...formData, datingGoal: e.target.value as 'friends' | 'dating' | 'serious'})} style={{marginBottom:12}}>
                <option value="friends">Tìm bạn</option>
                <option value="dating">Hẹn hò</option>
                <option value="serious">Nghiêm túc</option>
              </select>
            </Section>

            <Section title="Tính cách">
              <MultiSelectBox 
                options={ALL_PERSONALITIES} 
                selected={formData.personality || []} 
                onChange={(vals) => setFormData({...formData, personality: vals})}
              />
            </Section>

            <Section title="Sở thích">
              <MultiSelectBox 
                options={ALL_TAGS} 
                selected={formData.tags || []} 
                onChange={(vals) => setFormData({...formData, tags: vals})}
              />
            </Section>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <Section title="Giọng nói & Giới thiệu">
              {profile.audioUrl ? (
                <div style={{ marginBottom: 16 }}><AudioPlayer src={profile.audioUrl} /></div>
              ) : (
                <p style={{ color: '#ff6b8a', fontSize: 13, marginBottom: 10 }}>Chưa có audio</p>
              )}
              {profile.status && <p style={{ fontWeight: 600, color: 'var(--brand-primary)', marginBottom: 8 }}>“{profile.status}”</p>}
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{profile.bio || 'Chưa cập nhật bio...'}</p>
            </Section>

            <Section title="Thông tin cơ bản">
              <GridRow label="Tuổi" value={profile.age ? `${profile.age} tuổi` : ''} />
              <GridRow label="Khu vực" value={profile.district} />
              <GridRow label="Chiều cao" value={profile.height ? `${profile.height} cm` : ''} />
              <GridRow label="Cân nặng" value={profile.weight ? `${profile.weight} kg` : ''} />
              <GridRow label="Công việc" value={profile.occupation} />
              <GridRow label="Trường học" value={profile.school} />
            </Section>

            <Section title="Mục tiêu hẹn hò">
              <GridRow label="Tình trạng" value={profile.relationshipStatus === 'complicated' ? 'Phức tạp' : 'Độc thân'} />
              <GridRow label="Tìm kiếm" value={profile.datingGoal === 'friends' ? 'Tâm sự' : profile.datingGoal === 'serious' ? 'Mối quan hệ nghiêm túc' : 'Hẹn hò vui vẻ'} />
            </Section>

            <Section title="Tính cách">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {profile.personality?.length ? profile.personality.map(t => <span key={t} className="tag">{t}</span>) : <span className="text-sm text-gray-500">Chưa có</span>}
              </div>
            </Section>

            <Section title="Sở thích">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {profile.tags?.length ? profile.tags.map(t => <span key={t} className="tag">{t}</span>) : <span className="text-sm text-gray-500">Chưa có</span>}
              </div>
            </Section>
          </div>
        )}
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div style={{ 
      background: 'var(--bg-surface)', 
      padding: 16, 
      borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.05)'
    }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>{title}</h3>
      {children}
    </div>
  )
}

function GridRow({ label, value }: { label: string, value: string | number | undefined | null }) {
  if (!value) return null
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14 }}>
      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontWeight: 500, color: 'var(--text-primary)', textAlign: 'right', flex: 1, marginLeft: 16 }}>{value}</span>
    </div>
  )
}

function MultiSelectBox({ options, selected, onChange }: { options: string[], selected: string[], onChange: (v: string[]) => void }) {
  const toggle = (opt: string) => {
    let next = [...selected]
    if (next.includes(opt)) next = next.filter(x => x !== opt)
    else next.push(opt)
    onChange(next)
  }
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map(o => {
        const active = selected.includes(o)
        return (
          <button
            key={o}
            onClick={() => toggle(o)}
            style={{
              padding: '6px 12px', borderRadius: 16,
              background: active ? 'var(--brand-primary)' : 'transparent',
              border: `1px solid ${active ? 'var(--brand-primary)' : 'rgba(255,255,255,0.2)'}`,
              color: active ? '#fff' : 'var(--text-muted)',
              fontSize: 13, cursor: 'pointer'
            }}
          >
            {o}
          </button>
        )
      })}
    </div>
  )
}
