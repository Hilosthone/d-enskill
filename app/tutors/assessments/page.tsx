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
  MessageSquareCode,
  Calendar,
} from 'lucide-react'
import { apiClient } from '@/services/api'

interface Assessment {
  id: string | number
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
  const [courseId, setCourseId] = useState<string>('1')
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Assessment Form Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('assignment')
  const [totalMarks, setTotalMarks] = useState(100)
  const [weight, setWeight] = useState(1.5)
  const [dueDate, setDueDate] = useState('')

  // Submissions Modal
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<
    string | number | null
  >(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoadingSubs, setIsLoadingSubs] = useState(false)

  // Grading Modal
  const [gradingSubId, setGradingSubId] = useState<string | number | null>(null)
  const [score, setScore] = useState<number>(0)
  const [feedback, setFeedback] = useState('')
  const [reviewStatus, setReviewStatus] = useState('approved')

  // Notification Modal
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    isSuccess: true,
  })

  const showAlert = (title: string, message: string, isSuccess = true) => {
    setAlertModal({ isOpen: true, title, message, isSuccess })
  }

  const fetchAssessments = async () => {
    setIsLoading(true)
    try {
      const res = await apiClient.getCourseAssessments(courseId)
      const list = Array.isArray(res)
        ? res
        : res?.assessments || res?.data || []
      setAssessments(list)
    } catch (err) {
      setAssessments([
        {
          id: 1,
          title: 'MERN REST API Microservice',
          description:
            'Build authenticated endpoints using Node.js, Express, and JWT.',
          type: 'assignment',
          total_marks: 100,
          weight: 2.0,
          due_date: '2026-08-30T23:59:00Z',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAssessments()
  }, [courseId])

  const handleCreateAssessment = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await apiClient.createAssessment({
        course_id: courseId,
        title,
        description,
        type,
        total_marks: Number(totalMarks),
        weight: Number(weight),
        due_date: dueDate || new Date().toISOString(),
      })
      showAlert(
        'Success',
        'Assessment created and published successfully!',
        true,
      )
      setIsModalOpen(false)
      setTitle('')
      setDescription('')
      fetchAssessments()
    } catch (err: any) {
      showAlert('Error', err?.message || 'Failed to create assessment.', false)
    }
  }

  const handleViewSubmissions = async (assessmentId: string | number) => {
    setSelectedAssessmentId(assessmentId)
    setIsLoadingSubs(true)
    try {
      const res = await apiClient.getAssessmentSubmissions(assessmentId)
      const list = Array.isArray(res)
        ? res
        : res?.submissions || res?.data || []
      setSubmissions(list)
    } catch (err) {
      setSubmissions([
        {
          id: 101,
          student_name: 'Alex Johnson',
          student_id: 1,
          score: 85,
          feedback: 'Good structure.',
          status: 'graded',
        },
        {
          id: 102,
          student_name: 'Sarah Williams',
          student_id: 2,
          score: undefined,
          feedback: '',
          status: 'pending',
        },
      ])
    } finally {
      setIsLoadingSubs(false)
    }
  }

  const handleGradeSubmission = async (e: FormEvent) => {
    e.preventDefault()
    if (gradingSubId === null) return
    try {
      await apiClient.gradeSubmission(gradingSubId, {
        score: Number(score),
        feedback,
      })
      showAlert('Success', 'Grade and feedback submitted successfully!', true)
      setGradingSubId(null)
      if (selectedAssessmentId) handleViewSubmissions(selectedAssessmentId)
    } catch (err: any) {
      showAlert('Error', err?.message || 'Failed to submit grade.', false)
    }
  }

  const inputClass =
    'w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-dark dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-purple'

  return (
    <div className='space-y-6 animate-fadeIn'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-dark dark:text-white'>
            Assessments & Grading
          </h1>
          <p className='text-sm text-gray-500'>
            Create assignments, quizzes, and grade student submissions in real
            time.
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className='p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs font-medium text-dark dark:text-white'
          >
            <option value='1'>Course ID: 1 (Full-Stack)</option>
            <option value='2'>Course ID: 2 (Mobile App)</option>
          </select>
          <button
            onClick={() => setIsModalOpen(true)}
            className='bg-primary-purple hover:bg-primary-purple/90 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition flex items-center gap-2 cursor-pointer shadow-sm'
          >
            <Plus size={16} /> New Assessment
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className='h-64 flex items-center justify-center'>
          <Loader2 className='w-6 h-6 animate-spin text-primary-purple' />
        </div>
      ) : assessments.length === 0 ? (
        <div className='bg-white dark:bg-gray-900 p-12 text-center rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3'>
          <FileText size={40} className='mx-auto text-gray-400' />
          <p className='text-sm font-medium text-gray-500'>
            No assessments found for this course.
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {assessments.map((item) => (
            <div
              key={item.id}
              className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4 flex flex-col justify-between'
            >
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <span className='px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-primary-purple/10 text-primary-purple'>
                    {item.type}
                  </span>
                  <span className='text-xs text-gray-400 flex items-center gap-1'>
                    <Calendar size={12} /> Due:{' '}
                    {new Date(item.due_date).toLocaleDateString()}
                  </span>
                </div>
                <h3 className='text-lg font-bold text-dark dark:text-white'>
                  {item.title}
                </h3>
                <p className='text-xs text-gray-500 line-clamp-2'>
                  {item.description}
                </p>
              </div>

              <div className='flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500'>
                <span>
                  Total Marks: <strong>{item.total_marks}</strong>
                </span>
                <span>
                  Weight: <strong>{item.weight}x</strong>
                </span>
                <button
                  onClick={() => handleViewSubmissions(item.id)}
                  className='px-3.5 py-2 rounded-xl bg-primary-purple text-white font-medium hover:opacity-90 transition cursor-pointer'
                >
                  View Submissions
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Assessment Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn'>
          <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl'>
            <div className='flex justify-between items-center border-b pb-4 dark:border-gray-800'>
              <h3 className='text-lg font-bold text-dark dark:text-white'>
                Create New Assessment
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className='text-gray-400 hover:text-gray-200 cursor-pointer'
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateAssessment} className='space-y-4'>
              <div>
                <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                  Title
                </label>
                <input
                  type='text'
                  required
                  placeholder='e.g., Week 3 React Challenge'
                  className={inputClass}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                    Type
                  </label>
                  <select
                    className={inputClass}
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value='assignment'>Assignment</option>
                    <option value='quiz'>Quiz</option>
                    <option value='project'>Project</option>
                  </select>
                </div>
                <div>
                  <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                    Total Marks
                  </label>
                  <input
                    type='number'
                    required
                    className={inputClass}
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(Number(e.target.value))}
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
                    required
                    className={inputClass}
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
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
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>
              <div className='flex justify-end gap-3 pt-4 border-t dark:border-gray-800'>
                <button
                  type='button'
                  onClick={() => setIsModalOpen(false)}
                  className='px-4 py-2 rounded-xl text-xs font-semibold border border-gray-300 dark:border-gray-700 text-gray-600 cursor-pointer'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-5 py-2 rounded-xl text-xs font-semibold bg-primary-purple text-white hover:opacity-90 cursor-pointer'
                >
                  Publish Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submissions Modal */}
      {selectedAssessmentId && (
        <div className='fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn'>
          <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[80vh] overflow-y-auto'>
            <div className='flex justify-between items-center border-b pb-4 dark:border-gray-800'>
              <h3 className='text-lg font-bold text-dark dark:text-white'>
                Student Submissions
              </h3>
              <button
                onClick={() => setSelectedAssessmentId(null)}
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
                    className='p-4 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-between'
                  >
                    <div>
                      <h4 className='text-sm font-bold text-dark dark:text-white'>
                        {sub.student_name || `Student ID: ${sub.student_id}`}
                      </h4>
                      <p className='text-xs text-gray-500'>
                        Status:{' '}
                        <span className='font-semibold text-primary-purple uppercase'>
                          {sub.status || 'Pending'}
                        </span>{' '}
                        {sub.score !== undefined && `• Score: ${sub.score}/100`}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setGradingSubId(sub.id)
                        setScore(sub.score || 0)
                        setFeedback(sub.feedback || '')
                      }}
                      className='px-3 py-1.5 rounded-lg bg-primary-purple/10 text-primary-purple font-semibold text-xs hover:bg-primary-purple/20 transition cursor-pointer flex items-center gap-1'
                    >
                      <Award size={14} />{' '}
                      {sub.score !== undefined
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

      {/* Grade Submission Modal */}
      {gradingSubId !== null && (
        <div className='fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn'>
          <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl'>
            <div className='flex justify-between items-center border-b pb-3 dark:border-gray-800'>
              <h3 className='text-base font-bold text-dark dark:text-white'>
                Grade Student Submission
              </h3>
              <button
                onClick={() => setGradingSubId(null)}
                className='text-gray-400 hover:text-gray-200 cursor-pointer'
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleGradeSubmission} className='space-y-4'>
              <div>
                <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                  Score (Out of 100)
                </label>
                <input
                  type='number'
                  required
                  max={100}
                  min={0}
                  className={inputClass}
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                />
              </div>
              <div>
                <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                  Feedback / Review Notes
                </label>
                <textarea
                  required
                  placeholder='Great job implementing endpoint logic...'
                  className={`${inputClass} h-24`}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>
              <div className='flex justify-end gap-2 pt-2'>
                <button
                  type='button'
                  onClick={() => setGradingSubId(null)}
                  className='px-4 py-2 rounded-xl text-xs font-semibold border border-gray-300 dark:border-gray-700 text-gray-600 cursor-pointer'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-5 py-2 rounded-xl text-xs font-semibold bg-primary-purple text-white hover:opacity-90 cursor-pointer'
                >
                  Submit Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {alertModal.isOpen && (
        <div className='fixed inset-0 z-70 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn'>
          <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl'>
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${alertModal.isSuccess ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}
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
            <p className='text-xs text-gray-500'>{alertModal.message}</p>
            <button
              onClick={() =>
                setAlertModal((prev) => ({ ...prev, isOpen: false }))
              }
              className='w-full py-2.5 rounded-xl text-xs font-semibold bg-primary-purple text-white cursor-pointer'
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
