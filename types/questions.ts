export interface QuestionOption {
  text: string
  isCorrect: boolean
  explanation?: string
}

export interface Question {
  id: number | string
  questionBankId: number | string
  subjectId?: string
  courseId?: string
  questionText: string
  questionType?: 'MCQ' | 'TRUE_FALSE' | 'CODING' | string
  imageUrl?: string
  marks?: number
  status?: 'ACTIVE' | 'ARCHIVED' | string
  options: QuestionOption[]
  createdAt?: string
  updatedAt?: string
}

export interface QuestionBank {
  id: number | string
  title: string
  description?: string
  courseId?: string
  subjects?: string[]
  durationMinutes?: number
  expiresAt?: string
  startTime?: string
  maxAttempts?: number
  status?: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | string
  reviewComment?: string
  questions?: Question[]
  createdAt?: string
  updatedAt?: string
}