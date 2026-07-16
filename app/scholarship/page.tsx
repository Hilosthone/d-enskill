import { Zap, Users, Award, Briefcase, ChevronRight } from 'lucide-react'

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
  { title: 'Certificate', desc: 'Industry-recognized proof of your skills.' },
  {
    title: 'Real Projects',
    desc: 'Build your portfolio with production-grade apps.',
  },
]

const STEPS = ['Application', 'Interview', 'Assessment', 'Admission']

export default function ScholarshipPage() {
  return (
    <main className='py-24 px-6 max-w-4xl mx-auto'>
      {/* Hero Section */}
      <div className='text-center mb-20'>
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
          <strong className='text-primary-blue'>90% tuition sponsorship</strong>{' '}
          to accelerate their tech career.
        </p>
      </div>

      {/* Benefits Grid */}
      <section className='mb-24'>
        <h2 className='text-3xl font-bold mb-12 text-center text-dark dark:text-white'>
          Program Benefits
        </h2>
        <div className='grid md:grid-cols-2 gap-6'>
          {BENEFITS.map((b, i) => (
            <div
              key={i}
              className='p-6 hover:border-primary-red rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm'
            >
              <div className='bg-primary-blue/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4'>
                {i === 0 ? (
                  <Zap className='text-primary-blue' />
                ) : (
                  <Award className='text-primary-blue' />
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
                <div className='w-12 h-12 rounded-full bg-primary-blue text-white flex items-center justify-center font-bold'>
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

      {/* CTA */}
      <div className='text-center mt-20'>
        <button className='bg-dark dark:bg-white text-white dark:text-dark px-10 py-4 rounded-full font-bold hover:opacity-90 transition-opacity'>
          Apply for TechRocket
        </button>
      </div>
    </main>
  )
}
