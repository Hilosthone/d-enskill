// // src/app/admin/courses/page.tsx
// 'use client'
// import { useState, useEffect, FormEvent } from 'react'
// import {
//   BookOpen,
//   Plus,
//   Users,
//   Clock,
//   Edit3,
//   Trash2,
//   X,
//   Loader2,
//   AlertTriangle,
//   UserCheck,
//   RefreshCw,
//   Award,
// } from 'lucide-react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { adminApiClient } from '@/services/admin-api'

// interface Course {
//   id: string | number
//   title: string
//   duration: string
//   price: string
//   students: number
//   status: 'Active' | 'Upcoming'
//   tutorId?: string | number
//   tutorName?: string
// }

// interface Instructor {
//   id: string | number
//   name: string
//   email: string
//   specialty?: string
// }

// export default function AdminCoursesPage() {
//   const [courses, setCourses] = useState<Course[]>([])
//   const [instructors, setInstructors] = useState<Instructor[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [errorMessage, setErrorMessage] = useState('')

//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [editingCourse, setEditingCourse] = useState<Course | null>(null)

//   // Tutor Assignment Modal states (using real instructors dropdown)
//   const [isTutorModalOpen, setIsTutorModalOpen] = useState(false)
//   const [selectedCourseForTutor, setSelectedCourseForTutor] =
//     useState<Course | null>(null)
//   const [selectedTutorId, setSelectedTutorId] = useState('')
//   const [isAssigningTutor, setIsAssigningTutor] = useState(false)

//   // Form states for Course
//   const [title, setTitle] = useState('')
//   const [duration, setDuration] = useState('')
//   const [price, setPrice] = useState('')
//   const [status, setStatus] = useState<'Active' | 'Upcoming'>('Active')

//   const fetchData = async () => {
//     setIsLoading(true)
//     setErrorMessage('')
//     try {
//       const [courseRes, instructorRes] = await Promise.all([
//         adminApiClient.getAdminCourses(),
//         adminApiClient.getAdminInstructors?.().catch(() => []),
//       ])

//       const coursePayload = courseRes?.data || courseRes
//       const courseList = Array.isArray(coursePayload)
//         ? coursePayload
//         : coursePayload?.courses || coursePayload?.data || []

//       const instPayload = instructorRes?.data || instructorRes
//       const instList = Array.isArray(instPayload)
//         ? instPayload
//         : instPayload?.instructors || instPayload?.data || []

//       const formattedInstructors: Instructor[] = instList.map((ins: any) => ({
//         id: ins.id || ins._id,
//         name: ins.name || ins.fullname || 'Unnamed Instructor',
//         email: ins.email || '',
//         specialty: ins.specialty || '',
//       }))
//       setInstructors(formattedInstructors)

//       if (Array.isArray(courseList) && courseList.length > 0) {
//         setCourses(
//           courseList.map((c: any, index: number) => {
//             const assignedInst = formattedInstructors.find(
//               (i) =>
//                 String(i.id) ===
//                 String(c.tutorId || c.instructor_id || c.tutor_id),
//             )
//             return {
//               id: c.id || c._id || `course-${index}`,
//               title: c.course || c.title || c.name || 'Untitled Course',
//               duration: c.duration || '16 Weeks',
//               price: c.price
//                 ? `₦${Number(c.price).toLocaleString()}`
//                 : '₦200,000',
//               students: Number(
//                 c.enrolled_count || c.studentsCount || c.students || 0,
//               ),
//               status: c.status || 'Active',
//               tutorId: assignedInst?.id || c.tutorId || '',
//               tutorName: assignedInst?.name || c.tutorName || 'Unassigned',
//             }
//           }),
//         )
//       }
//     } catch (err: any) {
//       setErrorMessage(
//         err?.message || 'Failed to synchronize programmes and instructors.',
//       )
//       const saved = localStorage.getItem('denskill_admin_courses')
//       if (saved) {
//         try {
//           setCourses(JSON.parse(saved))
//         } catch (e) {
//           // Ignore parse error
//         }
//       }
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchData()
//   }, [])

//   useEffect(() => {
//     if (!isLoading) {
//       localStorage.setItem('denskill_admin_courses', JSON.stringify(courses))
//     }
//   }, [courses, isLoading])

//   const handleOpenAddModal = () => {
//     setEditingCourse(null)
//     setTitle('')
//     setDuration('')
//     setPrice('')
//     setStatus('Active')
//     setErrorMessage('')
//     setIsModalOpen(true)
//   }

//   const handleOpenEditModal = (course: Course) => {
//     setEditingCourse(course)
//     setTitle(course.title)
//     setDuration(course.duration)
//     setPrice(course.price)
//     setStatus(course.status)
//     setErrorMessage('')
//     setIsModalOpen(true)
//   }

//   const handleOpenTutorModal = (course: Course) => {
//     setSelectedCourseForTutor(course)
//     setSelectedTutorId(String(course.tutorId || ''))
//     setErrorMessage('')
//     setIsTutorModalOpen(true)
//   }

//   const handleAssignTutorSubmit = async (e: FormEvent) => {
//     e.preventDefault()
//     if (!selectedCourseForTutor || !selectedTutorId) return

//     setIsAssigningTutor(true)
//     setErrorMessage('')

//     try {
//       const endpoint = `${process.env.NEXT_PUBLIC_API_URL || 'https://denskill-backend.onrender.com'}/api/admin/courses/${selectedCourseForTutor.id}/assign-tutor`
//       const token =
//         typeof window !== 'undefined'
//           ? localStorage.getItem('token') ||
//             localStorage.getItem('denskill_token')
//           : ''

//       const res = await fetch(endpoint, {
//         method: 'PATCH',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           tutorId: Number(selectedTutorId) || selectedTutorId,
//         }),
//       })

//       const data = await res.json()
//       if (!res.ok) {
//         throw new Error(data?.message || 'Failed to assign instructor.')
//       }

//       const matchedInstructor = instructors.find(
//         (i) => String(i.id) === String(selectedTutorId),
//       )

//       setCourses(
//         courses.map((c) =>
//           c.id === selectedCourseForTutor.id
//             ? {
//                 ...c,
//                 tutorId: selectedTutorId,
//                 tutorName: matchedInstructor
//                   ? matchedInstructor.name
//                   : `Instructor #${selectedTutorId}`,
//               }
//             : c,
//         ),
//       )
//       setIsTutorModalOpen(false)
//     } catch (err: any) {
//       setErrorMessage(
//         err?.message || 'Failed to assign instructor to programme.',
//       )
//     } finally {
//       setIsAssigningTutor(false)
//     }
//   }

//   const handleSaveCourse = async (e: FormEvent) => {
//     e.preventDefault()
//     if (!title || !duration || !price) return

//     setIsSubmitting(true)
//     setErrorMessage('')

//     try {
//       if (editingCourse) {
//         setCourses(
//           courses.map((c) =>
//             c.id === editingCourse.id
//               ? { ...c, title, duration, price, status }
//               : c,
//           ),
//         )
//       } else {
//         const newCourse: Course = {
//           id: Date.now(),
//           title,
//           duration,
//           price,
//           students: 0,
//           status,
//           tutorName: 'Unassigned',
//         }
//         setCourses([newCourse, ...courses])
//       }
//       setIsModalOpen(false)
//     } catch (err: any) {
//       setErrorMessage(err?.message || 'Failed to save programme.')
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const handleDeleteCourse = (id: string | number) => {
//     if (confirm('Are you sure you want to remove this training programme?')) {
//       setCourses(courses.filter((c) => c.id !== id))
//     }
//   }

//   const inputClass =
//     'w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple text-xs transition'

//   if (isLoading) {
//     return (
//       <div className='h-96 flex items-center justify-center'>
//         <Loader2 className='w-6 h-6 animate-spin text-primary-purple' />
//       </div>
//     )
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//       className='space-y-6 max-w-7xl mx-auto pb-12'
//     >
//       {/* Header section */}
//       <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
//         <div>
//           <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
//             Programmes & Curriculum
//           </h2>
//           <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
//             Manage active training tracks, tuition pricing, and assign certified
//             department instructors.
//           </p>
//         </div>
//         <div className='flex items-center gap-3'>
//           <motion.button
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             onClick={fetchData}
//             className='bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs border border-gray-200 dark:border-gray-800'
//           >
//             <RefreshCw
//               size={14}
//               className={isLoading ? 'animate-spin text-primary-purple' : ''}
//             />
//             Refresh
//           </motion.button>
//           <motion.button
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             onClick={handleOpenAddModal}
//             className='bg-primary-purple hover:bg-primary-purple/90 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm'
//           >
//             <Plus size={14} /> Add Programme
//           </motion.button>
//         </div>
//       </div>

//       {/* Error banner */}
//       <AnimatePresence>
//         {errorMessage && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: 'auto' }}
//             exit={{ opacity: 0, height: 0 }}
//             className='p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center gap-3 text-xs font-medium'
//           >
//             <AlertTriangle size={18} className='shrink-0' />
//             <span>{errorMessage}</span>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Courses Grid */}
//       <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
//         {courses.map((course) => (
//           <motion.div
//             whileHover={{ y: -2 }}
//             key={course.id}
//             className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4 flex flex-col justify-between transition-colors'
//           >
//             <div className='space-y-3'>
//               <div className='flex justify-between items-start'>
//                 <span
//                   className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
//                     course.status === 'Active'
//                       ? 'bg-green-500/10 text-green-600 dark:text-green-400'
//                       : 'bg-blue-500/10 text-blue-500 dark:text-blue-400'
//                   }`}
//                 >
//                   {course.status}
//                 </span>
//                 <span className='font-mono font-bold text-base text-gray-900 dark:text-white'>
//                   {course.price}
//                 </span>
//               </div>

//               <div>
//                 <h3 className='text-base font-bold text-gray-900 dark:text-white flex items-center gap-2'>
//                   <BookOpen
//                     size={16}
//                     className='text-primary-purple shrink-0'
//                   />
//                   {course.title}
//                 </h3>
//               </div>

//               <div className='flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-800'>
//                 <span className='flex items-center gap-1 font-mono text-[11px]'>
//                   <Clock size={13} /> {course.duration}
//                 </span>
//                 <span className='flex items-center gap-1 font-mono text-[11px]'>
//                   <Users size={13} /> {course.students} Enrolled
//                 </span>
//               </div>

//               <div className='p-3 rounded-xl bg-gray-50 dark:bg-gray-950/50 border border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs'>
//                 <span className='text-gray-500 dark:text-gray-400 flex items-center gap-1.5 font-medium'>
//                   <Award size={13} className='text-primary-purple' /> Lead
//                   Instructor:
//                 </span>
//                 <span className='text-primary-purple font-semibold'>
//                   {course.tutorName || 'Unassigned'}
//                 </span>
//               </div>
//             </div>

//             <div className='flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800'>
//               <button
//                 onClick={() => handleOpenTutorModal(course)}
//                 className='px-3 py-1.5 rounded-xl bg-primary-purple/10 hover:bg-primary-purple/20 text-xs font-semibold text-primary-purple flex items-center gap-1 transition cursor-pointer'
//               >
//                 <UserCheck size={13} /> Assign Instructor
//               </button>
//               <div className='flex items-center gap-2'>
//                 <button
//                   onClick={() => handleOpenEditModal(course)}
//                   className='p-2 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition cursor-pointer'
//                   title='Edit Programme'
//                 >
//                   <Edit3 size={14} />
//                 </button>
//                 <button
//                   onClick={() => handleDeleteCourse(course.id)}
//                   className='p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 transition cursor-pointer'
//                   title='Remove Programme'
//                 >
//                   <Trash2 size={14} />
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       {/* Assign Tutor / Instructor Modal */}
//       {isTutorModalOpen && (
//         <div className='fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4'>
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl'
//           >
//             <div className='flex justify-between items-center border-b pb-4 border-gray-100 dark:border-gray-800'>
//               <h3 className='text-base font-bold text-gray-900 dark:text-white'>
//                 Assign Instructor
//               </h3>
//               <button
//                 onClick={() => setIsTutorModalOpen(false)}
//                 className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer'
//               >
//                 <X size={18} />
//               </button>
//             </div>

//             <form onSubmit={handleAssignTutorSubmit} className='space-y-4'>
//               <div>
//                 <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
//                   Target Programme
//                 </label>
//                 <input
//                   type='text'
//                   disabled
//                   value={selectedCourseForTutor?.title || ''}
//                   className={`${inputClass} opacity-60 cursor-not-allowed`}
//                 />
//               </div>

//               <div>
//                 <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
//                   Select Certified Instructor
//                 </label>
//                 <select
//                   required
//                   value={selectedTutorId}
//                   onChange={(e) => setSelectedTutorId(e.target.value)}
//                   className={inputClass}
//                 >
//                   <option value=''>-- Select Instructor --</option>
//                   {instructors.map((inst) => (
//                     <option key={inst.id} value={inst.id}>
//                       {inst.name} {inst.specialty ? `(${inst.specialty})` : ''}
//                     </option>
//                   ))}
//                 </select>
//                 {instructors.length === 0 && (
//                   <p className='text-[11px] text-amber-500 mt-1'>
//                     No registered instructors found in system database. Create
//                     instructors via the team management console first.
//                   </p>
//                 )}
//               </div>

//               <div className='flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800'>
//                 <button
//                   type='button'
//                   onClick={() => setIsTutorModalOpen(false)}
//                   className='px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer'
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type='submit'
//                   disabled={isAssigningTutor}
//                   className='px-5 py-2 rounded-xl text-xs font-semibold bg-primary-purple text-white hover:opacity-90 shadow-sm cursor-pointer flex items-center gap-2 disabled:opacity-50'
//                 >
//                   {isAssigningTutor && (
//                     <Loader2 size={13} className='animate-spin' />
//                   )}
//                   <span>Save Assignment</span>
//                 </button>
//               </div>
//             </form>
//           </motion.div>
//         </div>
//       )}

//       {/* Add / Edit Programme Modal */}
//       {isModalOpen && (
//         <div className='fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4'>
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl'
//           >
//             <div className='flex justify-between items-center border-b pb-4 border-gray-100 dark:border-gray-800'>
//               <h3 className='text-base font-bold text-gray-900 dark:text-white'>
//                 {editingCourse
//                   ? 'Edit Training Programme'
//                   : 'Add New Training Programme'}
//               </h3>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer'
//               >
//                 <X size={18} />
//               </button>
//             </div>

//             <form onSubmit={handleSaveCourse} className='space-y-4'>
//               <div>
//                 <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
//                   Programme Title
//                 </label>
//                 <input
//                   type='text'
//                   required
//                   placeholder='e.g., Cloud DevOps Engineering'
//                   className={inputClass}
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                 />
//               </div>

//               <div className='grid grid-cols-2 gap-4'>
//                 <div>
//                   <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
//                     Duration
//                   </label>
//                   <input
//                     type='text'
//                     required
//                     placeholder='e.g., 16 Weeks'
//                     className={inputClass}
//                     value={duration}
//                     onChange={(e) => setDuration(e.target.value)}
//                   />
//                 </div>
//                 <div>
//                   <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
//                     Tuition Price
//                   </label>
//                   <input
//                     type='text'
//                     required
//                     placeholder='e.g., ₦250,000'
//                     className={inputClass}
//                     value={price}
//                     onChange={(e) => setPrice(e.target.value)}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
//                   Status
//                 </label>
//                 <select
//                   className={inputClass}
//                   value={status}
//                   onChange={(e) =>
//                     setStatus(e.target.value as 'Active' | 'Upcoming')
//                   }
//                 >
//                   <option value='Active'>Active</option>
//                   <option value='Upcoming'>Upcoming</option>
//                 </select>
//               </div>

//               <div className='flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800'>
//                 <button
//                   type='button'
//                   onClick={() => setIsModalOpen(false)}
//                   className='px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer'
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type='submit'
//                   disabled={isSubmitting}
//                   className='px-5 py-2 rounded-xl text-xs font-semibold bg-primary-purple text-white hover:opacity-90 shadow-sm cursor-pointer flex items-center gap-2 disabled:opacity-50'
//                 >
//                   {isSubmitting && (
//                     <Loader2 size={13} className='animate-spin' />
//                   )}
//                   <span>
//                     {editingCourse ? 'Save Changes' : 'Create Programme'}
//                   </span>
//                 </button>
//               </div>
//             </form>
//           </motion.div>
//         </div>
//       )}
//     </motion.div>
//   )
// }



// src/app/admin/courses/page.tsx
'use client'
import { useState, useEffect, FormEvent } from 'react'
import {
  BookOpen,
  Plus,
  Users,
  Clock,
  Edit3,
  Trash2,
  X,
  Loader2,
  AlertTriangle,
  UserCheck,
  RefreshCw,
  Award,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { adminApiClient } from '@/services/admin-api'

interface Course {
  id: string | number
  title: string
  duration: string
  price: string
  rawPrice?: number | string
  students: number
  status: 'Active' | 'Upcoming'
  tutorId?: string | number
  tutorName?: string
}

interface Instructor {
  id: string | number
  name: string
  email: string
  specialty?: string
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)

  // Tutor Assignment Modal states
  const [isTutorModalOpen, setIsTutorModalOpen] = useState(false)
  const [selectedCourseForTutor, setSelectedCourseForTutor] =
    useState<Course | null>(null)
  const [selectedTutorId, setSelectedTutorId] = useState('')
  const [isAssigningTutor, setIsAssigningTutor] = useState(false)

  // Form states for Course
  const [title, setTitle] = useState('')
  const [duration, setDuration] = useState('')
  const [price, setPrice] = useState('')
  const [status, setStatus] = useState<'Active' | 'Upcoming'>('Active')

  const fetchData = async () => {
    setIsLoading(true)
    setErrorMessage('')
    try {
      const [courseRes, instructorRes] = await Promise.all([
        adminApiClient.getAdminCourses(),
        adminApiClient.getAdminInstructors?.().catch(() => []),
      ])

      const coursePayload = courseRes?.data || courseRes
      const courseList = Array.isArray(coursePayload)
        ? coursePayload
        : coursePayload?.courses || coursePayload?.data || []

      const instPayload = instructorRes?.data || instructorRes
      const instList = Array.isArray(instPayload)
        ? instPayload
        : instPayload?.instructors || instPayload?.data || []

      const formattedInstructors: Instructor[] = instList.map((ins: any) => ({
        id: ins.id || ins._id,
        name: ins.name || ins.fullname || 'Unnamed Instructor',
        email: ins.email || '',
        specialty: ins.specialty || '',
      }))
      setInstructors(formattedInstructors)

      if (Array.isArray(courseList)) {
        setCourses(
          courseList.map((c: any, index: number) => {
            const assignedInst = formattedInstructors.find(
              (i) =>
                String(i.id) ===
                String(c.tutorId || c.instructor_id || c.tutor_id),
            )
            const rawNumericPrice = c.price ? Number(c.price) : 200000
            return {
              id: c.id || c._id || `course-${index}`,
              title: c.course || c.title || c.name || 'Untitled Course',
              duration: c.duration || '16 Weeks',
              rawPrice: rawNumericPrice,
              price: `₦${rawNumericPrice.toLocaleString()}`,
              students: Number(
                c.enrolled_count || c.studentsCount || c.students || 0,
              ),
              status: c.status || 'Active',
              tutorId: assignedInst?.id || c.tutorId || c.tutor_id || '',
              tutorName:
                assignedInst?.name ||
                c.tutorName ||
                c.instructorName ||
                'Unassigned',
            }
          }),
        )
      }
    } catch (err: any) {
      setErrorMessage(
        err?.message || 'Failed to synchronize programmes and instructors.',
      )
      const saved = localStorage.getItem('denskill_admin_courses')
      if (saved) {
        try {
          setCourses(JSON.parse(saved))
        } catch (e) {
          // Ignore parse error
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('denskill_admin_courses', JSON.stringify(courses))
    }
  }, [courses, isLoading])

  const handleOpenAddModal = () => {
    setEditingCourse(null)
    setTitle('')
    setDuration('')
    setPrice('')
    setStatus('Active')
    setErrorMessage('')
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (course: Course) => {
    setEditingCourse(course)
    setTitle(course.title)
    setDuration(course.duration)
    // Strip out currency formatting for easy editing input
    const cleanNumeric = course.rawPrice ?? course.price.replace(/[^0-9.]/g, '')
    setPrice(String(cleanNumeric))
    setStatus(course.status)
    setErrorMessage('')
    setIsModalOpen(true)
  }

  const handleOpenTutorModal = (course: Course) => {
    setSelectedCourseForTutor(course)
    setSelectedTutorId(String(course.tutorId || ''))
    setErrorMessage('')
    setIsTutorModalOpen(true)
  }

  const handleAssignTutorSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!selectedCourseForTutor || !selectedTutorId) return

    setIsAssigningTutor(true)
    setErrorMessage('')

    try {
      // Use your robust adminApiClient instead of raw window.fetch where available, or keep endpoint fetch pattern
      const endpoint = `${process.env.NEXT_PUBLIC_API_URL || 'https://denskill-backend.onrender.com'}/api/admin/courses/${selectedCourseForTutor.id}/assign-tutor`
      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('token') ||
            localStorage.getItem('denskill_token')
          : ''

      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tutorId: Number(selectedTutorId) || selectedTutorId,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.message || 'Failed to assign instructor.')
      }

      const matchedInstructor = instructors.find(
        (i) => String(i.id) === String(selectedTutorId),
      )

      setCourses(
        courses.map((c) =>
          c.id === selectedCourseForTutor.id
            ? {
                ...c,
                tutorId: selectedTutorId,
                tutorName: matchedInstructor
                  ? matchedInstructor.name
                  : `Instructor #${selectedTutorId}`,
              }
            : c,
        ),
      )
      setIsTutorModalOpen(false)
    } catch (err: any) {
      setErrorMessage(
        err?.message || 'Failed to assign instructor to programme.',
      )
    } finally {
      setIsAssigningTutor(false)
    }
  }

  const handleSaveCourse = async (e: FormEvent) => {
    e.preventDefault()
    if (!title || !duration || !price) return

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const numericPrice = Number(String(price).replace(/[^0-9.]/g, '')) || 0
      const payload = { title, duration, price: numericPrice, status }

      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('token') ||
            localStorage.getItem('denskill_token')
          : ''
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || 'https://denskill-backend.onrender.com'

      if (editingCourse) {
        // Update API Request
        const res = await fetch(`${baseUrl}/api/admin/courses/${editingCourse.id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          throw new Error(errData?.message || 'Failed to update programme on server.')
        }

        setCourses(
          courses.map((c) =>
            c.id === editingCourse.id
              ? {
                  ...c,
                  title,
                  duration,
                  rawPrice: numericPrice,
                  price: `₦${numericPrice.toLocaleString()}`,
                  status,
                }
              : c,
          ),
        )
      } else {
        // Create API Request
        const res = await fetch(`${baseUrl}/api/admin/courses`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })

        const resData = await res.json().catch(() => ({}))
        if (!res.ok) {
          throw new Error(resData?.message || 'Failed to create programme on server.')
        }

        const createdItem = resData?.course || resData?.data || resData

        const newCourse: Course = {
          id: createdItem.id || createdItem._id || Date.now(),
          title,
          duration,
          rawPrice: numericPrice,
          price: `₦${numericPrice.toLocaleString()}`,
          students: 0,
          status,
          tutorName: 'Unassigned',
        }
        setCourses([newCourse, ...courses])
      }
      setIsModalOpen(false)
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to save programme.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteCourse = async (id: string | number) => {
    if (!confirm('Are you sure you want to remove this training programme?')) return

    try {
      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('token') ||
            localStorage.getItem('denskill_token')
          : ''
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || 'https://denskill-backend.onrender.com'

      const res = await fetch(`${baseUrl}/api/admin/courses/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData?.message || 'Failed to delete programme.')
      }

      setCourses(courses.filter((c) => c.id !== id))
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to delete programme from server.')
    }
  }

  const inputClass =
    'w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple text-xs transition'

  if (isLoading) {
    return (
      <div className='h-96 flex items-center justify-center'>
        <Loader2 className='w-6 h-6 animate-spin text-primary-purple' />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='space-y-6 max-w-7xl mx-auto pb-12'
    >
      {/* Header section */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
            Programmes & Curriculum
          </h2>
          <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
            Manage active training tracks, tuition pricing, and assign certified
            department instructors.
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={fetchData}
            className='bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs border border-gray-200 dark:border-gray-800'
          >
            <RefreshCw
              size={14}
              className={isLoading ? 'animate-spin text-primary-purple' : ''}
            />
            Refresh
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleOpenAddModal}
            className='bg-primary-purple hover:bg-primary-purple/90 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm'
          >
            <Plus size={14} /> Add Programme
          </motion.button>
        </div>
      </div>

      {/* Error banner */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className='p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center gap-3 text-xs font-medium'
          >
            <AlertTriangle size={18} className='shrink-0' />
            <span>{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Courses Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {courses.map((course) => (
          <motion.div
            whileHover={{ y: -2 }}
            key={course.id}
            className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4 flex flex-col justify-between transition-colors'
          >
            <div className='space-y-3'>
              <div className='flex justify-between items-start'>
                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                    course.status === 'Active'
                      ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                      : 'bg-blue-500/10 text-blue-500 dark:text-blue-400'
                  }`}
                >
                  {course.status}
                </span>
                <span className='font-mono font-bold text-base text-gray-900 dark:text-white'>
                  {course.price}
                </span>
              </div>

              <div>
                <h3 className='text-base font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                  <BookOpen
                    size={16}
                    className='text-primary-purple shrink-0'
                  />
                  {course.title}
                </h3>
              </div>

              <div className='flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-800'>
                <span className='flex items-center gap-1 font-mono text-[11px]'>
                  <Clock size={13} /> {course.duration}
                </span>
                <span className='flex items-center gap-1 font-mono text-[11px]'>
                  <Users size={13} /> {course.students} Enrolled
                </span>
              </div>

              <div className='p-3 rounded-xl bg-gray-50 dark:bg-gray-950/50 border border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs'>
                <span className='text-gray-500 dark:text-gray-400 flex items-center gap-1.5 font-medium'>
                  <Award size={13} className='text-primary-purple' /> Lead
                  Instructor:
                </span>
                <span className='text-primary-purple font-semibold'>
                  {course.tutorName || 'Unassigned'}
                </span>
              </div>
            </div>

            <div className='flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800'>
              <button
                onClick={() => handleOpenTutorModal(course)}
                className='px-3 py-1.5 rounded-xl bg-primary-purple/10 hover:bg-primary-purple/20 text-xs font-semibold text-primary-purple flex items-center gap-1 transition cursor-pointer'
              >
                <UserCheck size={13} /> Assign Instructor
              </button>
              <div className='flex items-center gap-2'>
                <button
                  onClick={() => handleOpenEditModal(course)}
                  className='p-2 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition cursor-pointer'
                  title='Edit Programme'
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={() => handleDeleteCourse(course.id)}
                  className='p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 transition cursor-pointer'
                  title='Remove Programme'
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Assign Tutor / Instructor Modal */}
      {isTutorModalOpen && (
        <div className='fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4'>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl'
          >
            <div className='flex justify-between items-center border-b pb-4 border-gray-100 dark:border-gray-800'>
              <h3 className='text-base font-bold text-gray-900 dark:text-white'>
                Assign Instructor
              </h3>
              <button
                onClick={() => setIsTutorModalOpen(false)}
                className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer'
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAssignTutorSubmit} className='space-y-4'>
              <div>
                <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                  Target Programme
                </label>
                <input
                  type='text'
                  disabled
                  value={selectedCourseForTutor?.title || ''}
                  className={`${inputClass} opacity-60 cursor-not-allowed`}
                />
              </div>

              <div>
                <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                  Select Certified Instructor
                </label>
                <select
                  required
                  value={selectedTutorId}
                  onChange={(e) => setSelectedTutorId(e.target.value)}
                  className={inputClass}
                >
                  <option value=''>-- Select Instructor --</option>
                  {instructors.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name} {inst.specialty ? `(${inst.specialty})` : ''}
                    </option>
                  ))}
                </select>
                {instructors.length === 0 && (
                  <p className='text-[11px] text-amber-500 mt-1'>
                    No registered instructors found in system database. Create
                    instructors via the team management console first.
                  </p>
                )}
              </div>

              <div className='flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800'>
                <button
                  type='button'
                  onClick={() => setIsTutorModalOpen(false)}
                  className='px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={isAssigningTutor}
                  className='px-5 py-2 rounded-xl text-xs font-semibold bg-primary-purple text-white hover:opacity-90 shadow-sm cursor-pointer flex items-center gap-2 disabled:opacity-50'
                >
                  {isAssigningTutor && (
                    <Loader2 size={13} className='animate-spin' />
                  )}
                  <span>Save Assignment</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Add / Edit Programme Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4'>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl'
          >
            <div className='flex justify-between items-center border-b pb-4 border-gray-100 dark:border-gray-800'>
              <h3 className='text-base font-bold text-gray-900 dark:text-white'>
                {editingCourse
                  ? 'Edit Training Programme'
                  : 'Add New Training Programme'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer'
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className='space-y-4'>
              <div>
                <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                  Programme Title
                </label>
                <input
                  type='text'
                  required
                  placeholder='e.g., Cloud DevOps Engineering'
                  className={inputClass}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                    Duration
                  </label>
                  <input
                    type='text'
                    required
                    placeholder='e.g., 16 Weeks'
                    className={inputClass}
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>
                <div>
                  <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                    Tuition Price (Number)
                  </label>
                  <input
                    type='number'
                    required
                    placeholder='e.g., 250000'
                    className={inputClass}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                  Status
                </label>
                <select
                  className={inputClass}
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as 'Active' | 'Upcoming')
                  }
                >
                  <option value='Active'>Active</option>
                  <option value='Upcoming'>Upcoming</option>
                </select>
              </div>

              <div className='flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800'>
                <button
                  type='button'
                  onClick={() => setIsModalOpen(false)}
                  className='px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='px-5 py-2 rounded-xl text-xs font-semibold bg-primary-purple text-white hover:opacity-90 shadow-sm cursor-pointer flex items-center gap-2 disabled:opacity-50'
                >
                  {isSubmitting && (
                    <Loader2 size={13} className='animate-spin' />
                  )}
                  <span>
                    {editingCourse ? 'Save Changes' : 'Create Programme'}
                  </span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}