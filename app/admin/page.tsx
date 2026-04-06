'use client'
// ============================================================
// app/admin/page.tsx — Simple internal admin panel
// Access: hardcoded admin email only
// ============================================================
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  collection, getDocs, doc, updateDoc, deleteDoc,
  addDoc, serverTimestamp, getDoc, setDoc,
} from 'firebase/firestore'
import { db, auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'

const ADMIN_EMAIL = 'archiehuang.work@gmail.com'

interface UserDoc {
  uid: string
  name: string
  bio?: string
  audioUrl?: string
  avatar?: string
  tags?: string[]
}

interface Settings {
  slogan: string
  disclaimerText: string
}

type Tab = 'users' | 'seed' | 'settings'

export default function AdminPage() {
  const router = useRouter()
  const [authed, setAuthed] = useState(false)
  const [tab, setTab] = useState<Tab>('users')

  // Auth gate
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      if (!u || u.email !== ADMIN_EMAIL) {
        router.replace('/discover')
      } else {
        setAuthed(true)
      }
    })
  }, [router])

  if (!authed) {
    return (
      <div style={{ padding: 40, color: '#fff', textAlign: 'center' }}>
        Đang xác thực...
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0D0D1A', color: '#fff', padding: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>⚙️ Veya Admin</h1>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {(['users', 'seed', 'settings'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '8px 18px', borderRadius: 8,
              background: tab === t ? '#FF3CAC' : '#1A1A35',
              color: '#fff', border: 'none', cursor: 'pointer',
              fontWeight: tab === t ? 700 : 400, fontSize: 14,
            }}
          >
            {t === 'users' ? '👥 Users' : t === 'seed' ? '➕ Seed Profile' : '⚙️ Settings'}
          </button>
        ))}
      </div>

      {tab === 'users'    && <UserManagement />}
      {tab === 'seed'     && <SeedProfile />}
      {tab === 'settings' && <ContentSettings />}
    </div>
  )
}

// ============================================================
// 1. User Management
// ============================================================
function UserManagement() {
  const [users, setUsers]     = useState<UserDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm]       = useState<Partial<UserDoc>>({})
  const [saving, setSaving]   = useState(false)
  const [msg, setMsg]         = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const snap = await getDocs(collection(db, 'users'))
    setUsers(snap.docs.map((d) => ({ uid: d.id, ...(d.data() as Omit<UserDoc, 'uid'>) })))
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const startEdit = (u: UserDoc) => {
    setEditing(u.uid)
    setForm({ name: u.name, bio: u.bio ?? '', audioUrl: u.audioUrl ?? '' })
  }

  const save = async () => {
    if (!editing) return
    setSaving(true)
    await updateDoc(doc(db, 'users', editing), { ...form })
    setSaving(false)
    setEditing(null)
    setMsg('✅ Đã lưu')
    load()
    setTimeout(() => setMsg(''), 2000)
  }

  const del = async (uid: string) => {
    if (!confirm('Xoá user này?')) return
    await deleteDoc(doc(db, 'users', uid))
    setMsg('🗑️ Đã xoá')
    load()
    setTimeout(() => setMsg(''), 2000)
  }

  if (loading) return <p style={{ color: '#A0A0C0' }}>Đang tải...</p>

  return (
    <div>
      {msg && <div style={{ marginBottom: 12, color: '#FF3CAC', fontWeight: 600 }}>{msg}</div>}
      {users.length === 0 && <p style={{ color: '#5A5A7A' }}>Chưa có user nào.</p>}
      {users.map((u) => (
        <div key={u.uid} style={{
          background: '#1A1A35', borderRadius: 12, padding: 16,
          marginBottom: 12, border: '1px solid rgba(255,255,255,0.07)',
        }}>
          {editing === u.uid ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input
                style={inputStyle}
                placeholder="Tên"
                value={form.name ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
              <textarea
                style={{ ...inputStyle, height: 80, resize: 'vertical' }}
                placeholder="Bio"
                value={form.bio ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              />
              <input
                style={inputStyle}
                placeholder="Audio URL"
                value={form.audioUrl ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, audioUrl: e.target.value }))}
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={save} disabled={saving} style={btnPrimary}>
                  {saving ? 'Đang lưu...' : '💾 Lưu'}
                </button>
                <button onClick={() => setEditing(null)} style={btnGhost}>Huỷ</button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{u.name || '(no name)'}</div>
                <div style={{ color: '#5A5A7A', fontSize: 12, marginTop: 2 }}>{u.uid}</div>
                {u.bio && <div style={{ color: '#A0A0C0', fontSize: 13, marginTop: 4 }}>{u.bio.slice(0, 80)}...</div>}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => startEdit(u)} style={btnGhost}>✏️</button>
                <button onClick={() => del(u.uid)} style={{ ...btnGhost, color: '#ff6b8a' }}>🗑️</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ============================================================
// 2. Seed Profile
// ============================================================
function SeedProfile() {
  const [form, setForm] = useState({
    name: '', bio: '', avatar: '', audioUrl: '', tags: '',
  })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg]       = useState('')

  const submit = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    const tagsArr = form.tags.split(',').map((t) => t.trim()).filter(Boolean)
    await addDoc(collection(db, 'users'), {
      name:       form.name.trim(),
      bio:        form.bio.trim(),
      avatar:     form.avatar.trim(),
      audioUrl:   form.audioUrl.trim(),
      tags:       tagsArr,
      createdAt:  serverTimestamp(),
      lastActive: serverTimestamp(),
    })
    setSaving(false)
    setMsg('✅ Profile đã tạo!')
    setForm({ name: '', bio: '', avatar: '', audioUrl: '', tags: '' })
    setTimeout(() => setMsg(''), 3000)
  }

  return (
    <div style={{ maxWidth: 480 }}>
      {msg && <div style={{ marginBottom: 12, color: '#FF3CAC', fontWeight: 600 }}>{msg}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input style={inputStyle} placeholder="Tên *" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        <textarea style={{ ...inputStyle, height: 80, resize: 'vertical' }} placeholder="Bio" value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} />
        <input style={inputStyle} placeholder="Avatar URL" value={form.avatar} onChange={(e) => setForm((f) => ({ ...f, avatar: e.target.value }))} />
        <input style={inputStyle} placeholder="Audio URL" value={form.audioUrl} onChange={(e) => setForm((f) => ({ ...f, audioUrl: e.target.value }))} />
        <input style={inputStyle} placeholder="Tags (cách bằng dấu phẩy)" value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} />
        <button onClick={submit} disabled={saving || !form.name.trim()} style={btnPrimary}>
          {saving ? 'Đang tạo...' : '➕ Tạo Profile'}
        </button>
      </div>
    </div>
  )
}

// ============================================================
// 3. Content Settings
// ============================================================
function ContentSettings() {
  const [settings, setSettings] = useState<Settings>({ slogan: '', disclaimerText: '' })
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [msg, setMsg]           = useState('')

  useEffect(() => {
    getDoc(doc(db, 'settings', 'app')).then((snap) => {
      if (snap.exists()) setSettings(snap.data() as Settings)
      setLoading(false)
    })
  }, [])

  const save = async () => {
    setSaving(true)
    await setDoc(doc(db, 'settings', 'app'), settings, { merge: true })
    setSaving(false)
    setMsg('✅ Đã lưu')
    setTimeout(() => setMsg(''), 2000)
  }

  if (loading) return <p style={{ color: '#A0A0C0' }}>Đang tải...</p>

  return (
    <div style={{ maxWidth: 480 }}>
      {msg && <div style={{ marginBottom: 12, color: '#FF3CAC', fontWeight: 600 }}>{msg}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <label style={{ color: '#A0A0C0', fontSize: 13 }}>Slogan</label>
        <input
          style={inputStyle}
          value={settings.slogan}
          onChange={(e) => setSettings((s) => ({ ...s, slogan: e.target.value }))}
          placeholder="Lắng nghe nhau tới khi về già"
        />
        <label style={{ color: '#A0A0C0', fontSize: 13, marginTop: 8 }}>Disclaimer Text</label>
        <textarea
          style={{ ...inputStyle, height: 120, resize: 'vertical' }}
          value={settings.disclaimerText}
          onChange={(e) => setSettings((s) => ({ ...s, disclaimerText: e.target.value }))}
          placeholder="Nội dung disclaimer..."
        />
        <button onClick={save} disabled={saving} style={btnPrimary}>
          {saving ? 'Đang lưu...' : '💾 Lưu Settings'}
        </button>
      </div>
    </div>
  )
}

// ============================================================
// Shared styles
// ============================================================
const inputStyle: React.CSSProperties = {
  background: '#20203A',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  padding: '10px 14px',
  color: '#fff',
  fontSize: 14,
  outline: 'none',
  width: '100%',
}

const btnPrimary: React.CSSProperties = {
  background: 'linear-gradient(135deg, #FF3CAC, #784BA0)',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '10px 20px',
  fontWeight: 600,
  fontSize: 14,
  cursor: 'pointer',
}

const btnGhost: React.CSSProperties = {
  background: 'rgba(255,255,255,0.06)',
  color: '#A0A0C0',
  border: 'none',
  borderRadius: 8,
  padding: '8px 14px',
  fontSize: 13,
  cursor: 'pointer',
}
