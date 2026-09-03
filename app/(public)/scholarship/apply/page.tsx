// src/app/(public)/scholarship/apply/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import { apiClient } from '@/services/api'

const AVAILABLE_COURSES = [
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
]

const REFERRAL_OPTIONS = [
  'Friend / Colleague',
  'Social Media (Twitter/X, LinkedIn, Instagram)',
  'Google Search',
  'WhatsApp / Telegram Group',
  'Alumni / Student',
  'Other',
]

export default function ScholarshipApplyPage() {
  const router = useRouter()
  const [cohorts, setCohorts] = useState<any[]>([])
  const [isLoadingCohorts, setIsLoadingCohorts] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successData, setSuccessData] = useState<any | null>(null)

  const [formData, setFormData] = useState({
    cohortId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    course: 'Full Stack Development',
    statement: '',
    country: 'Nigeria',
    educationalBackground: '',
    technicalBackground: '',
    reasonForApplying: '',
    motivation: '',
    portfolioUrl: '',
    referredBy: 'Social Media',
  })

  useEffect(() => {
    const fetchCohorts = async () => {
      try {
        const res = await apiClient.getActiveScholarshipCohorts()
        const list = Array.isArray(res) ? res : res?.cohorts || res?.data || []
        setCohorts(list)
        if (list.length > 0) {
          setFormData((prev) => ({
            ...prev,
            cohortId: list[0].id || list[0]._id,
          }))
        }
      } catch (err) {
        console.error('Failed to fetch active cohorts', err)
      } finally {
        setIsLoadingCohorts(false)
      }
    }
    fetchCohorts()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg(null)

    try {
      const response = await apiClient.submitScholarshipApplication(formData)
      if (
        response &&
        (response.success || response.application || response.message)
      ) {
        setSuccessData(response)
      } else {
        setErrorMsg(
          response?.message ||
            response?.error ||
            'Failed to submit scholarship application.',
        )
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during submission.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className='py-20 px-6 max-w-3xl mx-auto space-y-8'>
      <div className='flex items-center justify-between'>
        <Link
          href='/scholarship'
          className='inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-dark dark:hover:text-white transition-colors'
        >
          <ArrowLeft size={16} /> Back to Scholarship Overview
        </Link>
      </div>

      <div className='space-y-2'>
        <h1 className='text-3xl font-bold text-dark dark:text-white'>
          Scholarship Application Form
        </h1>
        <p className='text-xs text-gray-500'>
          Complete the form below to apply for up to 80% tuition sponsorship in
          our upcoming cohort.
        </p>
      </div>

      <AnimatePresence mode='wait'>
        {successData ? (
          <motion.div
            key='success'
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, type: 'spring', bounce: 0.3 }}
            className='p-10 bg-gradient-to-br from-green-500/10 via-primary-purple/5 to-green-500/15 border border-green-500/40 rounded-3xl space-y-6 text-center shadow-lg'
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className='w-20 h-20 bg-green-500/20 text-green-600 rounded-full flex items-center justify-center mx-auto'
            >
              <CheckCircle2 size={42} />
            </motion.div>

            <div className='space-y-2'>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 text-green-700 dark:text-green-300 text-[11px] font-bold uppercase tracking-wider'
              >
                <Sparkles size={13} /> Application Received Successfully
              </motion.div>
              <h2 className='text-2xl font-bold text-dark dark:text-white'>
                Welcome Aboard the Journey!
              </h2>
              <p className='text-xs text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed'>
                Thank you for taking this bold step. We have successfully registered
                your application. Keep a close eye on your email inbox for review
                updates, interview invitations, and further instructions.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className='pt-2'
            >
              <button
                onClick={() => router.push('/scholarship')}
                className='px-8 py-3.5 bg-primary-purple text-white text-xs font-bold rounded-xl shadow-md hover:opacity-95 transition-all cursor-pointer'
              >
                Return to Scholarship Hub
              </button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.form
            key='form'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit}
            className='bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6'
          >
            {errorMsg && (
              <div className='p-4 bg-red-500/10 border border-red-500 text-red-600 text-xs rounded-xl flex items-center gap-2 font-medium'>
                <AlertCircle size={16} />
                {errorMsg}
              </div>
            )}

            <div className='space-y-1.5'>
              <label className='text-xs font-bold text-dark dark:text-white'>
                Select Active Cohort *
              </label>
              {isLoadingCohorts ? (
                <div className='p-3 rounded-xl border border-gray-200 dark:border-gray-800 text-xs text-gray-400 flex items-center gap-2'>
                  <Loader2 size={14} className='animate-spin' /> Loading
                  cohorts...
                </div>
              ) : cohorts.length === 0 ? (
                <div className='p-3 rounded-xl border border-red-500 text-xs text-red-500'>
                  No active cohorts available for application right now.
                </div>
              ) : (
                <select
                  name='cohortId'
                  required
                  value={formData.cohortId}
                  onChange={handleChange}
                  className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-xs text-dark dark:text-white focus:outline-none focus:border-primary-purple'
                >
                  {cohorts.map((c) => (
                    <option key={c.id || c._id} value={c.id || c._id}>
                      {c.name || c.title || `Cohort #${c.id}`}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-xs'>
              <div className='space-y-1.5'>
                <label className='font-bold text-dark dark:text-white'>
                  First Name *
                </label>
                <input
                  type='text'
                  name='firstName'
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder='e.g. John'
                  className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white focus:outline-none focus:border-primary-purple'
                />
              </div>
              <div className='space-y-1.5'>
                <label className='font-bold text-dark dark:text-white'>
                  Last Name *
                </label>
                <input
                  type='text'
                  name='lastName'
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder='e.g. Doe'
                  className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white focus:outline-none focus:border-primary-purple'
                />
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-xs'>
              <div className='space-y-1.5'>
                <label className='font-bold text-dark dark:text-white'>
                  Email Address *
                </label>
                <input
                  type='email'
                  name='email'
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='john@example.com'
                  className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white focus:outline-none focus:border-primary-purple'
                />
              </div>
              <div className='space-y-1.5'>
                <label className='font-bold text-dark dark:text-white'>
                  Phone Number *
                </label>
                <input
                  type='text'
                  name='phone'
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder='+2348000000000'
                  className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white focus:outline-none focus:border-primary-purple'
                />
              </div>
              <div className='space-y-1.5'>
                <label className='font-bold text-dark dark:text-white'>
                  Country
                </label>
                <input
                  type='text'
                  name='country'
                  value={formData.country}
                  onChange={handleChange}
                  placeholder='Nigeria'
                  className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white focus:outline-none focus:border-primary-purple'
                />
              </div>
            </div>

            <div className='space-y-1.5 text-xs'>
              <label className='font-bold text-dark dark:text-white'>
                Target Course *
              </label>
              <select
                name='course'
                required
                value={formData.course}
                onChange={handleChange}
                className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white focus:outline-none focus:border-primary-purple'
              >
                {AVAILABLE_COURSES.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>

            <div className='space-y-1.5 text-xs'>
              <label className='font-bold text-dark dark:text-white'>
                Statement of Purpose *
              </label>
              <textarea
                name='statement'
                required
                rows={4}
                value={formData.statement}
                onChange={handleChange}
                placeholder='Why do you want to build a career in software development?'
                className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white focus:outline-none focus:border-primary-purple'
              ></textarea>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-xs'>
              <div className='space-y-1.5'>
                <label className='font-bold text-dark dark:text-white'>
                  Educational Background
                </label>
                <input
                  type='text'
                  name='educationalBackground'
                  value={formData.educationalBackground}
                  onChange={handleChange}
                  placeholder='e.g. B.Sc Computer Science / Self-taught'
                  className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white focus:outline-none focus:border-primary-purple'
                />
              </div>
              <div className='space-y-1.5'>
                <label className='font-bold text-dark dark:text-white'>
                  Technical Background
                </label>
                <input
                  type='text'
                  name='technicalBackground'
                  value={formData.technicalBackground}
                  onChange={handleChange}
                  placeholder='e.g. HTML, CSS, JavaScript basics'
                  className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white focus:outline-none focus:border-primary-purple'
                />
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-xs'>
              <div className='space-y-1.5'>
                <div className='flex items-center justify-between'>
                  <label className='font-bold text-dark dark:text-white'>
                    Portfolio or GitHub URL
                  </label>
                  <span className='text-[10px] text-gray-400 font-medium'>
                    Optional
                  </span>
                </div>
                <input
                  type='url'
                  name='portfolioUrl'
                  value={formData.portfolioUrl}
                  onChange={handleChange}
                  placeholder='https://github.com/yourusername (Optional)'
                  className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white focus:outline-none focus:border-primary-purple'
                />
              </div>

              <div className='space-y-1.5'>
                <label className='font-bold text-dark dark:text-white'>
                  How did you hear about us? *
                </label>
                <input
                  type='text'
                  name='referredBy'
                  required
                  list='referral-options-list'
                  value={formData.referredBy}
                  onChange={handleChange}
                  placeholder='Select or type custom answer...'
                  className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white focus:outline-none focus:border-primary-purple'
                />
                <datalist id='referral-options-list'>
                  {REFERRAL_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} />
                  ))}
                </datalist>
              </div>
            </div>

            <div className='pt-4 flex justify-end'>
              <button
                type='submit'
                disabled={isSubmitting}
                className='flex items-center gap-2 px-8 py-3.5 bg-primary-purple text-white text-xs font-bold rounded-xl shadow-md hover:opacity-95 disabled:opacity-50 cursor-pointer transition-all'
              >
                {isSubmitting ? (
                  <Loader2 size={16} className='animate-spin' />
                ) : (
                  <Send size={16} />
                )}
                Submit Scholarship Application
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </main>
  )
}