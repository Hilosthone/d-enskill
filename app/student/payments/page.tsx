'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Loader2,
  ArrowRight,
  PlusCircle,
} from 'lucide-react'
import { apiClient } from '@/services/api'

export default function StudentPaymentsPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [payments, setPayments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

    const fetchPaymentData = async () => {
      try {
        const response = apiClient.getPayments
          ? await apiClient.getPayments()
          : null
        if (response) {
          if (Array.isArray(response)) {
            setPayments(response)
          } else if (response.payments || response.data) {
            setPayments(response.payments || response.data)
          }
        }
      } catch (err) {
        // Fallback to default mock transaction if API fails
      } finally {
        setIsLoading(false)
      }
    }

    fetchPaymentData()
  }, [router])

  if (isLoading) {
    return (
      <div className='p-6 md:p-12 space-y-6 max-w-5xl mx-auto animate-pulse'>
        {/* Header Skeleton */}
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
          <div className='space-y-2'>
            <div className='h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg'></div>
            <div className='h-3 w-72 bg-gray-200 dark:bg-gray-800 rounded'></div>
          </div>
          <div className='h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded-xl'></div>
        </div>

        {/* Overview Cards Skeleton */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3 shadow-sm'>
            <div className='h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded'></div>
            <div className='h-6 w-40 bg-gray-200 dark:bg-gray-800 rounded'></div>
            <div className='h-3 w-full bg-gray-200 dark:bg-gray-800 rounded'></div>
          </div>

          <div className='p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3 shadow-sm flex flex-col justify-between'>
            <div className='space-y-3'>
              <div className='h-3 w-32 bg-gray-200 dark:bg-gray-800 rounded'></div>
              <div className='h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded'></div>
              <div className='h-3 w-full bg-gray-200 dark:bg-gray-800 rounded'></div>
            </div>
            <div className='h-4 w-36 bg-gray-200 dark:bg-gray-800 rounded mt-3'></div>
          </div>
        </div>

        {/* Transaction Table Skeleton */}
        <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm'>
          <div className='p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center'>
            <div className='h-4 w-36 bg-gray-200 dark:bg-gray-800 rounded'></div>
            <div className='h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded'></div>
          </div>
          <div className='divide-y divide-gray-200 dark:divide-gray-800'>
            {[1, 2, 3].map((item) => (
              <div key={item} className='p-6 flex items-center justify-between'>
                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <div className='h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded'></div>
                    <div className='h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded-full'></div>
                  </div>
                  <div className='h-3 w-48 bg-gray-200 dark:bg-gray-800 rounded'></div>
                </div>
                <div className='text-right space-y-2 flex flex-col items-end'>
                  <div className='h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded'></div>
                  <div className='h-3 w-20 bg-gray-200 dark:bg-gray-800 rounded'></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='p-6 md:p-12 space-y-6 max-w-5xl mx-auto'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-dark dark:text-white'>
            Payments & Billing
          </h1>
          <p className='text-xs text-gray-500 mt-1'>
            Manage your academy tuition, payment history, and invoices.
          </p>
        </div>
        <button
          onClick={() => router.push('/payment')}
          className='px-5 py-2.5 bg-primary-purple text-white rounded-xl font-bold text-xs hover:opacity-95 transition-all shadow-md flex items-center gap-2 cursor-pointer'
        >
          <PlusCircle size={16} /> Make Additional Payment
        </button>
      </div>

      {/* Overview Card */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-2 shadow-sm'>
          <span className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>
            Tuition Status
          </span>
          <div className='flex items-center gap-2 text-amber-500 font-bold text-lg'>
            <Clock size={20} /> Partial Payment / Active
          </div>
          <p className='text-xs text-gray-500'>
            Your installment tracking is active. Review your balance status
            below or top up your tuition.
          </p>
        </div>

        <div className='p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-2 shadow-sm flex flex-col justify-between'>
          <div>
            <span className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>
              Next Billing Milestone
            </span>
            <div className='flex items-center gap-2 text-primary-purple font-bold text-lg mt-1'>
              <CreditCard size={20} /> Balance Due
            </div>
            <p className='text-xs text-gray-500 mt-1'>
              Complete payment before expiration date to maintain full portal
              access.
            </p>
          </div>
          <button
            onClick={() => router.push('/payment')}
            className='text-xs text-primary-purple font-bold hover:underline flex items-center gap-1 mt-3 w-fit cursor-pointer'
          >
            Pay Outstanding Balance <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Transaction Table */}
      <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm'>
        <div className='p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center'>
          <h3 className='font-bold text-dark dark:text-white text-sm'>
            Transaction History
          </h3>
          <button
            onClick={() => router.push('/payment')}
            className='text-xs text-primary-purple font-bold hover:underline flex items-center gap-1 cursor-pointer'
          >
            + New Transaction
          </button>
        </div>
        <div className='divide-y divide-gray-200 dark:divide-gray-800'>
          {payments.length > 0 ? (
            payments.map((tx, idx) => (
              <div
                key={tx.id || idx}
                className='p-6 flex items-center justify-between text-sm'
              >
                <div className='space-y-1'>
                  <div className='flex items-center gap-2'>
                    <p className='font-semibold text-dark dark:text-white'>
                      {tx.course || 'Academy Tuition'}
                    </p>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        tx.payment_status === 'partial'
                          ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                          : 'bg-green-500/10 text-green-600 border border-green-500/20'
                      }`}
                    >
                      {tx.payment_status || 'Paid'}
                    </span>
                  </div>
                  <p className='text-xs text-gray-400'>
                    Ref:{' '}
                    <span className='font-mono text-gray-500 dark:text-gray-300'>
                      {tx.reference}
                    </span>{' '}
                    • Expires: {new Date(tx.expires_at).toLocaleDateString()}
                  </p>
                </div>
                <div className='text-right space-y-1'>
                  <div>
                    <span className='text-xs text-gray-400 block'>
                      Paid / Total
                    </span>
                    <p className='font-bold text-dark dark:text-white'>
                      ₦{Number(tx.amount_paid).toLocaleString()}{' '}
                      <span className='text-xs text-gray-400 font-normal'>
                        / ₦{Number(tx.total_amount).toLocaleString()}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => router.push('/student/receipts')}
                    className='text-xs text-primary-purple underline font-medium cursor-pointer inline-block'
                  >
                    View Receipt ➔
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className='p-8 text-center space-y-3'>
              <p className='text-xs text-gray-400'>
                No transaction records found.
              </p>
              <button
                onClick={() => router.push('/payment')}
                className='px-4 py-2 bg-primary-purple text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer'
              >
                Make Initial Payment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
