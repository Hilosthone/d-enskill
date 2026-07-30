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
  CheckCircle2,
  Loader2,
  AlertTriangle,
} from 'lucide-react'
import { apiClient } from '@/services/api'

interface Course {
  id: string | number
  title: string
  duration: string
  price: string
  students: number
  status: 'Active' | 'Upcoming'
}

const initialCourses: Course[] = [
  {
    id: 1,
    title: 'Full-Stack Software Engineering',
    duration: '24 Weeks',
    price: '₦250,000',
    students: 540,
    status: 'Active',
  },
  {
    id: 2,
    title: 'Mobile App Development (React Native)',
    duration: '16 Weeks',
    price: '₦200,000',
    students: 320,
    status: 'Active',
  },
  {
    id: 3,
    title: 'Frontend Architecture & UI/UX',
    duration: '12 Weeks',
    price: '₦180,000',
    students: 280,
    status: 'Active',
  },
  {
    id: 4,
    title: 'Backend Systems & Cloud Engineering',
    duration: '16 Weeks',
    price: '₦220,000',
    students: 190,
    status: 'Upcoming',
  },
]

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>(initialCourses)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)

  // Form states
  const [title, setTitle] = useState('')
  const [duration, setDuration] = useState('')
  const [price, setPrice] = useState('')
  const [status, setStatus] = useState<'Active' | 'Upcoming'>('Active')

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await apiClient.getAdminCourses()
        if (response) {
          const list = Array.isArray(response)
            ? response
            : response.courses || response.data
          if (Array.isArray(list) && list.length > 0) {
            setCourses(
              list.map((c: any) => ({
                id: c.id || c._id,
                title: c.title || c.name,
                duration: c.duration || '16 Weeks',
                price: c.price
                  ? `₦${Number(c.price).toLocaleString()}`
                  : '₦200,000',
                students: c.studentsCount || c.students || 0,
                status: c.status || 'Active',
              })),
            )
          }
        }
      } catch (err) {
        // Fallback to local storage or initial courses if API fails
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

  const handleSaveCourse = async (e: FormEvent) => {
    e.preventDefault()
    if (!title || !duration || !price) return

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      if (editingCourse) {
        // Update existing course locally / API simulation
        setCourses(
          courses.map((c) =>
            c.id === editingCourse.id
              ? { ...c, title, duration, price, status }
              : c,
          ),
        )
      } else {
        // Create new course locally / API simulation
        const newCourse: Course = {
          id: Date.now(),
          title,
          duration,
          price,
          students: 0,
          status,
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
            Manage active training tracks, tuition pricing, and cohort
            durations.
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

              <div className='flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-800'>
                <span className='flex items-center gap-1'>
                  <Clock size={14} /> {course.duration}
                </span>
                <span className='flex items-center gap-1'>
                  <Users size={14} /> {course.students} Enrolled
                </span>
              </div>
            </div>

            <div className='flex items-center justify-end gap-2 pt-2'>
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
        ))}
      </div>

      {/* Add / Edit Modal */}
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
