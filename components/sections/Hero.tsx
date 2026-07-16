import Link from 'next/link'
import { FiExternalLink, FiUserPlus } from 'react-icons/fi' // Sleek line icons

export default function Hero() {
  return (
    <section className='relative overflow-hidden pt-24 pb-20 px-6'>
      {/* Background Animated Codes Overlay (Pure CSS effect) */}
      <div className='absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.05] font-mono text-[10px] text-primary-purple [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_90%)]'>
        {`import React from 'react';
import { createRoot } from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(<h1>Building D Enskill...</h1>);
console.log("Welcome to D Enskill - Practical Skill Institute.");
// Software Development, UI/UX, Data Science, AI...
function techSkills(practial) { return practical * mentorship; }`}
      </div>

      <div className='max-w-5xl mx-auto text-center' data-aos='fade-up'>
        {/* Sleek Label */}
        <div className='inline-flex items-center gap-2 bg-primary-purple/10 dark:bg-primary-purple/20 text-primary-purple px-4 py-1 rounded-full text-xs font-semibold mb-6 border border-primary-purple/20'>
          <span className='relative flex h-2 w-2'>
            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-red opacity-75'></span>
            <span className='relative inline-flex rounded-full h-2 w-2 bg-primary-red'></span>
          </span>
          ADMISSIONS OPEN - APPLY FOR NEXT COHORT
        </div>

        {/* Main Headline */}
        <h1 className='text-5xl md:text-7xl font-extrabold tracking-tighter text-dark dark:text-white leading-[0.95]'>
          Become a <span className='text-primary-purple'>Job-Ready</span>
          <br /> Tech Professional.
        </h1>

        {/* Subheadline */}
        <p className='max-w-3xl mx-auto mt-8 text-xl text-dark/70 dark:text-white/70 leading-relaxed'>
          Learn software development, UI/UX, Data Science, AI, Blockchain, and
          other digital skills from experienced instructors through practical
          projects.
        </p>

        {/* CTA Buttons */}
        <div className='mt-12 flex flex-col sm:flex-row items-center justify-center gap-4'>
          <Link
            href='/admission'
            className='w-full sm:w-auto bg-primary-red text-white px-10 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2.5 hover:bg-red-700 transition-all shadow-lg hover:shadow-primary-red/30'
          >
            <FiUserPlus className='text-lg' />
            Enroll Now
          </Link>
          <Link
            href='/programmes'
            className='w-full sm:w-auto bg-white/80 dark:bg-gray-800/80 border border-gray-light dark:border-gray-700 text-dark dark:text-white px-10 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2.5 hover:bg-white dark:hover:bg-gray-800 transition-all shadow-sm'
          >
            View Programmes
            <FiExternalLink className='text-lg opacity-60' />
          </Link>
        </div>
      </div>
    </section>
  )
}
