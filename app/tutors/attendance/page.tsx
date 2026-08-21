// src/app/tutors/attendance/page.tsx
'use client'

import { useState, useEffect } from 'react'
import {
  CalendarCheck,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Save,
  Users,
} from 'lucide-react'
import { apiClient } from '@/services/api'

export default function AttendancePage() {
  const [selectedCourse, setSelectedCourse] = useState('fullstack-dev')
  const [students, setStudents] = useState<any[]>([])
  const [attendanceStatus, setAttendanceStatus] = useState<
    Record<string, string>
  >({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Fetch roster when course changes
  useEffect(() => {
    const fetchRoster = async () => {
      setIsLoading(true)
      setErrorMessage('')
      try {
        const res = await apiClient.getCourseRoster(selectedCourse)
        const rosterList = res?.roster || res?.students || res?.data || []
        setStudents(rosterList)

        // Default all fetched students to 'present'
        const initialStatus: Record<string, string> = {}
        rosterList.forEach((student: any) => {
          const id = student.id || student.student_id
          initialStatus[id] = 'present'
        })
        setAttendanceStatus(initialStatus)
      } catch (err: any) {
        // Fallback mock students if API fails or offline
        const mockStudents = [
          {
            id: 1,
            first_name: 'Aiden',
            last_name: 'Vance',
            email: 'aiden@example.com',
          },
          {
            id: 2,
            first_name: 'Sophia',
            last_name: 'Martinez',
            email: 'sophia@example.com',
          },
          {
            id: 3,
            first_name: 'Liam',
            last_name: 'Johnson',
            email: 'liam@example.com',
          },
          {
            id: 4,
            first_name: 'Emma',
            last_name: 'Brown',
            email: 'emma@example.com',
          },
        ]
        setStudents(mockStudents)
        const initialStatus: Record<string, string> = {}
        mockStudents.forEach((s) => {
          initialStatus[s.id] = 'present'
        })
        setAttendanceStatus(initialStatus)
      } finally {
        setIsLoading(false)
      }
    }
    fetchRoster()
  }, [selectedCourse])

  const handleStatusChange = (studentId: string | number, status: string) => {
    setAttendanceStatus((prev) => ({
      ...prev,
      [studentId]: status,
    }))
  }

  const handleMarkAll = (status: string) => {
    const updated: Record<string, string> = {}
    students.forEach((s) => {
      const id = s.id || s.student_id
      updated[id] = status
    })
    setAttendanceStatus(updated)
  }

  const handleSubmitAttendance = async () => {
    setIsSubmitting(true)
    setSuccessMessage('')
    setErrorMessage('')

    try {
      const attendance_records = Object.entries(attendanceStatus).map(
        ([student_id, status]) => ({
          student_id,
          status,
        }),
      )

      await apiClient.logAttendance({
        course_id: selectedCourse,
        attendance_records,
      })

      setSuccessMessage('Attendance logged successfully for all students!')
      setTimeout(() => setSuccessMessage(''), 4000)
    } catch (err: any) {
      setErrorMessage(
        err?.message || 'Failed to submit attendance. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='space-y-6 animate-fadeIn'>
      {/* Header Banner */}
      <div className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <div className='space-y-1'>
          <div className='flex items-center gap-2 text-primary-purple'>
            <CalendarCheck size={22} />
            <span className='text-xs font-bold uppercase tracking-wider'>
              Session Tracker
            </span>
          </div>
          <h1 className='text-xl md:text-2xl font-extrabold text-dark dark:text-white'>
            Daily Attendance Logger
          </h1>
          <p className='text-xs text-gray-500'>
            Mark presence or absence for students enrolled in your active
            session.
          </p>
        </div>

        {/* Course Selector */}
        <div className='flex items-center gap-3 w-full md:w-auto'>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className='bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-dark dark:text-white text-xs font-semibold px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-purple cursor-pointer'
          >
            <option value='fullstack-dev'>Full-Stack Web Dev</option>
            <option value='backend-eng'>MERN Backend Engineering</option>
            <option value='mobile-flutter'>Mobile Dev (Flutter)</option>
          </select>
        </div>
      </div>

      {/* Success / Error Banners */}
      {successMessage && (
        <div className='p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-semibold flex items-center gap-2'>
          <CheckCircle2 size={16} /> {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className='p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-semibold flex items-center gap-2'>
          <AlertCircle size={16} /> {errorMessage}
        </div>
      )}

      {/* Attendance Table Card */}
      <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden'>
        <div className='p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between flex-wrap gap-4'>
          <div className='flex items-center gap-2'>
            <Users size={18} className='text-gray-400' />
            <h2 className='text-sm font-bold text-dark dark:text-white'>
              Roster List ({students.length} Students)
            </h2>
          </div>
          <div className='flex items-center gap-2 text-xs'>
            <button
              onClick={() => handleMarkAll('present')}
              className='px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold rounded-lg hover:bg-emerald-500/20 transition cursor-pointer'
            >
              Mark All Present
            </button>
            <button
              onClick={() => handleMarkAll('absent')}
              className='px-3 py-1.5 bg-red-500/10 text-red-600 dark:text-red-400 font-semibold rounded-lg hover:bg-red-500/20 transition cursor-pointer'
            >
              Mark All Absent
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className='h-48 flex items-center justify-center'>
            <Loader2 className='w-6 h-6 animate-spin text-primary-purple' />
          </div>
        ) : students.length === 0 ? (
          <div className='p-12 text-center text-gray-400 text-xs'>
            No students found enrolled in this course roster.
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-left border-collapse'>
              <thead>
                <tr className='bg-gray-50 dark:bg-gray-800/50 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800'>
                  <th className='p-4'>Student Name</th>
                  <th className='p-4'>Email Address</th>
                  <th className='p-4 text-center'>Status</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100 dark:divide-gray-800 text-xs'>
                {students.map((student) => {
                  const id = student.id || student.student_id
                  const firstName =
                    student.first_name || student.firstName || 'Student'
                  const lastName = student.last_name || student.lastName || ''
                  const email = student.email || 'N/A'
                  const currentStatus = attendanceStatus[id] || 'present'

                  return (
                    <tr
                      key={id}
                      className='hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition'
                    >
                      <td className='p-4 font-bold text-dark dark:text-white flex items-center gap-3'>
                        <div className='w-7 h-7 rounded-full bg-primary-purple/10 text-primary-purple flex items-center justify-center text-xs font-bold'>
                          {firstName[0]}
                        </div>
                        {firstName} {lastName}
                      </td>
                      <td className='p-4 text-gray-500'>{email}</td>
                      <td className='p-4 text-center'>
                        <div className='inline-flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl'>
                          <button
                            type='button'
                            onClick={() => handleStatusChange(id, 'present')}
                            className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${
                              currentStatus === 'present'
                                ? 'bg-emerald-500 text-white shadow-xs'
                                : 'text-gray-500 hover:text-dark dark:hover:text-white'
                            }`}
                          >
                            Present
                          </button>
                          <button
                            type='button'
                            onClick={() => handleStatusChange(id, 'absent')}
                            className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${
                              currentStatus === 'absent'
                                ? 'bg-red-500 text-white shadow-xs'
                                : 'text-gray-500 hover:text-dark dark:hover:text-white'
                            }`}
                          >
                            Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Submit Bar */}
        {!isLoading && students.length > 0 && (
          <div className='p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex justify-end'>
            <button
              onClick={handleSubmitAttendance}
              disabled={isSubmitting}
              className='bg-primary-purple text-white font-semibold px-6 py-2.5 rounded-xl text-xs hover:bg-primary-purple/90 transition shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50'
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='w-4 h-4 animate-spin' /> Submitting...
                </>
              ) : (
                <>
                  <Save size={16} /> Save Attendance Record
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
