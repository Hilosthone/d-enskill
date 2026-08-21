// 'use client'
// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { MessageSquare, Users, Video, ExternalLink } from 'lucide-react'

// export default function StudentCommunityPage() {
//   const router = useRouter()

//   useEffect(() => {
//     const loggedIn = sessionStorage.getItem('isLoggedIn')
//     if (!loggedIn) router.push('/auth/login')
//   }, [router])

//   return (
//     <div className='p-6 md:p-12 space-y-6 max-w-5xl mx-auto'>
//       <div>
//         <h1 className='text-2xl font-bold text-dark dark:text-white'>
//           Academy Community Hub
//         </h1>
//         <p className='text-xs text-gray-500 mt-1'>
//           Connect with your cohort peers, join study groups, and attend
//           mentorship calls.
//         </p>
//       </div>

//       <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
//         {/* WhatsApp Channel Card */}
//         <div className='p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-4'>
//           <div className='w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600'>
//             <MessageSquare size={24} />
//           </div>
//           <div>
//             <h3 className='font-bold text-dark dark:text-white text-base'>
//               Official WhatsApp Cohort
//             </h3>
//             <p className='text-xs text-gray-500 mt-1'>
//               Instant discussions, daily code challenges, and instructor
//               announcements.
//             </p>
//           </div>
//           <a
//             href='https://wa.me/2348134984001'
//             target='_blank'
//             rel='noopener noreferrer'
//             className='inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white font-bold text-xs rounded-xl hover:bg-green-700 transition-all shadow-md'
//           >
//             Open WhatsApp Group <ExternalLink size={14} />
//           </a>
//         </div>

//         {/* Live Office Hours Card */}
//         <div className='p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-4'>
//           <div className='w-12 h-12 rounded-xl bg-primary-purple/10 flex items-center justify-center text-primary-purple'>
//             <Video size={24} />
//           </div>
//           <div>
//             <h3 className='font-bold text-dark dark:text-white text-base'>
//               Weekly Office Hours
//             </h3>
//             <p className='text-xs text-gray-500 mt-1'>
//               Join live debugging sessions and code reviews every Thursday.
//             </p>
//           </div>
//           <button
//             onClick={() =>
//               alert(
//                 'Meeting link will be active 15 minutes before the session.',
//               )
//             }
//             className='inline-flex items-center gap-2 px-5 py-2.5 bg-primary-purple text-white font-bold text-xs rounded-xl hover:opacity-90 transition-all shadow-md'
//           >
//             View Meeting Link <ExternalLink size={14} />
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  MessageSquare,
  Users,
  Video,
  ExternalLink,
  Sparkles,
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function StudentCommunityPage() {
  const router = useRouter()

  useEffect(() => {
    const loggedIn = sessionStorage.getItem('isLoggedIn')
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('denskill_token')
        : null

    if (!loggedIn && !token) {
      router.push('/auth/login')
    }
  }, [router])

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className='p-6 md:p-12 space-y-8 max-w-5xl mx-auto'
    >
      {/* Header Section */}
      <div className='flex items-center justify-between border-b border-gray-100 dark:border-gray-800/60 pb-6'>
        <div className='space-y-1'>
          <div className='flex items-center gap-2'>
            <span className='p-2 bg-primary-purple/10 text-primary-purple rounded-xl'>
              <Users size={20} />
            </span>
            <h1 className='text-2xl font-extrabold tracking-tight text-dark dark:text-white'>
              Academy Community Hub
            </h1>
          </div>
          <p className='text-xs text-gray-500 dark:text-gray-400 pl-9'>
            Connect with your cohort peers, join study groups, and attend live
            mentorship calls.
          </p>
        </div>
        <div className='hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300'>
          <Sparkles size={14} className='text-amber-500' />
          <span>Active Cohort</span>
        </div>
      </div>

      {/* Grid Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* WhatsApp Channel Card */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className='p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-4 shadow-sm hover:border-green-500/40 hover:shadow-md transition-all'
        >
          <div className='flex items-center justify-between'>
            <div className='w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600 font-bold'>
              <MessageSquare size={24} />
            </div>
            <span className='px-2.5 py-1 bg-green-500/10 text-green-600 text-[10px] font-bold rounded-full uppercase tracking-wider'>
              Instant Chat
            </span>
          </div>
          <div>
            <h3 className='font-bold text-dark dark:text-white text-base tracking-tight'>
              Official WhatsApp Cohort
            </h3>
            <p className='text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed'>
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
        </motion.div>

        {/* Live Office Hours Card */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className='p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-4 shadow-sm hover:border-primary-purple/40 hover:shadow-md transition-all'
        >
          <div className='flex items-center justify-between'>
            <div className='w-12 h-12 rounded-xl bg-primary-purple/10 flex items-center justify-center text-primary-purple font-bold'>
              <Video size={24} />
            </div>
            <span className='px-2.5 py-1 bg-primary-purple/10 text-primary-purple text-[10px] font-bold rounded-full uppercase tracking-wider'>
              Every Thursday
            </span>
          </div>
          <div>
            <h3 className='font-bold text-dark dark:text-white text-base tracking-tight'>
              Weekly Office Hours
            </h3>
            <p className='text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed'>
              Join live debugging sessions, code reviews, and direct Q&A with
              instructors.
            </p>
          </div>
          <button
            onClick={() =>
              alert(
                'Meeting link will be active 15 minutes before the session starts.',
              )
            }
            className='inline-flex items-center gap-2 px-5 py-2.5 bg-primary-purple text-white font-bold text-xs rounded-xl hover:opacity-90 transition-all shadow-md'
          >
            View Meeting Link <ExternalLink size={14} />
          </button>
        </motion.div>
      </div>
    </motion.div>
  )
}