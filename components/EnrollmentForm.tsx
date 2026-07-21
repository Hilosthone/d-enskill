// 'use client'
// import { useState, FormEvent } from 'react'
// import { PROGRAMMES } from '@/constants/programmes'

// interface FormProps {
//   title: string
//   subtitle: string
// }

// export default function EnrollmentForm({ title, subtitle }: FormProps) {
//   const [formData, setFormData] = useState({
//     firstName: '',
//     middleName: '',
//     lastName: '',
//     country: '',
//     phone: '',
//     email: '',
//     course: '',
//     reason: '',
//     agreedToCatalogue: false, // Added agreement state
//   })

//   const handleSubmit = (e: FormEvent) => {
//     e.preventDefault()

//     if (!formData.agreedToCatalogue) {
//       alert(
//         'Please confirm that you have read and agreed to the D Enskill Programme Catalogue.',
//       )
//       return
//     }

//     const message = `Hello D Enskill, I would like to apply for the ${formData.course} program at D Enskill.

// *Application Details:*
// Name: ${formData.firstName} ${formData.middleName} ${formData.lastName}
// Country: ${formData.country}
// Phone: ${formData.phone}
// Email: ${formData.email}
// Reason for applying: ${formData.reason}
// Agreed to Programme Catalogue: Yes`

//     const whatsappUrl = `https://wa.me/2348134984001?text=${encodeURIComponent(message)}`
//     window.open(whatsappUrl, '_blank')
//   }

//   const inputClass =
//     'w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-dark dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple transition-all'

//   return (
//     <div className='bg-gray-50 dark:bg-gray-900/50 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm'>
//       <h2 className='text-2xl font-bold text-dark dark:text-white mb-2'>
//         {title}
//       </h2>
//       <p className='text-gray-600 dark:text-gray-400 mb-8'>{subtitle}</p>

//       <form className='space-y-5' onSubmit={handleSubmit}>
//         {/* Name fields */}
//         <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
//           <input
//             required
//             placeholder='First Name'
//             className={inputClass}
//             value={formData.firstName}
//             onChange={(e) =>
//               setFormData({ ...formData, firstName: e.target.value })
//             }
//           />
//           <input
//             placeholder='Middle (Optional)'
//             className={inputClass}
//             value={formData.middleName}
//             onChange={(e) =>
//               setFormData({ ...formData, middleName: e.target.value })
//             }
//           />
//           <input
//             required
//             placeholder='Last Name'
//             className={inputClass}
//             value={formData.lastName}
//             onChange={(e) =>
//               setFormData({ ...formData, lastName: e.target.value })
//             }
//           />
//         </div>

//         {/* Course Selection Dropdown */}
//         <select
//           required
//           className={inputClass}
//           value={formData.course}
//           onChange={(e) => setFormData({ ...formData, course: e.target.value })}
//         >
//           <option value='' disabled>
//             Select a Program
//           </option>
//           {PROGRAMMES.map((prog) => (
//             <option key={prog.title} value={prog.title}>
//               {prog.title} ({prog.price})
//             </option>
//           ))}
//         </select>

//         {/* Other fields */}
//         <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//           <input
//             required
//             placeholder='Country'
//             className={inputClass}
//             value={formData.country}
//             onChange={(e) =>
//               setFormData({ ...formData, country: e.target.value })
//             }
//           />
//           <input
//             required
//             type='tel'
//             placeholder='Phone Number'
//             className={inputClass}
//             value={formData.phone}
//             onChange={(e) =>
//               setFormData({ ...formData, phone: e.target.value })
//             }
//           />
//         </div>

//         <input
//           required
//           type='email'
//           placeholder='Email Address'
//           className={inputClass}
//           value={formData.email}
//           onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//         />

//         <div className='relative'>
//           <textarea
//             required
//             maxLength={500}
//             placeholder='Tell us why you are applying...'
//             className={`${inputClass} h-32`}
//             value={formData.reason}
//             onChange={(e) =>
//               setFormData({ ...formData, reason: e.target.value })
//             }
//           />
//           <span className='absolute bottom-3 right-3 text-xs text-gray-400'>
//             {formData.reason.length}/500
//           </span>
//         </div>

//         {/* Professional Catalogue Reader & Download Box */}
//         <div className='p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex flex-col md:flex-row items-center justify-between gap-4'>
//           <div className='text-sm text-gray-600 dark:text-gray-300'>
//             <p className='font-semibold text-dark dark:text-white'>
//               D Enskill Programme Catalogue
//             </p>
//             <p className='text-xs text-gray-500'>
//               Review our curriculum, schedules, and requirements before
//               applying.
//             </p>
//           </div>
//           <div className='flex items-center gap-3 w-full md:w-auto'>
//             <a
//               href='/D_ENSKILL_PROGRAMME.pdf'
//               target='_blank'
//               rel='noopener noreferrer'
//               className='px-4 py-2 text-xs font-semibold rounded-lg border border-primary-purple text-primary-purple hover:bg-primary-purple/10 transition-all text-center'
//             >
//               Preview PDF
//             </a>
//             <a
//               href='/D_ENSKILL_PROGRAMME.pdf'
//               download='D_ENSKILL_PROGRAMME.pdf'
//               className='px-4 py-2 text-xs font-semibold rounded-lg bg-primary-purple text-white hover:opacity-90 transition-all text-center'
//             >
//               Download
//             </a>
//           </div>
//         </div>

//         {/* Terms Agreement Checkbox */}
//         <div className='flex items-start gap-3 pt-2'>
//           <input
//             type='checkbox'
//             id='catalogueAgreement'
//             required
//             className='mt-1 w-4 h-4 rounded border-gray-300 text-primary-purple focus:ring-primary-purple'
//             checked={formData.agreedToCatalogue}
//             onChange={(e) =>
//               setFormData({ ...formData, agreedToCatalogue: e.target.checked })
//             }
//           />
//           <label
//             htmlFor='catalogueAgreement'
//             className='text-sm text-gray-600 dark:text-gray-400 cursor-pointer'
//           >
//             I confirm that I have read, understood, and agreed to the guidelines
//             outlined in the{' '}
//             <span className='text-primary-purple font-medium'>
//               D Enskill Programme Catalogue
//             </span>
//             .
//           </label>
//         </div>

//         <button
//           type='submit'
//           className='w-full bg-primary-purple text-white py-4 rounded-xl font-bold hover:opacity-90 transition-all transform hover:scale-[1.01]'
//         >
//           Submit Application
//         </button>
//       </form>
//     </div>
//   )
// }

'use client'
import { useState, FormEvent } from 'react'
import { PROGRAMMES } from '@/constants/programmes'

interface FormProps {
  title: string
  subtitle: string
}

export default function EnrollmentForm({ title, subtitle }: FormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    country: '',
    phone: '',
    email: '',
    course: '',
    reason: '',
    referredBy: '', // Changed to handle custom referral names
    agreedToCatalogue: false,
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!formData.agreedToCatalogue) {
      alert(
        'Please confirm that you have read and agreed to the D Enskill Programme Catalogue.',
      )
      return
    }

    const message = `Hello D Enskill, I would like to apply for the ${formData.course} program at D Enskill.
    
*Application Details:*
Name: ${formData.firstName} ${formData.middleName} ${formData.lastName}
Country: ${formData.country}
Phone: ${formData.phone}
Email: ${formData.email}
Reason for applying: ${formData.reason}
Referred by: ${formData.referredBy || 'None'}
Agreed to Programme Catalogue: Yes`

    const whatsappUrl = `https://wa.me/2348134984001?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const inputClass =
    'w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-dark dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple transition-all'

  return (
    <div className='bg-gray-50 dark:bg-gray-900/50 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm'>
      <h2 className='text-2xl font-bold text-dark dark:text-white mb-2'>
        {title}
      </h2>
      <p className='text-gray-600 dark:text-gray-400 mb-8'>{subtitle}</p>

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
          onChange={(e) => setFormData({ ...formData, course: e.target.value })}
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

        {/* Other fields */}
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
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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

        {/* Professional Catalogue Reader & Download Box */}
        <div className='p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex flex-col md:flex-row items-center justify-between gap-4'>
          <div className='text-sm text-gray-600 dark:text-gray-300'>
            <p className='font-semibold text-dark dark:text-white'>
              D Enskill Programme Catalogue
            </p>
            <p className='text-xs text-gray-500'>
              Review our curriculum, schedules, and requirements before
              applying.
            </p>
          </div>
          <div className='flex items-center gap-3 w-full md:w-auto'>
            <a
              href='/D_ENSKILL_PROGRAMME.pdf'
              target='_blank'
              rel='noopener noreferrer'
              className='px-4 py-2 text-xs font-semibold rounded-lg border border-primary-purple text-primary-purple hover:bg-primary-purple/10 transition-all text-center'
            >
              Preview PDF
            </a>
            <a
              href='/D_ENSKILL_PROGRAMME.pdf'
              download='D_ENSKILL_PROGRAMME.pdf'
              className='px-4 py-2 text-xs font-semibold rounded-lg bg-primary-purple text-white hover:opacity-90 transition-all text-center'
            >
              Download
            </a>
          </div>
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
              setFormData({ ...formData, agreedToCatalogue: e.target.checked })
            }
          />
          <label
            htmlFor='catalogueAgreement'
            className='text-sm text-gray-600 dark:text-gray-400 cursor-pointer'
          >
            I confirm that I have read, understood, and agreed to the guidelines
            outlined in the{' '}
            <span className='text-primary-purple font-medium'>
              D Enskill Programme Catalogue
            </span>
            .
          </label>
        </div>

        <button
          type='submit'
          className='w-full bg-primary-purple text-white py-4 rounded-xl font-bold hover:opacity-90 transition-all transform hover:scale-[1.01]'
        >
          Submit Application
        </button>
      </form>
    </div>
  )
}