// //src/app/(public)/scholarship/claim/page.tsx
// 'use client'
// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import {
//   Award,
//   CreditCard,
//   Lock,
//   Loader2,
//   CheckCircle2,
//   AlertCircle,
// } from 'lucide-react'
// import { apiClient } from '@/services/api'

// export default function ScholarshipClaimPage() {
//   const router = useRouter()
//   const [step, setStep] = useState<'verify' | 'payment' | 'activate'>('verify')
//   const [applicationId, setApplicationId] = useState('')
//   const [password, setPassword] = useState('')
//   const [reference, setReference] = useState('')
//   const [isLoading, setIsLoading] = useState(false)
//   const [errorMsg, setErrorMsg] = useState<string | null>(null)
//   const [successMsg, setSuccessMsg] = useState<string | null>(null)

//   const handleInitializePayment = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)
//     setErrorMsg(null)

//     try {
//       const res = await apiClient.initializeScholarshipPayment({
//         applicationId,
//       })
//       if (res && (res.payment_url || res.authorization_url || res.success)) {
//         // Redirect to Flutterwave gateway if provided
//         const paymentUrl = res.payment_url || res.authorization_url
//         if (paymentUrl) {
//           window.location.href = paymentUrl
//         } else {
//           setStep('payment')
//         }
//       } else {
//         setErrorMsg(res?.message || 'Failed to initialize payment.')
//       }
//     } catch (err: any) {
//       setErrorMsg(err.message || 'Payment initialization error.')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleVerifyPayment = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)
//     setErrorMsg(null)

//     try {
//       const res = await apiClient.verifyScholarshipPayment({ reference })
//       if (res && (res.success || res.verified)) {
//         setStep('activate')
//       } else {
//         setErrorMsg(res?.message || 'Payment verification failed.')
//       }
//     } catch (err: any) {
//       setErrorMsg(err.message || 'Verification error.')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleClaimOffer = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)
//     setErrorMsg(null)

//     try {
//       const res = await apiClient.claimScholarship({ applicationId, password })
//       if (res && (res.success || res.token || res.accessToken)) {
//         if (res.token || res.accessToken) {
//           localStorage.setItem('denskill_token', res.token || res.accessToken)
//         }
//         setSuccessMsg('Scholarship claimed and account activated successfully!')
//         setTimeout(() => {
//           router.push('/dashboard')
//         }, 2000)
//       } else {
//         setErrorMsg(res?.message || 'Failed to claim scholarship offer.')
//       }
//     } catch (err: any) {
//       setErrorMsg(err.message || 'Activation error.')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <main className='py-20 px-6 max-w-xl mx-auto space-y-8'>
//       <div className='text-center space-y-2'>
//         <div className='w-12 h-12 bg-primary-purple/10 text-primary-purple rounded-2xl flex items-center justify-center mx-auto'>
//           <Award size={24} />
//         </div>
//         <h1 className='text-2xl font-bold text-dark dark:text-white'>
//           Claim Your Scholarship
//         </h1>
//         <p className='text-xs text-gray-500'>
//           Complete payment and set your secure portal password.
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

//       {step === 'verify' && (
//         <form
//           onSubmit={handleInitializePayment}
//           className='bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6'
//         >
//           <div className='space-y-1.5 text-xs'>
//             <label className='font-bold text-dark dark:text-white'>
//               Application ID *
//             </label>
//             <input
//               type='text'
//               required
//               value={applicationId}
//               onChange={(e) => setApplicationId(e.target.value)}
//               placeholder='Enter your application UUID...'
//               className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white focus:outline-none focus:border-primary-purple'
//             />
//           </div>

//           <button
//             type='submit'
//             disabled={isLoading}
//             className='w-full py-3.5 bg-primary-purple text-white text-xs font-bold rounded-xl shadow-md hover:opacity-95 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer'
//           >
//             {isLoading ? (
//               <Loader2 size={16} className='animate-spin' />
//             ) : (
//               <CreditCard size={16} />
//             )}
//             Initialize ₦16,000 Contribution Payment
//           </button>
//         </form>
//       )}

//       {step === 'payment' && (
//         <form
//           onSubmit={handleVerifyPayment}
//           className='bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6'
//         >
//           <div className='space-y-1.5 text-xs'>
//             <label className='font-bold text-dark dark:text-white'>
//               Flutterwave Transaction Reference *
//             </label>
//             <input
//               type='text'
//               required
//               value={reference}
//               onChange={(e) => setReference(e.target.value)}
//               placeholder='SCH-COH1-ABC123XYZ'
//               className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white focus:outline-none focus:border-primary-purple'
//             />
//           </div>

//           <button
//             type='submit'
//             disabled={isLoading}
//             className='w-full py-3.5 bg-primary-purple text-white text-xs font-bold rounded-xl shadow-md hover:opacity-95 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer'
//           >
//             {isLoading ? (
//               <Loader2 size={16} className='animate-spin' />
//             ) : (
//               <CheckCircle2 size={16} />
//             )}
//             Verify Payment Reference
//           </button>
//         </form>
//       )}

//       {step === 'activate' && (
//         <form
//           onSubmit={handleClaimOffer}
//           className='bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6'
//         >
//           <div className='space-y-1.5 text-xs'>
//             <label className='font-bold text-dark dark:text-white'>
//               Create Portal Password *
//             </label>
//             <input
//               type='password'
//               required
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder='SecurePassword123!'
//               className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white focus:outline-none focus:border-primary-purple'
//             />
//           </div>

//           <button
//             type='submit'
//             disabled={isLoading}
//             className='w-full py-3.5 bg-primary-purple text-white text-xs font-bold rounded-xl shadow-md hover:opacity-95 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer'
//           >
//             {isLoading ? (
//               <Loader2 size={16} className='animate-spin' />
//             ) : (
//               <Lock size={16} />
//             )}
//             Activate Scholarship Account & Login
//           </button>
//         </form>
//       )}
//     </main>
//   )
// }



// src/app/(public)/scholarship/claim/page.tsx
'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Award,
  CreditCard,
  Lock,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { apiClient } from '@/services/api'

function ScholarshipClaimContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [step, setStep] = useState<'verify' | 'payment' | 'activate'>('verify')
  const [applicationId, setApplicationId] = useState('')
  const [password, setPassword] = useState('')
  const [reference, setReference] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Auto-detect return from Flutterwave payment redirect
  useEffect(() => {
    const txRef = searchParams.get('tx_ref') || searchParams.get('reference')
    const transactionId = searchParams.get('transaction_id')
    const status = searchParams.get('status')
    const appIdFromUrl = searchParams.get('applicationId')

    if (appIdFromUrl) {
      setApplicationId(appIdFromUrl)
    }

    if (status === 'successful' && (transactionId || txRef)) {
      setReference(transactionId || txRef || '')
      setStep('payment') // Automatically switch to verification step
    }
  }, [searchParams])

  const handleInitializePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg(null)

    try {
      const res = await apiClient.initializeScholarshipPayment({
        applicationId,
      })
      
      const paymentUrl = res?.data?.authorization_url || res?.payment_url || res?.authorization_url
      
      if (res && (res.success || paymentUrl)) {
        if (paymentUrl) {
          window.location.href = paymentUrl
        } else {
          setStep('payment')
        }
      } else {
        setErrorMsg(res?.message || 'Failed to initialize payment.')
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment initialization error.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg(null)

    try {
      const res = await apiClient.verifyScholarshipPayment({ reference })
      if (res && (res.success || res.verified)) {
        setStep('activate')
      } else {
        setErrorMsg(res?.message || 'Payment verification failed.')
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification error.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClaimOffer = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg(null)

    try {
      const res = await apiClient.claimScholarship({ applicationId, password })
      if (res && (res.success || res.token || res.accessToken)) {
        if (res.token || res.accessToken) {
          localStorage.setItem('denskill_token', res.token || res.accessToken)
        }
        setSuccessMsg('Scholarship claimed and account activated successfully!')
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        setErrorMsg(res?.message || 'Failed to claim scholarship offer.')
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Activation error.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className='py-20 px-6 max-w-xl mx-auto space-y-8'>
      <div className='text-center space-y-2'>
        <div className='w-12 h-12 bg-primary-purple/10 text-primary-purple rounded-2xl flex items-center justify-center mx-auto'>
          <Award size={24} />
        </div>
        <h1 className='text-2xl font-bold text-dark dark:text-white'>
          Claim Your Scholarship
        </h1>
        <p className='text-xs text-gray-500'>
          Complete payment and set your secure portal password.
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

      {step === 'verify' && (
        <form
          onSubmit={handleInitializePayment}
          className='bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6'
        >
          <div className='space-y-1.5 text-xs'>
            <label className='font-bold text-dark dark:text-white'>
              Application ID *
            </label>
            <input
              type='text'
              required
              value={applicationId}
              onChange={(e) => setApplicationId(e.target.value)}
              placeholder='Enter your application UUID...'
              className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white focus:outline-none focus:border-primary-purple'
            />
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className='w-full py-3.5 bg-primary-purple text-white text-xs font-bold rounded-xl shadow-md hover:opacity-95 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer'
          >
            {isLoading ? (
              <Loader2 size={16} className='animate-spin' />
            ) : (
              <CreditCard size={16} />
            )}
            Initialize Contribution Payment
          </button>
        </form>
      )}

      {step === 'payment' && (
        <form
          onSubmit={handleVerifyPayment}
          className='bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6'
        >
          <div className='space-y-1.5 text-xs'>
            <label className='font-bold text-dark dark:text-white'>
              Flutterwave Transaction Reference *
            </label>
            <input
              type='text'
              required
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder='SCH-COH1-ABC123XYZ'
              className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white focus:outline-none focus:border-primary-purple'
            />
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className='w-full py-3.5 bg-primary-purple text-white text-xs font-bold rounded-xl shadow-md hover:opacity-95 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer'
          >
            {isLoading ? (
              <Loader2 size={16} className='animate-spin' />
            ) : (
              <CheckCircle2 size={16} />
            )}
            Verify Payment Reference
          </button>
        </form>
      )}

      {step === 'activate' && (
        <form
          onSubmit={handleClaimOffer}
          className='bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6'
        >
          <div className='space-y-1.5 text-xs'>
            <label className='font-bold text-dark dark:text-white'>
              Create Portal Password *
            </label>
            <input
              type='password'
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='SecurePassword123!'
              className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white focus:outline-none focus:border-primary-purple'
            />
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className='w-full py-3.5 bg-primary-purple text-white text-xs font-bold rounded-xl shadow-md hover:opacity-95 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer'
          >
            {isLoading ? (
              <Loader2 size={16} className='animate-spin' />
            ) : (
              <Lock size={16} />
            )}
            Activate Scholarship Account & Login
          </button>
        </form>
      )}
    </main>
  )
}

export default function ScholarshipClaimPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center"><Loader2 className="animate-spin mx-auto" /></div>}>
      <ScholarshipClaimContent />
    </Suspense>
  )
}