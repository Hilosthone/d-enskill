// app/admin/questions/QuestionModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Trash2, ArrowRight, ArrowLeft, Check, Loader2, Image as ImageIcon, HelpCircle } from 'lucide-react'
import { adminApiClient } from '@/services/admin-api'
import { QuestionBank, QuestionItem, AlertMessage } from './types'
import ImagePickerModal from './ImagePickerModal'

interface QuestionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  initialBankData?: QuestionBank | null
  setAlert: (alert: AlertMessage | null) => void
}

export default function QuestionModal({ isOpen, onClose, onSuccess, initialBankData, setAlert }: QuestionModalProps) {
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Image Picker Modal State
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false)
  const [activeQuestionIndexForImage, setActiveQuestionIndexForImage] = useState<number | null>(null)

  // Step 1: Metadata
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [courseId, setCourseId] = useState('')
  const [durationMinutes, setDurationMinutes] = useState<number | ''>(30)
  const [maxAttempts, setMaxAttempts] = useState<number | ''>(1)
  const [startTime, setStartTime] = useState('')
  const [expiresAt, setExpiresAt] = useState('')

  // Step 2: Questions list
  const [questions, setQuestions] = useState<QuestionItem[]>([
    {
      questionText: '',
      questionType: 'MCQ',
      imageUrl: '',
      marks: 1,
      options: [
        { text: '', isCorrect: true, explanation: '' },
        { text: '', isCorrect: false, explanation: '' },
        { text: '', isCorrect: false, explanation: '' },
        { text: '', isCorrect: false, explanation: '' },
      ],
    },
  ])

  const formatToLocalDateTime = (dateStr?: string) => {
    if (!dateStr) return ''
    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return ''
      const pad = (n: number) => String(n).padStart(2, '0')
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
    } catch {
      return ''
    }
  }

  useEffect(() => {
    if (initialBankData) {
      setTitle(initialBankData.title || '')
      setDescription(initialBankData.description || '')
      setCourseId(initialBankData.courseId || initialBankData.course_id || '')
      setDurationMinutes(initialBankData.durationMinutes ?? initialBankData.duration_minutes ?? 30)
      setMaxAttempts(initialBankData.maxAttempts ?? initialBankData.max_attempts ?? 1)
      setStartTime(formatToLocalDateTime(initialBankData.startTime || initialBankData.start_time))
      setExpiresAt(formatToLocalDateTime(initialBankData.expiresAt || initialBankData.expires_at))

      const loadedQuestions = initialBankData.questions || initialBankData.questionList || []
      if (loadedQuestions.length > 0) {
        setQuestions(
          loadedQuestions.map((q: any) => ({
            id: q.id,
            questionText: q.questionText || q.question_text || '',
            questionType: q.questionType || q.question_type || 'MCQ',
            imageUrl: q.imageUrl || q.image_url || '',
            marks: q.marks ?? 1,
            options: q.options?.map((opt: any) => ({
              id: opt.id,
              text: opt.text || opt.optionText || opt.option_text || '',
              isCorrect: Boolean(opt.isCorrect ?? opt.is_correct ?? false),
              explanation: opt.explanation || '',
            })) || [
              { text: '', isCorrect: true, explanation: '' },
              { text: '', isCorrect: false, explanation: '' },
            ],
          }))
        )
      } else {
        setQuestions([
          {
            questionText: '',
            questionType: 'MCQ',
            imageUrl: '',
            marks: 1,
            options: [
              { text: '', isCorrect: true, explanation: '' },
              { text: '', isCorrect: false, explanation: '' },
              { text: '', isCorrect: false, explanation: '' },
              { text: '', isCorrect: false, explanation: '' },
            ],
          },
        ])
      }
    } else {
      setTitle('')
      setDescription('')
      setCourseId('')
      setDurationMinutes(30)
      setMaxAttempts(1)
      setStartTime('')
      setExpiresAt('')
      setQuestions([
        {
          questionText: '',
          questionType: 'MCQ',
          imageUrl: '',
          marks: 1,
          options: [
            { text: '', isCorrect: true, explanation: '' },
            { text: '', isCorrect: false, explanation: '' },
            { text: '', isCorrect: false, explanation: '' },
            { text: '', isCorrect: false, explanation: '' },
          ],
        },
      ])
    }
    setStep(1)
    setErrorMsg(null)
  }, [initialBankData, isOpen])

  if (!isOpen) return null

  const handleAddQuestionField = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        questionType: 'MCQ',
        imageUrl: '',
        marks: 1,
        options: [
          { text: '', isCorrect: true, explanation: '' },
          { text: '', isCorrect: false, explanation: '' },
          { text: '', isCorrect: false, explanation: '' },
          { text: '', isCorrect: false, explanation: '' },
        ],
      },
    ])
  }

  const handleRemoveQuestion = (qIndex: number) => {
    if (questions.length <= 1) {
      setErrorMsg('A question bank must contain at least 1 question.')
      return
    }
    setQuestions(questions.filter((_, idx) => idx !== qIndex))
  }

  const handleQuestionChange = (qIndex: number, field: string, value: any) => {
    const updated = [...questions]
    updated[qIndex] = { ...updated[qIndex], [field]: value }
    setQuestions(updated)
  }

  const handleOptionChange = (qIndex: number, optIndex: number, field: string, value: any) => {
    const updated = [...questions]
    const updatedOptions = [...updated[qIndex].options]
    updatedOptions[optIndex] = { ...updatedOptions[optIndex], [field]: value }
    updated[qIndex].options = updatedOptions
    setQuestions(updated)
  }

  const handleAddOption = (qIndex: number) => {
    const updated = [...questions]
    updated[qIndex].options.push({ text: '', isCorrect: false, explanation: '' })
    setQuestions(updated)
  }

  const handleRemoveOption = (qIndex: number, optIndex: number) => {
    const updated = [...questions]
    if (updated[qIndex].options.length <= 2) {
      setErrorMsg('Questions must have at least 2 options.')
      return
    }
    updated[qIndex].options = updated[qIndex].options.filter((_, idx) => idx !== optIndex)
    setQuestions(updated)
  }

  const handleSaveAll = async () => {
    setErrorMsg(null)
    if (!title.trim()) {
      setErrorMsg('Question Bank title is required.')
      setStep(1)
      return
    }

    // Basic question validation check
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      if (!q.questionText.trim()) {
        setErrorMsg(`Question #${i + 1} statement is required.`)
        setStep(2)
        return
      }
      const hasCorrectOption = q.options.some((opt) => opt.isCorrect)
      if (!hasCorrectOption && q.questionType !== 'TEXT') {
        setErrorMsg(`Question #${i + 1} must have at least one correct option marked.`)
        setStep(2)
        return
      }
    }

    setSaving(true)
    try {
      const bankPayload: any = {
        title,
        description: description || undefined,
        courseId: courseId || undefined,
        durationMinutes: durationMinutes === '' ? undefined : Number(durationMinutes),
        maxAttempts: maxAttempts === '' ? undefined : Number(maxAttempts),
        startTime: startTime ? new Date(startTime).toISOString() : null,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
      }

      let bankId = initialBankData?.id

      if (bankId) {
        await adminApiClient.updateQuestionBank(bankId, bankPayload)
      } else {
        const res = await adminApiClient.createQuestionBank(bankPayload)
        bankId = res?.data?.id || res?.bank?.id || res?.id
      }

      if (!bankId) {
        throw new Error('Failed to retrieve Question Bank ID after save.')
      }

      const formattedQuestions = questions.map((q) => ({
        question_bank_id: bankId,
        questionBankId: bankId,
        questionText: q.questionText,
        question_text: q.questionText,
        questionType: q.questionType,
        question_type: q.questionType,
        imageUrl: q.imageUrl || undefined,
        image_url: q.imageUrl || undefined,
        marks: Number(q.marks) || 1,
        options: q.options.map((opt) => ({
          text: opt.text,
          optionText: opt.text,
          option_text: opt.text,
          isCorrect: Boolean(opt.isCorrect),
          is_correct: Boolean(opt.isCorrect),
          explanation: opt.explanation || '',
        })),
      }))

      await adminApiClient.importQuestionsIntoBank(bankId, { questions: formattedQuestions })

      setAlert({ type: 'success', message: 'Question bank saved successfully!' })
      onSuccess()
      onClose()
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to save question bank and questions.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
        <div className="bg-white dark:bg-zinc-900 w-full max-w-4xl rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {initialBankData ? 'Edit Question Bank & Questions' : 'Create Question Bank & Questions'}
              </h2>
              <p className="text-xs text-zinc-500">Step {step} of 2: {step === 1 ? 'Details & Timings' : 'Configure Questions'}</p>
            </div>
            <button onClick={onClose} className="rounded-full p-2 text-zinc-400 hover:text-zinc-700">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1">
            <div className="bg-blue-600 h-1 transition-all duration-300" style={{ width: step === 1 ? '50%' : '100%' }} />
          </div>

          {errorMsg && (
            <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-medium flex items-center gap-2">
              <HelpCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {step === 1 ? (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">1. Bank Configuration</h3>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Bank Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Full-Stack Midterm Assessment"
                    className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Course ID (Optional)</label>
                  <input
                    type="text"
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    placeholder="e.g. course-uuid-or-id"
                    className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Scope, instructions..."
                    className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Duration (Minutes)</label>
                    <input
                      type="number"
                      min={1}
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(e.target.value === '' ? '' : Number(e.target.value))}
                      className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Max Attempts</label>
                    <input
                      type="number"
                      min={1}
                      value={maxAttempts}
                      onChange={(e) => setMaxAttempts(e.target.value === '' ? '' : Number(e.target.value))}
                      className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Start Time (Schedule)</label>
                    <input
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Expires At (Deadline)</label>
                    <input
                      type="datetime-local"
                      value={expiresAt}
                      onChange={(e) => setExpiresAt(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 shadow-sm"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">2. Questions ({questions.length})</h3>
                </div>

                <div className="space-y-6">
                  {questions.map((q, qIdx) => (
                    <div key={qIdx} className="bg-zinc-50 dark:bg-zinc-800/40 p-4 sm:p-5 rounded-2xl border border-zinc-200 dark:border-zinc-700 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-600">Question #{qIdx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(qIdx)}
                          className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">Question Statement *</label>
                        <textarea
                          required
                          rows={2}
                          value={q.questionText}
                          onChange={(e) => handleQuestionChange(qIdx, 'questionText', e.target.value)}
                          placeholder="Type question..."
                          className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 shadow-sm"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">Type</label>
                          <select
                            value={q.questionType}
                            onChange={(e) => handleQuestionChange(qIdx, 'questionType', e.target.value)}
                            className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 shadow-sm"
                          >
                            <option value="MCQ">MCQ</option>
                            <option value="TRUE_FALSE">True / False</option>
                            <option value="TEXT">Short Answer</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">Marks</label>
                          <input
                            type="number"
                            min={1}
                            value={q.marks}
                            onChange={(e) => handleQuestionChange(qIdx, 'marks', Number(e.target.value))}
                            className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 shadow-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Image Attachment</label>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveQuestionIndexForImage(qIdx)
                              setIsImagePickerOpen(true)
                            }}
                            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 shadow-sm"
                          >
                            <ImageIcon className="h-3.5 w-3.5 text-blue-500" /> {q.imageUrl ? 'Change Image' : 'Pick Image'}
                          </button>
                        </div>
                      </div>

                      {q.imageUrl && (
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-zinc-300 bg-zinc-900">
                          <img src={q.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleQuestionChange(qIdx, 'imageUrl', '')}
                            className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full text-xs"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )}

                      <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-700">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Answer Options & Correctness</span>
                          <button
                            type="button"
                            onClick={() => handleAddOption(qIdx)}
                            className="text-[11px] font-semibold text-blue-600 hover:underline"
                          >
                            + Add Option
                          </button>
                        </div>

                        <div className="space-y-2">
                          {q.options.map((opt, optIdx) => (
                            <div key={optIdx} className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700">
                              <input
                                type="checkbox"
                                checked={opt.isCorrect}
                                onChange={(e) => handleOptionChange(qIdx, optIdx, 'isCorrect', e.target.checked)}
                                title="Mark Correct Answer"
                                className="h-4 w-4 rounded border-zinc-300 text-blue-600 shrink-0"
                              />
                              <input
                                type="text"
                                value={opt.text}
                                onChange={(e) => handleOptionChange(qIdx, optIdx, 'text', e.target.value)}
                                placeholder={`Option ${optIdx + 1}`}
                                className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 shadow-sm"
                              />
                              <input
                                type="text"
                                value={opt.explanation}
                                onChange={(e) => handleOptionChange(qIdx, optIdx, 'explanation', e.target.value)}
                                placeholder="Explanation (Optional)"
                                className="w-36 sm:w-48 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 shadow-sm"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveOption(qIdx, optIdx)}
                                className="text-rose-500 hover:text-rose-700 p-1"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleAddQuestionField}
                    className="w-full py-3 border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 bg-zinc-50/50 dark:bg-zinc-800/20 transition-all"
                  >
                    <Plus className="h-4 w-4" /> Add Another Question
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
            {step === 2 ? (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl"
              >
                <ArrowLeft className="h-4 w-4" /> Bank Details
              </button>
            ) : <div />}

            <div className="flex items-center gap-3">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl">
                Cancel
              </button>

              {step === 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (!title.trim()) {
                      setErrorMsg('Please enter a Question Bank Title.')
                      return
                    }
                    setErrorMsg(null)
                    setStep(2)
                  }}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/25"
                >
                  Next: Questions <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSaveAll}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/25 disabled:opacity-50"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {saving ? 'Saving...' : <><Check className="h-4 w-4" /> Save Question Bank</>}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <ImagePickerModal
        isOpen={isImagePickerOpen}
        onClose={() => setIsImagePickerOpen(false)}
        onSelectImage={(url) => {
          if (activeQuestionIndexForImage !== null) {
            handleQuestionChange(activeQuestionIndexForImage, 'imageUrl', url)
          }
        }}
        setAlert={setAlert}
      />
    </>
  )
}