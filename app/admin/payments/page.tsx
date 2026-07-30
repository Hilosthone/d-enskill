'use client'
import { useState, useEffect } from 'react'
import {
  Search,
  CreditCard,
  Download,
  CheckCircle,
  Clock,
  ShieldCheck,
  Filter,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { apiClient } from '@/services/api'

interface Payment {
  id: string
  name: string
  method: string
  amount: string
  date: string
  status: string
}

export default function AdminPaymentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const fetchPayments = async () => {
    setIsLoading(true)
    setErrorMessage('')
    try {
      const response = await apiClient.getAdminPayments()
      const payload = response?.data || response
      const list = Array.isArray(payload)
        ? payload
        : payload?.payments || payload?.data || []

      setPayments(
        list.map((tx: any) => ({
          id: String(
            tx.id ||
              tx.reference ||
              tx._id ||
              `TXN-${Math.floor(Math.random() * 90000 + 10000)}`,
          ),
          name:
            tx.name || tx.applicantName || tx.user?.name || 'Anonymous User',
          method: tx.method || tx.channel || 'Card (Paystack)',
          amount:
            typeof tx.amount === 'number'
              ? `₦${tx.amount.toLocaleString()}`
              : tx.amount || '₦0',
          date: tx.date || tx.createdAt || 'Jul 27, 2026',
          status: tx.status || 'Verified',
        })),
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

  const filteredPayments = payments.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className='space-y-6 animate-fadeIn'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h2 className='text-2xl font-bold text-dark dark:text-white'>
            Financial Transactions
          </h2>
          <p className='text-sm text-gray-500'>
            Monitor verified payments, installments, and Paystack settlement
            logs.
          </p>
        </div>
        <button
          onClick={fetchPayments}
          className='bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-dark dark:text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-sm border border-gray-200 dark:border-gray-700'
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      {errorMessage && (
        <div className='p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-medium'>
          <AlertCircle size={20} className='shrink-0' />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Search & Overview Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='bg-white dark:bg-gray-950 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-1'>
          <span className='text-xs text-gray-400 font-semibold uppercase'>
            Total Inflow (Today)
          </span>
          <p className='text-2xl font-bold text-dark dark:text-white'>
            ₦330,000
          </p>
        </div>
        <div className='bg-white dark:bg-gray-950 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-1'>
          <span className='text-xs text-gray-400 font-semibold uppercase'>
            Verified Transactions
          </span>
          <p className='text-2xl font-bold text-green-600'>
            {payments.filter((p) => p.status === 'Verified').length}
          </p>
        </div>
        <div className='bg-white dark:bg-gray-950 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-1'>
          <span className='text-xs text-gray-400 font-semibold uppercase'>
            Pending Bank Transfers
          </span>
          <p className='text-2xl font-bold text-amber-500'>
            {payments.filter((p) => p.status !== 'Verified').length}
          </p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className='bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center justify-between shadow-sm'>
        <div className='relative w-full sm:w-80'>
          <Search className='absolute left-3.5 top-3 text-gray-400' size={16} />
          <input
            type='text'
            placeholder='Search by reference ID or name...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-dark dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-purple'
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm'>
        {isLoading ? (
          <div className='h-64 flex items-center justify-center'>
            <Loader2 className='w-6 h-6 animate-spin text-primary-purple' />
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className='p-12 text-center space-y-2'>
            <CreditCard size={32} className='mx-auto text-gray-400' />
            <p className='text-sm text-gray-500'>
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
                  <th className='p-4'>Payment Channel</th>
                  <th className='p-4'>Amount</th>
                  <th className='p-4'>Timestamp</th>
                  <th className='p-4'>Status</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100 dark:divide-gray-800 text-sm'>
                {filteredPayments.map((tx) => (
                  <tr
                    key={tx.id}
                    className='hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition'
                  >
                    <td className='p-4 font-mono font-semibold text-primary-purple'>
                      {tx.id}
                    </td>
                    <td className='p-4 font-semibold text-dark dark:text-white'>
                      {tx.name}
                    </td>
                    <td className='p-4 text-gray-500 text-xs'>{tx.method}</td>
                    <td className='p-4 font-mono font-bold text-dark dark:text-white'>
                      {tx.amount}
                    </td>
                    <td className='p-4 text-gray-400 text-xs'>{tx.date}</td>
                    <td className='p-4'>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
                          tx.status === 'Verified'
                            ? 'bg-green-500/10 text-green-600'
                            : 'bg-amber-500/10 text-amber-500'
                        }`}
                      >
                        {tx.status === 'Verified' ? (
                          <CheckCircle size={12} />
                        ) : (
                          <Clock size={12} />
                        )}
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
