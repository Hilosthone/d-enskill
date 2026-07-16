'use client'
import { useState } from 'react'

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
    reason: '',
  })

  // Reusable classes to keep the code clean and consistent
  const inputClass =
    'w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-dark dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple transition-all'

  return (
    <div className='bg-gray-50 dark:bg-gray-900/50 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm'>
      <h2 className='text-2xl font-bold text-dark dark:text-white mb-2'>
        {title}
      </h2>
      <p className='text-gray-600 dark:text-gray-400 mb-8'>{subtitle}</p>

      <form className='space-y-5'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <input
            required
            placeholder='First Name'
            className={inputClass}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
          />
          <input
            placeholder='Middle (Optional)'
            className={inputClass}
            onChange={(e) =>
              setFormData({ ...formData, middleName: e.target.value })
            }
          />
          <input
            required
            placeholder='Last Name'
            className={inputClass}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <input
            required
            placeholder='Country'
            className={inputClass}
            onChange={(e) =>
              setFormData({ ...formData, country: e.target.value })
            }
          />
          <input
            required
            type='tel'
            placeholder='Phone Number'
            className={inputClass}
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
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <div className='relative'>
          <textarea
            required
            maxLength={500}
            placeholder='Tell us why you are applying to D Enskill...'
            className={`${inputClass} h-32`}
            onChange={(e) =>
              setFormData({ ...formData, reason: e.target.value })
            }
          />
          <span className='absolute bottom-3 right-3 text-xs text-gray-400'>
            {formData.reason.length}/500
          </span>
        </div>

        <button
          type='submit'
          className='w-full bg-primary-purple text-white py-4 rounded-xl font-bold hover:bg-blue-800 transition-all transform hover:scale-[1.01]'
        >
          Submit Application
        </button>
      </form>
    </div>
  )
}
