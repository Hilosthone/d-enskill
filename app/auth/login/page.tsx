// 'use client'
// import { useState, FormEvent } from 'react'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'
// import { Eye, EyeOff } from 'lucide-react'
// import { apiClient } from '@/services/api'

// export default function LoginPage() {
//   const router = useRouter()
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [showPassword, setShowPassword] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [isLoading, setIsLoading] = useState(false)

//   const handleLogin = async (e: FormEvent) => {
//     e.preventDefault()
//     setError(null)
//     setIsLoading(true)

//     try {
//       // 1. Check for Admin Credentials (Mr. Julius)
//       if (
//         email.trim() === 'admin@denskill.com' &&
//         password === 'admin@denskill'
//       ) {
//         sessionStorage.setItem('adminAuth', 'true')
//         sessionStorage.setItem('isLoggedIn', 'true')
//         router.push('/admin/dashboard')
//         return
//       }

//       // 2. Authenticate against the real backend signin endpoint
//       const response = await apiClient.signin({ email, password })

//       if (
//         response.error ||
//         response.statusCode >= 400 ||
//         (!response.token && !response.accessToken && !response.success)
//       ) {
//         throw new Error(
//           response.message || 'Invalid email or password. Please try again.',
//         )
//       }

//       // Mark user session as logged in
//       sessionStorage.setItem('isLoggedIn', 'true')

//       // If user details are returned, cache them or redirect directly to the student dashboard
//       if (response.user) {
//         sessionStorage.setItem(
//           'pendingRegistration',
//           JSON.stringify(response.user),
//         )
//       } else {
//         sessionStorage.setItem('pendingRegistration', JSON.stringify({ email }))
//       }

//       router.push('/student/dashboard')
//     } catch (err: any) {
//       setError(err.message || 'Invalid email or password. Please try again.')
//       setIsLoading(false)
//     }
//   }

//   const inputClass =
//     'w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-dark dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple'

//   return (
//     <div className='min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 flex items-center justify-center'>
//       <div className='max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6'>
//         <div className='border-b pb-4 dark:border-gray-800'>
//           <span className='text-xs font-semibold text-primary-purple uppercase tracking-wider'>
//             D Enskill AMS
//           </span>
//           <h2 className='text-2xl font-bold text-dark dark:text-white mt-1'>
//             Portal Login
//           </h2>
//         </div>

//         {error && (
//           <div className='p-3 bg-red-500/10 border border-red-500 text-red-600 text-sm rounded-lg font-medium'>
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleLogin} className='space-y-4'>
//           <div>
//             <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
//               Email Address
//             </label>
//             <input
//               type='email'
//               required
//               className={inputClass}
//               placeholder='name@example.com'
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>

//           <div>
//             <div className='flex justify-between items-center mb-1'>
//               <label className='text-xs font-semibold text-gray-600 dark:text-gray-400'>
//                 Password
//               </label>
//               <Link
//                 href='/auth/reset-password'
//                 className='text-xs text-primary-purple hover:underline'
//               >
//                 Forgot password?
//               </Link>
//             </div>

//             {/* Input with Toggle Eye Button */}
//             <div className='relative'>
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 required
//                 className={`${inputClass} pr-10`}
//                 placeholder='••••••••'
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//               <button
//                 type='button'
//                 onClick={() => setShowPassword(!showPassword)}
//                 className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition cursor-pointer'
//                 aria-label={showPassword ? 'Hide password' : 'Show password'}
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//           </div>

//           <button
//             type='submit'
//             disabled={isLoading}
//             className='w-full bg-primary-purple text-white py-4 rounded-xl font-bold hover:opacity-95 transition-all shadow-lg shadow-primary-purple/25 cursor-pointer'
//           >
//             {isLoading ? 'Authenticating...' : 'Sign In to Dashboard ➔'}
//           </button>
//         </form>

//         <div className='text-center text-xs text-gray-500 pt-2 border-t dark:border-gray-800'>
//           New student?{' '}
//           <Link
//             href='/admission'
//             className='text-primary-purple font-semibold hover:underline'
//           >
//             Register and apply here
//           </Link>
//         </div>
//       </div>
//     </div>
//   )
// }

'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { apiClient } from '@/services/api'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // 1. Authenticate against the real backend admin login endpoint first
      const adminResponse = await apiClient.adminLogin({ email, password })

      if (
        !adminResponse.error &&
        adminResponse.statusCode !== 401 &&
        (adminResponse.token ||
          adminResponse.accessToken ||
          adminResponse.success)
      ) {
        sessionStorage.setItem('adminAuth', 'true')
        sessionStorage.setItem('isLoggedIn', 'true')
        router.push('/admin/dashboard')
        return
      }

      // 2. If not an admin, authenticate against the regular user signin endpoint
      const response = await apiClient.signin({ email, password })

      if (
        response.error ||
        response.statusCode >= 400 ||
        (!response.token && !response.accessToken && !response.success)
      ) {
        throw new Error(
          response.message || 'Invalid email or password. Please try again.',
        )
      }

      // Mark user session as logged in
      sessionStorage.setItem('isLoggedIn', 'true')

      // If user details are returned, cache them or redirect directly to the student dashboard
      if (response.user) {
        sessionStorage.setItem(
          'pendingRegistration',
          JSON.stringify(response.user),
        )
      } else {
        sessionStorage.setItem('pendingRegistration', JSON.stringify({ email }))
      }

      router.push('/student/dashboard')
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.')
      setIsLoading(false)
    }
  }

  const inputClass =
    'w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-dark dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple'

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 flex items-center justify-center'>
      <div className='max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6'>
        <div className='border-b pb-4 dark:border-gray-800'>
          <span className='text-xs font-semibold text-primary-purple uppercase tracking-wider'>
            D Enskill AMS
          </span>
          <h2 className='text-2xl font-bold text-dark dark:text-white mt-1'>
            Portal Login
          </h2>
        </div>

        {error && (
          <div className='p-3 bg-red-500/10 border border-red-500 text-red-600 text-sm rounded-lg font-medium'>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className='space-y-4'>
          <div>
            <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
              Email Address
            </label>
            <input
              type='email'
              required
              className={inputClass}
              placeholder='name@example.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <div className='flex justify-between items-center mb-1'>
              <label className='text-xs font-semibold text-gray-600 dark:text-gray-400'>
                Password
              </label>
              <Link
                href='/auth/reset-password'
                className='text-xs text-primary-purple hover:underline'
              >
                Forgot password?
              </Link>
            </div>

            {/* Input with Toggle Eye Button */}
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
            {isLoading ? 'Authenticating...' : 'Sign In to Dashboard ➔'}
          </button>
        </form>

        <div className='text-center text-xs text-gray-500 pt-2 border-t dark:border-gray-800'>
          New student?{' '}
          <Link
            href='/admission'
            className='text-primary-purple font-semibold hover:underline'
          >
            Register and apply here
          </Link>
        </div>
      </div>
    </div>
  )
}