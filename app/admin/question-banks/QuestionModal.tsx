'use client'

import { useState, useEffect } from 'react'
import { X, Calendar, Clock, Layers, AlertCircle, Loader2 } from 'lucide-react'

interface QuestionBank {
  id?: string | number
  title: string
  description?: string
  courseId?: string
  subjects?: string[]
  durationMinutes?: number
  maxAttempts?: number
  startTime?: string
  expiresAt?: string
}

interface QuestionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: QuestionBank) => Promise<void>
  initialData?: QuestionBank | null
}

export default function QuestionModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: QuestionModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [courseId, setCourseId] = useState('')
  const [subjectsStr, setSubjectsStr] = useState('')
  const [durationMinutes, setDurationMinutes] = useState<number | ''>(30)
  const [maxAttempts, setMaxAttempts] = useState<number | ''>(1)
  const [startTime, setStartTime] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '')
      setDescription(initialData.description || '')
      setCourseId(initialData.courseId || '')
      setSubjectsStr(initialData.subjects ? initialData.subjects.join(', ') : '')
      setDurationMinutes(initialData.durationMinutes ?? 30)
      setMaxAttempts(initialData.maxAttempts ?? 1)
      setStartTime(initialData.startTime ? initialData.startTime.slice(0, 16) : '')
      setExpiresAt(initialData.expiresAt ? initialData.expiresAt.slice(0, 16) : '')
    } else {
      setTitle('')
      setDescription('')
      setCourseId('')
      setSubjectsStr('')
      setDurationMinutes(30)
      setMaxAttempts(1)
      setStartTime('')
      setExpiresAt('')
    }
    setError(null)
  }, [initialData, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const subjectsArray = subjectsStr
        ? subjectsStr.split(',').map((s) => s.trim()).filter(Boolean)
        : undefined

      await onSave({
        title,
        description,
        courseId: courseId || undefined,
        subjects: subjectsArray,
        durationMinutes: durationMinutes ? Number(durationMinutes) : undefined,
        maxAttempts: maxAttempts ? Number(maxAttempts) : undefined,
        startTime: startTime ? new Date(startTime).toISOString() : undefined,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
      })
      onClose()
    } catch (err: any) {
      const message = err?.message || 'Failed to save question bank. Please verify input fields.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-opacity animate-fadeIn">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transform transition-all animate-scaleUp max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {initialData ? 'Edit Question Bank Holder' : 'Create Question Bank Holder'}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Configure parameters and schedule windows for test assessment.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-3 rounded-xl bg-rose-50 p-3.5 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/40">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Holder/Test Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Midterm Computer Science Examination"
              className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 shadow-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Description / Instructions
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Overview of instructions for candidates taking this question pool..."
              className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 shadow-sm transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Course ID
              </label>
              <input
                type="text"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                placeholder="e.g. CSC-101"
                className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 shadow-sm transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Subjects <span className="text-xs text-zinc-400 font-normal">(Comma-separated)</span>
              </label>
              <input
                type="text"
                value={subjectsStr}
                onChange={(e) => setSubjectsStr(e.target.value)}
                placeholder="Math, Logic, Physics"
                className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 shadow-sm transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-zinc-400" /> Duration (Minutes)
              </label>
              <input
                type="number"
                min={1}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value === '' ? '' : Number(e.target.value))}
                className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 shadow-sm transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Max Attempts Allowed
              </label>
              <input
                type="number"
                min={1}
                value={maxAttempts}
                onChange={(e) => setMaxAttempts(e.target.value === '' ? '' : Number(e.target.value))}
                className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 shadow-sm transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-zinc-400" /> Start Window
              </label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 shadow-sm transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-zinc-400" /> Expiration Window
              </label>
              <input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 shadow-sm transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-5 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/25"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Saving Bank...' : 'Save Question Bank'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}