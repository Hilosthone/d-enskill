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

    // Check if the response was successful or contains a token
    if (res.ok && (data.token || data.accessToken || data.success)) {
      const tokenToStore = data.token || data.accessToken
      if (tokenToStore) {
        localStorage.setItem('denskill_token', tokenToStore)
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
      headers: getAuthHeaders(),
    })
    return handleApiResponse(res) // Matches the global API utility pattern
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
      headers: getAuthHeaders(),
    })
    return res.json()
  },

  // Freeze or unfreeze a student account (ID is integer)
  updateStudentStatus: async (userId: number, status: 'frozen' | 'active') => {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/students/${userId}/status`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      },
    )
    return res.json()
  },

  // Delete a student account (ID is integer)
  deleteStudent: async (userId: number) => {
    const res = await fetch(`${API_BASE_URL}/api/admin/students/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    return res.json()
  },

  // Get all system payment logs for admin overview
  getAdminPayments: async () => {
    const res = await fetch(`${API_BASE_URL}/api/admin/payments`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    // Check if the network response or HTTP status is unsuccessful
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      throw new Error(
        errorData.message || 'Failed to fetch admin payment logs.',
      )
    }

    return res.json()
  },

  // Get all courses with enrollment counts for admin overview
  getAdminCourses: async () => {
    const res = await fetch(`${API_BASE_URL}/api/admin/courses`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      throw new Error(
        errorData.message ||
          'Failed to fetch admin courses and enrollment counts.',
      )
    }

    return res.json()
  },
  
  getAdminAnnouncements: async () => {
    const res = await fetch(`${API_BASE_URL}/api/admin/announcements`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    return res.json()
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
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    })
    return res.json()
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
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    })
    return res.json()
  },

  deleteAnnouncement: async (id: number | string) => {
    const res = await fetch(`${API_BASE_URL}/api/admin/announcements/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    return res.json()
  },

  // Instructors API Client Methods
  // Ensure these are included inside your centralized `apiClient` object in `@/services/api`

  // Get system instructors
  getAdminInstructors: async () => {
    const res = await fetch(`${API_BASE_URL}/api/admin/instructors`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    return res.json()
  },

  // Create a new instructor/tutor with login credentials
  createInstructor: async (payload: {
    name: string
    email: string
    specialty: string
    role?: string
    password: string
  }) => {
    const res = await fetch(`${API_BASE_URL}/api/admin/instructors`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    })
    return res.json()
  },

  // Update an existing instructor (including optional password update)
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
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    })
    return res.json()
  },

  // Delete an instructor by ID
  deleteInstructor: async (id: string | number) => {
    const res = await fetch(`${API_BASE_URL}/api/admin/instructors/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    return res.json()
  },

  getAdminReports: async () => {
    const res = await fetch(`${API_BASE_URL}/api/admin/reports`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    return res.json()
  },

  getAdminSettings: async () => {
    const res = await fetch(`${API_BASE_URL}/api/admin/settings`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    return res.json()
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
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      },
    )
    return handleApiResponse(res) // Consistent with the other API methods
  },

  // Execute an administrative override for any disputed score or academic adjustment
  executeGradeOverride: async (gradeId: string | number) => {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/grading/override/${gradeId}`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
      },
    )
    return res.json()
  },

  // Monitor cohort-wide attendance trends and flag chronically absent students
  getAdminAttendanceOverview: async (courseId: string | number) => {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/attendance/overview/${courseId}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      },
    )
    return res.json()
  },

  // Send direct custom email messages to one or multiple users via Resend
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
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return res.json()
  },

// ==========================================
// LEADERBOARD ENDPOINTS INTEGRATION
// ==========================================

/**
 * Get global or course-specific student leaderboard ranked by percentage score.
 * Supports optional course filtering, text search by student name, and pagination.
 */

  // Global or course-specific student leaderboard ranked by percentage score
getLeaderboard: async (params?: {
  courseId?: string
  search?: string
  page?: number
  limit?: number
}) => {
  const queryParams = new URLSearchParams()
  if (params?.courseId) queryParams.append('courseId', params.courseId)
  if (params?.search) queryParams.append('search', params.search)
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.limit) queryParams.append('limit', params.limit.toString())

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ''
  const res = await fetch(`${API_BASE_URL}/api/leaderboard${queryString}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  return res.json()
},

// Get the authenticated student's current rank and percentage score
getMyLeaderboardRank: async (courseId?: string) => {
  const queryParam = courseId ? `?courseId=${encodeURIComponent(courseId)}` : ''
  const res = await fetch(`${API_BASE_URL}/api/leaderboard/me${queryParam}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  return res.json()
},

// Get top 3 podium performers (Gold, Silver, Bronze) for dashboard display
getLeaderboardPodium: async (courseId?: string) => {
  const queryParam = courseId ? `?courseId=${encodeURIComponent(courseId)}` : ''
  const res = await fetch(`${API_BASE_URL}/api/leaderboard/podium${queryParam}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
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
  // 7. SCHOLARSHIP ADMIN MANAGEMENT
  // Administrative control for tracking metrics, reviewing applications, and managing cohorts
  // ==========================================

  getScholarshipMetrics: async (cohortId?: string) => {
    const query = cohortId ? `?cohortId=${encodeURIComponent(cohortId)}` : ''
    const res = await fetch(
      `${API_BASE_URL}/api/admin/scholarships/metrics${query}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      },
    )
    return handleApiResponse(res)
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
        headers: getAuthHeaders(),
      },
    )
    return handleApiResponse(res)
  },

  approveScholarshipApplication: async (
    id: string,
    payload?: { adminNotes?: string },
  ) => {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/scholarships/applications/${id}/approve`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload || {}),
      },
    )
    return handleApiResponse(res)
  },

  rejectScholarshipApplication: async (
    id: string,
    payload?: { adminNotes?: string },
  ) => {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/scholarships/applications/${id}/reject`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload || {}),
      },
    )
    return handleApiResponse(res)
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
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      },
    )
    return handleApiResponse(res)
  },

  getScholarshipCohorts: async () => {
    const res = await fetch(`${API_BASE_URL}/api/admin/scholarships/cohorts`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    return handleApiResponse(res)
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
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    })
    return handleApiResponse(res)
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
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      },
    )
    return handleApiResponse(res)
  },

  deleteScholarshipCohort: async (id: string) => {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/scholarships/cohorts/${id}`,
      {
        method: 'DELETE',
        headers: getAuthHeaders(),
      },
    )
    return handleApiResponse(res)
  },

  updateScholarshipCohortStatus: async (id: string, status: string) => {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/scholarships/cohorts/${id}/status`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      },
    )
    return handleApiResponse(res)
  },

  activateScholarshipCohort: async (id: string) => {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/scholarships/cohorts/${id}/activate`,
      {
        method: 'PATCH',
        headers: getAuthHeaders(),
      },
    )
    return handleApiResponse(res)
  },

  deactivateScholarshipCohort: async (id: string) => {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/scholarships/cohorts/${id}/deactivate`,
      {
        method: 'PATCH',
        headers: getAuthHeaders(),
      },
    )
    return handleApiResponse(res)
  },

  // ==========================================
  // 7. SCHOLARSHIP ADMIN MANAGEMENT (Extensions)
  // ==========================================

  getPendingScholarshipApplications: async (cohortId?: string) => {
    const query = cohortId ? `?cohortId=${encodeURIComponent(cohortId)}` : ''
    const res = await fetch(
      `${API_BASE_URL}/api/admin/scholarships/applications/pending${query}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      },
    )
    return handleApiResponse(res)
  },

  getAwaitingPaymentScholarshipApplications: async (cohortId?: string) => {
    const query = cohortId ? `?cohortId=${encodeURIComponent(cohortId)}` : ''
    const res = await fetch(
      `${API_BASE_URL}/api/admin/scholarships/applications/awaiting-payment${query}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      },
    )
    return handleApiResponse(res)
  },

  getPaidScholarshipStudents: async (cohortId?: string) => {
    const query = cohortId ? `?cohortId=${encodeURIComponent(cohortId)}` : ''
    const res = await fetch(
      `${API_BASE_URL}/api/admin/scholarships/applications/paid${query}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      },
    )
    return handleApiResponse(res)
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
  // tutorLogin: async (credentials: { email: string; password: string }) => {
  //   const res = await fetch(`${API_BASE_URL}/api/tutor/login`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       accept: '*/*',
  //     },
  //     body: JSON.stringify(credentials),
  //   })

  //   const data = await handleApiResponse(res)

  //   const token = data.token || data.accessToken || data.data?.token
  //   if (token && typeof window !== 'undefined') {
  //     localStorage.setItem('denskill_token', token)
  //   }

  //   return data
  // },

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
