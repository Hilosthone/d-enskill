// app/admin/questions/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Trash2, Edit, FileQuestion, AlertCircle, CheckCircle2, Layers, Clock, Calendar, Hash, Send, CheckCircle, XCircle, FileSpreadsheet, RotateCcw } from 'lucide-react'
import { adminApiClient } from '@/services/admin-api'
import QuestionModal from './QuestionModal'
import ExcelImportModal from './ExcelImportModal'
import { QuestionBank, AlertMessage } from './types'

export default function QuestionsManagementPage() {
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([])
  const [loading, setLoading] = useState(true)
  const [alertInfo, setAlertInfo] = useState<AlertMessage | null>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBankToEdit, setSelectedBankToEdit] = useState<QuestionBank | null>(null)

  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [selectedBankForImport, setSelectedBankForImport] = useState<string | number>('')

  // Custom modal states to replace browser native confirm/prompt
  const [deleteModalBankId, setDeleteModalBankId] = useState<string | number | null>(null)
  const [reviewModalState, setReviewModalState] = useState<{
    isOpen: boolean
    bankId: string | number | null
    status: 'APPROVED' | 'REJECTED' | 'PENDING' | 'DRAFT' | null
    comment: string
  }>({
    isOpen: false,
    bankId: null,
    status: null,
    comment: '',
  })

  useEffect(() => {
    if (alertInfo) {
      const timer = setTimeout(() => setAlertInfo(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [alertInfo])

  const fetchQuestionBanks = useCallback(async () => {
    setLoading(true)
    try {
      const res = await adminApiClient.getQuestionBanks()
      const rawBanks = res?.data || res?.banks || []

      // Fetch individual question lists or counts efficiently
      const hydratedBanks = await Promise.all(
        rawBanks.map(async (bank: QuestionBank) => {
          try {
            const detailRes = await adminApiClient.getQuestionBankById(bank.id)
            const detailData = detailRes?.data || detailRes?.bank || detailRes
            const questions = detailData?.questions || detailData?.questionList || bank.questions || []
            return {
              ...bank,
              ...detailData,
              questions,
              questionsCount: questions.length,
            }
          } catch {
            return bank
          }
        })
      )

      setQuestionBanks(hydratedBanks)
    } catch (err: any) {
      setAlertInfo({ type: 'error', message: err?.message || 'Failed to load question banks.' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchQuestionBanks()
  }, [fetchQuestionBanks])

  const handleOpenCreate = () => {
    setSelectedBankToEdit(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = async (bank: QuestionBank) => {
    try {
      const res = await adminApiClient.getQuestionBankById(bank.id)
      const fullBankData = res?.data || res?.bank || bank
      setSelectedBankToEdit(fullBankData)
      setIsModalOpen(true)
    } catch (err: any) {
      setAlertInfo({ type: 'error', message: err?.message || 'Failed to fetch bank details.' })
    }
  }

  const confirmDeleteBank = async () => {
    if (!deleteModalBankId) return
    try {
      await adminApiClient.deleteQuestionBank(deleteModalBankId)
      fetchQuestionBanks()
      setAlertInfo({ type: 'success', message: 'Question bank deleted successfully.' })
    } catch (err: any) {
      setAlertInfo({ type: 'error', message: err?.message || 'Failed to delete bank.' })
    } finally {
      setDeleteModalBankId(null)
    }
  }

  const handleSubmitForReview = async (id: string | number) => {
    try {
      await adminApiClient.submitQuestionBankForReview(id)
      fetchQuestionBanks()
      setAlertInfo({ type: 'success', message: 'Submitted for review successfully.' })
    } catch (err: any) {
      setAlertInfo({ type: 'error', message: err?.message || 'Failed to submit.' })
    }
  }

  const handleOpenReviewModal = (id: string | number, status: 'APPROVED' | 'REJECTED' | 'PENDING' | 'DRAFT') => {
    setReviewModalState({
      isOpen: true,
      bankId: id,
      status,
      comment: '',
    })
  }

  const submitReviewAction = async () => {
    const { bankId, status, comment } = reviewModalState
    if (!bankId || !status) return
    try {
      await adminApiClient.reviewQuestionBank(bankId, { 
        status, 
        reviewComment: comment.trim() || undefined 
      })
      fetchQuestionBanks()
      setAlertInfo({ type: 'success', message: `Question bank status updated to ${status} successfully.` })
    } catch (err: any) {
      setAlertInfo({ type: 'error', message: err?.message || 'Failed to update review status.' })
    } finally {
      setReviewModalState({ isOpen: false, bankId: null, status: null, comment: '' })
    }
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Question Banks & Questions Management</h1>
          <p className="text-sm text-zinc-500">Create test banks, configure start/expiry times, attach pictures, and review approvals.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all"
        >
          <Plus className="mr-2 h-4 w-4" /> Create Question Bank & Questions
        </button>
      </div>

      {alertInfo && (
        <div className={`flex items-center justify-between gap-3 p-4 rounded-xl border text-sm shadow-sm ${
          alertInfo.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300'
        }`}>
          <div className="flex items-center gap-2.5">
            {alertInfo.type === 'success' ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <AlertCircle className="h-5 w-5 text-rose-600" />}
            <span className="font-medium">{alertInfo.message}</span>
          </div>
          <button onClick={() => setAlertInfo(null)} className="text-xs font-semibold opacity-70 hover:opacity-100">Dismiss</button>
        </div>
      )}

      <QuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchQuestionBanks()
          setAlertInfo({ type: 'success', message: 'Question bank saved successfully!' })
        }}
        initialBankData={selectedBankToEdit}
        setAlert={setAlertInfo}
      />

      <ExcelImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        bankId={selectedBankForImport}
        onSuccess={fetchQuestionBanks}
        setAlert={setAlertInfo}
      />

      {/* Delete Confirmation Modal */}
      {deleteModalBankId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-100 dark:bg-rose-950/50 text-rose-600 rounded-xl">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Delete Question Bank</h3>
                <p className="text-xs text-zinc-500">Are you sure you want to delete this question bank? This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => setDeleteModalBankId(null)}
                className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteBank}
                className="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-lg shadow-rose-500/25 transition-all"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Status Modal with Comment Input */}
      {reviewModalState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 capitalize">
                Review Status: {reviewModalState.status?.toLowerCase()}
              </h3>
              <button
                onClick={() => setReviewModalState({ isOpen: false, bankId: null, status: null, comment: '' })}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-zinc-500">Provide an optional review comment or note for this status change.</p>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Review Comment</label>
              <textarea
                value={reviewModalState.comment}
                onChange={(e) => setReviewModalState((prev) => ({ ...prev, comment: e.target.value }))}
                placeholder="Enter feedback or reasons for approval/rejection..."
                rows={3}
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setReviewModalState({ isOpen: false, bankId: null, status: null, comment: '' })}
                className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={submitReviewAction}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/25 transition-all"
              >
                Confirm Status
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Layers className="h-5 w-5 text-blue-600" /> Saved Question Banks ({questionBanks.length})
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-48 rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse border border-zinc-200 dark:border-zinc-700" />
            ))}
          </div>
        ) : questionBanks.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8">
            <FileQuestion className="h-12 w-12 mx-auto text-zinc-400 mb-3" />
            <p className="text-zinc-600 dark:text-zinc-400 font-medium">No question banks created yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {questionBanks.map((bank) => {
              const questionsList = bank.questions || bank.questionList || []
              const qCount = bank.questionsCount ?? bank.questions_count ?? questionsList.length
              const duration = bank.durationMinutes ?? bank.duration_minutes ?? 0
              const startTimeVal = bank.startTime || bank.start_time
              const expiresVal = bank.expiresAt || bank.expires_at
              const statusVal = bank.status || 'DRAFT'
              // const attemptsVal = bank.maxAttempts ?? bank.max_attempts ?? bank.attempts ?? bank.allowedAttempts ?? bank.allowed_attempts ?? 1
              const attemptsVal = bank.maxAttempts ?? bank.max_attempts ?? (bank as any).attempts ?? bank.allowedAttempts ?? (bank as any).allowed_attempts ?? 1

              return (
                <div key={bank.id} className="group relative flex flex-col justify-between bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm hover:shadow-md transition-all">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base line-clamp-1">{bank.title}</h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase shrink-0 ${
                        statusVal === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300' :
                        statusVal === 'REJECTED' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300' :
                        statusVal === 'PENDING' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300' :
                        'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
                      }`}>
                        {statusVal}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-500 line-clamp-2">{bank.description || 'No description provided.'}</p>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                        <span>{duration} mins</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Hash className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                        <span>{qCount} Questions</span>
                      </div>
                      <div className="col-span-2 flex items-center gap-1.5">
                        <RotateCcw className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                        <span>Attempts Allowed: {attemptsVal}</span>
                      </div>
                      {startTimeVal && (
                        <div className="col-span-2 flex items-center gap-1.5 truncate">
                          <Calendar className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate">Starts: {new Date(startTimeVal).toLocaleString()}</span>
                        </div>
                      )}
                      {expiresVal && (
                        <div className="col-span-2 flex items-center gap-1.5 truncate">
                          <Calendar className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                          <span className="truncate">Expires: {new Date(expiresVal).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-1">
                      {statusVal === 'DRAFT' && (
                        <button onClick={() => handleSubmitForReview(bank.id)} title="Submit for Review" className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50">
                          <Send className="h-4 w-4" />
                        </button>
                      )}
                      <button onClick={() => handleOpenReviewModal(bank.id, 'APPROVED')} title="Approve Bank" className={`p-1.5 rounded-lg ${statusVal === 'APPROVED' ? 'text-emerald-600 bg-emerald-50' : 'text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50'}`}>
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleOpenReviewModal(bank.id, 'REJECTED')} title="Reject Bank" className={`p-1.5 rounded-lg ${statusVal === 'REJECTED' ? 'text-rose-600 bg-rose-50' : 'text-zinc-400 hover:text-rose-600 hover:bg-rose-50'}`}>
                        <XCircle className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleOpenReviewModal(bank.id, 'PENDING')} title="Set Pending" className={`p-1.5 rounded-lg ${statusVal === 'PENDING' ? 'text-blue-600 bg-blue-50' : 'text-zinc-400 hover:text-blue-600 hover:bg-blue-50'}`}>
                        <Clock className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedBankForImport(bank.id)
                          setIsImportModalOpen(true)
                        }}
                        title="Import Questions via Excel/CSV"
                        className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50"
                      >
                        <FileSpreadsheet className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 ml-auto">
                      <button onClick={() => handleOpenEdit(bank)} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-blue-600 hover:bg-blue-50">
                        <Edit className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button onClick={() => setDeleteModalBankId(bank.id)} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50">
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}