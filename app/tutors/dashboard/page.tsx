// // src/app/tutors/dashboard/page.tsx
// 'use client'

// import { useState, useEffect } from 'react'
// import {
//   BookOpen,
//   Users,
//   Video,
//   FileText,
//   TrendingUp,
//   CheckSquare,
//   ArrowRight,
//   Loader2,
//   Calendar,
// } from 'lucide-react'
// import { apiClient } from '@/services/api'

// export default function TutorDashboardPage() {
//   const [assignedCourses, setAssignedCourses] = useState<any[]>([])
//   const [courseId, setCourseId] = useState<string>('')
//   const [isLoadingCourses, setIsLoadingCourses] = useState(true)
//   const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false)
//   const [analytics, setAnalytics] = useState<any>(null)
//   const [errorMsg, setErrorMsg] = useState<string | null>(null)

//   // 1. Fetch assigned courses on mount
//   useEffect(() => {
//     const fetchTutorCourses = async () => {
//       setIsLoadingCourses(true)
//       setErrorMsg(null)
//       try {
//         const res = await apiClient.getTutorAssignedCourses()
//         const courses = res?.data || res?.courses || res || []
//         const courseList = Array.isArray(courses) ? courses : []

//         setAssignedCourses(courseList)

//         if (courseList.length > 0) {
//           const firstId =
//             courseList[0].id || courseList[0]._id || courseList[0].course
//           setCourseId(String(firstId))
//         } else {
//           setErrorMsg('None available')
//         }
//       } catch (err: any) {
//         setErrorMsg(err.message || 'None available')
//         setAssignedCourses([])
//       } finally {
//         setIsLoadingCourses(false)
//       }
//     }

//     fetchTutorCourses()
//   }, [])

//   // 2. Fetch live analytics whenever active courseId changes
//   useEffect(() => {
//     if (!courseId) return

//     const fetchDashboardData = async () => {
//       setIsLoadingAnalytics(true)
//       try {
//         const res = await apiClient.getCourseAnalytics(courseId)
//         setAnalytics(res?.data || res || null)
//       } catch (err) {
//         setAnalytics(null)
//       } finally {
//         setIsLoadingAnalytics(false)
//       }
//     }

//     fetchDashboardData()
//   }, [courseId])

//   const quickLinks = [
//     {
//       title: 'Manage Assessments & Grading',
//       desc: 'Create quizzes, assign grades, and submit code reviews.',
//       icon: <FileText className='text-primary-purple' size={24} />,
//       href: '/tutors/assessments',
//     },
//     {
//       title: 'Course Modules & Resources',
//       desc: 'Upload weekly lectures, reading notes, and resource links.',
//       icon: <BookOpen className='text-blue-500' size={24} />,
//       href: '/tutors/modules',
//     },
//     {
//       title: 'Live Lecture Sessions',
//       desc: 'Schedule Zoom/Meet office hours and view past session logs.',
//       icon: <Video className='text-emerald-500' size={24} />,
//       href: '/tutors/sessions',
//     },
//     {
//       title: 'Student Roster & Attendance',
//       desc: 'View enrolled cohort students and log daily attendance.',
//       icon: <Users className='text-amber-500' size={24} />,
//       href: '/tutors/roster',
//     },
//   ]

//   return (
//     <div className='space-y-6 animate-fadeIn'>
//       <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
//         <div>
//           <h1 className='text-2xl font-bold text-dark dark:text-white'>
//             Instructor Dashboard
//           </h1>
//           <p className='text-sm text-gray-500'>
//             Welcome back! Here is an overview of your active cohort engagement
//             and grading queues.
//           </p>
//         </div>

//         {/* Dynamic Assigned Courses Dropdown */}
//         <div className='flex items-center gap-2'>
//           <span className='text-xs font-semibold text-gray-500'>
//             Active Course:
//           </span>
//           {isLoadingCourses ? (
//             <div className='flex items-center gap-2 text-xs text-gray-400 p-2'>
//               <Loader2 size={16} className='animate-spin' /> Loading...
//             </div>
//           ) : (
//             <select
//               value={courseId}
//               onChange={(e) => setCourseId(e.target.value)}
//               className='p-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs font-medium text-dark dark:text-white focus:outline-none cursor-pointer'
//             >
//               {assignedCourses.length === 0 ? (
//                 <option value=''>None available</option>
//               ) : (
//                 assignedCourses.map((course) => {
//                   const cId = course.id || course._id || course.course
//                   const cName = course.name || course.title || course.course
//                   return (
//                     <option key={cId} value={cId}>
//                       {cName}
//                     </option>
//                   )
//                 })
//               )}
//             </select>
//           )}
//         </div>
//       </div>

//       {errorMsg && assignedCourses.length === 0 && (
//         <div className='p-4 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs rounded-xl font-medium'>
//           {errorMsg}
//         </div>
//       )}

//       {/* Analytics Summary Cards */}
//       <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
//         <div className='bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-2'>
//           <div className='flex items-center justify-between text-gray-500 text-xs font-semibold'>
//             <span>Enrolled Students</span>
//             <Users size={16} className='text-primary-purple' />
//           </div>
//           <div className='text-2xl font-bold text-dark dark:text-white'>
//             {isLoadingAnalytics ? (
//               <Loader2 size={20} className='animate-spin text-primary-purple' />
//             ) : (
//               (analytics?.total_students ?? analytics?.totalStudents ?? '0')
//             )}
//           </div>
//           <p className='text-[11px] text-gray-400 font-medium'>
//             Active cohort count
//           </p>
//         </div>

//         <div className='bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-2'>
//           <div className='flex items-center justify-between text-gray-500 text-xs font-semibold'>
//             <span>Average Class Grade</span>
//             <TrendingUp size={16} className='text-emerald-500' />
//           </div>
//           <div className='text-2xl font-bold text-dark dark:text-white'>
//             {isLoadingAnalytics ? (
//               <Loader2 size={20} className='animate-spin text-primary-purple' />
//             ) : (
//               `${analytics?.average_grade ?? analytics?.averageGrade ?? '0'}%`
//             )}
//           </div>
//           <p className='text-[11px] text-gray-400'>
//             Based on published assessments
//           </p>
//         </div>

//         <div className='bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-2'>
//           <div className='flex items-center justify-between text-gray-500 text-xs font-semibold'>
//             <span>Pending Submissions</span>
//             <CheckSquare size={16} className='text-amber-500' />
//           </div>
//           <div className='text-2xl font-bold text-dark dark:text-white'>
//             {isLoadingAnalytics ? (
//               <Loader2 size={20} className='animate-spin text-primary-purple' />
//             ) : (
//               (analytics?.pending_submissions ??
//               analytics?.pendingSubmissions ??
//               '0')
//             )}
//           </div>
//           <p className='text-[11px] text-amber-500 font-medium'>
//             Requires grading review
//           </p>
//         </div>

//         <div className='bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-2'>
//           <div className='flex items-center justify-between text-gray-500 text-xs font-semibold'>
//             <span>Upcoming Live Sessions</span>
//             <Calendar size={16} className='text-blue-500' />
//           </div>
//           <div className='text-2xl font-bold text-dark dark:text-white'>
//             {isLoadingAnalytics ? (
//               <Loader2 size={20} className='animate-spin text-primary-purple' />
//             ) : (
//               (analytics?.upcoming_sessions ??
//               analytics?.upcomingSessions ??
//               '0')
//             )}
//           </div>
//           <p className='text-[11px] text-blue-500 font-medium'>
//             Scheduled workshop streams
//           </p>
//         </div>
//       </div>

//       {/* Navigation Quick Links Grid */}
//       <div className='grid grid-cols-1 md:grid-cols-2 gap-6 pt-4'>
//         {quickLinks.map((link, idx) => (
//           <a
//             key={idx}
//             href={link.href}
//             className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-primary-purple/50 dark:hover:border-primary-purple/50 shadow-sm transition flex items-start justify-between group cursor-pointer'
//           >
//             <div className='flex items-start gap-4'>
//               <div className='p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50'>
//                 {link.icon}
//               </div>
//               <div className='space-y-1'>
//                 <h3 className='text-base font-bold text-dark dark:text-white group-hover:text-primary-purple transition'>
//                   {link.title}
//                 </h3>
//                 <p className='text-xs text-gray-500 max-w-sm'>{link.desc}</p>
//               </div>
//             </div>
//             <ArrowRight
//               size={18}
//               className='text-gray-400 group-hover:text-primary-purple group-hover:translate-x-1 transition'
//             />
//           </a>
//         ))}
//       </div>
//     </div>
//   )
// }



// src/app/tutors/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import {
  BookOpen,
  Users,
  Video,
  FileText,
  TrendingUp,
  CheckSquare,
  ArrowRight,
  Loader2,
  Calendar,
  AlertCircle,
} from 'lucide-react'
import { apiClient } from '@/services/api'

interface TutorCourse {
  id: string | number
  name?: string
  title?: string
  course_name?: string
  code?: string
}

interface CourseAnalytics {
  total_students?: number
  totalStudents?: number
  average_grade?: number
  averageGrade?: number
  pending_submissions?: number
  pendingSubmissions?: number
  upcoming_sessions?: number
  upcomingSessions?: number
}

export default function TutorDashboardPage() {
  const [assignedCourses, setAssignedCourses] = useState<TutorCourse[]>([])
  const [courseId, setCourseId] = useState<string>('')

  const [analytics, setAnalytics] =
    useState<CourseAnalytics | null>(null)

  const [isLoadingCourses, setIsLoadingCourses] = useState(true)
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false)

  const [courseError, setCourseError] = useState<string | null>(null)
  const [analyticsError, setAnalyticsError] =
    useState<string | null>(null)

  /*
   * ==========================================
   * FETCH TUTOR'S ASSIGNED COURSES
   * ==========================================
   */
  useEffect(() => {
    const fetchTutorCourses = async () => {
      setIsLoadingCourses(true)
      setCourseError(null)

      try {
        const res = await apiClient.getTutorAssignedCourses()

        const courseList =
          Array.isArray(res)
            ? res
            : res?.courses ||
              res?.data?.courses ||
              res?.data ||
              []

        if (!Array.isArray(courseList)) {
          throw new Error('Invalid courses response from API.')
        }

        setAssignedCourses(courseList)

        /*
         * Automatically select the first real course
         * returned by the backend.
         */
        if (courseList.length > 0) {
          const firstCourse = courseList[0]

          if (
            firstCourse?.id !== undefined &&
            firstCourse?.id !== null
          ) {
            setCourseId(String(firstCourse.id))
          } else {
            setCourseId('')
            setCourseError(
              'Assigned courses were returned without valid course IDs.',
            )
          }
        } else {
          setCourseId('')
          setCourseError(
            'No courses have been assigned to your tutor account.',
          )
        }
      } catch (err: any) {
        setAssignedCourses([])
        setCourseId('')
        setAnalytics(null)

        setCourseError(
          err?.message ||
            'Failed to load your assigned courses.',
        )
      } finally {
        setIsLoadingCourses(false)
      }
    }

    fetchTutorCourses()
  }, [])

  /*
   * ==========================================
   * FETCH COURSE ANALYTICS
   * ==========================================
   */
  useEffect(() => {
    if (!courseId) {
      setAnalytics(null)
      setAnalyticsError(null)
      return
    }

    const fetchDashboardData = async () => {
      setIsLoadingAnalytics(true)
      setAnalyticsError(null)
      setAnalytics(null)

      try {
        const res = await apiClient.getCourseAnalytics(courseId)

        const data =
          res?.stats ||
          res?.data?.stats ||
          res?.data ||
          res

        if (!data || typeof data !== 'object') {
          throw new Error(
            'Invalid analytics response from API.',
          )
        }

        setAnalytics(data)
      } catch (err: any) {
        setAnalytics(null)

        setAnalyticsError(
          err?.message ||
            'Failed to load analytics for this course.',
        )
      } finally {
        setIsLoadingAnalytics(false)
      }
    }

    fetchDashboardData()
  }, [courseId])

  /*
   * ==========================================
   * HELPERS
   * ==========================================
   */
  const getCourseName = (course: TutorCourse) => {
    return (
      course.name ||
      course.title ||
      course.course_name ||
      course.code ||
      `Course ${course.id}`
    )
  }

  const getAnalyticsValue = (
    snakeCaseValue: number | undefined,
    camelCaseValue: number | undefined,
  ) => {
    if (snakeCaseValue !== undefined && snakeCaseValue !== null) {
      return snakeCaseValue
    }

    if (
      camelCaseValue !== undefined &&
      camelCaseValue !== null
    ) {
      return camelCaseValue
    }

    return null
  }

  /*
   * ==========================================
   * QUICK NAVIGATION
   * ==========================================
   *
   * These are application routes, not database data.
   * They are intentionally static because they represent
   * frontend navigation rather than course/student data.
   */
  const quickLinks = [
    {
      title: 'Manage Assessments & Grading',
      desc: 'Create quizzes, assign grades, and submit code reviews.',
      icon: <FileText className='text-primary-purple' size={24} />,
      href: '/tutors/assessments',
    },
    {
      title: 'Course Modules & Resources',
      desc: 'Upload weekly lectures, reading notes, and resource links.',
      icon: <BookOpen className='text-blue-500' size={24} />,
      href: '/tutors/modules',
    },
    {
      title: 'Live Lecture Sessions',
      desc: 'Schedule live sessions and view previous session records.',
      icon: <Video className='text-emerald-500' size={24} />,
      href: '/tutors/sessions',
    },
    {
      title: 'Student Roster & Attendance',
      desc: 'View enrolled students and manage daily attendance.',
      icon: <Users className='text-amber-500' size={24} />,
      href: '/tutors/attendance',
    },
  ]

  const totalStudents = getAnalyticsValue(
    analytics?.total_students,
    analytics?.totalStudents,
  )

  const averageGrade = getAnalyticsValue(
    analytics?.average_grade,
    analytics?.averageGrade,
  )

  const pendingSubmissions = getAnalyticsValue(
    analytics?.pending_submissions,
    analytics?.pendingSubmissions,
  )

  const upcomingSessions = getAnalyticsValue(
    analytics?.upcoming_sessions,
    analytics?.upcomingSessions,
  )

  return (
    <div className='space-y-6 animate-fadeIn'>
      {/* ==========================================
          HEADER
          ========================================== */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-dark dark:text-white'>
            Instructor Dashboard
          </h1>

          <p className='text-sm text-gray-500'>
            Overview of your assigned courses, student engagement,
            and grading activity.
          </p>
        </div>

        {/* Dynamic Assigned Courses */}
        <div className='flex items-center gap-2'>
          <span className='text-xs font-semibold text-gray-500'>
            Active Course:
          </span>

          {isLoadingCourses ? (
            <div className='flex items-center gap-2 text-xs text-gray-400 p-2'>
              <Loader2
                size={16}
                className='animate-spin'
              />
              Loading courses...
            </div>
          ) : assignedCourses.length === 0 ? (
            <span className='text-xs text-gray-400'>
              No assigned courses
            </span>
          ) : (
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className='p-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs font-medium text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-purple cursor-pointer'
            >
              {assignedCourses.map((course) => (
                <option
                  key={course.id}
                  value={String(course.id)}
                >
                  {getCourseName(course)}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Course Error */}
      {courseError && (
        <div className='p-4 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs rounded-xl font-medium flex items-center gap-2'>
          <AlertCircle size={16} />
          {courseError}
        </div>
      )}

      {/* Analytics Error */}
      {analyticsError && (
        <div className='p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded-xl font-medium flex items-center gap-2'>
          <AlertCircle size={16} />
          {analyticsError}
        </div>
      )}

      {/* ==========================================
          ANALYTICS SUMMARY CARDS
          ========================================== */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {/* Enrolled Students */}
        <div className='bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-2'>
          <div className='flex items-center justify-between text-gray-500 text-xs font-semibold'>
            <span>Enrolled Students</span>
            <Users
              size={16}
              className='text-primary-purple'
            />
          </div>

          <div className='text-2xl font-bold text-dark dark:text-white'>
            {isLoadingAnalytics ? (
              <Loader2
                size={20}
                className='animate-spin text-primary-purple'
              />
            ) : totalStudents !== null ? (
              totalStudents
            ) : (
              '—'
            )}
          </div>

          <p className='text-[11px] text-gray-400 font-medium'>
            Active cohort count
          </p>
        </div>

        {/* Average Grade */}
        <div className='bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-2'>
          <div className='flex items-center justify-between text-gray-500 text-xs font-semibold'>
            <span>Average Class Grade</span>
            <TrendingUp
              size={16}
              className='text-emerald-500'
            />
          </div>

          <div className='text-2xl font-bold text-dark dark:text-white'>
            {isLoadingAnalytics ? (
              <Loader2
                size={20}
                className='animate-spin text-primary-purple'
              />
            ) : averageGrade !== null ? (
              `${averageGrade}%`
            ) : (
              '—'
            )}
          </div>

          <p className='text-[11px] text-gray-400'>
            Based on published assessments
          </p>
        </div>

        {/* Pending Submissions */}
        <div className='bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-2'>
          <div className='flex items-center justify-between text-gray-500 text-xs font-semibold'>
            <span>Pending Submissions</span>

            <CheckSquare
              size={16}
              className='text-amber-500'
            />
          </div>

          <div className='text-2xl font-bold text-dark dark:text-white'>
            {isLoadingAnalytics ? (
              <Loader2
                size={20}
                className='animate-spin text-primary-purple'
              />
            ) : pendingSubmissions !== null ? (
              pendingSubmissions
            ) : (
              '—'
            )}
          </div>

          <p className='text-[11px] text-amber-500 font-medium'>
            Requires grading review
          </p>
        </div>

        {/* Upcoming Sessions */}
        <div className='bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-2'>
          <div className='flex items-center justify-between text-gray-500 text-xs font-semibold'>
            <span>Upcoming Live Sessions</span>

            <Calendar
              size={16}
              className='text-blue-500'
            />
          </div>

          <div className='text-2xl font-bold text-dark dark:text-white'>
            {isLoadingAnalytics ? (
              <Loader2
                size={20}
                className='animate-spin text-primary-purple'
              />
            ) : upcomingSessions !== null ? (
              upcomingSessions
            ) : (
              '—'
            )}
          </div>

          <p className='text-[11px] text-blue-500 font-medium'>
            Scheduled workshop streams
          </p>
        </div>
      </div>

      {/* ==========================================
          QUICK LINKS
          ========================================== */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 pt-4'>
        {quickLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-primary-purple/50 dark:hover:border-primary-purple/50 shadow-sm transition flex items-start justify-between group cursor-pointer'
          >
            <div className='flex items-start gap-4'>
              <div className='p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50'>
                {link.icon}
              </div>

              <div className='space-y-1'>
                <h3 className='text-base font-bold text-dark dark:text-white group-hover:text-primary-purple transition'>
                  {link.title}
                </h3>

                <p className='text-xs text-gray-500 max-w-sm'>
                  {link.desc}
                </p>
              </div>
            </div>

            <ArrowRight
              size={18}
              className='text-gray-400 group-hover:text-primary-purple group-hover:translate-x-1 transition'
            />
          </a>
        ))}
      </div>
    </div>
  )
}