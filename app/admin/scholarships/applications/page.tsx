// //src/app/admin/scholarships/applications/page.tsx
// 'use client'

// import { useState, useEffect } from 'react'
// import { apiClient } from '@/services/api'
// import {
//   Award,
//   Search,
//   Filter,
//   CheckCircle2,
//   XCircle,
//   Eye,
//   Loader2,
//   AlertCircle,
//   FileText,
//   UserCheck,
// } from 'lucide-react'

// interface Application {
//   _id: string
//   firstName: string
//   lastName: string
//   email: string
//   phone: string
//   course: string
//   cohortId?: { name: string; code: string } | string
//   status: 'pending' | 'approved' | 'rejected' | 'claimed'
//   statement?: string
//   educationalBackground?: string
//   technicalBackground?: string
//   reasonForApplying?: string
//   motivation?: string
//   portfolioUrl?: string
//   createdAt: string
// }

// export default function ScholarshipApplicationsPage() {
//   const [applications, setApplications] = useState<Application[]>([])
//   const [cohorts, setCohorts] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')

//   // Filters
//   const [selectedCohort, setSelectedCohort] = useState('')
//   const [selectedStatus, setSelectedStatus] = useState('')
//   const [searchQuery, setSearchQuery] = useState('')

//   // Modal / Action States
//   const [selectedApp, setSelectedApp] = useState<Application | null>(null)
//   const [isDetailsOpen, setIsDetailsOpen] = useState(false)
//   const [isActionModalOpen, setIsActionModalOpen] = useState(false)
//   const [actionType, setActionType] = useState<'approve' | 'reject'>('approve')
//   const [adminNotes, setAdminNotes] = useState('')
//   const [actionLoading, setActionLoading] = useState(false)

//   // Fetch initial data
//   const fetchData = async () => {
//     setLoading(true)
//     try {
//       const [appRes, cohortRes] = await Promise.all([
//         apiClient.getScholarshipApplications({
//           cohortId: selectedCohort || undefined,
//           status: selectedStatus || undefined,
//         }),
//         apiClient.getScholarshipCohorts(),
//       ])

//       if (appRes.success || Array.isArray(appRes.applications || appRes)) {
//         setApplications(appRes.applications || appRes)
//       } else {
//         setError(appRes.message || 'Failed to fetch scholarship applications.')
//       }

//       if (cohortRes.success || Array.isArray(cohortRes.cohorts || cohortRes)) {
//         setCohorts(cohortRes.cohorts || cohortRes)
//       }
//     } catch (err: any) {
//       setError(err.message || 'An error occurred while loading data.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchData()
//   }, [selectedCohort, selectedStatus])

//   const handleActionSubmit = async () => {
//     if (!selectedApp) return
//     setActionLoading(true)
//     try {
//       let res
//       if (actionType === 'approve') {
//         res = await apiClient.approveScholarshipApplication(selectedApp._id, {
//           adminNotes,
//         })
//       } else {
//         res = await apiClient.rejectScholarshipApplication(selectedApp._id, {
//           adminNotes,
//         })
//       }

//       if (res.success || res.status === 'success') {
//         setIsActionModalOpen(false)
//         setSelectedApp(null)
//         setAdminNotes('')
//         fetchData() // Refresh list
//       } else {
//         alert(res.message || `Failed to ${actionType} application.`)
//       }
//     } catch (err: any) {
//       alert(err.message || 'An unexpected error occurred.')
//     } finally {
//       setActionLoading(false)
//     }
//   }

//   // Filter applications locally by search query (Name/Email/Course)
//   const filteredApplications = applications.filter((app) => {
//     const fullName = `${app.firstName} ${app.lastName}`.toLowerCase()
//     const query = searchQuery.toLowerCase()
//     return (
//       fullName.includes(query) ||
//       app.email?.toLowerCase().includes(query) ||
//       app.course?.toLowerCase().includes(query)
//     )
//   })

//   return (
//     <div className='p-6 max-w-7xl mx-auto space-y-6'>
//       {/* Header */}
//       <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
//         <div>
//           <h1 className='text-2xl font-bold text-dark dark:text-white flex items-center gap-2'>
//             <Award className='text-primary-purple' /> Scholarship Applications
//           </h1>
//           <p className='text-sm text-gray-500 dark:text-gray-400'>
//             Review, approve, or reject student scholarship requests.
//           </p>
//         </div>
//       </div>

//       {/* Filters & Search Toolbar */}
//       <div className='bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-4 items-center justify-between'>
//         <div className='relative w-full md:w-80'>
//           <Search className='absolute left-3 top-3 text-gray-400' size={18} />
//           <input
//             type='text'
//             placeholder='Search by name, email, or course...'
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className='w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple'
//           />
//         </div>

//         <div className='flex flex-wrap items-center gap-3 w-full md:w-auto'>
//           {/* Cohort Filter */}
//           <select
//             value={selectedCohort}
//             onChange={(e) => setSelectedCohort(e.target.value)}
//             className='px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple text-gray-700 dark:text-gray-300'
//           >
//             <option value=''>All Cohorts</option>
//             {cohorts.map((cohort) => (
//               <option
//                 key={cohort._id || cohort.id}
//                 value={cohort._id || cohort.id}
//               >
//                 {cohort.name} ({cohort.code})
//               </option>
//             ))}
//           </select>

//           {/* Status Filter */}
//           <select
//             value={selectedStatus}
//             onChange={(e) => setSelectedStatus(e.target.value)}
//             className='px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple text-gray-700 dark:text-gray-300'
//           >
//             <option value=''>All Statuses</option>
//             <option value='pending'>Pending</option>
//             <option value='approved'>Approved</option>
//             <option value='rejected'>Rejected</option>
//             <option value='claimed'>Claimed</option>
//           </select>
//         </div>
//       </div>

//       {/* Main Content Table */}
//       <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm'>
//         {loading ? (
//           <div className='flex justify-center items-center py-20'>
//             <Loader2 className='animate-spin text-primary-purple' size={32} />
//           </div>
//         ) : error ? (
//           <div className='flex flex-col items-center justify-center py-20 text-red-500 gap-2'>
//             <AlertCircle size={28} />
//             <p className='text-sm font-medium'>{error}</p>
//           </div>
//         ) : filteredApplications.length === 0 ? (
//           <div className='text-center py-20 text-gray-400'>
//             <FileText size={40} className='mx-auto mb-2 opacity-40' />
//             <p className='text-sm font-medium'>
//               No scholarship applications found.
//             </p>
//           </div>
//         ) : (
//           <div className='overflow-x-auto'>
//             <table className='w-full text-left border-collapse'>
//               <thead>
//                 <tr className='border-b border-gray-100 dark:border-gray-800 text-xs font-semibold uppercase text-gray-400 bg-gray-50/50 dark:bg-gray-800/30'>
//                   <th className='p-4'>Applicant</th>
//                   <th className='p-4'>Course</th>
//                   <th className='p-4'>Contact</th>
//                   <th className='p-4'>Status</th>
//                   <th className='p-4'>Date Applied</th>
//                   <th className='p-4 text-right'>Actions</th>
//                 </tr>
//               </thead>
//               <tbody className='divide-y divide-gray-100 dark:divide-gray-800 text-sm'>
//                 {filteredApplications.map((app) => (
//                   <tr
//                     key={app._id}
//                     className='hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition'
//                   >
//                     <td className='p-4 font-medium text-dark dark:text-white'>
//                       {app.firstName} {app.lastName}
//                     </td>
//                     <td className='p-4 text-gray-600 dark:text-gray-300'>
//                       {app.course}
//                     </td>
//                     <td className='p-4 text-gray-600 dark:text-gray-300'>
//                       <div>{app.email}</div>
//                       <div className='text-xs text-gray-400'>{app.phone}</div>
//                     </td>
//                     <td className='p-4'>
//                       <span
//                         className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize inline-block ${
//                           app.status === 'approved'
//                             ? 'bg-green-500/10 text-green-600'
//                             : app.status === 'rejected'
//                               ? 'bg-red-500/10 text-red-600'
//                               : app.status === 'claimed'
//                                 ? 'bg-blue-500/10 text-blue-600'
//                                 : 'bg-amber-500/10 text-amber-600'
//                         }`}
//                       >
//                         {app.status}
//                       </span>
//                     </td>
//                     <td className='p-4 text-gray-500 text-xs'>
//                       {new Date(app.createdAt).toLocaleDateString()}
//                     </td>
//                     <td className='p-4 text-right space-x-2'>
//                       <button
//                         onClick={() => {
//                           setSelectedApp(app)
//                           setIsDetailsOpen(true)
//                         }}
//                         className='p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-primary-purple transition'
//                         title='View Details'
//                       >
//                         <Eye size={16} />
//                       </button>
//                       {app.status === 'pending' && (
//                         <>
//                           <button
//                             onClick={() => {
//                               setSelectedApp(app)
//                               setActionType('approve')
//                               setIsActionModalOpen(true)
//                             }}
//                             className='p-2 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500/20 transition'
//                             title='Approve Application'
//                           >
//                             <CheckCircle2 size={16} />
//                           </button>
//                           <button
//                             onClick={() => {
//                               setSelectedApp(app)
//                               setActionType('reject')
//                               setIsActionModalOpen(true)
//                             }}
//                             className='p-2 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 transition'
//                             title='Reject Application'
//                           >
//                             <XCircle size={16} />
//                           </button>
//                         </>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Details Modal */}
//       {isDetailsOpen && selectedApp && (
//         <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
//           <div className='bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-800'>
//             <div className='flex justify-between items-center border-b pb-4 dark:border-gray-800'>
//               <h2 className='text-lg font-bold text-dark dark:text-white'>
//                 Applicant Profile
//               </h2>
//               <button
//                 onClick={() => setIsDetailsOpen(false)}
//                 className='text-gray-400 hover:text-dark'
//               >
//                 ✕
//               </button>
//             </div>

//             <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
//               <div>
//                 <span className='font-semibold text-gray-400'>Full Name:</span>{' '}
//                 {selectedApp.firstName} {selectedApp.lastName}
//               </div>
//               <div>
//                 <span className='font-semibold text-gray-400'>Email:</span>{' '}
//                 {selectedApp.email}
//               </div>
//               <div>
//                 <span className='font-semibold text-gray-400'>Phone:</span>{' '}
//                 {selectedApp.phone}
//               </div>
//               <div>
//                 <span className='font-semibold text-gray-400'>
//                   Target Course:
//                 </span>{' '}
//                 {selectedApp.course}
//               </div>
//               <div>
//                 <span className='font-semibold text-gray-400'>Status:</span>{' '}
//                 <span className='uppercase font-bold'>
//                   {selectedApp.status}
//                 </span>
//               </div>
//               <div>
//                 <span className='font-semibold text-gray-400'>
//                   Date Applied:
//                 </span>{' '}
//                 {new Date(selectedApp.createdAt).toLocaleString()}
//               </div>
//             </div>

//             <div className='space-y-3 pt-2'>
//               <div>
//                 <h4 className='text-xs font-semibold uppercase text-gray-400 mb-1'>
//                   Statement / Motivation
//                 </h4>
//                 <p className='p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-600 dark:text-gray-300'>
//                   {selectedApp.statement ||
//                     selectedApp.motivation ||
//                     'None provided.'}
//                 </p>
//               </div>
//               <div>
//                 <h4 className='text-xs font-semibold uppercase text-gray-400 mb-1'>
//                   Technical / Educational Background
//                 </h4>
//                 <p className='p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-600 dark:text-gray-300'>
//                   {selectedApp.technicalBackground ||
//                     selectedApp.educationalBackground ||
//                     'None provided.'}
//                 </p>
//               </div>
//               {selectedApp.portfolioUrl && (
//                 <div>
//                   <h4 className='text-xs font-semibold uppercase text-gray-400 mb-1'>
//                     Portfolio
//                   </h4>
//                   <a
//                     href={selectedApp.portfolioUrl}
//                     target='_blank'
//                     rel='noopener noreferrer'
//                     className='text-primary-purple underline text-sm'
//                   >
//                     {selectedApp.portfolioUrl}
//                   </a>
//                 </div>
//               )}
//             </div>

//             <div className='flex justify-end pt-4 border-t dark:border-gray-800'>
//               <button
//                 onClick={() => setIsDetailsOpen(false)}
//                 className='px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm font-medium hover:bg-gray-200 transition'
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Action Approval / Rejection Modal */}
//       {isActionModalOpen && selectedApp && (
//         <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
//           <div className='bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 space-y-4 border border-gray-100 dark:border-gray-800'>
//             <h2 className='text-lg font-bold text-dark dark:text-white capitalize'>
//               {actionType} Scholarship Application
//             </h2>
//             <p className='text-sm text-gray-500'>
//               Are you sure you want to {actionType} the application for{' '}
//               <span className='font-semibold text-dark dark:text-white'>
//                 {selectedApp.firstName} {selectedApp.lastName}
//               </span>
//               ?
//             </p>

//             <div className='space-y-1'>
//               <label className='text-xs font-semibold uppercase text-gray-400'>
//                 Admin Notes (Optional)
//               </label>
//               <textarea
//                 rows={3}
//                 value={adminNotes}
//                 onChange={(e) => setAdminNotes(e.target.value)}
//                 placeholder='Add any internal remarks or feedback...'
//                 className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple'
//               />
//             </div>

//             <div className='flex justify-end gap-3 pt-2'>
//               <button
//                 onClick={() => setIsActionModalOpen(false)}
//                 className='px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm font-medium hover:bg-gray-200 transition'
//               >
//                 Cancel
//               </button>
//               <button
//                 disabled={actionLoading}
//                 onClick={handleActionSubmit}
//                 className={`px-4 py-2 rounded-xl text-sm font-medium text-white transition flex items-center gap-2 ${
//                   actionType === 'approve'
//                     ? 'bg-green-600 hover:bg-green-700'
//                     : 'bg-red-600 hover:bg-red-700'
//                 }`}
//               >
//                 {actionLoading && (
//                   <Loader2 size={16} className='animate-spin' />
//                 )}
//                 Confirm {actionType}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }


//src/app/admin/scholarships/applications/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/services/api' 
import {
  Award,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  Loader2,
  AlertCircle,
  FileText,
  UserCheck,
  Download,
  CheckSquare,
  Square,
  MinusSquare,
} from 'lucide-react'

interface Application {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  course: string
  cohortId?: { name: string; code: string } | string
  status: 'pending' | 'approved' | 'rejected' | 'claimed'
  statement?: string
  educationalBackground?: string
  technicalBackground?: string
  reasonForApplying?: string
  motivation?: string
  portfolioUrl?: string
  createdAt: string
}

export default function ScholarshipApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [cohorts, setCohorts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Filters
  const [selectedCohort, setSelectedCohort] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Selection & Bulk Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkActionLoading, setBulkActionLoading] = useState(false)

  // Modal / Action States
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isActionModalOpen, setIsActionModalOpen] = useState(false)
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve')
  const [adminNotes, setAdminNotes] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  // Fetch initial data
  const fetchData = async () => {
    setLoading(true)
    try {
      const [appRes, cohortRes] = await Promise.all([
        apiClient.getScholarshipApplications({
          cohortId: selectedCohort || undefined,
          status: selectedStatus || undefined,
        }),
        apiClient.getScholarshipCohorts(),
      ])

      if (appRes.success || Array.isArray(appRes.applications || appRes)) {
        setApplications(appRes.applications || appRes)
      } else {
        setError(appRes.message || 'Failed to fetch scholarship applications.')
      }

      if (cohortRes.success || Array.isArray(cohortRes.cohorts || cohortRes)) {
        setCohorts(cohortRes.cohorts || cohortRes)
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while loading data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [selectedCohort, selectedStatus])

  // Clear selections whenever filtered dataset changes
  useEffect(() => {
    setSelectedIds([])
  }, [searchQuery, selectedCohort, selectedStatus])

  const handleActionSubmit = async () => {
    if (!selectedApp) return
    setActionLoading(true)
    try {
      let res
      if (actionType === 'approve') {
        res = await apiClient.approveScholarshipApplication(selectedApp._id, {
          adminNotes,
        })
      } else {
        res = await apiClient.rejectScholarshipApplication(selectedApp._id, {
          adminNotes,
        })
      }

      if (res.success || res.status === 'success') {
        setIsActionModalOpen(false)
        setSelectedApp(null)
        setAdminNotes('')
        fetchData() // Refresh list
      } else {
        alert(res.message || `Failed to ${actionType} application.`)
      }
    } catch (err: any) {
      alert(err.message || 'An unexpected error occurred.')
    } finally {
      setActionLoading(false)
    }
  }

  // Filter applications locally by search query (Name/Email/Course)
  const filteredApplications = applications.filter((app) => {
    const fullName = `${app.firstName} ${app.lastName}`.toLowerCase()
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
      setSelectedIds(filteredApplications.map((app) => app._id))
    }
  }

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  // Bulk Action Handler
  const handleBulkAction = async (type: 'approve' | 'reject') => {
    if (selectedIds.length === 0) return
    if (!confirm(`Are you sure you want to ${type} ${selectedIds.length} applications?`)) return

    setBulkActionLoading(true)
    try {
      await Promise.all(
        selectedIds.map((id) =>
          type === 'approve'
            ? apiClient.approveScholarshipApplication(id, {})
            : apiClient.rejectScholarshipApplication(id, {})
        )
      )
      setSelectedIds([])
      fetchData()
    } catch (err: any) {
      alert(err.message || `Failed to bulk ${type} applications.`)
    } finally {
      setBulkActionLoading(false)
    }
  }

  // CSV Export Utility
  const handleExportCSV = () => {
    if (filteredApplications.length === 0) return

    const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Course', 'Status', 'Date Applied']
    const rows = filteredApplications.map((app) => [
      app.firstName,
      app.lastName,
      app.email,
      app.phone,
      app.course,
      app.status,
      new Date(app.createdAt).toLocaleDateString(),
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

  return (
    <div className='p-6 max-w-7xl mx-auto space-y-6'>
      {/* Header */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-dark dark:text-white flex items-center gap-2'>
            <Award className='text-primary-purple' /> Scholarship Applications
          </h1>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Review, approve, or reject student scholarship requests.
          </p>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExportCSV}
          disabled={filteredApplications.length === 0}
          className='flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition disabled:opacity-50'
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className='bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-4 items-center justify-between'>
        <div className='relative w-full md:w-80'>
          <Search className='absolute left-3 top-3 text-gray-400' size={18} />
          <input
            type='text'
            placeholder='Search by name, email, or course...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple'
          />
        </div>

        <div className='flex flex-wrap items-center gap-3 w-full md:w-auto'>
          {/* Bulk Actions Toolbar Pill */}
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
                Approve
              </button>
              <button
                disabled={bulkActionLoading}
                onClick={() => handleBulkAction('reject')}
                className='px-2.5 py-1 text-xs font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-1 disabled:opacity-50'
              >
                {bulkActionLoading && <Loader2 size={12} className='animate-spin' />}
                Reject
              </button>
            </div>
          )}

          {/* Cohort Filter */}
          <select
            value={selectedCohort}
            onChange={(e) => setSelectedCohort(e.target.value)}
            className='px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple text-gray-700 dark:text-gray-300'
          >
            <option value=''>All Cohorts</option>
            {cohorts.map((cohort) => (
              <option
                key={cohort._id || cohort.id}
                value={cohort._id || cohort.id}
              >
                {cohort.name} ({cohort.code})
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className='px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple text-gray-700 dark:text-gray-300'
          >
            <option value=''>All Statuses</option>
            <option value='pending'>Pending</option>
            <option value='approved'>Approved</option>
            <option value='rejected'>Rejected</option>
            <option value='claimed'>Claimed</option>
          </select>
        </div>
      </div>

      {/* Main Content Table */}
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
            <p className='text-sm font-medium'>
              No scholarship applications found.
            </p>
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
                {filteredApplications.map((app) => {
                  const isSelected = selectedIds.includes(app._id)
                  return (
                    <tr
                      key={app._id}
                      className={`hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition ${
                        isSelected ? 'bg-primary-purple/5 dark:bg-primary-purple/10' : ''
                      }`}
                    >
                      <td className='p-4 w-10'>
                        <button
                          onClick={() => toggleSelectOne(app._id)}
                          className='text-gray-400 hover:text-primary-purple transition flex items-center'
                        >
                          {isSelected ? (
                            <CheckSquare size={18} className='text-primary-purple' />
                          ) : (
                            <Square size={18} />
                          )}
                        </button>
                      </td>
                      <td className='p-4 font-medium text-dark dark:text-white'>
                        {app.firstName} {app.lastName}
                      </td>
                      <td className='p-4 text-gray-600 dark:text-gray-300'>
                        {app.course}
                      </td>
                      <td className='p-4 text-gray-600 dark:text-gray-300'>
                        <div>{app.email}</div>
                        <div className='text-xs text-gray-400'>{app.phone}</div>
                      </td>
                      <td className='p-4'>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize inline-block ${
                            app.status === 'approved'
                              ? 'bg-green-500/10 text-green-600'
                              : app.status === 'rejected'
                              ? 'bg-red-500/10 text-red-600'
                              : app.status === 'claimed'
                              ? 'bg-blue-500/10 text-blue-600'
                              : 'bg-amber-500/10 text-amber-600'
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className='p-4 text-gray-500 text-xs'>
                        {new Date(app.createdAt).toLocaleDateString()}
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
                        {app.status === 'pending' && (
                          <>
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
                          </>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {isDetailsOpen && selectedApp && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-800'>
            <div className='flex justify-between items-center border-b pb-4 dark:border-gray-800'>
              <h2 className='text-lg font-bold text-dark dark:text-white'>
                Applicant Profile
              </h2>
              <button
                onClick={() => setIsDetailsOpen(false)}
                className='text-gray-400 hover:text-dark'
              >
                ✕
              </button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
              <div>
                <span className='font-semibold text-gray-400'>Full Name:</span>{' '}
                {selectedApp.firstName} {selectedApp.lastName}
              </div>
              <div>
                <span className='font-semibold text-gray-400'>Email:</span>{' '}
                {selectedApp.email}
              </div>
              <div>
                <span className='font-semibold text-gray-400'>Phone:</span>{' '}
                {selectedApp.phone}
              </div>
              <div>
                <span className='font-semibold text-gray-400'>
                  Target Course:
                </span>{' '}
                {selectedApp.course}
              </div>
              <div>
                <span className='font-semibold text-gray-400'>Status:</span>{' '}
                <span className='uppercase font-bold'>
                  {selectedApp.status}
                </span>
              </div>
              <div>
                <span className='font-semibold text-gray-400'>
                  Date Applied:
                </span>{' '}
                {new Date(selectedApp.createdAt).toLocaleString()}
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
                    Portfolio
                  </h4>
                  <a
                    href={selectedApp.portfolioUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-primary-purple underline text-sm'
                  >
                    {selectedApp.portfolioUrl}
                  </a>
                </div>
              )}
            </div>

            <div className='flex justify-end pt-4 border-t dark:border-gray-800'>
              <button
                onClick={() => setIsDetailsOpen(false)}
                className='px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm font-medium hover:bg-gray-200 transition'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Approval / Rejection Modal */}
      {isActionModalOpen && selectedApp && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 space-y-4 border border-gray-100 dark:border-gray-800'>
            <h2 className='text-lg font-bold text-dark dark:text-white capitalize'>
              {actionType} Scholarship Application
            </h2>
            <p className='text-sm text-gray-500'>
              Are you sure you want to {actionType} the application for{' '}
              <span className='font-semibold text-dark dark:text-white'>
                {selectedApp.firstName} {selectedApp.lastName}
              </span>
              ?
            </p>

            <div className='space-y-1'>
              <label className='text-xs font-semibold uppercase text-gray-400'>
                Admin Notes (Optional)
              </label>
              <textarea
                rows={3}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder='Add any internal remarks or feedback...'
                className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple'
              />
            </div>

            <div className='flex justify-end gap-3 pt-2'>
              <button
                onClick={() => setIsActionModalOpen(false)}
                className='px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm font-medium hover:bg-gray-200 transition'
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
                {actionLoading && (
                  <Loader2 size={16} className='animate-spin' />
                )}
                Confirm {actionType}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}