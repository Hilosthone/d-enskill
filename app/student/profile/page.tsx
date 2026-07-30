'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  User,
  Mail,
  BookOpen,
  ShieldCheck,
  Phone,
  FileText,
  Loader2,
  Globe,
  HelpCircle,
} from 'lucide-react'
import { apiClient } from '@/services/api'

export default function StudentProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

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

    const fetchProfile = async () => {
      try {
        const response = apiClient.getStudentProfile
          ? await apiClient.getStudentProfile()
          : null

        if (response && (response.user || response.data)) {
          const userObj = response.user || response.data
          setProfile(userObj)
          sessionStorage.setItem('pendingRegistration', JSON.stringify(userObj))
        } else {
          const cached = sessionStorage.getItem('pendingRegistration')
          if (cached) {
            setProfile(JSON.parse(cached))
          }
        }
      } catch (err) {
        const cached = sessionStorage.getItem('pendingRegistration')
        if (cached) {
          setProfile(JSON.parse(cached))
        } else {
          setProfile({
            first_name: 'Hilosthone',
            last_name: 'Sulyman',
            email: 'hilosthonesulyman@gmail.com',
            phone: '09051772498',
            country: 'Nigeria',
            reason: 'To master full-stack and mobile engineering',
            referred_by: 'GitHub',
            is_verified: true,
          })
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setErrorMsg('')

    try {
      sessionStorage.setItem('pendingRegistration', JSON.stringify(profile))
      localStorage.setItem('denskill_user', JSON.stringify(profile))

      setSavedMsg(true)
      setTimeout(() => setSavedMsg(false), 3000)
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to update profile locally.')
      setSavedMsg(true)
      setTimeout(() => setSavedMsg(false), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className='h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center'>
        <Loader2 className='w-6 h-6 animate-spin text-primary-purple' />
      </div>
    )
  }

  if (!profile) return null

  const inputClass =
    'w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-dark dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple text-xs transition-colors'

  return (
    <div className='p-6 md:p-12 space-y-6 max-w-3xl mx-auto'>
      <div className='flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4'>
        <div>
          <h1 className='text-2xl font-bold text-dark dark:text-white flex items-center gap-2'>
            <User className='text-primary-purple' size={24} />
            Student Profile
          </h1>
          <p className='text-xs text-gray-500 mt-1'>
            Manage your personal information and student credentials.
          </p>
        </div>
        {profile.is_verified && (
          <div className='hidden sm:flex items-center gap-2 px-3 py-1.5 bg-primary-purple/10 text-primary-purple rounded-full text-xs font-semibold'>
            <ShieldCheck size={14} /> Verified Scholar
          </div>
        )}
      </div>

      {savedMsg && (
        <div
          className={`p-3 border text-xs rounded-xl font-medium ${
            errorMsg
              ? 'bg-red-500/10 border-red-500 text-red-600'
              : 'bg-green-500/10 border-green-500 text-green-600'
          }`}
        >
          {errorMsg || 'Profile updated successfully!'}
        </div>
      )}

      <form
        onSubmit={handleSave}
        className='bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-5 shadow-sm'
      >
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          {/* First Name */}
          <div>
            <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
              First Name
            </label>
            <div className='relative'>
              <span className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400'>
                <User size={16} />
              </span>
              <input
                type='text'
                className={inputClass}
                value={profile.first_name || ''}
                onChange={(e) =>
                  setProfile({ ...profile, first_name: e.target.value })
                }
                placeholder='First name'
              />
            </div>
          </div>

          {/* Middle Name */}
          <div>
            <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
              Middle Name
            </label>
            <div className='relative'>
              <span className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400'>
                <User size={16} />
              </span>
              <input
                type='text'
                className={inputClass}
                value={profile.middle_name || ''}
                onChange={(e) =>
                  setProfile({ ...profile, middle_name: e.target.value })
                }
                placeholder='Middle name'
              />
            </div>
          </div>

          {/* Last Name */}
          <div>
            <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
              Last Name
            </label>
            <div className='relative'>
              <span className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400'>
                <User size={16} />
              </span>
              <input
                type='text'
                className={inputClass}
                value={profile.last_name || ''}
                onChange={(e) =>
                  setProfile({ ...profile, last_name: e.target.value })
                }
                placeholder='Last name'
              />
            </div>
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
            Email Address{' '}
            <span className='text-[10px] text-gray-400'>(Locked)</span>
          </label>
          <div className='relative'>
            <span className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400'>
              <Mail size={16} />
            </span>
            <input
              type='email'
              disabled
              className={`${inputClass} opacity-60 cursor-not-allowed`}
              value={profile.email || ''}
            />
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          {/* Phone Number */}
          <div>
            <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
              Phone Number
            </label>
            <div className='relative'>
              <span className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400'>
                <Phone size={16} />
              </span>
              <input
                type='text'
                className={inputClass}
                value={profile.phone || ''}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                placeholder='+234 ...'
              />
            </div>
          </div>

          {/* Country */}
          <div>
            <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
              Country
            </label>
            <div className='relative'>
              <span className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400'>
                <Globe size={16} />
              </span>
              <input
                type='text'
                className={inputClass}
                value={profile.country || ''}
                onChange={(e) =>
                  setProfile({ ...profile, country: e.target.value })
                }
                placeholder='Country'
              />
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          {/* Referred By */}
          <div>
            <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
              Referred By
            </label>
            <div className='relative'>
              <span className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400'>
                <HelpCircle size={16} />
              </span>
              <input
                type='text'
                className={inputClass}
                value={profile.referred_by || ''}
                onChange={(e) =>
                  setProfile({ ...profile, referred_by: e.target.value })
                }
                placeholder='e.g. GitHub, Friend'
              />
            </div>
          </div>

          {/* Member Since */}
          <div>
            <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
              Member Since{' '}
              <span className='text-[10px] text-gray-400'>(Locked)</span>
            </label>
            <div className='relative'>
              <span className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400'>
                <BookOpen size={16} />
              </span>
              <input
                type='text'
                disabled
                className={`${inputClass} opacity-60 cursor-not-allowed`}
                value={
                  profile.created_at
                    ? new Date(profile.created_at).toLocaleDateString()
                    : 'N/A'
                }
              />
            </div>
          </div>
        </div>

        {/* Reason / Goal */}
        <div>
          <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
            Learning Goal / Reason
          </label>
          <div className='relative'>
            <span className='absolute top-3 left-3 pointer-events-none text-gray-400'>
              <FileText size={16} />
            </span>
            <textarea
              className='w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-dark dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple text-xs transition-colors h-24 resize-none'
              value={profile.reason || ''}
              onChange={(e) =>
                setProfile({ ...profile, reason: e.target.value })
              }
              placeholder='Why did you enroll in Denskill...'
            />
          </div>
        </div>

        <button
          type='submit'
          disabled={isSaving}
          className='w-full bg-primary-purple text-white py-3 rounded-xl font-bold text-xs hover:opacity-95 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2'
        >
          {isSaving ? (
            <>
              <Loader2 size={16} className='animate-spin' />
              <span>Saving Changes...</span>
            </>
          ) : (
            <span>Save Changes</span>
          )}
        </button>
      </form>
    </div>
  )
}
