// src/app/(public)/scholarship/signup/page.tsx
'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  UserPlus,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  PartyPopper,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react'
import { apiClient } from '@/services/api'

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const emailParam = searchParams.get('email') || ''
  const cohortParam = searchParams.get('cohortId') || ''

  const [cohorts, setCohorts] = useState<any[]>([])
  const [isLoadingCohorts, setIsLoadingCohorts] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Visibility states for password fields
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: emailParam,
    password: '',
    confirmPassword: '',
    cohort_id: cohortParam,
  })

  // Keep email/cohort updated if search params change post-hydration
  useEffect(() => {
    if (emailParam || cohortParam) {
      setFormData((prev) => ({
        ...prev,
        email: emailParam || prev.email,
        cohort_id: cohortParam || prev.cohort_id,
      }))
    }
  }, [emailParam, cohortParam])

  useEffect(() => {
    const fetchCohorts = async () => {
      try {
        const res = await apiClient.getActiveScholarshipCohorts()
        const list = Array.isArray(res) ? res : res?.cohorts || res?.data || []
        setCohorts(list)

        // Default to the first cohort if none was passed via URL params
        if (list.length > 0 && !cohortParam) {
          const firstId = list[0].id || list[0]._id || ''
          setFormData((prev) => ({
            ...prev,
            cohort_id: firstId,
          }))
        }
      } catch (err) {
        console.error('Failed to fetch cohorts', err)
      } finally {
        setIsLoadingCohorts(false)
      }
    }
    fetchCohorts()
  }, [cohortParam])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg(null)

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match. Please check and try again.')
      setIsLoading(false)
      return
    }

    try {
      const res = await apiClient.signupScholarship({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        cohort_id: Number(formData.cohort_id),
      })

      if (res && (res.success || res.message || res.id)) {
        setIsSuccess(true)
        setTimeout(() => {
          router.push('/scholarship/login')
        }, 3000) // 3 seconds celebration animation before redirecting
      } else {
        setErrorMsg(res?.message || res?.error || 'Registration failed.')
        setIsLoading(false)
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during registration.')
      setIsLoading(false)
    }
  }

  // Success Celebration View
  if (isSuccess) {
    return (
      <main className='min-h-[80vh] flex flex-col justify-center items-center px-4 relative overflow-hidden'>
        {/* Floating Celebration Balloons */}
        <div className='absolute inset-0 pointer-events-none overflow-hidden'>
          {[
            {
              color: 'bg-purple-500',
              left: '15%',
              delay: '0s',
              duration: '3s',
            },
            {
              color: 'bg-pink-500',
              left: '30%',
              delay: '0.4s',
              duration: '2.5s',
            },
            {
              color: 'bg-indigo-500',
              left: '50%',
              delay: '0.2s',
              duration: '3.2s',
            },
            {
              color: 'bg-green-500',
              left: '70%',
              delay: '0.6s',
              duration: '2.8s',
            },
            {
              color: 'bg-yellow-500',
              left: '85%',
              delay: '0.1s',
              duration: '3s',
            },
          ].map((balloon, index) => (
            <div
              key={index}
              className={`absolute bottom-0 w-10 h-14 rounded-full ${balloon.color} opacity-80 flex items-center justify-center shadow-lg`}
              style={{
                left: balloon.left,
                animationDuration: balloon.duration,
                animationDelay: balloon.delay,
                animationName: 'floatUp',
                animationFillMode: 'forwards',
                animationTimingFunction: 'ease-out',
              }}
            >
              <div className='w-0.5 h-8 bg-gray-400 absolute top-full'></div>
            </div>
          ))}
        </div>

        {/* Card Content */}
        <div className='max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-8 text-center space-y-6 relative z-10'>
          <div className='w-16 h-16 bg-primary-purple/15 text-primary-purple rounded-full flex items-center justify-center mx-auto animate-bounce'>
            <PartyPopper size={36} />
          </div>
          <div className='space-y-2'>
            <h1 className='text-2xl font-extrabold text-dark dark:text-white'>
              Account Created! 🎉
            </h1>
            <p className='text-xs text-gray-500 dark:text-gray-400'>
              Your scholarship portal credentials have been successfully
              registered. Taking you to login now...
            </p>
          </div>
          <div className='flex items-center justify-center gap-2 text-xs text-primary-purple font-semibold pt-2'>
            <Loader2 size={16} className='animate-spin' /> Redirecting to
            Login...
          </div>
        </div>

        {/* Animation Style */}
        <style jsx>{`
          @keyframes floatUp {
            0% {
              transform: translateY(120vh) scale(0.8);
              opacity: 0;
            }
            50% {
              opacity: 1;
            }
            100% {
              transform: translateY(-20vh) scale(1.1);
              opacity: 0.9;
            }
          }
        `}</style>
      </main>
    )
  }

  // Standard Form View
  return (
    <main className='py-20 px-6 max-w-md mx-auto space-y-8'>
      <div className='text-center space-y-2'>
        <div className='w-12 h-12 bg-primary-purple/10 text-primary-purple rounded-2xl flex items-center justify-center mx-auto shadow-inner'>
          <UserPlus size={24} />
        </div>
        <h1 className='text-2xl font-bold text-dark dark:text-white'>
          Create Scholarship Account
        </h1>
        <p className='text-xs text-gray-500'>
          Register your portal credentials for your scholarship program.
        </p>
      </div>

      {errorMsg && (
        <div className='p-4 bg-red-500/10 border border-red-500 text-red-600 text-xs rounded-xl flex items-center gap-2 font-medium animate-shake'>
          <AlertCircle size={16} className='shrink-0' />
          {errorMsg}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className='bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-5 text-xs'
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
            className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white focus:outline-none focus:border-primary-purple transition-colors'
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
            className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white focus:outline-none focus:border-primary-purple transition-colors'
          />
        </div>

        <div className='space-y-1.5'>
          <label className='font-bold text-dark dark:text-white'>
            Password *
          </label>
          <div className='relative'>
            <input
              type={showPassword ? 'text' : 'password'}
              name='password'
              required
              value={formData.password}
              onChange={handleChange}
              placeholder='••••••••'
              className='w-full p-3 pr-10 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white focus:outline-none focus:border-primary-purple transition-colors'
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition cursor-pointer'
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className='space-y-1.5'>
          <label className='font-bold text-dark dark:text-white'>
            Confirm Password *
          </label>
          <div className='relative'>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name='confirmPassword'
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder='••••••••'
              className={`w-full p-3 pr-10 rounded-xl border bg-gray-50 dark:bg-gray-800 text-dark dark:text-white focus:outline-none transition-colors ${
                formData.confirmPassword &&
                formData.password !== formData.confirmPassword
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-200 dark:border-gray-800 focus:border-primary-purple'
              }`}
            />
            <button
              type='button'
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition cursor-pointer'
              aria-label={
                showConfirmPassword
                  ? 'Hide confirm password'
                  : 'Show confirm password'
              }
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {formData.confirmPassword &&
            formData.password !== formData.confirmPassword && (
              <p className='text-[10px] text-red-500 font-medium'>
                Passwords do not match yet
              </p>
            )}
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
              className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white focus:outline-none focus:border-primary-purple transition-colors'
            >
              {cohorts.map((c) => {
                const cId = c.id || c._id
                return (
                  <option key={cId} value={cId}>
                    {c.name || c.title || `Cohort #${cId}`}
                  </option>
                )
              })}
            </select>
          )}
        </div>

        <button
          type='submit'
          disabled={isLoading}
          className='w-full py-3.5 bg-primary-purple hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-primary-purple/25 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer transition-all'
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className='animate-spin' /> Creating Account...
            </>
          ) : (
            <>
              Sign Up <ArrowRight size={16} />
            </>
          )}
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

export default function ScholarshipSignupPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-gray-50 dark:bg-gray-950 flex justify-center items-center'>
          <Loader2 className='animate-spin text-primary-purple' size={32} />
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  )
}
