// // src/app/scholarship/pay/page.tsx
// 'use client'

// import { useState, useEffect, Suspense } from 'react'
// import { useSearchParams, useRouter } from 'next/navigation'
// import { apiClient } from '@/services/api'
// import {
//   Award,
//   CheckCircle2,
//   Loader2,
//   ShieldCheck,
//   Lock,
//   AlertCircle,
//   ArrowRight,
//   BookOpen,
// } from 'lucide-react'

// function ScholarshipPayContent() {
//   const searchParams = useSearchParams()
//   const router = useRouter()

//   const emailParam = searchParams.get('email') || ''

//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const [application, setApplication] = useState<any>(null)

//   // Step control: 'status-check' | 'pay' | 'setup-password' | 'success'
//   const [step, setStep] = useState<
//     'status-check' | 'pay' | 'setup-password' | 'success'
//   >('status-check')

//   // Payment states
//   const [payLoading, setPayLoading] = useState(false)
//   const [paymentReference, setPaymentReference] = useState('')

//   // Password setup states
//   const [password, setPassword] = useState('')
//   const [confirmPassword, setConfirmPassword] = useState('')
//   const [setupLoading, setSetupLoading] = useState(false)

//   // Fetch application status when page loads with email
//   useEffect(() => {
//     const fetchStatus = async () => {
//       if (!emailParam) {
//         setError('No email address provided in the link.')
//         setLoading(false)
//         return
//       }

//       try {
//         const res = await apiClient.getScholarshipStatus(emailParam)
//         if (res.success || res.application || res.status) {
//           const appData = res.application || res
//           setApplication(appData)

//           // Determine current step based on application status
//           if (appData.status === 'approved') {
//             setStep('pay')
//           } else if (appData.status === 'claimed') {
//             setStep('success')
//           } else if (appData.status === 'pending') {
//             setStep('status-check')
//           } else {
//             setStep('status-check')
//           }
//         } else {
//           setError(
//             res.message ||
//               'Could not locate a scholarship application for this email.',
//           )
//         }
//       } catch (err: any) {
//         setError(err.message || 'Failed to verify scholarship status.')
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchStatus()
//   }, [emailParam])

//   // Initialize payment (handles Paystack/Flutterwave gateway setup via backend)
//   const handleInitializePayment = async () => {
//     if (!application?._id) return
//     setPayLoading(true)
//     try {
//       const res = await apiClient.initializeScholarshipPayment({
//         applicationId: application._id,
//       })

//       if (res.success && res.authorization_url) {
//         // Redirect to gateway authorization URL (Paystack/Flutterwave)
//         window.location.href = res.authorization_url
//       } else if (res.reference || res.data?.reference) {
//         // Fallback reference simulation or direct verification step
//         const ref = res.reference || res.data?.reference
//         setPaymentReference(ref)
//         await handleVerifyPayment(ref)
//       } else {
//         alert(res.message || 'Failed to initialize payment gateway.')
//       }
//     } catch (err: any) {
//       alert(err.message || 'An error occurred while launching payment.')
//     } finally {
//       setPayLoading(false)
//     }
//   }

//   // Verify payment
//   const handleVerifyPayment = async (ref: string) => {
//     try {
//       const res = await apiClient.verifyScholarshipPayment({ reference: ref })
//       if (res.success || res.status === 'success') {
//         setStep('setup-password')
//       } else {
//         alert(res.message || 'Payment verification failed.')
//       }
//     } catch (err: any) {
//       alert(err.message || 'Error verifying payment transaction.')
//     }
//   }

//   // Claim scholarship & set password
//   const handleClaimScholarship = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (password !== confirmPassword) {
//       alert('Passwords do not match.')
//       return
//     }
//     if (password.length < 6) {
//       alert('Password must be at least 6 characters long.')
//       return
//     }

//     setSetupLoading(true)
//     try {
//       const res = await apiClient.claimScholarship({
//         applicationId: application._id,
//         password,
//       })

//       if (res.success || res.token || res.accessToken) {
//         if (res.token || res.accessToken) {
//           localStorage.setItem('denskill_token', res.token || res.accessToken)
//         }
//         setStep('success')
//       } else {
//         alert(res.message || 'Failed to complete account setup.')
//       }
//     } catch (err: any) {
//       alert(err.message || 'An unexpected error occurred.')
//     } finally {
//       setSetupLoading(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className='min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-6'>
//         <Loader2 className='animate-spin text-primary-purple mb-4' size={40} />
//         <p className='text-sm text-gray-500 font-medium'>
//           Loading your scholarship details...
//         </p>
//       </div>
//     )
//   }

//   return (
//     <div className='min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center items-center p-4 md:p-6'>
//       <div className='max-w-xl w-full bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 space-y-6'>
//         {/* Top Branding Header */}
//         <div className='text-center space-y-2'>
//           <div className='inline-flex p-3 rounded-2xl bg-primary-purple/15 text-primary-purple mb-2'>
//             <Award size={32} />
//           </div>
//           <h1 className='text-2xl font-bold text-dark dark:text-white'>
//             D Enskill Academy Scholarship
//           </h1>
//           <p className='text-sm text-gray-500 dark:text-gray-400'>
//             Secure your tech career grant and set up your student account.
//           </p>
//         </div>

//         {/* Error State */}
//         {error && (
//           <div className='p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 flex items-start gap-3'>
//             <AlertCircle size={20} className='shrink-0 mt-0.5' />
//             <div className='text-sm font-medium'>{error}</div>
//           </div>
//         )}

//         {/* STEP 1: Status Check (If application is still pending or not approved yet) */}
//         {!error && step === 'status-check' && application && (
//           <div className='space-y-6 text-center py-4'>
//             <div className='p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 space-y-2'>
//               <h3 className='font-bold text-base'>Application Under Review</h3>
//               <p className='text-sm'>
//                 Hi{' '}
//                 <span className='font-semibold'>{application.firstName}</span>,
//                 your application for{' '}
//                 <span className='font-semibold'>{application.course}</span> is
//                 currently{' '}
//                 <span className='uppercase font-bold'>
//                   {application.status}
//                 </span>
//                 .
//               </p>
//             </div>
//             <p className='text-xs text-gray-400'>
//               Once our admissions team approves your scholarship grant, you will
//               receive a secure payment link via email to claim your spot.
//             </p>
//           </div>
//         )}

//         {/* STEP 2: Award Breakdown & Payment Screen */}
//         {!error && step === 'pay' && application && (
//           <div className='space-y-6'>
//             <div className='p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 text-center'>
//               <h3 className='font-bold text-sm uppercase tracking-wide'>
//                 Congratulations, {application.firstName}! 🎉
//               </h3>
//               <p className='text-xs mt-1'>
//                 Your scholarship application has been officially approved.
//               </p>
//             </div>

//             {/* Fee Breakdown Card */}
//             <div className='rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 p-5 space-y-3'>
//               <div className='text-xs font-semibold uppercase text-gray-400 tracking-wider mb-2'>
//                 Scholarship Breakdown
//               </div>
//               <div className='flex justify-between text-sm'>
//                 <span className='text-gray-600 dark:text-gray-300'>
//                   Total Training Value
//                 </span>
//                 <span className='font-semibold text-dark dark:text-white line-through'>
//                   ₦80,000
//                 </span>
//               </div>
//               <div className='flex justify-between text-sm'>
//                 <span className='text-green-600 dark:text-green-400'>
//                   Scholarship Grant (80% Covered)
//                 </span>
//                 <span className='font-semibold text-green-600 dark:text-green-400'>
//                   -₦64,000
//                 </span>
//               </div>
//               <div className='border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between items-center'>
//                 <span className='font-bold text-dark dark:text-white text-sm'>
//                   Student Contribution (20%)
//                 </span>
//                 <span className='text-lg font-extrabold text-primary-purple'>
//                   ₦16,000
//                 </span>
//               </div>
//             </div>

//             <button
//               disabled={payLoading}
//               onClick={handleInitializePayment}
//               className='w-full py-3.5 rounded-2xl bg-primary-purple hover:bg-purple-700 text-white font-semibold text-sm transition shadow-lg shadow-primary-purple/25 flex items-center justify-center gap-2 disabled:opacity-50'
//             >
//               {payLoading ? (
//                 <>
//                   <Loader2 size={18} className='animate-spin' /> Initializing
//                   Secure Checkout...
//                 </>
//               ) : (
//                 <>
//                   Pay ₦16,000 & Claim Grant <ArrowRight size={18} />
//                 </>
//               )}
//             </button>

//             <div className='flex items-center justify-center gap-2 text-xs text-gray-400'>
//               <ShieldCheck size={16} className='text-green-500' /> Secured by
//               Paystack & Flutterwave Gateway
//             </div>
//           </div>
//         )}

//         {/* STEP 3: Password Setup & Onboarding */}
//         {!error && step === 'setup-password' && (
//           <form onSubmit={handleClaimScholarship} className='space-y-4'>
//             <div className='p-3 rounded-xl bg-blue-500/10 text-blue-600 text-xs text-center font-medium'>
//               Payment verified successfully! Now set your portal login password.
//             </div>

//             <div className='space-y-1'>
//               <label className='text-xs font-semibold uppercase text-gray-400'>
//                 Create Password
//               </label>
//               <div className='relative'>
//                 <Lock
//                   className='absolute left-3.5 top-3 text-gray-400'
//                   size={18}
//                 />
//                 <input
//                   type='password'
//                   required
//                   placeholder='At least 6 characters'
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className='w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple'
//                 />
//               </div>
//             </div>

//             <div className='space-y-1'>
//               <label className='text-xs font-semibold uppercase text-gray-400'>
//                 Confirm Password
//               </label>
//               <div className='relative'>
//                 <Lock
//                   className='absolute left-3.5 top-3 text-gray-400'
//                   size={18}
//                 />
//                 <input
//                   type='password'
//                   required
//                   placeholder='Re-enter password'
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   className='w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple'
//                 />
//               </div>
//             </div>

//             <button
//               disabled={setupLoading}
//               type='submit'
//               className='w-full py-3.5 rounded-2xl bg-primary-purple hover:bg-purple-700 text-white font-semibold text-sm transition shadow-lg shadow-primary-purple/25 flex items-center justify-center gap-2 disabled:opacity-50 mt-2'
//             >
//               {setupLoading ? (
//                 <>
//                   <Loader2 size={18} className='animate-spin' /> Setting up
//                   account...
//                 </>
//               ) : (
//                 <>
//                   Complete Onboarding & Access Portal <ArrowRight size={18} />
//                 </>
//               )}
//             </button>
//           </form>
//         )}

//         {/* STEP 4: Success State */}
//         {!error && step === 'success' && (
//           <div className='text-center space-y-6 py-4'>
//             <div className='w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto'>
//               <CheckCircle2 size={36} />
//             </div>
//             <div className='space-y-2'>
//               <h3 className='text-xl font-bold text-dark dark:text-white'>
//                 You&apos;re All Set! 🚀
//               </h3>
//               <p className='text-sm text-gray-500 dark:text-gray-400'>
//                 Your scholarship is fully claimed and your student account has
//                 been provisioned. Welcome to D Enskill Academy.
//               </p>
//             </div>

//             <button
//               onClick={() => router.push('/student/dashboard')}
//               className='w-full py-3.5 rounded-2xl bg-primary-purple hover:bg-purple-700 text-white font-semibold text-sm transition shadow-lg shadow-primary-purple/25 flex items-center justify-center gap-2'
//             >
//               <BookOpen size={18} /> Go to Student Dashboard
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default function ScholarshipPayPage() {
//   return (
//     <Suspense
//       fallback={
//         <div className='min-h-screen bg-gray-50 dark:bg-gray-950 flex justify-center items-center'>
//           <Loader2 className='animate-spin text-primary-purple' size={32} />
//         </div>
//       }
//     >
//       <ScholarshipPayContent />
//     </Suspense>
//   )
// }



// // src/app/scholarship/pay/page.tsx
// 'use client'

// import { useState, useEffect, Suspense } from 'react'
// import { useSearchParams, useRouter } from 'next/navigation'
// import { apiClient } from '@/services/api'
// import {
//   Award,
//   CheckCircle2,
//   Loader2,
//   ShieldCheck,
//   AlertCircle,
//   ArrowRight,
//   PartyPopper,
// } from 'lucide-react'

// function ScholarshipPayContent() {
//   const searchParams = useSearchParams()
//   const router = useRouter()

//   const emailParam = searchParams.get('email') || ''
//   const referenceParam = searchParams.get('reference') || searchParams.get('trxref')

//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const [application, setApplication] = useState<any>(null)
//   const [step, setStep] = useState<'status-check' | 'pay' | 'verifying' | 'success-celebrate'>('status-check')
//   const [payLoading, setPayLoading] = useState(false)

//   useEffect(() => {
//     const initPage = async () => {
//       // Case 1: Returning from payment gateway with a reference in the URL
//       if (referenceParam) {
//         setStep('verifying')
//         try {
//           const res = await apiClient.verifyScholarshipPayment({ reference: referenceParam })
//           if (res.success || res.status === 'success') {
//             const appData = res.application || res.data || {}
//             const email = appData.email || emailParam
//             const cohortId = appData.cohortId || appData.cohort_id || ''

//             // Trigger celebration step first before redirecting to signup
//             setStep('success-celebrate')
//             setTimeout(() => {
//               router.push(`/scholarship/signup?email=${encodeURIComponent(email)}&cohortId=${cohortId}`)
//             }, 3500) // Show balloons for 3.5 seconds then redirect
//             return
//           } else {
//             setError(res.message || 'Payment verification failed.')
//             setLoading(false)
//           }
//         } catch (err: any) {
//           setError(err.message || 'Error verifying payment transaction.')
//           setLoading(false)
//         }
//         return
//       }

//       // Case 2: Standard initial load with email param
//       if (!emailParam) {
//         setError('No email address provided in the link.')
//         setLoading(false)
//         return
//       }

//       try {
//         const res = await apiClient.getScholarshipStatus(emailParam)
//         if (res.success || res.application || res.status) {
//           const appData = res.application || res
//           setApplication(appData)

//           if (appData.status === 'approved') {
//             setStep('pay')
//           } else {
//             setStep('status-check')
//           }
//         } else {
//           setError(
//             res.message ||
//               'Could not locate a scholarship application for this email.',
//           )
//         }
//       } catch (err: any) {
//         setError(err.message || 'Failed to verify scholarship status.')
//       } finally {
//         setLoading(false)
//       }
//     }

//     initPage()
//   }, [emailParam, referenceParam, router])

//   const handleInitializePayment = async () => {
//     if (!application?._id) return
//     setPayLoading(true)
//     try {
//       const res = await apiClient.initializeScholarshipPayment({
//         applicationId: application._id,
//       })

//       if (res.success && res.authorization_url) {
//         window.location.href = res.authorization_url
//       } else {
//         alert(res.message || 'Failed to initialize payment gateway.')
//         setPayLoading(false)
//       }
//     } catch (err: any) {
//       alert(err.message || 'An error occurred while launching payment.')
//       setPayLoading(false)
//     }
//   }

//   // 1. Verifying state
//   if (loading || step === 'verifying') {
//     return (
//       <div className='min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-6'>
//         <Loader2 className='animate-spin text-primary-purple mb-4' size={40} />
//         <p className='text-sm text-gray-500 font-medium'>
//           {referenceParam ? 'Verifying your payment transaction...' : 'Loading your scholarship details...'}
//         </p>
//       </div>
//     )
//   }

//   // 2. Success Celebration Screen with Floating & Popping Balloons Animation
//   if (step === 'success-celebrate') {
//     return (
//       <div className='min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center items-center p-4 md:p-6 overflow-hidden relative'>
//         {/* Floating Balloons Animation Container */}
//         <div className='absolute inset-0 pointer-events-none overflow-hidden'>
//           {[
//             { color: 'bg-purple-500', left: '10%', delay: '0s', duration: '3s' },
//             { color: 'bg-pink-500', left: '25%', delay: '0.5s', duration: '2.5s' },
//             { color: 'bg-blue-500', left: '40%', delay: '0.2s', duration: '3.2s' },
//             { color: 'bg-green-500', left: '60%', delay: '0.7s', duration: '2.8s' },
//             { color: 'bg-yellow-500', left: '75%', delay: '0.1s', duration: '3s' },
//             { color: 'bg-indigo-500', left: '90%', delay: '0.4s', duration: '2.6s' },
//           ].map((balloon, index) => (
//             <div
//               key={index}
//               className={`absolute bottom-0 w-10 h-14 rounded-full ${balloon.color} opacity-80 animate-bounce flex items-center justify-center shadow-lg`}
//               style={{
//                 left: balloon.left,
//                 animationDuration: balloon.duration,
//                 animationDelay: balloon.delay,
//                 transform: 'translateY(100px)',
//                 animationName: 'floatUp',
//                 animationFillMode: 'forwards',
//               }}
//             >
//               <div className='w-0.5 h-8 bg-gray-400 absolute top-full'></div>
//             </div>
//           ))}
//         </div>

//         {/* Celebration Content Card */}
//         <div className='max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-8 text-center space-y-6 relative z-10 animate-fade-in'>
//           <div className='w-16 h-16 bg-primary-purple/15 text-primary-purple rounded-full flex items-center justify-center mx-auto animate-pulse'>
//             <PartyPopper size={36} />
//           </div>
//           <div className='space-y-2'>
//             <h1 className='text-2xl font-extrabold text-dark dark:text-white'>
//               Payment Successful! 🎉
//             </h1>
//             <p className='text-sm text-gray-500 dark:text-gray-400'>
//               Your scholarship fee has been received. Taking you to setup your secure account now...
//             </p>
//           </div>
//           <div className='flex items-center justify-center gap-2 text-xs text-primary-purple font-semibold'>
//             <Loader2 size={16} className='animate-spin' /> Redirecting to Signup...
//           </div>
//         </div>

//         {/* CSS Keyframes for Balloon Float */}
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

//   // 3. Main Payment / Status UI
//   return (
//     <div className='min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center items-center p-4 md:p-6'>
//       <div className='max-w-xl w-full bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 space-y-6'>
//         <div className='text-center space-y-2'>
//           <div className='inline-flex p-3 rounded-2xl bg-primary-purple/15 text-primary-purple mb-2'>
//             <Award size={32} />
//           </div>
//           <h1 className='text-2xl font-bold text-dark dark:text-white'>
//             D Enskill Academy Scholarship
//           </h1>
//           <p className='text-sm text-gray-500 dark:text-gray-400'>
//             Secure your tech career grant to proceed with your registration.
//           </p>
//         </div>

//         {error && (
//           <div className='p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 flex items-start gap-3'>
//             <AlertCircle size={20} className='shrink-0 mt-0.5' />
//             <div className='text-sm font-medium'>{error}</div>
//           </div>
//         )}

//         {/* Status Check State */}
//         {!error && step === 'status-check' && application && (
//           <div className='space-y-6 text-center py-4'>
//             <div className='p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 space-y-2'>
//               <h3 className='font-bold text-base'>Application Under Review</h3>
//               <p className='text-sm'>
//                 Hi <span className='font-semibold'>{application.firstName}</span>,
//                 your application is currently <span className='uppercase font-bold'>{application.status}</span>.
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Payment Screen */}
//         {!error && step === 'pay' && application && (
//           <div className='space-y-6'>
//             <div className='p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 text-center'>
//               <h3 className='font-bold text-sm uppercase tracking-wide'>
//                 Congratulations, {application.firstName}! 🎉
//               </h3>
//               <p className='text-xs mt-1'>
//                 Your scholarship application has been officially approved.
//               </p>
//             </div>

//             <div className='rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 p-5 space-y-3'>
//               <div className='flex justify-between text-sm'>
//                 <span className='text-gray-600 dark:text-gray-300'>Total Training Value</span>
//                 <span className='font-semibold text-dark dark:text-white line-through'>₦80,000</span>
//               </div>
//               <div className='flex justify-between text-sm'>
//                 <span className='text-green-600 dark:text-green-400'>Scholarship Grant (80% Covered)</span>
//                 <span className='font-semibold text-green-600 dark:text-green-400'>-₦64,000</span>
//               </div>
//               <div className='border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between items-center'>
//                 <span className='font-bold text-dark dark:text-white text-sm'>Student Contribution (20%)</span>
//                 <span className='text-lg font-extrabold text-primary-purple'>₦16,000</span>
//               </div>
//             </div>

//             <button
//               disabled={payLoading}
//               onClick={handleInitializePayment}
//               className='w-full py-3.5 rounded-2xl bg-primary-purple hover:bg-purple-700 text-white font-semibold text-sm transition shadow-lg shadow-primary-purple/25 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer'
//             >
//               {payLoading ? (
//                 <>
//                   <Loader2 size={18} className='animate-spin' /> Initializing Secure Checkout...
//                 </>
//               ) : (
//                 <>
//                   Pay ₦16,000 & Continue to Signup <ArrowRight size={18} />
//                 </>
//               )}
//             </button>

//             <div className='flex items-center justify-center gap-2 text-xs text-gray-400'>
//               <ShieldCheck size={16} className='text-green-500' /> Secured by Paystack & Flutterwave Gateway
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default function ScholarshipPayPage() {
//   return (
//     <Suspense
//       fallback={
//         <div className='min-h-screen bg-gray-50 dark:bg-gray-950 flex justify-center items-center'>
//           <Loader2 className='animate-spin text-primary-purple' size={32} />
//         </div>
//       }
//     >
//       <ScholarshipPayContent />
//     </Suspense>
//   )
// }


// // src/app/scholarship/pay/page.tsx
// // 'model client'
// 'use client'

// import { useState, useEffect, Suspense } from 'react'
// import { useSearchParams, useRouter } from 'next/navigation'
// import { apiClient } from '@/services/api'
// import {
//   Award,
//   CheckCircle2,
//   Loader2,
//   ShieldCheck,
//   AlertCircle,
//   ArrowRight,
//   PartyPopper,
// } from 'lucide-react'

// function ScholarshipPayInner() {
//   const searchParams = useSearchParams()
//   const router = useRouter()

//   const emailParam = searchParams.get('email') || ''
//   const referenceParam = searchParams.get('reference') || searchParams.get('trxref')

//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const [application, setApplication] = useState<any>(null)
//   const [step, setStep] = useState<'status-check' | 'pay' | 'verifying' | 'success-celebrate'>('status-check')
//   const [payLoading, setPayLoading] = useState(false)

//   useEffect(() => {
//     const initPage = async () => {
//       // Case 1: Returning from payment gateway with a reference in the URL
//       if (referenceParam) {
//         setStep('verifying')
//         try {
//           const res = await apiClient.verifyScholarshipPayment({ reference: referenceParam })
//           if (res.success || res.status === 'success') {
//             const appData = res.application || res.data || {}
//             const email = appData.email || emailParam
//             const cohortId = appData.cohortId || appData.cohort_id || ''

//             setStep('success-celebrate')
//             setTimeout(() => {
//               router.push(`/scholarship/signup?email=${encodeURIComponent(email)}&cohortId=${cohortId}`)
//             }, 3500)
//             return
//           } else {
//             setError(res.message || 'Payment verification failed.')
//             setLoading(false)
//           }
//         } catch (err: any) {
//           setError(err.message || 'Error verifying payment transaction.')
//           setLoading(false)
//         }
//         return
//       }

//       // Case 2: Standard initial load with email param
//       if (!emailParam) {
//         setError('No email address provided in the link.')
//         setLoading(false)
//         return
//       }

//       try {
//         const res = await apiClient.getScholarshipStatus(emailParam)
//         if (res.success || res.application || res.status) {
//           const appData = res.application || res
//           setApplication(appData)

//           if (appData.status === 'approved') {
//             setStep('pay')
//           } else {
//             setStep('status-check')
//           }
//         } else {
//           setError(
//             res.message ||
//               'Could not locate a scholarship application for this email.',
//           )
//         }
//       } catch (err: any) {
//         setError(err.message || 'Failed to verify scholarship status.')
//       } finally {
//         setLoading(false)
//       }
//     }

//     initPage()
//   }, [emailParam, referenceParam, router])

//   const handleInitializePayment = async () => {
//     if (!application?._id) return
//     setPayLoading(true)
//     try {
//       const res = await apiClient.initializeScholarshipPayment({
//         applicationId: application._id,
//       })

//       if (res.success && res.authorization_url) {
//         window.location.href = res.authorization_url
//       } else {
//         alert(res.message || 'Failed to initialize payment gateway.')
//         setPayLoading(false)
//       }
//     } catch (err: any) {
//       alert(err.message || 'An error occurred while launching payment.')
//       setPayLoading(false)
//     }
//   }

//   // 1. Verifying state
//   if (loading || step === 'verifying') {
//     return (
//       <div className='min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-6'>
//         <Loader2 className='animate-spin text-primary-purple mb-4' size={40} />
//         <p className='text-sm text-gray-500 font-medium'>
//           {referenceParam ? 'Verifying your payment transaction...' : 'Loading your scholarship details...'}
//         </p>
//       </div>
//     )
//   }

//   // 2. Success Celebration Screen
//   if (step === 'success-celebrate') {
//     return (
//       <div className='min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center items-center p-4 md:p-6 overflow-hidden relative'>
//         <div className='max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-8 text-center space-y-6 relative z-10'>
//           <div className='w-16 h-16 bg-primary-purple/15 text-primary-purple rounded-full flex items-center justify-center mx-auto animate-pulse'>
//             <PartyPopper size={36} />
//           </div>
//           <div className='space-y-2'>
//             <h1 className='text-2xl font-extrabold text-dark dark:text-white'>
//               Payment Successful! 🎉
//             </h1>
//             <p className='text-sm text-gray-500 dark:text-gray-400'>
//               Your scholarship fee has been received. Taking you to setup your secure account now...
//             </p>
//           </div>
//           <div className='flex items-center justify-center gap-2 text-xs text-primary-purple font-semibold'>
//             <Loader2 size={16} className='animate-spin' /> Redirecting to Signup...
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // 3. Main Payment / Status UI
//   return (
//     <div className='min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center items-center p-4 md:p-6'>
//       <div className='max-w-xl w-full bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 space-y-6'>
//         <div className='text-center space-y-2'>
//           <div className='inline-flex p-3 rounded-2xl bg-primary-purple/15 text-primary-purple mb-2'>
//             <Award size={32} />
//           </div>
//           <h1 className='text-2xl font-bold text-dark dark:text-white'>
//             D Enskill Academy Scholarship
//           </h1>
//           <p className='text-sm text-gray-500 dark:text-gray-400'>
//             Secure your tech career grant to proceed with your registration.
//           </p>
//         </div>

//         {error && (
//           <div className='p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 flex items-start gap-3'>
//             <AlertCircle size={20} className='shrink-0 mt-0.5' />
//             <div className='text-sm font-medium'>{error}</div>
//           </div>
//         )}

//         {!error && step === 'status-check' && application && (
//           <div className='space-y-6 text-center py-4'>
//             <div className='p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 space-y-2'>
//               <h3 className='font-bold text-base'>Application Under Review</h3>
//               <p className='text-sm'>
//                 Hi <span className='font-semibold'>{application.firstName}</span>,
//                 your application is currently <span className='uppercase font-bold'>{application.status}</span>.
//               </p>
//             </div>
//           </div>
//         )}

//         {!error && step === 'pay' && application && (
//           <div className='space-y-6'>
//             <div className='p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 text-center'>
//               <h3 className='font-bold text-sm uppercase tracking-wide'>
//                 Congratulations, {application.firstName}! 🎉
//               </h3>
//               <p className='text-xs mt-1'>
//                 Your scholarship application has been officially approved.
//               </p>
//             </div>

//             <div className='rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 p-5 space-y-3'>
//               <div className='flex justify-between text-sm'>
//                 <span className='text-gray-600 dark:text-gray-300'>Total Training Value</span>
//                 <span className='font-semibold text-dark dark:text-white line-through'>₦80,000</span>
//               </div>
//               <div className='flex justify-between text-sm'>
//                 <span className='text-green-600 dark:text-green-400'>Scholarship Grant (80% Covered)</span>
//                 <span className='font-semibold text-green-600 dark:text-green-400'>-₦64,000</span>
//               </div>
//               <div className='border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between items-center'>
//                 <span className='font-bold text-dark dark:text-white text-sm'>Student Contribution (20%)</span>
//                 <span className='text-lg font-extrabold text-primary-purple'>₦16,000</span>
//               </div>
//             </div>

//             <button
//               disabled={payLoading}
//               onClick={handleInitializePayment}
//               className='w-full py-3.5 rounded-2xl bg-primary-purple hover:bg-purple-700 text-white font-semibold text-sm transition shadow-lg shadow-primary-purple/25 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer'
//             >
//               {payLoading ? (
//                 <>
//                   <Loader2 size={18} className='animate-spin' /> Initializing Secure Checkout...
//                 </>
//               ) : (
//                 <>
//                   Pay ₦16,000 & Continue to Signup <ArrowRight size={18} />
//                 </>
//               )}
//             </button>

//             <div className='flex items-center justify-center gap-2 text-xs text-gray-400'>
//               <ShieldCheck size={16} className='text-green-500' /> Secured by Paystack & Flutterwave Gateway
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default function ScholarshipPayPage() {
//   return (
//     <Suspense
//       fallback={
//         <div className='min-h-screen bg-gray-50 dark:bg-gray-950 flex justify-center items-center'>
//           <Loader2 className='animate-spin text-primary-purple' size={32} />
//         </div>
//       }
//     >
//       <ScholarshipPayInner />
//     </Suspense>
//   )
// }


// src/app/scholarship/pay/page.tsx
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { apiClient } from '@/services/api'
import {
  Award,
  Loader2,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  PartyPopper,
} from 'lucide-react'

function ScholarshipPayInner() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const emailParam = searchParams.get('email') || ''
  const referenceParam = searchParams.get('reference') || searchParams.get('trxref')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [application, setApplication] = useState<any>(null)
  const [step, setStep] = useState<'status-check' | 'pay' | 'verifying' | 'success-celebrate'>('status-check')
  const [payLoading, setPayLoading] = useState(false)

  useEffect(() => {
    const initPage = async () => {
      // Case 1: Returning from payment gateway with a reference in the URL
      if (referenceParam) {
        setStep('verifying')
        try {
          const res = await apiClient.verifyScholarshipPayment({ reference: referenceParam })
          if (res.success || res.status === 'success') {
            const appData = res.application || res.data || {}
            const email = appData.email || emailParam
            const cohortId = appData.cohortId || appData.cohort_id || ''

            setStep('success-celebrate')
            setTimeout(() => {
              router.push(`/scholarship/signup?email=${encodeURIComponent(email)}&cohortId=${cohortId}`)
            }, 3500)
            return
          } else {
            setError(res.message || 'Payment verification failed.')
            setLoading(false)
          }
        } catch (err: any) {
          setError(err.message || 'Error verifying payment transaction.')
          setLoading(false)
        }
        return
      }

      // Case 2: Standard initial load with email param
      if (!emailParam) {
        setError('No email address provided in the link.')
        setLoading(false)
        return
      }

      try {
        const res = await apiClient.getScholarshipStatus(emailParam)
        
        // Handle array or single object response depending on your API wrapper
        const appList = res.applications || (Array.isArray(res) ? res : [res.application || res])
        const appData = appList[0]

        if (appData) {
          setApplication(appData)
          
          const normalizedStatus = (appData.status || '').toUpperCase()
          // Allow payment if status is PENDING or APPROVED (adjust if you want strict approval)
          if (normalizedStatus === 'APPROVED' || normalizedStatus === 'PENDING') {
            setStep('pay')
          } else {
            setStep('status-check')
          }
        } else {
          setError('Could not locate a scholarship application for this email.')
        }
      } catch (err: any) {
        setError(err.message || 'Failed to verify scholarship status.')
      } finally {
        setLoading(false)
      }
    }

    initPage()
  }, [emailParam, referenceParam, router])

  const handleInitializePayment = async () => {
    // Fix: Use application.id instead of application._id for PostgreSQL
    const appId = application?.id || application?._id
    if (!appId) return

    setPayLoading(true)
    try {
      const res = await apiClient.initializeScholarshipPayment({
        applicationId: appId,
      })

      // Handle nested Flutterwave link returned from backend
      const authUrl = res.data?.authorization_url || res.authorization_url
      if (res.success && authUrl) {
        window.location.href = authUrl
      } else {
        alert(res.message || 'Failed to initialize payment gateway.')
        setPayLoading(false)
      }
    } catch (err: any) {
      alert(err.message || 'An error occurred while launching payment.')
      setPayLoading(false)
    }
  }

  // 1. Verifying state
  if (loading || step === 'verifying') {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-6'>
        <Loader2 className='animate-spin text-primary-purple mb-4' size={40} />
        <p className='text-sm text-gray-500 font-medium'>
          {referenceParam ? 'Verifying your payment transaction...' : 'Loading your scholarship details...'}
        </p>
      </div>
    )
  }

  // 2. Success Celebration Screen
  if (step === 'success-celebrate') {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center items-center p-4 md:p-6 overflow-hidden relative'>
        <div className='max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-8 text-center space-y-6 relative z-10'>
          <div className='w-16 h-16 bg-primary-purple/15 text-primary-purple rounded-full flex items-center justify-center mx-auto animate-pulse'>
            <PartyPopper size={36} />
          </div>
          <div className='space-y-2'>
            <h1 className='text-2xl font-extrabold text-dark dark:text-white'>
              Payment Successful! 🎉
            </h1>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              Your scholarship fee has been received. Taking you to setup your secure account now...
            </p>
          </div>
          <div className='flex items-center justify-center gap-2 text-xs text-primary-purple font-semibold'>
            <Loader2 size={16} className='animate-spin' /> Redirecting to Signup...
          </div>
        </div>
      </div>
    )
  }

  // 3. Main Payment / Status UI
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center items-center p-4 md:p-6'>
      <div className='max-w-xl w-full bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 space-y-6'>
        <div className='text-center space-y-2'>
          <div className='inline-flex p-3 rounded-2xl bg-primary-purple/15 text-primary-purple mb-2'>
            <Award size={32} />
          </div>
          <h1 className='text-2xl font-bold text-dark dark:text-white'>
            D Enskill Academy Scholarship
          </h1>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Secure your tech career grant to proceed with your registration.
          </p>
        </div>

        {error && (
          <div className='p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 flex items-start gap-3'>
            <AlertCircle size={20} className='shrink-0 mt-0.5' />
            <div className='text-sm font-medium'>{error}</div>
          </div>
        )}

        {!error && step === 'status-check' && application && (
          <div className='space-y-6 text-center py-4'>
            <div className='p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 space-y-2'>
              <h3 className='font-bold text-base'>Application Under Review</h3>
              <p className='text-sm'>
                Hi <span className='font-semibold'>{application.first_name || application.firstName}</span>,
                your application is currently <span className='uppercase font-bold'>{application.status}</span>.
              </p>
            </div>
          </div>
        )}

        {!error && step === 'pay' && application && (
          <div className='space-y-6'>
            <div className='p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 text-center'>
              <h3 className='font-bold text-sm uppercase tracking-wide'>
                Congratulations, {application.first_name || application.firstName}! 🎉
              </h3>
              <p className='text-xs mt-1'>
                Your scholarship application has been officially processed for the <span className='font-semibold'>{application.course}</span> program.
              </p>
            </div>

            <div className='rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 p-5 space-y-3'>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-600 dark:text-gray-300'>Total Training Value</span>
                <span className='font-semibold text-dark dark:text-white line-through'>
                  ₦{application.fee_details?.originalAmount?.toLocaleString() || '80,000'}
                </span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-green-600 dark:text-green-400'>Scholarship Grant (80% Covered)</span>
                <span className='font-semibold text-green-600 dark:text-green-400'>
                  -₦{application.fee_details?.discountAmount?.toLocaleString() || '64,000'}
                </span>
              </div>
              <div className='border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between items-center'>
                <span className='font-bold text-dark dark:text-white text-sm'>Student Contribution (20%)</span>
                <span className='text-lg font-extrabold text-primary-purple'>
                  ₦{application.fee_details?.studentContribution?.toLocaleString() || '16,000'}
                </span>
              </div>
            </div>

            <button
              disabled={payLoading}
              onClick={handleInitializePayment}
              className='w-full py-3.5 rounded-2xl bg-primary-purple hover:bg-purple-700 text-white font-semibold text-sm transition shadow-lg shadow-primary-purple/25 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer'
            >
              {payLoading ? (
                <>
                  <Loader2 size={18} className='animate-spin' /> Initializing Secure Checkout...
                </>
              ) : (
                <>
                  Pay ₦{application.fee_details?.studentContribution?.toLocaleString() || '16,000'} & Continue to Signup <ArrowRight size={18} />
                </>
              )}
            </button>

            <div className='flex items-center justify-center gap-2 text-xs text-gray-400'>
              <ShieldCheck size={16} className='text-green-500' /> Secured by Flutterwave Gateway
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ScholarshipPayPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-gray-50 dark:bg-gray-950 flex justify-center items-center'>
          <Loader2 className='animate-spin text-primary-purple' size={32} />
        </div>
      }
    >
      <ScholarshipPayInner />
    </Suspense>
  )
}