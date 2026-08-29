// 'use client'

// import { useState, useEffect } from 'react'
// import { apiClient } from '@/services/api'
// import { UserPlus, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

// interface Cohort {
//   _id?: string
//   id?: string
//   name: string
//   code: string
// }

// export default function ManualScholarshipOnboardPage() {
//   const [cohorts, setCohorts] = useState<Cohort[]>([])
//   const [loadingCohorts, setLoadingCohorts] = useState(true)

//   // Form state matching your API payload structure
//   const [formData, setFormData] = useState({
//     firstName: '',
//     middleName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     cohortId: '',
//     course: '',
//     password: '',
//   })

//   const [submitting, setSubmitting] = useState(false)
//   const [successMessage, setSuccessMessage] = useState('')
//   const [error, setError] = useState('')

//   // Fetch available cohorts on mount
//   useEffect(() => {
//     const fetchCohorts = async () => {
//       try {
//         const res = await apiClient.getScholarshipCohorts()
//         if (res.success || Array.isArray(res.cohorts || res)) {
//           setCohorts(res.cohorts || res)
//         }
//       } catch (err: any) {
//         console.error('Failed to load cohorts', err)
//       } finally {
//         setLoadingCohorts(false)
//       }
//     }
//     fetchCohorts()
//   }, [])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setSubmitting(true)
//     setError('')
//     setSuccessMessage('')

//     try {
//       const res = await apiClient.manualOnboardScholarshipStudent({
//         firstName: formData.firstName,
//         middleName: formData.middleName || undefined,
//         lastName: formData.lastName,
//         email: formData.email,
//         phone: formData.phone || undefined,
//         cohortId: formData.cohortId,
//         course: formData.course || undefined,
//         password: formData.password || undefined,
//       })

//       if (res.success || res.status === 'success' || res._id || res.id) {
//         setSuccessMessage('Scholarship student successfully onboarded!')
//         setFormData({
//           firstName: '',
//           middleName: '',
//           lastName: '',
//           email: '',
//           phone: '',
//           cohortId: '',
//           course: '',
//           password: '',
//         })
//       } else {
//         setError(res.message || 'Failed to onboard scholarship student.')
//       }
//     } catch (err: any) {
//       setError(err.message || 'An unexpected error occurred.')
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   return (
//     <div className='p-6 max-w-4xl mx-auto space-y-6'>
//       {/* Header */}
//       <div>
//         <h1 className='text-2xl font-bold text-dark dark:text-white flex items-center gap-2'>
//           <UserPlus className='text-primary-purple' /> Manual Scholarship
//           Onboarding
//         </h1>
//         <p className='text-sm text-gray-500 dark:text-gray-400'>
//           Directly register and provision credentials for a scholarship student
//           into a specific cohort.
//         </p>
//       </div>

//       {/* Form Card */}
//       <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm'>
//         {successMessage && (
//           <div className='mb-6 p-4 rounded-xl bg-green-500/10 text-green-600 flex items-center gap-3 text-sm font-medium'>
//             <CheckCircle2 size={20} />
//             <span>{successMessage}</span>
//           </div>
//         )}

//         {error && (
//           <div className='mb-6 p-4 rounded-xl bg-red-500/10 text-red-600 flex items-center gap-3 text-sm font-medium'>
//             <AlertCircle size={20} />
//             <span>{error}</span>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className='space-y-4'>
//           <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
//             <div className='space-y-1'>
//               <label className='text-xs font-semibold uppercase text-gray-400'>
//                 First Name *
//               </label>
//               <input
//                 required
//                 type='text'
//                 placeholder='e.g. Hilosthone'
//                 value={formData.firstName}
//                 onChange={(e) =>
//                   setFormData({ ...formData, firstName: e.target.value })
//                 }
//                 className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple'
//               />
//             </div>
//             <div className='space-y-1'>
//               <label className='text-xs font-semibold uppercase text-gray-400'>
//                 Middle Name
//               </label>
//               <input
//                 type='text'
//                 placeholder='e.g. Sulyman'
//                 value={formData.middleName}
//                 onChange={(e) =>
//                   setFormData({ ...formData, middleName: e.target.value })
//                 }
//                 className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple'
//               />
//             </div>
//             <div className='space-y-1'>
//               <label className='text-xs font-semibold uppercase text-gray-400'>
//                 Last Name *
//               </label>
//               <input
//                 required
//                 type='text'
//                 placeholder='e.g. Dev'
//                 value={formData.lastName}
//                 onChange={(e) =>
//                   setFormData({ ...formData, lastName: e.target.value })
//                 }
//                 className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple'
//               />
//             </div>
//           </div>

//           <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//             <div className='space-y-1'>
//               <label className='text-xs font-semibold uppercase text-gray-400'>
//                 Email Address *
//               </label>
//               <input
//                 required
//                 type='email'
//                 placeholder='student@denskill.com'
//                 value={formData.email}
//                 onChange={(e) =>
//                   setFormData({ ...formData, email: e.target.value })
//                 }
//                 className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple'
//               />
//             </div>
//             <div className='space-y-1'>
//               <label className='text-xs font-semibold uppercase text-gray-400'>
//                 Phone Number
//               </label>
//               <input
//                 type='text'
//                 placeholder='+2348012345678'
//                 value={formData.phone}
//                 onChange={(e) =>
//                   setFormData({ ...formData, phone: e.target.value })
//                 }
//                 className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple'
//               />
//             </div>
//           </div>

//           <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//             <div className='space-y-1'>
//               <label className='text-xs font-semibold uppercase text-gray-400'>
//                 Scholarship Cohort *
//               </label>
//               <select
//                 required
//                 value={formData.cohortId}
//                 onChange={(e) =>
//                   setFormData({ ...formData, cohortId: e.target.value })
//                 }
//                 className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple text-gray-700 dark:text-gray-300'
//               >
//                 <option value=''>Select Cohort</option>
//                 {cohorts.map((cohort) => (
//                   <option
//                     key={cohort._id || cohort.id}
//                     value={cohort._id || cohort.id}
//                   >
//                     {cohort.name} ({cohort.code})
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className='space-y-1'>
//               <label className='text-xs font-semibold uppercase text-gray-400'>
//                 Assigned Course
//               </label>
//               <input
//                 type='text'
//                 placeholder='e.g. Full-Stack Development'
//                 value={formData.course}
//                 onChange={(e) =>
//                   setFormData({ ...formData, course: e.target.value })
//                 }
//                 className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple'
//               />
//             </div>
//           </div>

//           <div className='space-y-1'>
//             <label className='text-xs font-semibold uppercase text-gray-400'>
//               Temporary Password
//             </label>
//             <input
//               type='text'
//               placeholder='denskill123'
//               value={formData.password}
//               onChange={(e) =>
//                 setFormData({ ...formData, password: e.target.value })
//               }
//               className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple'
//             />
//           </div>

//           <div className='pt-4 flex justify-end'>
//             <button
//               disabled={submitting || loadingCohorts}
//               type='submit'
//               className='px-6 py-3 rounded-xl bg-primary-purple text-white text-sm font-medium hover:opacity-95 transition flex items-center gap-2'
//             >
//               {submitting && <Loader2 size={18} className='animate-spin' />}
//               Onboard Scholarship Student
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/services/api'
import { UserPlus, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

// Course titles only list for the selection dropdown
export const COURSES = [
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

interface Cohort {
  _id?: string
  id?: string
  name: string
  code: string
}

export default function ManualScholarshipOnboardPage() {
  const [cohorts, setCohorts] = useState<Cohort[]>([])
  const [loadingCohorts, setLoadingCohorts] = useState(true)

  // Form state updated to include manual amountPaid and paymentReference tracking
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phone: '',
    cohortId: '',
    course: '',
    password: '',
    amountPaid: '',
    paymentReference: '',
  })

  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [error, setError] = useState('')

  // Fetch available cohorts on mount
  useEffect(() => {
    const fetchCohorts = async () => {
      try {
        const res = await apiClient.getScholarshipCohorts()
        if (res.success || Array.isArray(res.cohorts || res)) {
          setCohorts(res.cohorts || res)
        }
      } catch (err: any) {
        console.error('Failed to load cohorts', err)
      } finally {
        setLoadingCohorts(false)
      }
    }
    fetchCohorts()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccessMessage('')

    try {
      const res = await apiClient.manualOnboardScholarshipStudent({
        firstName: formData.firstName,
        middleName: formData.middleName || undefined,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || undefined,
        cohortId: formData.cohortId,
        course: formData.course || undefined,
        password: formData.password || undefined,
        amountPaid: formData.amountPaid
          ? Number(formData.amountPaid)
          : undefined,
        paymentReference: formData.paymentReference || undefined,
      })

      if (res.success || res.status === 'success' || res._id || res.id) {
        setSuccessMessage('Scholarship student successfully onboarded!')
        setFormData({
          firstName: '',
          middleName: '',
          lastName: '',
          email: '',
          phone: '',
          cohortId: '',
          course: '',
          password: '',
          amountPaid: '',
          paymentReference: '',
        })
      } else {
        setError(res.message || 'Failed to onboard scholarship student.')
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='p-6 max-w-4xl mx-auto space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl font-bold text-dark dark:text-white flex items-center gap-2'>
          <UserPlus className='text-primary-purple' /> Manual Scholarship
          Onboarding
        </h1>
        <p className='text-sm text-gray-500 dark:text-gray-400'>
          Directly register and provision credentials for a scholarship student
          into a specific cohort.
        </p>
      </div>

      {/* Form Card */}
      <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm'>
        {successMessage && (
          <div className='mb-6 p-4 rounded-xl bg-green-500/10 text-green-600 flex items-center gap-3 text-sm font-medium'>
            <CheckCircle2 size={20} />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className='mb-6 p-4 rounded-xl bg-red-500/10 text-red-600 flex items-center gap-3 text-sm font-medium'>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='space-y-1'>
              <label className='text-xs font-semibold uppercase text-gray-400'>
                First Name *
              </label>
              <input
                required
                type='text'
                placeholder='e.g. Hilosthone'
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple'
              />
            </div>
            <div className='space-y-1'>
              <label className='text-xs font-semibold uppercase text-gray-400'>
                Middle Name
              </label>
              <input
                type='text'
                placeholder='e.g. Sulyman'
                value={formData.middleName}
                onChange={(e) =>
                  setFormData({ ...formData, middleName: e.target.value })
                }
                className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple'
              />
            </div>
            <div className='space-y-1'>
              <label className='text-xs font-semibold uppercase text-gray-400'>
                Last Name *
              </label>
              <input
                required
                type='text'
                placeholder='e.g. Dev'
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple'
              />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-1'>
              <label className='text-xs font-semibold uppercase text-gray-400'>
                Email Address *
              </label>
              <input
                required
                type='email'
                placeholder='student@denskill.com'
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple'
              />
            </div>
            <div className='space-y-1'>
              <label className='text-xs font-semibold uppercase text-gray-400'>
                Phone Number
              </label>
              <input
                type='text'
                placeholder='+2348012345678'
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple'
              />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-1'>
              <label className='text-xs font-semibold uppercase text-gray-400'>
                Scholarship Cohort *
              </label>
              <select
                required
                value={formData.cohortId}
                onChange={(e) =>
                  setFormData({ ...formData, cohortId: e.target.value })
                }
                className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple text-gray-700 dark:text-gray-300'
              >
                <option value=''>Select Cohort</option>
                {cohorts.map((cohort) => (
                  <option
                    key={cohort._id || cohort.id}
                    value={cohort._id || cohort.id}
                  >
                    {cohort.name} ({cohort.code})
                  </option>
                ))}
              </select>
            </div>
            <div className='space-y-1'>
              <label className='text-xs font-semibold uppercase text-gray-400'>
                Assigned Course
              </label>
              <select
                value={formData.course}
                onChange={(e) =>
                  setFormData({ ...formData, course: e.target.value })
                }
                className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple text-gray-700 dark:text-gray-300'
              >
                <option value=''>Select Course</option>
                {COURSES.map((courseTitle) => (
                  <option key={courseTitle} value={courseTitle}>
                    {courseTitle}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-1'>
              <label className='text-xs font-semibold uppercase text-gray-400'>
                Amount Paid (₦)
              </label>
              <input
                type='number'
                placeholder='e.g. 15000'
                value={formData.amountPaid}
                onChange={(e) =>
                  setFormData({ ...formData, amountPaid: e.target.value })
                }
                className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple'
              />
            </div>
            <div className='space-y-1'>
              <label className='text-xs font-semibold uppercase text-gray-400'>
                Payment Reference
              </label>
              <input
                type='text'
                placeholder='MANUAL_PAY_1_1719582000'
                value={formData.paymentReference}
                onChange={(e) =>
                  setFormData({ ...formData, paymentReference: e.target.value })
                }
                className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple'
              />
            </div>
          </div>

          <div className='space-y-1'>
            <label className='text-xs font-semibold uppercase text-gray-400'>
              Temporary Password
            </label>
            <input
              type='text'
              placeholder='denskill123'
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple'
            />
          </div>

          <div className='pt-4 flex justify-end'>
            <button
              disabled={submitting || loadingCohorts}
              type='submit'
              className='px-6 py-3 rounded-xl bg-primary-purple text-white text-sm font-medium hover:opacity-95 transition flex items-center gap-2'
            >
              {submitting && <Loader2 size={18} className='animate-spin' />}
              Onboard Scholarship Student
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}