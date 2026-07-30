// src/app/admin/students/page.tsx
'use client'
import { useState, useEffect } from 'react'
import {
  Search,
  Users,
  Mail,
  Phone,
  BookOpen,
  ShieldAlert,
  CheckCircle,
  Lock,
  Unlock,
  Trash2,
  Loader2,
  AlertCircle,
  GraduationCap,
} from 'lucide-react'

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'https://denskill-backend.onrender.com'

const getAuthHeaders = () => {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('token') || localStorage.getItem('denskill_token')
      : ''
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

const apiClient = {
  getAdminStudents: async () => {
    const res = await fetch(`${API_BASE_URL}/api/admin/students`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    return res.json()
  },

  updateStudentStatus: async (userId: string | number, status: 'active' | 'frozen') => {
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

  deleteStudent: async (userId: string | number) => {
    const res = await fetch(`${API_BASE_URL}/api/admin/students/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    return res.json()
  },
}

interface Student {
  id: string | number
  name: string
  email: string
  phone?: string
  course: string
  status: 'active' | 'frozen'
  joinedDate: string
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const fetchStudents = async () => {
    setIsLoading(true)
    setErrorMessage('')
    try {
      const response = await apiClient.getAdminStudents()
      
      // Extract array correctly from { status: 'success', students: [...] }
      const payload = response?.data || response
      const list = Array.isArray(payload)
        ? payload
        : payload?.students || payload?.data || []

      setStudents(
        list.map((st: any) => ({
          id: st.id ?? st._id ?? `STU-${Math.floor(Math.random() * 90000 + 10000)}`,
          name:
            st.name ||
            `${st.firstName || ''} ${st.lastName || ''}`.trim() ||
            'Academy Student',
          email: st.email || '',
          phone: st.phone || '+234 800 000 0000',
          course: st.course || st.program || 'Full-Stack Software Engineering',
          status: st.status === 'frozen' ? 'frozen' : 'active',
          joinedDate: st.created_at ? new Date(st.created_at).toLocaleDateString() : 'Jul 2026',
        })),
      )
    } catch (err: any) {
      setErrorMessage(
        err?.message || 'Failed to load students from the backend database.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const handleToggleStatus = async (
    id: string | number,
    currentStatus: 'active' | 'frozen',
  ) => {
    const newStatus = currentStatus === 'active' ? 'frozen' : 'active'
    try {
      await apiClient.updateStudentStatus(id, newStatus)
      setStudents((prev) =>
        prev.map((st) => (st.id === id ? { ...st, status: newStatus } : st)),
      )
    } catch (err: any) {
      alert(err?.message || 'Failed to update student account status.')
    }
  }

  const handleDeleteStudent = async (id: string | number) => {
    if (
      confirm(
        'Are you sure you want to completely remove this student account?',
      )
    ) {
      try {
        await apiClient.deleteStudent(id)
        setStudents((prev) => prev.filter((st) => st.id !== id))
      } catch (err: any) {
        alert(err?.message || 'Failed to delete student record.')
      }
    }
  }

  const filteredStudents = students.filter(
    (st) =>
      st.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.course.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className='space-y-6 animate-fadeIn'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h2 className='text-2xl font-bold text-dark dark:text-white'>
            Enrolled Students
          </h2>
          <p className='text-sm text-gray-500'>
            Manage active student portals, freeze accounts, or revoke
            registrations.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className='p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-medium'>
          <AlertCircle size={20} className='shrink-0' />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className='bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center justify-between shadow-sm'>
        <div className='relative w-full sm:w-80'>
          <Search className='absolute left-3.5 top-3 text-gray-400' size={16} />
          <input
            type='text'
            placeholder='Search students by name, email, course...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-dark dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-purple'
          />
        </div>
      </div>

      {/* Students Table */}
      <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm'>
        {isLoading ? (
          <div className='h-64 flex items-center justify-center'>
            <Loader2 className='w-6 h-6 animate-spin text-primary-purple' />
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className='p-12 text-center space-y-2'>
            <Users size={32} className='mx-auto text-gray-400' />
            <p className='text-sm text-gray-500'>
              No student profiles registered in the database.
            </p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-left border-collapse'>
              <thead>
                <tr className='border-b border-gray-200 dark:border-gray-800 text-[11px] font-semibold text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-950/50'>
                  <th className='p-4'>Student Name</th>
                  <th className='p-4'>Contact Information</th>
                  <th className='p-4'>Program / Course</th>
                  <th className='p-4'>Status</th>
                  <th className='p-4 text-right'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100 dark:divide-gray-800 text-sm'>
                {filteredStudents.map((st) => (
                  <tr
                    key={st.id}
                    className='hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition'
                  >
                    <td className='p-4 font-semibold text-dark dark:text-white flex items-center gap-3'>
                      <div className='w-9 h-9 rounded-full bg-primary-purple/10 text-primary-purple font-bold flex items-center justify-center text-xs shrink-0'>
                        {st.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                      <div>
                        <p>{st.name}</p>
                        <span className='text-[11px] text-gray-400 font-mono'>
                          ID: {st.id}
                        </span>
                      </div>
                    </td>
                    <td className='p-4 space-y-0.5 text-xs text-gray-500'>
                      <div className='flex items-center gap-1.5'>
                        <Mail size={12} /> {st.email}
                      </div>
                      <div className='flex items-center gap-1.5'>
                        <Phone size={12} /> {st.phone}
                      </div>
                    </td>
                    <td className='p-4 text-dark dark:text-gray-300 font-medium text-xs'>
                      <div className='flex items-center gap-1.5'>
                        <BookOpen size={12} className='text-primary-purple' />{' '}
                        {st.course}
                      </div>
                    </td>
                    <td className='p-4'>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
                          st.status === 'active'
                            ? 'bg-green-500/10 text-green-600'
                            : 'bg-amber-500/10 text-amber-500'
                        }`}
                      >
                        {st.status === 'active' ? (
                          <CheckCircle size={12} />
                        ) : (
                          <ShieldAlert size={12} />
                        )}
                        {st.status.charAt(0).toUpperCase() + st.status.slice(1)}
                      </span>
                    </td>
                    <td className='p-4 text-right'>
                      <div className='flex items-center justify-end gap-2'>
                        <button
                          onClick={() => handleToggleStatus(st.id, st.status)}
                          title={
                            st.status === 'active'
                              ? 'Freeze Account'
                              : 'Activate Account'
                          }
                          className={`p-2 rounded-xl text-xs font-medium transition cursor-pointer border ${
                            st.status === 'active'
                              ? 'border-amber-500/20 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20'
                              : 'border-green-500/20 bg-green-500/10 text-green-600 hover:bg-green-500/20'
                          }`}
                        >
                          {st.status === 'active' ? (
                            <Lock size={14} />
                          ) : (
                            <Unlock size={14} />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(st.id)}
                          title='Delete Student Record'
                          className='p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 transition cursor-pointer border border-red-500/20'
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}