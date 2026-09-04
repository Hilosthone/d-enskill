'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, BookOpen, Clock, CheckCircle2, Award, ArrowRight, Loader2, Filter } from 'lucide-react'
import { apiClient } from '@/services/api'
import { QuestionBank } from './types'

export default function StudentQuizzesPage() {
  const router = useRouter()
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filtering states
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedCourse, setSelectedCourse] = useState<string>('ALL')

  useEffect(() => {
    fetchQuizzes()
  }, [selectedCourse, searchQuery])

  const fetchQuizzes = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch approved question banks for students
      const response = await apiClient.getQuestionBanks({
        status: 'APPROVED',
        search: searchQuery || undefined,
        courseId: selectedCourse !== 'ALL' ? selectedCourse : undefined,
      })

      // Handle standard API response structures (array or paginated object `{ data: [...] }`)
      const data = Array.isArray(response) ? response : response?.data || response?.questionBanks || []
      setQuestionBanks(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load available quizzes.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-950 p-6 lg:p-10 space-y-8'>
      {/* Header Banner */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2'>
            <Award className='text-primary-purple' size={28} />
            Programming Quizzes & Assessments
          </h1>
          <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
            Test your programming knowledge, practice coding challenges, and track your progress.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
        <div className='relative w-full sm:w-96'>
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
          <Filter size={16} className='text-gray-400' />
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
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {questionBanks.map((bank, index) => (
            <motion.div
              key={bank.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group'
            >
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <span className='px-3 py-1 bg-purple-50 dark:bg-purple-950/50 text-primary-purple text-xs font-semibold rounded-full'>
                    {bank.courseId || 'General'}
                  </span>
                  <span className='text-xs text-gray-400 flex items-center gap-1'>
                    <Clock size={14} /> Practice Mode
                  </span>
                </div>

                <h3 className='text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-purple transition-colors'>
                  {bank.title}
                </h3>

                <p className='text-sm text-gray-500 dark:text-gray-400 line-clamp-2'>
                  {bank.description || 'Test your coding skills with curated assessment questions.'}
                </p>
              </div>

              <div className='pt-6 mt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between'>
                <span className='text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5'>
                  <CheckCircle2 size={16} className='text-emerald-500' />
                  {bank.questionCount || bank.questions?.length || 'Multiple'} Questions
                </span>

                <button
                  onClick={() => router.push(`/student/quizzes/${bank.id}`)}
                  className='flex items-center gap-2 px-4 py-2 bg-primary-purple hover:bg-primary-purple/90 text-white rounded-xl text-sm font-medium transition-all shadow-sm shadow-primary-purple/20 cursor-pointer'
                >
                  Start Quiz <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}