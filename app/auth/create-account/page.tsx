//src/app/auth/create-account/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react'
import { apiClient } from '@/services/api'

export default function CreateAccountPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // UI states
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const paymentRef = sessionStorage.getItem('paymentReference')
    const data = sessionStorage.getItem('pendingRegistration')
    
    if (!paymentRef || !data) {
      router.push('/admission')
    } else {
      const parsedData = JSON.parse(data)
      setEmail(parsedData.email || '')
      setName(parsedData.fullName || parsedData.name || 'Student')
    }
  }, [router])

  // Password criteria checkers
  const hasMinLength = password.length >= 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password)

  const isPasswordStrong =
    hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!isPasswordStrong) {
      setError('Please ensure your password meets all safety criteria below.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsSubmitting(true)
    try {
      // 1. Call real backend signup endpoint
      const response = await apiClient.signup({
        name,
        email,
        password,
      })

      if (response.error || response.statusCode >= 400) {
        throw new Error(
          response.message || 'Failed to create account on server.',
        )
      }

      // 2. Clear sensitive or pending registration storage
      sessionStorage.removeItem('paymentReference')
      sessionStorage.removeItem('pendingRegistration')

      // 3. Redirect to login
      router.push('/auth/login')
    } catch (err: any) {
      setError(
        err.message ||
          'An error occurred during registration. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass =
    'w-full p-3 pr-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-dark dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple'

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 flex items-center justify-center'>
      <div className='max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6'>
        <div className='border-b pb-4 dark:border-gray-800'>
          <span className='text-xs font-semibold text-primary-purple uppercase tracking-wider'>
            Finalizing Admission
          </span>
          <h2 className='text-2xl font-bold text-dark dark:text-white mt-1'>
            Create Account Password
          </h2>
        </div>

        {error && (
          <div className='p-3 bg-red-500/10 border border-red-500 text-red-600 text-sm rounded-lg font-medium'>
            {error}
          </div>
        )}

        <form onSubmit={handleCreateAccount} className='space-y-4'>
          <div>
            <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
              Registered Email
            </label>
            <input
              type='email'
              disabled
              className={`${inputClass} opacity-60 cursor-not-allowed`}
              value={email}
            />
          </div>

          {/* New Password Field */}
          <div>
            <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
              New Password
            </label>
            <div className='relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className={inputClass}
                placeholder='Enter strong password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password Strength Checklist */}
            {password && (
              <div className='mt-3 p-3 bg-gray-50 dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 space-y-1.5 text-xs'>
                <p className='font-semibold text-gray-700 dark:text-gray-300 mb-1'>
                  Password Requirements:
                </p>
                <div
                  className={`flex items-center gap-2 ${hasMinLength ? 'text-green-600' : 'text-gray-400'}`}
                >
                  {hasMinLength ? (
                    <CheckCircle2 size={14} />
                  ) : (
                    <XCircle size={14} />
                  )}{' '}
                  At least 8 characters
                </div>
                <div
                  className={`flex items-center gap-2 ${hasUpperCase ? 'text-green-600' : 'text-gray-400'}`}
                >
                  {hasUpperCase ? (
                    <CheckCircle2 size={14} />
                  ) : (
                    <XCircle size={14} />
                  )}{' '}
                  At least one uppercase letter (A-Z)
                </div>
                <div
                  className={`flex items-center gap-2 ${hasLowerCase ? 'text-green-600' : 'text-gray-400'}`}
                >
                  {hasLowerCase ? (
                    <CheckCircle2 size={14} />
                  ) : (
                    <XCircle size={14} />
                  )}{' '}
                  At least one lowercase letter (a-z)
                </div>
                <div
                  className={`flex items-center gap-2 ${hasNumber ? 'text-green-600' : 'text-gray-400'}`}
                >
                  {hasNumber ? (
                    <CheckCircle2 size={14} />
                  ) : (
                    <XCircle size={14} />
                  )}{' '}
                  At least one number (0-9)
                </div>
                <div
                  className={`flex items-center gap-2 ${hasSpecialChar ? 'text-green-600' : 'text-gray-400'}`}
                >
                  {hasSpecialChar ? (
                    <CheckCircle2 size={14} />
                  ) : (
                    <XCircle size={14} />
                  )}{' '}
                  At least one special character (!@#$...)
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
              Confirm Password
            </label>
            <div className='relative'>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                className={inputClass}
                placeholder='Re-enter password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type='button'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className='absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Real-time match text indicator */}
            {confirmPassword && (
              <p
                className={`mt-1.5 text-xs font-medium ${password === confirmPassword ? 'text-green-600' : 'text-red-500'}`}
              >
                {password === confirmPassword
                  ? '✓ Passwords match'
                  : '✕ Passwords do not match'}
              </p>
            )}
          </div>

          <button
            type='submit'
            disabled={isSubmitting}
            className='w-full bg-primary-purple text-white py-4 rounded-xl font-bold hover:opacity-95 transition-all shadow-lg shadow-primary-purple/20'
          >
            {isSubmitting
              ? 'Provisioning Account...'
              : 'Complete Setup & Proceed to Login ➔'}
          </button>
        </form>

        <div className='text-center text-xs text-gray-500 pt-2'>
          Already have an account?{' '}
          <Link
            href='/auth/login'
            className='text-primary-purple font-semibold hover:underline'
          >
            Login here
          </Link>
        </div>
      </div>
    </div>
  )
}