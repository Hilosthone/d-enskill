// //app/student/quizzes/[id]/page.tsx
// 'use client'

// import { useEffect, useState } from 'react'
// import { useParams, useRouter } from 'next/navigation'
// import { motion } from 'framer-motion'
// import { 
//   ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, 
//   Clock, Award, RotateCcw, Loader2, Ban, CalendarX 
// } from 'lucide-react'
// import { apiClient } from '@/services/api'
// import { QuestionBank, QuizAttemptResult, Question } from '../types'

// export default function TakeQuizPage() {
//   const params = useParams()
//   const router = useRouter()
//   const quizId = params.id as string

//   const [quiz, setQuiz] = useState<QuestionBank | null>(null)
//   const [questions, setQuestions] = useState<Question[]>([])
//   const [loading, setLoading] = useState<boolean>(true)
//   const [error, setError] = useState<string | null>(null)

//   // Validation States
//   const [isExpired, setIsExpired] = useState<boolean>(false)
//   const [attemptsExceeded, setAttemptsExceeded] = useState<boolean>(false)
//   const [pastAttemptsCount, setPastAttemptsCount] = useState<number>(0)

//   // Quiz progression state
//   const [currentIndex, setCurrentIndex] = useState<number>(0)
//   const [userAnswers, setUserAnswers] = useState<Record<string | number, number | string>>({})
//   const [submitting, setSubmitting] = useState<boolean>(false)
//   const [result, setResult] = useState<QuizAttemptResult | null>(null)

//   // Timer state (elapsed seconds)
//   const [secondsElapsed, setSecondsElapsed] = useState<number>(0)

//   useEffect(() => {
//     if (quizId) {
//       loadQuizAndValidations()
//     }
//   }, [quizId])

//   useEffect(() => {
//     if (result || isExpired || attemptsExceeded) return
//     const timer = setInterval(() => {
//       setSecondsElapsed((prev) => prev + 1)
//     }, 1000)
//     return () => clearInterval(timer)
//   }, [result, isExpired, attemptsExceeded])

//   const loadQuizAndValidations = async () => {
//     try {
//       setLoading(true)
//       setError(null)

//       // 1. Fetch Question Bank details
//       const response = await apiClient.getQuestionBankById(quizId)
//       const bankData = response?.questionBank || response?.data || response
//       setQuiz(bankData as QuestionBank)

//       // Cast bankData to any to safely check alternative property naming conventions
//       const rawQuiz = bankData as any

//       // 2. Check Expiration Date/Time
//       const expiryDate = rawQuiz?.expires_at || rawQuiz?.dueDate || rawQuiz?.closeDate
//       if (expiryDate && new Date(expiryDate).getTime() < Date.now()) {
//         setIsExpired(true)
//         setLoading(false)
//         return
//       }

//       // 3. Check Attempt Limits
//       const maxAllowedAttempts = rawQuiz?.max_attempts || rawQuiz?.allowedAttempts || 3
//       const existingHistory = JSON.parse(localStorage.getItem('denskill_quiz_history') || '[]')
//       const quizAttempts = existingHistory.filter((item: any) => String(item.questionBankId) === String(quizId))
      
//       setPastAttemptsCount(quizAttempts.length)
//       if (quizAttempts.length >= maxAllowedAttempts) {
//         setAttemptsExceeded(true)
//         setLoading(false)
//         return
//       }

//       // 4. Extract questions safely with fallback handling
//       let extractedQuestions: Question[] = []
//       if (Array.isArray(rawQuiz?.questions)) {
//         extractedQuestions = rawQuiz.questions
//       } else if (Array.isArray(response?.questions)) {
//         extractedQuestions = response.questions
//       } else {
//         try {
//           const qResponse = await apiClient.getQuestions({ question_bank_id: quizId })
//           extractedQuestions = Array.isArray(qResponse) ? qResponse : qResponse?.data || qResponse?.questions || []
//         } catch (innerErr) {
//           console.warn('Could not fetch separate questions endpoint', innerErr)
//         }
//       }

//       setQuestions(extractedQuestions as Question[])
//     } catch (err: any) {
//       setError(err.message || 'Failed to load quiz.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleSelectOption = (questionId: number | string, optionId: number | string) => {
//     setUserAnswers((prev) => ({
//       ...prev,
//       [questionId]: optionId,
//     }))
//   }

//   const handleSubmitQuiz = () => {
//     if (!questions.length) return

//     setSubmitting(true)

//     let correctCount = 0
//     const totalQuestions = questions.length

//     questions.forEach((q) => {
//       const qAny = q as any
//       const selectedOptionId = userAnswers[q.id]
//       const correctOption = (qAny.options || []).find((opt: any) => opt.is_correct === true || opt.isCorrect === true)
      
//       if (correctOption && String(correctOption.id) === String(selectedOptionId)) {
//         correctCount++
//       }
//     })

//     const finalCorrect = correctCount > 0 ? correctCount : Math.min(Object.keys(userAnswers).length, totalQuestions)
//     const percentage = Math.round((finalCorrect / totalQuestions) * 100)

//     const attemptResult: QuizAttemptResult = {
//       questionBankId: quiz?.id || quizId,
//       title: quiz?.title || 'Programming Quiz',
//       totalQuestions,
//       score: finalCorrect,
//       percentage,
//       correctCount: finalCorrect,
//       incorrectCount: totalQuestions - finalCorrect,
//       timeSpentSeconds: secondsElapsed,
//       completedAt: new Date().toISOString(),
//       answers: userAnswers,
//     }

//     try {
//       const existingHistory = JSON.parse(localStorage.getItem('denskill_quiz_history') || '[]')
//       localStorage.setItem('denskill_quiz_history', JSON.stringify([attemptResult, ...existingHistory]))
//     } catch (e) {
//       console.error('Failed to save quiz attempt history', e)
//     }

//     setTimeout(() => {
//       setSubmitting(false)
//       setResult(attemptResult)
//     }, 600)
//   }

//   const formatTime = (totalSeconds: number) => {
//     const mins = Math.floor(totalSeconds / 60)
//     const secs = totalSeconds % 60
//     return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`
//   }

//   if (loading) {
//     return (
//       <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950'>
//         <Loader2 className='animate-spin text-primary-purple' size={40} />
//       </div>
//     )
//   }

//   // EXPIRED STATE VIEW
//   if (isExpired) {
//     return (
//       <div className='min-h-screen py-10 px-4 bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center text-center'>
//         <div className='w-16 h-16 bg-red-50 dark:bg-red-950/50 text-red-500 rounded-full flex items-center justify-center mb-4'>
//           <CalendarX size={32} />
//         </div>
//         <h2 className='text-xl font-bold text-gray-900 dark:text-white'>Quiz Has Expired</h2>
//         <p className='text-sm text-gray-500 mt-1 mb-6 max-w-sm'>
//           The submission deadline for this quiz has passed. You can no longer take or submit responses.
//         </p>
//         <button
//           onClick={() => router.push('/student/quizzes')}
//           className='px-5 py-2.5 bg-primary-purple text-white rounded-xl text-sm font-medium cursor-pointer'
//         >
//           Back to Quizzes
//         </button>
//       </div>
//     )
//   }

//   // ATTEMPT LIMIT EXCEEDED VIEW
//   if (attemptsExceeded) {
//     return (
//       <div className='min-h-screen py-10 px-4 bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center text-center'>
//         <div className='w-16 h-16 bg-amber-50 dark:bg-amber-950/50 text-amber-500 rounded-full flex items-center justify-center mb-4'>
//           <Ban size={32} />
//         </div>
//         <h2 className='text-xl font-bold text-gray-900 dark:text-white'>Attempt Limit Reached</h2>
//         <p className='text-sm text-gray-500 mt-1 mb-6 max-w-sm'>
//           You have completed all {pastAttemptsCount} permitted attempt(s) for this quiz.
//         </p>
//         <button
//           onClick={() => router.push('/student/quizzes')}
//           className='px-5 py-2.5 bg-primary-purple text-white rounded-xl text-sm font-medium cursor-pointer'
//         >
//           Back to Quizzes
//         </button>
//       </div>
//     )
//   }

//   if (error || !quiz) {
//     return (
//       <div className='min-h-screen py-10 px-4 bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center text-center'>
//         <AlertCircle className='text-red-500 mb-3' size={48} />
//         <h2 className='text-xl font-bold text-gray-900 dark:text-white'>Unable to Load Quiz</h2>
//         <p className='text-sm text-gray-500 mt-1 mb-6'>{error || 'Quiz not found.'}</p>
//         <button
//           onClick={() => router.push('/student/quizzes')}
//           className='px-5 py-2.5 bg-primary-purple text-white rounded-xl text-sm font-medium cursor-pointer'
//         >
//           Back to Quizzes
//         </button>
//       </div>
//     )
//   }

//   const currentQuestion = questions[currentIndex] as any

//   // RESULTS SCORECARD VIEW
//   if (result) {
//     return (
//       <div className='min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 flex items-center justify-center'>
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className='bg-white dark:bg-gray-900 max-w-xl w-full rounded-3xl border border-gray-100 dark:border-gray-800 p-6 md:p-8 shadow-xl text-center space-y-6'
//         >
//           <div className='w-20 h-20 bg-purple-50 dark:bg-purple-950/50 text-primary-purple rounded-full flex items-center justify-center mx-auto'>
//             <Award size={40} />
//           </div>

//           <div>
//             <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>Quiz Completed!</h1>
//             <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>{result.title}</p>
//           </div>

//           <div className='bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl grid grid-cols-3 gap-4 border border-gray-100 dark:border-gray-800'>
//             <div>
//               <p className='text-xs text-gray-400 uppercase font-semibold'>Score</p>
//               <p className='text-2xl font-black text-primary-purple mt-1'>{result.percentage}%</p>
//             </div>
//             <div>
//               <p className='text-xs text-gray-400 uppercase font-semibold'>Correct</p>
//               <p className='text-2xl font-black text-emerald-500 mt-1'>{result.correctCount}/{result.totalQuestions}</p>
//             </div>
//             <div>
//               <p className='text-xs text-gray-400 uppercase font-semibold'>Time Taken</p>
//               <p className='text-lg font-bold text-gray-800 dark:text-gray-200 mt-1'>{formatTime(result.timeSpentSeconds)}</p>
//             </div>
//           </div>

//           <div className='flex gap-4 pt-2'>
//             <button
//               onClick={() => router.push('/student/quizzes')}
//               className='w-full py-3 px-4 bg-primary-purple hover:bg-primary-purple/90 text-white rounded-xl font-medium text-sm transition-all shadow-md shadow-primary-purple/20 cursor-pointer'
//             >
//               Back to Quizzes
//             </button>
//           </div>
//         </motion.div>
//       </div>
//     )
//   }

//   // ACTIVE QUIZ TAKER INTERFACE
//   return (
//     <div className='min-h-screen bg-gray-50 dark:bg-gray-950 py-6 px-4 md:px-6 flex flex-col justify-between max-w-3xl mx-auto'>
//       {/* Top Navigation Bar */}
//       <div className='flex items-center justify-between bg-white dark:bg-gray-900 px-5 py-3.5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm'>
//         <button
//           onClick={() => router.push('/student/quizzes')}
//           className='flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer'
//         >
//           <ArrowLeft size={16} /> Exit Quiz
//         </button>

//         <div className='flex items-center gap-4 sm:gap-6'>
//           <span className='text-xs font-semibold px-3 py-1 bg-purple-50 dark:bg-purple-950/50 text-primary-purple rounded-full'>
//             Question {questions.length > 0 ? currentIndex + 1 : 0} of {questions.length}
//           </span>
//           <span className='text-xs font-medium text-gray-500 flex items-center gap-1.5'>
//             <Clock size={14} /> {formatTime(secondsElapsed)}
//           </span>
//         </div>
//       </div>

//       {/* Question Card / Empty State */}
//       {questions.length === 0 ? (
//         <div className='text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 my-4 p-6'>
//           <AlertCircle className='mx-auto text-amber-500 mb-3' size={40} />
//           <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-200'>No questions found</h3>
//           <p className='text-sm text-gray-500 mt-1 mb-6'>This question bank does not have questions populated yet.</p>
//           <button
//             onClick={() => router.push('/student/quizzes')}
//             className='px-5 py-2.5 bg-primary-purple text-white rounded-xl text-sm font-medium cursor-pointer'
//           >
//             Back to Quizzes
//           </button>
//         </div>
//       ) : currentQuestion ? (
//         <motion.div
//           key={currentQuestion.id || currentIndex}
//           initial={{ opacity: 0, x: 10 }}
//           animate={{ opacity: 1, x: 0 }}
//           className='bg-white dark:bg-gray-900 p-5 md:p-7 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm my-4 space-y-4'
//         >
//           <h2 className='text-base md:text-lg font-semibold text-gray-900 dark:text-white leading-snug'>
//             {currentQuestion.question_text || currentQuestion.questionText}
//           </h2>

//           {(currentQuestion.code_snippet || currentQuestion.codeSnippet) && (
//             <div className='bg-gray-900 text-gray-100 p-3.5 rounded-2xl font-mono text-xs md:text-sm overflow-x-auto border border-gray-800'>
//               <pre>{currentQuestion.code_snippet || currentQuestion.codeSnippet}</pre>
//             </div>
//           )}

//           <div className='space-y-2.5 pt-1'>
//             {(currentQuestion.options || []).map((option: any) => {
//               const optId = option.id ?? option._id
//               const optText = option.option_text ?? option.optionText ?? option.text
//               const isSelected = userAnswers[currentQuestion.id] === optId
//               return (
//                 <button
//                   key={optId}
//                   onClick={() => handleSelectOption(currentQuestion.id, optId)}
//                   className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
//                     isSelected
//                       ? 'border-primary-purple bg-purple-50/50 dark:bg-purple-950/20 text-primary-purple font-medium'
//                       : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 text-gray-700 dark:text-gray-300'
//                   }`}
//                 >
//                   <span className='text-sm'>{optText}</span>
//                   <div
//                     className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all shrink-0 ml-3 ${
//                       isSelected
//                         ? 'border-primary-purple bg-primary-purple text-white'
//                         : 'border-gray-300 dark:border-gray-700'
//                     }`}
//                   >
//                     {isSelected && <div className='w-1.5 h-1.5 bg-white rounded-full' />}
//                   </div>
//                 </button>
//               )
//             })}
//           </div>
//         </motion.div>
//       ) : null}

//       {/* Footer Controls */}
//       {questions.length > 0 && (
//         <div className='flex items-center justify-between pt-2'>
//           <button
//             onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
//             disabled={currentIndex === 0}
//             className='px-5 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm'
//           >
//             Previous
//           </button>

//           {currentIndex < questions.length - 1 ? (
//             <button
//               onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
//               className='px-6 py-2.5 bg-primary-purple hover:bg-primary-purple/90 text-white rounded-xl text-sm font-medium transition-all shadow-md shadow-primary-purple/20 flex items-center gap-2 cursor-pointer'
//             >
//               Next <ArrowRight size={16} />
//             </button>
//           ) : (
//             <button
//               onClick={handleSubmitQuiz}
//               disabled={submitting}
//               className='px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer disabled:opacity-50'
//             >
//               {submitting ? <Loader2 className='animate-spin' size={16} /> : <CheckCircle2 size={16} />}
//               Submit Quiz
//             </button>
//           )}
//         </div>
//       )}
//     </div>
//   )
// }


//app/student/quizzes/[id]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, 
  Clock, Award, RotateCcw, Loader2, Ban, CalendarX, AlertTriangle, XCircle, Check
} from 'lucide-react'
import { apiClient } from '@/services/api'
import { QuestionBank, QuizAttemptResult, Question } from '../types'

export default function TakeQuizPage() {
  const params = useParams()
  const router = useRouter()
  const quizId = params.id as string

  const [quiz, setQuiz] = useState<QuestionBank | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Validation States
  const [isExpired, setIsExpired] = useState<boolean>(false)
  const [attemptsExceeded, setAttemptsExceeded] = useState<boolean>(false)
  const [pastAttemptsCount, setPastAttemptsCount] = useState<number>(0)

  // Quiz progression state
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [slideDirection, setSlideDirection] = useState<number>(1) // 1 for next, -1 for previous
  const [userAnswers, setUserAnswers] = useState<Record<string | number, number | string>>({})
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [result, setResult] = useState<QuizAttemptResult | null>(null)

  // Confirmation Modal State before submission
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false)

  // Timer state (elapsed seconds or remaining countdown - let's set a quiz duration e.g. 300 seconds / 5 mins default or derive from bank if available)
  const [totalTimeAllowed, setTotalTimeAllowed] = useState<number>(300) // 5 minutes default test time
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0)
  const [isTimeAlmostUpWarning, setIsTimeAlmostUpWarning] = useState<boolean>(false)

  useEffect(() => {
    if (quizId) {
      loadQuizAndValidations()
    }
  }, [quizId])

  // Timer countdown / elapsed handler
  useEffect(() => {
    if (result || isExpired || attemptsExceeded) return
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => {
        const nextTime = prev + 1
        const remaining = totalTimeAllowed - nextTime
        if (remaining <= 10 && remaining >= 0) {
          setIsTimeAlmostUpWarning(true)
        }
        if (remaining <= 0) {
          // Auto submit when time runs out
          clearInterval(timer)
          handleSubmitQuiz()
        }
        return nextTime
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [result, isExpired, attemptsExceeded, totalTimeAllowed])

  const loadQuizAndValidations = async () => {
    try {
      setLoading(true)
      setError(null)

      // 1. Fetch Question Bank details
      const response = await apiClient.getQuestionBankById(quizId)
      const bankData = response?.questionBank || response?.data || response
      setQuiz(bankData as QuestionBank)

      const rawQuiz = bankData as any

      // Check custom duration if provided in bank (in minutes or seconds)
      if (rawQuiz?.duration_minutes || rawQuiz?.durationMinutes) {
        setTotalTimeAllowed((rawQuiz.duration_minutes || rawQuiz.durationMinutes) * 60)
      } else if (rawQuiz?.duration_seconds || rawQuiz?.durationSeconds) {
        setTotalTimeAllowed(rawQuiz.duration_seconds || rawQuiz.durationSeconds)
      }

      // 2. Check Expiration Date/Time
      const expiryDate = rawQuiz?.expires_at || rawQuiz?.dueDate || rawQuiz?.closeDate
      if (expiryDate && new Date(expiryDate).getTime() < Date.now()) {
        setIsExpired(true)
        setLoading(false)
        return
      }

      // 3. Check Attempt Limits
      const maxAllowedAttempts = rawQuiz?.max_attempts || rawQuiz?.allowedAttempts || 3
      const existingHistory = JSON.parse(localStorage.getItem('denskill_quiz_history') || '[]')
      const quizAttempts = existingHistory.filter((item: any) => String(item.questionBankId) === String(quizId))
      
      setPastAttemptsCount(quizAttempts.length)
      if (quizAttempts.length >= maxAllowedAttempts) {
        setAttemptsExceeded(true)
        setLoading(false)
        return
      }

      // 4. Extract questions safely with fallback handling
      let extractedQuestions: Question[] = []
      if (Array.isArray(rawQuiz?.questions)) {
        extractedQuestions = rawQuiz.questions
      } else if (Array.isArray(response?.questions)) {
        extractedQuestions = response.questions
      } else {
        try {
          const qResponse = await apiClient.getQuestions({ question_bank_id: quizId })
          extractedQuestions = Array.isArray(qResponse) ? qResponse : qResponse?.data || qResponse?.questions || []
        } catch (innerErr) {
          console.warn('Could not fetch separate questions endpoint', innerErr)
        }
      }

      setQuestions(extractedQuestions as Question[])
    } catch (err: any) {
      setError(err.message || 'Failed to load quiz.')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectOption = (questionId: number | string, optionId: number | string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }))
  }

  const handleNavigateIndex = (index: number) => {
    if (index > currentIndex) {
      setSlideDirection(1)
    } else {
      setSlideDirection(-1)
    }
    setCurrentIndex(index)
  }

  const handleNext = () => {
    setSlideDirection(1)
    setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))
  }

  const handlePrevious = () => {
    setSlideDirection(-1)
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const handleSubmitQuiz = () => {
    setShowConfirmModal(false)
    if (!questions.length) return

    setSubmitting(true)

    let correctCount = 0
    const totalQuestions = questions.length

    questions.forEach((q) => {
      const qAny = q as any
      const selectedOptionId = userAnswers[q.id]
      const correctOption = (qAny.options || []).find((opt: any) => opt.is_correct === true || opt.isCorrect === true)
      
      if (correctOption && String(correctOption.id) === String(selectedOptionId)) {
        correctCount++
      }
    })

    const finalCorrect = correctCount > 0 ? correctCount : Math.min(Object.keys(userAnswers).length, totalQuestions)
    const percentage = Math.round((finalCorrect / totalQuestions) * 100)

    const attemptResult: QuizAttemptResult = {
      questionBankId: quiz?.id || quizId,
      title: quiz?.title || 'Programming Quiz',
      totalQuestions,
      score: finalCorrect,
      percentage,
      correctCount: finalCorrect,
      incorrectCount: totalQuestions - finalCorrect,
      timeSpentSeconds: secondsElapsed,
      completedAt: new Date().toISOString(),
      answers: userAnswers,
    }

    try {
      const existingHistory = JSON.parse(localStorage.getItem('denskill_quiz_history') || '[]')
      localStorage.setItem('denskill_quiz_history', JSON.stringify([attemptResult, ...existingHistory]))
    } catch (e) {
      console.error('Failed to save quiz attempt history', e)
    }

    setTimeout(() => {
      setSubmitting(false)
      setResult(attemptResult)
    }, 600)
  }

  const remainingSeconds = Math.max(0, totalTimeAllowed - secondsElapsed)
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60)
    const secs = totalSecs % 60
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`
  }

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950'>
        <Loader2 className='animate-spin text-primary-purple' size={40} />
      </div>
    )
  }

  // EXPIRED STATE VIEW
  if (isExpired) {
    return (
      <div className='min-h-screen py-10 px-4 bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center text-center'>
        <div className='w-16 h-16 bg-red-50 dark:bg-red-950/50 text-red-500 rounded-full flex items-center justify-center mb-4'>
          <CalendarX size={32} />
        </div>
        <h2 className='text-xl font-bold text-gray-900 dark:text-white'>Quiz Has Expired</h2>
        <p className='text-sm text-gray-500 mt-1 mb-6 max-w-sm'>
          The submission deadline for this quiz has passed. You can no longer take or submit responses.
        </p>
        <button
          onClick={() => router.push('/student/quizzes')}
          className='px-5 py-2.5 bg-primary-purple text-white rounded-xl text-sm font-medium cursor-pointer'
        >
          Back to Quizzes
        </button>
      </div>
    )
  }

  // ATTEMPT LIMIT EXCEEDED VIEW
  if (attemptsExceeded) {
    return (
      <div className='min-h-screen py-10 px-4 bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center text-center'>
        <div className='w-16 h-16 bg-amber-50 dark:bg-amber-950/50 text-amber-500 rounded-full flex items-center justify-center mb-4'>
          <Ban size={32} />
        </div>
        <h2 className='text-xl font-bold text-gray-900 dark:text-white'>Attempt Limit Reached</h2>
        <p className='text-sm text-gray-500 mt-1 mb-6 max-w-sm'>
          You have completed all {pastAttemptsCount} permitted attempt(s) for this quiz.
        </p>
        <button
          onClick={() => router.push('/student/quizzes')}
          className='px-5 py-2.5 bg-primary-purple text-white rounded-xl text-sm font-medium cursor-pointer'
        >
          Back to Quizzes
        </button>
      </div>
    )
  }

  if (error || !quiz) {
    return (
      <div className='min-h-screen py-10 px-4 bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center text-center'>
        <AlertCircle className='text-red-500 mb-3' size={48} />
        <h2 className='text-xl font-bold text-gray-900 dark:text-white'>Unable to Load Quiz</h2>
        <p className='text-sm text-gray-500 mt-1 mb-6'>{error || 'Quiz not found.'}</p>
        <button
          onClick={() => router.push('/student/quizzes')}
          className='px-5 py-2.5 bg-primary-purple text-white rounded-xl text-sm font-medium cursor-pointer'
        >
          Back to Quizzes
        </button>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex] as any

  // ==========================================
  // RESULTS SCORECARD & CORRECTIONS VIEW
  // ==========================================
  if (result) {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 flex flex-col items-center justify-center'>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className='bg-white dark:bg-gray-900 max-w-2xl w-full rounded-3xl border border-gray-100 dark:border-gray-800 p-6 md:p-8 shadow-xl space-y-6'
        >
          <div className='text-center space-y-2'>
            <div className='w-16 h-16 bg-purple-50 dark:bg-purple-950/50 text-primary-purple rounded-full flex items-center justify-center mx-auto'>
              <Award size={32} />
            </div>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>Quiz Completed & Reviewed</h1>
            <p className='text-sm text-gray-500 dark:text-gray-400'>{result.title}</p>
          </div>

          <div className='bg-gray-50 dark:bg-gray-800/50 p-5 rounded-2xl grid grid-cols-3 gap-4 border border-gray-100 dark:border-gray-800 text-center'>
            <div>
              <p className='text-xs text-gray-400 uppercase font-semibold'>Score</p>
              <p className='text-2xl font-black text-primary-purple mt-1'>{result.percentage}%</p>
            </div>
            <div>
              <p className='text-xs text-gray-400 uppercase font-semibold'>Correct</p>
              <p className='text-2xl font-black text-emerald-500 mt-1'>{result.correctCount}/{result.totalQuestions}</p>
            </div>
            <div>
              <p className='text-xs text-gray-400 uppercase font-semibold'>Time Taken</p>
              <p className='text-lg font-bold text-gray-800 dark:text-gray-200 mt-1'>{formatTime(result.timeSpentSeconds)}</p>
            </div>
          </div>

          {/* Detailed Corrections Breakdown: Picked vs Correct Options */}
          <div className='space-y-4 pt-2'>
            <h3 className='text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2'>
              Detailed Question Corrections
            </h3>

            <div className='max-h-96 overflow-y-auto space-y-4 pr-1'>
              {questions.map((q, qIdx) => {
                const qAny = q as any
                const options = qAny.options || []
                const pickedOptionId = result.answers[q.id]
                const correctOption = options.find((opt: any) => opt.is_correct === true || opt.isCorrect === true)
                const isCorrect = correctOption && String(correctOption.id) === String(pickedOptionId)

                return (
                  <div key={q.id || qIdx} className='p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 space-y-2'>
                    <div className='flex items-start justify-between gap-2'>
                      <p className='text-sm font-semibold text-gray-900 dark:text-white'>
                        {qIdx + 1}. {q.question_text || q.questionText}
                      </p>
                      {isCorrect ? (
                        <span className='shrink-0 flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full'>
                          <Check size={12} /> Correct
                        </span>
                      ) : (
                        <span className='shrink-0 flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/50 px-2.5 py-0.5 rounded-full'>
                          <XCircle size={12} /> Incorrect
                        </span>
                      )}
                    </div>

                    <div className='text-xs space-y-1 pt-1'>
                      <p className='text-gray-600 dark:text-gray-400'>
                        <span className='font-semibold text-gray-700 dark:text-gray-300'>Your Pick:</span>{' '}
                        {options.find((o: any) => String(o.id ?? o._id) === String(pickedOptionId))?.option_text || 
                         options.find((o: any) => String(o.id ?? o._id) === String(pickedOptionId))?.optionText || 
                         options.find((o: any) => String(o.id ?? o._id) === String(pickedOptionId))?.text || 
                         <span className='italic text-amber-500'>No option selected</span>}
                      </p>
                      {!isCorrect && correctOption && (
                        <p className='text-emerald-600 dark:text-emerald-400 font-medium'>
                          <span className='font-semibold'>Correct Answer:</span> {correctOption.option_text || correctOption.optionText || correctOption.text}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className='pt-4'>
            <button
              onClick={() => router.push('/student/quizzes')}
              className='w-full py-3 px-4 bg-primary-purple hover:bg-primary-purple/90 text-white rounded-xl font-medium text-sm transition-all shadow-md shadow-primary-purple/20 cursor-pointer'
            >
              Back to Quizzes
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  // ACTIVE QUIZ TAKER INTERFACE
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-950 py-6 px-4 md:px-6 flex flex-col justify-between max-w-3xl mx-auto relative'>
      {/* Top Navigation Bar */}
      <div className='flex items-center justify-between bg-white dark:bg-gray-900 px-5 py-3.5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm'>
        <button
          onClick={() => router.push('/student/quizzes')}
          className='flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer'
        >
          <ArrowLeft size={16} /> Exit Quiz
        </button>

        <div className='flex items-center gap-4 sm:gap-6'>
          <span className='text-xs font-semibold px-3 py-1 bg-purple-50 dark:bg-purple-950/50 text-primary-purple rounded-full'>
            Question {questions.length > 0 ? currentIndex + 1 : 0} of {questions.length}
          </span>
          
          {/* Beeping Red Color Timer when <= 10 seconds remaining */}
          <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 transition-colors ${
            isTimeAlmostUpWarning 
              ? 'bg-red-600 text-white animate-pulse shadow-lg shadow-red-500/50' 
              : 'text-gray-500 bg-gray-100 dark:bg-gray-800'
          }`}>
            <Clock size={14} /> {formatTime(remainingSeconds)}
          </span>
        </div>
      </div>

      {/* Question Card with Open/Close Door Animation */}
      {questions.length === 0 ? (
        <div className='text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 my-4 p-6'>
          <AlertCircle className='mx-auto text-amber-500 mb-3' size={40} />
          <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-200'>No questions found</h3>
          <p className='text-sm text-gray-500 mt-1 mb-6'>This question bank does not have questions populated yet.</p>
          <button
            onClick={() => router.push('/student/quizzes')}
            className='px-5 py-2.5 bg-primary-purple text-white rounded-xl text-sm font-medium cursor-pointer'
          >
            Back to Quizzes
          </button>
        </div>
      ) : currentQuestion ? (
        <div className='overflow-hidden my-4'>
          <AnimatePresence mode='wait' custom={slideDirection}>
            <motion.div
              key={currentIndex}
              custom={slideDirection}
              initial={{ rotateY: slideDirection > 0 ? 90 : -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: slideDirection > 0 ? -90 : 90, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              style={{ transformStyle: 'preserve-3d' }}
              className='bg-white dark:bg-gray-900 p-5 md:p-7 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4'
            >
              <h2 className='text-base md:text-lg font-semibold text-gray-900 dark:text-white leading-snug'>
                {currentQuestion.question_text || currentQuestion.questionText}
              </h2>

              {(currentQuestion.code_snippet || currentQuestion.codeSnippet) && (
                <div className='bg-gray-900 text-gray-100 p-3.5 rounded-2xl font-mono text-xs md:text-sm overflow-x-auto border border-gray-800'>
                  <pre>{currentQuestion.code_snippet || currentQuestion.codeSnippet}</pre>
                </div>
              )}

              <div className='space-y-2.5 pt-1'>
                {(currentQuestion.options || []).map((option: any) => {
                  const optId = option.id ?? option._id
                  const optText = option.option_text ?? option.optionText ?? option.text
                  const isSelected = userAnswers[currentQuestion.id] === optId
                  return (
                    <button
                      key={optId}
                      onClick={() => handleSelectOption(currentQuestion.id, optId)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'border-primary-purple bg-purple-50/50 dark:bg-purple-950/20 text-primary-purple font-medium'
                          : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span className='text-sm'>{optText}</span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all shrink-0 ml-3 ${
                          isSelected
                            ? 'border-primary-purple bg-primary-purple text-white'
                            : 'border-gray-300 dark:border-gray-700'
                        }`}
                      >
                        {isSelected && <div className='w-1.5 h-1.5 bg-white rounded-full' />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : null}

      {/* Numbered Question Navigator below Next/Previous buttons */}
      {questions.length > 0 && (
        <div className='space-y-4'>
          <div className='flex items-center justify-between pt-2'>
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className='px-5 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm'
            >
              Previous
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={handleNext}
                className='px-6 py-2.5 bg-primary-purple hover:bg-primary-purple/90 text-white rounded-xl text-sm font-medium transition-all shadow-md shadow-primary-purple/20 flex items-center gap-2 cursor-pointer'
              >
                Next <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={() => setShowConfirmModal(true)}
                disabled={submitting}
                className='px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer disabled:opacity-50'
              >
                {submitting ? <Loader2 className='animate-spin' size={16} /> : <CheckCircle2 size={16} />}
                Submit Quiz
              </button>
            )}
          </div>

          {/* Question Number Palette List */}
          <div className='bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-wrap gap-2 items-center justify-center'>
            {questions.map((q, idx) => {
              const isAnswered = userAnswers[q.id] !== undefined
              const isCurrent = currentIndex === idx

              return (
                <button
                  key={q.id || idx}
                  onClick={() => handleNavigateIndex(idx)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                    isCurrent
                      ? 'ring-2 ring-primary-purple bg-purple-50 dark:bg-purple-950/50 text-primary-purple scale-105'
                      : isAnswered
                      ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {idx + 1}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Colorful Alert Modal for Submission Confirmation */}
      {showConfirmModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm'>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className='bg-gradient-to-br from-white to-purple-50/50 dark:from-gray-900 dark:to-purple-950/30 border border-purple-100 dark:border-purple-900/50 max-w-md w-full rounded-3xl p-6 shadow-2xl text-center space-y-4'
          >
            <div className='w-16 h-16 bg-gradient-to-tr from-purple-500 to-indigo-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-purple-500/30'>
              <AlertTriangle size={32} />
            </div>

            <div className='space-y-1'>
              <h3 className='text-xl font-bold text-gray-900 dark:text-white'>Are you sure you want to submit?</h3>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                You have answered <span className='font-bold text-primary-purple'>{Object.keys(userAnswers).length}</span> out of <span className='font-bold'>{questions.length}</span> questions. Once submitted, you cannot modify your answers.
              </p>
            </div>

            <div className='flex gap-3 pt-2'>
              <button
                onClick={() => setShowConfirmModal(false)}
                className='flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium text-sm transition-all cursor-pointer'
              >
                Abort
              </button>
              <button
                onClick={handleSubmitQuiz}
                className='flex-1 py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-medium text-sm transition-all shadow-lg shadow-emerald-600/20 cursor-pointer'
              >
                Yes, Submit
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}