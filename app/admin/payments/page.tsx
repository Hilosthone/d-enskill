// src/app/admin/payments/page.tsx
'use client'
import { useState, useEffect } from 'react'
import {
  Search,
  CreditCard,
  Download,
  CheckCircle,
  Clock,
  Loader2,
  AlertCircle,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Filter,
  RefreshCw,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { adminApiClient } from '@/services/admin-api'

interface Payment {
  id: string
  name: string
  course: string
  method: string
  amount: string
  rawAmount: number
  date: string
  status: string
}

export default function AdminPaymentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const fetchPayments = async () => {
    setIsLoading(true)
    setErrorMessage('')
    try {
      const response = await adminApiClient.getAdminPayments()
      const payload = response?.data || response
      const list = Array.isArray(payload)
        ? payload
        : payload?.payments || payload?.data || []

      setPayments(
        list.map((tx: any) => {
          const amt = Number(tx.amount_paid || tx.total_amount || 0)
          const statusText = tx.payment_status || 'completed'

          // Construct full name safely from backend fields
          const fullName =
            tx.student_name ||
            tx.name ||
            `${tx.first_name || ''} ${tx.middle_name || ''} ${tx.last_name || ''}`.trim() ||
            'Anonymous User'

          return {
            id: String(
              tx.reference ||
                tx.id ||
                `TXN-${Math.floor(Math.random() * 90000 + 10000)}`,
            ),
            name: fullName,
            course: tx.course || 'Full-Stack Software Engineering',
            method: tx.method || 'Manual / Bank Transfer',
            amount: `₦${amt.toLocaleString()}`,
            rawAmount: amt,
            date: tx.created_at
              ? new Date(tx.created_at).toLocaleString([], {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })
              : 'Aug 29, 2026',
            status: statusText.charAt(0).toUpperCase() + statusText.slice(1),
          }
        }),
      )
    } catch (err: any) {
      setErrorMessage(
        err?.message || 'Failed to load financial transactions from backend.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  const totalInflow = payments.reduce((acc, curr) => acc + curr.rawAmount, 0)
  const completedCount = payments.filter(
    (p) => p.status.toLowerCase() === 'completed',
  ).length
  const pendingCount = payments.filter(
    (p) => p.status.toLowerCase() !== 'completed',
  ).length

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.course.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === 'ALL' ||
      p.status.toUpperCase() === statusFilter.toUpperCase()

    return matchesSearch && matchesStatus
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='space-y-6 max-w-7xl mx-auto pb-12'
    >
      {/* Page Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
            Financial Transactions
          </h2>
          <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
            Monitor verified payments, installments, and systemic revenue logs.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={fetchPayments}
          className='bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs border border-gray-200 dark:border-gray-800'
        >
          <RefreshCw
            size={14}
            className={isLoading ? 'animate-spin text-primary-purple' : ''}
          />
          Refresh Logs
        </motion.button>
      </div>

      {/* Error State Banner */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className='p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center gap-3 text-xs font-medium'
          >
            <AlertCircle size={18} className='shrink-0' />
            <span>{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overview Analytics Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <motion.div
          whileHover={{ y: -2 }}
          className='bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between transition-colors'
        >
          <div>
            <span className='text-[11px] font-semibold text-gray-400 uppercase tracking-wider'>
              Total Inflow Recorded
            </span>
            <p className='text-xl font-bold text-gray-900 dark:text-white mt-1'>
              ₦{totalInflow.toLocaleString()}
            </p>
          </div>
          <div className='p-3 rounded-xl bg-primary-purple/10 text-primary-purple'>
            <DollarSign size={20} />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className='bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between transition-colors'
        >
          <div>
            <span className='text-[11px] font-semibold text-gray-400 uppercase tracking-wider'>
              Completed Payments
            </span>
            <p className='text-xl font-bold text-green-600 dark:text-green-400 mt-1'>
              {completedCount}
            </p>
          </div>
          <div className='p-3 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400'>
            <ShieldCheck size={20} />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className='bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between transition-colors'
        >
          <div>
            <span className='text-[11px] font-semibold text-gray-400 uppercase tracking-wider'>
              Partial / Pending Logs
            </span>
            <p className='text-xl font-bold text-amber-500 mt-1'>
              {pendingCount}
            </p>
          </div>
          <div className='p-3 rounded-xl bg-amber-500/10 text-amber-500'>
            <Clock size={20} />
          </div>
        </motion.div>
      </div>

      {/* Search and Status Filters Toolbar */}
      <div className='bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm transition-colors'>
        <div className='relative w-full sm:w-80'>
          <Search className='absolute left-3.5 top-3 text-gray-400' size={16} />
          <input
            type='text'
            placeholder='Search by reference, name, course...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary-purple'
          />
        </div>

        {/* Status Filter Badges */}
        <div className='flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0'>
          <span className='text-[11px] text-gray-400 flex items-center gap-1 shrink-0'>
            <Filter size={12} /> Status:
          </span>
          {['ALL', 'COMPLETED', 'PARTIAL'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
                statusFilter.toUpperCase() === status.toUpperCase()
                  ? 'bg-primary-purple text-white shadow-xs'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table Container */}
      <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm transition-colors'>
        {isLoading ? (
          <div className='h-64 flex items-center justify-center'>
            <Loader2 className='w-6 h-6 animate-spin text-primary-purple' />
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className='p-12 text-center space-y-2'>
            <CreditCard size={32} className='mx-auto text-gray-400' />
            <p className='text-xs text-gray-500 dark:text-gray-400'>
              No transactions found matching your criteria.
            </p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-left border-collapse'>
              <thead>
                <tr className='border-b border-gray-200 dark:border-gray-800 text-[11px] font-semibold text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-950/50'>
                  <th className='p-4'>Reference ID</th>
                  <th className='p-4'>Applicant Name</th>
                  <th className='p-4'>Course Track</th>
                  <th className='p-4'>Amount Paid</th>
                  <th className='p-4'>Timestamp</th>
                  <th className='p-4'>Status</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100 dark:divide-gray-800 text-xs'>
                {filteredPayments.map((tx) => {
                  const isCompleted = tx.status.toLowerCase() === 'completed'
                  return (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={tx.id}
                      className='hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors'
                    >
                      <td className='p-4 font-mono font-semibold text-primary-purple'>
                        {tx.id}
                      </td>
                      <td className='p-4 font-semibold text-gray-900 dark:text-white flex items-center gap-2.5'>
                        <div className='w-7 h-7 rounded-full bg-primary-purple/10 text-primary-purple font-bold flex items-center justify-center text-[10px] shrink-0'>
                          {tx.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)}
                        </div>
                        <span>{tx.name}</span>
                      </td>
                      <td className='p-4 text-gray-500 dark:text-gray-400 font-medium'>
                        {tx.course}
                      </td>
                      <td className='p-4 font-mono font-bold text-gray-900 dark:text-white'>
                        {tx.amount}
                      </td>
                      <td className='p-4 text-gray-400 font-mono text-[11px]'>
                        {tx.date}
                      </td>
                      <td className='p-4'>
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 w-fit ${
                            isCompleted
                              ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle size={12} />
                          ) : (
                            <Clock size={12} />
                          )}
                          {tx.status}
                        </span>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  )
}
