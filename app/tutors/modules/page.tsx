// src/app/tutors/modules/page.tsx
'use client'

import { useState, useEffect, FormEvent } from 'react'
import {
  BookOpen,
  Video,
  Megaphone,
  Plus,
  Loader2,
  X,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react'
import { apiClient } from '@/services/api'

export default function TutorsModulesHubPage() {
  const [courseId, setCourseId] = useState('1')
  const [activeTab, setActiveTab] = useState<
    'modules' | 'sessions' | 'announcements'
  >('modules')

  const [modules, setModules] = useState<any[]>([])
  const [sessions, setSessions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Modals
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false)
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false)
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false)

  // Form Fields
  const [modTitle, setModTitle] = useState('')
  const [weekNumber, setWeekNumber] = useState(1)
  const [contentType, setContentType] = useState('video')
  const [resourceUrl, setResourceUrl] = useState('')
  const [modDesc, setModDesc] = useState('')

  const [sessTitle, setSessTitle] = useState('')
  const [sessType, setSessType] = useState('lecture')
  const [meetingLink, setMeetingLink] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [sessDesc, setSessDesc] = useState('')

  const [annTitle, setAnnTitle] = useState('')
  const [annContent, setAnnContent] = useState('')

  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    isSuccess: true,
  })
  const showAlert = (title: string, message: string, isSuccess = true) =>
    setAlertModal({ isOpen: true, title, message, isSuccess })

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const modRes = await apiClient.getCourseModules(courseId)
      setModules(
        Array.isArray(modRes) ? modRes : modRes?.modules || modRes?.data || [],
      )

      const sessRes = await apiClient.getLiveSessions(courseId)
      setSessions(
        Array.isArray(sessRes)
          ? sessRes
          : sessRes?.sessions || sessRes?.data || [],
      )
    } catch (err) {
      setModules([
        {
          id: 1,
          title: 'Introduction to Node.js Architecture',
          week_number: 1,
          content_type: 'video',
          resource_url: 'https://youtube.com',
          description: 'Core server principles.',
        },
      ])
      setSessions([
        {
          id: 1,
          title: 'Live Q&A Session',
          session_type: 'lecture',
          meeting_link: 'https://zoom.us',
          scheduled_at: new Date().toISOString(),
          description: 'Office hours.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [courseId])

  const handleUploadModule = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await apiClient.uploadCourseModule({
        course_id: courseId,
        title: modTitle,
        week_number: Number(weekNumber),
        content_type: contentType,
        resource_url: resourceUrl,
        description: modDesc,
      })
      showAlert('Success', 'Course module uploaded successfully!', true)
      setIsModuleModalOpen(false)
      setModTitle('')
      setResourceUrl('')
      setModDesc('')
      fetchData()
    } catch (err: any) {
      showAlert('Error', err?.message || 'Failed to upload module.', false)
    }
  }

  const handleScheduleSession = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await apiClient.scheduleLiveSession({
        course_id: courseId,
        title: sessTitle,
        session_type: sessType,
        meeting_link: meetingLink,
        scheduled_at: scheduledAt,
        description: sessDesc,
      })
      showAlert('Success', 'Live session scheduled successfully!', true)
      setIsSessionModalOpen(false)
      setSessTitle('')
      setMeetingLink('')
      setSessDesc('')
      fetchData()
    } catch (err: any) {
      showAlert('Error', err?.message || 'Failed to schedule session.', false)
    }
  }

  const handlePublishAnnouncement = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await apiClient.publishAnnouncement({
        course_id: courseId,
        title: annTitle,
        content: annContent,
      })
      showAlert('Success', 'Announcement published successfully!', true)
      setIsAnnouncementModalOpen(false)
      setAnnTitle('')
      setAnnContent('')
    } catch (err: any) {
      showAlert(
        'Error',
        err?.message || 'Failed to publish announcement.',
        false,
      )
    }
  }

  const inputClass =
    'w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-dark dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-purple'

  return (
    <div className='space-y-6 animate-fadeIn'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-dark dark:text-white'>
            Modules, Sessions & Announcements
          </h1>
          <p className='text-sm text-gray-500'>
            Manage weekly learning resources, live lecture schedules, and cohort
            broadcasts.
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className='p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs font-medium text-dark dark:text-white'
          >
            <option value='1'>Course ID: 1 (Full-Stack)</option>
            <option value='2'>Course ID: 2 (Mobile App)</option>
          </select>
          {activeTab === 'modules' && (
            <button
              onClick={() => setIsModuleModalOpen(true)}
              className='bg-primary-purple hover:bg-primary-purple/90 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition flex items-center gap-2 cursor-pointer shadow-sm'
            >
              <Plus size={16} /> Upload Module
            </button>
          )}
          {activeTab === 'sessions' && (
            <button
              onClick={() => setIsSessionModalOpen(true)}
              className='bg-primary-purple hover:bg-primary-purple/90 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition flex items-center gap-2 cursor-pointer shadow-sm'
            >
              <Plus size={16} /> Schedule Session
            </button>
          )}
          {activeTab === 'announcements' && (
            <button
              onClick={() => setIsAnnouncementModalOpen(true)}
              className='bg-primary-purple hover:bg-primary-purple/90 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition flex items-center gap-2 cursor-pointer shadow-sm'
            >
              <Plus size={16} /> Publish Announcement
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className='flex border-b border-gray-200 dark:border-gray-800 gap-6'>
        <button
          onClick={() => setActiveTab('modules')}
          className={`pb-3 text-sm font-semibold transition border-b-2 cursor-pointer flex items-center gap-2 ${activeTab === 'modules' ? 'border-primary-purple text-primary-purple' : 'border-transparent text-gray-500'}`}
        >
          <BookOpen size={16} /> Course Modules
        </button>
        <button
          onClick={() => setActiveTab('sessions')}
          className={`pb-3 text-sm font-semibold transition border-b-2 cursor-pointer flex items-center gap-2 ${activeTab === 'sessions' ? 'border-primary-purple text-primary-purple' : 'border-transparent text-gray-500'}`}
        >
          <Video size={16} /> Live Sessions
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          className={`pb-3 text-sm font-semibold transition border-b-2 cursor-pointer flex items-center gap-2 ${activeTab === 'announcements' ? 'border-primary-purple text-primary-purple' : 'border-transparent text-gray-500'}`}
        >
          <Megaphone size={16} /> Announcements
        </button>
      </div>

      {isLoading ? (
        <div className='h-64 flex items-center justify-center'>
          <Loader2 className='animate-spin text-primary-purple' />
        </div>
      ) : activeTab === 'modules' ? (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {modules.map((m) => (
            <div
              key={m.id}
              className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-3 flex flex-col justify-between'
            >
              <div className='space-y-2'>
                <span className='px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-500/10 text-blue-500'>
                  Week {m.week_number} • {m.content_type}
                </span>
                <h3 className='text-base font-bold text-dark dark:text-white'>
                  {m.title}
                </h3>
                <p className='text-xs text-gray-500'>{m.description}</p>
              </div>
              <a
                href={m.resource_url}
                target='_blank'
                rel='noreferrer'
                className='pt-3 border-t dark:border-gray-800 text-xs font-semibold text-primary-purple flex items-center gap-1 hover:underline'
              >
                Access Resource File <ExternalLink size={12} />
              </a>
            </div>
          ))}
        </div>
      ) : activeTab === 'sessions' ? (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {sessions.map((s) => (
            <div
              key={s.id}
              className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-3 flex flex-col justify-between'
            >
              <div className='space-y-2'>
                <span className='px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-500'>
                  {s.session_type}
                </span>
                <h3 className='text-base font-bold text-dark dark:text-white'>
                  {s.title}
                </h3>
                <p className='text-xs text-gray-500'>{s.description}</p>
                <p className='text-xs font-medium text-gray-400'>
                  Scheduled At: {new Date(s.scheduled_at).toLocaleString()}
                </p>
              </div>
              <a
                href={s.meeting_link}
                target='_blank'
                rel='noreferrer'
                className='pt-3 border-t dark:border-gray-800 text-xs font-semibold text-emerald-500 flex items-center gap-1 hover:underline'
              >
                Join Meeting Link <ExternalLink size={12} />
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className='bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm text-center space-y-4'>
          <Megaphone size={40} className='mx-auto text-primary-purple' />
          <h3 className='text-lg font-bold text-dark dark:text-white'>
            Publish Real-Time Broadcasts
          </h3>
          <p className='text-xs text-gray-500 max-w-md mx-auto'>
            Send immediate deadline reminders and updates straight to all
            students enrolled in this course.
          </p>
          <button
            onClick={() => setIsAnnouncementModalOpen(true)}
            className='px-5 py-2.5 rounded-xl bg-primary-purple text-white text-xs font-semibold shadow-sm hover:opacity-90 cursor-pointer'
          >
            Create New Announcement
          </button>
        </div>
      )}

      {/* Upload Module Modal */}
      {isModuleModalOpen && (
        <div className='fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn'>
          <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl'>
            <div className='flex justify-between items-center border-b pb-4 dark:border-gray-800'>
              <h3 className='text-lg font-bold text-dark dark:text-white'>
                Upload Course Module
              </h3>
              <button
                onClick={() => setIsModuleModalOpen(false)}
                className='text-gray-400 hover:text-gray-200 cursor-pointer'
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUploadModule} className='space-y-4'>
              <div>
                <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                  Module Title
                </label>
                <input
                  type='text'
                  required
                  placeholder='e.g., Advanced React Server Components'
                  className={inputClass}
                  value={modTitle}
                  onChange={(e) => setModTitle(e.target.value)}
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                    Week Number
                  </label>
                  <input
                    type='number'
                    required
                    min={1}
                    className={inputClass}
                    value={weekNumber}
                    onChange={(e) => setWeekNumber(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                    Content Type
                  </label>
                  <select
                    className={inputClass}
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value)}
                  >
                    <option value='video'>Video Lecture</option>
                    <option value='reading'>Reading Notes</option>
                    <option value='lab'>Lab Code</option>
                  </select>
                </div>
              </div>
              <div>
                <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                  Resource URL
                </label>
                <input
                  type='url'
                  required
                  placeholder='https://...'
                  className={inputClass}
                  value={resourceUrl}
                  onChange={(e) => setResourceUrl(e.target.value)}
                />
              </div>
              <div>
                <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                  Description
                </label>
                <textarea
                  required
                  placeholder='Module syllabus overview...'
                  className={`${inputClass} h-24`}
                  value={modDesc}
                  onChange={(e) => setModDesc(e.target.value)}
                />
              </div>
              <div className='flex justify-end gap-3 pt-4 border-t dark:border-gray-800'>
                <button
                  type='button'
                  onClick={() => setIsModuleModalOpen(false)}
                  className='px-4 py-2 rounded-xl text-xs font-semibold border border-gray-300 dark:border-gray-700 text-gray-600 cursor-pointer'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-5 py-2 rounded-xl text-xs font-semibold bg-primary-purple text-white hover:opacity-90 cursor-pointer'
                >
                  Upload Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Live Session Modal */}
      {isSessionModalOpen && (
        <div className='fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn'>
          <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl'>
            <div className='flex justify-between items-center border-b pb-4 dark:border-gray-800'>
              <h3 className='text-lg font-bold text-dark dark:text-white'>
                Schedule Live Lecture Session
              </h3>
              <button
                onClick={() => setIsSessionModalOpen(false)}
                className='text-gray-400 hover:text-gray-200 cursor-pointer'
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleScheduleSession} className='space-y-4'>
              <div>
                <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                  Session Title
                </label>
                <input
                  type='text'
                  required
                  placeholder='e.g., Weekly Office Hours'
                  className={inputClass}
                  value={sessTitle}
                  onChange={(e) => setSessTitle(e.target.value)}
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                    Session Type
                  </label>
                  <select
                    className={inputClass}
                    value={sessType}
                    onChange={(e) => setSessType(e.target.value)}
                  >
                    <option value='lecture'>Live Lecture</option>
                    <option value='office_hours'>Office Hours</option>
                    <option value='workshop'>Coding Workshop</option>
                  </select>
                </div>
                <div>
                  <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                    Scheduled Date & Time
                  </label>
                  <input
                    type='datetime-local'
                    required
                    className={inputClass}
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                  Meeting Link
                </label>
                <input
                  type='url'
                  required
                  placeholder='https://zoom.us/j/...'
                  className={inputClass}
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                />
              </div>
              <div>
                <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                  Description
                </label>
                <textarea
                  required
                  placeholder='What will be covered...'
                  className={`${inputClass} h-24`}
                  value={sessDesc}
                  onChange={(e) => setSessDesc(e.target.value)}
                />
              </div>
              <div className='flex justify-end gap-3 pt-4 border-t dark:border-gray-800'>
                <button
                  type='button'
                  onClick={() => setIsSessionModalOpen(false)}
                  className='px-4 py-2 rounded-xl text-xs font-semibold border border-gray-300 dark:border-gray-700 text-gray-600 cursor-pointer'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-5 py-2 rounded-xl text-xs font-semibold bg-primary-purple text-white hover:opacity-90 cursor-pointer'
                >
                  Schedule Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Publish Announcement Modal */}
      {isAnnouncementModalOpen && (
        <div className='fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn'>
          <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl'>
            <div className='flex justify-between items-center border-b pb-4 dark:border-gray-800'>
              <h3 className='text-lg font-bold text-dark dark:text-white'>
                Publish Announcement
              </h3>
              <button
                onClick={() => setIsAnnouncementModalOpen(false)}
                className='text-gray-400 hover:text-gray-200 cursor-pointer'
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handlePublishAnnouncement} className='space-y-4'>
              <div>
                <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                  Headline Title
                </label>
                <input
                  type='text'
                  required
                  placeholder='e.g., Assignment 2 Deadline Extended'
                  className={inputClass}
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                />
              </div>
              <div>
                <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                  Content Message
                </label>
                <textarea
                  required
                  placeholder='Write your announcement details here...'
                  className={`${inputClass} h-32`}
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                />
              </div>
              <div className='flex justify-end gap-3 pt-4 border-t dark:border-gray-800'>
                <button
                  type='button'
                  onClick={() => setIsAnnouncementModalOpen(false)}
                  className='px-4 py-2 rounded-xl text-xs font-semibold border border-gray-300 dark:border-gray-700 text-gray-600 cursor-pointer'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-5 py-2 rounded-xl text-xs font-semibold bg-primary-purple text-white hover:opacity-90 cursor-pointer'
                >
                  Publish Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {alertModal.isOpen && (
        <div className='fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn'>
          <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl'>
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${alertModal.isSuccess ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}
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
            <p className='text-xs text-gray-500'>{alertModal.message}</p>
            <button
              onClick={() =>
                setAlertModal((prev) => ({ ...prev, isOpen: false }))
              }
              className='w-full py-2.5 rounded-xl text-xs font-semibold bg-primary-purple text-white cursor-pointer'
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
