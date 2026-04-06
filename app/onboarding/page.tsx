'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { uploadAudio } from '@/lib/storageAudio'
import AudioPlayer from '@/components/AudioPlayer'
import { markProfileCompletedCache } from '@/components/AuthGuard'

export type OnboardingData = {
  name: string
  age: number
  gender: 'male' | 'female' | 'other'
  district: string
  occupation: string
  tags: string[]
  audioUrl?: string
  audioBlob?: Blob // temporary for uploading
}

const ALL_TAGS = [
  'Nghệ thuật & sáng tạo', 'Công nghệ', 'Ngôn ngữ', 'Giải trí', 
  'Thể thao', 'Lối sống', 'Xã hội', 'Thiện nguyện', 'Ẩm thực', 'Du lịch', 'Chụp ảnh'
]

export default function OnboardingPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useFirebaseAuth()

  const [step, setStep] = useState(1)
  const [data, setData] = useState<OnboardingData>({
    name: '',
    age: 24,
    gender: 'female',
    district: '',
    occupation: '',
    tags: []
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authLoading && !user) router.replace('/auth')
  }, [authLoading, user, router])

  if (authLoading || !user) return null

  const handleNext = () => setStep(s => s + 1)
  const handlePrev = () => setStep(s => Math.max(1, s - 1))

  const handleComplete = async () => {
    setSaving(true)
    setError('')
    try {
      let finalAudioUrl = data.audioUrl || ''

      // Upload audio if freshly recorded
      if (data.audioBlob) {
        // use webm since browsers record webm/webm natively
        const file = new File([data.audioBlob], `intro_${Date.now()}.webm`, { type: 'audio/webm' })
        finalAudioUrl = await uploadAudio(user.uid, file)
      }

      await setDoc(doc(db, 'users', user.uid), {
        name: data.name,
        age: data.age,
        gender: data.gender,
        district: data.district,
        occupation: data.occupation,
        tags: data.tags,
        audioUrl: finalAudioUrl,
        profileCompleted: true,
      }, { merge: true })

      markProfileCompletedCache(user.uid)
      router.replace('/discover')
    } catch (err) {
      console.error(err)
      setError('Đã xảy ra lỗi khi lưu thông tin. Vui lòng thử lại.')
      setSaving(false)
    }
  }

  // Disable rule for step 5
  const canComplete = Boolean(data.audioUrl || data.audioBlob)

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100dvh', background: 'var(--bg-base)' }}>
      {/* Header */}
      <div style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {step > 1 ? (
          <button onClick={handlePrev} className="btn-ghost" style={{ padding: 8 }}>←</button>
        ) : <div style={{ width: 40 }}/>}
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Bước {step} / 5</div>
        <div style={{ width: 40 }}/>
      </div>

      <div style={{ flex: 1, padding: '0 24px', overflowY: 'auto', paddingBottom: 40 }}>
        {step === 1 && <Step1Basic data={data} onChange={(d: Partial<OnboardingData>) => setData({ ...data, ...d })} />}
        {step === 2 && <Step2Job data={data} onChange={(d: Partial<OnboardingData>) => setData({ ...data, ...d })} />}
        {step === 3 && <Step3Tags data={data} onChange={(d: Partial<OnboardingData>) => setData({ ...data, ...d })} />}
        {step === 4 && <Step4Voice data={data} onChange={(d: Partial<OnboardingData>) => setData({ ...data, ...d })} onSkip={handleNext} />}
        {step === 5 && <Step5Confirm data={data} />}
      </div>

      {/* Footer */}
      <div style={{ padding: '24px', paddingTop: 0 }}>
        {error && <p style={{ color: '#ff6b8a', fontSize: 13, textAlign: 'center', marginBottom: 12 }}>{error}</p>}
        
        {step < 5 && step !== 4 ? (
          <button 
            onClick={handleNext} 
            className="btn btn-primary" 
            style={{ width: '100%', height: 48 }}
            disabled={
              (step === 1 && (!data.name || !data.age)) ||
              (step === 2 && (!data.district || !data.occupation)) ||
              (step === 3 && data.tags.length === 0)
            }
          >
            Tiếp tục
          </button>
        ) : step === 5 ? (
          <>
            {!canComplete && (
              <p style={{ color: '#ff6b8a', fontSize: 13, textAlign: 'center', marginBottom: 12 }}>
                Bạn cần quay lại Bước 4 để Ghi âm giới thiệu trước khi hoàn tất hồ sơ.
              </p>
            )}
            <button 
              onClick={handleComplete} 
              className="btn btn-primary" 
              style={{ width: '100%', height: 48, filter: canComplete ? 'none' : 'grayscale(1)', opacity: canComplete ? 1 : 0.6 }}
              disabled={saving || !canComplete}
            >
              {saving ? 'Đang hoàn tất...' : 'Hoàn tất hồ sơ'}
            </button>
          </>
        ) : null /* step 4 has its own button logic */}
      </div>
    </div>
  )
}

// ----------------------------------------------------
// STEPS COMPONENTS
// ----------------------------------------------------
function Step1Basic({ data, onChange }: { data: OnboardingData, onChange: (d: Partial<OnboardingData>) => void }) {
  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Thông tin cơ bản</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 32 }}>Hãy cho mọi người biết bạn là ai.</p>

      <label className="block text-sm text-gray-400 mb-2">Tên của bạn</label>
      <input 
        className="input" 
        value={data.name} 
        onChange={e => onChange({ name: e.target.value })} 
        placeholder="Nhập tên..." 
        style={{ marginBottom: 20 }}
      />

      <label className="block text-sm text-gray-400 mb-2">Tuổi</label>
      <input 
        className="input" 
        type="number" 
        value={data.age} 
        onChange={e => onChange({ age: parseInt(e.target.value) || 18 })} 
        style={{ marginBottom: 20 }}
      />

      <label className="block text-sm text-gray-400 mb-2">Giới tính</label>
      <div style={{ display: 'flex', gap: 12 }}>
        {['male', 'female'].map(g => (
          <button
            key={g}
            onClick={() => onChange({ gender: g as any })}
            style={{
              flex: 1, padding: 14, borderRadius: 12,
              background: data.gender === g ? 'var(--brand-primary)' : 'var(--bg-surface)',
              color: '#fff', border: data.gender === g ? 'none' : '1px solid rgba(255,255,255,0.1)',
              fontWeight: 600, fontSize: 15, cursor: 'pointer'
            }}
          >
            {g === 'male' ? 'Nam' : 'Nữ'}
          </button>
        ))}
      </div>
    </div>
  )
}

function Step2Job({ data, onChange }: { data: OnboardingData, onChange: (d: Partial<OnboardingData>) => void }) {
  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Khu vực & Nghề nghiệp</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 32 }}>Một vài thông tin để mọi người dễ làm quen hơn.</p>

      <label className="block text-sm text-gray-400 mb-2">Khu vực tại Đài Loan</label>
      <input 
        className="input" 
        value={data.district} 
        onChange={e => onChange({ district: e.target.value })} 
        placeholder="VD: Taipei, Zhongshan..." 
        style={{ marginBottom: 20 }}
      />

      <label className="block text-sm text-gray-400 mb-2">Công việc / Ngành học</label>
      <input 
        className="input" 
        value={data.occupation} 
        onChange={e => onChange({ occupation: e.target.value })} 
        placeholder="VD: Sinh viên, Chuyên viên IT..." 
      />
    </div>
  )
}

function Step3Tags({ data, onChange }: { data: OnboardingData, onChange: (d: Partial<OnboardingData>) => void }) {
  const toggle = (t: string) => {
    let next = [...data.tags]
    if (next.includes(t)) next = next.filter(x => x !== t)
    else if (next.length < 5) next.push(t)
    onChange({ tags: next })
  }

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Sở thích của bạn</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 32 }}>Chọn tối đa 5 chủ đề bạn hứng thú nhất.</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {ALL_TAGS.map(t => {
          const active = data.tags.includes(t)
          return (
            <button
              key={t}
              onClick={() => toggle(t)}
              style={{
                padding: '10px 16px', borderRadius: 24,
                background: active ? 'var(--brand-gradient)' : 'var(--bg-surface)',
                border: active ? 'none' : '1px solid rgba(255,255,255,0.1)',
                color: '#fff', fontSize: 14, cursor: 'pointer',
              }}
            >
              {t}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Step4Voice({ data, onChange, onSkip }: { data: OnboardingData, onChange: (d: Partial<OnboardingData>) => void, onSkip: () => void }) {
  const [view, setView] = useState<'intro' | 'recording' | 'preview'>('intro')
  const [timeLeft, setTimeLeft] = useState(15)
  const [micError, setMicError] = useState('')
  const [tempBlobUrl, setTempBlobUrl] = useState<string | null>(null)
  const [tempBlob, setTempBlob] = useState<Blob | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const timerRef = useRef<number | null>(null)

  const username = data.name || 'bạn'

  const scripts = [
    `Chào, mình là ${username}, mình thích những cuộc trò chuyện nhẹ nhàng. Nếu bạn cũng vậy thì tụi mình hợp đó.`,
    `Hi, mình là ${username}, mình không nói chuyện giỏi lắm nhưng chắc không làm bạn chán đâu.`,
    `Mình là ${username}, mình thích cafe, nghe nhạc và nói chuyện không vội.`,
    `Mình là ${username}, nếu bạn nghe giọng mình thấy ổn thì nói chuyện thử nha.`,
    `Mình là ${username}, mình thích những cuộc trò chuyện có ý nghĩa một chút.`
  ]

  const autoStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop())
    }
  }

  const startRecord = async () => {
    setMicError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      chunksRef.current = []
      
      recorder.ondataavailable = e => chunksRef.current.push(e.data)
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setTempBlob(blob)
        setTempBlobUrl(url)
        setView('preview')
      }

      recorder.start()
      mediaRecorderRef.current = recorder
      setView('recording')
      setTimeLeft(15)

      timerRef.current = window.setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            autoStopRecording()
            if (timerRef.current !== null) clearInterval(timerRef.current)
            return 0
          }
          return t - 1
        })
      }, 1000)

    } catch (e) {
      setMicError('Vui lòng cho phép truy cập micro để tiếp tục')
    }
  }

  const stopRecord = () => {
    autoStopRecording()
    if (timerRef.current !== null) clearInterval(timerRef.current)
  }

  const handleRetake = () => {
    setTempBlob(null)
    setTempBlobUrl(null)
    setView('intro')
  }

  const handleUseThis = () => {
    if (tempBlob && tempBlobUrl) {
      onChange({ audioBlob: tempBlob, audioUrl: tempBlobUrl })
    }
    onSkip() // Proceeds to next step
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      autoStopRecording()
      if (timerRef.current !== null) clearInterval(timerRef.current)
    }
  }, [])

  if (view === 'intro') {
    return (
      <div className="fade-in">
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Giới thiệu bằng giọng nói</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>Chỉ cần 10–15 giây, nói như đang trò chuyện thôi.</p>

        <div style={{ padding: 16, background: 'rgba(255,255,255,0.05)', borderRadius: 12, marginBottom: 24 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Bạn có thể nói:</p>
          <ul style={{ paddingLeft: 20, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <li>Bạn là ai</li>
            <li>Bạn thích gì</li>
            <li>Bạn đang tìm điều gì</li>
          </ul>
        </div>

        <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Gợi ý lời chào:</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
          {scripts.map((s, i) => (
            <div key={i} style={{ 
              padding: 12, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', 
              background: 'var(--bg-surface)', fontSize: 13, color: 'var(--text-secondary)' 
            }}>
              &quot;{s}&quot;
            </div>
          ))}
        </div>

        {micError && <p style={{ color: '#ff6b8a', fontSize: 13, marginBottom: 16, textAlign: 'center' }}>{micError}</p>}

        <button onClick={startRecord} className="btn btn-primary" style={{ width: '100%', height: 48, marginBottom: 12 }}>
          🎤 Thử ghi âm
        </button>
        <button onClick={onSkip} className="btn-ghost" style={{ width: '100%', height: 48, color: 'var(--text-muted)' }}>
          Để sau
        </button>
      </div>
    )
  }

  if (view === 'recording') {
    return (
      <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <p style={{ color: 'var(--pink)', fontSize: 16, fontWeight: 600, marginBottom: 8, animation: 'pulse 1.5s infinite' }}>
          Đang ghi âm...
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 40 }}>Nói tự nhiên thôi, không cần hoàn hảo</p>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,60,172,0.1)', border: '2px solid var(--pink)', marginBottom: 40 }}>
          <div style={{ fontSize: 40, fontWeight: 700, color: 'var(--pink)' }}>
            00:{timeLeft.toString().padStart(2, '0')}
          </div>
        </div>

        <button onClick={stopRecord} className="btn" style={{ width: '100%', background: 'transparent', border: '1px solid var(--pink)', color: 'var(--pink)' }}>
          ⏹ Dừng ghi âm
        </button>

        <style>{`@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }`}</style>
      </div>
    )
  }

  if (view === 'preview') {
    return (
      <div className="fade-in">
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, textAlign: 'center' }}>Nghe lại thử nhé</h1>
        
        <div style={{ margin: '40px 0' }}>
          <AudioPlayer src={tempBlobUrl!} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button onClick={handleUseThis} className="btn btn-primary" style={{ width: '100%', height: 48 }}>
            ✅ Dùng đoạn này
          </button>
          <button onClick={handleRetake} className="btn" style={{ width: '100%', height: 48, background: 'var(--bg-surface)' }}>
            Ghi lại
          </button>
        </div>
      </div>
    )
  }

  return null
}

function Step5Confirm({ data }: { data: OnboardingData }) {
  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Tuyệt vời! 🎉</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 32 }}>Hãy kiểm tra lại thông tin trước khi hoàn tất.</p>

      <div style={{ background: 'var(--bg-surface)', padding: 16, borderRadius: 16 }}>
        <p style={{ marginBottom: 8 }}><strong style={{color: 'var(--text-secondary)'}}>Tên:</strong> {data.name}</p>
        <p style={{ marginBottom: 8 }}><strong style={{color: 'var(--text-secondary)'}}>Tuổi:</strong> {data.age}</p>
        <p style={{ marginBottom: 8 }}><strong style={{color: 'var(--text-secondary)'}}>Khu vực:</strong> {data.district}</p>
        <p style={{ marginBottom: 8 }}><strong style={{color: 'var(--text-secondary)'}}>Nghề nghiệp:</strong> {data.occupation}</p>
        <p style={{ marginBottom: 8 }}><strong style={{color: 'var(--text-secondary)'}}>Giọng nói:</strong> {data.audioBlob || data.audioUrl ? 'Đã thu âm 🎤' : <span style={{color: '#ff6b8a'}}>Chưa có</span>}</p>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
          {data.tags.map(t => <span key={t} className="tag">{t}</span>)}
        </div>
      </div>
    </div>
  )
}
