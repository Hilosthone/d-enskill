// // src/app/tutors/page.tsx
// 'use client'

// import { useState, useEffect } from 'react'
// import Link from 'next/link'
// import {
//   BookOpen,
//   FileText,
//   Users,
//   Video,
//   ArrowRight,
//   Loader2,
//   CheckCircle2,
//   CalendarCheck,
//   Megaphone,
// } from 'lucide-react'
// import { apiClient } from '@/services/api'

// export default function TutorsDashboardPage() {
//   const [isLoading, setIsLoading] = useState(true)
//   const [selectedCourse, setSelectedCourse] = useState('fullstack-dev')
//   const [dashboardData, setDashboardData] = useState({
//     enrolled_students: 42,
//     pending_submissions: 7,
//     upcoming_sessions: 2,
//     active_modules: 5,
//   })

//   useEffect(() => {
//     const fetchSummary = async () => {
//       setIsLoading(true)
//       try {
//         const res = await apiClient.getCourseAnalytics(selectedCourse)
//         const stats = res?.stats || res?.data?.stats || res || {}
//         setDashboardData({
//           enrolled_students: stats.total_students || 42,
//           pending_submissions: stats.pending_submissions || stats.at_risk_students ? 7 : 4,
//           upcoming_sessions: stats.upcoming_sessions || 2,
//           active_modules: stats.active_modules || 6,
//         })
//       } catch (err) {
//         // Fallback values if API is offline
//       } finally {
//         setIsLoading(false)
//       }
//     }
//     fetchSummary()
//   }, [selectedCourse])

//   return (
//     <div className='space-y-6 animate-fadeIn'>
//       {/* Welcome Banner & Course Switcher */}
//       <div className='bg-gradient-to-r from-primary-purple/90 to-primary-purple p-8 rounded-2xl text-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
//         <div className='space-y-2'>
//           <span className='px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-white/20 tracking-wider'>
//             Instructor Portal
//           </span>
//           <h1 className='text-2xl md:text-3xl font-extrabold'>
//             Welcome back, Tutor!
//           </h1>
//           <p className='text-xs md:text-sm text-white/80 max-w-xl'>
//             Manage your cohort curriculum, review student submissions, track attendance, and host live sessions directly from your hub.
//           </p>
//         </div>

//         <div className='flex items-center gap-3 w-full md:w-auto'>
//           {/* Course Selector */}
//           <select
//             value={selectedCourse}
//             onChange={(e) => setSelectedCourse(e.target.value)}
//             className='bg-white/10 border border-white/20 text-white text-xs font-semibold px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer'
//           >
//             <option value='fullstack-dev' className='text-gray-900'>Full-Stack Web Dev</option>
//             <option value='backend-eng' className='text-gray-900'>MERN Backend Engineering</option>
//             <option value='mobile-flutter' className='text-gray-900'>Mobile Dev (Flutter)</option>
//           </select>

//           <Link
//             href='/tutors/assessments'
//             className='bg-white text-primary-purple font-semibold px-5 py-3 rounded-xl text-xs hover:bg-gray-100 transition shadow-sm flex items-center gap-2 cursor-pointer whitespace-nowrap'
//           >
//             Grade Tasks <ArrowRight size={14} />
//           </Link>
//         </div>
//       </div>

//       {isLoading ? (
//         <div className='h-48 flex items-center justify-center'>
//           <Loader2 className='w-6 h-6 animate-spin text-primary-purple' />
//         </div>
//       ) : (
//         <>
//           {/* Quick Metrics Grid */}
//           <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
//             <div className='bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-2'>
//               <div className='flex items-center justify-between text-gray-500'>
//                 <span className='text-xs font-medium'>Enrolled Students</span>
//                 <Users size={18} className='text-primary-purple' />
//               </div>
//               <h3 className='text-2xl font-bold text-dark dark:text-white'>
//                 {dashboardData.enrolled_students}
//               </h3>
//               <p className='text-[10px] text-gray-400'>Active learners in cohort</p>
//             </div>

//             <div className='bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-2'>
//               <div className='flex items-center justify-between text-gray-500'>
//                 <span className='text-xs font-medium'>Pending Submissions</span>
//                 <FileText size={18} className='text-amber-500' />
//               </div>
//               <h3 className='text-2xl font-bold text-dark dark:text-white'>
//                 {dashboardData.pending_submissions}
//               </h3>
//               <p className='text-[10px] text-amber-500 font-semibold'>
//                 Requires code review
//               </p>
//             </div>

//             <div className='bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-2'>
//               <div className='flex items-center justify-between text-gray-500'>
//                 <span className='text-xs font-medium'>Upcoming Live Sessions</span>
//                 <Video size={18} className='text-blue-500' />
//               </div>
//               <h3 className='text-2xl font-bold text-dark dark:text-white'>
//                 {dashboardData.upcoming_sessions}
//               </h3>
//               <p className='text-[10px] text-blue-500 font-semibold'>
//                 Scheduled this week
//               </p>
//             </div>

//             <div className='bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-2'>
//               <div className='flex items-center justify-between text-gray-500'>
//                 <span className='text-xs font-medium'>Active Modules</span>
//                 <BookOpen size={18} className='text-emerald-500' />
//               </div>
//               <h3 className='text-2xl font-bold text-dark dark:text-white'>
//                 {dashboardData.active_modules}
//               </h3>
//               <p className='text-[10px] text-emerald-500 font-semibold'>
//                 Published to students
//               </p>
//             </div>
//           </div>

//           {/* Quick Shortcuts Section */}
//           <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2'>
//             <Link
//               href='/tutors/assessments'
//               className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-3 hover:border-primary-purple transition group cursor-pointer'
//             >
//               <div className='w-10 h-10 rounded-xl bg-primary-purple/10 text-primary-purple flex items-center justify-center font-bold'>
//                 <FileText size={20} />
//               </div>
//               <h3 className='text-base font-bold text-dark dark:text-white group-hover:text-primary-purple transition'>
//                 Assessments & Grading
//               </h3>
//               <p className='text-xs text-gray-500'>
//                 Publish coding assignments and assign score updates with feedback notes.
//               </p>
//             </Link>

//             <Link
//               href='/tutors/modules'
//               className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-3 hover:border-primary-purple transition group cursor-pointer'
//             >
//               <div className='w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold'>
//                 <BookOpen size={20} />
//               </div>
//               <h3 className='text-base font-bold text-dark dark:text-white group-hover:text-blue-500 transition'>
//                 Modules & Sessions
//               </h3>
//               <p className='text-xs text-gray-500'>
//                 Upload weekly lecture notes, coordinate conference links, and manage schedule.
//               </p>
//             </Link>

//             <Link
//               href='/tutors/attendance'
//               className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-3 hover:border-primary-purple transition group cursor-pointer'
//             >
//               <div className='w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold'>
//                 <CalendarCheck size={20} />
//               </div>
//               <h3 className='text-base font-bold text-dark dark:text-white group-hover:text-amber-500 transition'>
//                 Attendance Logger
//               </h3>
//               <p className='text-xs text-gray-500'>
//                 Log daily attendance records for enrolled students in your active course session.
//               </p>
//             </Link>

//             <Link
//               href='/tutors/analytics'
//               className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-3 hover:border-primary-purple transition group cursor-pointer'
//             >
//               <div className='w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold'>
//                 <Users size={20} />
//               </div>
//               <h3 className='text-base font-bold text-dark dark:text-white group-hover:text-emerald-500 transition'>
//                 Cohort Analytics
//               </h3>
//               <p className='text-xs text-gray-500'>
//                 Track student attendance rates, grade averages, and flag at-risk learners.
//               </p>
//             </Link>
//           </div>
//         </>
//       )}
//     </div>
//   )
// }


// src/app/tutors/page.tsx

import { redirect } from 'next/navigation'

export default function TutorsRootPage() {
  redirect('/tutors/dashboard')
}