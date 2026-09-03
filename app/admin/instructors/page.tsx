// src/app/admin/instructors/page.tsx
'use client'

import { useState, useEffect, FormEvent } from 'react'
import {
  GraduationCap,
  Mail,
  Phone,
  BookOpen,
  UserPlus,
  Star,
  Edit3,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Lock,
  Link as LinkIcon,
} from 'lucide-react'
import { adminApiClient } from '@/services/admin-api'

interface Instructor {
  id: string
  name: string
  email: string
  phone?: string
  role: string
  assignedCourse?: string
  specialty?: string
  rating?: number
}

interface Course {
  id: string
  title: string
}

// Standardized academy program tracks
const PROGRAMMES = [
  'Frontend Development',
  'Backend Development',
  'Full Stack Development',
  'Mobile Development',
  'Cybersecurity',
  'Data Science',
  'Data Analysis',
  'Product Design (UI/UX)',
  'Product Management',
  'Web3 and Blockchain Development',
  'AI / Machine Learning',
  'Graphics Design',
]

/**
 * AdminInstructorsPage Component
 * Manages the live backend faculty roster, handles creating/updating instructor profiles,
 * and mapping them to active academy program tracks using strict live backend APIs.
 */
export default function AdminInstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(
    null,
  )

  // Assign Course Modal State
  const [assignModalInstructor, setAssignModalInstructor] =
    useState<Instructor | null>(null)
  const [selectedCourseId, setSelectedCourseId] = useState('')

  // Form Fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [password, setPassword] = useState('')

  // Custom Animated Modal States
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null)
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    isSuccess: boolean
  }>({
    isOpen: false,
    title: '',
    message: '',
    isSuccess: true,
  })

  const showAlert = (title: string, message: string, isSuccess = true) => {
    setAlertModal({ isOpen: true, title, message, isSuccess })
  }

  /**
   * Fetches live data from the server.
   * Keeps lists empty if API endpoints fail instead of falling back to mock data.
   */
  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [instructorRes, coursesRes] = await Promise.all([
        adminApiClient.getAdminInstructors(),
        (adminApiClient as any).getCourses ? (adminApiClient as any).getCourses() : Promise.resolve([]),
      ])

      // Parse Instructors
      const payload = instructorRes?.data || instructorRes
      const list = Array.isArray(payload)
        ? payload
        : payload?.instructors || payload?.data || []

      const formatted = list.map((ins: any) => ({
        id: String(ins.id || ins._id),
        name: ins.name || 'Faculty Member',
        email: ins.email || '',
        phone: ins.phone || '',
        role: ins.role || ins.title || 'Senior Developer',
        assignedCourse: ins.assignedCourse || ins.specialty || '',
        specialty: ins.specialty || ins.assignedCourse || '',
        rating: ins.rating || 4.9,
      }))
      setInstructors(formatted)

      // Parse Courses for Assignment dropdown
      const coursePayload = coursesRes?.data || coursesRes
      const courseList = Array.isArray(coursePayload)
        ? coursePayload
        : coursePayload?.courses || coursePayload?.data || []

      setCourses(
        courseList.map((c: any) => ({
          id: String(c.id || c._id),
          title: c.title || c.name || 'Untitled Course',
        })),
      )
    } catch (err: any) {
      showAlert(
        'Error',
        err?.message || 'Failed to load live directory data.',
        false,
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleOpenAddModal = () => {
    setEditingInstructor(null)
    setName('')
    setEmail('')
    setPhone('')
    setRole('')
    setSpecialty('')
    setPassword('')
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (instructor: Instructor) => {
    setEditingInstructor(instructor)
    setName(instructor.name)
    setEmail(instructor.email)
    setPhone(instructor.phone || '')
    setRole(instructor.role)
    setSpecialty(instructor.specialty || instructor.assignedCourse || '')
    setPassword('')
    setIsModalOpen(true)
  }

  const handleSaveInstructor = async (e: FormEvent) => {
    e.preventDefault()
    if (!name || !email || !role) return

    try {
      if (editingInstructor) {
        const payload = {
          name,
          email,
          phone,
          specialty: specialty || role,
          role,
        }
        await adminApiClient.updateInstructor(editingInstructor.id, payload)
        showAlert('Success', 'Faculty member updated successfully!', true)
      } else {
        const payload = {
          name,
          email,
          phone,
          specialty: specialty || role,
          role,
          password: password || 'TempPass123!',
        }
        await adminApiClient.createInstructor(payload)
        showAlert(
          'Success',
          'Instructor created successfully with login credentials.',
          true,
        )
      }

      setIsModalOpen(false)
      fetchData()
    } catch (err: any) {
      showAlert(
        'Error',
        err?.message || 'Failed to save instructor configuration.',
        false,
      )
    }
  }

  const handleAssignCourseSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!assignModalInstructor || !selectedCourseId) return

    try {
      await adminApiClient.updateInstructor(assignModalInstructor.id, {
        specialty: selectedCourseId,
        // assignedCourse: selectedCourseId,
      })

      showAlert(
        'Success',
        `Successfully assigned ${assignModalInstructor.name} to course track.`,
        true,
      )
      setAssignModalInstructor(null)
      setSelectedCourseId('')
      fetchData()
    } catch (err: any) {
      showAlert(
        'Error',
        err?.message || 'Failed to assign course to tutor.',
        false,
      )
    }
  }

  const confirmDeleteInstructor = async () => {
    if (!deleteModalId) return
    try {
      await adminApiClient.deleteInstructor(deleteModalId)
      setInstructors(instructors.filter((ins) => ins.id !== deleteModalId))
      showAlert('Deleted', 'Instructor removed from roster successfully.', true)
    } catch (err: any) {
      showAlert('Error', err?.message || 'Failed to delete instructor.', false)
    } finally {
      setDeleteModalId(null)
    }
  }

  const inputClass =
    'w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-dark dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple text-sm'

  return (
    <div className='space-y-6 animate-fadeIn'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h2 className='text-2xl font-bold text-dark dark:text-white'>
            Instructors & Mentors
          </h2>
          <p className='text-sm text-gray-500'>
            Manage live backend faculty members, teaching assignments, and
            contact profiles.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className='bg-primary-purple hover:bg-primary-purple/90 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-sm'
        >
          <UserPlus size={16} /> Add Instructor
        </button>
      </div>

      {isLoading ? (
        <div className='h-96 flex items-center justify-center'>
          <Loader2 className='w-6 h-6 animate-spin text-primary-purple' />
        </div>
      ) : instructors.length === 0 ? (
        <div className='bg-white dark:bg-gray-900 p-12 text-center rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3'>
          <GraduationCap size={40} className='mx-auto text-gray-400' />
          <p className='text-sm font-medium text-gray-500'>
            No live instructors registered in the directory.
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {instructors.map((instructor) => (
            <div
              key={instructor.id}
              className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4 flex flex-col justify-between'
            >
              <div className='space-y-3'>
                <div className='flex justify-between items-start'>
                  <div className='w-12 h-12 rounded-full bg-primary-purple/10 text-primary-purple font-bold flex items-center justify-center text-sm'>
                    {instructor.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div className='flex items-center gap-1 text-amber-500 font-bold text-xs bg-amber-500/10 px-2 py-1 rounded-full'>
                    <Star size={12} fill='currentColor' />{' '}
                    {instructor.rating || 4.9}
                  </div>
                </div>

                <div>
                  <h3 className='text-base font-bold text-dark dark:text-white'>
                    {instructor.name}
                  </h3>
                  <p className='text-xs font-semibold text-primary-purple'>
                    {instructor.role}
                  </p>
                </div>

                <div className='space-y-1 text-xs text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-800'>
                  <div className='flex items-center gap-1.5'>
                    <Mail size={12} /> {instructor.email}
                  </div>
                  <div className='flex items-center gap-1.5'>
                    <Phone size={12} /> {instructor.phone || 'No phone listed'}
                  </div>
                  <div className='flex items-center gap-1.5 pt-1 text-dark dark:text-gray-300 font-medium'>
                    <BookOpen size={12} className='text-primary-purple' />{' '}
                    <span className='truncate'>
                      Assigned:{' '}
                      {instructor.specialty ||
                        instructor.assignedCourse ||
                        'None'}
                    </span>
                  </div>
                </div>
              </div>

              <div className='space-y-2 pt-4 border-t border-gray-100 dark:border-gray-800'>
                <button
                  onClick={() => {
                    setAssignModalInstructor(instructor)
                    setSelectedCourseId('')
                  }}
                  className='w-full py-2 rounded-xl bg-primary-purple/10 hover:bg-primary-purple/20 text-xs font-semibold text-primary-purple flex items-center justify-center gap-1.5 transition cursor-pointer'
                >
                  <LinkIcon size={14} /> Assign Course
                </button>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={() => handleOpenEditModal(instructor)}
                    className='flex-1 py-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300 flex items-center justify-center gap-1 transition cursor-pointer'
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteModalId(instructor.id)}
                    className='px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-xs font-medium text-red-600 flex items-center justify-center gap-1 transition cursor-pointer'
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assign Course Modal */}
      {assignModalInstructor && (
        <div className='fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn'>
          <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl'>
            <div className='flex justify-between items-center border-b pb-3 dark:border-gray-800'>
              <h3 className='text-base font-bold text-dark dark:text-white'>
                Assign Course to {assignModalInstructor.name}
              </h3>
              <button
                onClick={() => setAssignModalInstructor(null)}
                className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer'
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAssignCourseSubmit} className='space-y-4'>
              <div>
                <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5'>
                  Select Course / Track
                </label>
                <select
                  required
                  className={inputClass}
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                >
                  <option value='' disabled>
                    Choose a course...
                  </option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.title}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className='flex justify-end gap-2 pt-2'>
                <button
                  type='button'
                  onClick={() => setAssignModalInstructor(null)}
                  className='px-4 py-2 rounded-xl text-xs font-semibold border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-5 py-2 rounded-xl text-xs font-semibold bg-primary-purple text-white hover:opacity-90 shadow-sm cursor-pointer'
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn'>
          <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl scale-100 transition-transform'>
            <div className='flex justify-between items-center border-b pb-4 dark:border-gray-800'>
              <h3 className='text-lg font-bold text-dark dark:text-white'>
                {editingInstructor
                  ? 'Edit Faculty Member'
                  : 'Add New Instructor'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer'
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveInstructor} className='space-y-4'>
              <div>
                <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                  Full Name
                </label>
                <input
                  type='text'
                  required
                  placeholder='e.g., John Doe'
                  className={inputClass}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                    Email Address
                  </label>
                  <input
                    type='email'
                    required
                    placeholder='instructor@denskill.org'
                    className={inputClass}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                    Phone Number
                  </label>
                  <input
                    type='text'
                    placeholder='+234 800 000 0000'
                    className={inputClass}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                  Faculty Role / Title
                </label>
                <input
                  type='text'
                  required
                  placeholder='e.g., Senior Backend Instructor'
                  className={inputClass}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>

              <div>
                <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                  Specialty / Assigned Programme
                </label>
                <select
                  required
                  className={inputClass}
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                >
                  <option value='' disabled>
                    Select assigned course track...
                  </option>
                  {PROGRAMMES.map((prog) => (
                    <option key={prog} value={prog}>
                      {prog}
                    </option>
                  ))}
                </select>
              </div>

              {!editingInstructor && (
                <div>
                  <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                    Initial Login Password
                  </label>
                  <div className='relative'>
                    <input
                      type='text'
                      required
                      placeholder='Temporary system password'
                      className={inputClass}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Lock
                      size={16}
                      className='absolute right-3 top-3.5 text-gray-400'
                    />
                  </div>
                </div>
              )}

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
                  className='px-5 py-2 rounded-xl text-xs font-semibold bg-primary-purple text-white hover:opacity-90 shadow-sm cursor-pointer'
                >
                  {editingInstructor ? 'Save Changes' : 'Add Instructor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalId && (
        <div className='fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn'>
          <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl'>
            <div className='w-12 h-12 bg-red-500/10 text-red-600 rounded-full flex items-center justify-center mx-auto'>
              <AlertCircle size={24} />
            </div>
            <h3 className='text-lg font-bold text-dark dark:text-white'>
              Delete Instructor?
            </h3>
            <p className='text-xs text-gray-500 dark:text-gray-400'>
              Are you sure you want to remove this instructor from the roster?
              This action is permanent.
            </p>
            <div className='flex gap-2 pt-2'>
              <button
                onClick={() => setDeleteModalId(null)}
                className='flex-1 py-2 rounded-xl text-xs font-semibold border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer'
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteInstructor}
                className='flex-1 py-2 rounded-xl text-xs font-semibold bg-red-600 text-white hover:bg-red-700 shadow-sm cursor-pointer'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Notification Modal */}
      {alertModal.isOpen && (
        <div className='fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn'>
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
            <p className='text-xs text-gray-500 dark:text-gray-400'>
              {alertModal.message}
            </p>
            <button
              onClick={() =>
                setAlertModal((prev) => ({ ...prev, isOpen: false }))
              }
              className='w-full py-2.5 rounded-xl text-xs font-semibold bg-primary-purple text-white hover:opacity-90 shadow-sm cursor-pointer'
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  )
}