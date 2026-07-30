'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  BookOpen,
  CheckCircle,
  Clock,
  Loader2,
  UserCheck,
  Calendar,
} from 'lucide-react'
import { apiClient } from '@/services/api'

interface CourseItem {
  id?: string | number
  course: string
  payment_status: string
  expires_at: string
  created_at: string
  course_title?: string | null
  course_description?: string | null
  tutor_name?: string | null
  tutor_email?: string | null
}

export default function StudentCoursesPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [courses, setCourses] = useState<CourseItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loggedIn = sessionStorage.getItem('isLoggedIn')
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('denskill_token')
        : null
    const data = sessionStorage.getItem('pendingRegistration')

    if (!loggedIn && !token) {
      router.push('/auth/login')
      return
    }

    if (data) {
      try {
        setProfile(JSON.parse(data))
      } catch (e) {
        setProfile({ firstName: 'Scholar' })
      }
    } else {
      setProfile({ firstName: 'Scholar' })
    }

    const fetchCourses = async () => {
      try {
        const response = apiClient.getCourses
          ? await apiClient.getCourses()
          : null

        const dataList = Array.isArray(response)
          ? response
          : response?.courses || response?.modules || response?.data || []

        if (dataList.length > 0) {
          setCourses(dataList)
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load enrolled courses from server.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [router])

  return (
    <div className='p-6 md:p-12 space-y-6 max-w-5xl mx-auto'>
      <div>
        <h1 className='text-2xl font-bold text-dark dark:text-white'>
          My Enrolled Courses & Tutors
        </h1>
        <p className='text-xs text-gray-500 mt-1'>
          View your registered programs and assigned professional mentors.
        </p>
      </div>

      {error && (
        <div className='p-3 bg-red-500/10 border border-red-500 text-red-600 text-sm rounded-lg font-medium'>
          {error}
        </div>
      )}

      {isLoading ? (
        <div className='flex items-center justify-center py-16'>
          <Loader2 className='w-6 h-6 animate-spin text-primary-purple' />
        </div>
      ) : courses.length === 0 ? (
        <div className='p-8 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 text-gray-500 text-xs'>
          No enrolled courses available at this time.
        </div>
      ) : (
        <div className='space-y-4'>
          {courses.map((item, idx) => (
            <div
              key={item.id || idx}
              className='p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-4 shadow-sm'
            >
              <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-4 dark:border-gray-800'>
                <div className='space-y-1'>
                  <span className='text-[10px] uppercase tracking-wider font-bold text-primary-purple'>
                    Enrolled Program 0{idx + 1}
                  </span>
                  <h3 className='font-bold text-dark dark:text-white text-lg'>
                    {item.course}
                  </h3>
                  {item.course_title && (
                    <p className='text-xs text-gray-500 font-medium'>
                      {item.course_title}
                    </p>
                  )}
                </div>
                <span
                  className={`px-3 py-1 text-xs rounded-full font-semibold uppercase ${
                    item.payment_status === 'partial'
                      ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                      : 'bg-green-500/10 text-green-600 border border-green-500/20'
                  }`}
                >
                  {item.payment_status || 'Active'}
                </span>
              </div>

              {item.course_description && (
                <p className='text-xs text-gray-600 dark:text-gray-300'>
                  {item.course_description}
                </p>
              )}

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs'>
                <div className='p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 space-y-1.5'>
                  <span className='text-gray-400 font-semibold block uppercase tracking-wider text-[10px]'>
                    Assigned Tutor
                  </span>
                  {item.tutor_name ? (
                    <div className='flex items-center gap-2'>
                      <UserCheck size={16} className='text-primary-purple' />
                      <div>
                        <p className='font-bold text-dark dark:text-white'>
                          {item.tutor_name}
                        </p>
                        {item.tutor_email && (
                          <p className='text-[11px] text-gray-400'>
                            {item.tutor_email}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className='text-gray-400 italic'>
                      Instructor assignment in progress
                    </p>
                  )}
                </div>

                <div className='p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 space-y-1.5'>
                  <span className='text-gray-400 font-semibold block uppercase tracking-wider text-[10px]'>
                    Enrollment Schedule
                  </span>
                  <div className='flex items-center gap-2 text-gray-600 dark:text-gray-300'>
                    <Calendar size={16} className='text-primary-purple' />
                    <div>
                      <p>
                        Enrolled:{' '}
                        <strong className='text-dark dark:text-white'>
                          {new Date(item.created_at).toLocaleDateString()}
                        </strong>
                      </p>
                      {item.expires_at && (
                        <p className='text-[11px] text-gray-400'>
                          Expires:{' '}
                          {new Date(item.expires_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
