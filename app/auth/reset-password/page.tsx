'use client'
import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { Loader2, Mail, ArrowRight, CheckCircle2 } from 'lucide-react'
import { apiClient } from '@/services/api'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleReset = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await apiClient.forgotPassword({ email })
      if (
        response &&
        (response.message || response.success || response.status)
      ) {
        setSubmitted(true)
      } else {
        setErrorMessage(
          response?.error ||
            response?.message ||
            'Failed to send reset link. Please check your email.',
        )
      }
    } catch (err: any) {
      setErrorMessage(
        err?.message || 'Network error occurred. Please try again.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  const inputClass =
    'w-full pl-10 pr-3 py-3 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-dark dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple transition-colors'

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 flex items-center justify-center'>
      <div className='max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6'>
        <div className='border-b pb-4 dark:border-gray-800'>
          <span className='text-xs font-semibold text-primary-purple uppercase tracking-wider'>
            Account Recovery
          </span>
          <h2 className='text-2xl font-bold text-dark dark:text-white mt-1'>
            Reset Password
          </h2>
        </div>

        {errorMessage && (
          <div className='p-3 bg-red-500/10 border border-red-500 text-red-600 text-xs rounded-xl font-medium'>
            {errorMessage}
          </div>
        )}

        {submitted ? (
          <div className='space-y-4 text-center'>
            <div className='p-4 bg-green-500/10 border border-green-500 text-green-600 text-xs rounded-xl font-medium flex items-center justify-center gap-2'>
              <CheckCircle2 size={18} className='shrink-0' />
              <span>
                Password reset instructions have been sent to{' '}
                <strong>{email}</strong>. Check your inbox.
              </span>
            </div>
            <Link
              href='/auth/login'
              className='block w-full py-3 bg-primary-purple text-white rounded-xl font-bold text-xs hover:opacity-95 transition-all shadow-md'
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReset} className='space-y-4'>
            <p className='text-xs text-gray-600 dark:text-gray-400'>
              Enter your registered account email address and we will send you a
              secure link to reset your password.
            </p>

            <div>
              <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                Email Address
              </label>
              <div className='relative'>
                <span className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400'>
                  <Mail size={16} />
                </span>
                <input
                  type='email'
                  required
                  className={inputClass}
                  placeholder='name@example.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              type='submit'
              disabled={isLoading}
              className='w-full bg-primary-purple text-white py-3 rounded-xl font-bold text-xs hover:opacity-95 transition-all shadow-md shadow-primary-purple/20 flex items-center justify-center gap-2 cursor-pointer'
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className='animate-spin' />
                  <span>Sending Reset Link...</span>
                </>
              ) : (
                <>
                  <span>Send Reset Instructions</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>

            <div className='text-center text-xs text-gray-500 pt-2'>
              Remembered your password?{' '}
              <Link
                href='/auth/login'
                className='text-primary-purple font-semibold hover:underline'
              >
                Sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
