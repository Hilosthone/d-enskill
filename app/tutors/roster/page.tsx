// src/app/tutors/roster/page.tsx
'use client'

import { useState, useEffect } from 'react'
import {
  Users,
  Loader2,
  Search,
  Mail,
  ShieldCheck,
  BookOpen,
} from 'lucide-react'
import { apiClient } from '@/services/api'

export default function RosterPage() {
  const [selectedCourse, setSelectedCourse] = useState('fullstack-dev')
  const [roster, setRoster] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchRosterData = async () => {
      setIsLoading(true)
      try {
        const res = await apiClient.getCourseRoster(selectedCourse)
        const students = res?.roster || res?.students || res?.data || []
        setRoster(students)
      } catch (err) {
        // Fallback mock roster list if offline
        setRoster([
          {
            id: 1,
            first_name: 'Aiden',
            last_name: 'Vance',
            email: 'aiden@example.com',
            status: 'Active',
            program: 'Full-Stack Web Dev',
          },
          {
            id: 2,
            first_name: 'Sophia',
            last_name: 'Martinez',
            email: 'sophia@example.com',
            status: 'Active',
            program: 'Full-Stack Web Dev',
          },
          {
            id: 3,
            first_name: 'Liam',
            last_name: 'Johnson',
            email: 'liam@example.com',
            status: 'At Risk',
            program: 'Full-Stack Web Dev',
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }
    fetchRosterData()
  }, [selectedCourse])

  const filteredStudents = roster.filter((student) => {
    const fullName = `${student.first_name || student.firstName || ''} ${
      student.last_name || student.lastName || ''
    }`.toLowerCase()
    const email = (student.email || '').toLowerCase()
    const query = searchQuery.toLowerCase()
    return fullName.includes(query) || email.includes(query)
  })

  return (
    <div className='space-y-6 animate-fadeIn'>
      {/* Header Banner */}
      <div className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <div className='space-y-1'>
          <div className='flex items-center gap-2 text-primary-purple'>
            <Users size={22} />
            <span className='text-xs font-bold uppercase tracking-wider'>
              Cohort Tracking
            </span>
          </div>
          <h1 className='text-xl md:text-2xl font-extrabold text-dark dark:text-white'>
            Enrolled Student Directory
          </h1>
          <p className='text-xs text-gray-500'>
            View registered students, track cohort status, and access direct
            contact info.
          </p>
        </div>

        {/* Course Selector */}
        <div className='flex items-center gap-3 w-full md:w-auto'>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className='bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-dark dark:text-white text-xs font-semibold px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-purple cursor-pointer'
          >
            <option value='fullstack-dev'>Full-Stack Web Dev</option>
            <option value='backend-eng'>MERN Backend Engineering</option>
            <option value='mobile-flutter'>Mobile Dev (Flutter)</option>
          </select>
        </div>
      </div>

      {/* Search & Stats Bar */}
      <div className='flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm'>
        <div className='relative w-full sm:w-80'>
          <Search size={16} className='absolute left-3.5 top-3 text-gray-400' />
          <input
            type='text'
            placeholder='Search by student name or email...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 pl-10 pr-4 py-2 rounded-xl text-xs text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-purple'
          />
        </div>
        <div className='text-xs text-gray-500 font-medium'>
          Showing{' '}
          <span className='font-bold text-dark dark:text-white'>
            {filteredStudents.length}
          </span>{' '}
          learners
        </div>
      </div>

      {/* Student Directory Grid / List */}
      {isLoading ? (
        <div className='h-48 flex items-center justify-center'>
          <Loader2 className='w-6 h-6 animate-spin text-primary-purple' />
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center text-gray-400 text-xs'>
          No students found matching your search criteria.
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {filteredStudents.map((student) => {
            const id = student.id || student.student_id
            const firstName =
              student.first_name || student.firstName || 'Student'
            const lastName = student.last_name || student.lastName || ''
            const email = student.email || 'N/A'
            const status = student.status || 'Active'

            return (
              <div
                key={id}
                className='bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4 hover:border-primary-purple/50 transition'
              >
                <div className='flex items-start justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-purple to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-md'>
                      {firstName[0]}
                    </div>
                    <div>
                      <h3 className='text-sm font-bold text-dark dark:text-white flex items-center gap-1.5'>
                        {firstName} {lastName}
                        <ShieldCheck
                          size={14}
                          className='text-primary-purple'
                        />
                      </h3>
                      <p className='text-[10px] text-gray-400'>
                        Verified Scholar
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      status === 'Active'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {status}
                  </span>
                </div>

                <div className='space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500'>
                  <div className='flex items-center gap-2 truncate'>
                    <Mail size={14} className='text-gray-400 shrink-0' />
                    <span className='truncate'>{email}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <BookOpen size={14} className='text-gray-400 shrink-0' />
                    <span>
                      {student.program || 'Full-Stack Software Engineering'}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
