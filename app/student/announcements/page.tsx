'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Calendar, Loader2 } from 'lucide-react'
import { apiClient } from '@/services/api'

interface Announcement {
  id?: string | number
  title: string
  date: string
  content: string
  tag: string
}

export default function StudentAnnouncementsPage() {
  const router = useRouter()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loggedIn = sessionStorage.getItem('isLoggedIn')
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('denskill_token')
        : null

    if (!loggedIn && !token) {
      router.push('/auth/login')
      return
    }

    const fetchAnnouncements = async () => {
      try {
        const response = await apiClient.getAnnouncements()

        // Handle different possible backend response formats (array or object containing list)
        const dataList = Array.isArray(response)
          ? response
          : response?.announcements || response?.data || []

        if (dataList.length > 0) {
          setAnnouncements(dataList)
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load announcements from server.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnnouncements()
  }, [router])

  return (
    <div className='p-6 md:p-12 space-y-6 max-w-5xl mx-auto'>
      <div>
        <h1 className='text-2xl font-bold text-dark dark:text-white'>
          Academy Announcements
        </h1>
        <p className='text-xs text-gray-500 mt-1'>
          Stay up to date with direct bulletins from the academy directors.
        </p>
      </div>

      {error && (
        <div className='p-3 bg-red-500/10 border border-red-500 text-red-600 text-sm rounded-lg font-medium'>
          {error}
        </div>
      )}

      {isLoading ? (
        <div className='space-y-4 animate-pulse'>
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className='p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3 shadow-sm'
            >
              <div className='flex items-center justify-between'>
                <div className='h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded-full'></div>
                <div className='h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded'></div>
              </div>
              <div className='h-6 w-3/4 bg-gray-200 dark:bg-gray-800 rounded'></div>
              <div className='space-y-2 pt-1'>
                <div className='h-3 w-full bg-gray-200 dark:bg-gray-800 rounded'></div>
                <div className='h-3 w-5/6 bg-gray-200 dark:bg-gray-800 rounded'></div>
              </div>
            </div>
          ))}
        </div>
      ) : announcements.length === 0 ? (
        <div className='p-8 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 text-gray-500 text-xs'>
          No announcements available at this time.
        </div>
      ) : (
        <div className='space-y-4'>
          {announcements.map((item, idx) => (
            <div
              key={item.id || idx}
              className='p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3'
            >
              <div className='flex items-center justify-between'>
                <span className='px-3 py-1 bg-primary-purple/10 text-primary-purple text-xs font-bold rounded-full'>
                  {item.tag || 'Bulletin'}
                </span>
                <span className='text-xs text-gray-400 flex items-center gap-1'>
                  <Calendar size={14} /> {item.date}
                </span>
              </div>
              <h3 className='font-bold text-dark dark:text-white text-lg'>
                {item.title}
              </h3>
              <p className='text-xs text-gray-600 dark:text-gray-300 leading-relaxed'>
                {item.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
