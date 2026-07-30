//src/app/admin/dashboard/page.tsx
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
} from 'lucide-react'
import { apiClient } from '@/services/api'

interface DashboardStats {
  totalStudents: number
  totalRevenue: number
  activeCourses: number
  instructorsCount: number
}

interface EnrollmentItem {
  id: number
  name: string
  course: string
  amount_paid: string
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
        // Extract payload from Axios wrapper or direct response
        const payload = response?.data || response

        if (payload) {
          // Backend returns metrics nested inside payload.metrics
          const metricsData = payload.metrics || {}

          setStats({
            totalStudents:
              metricsData.totalStudents ?? payload.totalStudents ?? 0,
            totalRevenue: metricsData.totalRevenue ?? payload.totalRevenue ?? 0,
            activeCourses:
              metricsData.activeCourses ?? payload.activeCourses ?? 0,
            instructorsCount: payload.instructorsCount ?? 0,
          })

          // Backend returns recent enrollments under recentEnrollments
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

  return (
    <div className='space-y-8 animate-fadeIn'>
      <div>
        <h2 className='text-2xl font-bold text-dark dark:text-white'>
          Academy Overview
        </h2>
        <p className='text-sm text-gray-500'>
          Monitor platform enrollment metrics, transactions, and system
          activity.
        </p>
      </div>

      {errorMessage && (
        <div className='p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-medium'>
          <AlertCircle size={20} className='shrink-0' />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Metrics Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <div className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-2'>
          <div className='flex justify-between items-center text-gray-500'>
            <span className='text-xs font-semibold uppercase'>
              Total Students
            </span>
            <Users size={20} className='text-primary-purple' />
          </div>
          <p className='text-3xl font-bold text-dark dark:text-white'>
            {Number(stats.totalStudents || 0).toLocaleString()}
          </p>
          <div className='flex items-center gap-1 text-xs text-green-600 font-medium'>
            <TrendingUp size={14} /> Live metric
          </div>
        </div>

        <div className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-2'>
          <div className='flex justify-between items-center text-gray-500'>
            <span className='text-xs font-semibold uppercase'>
              Total Revenue
            </span>
            <CreditCard size={20} className='text-green-500' />
          </div>
          <p className='text-3xl font-bold text-dark dark:text-white'>
            {formattedRevenue}
          </p>
          <div className='flex items-center gap-1 text-xs text-green-600 font-medium'>
            <TrendingUp size={14} /> Verified payouts
          </div>
        </div>

        <div className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-2'>
          <div className='flex justify-between items-center text-gray-500'>
            <span className='text-xs font-semibold uppercase'>
              Active Programs
            </span>
            <BookOpen size={20} className='text-[#00C3F7]' />
          </div>
          <p className='text-3xl font-bold text-dark dark:text-white'>
            {stats.activeCourses}
          </p>
          <div className='text-xs text-gray-400'>
            Full-Stack & Mobile Tracks
          </div>
        </div>

        <div className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-2'>
          <div className='flex justify-between items-center text-gray-500'>
            <span className='text-xs font-semibold uppercase'>Instructors</span>
            <GraduationCap size={20} className='text-amber-500' />
          </div>
          <p className='text-3xl font-bold text-dark dark:text-white'>
            {stats.instructorsCount}
          </p>
          <div className='text-xs text-gray-400'>Active mentors online</div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4'>
        <div className='flex justify-between items-center'>
          <h3 className='text-lg font-bold text-dark dark:text-white'>
            Recent Enrollments
          </h3>
          <span className='text-xs font-semibold text-primary-purple cursor-pointer hover:underline'>
            View All Payments
          </span>
        </div>

        <div className='divide-y divide-gray-100 dark:divide-gray-800'>
          {enrollments.length === 0 ? (
            <p className='py-6 text-center text-sm text-gray-400'>
              No recent enrollments recorded from backend yet.
            </p>
          ) : (
            enrollments.map((tx) => (
              <div
                key={tx.id}
                className='py-3.5 flex items-center justify-between text-sm'
              >
                <div className='space-y-0.5'>
                  <p className='font-semibold text-dark dark:text-white'>
                    {tx.name}
                  </p>
                  <p className='text-xs text-gray-500'>{tx.course}</p>
                </div>
                <div className='text-right space-y-0.5'>
                  <p className='font-mono font-bold text-dark dark:text-white'>
                    ₦{Number(tx.amount_paid || 0).toLocaleString()}
                  </p>
                  <p className='text-[10px] font-semibold flex items-center justify-end gap-1'>
                    <span
                      className={`px-1.5 py-0.5 rounded uppercase text-[9px] ${
                        tx.payment_status === 'completed'
                          ? 'bg-green-500/10 text-green-600'
                          : 'bg-amber-500/10 text-amber-600'
                      }`}
                    >
                      {tx.payment_status}
                    </span>
                    <span className='text-gray-400'>
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
    </div>
  )
}
