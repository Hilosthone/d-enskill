// src/app/verify/page.tsx
'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { apiClient } from '@/services/api'

function VerifyContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const reference = searchParams.get('reference') || searchParams.get('trxref')

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>(
    'verifying',
  )
  const [message, setMessage] = useState(
    'Verifying your payment transaction with the server...',
  )

  useEffect(() => {
    let isMounted = true

    async function verifyPayment() {
      if (!reference) {
        if (isMounted) {
          setStatus('error')
          setMessage('No transaction reference found.')
        }
        return
      }

      try {
        // Call your actual backend endpoint method: verifyEnrollment
        const response = await apiClient.verifyEnrollment(reference)

        if (!isMounted) return

        if (
          response.error ||
          response.statusCode >= 400 ||
          response.success === false
        ) {
          throw new Error(
            response.message || 'Payment verification failed on server.',
          )
        }

        setStatus('success')
        setMessage(
          'Payment confirmed! Redirecting to complete your account setup...',
        )
        sessionStorage.setItem('paymentReference', reference)

        const timer = setTimeout(() => {
          router.push('/auth/create-account')
        }, 1500)

        return () => clearTimeout(timer)
      } catch (err: any) {
        if (!isMounted) return
        setStatus('error')
        setMessage(err.message || 'Could not verify payment transaction.')
      }
    }

    verifyPayment()

    return () => {
      isMounted = false
    }
  }, [reference, router])

  return (
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
            className='mt-4 w-full bg-primary-purple text-white py-3 rounded-xl font-bold hover:opacity-95 transition cursor-pointer'
          >
            Back to Admission
          </button>
        </div>
      )}
    </div>
  )
}

export default function VerifyPaymentPage() {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4'>
      <Suspense
        fallback={
          <Loader2 className='animate-spin text-primary-purple' size={48} />
        }
      >
        <VerifyContent />
      </Suspense>
    </div>
  )
}
