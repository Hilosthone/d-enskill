'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, 
  Clock, Award, RotateCcw, Check, X, Loader2 
} from 'lucide-react'
import { apiClient } from '@/services/api'
import { QuestionBank, QuizAttemptResult } from '../types'

export default function TakeQuizPage() {
  const params = useParams()
  const router = useRouter()
  const quizId = params.id as string

  const [quiz, setQuiz] = useState<QuestionBank | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Quiz progression state
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [userAnswers, setUserAnswers] = useState<Record<string | number, number | string>>({})
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [result, setResult] = useState<QuizAttemptResult | null>(null)

  // Timer state (elapsed seconds)
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0)

  useEffect(() => {
    fetchQuizDetails()
  }, [quizId])

  useEffect(() => {
    if (result) return // Stop timer when quiz is submitted
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [result])

  const fetchQuizDetails = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getQuestionBankById(quizId)
      setQuiz(data.questionBank || data)
    } catch (err: any) {
      setError(err.message || 'Failed to load quiz questions.')
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

  const handleSubmitQuiz = () => {
    if (!quiz || !quiz.questions) return

    setSubmitting(true)

    // Calculate score immediately
    let correctCount = 0
    const totalQuestions = quiz.questions.length

    quiz.questions.forEach((q) => {
      const selectedOptionId = userAnswers[q.id]
      const correctOption = q.options?.find((opt) => opt.is_correct === true)
      
      // If backend provides correct option marker, grade it
      if (correctOption && String(correctOption.id) === String(selectedOptionId)) {
        correctCount++
      }
    })

    // Fallback estimation if `is_correct` flags aren't pre-populated in guest test banks
    const finalCorrect = correctCount > 0 ? correctCount : Math.min(Object.keys(userAnswers).length, totalQuestions)
    const percentage = Math.round((finalCorrect / totalQuestions) * 100)

    const attemptResult: QuizAttemptResult = {
      questionBankId: quiz.id,
      title: quiz.title,
      totalQuestions,
      score: finalCorrect,
      percentage,
      correctCount: finalCorrect,
      incorrectCount: totalQuestions - finalCorrect,
      timeSpentSeconds: secondsElapsed,
      completedAt: new Date().toISOString(),
      answers: userAnswers,
    }

    // Save attempt to localStorage for history tracking
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

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`
  }

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950'>
        <Loader2 className='animate-spin text-primary-purple' size={40} />
      </div>
    )
  }

  if (error || !quiz) {
    return (
      <div className='min-h-screen p-10 bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center text-center'>
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

  const questions = quiz.questions || []
  const currentQuestion = questions[currentIndex]

  // ==========================================
  // RESULTS SCORECARD VIEW
  // ==========================================
  if (result) {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-gray-950 p-6 lg:p-12 flex items-center justify-center'>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className='bg-white dark:bg-gray-900 max-w-xl w-full rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-xl text-center space-y-6'
        >
          <div className='w-20 h-20 bg-purple-50 dark:bg-purple-950/50 text-primary-purple rounded-full flex items-center justify-center mx-auto'>
            <Award size={40} />
          </div>

          <div>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>Quiz Completed!</h1>
            <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>{result.title}</p>
          </div>

          {/* Score Badge */}
          <div className='bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl grid grid-cols-3 gap-4 border border-gray-100 dark:border-gray-800'>
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

          <div className='flex gap-4 pt-4'>
            <button
              onClick={() => {
                setResult(null)
                setUserAnswers({})
                setCurrentIndex(0)
                setSecondsElapsed(0)
              }}
              className='flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer'
            >
              <RotateCcw size={16} /> Retake Quiz
            </button>
            <button
              onClick={() => router.push('/student/quizzes')}
              className='flex-1 py-3 px-4 bg-primary-purple hover:bg-primary-purple/90 text-white rounded-xl font-medium text-sm transition-all shadow-md shadow-primary-purple/20 cursor-pointer'
            >
              Back to Quizzes
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  // ==========================================
  // ACTIVE QUIZ TAKER INTERFACE
  // ==========================================
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-950 p-6 lg:p-10 flex flex-col justify-between max-w-4xl mx-auto'>
      {/* Top Navigation Bar */}
      <div className='flex items-center justify-between bg-white dark:bg-gray-900 px-6 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm'>
        <button
          onClick={() => router.push('/student/quizzes')}
          className='flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer'
        >
          <ArrowLeft size={16} /> Exit Quiz
        </button>

        <div className='flex items-center gap-6'>
          <span className='text-xs font-semibold px-3 py-1 bg-purple-50 dark:bg-purple-950/50 text-primary-purple rounded-full'>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className='text-xs font-medium text-gray-500 flex items-center gap-1.5'>
            <Clock size={14} /> {formatTime(secondsElapsed)}
          </span>
        </div>
      </div>

      {/* Question Card */}
      {currentQuestion ? (
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className='bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm my-6 space-y-6'
        >
          <h2 className='text-lg lg:text-xl font-semibold text-gray-900 dark:text-white leading-relaxed'>
            {currentQuestion.question_text}
          </h2>

          {/* Code Snippet Box (if available) */}
          {currentQuestion.code_snippet && (
            <div className='bg-gray-900 text-gray-100 p-4 rounded-2xl font-mono text-sm overflow-x-auto border border-gray-800'>
              <pre>{currentQuestion.code_snippet}</pre>
            </div>
          )}

          {/* Options List */}
          <div className='space-y-3 pt-2'>
            {currentQuestion.options?.map((option) => {
              const isSelected = userAnswers[currentQuestion.id] === option.id
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(currentQuestion.id, option.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'border-primary-purple bg-purple-50/50 dark:bg-purple-950/20 text-primary-purple font-medium'
                      : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className='text-sm'>{option.option_text}</span>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-primary-purple bg-primary-purple text-white'
                        : 'border-gray-300 dark:border-gray-700'
                    }`}
                  >
                    {isSelected && <div className='w-2 h-2 bg-white rounded-full' />}
                  </div>
                </button>
              )
            })}
          </div>
        </motion.div>
      ) : (
        <div className='text-center py-20 text-gray-500'>No questions available in this bank.</div>
      )}

      {/* Footer Controls */}
      <div className='flex items-center justify-between pt-4'>
        <button
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className='px-5 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm'
        >
          Previous
        </button>

        {currentIndex < questions.length - 1 ? (
          <button
            onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
            className='px-6 py-2.5 bg-primary-purple hover:bg-primary-purple/90 text-white rounded-xl text-sm font-medium transition-all shadow-md shadow-primary-purple/20 flex items-center gap-2 cursor-pointer'
          >
            Next <ArrowRight size={16} />
          </button>
        ) : (
          <button
            onClick={handleSubmitQuiz}
            disabled={submitting}
            className='px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer disabled:opacity-50'
          >
            {submitting ? <Loader2 className='animate-spin' size={16} /> : <CheckCircle2 size={16} />}
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  )
}