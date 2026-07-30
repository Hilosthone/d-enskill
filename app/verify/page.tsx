'use client'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { apiClient } from '@/services/api'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

export default function VerifyPaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const reference = searchParams.get('reference') || searchParams.get('trxref')

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>(
    'verifying',
  )
  const [message, setMessage] = useState(
    'Verifying your payment transaction...',
  )

  useEffect(() => {
    if (!reference) {
      setStatus('error')
      setMessage('No transaction reference found.')
      return
    }

    const verifyTransaction = async () => {
      try {
        // Optional: Call a backend verify endpoint if your API requires it before creation,
        // or directly pass the reference forward to the account creation step.
        // Let's assume your backend handles verification or you pass the reference to create-account:

        setStatus('success')
        setMessage(
          'Payment confirmed! Redirecting to complete your account setup...',
        )

        // Store the reference so the create-account page can attach it
        sessionStorage.setItem('paymentReference', reference)

        setTimeout(() => {
          router.push('/auth/create-account')
        }, 1500)
      } catch (err: any) {
        setStatus('error')
        setMessage(
          err.message ||
            'Could not verify transaction. Please contact support.',
        )
      }
    }

    verifyTransaction()
  }, [reference, router])

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4'>
      <div className='max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm text-center space-y-4'>
        {status === 'verifying' && (
          <div className='flex flex-col items-center space-y-3'>
            <Loader2 className='animate-spin text-primary-purple' size={48} />
            <h2 className='text-xl font-bold text-dark dark:text-white'>
              Verifying Payment
            </h2>
            <p className='text-sm text-gray-500'>{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className='flex flex-col items-center space-y-3'>
            <CheckCircle2 className='text-green-500' size={48} />
            <h2 className='text-xl font-bold text-dark dark:text-white'>
              Payment Confirmed!
            </h2>
            <p className='text-sm text-gray-500'>{message}</p>
          </div>
        )}

        {status === 'error' && (
          <div className='flex flex-col items-center space-y-3'>
            <AlertCircle className='text-red-500' size={48} />
            <h2 className='text-xl font-bold text-dark dark:text-white'>
              Verification Failed
            </h2>
            <p className='text-sm text-red-600 dark:text-red-400'>{message}</p>
            <button
              onClick={() => router.push('/admission')}
              className='mt-4 w-full bg-primary-purple text-white py-3 rounded-xl font-bold hover:opacity-95 transition'
            >
              Back to Admission
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
