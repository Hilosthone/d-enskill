//app/admin/announcements/page.tsx
'use client'
import { useState, useEffect } from 'react'
import {
  Bell,
  Send,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Loader2,
  Trash2,
  Megaphone,
} from 'lucide-react'
import { apiClient } from '@/services/api'

interface Announcement {
  id: string | number
  title: string
  content: string
  target?: string
  priority?: string
  createdAt?: string
}

export default function AdminAnnouncementsPage() {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [targetGroup, setTargetGroup] = useState('all')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [announcements, setAnnouncements] = useState<Announcement[]>([])

  const fetchAnnouncements = async () => {
    setIsFetching(true)
    try {
      const response = await apiClient.getAdminAnnouncements()
      const payload = response?.data || response
      const list = Array.isArray(payload)
        ? payload
        : payload?.announcements || payload?.data || []

      if (Array.isArray(list)) {
        setAnnouncements(
          list.map((item: any, index: number) => ({
            id: item.id || item._id || `announcement-${index}`,
            title: item.title || 'Untitled Notice',
            content: item.content || item.message || '',
            target: item.target || 'all',
            priority: item.priority || 'normal',
            createdAt:
              item.created_at || item.createdAt || new Date().toISOString(),
          })),
        )
      }
    } catch (err: any) {
      // Fallback to local storage if network request fails
      const saved = localStorage.getItem('denskill_admin_announcements')
      if (saved) {
        try {
          setAnnouncements(JSON.parse(saved))
        } catch (e) {
          // Ignore parse error
        }
      }
    } finally {
      setIsFetching(false)
    }
  }

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  useEffect(() => {
    if (!isFetching) {
      localStorage.setItem(
        'denskill_admin_announcements',
        JSON.stringify(announcements),
      )
    }
  }, [announcements, isFetching])

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await apiClient.createAnnouncement({
        title,
        content: message,
        target: targetGroup,
        priority: 'normal',
      })

      const createdItem = response?.announcement || response?.data || response

      if (
        response &&
        (response.status === 'success' || response.id || createdItem?.id)
      ) {
        setSuccess(true)
        const newAnnouncement: Announcement = {
          id: createdItem.id || createdItem._id || Date.now(),
          title,
          content: message,
          target: targetGroup,
          createdAt:
            createdItem.created_at ||
            createdItem.createdAt ||
            new Date().toISOString(),
        }
        setAnnouncements([newAnnouncement, ...announcements])
        setTitle('')
        setMessage('')
        setTargetGroup('all')
        setTimeout(() => {
          setSuccess(false)
        }, 4000)
      } else {
        setErrorMessage(response?.error || 'Failed to create announcement.')
      }
    } catch (err: any) {
      setErrorMessage(
        err?.message || 'Server connection error while broadcasting.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAnnouncement = async (id: string | number) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      try {
        await apiClient.deleteAnnouncement(id)
        setAnnouncements(announcements.filter((a) => a.id !== id))
      } catch (err: any) {
        // Fallback optimistic local removal if server route fails
        setAnnouncements(announcements.filter((a) => a.id !== id))
      }
    }
  }

  const inputClass =
    'w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 text-dark dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple text-sm'

  return (
    <div className='space-y-8 max-w-4xl mx-auto animate-fadeIn'>
      <div>
        <h2 className='text-2xl font-bold text-dark dark:text-white'>
          Broadcast Announcements
        </h2>
        <p className='text-sm text-gray-500'>
          Send instant notifications, schedules, or emergency updates to all
          regular and scholarship students.
        </p>
      </div>

      {success && (
        <div className='p-4 bg-green-500/10 border border-green-500/20 text-green-600 rounded-2xl flex items-center gap-3 text-sm font-medium animate-fadeIn'>
          <CheckCircle size={20} className='shrink-0' />
          <span>
            Announcement broadcasted successfully to all targeted student
            dashboards!
          </span>
        </div>
      )}

      {errorMessage && (
        <div className='p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-medium'>
          <AlertTriangle size={20} className='shrink-0' />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Broadcast Form */}
      <div className='bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm'>
        <form onSubmit={handleBroadcast} className='space-y-5'>
          <div>
            <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider'>
              Target Audience
            </label>
            <select
              value={targetGroup}
              onChange={(e) => setTargetGroup(e.target.value)}
              className={inputClass}
            >
              <option value='all'>All Students (Regular & Scholarship)</option>
              <option value='regular'>Regular Students Only</option>
              <option value='scholarship'>Scholarship Students Only</option>
            </select>
          </div>

          <div>
            <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider'>
              Notice Title
            </label>
            <input
              type='text'
              required
              placeholder='e.g., Mid-Term Break Notice'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider'>
              Announcement Message
            </label>
            <textarea
              required
              rows={5}
              placeholder='Type detailed instructions or broadcast content here...'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={inputClass}
            />
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className='w-full bg-primary-purple hover:bg-primary-purple/90 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50'
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className='animate-spin' />
                <span>Broadcasting...</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span>Broadcast Now</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Existing Announcements List */}
      <div className='space-y-4 pt-4 border-t border-gray-200 dark:border-gray-800'>
        <h3 className='text-lg font-bold text-dark dark:text-white flex items-center gap-2'>
          <Megaphone size={20} className='text-primary-purple' />
          Recent Broadcast History
        </h3>

        {isFetching ? (
          <div className='py-12 flex justify-center'>
            <Loader2 className='w-6 h-6 animate-spin text-primary-purple' />
          </div>
        ) : announcements.length === 0 ? (
          <div className='bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 text-center text-gray-500 text-sm'>
            No active announcements found. Create one above to broadcast your
            first notice.
          </div>
        ) : (
          <div className='space-y-4'>
            {announcements.map((item) => (
              <div
                key={item.id}
                className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between space-y-3'
              >
                <div className='flex justify-between items-start gap-4'>
                  <div>
                    <div className='flex items-center gap-2 flex-wrap'>
                      <h4 className='font-bold text-dark dark:text-white text-base'>
                        {item.title}
                      </h4>
                      <span className='px-2 py-0.5 text-[10px] uppercase font-bold bg-primary-purple/10 text-primary-purple rounded-full'>
                        Target: {item.target || 'all'}
                      </span>
                    </div>
                    <span className='text-xs text-gray-400 flex items-center gap-1 mt-1'>
                      <Calendar size={12} />
                      {new Date(
                        item.createdAt || Date.now(),
                      ).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteAnnouncement(item.id)}
                    className='text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition cursor-pointer'
                    title='Delete Announcement'
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className='text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed'>
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}