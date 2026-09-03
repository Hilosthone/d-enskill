// ==========================================
// CONFIGURATION & ENVIRONMENT SETUP
// ==========================================
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://denskill-backend.onrender.com'

/**
 * Helper utility to construct authenticated request headers.
 * Automatically extracts the JWT token from localStorage if available.
 */
const getAuthHeaders = () => {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('denskill_token')
      : null
  return {
    'Content-Type': 'application/json',
    accept: '*/*',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

// Global helper for handling API responses and expired tokens
const handleApiResponse = async (res: Response) => {
  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('denskill_token')
      window.location.href = '/auth/login'
    }
    throw new Error('Session expired. Please log in again.')
  }
  return res.json()
}

export const apiClient = {
  // ==========================================
  // 1. ENROLLMENT & PAYMENT FLOW
  // Standard student registration and payment gateways
  // ==========================================
  initializeEnrollment: async (payload: {
    firstName: string
    middleName?: string
    lastName: string
    country?: string
    phone: string
    email: string
    course: string
    reason?: string
    referredBy?: string
    amountPaid: number
    callback_url: string
  }) => {
    const res = await fetch(`${API_BASE_URL}/api/enrollments/initialize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', accept: '*/*' },
      body: JSON.stringify(payload),
    })
    return res.json()
  },

  payInstallment: async (payload: {
    course: string
    amountPayable: number
    callback_url: string
  }) => {
    const res = await fetch(`${API_BASE_URL}/api/enrollments/pay-installment`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
        accept: '*/*',
      },
      body: JSON.stringify(payload),
    })
    return res.json()
  },

  getInstallmentStatus: async (course: string) => {
    const res = await fetch(
      `${API_BASE_URL}/api/enrollments/installment-status/${encodeURIComponent(course)}`,
      {
        method: 'GET',
        headers: { ...getAuthHeaders(), accept: '*/*' },
      },
    )
    return res.json()
  },

  verifyEnrollment: async (reference: string) => {
    const res = await fetch(
      `${API_BASE_URL}/api/enrollments/verify/${encodeURIComponent(reference)}`,
      {
        method: 'GET',
        headers: { ...getAuthHeaders(), accept: '*/*' },
      },
    )
    return res.json()
  },

  setPassword: async (payload: {
    email: string
    password: string
    confirmPassword: string
  }) => {
    const res = await fetch(`${API_BASE_URL}/api/enrollments/set-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', accept: '*/*' },
      body: JSON.stringify(payload),
    })
    return res.json()
  },

  // ==========================================
  // 2. AUTHENTICATION FLOW
  // User registration, login, token management, and recovery
  // ==========================================
  signup: async (payload: {
    name: string
    email: string
    password: string
  }) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', accept: '*/*' },
      body: JSON.stringify(payload),
    })
    return res.json()
  },

  signin: async (payload: { email: string; password: string }) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', accept: '*/*' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    // Automatically store JWT token on successful signin
    if (data.token || data.accessToken) {
      localStorage.setItem('denskill_token', data.token || data.accessToken)
    }
    return data
  },

  forgotPassword: async (payload: { email: string }) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', accept: '*/*' },
      body: JSON.stringify(payload),
    })
    return res.json()
  },

  resetPassword: async (payload: {
    email: string
    otp: string
    newPassword: string
    confirmPassword: string
  }) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', accept: '*/*' },
      body: JSON.stringify(payload),
    })
    return res.json()
  },

  logout: async () => {
    const res = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    })
    localStorage.removeItem('denskill_token')
    return res.json()
  },

  // ==========================================
  // 3. STUDENT PORTAL DASHBOARD
  // Endpoints for retrieving enrolled courses, progress, and profiles
  // ==========================================
  getDashboardOverview: async () => {
    const res = await fetch(`${API_BASE_URL}/api/dashboard/overview`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    return res.json()
  },

  getStudentProfile: async () => {
    const res = await fetch(`${API_BASE_URL}/api/dashboard/profile`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    return res.json()
  },

  getCourses: async () => {
    const res = await fetch(`${API_BASE_URL}/api/dashboard/courses`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    return res.json()
  },

  getPayments: async () => {
    const res = await fetch(`${API_BASE_URL}/api/dashboard/payments`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    return res.json()
  },

  getAnnouncements: async () => {
    const res = await fetch(`${API_BASE_URL}/api/dashboard/announcements`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    const data = await res.json()

    // If the server returns an error status (e.g., 401, 500), throw it so the catch block handles it
    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch announcements')
    }

    return data
  },

  getReceipts: async () => {
    const res = await fetch(`${API_BASE_URL}/api/dashboard/receipts`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    return res.json()
  },

  getScholarshipProfile: async () => {
    const res = await fetch(
      `${API_BASE_URL}/api/dashboard/scholarship/profile`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      },
    )
    return res.json()
  },

  verifyStudentScholarshipPayment: async (data: {
    paymentReference: string
    transactionId: string
  }) => {
    const res = await fetch(`${API_BASE_URL}/api/dashboard/payment/verify`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return res.json()
  },

  getGrades: async () => {
    const res = await fetch(`${API_BASE_URL}/api/dashboard/grades`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    return res.json()
  },

  getCommunityPosts: async () => {
    const res = await fetch(`${API_BASE_URL}/api/dashboard/community`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    return res.json()
  },

  fetchCourseModules: async (courseId: string) => {
    const res = await fetch(
      `${API_BASE_URL}/api/dashboard/modules/${courseId}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      },
    )
    return res.json()
  },

  getCourseSessions: async (courseId: string) => {
    const res = await fetch(
      `${API_BASE_URL}/api/dashboard/sessions/${courseId}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      },
    )
    return res.json()
  },

  fetchCourseAssessments: async (courseId: string) => {
    const res = await fetch(
      `${API_BASE_URL}/api/dashboard/assessments/${courseId}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      },
    )
    return res.json()
  },

  submitAssessment: async (assessmentId: number | string, content: string) => {
    const res = await fetch(
      `${API_BASE_URL}/api/dashboard/assessments/${assessmentId}/submit`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ content }),
      },
    )
    return res.json()
  },

    // ==========================================
  // 6. SCHOLARSHIP ENROLLMENT & AUTH
  // Public application portal, contribution payments, and offer claiming
  // ==========================================
  getActiveScholarshipCohorts: async () => {
    const res = await fetch(
      `${API_BASE_URL}/api/scholarship/enrollment/cohorts/active`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', accept: '*/*' },
      },
    )
    return res.json()
  },

  submitScholarshipApplication: async (payload: {
    cohortId: string
    firstName: string
    lastName: string
    email: string
    phone: string
    course: string
    statement: string
    referredBy?: string
    country?: string
    educationalBackground?: string
    technicalBackground?: string
    reasonForApplying?: string
    motivation?: string
    portfolioUrl?: string
  }) => {
    const res = await fetch(
      `${API_BASE_URL}/api/scholarship/enrollment/apply`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', accept: '*/*' },
        body: JSON.stringify(payload),
      },
    )
    return res.json()
  },

  getScholarshipStatus: async (email: string) => {
    const res = await fetch(
      `${API_BASE_URL}/api/scholarship/enrollment/status?email=${encodeURIComponent(email)}`,
      {
        method: 'GET',
        headers: { accept: '*/*' },
      },
    )
    return res.json()
  },

  initializeScholarshipPayment: async (payload: { applicationId: string }) => {
    const res = await fetch(
      `${API_BASE_URL}/api/scholarship/enrollment/payment/initialize`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', accept: '*/*' },
        body: JSON.stringify(payload),
      },
    )
    return res.json()
  },

  verifyScholarshipPayment: async (payload: { reference: string }) => {
    const res = await fetch(
      `${API_BASE_URL}/api/scholarship/enrollment/payment/verify`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', accept: '*/*' },
        body: JSON.stringify(payload),
      },
    )

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Payment verification failed')
    }

    return data
  },

  claimScholarship: async (payload: {
    applicationId: string
    password: string
  }) => {
    const res = await fetch(
      `${API_BASE_URL}/api/scholarship/enrollment/claim`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', accept: '*/*' },
        body: JSON.stringify(payload),
      },
    )
    return res.json()
  },

  signupScholarship: async (payload: {
    name: string
    email: string
    password: string
    cohort_id: number
  }) => {
    const res = await fetch(`${API_BASE_URL}/api/scholarship/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', accept: '*/*' },
      body: JSON.stringify(payload),
    })
    return res.json()
  },

  signinScholarship: async (payload: { email: string; password: string }) => {
    const res = await fetch(`${API_BASE_URL}/api/scholarship/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', accept: '*/*' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (res.ok && (data.token || data.accessToken)) {
      localStorage.setItem('denskill_token', data.token || data.accessToken)
    }
    return data
  },

  // ==========================================
  // TUTORS / INSTRUCTORS ENDPOINTS
  // ==========================================

  // Fetch courses assigned specifically to the logged-in tutor
  getTutorAssignedCourses: async () => {
    const res = await fetch(`${API_BASE_URL}/api/tutor/courses`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    return handleApiResponse(res)
  },

  // Authenticate a system instructor/tutor

  tutorLogin: async (credentials: { email: string; password: string }) => {
    const res = await fetch(`${API_BASE_URL}/api/tutor/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: '*/*',
      },
      body: JSON.stringify(credentials),
    })

    const data = await handleApiResponse(res)

    const token = data.token || data.accessToken || data.data?.token
    const tutor = data.tutor || data.data?.tutor

    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('denskill_tutor_token', token)
      }

      if (tutor) {
        localStorage.setItem('denskill_tutor', JSON.stringify(tutor))
      }

      localStorage.setItem('denskill_tutor_logged', 'true')
    }

    return data
  },

  // Create a new assessment, quiz, or assignment
  createAssessment: async (data: {
    course_id: number | string
    title: string
    description: string
    type: string
    total_marks: number
    weight: number
    due_date: string
  }) => {
    const res = await fetch(`${API_BASE_URL}/api/tutor/assessments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return handleApiResponse(res)
  },

  // Get all published assessments for a course
  getCourseAssessments: async (courseId: number | string) => {
    const res = await fetch(
      `${API_BASE_URL}/api/tutor/assessments/${courseId}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      },
    )
    return handleApiResponse(res)
  },

  // Edit/Update an existing assessment, quiz, or assignment
  updateAssessment: async (
    assessmentId: number | string,
    data: {
      title?: string
      description?: string
      type?: string
      total_marks?: number
      weight?: number
      due_date?: string
    },
  ) => {
    const res = await fetch(
      `${API_BASE_URL}/api/tutor/assessments/${assessmentId}`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      },
    )
    return handleApiResponse(res)
  },

  // Delete an assessment, quiz, or assignment
  deleteAssessment: async (assessmentId: number | string) => {
    const res = await fetch(
      `${API_BASE_URL}/api/tutor/assessments/${assessmentId}`,
      {
        method: 'DELETE',
        headers: getAuthHeaders(),
      },
    )
    return handleApiResponse(res)
  },

  // View student submissions for a specific assessment
  getAssessmentSubmissions: async (assessmentId: number | string) => {
    const res = await fetch(
      `${API_BASE_URL}/api/tutor/assessments/${assessmentId}/submissions`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      },
    )
    return handleApiResponse(res)
  },

  // Grade a student's submission and provide score/feedback
  gradeSubmission: async (
    submissionId: number | string,
    data: {
      score: number
      feedback: string
    },
  ) => {
    const res = await fetch(
      `${API_BASE_URL}/api/tutor/submissions/${submissionId}/grade`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      },
    )
    return handleApiResponse(res)
  },

  // Submit iterative review or feedback on a student code submission
  submitSubmissionFeedback: async (
    submissionId: number | string,
    data?: {
      feedback?: string
    },
  ) => {
    const res = await fetch(
      `${API_BASE_URL}/api/tutor/submissions/${submissionId}/feedback`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      },
    )
    return handleApiResponse(res)
  },

  // Log daily attendance records for students in a course session
  logAttendance: async (data: {
    course_id: number | string
    attendance_records: Array<{
      student_id: number | string
      status: string
    }>
  }) => {
    const res = await fetch(`${API_BASE_URL}/api/tutor/attendance`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return handleApiResponse(res)
  },

  // Upload and organize weekly course modules, lectures, and resources
  uploadCourseModule: async (data?: any) => {
    const res = await fetch(`${API_BASE_URL}/api/tutor/modules`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    })
    return handleApiResponse(res)
  },

  // Fetch all course modules and resource files for a specific course
  getCourseModules: async (courseId: number | string) => {
    const res = await fetch(`${API_BASE_URL}/api/tutor/modules/${courseId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    return handleApiResponse(res)
  },

  // Schedule a live workshop session and conference link
  scheduleLiveSession: async (data?: any) => {
    const res = await fetch(`${API_BASE_URL}/api/tutor/sessions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    })
    return handleApiResponse(res)
  },

  // Get scheduled live sessions for a course
  getLiveSessions: async (courseId: number | string) => {
    const res = await fetch(`${API_BASE_URL}/api/tutor/sessions/${courseId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    return handleApiResponse(res)
  },

  // Get list of registered students (roster) for a specific course
  getCourseRoster: async (courseId: number | string) => {
    const res = await fetch(`${API_BASE_URL}/api/tutor/roster/${courseId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    return handleApiResponse(res)
  },

  // Create an announcement targeted to a specific course
  publishAnnouncement: async (data?: any) => {
    const res = await fetch(`${API_BASE_URL}/api/tutor/announcements`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    })
    return handleApiResponse(res)
  },

  // Get summary performance statistics and at-risk student lists for a course
  getCourseAnalytics: async (courseId: number | string) => {
    const res = await fetch(`${API_BASE_URL}/api/tutor/analytics/${courseId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    return handleApiResponse(res)
  },

  // Get assigned cohort students list (supports unified regular + scholarship roster)
  getCohortStudents: async (cohortId?: number | string) => {
    const query = cohortId ? `?cohortId=${cohortId}` : ''
    const res = await fetch(
      `${API_BASE_URL}/api/tutor/students/cohort${query}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      },
    )
    return handleApiResponse(res)
  },
}
