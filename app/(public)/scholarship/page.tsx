// //src/app/(public)/scholarship/page.tsx
// import { Zap, Users, Award, Briefcase, ChevronRight } from 'lucide-react'

// const BENEFITS = [
//   {
//     title: '90% Tuition Discount',
//     desc: 'Substantial financial support for dedicated learners.',
//   },
//   {
//     title: 'Access to Mentors',
//     desc: 'Direct guidance from industry experts.',
//   },
//   {
//     title: 'Community Support',
//     desc: 'Join a network of ambitious developers.',
//   },
//   { title: 'Certificate', desc: 'A proof of course completion.' },
//   {
//     title: 'Real Projects',
//     desc: 'Build your portfolio with production-grade apps.',
//   },
// ]

// const STEPS = ['Application', 'Interview', 'Assessment', 'Admission']

// export default function ScholarshipPage() {
//   return (
//     <main className='py-24 px-6 max-w-4xl mx-auto'>
//       {/* Hero Section */}
//       <div className='text-center mb-20'>
//         <span className='text-primary-red font-bold tracking-widest uppercase text-sm'>
//           Scholarship Program
//         </span>
//         <h1 className='text-6xl font-bold mt-4 mb-6 text-dark dark:text-white'>
//           <span className='font-bold text-dark dark:text-white'>
//             Tech<span className='text-primary-red'>Rocket</span>
//           </span>{' '}
//           Scholarship
//         </h1>
//         <p className='text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
//           Every cohort, outstanding applicants can receive up to{' '}
//           <strong className='text-primary-purple'>
//             80% tuition sponsorship
//           </strong>{' '}
//           to accelerate their tech career.
//         </p>
//       </div>

//       {/* Benefits Grid */}
//       <section className='mb-24'>
//         <h2 className='text-3xl font-bold mb-12 text-center text-dark dark:text-white'>
//           Program Benefits
//         </h2>
//         <div className='grid md:grid-cols-2 gap-6'>
//           {BENEFITS.map((b, i) => (
//             <div
//               key={i}
//               className='p-6 hover:border-primary-red rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm'
//             >
//               <div className='bg-primary-purple/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4'>
//                 {i === 0 ? (
//                   <Zap className='text-primary-purple' />
//                 ) : (
//                   <Award className='text-primary-purple' />
//                 )}
//               </div>
//               <h3 className='font-bold text-lg mb-2 text-dark dark:text-white'>
//                 {b.title}
//               </h3>
//               <p className='text-gray-600 dark:text-gray-400 text-sm'>
//                 {b.desc}
//               </p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Selection Process */}
//       <section className='bg-gray-50 dark:bg-gray-900/50 p-12 rounded-3xl border border-gray-100 dark:border-gray-800'>
//         <h2 className='text-3xl font-bold mb-12 text-center text-dark dark:text-white'>
//           Selection Process
//         </h2>
//         <div className='flex flex-col md:flex-row items-center justify-center gap-4'>
//           {STEPS.map((step, i) => (
//             <div key={i} className='flex items-center gap-4'>
//               <div className='flex flex-col items-center gap-2'>
//                 <div className='w-12 h-12 rounded-full bg-primary-purple text-white flex items-center justify-center font-bold'>
//                   {i + 1}
//                 </div>
//                 <span className='font-semibold text-dark dark:text-white text-sm'>
//                   {step}
//                 </span>
//               </div>
//               {i < 3 && (
//                 <ChevronRight className='hidden md:block text-gray-300' />
//               )}
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* CTA */}
//       <div className='text-center mt-20'>
//         <button className='bg-dark dark:bg-white text-white dark:text-dark px-10 py-4 rounded-full font-bold hover:opacity-90 transition-opacity'>
//           Apply for D Enskill scholarship program
//         </button>
//       </div>
//     </main>
//   )
// }

'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Zap,
  Award,
  ChevronRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react'
import { apiClient } from '@/services/api'

const BENEFITS = [
  {
    title: '90% Tuition Discount',
    desc: 'Substantial financial support for dedicated learners.',
  },
  {
    title: 'Access to Mentors',
    desc: 'Direct guidance from industry experts.',
  },
  {
    title: 'Community Support',
    desc: 'Join a network of ambitious developers.',
  },
  { title: 'Certificate', desc: 'A proof of course completion.' },
  {
    title: 'Real Projects',
    desc: 'Build your portfolio with production-grade apps.',
  },
]

const STEPS = ['Application', 'Interview', 'Assessment', 'Admission']

export default function ScholarshipPage() {
  const [cohorts, setCohorts] = useState<any[]>([])
  const [selectedCohort, setSelectedCohort] = useState<any>(null)
  const [isLoadingCohorts, setIsLoadingCohorts] = useState(true)

  // Status Check States
  const [checkEmail, setCheckEmail] = useState('')
  const [statusResult, setStatusResult] = useState<any>(null)
  const [isCheckingStatus, setIsCheckingStatus] = useState(false)
  const [statusError, setStatusError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCohorts = async () => {
      try {
        const res = await apiClient.getActiveScholarshipCohorts()
        if (Array.isArray(res)) {
          setCohorts(res)
          if (res.length > 0) setSelectedCohort(res[0])
        } else if (res?.cohorts || res?.data) {
          const list = res.cohorts || res.data
          setCohorts(list)
          if (list.length > 0) setSelectedCohort(list[0])
        }
      } catch (err) {
        console.error('Failed to load active scholarship cohorts', err)
      } finally {
        setIsLoadingCohorts(false)
      }
    }
    fetchCohorts()
  }, [])

  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!checkEmail) return
    setIsCheckingStatus(true)
    setStatusError(null)
    setStatusResult(null)

    try {
      const res = await apiClient.getScholarshipStatus(checkEmail)
      if (res && (res.status || res.application || res.success)) {
        setStatusResult(res)
      } else {
        setStatusError(
          res?.message ||
            res?.error ||
            'No scholarship application found for this email.',
        )
      }
    } catch (err: any) {
      setStatusError(err.message || 'Error retrieving scholarship status.')
    } finally {
      setIsCheckingStatus(false)
    }
  }

  return (
    <main className='py-24 px-6 max-w-4xl mx-auto space-y-24'>
      {/* Hero Section */}
      <div className='text-center'>
        <span className='text-primary-red font-bold tracking-widest uppercase text-sm'>
          Scholarship Program
        </span>
        <h1 className='text-6xl font-bold mt-4 mb-6 text-dark dark:text-white'>
          <span className='font-bold text-dark dark:text-white'>
            Tech<span className='text-primary-red'>Rocket</span>
          </span>{' '}
          Scholarship
        </h1>
        <p className='text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
          Every cohort, outstanding applicants can receive up to{' '}
          <strong className='text-primary-purple'>
            90% tuition sponsorship
          </strong>{' '}
          to accelerate their tech career.
        </p>

        {/* Active Cohorts Badge / Alert */}
        <div className='mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-purple/10 border border-primary-purple/20 text-xs font-semibold text-primary-purple'>
          {isLoadingCohorts ? (
            <Loader2 size={14} className='animate-spin' />
          ) : cohorts.length > 0 ? (
            <>
              <span className='w-2 h-2 rounded-full bg-green-500 animate-pulse'></span>
              Active Cohorts Open:{' '}
              {cohorts
                .map((c) => c.name || c.title || `Cohort #${c.id}`)
                .join(', ')}
            </>
          ) : (
            'No active cohorts open right now. Check back soon!'
          )}
        </div>
      </div>

      {/* Benefits Grid */}
      <section>
        <h2 className='text-3xl font-bold mb-12 text-center text-dark dark:text-white'>
          Program Benefits
        </h2>
        <div className='grid md:grid-cols-2 gap-6'>
          {BENEFITS.map((b, i) => (
            <div
              key={i}
              className='p-6 hover:border-primary-red rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-all'
            >
              <div className='bg-primary-purple/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4'>
                {i === 0 ? (
                  <Zap className='text-primary-purple' />
                ) : (
                  <Award className='text-primary-purple' />
                )}
              </div>
              <h3 className='font-bold text-lg mb-2 text-dark dark:text-white'>
                {b.title}
              </h3>
              <p className='text-gray-600 dark:text-gray-400 text-sm'>
                {b.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Selection Process */}
      <section className='bg-gray-50 dark:bg-gray-900/50 p-12 rounded-3xl border border-gray-100 dark:border-gray-800'>
        <h2 className='text-3xl font-bold mb-12 text-center text-dark dark:text-white'>
          Selection Process
        </h2>
        <div className='flex flex-col md:flex-row items-center justify-center gap-4'>
          {STEPS.map((step, i) => (
            <div key={i} className='flex items-center gap-4'>
              <div className='flex flex-col items-center gap-2'>
                <div className='w-12 h-12 rounded-full bg-primary-purple text-white flex items-center justify-center font-bold'>
                  {i + 1}
                </div>
                <span className='font-semibold text-dark dark:text-white text-sm'>
                  {step}
                </span>
              </div>
              {i < 3 && (
                <ChevronRight className='hidden md:block text-gray-300' />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Check Status Widget */}
      <section className='bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6'>
        <div className='text-center space-y-2'>
          <h3 className='text-xl font-bold text-dark dark:text-white'>
            Already Applied? Check Your Status
          </h3>
          <p className='text-xs text-gray-500'>
            Enter your application email address below to inspect your review
            stage.
          </p>
        </div>

        <form
          onSubmit={handleCheckStatus}
          className='flex flex-col sm:flex-row gap-3 max-w-md mx-auto'
        >
          <input
            type='email'
            required
            value={checkEmail}
            onChange={(e) => setCheckEmail(e.target.value)}
            placeholder='Enter your application email...'
            className='flex-1 p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-xs text-dark dark:text-white focus:outline-none focus:border-primary-purple'
          />
          <button
            type='submit'
            disabled={isCheckingStatus}
            className='px-6 py-3 bg-primary-purple text-white text-xs font-bold rounded-xl hover:opacity-95 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer'
          >
            {isCheckingStatus ? (
              <Loader2 size={14} className='animate-spin' />
            ) : (
              'Check Status'
            )}
          </button>
        </form>

        {statusError && (
          <div className='p-4 bg-red-500/10 border border-red-500 text-red-600 text-xs rounded-xl flex items-center gap-2 max-w-md mx-auto font-medium'>
            <AlertCircle size={16} />
            {statusError}
          </div>
        )}

        {statusResult && (
          <div className='p-4 bg-green-500/10 border border-green-500 text-green-700 dark:text-green-300 text-xs rounded-xl space-y-2 max-w-md mx-auto'>
            <div className='flex items-center gap-2 font-bold'>
              <CheckCircle2 size={16} />
              Application Record Found
            </div>
            <p>
              <strong>Status:</strong>{' '}
              {statusResult.status ||
                statusResult.application?.status ||
                'Under Review'}
            </p>
            <p>
              <strong>Course:</strong>{' '}
              {statusResult.course || statusResult.application?.course}
            </p>
          </div>
        )}
      </section>

      {/* CTA */}
      <div className='text-center space-y-4'>
        <Link
          href='/scholarship/apply'
          className='inline-flex items-center gap-2 bg-dark dark:bg-white text-white dark:text-dark px-10 py-4 rounded-full font-bold hover:opacity-90 transition-opacity text-sm'
        >
          Apply for D Enskill scholarship program
          <ArrowRight size={16} />
        </Link>
      </div>
    </main>
  )
}