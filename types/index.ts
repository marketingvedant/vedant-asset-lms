export interface Profile {
  id: string
  email: string
  role: 'admin' | 'student'
  created_at: string
}

export interface Course {
  id: string
  title: string
  slug: string
  description: string
  thumbnail?: string
  price: number
  published: boolean
  created_at: string
}

export interface Lesson {
  id: string
  course_id: string
  title: string
  video_url: string
  content?: string
  position: number
}

export interface Quiz {
  id: string
  course_id: string
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: 'A' | 'B' | 'C' | 'D'
}

export interface Enrollment {
  id: string
  user_id: string
  course_id: string
  created_at: string
}

export interface Payment {
  id: string
  user_id: string
  course_id: string
  amount: number
  status: 'pending' | 'completed' | 'failed'
  provider: string
  created_at: string
}