import Link from 'next/link'

export default function Scholarship() {
  return (
    <section
      id='scholarship'
      className='py-24 px-6 bg-primary-purple text-white text-center'
    >
      <div className='max-w-3xl mx-auto' data-aos='zoom-in'>
        <h2 className='text-4xl font-bold mb-6'>90% Tuition Scholarship</h2>
        <p className='text-lg opacity-90 mb-8'>
          Outstanding applicants can receive up to 90% tuition sponsorship. Join
          a community that supports your growth.
        </p>

        <Link
          href='/scholarship'
          className='inline-block bg-white text-primary-purple px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors'
        >
          Apply for Scholarship
        </Link>
      </div>
    </section>
  )
}
