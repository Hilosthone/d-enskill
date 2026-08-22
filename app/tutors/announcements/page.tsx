// // src/app/tutors/announcements/page.tsx
// 'use client'

// import { useState, FormEvent } from 'react'
// import {
//   Megaphone,
//   Send,
//   CheckCircle2,
//   AlertCircle,
//   Loader2,
//   Calendar,
//   Layers,
//   Sparkles,
// } from 'lucide-react'
// import { apiClient } from '@/services/api'

// interface AnnouncementItem {
//   id: string | number
//   course_id: string
//   title: string
//   content: string
//   priority: 'normal' | 'urgent'
//   created_at: string
// }

// export default function TutorsAnnouncementsPage() {
//   const [courseId, setCourseId] = useState<string>('fullstack-dev')
//   const [title, setTitle] = useState('')
//   const [content, setContent] = useState('')
//   const [priority, setPriority] = useState<'normal' | 'urgent'>('normal')
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   // Recent announcements published in this session (or fetched if your backend supports a list endpoint)
//   const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([
//     {
//       id: 1,
//       course_id: 'fullstack-dev',
//       title: 'Welcome to Week 1: Advanced Routing & Next.js Architecture',
//       content:
//         'Please ensure you review all prerequisite reading materials before our live workshop session on Thursday.',
//       priority: 'normal',
//       created_at: new Date().toISOString(),
//     },
//   ])

//   // Notification Modal State
//   const [alertModal, setAlertModal] = useState({
//     isOpen: false,
//     title: '',
//     message: '',
//     isSuccess: true,
//   })

//   const showAlert = (title: string, message: string, isSuccess = true) => {
//     setAlertModal({ isOpen: true, title, message, isSuccess })
//   }

//   const handlePublish = async (e: FormEvent) => {
//     e.preventDefault()
//     setIsSubmitting(true)

//     try {
//       await apiClient.publishAnnouncement({
//         course_id: courseId,
//         title,
//         content,
//         priority,
//       })

//       // Optimistically append to local recent list
//       const newAnnouncement: AnnouncementItem = {
//         id: Date.now(),
//         course_id: courseId,
//         title,
//         content,
//         priority,
//         created_at: new Date().toISOString(),
//       }

//       setAnnouncements([newAnnouncement, ...announcements])
//       setTitle('')
//       setContent('')
//       setPriority('normal')

//       showAlert(
//         'Announcement Published',
//         'Your broadcast has been successfully sent to all enrolled students in this course.',
//         true,
//       )
//     } catch (err: any) {
//       showAlert(
//         'Publication Failed',
//         err?.message || 'Failed to publish announcement. Please try again.',
//         false,
//       )
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const inputClass =
//     'w-full p-3.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-dark dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-purple transition'

//   return (
//     <div className='space-y-8 animate-fadeIn max-w-5xl mx-auto'>
//       {/* Header */}
//       <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
//         <div>
//           <h1 className='text-2xl font-bold text-dark dark:text-white flex items-center gap-2'>
//             <Megaphone className='text-primary-purple' size={24} /> Course
//             Announcements
//           </h1>
//           <p className='text-sm text-gray-500'>
//             Broadcast urgent updates, schedule changes, and learning milestones
//             directly to students.
//           </p>
//         </div>
//       </div>

//       <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
//         {/* Announcement Composer Form */}
//         <div className='lg:col-span-2 bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm'>
//           <h2 className='text-base font-bold text-dark dark:text-white mb-4 flex items-center gap-2'>
//             <Sparkles size={16} className='text-primary-purple' /> Create New
//             Broadcast
//           </h2>

//           <form onSubmit={handlePublish} className='space-y-5'>
//             <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
//               <div>
//                 <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5'>
//                   Target Course
//                 </label>
//                 <div className='relative'>
//                   <select
//                     value={courseId}
//                     onChange={(e) => setCourseId(e.target.value)}
//                     className={`${inputClass} appearance-none cursor-pointer`}
//                   >
//                     <option value='fullstack-dev'>Full-Stack Web Dev</option>
//                     <option value='backend-eng'>
//                       MERN Backend Engineering
//                     </option>
//                     <option value='mobile-flutter'>Mobile Dev (Flutter)</option>
//                   </select>
//                   <Layers
//                     size={16}
//                     className='absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none'
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5'>
//                   Priority Level
//                 </label>
//                 <select
//                   value={priority}
//                   onChange={(e) =>
//                     setPriority(e.target.value as 'normal' | 'urgent')
//                   }
//                   className={`${inputClass} cursor-pointer`}
//                 >
//                   <option value='normal'>Normal Notification</option>
//                   <option value='urgent'>🚨 Urgent / High Priority</option>
//                 </select>
//               </div>
//             </div>

//             <div>
//               <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5'>
//                 Announcement Title
//               </label>
//               <input
//                 type='text'
//                 required
//                 placeholder='e.g., Schedule Update: Live Q&A Rescheduled'
//                 className={inputClass}
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//               />
//             </div>

//             <div>
//               <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5'>
//                 Message Content
//               </label>
//               <textarea
//                 required
//                 rows={5}
//                 placeholder='Provide clear instructions, links, or notes for your students...'
//                 className={`${inputClass} resize-none`}
//                 value={content}
//                 onChange={(e) => setContent(e.target.value)}
//               />
//             </div>

//             <button
//               type='submit'
//               disabled={isSubmitting}
//               className='w-full py-3.5 rounded-xl bg-primary-purple text-white font-semibold text-sm hover:opacity-90 transition flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50'
//             >
//               {isSubmitting ? (
//                 <>
//                   <Loader2 size={16} className='animate-spin' /> Broadcasting...
//                 </>
//               ) : (
//                 <>
//                   <Send size={16} /> Broadcast Announcement
//                 </>
//               )}
//             </button>
//           </form>
//         </div>

//         {/* Recent Feed Sidebar */}
//         <div className='space-y-4'>
//           <h2 className='text-sm font-bold uppercase tracking-wider text-gray-400 px-1'>
//             Recent Broadcasts
//           </h2>

//           <div className='space-y-3'>
//             {announcements.map((item) => (
//               <div
//                 key={item.id}
//                 className='bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-3 relative overflow-hidden'
//               >
//                 {item.priority === 'urgent' && (
//                   <div className='absolute top-0 right-0 bg-red-500 text-white text-[9px] font-bold px-3 py-0.5 rounded-bl-lg uppercase tracking-wider'>
//                     Urgent
//                   </div>
//                 )}
//                 <div className='flex items-center gap-2 text-xs text-gray-400'>
//                   <Calendar size={12} />
//                   <span>{new Date(item.created_at).toLocaleDateString()}</span>
//                   <span>•</span>
//                   <span className='uppercase text-[10px] font-semibold text-primary-purple'>
//                     {item.course_id}
//                   </span>
//                 </div>
//                 <h3 className='text-sm font-bold text-dark dark:text-white leading-snug'>
//                   {item.title}
//                 </h3>
//                 <p className='text-xs text-gray-500 line-clamp-3 leading-relaxed'>
//                   {item.content}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Alert Modal */}
//       {alertModal.isOpen && (
//         <div className='fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn'>
//           <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl'>
//             <div
//               className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
//                 alertModal.isSuccess
//                   ? 'bg-green-500/10 text-green-600'
//                   : 'bg-red-500/10 text-red-600'
//               }`}
//             >
//               {alertModal.isSuccess ? (
//                 <CheckCircle2 size={24} />
//               ) : (
//                 <AlertCircle size={24} />
//               )}
//             </div>
//             <h3 className='text-lg font-bold text-dark dark:text-white'>
//               {alertModal.title}
//             </h3>
//             <p className='text-xs text-gray-500 leading-relaxed'>
//               {alertModal.message}
//             </p>
//             <button
//               onClick={() =>
//                 setAlertModal((prev) => ({ ...prev, isOpen: false }))
//               }
//               className='w-full py-2.5 rounded-xl text-xs font-semibold bg-primary-purple text-white cursor-pointer hover:opacity-90'
//             >
//               Okay
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }


// src/app/tutors/announcements/page.tsx
'use client'

import { useState, useEffect, FormEvent } from 'react'
import {
  Megaphone,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react'
import { apiClient } from '@/services/api'

interface AnnouncementItem {
  id: string | number
  course_id: string
  title: string
  content: string
  priority: 'normal' | 'urgent'
  created_at: string
}

export default function TutorsAnnouncementsPage() {
  const [assignedCourses, setAssignedCourses] = useState<any[]>([])
  const [courseId, setCourseId] = useState<string>('')
  const [isLoadingCourses, setIsLoadingCourses] = useState(true)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([])

  // Notification Modal State
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    isSuccess: true,
  })

  const showAlert = (title: string, message: string, isSuccess = true) => {
    setAlertModal({ isOpen: true, title, message, isSuccess })
  }

  // Fetch tutor's assigned courses on load
  useEffect(() => {
    const fetchTutorCourses = async () => {
      setIsLoadingCourses(true)
      try {
        const res = await apiClient.getTutorAssignedCourses()
        const courses = res?.data || res?.courses || res || []
        const courseList = Array.isArray(courses) ? courses : []

        setAssignedCourses(courseList)

        if (courseList.length > 0) {
          const firstId = courseList[0].id || courseList[0]._id || courseList[0].course
          setCourseId(String(firstId))
        }
      } catch (err) {
        setAssignedCourses([])
      } finally {
        setIsLoadingCourses(false)
      }
    }

    fetchTutorCourses()
  }, [])

  const handlePublish = async (e: FormEvent) => {
    e.preventDefault()
    if (!courseId) {
      showAlert('Error', 'Please select a target course for your broadcast.', false)
      return
    }

    setIsSubmitting(true)

    try {
      await apiClient.publishAnnouncement({
        course_id: courseId,
        title,
        content,
        priority,
      })

      const newAnnouncement: AnnouncementItem = {
        id: Date.now(),
        course_id: courseId,
        title,
        content,
        priority,
        created_at: new Date().toISOString(),
      }

      setAnnouncements([newAnnouncement, ...announcements])
      setTitle('')
      setContent('')
      setPriority('normal')

      showAlert(
        'Announcement Published',
        'Your broadcast has been successfully sent to all enrolled students in this course.',
        true,
      )
    } catch (err: any) {
      showAlert(
        'Publication Failed',
        err?.message || 'Failed to publish announcement. Please try again.',
        false,
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass =
    'w-full p-3.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-dark dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-purple transition'

  return (
    <div className='space-y-8 animate-fadeIn max-w-5xl mx-auto'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-dark dark:text-white flex items-center gap-2'>
            <Megaphone className='text-primary-purple' size={24} /> Course
            Announcements
          </h1>
          <p className='text-sm text-gray-500'>
            Broadcast urgent updates, schedule changes, and learning milestones
            directly to your assigned students.
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Announcement Composer Form */}
        <div className='lg:col-span-2 bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm'>
          <h2 className='text-base font-bold text-dark dark:text-white mb-4 flex items-center gap-2'>
            <Sparkles size={16} className='text-primary-purple' /> Create New
            Broadcast
          </h2>

          <form onSubmit={handlePublish} className='space-y-5'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5'>
                  Target Course
                </label>
                <div className='relative'>
                  {isLoadingCourses ? (
                    <div className={`${inputClass} flex items-center gap-2 text-gray-400`}>
                      <Loader2 size={16} className='animate-spin' /> Loading courses...
                    </div>
                  ) : (
                    <select
                      value={courseId}
                      onChange={(e) => setCourseId(e.target.value)}
                      className={`${inputClass} appearance-none cursor-pointer`}
                    >
                      {assignedCourses.length === 0 ? (
                        <option value=''>None available</option>
                      ) : (
                        assignedCourses.map((course) => {
                          const cId = course.id || course._id || course.course
                          const cName = course.name || course.title || course.course
                          return (
                            <option key={cId} value={cId}>
                              {cName}
                            </option>
                          )
                        })
                      )}
                    </select>
                  )}
                  <Layers
                    size={16}
                    className='absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none'
                  />
                </div>
              </div>

              <div>
                <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5'>
                  Priority Level
                </label>
                <select
                  value={priority}
                  onChange={(e) =>
                    setPriority(e.target.value as 'normal' | 'urgent')
                  }
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value='normal'>Normal Notification</option>
                  <option value='urgent'>🚨 Urgent / High Priority</option>
                </select>
              </div>
            </div>

            <div>
              <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5'>
                Announcement Title
              </label>
              <input
                type='text'
                required
                placeholder='e.g., Schedule Update: Live Q&A Rescheduled'
                className={inputClass}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5'>
                Message Content
              </label>
              <textarea
                required
                rows={5}
                placeholder='Provide clear instructions, links, or notes for your students...'
                className={`${inputClass} resize-none`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <button
              type='submit'
              disabled={isSubmitting || assignedCourses.length === 0}
              className='w-full py-3.5 rounded-xl bg-primary-purple text-white font-semibold text-sm hover:opacity-90 transition flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50'
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className='animate-spin' /> Broadcasting...
                </>
              ) : (
                <>
                  <Send size={16} /> Broadcast Announcement
                </>
              )}
            </button>
          </form>
        </div>

        {/* Recent Feed Sidebar */}
        <div className='space-y-4'>
          <h2 className='text-sm font-bold uppercase tracking-wider text-gray-400 px-1'>
            Recent Broadcasts
          </h2>

          <div className='space-y-3'>
            {announcements.length === 0 ? (
              <div className='bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 text-center text-xs text-gray-400 shadow-sm'>
                None available
              </div>
            ) : (
              announcements.map((item) => (
                <div
                  key={item.id}
                  className='bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-3 relative overflow-hidden'
                >
                  {item.priority === 'urgent' && (
                    <div className='absolute top-0 right-0 bg-red-500 text-white text-[9px] font-bold px-3 py-0.5 rounded-bl-lg uppercase tracking-wider'>
                      Urgent
                    </div>
                  )}
                  <div className='flex items-center gap-2 text-xs text-gray-400'>
                    <Calendar size={12} />
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className='uppercase text-[10px] font-semibold text-primary-purple'>
                      {item.course_id}
                    </span>
                  </div>
                  <h3 className='text-sm font-bold text-dark dark:text-white leading-snug'>
                    {item.title}
                  </h3>
                  <p className='text-xs text-gray-500 line-clamp-3 leading-relaxed'>
                    {item.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Alert Modal */}
      {alertModal.isOpen && (
        <div className='fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn'>
          <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl'>
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
                alertModal.isSuccess
                  ? 'bg-green-500/10 text-green-600'
                  : 'bg-red-500/10 text-red-600'
              }`}
            >
              {alertModal.isSuccess ? (
                <CheckCircle2 size={24} />
              ) : (
                <AlertCircle size={24} />
              )}
            </div>
            <h3 className='text-lg font-bold text-dark dark:text-white'>
              {alertModal.title}
            </h3>
            <p className='text-xs text-gray-500 leading-relaxed'>
              {alertModal.message}
            </p>
            <button
              onClick={() =>
                setAlertModal((prev) => ({ ...prev, isOpen: false }))
              }
              className='w-full py-2.5 rounded-xl text-xs font-semibold bg-primary-purple text-white cursor-pointer hover:opacity-90'
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  )
}