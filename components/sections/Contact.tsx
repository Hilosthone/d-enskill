

import { Mail, Phone } from 'lucide-react'

export default function Contact() {
  return (
    // bg-white for light mode, bg-gray-950 for dark mode
    <section
      id='contact'
      className='py-24 px-6 bg-white dark:bg-gray-950 transition-colors'
    >
      <div className='max-w-4xl mx-auto text-center'>
        <h2 className='text-4xl font-bold mb-4 text-dark dark:text-white'>
          Get In Touch
        </h2>
        <p className='text-gray-600 dark:text-gray-400 mb-12 text-lg'>
          We would love to hear from you. Reach out to us for any inquiries.
        </p>

        <div className='grid md:grid-cols-2 gap-8'>
          {/* WhatsApp Link Card */}
          <a
            href='https://wa.me/2348134984001'
            target='_blank'
            rel='noopener noreferrer'
            className='bg-gray-100 dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col items-center gap-4 hover:border-primary-red transition-all'
          >
            <div className='p-3 bg-primary-blue/10 rounded-full text-primary-blue'>
              <Phone size={24} />
            </div>
            <h3 className='font-bold text-xl text-dark dark:text-white'>
              Chat on WhatsApp
            </h3>
            <p className='text-gray-600 dark:text-gray-400'>
              +234 813 498 4001
            </p>
          </a>

          {/* Email Link Card */}
          <a
            href='mailto:info@diluxury.co.org'
            className='bg-gray-100 dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col items-center gap-4 hover:border-primary-red transition-all'
          >
            <div className='p-3 bg-primary-blue/10 rounded-full text-primary-blue'>
              <Mail size={24} />
            </div>
            <h3 className='font-bold text-xl text-dark dark:text-white'>
              Email Us
            </h3>
            <p className='text-gray-600 dark:text-gray-400'>
              info@diluxury.co.org
            </p>
          </a>
        </div>
      </div>
    </section>
  )
}