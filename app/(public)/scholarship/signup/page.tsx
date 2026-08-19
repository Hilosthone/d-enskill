'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  UserPlus,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react'
import { apiClient } from '@/services/api'

export default function ScholarshipSignupPage() {
  const router = useRouter()
  const [cohorts, setCohorts] = useState<any[]>([])
  const [isLoadingCohorts, setIsLoadingCohorts] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    cohort_id: 1,
  })

  useEffect(() => {
    const fetchCohorts = async () => {
      try {
        const res = await apiClient.getActiveScholarshipCohorts()
        const list = Array.isArray(res) ? res : res?.cohorts || res?.data || []
        setCohorts(list)
        if (list.length > 0) {
          setFormData((prev) => ({
            ...prev,
            cohort_id: Number(list[0].id || list[0]._id || 1),
          }))
        }
      } catch (err) {
        console.error('Failed to fetch cohorts', err)
      } finally {
        setIsLoadingCohorts(false)
      }
    }
    fetchCohorts()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'cohort_id' ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg(null)

    try {
      const res = await apiClient.signupScholarship(formData)
      if (res && (res.success || res.message || res.id)) {
        setSuccessMsg(
          'Account registered successfully! Redirecting to login...',
        )
        setTimeout(() => {
          router.push('/scholarship/login')
        }, 2000)
      } else {
        setErrorMsg(res?.message || res?.error || 'Registration failed.')
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during registration.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className='py-20 px-6 max-w-md mx-auto space-y-8'>
      <div className='text-center space-y-2'>
        <div className='w-12 h-12 bg-primary-purple/10 text-primary-purple rounded-2xl flex items-center justify-center mx-auto'>
          <UserPlus size={24} />
        </div>
        <h1 className='text-2xl font-bold text-dark dark:text-white'>
          Create Scholarship Account
        </h1>
        <p className='text-xs text-gray-500'>
          Register your portal credentials for your scholarship program.
        </p>
      </div>

      {successMsg && (
        <div className='p-4 bg-green-500/10 border border-green-500 text-green-600 text-xs rounded-xl flex items-center gap-2 font-medium'>
          <CheckCircle2 size={16} />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className='p-4 bg-red-500/10 border border-red-500 text-red-600 text-xs rounded-xl flex items-center gap-2 font-medium'>
          <AlertCircle size={16} />
          {errorMsg}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className='bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6 text-xs'
      >
        <div className='space-y-1.5'>
          <label className='font-bold text-dark dark:text-white'>
            Full Name *
          </label>
          <input
            type='text'
            name='name'
            required
            value={formData.name}
            onChange={handleChange}
            placeholder='John Doe'
            className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white focus:outline-none focus:border-primary-purple'
          />
        </div>

        <div className='space-y-1.5'>
          <label className='font-bold text-dark dark:text-white'>
            Email Address *
          </label>
          <input
            type='email'
            name='email'
            required
            value={formData.email}
            onChange={handleChange}
            placeholder='john@example.com'
            className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white focus:outline-none focus:border-primary-purple'
          />
        </div>

        <div className='space-y-1.5'>
          <label className='font-bold text-dark dark:text-white'>
            Password *
          </label>
          <input
            type='password'
            name='password'
            required
            value={formData.password}
            onChange={handleChange}
            placeholder='••••••••'
            className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white focus:outline-none focus:border-primary-purple'
          />
        </div>

        <div className='space-y-1.5'>
          <label className='font-bold text-dark dark:text-white'>
            Select Cohort *
          </label>
          {isLoadingCohorts ? (
            <div className='p-3 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-400'>
              Loading cohorts...
            </div>
          ) : (
            <select
              name='cohort_id'
              required
              value={formData.cohort_id}
              onChange={handleChange}
              className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white focus:outline-none focus:border-primary-purple'
            >
              {cohorts.map((c) => (
                <option key={c.id || c._id} value={c.id || c._id}>
                  {c.name || c.title || `Cohort #${c.id}`}
                </option>
              ))}
            </select>
          )}
        </div>

        <button
          type='submit'
          disabled={isLoading}
          className='w-full py-3.5 bg-primary-purple text-white font-bold rounded-xl shadow-md hover:opacity-95 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer'
        >
          {isLoading ? (
            <Loader2 size={16} className='animate-spin' />
          ) : (
            <ArrowRight size={16} />
          )}
          Sign Up
        </button>

        <div className='text-center pt-2'>
          <p className='text-gray-500'>
            Already have an account?{' '}
            <Link
              href='/scholarship/login'
              className='text-primary-purple font-bold hover:underline'
            >
              Log in
            </Link>
          </p>
        </div>
      </form>
    </main>
  )
}
