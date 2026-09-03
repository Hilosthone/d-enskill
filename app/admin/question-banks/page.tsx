'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Send, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Eye, 
  ShieldCheck, 
  Clock, 
  RotateCcw, 
  AlertTriangle, 
  HelpCircle, 
  MessageSquare, 
  Loader2, 
  CheckCircle2, 
  X 
} from 'lucide-react'
import Link from 'next/link'
import QuestionModal from './QuestionModal'
import { adminApiClient } from '@/services/admin-api'

export default function QuestionBanksPage() {
  const [banks, setBanks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBank, setSelectedBank] = useState<any | null>(null)
  
  // Student View Preview State
  const [previewBank, setPreviewBank] = useState<any | null>(null)
  const [previewQuestions, setPreviewQuestions] = useState<any[]>([])
  const [previewLoading, setPreviewLoading] = useState(false)

  // Custom Modal States (Replacing window.alert, window.confirm, window.prompt)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    confirmText?: string
    onConfirm: () => void
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} })

  const [promptModal, setPromptModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    value: string
    onConfirm: (val: string) => void
  }>({ isOpen: false, title: '', message: '', value: '', onConfirm: () => {} })

  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    type: 'success' | 'error'
  }>({ isOpen: false, title: '', message: '', type: 'success' })

  const showAlert = (title: string, message: string, type: 'success' | 'error' = 'success') => {
    setAlertModal({ isOpen: true, title, message, type })
  }

  const fetchBanks = useCallback(async () => {
    setLoading(true)
    try {
      const res = await adminApiClient.getQuestionBanks({
        search: search || undefined,
        status: statusFilter || undefined,
      })
      if (res?.success || res?.data) {
        setBanks(res.data || res.banks || [])
      }
    } catch (error: any) {
      showAlert('Error', error?.message || 'Failed to fetch question bank collections.', 'error')
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter])

  useEffect(() => {
    fetchBanks()
  }, [fetchBanks])

  const handleSaveBank = async (data: any) => {
    try {
      if (selectedBank?.id) {
        await adminApiClient.updateQuestionBank(selectedBank.id, data)
      } else {
        await adminApiClient.createQuestionBank(data)
      }
      fetchBanks()
      showAlert('Success', 'Question bank saved successfully!', 'success')
    } catch (err: any) {
      showAlert('Error', err?.message || 'Failed to save question bank.', 'error')
      throw err
    }
  }

  const handleDelete = (id: string | number) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Question Bank',
      message: 'Are you sure you want to delete this question bank? This action cannot be undone.',
      confirmText: 'Delete Bank',
      onConfirm: async () => {
        try {
          await adminApiClient.deleteQuestionBank(id)
          fetchBanks()
          showAlert('Deleted', 'Question bank has been deleted successfully.', 'success')
        } catch (err: any) {
          showAlert('Error', err?.message || 'Failed to delete question bank.', 'error')
        }
      }
    })
  }

  const handleSubmitForReview = (id: string | number) => {
    setConfirmModal({
      isOpen: true,
      title: 'Submit for Review',
      message: 'Are you ready to submit this question bank for administrative review?',
      confirmText: 'Submit Now',
      onConfirm: async () => {
        try {
          await adminApiClient.submitQuestionBankForReview(id)
          showAlert('Submitted', 'Question bank successfully submitted for review!', 'success')
          fetchBanks()
        } catch (err: any) {
          showAlert('Error', err?.message || 'Failed to submit bank for review.', 'error')
        }
      }
    })
  }

  const handleReviewAction = (id: string | number, status: 'APPROVED' | 'REJECTED') => {
    setPromptModal({
      isOpen: true,
      title: `${status === 'APPROVED' ? 'Approve' : 'Reject'} Question Bank`,
      message: `Please provide a review comment for status change to ${status}:`,
      value: '',
      onConfirm: async (comment) => {
        try {
          await adminApiClient.reviewQuestionBank(id, { status, reviewComment: comment })
          showAlert('Updated', `Bank successfully marked as ${status}!`, 'success')
          fetchBanks()
        } catch (err: any) {
          showAlert('Error', err?.message || 'Review action failed.', 'error')
        }
      }
    })
  }

  const openStudentPreview = async (bank: any) => {
    setPreviewBank(bank)
    setPreviewLoading(true)
    try {
      const res = await adminApiClient.getQuestions({ question_bank_id: bank.id })
      setPreviewQuestions(res.data || res.questions || [])
    } catch (err) {
      setPreviewQuestions([])
    } finally {
      setPreviewLoading(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-fadeIn">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Question Banks Holder</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Organize test collections, dispatch to reviewers, and monitor candidate pools.</p>
        </div>
        <button
          onClick={() => { setSelectedBank(null); setIsModalOpen(true); }}
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25"
        >
          <Plus className="mr-2 h-4 w-4" /> Create Bank Holder
        </button>
      </div>

      {/* Filter and Search Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
        <div className="relative sm:col-span-8 w-full">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search question bank title or metadata..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-zinc-300 bg-white pl-10 pr-4 py-2.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 shadow-sm"
          />
        </div>
        <div className="sm:col-span-4 w-full">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 shadow-sm"
          >
            <option value="">All Review Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PENDING">Pending Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Main Table Card Box */}
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400">
                <th className="p-4">Title & Details</th>
                <th className="p-4">Status</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Attempts</th>
                <th className="p-4 text-right">Actions / Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-zinc-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                      <span className="text-sm font-medium">Loading question banks...</span>
                    </div>
                  </td>
                </tr>
              ) : banks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-zinc-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileText className="h-8 w-8 text-zinc-300 dark:text-zinc-700" />
                      <p className="font-medium">No question banks found.</p>
                      <p className="text-xs text-zinc-400">Try adjusting your search terms or create a new bank holder.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                banks.map((bank) => (
                  <tr key={bank.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100">{bank.title}</div>
                      <div className="text-xs text-zinc-500 truncate max-w-xs">{bank.description || 'No instructions provided'}</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                        bank.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300' :
                        bank.status === 'PENDING' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300' :
                        bank.status === 'REJECTED' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300' :
                        'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300'
                      }`}>
                        {bank.status || 'DRAFT'}
                      </span>
                    </td>
                    <td className="p-4 text-zinc-600 dark:text-zinc-400">{bank.durationMinutes ? `${bank.durationMinutes} mins` : 'N/A'}</td>
                    <td className="p-4 text-zinc-600 dark:text-zinc-400">{bank.maxAttempts ?? 'Unlimited'}</td>
                    <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => openStudentPreview(bank)}
                        title="Student View Preview"
                        className="inline-flex p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <Link
                        href={`/admin/questions?question_bank_id=${bank.id}`}
                        title="Manage Questions & Setup"
                        className="inline-flex p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                      >
                        <FileText className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleSubmitForReview(bank.id)}
                        title="Submit for Review"
                        className="inline-flex p-2 rounded-lg text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleReviewAction(bank.id, 'APPROVED')}
                        title="Approve Bank"
                        className="inline-flex p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => { setSelectedBank(bank); setIsModalOpen(true); }}
                        title="Edit Holder"
                        className="inline-flex p-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(bank.id)}
                        title="Delete Bank"
                        className="inline-flex p-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <QuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBank}
        initialData={selectedBank}
      />

      {/* Student View Live Preview Modal */}
      {previewBank && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">Student Examination View Simulation</span>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{previewBank.title}</h3>
              </div>
              <button
                onClick={() => setPreviewBank(null)}
                className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              {/* Boxed Stats Cards instead of full line string */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Duration</p>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{previewBank.durationMinutes || 'Unset'} mins</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                  <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600">
                    <RotateCcw className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Max Attempts</p>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{previewBank.maxAttempts ?? 'Unlimited'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Total Items</p>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{previewQuestions.length} questions</p>
                  </div>
                </div>
              </div>

              {previewLoading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-zinc-500">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  <span className="text-sm font-medium">Simulating student interface...</span>
                </div>
              ):(
                previewQuestions.length === 0 ? (
                  <div className="py-12 text-center text-zinc-500 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
                    <p className="font-medium">No questions mapped into this bank yet.</p>
                    <p className="text-xs text-zinc-400 mt-1">Head over to the Questions page to add test items!</p>
                  </div>
                ) : (
                  <div className="space-y-6 pt-2">
                    {previewQuestions.map((q, i) => (
                      <div key={q.id || i} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm space-y-3">
                        <div className="flex items-start justify-between">
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100">Q{i + 1}. {q.questionText || q.question_text}</span>
                          <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 px-2 py-0.5 rounded font-medium">[{q.marks || 1} mark(s)]</span>
                        </div>
                        {(q.imageUrl || q.image_url) && (
                          <img src={q.imageUrl || q.image_url} alt="Question Asset" className="max-h-48 rounded-lg object-contain border border-zinc-200 dark:border-zinc-700" />
                        )}
                        <div className="space-y-2 pl-2">
                          {(q.options || []).map((opt: any, optIdx: number) => (
                            <label key={optIdx} className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                              <input type="radio" name={`preview-q-${q.id || i}`} className="text-blue-600 focus:ring-blue-500" />
                              <span>{opt.text || opt.optionText || opt.option_text}</span>
                              {(opt.isCorrect || opt.is_correct) && (
                                <span className="ml-auto text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.5 rounded">Correct Answer</span>
                              )}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Beautiful Confirmation Modal (Replaces browser confirm) */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4 animate-scaleUp">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{confirmModal.title}</h3>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">{confirmModal.message}</p>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                className="rounded-xl px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  confirmModal.onConfirm()
                  setConfirmModal({ ...confirmModal, isOpen: false })
                }}
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 transition-all shadow-md shadow-rose-500/20"
              >
                {confirmModal.confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Beautiful Prompt Modal (Replaces browser prompt) */}
      {promptModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4 animate-scaleUp">
            <div className="flex items-center gap-3 text-blue-600">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{promptModal.title}</h3>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">{promptModal.message}</p>
            <textarea
              rows={3}
              value={promptModal.value}
              onChange={(e) => setPromptModal({ ...promptModal, value: e.target.value })}
              placeholder="Enter your comment here..."
              className="w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setPromptModal({ ...promptModal, isOpen: false })}
                className="rounded-xl px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  promptModal.onConfirm(promptModal.value)
                  setPromptModal({ ...promptModal, isOpen: false })
                }}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Beautiful Alert Modal (Replaces browser alert) */}
      {alertModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4 text-center animate-scaleUp">
            <div className="flex justify-center">
              {alertModal.type === 'success' ? (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600">
                  <XCircle className="h-8 w-8" />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{alertModal.title}</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">{alertModal.message}</p>
            </div>
            <button
              type="button"
              onClick={() => setAlertModal({ ...alertModal, isOpen: false })}
              className="w-full rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-2.5 text-sm font-medium hover:opacity-95 transition-all shadow-md"
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  )
}