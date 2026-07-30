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
} from 'lucide-react'
import { apiClient } from '@/services/api'

interface Course {
  id: string | number
  title: string
  duration: string
  price: string
  students: number
  status: 'Active' | 'Upcoming'
  tutorId?: string | number
  tutorName?: string
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
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

  // Form states
  const [title, setTitle] = useState('')
  const [duration, setDuration] = useState('')
  const [price, setPrice] = useState('')
  const [status, setStatus] = useState<'Active' | 'Upcoming'>('Active')

  const fetchCourses = async () => {
    setIsLoading(true)
    try {
      const response = await apiClient.getAdminCourses()
      const payload = response?.data || response
      const list = Array.isArray(payload)
        ? payload
        : payload?.courses || payload?.data || []

      if (Array.isArray(list) && list.length > 0) {
        setCourses(
          list.map((c: any, index: number) => ({
            id: c.id || c._id || `course-${index}`,
            title: c.course || c.title || c.name || 'Untitled Course',
            duration: c.duration || '16 Weeks',
            price: c.price
              ? `₦${Number(c.price).toLocaleString()}`
              : '₦200,000',
            students: Number(
              c.enrolled_count || c.studentsCount || c.students || 0,
            ),
            status: c.status || 'Active',
            tutorId: c.tutorId || '',
            tutorName: c.tutorName || 'Unassigned',
          })),
        )
      }
    } catch (err) {
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
    fetchCourses()
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
    setPrice(course.price)
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
      // Call backend endpoint: PATCH /api/admin/courses/{courseId}/assign-tutor
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
        throw new Error(data?.message || 'Failed to assign tutor.')
      }

      // Update local state
      setCourses(
        courses.map((c) =>
          c.id === selectedCourseForTutor.id
            ? {
                ...c,
                tutorId: selectedTutorId,
                tutorName: `Tutor #${selectedTutorId}`,
              }
            : c,
        ),
      )
      setIsTutorModalOpen(false)
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to assign tutor to programme.')
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
      if (editingCourse) {
        setCourses(
          courses.map((c) =>
            c.id === editingCourse.id
              ? { ...c, title, duration, price, status }
              : c,
          ),
        )
      } else {
        const newCourse: Course = {
          id: Date.now(),
          title,
          duration,
          price,
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

  const handleDeleteCourse = (id: string | number) => {
    if (confirm('Are you sure you want to remove this programme?')) {
      setCourses(courses.filter((c) => c.id !== id))
    }
  }

  const inputClass =
    'w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-dark dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple text-sm'

  if (isLoading) {
    return (
      <div className='h-96 flex items-center justify-center'>
        <Loader2 className='w-6 h-6 animate-spin text-primary-purple' />
      </div>
    )
  }

  return (
    <div className='space-y-6 animate-fadeIn'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h2 className='text-2xl font-bold text-dark dark:text-white'>
            Programmes & Curriculum
          </h2>
          <p className='text-sm text-gray-500'>
            Manage active training tracks, tuition pricing, and tutor
            allocations.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className='bg-primary-purple hover:bg-primary-purple/90 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-sm'
        >
          <Plus size={16} /> Add New Programme
        </button>
      </div>

      {/* Courses Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {courses.map((course) => (
          <div
            key={course.id}
            className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4 flex flex-col justify-between'
          >
            <div className='space-y-3'>
              <div className='flex justify-between items-start'>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    course.status === 'Active'
                      ? 'bg-green-500/10 text-green-600'
                      : 'bg-blue-500/10 text-blue-500'
                  }`}
                >
                  {course.status}
                </span>
                <span className='font-mono font-bold text-lg text-dark dark:text-white'>
                  {course.price}
                </span>
              </div>

              <div>
                <h3 className='text-lg font-bold text-dark dark:text-white flex items-center gap-2'>
                  <BookOpen
                    size={18}
                    className='text-primary-purple shrink-0'
                  />
                  {course.title}
                </h3>
              </div>

              <div className='flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-800'>
                <span className='flex items-center gap-1'>
                  <Clock size={14} /> {course.duration}
                </span>
                <span className='flex items-center gap-1'>
                  <Users size={14} /> {course.students} Enrolled
                </span>
                <span className='w-full text-gray-600 dark:text-gray-300 font-medium'>
                  Lead Tutor:{' '}
                  <span className='text-primary-purple font-semibold'>
                    {course.tutorName || 'Unassigned'}
                  </span>
                </span>
              </div>
            </div>

            <div className='flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800'>
              <button
                onClick={() => handleOpenTutorModal(course)}
                className='px-3 py-1.5 rounded-lg bg-primary-purple/10 hover:bg-primary-purple/20 text-xs font-semibold text-primary-purple flex items-center gap-1 transition cursor-pointer'
              >
                <UserCheck size={14} /> Assign Tutor
              </button>
              <div className='flex items-center gap-2'>
                <button
                  onClick={() => handleOpenEditModal(course)}
                  className='px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1 transition cursor-pointer'
                >
                  <Edit3 size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDeleteCourse(course.id)}
                  className='px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs font-medium text-red-600 flex items-center gap-1 transition cursor-pointer'
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Assign Tutor Modal */}
      {isTutorModalOpen && (
        <div className='fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4'>
          <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-xl animate-fadeIn'>
            <div className='flex justify-between items-center border-b pb-4 dark:border-gray-800'>
              <h3 className='text-lg font-bold text-dark dark:text-white'>
                Assign Instructor
              </h3>
              <button
                onClick={() => setIsTutorModalOpen(false)}
                className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer'
              >
                <X size={20} />
              </button>
            </div>

            {errorMessage && (
              <div className='p-3 bg-red-500/10 border border-red-500 text-red-600 text-xs rounded-xl font-medium flex items-center gap-2'>
                <AlertTriangle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

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
                  Instructor ID / Account Number
                </label>
                <input
                  type='number'
                  required
                  placeholder='Enter tutor ID (e.g., 1)'
                  className={inputClass}
                  value={selectedTutorId}
                  onChange={(e) => setSelectedTutorId(e.target.value)}
                />
              </div>

              <div className='flex justify-end gap-3 pt-4 border-t dark:border-gray-800'>
                <button
                  type='button'
                  onClick={() => setIsTutorModalOpen(false)}
                  className='px-4 py-2 rounded-xl text-xs font-semibold border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={isAssigningTutor}
                  className='px-5 py-2 rounded-xl text-xs font-semibold bg-primary-purple text-white hover:opacity-90 shadow-sm cursor-pointer flex items-center gap-2 disabled:opacity-50'
                >
                  {isAssigningTutor && (
                    <Loader2 size={14} className='animate-spin' />
                  )}
                  <span>Assign Instructor</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Programme Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4'>
          <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-xl animate-fadeIn'>
            <div className='flex justify-between items-center border-b pb-4 dark:border-gray-800'>
              <h3 className='text-lg font-bold text-dark dark:text-white'>
                {editingCourse
                  ? 'Edit Programme'
                  : 'Add New Training Programme'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer'
              >
                <X size={20} />
              </button>
            </div>

            {errorMessage && (
              <div className='p-3 bg-red-500/10 border border-red-500 text-red-600 text-xs rounded-xl font-medium flex items-center gap-2'>
                <AlertTriangle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

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
                    Tuition Price
                  </label>
                  <input
                    type='text'
                    required
                    placeholder='e.g., ₦250,000'
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

              <div className='flex justify-end gap-3 pt-4 border-t dark:border-gray-800'>
                <button
                  type='button'
                  onClick={() => setIsModalOpen(false)}
                  className='px-4 py-2 rounded-xl text-xs font-semibold border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='px-5 py-2 rounded-xl text-xs font-semibold bg-primary-purple text-white hover:opacity-90 shadow-sm cursor-pointer flex items-center gap-2 disabled:opacity-50'
                >
                  {isSubmitting && (
                    <Loader2 size={14} className='animate-spin' />
                  )}
                  <span>
                    {editingCourse ? 'Save Changes' : 'Create Programme'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
