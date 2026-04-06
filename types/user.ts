export interface UserProfile {
  id: string
  name: string
  gender: 'male' | 'female' | 'other'
  age: number
  district: string
  
  // New basic fields
  height?: number      // e.g. 170
  weight?: number      // e.g. 65
  occupation?: string  // e.g. Sinh viên, Nhân viên văn phòng
  school?: string      // e.g. Đại học Quốc gia Đài Bắc

  // Intro
  bio?: string
  audioUrl?: string
  avatarUrl?: string
  status?: string      // e.g. "Đang tìm kiếm một góc nhỏ bình yên"

  // Dating goals
  relationshipStatus?: 'single' | 'complicated'
  datingGoal?: 'friends' | 'dating' | 'serious' // Tìm bạn, Hẹn hò, Nghiêm túc
  meetOutside?: boolean
  wantKids?: boolean

  // Tags & Preferences
  personality?: string[]
  tags?: string[] // Hobbies/Interests

  // Metadata
  profileCompleted?: boolean
  createdAt?: string // ISO string or timestamp
  lastActive?: string
}
