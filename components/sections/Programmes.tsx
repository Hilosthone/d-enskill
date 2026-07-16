import { PROGRAMMES } from '@/constants/programmes'

export default function Programmes() {
  return (
    <section
      id='programmes'
      className='py-24 px-6 bg-gray-light dark:bg-gray-950'
    >
      <div className='max-w-7xl mx-auto'>
        {/* Added text-dark for light mode and text-white for dark mode */}
        <h2 className='text-4xl font-bold text-center mb-16 text-dark dark:text-white'>
          Our Programmes
        </h2>

        <div className='grid md:grid-cols-3 gap-6'>
          {PROGRAMMES.map((p, i) => (
            <div
              key={i}
              // Added dark:border-gray-800 for better visibility in dark mode
              className='bg-white dark:bg-dark p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-primary-purple transition'
              data-aos='fade-up'
            >
              {/* Explicitly set text colors for titles and paragraphs */}
              <h3 className='text-xl font-bold mb-2 text-dark dark:text-white'>
                {p.title}
              </h3>

              <p className='text-primary-purple font-semibold mb-4'>
                {p.price} | {p.duration}
              </p>

              {/* Added text-gray-600 for light mode and text-gray-300 for dark mode */}
              <p className='text-sm text-gray-600 dark:text-gray-300'>
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
