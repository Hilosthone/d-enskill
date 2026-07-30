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
  activeRevenue: number
  activeCourses: number
  instructorsCount: number
}

interface Transaction {
  name: string
  course: string
  amount: string
  status: string
  time: string
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    activeRevenue: 0,
    activeCourses: 0,
    instructorsCount: 0,
  })

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await apiClient.getAdminDashboard()
        // Handle standard axios response wrapper or direct data payload
        const payload = response?.data || response

        if (payload) {
          setStats({
            totalStudents: payload.totalStudents ?? payload.studentsCount ?? 0,
            activeRevenue:
              payload.activeRevenue ??
              payload.totalRevenue ??
              payload.revenue ??
              0,
            activeCourses: payload.activeCourses ?? payload.coursesCount ?? 0,
            instructorsCount:
              payload.instructorsCount ?? payload.mentorsCount ?? 0,
          })

          const txList =
            payload.recentTransactions ||
            payload.transactions ||
            payload.enrollments ||
            []
          if (Array.isArray(txList)) {
            setTransactions(
              txList.map((tx: any) => ({
                name:
                  tx.name ||
                  `${tx.firstName || ''} ${tx.lastName || ''}`.trim() ||
                  'Student',
                course: tx.course || tx.program || 'Training Programme',
                amount: tx.amount
                  ? `₦${Number(tx.amount).toLocaleString()}`
                  : tx.amountPaid
                    ? `₦${Number(tx.amountPaid).toLocaleString()}`
                    : '₦0',
                status: tx.status || 'Successful',
                time:
                  tx.time ||
                  (tx.createdAt
                    ? new Date(tx.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Recently'),
              })),
            )
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
    const revNum =
      typeof stats.activeRevenue === 'string'
        ? parseInt(stats.activeRevenue, 10)
        : stats.activeRevenue

    if (isNaN(revNum)) return '₦0M'
    return `₦${(revNum / 1000000).toFixed(1)}M`
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
            Recent Transactions
          </h3>
          <span className='text-xs font-semibold text-primary-purple cursor-pointer hover:underline'>
            View All Payments
          </span>
        </div>

        <div className='divide-y divide-gray-100 dark:divide-gray-800'>
          {transactions.length === 0 ? (
            <p className='py-6 text-center text-sm text-gray-400'>
              No recent transactions recorded from backend yet.
            </p>
          ) : (
            transactions.map((tx, idx) => (
              <div
                key={idx}
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
                    {tx.amount}
                  </p>
                  <p className='text-[10px] text-green-600 font-semibold'>
                    {tx.status} • {tx.time}
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
