// 'use client'
// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { PROGRAMMES } from '@/constants/programmes'
// import { Lock, AlertCircle } from 'lucide-react'
// import PaystackModal from './PaystackModal'
// import { ApplicantData } from './types'

// export default function PaymentPage() {
//   const router = useRouter()
//   const [applicantData, setApplicantData] = useState<ApplicantData | null>(null)
//   const [paymentAmount, setPaymentAmount] = useState('50000')
//   const [showModal, setShowModal] = useState(false)
//   const [errorMsg, setErrorMsg] = useState('')

//   useEffect(() => {
//     const data = sessionStorage.getItem('pendingRegistration')
//     if (data) {
//       setApplicantData(JSON.parse(data))
//     } else {
//       router.push('/register')
//     }
//   }, [router])

//   const selectedProg = PROGRAMMES.find((p) => p.title === applicantData?.course)
//   const coursePrice = selectedProg
//     ? parseInt(selectedProg.price.replace(/[^0-9]/g, '')) || 200000
//     : 200000

//   const handleOpenCheckout = (e: React.FormEvent) => {
//     e.preventDefault()
//     const numericAmount = Number(paymentAmount)
//     if (numericAmount < 20000) {
//       setErrorMsg('Minimum installment or payment amount is ₦20,000.00')
//       return
//     }
//     setErrorMsg('')
//     setShowModal(true)
//   }

//   const handlePaymentSuccess = () => {
//     setShowModal(false)
//     sessionStorage.setItem('paymentCompleted', 'true')
//     router.push('/auth/create-account')
//   }

//   if (!applicantData) return null

//   const inputClass =
//     'w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-dark dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple text-sm'

//   return (
//     <div className='min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 flex items-center justify-center relative'>
//       <div className='max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6'>
//         {/* Header */}
//         <div className='border-b pb-4 dark:border-gray-800 flex justify-between items-center'>
//           <div>
//             <span className='text-xs font-semibold text-primary-purple uppercase tracking-wider'>
//               Step 2 of 4
//             </span>
//             <h2 className='text-2xl font-bold text-dark dark:text-white'>
//               Paystack Secure Checkout
//             </h2>
//           </div>
//           <div className='flex items-center gap-1 text-[10px] bg-green-500/10 text-green-600 px-2 py-1 rounded font-semibold'>
//             <Lock size={12} /> Live SSL
//           </div>
//         </div>

//         {/* Applicant Overview Card */}
//         <div className='p-4 rounded-xl bg-primary-purple/5 border border-primary-purple/20 space-y-2 text-sm text-gray-600 dark:text-gray-300'>
//           <div className='flex justify-between'>
//             <span>Applicant:</span>
//             <span className='font-semibold text-dark dark:text-white'>
//               {applicantData.firstName} {applicantData.lastName}
//             </span>
//           </div>
//           <div className='flex justify-between'>
//             <span>Program:</span>
//             <span className='font-semibold text-dark dark:text-white truncate max-w-[200px]'>
//               {applicantData.course}
//             </span>
//           </div>
//           <div className='flex justify-between border-t pt-2 dark:border-gray-800'>
//             <span>Total Tuition:</span>
//             <span className='font-mono font-bold text-dark dark:text-white'>
//               ₦{coursePrice.toLocaleString()}
//             </span>
//           </div>
//         </div>

//         {errorMsg && (
//           <div className='p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl flex items-center gap-2'>
//             <AlertCircle size={16} className='shrink-0' />
//             <span>{errorMsg}</span>
//           </div>
//         )}

//         {/* Amount Form */}
//         <form onSubmit={handleOpenCheckout} className='space-y-4'>
//           <div>
//             <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
//               Payment Amount (₦) [Min ₦20,000.00 Installment]
//             </label>
//             <input
//               type='number'
//               required
//               min='20000'
//               step='any'
//               className={inputClass}
//               value={paymentAmount}
//               onChange={(e) => setPaymentAmount(e.target.value)}
//             />
//           </div>

//           <button
//             type='submit'
//             className='w-full bg-[#00C3F7] hover:bg-[#00b0e2] text-gray-900 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer'
//           >
//             <span>Pay ₦{Number(paymentAmount || 0).toLocaleString()}</span>
//             <span className='text-[10px] bg-white/40 px-2 py-0.5 rounded font-mono'>
//               via Paystack
//             </span>
//           </button>
//         </form>
//       </div>

//       {/* Paystack Simulation Modal Component */}
//       <PaystackModal
//         isOpen={showModal}
//         onClose={() => setShowModal(false)}
//         applicantData={applicantData}
//         paymentAmount={paymentAmount}
//         onSuccess={handlePaymentSuccess}
//       />
//     </div>
//   )
// }

//src/app/payment/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PROGRAMMES } from '@/constants/programmes'
import { Lock, AlertCircle, Loader2 } from 'lucide-react'
import { apiClient } from '@/services/api'
import { ApplicantData } from './types'

export default function PaymentPage() {
  const router = useRouter()
  const [applicantData, setApplicantData] = useState<ApplicantData | null>(null)
  const [paymentAmount, setPaymentAmount] = useState('50000')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const data = sessionStorage.getItem('pendingRegistration')
    if (data) {
      setApplicantData(JSON.parse(data))
    } else {
      router.push('/register')
    }
  }, [router])

  const selectedProg = PROGRAMMES.find((p) => p.title === applicantData?.course)
  const coursePrice = selectedProg
    ? parseInt(selectedProg.price.replace(/[^0-9]/g, '')) || 200000
    : 200000

  const handleOpenCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!applicantData) return

    const numericAmount = Number(paymentAmount)
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setErrorMsg('Please enter a valid payment amount.')
      return
    }

    setErrorMsg('')
    setLoading(true)

    try {
      const callback_url = `${window.location.origin}/verify`

      // Call your backend initialization endpoint
      const response = await apiClient.initializeEnrollment({
        firstName: applicantData.firstName,
        middleName: applicantData.middleName || undefined,
        lastName: applicantData.lastName,
        country: applicantData.country,
        phone: applicantData.phone,
        email: applicantData.email,
        course: applicantData.course,
        reason: applicantData.reason || 'Enrollment payment',
        referredBy: applicantData.referredBy || 'Direct',
        amountPaid: numericAmount,
        callback_url,
      })

      // Extract authorization URL from backend response
      const checkoutUrl =
        response.authorization_url ||
        response.data?.authorization_url ||
        response.data?.data?.authorization_url

      if (checkoutUrl) {
        window.location.href = checkoutUrl
      } else {
        setErrorMsg(
          'Failed to retrieve Paystack authorization URL from backend.',
        )
        setLoading(false)
      }
    } catch (err) {
      console.error('Payment initialization error:', err)
      setErrorMsg('Connection error. Failed to initialize payment gateway.')
      setLoading(false)
    }
  }

  if (!applicantData) return null

  const inputClass =
    'w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-dark dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple text-sm'

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 flex items-center justify-center relative'>
      <div className='max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6'>
        {/* Header */}
        <div className='border-b pb-4 dark:border-gray-800 flex justify-between items-center'>
          <div>
            <span className='text-xs font-semibold text-primary-purple uppercase tracking-wider'>
              Step 2 of 4
            </span>
            <h2 className='text-2xl font-bold text-dark dark:text-white'>
              Paystack Secure Checkout
            </h2>
          </div>
          <div className='flex items-center gap-1 text-[10px] bg-green-500/10 text-green-600 px-2 py-1 rounded font-semibold'>
            <Lock size={12} /> Live SSL
          </div>
        </div>

        {/* Applicant Overview Card */}
        <div className='p-4 rounded-xl bg-primary-purple/5 border border-primary-purple/20 space-y-2 text-sm text-gray-600 dark:text-gray-300'>
          <div className='flex justify-between'>
            <span>Applicant:</span>
            <span className='font-semibold text-dark dark:text-white'>
              {applicantData.firstName} {applicantData.lastName}
            </span>
          </div>
          <div className='flex justify-between'>
            <span>Program:</span>
            <span className='font-semibold text-dark dark:text-white truncate max-w-[200px]'>
              {applicantData.course}
            </span>
          </div>
          <div className='flex justify-between border-t pt-2 dark:border-gray-800'>
            <span>Total Tuition:</span>
            <span className='font-mono font-bold text-dark dark:text-white'>
              ₦{coursePrice.toLocaleString()}
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className='p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl flex items-center gap-2'>
            <AlertCircle size={16} className='shrink-0' />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Amount Form */}
        <form onSubmit={handleOpenCheckout} className='space-y-4'>
          <div>
            <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
              Payment Amount (₦)
            </label>
            <input
              type='number'
              required
              min='1'
              step='any'
              className={inputClass}
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-[#00C3F7] hover:bg-[#00b0e2] text-gray-900 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-60'
          >
            {loading ? (
              <>
                <Loader2 size={18} className='animate-spin' /> Connecting to
                Paystack...
              </>
            ) : (
              <>
                <span>Pay ₦{Number(paymentAmount || 0).toLocaleString()}</span>
                <span className='text-[10px] bg-white/40 px-2 py-0.5 rounded font-mono'>
                  via Paystack
                </span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}