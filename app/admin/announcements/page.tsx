// //src/app/admin/announcements/page.tsx
// 'use client'
// import { useState } from 'react'
// import { Bell, Send, CheckCircle, AlertTriangle, Calendar } from 'lucide-react'

// export default function AdminAnnouncementsPage() {
//   const [title, setTitle] = useState('')
//   const [message, setMessage] = useState('')
//   const [targetGroup, setTargetGroup] = useState('all')
//   const [success, setSuccess] = useState(false)

//   const handleBroadcast = (e: React.FormEvent) => {
//     e.preventDefault()
//     setSuccess(true)
//     setTimeout(() => {
//       setSuccess(false)
//       setTitle('')
//       setMessage('')
//     }, 3000)
//   }

//   const inputClass =
//     'w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 text-dark dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple text-sm'

//   return (
//     <div className='space-y-6 max-w-4xl mx-auto animate-fadeIn'>
//       <div>
//         <h2 className='text-2xl font-bold text-dark dark:text-white'>
//           Broadcast Announcements
//         </h2>
//         <p className='text-sm text-gray-500'>
//           Send instant notifications, schedule updates, or emergency notices to
//           enrolled students.
//         </p>
//       </div>

//       {success && (
//         <div className='p-4 bg-green-500/10 border border-green-500/20 text-green-600 rounded-2xl flex items-center gap-3 text-sm font-medium animate-fadeIn'>
//           <CheckCircle size={20} />
//           <span>
//             Announcement broadcasted successfully to all targeted student
//             dashboards!
//           </span>
//         </div>
//       )}

//       <div className='bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm'>
//         <form onSubmit={handleBroadcast} className='space-y-5'>
//           <div>
//             <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider'>
//               Target Audience
//             </label>
//             <select
//               value={targetGroup}
//               onChange={(e) => setTargetGroup(e.target.value)}
//               className={inputClass}
//             >
//               <option value='all'>All Enrolled Students (Global)</option>
//               <option value='fullstack'>Full-Stack Engineering Cohort</option>
//               <option value='mobile'>Mobile App Development Cohort</option>
//               <option value='frontend'>Frontend Architecture Cohort</option>
//             </select>
//           </div>

//           <div>
//             <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider'>
//               Notice Title
//             </label>
//             <input
//               type='text'
//               required
//               placeholder='e.g., Live Masterclass: Advanced State Management'
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className={inputClass}
//             />
//           </div>

//           <div>
//             <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider'>
//               Announcement Message
//             </label>
//             <textarea
//               required
//               rows={5}
//               placeholder='Type detailed instructions or broadcast content here...'
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               className={inputClass}
//             />
//           </div>

//           <button
//             type='submit'
//             className='w-full bg-primary-purple hover:bg-primary-purple/90 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-md cursor-pointer'
//           >
//             <Send size={16} />
//             <span>Broadcast Now</span>
//           </button>
//         </form>
//       </div>
//     </div>
//   )
// }

'use client'
import { useState } from 'react'
import {
  Bell,
  Send,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Loader2,
} from 'lucide-react'
import { apiClient } from '@/services/api'

export default function AdminAnnouncementsPage() {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [targetGroup, setTargetGroup] = useState('all')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await apiClient.createAnnouncement({
        title,
        content: message,
      })

      if (
        response &&
        (response.message || response.success || response.status || response.id)
      ) {
        setSuccess(true)
        setTitle('')
        setMessage('')
        setTimeout(() => {
          setSuccess(false)
        }, 4000)
      } else {
        setErrorMessage(
          response?.error ||
            response?.message ||
            'Failed to broadcast announcement.',
        )
      }
    } catch (err: any) {
      setErrorMessage(
        err?.message || 'Network error occurred. Please try again.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  const inputClass =
    'w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 text-dark dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple text-sm'

  return (
    <div className='space-y-6 max-w-4xl mx-auto animate-fadeIn'>
      <div>
        <h2 className='text-2xl font-bold text-dark dark:text-white'>
          Broadcast Announcements
        </h2>
        <p className='text-sm text-gray-500'>
          Send instant notifications, schedule updates, or emergency notices to
          enrolled students.
        </p>
      </div>

      {success && (
        <div className='p-4 bg-green-500/10 border border-green-500/20 text-green-600 rounded-2xl flex items-center gap-3 text-sm font-medium animate-fadeIn'>
          <CheckCircle size={20} className='shrink-0' />
          <span>
            Announcement broadcasted successfully to all targeted student
            dashboards!
          </span>
        </div>
      )}

      {errorMessage && (
        <div className='p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-medium'>
          <AlertTriangle size={20} className='shrink-0' />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className='bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm'>
        <form onSubmit={handleBroadcast} className='space-y-5'>
          <div>
            <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider'>
              Target Audience
            </label>
            <select
              value={targetGroup}
              onChange={(e) => setTargetGroup(e.target.value)}
              className={inputClass}
            >
              <option value='all'>All Enrolled Students (Global)</option>
              <option value='fullstack'>Full-Stack Engineering Cohort</option>
              <option value='mobile'>Mobile App Development Cohort</option>
              <option value='frontend'>Frontend Architecture Cohort</option>
            </select>
          </div>

          <div>
            <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider'>
              Notice Title
            </label>
            <input
              type='text'
              required
              placeholder='e.g., Live Masterclass: Advanced State Management'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider'>
              Announcement Message
            </label>
            <textarea
              required
              rows={5}
              placeholder='Type detailed instructions or broadcast content here...'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={inputClass}
            />
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className='w-full bg-primary-purple hover:bg-primary-purple/90 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50'
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className='animate-spin' />
                <span>Broadcasting...</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span>Broadcast Now</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}