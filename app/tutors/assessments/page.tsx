// // src/app/tutors/assessments/page.tsx
// 'use client'

// import { useState, useEffect, FormEvent } from 'react'
// import {
//   FileText,
//   Plus,
//   CheckCircle2,
//   AlertCircle,
//   Loader2,
//   X,
//   Award,
//   Calendar,
//   Edit3,
//   Trash2,
// } from 'lucide-react'
// import { apiClient } from '@/services/api'

// interface Assessment {
//   id: string | number
//   title: string
//   description: string
//   type: string
//   total_marks: number
//   weight: number
//   due_date: string
// }

// interface Submission {
//   id: string | number
//   student_name?: string
//   student_id: string | number
//   score?: number
//   feedback?: string
//   submitted_at?: string
//   status?: string
// }

// export default function TutorsAssessmentsPage() {
//   const [courseId, setCourseId] = useState<string>('fullstack-dev')
//   const [assessments, setAssessments] = useState<Assessment[]>([])
//   const [isLoading, setIsLoading] = useState(true)

//   // Assessment Form Modal (Create / Edit)
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [editingAssessmentId, setEditingAssessmentId] = useState<string | number | null>(null)
//   const [title, setTitle] = useState('')
//   const [description, setDescription] = useState('')
//   const [type, setType] = useState('assignment')
//   const [totalMarks, setTotalMarks] = useState(100)
//   const [weight, setWeight] = useState(1.5)
//   const [dueDate, setDueDate] = useState('')

//   // Submissions Modal
//   const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | number | null>(null)
//   const [submissions, setSubmissions] = useState<Submission[]>([])
//   const [isLoadingSubs, setIsLoadingSubs] = useState(false)

//   // Grading Modal
//   const [gradingSubId, setGradingSubId] = useState<string | number | null>(null)
//   const [score, setScore] = useState<number>(0)
//   const [feedback, setFeedback] = useState('')

//   // Notification Modal
//   const [alertModal, setAlertModal] = useState({
//     isOpen: false,
//     title: '',
//     message: '',
//     isSuccess: true,
//   })

//   const showAlert = (title: string, message: string, isSuccess = true) => {
//     setAlertModal({ isOpen: true, title, message, isSuccess })
//   }

//   const fetchAssessments = async () => {
//     setIsLoading(true)
//     try {
//       const res = await apiClient.getCourseAssessments(courseId)
//       const list = Array.isArray(res) ? res : res?.assessments || res?.data || []
//       setAssessments(list)
//     } catch (err) {
//       setAssessments([
//         {
//           id: 1,
//           title: 'MERN REST API Microservice',
//           description: 'Build authenticated endpoints using Node.js, Express, and JWT.',
//           type: 'assignment',
//           total_marks: 100,
//           weight: 2.0,
//           due_date: '2026-08-30T23:59:00Z',
//         },
//       ])
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchAssessments()
//   }, [courseId])

//   const handleOpenCreateModal = () => {
//     setEditingAssessmentId(null)
//     setTitle('')
//     setDescription('')
//     setType('assignment')
//     setTotalMarks(100)
//     setWeight(1.5)
//     setDueDate('')
//     setIsModalOpen(true)
//   }

//   const handleOpenEditModal = (item: Assessment) => {
//     setEditingAssessmentId(item.id)
//     setTitle(item.title)
//     setDescription(item.description)
//     setType(item.type)
//     setTotalMarks(item.total_marks)
//     setWeight(item.weight)
//     // Format due date for datetime-local input if present
//     const formattedDate = item.due_date ? item.due_date.slice(0, 16) : ''
//     setDueDate(formattedDate)
//     setIsModalOpen(true)
//   }

//   const handleSaveAssessment = async (e: FormEvent) => {
//     e.preventDefault()
//     try {
//       if (editingAssessmentId) {
//         await apiClient.updateAssessment(editingAssessmentId, {
//           title,
//           description,
//           type,
//           total_marks: Number(totalMarks),
//           weight: Number(weight),
//           due_date: dueDate || new Date().toISOString(),
//         })
//         showAlert('Success', 'Assessment updated successfully!', true)
//       } else {
//         await apiClient.createAssessment({
//           course_id: courseId,
//           title,
//           description,
//           type,
//           total_marks: Number(totalMarks),
//           weight: Number(weight),
//           due_date: dueDate || new Date().toISOString(),
//         })
//         showAlert('Success', 'Assessment created and published successfully!', true)
//       }
//       setIsModalOpen(false)
//       fetchAssessments()
//     } catch (err: any) {
//       showAlert('Error', err?.message || 'Failed to save assessment.', false)
//     }
//   }

//   const handleDeleteAssessment = async (assessmentId: string | number) => {
//     if (!confirm('Are you sure you want to delete this assessment?')) return
//     try {
//       await apiClient.deleteAssessment(assessmentId)
//       showAlert('Success', 'Assessment deleted successfully.', true)
//       fetchAssessments()
//     } catch (err: any) {
//       showAlert('Error', err?.message || 'Failed to delete assessment.', false)
//     }
//   }

//   const handleViewSubmissions = async (assessmentId: string | number) => {
//     setSelectedAssessmentId(assessmentId)
//     setIsLoadingSubs(true)
//     try {
//       const res = await apiClient.getAssessmentSubmissions(assessmentId)
//       const list = Array.isArray(res) ? res : res?.submissions || res?.data || []
//       setSubmissions(list)
//     } catch (err) {
//       setSubmissions([
//         {
//           id: 101,
//           student_name: 'Alex Johnson',
//           student_id: 1,
//           score: 85,
//           feedback: 'Good structure.',
//           status: 'graded',
//         },
//         {
//           id: 102,
//           student_name: 'Sarah Williams',
//           student_id: 2,
//           status: 'pending',
//         },
//       ])
//     } finally {
//       setIsLoadingSubs(false)
//     }
//   }

//   const handleGradeSubmission = async (e: FormEvent) => {
//     e.preventDefault()
//     if (gradingSubId === null) return
//     try {
//       await apiClient.gradeSubmission(gradingSubId, {
//         score: Number(score),
//         feedback,
//       })
//       showAlert('Success', 'Grade and feedback submitted successfully!', true)
//       setGradingSubId(null)
//       if (selectedAssessmentId) handleViewSubmissions(selectedAssessmentId)
//     } catch (err: any) {
//       showAlert('Error', err?.message || 'Failed to submit grade.', false)
//     }
//   }

//   const inputClass =
//     'w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-dark dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-purple'

//   return (
//     <div className='space-y-6 animate-fadeIn'>
//       <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
//         <div>
//           <h1 className='text-2xl font-bold text-dark dark:text-white'>
//             Assessments & Grading
//           </h1>
//           <p className='text-sm text-gray-500'>
//             Create assignments, quizzes, and grade student submissions in real time.
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
//           <button
//             onClick={handleOpenCreateModal}
//             className='bg-primary-purple hover:bg-primary-purple/90 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition flex items-center gap-2 cursor-pointer shadow-sm'
//           >
//             <Plus size={16} /> New Assessment
//           </button>
//         </div>
//       </div>

//       {isLoading ? (
//         <div className='h-64 flex items-center justify-center'>
//           <Loader2 className='w-6 h-6 animate-spin text-primary-purple' />
//         </div>
//       ) : assessments.length === 0 ? (
//         <div className='bg-white dark:bg-gray-900 p-12 text-center rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3'>
//           <FileText size={40} className='mx-auto text-gray-400' />
//           <p className='text-sm font-medium text-gray-500'>
//             No assessments found for this course.
//           </p>
//         </div>
//       ) : (
//         <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
//           {assessments.map((item) => (
//             <div
//               key={item.id}
//               className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4 flex flex-col justify-between'
//             >
//               <div className='space-y-2'>
//                 <div className='flex items-center justify-between'>
//                   <span className='px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-primary-purple/10 text-primary-purple'>
//                     {item.type}
//                   </span>
//                   <div className='flex items-center gap-3'>
//                     <span className='text-xs text-gray-400 flex items-center gap-1'>
//                       <Calendar size={12} /> Due: {new Date(item.due_date).toLocaleDateString()}
//                     </span>
//                     <button
//                       onClick={() => handleOpenEditModal(item)}
//                       className='text-gray-400 hover:text-primary-purple transition cursor-pointer'
//                       title='Edit Assessment'
//                     >
//                       <Edit3 size={14} />
//                     </button>
//                     <button
//                       onClick={() => handleDeleteAssessment(item.id)}
//                       className='text-gray-400 hover:text-red-500 transition cursor-pointer'
//                       title='Delete Assessment'
//                     >
//                       <Trash2 size={14} />
//                     </button>
//                   </div>
//                 </div>
//                 <h3 className='text-lg font-bold text-dark dark:text-white'>
//                   {item.title}
//                 </h3>
//                 <p className='text-xs text-gray-500 line-clamp-2'>
//                   {item.description}
//                 </p>
//               </div>

//               <div className='flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500'>
//                 <span>
//                   Total Marks: <strong>{item.total_marks}</strong>
//                 </span>
//                 <span>
//                   Weight: <strong>{item.weight}x</strong>
//                 </span>
//                 <button
//                   onClick={() => handleViewSubmissions(item.id)}
//                   className='px-3.5 py-2 rounded-xl bg-primary-purple text-white font-medium hover:opacity-90 transition cursor-pointer'
//                 >
//                   View Submissions
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Create / Edit Assessment Modal */}
//       {isModalOpen && (
//         <div className='fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn'>
//           <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl'>
//             <div className='flex justify-between items-center border-b pb-4 dark:border-gray-800'>
//               <h3 className='text-lg font-bold text-dark dark:text-white'>
//                 {editingAssessmentId ? 'Edit Assessment' : 'Create New Assessment'}
//               </h3>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className='text-gray-400 hover:text-gray-200 cursor-pointer'
//               >
//                 <X size={20} />
//               </button>
//             </div>
//             <form onSubmit={handleSaveAssessment} className='space-y-4'>
//               <div>
//                 <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
//                   Title
//                 </label>
//                 <input
//                   type='text'
//                   required
//                   placeholder='e.g., Week 3 React Challenge'
//                   className={inputClass}
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                 />
//               </div>
//               <div>
//                 <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
//                   Description
//                 </label>
//                 <textarea
//                   required
//                   placeholder='Instructions and requirements...'
//                   className={`${inputClass} h-24`}
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                 />
//               </div>
//               <div className='grid grid-cols-2 gap-4'>
//                 <div>
//                   <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
//                     Type
//                   </label>
//                   <select
//                     className={inputClass}
//                     value={type}
//                     onChange={(e) => setType(e.target.value)}
//                   >
//                     <option value='assignment'>Assignment</option>
//                     <option value='quiz'>Quiz</option>
//                     <option value='project'>Project</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
//                     Total Marks
//                   </label>
//                   <input
//                     type='number'
//                     required
//                     className={inputClass}
//                     value={totalMarks}
//                     onChange={(e) => setTotalMarks(Number(e.target.value))}
//                   />
//                 </div>
//               </div>
//               <div className='grid grid-cols-2 gap-4'>
//                 <div>
//                   <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
//                     Weight Multiplier
//                   </label>
//                   <input
//                     type='number'
//                     step='0.1'
//                     required
//                     className={inputClass}
//                     value={weight}
//                     onChange={(e) => setWeight(Number(e.target.value))}
//                   />
//                 </div>
//                 <div>
//                   <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
//                     Due Date
//                   </label>
//                   <input
//                     type='datetime-local'
//                     required
//                     className={inputClass}
//                     value={dueDate}
//                     onChange={(e) => setDueDate(e.target.value)}
//                   />
//                 </div>
//               </div>
//               <div className='flex justify-end gap-3 pt-4 border-t dark:border-gray-800'>
//                 <button
//                   type='button'
//                   onClick={() => setIsModalOpen(false)}
//                   className='px-4 py-2 rounded-xl text-xs font-semibold border border-gray-300 dark:border-gray-700 text-gray-600 cursor-pointer'
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type='submit'
//                   className='px-5 py-2 rounded-xl text-xs font-semibold bg-primary-purple text-white hover:opacity-90 cursor-pointer'
//                 >
//                   {editingAssessmentId ? 'Save Changes' : 'Publish Assessment'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Submissions Modal */}
//       {selectedAssessmentId && (
//         <div className='fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn'>
//           <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[80vh] overflow-y-auto'>
//             <div className='flex justify-between items-center border-b pb-4 dark:border-gray-800'>
//               <h3 className='text-lg font-bold text-dark dark:text-white'>
//                 Student Submissions
//               </h3>
//               <button
//                 onClick={() => setSelectedAssessmentId(null)}
//                 className='text-gray-400 hover:text-gray-200 cursor-pointer'
//               >
//                 <X size={20} />
//               </button>
//             </div>
//             {isLoadingSubs ? (
//               <div className='py-12 flex justify-center'>
//                 <Loader2 className='animate-spin text-primary-purple' />
//               </div>
//             ) : submissions.length === 0 ? (
//               <p className='text-xs text-gray-500 text-center py-8'>
//                 No submissions found for this assessment.
//               </p>
//             ) : (
//               <div className='space-y-3'>
//                 {submissions.map((sub) => (
//                   <div
//                     key={sub.id}
//                     className='p-4 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-between'
//                   >
//                     <div>
//                       <h4 className='text-sm font-bold text-dark dark:text-white'>
//                         {sub.student_name || `Student ID: ${sub.student_id}`}
//                       </h4>
//                       <p className='text-xs text-gray-500'>
//                         Status:{' '}
//                         <span className='font-semibold text-primary-purple uppercase'>
//                           {sub.status || 'Pending'}
//                         </span>{' '}
//                         {sub.score !== undefined && `• Score: ${sub.score}/100`}
//                       </p>
//                     </div>
//                     <button
//                       onClick={() => {
//                         setGradingSubId(sub.id)
//                         setScore(sub.score || 0)
//                         setFeedback(sub.feedback || '')
//                       }}
//                       className='px-3 py-1.5 rounded-lg bg-primary-purple/10 text-primary-purple font-semibold text-xs hover:bg-primary-purple/20 transition cursor-pointer flex items-center gap-1'
//                     >
//                       <Award size={14} />{' '}
//                       {sub.score !== undefined ? 'Edit Grade' : 'Grade Submission'}
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Grade Submission Modal */}
//       {gradingSubId !== null && (
//         <div className='fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn'>
//           <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl'>
//             <div className='flex justify-between items-center border-b pb-3 dark:border-gray-800'>
//               <h3 className='text-base font-bold text-dark dark:text-white'>
//                 Grade Student Submission
//               </h3>
//               <button
//                 onClick={() => setGradingSubId(null)}
//                 className='text-gray-400 hover:text-gray-200 cursor-pointer'
//               >
//                 <X size={18} />
//               </button>
//             </div>
//             <form onSubmit={handleGradeSubmission} className='space-y-4'>
//               <div>
//                 <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
//                   Score (Out of 100)
//                 </label>
//                 <input
//                   type='number'
//                   required
//                   max={100}
//                   min={0}
//                   className={inputClass}
//                   value={score}
//                   onChange={(e) => setScore(Number(e.target.value))}
//                 />
//               </div>
//               <div>
//                 <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
//                   Feedback / Review Notes
//                 </label>
//                 <textarea
//                   required
//                   placeholder='Great job implementing endpoint logic...'
//                   className={`${inputClass} h-24`}
//                   value={feedback}
//                   onChange={(e) => setFeedback(e.target.value)}
//                 />
//               </div>
//               <div className='flex justify-end gap-2 pt-2'>
//                 <button
//                   type='button'
//                   onClick={() => setGradingSubId(null)}
//                   className='px-4 py-2 rounded-xl text-xs font-semibold border border-gray-300 dark:border-gray-700 text-gray-600 cursor-pointer'
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type='submit'
//                   className='px-5 py-2 rounded-xl text-xs font-semibold bg-primary-purple text-white hover:opacity-90 cursor-pointer'
//                 >
//                   Submit Grade
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Alert Modal */}
//       {alertModal.isOpen && (
//         <div className='fixed inset-0 z-70 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn'>
//           <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl'>
//             <div
//               className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${alertModal.isSuccess ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}
//             >
//               {alertModal.isSuccess ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
//             </div>
//             <h3 className='text-lg font-bold text-dark dark:text-white'>
//               {alertModal.title}
//             </h3>
//             <p className='text-xs text-gray-500'>{alertModal.message}</p>
//             <button
//               onClick={() => setAlertModal((prev) => ({ ...prev, isOpen: false }))}
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



// src/app/tutors/assessments/page.tsx
'use client'

import { useState, useEffect, FormEvent } from 'react'
import {
  FileText,
  Plus,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Award,
  Calendar,
  Edit3,
  Trash2,
  RefreshCw,
} from 'lucide-react'
import { apiClient } from '@/services/api'

interface Course {
  id: string | number
  title?: string
  name?: string
  course_name?: string
  code?: string
  course_code?: string
}

interface Assessment {
  id: string | number
  course_id?: string | number
  title: string
  description: string
  type: string
  total_marks: number
  weight: number
  due_date: string
}

interface Submission {
  id: string | number
  student_name?: string
  student_id: string | number
  score?: number
  feedback?: string
  submitted_at?: string
  status?: string
}

export default function TutorsAssessmentsPage() {
  // ==========================================
  // COURSES
  // ==========================================

  const [courses, setCourses] = useState<Course[]>([])
  const [courseId, setCourseId] = useState<string>('')

  const [isLoadingCourses, setIsLoadingCourses] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  // ==========================================
  // ASSESSMENTS
  // ==========================================

  const [assessments, setAssessments] = useState<Assessment[]>([])

  // ==========================================
  // ASSESSMENT FORM
  // ==========================================

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAssessmentId, setEditingAssessmentId] = useState<
    string | number | null
  >(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('')
  const [totalMarks, setTotalMarks] = useState('')
  const [weight, setWeight] = useState('')
  const [dueDate, setDueDate] = useState('')

  const [isSavingAssessment, setIsSavingAssessment] = useState(false)
  const [deletingAssessmentId, setDeletingAssessmentId] = useState<
    string | number | null
  >(null)

  // ==========================================
  // SUBMISSIONS
  // ==========================================

  const [selectedAssessmentId, setSelectedAssessmentId] = useState<
    string | number | null
  >(null)

  const [selectedAssessment, setSelectedAssessment] =
    useState<Assessment | null>(null)

  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoadingSubs, setIsLoadingSubs] = useState(false)

  // ==========================================
  // GRADING
  // ==========================================

  const [gradingSubId, setGradingSubId] = useState<
    string | number | null
  >(null)

  const [score, setScore] = useState('')
  const [feedback, setFeedback] = useState('')
  const [isGrading, setIsGrading] = useState(false)

  // ==========================================
  // ERROR / ALERT
  // ==========================================

  const [pageError, setPageError] = useState('')

  const [alertModal, setAlertModal] = useState({
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

  // ==========================================
  // RESPONSE NORMALIZERS
  // ==========================================

  const extractList = <T,>(response: any, keys: string[] = []): T[] => {
    if (Array.isArray(response)) {
      return response
    }

    if (response?.data && Array.isArray(response.data)) {
      return response.data
    }

    for (const key of keys) {
      if (Array.isArray(response?.[key])) {
        return response[key]
      }
    }

    if (response?.data && typeof response.data === 'object') {
      for (const key of keys) {
        if (Array.isArray(response.data?.[key])) {
          return response.data[key]
        }
      }
    }

    return []
  }

  // ==========================================
  // FETCH ASSIGNED COURSES
  // ==========================================

  const fetchAssignedCourses = async () => {
    setIsLoadingCourses(true)
    setPageError('')

    try {
      const response = await apiClient.getTutorAssignedCourses()

      const assignedCourses = extractList<Course>(response, [
        'courses',
        'assignedCourses',
      ])

      setCourses(assignedCourses)

      /*
       * Automatically select the first real course returned
       * by the API if no course is currently selected.
       */
      if (assignedCourses.length > 0) {
        setCourseId((currentCourseId) => {
          const stillExists = assignedCourses.some(
            (course) => String(course.id) === String(currentCourseId),
          )

          return stillExists
            ? currentCourseId
            : String(assignedCourses[0].id)
        })
      } else {
        setCourseId('')
        setAssessments([])
      }
    } catch (error: any) {
      setCourses([])
      setCourseId('')
      setAssessments([])

      setPageError(
        error?.message ||
          'Unable to load courses assigned to this tutor.',
      )
    } finally {
      setIsLoadingCourses(false)
    }
  }

  // ==========================================
  // FETCH ASSESSMENTS
  // ==========================================

  const fetchAssessments = async () => {
    if (!courseId) {
      setAssessments([])
      return
    }

    setIsLoading(true)
    setPageError('')

    try {
      const response = await apiClient.getCourseAssessments(courseId)

      const list = extractList<Assessment>(response, [
        'assessments',
      ])

      setAssessments(list)
    } catch (error: any) {
      setAssessments([])

      setPageError(
        error?.message ||
          'Unable to load assessments for this course.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchAssignedCourses()
  }, [])

  // ==========================================
  // LOAD ASSESSMENTS WHEN COURSE CHANGES
  // ==========================================

  useEffect(() => {
    if (courseId) {
      fetchAssessments()
    }
  }, [courseId])

  // ==========================================
  // CREATE MODAL
  // ==========================================

  const handleOpenCreateModal = () => {
    setEditingAssessmentId(null)
    setTitle('')
    setDescription('')
    setType('')
    setTotalMarks('')
    setWeight('')
    setDueDate('')
    setIsModalOpen(true)
  }

  // ==========================================
  // EDIT MODAL
  // ==========================================

  const handleOpenEditModal = (item: Assessment) => {
    setEditingAssessmentId(item.id)
    setTitle(item.title || '')
    setDescription(item.description || '')
    setType(item.type || '')
    setTotalMarks(
      item.total_marks !== undefined
        ? String(item.total_marks)
        : '',
    )
    setWeight(
      item.weight !== undefined
        ? String(item.weight)
        : '',
    )

    const formattedDate = item.due_date
      ? new Date(item.due_date).toISOString().slice(0, 16)
      : ''

    setDueDate(formattedDate)
    setIsModalOpen(true)
  }

  // ==========================================
  // SAVE ASSESSMENT
  // ==========================================

  const handleSaveAssessment = async (e: FormEvent) => {
    e.preventDefault()

    if (!courseId) {
      showAlert(
        'No Course Selected',
        'Select one of your assigned courses before creating an assessment.',
        false,
      )
      return
    }

    if (!title.trim()) {
      showAlert(
        'Validation Error',
        'Assessment title is required.',
        false,
      )
      return
    }

    if (!description.trim()) {
      showAlert(
        'Validation Error',
        'Assessment description is required.',
        false,
      )
      return
    }

    if (!type) {
      showAlert(
        'Validation Error',
        'Assessment type is required.',
        false,
      )
      return
    }

    if (!totalMarks || Number(totalMarks) <= 0) {
      showAlert(
        'Validation Error',
        'Enter a valid total mark.',
        false,
      )
      return
    }

    if (!weight || Number(weight) <= 0) {
      showAlert(
        'Validation Error',
        'Enter a valid assessment weight.',
        false,
      )
      return
    }

    if (!dueDate) {
      showAlert(
        'Validation Error',
        'Select a due date.',
        false,
      )
      return
    }

    setIsSavingAssessment(true)

    try {
      const payload = {
        course_id: courseId,
        title: title.trim(),
        description: description.trim(),
        type,
        total_marks: Number(totalMarks),
        weight: Number(weight),
        due_date: new Date(dueDate).toISOString(),
      }

      if (editingAssessmentId !== null) {
        await apiClient.updateAssessment(
          editingAssessmentId,
          {
            title: payload.title,
            description: payload.description,
            type: payload.type,
            total_marks: payload.total_marks,
            weight: payload.weight,
            due_date: payload.due_date,
          },
        )

        showAlert(
          'Success',
          'Assessment updated successfully.',
          true,
        )
      } else {
        await apiClient.createAssessment(payload)

        showAlert(
          'Success',
          'Assessment created successfully.',
          true,
        )
      }

      setIsModalOpen(false)

      await fetchAssessments()
    } catch (error: any) {
      showAlert(
        'Error',
        error?.message ||
          'Failed to save assessment.',
        false,
      )
    } finally {
      setIsSavingAssessment(false)
    }
  }

  // ==========================================
  // DELETE ASSESSMENT
  // ==========================================

  const handleDeleteAssessment = async (
    assessmentId: string | number,
  ) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this assessment?',
    )

    if (!confirmed) return

    setDeletingAssessmentId(assessmentId)

    try {
      await apiClient.deleteAssessment(assessmentId)

      showAlert(
        'Success',
        'Assessment deleted successfully.',
        true,
      )

      await fetchAssessments()
    } catch (error: any) {
      showAlert(
        'Error',
        error?.message ||
          'Failed to delete assessment.',
        false,
      )
    } finally {
      setDeletingAssessmentId(null)
    }
  }

  // ==========================================
  // VIEW SUBMISSIONS
  // ==========================================

  const handleViewSubmissions = async (
    assessment: Assessment,
  ) => {
    setSelectedAssessmentId(assessment.id)
    setSelectedAssessment(assessment)
    setSubmissions([])
    setIsLoadingSubs(true)

    try {
      const response =
        await apiClient.getAssessmentSubmissions(
          assessment.id,
        )

      const list = extractList<Submission>(
        response,
        ['submissions'],
      )

      setSubmissions(list)
    } catch (error: any) {
      setSubmissions([])

      showAlert(
        'Error',
        error?.message ||
          'Unable to load student submissions.',
        false,
      )
    } finally {
      setIsLoadingSubs(false)
    }
  }

  // ==========================================
  // OPEN GRADING MODAL
  // ==========================================

  const handleOpenGrading = (sub: Submission) => {
    setGradingSubId(sub.id)

    setScore(
      sub.score !== undefined
        ? String(sub.score)
        : '',
    )

    setFeedback(sub.feedback || '')
  }

  // ==========================================
  // GRADE SUBMISSION
  // ==========================================

  const handleGradeSubmission = async (
    e: FormEvent,
  ) => {
    e.preventDefault()

    if (gradingSubId === null) return

    if (!score || Number(score) < 0) {
      showAlert(
        'Validation Error',
        'Enter a valid score.',
        false,
      )
      return
    }

    if (
      selectedAssessment &&
      Number(score) > selectedAssessment.total_marks
    ) {
      showAlert(
        'Invalid Score',
        `The score cannot exceed ${selectedAssessment.total_marks}.`,
        false,
      )
      return
    }

    if (!feedback.trim()) {
      showAlert(
        'Validation Error',
        'Feedback is required.',
        false,
      )
      return
    }

    setIsGrading(true)

    try {
      await apiClient.gradeSubmission(
        gradingSubId,
        {
          score: Number(score),
          feedback: feedback.trim(),
        },
      )

      showAlert(
        'Success',
        'Grade and feedback submitted successfully.',
        true,
      )

      setGradingSubId(null)
      setScore('')
      setFeedback('')

      if (selectedAssessment) {
        await handleViewSubmissions(
          selectedAssessment,
        )
      }
    } catch (error: any) {
      showAlert(
        'Error',
        error?.message ||
          'Failed to submit grade.',
        false,
      )
    } finally {
      setIsGrading(false)
    }
  }

  // ==========================================
  // CLOSE SUBMISSIONS
  // ==========================================

  const closeSubmissions = () => {
    setSelectedAssessmentId(null)
    setSelectedAssessment(null)
    setSubmissions([])
    setGradingSubId(null)
    setScore('')
    setFeedback('')
  }

  // ==========================================
  // COURSE NAME
  // ==========================================

  const getCourseName = (course: Course) => {
    return (
      course.title ||
      course.name ||
      course.course_name ||
      course.code ||
      course.course_code ||
      `Course ${course.id}`
    )
  }

  // ==========================================
  // INPUT STYLE
  // ==========================================

  const inputClass =
    'w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-dark dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-purple'

  return (
    <div className='space-y-6 animate-fadeIn'>
      {/* ========================================
          HEADER
      ======================================== */}

      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-dark dark:text-white'>
            Assessments & Grading
          </h1>

          <p className='text-sm text-gray-500'>
            Create assessments and grade student submissions.
          </p>
        </div>

        <div className='flex items-center gap-3'>
          {/* REAL COURSES FROM API */}

          <select
            value={courseId}
            onChange={(e) =>
              setCourseId(e.target.value)
            }
            disabled={
              isLoadingCourses ||
              courses.length === 0
            }
            className='p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs font-medium text-dark dark:text-white disabled:opacity-50'
          >
            <option value=''>
              {isLoadingCourses
                ? 'Loading courses...'
                : courses.length === 0
                  ? 'No assigned courses'
                  : 'Select course'}
            </option>

            {courses.map((course) => (
              <option
                key={course.id}
                value={String(course.id)}
              >
                {getCourseName(course)}
              </option>
            ))}
          </select>

          <button
            onClick={handleOpenCreateModal}
            disabled={!courseId}
            className='bg-primary-purple hover:bg-primary-purple/90 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <Plus size={16} />
            New Assessment
          </button>
        </div>
      </div>

      {/* ========================================
          ERROR
      ======================================== */}

      {pageError && (
        <div className='flex items-center justify-between gap-4 p-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20'>
          <div className='flex items-center gap-3'>
            <AlertCircle
              size={18}
              className='text-red-500 shrink-0'
            />

            <p className='text-sm text-red-600 dark:text-red-400'>
              {pageError}
            </p>
          </div>

          <button
            onClick={() => {
              fetchAssignedCourses()
            }}
            className='flex items-center gap-2 text-xs font-semibold text-red-600 hover:text-red-700'
          >
            <RefreshCw size={14} />
            Retry
          </button>
        </div>
      )}

      {/* ========================================
          LOADING
      ======================================== */}

      {isLoadingCourses || isLoading ? (
        <div className='h-64 flex items-center justify-center'>
          <Loader2 className='w-6 h-6 animate-spin text-primary-purple' />
        </div>
      ) : !courseId ? (
        <div className='bg-white dark:bg-gray-900 p-12 text-center rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3'>
          <FileText
            size={40}
            className='mx-auto text-gray-400'
          />

          <p className='text-sm font-medium text-gray-500'>
            {courses.length === 0
              ? 'No courses are currently assigned to you.'
              : 'Select a course to view its assessments.'}
          </p>
        </div>
      ) : assessments.length === 0 ? (
        <div className='bg-white dark:bg-gray-900 p-12 text-center rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3'>
          <FileText
            size={40}
            className='mx-auto text-gray-400'
          />

          <p className='text-sm font-medium text-gray-500'>
            No assessments found for this course.
          </p>
        </div>
      ) : (
        /* ========================================
           ASSESSMENTS
        ======================================== */

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {assessments.map((item) => (
            <div
              key={item.id}
              className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4 flex flex-col justify-between'
            >
              <div className='space-y-2'>
                <div className='flex items-center justify-between gap-3'>
                  <span className='px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-primary-purple/10 text-primary-purple'>
                    {item.type}
                  </span>

                  <div className='flex items-center gap-3'>
                    <span className='text-xs text-gray-400 flex items-center gap-1'>
                      <Calendar size={12} />

                      {item.due_date
                        ? new Date(
                            item.due_date,
                          ).toLocaleDateString()
                        : 'No due date'}
                    </span>

                    <button
                      onClick={() =>
                        handleOpenEditModal(item)
                      }
                      className='text-gray-400 hover:text-primary-purple transition cursor-pointer'
                      title='Edit Assessment'
                    >
                      <Edit3 size={14} />
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteAssessment(
                          item.id,
                        )
                      }
                      disabled={
                        deletingAssessmentId ===
                        item.id
                      }
                      className='text-gray-400 hover:text-red-500 transition cursor-pointer disabled:opacity-50'
                      title='Delete Assessment'
                    >
                      {deletingAssessmentId ===
                      item.id ? (
                        <Loader2
                          size={14}
                          className='animate-spin'
                        />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </div>
                </div>

                <h3 className='text-lg font-bold text-dark dark:text-white'>
                  {item.title}
                </h3>

                <p className='text-xs text-gray-500 line-clamp-2'>
                  {item.description}
                </p>
              </div>

              <div className='flex items-center justify-between gap-3 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500'>
                <span>
                  Total Marks:{' '}
                  <strong>
                    {item.total_marks}
                  </strong>
                </span>

                <span>
                  Weight:{' '}
                  <strong>
                    {item.weight}x
                  </strong>
                </span>

                <button
                  onClick={() =>
                    handleViewSubmissions(item)
                  }
                  className='px-3.5 py-2 rounded-xl bg-primary-purple text-white font-medium hover:opacity-90 transition cursor-pointer'
                >
                  View Submissions
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================
          CREATE / EDIT MODAL
      ======================================== */}

      {isModalOpen && (
        <div className='fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn'>
          <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl'>
            <div className='flex justify-between items-center border-b pb-4 dark:border-gray-800'>
              <h3 className='text-lg font-bold text-dark dark:text-white'>
                {editingAssessmentId !== null
                  ? 'Edit Assessment'
                  : 'Create New Assessment'}
              </h3>

              <button
                onClick={() =>
                  setIsModalOpen(false)
                }
                className='text-gray-400 hover:text-gray-200 cursor-pointer'
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSaveAssessment}
              className='space-y-4'
            >
              <div>
                <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                  Title
                </label>

                <input
                  type='text'
                  required
                  placeholder='Assessment title'
                  className={inputClass}
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                />
              </div>

              <div>
                <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                  Description
                </label>

                <textarea
                  required
                  placeholder='Instructions and requirements...'
                  className={`${inputClass} h-24`}
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                    Type
                  </label>

                  <select
                    required
                    className={inputClass}
                    value={type}
                    onChange={(e) =>
                      setType(e.target.value)
                    }
                  >
                    <option value=''>
                      Select type
                    </option>

                    <option value='assignment'>
                      Assignment
                    </option>

                    <option value='quiz'>
                      Quiz
                    </option>

                    <option value='project'>
                      Project
                    </option>
                  </select>
                </div>

                <div>
                  <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                    Total Marks
                  </label>

                  <input
                    type='number'
                    required
                    min={1}
                    className={inputClass}
                    value={totalMarks}
                    onChange={(e) =>
                      setTotalMarks(
                        e.target.value,
                      )
                    }
                  />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                    Weight Multiplier
                  </label>

                  <input
                    type='number'
                    step='0.1'
                    min='0'
                    required
                    className={inputClass}
                    value={weight}
                    onChange={(e) =>
                      setWeight(e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                    Due Date
                  </label>

                  <input
                    type='datetime-local'
                    required
                    className={inputClass}
                    value={dueDate}
                    onChange={(e) =>
                      setDueDate(e.target.value)
                    }
                  />
                </div>
              </div>

              <div className='flex justify-end gap-3 pt-4 border-t dark:border-gray-800'>
                <button
                  type='button'
                  onClick={() =>
                    setIsModalOpen(false)
                  }
                  className='px-4 py-2 rounded-xl text-xs font-semibold border border-gray-300 dark:border-gray-700 text-gray-600 cursor-pointer'
                >
                  Cancel
                </button>

                <button
                  type='submit'
                  disabled={isSavingAssessment}
                  className='px-5 py-2 rounded-xl text-xs font-semibold bg-primary-purple text-white hover:opacity-90 cursor-pointer disabled:opacity-50 flex items-center gap-2'
                >
                  {isSavingAssessment && (
                    <Loader2
                      size={14}
                      className='animate-spin'
                    />
                  )}

                  {editingAssessmentId !== null
                    ? 'Save Changes'
                    : 'Publish Assessment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================
          SUBMISSIONS MODAL
      ======================================== */}

      {selectedAssessmentId !== null && (
        <div className='fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn'>
          <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[80vh] overflow-y-auto'>
            <div className='flex justify-between items-center border-b pb-4 dark:border-gray-800'>
              <div>
                <h3 className='text-lg font-bold text-dark dark:text-white'>
                  Student Submissions
                </h3>

                {selectedAssessment && (
                  <p className='text-xs text-gray-500 mt-1'>
                    {selectedAssessment.title}
                  </p>
                )}
              </div>

              <button
                onClick={closeSubmissions}
                className='text-gray-400 hover:text-gray-200 cursor-pointer'
              >
                <X size={20} />
              </button>
            </div>

            {isLoadingSubs ? (
              <div className='py-12 flex justify-center'>
                <Loader2 className='animate-spin text-primary-purple' />
              </div>
            ) : submissions.length === 0 ? (
              <p className='text-xs text-gray-500 text-center py-8'>
                No submissions found for this assessment.
              </p>
            ) : (
              <div className='space-y-3'>
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className='p-4 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4'
                  >
                    <div>
                      <h4 className='text-sm font-bold text-dark dark:text-white'>
                        {sub.student_name ||
                          `Student ID: ${sub.student_id}`}
                      </h4>

                      <p className='text-xs text-gray-500'>
                        Status:{' '}
                        <span className='font-semibold text-primary-purple uppercase'>
                          {sub.status ||
                            'Pending'}
                        </span>

                        {sub.score !==
                          undefined &&
                          selectedAssessment && (
                            <>
                              {' '}
                              • Score:{' '}
                              {sub.score}/
                              {
                                selectedAssessment.total_marks
                              }
                            </>
                          )}
                      </p>

                      {sub.submitted_at && (
                        <p className='text-[11px] text-gray-400 mt-1'>
                          Submitted:{' '}
                          {new Date(
                            sub.submitted_at,
                          ).toLocaleString()}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        handleOpenGrading(sub)
                      }
                      className='shrink-0 px-3 py-1.5 rounded-lg bg-primary-purple/10 text-primary-purple font-semibold text-xs hover:bg-primary-purple/20 transition cursor-pointer flex items-center gap-1'
                    >
                      <Award size={14} />

                      {sub.score !==
                      undefined
                        ? 'Edit Grade'
                        : 'Grade Submission'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================
          GRADE SUBMISSION MODAL
      ======================================== */}

      {gradingSubId !== null && (
        <div className='fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn'>
          <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl'>
            <div className='flex justify-between items-center border-b pb-3 dark:border-gray-800'>
              <div>
                <h3 className='text-base font-bold text-dark dark:text-white'>
                  Grade Student Submission
                </h3>

                {selectedAssessment && (
                  <p className='text-xs text-gray-500 mt-1'>
                    Maximum score:{' '}
                    {
                      selectedAssessment.total_marks
                    }
                  </p>
                )}
              </div>

              <button
                onClick={() =>
                  setGradingSubId(null)
                }
                className='text-gray-400 hover:text-gray-200 cursor-pointer'
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleGradeSubmission}
              className='space-y-4'
            >
              <div>
                <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                  Score
                  {selectedAssessment &&
                    ` (Out of ${selectedAssessment.total_marks})`}
                </label>

                <input
                  type='number'
                  required
                  min={0}
                  max={
                    selectedAssessment?.total_marks
                  }
                  className={inputClass}
                  value={score}
                  onChange={(e) =>
                    setScore(e.target.value)
                  }
                />
              </div>

              <div>
                <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                  Feedback / Review Notes
                </label>

                <textarea
                  required
                  placeholder='Enter feedback for the student...'
                  className={`${inputClass} h-24`}
                  value={feedback}
                  onChange={(e) =>
                    setFeedback(e.target.value)
                  }
                />
              </div>

              <div className='flex justify-end gap-2 pt-2'>
                <button
                  type='button'
                  onClick={() =>
                    setGradingSubId(null)
                  }
                  className='px-4 py-2 rounded-xl text-xs font-semibold border border-gray-300 dark:border-gray-700 text-gray-600 cursor-pointer'
                >
                  Cancel
                </button>

                <button
                  type='submit'
                  disabled={isGrading}
                  className='px-5 py-2 rounded-xl text-xs font-semibold bg-primary-purple text-white hover:opacity-90 cursor-pointer disabled:opacity-50 flex items-center gap-2'
                >
                  {isGrading && (
                    <Loader2
                      size={14}
                      className='animate-spin'
                    />
                  )}

                  Submit Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================
          ALERT MODAL
      ======================================== */}

      {alertModal.isOpen && (
        <div className='fixed inset-0 z-70 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn'>
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

            <p className='text-xs text-gray-500'>
              {alertModal.message}
            </p>

            <button
              onClick={() =>
                setAlertModal((prev) => ({
                  ...prev,
                  isOpen: false,
                }))
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