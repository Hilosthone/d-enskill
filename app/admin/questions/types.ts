// // app/admin/questions/types.ts

// export type QuestionType = 'MCQ' | 'TRUE_FALSE' | 'TEXT'
// export type BankStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED'

// export interface QuestionOption {
//   id?: string | number
//   text: string
//   isCorrect: boolean
//   explanation?: string
// }

// export interface QuestionItem {
//   id?: string | number
//   questionText: string
//   questionType: QuestionType
//   imageUrl?: string
//   marks: number
//   options: QuestionOption[]
// }

// export interface QuestionBank {
//   id: string | number
//   title: string
//   description?: string
//   courseId?: string
//   course_id?: string
//   subjects?: string[]
//   durationMinutes?: number
//   duration_minutes?: number
//   maxAttempts?: number
//   max_attempts?: number
//   startTime?: string
//   start_time?: string
//   expiresAt?: string
//   expires_at?: string
//   status?: BankStatus
//   reviewComment?: string
//   review_comment?: string
//   questionsCount?: number
//   questions_count?: number
//   questions?: QuestionItem[]
//   questionList?: QuestionItem[]
//   createdAt?: string
//   updatedAt?: string
// }

// export interface AlertMessage {
//   type: 'success' | 'error' | 'info'
//   message: string
// }



// app/admin/questions/types.ts

export type QuestionType = 'MCQ' | 'TRUE_FALSE' | 'TEXT'
export type BankStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED'

export interface QuestionOption {
  id?: string | number
  text: string
  isCorrect: boolean
  explanation?: string
}

export interface QuestionItem {
  id?: string | number
  questionText: string
  questionType: QuestionType
  imageUrl?: string
  marks: number
  options: QuestionOption[]
}

export interface QuestionBank {
  id: string | number
  title: string
  description?: string
  courseId?: string
  course_id?: string
  subjects?: string[]
  durationMinutes?: number
  duration_minutes?: number
  maxAttempts?: number
  max_attempts?: number
  attempts?: number
  allowedAttempts?: number
  allowed_attempts?: number
  startTime?: string
  start_time?: string
  expiresAt?: string
  expires_at?: string
  status?: BankStatus
  reviewComment?: string
  review_comment?: string
  questionsCount?: number
  questions_count?: number
  questions?: QuestionItem[]
  questionList?: QuestionItem[]
  createdAt?: string
  updatedAt?: string
}

export interface AlertMessage {
  type: 'success' | 'error' | 'info'
  message: string
}