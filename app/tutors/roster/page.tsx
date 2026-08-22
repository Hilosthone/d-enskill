// src/app/tutors/roster/page.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Users,
  Loader2,
  Search,
  Mail,
  ShieldCheck,
  BookOpen,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import { apiClient } from '@/services/api'

type Course = {
  id?: string | number
  _id?: string | number
  course_id?: string | number
  course?: string | number
  name?: string
  title?: string
  course_name?: string
  courseName?: string
}

type Student = {
  id?: string | number
  student_id?: string | number
  first_name?: string
  last_name?: string
  firstName?: string
  lastName?: string
  email?: string
  status?: string
  program?: string
  course?: string
  course_name?: string
  courseName?: string
}

type ApiResponse = {
  data?: unknown
  courses?: Course[]
  roster?: Student[]
  students?: Student[]
}

const getCoursesFromResponse = (response: unknown): Course[] => {
  if (Array.isArray(response)) {
    return response as Course[]
  }

  if (!response || typeof response !== 'object') {
    return []
  }

  const data = response as ApiResponse

  if (Array.isArray(data.courses)) {
    return data.courses
  }

  if (Array.isArray(data.data)) {
    return data.data as Course[]
  }

  if (data.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
    const nested = data.data as ApiResponse

    if (Array.isArray(nested.courses)) {
      return nested.courses
    }

    if (Array.isArray(nested.data)) {
      return nested.data as Course[]
    }
  }

  return []
}

const getStudentsFromResponse = (response: unknown): Student[] => {
  if (Array.isArray(response)) {
    return response as Student[]
  }

  if (!response || typeof response !== 'object') {
    return []
  }

  const data = response as ApiResponse

  if (Array.isArray(data.roster)) {
    return data.roster
  }

  if (Array.isArray(data.students)) {
    return data.students
  }

  if (Array.isArray(data.data)) {
    return data.data as Student[]
  }

  if (data.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
    const nested = data.data as ApiResponse

    if (Array.isArray(nested.roster)) {
      return nested.roster
    }

    if (Array.isArray(nested.students)) {
      return nested.students
    }

    if (Array.isArray(nested.data)) {
      return nested.data as Student[]
    }
  }

  return []
}

const getCourseId = (course: Course): string => {
  const id = course.id ?? course._id ?? course.course_id ?? course.course

  return id !== undefined && id !== null ? String(id) : ''
}

const getCourseName = (course: Course): string => {
  return (
    course.name ||
    course.title ||
    course.course_name ||
    course.courseName ||
    String(course.course || '') ||
    'Unnamed Course'
  )
}

const getStudentId = (student: Student, index: number): string => {
  const id = student.id ?? student.student_id

  return id !== undefined && id !== null ? String(id) : `student-${index}`
}

const getStudentName = (student: Student) => {
  const firstName =
    student.first_name?.trim() || student.firstName?.trim() || 'Student'

  const lastName = student.last_name?.trim() || student.lastName?.trim() || ''

  return {
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`.trim(),
  }
}

const getStatusClass = (status: string) => {
  const normalized = status.toLowerCase()

  if (
    normalized === 'active' ||
    normalized === 'enrolled' ||
    normalized === 'present'
  ) {
    return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
  }

  if (
    normalized === 'inactive' ||
    normalized === 'suspended' ||
    normalized === 'withdrawn'
  ) {
    return 'bg-red-500/10 text-red-600 dark:text-red-400'
  }

  return 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
}

export default function RosterPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState('')

  const [roster, setRoster] = useState<Student[]>([])

  const [isLoadingCourses, setIsLoadingCourses] = useState(true)
  const [isLoadingRoster, setIsLoadingRoster] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  /*
   * ============================================================
   * FETCH COURSES ASSIGNED TO LOGGED-IN TUTOR
   * ============================================================
   */
  const fetchAssignedCourses = async () => {
    setIsLoadingCourses(true)
    setErrorMessage('')

    try {
      const response = await apiClient.getTutorAssignedCourses()

      const assignedCourses = getCoursesFromResponse(response)

      const validCourses = assignedCourses.filter((course) =>
        getCourseId(course),
      )

      setCourses(validCourses)

      /*
       * Automatically select the first course assigned to
       * the currently authenticated tutor.
       *
       * NO HARDCODED COURSE ID.
       */
      if (validCourses.length > 0) {
        const firstCourseId = getCourseId(validCourses[0])

        setSelectedCourse((current) => {
          if (
            current &&
            validCourses.some((course) => getCourseId(course) === current)
          ) {
            return current
          }

          return firstCourseId
        })
      } else {
        setSelectedCourse('')
        setRoster([])
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to load courses assigned to this tutor.'

      setCourses([])
      setSelectedCourse('')
      setRoster([])
      setErrorMessage(message)
    } finally {
      setIsLoadingCourses(false)
    }
  }

  /*
   * ============================================================
   * FETCH ROSTER FOR SELECTED ASSIGNED COURSE
   * ============================================================
   */
  const fetchRoster = async (refresh = false) => {
    if (!selectedCourse) {
      setRoster([])
      return
    }

    if (refresh) {
      setIsRefreshing(true)
    } else {
      setIsLoadingRoster(true)
    }

    setErrorMessage('')

    try {
      const response = await apiClient.getCourseRoster(selectedCourse)

      const students = getStudentsFromResponse(response)

      setRoster(students)
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to load the student roster.'

      setRoster([])
      setErrorMessage(message)
    } finally {
      setIsLoadingRoster(false)
      setIsRefreshing(false)
    }
  }

  /*
   * ============================================================
   * INITIAL LOAD
   * ============================================================
   */
  useEffect(() => {
    fetchAssignedCourses()
  }, [])

  /*
   * ============================================================
   * LOAD ROSTER WHEN COURSE CHANGES
   * ============================================================
   */
  useEffect(() => {
    if (!selectedCourse) {
      setRoster([])
      return
    }

    fetchRoster()
  }, [selectedCourse])

  /*
   * ============================================================
   * FILTER STUDENTS
   * ============================================================
   */
  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    if (!query) {
      return roster
    }

    return roster.filter((student) => {
      const { fullName } = getStudentName(student)

      const email = (student.email || '').toLowerCase()

      const program = (
        student.program ||
        student.course_name ||
        student.courseName ||
        student.course ||
        ''
      ).toLowerCase()

      return (
        fullName.toLowerCase().includes(query) ||
        email.includes(query) ||
        program.includes(query)
      )
    })
  }, [roster, searchQuery])

  /*
   * ============================================================
   * ACTIVE STUDENT COUNT
   * ============================================================
   */
  const activeStudents = useMemo(() => {
    return roster.filter((student) => {
      const status = (student.status || 'Active').toLowerCase()

      return (
        status === 'active' || status === 'enrolled' || status === 'present'
      )
    }).length
  }, [roster])

  const selectedCourseObject = useMemo(() => {
    return courses.find((course) => getCourseId(course) === selectedCourse)
  }, [courses, selectedCourse])

  /*
   * ============================================================
   * LOADING COURSES
   * ============================================================
   */
  if (isLoadingCourses) {
    return (
      <div className='min-h-[400px] flex items-center justify-center'>
        <div className='flex flex-col items-center gap-3'>
          <Loader2 className='w-7 h-7 animate-spin text-primary-purple' />

          <p className='text-xs text-gray-400'>
            Loading your assigned courses...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6 animate-fadeIn'>
      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <div className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm'>
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5'>
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
              View students enrolled in your assigned courses and access their
              contact information.
            </p>
          </div>

          {/* ================================================== */}
          {/* DYNAMIC COURSE SELECTOR */}
          {/* ================================================== */}

          <div className='flex items-center gap-3'>
            <select
              value={selectedCourse}
              onChange={(event) => setSelectedCourse(event.target.value)}
              disabled={courses.length === 0}
              className='min-w-[220px] bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-dark dark:text-white text-xs font-semibold px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-purple cursor-pointer disabled:opacity-50'
            >
              {courses.length === 0 ? (
                <option value=''>No assigned courses</option>
              ) : (
                courses.map((course, index) => {
                  const id = getCourseId(course)

                  return (
                    <option key={id || `course-${index}`} value={id}>
                      {getCourseName(course)}
                    </option>
                  )
                })
              )}
            </select>

            <button
              type='button'
              onClick={() => fetchRoster(true)}
              disabled={!selectedCourse || isLoadingRoster || isRefreshing}
              className='inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:border-primary-purple hover:text-primary-purple transition disabled:opacity-50'
            >
              <RefreshCw
                size={15}
                className={isRefreshing ? 'animate-spin' : ''}
              />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* ====================================================== */}
      {/* ERROR */}
      {/* ====================================================== */}

      {errorMessage && (
        <div className='p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-semibold flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
          <div className='flex items-center gap-2'>
            <AlertCircle size={17} className='shrink-0' />

            <span>{errorMessage}</span>
          </div>

          <button
            type='button'
            onClick={() => {
              if (!selectedCourse) {
                fetchAssignedCourses()
              } else {
                fetchRoster(true)
              }
            }}
            disabled={isRefreshing}
            className='inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition disabled:opacity-50'
          >
            <RefreshCw
              size={14}
              className={isRefreshing ? 'animate-spin' : ''}
            />
            Retry
          </button>
        </div>
      )}

      {/* ====================================================== */}
      {/* NO ASSIGNED COURSES */}
      {/* ====================================================== */}

      {courses.length === 0 ? (
        <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center'>
          <div className='w-14 h-14 rounded-full bg-primary-purple/10 text-primary-purple flex items-center justify-center mx-auto mb-4'>
            <BookOpen size={25} />
          </div>

          <h2 className='text-base font-bold text-dark dark:text-white'>
            No Courses Assigned
          </h2>

          <p className='text-xs text-gray-400 max-w-md mx-auto mt-2'>
            No course has been assigned to your tutor account yet. Once an
            administrator assigns a course to you, its student roster will
            appear here.
          </p>
        </div>
      ) : (
        <>
          {/* ================================================== */}
          {/* COURSE INFORMATION */}
          {/* ================================================== */}

          <div className='bg-primary-purple/5 border border-primary-purple/10 rounded-2xl p-4'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-xl bg-primary-purple/10 text-primary-purple flex items-center justify-center'>
                <BookOpen size={18} />
              </div>

              <div>
                <p className='text-[10px] text-primary-purple font-bold uppercase tracking-wide'>
                  Currently Selected Course
                </p>

                <h2 className='text-sm font-bold text-dark dark:text-white'>
                  {selectedCourseObject
                    ? getCourseName(selectedCourseObject)
                    : 'Loading course...'}
                </h2>
              </div>
            </div>
          </div>

          {/* ================================================== */}
          {/* STATS */}
          {/* ================================================== */}

          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
            {/* Total */}
            <div className='bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-[11px] font-semibold text-gray-400 uppercase tracking-wide'>
                    Total Students
                  </p>

                  <p className='text-2xl font-bold text-dark dark:text-white mt-1'>
                    {isLoadingRoster ? (
                      <Loader2
                        size={21}
                        className='animate-spin text-primary-purple'
                      />
                    ) : (
                      roster.length
                    )}
                  </p>
                </div>

                <div className='w-10 h-10 rounded-xl bg-primary-purple/10 text-primary-purple flex items-center justify-center'>
                  <Users size={19} />
                </div>
              </div>
            </div>

            {/* Active */}
            <div className='bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-[11px] font-semibold text-gray-400 uppercase tracking-wide'>
                    Active Students
                  </p>

                  <p className='text-2xl font-bold text-dark dark:text-white mt-1'>
                    {isLoadingRoster ? (
                      <Loader2
                        size={21}
                        className='animate-spin text-primary-purple'
                      />
                    ) : (
                      activeStudents
                    )}
                  </p>
                </div>

                <div className='w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center'>
                  <ShieldCheck size={19} />
                </div>
              </div>
            </div>

            {/* Search */}
            <div className='bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm'>
              <div className='relative'>
                <Search
                  size={16}
                  className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400'
                />

                <input
                  type='text'
                  placeholder='Search name, email or program...'
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className='w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 pl-10 pr-4 py-2.5 rounded-xl text-xs text-dark dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple'
                />
              </div>
            </div>
          </div>

          {/* ================================================== */}
          {/* RESULT COUNT */}
          {/* ================================================== */}

          {!isLoadingRoster && (
            <div className='flex items-center justify-between'>
              <div>
                <h2 className='text-sm font-bold text-dark dark:text-white'>
                  Student Roster
                </h2>

                <p className='text-[11px] text-gray-400 mt-0.5'>
                  Showing {filteredStudents.length} of {roster.length} learners
                </p>
              </div>

              {searchQuery.trim() && (
                <button
                  type='button'
                  onClick={() => setSearchQuery('')}
                  className='text-xs font-semibold text-primary-purple hover:underline'
                >
                  Clear Search
                </button>
              )}
            </div>
          )}

          {/* ================================================== */}
          {/* ROSTER */}
          {/* ================================================== */}

          {isLoadingRoster ? (
            <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 h-64 flex items-center justify-center'>
              <div className='flex flex-col items-center gap-3'>
                <Loader2 className='w-7 h-7 animate-spin text-primary-purple' />

                <p className='text-xs text-gray-400'>
                  Loading student roster...
                </p>
              </div>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center'>
              <div className='w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4'>
                <Users size={22} className='text-gray-400' />
              </div>

              <h3 className='text-sm font-bold text-dark dark:text-white'>
                {roster.length === 0
                  ? 'No Students Enrolled'
                  : 'No Students Found'}
              </h3>

              <p className='text-xs text-gray-400 max-w-sm mx-auto mt-1'>
                {roster.length === 0
                  ? 'There are currently no students enrolled in this assigned course.'
                  : 'No students match your current search criteria.'}
              </p>

              {searchQuery.trim() && (
                <button
                  type='button'
                  onClick={() => setSearchQuery('')}
                  className='mt-4 px-4 py-2 rounded-xl bg-primary-purple text-white text-xs font-semibold hover:bg-primary-purple/90 transition'
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {filteredStudents.map((student, index) => {
                const id = getStudentId(student, index)

                const { firstName, fullName } = getStudentName(student)

                const email = student.email?.trim() || 'No email available'

                const status = student.status?.trim() || 'Active'

                const program =
                  student.program?.trim() ||
                  student.course_name?.trim() ||
                  student.courseName?.trim() ||
                  student.course?.trim() ||
                  'Program not specified'

                return (
                  <div
                    key={id}
                    className='bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4 hover:border-primary-purple/50 hover:shadow-md transition'
                  >
                    {/* Student Header */}
                    <div className='flex items-start justify-between gap-3'>
                      <div className='flex items-center gap-3 min-w-0'>
                        <div className='w-10 h-10 rounded-xl bg-primary-purple/10 text-primary-purple font-bold flex items-center justify-center text-sm shrink-0'>
                          {firstName.charAt(0).toUpperCase()}
                        </div>

                        <div className='min-w-0'>
                          <h3 className='text-sm font-bold text-dark dark:text-white flex items-center gap-1.5'>
                            <span className='truncate'>{fullName}</span>

                            <ShieldCheck
                              size={14}
                              className='text-primary-purple shrink-0'
                            />
                          </h3>

                          <p className='text-[10px] text-gray-400'>
                            Verified Scholar
                          </p>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase whitespace-nowrap ${getStatusClass(
                          status,
                        )}`}
                      >
                        {status}
                      </span>
                    </div>

                    {/* Details */}
                    <div className='space-y-3 pt-3 border-t border-gray-100 dark:border-gray-800'>
                      <div className='flex items-start gap-2 text-xs text-gray-500'>
                        <Mail
                          size={14}
                          className='text-gray-400 shrink-0 mt-0.5'
                        />

                        <span className='truncate' title={email}>
                          {email}
                        </span>
                      </div>

                      <div className='flex items-start gap-2 text-xs text-gray-500'>
                        <BookOpen
                          size={14}
                          className='text-gray-400 shrink-0 mt-0.5'
                        />

                        <span className='line-clamp-2'>{program}</span>
                      </div>
                    </div>

                    {/* Student ID */}
                    {(student.id !== undefined ||
                      student.student_id !== undefined) && (
                      <div className='pt-2 border-t border-gray-100 dark:border-gray-800'>
                        <p className='text-[10px] text-gray-400'>
                          Student ID:{' '}
                          <span className='font-semibold text-gray-500 dark:text-gray-300'>
                            {String(student.id ?? student.student_id)}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
