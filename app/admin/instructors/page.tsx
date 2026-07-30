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
} from 'lucide-react'
import { apiClient } from '@/services/api'

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

export default function AdminInstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(
    null,
  )

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('')
  const [specialty, setSpecialty] = useState('')

  const fetchInstructors = async () => {
    setIsLoading(true)
    setErrorMessage('')
    try {
      const response = await apiClient.getAdminInstructors()
      const payload = response?.data || response
      const list = Array.isArray(payload)
        ? payload
        : payload?.instructors || payload?.data || []

      setInstructors(
        list.map((ins: any) => ({
          id: String(ins.id || ins._id || Date.now()),
          name: ins.name || 'Faculty Member',
          email: ins.email || '',
          phone: ins.phone || '+234 800 000 0000',
          role: ins.role || 'Instructor',
          assignedCourse:
            ins.assignedCourse || ins.specialty || 'General Engineering',
          specialty:
            ins.specialty || ins.assignedCourse || 'General Engineering',
          rating: ins.rating || 4.9,
        })),
      )
    } catch (err: any) {
      setErrorMessage(
        err?.message || 'Failed to load instructors from backend.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInstructors()
  }, [])

  const handleOpenAddModal = () => {
    setEditingInstructor(null)
    setName('')
    setEmail('')
    setPhone('')
    setRole('')
    setSpecialty('')
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (instructor: Instructor) => {
    setEditingInstructor(instructor)
    setName(instructor.name)
    setEmail(instructor.email)
    setPhone(instructor.phone || '')
    setRole(instructor.role)
    setSpecialty(instructor.specialty || instructor.assignedCourse || '')
    setIsModalOpen(true)
  }

  const handleSaveInstructor = async (e: FormEvent) => {
    e.preventDefault()
    if (!name || !email || !role) return

    try {
      const payload = {
        name,
        email,
        specialty: specialty || role,
        role,
      }

      if (editingInstructor) {
        await apiClient.updateInstructor(editingInstructor.id, payload)
      } else {
        await apiClient.createInstructor(payload)
      }

      setIsModalOpen(false)
      fetchInstructors()
    } catch (err: any) {
      alert(err?.message || 'Failed to save instructor configuration.')
    }
  }

  const handleDeleteInstructor = async (id: string) => {
    if (
      confirm(
        'Are you sure you want to delete this instructor from the backend?',
      )
    ) {
      try {
        await apiClient.deleteInstructor(id)
        fetchInstructors()
      } catch (err: any) {
        alert(err?.message || 'Failed to delete instructor.')
      }
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

      {errorMessage && (
        <div className='p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-medium'>
          <AlertCircle size={20} className='shrink-0' />
          <span>{errorMessage}</span>
        </div>
      )}

      {isLoading ? (
        <div className='h-96 flex items-center justify-center'>
          <Loader2 className='w-6 h-6 animate-spin text-primary-purple' />
        </div>
      ) : instructors.length === 0 ? (
        <div className='bg-white dark:bg-gray-900 p-12 text-center rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3'>
          <GraduationCap size={40} className='mx-auto text-gray-400' />
          <p className='text-sm font-medium text-gray-500'>
            No instructors registered in the backend database.
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
                    <Phone size={12} /> {instructor.phone}
                  </div>
                  <div className='flex items-center gap-1.5 pt-1 text-dark dark:text-gray-300 font-medium'>
                    <BookOpen size={12} className='text-primary-purple' />{' '}
                    {instructor.specialty || instructor.assignedCourse}
                  </div>
                </div>
              </div>

              <div className='flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-gray-800'>
                <button
                  onClick={() => handleOpenEditModal(instructor)}
                  className='flex-1 py-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300 flex items-center justify-center gap-1 transition cursor-pointer'
                >
                  <Edit3 size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDeleteInstructor(instructor.id)}
                  className='px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-xs font-medium text-red-600 flex items-center justify-center gap-1 transition cursor-pointer'
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4'>
          <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-xl animate-fadeIn'>
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
                  placeholder='e.g., Hilosthone Sulyman'
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
                <input
                  type='text'
                  required
                  placeholder='e.g., Full-Stack Engineering'
                  className={inputClass}
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                />
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
                  className='px-5 py-2 rounded-xl text-xs font-semibold bg-primary-purple text-white hover:opacity-90 shadow-sm cursor-pointer'
                >
                  {editingInstructor ? 'Save Changes' : 'Add Instructor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
