//src/app/auth/admin-login/page.tsx
'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { apiClient } from '@/services/api'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

const handleAdminLogin = async (e: FormEvent) => {
  e.preventDefault()
  setError(null)
  setIsLoading(true)

  try {
    const response = await apiClient.adminLogin({ email, password })

    // Check if response indicates success or contains a token
    const token = response.token || response.accessToken
    if (!response.success && !token) {
      throw new Error(
        response.message ||
          'Invalid administrator credentials. Please try again.',
      )
    }

    // Explicitly store the token so protected API calls include Bearer token auth
    if (token) {
      localStorage.setItem('denskill_token', token)
    }

    // Mark admin session as authenticated
    sessionStorage.setItem('adminAuth', 'true')
    sessionStorage.setItem('isLoggedIn', 'true')

    router.push('/admin/dashboard')
  } catch (err: any) {
    setError(
      err.message || 'Invalid administrator credentials. Please try again.',
    )
    setIsLoading(false)
  }
}

  const inputClass =
    'w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-dark dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple'

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 flex items-center justify-center'>
      <div className='max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6'>
        <div className='border-b pb-4 dark:border-gray-800 flex items-center gap-3'>
          <div className='p-2.5 bg-primary-purple/10 text-primary-purple rounded-xl'>
            <ShieldCheck size={24} />
          </div>
          <div>
            <span className='text-xs font-semibold text-primary-purple uppercase tracking-wider'>
              D Enskill AMS
            </span>
            <h2 className='text-2xl font-bold text-dark dark:text-white mt-0.5'>
              Admin Portal
            </h2>
          </div>
        </div>

        {error && (
          <div className='p-3 bg-red-500/10 border border-red-500 text-red-600 text-sm rounded-lg font-medium'>
            {error}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className='space-y-4'>
          <div>
            <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
              Admin Email Address
            </label>
            <input
              type='email'
              required
              className={inputClass}
              placeholder='admin@denskill.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
              Password
            </label>
            <div className='relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className={`${inputClass} pr-10`}
                placeholder='••••••••'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition cursor-pointer'
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className='w-full bg-primary-purple text-white py-4 rounded-xl font-bold hover:opacity-95 transition-all shadow-lg shadow-primary-purple/25 cursor-pointer'
          >
            {isLoading ? 'Verifying Admin...' : 'Sign In to Admin Dashboard ➔'}
          </button>
        </form>

        <div className='text-center text-xs text-gray-500 pt-2 border-t dark:border-gray-800'>
          Looking for student portal?{' '}
          <Link
            href='/auth/login'
            className='text-primary-purple font-semibold hover:underline'
          >
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  )
}
