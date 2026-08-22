'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PROGRAMMES } from '@/constants/programmes'
import { Lock, AlertCircle, Loader2 } from 'lucide-react'
import { apiClient } from '@/services/api'
import { ApplicantData } from './types'

export default function PaymentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const courseParam = searchParams.get('course')

  const [applicantData, setApplicantData] = useState<ApplicantData | null>(null)
  const [paymentAmount, setPaymentAmount] = useState('50000')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const data =
      sessionStorage.getItem('pendingRegistration') ||
      sessionStorage.getItem('studentSession')

    if (data) {
      try {
        const parsed = JSON.parse(data)
        if (courseParam) parsed.course = courseParam
        setApplicantData(parsed)
      } catch (e) {
        setApplicantData({
          course: courseParam || 'Frontend Development',
          firstName: 'Student',
          lastName: '',
          phone: '',
          email: '',
          agreedToCatalogue: true,
        })
      }
    } else if (courseParam) {
      setApplicantData({
        course: courseParam,
        firstName: 'Student',
        lastName: '',
        phone: '',
        email: '',
        agreedToCatalogue: true,
      })
    } else {
      router.push('/auth/login')
    }
  }, [router, courseParam])

  const selectedProg = PROGRAMMES.find((p) => p.title === applicantData?.course)
  const coursePrice = selectedProg
    ? parseInt(selectedProg.price.replace(/[^0-9]/g, '')) || 200000
    : 200000

  const handleOpenCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!applicantData) return

    const numericAmount = Number(paymentAmount)
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setErrorMsg('Please enter a valid payment amount.')
      return
    }

    setErrorMsg('')
    setLoading(true)

    try {
      const redirect_url = `${window.location.origin}/verify`

      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('denskill_token') ||
            localStorage.getItem('token') ||
            sessionStorage.getItem('token')
          : null

      if (!token) {
        setErrorMsg('Authentication session expired. Please log in again.')
        setLoading(false)
        router.push('/auth/login')
        return
      }

      const response = await (apiClient.payInstallment as any)(
        {
          course: applicantData.course,
          amountPayable: numericAmount,
          redirect_url,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const checkoutUrl =
        response?.authorization_url ||
        response?.link ||
        response?.data?.authorization_url ||
        response?.data?.link ||
        response?.data?.data?.link

      if (checkoutUrl) {
        window.location.href = checkoutUrl
      } else {
        setErrorMsg('Failed to retrieve Flutterwave checkout URL from backend.')
        setLoading(false)
      }
    } catch (err: any) {
      console.error('Full backend error response:', err?.response?.data)
      const serverMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message
      setErrorMsg(
        serverMessage
          ? `Server Error: ${serverMessage}`
          : 'Connection error. Failed to initialize installment payment.',
      )
      setLoading(false)
    }
  }

  if (!applicantData) return null

  const inputClass =
    'w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-dark dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm'

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 flex items-center justify-center relative'>
      <div className='max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6'>
        {/* Header */}
        <div className='border-b pb-4 dark:border-gray-800 flex justify-between items-center'>
          <div>
            <span className='text-xs font-semibold text-orange-500 uppercase tracking-wider'>
              Installment Top-up
            </span>
            <h2 className='text-2xl font-bold text-dark dark:text-white'>
              Flutterwave Secure Checkout
            </h2>
          </div>
          <div className='flex items-center gap-1 text-[10px] bg-green-500/10 text-green-600 px-2 py-1 rounded font-semibold'>
            <Lock size={12} /> Live SSL
          </div>
        </div>

        {/* Applicant Overview Card */}
        <div className='p-4 rounded-xl bg-orange-500/5 border border-orange-500/20 space-y-2 text-sm text-gray-600 dark:text-gray-300'>
          <div className='flex justify-between'>
            <span>Program:</span>
            <span className='font-semibold text-dark dark:text-white truncate max-w-[200px]'>
              {applicantData.course}
            </span>
          </div>
          <div className='flex justify-between border-t pt-2 dark:border-gray-800'>
            <span>Total Tuition:</span>
            <span className='font-mono font-bold text-dark dark:text-white'>
              ₦{coursePrice.toLocaleString()}
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className='p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl flex items-center gap-2'>
            <AlertCircle size={16} className='shrink-0' />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Amount Form */}
        <form onSubmit={handleOpenCheckout} className='space-y-4'>
          <div>
            <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
              Installment Payment Amount (₦)
            </label>
            <input
              type='number'
              required
              min='1'
              step='any'
              className={inputClass}
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-60'
          >
            {loading ? (
              <>
                <Loader2 size={18} className='animate-spin' /> Connecting to
                Flutterwave...
              </>
            ) : (
              <>
                <span>Pay ₦{Number(paymentAmount || 0).toLocaleString()}</span>
                <span className='text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono text-white'>
                  via Flutterwave
                </span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
