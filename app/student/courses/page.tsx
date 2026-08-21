// 'use client'
// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import {
//   BookOpen,
//   CheckCircle,
//   Clock,
//   Loader2,
//   UserCheck,
//   Calendar,
// } from 'lucide-react'
// import { apiClient } from '@/services/api'

// interface CourseItem {
//   id?: string | number
//   course: string
//   payment_status: string
//   expires_at: string
//   created_at: string
//   course_title?: string | null
//   course_description?: string | null
//   tutor_name?: string | null
//   tutor_email?: string | null
// }

// export default function StudentCoursesPage() {
//   const router = useRouter()
//   const [profile, setProfile] = useState<any>(null)
//   const [courses, setCourses] = useState<CourseItem[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     const loggedIn = sessionStorage.getItem('isLoggedIn')
//     const token =
//       typeof window !== 'undefined'
//         ? localStorage.getItem('denskill_token')
//         : null
//     const data = sessionStorage.getItem('pendingRegistration')

//     if (!loggedIn && !token) {
//       router.push('/auth/login')
//       return
//     }

//     if (data) {
//       try {
//         setProfile(JSON.parse(data))
//       } catch (e) {
//         setProfile({ firstName: 'Scholar' })
//       }
//     } else {
//       setProfile({ firstName: 'Scholar' })
//     }

//     const fetchCourses = async () => {
//       try {
//         const response = apiClient.getCourses
//           ? await apiClient.getCourses()
//           : null

//         const dataList = Array.isArray(response)
//           ? response
//           : response?.courses || response?.modules || response?.data || []

//         if (dataList.length > 0) {
//           setCourses(dataList)
//         }
//       } catch (err: any) {
//         setError(err.message || 'Failed to load enrolled courses from server.')
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchCourses()
//   }, [router])

//   return (
//     <div className='p-6 md:p-12 space-y-6 max-w-5xl mx-auto'>
//       <div>
//         <h1 className='text-2xl font-bold text-dark dark:text-white'>
//           My Enrolled Courses & Tutors
//         </h1>
//         <p className='text-xs text-gray-500 mt-1'>
//           View your registered programs and assigned professional mentors.
//         </p>
//       </div>

//       {error && (
//         <div className='p-3 bg-red-500/10 border border-red-500 text-red-600 text-sm rounded-lg font-medium'>
//           {error}
//         </div>
//       )}

//       {isLoading ? (
//         <div className='space-y-4 animate-pulse'>
//           {[1, 2].map((item) => (
//             <div
//               key={item}
//               className='p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-4 shadow-sm'
//             >
//               <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-4 dark:border-gray-800'>
//                 <div className='space-y-2'>
//                   <div className='h-3 w-28 bg-gray-200 dark:bg-gray-800 rounded'></div>
//                   <div className='h-6 w-56 bg-gray-200 dark:bg-gray-800 rounded'></div>
//                   <div className='h-3 w-40 bg-gray-200 dark:bg-gray-800 rounded'></div>
//                 </div>
//                 <div className='h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded-full'></div>
//               </div>

//               <div className='h-4 w-full bg-gray-200 dark:bg-gray-800 rounded'></div>

//               <div className='grid grid-cols-1 md:grid-cols-2 gap-4 pt-2'>
//                 {[1, 2].map((card) => (
//                   <div
//                     key={card}
//                     className='p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 space-y-2'
//                   >
//                     <div className='h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded'></div>
//                     <div className='h-5 w-48 bg-gray-200 dark:bg-gray-800 rounded'></div>
//                     <div className='h-3 w-32 bg-gray-200 dark:bg-gray-800 rounded'></div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : courses.length === 0 ? (
//         <div className='p-8 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 text-gray-500 text-xs'>
//           No enrolled courses available at this time.
//         </div>
//       ) : (
//         <div className='space-y-4'>
//           {courses.map((item, idx) => (
//             <div
//               key={item.id || idx}
//               className='p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-4 shadow-sm'
//             >
//               <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-4 dark:border-gray-800'>
//                 <div className='space-y-1'>
//                   <span className='text-[10px] uppercase tracking-wider font-bold text-primary-purple'>
//                     Enrolled Program 0{idx + 1}
//                   </span>
//                   <h3 className='font-bold text-dark dark:text-white text-lg'>
//                     {item.course}
//                   </h3>
//                   {item.course_title && (
//                     <p className='text-xs text-gray-500 font-medium'>
//                       {item.course_title}
//                     </p>
//                   )}
//                 </div>
//                 <span
//                   className={`px-3 py-1 text-xs rounded-full font-semibold uppercase ${
//                     item.payment_status === 'partial'
//                       ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
//                       : 'bg-green-500/10 text-green-600 border border-green-500/20'
//                   }`}
//                 >
//                   {item.payment_status || 'Active'}
//                 </span>
//               </div>

//               {item.course_description && (
//                 <p className='text-xs text-gray-600 dark:text-gray-300'>
//                   {item.course_description}
//                 </p>
//               )}

//               <div className='grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs'>
//                 <div className='p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 space-y-1.5'>
//                   <span className='text-gray-400 font-semibold block uppercase tracking-wider text-[10px]'>
//                     Assigned Tutor
//                   </span>
//                   {item.tutor_name ? (
//                     <div className='flex items-center gap-2'>
//                       <UserCheck size={16} className='text-primary-purple' />
//                       <div>
//                         <p className='font-bold text-dark dark:text-white'>
//                           {item.tutor_name}
//                         </p>
//                         {item.tutor_email && (
//                           <p className='text-[11px] text-gray-400'>
//                             {item.tutor_email}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   ) : (
//                     <p className='text-gray-400 italic'>
//                       Instructor assignment in progress
//                     </p>
//                   )}
//                 </div>

//                 <div className='p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 space-y-1.5'>
//                   <span className='text-gray-400 font-semibold block uppercase tracking-wider text-[10px]'>
//                     Enrollment Schedule
//                   </span>
//                   <div className='flex items-center gap-2 text-gray-600 dark:text-gray-300'>
//                     <Calendar size={16} className='text-primary-purple' />
//                     <div>
//                       <p>
//                         Enrolled:{' '}
//                         <strong className='text-dark dark:text-white'>
//                           {new Date(item.created_at).toLocaleDateString()}
//                         </strong>
//                       </p>
//                       {item.expires_at && (
//                         <p className='text-[11px] text-gray-400'>
//                           Expires:{' '}
//                           {new Date(item.expires_at).toLocaleDateString()}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

//src/app/student/courses/page.tsx
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
  ChevronRight,
  FileText,
  Video,
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

  // State for interactive course details modal
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null)
  const [modules, setModules] = useState<any[]>([])
  const [sessions, setSessions] = useState<any[]>([])
  const [isDetailsLoading, setIsDetailsLoading] = useState(false)

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

  const handleOpenCourseDetails = async (course: CourseItem) => {
    if (!course.id) return
    setSelectedCourse(course)
    setIsDetailsLoading(true)
    try {
      const [modRes, sesRes] = await Promise.all([
        apiClient.fetchCourseModules
          ? apiClient.fetchCourseModules(String(course.id))
          : Promise.resolve([]),
        apiClient.getCourseSessions
          ? apiClient.getCourseSessions(String(course.id))
          : Promise.resolve([]),
      ])
      setModules(
        Array.isArray(modRes) ? modRes : modRes?.modules || modRes?.data || [],
      )
      setSessions(
        Array.isArray(sesRes) ? sesRes : sesRes?.sessions || sesRes?.data || [],
      )
    } catch (err) {
      console.error('Failed to load course details', err)
    } finally {
      setIsDetailsLoading(false)
    }
  }

  return (
    <div className='p-6 md:p-12 space-y-6 max-w-5xl mx-auto'>
      <div>
        <h1 className='text-2xl font-bold text-dark dark:text-white'>
          My Enrolled Courses & Tutors
        </h1>
        <p className='text-xs text-gray-500 mt-1'>
          View your registered programs, assigned professional mentors, and
          curriculum.
        </p>
      </div>

      {error && (
        <div className='p-3 bg-red-500/10 border border-red-500 text-red-600 text-sm rounded-lg font-medium'>
          {error}
        </div>
      )}

      {isLoading ? (
        <div className='space-y-4 animate-pulse'>
          {[1, 2].map((item) => (
            <div
              key={item}
              className='p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-4 shadow-sm'
            >
              <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-4 dark:border-gray-800'>
                <div className='space-y-2'>
                  <div className='h-3 w-28 bg-gray-200 dark:bg-gray-800 rounded'></div>
                  <div className='h-6 w-56 bg-gray-200 dark:bg-gray-800 rounded'></div>
                  <div className='h-3 w-40 bg-gray-200 dark:bg-gray-800 rounded'></div>
                </div>
                <div className='h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded-full'></div>
              </div>

              <div className='h-4 w-full bg-gray-200 dark:bg-gray-800 rounded'></div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 pt-2'>
                {[1, 2].map((card) => (
                  <div
                    key={card}
                    className='p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 space-y-2'
                  >
                    <div className='h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded'></div>
                    <div className='h-5 w-48 bg-gray-200 dark:bg-gray-800 rounded'></div>
                    <div className='h-3 w-32 bg-gray-200 dark:bg-gray-800 rounded'></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
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
                          {item.created_at
                            ? new Date(item.created_at).toLocaleDateString()
                            : 'N/A'}
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

              {/* Curriculum Action Button */}
              {item.id && (
                <div className='pt-2 flex justify-end'>
                  <button
                    onClick={() => handleOpenCourseDetails(item)}
                    className='inline-flex items-center gap-1.5 px-4 py-2 bg-primary-purple/10 text-primary-purple hover:bg-primary-purple/20 transition-all rounded-xl text-xs font-bold'
                  >
                    <span>View Curriculum & Sessions</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Course Modules & Sessions Modal */}
      {selectedCourse && (
        <div className='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4'>
          <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-6 shadow-xl'>
            <div className='flex items-center justify-between border-b pb-4 dark:border-gray-800'>
              <div>
                <span className='text-[10px] uppercase font-bold text-primary-purple tracking-wider'>
                  Course Overview
                </span>
                <h2 className='text-xl font-bold text-dark dark:text-white'>
                  {selectedCourse.course}
                </h2>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className='p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg text-xs font-bold'
              >
                ✕ Close
              </button>
            </div>

            {isDetailsLoading ? (
              <div className='flex justify-center items-center py-12'>
                <Loader2 className='w-6 h-6 animate-spin text-primary-purple' />
              </div>
            ) : (
              <div className='space-y-6 text-xs'>
                {/* Modules */}
                <div className='space-y-3'>
                  <h4 className='font-bold text-gray-400 uppercase tracking-wider text-[10px] flex items-center gap-1.5'>
                    <FileText size={14} /> Course Modules ({modules.length})
                  </h4>
                  {modules.length === 0 ? (
                    <p className='text-gray-400 italic p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl'>
                      No modules published yet.
                    </p>
                  ) : (
                    <div className='space-y-2'>
                      {modules.map((mod: any, i: number) => (
                        <div
                          key={i}
                          className='p-3.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-xl flex items-center justify-between'
                        >
                          <span className='font-semibold text-dark dark:text-white'>
                            {mod.title || mod.name || `Module ${i + 1}`}
                          </span>
                          <span className='text-[11px] text-gray-400'>
                            {mod.duration || 'Active'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sessions */}
                <div className='space-y-3'>
                  <h4 className='font-bold text-gray-400 uppercase tracking-wider text-[10px] flex items-center gap-1.5'>
                    <Video size={14} /> Live Sessions & Classes (
                    {sessions.length})
                  </h4>
                  {sessions.length === 0 ? (
                    <p className='text-gray-400 italic p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl'>
                      No sessions scheduled at the moment.
                    </p>
                  ) : (
                    <div className='space-y-2'>
                      {sessions.map((ses: any, i: number) => (
                        <div
                          key={i}
                          className='p-3.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-xl flex items-center justify-between'
                        >
                          <div>
                            <p className='font-semibold text-dark dark:text-white'>
                              {ses.title || `Class Session ${i + 1}`}
                            </p>
                            <p className='text-[10px] text-gray-400'>
                              {ses.date
                                ? new Date(ses.date).toLocaleString()
                                : 'TBD'}
                            </p>
                          </div>
                          {ses.link && (
                            <a
                              href={ses.link}
                              target='_blank'
                              rel='noreferrer'
                              className='px-3 py-1.5 bg-primary-purple text-white rounded-lg font-semibold hover:opacity-90'
                            >
                              Join
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}