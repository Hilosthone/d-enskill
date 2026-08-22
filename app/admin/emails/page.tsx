'use client'

import { useState } from 'react'
import { Mail, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { apiClient } from '@/services/api'

export default function SendEmailPage() {
  const [formData, setFormData] = useState({
    emails: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [responseMessage, setResponseMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResponseMessage(null)

    try {
      const res = await apiClient.sendCustomEmail(formData)

      if (res && res.success !== false) {
        setResponseMessage({
          type: 'success',
          text: 'Message successfully sent to user inbox(es)',
        })
        setFormData({ emails: '', subject: '', message: '' })
      } else {
        setResponseMessage({
          type: 'error',
          text: res.message || 'Failed to deliver emails via Resend',
        })
      }
    } catch (error: any) {
      setResponseMessage({
        type: 'error',
        text:
          error?.message ||
          'An unexpected error occurred while sending the email.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='max-w-4xl mx-auto p-6'>
      {/* Page Header */}
      <div className='flex items-center gap-3 mb-8'>
        <div className='p-3 rounded-xl bg-primary-red/10 text-primary-red'>
          <Mail size={28} />
        </div>
        <div>
          <h1 className='text-2xl font-bold text-dark dark:text-white'>
            Broadcast Custom Email
          </h1>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Send direct email messages to one or multiple users instantly.
          </p>
        </div>
      </div>

      {/* Status Alert Banner */}
      {responseMessage && (
        <div
          className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium border ${
            responseMessage.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
              : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
          }`}
        >
          {responseMessage.type === 'success' ? (
            <CheckCircle2 size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span>{responseMessage.text}</span>
        </div>
      )}

      {/* Email Form Card */}
      <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl rounded-2xl p-6 md:p-8'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Recipients Input */}
          <div>
            <label className='block text-sm font-semibold text-dark dark:text-gray-200 mb-2'>
              Recipient Email(s)
            </label>
            <input
              type='text'
              name='emails'
              value={formData.emails}
              onChange={handleChange}
              required
              placeholder='student1@gmail.com, student2@gmail.com'
              className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-red transition'
            />
            <p className='text-xs text-gray-400 mt-1.5'>
              Separate multiple email addresses with commas.
            </p>
          </div>

          {/* Subject Input */}
          <div>
            <label className='block text-sm font-semibold text-dark dark:text-gray-200 mb-2'>
              Subject
            </label>
            <input
              type='text'
              name='subject'
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder='Important Update Regarding Your Portal Access'
              className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-red transition'
            />
          </div>

          {/* Message Body Input */}
          <div>
            <label className='block text-sm font-semibold text-dark dark:text-gray-200 mb-2'>
              Message Body
            </label>
            <textarea
              name='message'
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              placeholder='Hello, please check your dashboard for recent updates.'
              className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-red transition resize-y'
            />
          </div>

          {/* Submit Button */}
          <div className='flex justify-end pt-2'>
            <button
              type='submit'
              disabled={loading}
              className='bg-primary-red text-white text-sm font-semibold px-8 py-3 rounded-xl hover:bg-red-700 transition flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md'
            >
              {loading ? (
                <>
                  <Loader2 size={18} className='animate-spin' />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Send Email
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
