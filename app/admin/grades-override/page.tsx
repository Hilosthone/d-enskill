'use client'
import { useState } from 'react'
import {
  ClipboardCheck,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
} from 'lucide-react'
import { adminApiClient } from '@/services/admin-api'

export default function GradeOverridePage() {
  const [gradeId, setGradeId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleOverride = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!gradeId) return

    setIsLoading(true)
    setSuccessMsg(null)
    setErrorMsg(null)

    try {
      const res = await adminApiClient.executeGradeOverride(gradeId)
      if (res && (res.success || res.message)) {
        setSuccessMsg(`Grade override successfully executed for ID: ${gradeId}`)
        setGradeId('')
      } else {
        setErrorMsg(
          res?.message || res?.error || 'Failed to execute grade override.',
        )
      }
    } catch (err: any) {
      setErrorMsg(
        err.message || 'An error occurred while processing the grade override.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='space-y-6 max-w-2xl mx-auto'>
      <div>
        <h1 className='text-xl font-bold text-dark dark:text-white flex items-center gap-2'>
          <ClipboardCheck className='text-primary-purple' size={24} />
          Administrative Grade Overrides
        </h1>
        <p className='text-xs text-gray-500 mt-1'>
          Execute administrative overrides for disputed academic scores or grade
          adjustments.
        </p>
      </div>

      {successMsg && (
        <div className='p-4 bg-green-500/10 border border-green-500 text-green-600 text-xs rounded-xl flex items-center gap-2 font-medium'>
          <CheckCircle2 size={16} />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className='p-4 bg-red-500/10 border border-red-500 text-red-600 text-xs rounded-xl flex items-center gap-2 font-medium'>
          <AlertCircle size={16} />
          {errorMsg}
        </div>
      )}

      <form
        onSubmit={handleOverride}
        className='bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6 text-xs'
      >
        <div className='p-4 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 rounded-xl flex items-start gap-3'>
          <ShieldAlert size={20} className='shrink-0 mt-0.5' />
          <p>
            <strong>Warning:</strong> Grade overrides are logged for security
            auditing. Ensure proper authorization documentation is verified
            before executing an override.
          </p>
        </div>

        <div className='space-y-1.5'>
          <label className='font-bold text-dark dark:text-white'>
            Grade ID or Assessment Reference *
          </label>
          <input
            type='text'
            required
            value={gradeId}
            onChange={(e) => setGradeId(e.target.value)}
            placeholder='e.g., GRD-98421'
            className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white focus:outline-none focus:border-primary-purple'
          />
        </div>

        <button
          type='submit'
          disabled={isLoading}
          className='w-full py-3.5 bg-primary-purple text-white font-bold rounded-xl shadow-md hover:opacity-95 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer'
        >
          {isLoading && <Loader2 size={16} className='animate-spin' />}
          Execute Grade Override
        </button>
      </form>
    </div>
  )
}
