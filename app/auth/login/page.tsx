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


// // src/app/auth/login/page.tsx
// 'use client'
// import { useState, FormEvent } from 'react'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'
// import { Eye, EyeOff, PartyPopper, Loader2 } from 'lucide-react'
// import { apiClient } from '@/services/api'

// export default function LoginPage() {
//   const router = useRouter()
//   const [loginType, setLoginType] = useState<'standard' | 'scholarship'>('standard')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [showPassword, setShowPassword] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [isLoading, setIsLoading] = useState(false)
//   const [isSuccess, setIsSuccess] = useState(false)

//   const handleLogin = async (e: FormEvent) => {
//     e.preventDefault()
//     setError(null)
//     setIsLoading(true)

//     try {
//       if (loginType === 'scholarship') {
//         // Handle Scholarship Student Login
//         const res = await apiClient.signinScholarship({ email, password })
//         if (res && (res.token || res.accessToken || res.success || res.data)) {
//           const token = res.token || res.accessToken || res.data?.token || res.data?.accessToken
//           if (token) localStorage.setItem('token', token)
          
//           setIsSuccess(true)
//           setTimeout(() => {
//             router.push('/student/dashboard')
//           }, 2500)
//           return
//         } else {
//           throw new Error(res?.message || res?.error || 'Invalid scholarship credentials.')
//         }
//       } else {
//         // 1. Authenticate against the real backend admin login endpoint first
//         const adminResponse = await apiClient.adminLogin({ email, password })

//         if (
//           !adminResponse.error &&
//           adminResponse.statusCode !== 401 &&
//           (adminResponse.token ||
//             adminResponse.accessToken ||
//             adminResponse.success)
//         ) {
//           sessionStorage.setItem('adminAuth', 'true')
//           sessionStorage.setItem('isLoggedIn', 'true')
          
//           setIsSuccess(true)
//           setTimeout(() => {
//             router.push('/admin/dashboard')
//           }, 2500)
//           return
//         }

//         // 2. If not an admin, authenticate against the regular user signin endpoint
//         const response = await apiClient.signin({ email, password })

//         if (
//           response.error ||
//           response.statusCode >= 400 ||
//           (!response.token && !response.accessToken && !response.success)
//         ) {
//           throw new Error(
//             response.message || 'Invalid email or password. Please try again.',
//           )
//         }

//         // Mark user session as logged in
//         sessionStorage.setItem('isLoggedIn', 'true')

//         if (response.user) {
//           sessionStorage.setItem(
//             'pendingRegistration',
//             JSON.stringify(response.user),
//           )
//         } else {
//           sessionStorage.setItem('pendingRegistration', JSON.stringify({ email }))
//         }

//         setIsSuccess(true)
//         setTimeout(() => {
//           router.push('/student/dashboard')
//         }, 2500)
//       }
//     } catch (err: any) {
//       setError(err.message || 'Invalid email or password. Please try again.')
//       setIsLoading(false)
//     }
//   }

//   const inputClass =
//     'w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-dark dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple transition-colors'

//   // Success Celebration View (Triggers for Admin, Standard & Scholarship logins)
//   if (isSuccess) {
//     return (
//       <div className='min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center items-center px-4 relative overflow-hidden'>
//         {/* Floating Celebration Balloons */}
//         <div className='absolute inset-0 pointer-events-none overflow-hidden'>
//           {[
//             { color: 'bg-purple-500', left: '15%', delay: '0s', duration: '3s' },
//             { color: 'bg-pink-500', left: '30%', delay: '0.4s', duration: '2.5s' },
//             { color: 'bg-indigo-500', left: '50%', delay: '0.2s', duration: '3.2s' },
//             { color: 'bg-green-500', left: '70%', delay: '0.6s', duration: '2.8s' },
//             { color: 'bg-yellow-500', left: '85%', delay: '0.1s', duration: '3s' },
//           ].map((balloon, index) => (
//             <div
//               key={index}
//               className={`absolute bottom-0 w-10 h-14 rounded-full ${balloon.color} opacity-80 flex items-center justify-center shadow-lg`}
//               style={{
//                 left: balloon.left,
//                 animationDuration: balloon.duration,
//                 animationDelay: balloon.delay,
//                 animationName: 'floatUp',
//                 animationFillMode: 'forwards',
//                 animationTimingFunction: 'ease-out',
//               }}
//             >
//               <div className='w-0.5 h-8 bg-gray-400 absolute top-full'></div>
//             </div>
//           ))}
//         </div>

//         {/* Card Content */}
//         <div className='max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-8 text-center space-y-6 relative z-10'>
//           <div className='w-16 h-16 bg-primary-purple/15 text-primary-purple rounded-full flex items-center justify-center mx-auto animate-bounce'>
//             <PartyPopper size={36} />
//           </div>
//           <div className='space-y-2'>
//             <h1 className='text-2xl font-extrabold text-dark dark:text-white'>
//               Welcome Back! 🎉
//             </h1>
//             <p className='text-xs text-gray-500 dark:text-gray-400'>
//               Authentication successful. Setting up your secure session dashboard...
//             </p>
//           </div>
//           <div className='flex items-center justify-center gap-2 text-xs text-primary-purple font-semibold pt-2'>
//             <Loader2 size={16} className='animate-spin' /> Redirecting to Dashboard...
//           </div>
//         </div>

//         <style jsx>{`
//           @keyframes floatUp {
//             0% {
//               transform: translateY(120vh) scale(0.8);
//               opacity: 0;
//             }
//             50% {
//               opacity: 1;
//             }
//             100% {
//               transform: translateY(-20vh) scale(1.1);
//               opacity: 0.9;
//             }
//           }
//         `}</style>
//       </div>
//     )
//   }

//   return (
//     <div className='min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 flex items-center justify-center'>
//       <div className='max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6'>
//         <div className='border-b pb-4 dark:border-gray-800 space-y-3'>
//           <div className='flex justify-between items-center'>
//             <span className='text-xs font-semibold text-primary-purple uppercase tracking-wider'>
//               D Enskill AMS
//             </span>
//             {/* Account Type Switcher Tabs */}
//             <div className='flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg text-[11px] font-medium'>
//               <button
//                 type='button'
//                 onClick={() => setLoginType('standard')}
//                 className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
//                   loginType === 'standard'
//                     ? 'bg-white dark:bg-gray-900 text-primary-purple shadow-sm'
//                     : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
//                 }`}
//               >
//                 Standard
//               </button>
//               <button
//                 type='button'
//                 onClick={() => setLoginType('scholarship')}
//                 className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
//                   loginType === 'scholarship'
//                     ? 'bg-white dark:bg-gray-900 text-primary-purple shadow-sm'
//                     : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
//                 }`}
//               >
//                 Scholarship
//               </button>
//             </div>
//           </div>
          
//           <h2 className='text-2xl font-bold text-dark dark:text-white mt-1'>
//             {loginType === 'scholarship' ? 'Scholarship Portal Login' : 'Portal Login'}
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
//             className='w-full bg-primary-purple text-white py-4 rounded-xl font-bold hover:opacity-95 transition-all shadow-lg shadow-primary-purple/25 cursor-pointer flex items-center justify-center gap-2'
//           >
//             {isLoading ? (
//               <>
//                 <Loader2 size={16} className='animate-spin' /> Authenticating...
//               </>
//             ) : (
//               <>
//                 {loginType === 'scholarship' ? 'Sign In to Scholarship ➔' : 'Sign In to Dashboard ➔'}
//               </>
//             )}
//           </button>
//         </form>

//         <div className='text-center text-xs text-gray-500 pt-2 border-t dark:border-gray-800 space-y-1'>
//           {loginType === 'scholarship' ? (
//             <p>
//               Don't have a scholarship account?{' '}
//               <Link
//                 href='/scholarship/signup'
//                 className='text-primary-purple font-semibold hover:underline'
//               >
//                 Sign up here
//               </Link>
//             </p>
//           ) : (
//             <p>
//               New student?{' '}
//               <Link
//                 href='/admission'
//                 className='text-primary-purple font-semibold hover:underline'
//               >
//                 Register and apply here
//               </Link>
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }




// // src/app/auth/login/page.tsx
// 'use client'
// import { useState, FormEvent } from 'react'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'
// import { Eye, EyeOff, PartyPopper, Loader2, ShieldCheck } from 'lucide-react'
// import { apiClient } from '@/services/api'

// export default function UnifiedLoginPage() {
//   const router = useRouter()
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [showPassword, setShowPassword] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [isLoading, setIsLoading] = useState(false)
//   const [isSuccess, setIsSuccess] = useState(false)

//   const handleLogin = async (e: FormEvent) => {
//     e.preventDefault()
//     setError(null)
//     setIsLoading(true)

//     try {
//       // 1. Try Admin Login First
//       try {
//         const adminResponse = await apiClient.adminLogin({ email, password })
//         if (
//           !adminResponse.error &&
//           adminResponse.statusCode !== 401 &&
//           (adminResponse.token || adminResponse.accessToken || adminResponse.success)
//         ) {
//           sessionStorage.setItem('adminAuth', 'true')
//           sessionStorage.setItem('isLoggedIn', 'true')
//           triggerSuccessAndRedirect('/admin/dashboard')
//           return
//         }
//       } catch (_) {
//         // Fall through to next check
//       }

//       // 2. Try Tutor Login
//       try {
//         const tutorResponse = await apiClient.tutorLogin({ email, password })
//         const token =
//           tutorResponse?.token ||
//           tutorResponse?.accessToken ||
//           tutorResponse?.data?.token ||
//           tutorResponse?.data?.accessToken

//         if (token) {
//           localStorage.setItem('denskill_token', token)
//           localStorage.setItem('denskill_tutor_token', token)
//           localStorage.setItem('tutor_token', token)
//           localStorage.setItem('denskill_tutor_logged', 'true')
//           localStorage.setItem('user_role', 'tutor')
//           triggerSuccessAndRedirect('/tutors')
//           return
//         }
//       } catch (_) {
//         // Fall through to next check
//       }

//       // 3. Try Scholarship Student Login
//       try {
//         const res = await apiClient.signinScholarship({ email, password })
//         if (res && (res.token || res.accessToken || res.success || res.data)) {
//           const token = res.token || res.accessToken || res.data?.token || res.data?.accessToken
//           if (token) localStorage.setItem('token', token)
//           triggerSuccessAndRedirect('/student/dashboard')
//           return
//         }
//       } catch (_) {
//         // Fall through to next check
//       }

//       // 4. Finally, try Standard User Login
//       const response = await apiClient.signin({ email, password })

//       if (
//         response.error ||
//         response.statusCode >= 400 ||
//         (!response.token && !response.accessToken && !response.success)
//       ) {
//         throw new Error(
//           response.message || 'Invalid email or password. Please check your credentials and try again.',
//         )
//       }

//       sessionStorage.setItem('isLoggedIn', 'true')

//       if (response.user) {
//         sessionStorage.setItem('pendingRegistration', JSON.stringify(response.user))
//       } else {
//         sessionStorage.setItem('pendingRegistration', JSON.stringify({ email }))
//       }

//       triggerSuccessAndRedirect('/student/dashboard')
//     } catch (err: any) {
//       setError(err.message || 'Invalid email or password. Please try again.')
//       setIsLoading(false)
//     }
//   }

//   const triggerSuccessAndRedirect = (destination: string) => {
//     setIsSuccess(true)
//     setTimeout(() => {
//       router.push(destination)
//     }, 2500)
//   }

//   const inputClass =
//     'w-full p-3.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-dark dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple text-sm transition-colors'

//   // Success Celebration View
//   if (isSuccess) {
//     return (
//       <div className='min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center items-center px-4 relative overflow-hidden'>
//         <div className='absolute inset-0 pointer-events-none overflow-hidden'>
//           {[
//             { color: 'bg-purple-500', left: '15%', delay: '0s', duration: '3s' },
//             { color: 'bg-pink-500', left: '30%', delay: '0.4s', duration: '2.5s' },
//             { color: 'bg-indigo-500', left: '50%', delay: '0.2s', duration: '3.2s' },
//             { color: 'bg-green-500', left: '70%', delay: '0.6s', duration: '2.8s' },
//             { color: 'bg-yellow-500', left: '85%', delay: '0.1s', duration: '3s' },
//           ].map((balloon, index) => (
//             <div
//               key={index}
//               className={`absolute bottom-0 w-10 h-14 rounded-full ${balloon.color} opacity-80 flex items-center justify-center shadow-lg`}
//               style={{
//                 left: balloon.left,
//                 animationDuration: balloon.duration,
//                 animationDelay: balloon.delay,
//                 animationName: 'floatUp',
//                 animationFillMode: 'forwards',
//                 animationTimingFunction: 'ease-out',
//               }}
//             >
//               <div className='w-0.5 h-8 bg-gray-400 absolute top-full'></div>
//             </div>
//           ))}
//         </div>

//         <div className='max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-8 text-center space-y-6 relative z-10'>
//           <div className='w-16 h-16 bg-primary-purple/15 text-primary-purple rounded-full flex items-center justify-center mx-auto animate-bounce'>
//             <PartyPopper size={36} />
//           </div>
//           <div className='space-y-2'>
//             <h1 className='text-2xl font-extrabold text-dark dark:text-white'>
//               Welcome Back! 🎉
//             </h1>
//             <p className='text-xs text-gray-500 dark:text-gray-400'>
//               Authentication successful. Setting up your secure session dashboard...
//             </p>
//           </div>
//           <div className='flex items-center justify-center gap-2 text-xs text-primary-purple font-semibold pt-2'>
//             <Loader2 size={16} className='animate-spin' /> Redirecting...
//           </div>
//         </div>

//         <style jsx>{`
//           @keyframes floatUp {
//             0% {
//               transform: translateY(120vh) scale(0.8);
//               opacity: 0;
//             }
//             50% {
//               opacity: 1;
//             }
//             100% {
//               transform: translateY(-20vh) scale(1.1);
//               opacity: 0.9;
//             }
//           }
//         `}</style>
//       </div>
//     )
//   }

//   return (
//     <div className='min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 flex items-center justify-center'>
//       <div className='max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl space-y-6'>
        
//         {/* Header */}
//         <div className='border-b pb-4 dark:border-gray-800 space-y-3'>
//           <div className='flex justify-between items-center'>
//             <span className='text-xs font-bold text-primary-purple uppercase tracking-wider flex items-center gap-1.5'>
//               <ShieldCheck size={14} /> D Enskill AMS
//             </span>
//           </div>
          
//           <div>
//             <h2 className='text-xl font-bold text-dark dark:text-white'>
//               Sign In to Portal
//             </h2>
//             <p className='text-xs text-gray-500 mt-1'>
//               Enter your credentials to access your dashboard.
//             </p>
//           </div>
//         </div>

//         {error && (
//           <div className='p-3.5 bg-red-500/10 border border-red-500/20 text-red-600 text-xs rounded-xl font-medium flex items-center gap-2'>
//             <span>{error}</span>
//           </div>
//         )}

//         <form onSubmit={handleLogin} className='space-y-4'>
//           <div>
//             <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5'>
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
//             <div className='flex justify-between items-center mb-1.5'>
//               <label className='text-xs font-semibold text-gray-600 dark:text-gray-400'>
//                 Password
//               </label>
//               <Link
//                 href='/auth/reset-password'
//                 className='text-xs text-primary-purple hover:underline font-medium'
//               >
//                 Forgot password?
//               </Link>
//             </div>

//             <div className='relative'>
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 required
//                 className={`${inputClass} pr-10`}
//                 placeholder='••••••••••••'
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//               <button
//                 type='button'
//                 onClick={() => setShowPassword(!showPassword)}
//                 className='absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition cursor-pointer'
//                 aria-label={showPassword ? 'Hide password' : 'Show password'}
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//           </div>

//           <button
//             type='submit'
//             disabled={isLoading}
//             className='w-full bg-primary-purple text-white py-3.5 rounded-xl font-bold text-sm hover:opacity-95 transition-all shadow-lg shadow-primary-purple/25 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50'
//           >
//             {isLoading ? (
//               <>
//                 <Loader2 size={18} className='animate-spin' /> Authenticating...
//               </>
//             ) : (
//               'Sign In to Dashboard ➔'
//             )}
//           </button>
//         </form>

//         <div className='text-center text-xs text-gray-500 pt-3 border-t dark:border-gray-800 space-y-1'>
//           <p>
//             New student?{' '}
//             <Link
//               href='/admission'
//               className='text-primary-purple font-semibold hover:underline'
//             >
//               Register and apply here
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }



// src/app/login/page.tsx
'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, PartyPopper, Loader2, GraduationCap, ShieldAlert, AlertCircle } from 'lucide-react'
import { apiClient } from '@/services/api'

type LoginPortal = 'student' | 'official'

export default function UnifiedLoginPage() {
  const router = useRouter()
  const [portal, setPortal] = useState<LoginPortal>('student')
  
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

    let lastErrorMessage = 'Invalid email or password. Please check your credentials and try again.'

    try {
      if (portal === 'student') {
        // 1. Try Scholarship Student Login First
        try {
          const scholarshipRes = await apiClient.signinScholarship({ email, password })
          const scholarshipToken =
            scholarshipRes?.token ||
            scholarshipRes?.accessToken ||
            scholarshipRes?.data?.token ||
            scholarshipRes?.data?.accessToken

          if (scholarshipToken) {
            localStorage.setItem('token', scholarshipToken)
            localStorage.setItem('denskill_token', scholarshipToken)
            localStorage.setItem('user_role', 'scholarship_student')
            triggerSuccessAndRedirect('/student/dashboard')
            return
          }
        } catch (err: any) {
          if (err?.response?.data?.message) lastErrorMessage = err.response.data.message
        }

        // 2. Try Standard Student Login
        try {
          const response = await apiClient.signin({ email, password })
          const accessToken =
            response?.accessToken ||
            response?.token ||
            response?.data?.accessToken ||
            response?.data?.token

          if (accessToken || response?.success) {
            if (accessToken) {
              localStorage.setItem('token', accessToken)
              localStorage.setItem('denskill_token', accessToken)
              if (response?.refreshToken || response?.data?.refreshToken) {
                localStorage.setItem('refreshToken', response.refreshToken || response.data.refreshToken)
              }
            }

            localStorage.setItem('user_role', 'student')
            sessionStorage.setItem('isLoggedIn', 'true')

            const userData = response?.user || response?.data?.user || { email }
            sessionStorage.setItem('pendingRegistration', JSON.stringify(userData))
            localStorage.setItem('user', JSON.stringify(userData))

            triggerSuccessAndRedirect('/student/dashboard')
            return
          }

          if (response?.message) {
            lastErrorMessage = response.message
          }
        } catch (err: any) {
          if (err?.response?.data?.message) {
            lastErrorMessage = err.response.data.message
          } else if (err?.message) {
            lastErrorMessage = err.message
          }
        }
      } else {
        // Officials Portal: Automatically test Admin, then fallback to Tutor behind the scenes!

        // 1. Try Admin Login
        try {
          const adminResponse = await apiClient.adminLogin({ email, password })
          const adminToken = adminResponse?.token || adminResponse?.accessToken || adminResponse?.data?.token
          
          if (
            adminResponse &&
            !adminResponse.error &&
            adminResponse.statusCode !== 401 &&
            (adminToken || adminResponse.success)
          ) {
            sessionStorage.setItem('adminAuth', 'true')
            sessionStorage.setItem('isLoggedIn', 'true')
            if (adminToken) localStorage.setItem('token', adminToken)
            localStorage.setItem('user_role', 'admin')
            triggerSuccessAndRedirect('/admin/dashboard')
            return
          }
          if (adminResponse?.message) lastErrorMessage = adminResponse.message
        } catch (err: any) {
          if (err?.response?.data?.message) lastErrorMessage = err.response.data.message
        }

        // 2. Try Tutor Login
        try {
          const tutorResponse = await apiClient.tutorLogin({ email, password })
          const tutorToken =
            tutorResponse?.token ||
            tutorResponse?.accessToken ||
            tutorResponse?.data?.token ||
            tutorResponse?.data?.accessToken

          if (tutorToken) {
            localStorage.setItem('denskill_token', tutorToken)
            localStorage.setItem('denskill_tutor_token', tutorToken)
            localStorage.setItem('tutor_token', tutorToken)
            localStorage.setItem('denskill_tutor_logged', 'true')
            localStorage.setItem('user_role', 'tutor')
            triggerSuccessAndRedirect('/tutors')
            return
          }
          if (tutorResponse?.message) lastErrorMessage = tutorResponse.message
        } catch (err: any) {
          if (err?.response?.data?.message) {
            lastErrorMessage = err.response.data.message
          } else if (err?.message) {
            lastErrorMessage = err.message
          }
        }
      }
    } catch (err: any) {
      if (err?.response?.data?.message) {
        lastErrorMessage = err.response.data.message
      } else if (err?.message) {
        lastErrorMessage = err.message
      }
    }

    setError(lastErrorMessage)
    setIsLoading(false)
  }

  const triggerSuccessAndRedirect = (destination: string) => {
    setIsSuccess(true)
    setTimeout(() => {
      router.push(destination)
    }, 2000)
  }

  const inputClass =
    'w-full p-3.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-dark dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple text-sm transition-colors'

  if (isSuccess) {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center items-center px-4'>
        <div className='max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-8 text-center space-y-6'>
          <div className='w-16 h-16 bg-primary-purple/15 text-primary-purple rounded-full flex items-center justify-center mx-auto animate-bounce'>
            <PartyPopper size={36} />
          </div>
          <div className='space-y-2'>
            <h1 className='text-2xl font-extrabold text-dark dark:text-white'>Welcome Back! 🎉</h1>
            <p className='text-xs text-gray-500 dark:text-gray-400'>Authentication successful. Redirecting...</p>
          </div>
          <div className='flex items-center justify-center gap-2 text-xs text-primary-purple font-semibold'>
            <Loader2 size={16} className='animate-spin' /> Loading dashboard...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 flex items-center justify-center'>
      <div className='max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl space-y-6'>
        
        {/* Header */}
        <div className='border-b pb-4 dark:border-gray-800 space-y-3'>
          <div className='flex justify-between items-center'>
            <span className='text-xs font-bold text-primary-purple uppercase tracking-wider flex items-center gap-1.5'>
              {portal === 'student' ? <GraduationCap size={16} /> : <ShieldAlert size={16} />} 
              {portal === 'student' ? 'Student Portal' : 'Officials Portal'}
            </span>
          </div>
          <div>
            <h2 className='text-xl font-bold text-dark dark:text-white'>
              {portal === 'student' ? 'Student Sign In' : 'Official Sign In'}
            </h2>
            <p className='text-xs text-gray-500 mt-1'>
              {portal === 'student' ? 'Access your student or scholarship dashboard.' : 'Restricted access for institutional officials.'}
            </p>
          </div>
        </div>

        {/* Main Portal Switcher (Students vs Officials) */}
        <div className='grid grid-cols-2 gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl text-xs font-semibold'>
          <button
            type='button'
            onClick={() => {
              setPortal('student')
              setError(null)
            }}
            className={`py-2.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              portal === 'student'
                ? 'bg-white dark:bg-gray-900 text-primary-purple shadow-sm'
                : 'text-gray-500 hover:text-dark dark:hover:text-white'
            }`}
          >
            <GraduationCap size={14} /> Students
          </button>
          
          <button
            type='button'
            onClick={() => {
              setPortal('official')
              setError(null)
            }}
            className={`py-2.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              portal === 'official'
                ? 'bg-white dark:bg-gray-900 text-primary-purple shadow-sm'
                : 'text-gray-500 hover:text-dark dark:hover:text-white'
            }`}
          >
            <ShieldAlert size={14} /> Officials
          </button>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className='p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-2xl font-medium flex items-start gap-3 shadow-sm'>
            <AlertCircle size={20} className='shrink-0 text-red-500 mt-0.5' />
            <div className='flex-1'>
              <span className='font-bold block mb-0.5'>Sign In Failed</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className='space-y-4'>
          <div>
            <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5'>
              Email Address
            </label>
            <input
              type='email'
              required
              className={inputClass}
              placeholder={portal === 'student' ? 'student@example.com' : 'official@denskill.com'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <div className='flex justify-between items-center mb-1.5'>
              <label className='text-xs font-semibold text-gray-600 dark:text-gray-400'>Password</label>
              <Link href='/auth/reset-password' className='text-xs text-primary-purple hover:underline font-medium'>
                Forgot password?
              </Link>
            </div>

            <div className='relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className={`${inputClass} pr-10`}
                placeholder='••••••••••••'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition cursor-pointer'
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className='w-full bg-primary-purple text-white py-3.5 rounded-xl font-bold text-sm hover:opacity-95 transition-all shadow-lg shadow-primary-purple/25 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50'
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className='animate-spin' /> Authenticating...
              </>
            ) : (
              portal === 'student' ? 'Sign In to Student Dashboard ➔' : 'Sign In as Official ➔'
            )}
          </button>
        </form>

        <div className='text-center text-xs text-gray-500 pt-3 border-t dark:border-gray-800'>
          {portal === 'student' ? (
            <p>
              New student?{' '}
              <Link href='/admission' className='text-primary-purple font-semibold hover:underline'>
                Register and apply here
              </Link>
            </p>
          ) : (
            <p>
              Need help with staff credentials? Contact system engineering.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}