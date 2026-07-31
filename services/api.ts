const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://denskill-backend.onrender.com'

// Helper to get auth header
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

export const apiClient = {
  // --- 1. Enrollment & Payment Flow ---
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

  // --- 2. Authentication Flow ---
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

  // --- 3. Student Portal Dashboard ---
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

  // --- 4. Admin Authentication Flow ---
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

  // --- 5. Admin Management ---
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
}
