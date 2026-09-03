// ==========================================
// CONFIGURATION & ENVIRONMENT SETUP
// ==========================================
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://denskill-backend.onrender.com'

/**
 * Admin-specific authentication headers.
 * Uses 'denskill_admin_token' to isolate administrative sessions 
 * from regular student sessions.
 */
const getAdminAuthHeaders = () => {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('denskill_admin_token')
      : null
  return {
    'Content-Type': 'application/json',
    accept: '*/*',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

/**
 * Centralized response handler for admin requests.
 * Automatically catches 401 Unauthorized errors, clears the admin token,
 * and redirects back to the admin login portal.
 */
const handleAdminApiResponse = async (res: Response) => {
  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('denskill_admin_token')
      window.location.href = '/auth/login' 
    }
    throw new Error('Admin session expired. Please log in again.')
  }
  
  const data = await res.json()
  
  if (!res.ok) {
    throw new Error(data.message || 'An administrative request failed.')
  }
  
  return data
}

// ==========================================
// ADMIN API SERVICE CLIENT
// ==========================================
export const adminApiClient = {
  // ==========================================
  // 4. ADMIN AUTHENTICATION FLOW
  // Specialized administrative login portal
  // ==========================================
  adminLogin: async (payload: { email: string; password: string }) => {
    const res = await fetch(`${API_BASE_URL}/api/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', accept: '*/*' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()

    // Safely check and store the token under the dedicated admin storage key
    if (res.ok) {
      const tokenToStore = 
        data.token || 
        data.accessToken || 
        data.data?.token || 
        data.data?.accessToken

      if (tokenToStore) {
        localStorage.setItem('denskill_admin_token', tokenToStore)
      }
    }

    return data
  },

  // ==========================================
  // 5. ADMIN MANAGEMENT
  // Platform-wide management for students, courses, instructors, and reports
  // ==========================================
  getAdminDashboard: async () => {
    const res = await fetch(`${API_BASE_URL}/api/admin/dashboard`, {
      method: 'GET',
      headers: getAdminAuthHeaders(),
    })
    return handleAdminApiResponse(res)
  },

  // Get all registered students with optional filters
  getAdminStudents: async (params?: {
    studentType?: 'REGULAR' | 'SCHOLARSHIP'
    cohortId?: number
  }) => {
    const query = new URLSearchParams()
    if (params?.studentType) query.append('studentType', params.studentType)
    if (params?.cohortId) query.append('cohortId', String(params.cohortId))

    const url = `${API_BASE_URL}/api/admin/students${
      query.toString() ? `?${query.toString()}` : ''
    }`

    const res = await fetch(url, {
      method: 'GET',
      headers: getAdminAuthHeaders(),
    })
    return handleAdminApiResponse(res)
  },

  // Freeze or unfreeze a student account (ID is integer)
  updateStudentStatus: async (userId: number, status: 'frozen' | 'active') => {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/students/${userId}/status`,
      {
        method: 'PUT',
        headers: getAdminAuthHeaders(),
        body: JSON.stringify({ status }),
      },
    )
    return handleAdminApiResponse(res)
  },

  // Delete a student account (ID is integer)
  deleteStudent: async (userId: number) => {
    const res = await fetch(`${API_BASE_URL}/api/admin/students/${userId}`, {
      method: 'DELETE',
      headers: getAdminAuthHeaders(),
    })
    return handleAdminApiResponse(res)
  },

  // Get all system payment logs for admin overview
  getAdminPayments: async () => {
    const res = await fetch(`${API_BASE_URL}/api/admin/payments`, {
      method: 'GET',
      headers: getAdminAuthHeaders(),
    })
    return handleAdminApiResponse(res)
  },

  // Get all courses with enrollment counts for admin overview
  getAdminCourses: async () => {
    const res = await fetch(`${API_BASE_URL}/api/admin/courses`, {
      method: 'GET',
      headers: getAdminAuthHeaders(),
    })
    return handleAdminApiResponse(res)
  },

  getAdminAnnouncements: async () => {
    const res = await fetch(`${API_BASE_URL}/api/admin/announcements`, {
      method: 'GET',
      headers: getAdminAuthHeaders(),
    })
    return handleAdminApiResponse(res)
  },

  createAnnouncement: async (payload: {
    title: string
    content?: string
    message?: string
    target?: string
    priority?: string
  }) => {
    const res = await fetch(`${API_BASE_URL}/api/admin/announcements`, {
      method: 'POST',
      headers: getAdminAuthHeaders(),
      body: JSON.stringify(payload),
    })
    return handleAdminApiResponse(res)
  },

  updateAnnouncement: async (
    id: number | string,
    payload: {
      title?: string
      content?: string
      message?: string
      target?: string
      priority?: string
    },
  ) => {
    const res = await fetch(`${API_BASE_URL}/api/admin/announcements/${id}`, {
      method: 'PUT',
      headers: getAdminAuthHeaders(),
      body: JSON.stringify(payload),
    })
    return handleAdminApiResponse(res)
  },

  deleteAnnouncement: async (id: number | string) => {
    const res = await fetch(`${API_BASE_URL}/api/admin/announcements/${id}`, {
      method: 'DELETE',
      headers: getAdminAuthHeaders(),
    })
    return handleAdminApiResponse(res)
  },

  // Instructors API Client Methods
  getAdminInstructors: async () => {
    const res = await fetch(`${API_BASE_URL}/api/admin/instructors`, {
      method: 'GET',
      headers: getAdminAuthHeaders(),
    })
    return handleAdminApiResponse(res)
  },

  createInstructor: async (payload: {
    name: string
    email: string
    specialty: string
    role?: string
    password: string
  }) => {
    const res = await fetch(`${API_BASE_URL}/api/admin/instructors`, {
      method: 'POST',
      headers: getAdminAuthHeaders(),
      body: JSON.stringify(payload),
    })
    return handleAdminApiResponse(res)
  },

  updateInstructor: async (
    id: string | number,
    payload: {
      name?: string
      email?: string
      specialty?: string
      role?: string
      password?: string
    },
  ) => {
    const res = await fetch(`${API_BASE_URL}/api/admin/instructors/${id}`, {
      method: 'PUT',
      headers: getAdminAuthHeaders(),
      body: JSON.stringify(payload),
    })
    return handleAdminApiResponse(res)
  },

  deleteInstructor: async (id: string | number) => {
    const res = await fetch(`${API_BASE_URL}/api/admin/instructors/${id}`, {
      method: 'DELETE',
      headers: getAdminAuthHeaders(),
    })
    return handleAdminApiResponse(res)
  },

  getAdminReports: async () => {
    const res = await fetch(`${API_BASE_URL}/api/admin/reports`, {
      method: 'GET',
      headers: getAdminAuthHeaders(),
    })
    return handleAdminApiResponse(res)
  },

  getAdminSettings: async () => {
    const res = await fetch(`${API_BASE_URL}/api/admin/settings`, {
      method: 'GET',
      headers: getAdminAuthHeaders(),
    })
    return handleAdminApiResponse(res)
  },

  manualOnboardStudent: async (payload: {
    firstName: string
    middleName?: string
    lastName: string
    country?: string
    phone?: string
    email: string
    course: string
    amountPaid: number
    password?: string
    referredBy?: string
    reason?: string
  }) => {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/enrollments/manual-onboard`,
      {
        method: 'POST',
        headers: getAdminAuthHeaders(),
        body: JSON.stringify(payload),
      },
    )
    return handleAdminApiResponse(res)
  },

  executeGradeOverride: async (gradeId: string | number) => {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/grading/override/${gradeId}`,
      {
        method: 'PUT',
        headers: getAdminAuthHeaders(),
      },
    )
    return handleAdminApiResponse(res)
  },

  getAdminAttendanceOverview: async (courseId: string | number) => {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/attendance/overview/${courseId}`,
      {
        method: 'GET',
        headers: getAdminAuthHeaders(),
      },
    )
    return handleAdminApiResponse(res)
  },

  sendCustomEmail: async (data: {
    emails: string
    subject: string
    message: string
    html?: string
    cc?: string
    bcc?: string
    attachments?: Array<{ filename: string; content: string }>
  }) => {
    const res = await fetch(`${API_BASE_URL}/api/admin/emails/send`, {
      method: 'POST',
      headers: {
        ...getAdminAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return handleAdminApiResponse(res)
  },

  // ==========================================
  // 7. SCHOLARSHIP ADMIN MANAGEMENT
  // ==========================================

  getScholarshipMetrics: async (cohortId?: string) => {
    const query = cohortId ? `?cohortId=${encodeURIComponent(cohortId)}` : ''
    const res = await fetch(
      `${API_BASE_URL}/api/admin/scholarships/metrics${query}`,
      {
        method: 'GET',
        headers: getAdminAuthHeaders(),
      },
    )
    return handleAdminApiResponse(res)
  },

  getScholarshipApplications: async (filters?: {
    cohortId?: string
    status?: string
  }) => {
    const params = new URLSearchParams()
    if (filters?.cohortId) params.append('cohortId', filters.cohortId)
    if (filters?.status) params.append('status', filters.status)
    const queryString = params.toString() ? `?${params.toString()}` : ''

    const res = await fetch(
      `${API_BASE_URL}/api/admin/scholarships/applications${queryString}`,
      {
        method: 'GET',
        headers: getAdminAuthHeaders(),
      },
    )
    return handleAdminApiResponse(res)
  },

  approveScholarshipApplication: async (
    id: string,
    payload?: { adminNotes?: string },
  ) => {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/scholarships/applications/${id}/approve`,
      {
        method: 'PUT',
        headers: getAdminAuthHeaders(),
        body: JSON.stringify(payload || {}),
      },
    )
    return handleAdminApiResponse(res)
  },

  rejectScholarshipApplication: async (
    id: string,
    payload?: { adminNotes?: string },
  ) => {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/scholarships/applications/${id}/reject`,
      {
        method: 'PUT',
        headers: getAdminAuthHeaders(),
        body: JSON.stringify(payload || {}),
      },
    )
    return handleAdminApiResponse(res)
  },

  manualOnboardScholarshipStudent: async (payload: {
    firstName: string
    middleName?: string
    lastName: string
    email: string
    phone?: string
    cohortId: string
    course?: string
    password?: string
    amountPaid?: number
    paymentReference?: string
  }) => {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/scholarships/students/manual-onboard`,
      {
        method: 'POST',
        headers: getAdminAuthHeaders(),
        body: JSON.stringify(payload),
      },
    )
    return handleAdminApiResponse(res)
  },

  getScholarshipCohorts: async () => {
    const res = await fetch(`${API_BASE_URL}/api/admin/scholarships/cohorts`, {
      method: 'GET',
      headers: getAdminAuthHeaders(),
    })
    return handleAdminApiResponse(res)
  },

  createScholarshipCohort: async (payload: {
    name: string
    code: string
    startDate: string
    endDate: string
    applicationOpenDate: string
    applicationCloseDate: string
  }) => {
    const res = await fetch(`${API_BASE_URL}/api/admin/scholarships/cohorts`, {
      method: 'POST',
      headers: getAdminAuthHeaders(),
      body: JSON.stringify(payload),
    })
    return handleAdminApiResponse(res)
  },

  updateScholarshipCohort: async (
    id: string,
    payload: {
      name?: string
      code?: string
      startDate?: string
      endDate?: string
      applicationOpenDate?: string
      applicationCloseDate?: string
      status?: string
    },
  ) => {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/scholarships/cohorts/${id}`,
      {
        method: 'PUT',
        headers: getAdminAuthHeaders(),
        body: JSON.stringify(payload),
      },
    )
    return handleAdminApiResponse(res)
  },

  deleteScholarshipCohort: async (id: string) => {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/scholarships/cohorts/${id}`,
      {
        method: 'DELETE',
        headers: getAdminAuthHeaders(),
      },
    )
    return handleAdminApiResponse(res)
  },

  updateScholarshipCohortStatus: async (id: string, status: string) => {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/scholarships/cohorts/${id}/status`,
      {
        method: 'PUT',
        headers: getAdminAuthHeaders(),
        body: JSON.stringify({ status }),
      },
    )
    return handleAdminApiResponse(res)
  },

  activateScholarshipCohort: async (id: string) => {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/scholarships/cohorts/${id}/activate`,
      {
        method: 'PATCH',
        headers: getAdminAuthHeaders(),
      },
    )
    return handleAdminApiResponse(res)
  },

  deactivateScholarshipCohort: async (id: string) => {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/scholarships/cohorts/${id}/deactivate`,
      {
        method: 'PATCH',
        headers: getAdminAuthHeaders(),
      },
    )
    return handleAdminApiResponse(res)
  },

  getPendingScholarshipApplications: async (cohortId?: string) => {
    const query = cohortId ? `?cohortId=${encodeURIComponent(cohortId)}` : ''
    const res = await fetch(
      `${API_BASE_URL}/api/admin/scholarships/applications/pending${query}`,
      {
        method: 'GET',
        headers: getAdminAuthHeaders(),
      },
    )
    return handleAdminApiResponse(res)
  },

  getAwaitingPaymentScholarshipApplications: async (cohortId?: string) => {
    const query = cohortId ? `?cohortId=${encodeURIComponent(cohortId)}` : ''
    const res = await fetch(
      `${API_BASE_URL}/api/admin/scholarships/applications/awaiting-payment${query}`,
      {
        method: 'GET',
        headers: getAdminAuthHeaders(),
      },
    )
    return handleAdminApiResponse(res)
  },

  getPaidScholarshipStudents: async (cohortId?: string) => {
    const query = cohortId ? `?cohortId=${encodeURIComponent(cohortId)}` : ''
    const res = await fetch(
      `${API_BASE_URL}/api/admin/scholarships/applications/paid${query}`,
      {
        method: 'GET',
        headers: getAdminAuthHeaders(),
      },
    )
    return handleAdminApiResponse(res)
  },

  // ==========================================
  // 8. QUESTION BANKS MANAGEMENT
  // ==========================================

  getQuestionBanks: async (params?: {
    status?: string
    courseId?: string
    search?: string
    page?: number
    limit?: number
  }) => {
    const query = new URLSearchParams()
    if (params?.status) query.append('status', params.status)
    if (params?.courseId) query.append('courseId', params.courseId)
    if (params?.search) query.append('search', params.search)
    if (params?.page) query.append('page', String(params.page))
    if (params?.limit) query.append('limit', String(params.limit))

    const url = `${API_BASE_URL}/api/question-banks${
      query.toString() ? `?${query.toString()}` : ''
    }`

    const res = await fetch(url, {
      method: 'GET',
      headers: getAdminAuthHeaders(),
    })
    return handleAdminApiResponse(res)
  },

  createQuestionBank: async (payload: {
    title: string
    description?: string
    courseId?: string
    subjects?: string[]
    durationMinutes?: number
    expiresAt?: string
    startTime?: string
    maxAttempts?: number
  }) => {
    const res = await fetch(`${API_BASE_URL}/api/question-banks`, {
      method: 'POST',
      headers: getAdminAuthHeaders(),
      body: JSON.stringify(payload),
    })
    return handleAdminApiResponse(res)
  },

  validateImportQuestionBank: async (payload: { questions: any[] }) => {
    const res = await fetch(`${API_BASE_URL}/api/question-banks/validate-import`, {
      method: 'POST',
      headers: getAdminAuthHeaders(),
      body: JSON.stringify(payload),
    })
    return handleAdminApiResponse(res)
  },

  getQuestionBankById: async (id: string | number) => {
    const res = await fetch(`${API_BASE_URL}/api/question-banks/${id}`, {
      method: 'GET',
      headers: getAdminAuthHeaders(),
    })
    return handleAdminApiResponse(res)
  },

  updateQuestionBank: async (id: string | number, payload: {
    title?: string
    description?: string
    courseId?: string
    subjects?: string[]
    durationMinutes?: number
    expiresAt?: string
    startTime?: string
    maxAttempts?: number
  }) => {
    const res = await fetch(`${API_BASE_URL}/api/question-banks/${id}`, {
      method: 'PUT',
      headers: getAdminAuthHeaders(),
      body: JSON.stringify(payload),
    })
    return handleAdminApiResponse(res)
  },

  deleteQuestionBank: async (id: string | number) => {
    const res = await fetch(`${API_BASE_URL}/api/question-banks/${id}`, {
      method: 'DELETE',
      headers: getAdminAuthHeaders(),
    })
    return handleAdminApiResponse(res)
  },

  submitQuestionBankForReview: async (id: string | number) => {
    const res = await fetch(`${API_BASE_URL}/api/question-banks/${id}/submit`, {
      method: 'PATCH',
      headers: getAdminAuthHeaders(),
    })
    return handleAdminApiResponse(res)
  },

  reviewQuestionBank: async (id: string | number, payload: {
    status: 'APPROVED' | 'REJECTED' | string
    reviewComment?: string
  }) => {
    const res = await fetch(`${API_BASE_URL}/api/question-banks/${id}/review`, {
      method: 'PATCH',
      headers: getAdminAuthHeaders(),
      body: JSON.stringify(payload),
    })
    return handleAdminApiResponse(res)
  },

  importQuestionsIntoBank: async (id: string | number, payload: { questions: any[] }) => {
    const res = await fetch(`${API_BASE_URL}/api/question-banks/${id}/import`, {
      method: 'POST',
      headers: getAdminAuthHeaders(),
      body: JSON.stringify(payload),
    })
    return handleAdminApiResponse(res)
  },

  // ==========================================
  // 9. QUESTIONS MANAGEMENT
  // ==========================================

  getQuestions: async (params?: {
    question_bank_id?: number | string
    subject_id?: string
    course_id?: string
    page?: number
    limit?: number
  }) => {
    const query = new URLSearchParams()
    if (params?.question_bank_id) query.append('question_bank_id', String(params.question_bank_id))
    if (params?.subject_id) query.append('subject_id', params.subject_id)
    if (params?.course_id) query.append('course_id', params.course_id)
    if (params?.page) query.append('page', String(params.page))
    if (params?.limit) query.append('limit', String(params.limit))

    const url = `${API_BASE_URL}/api/questions${
      query.toString() ? `?${query.toString()}` : ''
    }`

    const res = await fetch(url, {
      method: 'GET',
      headers: getAdminAuthHeaders(),
    })
    return handleAdminApiResponse(res)
  },

  createQuestion: async (payload: {
    questionBankId?: number | string
    question_bank_id?: number | string
    subjectId?: string
    subject_id?: string
    courseId?: string
    course_id?: string
    questionText: string
    question_text?: string
    questionType?: string
    question_type?: string
    imageUrl?: string
    image_url?: string
    marks?: number
    options: Array<{
      text?: string
      optionText?: string
      option_text?: string
      isCorrect?: boolean
      is_correct?: boolean
      explanation?: string
    }>
  }) => {
    // Normalize payload to satisfy both camelCase and snake_case backend validators
    const bankId = payload.questionBankId ?? payload.question_bank_id
    const normalizedPayload = {
      questionBankId: bankId,
      question_bank_id: bankId,
      subjectId: payload.subjectId ?? payload.subject_id,
      subject_id: payload.subjectId ?? payload.subject_id,
      courseId: payload.courseId ?? payload.course_id,
      course_id: payload.courseId ?? payload.course_id,
      questionText: payload.questionText ?? payload.question_text,
      question_text: payload.questionText ?? payload.question_text,
      questionType: payload.questionType ?? payload.question_type ?? 'MCQ',
      question_type: payload.questionType ?? payload.question_type ?? 'MCQ',
      imageUrl: payload.imageUrl ?? payload.image_url,
      image_url: payload.imageUrl ?? payload.image_url,
      marks: payload.marks ?? 1,
      options: (payload.options || []).map((opt) => {
        const textVal = opt.text ?? opt.optionText ?? opt.option_text ?? ''
        const correctVal = Boolean(opt.isCorrect ?? opt.is_correct ?? false)
        return {
          text: textVal,
          optionText: textVal,
          option_text: textVal,
          isCorrect: correctVal,
          is_correct: correctVal,
          explanation: opt.explanation || '',
        }
      }),
    }

    const res = await fetch(`${API_BASE_URL}/api/questions`, {
      method: 'POST',
      headers: getAdminAuthHeaders(),
      body: JSON.stringify(normalizedPayload),
    })
    return handleAdminApiResponse(res)
  },

  getQuestionById: async (id: string | number) => {
    const res = await fetch(`${API_BASE_URL}/api/questions/${id}`, {
      method: 'GET',
      headers: getAdminAuthHeaders(),
    })
    return handleAdminApiResponse(res)
  },

  updateQuestion: async (id: string | number, payload: {
    subjectId?: string
    subject_id?: string
    courseId?: string
    course_id?: string
    questionText?: string
    question_text?: string
    questionType?: string
    question_type?: string
    imageUrl?: string
    image_url?: string
    marks?: number
    options?: Array<{
      text?: string
      optionText?: string
      option_text?: string
      isCorrect?: boolean
      is_correct?: boolean
      explanation?: string
    }>
  }) => {
    const normalizedPayload = {
      subjectId: payload.subjectId ?? payload.subject_id,
      subject_id: payload.subjectId ?? payload.subject_id,
      courseId: payload.courseId ?? payload.course_id,
      course_id: payload.courseId ?? payload.course_id,
      questionText: payload.questionText ?? payload.question_text,
      question_text: payload.questionText ?? payload.question_text,
      questionType: payload.questionType ?? payload.question_type,
      question_type: payload.questionType ?? payload.question_type,
      imageUrl: payload.imageUrl ?? payload.image_url,
      image_url: payload.imageUrl ?? payload.image_url,
      marks: payload.marks,
      options: payload.options?.map((opt) => {
        const textVal = opt.text ?? opt.optionText ?? opt.option_text ?? ''
        const correctVal = Boolean(opt.isCorrect ?? opt.is_correct ?? false)
        return {
          text: textVal,
          optionText: textVal,
          option_text: textVal,
          isCorrect: correctVal,
          is_correct: correctVal,
          explanation: opt.explanation || '',
        }
      }),
    }

    const res = await fetch(`${API_BASE_URL}/api/questions/${id}`, {
      method: 'PUT',
      headers: getAdminAuthHeaders(),
      body: JSON.stringify(normalizedPayload),
    })
    return handleAdminApiResponse(res)
  },

  deleteQuestion: async (id: string | number) => {
    const res = await fetch(`${API_BASE_URL}/api/questions/${id}`, {
      method: 'DELETE',
      headers: getAdminAuthHeaders(),
    })
    return handleAdminApiResponse(res)
  },

  updateQuestionStatus: async (id: string | number, status: 'ACTIVE' | 'ARCHIVED' | string) => {
    const res = await fetch(`${API_BASE_URL}/api/questions/${id}/status`, {
      method: 'PATCH',
      headers: getAdminAuthHeaders(),
      body: JSON.stringify({ status }),
    })
    return handleAdminApiResponse(res)
  },

  // ==========================================
  // Leaderboard Service Methods
  // ==========================================

  /**
   * Retrieves the global or course-specific student leaderboard ranked by percentage score.
   * Supports optional filtering by course, keyword search on student names, and pagination.
   */
  getLeaderboard: async (params?: { courseId?: string; search?: string; page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams()
    if (params?.courseId) queryParams.append('courseId', params.courseId)
    if (params?.search) queryParams.append('search', params.search)
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ''
    const res = await fetch(`${API_BASE_URL}/api/leaderboard${queryString}`, {
      method: 'GET',
      headers: getAdminAuthHeaders(),
    })
    return handleAdminApiResponse(res)
  },

  /**
   * Retrieves the authenticated student's current rank, score, and performance context.
   */
  getMyRanking: async (courseId?: string) => {
    const queryParams = courseId ? `?courseId=${encodeURIComponent(courseId)}` : ''
    const res = await fetch(`${API_BASE_URL}/api/leaderboard/me${queryParams}`, {
      method: 'GET',
      headers: getAdminAuthHeaders(),
    })
    return handleAdminApiResponse(res)
  },

  /**
   * Retrieves the top 3 podium performers (Gold, Silver, Bronze) optimized for dashboard UI widgets.
   */
  getPodium: async (courseId?: string) => {
    const queryParams = courseId ? `?courseId=${encodeURIComponent(courseId)}` : ''
    const res = await fetch(`${API_BASE_URL}/api/leaderboard/podium${queryParams}`, {
      method: 'GET',
      headers: getAdminAuthHeaders(),
    })
    return handleAdminApiResponse(res)
  },
}