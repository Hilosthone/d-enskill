// //src//app/scholarship/login/page.tsx
// 'use client'
// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'
// import {
//   LogIn,
//   Loader2,
//   CheckCircle2,
//   AlertCircle,
//   ArrowRight,
// } from 'lucide-react'
// import { apiClient } from '@/services/api'

// export default function ScholarshipLoginPage() {
//   const router = useRouter()
//   const [isLoading, setIsLoading] = useState(false)
//   const [errorMsg, setErrorMsg] = useState<string | null>(null)
//   const [successMsg, setSuccessMsg] = useState<string | null>(null)

//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   })

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)
//     setErrorMsg(null)

//     try {
//       const res = await apiClient.signinScholarship(formData)
//       if (res && (res.token || res.accessToken || res.success)) {
//         setSuccessMsg('Login successful! Redirecting to student portal...')
//         setTimeout(() => {
//           router.push('/student/dashboard')
//         }, 1500)
//       } else {
//         setErrorMsg(res?.message || res?.error || 'Invalid email or password.')
//       }
//     } catch (err: any) {
//       setErrorMsg(err.message || 'An error occurred during login.')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <main className='py-20 px-6 max-w-md mx-auto space-y-8'>
//       <div className='text-center space-y-2'>
//         <div className='w-12 h-12 bg-primary-purple/10 text-primary-purple rounded-2xl flex items-center justify-center mx-auto'>
//           <LogIn size={24} />
//         </div>
//         <h1 className='text-2xl font-bold text-dark dark:text-white'>
//           Scholarship Portal Login
//         </h1>
//         <p className='text-xs text-gray-500'>
//           Access your courses, mentors, and community dashboard.
//         </p>
//       </div>

//       {successMsg && (
//         <div className='p-4 bg-green-500/10 border border-green-500 text-green-600 text-xs rounded-xl flex items-center gap-2 font-medium'>
//           <CheckCircle2 size={16} />
//           {successMsg}
//         </div>
//       )}

//       {errorMsg && (
//         <div className='p-4 bg-red-500/10 border border-red-500 text-red-600 text-xs rounded-xl flex items-center gap-2 font-medium'>
//           <AlertCircle size={16} />
//           {errorMsg}
//         </div>
//       )}

//       <form
//         onSubmit={handleSubmit}
//         className='bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6 text-xs'
//       >
//         <div className='space-y-1.5'>
//           <label className='font-bold text-dark dark:text-white'>
//             Email Address *
//           </label>
//           <input
//             type='email'
//             name='email'
//             required
//             value={formData.email}
//             onChange={handleChange}
//             placeholder='john@example.com'
//             className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white focus:outline-none focus:border-primary-purple'
//           />
//         </div>

//         <div className='space-y-1.5'>
//           <label className='font-bold text-dark dark:text-white'>
//             Password *
//           </label>
//           <input
//             type='password'
//             name='password'
//             required
//             value={formData.password}
//             onChange={handleChange}
//             placeholder='••••••••'
//             className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white focus:outline-none focus:border-primary-purple'
//           />
//         </div>

//         <button
//           type='submit'
//           disabled={isLoading}
//           className='w-full py-3.5 bg-primary-purple text-white font-bold rounded-xl shadow-md hover:opacity-95 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer'
//         >
//           {isLoading ? (
//             <Loader2 size={16} className='animate-spin' />
//           ) : (
//             <ArrowRight size={16} />
//           )}
//           Log In
//         </button>

//         <div className='text-center pt-2'>
//           <p className='text-gray-500'>
//             Don't have an account?{' '}
//             <Link
//               href='/scholarship/signup'
//               className='text-primary-purple font-bold hover:underline'
//             >
//               Sign up
//             </Link>
//           </p>
//         </div>
//       </form>
//     </main>
//   )
// }


// src/app/scholarship/login/page.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LogIn,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react'
import { apiClient } from '@/services/api'

export default function ScholarshipLoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg(null)

    try {
      const res = await apiClient.signinScholarship(formData)
      
      // Check if login succeeded based on standard API response shapes
      if (res && (res.token || res.accessToken || res.success || res.data)) {
        // Extract and persist token for subsequent protected requests
        const token = res.token || res.accessToken || res.data?.token || res.data?.accessToken
        if (token) {
          localStorage.setItem('token', token)
          // Optional: also save user info if returned
          if (res.user || res.data?.user) {
            localStorage.setItem('user', JSON.stringify(res.user || res.data.user))
          }
        }

        setSuccessMsg('Login successful! Redirecting to student portal...')
        setTimeout(() => {
          router.push('/student/dashboard')
        }, 1500)
      } else {
        setErrorMsg(res?.message || res?.error || 'Invalid email or password.')
        setIsLoading(false)
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during login.')
      setIsLoading(false)
    }
  }

  return (
    <main className='py-20 px-6 max-w-md mx-auto space-y-8'>
      <div className='text-center space-y-2'>
        <div className='w-12 h-12 bg-primary-purple/10 text-primary-purple rounded-2xl flex items-center justify-center mx-auto shadow-inner'>
          <LogIn size={24} />
        </div>
        <h1 className='text-2xl font-bold text-dark dark:text-white'>
          Scholarship Portal Login
        </h1>
        <p className='text-xs text-gray-500'>
          Access your courses, mentors, and community dashboard.
        </p>
      </div>

      {successMsg && (
        <div className='p-4 bg-green-500/10 border border-green-500 text-green-600 text-xs rounded-xl flex items-center gap-2 font-medium animate-fade-in'>
          <CheckCircle2 size={16} />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className='p-4 bg-red-500/10 border border-red-500 text-red-600 text-xs rounded-xl flex items-center gap-2 font-medium animate-shake'>
          <AlertCircle size={16} className='shrink-0' />
          {errorMsg}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className='bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6 text-xs'
      >
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
          <input
            type='password'
            name='password'
            required
            value={formData.password}
            onChange={handleChange}
            placeholder='••••••••'
            className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white focus:outline-none focus:border-primary-purple transition-colors'
          />
        </div>

        <button
          type='submit'
          disabled={isLoading}
          className='w-full py-3.5 bg-primary-purple hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-primary-purple/25 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer transition-all'
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className='animate-spin' /> Logging in...
            </>
          ) : (
            <>
              Log In <ArrowRight size={16} />
            </>
          )}
        </button>

        <div className='text-center pt-2'>
          <p className='text-gray-500'>
            Don't have an account?{' '}
            <Link
              href='/scholarship/signup'
              className='text-primary-purple font-bold hover:underline'
            >
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </main>
  )
}