// src/app/auth/tutors-login/page.tsx
'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { GraduationCap, Lock, Mail, Loader2, AlertCircle } from 'lucide-react'
import { apiClient } from '@/services/api'

export default function TutorLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await apiClient.tutorLogin({ email, password })

      // Extract token safely from any possible response structure
      const token =
        response?.token ||
        response?.accessToken ||
        response?.data?.token ||
        response?.data?.accessToken

      if (token) {
        // Save under all standard keys to prevent layout guard mismatches
        localStorage.setItem('denskill_token', token)
        localStorage.setItem('denskill_tutor_token', token)
        localStorage.setItem('tutor_token', token)
      }

      // Set explicit flags so the tutor layout recognizes the active role
      localStorage.setItem('denskill_tutor_logged', 'true')
      localStorage.setItem('user_role', 'tutor')

      router.push('/tutors')
    } catch (err: any) {
      setError(err?.message || 'Invalid tutor credentials. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const inputClass =
    'w-full p-3.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-dark dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple text-sm'

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4'>
      <div className='max-w-md w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-xl space-y-6'>
        <div className='text-center space-y-2'>
          <div className='w-14 h-14 bg-primary-purple/10 text-primary-purple rounded-2xl flex items-center justify-center mx-auto shadow-sm'>
            <GraduationCap size={28} />
          </div>
          <h1 className='text-2xl font-bold text-dark dark:text-white'>
            Tutor Portal
          </h1>
          <p className='text-xs text-gray-500'>
            Sign in to manage courses, grade assessments, and track cohort
            progress.
          </p>
        </div>

        {error && (
          <div className='p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs flex items-center gap-2'>
            <AlertCircle size={16} className='shrink-0' />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className='space-y-4'>
          <div>
            <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5'>
              Email Address
            </label>
            <div className='relative'>
              <input
                type='email'
                required
                placeholder='tutor@denskill.com'
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Mail
                size={16}
                className='absolute right-3.5 top-4 text-gray-400'
              />
            </div>
          </div>

          <div>
            <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5'>
              Password
            </label>
            <div className='relative'>
              <input
                type='password'
                required
                placeholder='••••••••••••'
                className={inputClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Lock
                size={16}
                className='absolute right-3.5 top-4 text-gray-400'
              />
            </div>
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className='w-full py-3.5 rounded-xl bg-primary-purple hover:bg-primary-purple/90 text-white font-semibold text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50'
          >
            {isLoading ? (
              <Loader2 size={18} className='animate-spin' />
            ) : (
              'Sign In to Portal'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
