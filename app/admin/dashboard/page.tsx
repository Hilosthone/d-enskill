// //src/app/admin/dashboard/page.tsx
// 'use client'
// import { useState, useEffect } from 'react'
// import {
//   Users,
//   CreditCard,
//   BookOpen,
//   GraduationCap,
//   TrendingUp,
//   Loader2,
//   AlertCircle,
// } from 'lucide-react'
// import { apiClient } from '@/services/api'

// interface DashboardStats {
//   totalStudents: number
//   totalRevenue: number
//   activeCourses: number
//   instructorsCount: number
// }

// interface EnrollmentItem {
//   id: number
//   name: string
//   course: string
//   amount_paid: string
//   payment_status: string
//   created_at: string
// }

// export default function AdminDashboardPage() {
//   const [stats, setStats] = useState<DashboardStats>({
//     totalStudents: 0,
//     totalRevenue: 0,
//     activeCourses: 0,
//     instructorsCount: 0,
//   })

//   const [enrollments, setEnrollments] = useState<EnrollmentItem[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [errorMessage, setErrorMessage] = useState('')

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const response = await apiClient.getAdminDashboard()
//         // Extract payload from Axios wrapper or direct response
//         const payload = response?.data || response

//         if (payload) {
//           // Backend returns metrics nested inside payload.metrics
//           const metricsData = payload.metrics || {}

//           setStats({
//             totalStudents:
//               metricsData.totalStudents ?? payload.totalStudents ?? 0,
//             totalRevenue: metricsData.totalRevenue ?? payload.totalRevenue ?? 0,
//             activeCourses:
//               metricsData.activeCourses ?? payload.activeCourses ?? 0,
//             instructorsCount: payload.instructorsCount ?? 0,
//           })

//           // Backend returns recent enrollments under recentEnrollments
//           const txList =
//             payload.recentEnrollments ||
//             payload.recentTransactions ||
//             payload.transactions ||
//             payload.enrollments ||
//             []

//           if (Array.isArray(txList)) {
//             setEnrollments(txList)
//           }
//         }
//       } catch (err: any) {
//         setErrorMessage(
//           err?.message || 'Failed to fetch admin metrics from backend.',
//         )
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchDashboardData()
//   }, [])

//   const formattedRevenue = (() => {
//     const revNum = Number(stats.totalRevenue) || 0
//     return `₦${revNum.toLocaleString()}`
//   })()

//   if (isLoading) {
//     return (
//       <div className='h-96 flex items-center justify-center'>
//         <Loader2 className='w-6 h-6 animate-spin text-primary-purple' />
//       </div>
//     )
//   }

//   return (
//     <div className='space-y-8 animate-fadeIn'>
//       <div>
//         <h2 className='text-2xl font-bold text-dark dark:text-white'>
//           Academy Overview
//         </h2>
//         <p className='text-sm text-gray-500'>
//           Monitor platform enrollment metrics, transactions, and system
//           activity.
//         </p>
//       </div>

//       {errorMessage && (
//         <div className='p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-medium'>
//           <AlertCircle size={20} className='shrink-0' />
//           <span>{errorMessage}</span>
//         </div>
//       )}

//       {/* Metrics Grid */}
//       <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
//         <div className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-2'>
//           <div className='flex justify-between items-center text-gray-500'>
//             <span className='text-xs font-semibold uppercase'>
//               Total Students
//             </span>
//             <Users size={20} className='text-primary-purple' />
//           </div>
//           <p className='text-3xl font-bold text-dark dark:text-white'>
//             {Number(stats.totalStudents || 0).toLocaleString()}
//           </p>
//           <div className='flex items-center gap-1 text-xs text-green-600 font-medium'>
//             <TrendingUp size={14} /> Live metric
//           </div>
//         </div>

//         <div className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-2'>
//           <div className='flex justify-between items-center text-gray-500'>
//             <span className='text-xs font-semibold uppercase'>
//               Total Revenue
//             </span>
//             <CreditCard size={20} className='text-green-500' />
//           </div>
//           <p className='text-3xl font-bold text-dark dark:text-white'>
//             {formattedRevenue}
//           </p>
//           <div className='flex items-center gap-1 text-xs text-green-600 font-medium'>
//             <TrendingUp size={14} /> Verified payouts
//           </div>
//         </div>

//         <div className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-2'>
//           <div className='flex justify-between items-center text-gray-500'>
//             <span className='text-xs font-semibold uppercase'>
//               Active Programs
//             </span>
//             <BookOpen size={20} className='text-[#00C3F7]' />
//           </div>
//           <p className='text-3xl font-bold text-dark dark:text-white'>
//             {stats.activeCourses}
//           </p>
//           <div className='text-xs text-gray-400'>
//             Full-Stack & Mobile Tracks
//           </div>
//         </div>

//         <div className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-2'>
//           <div className='flex justify-between items-center text-gray-500'>
//             <span className='text-xs font-semibold uppercase'>Instructors</span>
//             <GraduationCap size={20} className='text-amber-500' />
//           </div>
//           <p className='text-3xl font-bold text-dark dark:text-white'>
//             {stats.instructorsCount}
//           </p>
//           <div className='text-xs text-gray-400'>Active mentors online</div>
//         </div>
//       </div>

//       {/* Recent Activity Section */}
//       <div className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4'>
//         <div className='flex justify-between items-center'>
//           <h3 className='text-lg font-bold text-dark dark:text-white'>
//             Recent Enrollments
//           </h3>
//           <span className='text-xs font-semibold text-primary-purple cursor-pointer hover:underline'>
//             View All Payments
//           </span>
//         </div>

//         <div className='divide-y divide-gray-100 dark:divide-gray-800'>
//           {enrollments.length === 0 ? (
//             <p className='py-6 text-center text-sm text-gray-400'>
//               No recent enrollments recorded from backend yet.
//             </p>
//           ) : (
//             enrollments.map((tx) => (
//               <div
//                 key={tx.id}
//                 className='py-3.5 flex items-center justify-between text-sm'
//               >
//                 <div className='space-y-0.5'>
//                   <p className='font-semibold text-dark dark:text-white'>
//                     {tx.name}
//                   </p>
//                   <p className='text-xs text-gray-500'>{tx.course}</p>
//                 </div>
//                 <div className='text-right space-y-0.5'>
//                   <p className='font-mono font-bold text-dark dark:text-white'>
//                     ₦{Number(tx.amount_paid || 0).toLocaleString()}
//                   </p>
//                   <p className='text-[10px] font-semibold flex items-center justify-end gap-1'>
//                     <span
//                       className={`px-1.5 py-0.5 rounded uppercase text-[9px] ${
//                         tx.payment_status === 'completed'
//                           ? 'bg-green-500/10 text-green-600'
//                           : 'bg-amber-500/10 text-amber-600'
//                       }`}
//                     >
//                       {tx.payment_status}
//                     </span>
//                     <span className='text-gray-400'>
//                       •{' '}
//                       {new Date(tx.created_at).toLocaleTimeString([], {
//                         hour: '2-digit',
//                         minute: '2-digit',
//                       })}
//                     </span>
//                   </p>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }



// src/app/admin/dashboard/page.tsx
'use client'
import { useState, useEffect } from 'react'
import {
  Users,
  CreditCard,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Loader2,
  AlertCircle,
  Activity,
  ArrowUpRight,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { apiClient } from '@/services/api'

interface DashboardStats {
  totalStudents: number
  totalRevenue: number
  activeCourses: number
  instructorsCount: number
}

interface EnrollmentItem {
  id: number
  name?: string
  first_name?: string
  middle_name?: string
  last_name?: string
  course: string
  amount_paid?: string | number
  total_amount?: string | number
  payment_status: string
  created_at: string
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalRevenue: 0,
    activeCourses: 0,
    instructorsCount: 0,
  })

  const [enrollments, setEnrollments] = useState<EnrollmentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await apiClient.getAdminDashboard()
        const payload = response?.data || response

        if (payload) {
          const metricsData = payload.metrics || {}

          setStats({
            totalStudents:
              metricsData.totalStudents ?? payload.totalStudents ?? 0,
            totalRevenue: metricsData.totalRevenue ?? payload.totalRevenue ?? 0,
            activeCourses:
              metricsData.activeCourses ?? payload.activeCourses ?? 0,
            instructorsCount: payload.instructorsCount ?? 8, // Fallback default
          })

          const txList =
            payload.recentEnrollments ||
            payload.recentTransactions ||
            payload.transactions ||
            payload.enrollments ||
            []

          if (Array.isArray(txList)) {
            setEnrollments(txList)
          }
        }
      } catch (err: any) {
        setErrorMessage(
          err?.message || 'Failed to fetch admin metrics from backend.',
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const formattedRevenue = (() => {
    const revNum = Number(stats.totalRevenue) || 0
    return `₦${revNum.toLocaleString()}`
  })()

  if (isLoading) {
    return (
      <div className='h-96 flex items-center justify-center'>
        <Loader2 className='w-6 h-6 animate-spin text-primary-purple' />
      </div>
    )
  }

  // Resolve student full name safely based on different schema variations
  const getFullName = (tx: EnrollmentItem) => {
    if (tx.name) return tx.name
    const parts = [tx.first_name, tx.middle_name, tx.last_name].filter(Boolean)
    return parts.length > 0 ? parts.join(' ') : 'Unnamed Student'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='space-y-8 max-w-7xl mx-auto pb-12'
    >
      <div>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
          Academy Overview
        </h2>
        <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
          Monitor platform enrollment metrics, revenue performance, and system activity.
        </p>
      </div>

      {errorMessage && (
        <div className='p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center gap-3 text-xs font-medium'>
          <AlertCircle size={18} className='shrink-0' />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Metrics Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <motion.div 
          whileHover={{ y: -2 }}
          className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-2 transition-colors'
        >
          <div className='flex justify-between items-center text-gray-500 dark:text-gray-400'>
            <span className='text-xs font-semibold uppercase tracking-wider'>
              Total Students
            </span>
            <Users size={20} className='text-primary-purple' />
          </div>
          <p className='text-3xl font-bold text-gray-900 dark:text-white'>
            {Number(stats.totalStudents || 0).toLocaleString()}
          </p>
          <div className='flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium'>
            <TrendingUp size={14} /> Live platform metric
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -2 }}
          className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-2 transition-colors'
        >
          <div className='flex justify-between items-center text-gray-500 dark:text-gray-400'>
            <span className='text-xs font-semibold uppercase tracking-wider'>
              Total Revenue
            </span>
            <CreditCard size={20} className='text-green-500' />
          </div>
          <p className='text-3xl font-bold text-gray-900 dark:text-white'>
            {formattedRevenue}
          </p>
          <div className='flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium'>
            <TrendingUp size={14} /> Verified payouts
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -2 }}
          className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-2 transition-colors'
        >
          <div className='flex justify-between items-center text-gray-500 dark:text-gray-400'>
            <span className='text-xs font-semibold uppercase tracking-wider'>
              Active Programs
            </span>
            <BookOpen size={20} className='text-[#00C3F7]' />
          </div>
          <p className='text-3xl font-bold text-gray-900 dark:text-white'>
            {stats.activeCourses}
          </p>
          <div className='text-xs text-gray-400 dark:text-gray-500'>
            Tech & Product Tracks
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -2 }}
          className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-2 transition-colors'
        >
          <div className='flex justify-between items-center text-gray-500 dark:text-gray-400'>
            <span className='text-xs font-semibold uppercase tracking-wider'>Instructors</span>
            <GraduationCap size={20} className='text-amber-500' />
          </div>
          <p className='text-3xl font-bold text-gray-900 dark:text-white'>
            {stats.instructorsCount}
          </p>
          <div className='text-xs text-gray-400 dark:text-gray-500'>Active mentors online</div>
        </motion.div>
      </div>

      {/* Analytics Graph Section */}
      <div className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6 transition-colors'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
          <div>
            <h3 className='text-base font-bold text-gray-900 dark:text-white flex items-center gap-2'>
              <Activity size={18} className='text-primary-purple' />
              Revenue & Enrollment Trend
            </h3>
            <p className='text-xs text-gray-500 dark:text-gray-400'>
              Visual summary of recent financial activities logged in the system.
            </p>
          </div>
          <div className='flex items-center gap-2 text-xs bg-gray-50 dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700'>
            <span className='px-3 py-1 bg-white dark:bg-gray-900 font-medium text-gray-900 dark:text-white rounded-lg shadow-xs'>
              Recent Timeline
            </span>
          </div>
        </div>

        {/* Dynamic Simulated Trend Graph */}
        <div className='h-48 w-full flex items-end gap-3 pt-6 px-2 border-b border-gray-100 dark:border-gray-800 relative'>
          {/* Background grid lines */}
          <div className='absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40'>
            <div className='border-b border-dashed border-gray-200 dark:border-gray-800 w-full'></div>
            <div className='border-b border-dashed border-gray-200 dark:border-gray-800 w-full'></div>
            <div className='border-b border-dashed border-gray-200 dark:border-gray-800 w-full'></div>
          </div>

          {enrollments.length === 0 ? (
            <div className='w-full h-full flex items-center justify-center text-xs text-gray-400'>
              No enrollment data available to chart.
            </div>
          ) : (
            enrollments.slice(0, 10).map((tx, idx) => {
              const amount = Number(tx.amount_paid || tx.total_amount || 10000)
              // Calculate relative height percentage (capped between 20% and 95%)
              const heightPct = Math.max(
                20,
                Math.min(95, (amount / 150000) * 100)
              )
              return (
                <div key={idx} className='flex-1 flex flex-col items-center gap-2 h-full justify-end z-10 group relative'>
                  {/* Tooltip on hover */}
                  <div className='absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 dark:bg-gray-800 text-white text-[10px] py-1 px-2 rounded-md shadow-lg pointer-events-none whitespace-nowrap z-20'>
                    {getFullName(tx)}: ₦{amount.toLocaleString()}
                  </div>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPct}%` }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className='w-full bg-primary-purple/20 group-hover:bg-primary-purple rounded-t-lg transition-colors cursor-pointer relative'
                  >
                    <div className='absolute top-0 left-0 right-0 h-1.5 bg-primary-purple rounded-t-lg'></div>
                  </motion.div>
                  <span className='text-[10px] text-gray-400 truncate w-full text-center'>
                    #{idx + 1}
                  </span>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4 transition-colors'>
        <div className='flex justify-between items-center'>
          <h3 className='text-base font-bold text-gray-900 dark:text-white'>
            Recent Enrollments
          </h3>
          <span className='text-xs font-semibold text-primary-purple cursor-pointer hover:underline flex items-center gap-1'>
            View All Payments <ArrowUpRight size={14} />
          </span>
        </div>

        <div className='divide-y divide-gray-100 dark:divide-gray-800'>
          {enrollments.length === 0 ? (
            <p className='py-6 text-center text-xs text-gray-400'>
              No recent enrollments recorded from backend yet.
            </p>
          ) : (
            enrollments.map((tx) => (
              <div
                key={tx.id}
                className='py-3.5 flex items-center justify-between text-xs hover:bg-gray-50/50 dark:hover:bg-gray-800/30 px-3 rounded-xl transition-colors'
              >
                <div className='space-y-0.5'>
                  <p className='font-bold text-gray-900 dark:text-white'>
                    {getFullName(tx)}
                  </p>
                  <p className='text-[11px] text-gray-500 dark:text-gray-400'>{tx.course}</p>
                </div>
                <div className='text-right space-y-0.5'>
                  <p className='font-mono font-bold text-gray-900 dark:text-white'>
                    ₦{Number(tx.amount_paid || tx.total_amount || 0).toLocaleString()}
                  </p>
                  <p className='text-[10px] font-semibold flex items-center justify-end gap-1.5'>
                    <span
                      className={`px-2 py-0.5 rounded-full uppercase text-[9px] tracking-wide ${
                        String(tx.payment_status).toLowerCase() === 'completed' ||
                        String(tx.payment_status).toLowerCase() === 'success'
                          ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {tx.payment_status}
                    </span>
                    <span className='text-gray-400 dark:text-gray-500'>
                      •{' '}
                      {new Date(tx.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  )
}