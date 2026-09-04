// //app/student/quizzes/page.tsx
// 'use client'

// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { motion } from 'framer-motion'
// import { Search, BookOpen, Clock, CheckCircle2, Award, ArrowRight, Loader2, Filter, Ban, CalendarX, History } from 'lucide-react'
// import { apiClient } from '@/services/api'
// import { QuestionBank, QuizAttemptResult } from './types'

// export default function StudentQuizzesPage() {
//   const router = useRouter()
//   const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([])
//   const [loading, setLoading] = useState<boolean>(true)
//   const [error, setError] = useState<string | null>(null)
  
//   // Filtering states
//   const [searchQuery, setSearchQuery] = useState<string>('')
//   const [selectedCourse, setSelectedCourse] = useState<string>('ALL')
//   const [quizAttemptsMap, setQuizAttemptsMap] = useState<Record<string, number>>({})
//   const [quizHistory, setQuizHistory] = useState<QuizAttemptResult[]>([])

//   useEffect(() => {
//     fetchQuizzes()
//   }, [selectedCourse, searchQuery])

//   const fetchQuizzes = async () => {
//     try {
//       setLoading(true)
//       setError(null)

//       // Fetch approved question banks for students
//       const response = await apiClient.getQuestionBanks({
//         status: 'APPROVED',
//         search: searchQuery || undefined,
//         courseId: selectedCourse !== 'ALL' ? selectedCourse : undefined,
//       })

//       const data = Array.isArray(response) ? response : response?.data || response?.questionBanks || []
//       setQuestionBanks(data as QuestionBank[])

//       // Load local attempt history to evaluate limits and display scores
//       try {
//         const history: QuizAttemptResult[] = JSON.parse(localStorage.getItem('denskill_quiz_history') || '[]')
//         setQuizHistory(history)
        
//         const counts: Record<string, number> = {}
//         history.forEach((attempt) => {
//           const id = String(attempt.questionBankId)
//           counts[id] = (counts[id] || 0) + 1
//         })
//         setQuizAttemptsMap(counts)
//       } catch (e) {
//         console.error('Failed to parse quiz history', e)
//       }

//     } catch (err: any) {
//       setError(err.message || 'Failed to load available quizzes.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const formatExpiryDate = (dateString?: string) => {
//     if (!dateString) return null
//     const date = new Date(dateString)
//     return isNaN(date.getTime()) ? null : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
//   }

//   const formatDateString = (dateStr?: string) => {
//     if (!dateStr) return 'Recent'
//     const date = new Date(dateStr)
//     return isNaN(date.getTime()) ? dateStr : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
//   }

//   return (
//     <div className='min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 lg:p-10 space-y-8 sm:space-y-10'>
//       {/* Header Banner */}
//       <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800'>
//         <div>
//           <h1 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2'>
//             <Award className='text-primary-purple shrink-0' size={26} />
//             Programming Quizzes & Assessments
//           </h1>
//           <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1'>
//             Test your programming knowledge, practice coding challenges, and track your progress.
//           </p>
//         </div>
//       </div>

//       {/* Filter & Search Bar */}
//       <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between'>
//         <div className='relative w-full sm:w-80 md:w-96'>
//           <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
//           <input
//             type='text'
//             placeholder='Search quiz title...'
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className='w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-purple dark:text-white'
//           />
//         </div>

//         <div className='flex items-center gap-2 w-full sm:w-auto'>
//           <Filter size={16} className='text-gray-400 shrink-0' />
//           <select
//             value={selectedCourse}
//             onChange={(e) => setSelectedCourse(e.target.value)}
//             className='w-full sm:w-auto px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-purple dark:text-white'
//           >
//             <option value='ALL'>All Courses / Tracks</option>
//             <option value='FULLSTACK_MERN'>Fullstack MERN</option>
//             <option value='MOBILE_FLUTTER'>Mobile Flutter</option>
//             <option value='FULLSTACK_JS'>Fullstack JavaScript</option>
//           </select>
//         </div>
//       </div>

//       {/* Main Content Grid */}
//       {loading ? (
//         <div className='flex justify-center items-center py-20'>
//           <Loader2 className='animate-spin text-primary-purple' size={40} />
//         </div>
//       ) : error ? (
//         <div className='bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 p-4 rounded-xl text-center text-sm'>
//           {error}
//         </div>
//       ) : questionBanks.length === 0 ? (
//         <div className='text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8'>
//           <BookOpen className='mx-auto text-gray-300 dark:text-gray-700 mb-3' size={48} />
//           <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-200'>No quizzes found</h3>
//           <p className='text-sm text-gray-500 mt-1'>Check back later or adjust your search filter.</p>
//         </div>
//       ) : (
//         <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6'>
//           {questionBanks.map((bank, index) => {
//             const b = bank as any
//             const maxAttempts = b.max_attempts || b.allowedAttempts || 3
//             const attemptsTaken = quizAttemptsMap[bank.id] || 0
//             const isLimitExceeded = attemptsTaken >= maxAttempts

//             const expiryDateStr = b.expires_at || b.dueDate || b.closeDate
//             const isExpired = expiryDateStr ? new Date(expiryDateStr).getTime() < Date.now() : false

//             const isLocked = isLimitExceeded || isExpired

//             return (
//               <motion.div
//                 key={bank.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.05 }}
//                 className={`bg-white dark:bg-gray-900 rounded-2xl border p-5 sm:p-6 shadow-sm flex flex-col justify-between group transition-all ${
//                   isLocked 
//                     ? 'border-gray-200 dark:border-gray-800 opacity-80 bg-gray-50/50 dark:bg-gray-900/50' 
//                     : 'border-gray-100 dark:border-gray-800 hover:shadow-md'
//                 }`}
//               >
//                 <div className='space-y-3'>
//                   <div className='flex items-center justify-between gap-2 flex-wrap'>
//                     <span className='px-2.5 py-0.5 bg-purple-50 dark:bg-purple-950/50 text-primary-purple text-xs font-semibold rounded-full'>
//                       {bank.courseId || 'General'}
//                     </span>
                    
//                     {isExpired ? (
//                       <span className='text-xs text-red-500 flex items-center gap-1 font-medium bg-red-50 dark:bg-red-950/50 px-2 py-0.5 rounded-full'>
//                         <CalendarX size={12} /> Expired
//                       </span>
//                     ) : isLimitExceeded ? (
//                       <span className='text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 font-medium bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full'>
//                         <Ban size={12} /> Limit Reached ({attemptsTaken}/{maxAttempts})
//                       </span>
//                     ) : (
//                       <span className='text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1'>
//                         <Clock size={14} /> {attemptsTaken > 0 ? `Attempt ${attemptsTaken}/${maxAttempts}` : `${maxAttempts} attempts allowed`}
//                       </span>
//                     )}
//                   </div>

//                   <h3 className='text-base sm:text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-purple transition-colors'>
//                     {bank.title}
//                   </h3>

//                   <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2'>
//                     {bank.description || 'Test your coding skills with curated assessment questions.'}
//                   </p>

//                   {expiryDateStr && !isExpired && (
//                     <p className='text-xs text-gray-400 dark:text-gray-500 pt-1'>
//                       Due by: <span className='font-medium text-gray-600 dark:text-gray-300'>{formatExpiryDate(expiryDateStr)}</span>
//                     </p>
//                   )}
//                 </div>

//                 <div className='pt-5 mt-5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3'>
//                   <span className='text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5 shrink-0'>
//                     <CheckCircle2 size={16} className='text-emerald-500' />
//                     {bank.questionCount || bank.questions?.length || 'Multiple'} Questions
//                   </span>

//                   <button
//                     onClick={() => router.push(`/student/quizzes/${bank.id}`)}
//                     disabled={isLocked}
//                     className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all shadow-sm ${
//                       isLocked
//                         ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed shadow-none'
//                         : 'bg-primary-purple hover:bg-primary-purple/90 text-white shadow-primary-purple/20 cursor-pointer'
//                     }`}
//                   >
//                     {isExpired ? 'Expired' : isLimitExceeded ? 'Completed' : 'Start Quiz'} 
//                     {!isLocked && <ArrowRight size={15} />}
//                   </button>
//                 </div>
//               </motion.div>
//             )
//           })}
//         </div>
//       )}

//       {/* ========================================== */}
//       {/* COMPLETED QUIZZES & SCORES HISTORY SECTION */}
//       {/* ========================================== */}
//       <div className='pt-6 border-t border-gray-200 dark:border-gray-800 space-y-4'>
//         <div className='flex items-center gap-2'>
//           <History className='text-primary-purple' size={22} />
//           <h2 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-white'>
//             Your Quiz History & Scores
//           </h2>
//         </div>

//         {quizHistory.length === 0 ? (
//           <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 text-center text-gray-500 dark:text-gray-400 text-sm'>
//             You haven't completed any quizzes yet. Your scores and attempt details will appear here once submitted.
//           </div>
//         ) : (
//           <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm'>
//             <div className='overflow-x-auto'>
//               <table className='w-full text-left border-collapse'>
//                 <thead>
//                   <tr className='bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 text-xs uppercase text-gray-400 font-semibold'>
//                     <th className='p-4 sm:px-6'>Quiz Title</th>
//                     <th className='p-4 sm:px-6'>Score</th>
//                     <th className='p-4 sm:px-6'>Percentage</th>
//                     <th className='p-4 sm:px-6'>Time Spent</th>
//                     <th className='p-4 sm:px-6'>Completed On</th>
//                   </tr>
//                 </thead>
//                 <tbody className='divide-y divide-gray-100 dark:divide-gray-800 text-sm'>
//                   {quizHistory.map((item, idx) => (
//                     <tr key={idx} className='hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors'>
//                       <td className='p-4 sm:px-6 font-semibold text-gray-900 dark:text-white'>
//                         {item.title}
//                       </td>
//                       <td className='p-4 sm:px-6 text-gray-700 dark:text-gray-300 font-medium'>
//                         <span className='text-emerald-600 dark:text-emerald-400 font-bold'>{item.correctCount}</span> / {item.totalQuestions} correct
//                       </td>
//                       <td className='p-4 sm:px-6'>
//                         <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
//                           item.percentage >= 70 
//                             ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400' 
//                             : item.percentage >= 40 
//                             ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400' 
//                             : 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400'
//                         }`}>
//                           {item.percentage}%
//                         </span>
//                       </td>
//                       <td className='p-4 sm:px-6 text-gray-500 dark:text-gray-400 text-xs'>
//                         {Math.floor(item.timeSpentSeconds / 60)}m {item.timeSpentSeconds % 60}s
//                       </td>
//                       <td className='p-4 sm:px-6 text-gray-500 dark:text-gray-400 text-xs'>
//                         {formatDateString(item.completedAt)}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }





// app/student/quizzes/page.tsx
// app/student/quizzes/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, BookOpen, Clock, CheckCircle2, Award, ArrowRight, Loader2, Filter, Ban, CalendarX, History, X, CheckCircle, XCircle, AlertCircle, Timer } from 'lucide-react'
import { apiClient } from '@/services/api'
import { QuestionBank, QuizAttemptResult } from './types'

export default function StudentQuizzesPage() {
  const router = useRouter()
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isInitialMount, setIsInitialMount] = useState<boolean>(true)
  
  // Filtering states
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedCourse, setSelectedCourse] = useState<string>('ALL')
  const [quizAttemptsMap, setQuizAttemptsMap] = useState<Record<string, number>>({})
  const [quizHistory, setQuizHistory] = useState<QuizAttemptResult[]>([])

  // Quiz attempt review modal states
  const [selectedAttempt, setSelectedAttempt] = useState<QuizAttemptResult | null>(null)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false)

  // Re-fetch list whenever search query or course filter changes
  useEffect(() => {
    fetchQuizzes()
  }, [selectedCourse, searchQuery])

  // Retrieves available quizzes from backend and syncs local localStorage attempt history
  const fetchQuizzes = async () => {
    try {
      // Only show the heavy loading spinner if we don't have data yet 
      // to prevent flashing or clearing content during background re-fetches
      if (questionBanks.length === 0) {
        setLoading(true)
      }
      setError(null)

      // Fetch approved question banks for students based on active filters
      const response = await apiClient.getQuestionBanks({
        status: 'APPROVED',
        search: searchQuery || undefined,
        courseId: selectedCourse !== 'ALL' ? selectedCourse : undefined,
      })

      const data = Array.isArray(response) ? response : response?.data || response?.questionBanks || []
      
      // Safety guard: Prevent blanking out the screen if a background fetch returns empty unexpectedly
      if (data.length > 0 || isInitialMount) {
        setQuestionBanks(data as QuestionBank[])
        setIsInitialMount(false)
      }

      // Load local attempt history to evaluate limits and display scores
      try {
        const history: QuizAttemptResult[] = JSON.parse(localStorage.getItem('denskill_quiz_history') || '[]')
        setQuizHistory(history)
        
        const counts: Record<string, number> = {}
        history.forEach((attempt) => {
          const id = String(attempt.questionBankId)
          counts[id] = (counts[id] || 0) + 1
        })
        setQuizAttemptsMap(counts)
      } catch (e) {
        console.error('Failed to parse quiz history', e)
      }

    } catch (err: any) {
      if (questionBanks.length === 0) {
        setError(err.message || 'Failed to load available quizzes.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Formats expiration dates safely for human readability
  const formatExpiryDate = (dateString?: string) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? null : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  // Formats general date timestamps for review tables
  const formatDateString = (dateStr?: string) => {
    if (!dateStr) return 'Recent'
    const date = new Date(dateStr)
    return isNaN(date.getTime()) ? dateStr : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  // Opens the review modal for a specific past quiz attempt
  const handleOpenReview = (attempt: QuizAttemptResult) => {
    setSelectedAttempt(attempt)
    setIsReviewModalOpen(true)
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 lg:p-10 space-y-8 sm:space-y-10'>
      {/* Header Banner */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800'>
        <div>
          <h1 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2'>
            <Award className='text-primary-purple shrink-0' size={26} />
            Programming Quizzes & Assessments
          </h1>
          <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1'>
            Test your programming knowledge, practice coding challenges, and track your progress.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between'>
        <div className='relative w-full sm:w-80 md:w-96'>
          <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
          <input
            type='text'
            placeholder='Search quiz title...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-purple dark:text-white'
          />
        </div>

        <div className='flex items-center gap-2 w-full sm:w-auto'>
          <Filter size={16} className='text-gray-400 shrink-0' />
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className='w-full sm:w-auto px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-purple dark:text-white'
          >
            <option value='ALL'>All Courses / Tracks</option>
            <option value='FULLSTACK_MERN'>Fullstack MERN</option>
            <option value='MOBILE_FLUTTER'>Mobile Flutter</option>
            <option value='FULLSTACK_JS'>Fullstack JavaScript</option>
          </select>
        </div>
      </div>

      {/* Main Content Grid */}
      {loading ? (
        <div className='flex justify-center items-center py-20'>
          <Loader2 className='animate-spin text-primary-purple' size={40} />
        </div>
      ) : error ? (
        <div className='bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 p-4 rounded-xl text-center text-sm'>
          {error}
        </div>
      ) : questionBanks.length === 0 ? (
        <div className='text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8'>
          <BookOpen className='mx-auto text-gray-300 dark:text-gray-700 mb-3' size={48} />
          <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-200'>No quizzes found</h3>
          <p className='text-sm text-gray-500 mt-1'>Check back later or adjust your search filter.</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6'>
          {questionBanks.map((bank, index) => {
            const b = bank as any
            const maxAttempts = b.max_attempts || b.allowedAttempts || 3
            const attemptsTaken = quizAttemptsMap[bank.id] || 0
            const isLimitExceeded = attemptsTaken >= maxAttempts

            const expiryDateStr = b.expires_at || b.dueDate || b.closeDate
            const isExpired = expiryDateStr ? new Date(expiryDateStr).getTime() < Date.now() : false

            const isLocked = isLimitExceeded || isExpired

            const rawQuestionCount = b.questionCount || b.questions?.length || b.totalQuestions || 0
            const questionCount = typeof rawQuestionCount === 'number' ? rawQuestionCount : (parseInt(rawQuestionCount, 10) || 'Multiple')

            const durationMinutes = b.durationMinutes || b.duration || (b.durationSeconds ? Math.ceil(b.durationSeconds / 60) : null)

            return (
              <motion.div
                key={bank.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white dark:bg-gray-900 rounded-2xl border p-5 sm:p-6 shadow-sm flex flex-col justify-between group transition-all ${
                  isLocked 
                    ? 'border-gray-200 dark:border-gray-800 opacity-80 bg-gray-50/50 dark:bg-gray-900/50' 
                    : 'border-gray-100 dark:border-gray-800 hover:shadow-md'
                }`}
              >
                <div className='space-y-3'>
                  <div className='flex items-center justify-between gap-2 flex-wrap'>
                    <span className='px-2.5 py-0.5 bg-purple-50 dark:bg-purple-950/50 text-primary-purple text-xs font-semibold rounded-full'>
                      {bank.courseId || 'General'}
                    </span>
                    
                    {isExpired ? (
                      <span className='text-xs text-red-500 flex items-center gap-1 font-medium bg-red-50 dark:bg-red-950/50 px-2 py-0.5 rounded-full'>
                        <CalendarX size={12} /> Expired
                      </span>
                    ) : isLimitExceeded ? (
                      <span className='text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 font-medium bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full'>
                        <Ban size={12} /> Limit Reached ({attemptsTaken}/{maxAttempts})
                      </span>
                    ) : (
                      <span className='text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1'>
                        <Clock size={14} /> {attemptsTaken > 0 ? `Attempt ${attemptsTaken}/${maxAttempts}` : `${maxAttempts} attempts allowed`}
                      </span>
                    )}
                  </div>

                  <h3 className='text-base sm:text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-purple transition-colors'>
                    {bank.title}
                  </h3>

                  <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2'>
                    {bank.description || 'Test your coding skills with curated assessment questions.'}
                  </p>

                  <div className='flex items-center gap-4 pt-2 text-xs font-medium text-gray-600 dark:text-gray-300'>
                    <span className='flex items-center gap-1.5'>
                      <CheckCircle2 size={15} className='text-emerald-500' />
                      {questionCount} Questions
                    </span>
                    {durationMinutes && (
                      <span className='flex items-center gap-1.5'>
                        <Timer size={15} className='text-primary-purple' />
                        {durationMinutes} mins
                      </span>
                    )}
                  </div>

                  {expiryDateStr && !isExpired && (
                    <p className='text-xs text-gray-400 dark:text-gray-500 pt-1'>
                      Due by: <span className='font-medium text-gray-600 dark:text-gray-300'>{formatExpiryDate(expiryDateStr)}</span>
                    </p>
                  )}
                </div>

                <div className='pt-5 mt-5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3'>
                  <button
                    onClick={() => router.push(`/student/quizzes/${bank.id}`)}
                    disabled={isLocked}
                    className={`w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all shadow-sm ${
                      isLocked
                        ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed shadow-none'
                        : 'bg-primary-purple hover:bg-primary-purple/90 text-white shadow-primary-purple/20 cursor-pointer'
                    }`}
                  >
                    {isExpired ? 'Expired' : isLimitExceeded ? 'Completed' : 'Start Quiz'} 
                    {!isLocked && <ArrowRight size={15} />}
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* ========================================== */}
      {/* COMPLETED QUIZZES & SCORES HISTORY SECTION */}
      {/* ========================================== */}
      <div className='pt-6 border-t border-gray-200 dark:border-gray-800 space-y-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <History className='text-primary-purple' size={22} />
            <h2 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-white'>
              Your Quiz History & Scores
            </h2>
          </div>
          {quizHistory.length > 0 && (
            <p className='text-xs text-gray-400 dark:text-gray-500'>Click any row to review questions and answers</p>
          )}
        </div>

        {quizHistory.length === 0 ? (
          <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 text-center text-gray-500 dark:text-gray-400 text-sm'>
            You haven't completed any quizzes yet. Your scores and attempt details will appear here once submitted.
          </div>
        ) : (
          <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm'>
            <div className='overflow-x-auto'>
              <table className='w-full text-left border-collapse'>
                <thead>
                  <tr className='bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 text-xs uppercase text-gray-400 font-semibold'>
                    <th className='p-4 sm:px-6'>Quiz Title</th>
                    <th className='p-4 sm:px-6'>Score</th>
                    <th className='p-4 sm:px-6'>Percentage</th>
                    <th className='p-4 sm:px-6'>Time Spent</th>
                    <th className='p-4 sm:px-6'>Completed On</th>
                    <th className='p-4 sm:px-6 text-right'>Action</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-100 dark:divide-gray-800 text-sm'>
                  {quizHistory.map((item, idx) => (
                    <tr 
                      key={idx} 
                      onClick={() => handleOpenReview(item)}
                      className='hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors cursor-pointer group'
                    >
                      <td className='p-4 sm:px-6 font-semibold text-gray-900 dark:text-white group-hover:text-primary-purple transition-colors'>
                        {item.title}
                      </td>
                      <td className='p-4 sm:px-6 text-gray-700 dark:text-gray-300 font-medium'>
                        <span className='text-emerald-600 dark:text-emerald-400 font-bold'>{item.correctCount}</span> / {item.totalQuestions} correct
                      </td>
                      <td className='p-4 sm:px-6'>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          item.percentage >= 70 
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400' 
                            : item.percentage >= 40 
                            ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400' 
                            : 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400'
                        }`}>
                          {item.percentage}%
                        </span>
                      </td>
                      <td className='p-4 sm:px-6 text-gray-500 dark:text-gray-400 text-xs'>
                        {Math.floor(item.timeSpentSeconds / 60)}m {item.timeSpentSeconds % 60}s
                      </td>
                      <td className='p-4 sm:px-6 text-gray-500 dark:text-gray-400 text-xs'>
                        {formatDateString(item.completedAt)}
                      </td>
                      <td className='p-4 sm:px-6 text-right'>
                        <button className='text-xs font-medium text-primary-purple group-hover:underline'>
                          Review Answers →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* ATTEMPT REVIEW DETAILS MODAL               */}
      {/* ========================================== */}
      <AnimatePresence>
        {isReviewModalOpen && selectedAttempt && (
          <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm'>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className='bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl'
            >
              {/* Modal Header */}
              <div className='p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/20'>
                <div>
                  <span className='text-xs font-semibold px-2.5 py-1 bg-purple-50 dark:bg-purple-950/50 text-primary-purple rounded-full'>
                    Attempt Review
                  </span>
                  <h2 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-white mt-1'>
                    {selectedAttempt.title}
                  </h2>
                  <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
                    Completed on {formatDateString(selectedAttempt.completedAt)} • Score: <strong className='text-emerald-600 dark:text-emerald-400'>{selectedAttempt.correctCount}/{selectedAttempt.totalQuestions} ({selectedAttempt.percentage}%)</strong>
                  </p>
                </div>
                <button 
                  onClick={() => setIsReviewModalOpen(false)}
                  className='p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Scrollable Content (Questions Breakdown) */}
              <div className='p-6 overflow-y-auto space-y-6 flex-1'>
                {selectedAttempt.answers && selectedAttempt.answers.length > 0 ? (
                  selectedAttempt.answers.map((ans: any, qIdx: number) => {
                    // Fully resolved fallback logic with strict comparison (===)
                    const isCorrect = ans.isCorrect ?? (ans.selectedOption === ans.correctAnswer)

                    return (
                      <div 
                        key={qIdx}
                        className={`p-5 rounded-2xl border transition-all space-y-3 ${
                          isCorrect 
                            ? 'bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/40' 
                            : 'bg-red-50/30 dark:bg-red-950/10 border-red-200 dark:border-red-900/40'
                        }`}
                      >
                        <div className='flex items-start justify-between gap-3'>
                          <div className='flex items-start gap-2.5'>
                            <span className='flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-300 shrink-0 mt-0.5'>
                              {qIdx + 1}
                            </span>
                            <h4 className='text-sm sm:text-base font-semibold text-gray-900 dark:text-white'>
                              {ans.questionText || `Question #${qIdx + 1}`}
                            </h4>
                          </div>

                          {isCorrect ? (
                            <span className='flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full shrink-0'>
                              <CheckCircle size={14} /> Correct
                            </span>
                          ) : (
                            <span className='flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 px-2.5 py-1 rounded-full shrink-0'>
                              <XCircle size={14} /> Incorrect
                            </span>
                          )}
                        </div>

                        {/* Options List with strict array guard */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2'>
                          {Array.isArray(ans.options) && ans.options.map((opt: string, optIdx: number) => {
                            const isUserSelection = opt === ans.selectedOption || optIdx === ans.selectedOptionIndex
                            const isTheCorrectAnswer = opt === ans.correctAnswer || optIdx === ans.correctOptionIndex || opt === ans.correctOption

                            let optionStyling = 'bg-white dark:bg-gray-800/60 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300'
                            
                            if (isTheCorrectAnswer) {
                              optionStyling = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-medium'
                            } else if (isUserSelection && !isCorrect) {
                              optionStyling = 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-900 dark:text-red-200 font-medium line-through'
                            }

                            return (
                              <div 
                                key={optIdx} 
                                className={`p-3 rounded-xl border text-xs sm:text-sm flex items-center justify-between gap-2 ${optionStyling}`}
                              >
                                <span>{opt}</span>
                                {isUserSelection && (
                                  <span className='text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 shrink-0'>
                                    You picked
                                  </span>
                                )}
                              </div>
                            )
                          })}
                        </div>

                        {!ans.options && (
                          <div className='text-xs space-y-1 pt-1'>
                            <p className='text-gray-600 dark:text-gray-400'>
                              Your Answer: <span className='font-semibold text-gray-900 dark:text-white'>{String(ans.selectedOption || 'No answer provided')}</span>
                            </p>
                            {!isCorrect && (
                              <p className='text-emerald-600 dark:text-emerald-400'>
                                Correct Answer: <span className='font-semibold'>{String(ans.correctAnswer)}</span>
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })
                ) : (
                  <div className='text-center py-12 text-gray-500 dark:text-gray-400 text-sm'>
                    <AlertCircle className='mx-auto mb-2 text-gray-400' size={32} />
                    Detailed question data was not stored for this legacy attempt. Future completed quizzes will save full review analytics here.
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className='p-4 sm:p-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 flex justify-end'>
                <button
                  onClick={() => setIsReviewModalOpen(false)}
                  className='px-5 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl text-xs sm:text-sm font-medium transition-colors'
                >
                  Close Review
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}