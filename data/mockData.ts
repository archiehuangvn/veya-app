import type { UserProfile } from '@/types/user'

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

// ------------------------------------------------------------------
// MOCK MESSAGES
// ------------------------------------------------------------------
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
  ]
}

// ------------------------------------------------------------------
// 20 MOCK PROFILES (10 Nữ - 10 Nam)
// ------------------------------------------------------------------
export const profiles: UserProfile[] = [
  // --- 10 NỮ ---
  {
    id: 'user-001',
    name: 'Mai',
    gender: 'female',
    age: 24,
    district: 'Zhongshan, Taipei',
    height: 162, weight: 48,
    occupation: 'Nhân viên thiết kế', school: 'Đại học Sư phạm Quốc gia Đài Loan',
    bio: 'Thích vẽ vời vào cuối tuần và hay lượn lờ các quán cafe ở Trung Sơn. Giọng mình hơi trầm nhưng hay cười hihi.',
    status: 'Đang tìm cảm hứng mới',
    datingGoal: 'dating', relationshipStatus: 'single', meetOutside: true, wantKids: false,
    personality: ['Nhẹ nhàng', 'Sáng tạo', 'Hay cười'],
    tags: ['Nghệ thuật & sáng tạo', 'Cà phê', 'Du lịch'],
    audioUrl: '/audio/intro-1.mp3', avatarUrl: '/images/avatar-1.jpg',
    profileCompleted: true
  },
  {
    id: 'user-002',
    name: 'Linh',
    gender: 'female',
    age: 26,
    district: 'Xinyi, Taipei',
    height: 158, weight: 46,
    occupation: 'Kiểm toán viên',
    bio: 'Công việc bận rộn nhưng mình luôn dành thời gian cho bản thân. Thích chạy bộ công viên Da\'an mỗi tối.',
    datingGoal: 'serious', relationshipStatus: 'single', meetOutside: true, wantKids: true,
    personality: ['Độc lập', 'Trách nhiệm', 'Tinh tế'],
    tags: ['Thể thao', 'Đọc sách', 'Âm nhạc'],
    audioUrl: '/audio/intro-2.mp3', avatarUrl: '/images/avatar-2.jpg',
    profileCompleted: true
  },
  {
    id: 'user-003',
    name: 'Thảo',
    gender: 'female',
    age: 22,
    district: 'Banqiao, New Taipei',
    height: 165, weight: 52,
    occupation: 'Sinh viên', school: 'Đại học Quốc gia Đài Loan',
    bio: 'Mình vừa sang Đài Loan được 1 năm. Tiếng Trung còn bập bẹ nên muốn tìm bạn người Việt để đi chơi cho đỡ bùn.',
    datingGoal: 'friends', relationshipStatus: 'single', meetOutside: true, wantKids: false,
    personality: ['Nhiệt tình', 'Hài hước', 'Nói nhiều'],
    tags: ['Ẩm thực', 'Chụp ảnh', 'Giao lưu văn hóa'],
    audioUrl: '/audio/intro-3.mp3', avatarUrl: '/images/avatar-3.jpg',
    profileCompleted: true
  },
  {
    id: 'user-004',
    name: 'Ngọc',
    gender: 'female',
    age: 28,
    district: 'Zhongzheng, Taipei',
    height: 160, weight: 50,
    occupation: 'Quản lý dự án',
    bio: 'Một người hướng nội, thích nghe podcast và trồng cây. Nếu chúng ta tâm sự hợp, biết đâu sẽ có tiến triển?',
    status: 'Sống chậm',
    datingGoal: 'serious', relationshipStatus: 'single', meetOutside: true, wantKids: true,
    personality: ['Tĩnh lặng', 'Sâu sắc', 'Biết lắng nghe'],
    tags: ['Lối sống', 'Thiền', 'Thiên nhiên'],
    audioUrl: '/audio/intro-4.mp3', avatarUrl: '/images/avatar-4.jpg',
    profileCompleted: true
  },
  {
    id: 'user-005',
    name: 'Phương',
    gender: 'female',
    age: 25,
    district: 'Taoyuan',
    height: 168, weight: 55,
    occupation: 'Chuyên viên Marketing',
    bio: 'Thường dạo chơi quanh Đào Viên bằng xe máy điện. Rất mê ăn vặt đêm ở chợ đêm Trung Lịch.',
    datingGoal: 'dating', relationshipStatus: 'single', meetOutside: true, wantKids: true,
    personality: ['Năng động', 'Phá cách', 'Trực tính'],
    tags: ['Ăn đêm', 'Du lịch bụi', 'Xem phim'],
    audioUrl: '/audio/intro-5.mp3', avatarUrl: '/images/avatar-5.jpg',
    profileCompleted: true
  },
  {
    id: 'user-006',
    name: 'Bích',
    gender: 'female',
    age: 27,
    district: 'Neihu, Taipei',
    height: 155, weight: 45,
    occupation: 'Nhân viên hành chính',
    bio: 'Nấu ăn ngon, chăm chỉ dọn nhà nhưng vẫn lười chải tóc vào cuối tuần haha.',
    datingGoal: 'serious', relationshipStatus: 'single', meetOutside: true, wantKids: true,
    personality: ['Đảm đang', 'Ngọt ngào', 'Hơi hậu đậu'],
    tags: ['Nấu ăn', 'Meo meo', 'Dọn dẹp'],
    audioUrl: '/audio/intro-6.mp3', avatarUrl: '/images/avatar-6.jpg',
    profileCompleted: true
  },
  {
    id: 'user-007',
    name: 'Thu',
    gender: 'female',
    age: 23,
    district: 'Hsinchu',
    height: 164, weight: 51,
    occupation: 'Kỹ sư phần mềm',
    bio: 'Ngày gõ code, đêm nghe nhạc lofi. Tìm bạn nam chịu khó lắng nghe một cô gái đôi khi suy nghĩ hơi nhiều.',
    status: 'Deadline dập tơi bời',
    datingGoal: 'dating', relationshipStatus: 'single', meetOutside: true, wantKids: false,
    personality: ['Logic', 'Lãng mạn ngầm', 'Kiên nhẫn'],
    tags: ['Công nghệ', 'Game', 'Âm nhạc'],
    audioUrl: '/audio/intro-7.mp3', avatarUrl: '/images/avatar-7.jpg',
    profileCompleted: true
  },
  {
    id: 'user-008',
    name: 'Trang',
    gender: 'female',
    age: 29,
    district: 'Taichung',
    height: 161, weight: 49,
    occupation: 'Giáo viên tiếng Việt',
    bio: 'Tính cách nhẹ nhàng, điềm đạm. Rất vui nếu có thể tâm sự những câu chuyện đời thường giản dị.',
    datingGoal: 'serious', relationshipStatus: 'single', meetOutside: true, wantKids: true,
    personality: ['Chín chắn', 'Bao dung', 'Truyền thống'],
    tags: ['Giáo dục', 'Sách văn học', 'Du lịch'],
    audioUrl: '/audio/intro-8.mp3', avatarUrl: '/images/avatar-8.jpg',
    profileCompleted: true
  },
  {
    id: 'user-009',
    name: 'Hân',
    gender: 'female',
    age: 21,
    district: 'Tamsui, New Taipei',
    height: 159, weight: 47,
    occupation: 'Sinh viên năm cuối',
    bio: 'Đam mê chụp ảnh máy film quanh Danshui. Có ai hứng thú làm mẫu cho mình không?',
    datingGoal: 'friends', relationshipStatus: 'single', meetOutside: true, wantKids: false,
    personality: ['Mơ mộng', 'Nhiệt huyết', 'Yêu nghệ thuật'],
    tags: ['Chụp ảnh', 'Thưởng trà', 'Hoàng hôn'],
    audioUrl: '/audio/intro-9.mp3', avatarUrl: '/images/avatar-9.jpg',
    profileCompleted: true
  },
  {
    id: 'user-010',
    name: 'Trâm',
    gender: 'female',
    age: 26,
    district: 'Shilin, Taipei',
    height: 166, weight: 54,
    occupation: 'Stylist tự do',
    bio: 'Thích thời trang, thích mix đồ và đi dạo chợ đêm Sĩ Lâm. Mong tìm được ai đó để cùng share đồ ăn.',
    datingGoal: 'dating', relationshipStatus: 'single', meetOutside: true, wantKids: true,
    personality: ['Cá tính', 'Hòa đồng', 'Trendy'],
    tags: ['Thời trang', 'Mua sắm', 'Ăn uống'],
    audioUrl: '/audio/intro-10.mp3', avatarUrl: '/images/avatar-10.jpg',
    profileCompleted: true
  },

  // --- 10 NAM ---
  {
    id: 'user-011',
    name: 'Hoàng',
    gender: 'male',
    age: 27,
    district: 'Da\'an, Taipei',
    height: 178, weight: 70,
    occupation: 'Chuyên viên dữ liệu',
    bio: 'Công việc tiếp xúc với quá nhiều con số, giờ mình chỉ muốn lắng nghe giọng nói êm đềm của một người thật.',
    datingGoal: 'serious', relationshipStatus: 'single', meetOutside: true, wantKids: true,
    personality: ['Trưởng thành', 'Điềm tĩnh', 'Bao dung'],
    tags: ['Công nghệ', 'Bơi lội', 'Cafe'],
    audioUrl: '/audio/intro-11.mp3', avatarUrl: '/images/avatar-11.jpg',
    profileCompleted: true
  },
  {
    id: 'user-012',
    name: 'Hải',
    gender: 'male',
    age: 25,
    district: 'Xinzhuang, New Taipei',
    height: 172, weight: 65,
    occupation: 'Kỹ thuật viên',
    bio: 'Thích xe mô tô và đi phượt. Cuối tuần thường hay chạy lên núi Yangmingshan.',
    status: 'Vòng quanh hòn đảo',
    datingGoal: 'dating', relationshipStatus: 'single', meetOutside: true, wantKids: true,
    personality: ['Thích tự do', 'Vui vẻ', 'Che chở'],
    tags: ['Phượt', 'Xe cộ', 'Cắm trại'],
    audioUrl: '/audio/intro-12.mp3', avatarUrl: '/images/avatar-12.jpg',
    profileCompleted: true
  },
  {
    id: 'user-013',
    name: 'Nam',
    gender: 'male',
    age: 22,
    district: 'Nangang, Taipei',
    height: 180, weight: 75,
    occupation: 'Sinh viên Kiến trúc',
    bio: 'Vẽ lách, cà phê, và ngắm kiến trúc. Tìm một bạn nữ để cùng làm bài thuyết trình chung đường đời nha.',
    datingGoal: 'friends', relationshipStatus: 'single', meetOutside: true, wantKids: false,
    personality: ['Hài hước', 'Lãng mạn', 'Say mê'],
    tags: ['Nghệ thuật & sáng tạo', 'Triển lãm', 'Chụp ảnh'],
    audioUrl: '/audio/intro-13.mp3', avatarUrl: '/images/avatar-13.jpg',
    profileCompleted: true
  },
  {
    id: 'user-014',
    name: 'Tùng',
    gender: 'male',
    age: 29,
    district: 'Zhongshan, Taipei',
    height: 175, weight: 72,
    occupation: 'Chủ cửa hàng ăn',
    bio: 'Nấu ăn là đam mê. Mình có thể bao bạn ăn no mỗi ngày nếu chúng ta hợp nhau.',
    status: 'Hôm nay ăn gì?',
    datingGoal: 'serious', relationshipStatus: 'single', meetOutside: true, wantKids: true,
    personality: ['Chu đáo', 'Ấm áp', 'Chung thủy'],
    tags: ['Nấu ăn', 'Kinh doanh', 'Gia đình'],
    audioUrl: '/audio/intro-14.mp3', avatarUrl: '/images/avatar-14.jpg',
    profileCompleted: true
  },
  {
    id: 'user-015',
    name: 'Cường',
    gender: 'male',
    age: 24,
    district: 'Songshan, Taipei',
    height: 168, weight: 62,
    occupation: 'Designer',
    bio: 'Nếu bạn có chuyện buồn, hãy tâm sự, mình là một người lắng nghe tuyệt vời đấy.',
    datingGoal: 'dating', relationshipStatus: 'single', meetOutside: true, wantKids: false,
    personality: ['Biết lắng nghe', 'Tâm lý', 'Rụt rè'],
    tags: ['Vẽ', 'Phim Âu Mỹ', 'Sách'],
    audioUrl: '/audio/intro-15.mp3', avatarUrl: '/images/avatar-15.jpg',
    profileCompleted: true
  },
  {
    id: 'user-016',
    name: 'Khoa',
    gender: 'male',
    age: 26,
    district: 'Taoyuan',
    height: 176, weight: 68,
    occupation: 'Nhân viên kinh doanh',
    bio: 'Nói nhiều, nhây và thích đùa. Mong tìm người chịu được cái sự nhây này của mình.',
    datingGoal: 'dating', relationshipStatus: 'single', meetOutside: true, wantKids: true,
    personality: ['Hoạt ngôn', 'Vui nhộn', 'Thích giao tiếp'],
    tags: ['Tụ tập', 'Boardgame', 'Thể thao'],
    audioUrl: '/audio/intro-16.mp3', avatarUrl: '/images/avatar-16.jpg',
    profileCompleted: true
  },
  {
    id: 'user-017',
    name: 'Hiếu',
    gender: 'male',
    age: 28,
    district: 'Keelung',
    height: 174, weight: 70,
    occupation: 'Kỹ sư cơ khí',
    bio: 'Ở gần biển nên thích ngắm biển đêm. Tính người hơi thẳng nhưng rất chân thành.',
    status: 'Trời sinh một cặp',
    datingGoal: 'serious', relationshipStatus: 'single', meetOutside: true, wantKids: true,
    personality: ['Thẳng thắn', 'Chân thành', 'Bảo vệ'],
    tags: ['Cầu lông', 'Nhậu nhẹt', 'Biển'],
    audioUrl: '/audio/intro-17.mp3', avatarUrl: '/images/avatar-17.jpg',
    profileCompleted: true
  },
  {
    id: 'user-018',
    name: 'Vũ',
    gender: 'male',
    age: 23,
    district: 'Wenshan, Taipei',
    height: 170, weight: 64,
    occupation: 'Freelancer',
    bio: 'Sống về đêm, thường hay làm việc lúc 2h sáng. Rất vui nếu có một giọng nói bầu bạn vào giờ đó.',
    datingGoal: 'friends', relationshipStatus: 'single', meetOutside: false, wantKids: false,
    personality: ['Night owl', 'Khó đoán', 'Có gu'],
    tags: ['Âm nhạc indie', 'Coding', 'Games'],
    audioUrl: '/audio/intro-18.mp3', avatarUrl: '/images/avatar-18.jpg',
    profileCompleted: true
  },
  {
    id: 'user-019',
    name: 'Thịnh',
    gender: 'male',
    age: 30,
    district: 'Hsinchu',
    height: 182, weight: 78,
    occupation: 'Giám đốc phòng ban',
    bio: 'Ổn định công việc, giờ mình muốn ổn định gia đình. Tìm kiếm một người hiểu chuyện và tinh tế.',
    datingGoal: 'serious', relationshipStatus: 'single', meetOutside: true, wantKids: true,
    personality: ['Quyết đoán', 'Trách nhiệm cao', 'Trưởng thành'],
    tags: ['Đầu tư', 'Golf', 'Rượu vang'],
    audioUrl: '/audio/intro-19.mp3', avatarUrl: '/images/avatar-19.jpg',
    profileCompleted: true
  },
  {
    id: 'user-020',
    name: 'Duy',
    gender: 'male',
    age: 25,
    district: 'Banqiao, New Taipei',
    height: 177, weight: 69,
    occupation: 'Bartender',
    bio: 'Pha chế Cocktail là niềm vui. Bạn có muốn thử ly nước do chính tay mình pha không?',
    status: 'Cheers!',
    datingGoal: 'dating', relationshipStatus: 'single', meetOutside: true, wantKids: false,
    personality: ['Cool ngầu', 'Hay lắng nghe', 'Ga lăng'],
    tags: ['Pha chế', 'Cuộc sống về đêm', 'Gym'],
    audioUrl: '/audio/intro-20.mp3', avatarUrl: '/images/avatar-20.jpg',
    profileCompleted: true
  }
]

export const seedMatches: Match[] = [
  { userId: 'user-002', matchedAt: '2025-01-10T08:00:00Z' },
  { userId: 'user-004', matchedAt: '2025-01-11T14:30:00Z' },
]
