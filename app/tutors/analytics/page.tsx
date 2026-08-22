// // src/app/tutors/analytics/page.tsx
// 'use client'

// import { useState, useEffect } from 'react'
// import {
//   BarChart3,
//   Users,
//   AlertTriangle,
//   Loader2,
//   TrendingUp,
//   Percent,
// } from 'lucide-react'
// import { apiClient } from '@/services/api'

// interface CohortStats {
//   total_students: number
//   average_grade: number
//   completion_rate: number
//   at_risk_students: number
// }

// interface StudentRecord {
//   id: string | number
//   name: string
//   email: string
//   attendance_rate: number
//   average_score: number
//   status: 'active' | 'at_risk' | 'exceling'
// }

// export default function TutorsAnalyticsPage() {
//   const [selectedCourse, setSelectedCourse] = useState('fullstack-dev')
//   const [isLoading, setIsLoading] = useState(true)
//   const [errorMsg, setErrorMsg] = useState<string | null>(null)

//   const [stats, setStats] = useState<CohortStats>({
//     total_students: 0,
//     average_grade: 0,
//     completion_rate: 0,
//     at_risk_students: 0,
//   })
//   const [students, setStudents] = useState<StudentRecord[]>([])

//   const fetchAnalytics = async () => {
//     setIsLoading(true)
//     setErrorMsg(null)
//     try {
//       const res = await apiClient.getCourseAnalytics(selectedCourse)
//       const data = res?.stats || res?.data?.stats || res?.data || res || {}

//       setStats({
//         total_students: data.total_students || 0,
//         average_grade: data.average_grade || 0,
//         completion_rate: data.completion_rate || 0,
//         at_risk_students: data.at_risk_students || 0,
//       })

//       const studentList = res?.students || res?.data?.students || []
//       setStudents(Array.isArray(studentList) ? studentList : [])
//     } catch (err: any) {
//       setErrorMsg(err.message || 'None available')
//       setStats({
//         total_students: 0,
//         average_grade: 0,
//         completion_rate: 0,
//         at_risk_students: 0,
//       })
//       setStudents([])
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchAnalytics()
//   }, [selectedCourse])

//   return (
//     <div className='space-y-6 animate-fadeIn'>
//       {/* Header Banner */}
//       <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm'>
//         <div>
//           <h1 className='text-xl md:text-2xl font-bold text-dark dark:text-white'>
//             Cohort Analytics & Performance
//           </h1>
//           <p className='text-xs text-gray-500'>
//             Monitor student engagement, attendance records, and grade distributions.
//           </p>
//         </div>
//         <select
//           value={selectedCourse}
//           onChange={(e) => setSelectedCourse(e.target.value)}
//           className='bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-dark dark:text-white text-xs font-semibold px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-purple cursor-pointer'
//         >
//           <option value='fullstack-dev'>Full-Stack Web Dev</option>
//           <option value='backend-eng'>MERN Backend Engineering</option>
//           <option value='mobile-flutter'>Mobile Dev (Flutter)</option>
//         </select>
//       </div>

//       {errorMsg && (
//         <div className='p-4 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs rounded-xl font-medium'>
//           {errorMsg}
//         </div>
//       )}

//       {isLoading ? (
//         <div className='h-64 flex items-center justify-center'>
//           <Loader2 className='w-6 h-6 animate-spin text-primary-purple' />
//         </div>
//       ) : (
//         <>
//           {/* Stats Overview Grid */}
//           <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
//             <div className='bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-2'>
//               <div className='flex items-center justify-between text-gray-500'>
//                 <span className='text-xs font-medium'>Total Enrolled</span>
//                 <Users size={18} className='text-primary-purple' />
//               </div>
//               <h3 className='text-2xl font-bold text-dark dark:text-white'>
//                 {stats.total_students}
//               </h3>
//               <p className='text-[10px] text-gray-400 font-semibold'>
//                 Active cohort count
//               </p>
//             </div>

//             <div className='bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-2'>
//               <div className='flex items-center justify-between text-gray-500'>
//                 <span className='text-xs font-medium'>Average Grade</span>
//                 <BarChart3 size={18} className='text-blue-500' />
//               </div>
//               <h3 className='text-2xl font-bold text-dark dark:text-white'>
//                 {stats.average_grade}%
//               </h3>
//               <p className='text-[10px] text-gray-400 font-semibold'>
//                 Across all published assessments
//               </p>
//             </div>

//             <div className='bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-2'>
//               <div className='flex items-center justify-between text-gray-500'>
//                 <span className='text-xs font-medium'>Completion Rate</span>
//                 <Percent size={18} className='text-emerald-500' />
//               </div>
//               <h3 className='text-2xl font-bold text-dark dark:text-white'>
//                 {stats.completion_rate}%
//               </h3>
//               <p className='text-[10px] text-gray-400 font-semibold'>
//                 On-time task submission
//               </p>
//             </div>

//             <div className='bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-2'>
//               <div className='flex items-center justify-between text-gray-500'>
//                 <span className='text-xs font-medium'>At-Risk Students</span>
//                 <AlertTriangle size={18} className='text-amber-500' />
//               </div>
//               <h3 className='text-2xl font-bold text-dark dark:text-white'>
//                 {stats.at_risk_students}
//               </h3>
//               <p className='text-[10px] text-gray-400 font-semibold'>
//                 Requires tutor intervention
//               </p>
//             </div>
//           </div>

//           {/* Student Performance Roster Table */}
//           <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden'>
//             <div className='p-5 border-b border-gray-100 dark:border-gray-800'>
//               <h3 className='text-base font-bold text-dark dark:text-white'>
//                 Student Performance Roster
//               </h3>
//               <p className='text-xs text-gray-500'>
//                 Individual breakdown of attendance and academic standing.
//               </p>
//             </div>
//             <div className='overflow-x-auto'>
//               {students.length === 0 ? (
//                 <div className='p-12 text-center text-xs text-gray-500'>
//                   None available
//                 </div>
//               ) : (
//                 <table className='w-full text-left text-xs'>
//                   <thead className='bg-gray-50 dark:bg-gray-950 text-gray-500 uppercase font-semibold border-b border-gray-200 dark:border-gray-800'>
//                     <tr>
//                       <th className='p-4'>Student Name</th>
//                       <th className='p-4'>Attendance Rate</th>
//                       <th className='p-4'>Average Score</th>
//                       <th className='p-4'>Standing Status</th>
//                     </tr>
//                   </thead>
//                   <tbody className='divide-y divide-gray-100 dark:divide-gray-800'>
//                     {students.map((student) => (
//                       <tr
//                         key={student.id}
//                         className='hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition'
//                       >
//                         <td className='p-4 font-medium text-dark dark:text-white'>
//                           {student.name}
//                           <span className='block text-[10px] text-gray-400 font-normal'>
//                             {student.email}
//                           </span>
//                         </td>
//                         <td className='p-4 font-medium'>
//                           {student.attendance_rate}%
//                         </td>
//                         <td className='p-4 font-medium'>
//                           {student.average_score}/100
//                         </td>
//                         <td className='p-4'>
//                           <span
//                             className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
//                               student.status === 'exceling'
//                                 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
//                                 : student.status === 'at_risk'
//                                 ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
//                                 : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
//                             }`}
//                           >
//                             {student.status?.replace('_', ' ') || 'Active'}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               )}
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   )
// }

'use client'

import { useState, useEffect } from 'react'
import {
  BarChart3,
  Users,
  AlertTriangle,
  Loader2,
  Percent,
  RefreshCw,
} from 'lucide-react'
import { apiClient } from '@/services/api'

interface Course {
  id: string | number
  title?: string
  name?: string
  course_name?: string
  code?: string
  course_code?: string
}

interface CohortStats {
  total_students: number
  average_grade: number
  completion_rate: number
  at_risk_students: number
}

interface StudentRecord {
  id: string | number
  name?: string
  first_name?: string
  last_name?: string
  email?: string
  attendance_rate?: number
  average_score?: number
  status?: 'active' | 'at_risk' | 'exceling' | string
}

export default function TutorsAnalyticsPage() {
  // ==========================================
  // COURSES
  // ==========================================

  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState<string>('')

  const [isLoadingCourses, setIsLoadingCourses] = useState(true)

  // ==========================================
  // ANALYTICS
  // ==========================================

  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const [stats, setStats] = useState<CohortStats>({
    total_students: 0,
    average_grade: 0,
    completion_rate: 0,
    at_risk_students: 0,
  })

  const [students, setStudents] = useState<StudentRecord[]>([])

  // ==========================================
  // RESPONSE NORMALIZER
  // ==========================================

  const extractList = <T,>(response: any, keys: string[] = []): T[] => {
    if (Array.isArray(response)) {
      return response
    }

    if (Array.isArray(response?.data)) {
      return response.data
    }

    for (const key of keys) {
      if (Array.isArray(response?.[key])) {
        return response[key]
      }
    }

    if (response?.data && typeof response.data === 'object') {
      for (const key of keys) {
        if (Array.isArray(response.data?.[key])) {
          return response.data[key]
        }
      }
    }

    return []
  }

  // ==========================================
  // COURSE NAME
  // ==========================================

  const getCourseName = (course: Course) => {
    return (
      course.title ||
      course.name ||
      course.course_name ||
      course.code ||
      course.course_code ||
      `Course ${course.id}`
    )
  }

  // ==========================================
  // RESET ANALYTICS
  // ==========================================

  const resetAnalytics = () => {
    setStats({
      total_students: 0,
      average_grade: 0,
      completion_rate: 0,
      at_risk_students: 0,
    })

    setStudents([])
  }

  // ==========================================
  // FETCH ASSIGNED COURSES
  // ==========================================

  const fetchAssignedCourses = async () => {
    setIsLoadingCourses(true)
    setErrorMsg(null)

    try {
      const response = await apiClient.getTutorAssignedCourses()

      const assignedCourses = extractList<Course>(response, [
        'courses',
        'assignedCourses',
      ])

      setCourses(assignedCourses)

      if (assignedCourses.length === 0) {
        setSelectedCourse('')
        resetAnalytics()
        return
      }

      /*
       * Keep the current selection if the course
       * still exists in the API response.
       *
       * Otherwise select the first real assigned course.
       */
      setSelectedCourse((currentCourse) => {
        const currentStillExists = assignedCourses.some(
          (course) => String(course.id) === String(currentCourse),
        )

        return currentStillExists
          ? currentCourse
          : String(assignedCourses[0].id)
      })
    } catch (error: any) {
      setCourses([])
      setSelectedCourse('')
      resetAnalytics()

      setErrorMsg(
        error?.message || 'Unable to load courses assigned to this tutor.',
      )
    } finally {
      setIsLoadingCourses(false)
    }
  }

  // ==========================================
  // FETCH COURSE ANALYTICS
  // ==========================================

  const fetchAnalytics = async () => {
    if (!selectedCourse) {
      resetAnalytics()
      return
    }

    setIsLoading(true)
    setErrorMsg(null)

    try {
      /*
       * selectedCourse is now the REAL database
       * course ID returned by /api/tutor/courses.
       */
      const response = await apiClient.getCourseAnalytics(selectedCourse)

      /*
       * Support common API response structures:
       *
       * {
       *   stats: {...},
       *   students: [...]
       * }
       *
       * OR
       *
       * {
       *   data: {
       *     stats: {...},
       *     students: [...]
       *   }
       * }
       */

      const data =
        response?.stats ||
        response?.data?.stats ||
        response?.data ||
        response ||
        {}

      const studentList = extractList<StudentRecord>(response, ['students'])

      setStats({
        total_students: Number(data?.total_students) || 0,

        average_grade: Number(data?.average_grade) || 0,

        completion_rate: Number(data?.completion_rate) || 0,

        at_risk_students: Number(data?.at_risk_students) || 0,
      })

      setStudents(studentList)
    } catch (error: any) {
      resetAnalytics()

      setErrorMsg(error?.message || 'Unable to load analytics for this course.')
    } finally {
      setIsLoading(false)
    }
  }

  // ==========================================
  // INITIAL COURSE LOAD
  // ==========================================

  useEffect(() => {
    fetchAssignedCourses()
  }, [])

  // ==========================================
  // LOAD ANALYTICS WHEN COURSE CHANGES
  // ==========================================

  useEffect(() => {
    if (selectedCourse) {
      fetchAnalytics()
    }
  }, [selectedCourse])

  // ==========================================
  // STUDENT NAME
  // ==========================================

  const getStudentName = (student: StudentRecord) => {
    if (student.name) {
      return student.name
    }

    const fullName = [student.first_name, student.last_name]
      .filter(Boolean)
      .join(' ')

    return fullName || `Student ${student.id}`
  }

  return (
    <div className='space-y-6 animate-fadeIn'>
      {/* ========================================
          HEADER BANNER
      ======================================== */}

      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm'>
        <div>
          <h1 className='text-xl md:text-2xl font-bold text-dark dark:text-white'>
            Cohort Analytics & Performance
          </h1>

          <p className='text-xs text-gray-500'>
            Monitor student engagement, attendance records, and grade
            distributions.
          </p>
        </div>

        {/* REAL COURSES FROM DATABASE */}

        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          disabled={isLoadingCourses || courses.length === 0}
          className='bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-dark dark:text-white text-xs font-semibold px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-purple cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isLoadingCourses ? (
            <option value=''>Loading courses...</option>
          ) : courses.length === 0 ? (
            <option value=''>No assigned courses</option>
          ) : (
            <>
              {courses.map((course) => (
                <option key={course.id} value={String(course.id)}>
                  {getCourseName(course)}
                </option>
              ))}
            </>
          )}
        </select>
      </div>

      {/* ========================================
          ERROR MESSAGE
      ======================================== */}

      {errorMsg && (
        <div className='flex items-center justify-between gap-4 p-4 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs rounded-xl font-medium'>
          <span>{errorMsg}</span>

          <button
            onClick={() => {
              if (courses.length === 0) {
                fetchAssignedCourses()
              } else {
                fetchAnalytics()
              }
            }}
            className='flex items-center gap-1.5 hover:opacity-70 transition'
          >
            <RefreshCw size={14} />
            Retry
          </button>
        </div>
      )}

      {/* ========================================
          LOADING
      ======================================== */}

      {isLoadingCourses || isLoading ? (
        <div className='h-64 flex items-center justify-center'>
          <Loader2 className='w-6 h-6 animate-spin text-primary-purple' />
        </div>
      ) : !selectedCourse ? (
        <div className='bg-white dark:bg-gray-900 p-12 text-center rounded-2xl border border-gray-200 dark:border-gray-800'>
          <Users size={40} className='mx-auto text-gray-400 mb-3' />

          <p className='text-sm font-medium text-gray-500'>
            {courses.length === 0
              ? 'No courses are currently assigned to you.'
              : 'Select a course to view analytics.'}
          </p>
        </div>
      ) : (
        <>
          {/* ========================================
              STATS OVERVIEW GRID
          ======================================== */}

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            {/* TOTAL STUDENTS */}

            <div className='bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-2'>
              <div className='flex items-center justify-between text-gray-500'>
                <span className='text-xs font-medium'>Total Enrolled</span>

                <Users size={18} className='text-primary-purple' />
              </div>

              <h3 className='text-2xl font-bold text-dark dark:text-white'>
                {stats.total_students}
              </h3>

              <p className='text-[10px] text-gray-400 font-semibold'>
                Active cohort count
              </p>
            </div>

            {/* AVERAGE GRADE */}

            <div className='bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-2'>
              <div className='flex items-center justify-between text-gray-500'>
                <span className='text-xs font-medium'>Average Grade</span>

                <BarChart3 size={18} className='text-blue-500' />
              </div>

              <h3 className='text-2xl font-bold text-dark dark:text-white'>
                {stats.average_grade}%
              </h3>

              <p className='text-[10px] text-gray-400 font-semibold'>
                Across all published assessments
              </p>
            </div>

            {/* COMPLETION RATE */}

            <div className='bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-2'>
              <div className='flex items-center justify-between text-gray-500'>
                <span className='text-xs font-medium'>Completion Rate</span>

                <Percent size={18} className='text-emerald-500' />
              </div>

              <h3 className='text-2xl font-bold text-dark dark:text-white'>
                {stats.completion_rate}%
              </h3>

              <p className='text-[10px] text-gray-400 font-semibold'>
                On-time task submission
              </p>
            </div>

            {/* AT-RISK STUDENTS */}

            <div className='bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-2'>
              <div className='flex items-center justify-between text-gray-500'>
                <span className='text-xs font-medium'>At-Risk Students</span>

                <AlertTriangle size={18} className='text-amber-500' />
              </div>

              <h3 className='text-2xl font-bold text-dark dark:text-white'>
                {stats.at_risk_students}
              </h3>

              <p className='text-[10px] text-gray-400 font-semibold'>
                Requires tutor intervention
              </p>
            </div>
          </div>

          {/* ========================================
              STUDENT PERFORMANCE ROSTER
          ======================================== */}

          <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden'>
            <div className='p-5 border-b border-gray-100 dark:border-gray-800'>
              <h3 className='text-base font-bold text-dark dark:text-white'>
                Student Performance Roster
              </h3>

              <p className='text-xs text-gray-500'>
                Individual breakdown of attendance and academic standing.
              </p>
            </div>

            <div className='overflow-x-auto'>
              {students.length === 0 ? (
                <div className='p-12 text-center text-xs text-gray-500'>
                  No student performance data available for this course.
                </div>
              ) : (
                <table className='w-full text-left text-xs'>
                  <thead className='bg-gray-50 dark:bg-gray-950 text-gray-500 uppercase font-semibold border-b border-gray-200 dark:border-gray-800'>
                    <tr>
                      <th className='p-4'>Student Name</th>

                      <th className='p-4'>Attendance Rate</th>

                      <th className='p-4'>Average Score</th>

                      <th className='p-4'>Standing Status</th>
                    </tr>
                  </thead>

                  <tbody className='divide-y divide-gray-100 dark:divide-gray-800'>
                    {students.map((student) => (
                      <tr
                        key={student.id}
                        className='hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition'
                      >
                        <td className='p-4 font-medium text-dark dark:text-white'>
                          {getStudentName(student)}

                          {student.email && (
                            <span className='block text-[10px] text-gray-400 font-normal'>
                              {student.email}
                            </span>
                          )}
                        </td>

                        <td className='p-4 font-medium'>
                          {student.attendance_rate ?? 0}%
                        </td>

                        <td className='p-4 font-medium'>
                          {student.average_score ?? 0}
                          /100
                        </td>

                        <td className='p-4'>
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              student.status === 'exceling'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : student.status === 'at_risk'
                                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                  : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                            }`}
                          >
                            {student.status?.replace('_', ' ') || 'Active'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}