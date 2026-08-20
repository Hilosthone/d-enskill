// src/app/tutors/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import {
  BookOpen,
  Users,
  Video,
  FileText,
  TrendingUp,
  Megaphone,
  CheckSquare,
  ArrowRight,
  Loader2,
  Calendar,
} from 'lucide-react'
import { apiClient } from '@/services/api'

export default function TutorDashboardPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [courseId, setCourseId] = useState<string>('1') // Default active course ID

  // Quick stats & summary states
  const [analytics, setAnalytics] = useState<any>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      try {
        const res = await apiClient.getCourseAnalytics(courseId)
        setAnalytics(res?.data || res)
      } catch (err) {
        // Fallback default analytics
        setAnalytics({
          totalStudents: 48,
          averageGrade: '82.4%',
          pendingSubmissions: 12,
          upcomingSessions: 3,
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchDashboardData()
  }, [courseId])

  const quickLinks = [
    {
      title: 'Manage Assessments & Grading',
      desc: 'Create quizzes, assign grades, and submit code reviews.',
      icon: <FileText className='text-primary-purple' size={24} />,
      href: '/tutors/assessments',
    },
    {
      title: 'Course Modules & Resources',
      desc: 'Upload weekly lectures, reading notes, and resource links.',
      icon: <BookOpen className='text-blue-500' size={24} />,
      href: '/tutors/modules',
    },
    {
      title: 'Live Lecture Sessions',
      desc: 'Schedule Zoom/Meet office hours and view past session logs.',
      icon: <Video className='text-emerald-500' size={24} />,
      href: '/tutors/sessions',
    },
    {
      title: 'Student Roster & Attendance',
      desc: 'View enrolled cohort students and log daily attendance.',
      icon: <Users className='text-amber-500' size={24} />,
      href: '/tutors/roster',
    },
  ]

  return (
    <div className='space-y-6 animate-fadeIn'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-dark dark:text-white'>
            Instructor Dashboard
          </h1>
          <p className='text-sm text-gray-500'>
            Welcome back! Here is an overview of your active cohort engagement
            and grading queues.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-xs font-semibold text-gray-500'>
            Active Course ID:
          </span>
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className='p-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs font-medium text-dark dark:text-white focus:outline-none'
          >
            <option value='1'>Full-Stack Engineering (Cohort 4)</option>
            <option value='2'>Mobile App Development (Flutter)</option>
            <option value='3'>Backend Architecture & Node.js</option>
          </select>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <div className='bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-2'>
          <div className='flex items-center justify-between text-gray-500 text-xs font-semibold'>
            <span>Enrolled Students</span>
            <Users size={16} className='text-primary-purple' />
          </div>
          <div className='text-2xl font-bold text-dark dark:text-white'>
            {isLoading ? (
              <Loader2 size={20} className='animate-spin' />
            ) : (
              analytics?.totalStudents || 48
            )}
          </div>
          <p className='text-[11px] text-emerald-500 font-medium'>
            +4 new enrollments this week
          </p>
        </div>

        <div className='bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-2'>
          <div className='flex items-center justify-between text-gray-500 text-xs font-semibold'>
            <span>Average Class Grade</span>
            <TrendingUp size={16} className='text-emerald-500' />
          </div>
          <div className='text-2xl font-bold text-dark dark:text-white'>
            {isLoading ? (
              <Loader2 size={20} className='animate-spin' />
            ) : (
              analytics?.averageGrade || '82.4%'
            )}
          </div>
          <p className='text-[11px] text-gray-400'>
            Based on submitted assignments
          </p>
        </div>

        <div className='bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-2'>
          <div className='flex items-center justify-between text-gray-500 text-xs font-semibold'>
            <span>Pending Submissions</span>
            <CheckSquare size={16} className='text-amber-500' />
          </div>
          <div className='text-2xl font-bold text-dark dark:text-white'>
            {isLoading ? (
              <Loader2 size={20} className='animate-spin' />
            ) : (
              analytics?.pendingSubmissions || 12
            )}
          </div>
          <p className='text-[11px] text-amber-500 font-medium'>
            Requires grading review
          </p>
        </div>

        <div className='bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-2'>
          <div className='flex items-center justify-between text-gray-500 text-xs font-semibold'>
            <span>Upcoming Live Sessions</span>
            <Calendar size={16} className='text-blue-500' />
          </div>
          <div className='text-2xl font-bold text-dark dark:text-white'>
            {isLoading ? (
              <Loader2 size={20} className='animate-spin' />
            ) : (
              analytics?.upcomingSessions || 3
            )}
          </div>
          <p className='text-[11px] text-blue-500 font-medium'>
            Next session in 2 hours
          </p>
        </div>
      </div>

      {/* Navigation Quick Links Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 pt-4'>
        {quickLinks.map((link, idx) => (
          <a
            key={idx}
            href={link.href}
            className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-primary-purple/50 dark:hover:border-primary-purple/50 shadow-sm transition flex items-start justify-between group cursor-pointer'
          >
            <div className='flex items-start gap-4'>
              <div className='p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50'>
                {link.icon}
              </div>
              <div className='space-y-1'>
                <h3 className='text-base font-bold text-dark dark:text-white group-hover:text-primary-purple transition'>
                  {link.title}
                </h3>
                <p className='text-xs text-gray-500 max-w-sm'>{link.desc}</p>
              </div>
            </div>
            <ArrowRight
              size={18}
              className='text-gray-400 group-hover:text-primary-purple group-hover:translate-x-1 transition'
            />
          </a>
        ))}
      </div>
    </div>
  )
}
