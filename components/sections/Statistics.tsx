import { HERO_STATS } from '@/constants/statistics'

export default function Statistics() {
  return (
    <section className='py-12 px-6'>
      <div className='max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 bg-white dark:bg-gray-900 border border-gray-light dark:border-gray-800 p-8 rounded-3xl shadow-lg'>
        {HERO_STATS.map((stat, index) => (
          <div
            key={stat.label}
            className='text-center group border-r border-gray-light dark:border-gray-800 last:border-r-0'
            data-aos='fade-up'
            data-aos-delay={index * 100}
          >
            <p className='text-5xl font-extrabold text-primary-red group-hover:scale-105 transition-transform'>
              {stat.value}
            </p>
            <p className='mt-2 text-sm font-semibold text-dark/70 dark:text-white/70 uppercase tracking-wide'>
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
