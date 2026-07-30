//src/app/student/dashboard/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  BookOpen,
  CheckCircle2,
  CreditCard,
  MessageCircle,
  ArrowRight,
  Award,
  Clock,
  Loader2,
  Bell,
  UserCheck,
} from 'lucide-react'
import { apiClient } from '@/services/api'

export default function StudentDashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [overview, setOverview] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loggedIn = sessionStorage.getItem('isLoggedIn')
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('denskill_token')
        : null
    const data = sessionStorage.getItem('pendingRegistration')

    if (!loggedIn && !token) {
      router.push('/programmes')
      return
    }

    if (data) {
      try {
        setProfile(JSON.parse(data))
      } catch (e) {
        setProfile({ firstName: 'Scholar' })
      }
    } else {
      setProfile({ firstName: 'Scholar' })
    }

    const fetchDashboardData = async () => {
      try {
        const response = apiClient.getDashboardOverview
          ? await apiClient.getDashboardOverview()
          : null

        if (response && response.status === 'success') {
          setOverview(response)
          if (response.user) {
            setProfile(response.user)
            sessionStorage.setItem(
              'pendingRegistration',
              JSON.stringify(response.user),
            )
          }
        } else {
          // Fallback to profile check if overview fails
          const profileRes = apiClient.getStudentProfile
            ? await apiClient.getStudentProfile()
            : null
          if (profileRes && (profileRes.user || profileRes.data)) {
            const userObj = profileRes.user || profileRes.data
            setProfile(userObj)
            sessionStorage.setItem(
              'pendingRegistration',
              JSON.stringify(userObj),
            )
          }
        }
      } catch (err) {
        // Fallback to session storage profile if network fails
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [router])

  if (isLoading) {
    return (
      <div className='h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center'>
        <Loader2 className='w-6 h-6 animate-spin text-primary-purple' />
      </div>
    )
  }

  if (!profile) return null

  const activeCourse = overview?.courses?.[0] || null
  const latestAnnouncement = overview?.announcements?.[0] || null

  return (
    <div className='p-6 md:p-12 space-y-8 max-w-5xl mx-auto'>
      {/* Welcome Banner */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm gap-4 relative overflow-hidden'>
        <div className='absolute right-0 top-0 w-32 h-32 bg-primary-purple/5 rounded-full blur-2xl pointer-events-none' />
        <div className='space-y-1 relative z-10'>
          <span className='text-[10px] uppercase tracking-wider text-gray-400 font-bold block'>
            Student Portal Dashboard
          </span>
          <h1 className='text-2xl md:text-3xl font-bold text-dark dark:text-white'>
            Welcome back, {profile.firstName || profile.name || 'Scholar'}! 👋
          </h1>
          <p className='text-xs text-gray-500 dark:text-gray-400'>
            Your technical workspace is initialized and ready for deployment.
          </p>
        </div>
        <div className='flex items-center gap-2 px-4 py-2 bg-primary-purple/10 text-primary-purple text-xs rounded-full font-bold relative z-10'>
          <Award size={16} /> Enrolled Scholar
        </div>
      </div>

      {/* Announcements Banner */}
      {latestAnnouncement && (
        <div className='p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-4'>
          <div className='p-2 bg-amber-500 text-white rounded-xl mt-0.5'>
            <Bell size={18} />
          </div>
          <div className='space-y-1'>
            <div className='flex items-center gap-2'>
              <h4 className='font-bold text-dark dark:text-white text-xs'>
                {latestAnnouncement.title}
              </h4>
              <span className='text-[10px] text-gray-400'>
                {new Date(latestAnnouncement.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className='text-xs text-gray-600 dark:text-gray-300'>
              {latestAnnouncement.content}
            </p>
          </div>
        </div>
      )}

      {/* Metrics / Overview Grid */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
        {/* Card 1: Active Program & Tutor */}
        <div className='p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between space-y-4'>
          <div>
            <div className='flex items-center justify-between text-gray-400 mb-2'>
              <span className='text-xs font-semibold'>Active Program</span>
              <BookOpen size={18} className='text-primary-purple' />
            </div>
            <p className='text-base font-bold text-dark dark:text-white leading-snug'>
              {activeCourse?.course ||
                profile.course ||
                profile.program ||
                'Mobile Development'}
            </p>
            {activeCourse?.tutor_name ? (
              <div className='mt-2 pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center gap-1.5 text-xs text-gray-500'>
                <UserCheck size={14} className='text-primary-purple' />
                <span>
                  Tutor:{' '}
                  <strong className='text-dark dark:text-white'>
                    {activeCourse.tutor_name}
                  </strong>
                </span>
              </div>
            ) : (
              <p className='text-[11px] text-gray-400 mt-1'>
                Tutor assignment pending
              </p>
            )}
          </div>
          <span className='text-[10px] bg-primary-purple/10 text-primary-purple px-2.5 py-1 rounded-md font-semibold inline-block w-fit'>
            Status: {activeCourse?.payment_status || 'Active'}
          </span>
        </div>

        {/* Card 2: Payment Status */}
        <div className='p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between space-y-4'>
          <div>
            <div className='flex items-center justify-between text-gray-400 mb-2'>
              <span className='text-xs font-semibold'>Credential Status</span>
              <CheckCircle2 size={18} className='text-green-600' />
            </div>
            <p className='text-lg font-bold text-green-600 flex items-center gap-1.5'>
              {activeCourse?.payment_status === 'partial'
                ? 'Partial / Verified'
                : 'Active / Verified'}
            </p>
            <p className='text-[11px] text-gray-500 mt-0.5'>
              {activeCourse
                ? `Paid ₦${Number(activeCourse.amount_paid).toLocaleString()} of ₦${Number(activeCourse.total_amount).toLocaleString()}`
                : 'Automated receipt generated.'}
            </p>
          </div>
          <button
            onClick={() => router.push('/student/receipts')}
            className='text-[11px] text-primary-purple font-bold hover:underline flex items-center gap-1 w-fit cursor-pointer'
          >
            View Digital Receipts <ArrowRight size={12} />
          </button>
        </div>

        {/* Card 3: Access Hub */}
        <div className='p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between space-y-4'>
          <div>
            <div className='flex items-center justify-between text-gray-400 mb-2'>
              <span className='text-xs font-semibold'>Access Level</span>
              <CreditCard size={18} className='text-primary-red' />
            </div>
            <p className='text-lg font-bold text-dark dark:text-white'>
              Full Hub Tier
            </p>
            <p className='text-[11px] text-gray-500 mt-0.5'>
              All technical modules unlocked.
            </p>
          </div>
          <button
            onClick={() => router.push('/student/payments')}
            className='text-[11px] text-primary-red font-bold hover:underline flex items-center gap-1 w-fit cursor-pointer'
          >
            Manage Billing & Balances <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* Community Callout Banner */}
      <div className='p-8 rounded-2xl bg-gradient-to-r from-primary-purple/10 via-blue-500/10 to-transparent border border-primary-purple/20 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm'>
        <div className='space-y-1 text-center md:text-left'>
          <h3 className='font-bold text-dark dark:text-white text-base flex items-center justify-center md:justify-start gap-2'>
            <MessageCircle className='text-primary-purple' size={20} />
            Academy Community Channel
          </h3>
          <p className='text-xs text-gray-600 dark:text-gray-300 max-w-xl'>
            Collaborate with fellow engineers, review daily milestones, and
            connect directly with lead technical instructors via our official
            cohort portal.
          </p>
        </div>
        <a
          href='https://wa.me/2348134984001'
          target='_blank'
          rel='noopener noreferrer'
          className='px-6 py-3 bg-green-600 text-white font-bold text-xs rounded-xl hover:bg-green-700 transition-all text-center whitespace-nowrap shadow-md flex items-center gap-2'
        >
          <span>Open WhatsApp Cohort</span>
          <ArrowRight size={14} />
        </a>
      </div>
    </div>
  )
}
