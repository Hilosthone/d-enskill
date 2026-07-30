'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MessageSquare, Users, Video, ExternalLink } from 'lucide-react'

export default function StudentCommunityPage() {
  const router = useRouter()

  useEffect(() => {
    const loggedIn = sessionStorage.getItem('isLoggedIn')
    if (!loggedIn) router.push('/auth/login')
  }, [router])

  return (
    <div className='p-6 md:p-12 space-y-6 max-w-5xl mx-auto'>
      <div>
        <h1 className='text-2xl font-bold text-dark dark:text-white'>
          Academy Community Hub
        </h1>
        <p className='text-xs text-gray-500 mt-1'>
          Connect with your cohort peers, join study groups, and attend
          mentorship calls.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* WhatsApp Channel Card */}
        <div className='p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-4'>
          <div className='w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600'>
            <MessageSquare size={24} />
          </div>
          <div>
            <h3 className='font-bold text-dark dark:text-white text-base'>
              Official WhatsApp Cohort
            </h3>
            <p className='text-xs text-gray-500 mt-1'>
              Instant discussions, daily code challenges, and instructor
              announcements.
            </p>
          </div>
          <a
            href='https://wa.me/2348134984001'
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white font-bold text-xs rounded-xl hover:bg-green-700 transition-all shadow-md'
          >
            Open WhatsApp Group <ExternalLink size={14} />
          </a>
        </div>

        {/* Live Office Hours Card */}
        <div className='p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-4'>
          <div className='w-12 h-12 rounded-xl bg-primary-purple/10 flex items-center justify-center text-primary-purple'>
            <Video size={24} />
          </div>
          <div>
            <h3 className='font-bold text-dark dark:text-white text-base'>
              Weekly Office Hours
            </h3>
            <p className='text-xs text-gray-500 mt-1'>
              Join live debugging sessions and code reviews every Thursday.
            </p>
          </div>
          <button
            onClick={() =>
              alert(
                'Meeting link will be active 15 minutes before the session.',
              )
            }
            className='inline-flex items-center gap-2 px-5 py-2.5 bg-primary-purple text-white font-bold text-xs rounded-xl hover:opacity-90 transition-all shadow-md'
          >
            View Meeting Link <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
