// //src/app/auth/login/page.tsx
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
//       // 1. Authenticate against the real backend admin login endpoint first
//       const adminResponse = await apiClient.adminLogin({ email, password })

//       if (
//         !adminResponse.error &&
//         adminResponse.statusCode !== 401 &&
//         (adminResponse.token ||
//           adminResponse.accessToken ||
//           adminResponse.success)
//       ) {
//         sessionStorage.setItem('adminAuth', 'true')
//         sessionStorage.setItem('isLoggedIn', 'true')
//         router.push('/admin/dashboard')
//         return
//       }

//       // 2. If not an admin, authenticate against the regular user signin endpoint
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


// src/app/auth/login/page.tsx
'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, PartyPopper, Loader2 } from 'lucide-react'
import { apiClient } from '@/services/api'

export default function LoginPage() {
  const router = useRouter()
  const [loginType, setLoginType] = useState<'standard' | 'scholarship'>('standard')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      if (loginType === 'scholarship') {
        // Handle Scholarship Student Login
        const res = await apiClient.signinScholarship({ email, password })
        if (res && (res.token || res.accessToken || res.success || res.data)) {
          const token = res.token || res.accessToken || res.data?.token || res.data?.accessToken
          if (token) localStorage.setItem('token', token)
          
          setIsSuccess(true)
          setTimeout(() => {
            router.push('/student/dashboard')
          }, 2500)
          return
        } else {
          throw new Error(res?.message || res?.error || 'Invalid scholarship credentials.')
        }
      } else {
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
          
          setIsSuccess(true)
          setTimeout(() => {
            router.push('/admin/dashboard')
          }, 2500)
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

        if (response.user) {
          sessionStorage.setItem(
            'pendingRegistration',
            JSON.stringify(response.user),
          )
        } else {
          sessionStorage.setItem('pendingRegistration', JSON.stringify({ email }))
        }

        setIsSuccess(true)
        setTimeout(() => {
          router.push('/student/dashboard')
        }, 2500)
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.')
      setIsLoading(false)
    }
  }

  const inputClass =
    'w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-dark dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple transition-colors'

  // Success Celebration View (Triggers for Admin, Standard & Scholarship logins)
  if (isSuccess) {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center items-center px-4 relative overflow-hidden'>
        {/* Floating Celebration Balloons */}
        <div className='absolute inset-0 pointer-events-none overflow-hidden'>
          {[
            { color: 'bg-purple-500', left: '15%', delay: '0s', duration: '3s' },
            { color: 'bg-pink-500', left: '30%', delay: '0.4s', duration: '2.5s' },
            { color: 'bg-indigo-500', left: '50%', delay: '0.2s', duration: '3.2s' },
            { color: 'bg-green-500', left: '70%', delay: '0.6s', duration: '2.8s' },
            { color: 'bg-yellow-500', left: '85%', delay: '0.1s', duration: '3s' },
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
              Welcome Back! 🎉
            </h1>
            <p className='text-xs text-gray-500 dark:text-gray-400'>
              Authentication successful. Setting up your secure session dashboard...
            </p>
          </div>
          <div className='flex items-center justify-center gap-2 text-xs text-primary-purple font-semibold pt-2'>
            <Loader2 size={16} className='animate-spin' /> Redirecting to Dashboard...
          </div>
        </div>

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
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 flex items-center justify-center'>
      <div className='max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6'>
        <div className='border-b pb-4 dark:border-gray-800 space-y-3'>
          <div className='flex justify-between items-center'>
            <span className='text-xs font-semibold text-primary-purple uppercase tracking-wider'>
              D Enskill AMS
            </span>
            {/* Account Type Switcher Tabs */}
            <div className='flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg text-[11px] font-medium'>
              <button
                type='button'
                onClick={() => setLoginType('standard')}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  loginType === 'standard'
                    ? 'bg-white dark:bg-gray-900 text-primary-purple shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Standard
              </button>
              <button
                type='button'
                onClick={() => setLoginType('scholarship')}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  loginType === 'scholarship'
                    ? 'bg-white dark:bg-gray-900 text-primary-purple shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Scholarship
              </button>
            </div>
          </div>
          
          <h2 className='text-2xl font-bold text-dark dark:text-white mt-1'>
            {loginType === 'scholarship' ? 'Scholarship Portal Login' : 'Portal Login'}
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
            className='w-full bg-primary-purple text-white py-4 rounded-xl font-bold hover:opacity-95 transition-all shadow-lg shadow-primary-purple/25 cursor-pointer flex items-center justify-center gap-2'
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className='animate-spin' /> Authenticating...
              </>
            ) : (
              <>
                {loginType === 'scholarship' ? 'Sign In to Scholarship ➔' : 'Sign In to Dashboard ➔'}
              </>
            )}
          </button>
        </form>

        <div className='text-center text-xs text-gray-500 pt-2 border-t dark:border-gray-800 space-y-1'>
          {loginType === 'scholarship' ? (
            <p>
              Don't have a scholarship account?{' '}
              <Link
                href='/scholarship/signup'
                className='text-primary-purple font-semibold hover:underline'
              >
                Sign up here
              </Link>
            </p>
          ) : (
            <p>
              New student?{' '}
              <Link
                href='/admission'
                className='text-primary-purple font-semibold hover:underline'
              >
                Register and apply here
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}