export interface UserProfile {
  id: string
  name: string
  age: number
  district: string
  audioUrl: string
  avatarUrl: string
  tags: string[]
}

export interface Match {
  userId: string
  matchedAt: string // ISO string
}

export type MessageType = 'text' | 'voice'

export interface Message {
  id: string
  senderId: string // 'me' or userId of other person
  type: MessageType
  content: string // text or audioUrl
  timestamp: string
  duration?: number // seconds, only when type = 'voice'
}

// Messages keyed by userId
export const messagesByUserId: Record<string, Message[]> = {
  'user-002': [
    {
      id: 'msg-001',
      senderId: 'user-002',
      type: 'text',
      content: 'Chào bạn! Mình nghe giọng bạn dễ thương lắm 😊',
      timestamp: '2025-01-12T10:00:00Z',
    },
    {
      id: 'msg-002',
      senderId: 'me',
      type: 'text',
      content: 'Cảm ơn bạn! Bạn đang ở quận nào vậy?',
      timestamp: '2025-01-12T10:01:00Z',
    },
    {
      id: 'msg-003',
      senderId: 'user-002',
      type: 'voice',
      content: '/audio/voice-msg-01.mp3',
      timestamp: '2025-01-12T10:02:00Z',
      duration: 8,
    },
    {
      id: 'msg-004',
      senderId: 'me',
      type: 'text',
      content: 'Nghe hay ghê 😄 Bạn đã ở Đài Loan bao lâu rồi?',
      timestamp: '2025-01-12T10:05:00Z',
    },
    {
      id: 'msg-005',
      senderId: 'user-002',
      type: 'text',
      content: 'Gần 3 năm rồi, ban đầu sang học rồi ở lại làm việc luôn. Còn bạn?',
      timestamp: '2025-01-12T10:06:00Z',
    },
    {
      id: 'msg-006',
      senderId: 'me',
      type: 'text',
      content: 'Mình mới qua được 8 tháng thôi, vẫn đang tìm hiểu nhiều thứ 😅',
      timestamp: '2025-01-12T10:08:00Z',
    },
    {
      id: 'msg-007',
      senderId: 'user-002',
      type: 'text',
      content: 'Ủa vậy à! Cuối tuần này có rảnh không? Mình hay ra Zhonghe uống cà phê nếu bạn muốn gặp!',
      timestamp: '2025-01-12T10:10:00Z',
    },
  ],
  'user-004': [
    {
      id: 'msg-101',
      senderId: 'user-004',
      type: 'text',
      content: 'Hey bạn ơi, bạn đang làm gì đó?',
      timestamp: '2025-01-13T09:00:00Z',
    },
    {
      id: 'msg-102',
      senderId: 'me',
      type: 'text',
      content: 'Mình đang work from home, sáng nay trời đẹp quá 😊',
      timestamp: '2025-01-13T09:02:00Z',
    },
    {
      id: 'msg-103',
      senderId: 'user-004',
      type: 'voice',
      content: '/audio/voice-msg-02.mp3',
      timestamp: '2025-01-13T09:04:00Z',
      duration: 12,
    },
    {
      id: 'msg-104',
      senderId: 'me',
      type: 'text',
      content: 'Haha đúng rồi! Taipei thứ 7 này bạn có plan gì chưa?',
      timestamp: '2025-01-13T09:07:00Z',
    },
    {
      id: 'msg-105',
      senderId: 'user-004',
      type: 'text',
      content: 'Chưa có, định đi gym buổi sáng rồi chiều tự do. Sao vậy?',
      timestamp: '2025-01-13T09:09:00Z',
    },
    {
      id: 'msg-106',
      senderId: 'me',
      type: 'text',
      content: 'Mình đang tìm người đi Elephant Mountain chiều thứ 7, view từ trên đó đẹp lắm! 🏔️',
      timestamp: '2025-01-13T09:11:00Z',
    },
    {
      id: 'msg-107',
      senderId: 'user-004',
      type: 'voice',
      content: '/audio/voice-msg-03.mp3',
      timestamp: '2025-01-13T09:13:00Z',
      duration: 6,
    },
  ],
}

export const profiles: UserProfile[] = [
  // --- Original 8 ---
  {
    id: 'user-001',
    name: 'Linh',
    age: 26,
    district: 'Zhonghe, New Taipei',
    audioUrl: '/audio/intro-01.mp3',
    avatarUrl: '/images/avatar-01.jpg',
    tags: ['Cà phê', 'Du lịch', 'Phim'],
  },
  {
    id: 'user-002',
    name: 'Minh',
    age: 28,
    district: 'Banqiao, New Taipei',
    audioUrl: '/audio/intro-02.mp3',
    avatarUrl: '/images/avatar-02.jpg',
    tags: ['Chạy bộ', 'Nấu ăn'],
  },
  {
    id: 'user-003',
    name: 'Hà',
    age: 25,
    district: 'Xindian, New Taipei',
    audioUrl: '/audio/intro-03.mp3',
    avatarUrl: '/images/avatar-03.jpg',
    tags: ['Âm nhạc', 'Yoga'],
  },
  {
    id: 'user-004',
    name: 'Tuấn',
    age: 29,
    district: 'Taipei City',
    audioUrl: '/audio/intro-04.mp3',
    avatarUrl: '/images/avatar-04.jpg',
    tags: ['Gym', 'Phim', 'Sách'],
  },
  {
    id: 'user-005',
    name: 'Ngọc',
    age: 24,
    district: 'Tucheng, New Taipei',
    audioUrl: '/audio/intro-05.mp3',
    avatarUrl: '/images/avatar-05.jpg',
    tags: ['Trà sữa', 'K-drama'],
  },
  {
    id: 'user-006',
    name: 'Khoa',
    age: 27,
    district: 'Yonghe, New Taipei',
    audioUrl: '/audio/intro-06.mp3',
    avatarUrl: '/images/avatar-06.jpg',
    tags: ['Bóng đá', 'Game'],
  },
  {
    id: 'user-007',
    name: 'Thu',
    age: 26,
    district: 'Sanchong, New Taipei',
    audioUrl: '/audio/intro-07.mp3',
    avatarUrl: '/images/avatar-07.jpg',
    tags: ['Cà phê', 'Đọc sách'],
  },
  {
    id: 'user-008',
    name: 'Đức',
    age: 30,
    district: 'Taipei City',
    audioUrl: '/audio/intro-08.mp3',
    avatarUrl: '/images/avatar-08.jpg',
    tags: ['Bơi lội', 'Du lịch', 'Nhiếp ảnh'],
  },
  // --- Extended 12 ---
  {
    id: 'user-009',
    name: 'Phương',
    age: 23,
    district: 'Tamsui, New Taipei',
    audioUrl: '/audio/intro-09.mp3',
    avatarUrl: '/images/avatar-09.jpg',
    tags: ['Vẽ tranh', 'Cà phê', 'Thú cưng'],
  },
  {
    id: 'user-010',
    name: 'Hùng',
    age: 31,
    district: 'Zhongzheng, Taipei',
    audioUrl: '/audio/intro-10.mp3',
    avatarUrl: '/images/avatar-10.jpg',
    tags: ['Leo núi', 'Cắm trại', 'Đọc sách'],
  },
  {
    id: 'user-011',
    name: 'Trang',
    age: 27,
    district: 'Daan, Taipei',
    audioUrl: '/audio/intro-11.mp3',
    avatarUrl: '/images/avatar-11.jpg',
    tags: ['Yoga', 'Thiền định', 'Healthy food'],
  },
  {
    id: 'user-012',
    name: 'Bảo',
    age: 25,
    district: 'Shijr, New Taipei',
    audioUrl: '/audio/intro-12.mp3',
    avatarUrl: '/images/avatar-12.jpg',
    tags: ['Nhạc indie', 'Guitar', 'Cafe acoustic'],
  },
  {
    id: 'user-013',
    name: 'Mai',
    age: 28,
    district: 'Neihu, Taipei',
    audioUrl: '/audio/intro-13.mp3',
    avatarUrl: '/images/avatar-13.jpg',
    tags: ['Công nghệ', 'Startup', 'Podcast'],
  },
  {
    id: 'user-014',
    name: 'Việt',
    age: 26,
    district: 'Luzhou, New Taipei',
    audioUrl: '/audio/intro-14.mp3',
    avatarUrl: '/images/avatar-14.jpg',
    tags: ['Nấu ăn', 'Ẩm thực', 'Đi chợ'],
  },
  {
    id: 'user-015',
    name: 'Hương',
    age: 24,
    district: 'Wanhua, Taipei',
    audioUrl: '/audio/intro-15.mp3',
    avatarUrl: '/images/avatar-15.jpg',
    tags: ['Múa', 'Thời trang', 'Makeup'],
  },
  {
    id: 'user-016',
    name: 'Quân',
    age: 32,
    district: 'Taoyuan City',
    audioUrl: '/audio/intro-16.mp3',
    avatarUrl: '/images/avatar-16.jpg',
    tags: ['Mô tô', 'Phượt', 'Kỹ thuật'],
  },
  {
    id: 'user-017',
    name: 'Thảo',
    age: 23,
    district: 'Songshan, Taipei',
    audioUrl: '/audio/intro-17.mp3',
    avatarUrl: '/images/avatar-17.jpg',
    tags: ['Chụp ảnh', 'Cafe phim', 'Anime'],
  },
  {
    id: 'user-018',
    name: 'Long',
    age: 29,
    district: 'Xizhi, New Taipei',
    audioUrl: '/audio/intro-18.mp3',
    avatarUrl: '/images/avatar-18.jpg',
    tags: ['Bóng rổ', 'Netflix', 'Bia hơi'],
  },
  {
    id: 'user-019',
    name: 'Châu',
    age: 26,
    district: 'Zhongshan, Taipei',
    audioUrl: '/audio/intro-19.mp3',
    avatarUrl: '/images/avatar-19.jpg',
    tags: ['Piano', 'Classical music', 'Sách văn học'],
  },
  {
    id: 'user-020',
    name: 'Dũng',
    age: 28,
    district: 'Xinyi, Taipei',
    audioUrl: '/audio/intro-20.mp3',
    avatarUrl: '/images/avatar-20.jpg',
    tags: ['Trading', 'Crypto', 'Tennis'],
  },
]

// Seed matches — user-002 and user-004 already matched
export const seedMatches: Match[] = [
  { userId: 'user-002', matchedAt: '2025-01-10T08:00:00Z' },
  { userId: 'user-004', matchedAt: '2025-01-11T14:30:00Z' },
]
