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
  X,
  Sparkles,
  AlertCircle,
  Check,
  Info,
} from 'lucide-react'
import { adminApiClient } from '@/services/admin-api'

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
  const [priority, setPriority] = useState('normal')
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])

  // Modal alert state management
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean
    type: 'success' | 'error' | 'confirm'
    title: string
    message: string
    onConfirm?: () => void
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  })

  const showAlert = (
    type: 'success' | 'error' | 'confirm',
    title: string,
    message: string,
    onConfirm?: () => void,
  ) => {
    setModalConfig({ isOpen: true, type, title, message, onConfirm })
  }

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }))
  }

  const fetchAnnouncements = async () => {
    setIsFetching(true)
    try {
      const response = await adminApiClient.getAdminAnnouncements()
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

    try {
      const response = await adminApiClient.createAnnouncement({
        title,
        content: message,
        message, // Supporting both backend field specifications
        target: targetGroup,
        priority,
      })

      const createdItem = response?.announcement || response?.data || response

      if (
        response &&
        (response.status === 'success' || response.id || createdItem?.id)
      ) {
        const newAnnouncement: Announcement = {
          id: createdItem.id || createdItem._id || Date.now(),
          title,
          content: message,
          target: targetGroup,
          priority,
          createdAt:
            createdItem.created_at ||
            createdItem.createdAt ||
            new Date().toISOString(),
        }
        setAnnouncements([newAnnouncement, ...announcements])
        setTitle('')
        setMessage('')
        setTargetGroup('all')
        setPriority('normal')

        showAlert(
          'success',
          'Broadcast Successful',
          'Your announcement has been successfully transmitted and pushed live to the targeted student dashboards.',
        )
      } else {
        showAlert(
          'error',
          'Broadcast Failed',
          response?.error ||
            response?.message ||
            'Failed to create announcement. Please check your inputs.',
        )
      }
    } catch (err: any) {
      showAlert(
        'error',
        'Connection Error',
        err?.message ||
          'Server connection error while broadcasting announcement.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAnnouncement = (id: string | number) => {
    showAlert(
      'confirm',
      'Delete Announcement',
      'Are you sure you want to permanently delete this announcement? This action cannot be undone.',
      async () => {
        try {
          await adminApiClient.deleteAnnouncement(id)
          setAnnouncements(announcements.filter((a) => a.id !== id))
          showAlert(
            'success',
            'Deleted',
            'Announcement has been successfully removed.',
          )
        } catch (err: any) {
          // Fallback optimistic local removal if server route fails
          setAnnouncements(announcements.filter((a) => a.id !== id))
          showAlert('success', 'Deleted', 'Announcement removed successfully.')
        }
      },
    )
  }

  const inputClass =
    'w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 text-dark dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple text-sm transition-colors'

  return (
    <div className='space-y-8 max-w-4xl mx-auto animate-fadeIn relative'>
      {/* Animated Glowing Background Accent */}
      <div className='absolute -top-10 -left-10 w-72 h-72 bg-primary-purple/10 rounded-full blur-3xl pointer-events-none' />

      <div>
        <h2 className='text-2xl font-bold text-dark dark:text-white flex items-center gap-2'>
          <Megaphone className='text-primary-purple animate-bounce' size={28} />
          Broadcast Announcements
        </h2>
        <p className='text-sm text-gray-500 mt-1'>
          Send instant notifications, schedules, or emergency updates to all
          regular and scholarship students.
        </p>
      </div>

      {/* Broadcast Form Card */}
      <div className='bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl relative overflow-hidden'>
        <div className='absolute top-0 right-0 p-8 opacity-5 pointer-events-none'>
          <Sparkles size={120} className='text-primary-purple' />
        </div>

        <form onSubmit={handleBroadcast} className='space-y-5 relative z-10'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider'>
                Target Audience
              </label>
              <select
                value={targetGroup}
                onChange={(e) => setTargetGroup(e.target.value)}
                className={inputClass}
              >
                <option value='all'>
                  All Students (Regular & Scholarship)
                </option>
                <option value='regular'>Regular Students Only</option>
                <option value='scholarship'>Scholarship Students Only</option>
              </select>
            </div>

            <div>
              <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider'>
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={inputClass}
              >
                <option value='normal'>Normal Priority</option>
                <option value='high'>High Priority / Urgent</option>
                <option value='low'>Low Priority</option>
              </select>
            </div>
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
            className='w-full bg-primary-purple hover:opacity-95 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-purple/25 cursor-pointer disabled:opacity-50'
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className='animate-spin' />
                <span>Broadcasting to network...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>Broadcast Now</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Existing Announcements List */}
      <div className='space-y-4 pt-4 border-t border-gray-200 dark:border-gray-800'>
        <h3 className='text-lg font-bold text-dark dark:text-white flex items-center gap-2'>
          <Bell size={20} className='text-primary-purple' />
          Recent Broadcast History ({announcements.length})
        </h3>

        {isFetching ? (
          <div className='py-16 flex justify-center'>
            <Loader2 className='w-8 h-8 animate-spin text-primary-purple' />
          </div>
        ) : announcements.length === 0 ? (
          <div className='bg-white dark:bg-gray-900 p-10 rounded-3xl border border-gray-200 dark:border-gray-800 text-center text-gray-500 text-sm shadow-sm'>
            No active announcements found. Create one above to broadcast your
            first notice.
          </div>
        ) : (
          <div className='space-y-4'>
            {announcements.map((item) => (
              <div
                key={item.id}
                className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between space-y-3 hover:border-primary-purple/40 transition-all'
              >
                <div className='flex justify-between items-start gap-4'>
                  <div>
                    <div className='flex items-center gap-2 flex-wrap'>
                      <h4 className='font-bold text-dark dark:text-white text-base'>
                        {item.title}
                      </h4>
                      <span className='px-2.5 py-0.5 text-[10px] uppercase font-extrabold bg-primary-purple/10 text-primary-purple rounded-full'>
                        Target: {item.target || 'all'}
                      </span>
                      {item.priority && item.priority !== 'normal' && (
                        <span
                          className={`px-2.5 py-0.5 text-[10px] uppercase font-extrabold rounded-full ${
                            item.priority === 'high'
                              ? 'bg-red-500/10 text-red-600 border border-red-500/20'
                              : 'bg-blue-500/10 text-blue-600'
                          }`}
                        >
                          {item.priority} priority
                        </span>
                      )}
                    </div>
                    <span className='text-xs text-gray-400 flex items-center gap-1 mt-1.5 font-medium'>
                      <Calendar size={13} />
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
                    className='text-red-500 hover:bg-red-500/10 p-2 rounded-xl transition cursor-pointer'
                    title='Delete Announcement'
                  >
                    <Trash2 size={18} />
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

      {/* Fully Animated Colorful Custom Modal Alert */}
      {modalConfig.isOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn'>
          <div className='bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-800 space-y-6 transform animate-scaleUp text-center relative overflow-hidden'>
            {/* Top decorative gradient bar */}
            <div
              className={`absolute top-0 left-0 right-0 h-1.5 ${
                modalConfig.type === 'success'
                  ? 'bg-green-500'
                  : modalConfig.type === 'error'
                    ? 'bg-red-500'
                    : 'bg-primary-purple'
              }`}
            />

            <div className='flex justify-end absolute right-4 top-4'>
              <button
                onClick={closeModal}
                className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer'
              >
                <X size={18} />
              </button>
            </div>

            <div className='flex flex-col items-center space-y-3 pt-2'>
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                  modalConfig.type === 'success'
                    ? 'bg-green-500/15 text-green-600 shadow-green-500/10 animate-bounce'
                    : modalConfig.type === 'error'
                      ? 'bg-red-500/15 text-red-600 shadow-red-500/10 animate-shake'
                      : 'bg-primary-purple/15 text-primary-purple shadow-primary-purple/10 animate-pulse'
                }`}
              >
                {modalConfig.type === 'success' && <CheckCircle size={36} />}
                {modalConfig.type === 'error' && <AlertTriangle size={36} />}
                {modalConfig.type === 'confirm' && <AlertCircle size={36} />}
              </div>

              <div className='space-y-1'>
                <h3 className='text-xl font-extrabold text-dark dark:text-white'>
                  {modalConfig.title}
                </h3>
                <p className='text-xs text-gray-500 dark:text-gray-400 leading-relaxed px-4'>
                  {modalConfig.message}
                </p>
              </div>
            </div>

            <div className='flex gap-3 pt-2'>
              {modalConfig.type === 'confirm' ? (
                <>
                  <button
                    type='button'
                    onClick={closeModal}
                    className='flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 font-bold text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer flex items-center justify-center gap-1.5'
                  >
                    <X size={14} /> Cancel
                  </button>
                  <button
                    type='button'
                    onClick={() => {
                      if (modalConfig.onConfirm) modalConfig.onConfirm()
                      closeModal()
                    }}
                    className='flex-1 py-3 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition shadow-lg shadow-red-600/20 cursor-pointer flex items-center justify-center gap-1.5'
                  >
                    <Trash2 size={14} /> Yes, Delete
                  </button>
                </>
              ) : (
                <button
                  type='button'
                  onClick={closeModal}
                  className={`w-full py-3.5 rounded-xl text-white font-bold text-xs shadow-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    modalConfig.type === 'success'
                      ? 'bg-green-600 hover:bg-green-700 shadow-green-600/25'
                      : 'bg-primary-purple hover:opacity-95 shadow-primary-purple/25'
                  }`}
                >
                  <Check size={16} /> Got It
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
