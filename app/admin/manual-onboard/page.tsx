// 'use client'
// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { UserPlus, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
// import { adminApiClient } from '@/services/api'

// export default function ManualOnboardPage() {
//   const router = useRouter()
//   const [isLoading, setIsLoading] = useState(false)
//   const [successMsg, setSuccessMsg] = useState<string | null>(null)
//   const [errorMsg, setErrorMsg] = useState<string | null>(null)

//   const availableCourses = [
//     'Frontend Development',
//     'Backend Development',
//     'Full Stack Development',
//     'Mobile Development',
//     'Cybersecurity',
//     'Data Science',
//     'Data Analysis',
//     'Product Design (UI/UX)',
//     'Product Management',
//     'Web3 and Blockchain Development',
//     'AI / Machine Learning',
//     'Graphics Design',
//   ]

//   const [formData, setFormData] = useState({
//     firstName: '',
//     middleName: '',
//     lastName: '',
//     country: 'Nigeria',
//     phone: '',
//     email: '',
//     course: 'Full Stack Development',
//     amountPaid: 0,
//     password: '',
//     referredBy: '',
//     reason: 'Offline/Direct Admission',
//   })

//   useEffect(() => {
//     const loggedIn = sessionStorage.getItem('isLoggedIn')
//     const token =
//       typeof window !== 'undefined'
//         ? localStorage.getItem('denskill_token')
//         : null

//     if (!loggedIn && !token) {
//       router.push('/auth/login')
//       return
//     }
//   }, [router])

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//     >,
//   ) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({
//       ...prev,
//       [name]: name === 'amountPaid' ? Number(value) : value,
//     }))
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)
//     setErrorMsg(null)
//     setSuccessMsg(null)

//     try {
//       const response = await adminApiClient.manualOnboardStudent(formData)
//       if (response && (response.success || response.message || response.user)) {
//         setSuccessMsg(
//           response.message ||
//             'Student successfully onboarded with login credentials.',
//         )
//         setFormData({
//           firstName: '',
//           middleName: '',
//           lastName: '',
//           country: 'Nigeria',
//           phone: '',
//           email: '',
//           course: 'Full Stack Development',
//           amountPaid: 0,
//           password: '',
//           referredBy: '',
//           reason: 'Offline/Direct Admission',
//         })
//       } else {
//         setErrorMsg(
//           response?.error || response?.message || 'Failed to onboard student.',
//         )
//       }
//     } catch (err: any) {
//       setErrorMsg(err.message || 'An error occurred during manual onboarding.')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className='p-6 md:p-12 space-y-6 max-w-4xl mx-auto'>
//       <div>
//         <h1 className='text-2xl font-bold text-dark dark:text-white flex items-center gap-2'>
//           <UserPlus className='text-primary-purple' size={24} />
//           Manual Student Onboarding
//         </h1>
//         <p className='text-xs text-gray-500 mt-1'>
//           Manually register and provision a pre-paid or offline student with
//           direct login credentials.
//         </p>
//       </div>

//       {successMsg && (
//         <div className='p-4 bg-green-500/10 border border-green-500 text-green-600 text-xs rounded-xl font-medium flex items-center gap-2'>
//           <CheckCircle2 size={16} />
//           {successMsg}
//         </div>
//       )}

//       {errorMsg && (
//         <div className='p-4 bg-red-500/10 border border-red-500 text-red-600 text-xs rounded-xl font-medium flex items-center gap-2'>
//           <AlertCircle size={16} />
//           {errorMsg}
//         </div>
//       )}

//       <form
//         onSubmit={handleSubmit}
//         className='bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6'
//       >
//         <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-xs'>
//           <div className='space-y-1.5'>
//             <label className='font-bold text-dark dark:text-white'>
//               First Name *
//             </label>
//             <input
//               type='text'
//               name='firstName'
//               required
//               value={formData.firstName}
//               onChange={handleChange}
//               placeholder='e.g. John'
//               className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white focus:outline-none focus:border-primary-purple'
//             />
//           </div>
//           <div className='space-y-1.5'>
//             <label className='font-bold text-dark dark:text-white'>
//               Middle Name
//             </label>
//             <input
//               type='text'
//               name='middleName'
//               value={formData.middleName}
//               onChange={handleChange}
//               placeholder='e.g. Ade'
//               className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white focus:outline-none focus:border-primary-purple'
//             />
//           </div>
//           <div className='space-y-1.5'>
//             <label className='font-bold text-dark dark:text-white'>
//               Last Name *
//             </label>
//             <input
//               type='text'
//               name='lastName'
//               required
//               value={formData.lastName}
//               onChange={handleChange}
//               placeholder='e.g. Doe'
//               className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white focus:outline-none focus:border-primary-purple'
//             />
//           </div>
//         </div>

//         <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-xs'>
//           <div className='space-y-1.5'>
//             <label className='font-bold text-dark dark:text-white'>
//               Email Address *
//             </label>
//             <input
//               type='email'
//               name='email'
//               required
//               value={formData.email}
//               onChange={handleChange}
//               placeholder='student@example.com'
//               className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white focus:outline-none focus:border-primary-purple'
//             />
//           </div>
//           <div className='space-y-1.5'>
//             <label className='font-bold text-dark dark:text-white'>
//               Phone Number
//             </label>
//             <input
//               type='text'
//               name='phone'
//               value={formData.phone}
//               onChange={handleChange}
//               placeholder='+234...'
//               className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white focus:outline-none focus:border-primary-purple'
//             />
//           </div>
//           <div className='space-y-1.5'>
//             <label className='font-bold text-dark dark:text-white'>
//               Country
//             </label>
//             <input
//               type='text'
//               name='country'
//               value={formData.country}
//               onChange={handleChange}
//               placeholder='Nigeria'
//               className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white focus:outline-none focus:border-primary-purple'
//             />
//           </div>
//         </div>

//         <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-xs'>
//           <div className='space-y-1.5'>
//             <label className='font-bold text-dark dark:text-white'>
//               Enrolled Course *
//             </label>
//             <select
//               name='course'
//               required
//               value={formData.course}
//               onChange={handleChange}
//               className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white focus:outline-none focus:border-primary-purple'
//             >
//               {availableCourses.map((courseName) => (
//                 <option key={courseName} value={courseName}>
//                   {courseName}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className='space-y-1.5'>
//             <label className='font-bold text-dark dark:text-white'>
//               Amount Paid (₦) *
//             </label>
//             <input
//               type='number'
//               name='amountPaid'
//               required
//               value={formData.amountPaid}
//               onChange={handleChange}
//               placeholder='100000'
//               className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white focus:outline-none focus:border-primary-purple'
//             />
//           </div>
//           <div className='space-y-1.5'>
//             <label className='font-bold text-dark dark:text-white'>
//               Temporary Password *
//             </label>
//             <input
//               type='text'
//               name='password'
//               required
//               value={formData.password}
//               onChange={handleChange}
//               placeholder='Create student password'
//               className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white focus:outline-none focus:border-primary-purple'
//             />
//           </div>
//         </div>

//         <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-xs'>
//           <div className='space-y-1.5'>
//             <label className='font-bold text-dark dark:text-white'>
//               Referred By
//             </label>
//             <input
//               type='text'
//               name='referredBy'
//               value={formData.referredBy}
//               onChange={handleChange}
//               placeholder='Optional referrer name or code'
//               className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white focus:outline-none focus:border-primary-purple'
//             />
//           </div>
//           <div className='space-y-1.5'>
//             <label className='font-bold text-dark dark:text-white'>
//               Onboarding Reason / Notes
//             </label>
//             <input
//               type='text'
//               name='reason'
//               value={formData.reason}
//               onChange={handleChange}
//               placeholder='e.g. Bank Transfer / Direct Cash Payment'
//               className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white focus:outline-none focus:border-primary-purple'
//             />
//           </div>
//         </div>

//         <div className='pt-4 flex justify-end'>
//           <button
//             type='submit'
//             disabled={isLoading}
//             className='flex items-center gap-2 px-6 py-3 bg-primary-purple text-white font-bold text-xs rounded-xl shadow-md hover:opacity-95 disabled:opacity-50 cursor-pointer'
//           >
//             {isLoading ? (
//               <Loader2 size={16} className='animate-spin' />
//             ) : (
//               <UserPlus size={16} />
//             )}
//             Onboard Student
//           </button>
//         </div>
//       </form>
//     </div>
//   )
// }

'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  UserPlus,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldCheck,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { adminApiClient } from '@/services/admin-api'

export default function ManualOnboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  const availableCourses = [
    'Frontend Development',
    'Backend Development',
    'Full Stack Development',
    'Mobile Development',
    'Cybersecurity',
    'Data Science',
    'Data Analysis',
    'Product Design (UI/UX)',
    'Product Management',
    'Web3 and Blockchain Development',
    'AI / Machine Learning',
    'Graphics Design',
  ]

  const initialFormState = {
    firstName: '',
    middleName: '',
    lastName: '',
    country: 'Nigeria',
    phone: '',
    email: '',
    course: 'Full Stack Development',
    amountPaid: 0,
    password: '',
    referredBy: '',
    reason: 'Offline/Direct Admission',
  }

  const [formData, setFormData] = useState(initialFormState)

  useEffect(() => {
    const loggedIn = sessionStorage.getItem('isLoggedIn')
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('denskill_token')
        : null

    if (!loggedIn && !token) {
      router.push('/auth/login')
      return
    }
  }, [router])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amountPaid' ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    try {
      const response = await adminApiClient.manualOnboardStudent(formData)
      if (response && (response.success || response.message || response.user)) {
        const msg =
          response.message ||
          'Student successfully onboarded with login credentials.'
        setSuccessMsg(msg)
        setShowModal(true)
        setFormData(initialFormState)
      } else {
        setErrorMsg(
          response?.error || response?.message || 'Failed to onboard student.',
        )
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during manual onboarding.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='p-6 md:p-12 space-y-6 max-w-4xl mx-auto'
    >
      <div>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2'>
          <UserPlus className='text-primary-purple' size={24} />
          Manual Student Onboarding
        </h1>
        <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
          Manually register and provision a pre-paid or offline student with
          direct login credentials.
        </p>
      </div>

      {/* Inline Error Message */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className='p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded-xl font-medium flex items-center justify-between'
          >
            <div className='flex items-center gap-2'>
              <AlertCircle size={16} />
              {errorMsg}
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className='text-red-500 hover:opacity-75'
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <form
        onSubmit={handleSubmit}
        className='bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6 transition-colors'
      >
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-xs'>
          <div className='space-y-1.5'>
            <label className='font-bold text-gray-800 dark:text-gray-200'>
              First Name *
            </label>
            <input
              type='text'
              name='firstName'
              required
              value={formData.firstName}
              onChange={handleChange}
              placeholder='e.g. John'
              className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-primary-purple transition-colors'
            />
          </div>
          <div className='space-y-1.5'>
            <label className='font-bold text-gray-800 dark:text-gray-200'>
              Middle Name
            </label>
            <input
              type='text'
              name='middleName'
              value={formData.middleName}
              onChange={handleChange}
              placeholder='e.g. Ade'
              className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-primary-purple transition-colors'
            />
          </div>
          <div className='space-y-1.5'>
            <label className='font-bold text-gray-800 dark:text-gray-200'>
              Last Name *
            </label>
            <input
              type='text'
              name='lastName'
              required
              value={formData.lastName}
              onChange={handleChange}
              placeholder='e.g. Doe'
              className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-primary-purple transition-colors'
            />
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-xs'>
          <div className='space-y-1.5'>
            <label className='font-bold text-gray-800 dark:text-gray-200'>
              Email Address *
            </label>
            <input
              type='email'
              name='email'
              required
              value={formData.email}
              onChange={handleChange}
              placeholder='student@example.com'
              className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-primary-purple transition-colors'
            />
          </div>
          <div className='space-y-1.5'>
            <label className='font-bold text-gray-800 dark:text-gray-200'>
              Phone Number
            </label>
            <input
              type='text'
              name='phone'
              value={formData.phone}
              onChange={handleChange}
              placeholder='+234...'
              className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-primary-purple transition-colors'
            />
          </div>
          <div className='space-y-1.5'>
            <label className='font-bold text-gray-800 dark:text-gray-200'>
              Country
            </label>
            <input
              type='text'
              name='country'
              value={formData.country}
              onChange={handleChange}
              placeholder='Nigeria'
              className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-primary-purple transition-colors'
            />
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-xs'>
          <div className='space-y-1.5'>
            <label className='font-bold text-gray-800 dark:text-gray-200'>
              Enrolled Course *
            </label>
            <select
              name='course'
              required
              value={formData.course}
              onChange={handleChange}
              className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-primary-purple transition-colors'
            >
              {availableCourses.map((courseName) => (
                <option key={courseName} value={courseName}>
                  {courseName}
                </option>
              ))}
            </select>
          </div>
          <div className='space-y-1.5'>
            <label className='font-bold text-gray-800 dark:text-gray-200'>
              Amount Paid (₦) *
            </label>
            <input
              type='number'
              name='amountPaid'
              required
              value={formData.amountPaid}
              onChange={handleChange}
              placeholder='100000'
              className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-primary-purple transition-colors'
            />
          </div>
          <div className='space-y-1.5'>
            <label className='font-bold text-gray-800 dark:text-gray-200'>
              Temporary Password *
            </label>
            <input
              type='text'
              name='password'
              required
              value={formData.password}
              onChange={handleChange}
              placeholder='Create student password'
              className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-primary-purple transition-colors'
            />
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-xs'>
          <div className='space-y-1.5'>
            <label className='font-bold text-gray-800 dark:text-gray-200'>
              Referred By
            </label>
            <input
              type='text'
              name='referredBy'
              value={formData.referredBy}
              onChange={handleChange}
              placeholder='Optional referrer name or code'
              className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-primary-purple transition-colors'
            />
          </div>
          <div className='space-y-1.5'>
            <label className='font-bold text-gray-800 dark:text-gray-200'>
              Onboarding Reason / Notes
            </label>
            <input
              type='text'
              name='reason'
              value={formData.reason}
              onChange={handleChange}
              placeholder='e.g. Bank Transfer / Direct Cash Payment'
              className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-primary-purple transition-colors'
            />
          </div>
        </div>

        <div className='pt-4 flex justify-end'>
          <button
            type='submit'
            disabled={isLoading}
            className='flex items-center gap-2 px-6 py-3 bg-primary-purple text-white font-bold text-xs rounded-xl shadow-md hover:opacity-95 disabled:opacity-50 cursor-pointer transition-opacity'
          >
            {isLoading ? (
              <Loader2 size={16} className='animate-spin' />
            ) : (
              <UserPlus size={16} />
            )}
            Onboard Student
          </button>
        </div>
      </form>

      {/* Success Modal */}
      <AnimatePresence>
        {showModal && (
          <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs'>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-4'
            >
              <div className='flex items-center justify-between'>
                <div className='w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400'>
                  <ShieldCheck size={22} />
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors'
                >
                  <X size={18} />
                </button>
              </div>

              <div>
                <h3 className='text-base font-bold text-gray-900 dark:text-white'>
                  Onboarding Successful!
                </h3>
                <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                  {successMsg}
                </p>
              </div>

              <div className='p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-800 text-xs space-y-1.5'>
                <p className='text-gray-600 dark:text-gray-300 font-medium'>
                  The student account has been created successfully with the
                  provisioned login details. They can now access the portal.
                </p>
              </div>

              <div className='pt-2 flex justify-end'>
                <button
                  type='button'
                  onClick={() => setShowModal(false)}
                  className='w-full py-3 bg-primary-purple text-white font-bold text-xs rounded-xl shadow-md hover:opacity-95 cursor-pointer'
                >
                  Close & Continue
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}