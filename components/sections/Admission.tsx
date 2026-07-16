export default function Admission() {
  return (
    <section id='admission' className='py-24 px-6 max-w-4xl mx-auto'>
      {/* Explicitly set header color */}
      <h2 className='text-4xl font-bold mb-12 text-center text-dark dark:text-white'>
        Admission Process
      </h2>
      <div className='space-y-6'>
        {[
          'Enroll',
          'Attend Classes',
          'Weekly Assessments',
          'Standalone Project',
          'Graduation',
        ].map((step, i) => (
          <div
            key={i}
            // Ensure contrast on background colors
            className='flex items-center gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'
            data-aos='fade-left'
          >
            <span className='w-8 h-8 flex items-center justify-center bg-primary-red text-white rounded-full font-bold'>
              {i + 1}
            </span>
            {/* Explicitly set paragraph color */}
            <p className='font-medium text-dark dark:text-gray-100'>{step}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
