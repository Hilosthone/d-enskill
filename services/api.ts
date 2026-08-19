// const API_BASE_URL =
//   process.env.NEXT_PUBLIC_API_BASE_URL ||
//   'https://denskill-backend.onrender.com'

// // Helper to get auth header
// const getAuthHeaders = () => {
//   const token =
//     typeof window !== 'undefined'
//       ? localStorage.getItem('denskill_token')
//       : null
//   return {
//     'Content-Type': 'application/json',
//     accept: '*/*',
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//   }
// }

// export const apiClient = {
//   // --- 1. Enrollment & Payment Flow ---
//   initializeEnrollment: async (payload: {
//     firstName: string
//     middleName?: string
//     lastName: string
//     country?: string
//     phone: string
//     email: string
//     course: string
//     reason?: string
//     referredBy?: string
//     amountPaid: number
//     callback_url: string
//   }) => {
//     const res = await fetch(`${API_BASE_URL}/api/enrollments/initialize`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json', accept: '*/*' },
//       body: JSON.stringify(payload),
//     })
//     return res.json()
//   },

//   payInstallment: async (payload: {
//     course: string
//     amountPayable: number
//     callback_url: string
//   }) => {
//     const res = await fetch(`${API_BASE_URL}/api/enrollments/pay-installment`, {
//       method: 'POST',
//       headers: {
//         ...getAuthHeaders(),
//         'Content-Type': 'application/json',
//         accept: '*/*',
//       },
//       body: JSON.stringify(payload),
//     })
//     return res.json()
//   },

//   getInstallmentStatus: async (course: string) => {
//     const res = await fetch(
//       `${API_BASE_URL}/api/enrollments/installment-status/${encodeURIComponent(course)}`,
//       {
//         method: 'GET',
//         headers: { ...getAuthHeaders(), accept: '*/*' },
//       },
//     )
//     return res.json()
//   },

//   verifyEnrollment: async (reference: string) => {
//     const res = await fetch(
//       `${API_BASE_URL}/api/enrollments/verify/${encodeURIComponent(reference)}`,
//       {
//         method: 'GET',
//         headers: { ...getAuthHeaders(), accept: '*/*' },
//       },
//     )
//     return res.json()
//   },

//   setPassword: async (payload: {
//     email: string
//     password: string
//     confirmPassword: string
//   }) => {
//     const res = await fetch(`${API_BASE_URL}/api/enrollments/set-password`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json', accept: '*/*' },
//       body: JSON.stringify(payload),
//     })
//     return res.json()
//   },

//   // --- 2. Authentication Flow ---
//   signup: async (payload: {
//     name: string
//     email: string
//     password: string
//   }) => {
//     const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json', accept: '*/*' },
//       body: JSON.stringify(payload),
//     })
//     return res.json()
//   },

//   signin: async (payload: { email: string; password: string }) => {
//     const res = await fetch(`${API_BASE_URL}/api/auth/signin`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json', accept: '*/*' },
//       body: JSON.stringify(payload),
//     })
//     const data = await res.json()
//     // Automatically store JWT token on successful signin
//     if (data.token || data.accessToken) {
//       localStorage.setItem('denskill_token', data.token || data.accessToken)
//     }
//     return data
//   },

//   forgotPassword: async (payload: { email: string }) => {
//     const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json', accept: '*/*' },
//       body: JSON.stringify(payload),
//     })
//     return res.json()
//   },

//   resetPassword: async (payload: {
//     email: string
//     otp: string
//     newPassword: string
//     confirmPassword: string
//   }) => {
//     const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json', accept: '*/*' },
//       body: JSON.stringify(payload),
//     })
//     return res.json()
//   },

//   logout: async () => {
//     const res = await fetch(`${API_BASE_URL}/api/auth/logout`, {
//       method: 'POST',
//       headers: getAuthHeaders(),
//     })
//     localStorage.removeItem('denskill_token')
//     return res.json()
//   },

//   // --- 3. Student Portal Dashboard ---
//   getDashboardOverview: async () => {
//     const res = await fetch(`${API_BASE_URL}/api/dashboard/overview`, {
//       method: 'GET',
//       headers: getAuthHeaders(),
//     })
//     return res.json()
//   },

//   getStudentProfile: async () => {
//     const res = await fetch(`${API_BASE_URL}/api/dashboard/profile`, {
//       method: 'GET',
//       headers: getAuthHeaders(),
//     })
//     return res.json()
//   },

//   getCourses: async () => {
//     const res = await fetch(`${API_BASE_URL}/api/dashboard/courses`, {
//       method: 'GET',
//       headers: getAuthHeaders(),
//     })
//     return res.json()
//   },

//   getPayments: async () => {
//     const res = await fetch(`${API_BASE_URL}/api/dashboard/payments`, {
//       method: 'GET',
//       headers: getAuthHeaders(),
//     })
//     return res.json()
//   },

//   getAnnouncements: async () => {
//     const res = await fetch(`${API_BASE_URL}/api/dashboard/announcements`, {
//       method: 'GET',
//       headers: getAuthHeaders(),
//     })
//     return res.json()
//   },

//   // --- 4. Admin Authentication Flow ---
//   adminLogin: async (payload: { email: string; password: string }) => {
//     const res = await fetch(`${API_BASE_URL}/api/admin/auth/login`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json', accept: '*/*' },
//       body: JSON.stringify(payload),
//     })
//     const data = await res.json()

//     // Check if the response was successful or contains a token
//     if (res.ok && (data.token || data.accessToken || data.success)) {
//       const tokenToStore = data.token || data.accessToken
//       if (tokenToStore) {
//         localStorage.setItem('denskill_token', tokenToStore)
//       }
//     }

//     return data
//   },

//   // --- 5. Admin Management ---
//   getAdminDashboard: async () => {
//     const res = await fetch(`${API_BASE_URL}/api/admin/dashboard`, {
//       method: 'GET',
//       headers: getAuthHeaders(),
//     })
//     return res.json()
//   },

//   getAdminStudents: async () => {
//     const res = await fetch(`${API_BASE_URL}/api/admin/students`, {
//       method: 'GET',
//       headers: getAuthHeaders(),
//     })
//     return res.json()
//   },

//   updateStudentStatus: async (userId: string, status: 'active' | 'frozen') => {
//     const res = await fetch(
//       `${API_BASE_URL}/api/admin/students/${userId}/status`,
//       {
//         method: 'PUT',
//         headers: getAuthHeaders(),
//         body: JSON.stringify({ status }),
//       },
//     )
//     return res.json()
//   },

//   deleteStudent: async (userId: string) => {
//     const res = await fetch(`${API_BASE_URL}/api/admin/students/${userId}`, {
//       method: 'DELETE',
//       headers: getAuthHeaders(),
//     })
//     return res.json()
//   },

//   getAdminPayments: async () => {
//     const res = await fetch(`${API_BASE_URL}/api/admin/payments`, {
//       method: 'GET',
//       headers: getAuthHeaders(),
//     })
//     return res.json()
//   },

//   getAdminCourses: async () => {
//     const res = await fetch(`${API_BASE_URL}/api/admin/courses`, {
//       method: 'GET',
//       headers: getAuthHeaders(),
//     })
//     return res.json()
//   },

//   assignTutor: async (courseId: string, tutorId: string) => {
//     const res = await fetch(
//       `${API_BASE_URL}/api/admin/courses/${courseId}/assign-tutor`,
//       {
//         method: 'PATCH',
//         headers: getAuthHeaders(),
//         body: JSON.stringify({ tutorId }),
//       },
//     )
//     return res.json()
//   },

//   getAdminAnnouncements: async () => {
//     const res = await fetch(`${API_BASE_URL}/api/admin/announcements`, {
//       method: 'GET',
//       headers: getAuthHeaders(),
//     })
//     return res.json()
//   },

//   createAnnouncement: async (payload: { title: string; content: string }) => {
//     const res = await fetch(`${API_BASE_URL}/api/admin/announcements`, {
//       method: 'POST',
//       headers: getAuthHeaders(),
//       body: JSON.stringify(payload),
//     })
//     return res.json()
//   },

//   getAdminInstructors: async () => {
//     const res = await fetch(`${API_BASE_URL}/api/admin/instructors`, {
//       method: 'GET',
//       headers: getAuthHeaders(),
//     })
//     return res.json()
//   },

//   createInstructor: async (payload: {
//     name: string
//     email: string
//     specialty: string
//     role?: string
//   }) => {
//     const res = await fetch(`${API_BASE_URL}/api/admin/instructors`, {
//       method: 'POST',
//       headers: getAuthHeaders(),
//       body: JSON.stringify(payload),
//     })
//     return res.json()
//   },

//   updateInstructor: async (
//     id: string,
//     payload: {
//       name?: string
//       email?: string
//       specialty?: string
//       role?: string
//     },
//   ) => {
//     const res = await fetch(`${API_BASE_URL}/api/admin/instructors/${id}`, {
//       method: 'PUT',
//       headers: getAuthHeaders(),
//       body: JSON.stringify(payload),
//     })
//     return res.json()
//   },

//   deleteInstructor: async (id: string) => {
//     const res = await fetch(`${API_BASE_URL}/api/admin/instructors/${id}`, {
//       method: 'DELETE',
//       headers: getAuthHeaders(),
//     })
//     return res.json()
//   },

//   getAdminReports: async () => {
//     const res = await fetch(`${API_BASE_URL}/api/admin/reports`, {
//       method: 'GET',
//       headers: getAuthHeaders(),
//     })
//     return res.json()
//   },

//   getAdminSettings: async () => {
//     const res = await fetch(`${API_BASE_URL}/api/admin/settings`, {
//       method: 'GET',
//       headers: getAuthHeaders(),
//     })
//     return res.json()
//   },
//   manualOnboardStudent: async (payload: {
//     firstName: string
//     middleName?: string
//     lastName: string
//     country?: string
//     phone?: string
//     email: string
//     course: string
//     amountPaid: number
//     password?: string
//     referredBy?: string
//     reason?: string
//   }) => {
//     const res = await fetch(
//       `${API_BASE_URL}/api/admin/enrollments/manual-onboard`,
//       {
//         method: 'POST',
//         headers: getAuthHeaders(),
//         body: JSON.stringify(payload),
//       },
//     )
//     return res.json()
//   },

//   // --- 6. Scholarship Enrollment & Auth ---
//   getActiveScholarshipCohorts: async () => {
//     const res = await fetch(
//       `${API_BASE_URL}/api/scholarship/enrollment/cohorts/active`,
//       {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json', accept: '*/*' },
//       },
//     )
//     return res.json()
//   },

//   submitScholarshipApplication: async (payload: {
//     cohortId: string
//     firstName: string
//     lastName: string
//     email: string
//     phone: string
//     course: string
//     statement: string
//     country?: string
//     educationalBackground?: string
//     technicalBackground?: string
//     reasonForApplying?: string
//     motivation?: string
//     portfolioUrl?: string
//   }) => {
//     const res = await fetch(
//       `${API_BASE_URL}/api/scholarship/enrollment/apply`,
//       {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', accept: '*/*' },
//         body: JSON.stringify(payload),
//       },
//     )
//     return res.json()
//   },

//   getScholarshipStatus: async (email: string) => {
//     const res = await fetch(
//       `${API_BASE_URL}/api/scholarship/enrollment/status?email=${encodeURIComponent(email)}`,
//       {
//         method: 'GET',
//         headers: { accept: '*/*' },
//       },
//     )
//     return res.json()
//   },

//   initializeScholarshipPayment: async (payload: { applicationId: string }) => {
//     const res = await fetch(
//       `${API_BASE_URL}/api/scholarship/enrollment/payment/initialize`,
//       {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', accept: '*/*' },
//         body: JSON.stringify(payload),
//       },
//     )
//     return res.json()
//   },

//   verifyScholarshipPayment: async (payload: { reference: string }) => {
//     const res = await fetch(
//       `${API_BASE_URL}/api/scholarship/enrollment/payment/verify`,
//       {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', accept: '*/*' },
//         body: JSON.stringify(payload),
//       },
//     )
//     return res.json()
//   },

//   claimScholarship: async (payload: {
//     applicationId: string
//     password: string
//   }) => {
//     const res = await fetch(
//       `${API_BASE_URL}/api/scholarship/enrollment/claim`,
//       {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', accept: '*/*' },
//         body: JSON.stringify(payload),
//       },
//     )
//     return res.json()
//   },

//   signupScholarship: async (payload: {
//     name: string
//     email: string
//     password: string
//     cohort_id: number
//   }) => {
//     const res = await fetch(`${API_BASE_URL}/api/scholarship/auth/signup`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json', accept: '*/*' },
//       body: JSON.stringify(payload),
//     })
//     return res.json()
//   },

//   signinScholarship: async (payload: { email: string; password: string }) => {
//     const res = await fetch(`${API_BASE_URL}/api/scholarship/auth/login`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json', accept: '*/*' },
//       body: JSON.stringify(payload),
//     })
//     const data = await res.json()
//     if (res.ok && (data.token || data.accessToken)) {
//       localStorage.setItem('denskill_token', data.token || data.accessToken)
//     }
//     return data
//   },
// }



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
    return res.json()
  },

  getAdminStudents: async () => {
    const res = await fetch(`${API_BASE_URL}/api/admin/students`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    return res.json()
  },

  updateStudentStatus: async (userId: string, status: 'active' | 'frozen') => {
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

  deleteStudent: async (userId: string) => {
    const res = await fetch(`${API_BASE_URL}/api/admin/students/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    return res.json()
  },

  getAdminPayments: async () => {
    const res = await fetch(`${API_BASE_URL}/api/admin/payments`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    return res.json()
  },

  getAdminCourses: async () => {
    const res = await fetch(`${API_BASE_URL}/api/admin/courses`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    return res.json()
  },

  assignTutor: async (courseId: string, tutorId: string) => {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/courses/${courseId}/assign-tutor`,
      {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ tutorId }),
      },
    )
    return res.json()
  },

  getAdminAnnouncements: async () => {
    const res = await fetch(`${API_BASE_URL}/api/admin/announcements`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    return res.json()
  },

  createAnnouncement: async (payload: { title: string; content: string }) => {
    const res = await fetch(`${API_BASE_URL}/api/admin/announcements`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    })
    return res.json()
  },

  getAdminInstructors: async () => {
    const res = await fetch(`${API_BASE_URL}/api/admin/instructors`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    return res.json()
  },

  createInstructor: async (payload: {
    name: string
    email: string
    specialty: string
    role?: string
  }) => {
    const res = await fetch(`${API_BASE_URL}/api/admin/instructors`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    })
    return res.json()
  },

  updateInstructor: async (
    id: string,
    payload: {
      name?: string
      email?: string
      specialty?: string
      role?: string
    },
  ) => {
    const res = await fetch(`${API_BASE_URL}/api/admin/instructors/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    })
    return res.json()
  },

  deleteInstructor: async (id: string) => {
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
    return res.json()
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
    return res.json()
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
}