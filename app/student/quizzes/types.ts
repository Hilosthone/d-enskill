// // ==========================================
// // QUIZ & QUESTION BANK TYPES
// // ==========================================

// export interface CodeOption {
//   id: number | string
//   option_text: string
//   is_correct?: boolean // Hidden or returned depending on backend role, handled gracefully
// }

// export interface Question {
//   id: number | string
//   question_text: string
//   code_snippet?: string
//   explanation?: string
//   subject_id?: string
//   course_id?: string
//   options: CodeOption[]
// }

// export interface QuestionBank {
//   id: number | string
//   title: string
//   description?: string
//   courseId: string
//   status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED'
//   createdAt?: string
//   updatedAt?: string
//   questions?: Question[]
//   questionCount?: number
// }

// export interface QuizAttemptResult {
//   questionBankId: number | string
//   title: string
//   totalQuestions: number
//   score: number
//   percentage: number
//   correctCount: number
//   incorrectCount: number
//   timeSpentSeconds: number
//   completedAt: string
//   answers: Record<number | string, number | string> // questionId -> selectedOptionId
// }


// ==========================================
// QUIZ & QUESTION BANK TYPES
// ==========================================

export interface CodeOption {
  id: number | string
  _id?: number | string
  option_text?: string
  optionText?: string
  text?: string
  is_correct?: boolean
  isCorrect?: boolean
}

export interface Question {
  id: number | string
  _id?: number | string
  question_text?: string
  questionText?: string
  code_snippet?: string
  codeSnippet?: string
  explanation?: string
  subject_id?: string
  course_id?: string
  options: CodeOption[]
}

export interface QuestionBank {
  id: number | string
  _id?: number | string
  title: string
  description?: string
  courseId?: string
  status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED'
  createdAt?: string
  updatedAt?: string
  questions?: Question[]
  questionCount?: number
  expires_at?: string
  dueDate?: string
  closeDate?: string
  max_attempts?: number
  allowedAttempts?: number
}

export interface QuizAttemptResult {
  questionBankId: number | string
  title: string
  totalQuestions: number
  score: number
  percentage: number
  correctCount: number
  incorrectCount: number
  timeSpentSeconds: number
  completedAt: string
  answers: Record<number | string, number | string>
}