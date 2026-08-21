// // src/app/tutors/analytics/page.tsx
// 'use client'

// import { useState, useEffect } from 'react'
// import {
//   BarChart3,
//   Users,
//   CheckCircle,
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
//   const [courseId, setCourseId] = useState('1')
//   const [isLoading, setIsLoading] = useState(true)
//   const [stats, setStats] = useState<CohortStats>({
//     total_students: 0,
//     average_grade: 0,
//     completion_rate: 0,
//     at_risk_students: 0,
//   })
//   const [students, setStudents] = useState<StudentRecord[]>([])

//   const fetchAnalytics = async () => {
//     setIsLoading(true)
//     try {
//       // FIXED: Updated method name to match apiClient.getCourseAnalytics
//       const res = await apiClient.getCourseAnalytics(courseId)
//       setStats(
//         res?.stats || {
//           total_students: 42,
//           average_grade: 78.4,
//           completion_rate: 85,
//           at_risk_students: 5,
//         },
//       )
//       setStudents(
//         res?.students || [
//           {
//             id: 1,
//             name: 'Alex Johnson',
//             email: 'alex@example.com',
//             attendance_rate: 95,
//             average_score: 91,
//             status: 'exceling',
//           },
//           {
//             id: 2,
//             name: 'Sarah Williams',
//             email: 'sarah@example.com',
//             attendance_rate: 60,
//             average_score: 54,
//             status: 'at_risk',
//           },
//         ],
//       )
//     } catch (err) {
//       // Fallback dummy data if backend endpoint isn't wired yet
//       setStats({
//         total_students: 38,
//         average_grade: 81.2,
//         completion_rate: 88,
//         at_risk_students: 3,
//       })
//       setStudents([
//         {
//           id: 1,
//           name: 'Alex Johnson',
//           email: 'alex@example.com',
//           attendance_rate: 95,
//           average_score: 92,
//           status: 'exceling',
//         },
//         {
//           id: 2,
//           name: 'Michael Chen',
//           email: 'michael@example.com',
//           attendance_rate: 88,
//           average_score: 79,
//           status: 'active',
//         },
//         {
//           id: 3,
//           name: 'Sarah Williams',
//           email: 'sarah@example.com',
//           attendance_rate: 58,
//           average_score: 52,
//           status: 'at_risk',
//         },
//       ])
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchAnalytics()
//   }, [courseId])

//   return (
//     <div className='space-y-6 animate-fadeIn'>
//       <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
//         <div>
//           <h1 className='text-2xl font-bold text-dark dark:text-white'>
//             Cohort Analytics & Performance
//           </h1>
//           <p className='text-sm text-gray-500'>
//             Monitor student engagement, attendance records, and grade
//             distributions.
//           </p>
//         </div>
//         <select
//           value={courseId}
//           onChange={(e) => setCourseId(e.target.value)}
//           className='p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs font-medium text-dark dark:text-white'
//         >
//           <option value='1'>Course ID: 1 (Full-Stack)</option>
//           <option value='2'>Course ID: 2 (Mobile App)</option>
//         </select>
//       </div>

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
//               <p className='text-[10px] text-green-500 flex items-center gap-1 font-semibold'>
//                 <TrendingUp size={10} /> Active cohort
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
//               <p className='text-[10px] text-blue-500 font-semibold'>
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
//               <p className='text-[10px] text-emerald-500 font-semibold'>
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
//               <p className='text-[10px] text-amber-500 font-semibold'>
//                 Requires tutor intervention
//               </p>
//             </div>
//           </div>

//           {/* Student Roster Performance Table */}
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
//               <table className='w-full text-left text-xs'>
//                 <thead className='bg-gray-50 dark:bg-gray-950 text-gray-500 uppercase font-semibold'>
//                   <tr>
//                     <th className='p-4'>Student Name</th>
//                     <th className='p-4'>Attendance Rate</th>
//                     <th className='p-4'>Average Score</th>
//                     <th className='p-4'>Standing Status</th>
//                   </tr>
//                 </thead>
//                 <tbody className='divide-y divide-gray-100 dark:divide-gray-800'>
//                   {students.map((student) => (
//                     <tr
//                       key={student.id}
//                       className='hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition'
//                     >
//                       <td className='p-4 font-medium text-dark dark:text-white'>
//                         {student.name}
//                         <span className='block text-[10px] text-gray-400'>
//                           {student.email}
//                         </span>
//                       </td>
//                       <td className='p-4 font-medium'>
//                         {student.attendance_rate}%
//                       </td>
//                       <td className='p-4 font-medium'>
//                         {student.average_score}/100
//                       </td>
//                       <td className='p-4'>
//                         <span
//                           className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
//                             student.status === 'exceling'
//                               ? 'bg-green-500/10 text-green-600'
//                               : student.status === 'at_risk'
//                                 ? 'bg-amber-500/10 text-amber-600'
//                                 : 'bg-blue-500/10 text-blue-600'
//                           }`}
//                         >
//                           {student.status.replace('_', ' ')}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   )
// }






// src/app/tutors/analytics/page.tsx
'use client'

import { useState, useEffect } from 'react'
import {
  BarChart3,
  Users,
  AlertTriangle,
  Loader2,
  TrendingUp,
  Percent,
} from 'lucide-react'
import { apiClient } from '@/services/api'

interface CohortStats {
  total_students: number
  average_grade: number
  completion_rate: number
  at_risk_students: number
}

interface StudentRecord {
  id: string | number
  name: string
  email: string
  attendance_rate: number
  average_score: number
  status: 'active' | 'at_risk' | 'exceling'
}

export default function TutorsAnalyticsPage() {
  const [selectedCourse, setSelectedCourse] = useState('fullstack-dev')
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<CohortStats>({
    total_students: 0,
    average_grade: 0,
    completion_rate: 0,
    at_risk_students: 0,
  })
  const [students, setStudents] = useState<StudentRecord[]>([])

  const fetchAnalytics = async () => {
    setIsLoading(true)
    try {
      const res = await apiClient.getCourseAnalytics(selectedCourse)
      const data = res?.stats || res?.data || res || {}
      
      setStats({
        total_students: data.total_students || 42,
        average_grade: data.average_grade || 78.4,
        completion_rate: data.completion_rate || 85,
        at_risk_students: data.at_risk_students || 5,
      })
      
      setStudents(
        res?.students || res?.data?.students || [
          {
            id: 1,
            name: 'Aiden Vance',
            email: 'aiden@example.com',
            attendance_rate: 95,
            average_score: 91,
            status: 'exceling',
          },
          {
            id: 2,
            name: 'Sophia Martinez',
            email: 'sophia@example.com',
            attendance_rate: 60,
            average_score: 54,
            status: 'at_risk',
          },
        ],
      )
    } catch (err) {
      // Fallback dummy data if backend endpoint fails or is offline
      setStats({
        total_students: 38,
        average_grade: 81.2,
        completion_rate: 88,
        at_risk_students: 3,
      })
      setStudents([
        {
          id: 1,
          name: 'Aiden Vance',
          email: 'aiden@example.com',
          attendance_rate: 95,
          average_score: 92,
          status: 'exceling',
        },
        {
          id: 2,
          name: 'Liam Johnson',
          email: 'liam@example.com',
          attendance_rate: 88,
          average_score: 79,
          status: 'active',
        },
        {
          id: 3,
          name: 'Sophia Martinez',
          email: 'sophia@example.com',
          attendance_rate: 58,
          average_score: 52,
          status: 'at_risk',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [selectedCourse])

  return (
    <div className='space-y-6 animate-fadeIn'>
      {/* Header Banner */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm'>
        <div>
          <h1 className='text-xl md:text-2xl font-bold text-dark dark:text-white'>
            Cohort Analytics & Performance
          </h1>
          <p className='text-xs text-gray-500'>
            Monitor student engagement, attendance records, and grade distributions.
          </p>
        </div>
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

      {isLoading ? (
        <div className='h-64 flex items-center justify-center'>
          <Loader2 className='w-6 h-6 animate-spin text-primary-purple' />
        </div>
      ) : (
        <>
          {/* Stats Overview Grid */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            <div className='bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-2'>
              <div className='flex items-center justify-between text-gray-500'>
                <span className='text-xs font-medium'>Total Enrolled</span>
                <Users size={18} className='text-primary-purple' />
              </div>
              <h3 className='text-2xl font-bold text-dark dark:text-white'>
                {stats.total_students}
              </h3>
              <p className='text-[10px] text-green-500 flex items-center gap-1 font-semibold'>
                <TrendingUp size={10} /> Active cohort
              </p>
            </div>

            <div className='bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-2'>
              <div className='flex items-center justify-between text-gray-500'>
                <span className='text-xs font-medium'>Average Grade</span>
                <BarChart3 size={18} className='text-blue-500' />
              </div>
              <h3 className='text-2xl font-bold text-dark dark:text-white'>
                {stats.average_grade}%
              </h3>
              <p className='text-[10px] text-blue-500 font-semibold'>
                Across all published assessments
              </p>
            </div>

            <div className='bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-2'>
              <div className='flex items-center justify-between text-gray-500'>
                <span className='text-xs font-medium'>Completion Rate</span>
                <Percent size={18} className='text-emerald-500' />
              </div>
              <h3 className='text-2xl font-bold text-dark dark:text-white'>
                {stats.completion_rate}%
              </h3>
              <p className='text-[10px] text-emerald-500 font-semibold'>
                On-time task submission
              </p>
            </div>

            <div className='bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-2'>
              <div className='flex items-center justify-between text-gray-500'>
                <span className='text-xs font-medium'>At-Risk Students</span>
                <AlertTriangle size={18} className='text-amber-500' />
              </div>
              <h3 className='text-2xl font-bold text-dark dark:text-white'>
                {stats.at_risk_students}
              </h3>
              <p className='text-[10px] text-amber-500 font-semibold'>
                Requires tutor intervention
              </p>
            </div>
          </div>

          {/* Student Performance Roster Table */}
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
                        {student.name}
                        <span className='block text-[10px] text-gray-400 font-normal'>
                          {student.email}
                        </span>
                      </td>
                      <td className='p-4 font-medium'>
                        {student.attendance_rate}%
                      </td>
                      <td className='p-4 font-medium'>
                        {student.average_score}/100
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
                          {student.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}