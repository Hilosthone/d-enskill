import EnrollmentForm from '@/components/EnrollmentForm'

export default function AdmissionPage() {
  return (
    <main className='py-24 px-6 max-w-4xl mx-auto'>
      <div className='mb-16'>
        <h1 className='text-5xl font-bold mb-6 text-dark dark:text-white'>
          Start Your Tech Journey
        </h1>
        <p className='text-xl text-gray-600 dark:text-gray-400 leading-relaxed'>
          Join a community of innovators. Our admissions process is designed to
          be simple and transparent. Once you submit your application, our
          enrollment team will review your profile and reach out within 48 hours
          to discuss your next steps.
        </p>
      </div>
      <EnrollmentForm
        title='General Admission'
        subtitle='Fill in your details below to secure your spot in our upcoming cohort.'
      />
    </main>
  )
}
