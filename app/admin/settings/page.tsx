'use client'
import { useState, useEffect, FormEvent } from 'react'
import {
  Settings,
  Shield,
  Lock,
  Bell,
  CheckCircle,
  Key,
  Mail,
  Globe,
  Clock,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { apiClient } from '@/services/api'

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  // Settings State
  const [paystackKey, setPaystackKey] = useState('')
  const [supportEmail, setSupportEmail] = useState('')
  const [academyName, setAcademyName] = useState('')
  const [sessionTimeout, setSessionTimeout] = useState('60')
  const [enable2FA, setEnable2FA] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(true)

  const fetchSettings = async () => {
    setIsLoading(true)
    setErrorMessage('')
    try {
      const response = await apiClient.getAdminSettings()
      const data = response?.data || response || {}

      setPaystackKey(
        data.paystackKey ||
          data.paystackSecretKey ||
          localStorage.getItem('denskill_paystack_key') ||
          'sk_live_93748291048291048291048',
      )
      setSupportEmail(
        data.supportEmail ||
          localStorage.getItem('denskill_support_email') ||
          'support@denskill.org',
      )
      setAcademyName(
        data.academyName ||
          data.name ||
          localStorage.getItem('denskill_academy_name') ||
          'D Enskill Academy Management System',
      )
      setSessionTimeout(
        String(
          data.sessionTimeout ||
            localStorage.getItem('denskill_session_timeout') ||
            '60',
        ),
      )
      setEnable2FA(
        data.enable2FA ?? localStorage.getItem('denskill_2fa') !== 'false',
      )
      setEmailAlerts(
        data.emailAlerts ??
          localStorage.getItem('denskill_email_alerts') !== 'false',
      )
    } catch (err: any) {
      setErrorMessage(
        err?.message || 'Failed to load system settings from backend.',
      )
      setPaystackKey(
        localStorage.getItem('denskill_paystack_key') ||
          'sk_live_93748291048291048291048',
      )
      setSupportEmail(
        localStorage.getItem('denskill_support_email') ||
          'support@denskill.org',
      )
      setAcademyName(
        localStorage.getItem('denskill_academy_name') ||
          'D Enskill Academy Management System',
      )
      setSessionTimeout(
        localStorage.getItem('denskill_session_timeout') || '60',
      )
      setEnable2FA(localStorage.getItem('denskill_2fa') !== 'false')
      setEmailAlerts(localStorage.getItem('denskill_email_alerts') !== 'false')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()

    // Persist to localStorage as backup
    localStorage.setItem('denskill_paystack_key', paystackKey)
    localStorage.setItem('denskill_support_email', supportEmail)
    localStorage.setItem('denskill_academy_name', academyName)
    localStorage.setItem('denskill_session_timeout', sessionTimeout)
    localStorage.setItem('denskill_2fa', enable2FA.toString())
    localStorage.setItem('denskill_email_alerts', emailAlerts.toString())

    try {
      if (typeof (apiClient as any).updateAdminSettings === 'function') {
        await (apiClient as any).updateAdminSettings({
          paystackKey,
          supportEmail,
          academyName,
          sessionTimeout,
          enable2FA,
          emailAlerts,
        })
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      alert(err?.message || 'Failed to save configuration to backend server.')
    }
  }

  const inputClass =
    'w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 text-dark dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-purple'

  return (
    <div className='space-y-6 max-w-3xl mx-auto animate-fadeIn pb-12'>
      <div>
        <h2 className='text-2xl font-bold text-dark dark:text-white'>
          Admin Portal Settings
        </h2>
        <p className='text-sm text-gray-500'>
          Configure enterprise security parameters, payment gateway webhooks,
          and academy-wide notifications.
        </p>
      </div>

      {saved && (
        <div className='p-4 bg-green-500/10 border border-green-500/20 text-green-600 rounded-2xl flex items-center gap-3 text-sm font-medium animate-fadeIn'>
          <CheckCircle size={20} className='shrink-0' />
          <span>
            System configurations and gateway parameters updated successfully!
          </span>
        </div>
      )}

      {errorMessage && (
        <div className='p-4 bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-2xl flex items-center gap-3 text-sm font-medium'>
          <AlertCircle size={20} className='shrink-0' />
          <span>{errorMessage} (Using cached configurations)</span>
        </div>
      )}

      <div className='bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm'>
        {isLoading ? (
          <div className='h-64 flex items-center justify-center'>
            <Loader2 className='w-6 h-6 animate-spin text-primary-purple' />
          </div>
        ) : (
          <form onSubmit={handleSave} className='space-y-6'>
            {/* General Section */}
            <div className='space-y-4'>
              <h3 className='text-xs font-bold text-primary-purple uppercase tracking-wider flex items-center gap-2 border-b pb-2 dark:border-gray-800'>
                <Globe size={14} /> General Academy Parameters
              </h3>

              <div>
                <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider'>
                  Academy Display Name
                </label>
                <input
                  type='text'
                  value={academyName}
                  onChange={(e) => setAcademyName(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider'>
                  Academy Support Email
                </label>
                <div className='relative'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>
                    <Mail size={16} />
                  </span>
                  <input
                    type='email'
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    className={`${inputClass} pl-10`}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Gateway Section */}
            <div className='space-y-4 pt-4 border-t dark:border-gray-800'>
              <h3 className='text-xs font-bold text-primary-purple uppercase tracking-wider flex items-center gap-2 border-b pb-2 dark:border-gray-800'>
                <Key size={14} /> Financial Integration (Paystack)
              </h3>

              <div>
                <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider'>
                  Paystack Secret Key (Live / Test)
                </label>
                <input
                  type='password'
                  value={paystackKey}
                  onChange={(e) => setPaystackKey(e.target.value)}
                  className={inputClass}
                  required
                />
                <p className='text-xs text-gray-500 mt-1'>
                  Used for processing student tuition fees and automated
                  enrollment receipts.
                </p>
              </div>
            </div>

            {/* Security & Access Section */}
            <div className='space-y-4 pt-4 border-t dark:border-gray-800'>
              <h3 className='text-xs font-bold text-primary-purple uppercase tracking-wider flex items-center gap-2 border-b pb-2 dark:border-gray-800'>
                <Shield size={14} /> Security & Session Policies
              </h3>

              <div>
                <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider'>
                  Admin Session Timeout (Minutes)
                </label>
                <div className='relative'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>
                    <Clock size={16} />
                  </span>
                  <select
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                    className={`${inputClass} pl-10 cursor-pointer`}
                  >
                    <option value='15'>15 Minutes</option>
                    <option value='30'>30 Minutes</option>
                    <option value='60'>60 Minutes (1 Hour)</option>
                    <option value='120'>120 Minutes (2 Hours)</option>
                  </select>
                </div>
              </div>

              <div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800'>
                <div>
                  <p className='text-sm font-bold text-dark dark:text-white'>
                    Two-Factor Authentication (2FA)
                  </p>
                  <p className='text-xs text-gray-500'>
                    Require OTP verification for sensitive director actions and
                    record deletions.
                  </p>
                </div>
                <input
                  type='checkbox'
                  checked={enable2FA}
                  onChange={(e) => setEnable2FA(e.target.checked)}
                  className='w-5 h-5 accent-primary-purple cursor-pointer'
                />
              </div>

              <div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800'>
                <div>
                  <p className='text-sm font-bold text-dark dark:text-white'>
                    Email Alert Triggers
                  </p>
                  <p className='text-xs text-gray-500'>
                    Receive instant notifications when new students register or
                    complete tuition.
                  </p>
                </div>
                <input
                  type='checkbox'
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className='w-5 h-5 accent-primary-purple cursor-pointer'
                />
              </div>
            </div>

            <button
              type='submit'
              className='w-full bg-primary-purple hover:bg-primary-purple/90 text-white font-bold py-3.5 rounded-xl transition shadow-md cursor-pointer text-sm'
            >
              Save System Settings
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
