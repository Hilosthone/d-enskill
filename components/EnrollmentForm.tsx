// 'use client'
// import { useState, FormEvent } from 'react'
// import { useRouter } from 'next/navigation'
// import { PROGRAMMES } from '@/constants/programmes'

// export default function RegisterPage() {
//   const router = useRouter()
//   const [formData, setFormData] = useState({
//     firstName: '',
//     middleName: '',
//     lastName: '',
//     country: '',
//     phone: '',
//     email: '',
//     course: '',
//     reason: '',
//     referredBy: '',
//     agreedToCatalogue: false,
//   })

//   const handleSubmit = (e: FormEvent) => {
//     e.preventDefault()

//     if (!formData.agreedToCatalogue) {
//       alert(
//         'Please confirm that you have read and agreed to the D Enskill Programme Catalogue.',
//       )
//       return
//     }

//     // Save registration data temporarily (e.g. in sessionStorage) to use on payment/account pages
//     sessionStorage.setItem('pendingRegistration', JSON.stringify(formData))

//     // Navigate to dedicated payment page
//     router.push('/payment')
//   }

//   const inputClass =
//     'w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-dark dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple transition-all'

//   return (
//     <div className='min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4'>
//       <div className='max-w-2xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm'>
//         <h2 className='text-2xl font-bold text-dark dark:text-white mb-2'>
//           Student Admission Registration
//         </h2>
//         <p className='text-gray-600 dark:text-gray-400 mb-8'>
//           Fill out your details to begin your application process.
//         </p>

//         <form className='space-y-5' onSubmit={handleSubmit}>
//           {/* Name fields */}
//           <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
//             <input
//               required
//               placeholder='First Name'
//               className={inputClass}
//               value={formData.firstName}
//               onChange={(e) =>
//                 setFormData({ ...formData, firstName: e.target.value })
//               }
//             />
//             <input
//               placeholder='Middle (Optional)'
//               className={inputClass}
//               value={formData.middleName}
//               onChange={(e) =>
//                 setFormData({ ...formData, middleName: e.target.value })
//               }
//             />
//             <input
//               required
//               placeholder='Last Name'
//               className={inputClass}
//               value={formData.lastName}
//               onChange={(e) =>
//                 setFormData({ ...formData, lastName: e.target.value })
//               }
//             />
//           </div>

//           {/* Course Selection Dropdown */}
//           <select
//             required
//             className={inputClass}
//             value={formData.course}
//             onChange={(e) =>
//               setFormData({ ...formData, course: e.target.value })
//             }
//           >
//             <option value='' disabled>
//               Select a Program
//             </option>
//             {PROGRAMMES.map((prog) => (
//               <option key={prog.title} value={prog.title}>
//                 {prog.title} ({prog.price})
//               </option>
//             ))}
//           </select>

//           {/* Country & Phone */}
//           <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//             <input
//               required
//               placeholder='Country'
//               className={inputClass}
//               value={formData.country}
//               onChange={(e) =>
//                 setFormData({ ...formData, country: e.target.value })
//               }
//             />
//             <input
//               required
//               type='tel'
//               placeholder='Phone Number'
//               className={inputClass}
//               value={formData.phone}
//               onChange={(e) =>
//                 setFormData({ ...formData, phone: e.target.value })
//               }
//             />
//           </div>

//           <input
//             required
//             type='email'
//             placeholder='Email Address'
//             className={inputClass}
//             value={formData.email}
//             onChange={(e) =>
//               setFormData({ ...formData, email: e.target.value })
//             }
//           />

//           {/* Referral Text Input */}
//           <input
//             type='text'
//             placeholder='Referred by (e.g. Growth Addict - Optional)'
//             className={inputClass}
//             value={formData.referredBy}
//             onChange={(e) =>
//               setFormData({ ...formData, referredBy: e.target.value })
//             }
//           />

//           <div className='relative'>
//             <textarea
//               required
//               maxLength={500}
//               placeholder='Tell us why you are applying...'
//               className={`${inputClass} h-32`}
//               value={formData.reason}
//               onChange={(e) =>
//                 setFormData({ ...formData, reason: e.target.value })
//               }
//             />
//             <span className='absolute bottom-3 right-3 text-xs text-gray-400'>
//               {formData.reason.length}/500
//             </span>
//           </div>

//           {/* Catalogue Box */}
//           <div className='p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 flex items-center justify-between'>
//             <div className='text-sm text-gray-600 dark:text-gray-300'>
//               <p className='font-semibold text-dark dark:text-white'>
//                 D Enskill Programme Catalogue
//               </p>
//               <p className='text-xs text-gray-500'>
//                 Review curriculum requirements.
//               </p>
//             </div>
//             <a
//               href='/D_ENSKILL_PROGRAMME.pdf'
//               target='_blank'
//               rel='noopener noreferrer'
//               className='px-4 py-2 text-xs font-semibold rounded-lg border border-primary-purple text-primary-purple hover:bg-primary-purple/10 transition-all'
//             >
//               Preview PDF
//             </a>
//           </div>

//           {/* Terms Agreement Checkbox */}
//           <div className='flex items-start gap-3 pt-2'>
//             <input
//               type='checkbox'
//               id='catalogueAgreement'
//               required
//               className='mt-1 w-4 h-4 rounded border-gray-300 text-primary-purple focus:ring-primary-purple'
//               checked={formData.agreedToCatalogue}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   agreedToCatalogue: e.target.checked,
//                 })
//               }
//             />
//             <label
//               htmlFor='catalogueAgreement'
//               className='text-sm text-gray-600 dark:text-gray-400 cursor-pointer'
//             >
//               I confirm that I have read, understood, and agreed to the
//               guidelines outlined in the{' '}
//               <span className='text-primary-purple font-medium'>
//                 D Enskill Programme Catalogue
//               </span>
//               .
//             </label>
//           </div>

//           <button
//             type='submit'
//             className='w-full bg-primary-purple text-white py-4 rounded-xl font-bold hover:opacity-90 transition-all'
//           >
//             Proceed to Payment ➔
//           </button>
//         </form>
//       </div>
//     </div>
//   )
// }

'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { PROGRAMMES } from '@/constants/programmes'
import { apiClient } from '@/services/api'
import { Loader2 } from 'lucide-react'

// 1. Define props interface to handle title and subtitle from AdmissionPage
interface EnrollmentFormProps {
  title?: string
  subtitle?: string
}

export default function EnrollmentForm({
  title,
  subtitle,
}: EnrollmentFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    country: '',
    phone: '',
    email: '',
    course: '',
    reason: '',
    referredBy: '',
    agreedToCatalogue: false,
  })

  // Helper to extract numeric price from format like "₦250,000" or default to 20000
  const getCourseAmount = (courseTitle: string) => {
    const found = PROGRAMMES.find((p) => p.title === courseTitle)
    if (!found || !found.price) return 20000
    const numeric = parseInt(found.price.replace(/[^0-9]/g, ''), 10)
    return isNaN(numeric) ? 20000 : numeric
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!formData.agreedToCatalogue) {
      alert(
        'Please confirm that you have read and agreed to the D Enskill Programme Catalogue.',
      )
      return
    }

    setLoading(true)

    try {
      const amountPaid = getCourseAmount(formData.course)
      const callback_url = `${window.location.origin}/verify`

      const response = await apiClient.initializeEnrollment({
        firstName: formData.firstName,
        middleName: formData.middleName || undefined,
        lastName: formData.lastName,
        country: formData.country,
        phone: formData.phone,
        email: formData.email,
        course: formData.course,
        reason: formData.reason,
        referredBy: formData.referredBy || 'Direct',
        amountPaid,
        callback_url,
      })

      sessionStorage.setItem('pendingRegistration', JSON.stringify(formData))

      const checkoutUrl =
        response.authorization_url ||
        response.data?.authorization_url ||
        response.data?.data?.authorization_url

      if (checkoutUrl) {
        window.location.href = checkoutUrl
      } else {
        router.push('/payment')
      }
    } catch (err) {
      console.error('Enrollment initialization failed:', err)
      alert(
        'Unable to initialize payment gateway. Please check your connection.',
      )
      setLoading(false)
    }
  }

  const inputClass =
    'w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-dark dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple transition-all'

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4'>
      <div className='max-w-2xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm'>
        {/* Render dynamic title and subtitle if passed */}
        <h2 className='text-2xl font-bold text-dark dark:text-white mb-2'>
          {title || 'Student Admission Registration'}
        </h2>
        <p className='text-gray-600 dark:text-gray-400 mb-8'>
          {subtitle ||
            'Fill out your details to begin your application process.'}
        </p>

        <form className='space-y-5' onSubmit={handleSubmit}>
          {/* Name fields */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <input
              required
              placeholder='First Name'
              className={inputClass}
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
            />
            <input
              placeholder='Middle (Optional)'
              className={inputClass}
              value={formData.middleName}
              onChange={(e) =>
                setFormData({ ...formData, middleName: e.target.value })
              }
            />
            <input
              required
              placeholder='Last Name'
              className={inputClass}
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
            />
          </div>

          {/* Course Selection Dropdown */}
          <select
            required
            className={inputClass}
            value={formData.course}
            onChange={(e) =>
              setFormData({ ...formData, course: e.target.value })
            }
          >
            <option value='' disabled>
              Select a Program
            </option>
            {PROGRAMMES.map((prog) => (
              <option key={prog.title} value={prog.title}>
                {prog.title} ({prog.price})
              </option>
            ))}
          </select>

          {/* Country & Phone */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <input
              required
              placeholder='Country'
              className={inputClass}
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
            />
            <input
              required
              type='tel'
              placeholder='Phone Number'
              className={inputClass}
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          <input
            required
            type='email'
            placeholder='Email Address'
            className={inputClass}
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          {/* Referral Text Input */}
          <input
            type='text'
            placeholder='Referred by (e.g. Growth Addict - Optional)'
            className={inputClass}
            value={formData.referredBy}
            onChange={(e) =>
              setFormData({ ...formData, referredBy: e.target.value })
            }
          />

          <div className='relative'>
            <textarea
              required
              maxLength={500}
              placeholder='Tell us why you are applying...'
              className={`${inputClass} h-32`}
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
            />
            <span className='absolute bottom-3 right-3 text-xs text-gray-400'>
              {formData.reason.length}/500
            </span>
          </div>

          {/* Catalogue Box */}
          <div className='p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 flex items-center justify-between'>
            <div className='text-sm text-gray-600 dark:text-gray-300'>
              <p className='font-semibold text-dark dark:text-white'>
                D Enskill Programme Catalogue
              </p>
              <p className='text-xs text-gray-500'>
                Review curriculum requirements.
              </p>
            </div>
            <a
              href='/D_ENSKILL_PROGRAMME.pdf'
              target='_blank'
              rel='noopener noreferrer'
              className='px-4 py-2 text-xs font-semibold rounded-lg border border-primary-purple text-primary-purple hover:bg-primary-purple/10 transition-all'
            >
              Preview PDF
            </a>
          </div>

          {/* Terms Agreement Checkbox */}
          <div className='flex items-start gap-3 pt-2'>
            <input
              type='checkbox'
              id='catalogueAgreement'
              required
              className='mt-1 w-4 h-4 rounded border-gray-300 text-primary-purple focus:ring-primary-purple'
              checked={formData.agreedToCatalogue}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  agreedToCatalogue: e.target.checked,
                })
              }
            />
            <label
              htmlFor='catalogueAgreement'
              className='text-sm text-gray-600 dark:text-gray-400 cursor-pointer'
            >
              I confirm that I have read, understood, and agreed to the
              guidelines outlined in the{' '}
              <span className='text-primary-purple font-medium'>
                D Enskill Programme Catalogue
              </span>
              .
            </label>
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-primary-purple text-white py-4 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60'
          >
            {loading ? (
              <>
                <Loader2 size={18} className='animate-spin' /> Connecting to
                Flutterwave...
              </>
            ) : (
              'Proceed to Payment ➔'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}