// // src/app/tutors/modules/page.tsx
// 'use client'

// import { useState, useEffect, FormEvent } from 'react'
// import {
//   BookOpen,
//   Video,
//   Megaphone,
//   Plus,
//   Loader2,
//   X,
//   CheckCircle2,
//   AlertCircle,
//   ExternalLink,
// } from 'lucide-react'
// import { apiClient } from '@/services/api'

// export default function TutorsModulesHubPage() {
//   const [courseId, setCourseId] = useState('fullstack-dev')
//   const [activeTab, setActiveTab] = useState<
//     'modules' | 'sessions' | 'announcements'
//   >('modules')

//   const [modules, setModules] = useState<any[]>([])
//   const [sessions, setSessions] = useState<any[]>([])
//   const [isLoading, setIsLoading] = useState(false)

//   // Modals
//   const [isModuleModalOpen, setIsModuleModalOpen] = useState(false)
//   const [isSessionModalOpen, setIsSessionModalOpen] = useState(false)
//   const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false)

//   // Form Fields
//   const [modTitle, setModTitle] = useState('')
//   const [weekNumber, setWeekNumber] = useState(1)
//   const [contentType, setContentType] = useState('video')
//   const [resourceUrl, setResourceUrl] = useState('')
//   const [modDesc, setModDesc] = useState('')

//   const [sessTitle, setSessTitle] = useState('')
//   const [sessType, setSessType] = useState('lecture')
//   const [meetingLink, setMeetingLink] = useState('')
//   const [scheduledAt, setScheduledAt] = useState('')
//   const [sessDesc, setSessDesc] = useState('')

//   const [annTitle, setAnnTitle] = useState('')
//   const [annContent, setAnnContent] = useState('')

//   const [alertModal, setAlertModal] = useState({
//     isOpen: false,
//     title: '',
//     message: '',
//     isSuccess: true,
//   })
//   const showAlert = (title: string, message: string, isSuccess = true) =>
//     setAlertModal({ isOpen: true, title, message, isSuccess })

//   const fetchData = async () => {
//     setIsLoading(true)
//     try {
//       const modRes = await apiClient.getCourseModules(courseId)
//       setModules(
//         Array.isArray(modRes) ? modRes : modRes?.modules || modRes?.data || [],
//       )

//       const sessRes = await apiClient.getLiveSessions(courseId)
//       setSessions(
//         Array.isArray(sessRes)
//           ? sessRes
//           : sessRes?.sessions || sessRes?.data || [],
//       )
//     } catch (err) {
//       setModules([
//         {
//           id: 1,
//           title: 'Introduction to Node.js Architecture',
//           week_number: 1,
//           content_type: 'video',
//           resource_url: 'https://youtube.com',
//           description: 'Core server principles.',
//         },
//       ])
//       setSessions([
//         {
//           id: 1,
//           title: 'Live Q&A Session',
//           session_type: 'lecture',
//           meeting_link: 'https://zoom.us',
//           scheduled_at: new Date().toISOString(),
//           description: 'Office hours.',
//         },
//       ])
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchData()
//   }, [courseId])

//   const handleUploadModule = async (e: FormEvent) => {
//     e.preventDefault()
//     try {
//       await apiClient.uploadCourseModule({
//         course_id: courseId,
//         title: modTitle,
//         week_number: Number(weekNumber),
//         content_type: contentType,
//         resource_url: resourceUrl,
//         description: modDesc,
//       })
//       setIsModuleModalOpen(false)
//       setModTitle('')
//       setResourceUrl('')
//       setModDesc('')
//       fetchData()
//       showAlert('Success', 'Course module uploaded successfully!', true)
//     } catch (err: any) {
//       showAlert('Error', err?.message || 'Failed to upload module.', false)
//     }
//   }

//   const handleScheduleSession = async (e: FormEvent) => {
//     e.preventDefault()
//     try {
//       await apiClient.scheduleLiveSession({
//         course_id: courseId,
//         title: sessTitle,
//         session_type: sessType,
//         meeting_link: meetingLink,
//         scheduled_at: scheduledAt,
//         description: sessDesc,
//       })
//       setIsSessionModalOpen(false)
//       setSessTitle('')
//       setMeetingLink('')
//       setSessDesc('')
//       fetchData()
//       showAlert('Success', 'Live session scheduled successfully!', true)
//     } catch (err: any) {
//       showAlert('Error', err?.message || 'Failed to schedule session.', false)
//     }
//   }

//   const handlePublishAnnouncement = async (e: FormEvent) => {
//     e.preventDefault()
//     try {
//       await apiClient.publishAnnouncement({
//         course_id: courseId,
//         title: annTitle,
//         content: annContent,
//       })
//       setIsAnnouncementModalOpen(false)
//       setAnnTitle('')
//       setAnnContent('')
//       showAlert('Success', 'Announcement published successfully!', true)
//     } catch (err: any) {
//       showAlert(
//         'Error',
//         err?.message || 'Failed to publish announcement.',
//         false,
//       )
//     }
//   }

//   const inputClass =
//     'w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-dark dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-purple'

//   return (
//     <div className='space-y-6 animate-fadeIn'>
//       <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
//         <div>
//           <h1 className='text-2xl font-bold text-dark dark:text-white'>
//             Modules, Sessions & Announcements
//           </h1>
//           <p className='text-sm text-gray-500'>
//             Manage weekly learning resources, live lecture schedules, and cohort
//             broadcasts.
//           </p>
//         </div>
//         <div className='flex items-center gap-3'>
//           <select
//             value={courseId}
//             onChange={(e) => setCourseId(e.target.value)}
//             className='p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs font-medium text-dark dark:text-white'
//           >
//             <option value='fullstack-dev'>Full-Stack Web Dev</option>
//             <option value='backend-eng'>MERN Backend Engineering</option>
//             <option value='mobile-flutter'>Mobile Dev (Flutter)</option>
//           </select>
//           {activeTab === 'modules' && (
//             <button
//               onClick={() => setIsModuleModalOpen(true)}
//               className='bg-primary-purple hover:bg-primary-purple/90 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition flex items-center gap-2 cursor-pointer shadow-sm'
//             >
//               <Plus size={16} /> Upload Module
//             </button>
//           )}
//           {activeTab === 'sessions' && (
//             <button
//               onClick={() => setIsSessionModalOpen(true)}
//               className='bg-primary-purple hover:bg-primary-purple/90 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition flex items-center gap-2 cursor-pointer shadow-sm'
//             >
//               <Plus size={16} /> Schedule Session
//             </button>
//           )}
//           {activeTab === 'announcements' && (
//             <button
//               onClick={() => setIsAnnouncementModalOpen(true)}
//               className='bg-primary-purple hover:bg-primary-purple/90 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition flex items-center gap-2 cursor-pointer shadow-sm'
//             >
//               <Plus size={16} /> Publish Announcement
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className='flex border-b border-gray-200 dark:border-gray-800 gap-6'>
//         <button
//           onClick={() => setActiveTab('modules')}
//           className={`pb-3 text-sm font-semibold transition border-b-2 cursor-pointer flex items-center gap-2 ${activeTab === 'modules' ? 'border-primary-purple text-primary-purple' : 'border-transparent text-gray-500'}`}
//         >
//           <BookOpen size={16} /> Course Modules
//         </button>
//         <button
//           onClick={() => setActiveTab('sessions')}
//           className={`pb-3 text-sm font-semibold transition border-b-2 cursor-pointer flex items-center gap-2 ${activeTab === 'sessions' ? 'border-primary-purple text-primary-purple' : 'border-transparent text-gray-500'}`}
//         >
//           <Video size={16} /> Live Sessions
//         </button>
//         <button
//           onClick={() => setActiveTab('announcements')}
//           className={`pb-3 text-sm font-semibold transition border-b-2 cursor-pointer flex items-center gap-2 ${activeTab === 'announcements' ? 'border-primary-purple text-primary-purple' : 'border-transparent text-gray-500'}`}
//         >
//           <Megaphone size={16} /> Announcements
//         </button>
//       </div>

//       {isLoading ? (
//         <div className='h-64 flex items-center justify-center'>
//           <Loader2 className='animate-spin text-primary-purple' />
//         </div>
//       ) : activeTab === 'modules' ? (
//         <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
//           {modules.map((m) => (
//             <div
//               key={m.id}
//               className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-3 flex flex-col justify-between'
//             >
//               <div className='space-y-2'>
//                 <span className='px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-500/10 text-blue-500'>
//                   Week {m.week_number} • {m.content_type}
//                 </span>
//                 <h3 className='text-base font-bold text-dark dark:text-white'>
//                   {m.title}
//                 </h3>
//                 <p className='text-xs text-gray-500'>{m.description}</p>
//               </div>
//               <a
//                 href={m.resource_url}
//                 target='_blank'
//                 rel='noreferrer'
//                 className='pt-3 border-t dark:border-gray-800 text-xs font-semibold text-primary-purple flex items-center gap-1 hover:underline'
//               >
//                 Access Resource File <ExternalLink size={12} />
//               </a>
//             </div>
//           ))}
//         </div>
//       ) : activeTab === 'sessions' ? (
//         <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
//           {sessions.map((s) => (
//             <div
//               key={s.id}
//               className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-3 flex flex-col justify-between'
//             >
//               <div className='space-y-2'>
//                 <span className='px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-500'>
//                   {s.session_type}
//                 </span>
//                 <h3 className='text-base font-bold text-dark dark:text-white'>
//                   {s.title}
//                 </h3>
//                 <p className='text-xs text-gray-500'>{s.description}</p>
//                 <p className='text-xs font-medium text-gray-400'>
//                   Scheduled At: {new Date(s.scheduled_at).toLocaleString()}
//                 </p>
//               </div>
//               <a
//                 href={s.meeting_link}
//                 target='_blank'
//                 rel='noreferrer'
//                 className='pt-3 border-t dark:border-gray-800 text-xs font-semibold text-emerald-500 flex items-center gap-1 hover:underline'
//               >
//                 Join Meeting Link <ExternalLink size={12} />
//               </a>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className='bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm text-center space-y-4'>
//           <Megaphone size={40} className='mx-auto text-primary-purple' />
//           <h3 className='text-lg font-bold text-dark dark:text-white'>
//             Publish Real-Time Broadcasts
//           </h3>
//           <p className='text-xs text-gray-500 max-w-md mx-auto'>
//             Send immediate deadline reminders and updates straight to all
//             students enrolled in this course.
//           </p>
//           <button
//             onClick={() => setIsAnnouncementModalOpen(true)}
//             className='px-5 py-2.5 rounded-xl bg-primary-purple text-white text-xs font-semibold shadow-sm hover:opacity-90 cursor-pointer'
//           >
//             Create New Announcement
//           </button>
//         </div>
//       )}

//       {/* Upload Module Modal */}
//       {isModuleModalOpen && (
//         <div className='fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn'>
//           <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl'>
//             <div className='flex justify-between items-center border-b pb-4 dark:border-gray-800'>
//               <h3 className='text-lg font-bold text-dark dark:text-white'>
//                 Upload Course Module
//               </h3>
//               <button
//                 onClick={() => setIsModuleModalOpen(false)}
//                 className='text-gray-400 hover:text-gray-200 cursor-pointer'
//               >
//                 <X size={20} />
//               </button>
//             </div>
//             <form onSubmit={handleUploadModule} className='space-y-4'>
//               <div>
//                 <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
//                   Module Title
//                 </label>
//                 <input
//                   type='text'
//                   required
//                   placeholder='e.g., Advanced React Server Components'
//                   className={inputClass}
//                   value={modTitle}
//                   onChange={(e) => setModTitle(e.target.value)}
//                 />
//               </div>
//               <div className='grid grid-cols-2 gap-4'>
//                 <div>
//                   <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
//                     Week Number
//                   </label>
//                   <input
//                     type='number'
//                     required
//                     min={1}
//                     className={inputClass}
//                     value={weekNumber}
//                     onChange={(e) => setWeekNumber(Number(e.target.value))}
//                   />
//                 </div>
//                 <div>
//                   <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
//                     Content Type
//                   </label>
//                   <select
//                     className={inputClass}
//                     value={contentType}
//                     onChange={(e) => setContentType(e.target.value)}
//                   >
//                     <option value='video'>Video Lecture</option>
//                     <option value='reading'>Reading Notes</option>
//                     <option value='lab'>Lab Code</option>
//                   </select>
//                 </div>
//               </div>
//               <div>
//                 <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
//                   Resource URL
//                 </label>
//                 <input
//                   type='url'
//                   required
//                   placeholder='https://...'
//                   className={inputClass}
//                   value={resourceUrl}
//                   onChange={(e) => setResourceUrl(e.target.value)}
//                 />
//               </div>
//               <div>
//                 <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
//                   Description
//                 </label>
//                 <textarea
//                   required
//                   placeholder='Module syllabus overview...'
//                   className={`${inputClass} h-24`}
//                   value={modDesc}
//                   onChange={(e) => setModDesc(e.target.value)}
//                 />
//               </div>
//               <div className='flex justify-end gap-3 pt-4 border-t dark:border-gray-800'>
//                 <button
//                   type='button'
//                   onClick={() => setIsModuleModalOpen(false)}
//                   className='px-4 py-2 rounded-xl text-xs font-semibold border border-gray-300 dark:border-gray-700 text-gray-600 cursor-pointer'
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type='submit'
//                   className='px-5 py-2 rounded-xl text-xs font-semibold bg-primary-purple text-white hover:opacity-90 cursor-pointer'
//                 >
//                   Upload Module
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Schedule Live Session Modal */}
//       {isSessionModalOpen && (
//         <div className='fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn'>
//           <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl'>
//             <div className='flex justify-between items-center border-b pb-4 dark:border-gray-800'>
//               <h3 className='text-lg font-bold text-dark dark:text-white'>
//                 Schedule Live Lecture Session
//               </h3>
//               <button
//                 onClick={() => setIsSessionModalOpen(false)}
//                 className='text-gray-400 hover:text-gray-200 cursor-pointer'
//               >
//                 <X size={20} />
//               </button>
//             </div>
//             <form onSubmit={handleScheduleSession} className='space-y-4'>
//               <div>
//                 <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
//                   Session Title
//                 </label>
//                 <input
//                   type='text'
//                   required
//                   placeholder='e.g., Weekly Office Hours'
//                   className={inputClass}
//                   value={sessTitle}
//                   onChange={(e) => setSessTitle(e.target.value)}
//                 />
//               </div>
//               <div className='grid grid-cols-2 gap-4'>
//                 <div>
//                   <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
//                     Session Type
//                   </label>
//                   <select
//                     className={inputClass}
//                     value={sessType}
//                     onChange={(e) => setSessType(e.target.value)}
//                   >
//                     <option value='lecture'>Live Lecture</option>
//                     <option value='office_hours'>Office Hours</option>
//                     <option value='workshop'>Coding Workshop</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
//                     Scheduled Date & Time
//                   </label>
//                   <input
//                     type='datetime-local'
//                     required
//                     className={inputClass}
//                     value={scheduledAt}
//                     onChange={(e) => setScheduledAt(e.target.value)}
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
//                   Meeting Link
//                 </label>
//                 <input
//                   type='url'
//                   required
//                   placeholder='https://zoom.us/j/...'
//                   className={inputClass}
//                   value={meetingLink}
//                   onChange={(e) => setMeetingLink(e.target.value)}
//                 />
//               </div>
//               <div>
//                 <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
//                   Description
//                 </label>
//                 <textarea
//                   required
//                   placeholder='What will be covered...'
//                   className={`${inputClass} h-24`}
//                   value={sessDesc}
//                   onChange={(e) => setSessDesc(e.target.value)}
//                 />
//               </div>
//               <div className='flex justify-end gap-3 pt-4 border-t dark:border-gray-800'>
//                 <button
//                   type='button'
//                   onClick={() => setIsSessionModalOpen(false)}
//                   className='px-4 py-2 rounded-xl text-xs font-semibold border border-gray-300 dark:border-gray-700 text-gray-600 cursor-pointer'
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type='submit'
//                   className='px-5 py-2 rounded-xl text-xs font-semibold bg-primary-purple text-white hover:opacity-90 cursor-pointer'
//                 >
//                   Schedule Session
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Publish Announcement Modal */}
//       {isAnnouncementModalOpen && (
//         <div className='fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn'>
//           <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl'>
//             <div className='flex justify-between items-center border-b pb-4 dark:border-gray-800'>
//               <h3 className='text-lg font-bold text-dark dark:text-white'>
//                 Publish Announcement
//               </h3>
//               <button
//                 onClick={() => setIsAnnouncementModalOpen(false)}
//                 className='text-gray-400 hover:text-gray-200 cursor-pointer'
//               >
//                 <X size={20} />
//               </button>
//             </div>
//             <form onSubmit={handlePublishAnnouncement} className='space-y-4'>
//               <div>
//                 <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
//                   Headline Title
//                 </label>
//                 <input
//                   type='text'
//                   required
//                   placeholder='e.g., Assignment 2 Deadline Extended'
//                   className={inputClass}
//                   value={annTitle}
//                   onChange={(e) => setAnnTitle(e.target.value)}
//                 />
//               </div>
//               <div>
//                 <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
//                   Content Message
//                 </label>
//                 <textarea
//                   required
//                   placeholder='Write your announcement details here...'
//                   className={`${inputClass} h-32`}
//                   value={annContent}
//                   onChange={(e) => setAnnContent(e.target.value)}
//                 />
//               </div>
//               <div className='flex justify-end gap-3 pt-4 border-t dark:border-gray-800'>
//                 <button
//                   type='button'
//                   onClick={() => setIsAnnouncementModalOpen(false)}
//                   className='px-4 py-2 rounded-xl text-xs font-semibold border border-gray-300 dark:border-gray-700 text-gray-600 cursor-pointer'
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type='submit'
//                   className='px-5 py-2 rounded-xl text-xs font-semibold bg-primary-purple text-white hover:opacity-90 cursor-pointer'
//                 >
//                   Publish Broadcast
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Alert Modal */}
//       {alertModal.isOpen && (
//         <div className='fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn'>
//           <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl'>
//             <div
//               className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${alertModal.isSuccess ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}
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
//             <p className='text-xs text-gray-500'>{alertModal.message}</p>
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



// src/app/tutors/modules/page.tsx
'use client'

import { useCallback, useEffect, useState, type FormEvent } from 'react'
import {
  BookOpen,
  Video,
  Megaphone,
  Plus,
  Loader2,
  X,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react'
import { apiClient } from '@/services/api'

type Tab = 'modules' | 'sessions' | 'announcements'

interface Course {
  id?: string | number
  _id?: string | number
  course?: string
  name?: string
  title?: string
}

interface CourseModule {
  id?: string | number
  _id?: string | number
  title?: string
  week_number?: number
  weekNumber?: number
  content_type?: string
  contentType?: string
  resource_url?: string
  resourceUrl?: string
  description?: string
}

interface LiveSession {
  id?: string | number
  _id?: string | number
  title?: string
  session_type?: string
  sessionType?: string
  meeting_link?: string
  meetingLink?: string
  scheduled_at?: string
  scheduledAt?: string
  description?: string
}

interface AlertState {
  isOpen: boolean
  title: string
  message: string
  isSuccess: boolean
}

interface ApiError {
  message?: string
  response?: {
    data?: {
      message?: string
      detail?: string
    }
  }
}

const getErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  const err = error as ApiError

  return (
    err?.response?.data?.message ||
    err?.response?.data?.detail ||
    err?.message ||
    fallback
  )
}

const getArrayFromResponse = <T,>(
  response: unknown,
  keys: string[],
): T[] => {
  if (Array.isArray(response)) {
    return response as T[]
  }

  if (response && typeof response === 'object') {
    const data = response as Record<string, unknown>

    for (const key of keys) {
      if (Array.isArray(data[key])) {
        return data[key] as T[]
      }
    }

    if (
      data.data &&
      typeof data.data === 'object' &&
      !Array.isArray(data.data)
    ) {
      const nestedData = data.data as Record<string, unknown>

      for (const key of keys) {
        if (Array.isArray(nestedData[key])) {
          return nestedData[key] as T[]
        }
      }
    }
  }

  return []
}

const getCourseId = (course: Course): string => {
  const id = course.id ?? course._id ?? course.course
  return id !== undefined && id !== null ? String(id) : ''
}

const getCourseName = (course: Course): string => {
  return (
    course.name ||
    course.title ||
    course.course ||
    'Unnamed Course'
  )
}

export default function TutorsModulesHubPage() {
  const [assignedCourses, setAssignedCourses] = useState<Course[]>([])
  const [courseId, setCourseId] = useState('')

  const [activeTab, setActiveTab] = useState<Tab>('modules')

  const [modules, setModules] = useState<CourseModule[]>([])
  const [sessions, setSessions] = useState<LiveSession[]>([])

  const [isLoadingCourses, setIsLoadingCourses] = useState(true)
  const [isLoadingData, setIsLoadingData] = useState(false)

  const [isSubmittingModule, setIsSubmittingModule] = useState(false)
  const [isSubmittingSession, setIsSubmittingSession] = useState(false)
  const [isSubmittingAnnouncement, setIsSubmittingAnnouncement] =
    useState(false)

  const [pageError, setPageError] = useState('')
  const [dataError, setDataError] = useState('')

  // Modals
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false)
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false)
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] =
    useState(false)

  // Module form
  const [modTitle, setModTitle] = useState('')
  const [weekNumber, setWeekNumber] = useState(1)
  const [contentType, setContentType] = useState('video')
  const [resourceUrl, setResourceUrl] = useState('')
  const [modDesc, setModDesc] = useState('')

  // Session form
  const [sessTitle, setSessTitle] = useState('')
  const [sessType, setSessType] = useState('lecture')
  const [meetingLink, setMeetingLink] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [sessDesc, setSessDesc] = useState('')

  // Announcement form
  const [annTitle, setAnnTitle] = useState('')
  const [annContent, setAnnContent] = useState('')

  const [alertModal, setAlertModal] = useState<AlertState>({
    isOpen: false,
    title: '',
    message: '',
    isSuccess: true,
  })

  const showAlert = (
    title: string,
    message: string,
    isSuccess = true,
  ) => {
    setAlertModal({
      isOpen: true,
      title,
      message,
      isSuccess,
    })
  }

  const closeAlert = () => {
    setAlertModal((previous) => ({
      ...previous,
      isOpen: false,
    }))
  }

  /*
   * ------------------------------------------------------------
   * FETCH ASSIGNED COURSES
   * ------------------------------------------------------------
   */
  const fetchAssignedCourses = useCallback(async () => {
    setIsLoadingCourses(true)
    setPageError('')

    try {
      const response = await apiClient.getTutorAssignedCourses()

      const courses = getArrayFromResponse<Course>(
        response,
        ['courses'],
      )

      setAssignedCourses(courses)

      if (courses.length === 0) {
        setCourseId('')
        setModules([])
        setSessions([])
        setPageError(
          'No courses have been assigned to your tutor account.',
        )
        return
      }

      const validCourseIds = courses
        .map(getCourseId)
        .filter(Boolean)

      setCourseId((previousCourseId) => {
        if (previousCourseId && validCourseIds.includes(previousCourseId)) {
          return previousCourseId
        }

        return validCourseIds[0] || ''
      })
    } catch (error) {
      setAssignedCourses([])
      setCourseId('')
      setModules([])
      setSessions([])

      setPageError(
        getErrorMessage(
          error,
          'Failed to load your assigned courses.',
        ),
      )
    } finally {
      setIsLoadingCourses(false)
    }
  }, [])

  /*
   * ------------------------------------------------------------
   * FETCH COURSE DATA
   * ------------------------------------------------------------
   */
  const fetchData = useCallback(async () => {
    if (!courseId) {
      setModules([])
      setSessions([])
      return
    }

    setIsLoadingData(true)
    setDataError('')

    try {
      const [moduleResponse, sessionResponse] =
        await Promise.all([
          apiClient.getCourseModules(courseId),
          apiClient.getLiveSessions(courseId),
        ])

      const moduleList = getArrayFromResponse<CourseModule>(
        moduleResponse,
        ['modules'],
      )

      const sessionList = getArrayFromResponse<LiveSession>(
        sessionResponse,
        ['sessions'],
      )

      setModules(moduleList)
      setSessions(sessionList)
    } catch (error) {
      setModules([])
      setSessions([])

      setDataError(
        getErrorMessage(
          error,
          'Failed to load course modules and live sessions.',
        ),
      )
    } finally {
      setIsLoadingData(false)
    }
  }, [courseId])

  /*
   * ------------------------------------------------------------
   * INITIAL COURSE LOAD
   * ------------------------------------------------------------
   */
  useEffect(() => {
    void fetchAssignedCourses()
  }, [fetchAssignedCourses])

  /*
   * ------------------------------------------------------------
   * COURSE DATA LOAD
   * ------------------------------------------------------------
   */
  useEffect(() => {
    void fetchData()
  }, [fetchData])

  /*
   * ------------------------------------------------------------
   * MODULE FORM
   * ------------------------------------------------------------
   */
  const resetModuleForm = () => {
    setModTitle('')
    setWeekNumber(1)
    setContentType('video')
    setResourceUrl('')
    setModDesc('')
  }

  const closeModuleModal = () => {
    if (isSubmittingModule) return

    setIsModuleModalOpen(false)
    resetModuleForm()
  }

  const handleUploadModule = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!courseId) {
      showAlert(
        'No Course Selected',
        'Please select an assigned course before uploading a module.',
        false,
      )
      return
    }

    if (weekNumber < 1) {
      showAlert(
        'Invalid Week',
        'Week number must be at least 1.',
        false,
      )
      return
    }

    setIsSubmittingModule(true)

    try {
      await apiClient.uploadCourseModule({
        course_id: courseId,
        title: modTitle.trim(),
        week_number: Number(weekNumber),
        content_type: contentType,
        resource_url: resourceUrl.trim(),
        description: modDesc.trim(),
      })

      setIsModuleModalOpen(false)
      resetModuleForm()

      await fetchData()

      showAlert(
        'Success',
        'Course module uploaded successfully.',
        true,
      )
    } catch (error) {
      showAlert(
        'Upload Failed',
        getErrorMessage(
          error,
          'Failed to upload the course module.',
        ),
        false,
      )
    } finally {
      setIsSubmittingModule(false)
    }
  }

  /*
   * ------------------------------------------------------------
   * SESSION FORM
   * ------------------------------------------------------------
   */
  const resetSessionForm = () => {
    setSessTitle('')
    setSessType('lecture')
    setMeetingLink('')
    setScheduledAt('')
    setSessDesc('')
  }

  const closeSessionModal = () => {
    if (isSubmittingSession) return

    setIsSessionModalOpen(false)
    resetSessionForm()
  }

  const handleScheduleSession = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    if (!courseId) {
      showAlert(
        'No Course Selected',
        'Please select an assigned course before scheduling a session.',
        false,
      )
      return
    }

    setIsSubmittingSession(true)

    try {
      await apiClient.scheduleLiveSession({
        course_id: courseId,
        title: sessTitle.trim(),
        session_type: sessType,
        meeting_link: meetingLink.trim(),
        scheduled_at: scheduledAt,
        description: sessDesc.trim(),
      })

      setIsSessionModalOpen(false)
      resetSessionForm()

      await fetchData()

      showAlert(
        'Success',
        'Live session scheduled successfully.',
        true,
      )
    } catch (error) {
      showAlert(
        'Scheduling Failed',
        getErrorMessage(
          error,
          'Failed to schedule the live session.',
        ),
        false,
      )
    } finally {
      setIsSubmittingSession(false)
    }
  }

  /*
   * ------------------------------------------------------------
   * ANNOUNCEMENT FORM
   * ------------------------------------------------------------
   */
  const resetAnnouncementForm = () => {
    setAnnTitle('')
    setAnnContent('')
  }

  const closeAnnouncementModal = () => {
    if (isSubmittingAnnouncement) return

    setIsAnnouncementModalOpen(false)
    resetAnnouncementForm()
  }

  const handlePublishAnnouncement = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    if (!courseId) {
      showAlert(
        'No Course Selected',
        'Please select an assigned course before publishing an announcement.',
        false,
      )
      return
    }

    setIsSubmittingAnnouncement(true)

    try {
      await apiClient.publishAnnouncement({
        course_id: courseId,
        title: annTitle.trim(),
        content: annContent.trim(),
      })

      setIsAnnouncementModalOpen(false)
      resetAnnouncementForm()

      showAlert(
        'Success',
        'Announcement published successfully.',
        true,
      )
    } catch (error) {
      showAlert(
        'Publishing Failed',
        getErrorMessage(
          error,
          'Failed to publish the announcement.',
        ),
        false,
      )
    } finally {
      setIsSubmittingAnnouncement(false)
    }
  }

  /*
   * ------------------------------------------------------------
   * MODAL ESCAPE HANDLING
   * ------------------------------------------------------------
   */
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return

      if (isModuleModalOpen && !isSubmittingModule) {
        closeModuleModal()
      }

      if (isSessionModalOpen && !isSubmittingSession) {
        closeSessionModal()
      }

      if (
        isAnnouncementModalOpen &&
        !isSubmittingAnnouncement
      ) {
        closeAnnouncementModal()
      }

      if (alertModal.isOpen) {
        closeAlert()
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [
    isModuleModalOpen,
    isSessionModalOpen,
    isAnnouncementModalOpen,
    isSubmittingModule,
    isSubmittingSession,
    isSubmittingAnnouncement,
    alertModal.isOpen,
  ])

  /*
   * ------------------------------------------------------------
   * HELPERS
   * ------------------------------------------------------------
   */
  const selectedCourse = assignedCourses.find(
    (course) => getCourseId(course) === courseId,
  )

  const selectedCourseName = selectedCourse
    ? getCourseName(selectedCourse)
    : 'No course selected'

  const getModuleId = (
    module: CourseModule,
    index: number,
  ) => {
    return String(
      module.id ??
        module._id ??
        `module-${index}`,
    )
  }

  const getSessionId = (
    session: LiveSession,
    index: number,
  ) => {
    return String(
      session.id ??
        session._id ??
        `session-${index}`,
    )
  }

  const getModuleWeek = (module: CourseModule) => {
    return module.week_number ?? module.weekNumber ?? 0
  }

  const getModuleContentType = (module: CourseModule) => {
    return (
      module.content_type ||
      module.contentType ||
      'resource'
    )
  }

  const getModuleResourceUrl = (module: CourseModule) => {
    return (
      module.resource_url ||
      module.resourceUrl ||
      ''
    )
  }

  const getSessionType = (session: LiveSession) => {
    return (
      session.session_type ||
      session.sessionType ||
      'session'
    )
  }

  const getMeetingLink = (session: LiveSession) => {
    return (
      session.meeting_link ||
      session.meetingLink ||
      ''
    )
  }

  const getScheduledAt = (session: LiveSession) => {
    return (
      session.scheduled_at ||
      session.scheduledAt ||
      ''
    )
  }

  const inputClass =
    'w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-dark dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-purple disabled:opacity-50 disabled:cursor-not-allowed'

  const primaryButtonClass =
    'bg-primary-purple hover:bg-primary-purple/90 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed'

  return (
    <div className='space-y-6 animate-fadeIn'>
      {/* ---------------------------------------------------------
          HEADER
      --------------------------------------------------------- */}
      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-dark dark:text-white'>
            Modules, Sessions & Announcements
          </h1>

          <p className='text-sm text-gray-500'>
            Manage weekly learning resources, live lecture
            schedules, and cohort broadcasts.
          </p>
        </div>

        <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3'>
          {/* Course selector */}
          {isLoadingCourses ? (
            <div className='flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-xs text-gray-500'>
              <Loader2
                size={15}
                className='animate-spin'
              />
              Loading courses...
            </div>
          ) : (
            <select
              value={courseId}
              onChange={(event) =>
                setCourseId(event.target.value)
              }
              disabled={assignedCourses.length === 0}
              className='p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs font-medium text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-purple disabled:opacity-50 disabled:cursor-not-allowed'
              aria-label='Select assigned course'
            >
              {assignedCourses.length === 0 ? (
                <option value=''>
                  No assigned courses
                </option>
              ) : (
                assignedCourses.map((course, index) => {
                  const id = getCourseId(course)

                  return (
                    <option
                      key={id || `course-${index}`}
                      value={id}
                    >
                      {getCourseName(course)}
                    </option>
                  )
                })
              )}
            </select>
          )}

          {/* Action buttons */}
          {activeTab === 'modules' && (
            <button
              type='button'
              onClick={() => setIsModuleModalOpen(true)}
              disabled={!courseId || isLoadingCourses}
              className={primaryButtonClass}
            >
              <Plus size={16} />
              Upload Module
            </button>
          )}

          {activeTab === 'sessions' && (
            <button
              type='button'
              onClick={() => setIsSessionModalOpen(true)}
              disabled={!courseId || isLoadingCourses}
              className={primaryButtonClass}
            >
              <Plus size={16} />
              Schedule Session
            </button>
          )}

          {activeTab === 'announcements' && (
            <button
              type='button'
              onClick={() =>
                setIsAnnouncementModalOpen(true)
              }
              disabled={!courseId || isLoadingCourses}
              className={primaryButtonClass}
            >
              <Plus size={16} />
              Publish Announcement
            </button>
          )}
        </div>
      </div>

      {/* Current course */}
      {courseId && (
        <div className='flex items-center gap-2 text-xs text-gray-500'>
          <span>Managing:</span>
          <span className='font-semibold text-dark dark:text-white'>
            {selectedCourseName}
          </span>
        </div>
      )}

      {/* ---------------------------------------------------------
          PAGE ERROR
      --------------------------------------------------------- */}
      {pageError && (
        <div className='p-4 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs rounded-xl font-medium flex items-start gap-3'>
          <AlertCircle
            size={17}
            className='shrink-0 mt-0.5'
          />

          <div>
            <p className='font-bold'>
              Unable to load assigned courses
            </p>

            <p className='mt-1 font-normal'>
              {pageError}
            </p>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------
          DATA ERROR
      --------------------------------------------------------- */}
      {dataError && (
        <div className='p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded-xl font-medium flex items-start gap-3'>
          <AlertCircle
            size={17}
            className='shrink-0 mt-0.5'
          />

          <div className='flex-1'>
            <p className='font-bold'>
              Unable to load course data
            </p>

            <p className='mt-1 font-normal'>
              {dataError}
            </p>
          </div>

          <button
            type='button'
            onClick={() => void fetchData()}
            className='shrink-0 px-3 py-1.5 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition cursor-pointer'
          >
            Retry
          </button>
        </div>
      )}

      {/* ---------------------------------------------------------
          TABS
      --------------------------------------------------------- */}
      <div className='overflow-x-auto'>
        <div className='flex min-w-max border-b border-gray-200 dark:border-gray-800 gap-6'>
          <button
            type='button'
            onClick={() => setActiveTab('modules')}
            className={`pb-3 text-sm font-semibold transition border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'modules'
                ? 'border-primary-purple text-primary-purple'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <BookOpen size={16} />
            Course Modules
          </button>

          <button
            type='button'
            onClick={() => setActiveTab('sessions')}
            className={`pb-3 text-sm font-semibold transition border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'sessions'
                ? 'border-primary-purple text-primary-purple'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Video size={16} />
            Live Sessions
          </button>

          <button
            type='button'
            onClick={() =>
              setActiveTab('announcements')
            }
            className={`pb-3 text-sm font-semibold transition border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'announcements'
                ? 'border-primary-purple text-primary-purple'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Megaphone size={16} />
            Announcements
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------------
          CONTENT
      --------------------------------------------------------- */}
      {isLoadingData ? (
        <div className='h-64 flex items-center justify-center'>
          <div className='flex flex-col items-center gap-3 text-gray-500'>
            <Loader2
              size={28}
              className='animate-spin text-primary-purple'
            />

            <span className='text-xs'>
              Loading course data...
            </span>
          </div>
        </div>
      ) : activeTab === 'modules' ? (
        /* -------------------------------------------------------
           MODULES
        ------------------------------------------------------- */
        modules.length === 0 ? (
          <div className='bg-white dark:bg-gray-900 p-12 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm text-center'>
            <BookOpen
              size={42}
              className='mx-auto text-gray-300 dark:text-gray-700'
            />

            <h3 className='mt-4 text-base font-bold text-dark dark:text-white'>
              No course modules yet
            </h3>

            <p className='mt-2 text-xs text-gray-500 max-w-md mx-auto'>
              Upload the first learning module for this
              course to make it available to your students.
            </p>

            <button
              type='button'
              onClick={() =>
                setIsModuleModalOpen(true)
              }
              disabled={!courseId}
              className={`${primaryButtonClass} mx-auto mt-5`}
            >
              <Plus size={16} />
              Upload First Module
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {modules.map((module, index) => {
              const resourceUrl =
                getModuleResourceUrl(module)

              return (
                <div
                  key={getModuleId(module, index)}
                  className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4 flex flex-col justify-between'
                >
                  <div className='space-y-3'>
                    <span className='inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-500/10 text-blue-500'>
                      Week {getModuleWeek(module)} •{' '}
                      {getModuleContentType(module)}
                    </span>

                    <h3 className='text-base font-bold text-dark dark:text-white'>
                      {module.title ||
                        'Untitled Module'}
                    </h3>

                    <p className='text-xs text-gray-500 leading-5'>
                      {module.description ||
                        'No description provided.'}
                    </p>
                  </div>

                  {resourceUrl ? (
                    <a
                      href={resourceUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='pt-3 border-t dark:border-gray-800 text-xs font-semibold text-primary-purple flex items-center gap-1 hover:underline'
                    >
                      Access Resource
                      <ExternalLink size={12} />
                    </a>
                  ) : (
                    <div className='pt-3 border-t dark:border-gray-800 text-xs text-gray-400'>
                      No resource link provided.
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )
      ) : activeTab === 'sessions' ? (
        /* -------------------------------------------------------
           SESSIONS
        ------------------------------------------------------- */
        sessions.length === 0 ? (
          <div className='bg-white dark:bg-gray-900 p-12 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm text-center'>
            <Video
              size={42}
              className='mx-auto text-gray-300 dark:text-gray-700'
            />

            <h3 className='mt-4 text-base font-bold text-dark dark:text-white'>
              No live sessions scheduled
            </h3>

            <p className='mt-2 text-xs text-gray-500 max-w-md mx-auto'>
              Schedule a live lecture, workshop, or office
              hours session for this course.
            </p>

            <button
              type='button'
              onClick={() =>
                setIsSessionModalOpen(true)
              }
              disabled={!courseId}
              className={`${primaryButtonClass} mx-auto mt-5`}
            >
              <Plus size={16} />
              Schedule Session
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {sessions.map((session, index) => {
              const meetingLink =
                getMeetingLink(session)
              const scheduledValue =
                getScheduledAt(session)

              let formattedDate =
                'Date not available'

              if (scheduledValue) {
                const parsedDate =
                  new Date(scheduledValue)

                if (!Number.isNaN(parsedDate.getTime())) {
                  formattedDate =
                    parsedDate.toLocaleString()
                }
              }

              return (
                <div
                  key={getSessionId(session, index)}
                  className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4 flex flex-col justify-between'
                >
                  <div className='space-y-3'>
                    <span className='inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-500'>
                      {getSessionType(session)}
                    </span>

                    <h3 className='text-base font-bold text-dark dark:text-white'>
                      {session.title ||
                        'Untitled Session'}
                    </h3>

                    <p className='text-xs text-gray-500 leading-5'>
                      {session.description ||
                        'No description provided.'}
                    </p>

                    <p className='text-xs font-medium text-gray-400'>
                      Scheduled At: {formattedDate}
                    </p>
                  </div>

                  {meetingLink ? (
                    <a
                      href={meetingLink}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='pt-3 border-t dark:border-gray-800 text-xs font-semibold text-emerald-500 flex items-center gap-1 hover:underline'
                    >
                      Join Meeting
                      <ExternalLink size={12} />
                    </a>
                  ) : (
                    <div className='pt-3 border-t dark:border-gray-800 text-xs text-gray-400'>
                      No meeting link provided.
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )
      ) : (
        /* -------------------------------------------------------
           ANNOUNCEMENTS
        ------------------------------------------------------- */
        <div className='bg-white dark:bg-gray-900 p-8 md:p-12 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm text-center'>
          <div className='w-16 h-16 mx-auto rounded-2xl bg-primary-purple/10 flex items-center justify-center'>
            <Megaphone
              size={32}
              className='text-primary-purple'
            />
          </div>

          <h3 className='mt-5 text-lg font-bold text-dark dark:text-white'>
            Publish Real-Time Broadcasts
          </h3>

          <p className='mt-2 text-xs text-gray-500 max-w-md mx-auto leading-5'>
            Send deadline reminders, course updates, important
            notices, and other messages directly to students
            enrolled in this course.
          </p>

          <button
            type='button'
            onClick={() =>
              setIsAnnouncementModalOpen(true)
            }
            disabled={!courseId}
            className={`${primaryButtonClass} mx-auto mt-6`}
          >
            <Plus size={16} />
            Create New Announcement
          </button>
        </div>
      )}

      {/* =========================================================
          UPLOAD MODULE MODAL
      ========================================================= */}
      {isModuleModalOpen && (
        <div
          className='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn'
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !isSubmittingModule
            ) {
              closeModuleModal()
            }
          }}
        >
          <div
            className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl'
            role='dialog'
            aria-modal='true'
            aria-labelledby='upload-module-title'
          >
            <div className='flex justify-between items-center border-b pb-4 dark:border-gray-800'>
              <div>
                <h3
                  id='upload-module-title'
                  className='text-lg font-bold text-dark dark:text-white'
                >
                  Upload Course Module
                </h3>

                <p className='text-xs text-gray-500 mt-1'>
                  {selectedCourseName}
                </p>
              </div>

              <button
                type='button'
                onClick={closeModuleModal}
                disabled={isSubmittingModule}
                className='text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer disabled:opacity-50'
                aria-label='Close module modal'
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleUploadModule}
              className='space-y-4'
            >
              <div>
                <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                  Module Title
                </label>

                <input
                  type='text'
                  required
                  minLength={2}
                  maxLength={150}
                  placeholder='e.g., Advanced React Server Components'
                  className={inputClass}
                  value={modTitle}
                  onChange={(event) =>
                    setModTitle(event.target.value)
                  }
                  disabled={isSubmittingModule}
                />
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                    Week Number
                  </label>

                  <input
                    type='number'
                    required
                    min={1}
                    max={100}
                    className={inputClass}
                    value={weekNumber}
                    onChange={(event) =>
                      setWeekNumber(
                        Number(event.target.value),
                      )
                    }
                    disabled={isSubmittingModule}
                  />
                </div>

                <div>
                  <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                    Content Type
                  </label>

                  <select
                    className={inputClass}
                    value={contentType}
                    onChange={(event) =>
                      setContentType(event.target.value)
                    }
                    disabled={isSubmittingModule}
                  >
                    <option value='video'>
                      Video Lecture
                    </option>
                    <option value='reading'>
                      Reading Notes
                    </option>
                    <option value='lab'>
                      Lab Code
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                  Resource URL
                </label>

                <input
                  type='url'
                  required
                  placeholder='https://...'
                  className={inputClass}
                  value={resourceUrl}
                  onChange={(event) =>
                    setResourceUrl(event.target.value)
                  }
                  disabled={isSubmittingModule}
                />
              </div>

              <div>
                <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                  Description
                </label>

                <textarea
                  required
                  minLength={2}
                  maxLength={2000}
                  placeholder='Module syllabus overview...'
                  className={`${inputClass} h-28 resize-none`}
                  value={modDesc}
                  onChange={(event) =>
                    setModDesc(event.target.value)
                  }
                  disabled={isSubmittingModule}
                />
              </div>

              <div className='flex justify-end gap-3 pt-4 border-t dark:border-gray-800'>
                <button
                  type='button'
                  onClick={closeModuleModal}
                  disabled={isSubmittingModule}
                  className='px-4 py-2 rounded-xl text-xs font-semibold border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Cancel
                </button>

                <button
                  type='submit'
                  disabled={
                    isSubmittingModule ||
                    !courseId
                  }
                  className='px-5 py-2.5 rounded-xl text-xs font-semibold bg-primary-purple text-white hover:opacity-90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
                >
                  {isSubmittingModule ? (
                    <>
                      <Loader2
                        size={14}
                        className='animate-spin'
                      />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <BookOpen size={14} />
                      Upload Module
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          SCHEDULE SESSION MODAL
      ========================================================= */}
      {isSessionModalOpen && (
        <div
          className='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn'
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !isSubmittingSession
            ) {
              closeSessionModal()
            }
          }}
        >
          <div
            className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl'
            role='dialog'
            aria-modal='true'
            aria-labelledby='schedule-session-title'
          >
            <div className='flex justify-between items-center border-b pb-4 dark:border-gray-800'>
              <div>
                <h3
                  id='schedule-session-title'
                  className='text-lg font-bold text-dark dark:text-white'
                >
                  Schedule Live Lecture Session
                </h3>

                <p className='text-xs text-gray-500 mt-1'>
                  {selectedCourseName}
                </p>
              </div>

              <button
                type='button'
                onClick={closeSessionModal}
                disabled={isSubmittingSession}
                className='text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer disabled:opacity-50'
                aria-label='Close session modal'
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleScheduleSession}
              className='space-y-4'
            >
              <div>
                <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                  Session Title
                </label>

                <input
                  type='text'
                  required
                  minLength={2}
                  maxLength={150}
                  placeholder='e.g., Weekly Office Hours'
                  className={inputClass}
                  value={sessTitle}
                  onChange={(event) =>
                    setSessTitle(event.target.value)
                  }
                  disabled={isSubmittingSession}
                />
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                    Session Type
                  </label>

                  <select
                    className={inputClass}
                    value={sessType}
                    onChange={(event) =>
                      setSessType(event.target.value)
                    }
                    disabled={isSubmittingSession}
                  >
                    <option value='lecture'>
                      Live Lecture
                    </option>
                    <option value='office_hours'>
                      Office Hours
                    </option>
                    <option value='workshop'>
                      Coding Workshop
                    </option>
                  </select>
                </div>

                <div>
                  <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                    Scheduled Date & Time
                  </label>

                  <input
                    type='datetime-local'
                    required
                    className={inputClass}
                    value={scheduledAt}
                    onChange={(event) =>
                      setScheduledAt(event.target.value)
                    }
                    disabled={isSubmittingSession}
                  />
                </div>
              </div>

              <div>
                <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                  Meeting Link
                </label>

                <input
                  type='url'
                  required
                  placeholder='https://zoom.us/j/...'
                  className={inputClass}
                  value={meetingLink}
                  onChange={(event) =>
                    setMeetingLink(event.target.value)
                  }
                  disabled={isSubmittingSession}
                />
              </div>

              <div>
                <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                  Description
                </label>

                <textarea
                  required
                  minLength={2}
                  maxLength={2000}
                  placeholder='What will be covered...'
                  className={`${inputClass} h-28 resize-none`}
                  value={sessDesc}
                  onChange={(event) =>
                    setSessDesc(event.target.value)
                  }
                  disabled={isSubmittingSession}
                />
              </div>

              <div className='flex justify-end gap-3 pt-4 border-t dark:border-gray-800'>
                <button
                  type='button'
                  onClick={closeSessionModal}
                  disabled={isSubmittingSession}
                  className='px-4 py-2 rounded-xl text-xs font-semibold border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Cancel
                </button>

                <button
                  type='submit'
                  disabled={
                    isSubmittingSession ||
                    !courseId
                  }
                  className='px-5 py-2.5 rounded-xl text-xs font-semibold bg-primary-purple text-white hover:opacity-90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
                >
                  {isSubmittingSession ? (
                    <>
                      <Loader2
                        size={14}
                        className='animate-spin'
                      />
                      Scheduling...
                    </>
                  ) : (
                    <>
                      <Video size={14} />
                      Schedule Session
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          ANNOUNCEMENT MODAL
      ========================================================= */}
      {isAnnouncementModalOpen && (
        <div
          className='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn'
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !isSubmittingAnnouncement
            ) {
              closeAnnouncementModal()
            }
          }}
        >
          <div
            className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl'
            role='dialog'
            aria-modal='true'
            aria-labelledby='publish-announcement-title'
          >
            <div className='flex justify-between items-center border-b pb-4 dark:border-gray-800'>
              <div>
                <h3
                  id='publish-announcement-title'
                  className='text-lg font-bold text-dark dark:text-white'
                >
                  Publish Announcement
                </h3>

                <p className='text-xs text-gray-500 mt-1'>
                  {selectedCourseName}
                </p>
              </div>

              <button
                type='button'
                onClick={closeAnnouncementModal}
                disabled={isSubmittingAnnouncement}
                className='text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer disabled:opacity-50'
                aria-label='Close announcement modal'
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handlePublishAnnouncement}
              className='space-y-4'
            >
              <div>
                <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                  Headline Title
                </label>

                <input
                  type='text'
                  required
                  minLength={2}
                  maxLength={150}
                  placeholder='e.g., Assignment 2 Deadline Extended'
                  className={inputClass}
                  value={annTitle}
                  onChange={(event) =>
                    setAnnTitle(event.target.value)
                  }
                  disabled={isSubmittingAnnouncement}
                />
              </div>

              <div>
                <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                  Content Message
                </label>

                <textarea
                  required
                  minLength={2}
                  maxLength={5000}
                  placeholder='Write your announcement details here...'
                  className={`${inputClass} h-36 resize-none`}
                  value={annContent}
                  onChange={(event) =>
                    setAnnContent(event.target.value)
                  }
                  disabled={isSubmittingAnnouncement}
                />
              </div>

              <div className='flex justify-end gap-3 pt-4 border-t dark:border-gray-800'>
                <button
                  type='button'
                  onClick={closeAnnouncementModal}
                  disabled={isSubmittingAnnouncement}
                  className='px-4 py-2 rounded-xl text-xs font-semibold border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Cancel
                </button>

                <button
                  type='submit'
                  disabled={
                    isSubmittingAnnouncement ||
                    !courseId
                  }
                  className='px-5 py-2.5 rounded-xl text-xs font-semibold bg-primary-purple text-white hover:opacity-90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
                >
                  {isSubmittingAnnouncement ? (
                    <>
                      <Loader2
                        size={14}
                        className='animate-spin'
                      />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Megaphone size={14} />
                      Publish Broadcast
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          ALERT MODAL
      ========================================================= */}
      {alertModal.isOpen && (
        <div
          className='fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn'
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeAlert()
            }
          }}
        >
          <div
            className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl'
            role='alertdialog'
            aria-modal='true'
            aria-labelledby='alert-title'
            aria-describedby='alert-message'
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
                alertModal.isSuccess
                  ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                  : 'bg-red-500/10 text-red-600 dark:text-red-400'
              }`}
            >
              {alertModal.isSuccess ? (
                <CheckCircle2 size={24} />
              ) : (
                <AlertCircle size={24} />
              )}
            </div>

            <h3
              id='alert-title'
              className='text-lg font-bold text-dark dark:text-white'
            >
              {alertModal.title}
            </h3>

            <p
              id='alert-message'
              className='text-xs text-gray-500 leading-5'
            >
              {alertModal.message}
            </p>

            <button
              type='button'
              onClick={closeAlert}
              className='w-full py-2.5 rounded-xl text-xs font-semibold bg-primary-purple text-white cursor-pointer hover:opacity-90 transition'
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  )
}