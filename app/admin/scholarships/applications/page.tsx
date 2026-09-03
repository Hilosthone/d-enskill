// src/app/admin/scholarships/applications/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { adminApiClient } from '@/services/admin-api'
import {
  Award,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  Loader2,
  AlertCircle,
  FileText,
  Download,
  CheckSquare,
  Square,
  MinusSquare,
  Clock,
  CreditCard,
  UserCheck,
  X,
  Info,
} from 'lucide-react'

interface Application {
  _id?: string
  id?: string
  firstName: string
  lastName: string
  email: string
  phone: string
  course: string
  cohortId?: { name: string; code: string; _id?: string } | string
  status: 'pending' | 'approved' | 'rejected' | 'claimed' | 'awaiting-payment' | 'paid'
  statement?: string
  educationalBackground?: string
  technicalBackground?: string
  reasonForApplying?: string
  motivation?: string
  portfolioUrl?: string
  createdAt: string
}

type FilterStatus = 'all' | 'pending' | 'awaiting-payment' | 'paid' | 'approved' | 'rejected' | 'claimed'

interface SystemNotification {
  isOpen: boolean
  title: string
  message: string
  type: 'success' | 'error' | 'info'
}

export default function ScholarshipApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [cohorts, setCohorts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Filters
  const [selectedCohort, setSelectedCohort] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Selection & Bulk Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkActionLoading, setBulkActionLoading] = useState(false)

  // Details Modal
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Single Action Modal
  const [isActionModalOpen, setIsActionModalOpen] = useState(false)
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve')
  const [adminNotes, setAdminNotes] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  // Custom User-Friendly Alert Modal
  const [notification, setNotification] = useState<SystemNotification>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
  })

  const showAlert = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ isOpen: true, title, message, type })
  }

  const closeAlert = () => {
    setNotification((prev) => ({ ...prev, isOpen: false }))
  }

  // Safe ID retriever to prevent key collision or missing keys
  const getAppId = (app: Application, index: number): string => {
    return app._id || app.id || `app-fallback-${index}`
  }

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      let appRes: any

      switch (selectedStatus) {
        case 'pending':
          appRes = await adminApiClient.getPendingScholarshipApplications(selectedCohort || undefined)
          break
        case 'awaiting-payment':
          appRes = await adminApiClient.getAwaitingPaymentScholarshipApplications(selectedCohort || undefined)
          break
        case 'paid':
          appRes = await adminApiClient.getPaidScholarshipStudents(selectedCohort || undefined)
          break
        default:
          appRes = await adminApiClient.getScholarshipApplications({
            cohortId: selectedCohort || undefined,
            status: selectedStatus === 'all' ? undefined : selectedStatus,
          })
          break
      }

      const cohortRes = await adminApiClient.getScholarshipCohorts()

      const appsList = Array.isArray(appRes)
        ? appRes
        : appRes?.applications || appRes?.data || []

      if (appRes?.success !== false) {
        setApplications(appsList)
      } else {
        setError(appRes?.message || 'Failed to fetch scholarship applications.')
      }

      const cohortsList = Array.isArray(cohortRes)
        ? cohortRes
        : cohortRes?.cohorts || cohortRes?.data || []

      if (cohortRes?.success !== false) {
        setCohorts(cohortsList)
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while loading data.')
    } finally {
      setLoading(false)
    }
  }, [selectedCohort, selectedStatus])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    setSelectedIds([])
  }, [searchQuery, selectedCohort, selectedStatus])

  // Filter applications locally
  const filteredApplications = applications.filter((app) => {
    const fullName = `${app.firstName || ''} ${app.lastName || ''}`.toLowerCase()
    const query = searchQuery.toLowerCase()
    return (
      fullName.includes(query) ||
      app.email?.toLowerCase().includes(query) ||
      app.course?.toLowerCase().includes(query)
    )
  })

  // Selection Handlers
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredApplications.length) {
      setSelectedIds([])
    } else {
      const allIds = filteredApplications
        ? filteredApplications.map((app, idx) => getAppId(app, idx))
        : []
      setSelectedIds(allIds)
    }
  }

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  // Single Action Submit Handler
  const handleActionSubmit = async () => {
    if (!selectedApp) return
    const appId = getAppId(selectedApp, 0)
    setActionLoading(true)
    try {
      let res: any
      if (actionType === 'approve') {
        res = await adminApiClient.approveScholarshipApplication(appId, { adminNotes })
      } else {
        res = await adminApiClient.rejectScholarshipApplication(appId, { adminNotes })
      }

      if (res?.success || res?.status === 'success') {
        setIsActionModalOpen(false)
        setSelectedApp(null)
        setAdminNotes('')
        showAlert(
          'Action Successful',
          `Successfully ${actionType === 'approve' ? 'approved' : 'rejected'} the application.`,
          'success'
        )
        fetchData()
      } else {
        showAlert('Action Failed', res?.message || `Failed to ${actionType} application.`, 'error')
      }
    } catch (err: any) {
      showAlert('Error', err.message || 'An unexpected error occurred.', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  // Bulk Action Handler
  const handleBulkAction = async (type: 'approve' | 'reject') => {
    if (selectedIds.length === 0) return

    setBulkActionLoading(true)
    try {
      await Promise.all(
        selectedIds.map((id) =>
          type === 'approve'
            ? adminApiClient.approveScholarshipApplication(id, {})
            : adminApiClient.rejectScholarshipApplication(id, {})
        )
      )
      showAlert(
        'Bulk Action Completed',
        `Successfully updated ${selectedIds.length} application(s).`,
        'success'
      )
      setSelectedIds([])
      fetchData()
    } catch (err: any) {
      showAlert('Bulk Action Error', err.message || `Failed to perform bulk ${type}.`, 'error')
    } finally {
      setBulkActionLoading(false)
    }
  }

  // CSV Export
  const handleExportCSV = () => {
    if (filteredApplications.length === 0) return

    const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Course', 'Status', 'Date Applied']
    const rows = filteredApplications.map((app) => [
      `"${app.firstName || ''}"`,
      `"${app.lastName || ''}"`,
      `"${app.email || ''}"`,
      `"${app.phone || ''}"`,
      `"${app.course || ''}"`,
      `"${app.status || ''}"`,
      `"${app.createdAt ? new Date(app.createdAt).toLocaleDateString() : ''}"`,
    ])

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute(
      'download',
      `scholarship_applications_${new Date().toISOString().slice(0, 10)}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const isAllSelected =
    filteredApplications.length > 0 && selectedIds.length === filteredApplications.length
  const isSomeSelected = selectedIds.length > 0 && !isAllSelected

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400'
      case 'rejected':
        return 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400'
      case 'claimed':
        return 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
      case 'awaiting-payment':
        return 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400'
      case 'paid':
        return 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
      case 'pending':
      default:
        return 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'
    }
  }

  return (
    <div className='p-6 max-w-7xl mx-auto space-y-6'>
      {/* Page Title & Controls */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2'>
            <Award className='text-primary-purple' /> Scholarship Applications
          </h1>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Review, approve, track payments, or reject student scholarship applications.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={filteredApplications.length === 0}
          className='flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition disabled:opacity-50'
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Tabs */}
      <div className='flex items-center gap-2 overflow-x-auto pb-1 border-b border-gray-200 dark:border-gray-800 text-sm'>
        <button
          onClick={() => setSelectedStatus('all')}
          className={`px-3 py-2 border-b-2 font-medium whitespace-nowrap transition ${
            selectedStatus === 'all'
              ? 'border-primary-purple text-primary-purple'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          All Applications
        </button>
        <button
          onClick={() => setSelectedStatus('pending')}
          className={`px-3 py-2 border-b-2 font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
            selectedStatus === 'pending'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <Clock size={14} /> Pending Review
        </button>
        <button
          onClick={() => setSelectedStatus('awaiting-payment')}
          className={`px-3 py-2 border-b-2 font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
            selectedStatus === 'awaiting-payment'
              ? 'border-purple-500 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <CreditCard size={14} /> Awaiting Payment
        </button>
        <button
          onClick={() => setSelectedStatus('paid')}
          className={`px-3 py-2 border-b-2 font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
            selectedStatus === 'paid'
              ? 'border-emerald-500 text-emerald-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <UserCheck size={14} /> Paid Students
        </button>
      </div>

      {/* Search & Bulk Toolbar */}
      <div className='bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm'>
        <div className='relative w-full md:w-80'>
          <Search className='absolute left-3 top-3 text-gray-400' size={18} />
          <input
            type='text'
            placeholder='Search name, email, course...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple text-gray-800 dark:text-gray-200'
          />
        </div>

        <div className='flex flex-wrap items-center gap-3 w-full md:w-auto'>
          {selectedIds.length > 0 && (
            <div className='flex items-center gap-2 bg-primary-purple/10 px-3 py-1.5 rounded-xl border border-primary-purple/20'>
              <span className='text-xs font-semibold text-primary-purple'>
                {selectedIds.length} selected
              </span>
              <button
                disabled={bulkActionLoading}
                onClick={() => handleBulkAction('approve')}
                className='px-2.5 py-1 text-xs font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-1 disabled:opacity-50'
              >
                {bulkActionLoading && <Loader2 size={12} className='animate-spin' />}
                Approve Selected
              </button>
              <button
                disabled={bulkActionLoading}
                onClick={() => handleBulkAction('reject')}
                className='px-2.5 py-1 text-xs font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-1 disabled:opacity-50'
              >
                {bulkActionLoading && <Loader2 size={12} className='animate-spin' />}
                Reject Selected
              </button>
            </div>
          )}

          <select
            value={selectedCohort}
            onChange={(e) => setSelectedCohort(e.target.value)}
            className='px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:border-primary-purple text-gray-700 dark:text-gray-300'
          >
            <option value=''>All Cohorts</option>
            {cohorts.map((cohort, index) => (
              <option
                key={cohort._id || cohort.id || `cohort-${index}`}
                value={cohort._id || cohort.id}
              >
                {cohort.name} ({cohort.code})
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as FilterStatus)}
            className='px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:border-primary-purple text-gray-700 dark:text-gray-300'
          >
            <option value='all'>All Statuses</option>
            <option value='pending'>Pending</option>
            <option value='awaiting-payment'>Awaiting Payment</option>
            <option value='paid'>Paid</option>
            <option value='approved'>Approved</option>
            <option value='rejected'>Rejected</option>
            <option value='claimed'>Claimed</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm'>
        {loading ? (
          <div className='flex justify-center items-center py-20'>
            <Loader2 className='animate-spin text-primary-purple' size={32} />
          </div>
        ) : error ? (
          <div className='flex flex-col items-center justify-center py-20 text-red-500 gap-2'>
            <AlertCircle size={28} />
            <p className='text-sm font-medium'>{error}</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className='text-center py-20 text-gray-400'>
            <FileText size={40} className='mx-auto mb-2 opacity-40' />
            <p className='text-sm font-medium'>No scholarship applications found.</p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-left border-collapse'>
              <thead>
                <tr className='border-b border-gray-100 dark:border-gray-800 text-xs font-semibold uppercase text-gray-400 bg-gray-50/50 dark:bg-gray-800/30'>
                  <th className='p-4 w-10'>
                    <button
                      onClick={toggleSelectAll}
                      className='text-gray-400 hover:text-primary-purple transition flex items-center'
                      title='Select All'
                    >
                      {isAllSelected ? (
                        <CheckSquare size={18} className='text-primary-purple' />
                      ) : isSomeSelected ? (
                        <MinusSquare size={18} className='text-primary-purple' />
                      ) : (
                        <Square size={18} />
                      )}
                    </button>
                  </th>
                  <th className='p-4'>Applicant</th>
                  <th className='p-4'>Course</th>
                  <th className='p-4'>Contact</th>
                  <th className='p-4'>Status</th>
                  <th className='p-4'>Date Applied</th>
                  <th className='p-4 text-right'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100 dark:divide-gray-800 text-sm'>
                {filteredApplications.map((app, index) => {
                  const appId = getAppId(app, index)
                  const isSelected = selectedIds.includes(appId)

                  return (
                    <tr
                      key={appId}
                      className={`hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition ${
                        isSelected ? 'bg-primary-purple/5 dark:bg-primary-purple/10' : ''
                      }`}
                    >
                      <td className='p-4 w-10'>
                        <button
                          onClick={() => toggleSelectOne(appId)}
                          className='text-gray-400 hover:text-primary-purple transition flex items-center'
                        >
                          {isSelected ? (
                            <CheckSquare size={18} className='text-primary-purple' />
                          ) : (
                            <Square size={18} />
                          )}
                        </button>
                      </td>
                      <td className='p-4 font-medium text-gray-900 dark:text-white'>
                        {app.firstName} {app.lastName}
                      </td>
                      <td className='p-4 text-gray-600 dark:text-gray-300'>{app.course}</td>
                      <td className='p-4 text-gray-600 dark:text-gray-300'>
                        <div>{app.email}</div>
                        <div className='text-xs text-gray-400'>{app.phone}</div>
                      </td>
                      <td className='p-4'>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize inline-block ${getStatusBadgeStyle(
                            app.status
                          )}`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className='p-4 text-gray-500 text-xs'>
                        {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className='p-4 text-right space-x-2'>
                        <button
                          onClick={() => {
                            setSelectedApp(app)
                            setIsDetailsOpen(true)
                          }}
                          className='p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-primary-purple transition'
                          title='View Details'
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedApp(app)
                            setActionType('approve')
                            setIsActionModalOpen(true)
                          }}
                          className='p-2 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500/20 transition'
                          title='Approve Application'
                        >
                          <CheckCircle2 size={16} />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedApp(app)
                            setActionType('reject')
                            setIsActionModalOpen(true)
                          }}
                          className='p-2 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 transition'
                          title='Reject Application'
                        >
                          <XCircle size={16} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Application Details */}
      {isDetailsOpen && selectedApp && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
          <div className='bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-800 shadow-xl'>
            <div className='flex justify-between items-center border-b pb-4 dark:border-gray-800'>
              <h2 className='text-lg font-bold text-gray-900 dark:text-white'>
                Applicant Profile
              </h2>
              <button
                onClick={() => setIsDetailsOpen(false)}
                className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
              >
                <X size={20} />
              </button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
              <div>
                <span className='font-semibold text-gray-400'>Full Name:</span>{' '}
                <span className='text-gray-800 dark:text-gray-200'>
                  {selectedApp.firstName} {selectedApp.lastName}
                </span>
              </div>
              <div>
                <span className='font-semibold text-gray-400'>Email:</span>{' '}
                <span className='text-gray-800 dark:text-gray-200'>{selectedApp.email}</span>
              </div>
              <div>
                <span className='font-semibold text-gray-400'>Phone:</span>{' '}
                <span className='text-gray-800 dark:text-gray-200'>{selectedApp.phone}</span>
              </div>
              <div>
                <span className='font-semibold text-gray-400'>Target Course:</span>{' '}
                <span className='text-gray-800 dark:text-gray-200'>{selectedApp.course}</span>
              </div>
              <div>
                <span className='font-semibold text-gray-400'>Status:</span>{' '}
                <span className='uppercase font-bold text-gray-800 dark:text-gray-200'>
                  {selectedApp.status}
                </span>
              </div>
              <div>
                <span className='font-semibold text-gray-400'>Date Applied:</span>{' '}
                <span className='text-gray-800 dark:text-gray-200'>
                  {selectedApp.createdAt
                    ? new Date(selectedApp.createdAt).toLocaleString()
                    : 'N/A'}
                </span>
              </div>
            </div>

            <div className='space-y-3 pt-2'>
              <div>
                <h4 className='text-xs font-semibold uppercase text-gray-400 mb-1'>
                  Statement / Motivation
                </h4>
                <p className='p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-600 dark:text-gray-300'>
                  {selectedApp.statement ||
                    selectedApp.motivation ||
                    selectedApp.reasonForApplying ||
                    'None provided.'}
                </p>
              </div>
              <div>
                <h4 className='text-xs font-semibold uppercase text-gray-400 mb-1'>
                  Technical / Educational Background
                </h4>
                <p className='p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-600 dark:text-gray-300'>
                  {selectedApp.technicalBackground ||
                    selectedApp.educationalBackground ||
                    'None provided.'}
                </p>
              </div>
              {selectedApp.portfolioUrl && (
                <div>
                  <h4 className='text-xs font-semibold uppercase text-gray-400 mb-1'>
                    Portfolio / Github Link
                  </h4>
                  <a
                    href={selectedApp.portfolioUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-primary-purple underline text-sm break-all'
                  >
                    {selectedApp.portfolioUrl}
                  </a>
                </div>
              )}
            </div>

            <div className='flex justify-end pt-4 border-t dark:border-gray-800 gap-3'>
              <button
                onClick={() => {
                  setIsDetailsOpen(false)
                  setActionType('approve')
                  setIsActionModalOpen(true)
                }}
                className='px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition'
              >
                Approve
              </button>
              <button
                onClick={() => {
                  setIsDetailsOpen(false)
                  setActionType('reject')
                  setIsActionModalOpen(true)
                }}
                className='px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition'
              >
                Reject
              </button>
              <button
                onClick={() => setIsDetailsOpen(false)}
                className='px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 transition'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Single Approve / Reject Action */}
      {isActionModalOpen && selectedApp && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
          <div className='bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 space-y-4 border border-gray-100 dark:border-gray-800 shadow-xl'>
            <h2 className='text-lg font-bold text-gray-900 dark:text-white capitalize'>
              {actionType} Scholarship Application
            </h2>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              Are you sure you want to {actionType} the application for{' '}
              <span className='font-semibold text-gray-900 dark:text-white'>
                {selectedApp.firstName} {selectedApp.lastName}
              </span>
              ?
            </p>

            <div className='space-y-1'>
              <label className='text-xs font-semibold uppercase text-gray-400'>
                Admin Remarks (Optional)
              </label>
              <textarea
                rows={3}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder='Add feedback or approval notes...'
                className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple text-gray-800 dark:text-gray-200'
              />
            </div>

            <div className='flex justify-end gap-3 pt-2'>
              <button
                onClick={() => setIsActionModalOpen(false)}
                className='px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 transition'
              >
                Cancel
              </button>
              <button
                disabled={actionLoading}
                onClick={handleActionSubmit}
                className={`px-4 py-2 rounded-xl text-sm font-medium text-white transition flex items-center gap-2 ${
                  actionType === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {actionLoading && <Loader2 size={16} className='animate-spin' />}
                Confirm {actionType}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Custom System Alert Popup */}
      {notification.isOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
          <div className='bg-white dark:bg-gray-900 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 border border-gray-100 dark:border-gray-800 shadow-xl'>
            <div className='flex justify-center'>
              {notification.type === 'success' && (
                <div className='p-3 bg-green-500/10 rounded-full text-green-600 dark:text-green-400'>
                  <CheckCircle2 size={36} />
                </div>
              )}
              {notification.type === 'error' && (
                <div className='p-3 bg-red-500/10 rounded-full text-red-600 dark:text-red-400'>
                  <XCircle size={36} />
                </div>
              )}
              {notification.type === 'info' && (
                <div className='p-3 bg-blue-500/10 rounded-full text-blue-600 dark:text-blue-400'>
                  <Info size={36} />
                </div>
              )}
            </div>

            <div className='space-y-1'>
              <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
                {notification.title}
              </h3>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                {notification.message}
              </p>
            </div>

            <button
              onClick={closeAlert}
              className='w-full py-2.5 rounded-xl bg-primary-purple text-white text-sm font-medium hover:bg-primary-purple/90 transition'
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}
    </div>
  )
}