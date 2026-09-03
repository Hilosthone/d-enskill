// //src/app/admin/scholarships/cohorts/page.tsx
// 'use client'

// import { useState, useEffect } from 'react'
// import { adminApiClient } from '@/services/api'
// import {
//   Layers,
//   Plus,
//   Loader2,
//   AlertCircle,
//   Calendar,
//   CheckCircle,
//   XCircle,
//   ToggleLeft,
//   ToggleRight,
// } from 'lucide-react'

// interface Cohort {
//   _id?: string
//   id?: string
//   name: string
//   code: string
//   startDate: string
//   endDate: string
//   applicationOpenDate: string
//   applicationCloseDate: string
//   status: string
// }

// export default function ScholarshipCohortsPage() {
//   const [cohorts, setCohorts] = useState<Cohort[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')

//   // Create Cohort Modal Form States
//   const [isCreateOpen, setIsCreateOpen] = useState(false)
//   const [formData, setFormData] = useState({
//     name: '',
//     code: '',
//     startDate: '',
//     endDate: '',
//     applicationOpenDate: '',
//     applicationCloseDate: '',
//   })
//   const [createLoading, setCreateLoading] = useState(false)

//   const fetchCohorts = async () => {
//     setLoading(true)
//     try {
//       const res = await adminApiClient.getScholarshipCohorts()
//       if (res.success || Array.isArray(res.cohorts || res)) {
//         setCohorts(res.cohorts || res)
//       } else {
//         setError(res.message || 'Failed to fetch scholarship cohorts.')
//       }
//     } catch (err: any) {
//       setError(err.message || 'An error occurred while loading cohorts.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchCohorts()
//   }, [])

//   const handleCreateSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setCreateLoading(true)
//     try {
//       const res = await adminApiClient.createScholarshipCohort(formData)
//       if (res.success || res.status === 'success') {
//         setIsCreateOpen(false)
//         setFormData({
//           name: '',
//           code: '',
//           startDate: '',
//           endDate: '',
//           applicationOpenDate: '',
//           applicationCloseDate: '',
//         })
//         fetchCohorts()
//       } else {
//         alert(res.message || 'Failed to create cohort.')
//       }
//     } catch (err: any) {
//       alert(err.message || 'An unexpected error occurred.')
//     } finally {
//       setCreateLoading(false)
//     }
//   }

//   const handleStatusToggle = async (id: string, currentStatus: string) => {
//     const newStatus = currentStatus === 'active' ? 'closed' : 'active'
//     try {
//       const res = await adminApiClient.updateScholarshipCohortStatus(id, newStatus)
//       if (res.success || res.status === 'success') {
//         fetchCohorts()
//       } else {
//         alert(res.message || 'Failed to update cohort status.')
//       }
//     } catch (err: any) {
//       alert(err.message || 'An unexpected error occurred.')
//     }
//   }

//   return (
//     <div className='p-6 max-w-7xl mx-auto space-y-6'>
//       {/* Header */}
//       <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
//         <div>
//           <h1 className='text-2xl font-bold text-dark dark:text-white flex items-center gap-2'>
//             <Layers className='text-primary-purple' /> Scholarship Cohorts
//           </h1>
//           <p className='text-sm text-gray-500 dark:text-gray-400'>
//             Create and manage application batches and active enrollment phases.
//           </p>
//         </div>
//         <button
//           onClick={() => setIsCreateOpen(true)}
//           className='px-4 py-2.5 rounded-xl bg-primary-purple text-white text-sm font-medium hover:opacity-95 transition flex items-center gap-2'
//         >
//           <Plus size={18} /> Create New Cohort
//         </button>
//       </div>

//       {/* Cohorts Grid */}
//       {loading ? (
//         <div className='flex justify-center items-center py-20'>
//           <Loader2 className='animate-spin text-primary-purple' size={32} />
//         </div>
//       ) : error ? (
//         <div className='flex flex-col items-center justify-center py-20 text-red-500 gap-2'>
//           <AlertCircle size={28} />
//           <p className='text-sm font-medium'>{error}</p>
//         </div>
//       ) : cohorts.length === 0 ? (
//         <div className='text-center py-20 text-gray-400 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800'>
//           <Layers size={40} className='mx-auto mb-2 opacity-40' />
//           <p className='text-sm font-medium'>No scholarship cohorts found.</p>
//         </div>
//       ) : (
//         <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
//           {cohorts.map((cohort) => {
//             const cohortId = cohort._id || cohort.id!
//             const isActive = cohort.status === 'active'
//             return (
//               <div
//                 key={cohortId}
//                 className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between space-y-4'
//               >
//                 <div className='space-y-2'>
//                   <div className='flex justify-between items-start'>
//                     <h3 className='text-lg font-bold text-dark dark:text-white'>
//                       {cohort.name}
//                     </h3>
//                     <span
//                       className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
//                         isActive
//                           ? 'bg-green-500/10 text-green-600'
//                           : 'bg-gray-500/10 text-gray-500'
//                       }`}
//                     >
//                       {cohort.status || 'inactive'}
//                     </span>
//                   </div>
//                   <p className='text-xs font-mono bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded inline-block text-primary-purple'>
//                     Code: {cohort.code}
//                   </p>
//                 </div>

//                 <div className='space-y-2 text-xs text-gray-500 dark:text-gray-400 border-t border-b border-gray-100 dark:border-gray-800 py-3'>
//                   <div className='flex justify-between'>
//                     <span>Application Opens:</span>
//                     <span className='font-medium text-dark dark:text-white'>
//                       {new Date(
//                         cohort.applicationOpenDate,
//                       ).toLocaleDateString()}
//                     </span>
//                   </div>
//                   <div className='flex justify-between'>
//                     <span>Application Closes:</span>
//                     <span className='font-medium text-dark dark:text-white'>
//                       {new Date(
//                         cohort.applicationCloseDate,
//                       ).toLocaleDateString()}
//                     </span>
//                   </div>
//                   <div className='flex justify-between'>
//                     <span>Cohort Duration:</span>
//                     <span className='font-medium text-dark dark:text-white'>
//                       {new Date(cohort.startDate).toLocaleDateString()} -{' '}
//                       {new Date(cohort.endDate).toLocaleDateString()}
//                     </span>
//                   </div>
//                 </div>

//                 <div className='flex justify-between items-center pt-2'>
//                   <span className='text-xs font-medium text-gray-400'>
//                     Toggle Status
//                   </span>
//                   <button
//                     onClick={() => handleStatusToggle(cohortId, cohort.status)}
//                     className='flex items-center gap-1.5 text-sm font-medium text-primary-purple hover:underline'
//                   >
//                     {isActive ? (
//                       <ToggleRight size={24} className='text-green-600' />
//                     ) : (
//                       <ToggleLeft size={24} className='text-gray-400' />
//                     )}
//                     {isActive ? 'Deactivate' : 'Activate'}
//                   </button>
//                 </div>
//               </div>
//             )
//           })}
//         </div>
//       )}

//       {/* Create Cohort Modal */}
//       {isCreateOpen && (
//         <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
//           <div className='bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full p-6 space-y-4 border border-gray-100 dark:border-gray-800 max-h-[90vh] overflow-y-auto'>
//             <div className='flex justify-between items-center border-b pb-3 dark:border-gray-800'>
//               <h2 className='text-lg font-bold text-dark dark:text-white'>
//                 Create Scholarship Cohort
//               </h2>
//               <button
//                 onClick={() => setIsCreateOpen(false)}
//                 className='text-gray-400 hover:text-dark'
//               >
//                 ✕
//               </button>
//             </div>

//             <form onSubmit={handleCreateSubmit} className='space-y-4'>
//               <div className='space-y-1'>
//                 <label className='text-xs font-semibold uppercase text-gray-400'>
//                   Cohort Name
//                 </label>
//                 <input
//                   required
//                   type='text'
//                   placeholder='e.g. Q3 2026 Tech Scholarship'
//                   value={formData.name}
//                   onChange={(e) =>
//                     setFormData({ ...formData, name: e.target.value })
//                   }
//                   className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple'
//                 />
//               </div>

//               <div className='space-y-1'>
//                 <label className='text-xs font-semibold uppercase text-gray-400'>
//                   Cohort Code
//                 </label>
//                 <input
//                   required
//                   type='text'
//                   placeholder='e.g. SCH-Q3-2026'
//                   value={formData.code}
//                   onChange={(e) =>
//                     setFormData({ ...formData, code: e.target.value })
//                   }
//                   className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple'
//                 />
//               </div>

//               <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
//                 <div className='space-y-1'>
//                   <label className='text-xs font-semibold uppercase text-gray-400'>
//                     Application Open Date
//                   </label>
//                   <input
//                     required
//                     type='date'
//                     value={formData.applicationOpenDate}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         applicationOpenDate: e.target.value,
//                       })
//                     }
//                     className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple'
//                   />
//                 </div>
//                 <div className='space-y-1'>
//                   <label className='text-xs font-semibold uppercase text-gray-400'>
//                     Application Close Date
//                   </label>
//                   <input
//                     required
//                     type='date'
//                     value={formData.applicationCloseDate}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         applicationCloseDate: e.target.value,
//                       })
//                     }
//                     className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple'
//                   />
//                 </div>
//               </div>

//               <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
//                 <div className='space-y-1'>
//                   <label className='text-xs font-semibold uppercase text-gray-400'>
//                     Cohort Start Date
//                   </label>
//                   <input
//                     required
//                     type='date'
//                     value={formData.startDate}
//                     onChange={(e) =>
//                       setFormData({ ...formData, startDate: e.target.value })
//                     }
//                     className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple'
//                   />
//                 </div>
//                 <div className='space-y-1'>
//                   <label className='text-xs font-semibold uppercase text-gray-400'>
//                     Cohort End Date
//                   </label>
//                   <input
//                     required
//                     type='date'
//                     value={formData.endDate}
//                     onChange={(e) =>
//                       setFormData({ ...formData, endDate: e.target.value })
//                     }
//                     className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple'
//                   />
//                 </div>
//               </div>

//               <div className='flex justify-end gap-3 pt-4 border-t dark:border-gray-800'>
//                 <button
//                   type='button'
//                   onClick={() => setIsCreateOpen(false)}
//                   className='px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm font-medium hover:bg-gray-200 transition'
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   disabled={createLoading}
//                   type='submit'
//                   className='px-4 py-2 rounded-xl bg-primary-purple text-white text-sm font-medium hover:opacity-95 transition flex items-center gap-2'
//                 >
//                   {createLoading && (
//                     <Loader2 size={16} className='animate-spin' />
//                   )}
//                   Create Cohort
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }



//src/app/admin/scholarships/cohorts/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { adminApiClient } from '@/services/admin-api'
import {
  Layers,
  Plus,
  Loader2,
  AlertCircle,
  Calendar,
  CheckCircle,
  XCircle,
  ToggleLeft,
  ToggleRight,
  Edit3,
  Trash2,
} from 'lucide-react'

interface Cohort {
  _id?: string
  id?: string
  name: string
  code: string
  startDate: string
  endDate: string
  applicationOpenDate: string
  applicationCloseDate: string
  status: string
}

export default function ScholarshipCohortsPage() {
  const [cohorts, setCohorts] = useState<Cohort[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Create Cohort Modal Form States
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    startDate: '',
    endDate: '',
    applicationOpenDate: '',
    applicationCloseDate: '',
  })
  const [createLoading, setCreateLoading] = useState(false)

  // Edit Cohort Modal Form States
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedCohortId, setSelectedCohortId] = useState<string | null>(null)
  const [editFormData, setEditFormData] = useState({
    name: '',
    code: '',
    startDate: '',
    endDate: '',
    applicationOpenDate: '',
    applicationCloseDate: '',
    status: '',
  })
  const [editLoading, setEditLoading] = useState(false)

  const fetchCohorts = async () => {
    setLoading(true)
    try {
      const res = await adminApiClient.getScholarshipCohorts()
      if (res.success || Array.isArray(res.cohorts || res)) {
        setCohorts(res.cohorts || res)
      } else {
        setError(res.message || 'Failed to fetch scholarship cohorts.')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while loading cohorts.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCohorts()
  }, [])

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateLoading(true)
    try {
      const res = await adminApiClient.createScholarshipCohort(formData)
      if (res.success || res.status === 'success') {
        setIsCreateOpen(false)
        setFormData({
          name: '',
          code: '',
          startDate: '',
          endDate: '',
          applicationOpenDate: '',
          applicationCloseDate: '',
        })
        fetchCohorts()
      } else {
        alert(res.message || 'Failed to create cohort.')
      }
    } catch (err: any) {
      alert(err.message || 'An unexpected error occurred.')
    } finally {
      setCreateLoading(false)
    }
  }

  const handleEditOpen = (cohort: Cohort) => {
    const id = cohort._id || cohort.id!
    setSelectedCohortId(id)
    setEditFormData({
      name: cohort.name || '',
      code: cohort.code || '',
      startDate: cohort.startDate ? cohort.startDate.split('T')[0] : '',
      endDate: cohort.endDate ? cohort.endDate.split('T')[0] : '',
      applicationOpenDate: cohort.applicationOpenDate
        ? cohort.applicationOpenDate.split('T')[0]
        : '',
      applicationCloseDate: cohort.applicationCloseDate
        ? cohort.applicationCloseDate.split('T')[0]
        : '',
      status: cohort.status || 'active',
    })
    setIsEditOpen(true)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCohortId) return
    setEditLoading(true)
    try {
      const res = await adminApiClient.updateScholarshipCohort(
        selectedCohortId,
        editFormData,
      )
      if (res.success || res.status === 'success') {
        setIsEditOpen(false)
        setSelectedCohortId(null)
        fetchCohorts()
      } else {
        alert(res.message || 'Failed to update cohort.')
      }
    } catch (err: any) {
      alert(err.message || 'An unexpected error occurred.')
    } finally {
      setEditLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this cohort?')) return
    try {
      const res = await adminApiClient.deleteScholarshipCohort(id)
      if (res.success || res.status === 'success') {
        fetchCohorts()
      } else {
        alert(res.message || 'Failed to delete cohort.')
      }
    } catch (err: any) {
      alert(err.message || 'An unexpected error occurred.')
    }
  }

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'closed' : 'active'
    try {
      const res = await adminApiClient.updateScholarshipCohortStatus(id, newStatus)
      if (res.success || res.status === 'success') {
        fetchCohorts()
      } else {
        alert(res.message || 'Failed to update cohort status.')
      }
    } catch (err: any) {
      alert(err.message || 'An unexpected error occurred.')
    }
  }

  return (
    <div className='p-6 max-w-7xl mx-auto space-y-6'>
      {/* Header */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-dark dark:text-white flex items-center gap-2'>
            <Layers className='text-primary-purple' /> Scholarship Cohorts
          </h1>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Create and manage application batches and active enrollment phases.
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className='px-4 py-2.5 rounded-xl bg-primary-purple text-white text-sm font-medium hover:opacity-95 transition flex items-center gap-2'
        >
          <Plus size={18} /> Create New Cohort
        </button>
      </div>

      {/* Cohorts Grid */}
      {loading ? (
        <div className='flex justify-center items-center py-20'>
          <Loader2 className='animate-spin text-primary-purple' size={32} />
        </div>
      ) : error ? (
        <div className='flex flex-col items-center justify-center py-20 text-red-500 gap-2'>
          <AlertCircle size={28} />
          <p className='text-sm font-medium'>{error}</p>
        </div>
      ) : cohorts.length === 0 ? (
        <div className='text-center py-20 text-gray-400 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800'>
          <Layers size={40} className='mx-auto mb-2 opacity-40' />
          <p className='text-sm font-medium'>No scholarship cohorts found.</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {cohorts.map((cohort) => {
            const cohortId = cohort._id || cohort.id!
            const isActive = cohort.status === 'active'
            return (
              <div
                key={cohortId}
                className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between space-y-4'
              >
                <div className='space-y-2'>
                  <div className='flex justify-between items-start'>
                    <h3 className='text-lg font-bold text-dark dark:text-white'>
                      {cohort.name}
                    </h3>
                    <div className='flex items-center gap-2'>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                          isActive
                            ? 'bg-green-500/10 text-green-600'
                            : 'bg-gray-500/10 text-gray-500'
                        }`}
                      >
                        {cohort.status || 'inactive'}
                      </span>
                    </div>
                  </div>
                  <p className='text-xs font-mono bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded inline-block text-primary-purple'>
                    Code: {cohort.code}
                  </p>
                </div>

                <div className='space-y-2 text-xs text-gray-500 dark:text-gray-400 border-t border-b border-gray-100 dark:border-gray-800 py-3'>
                  <div className='flex justify-between'>
                    <span>Application Opens:</span>
                    <span className='font-medium text-dark dark:text-white'>
                      {new Date(
                        cohort.applicationOpenDate,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Application Closes:</span>
                    <span className='font-medium text-dark dark:text-white'>
                      {new Date(
                        cohort.applicationCloseDate,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Cohort Duration:</span>
                    <span className='font-medium text-dark dark:text-white'>
                      {new Date(cohort.startDate).toLocaleDateString()} -{' '}
                      {new Date(cohort.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className='flex justify-between items-center pt-2'>
                  <div className='flex items-center gap-2'>
                    <button
                      onClick={() => handleEditOpen(cohort)}
                      className='p-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-primary-purple transition'
                      title='Edit Cohort'
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(cohortId)}
                      className='p-2 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 hover:opacity-80 transition'
                      title='Delete Cohort'
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <button
                    onClick={() => handleStatusToggle(cohortId, cohort.status)}
                    className='flex items-center gap-1.5 text-sm font-medium text-primary-purple hover:underline'
                  >
                    {isActive ? (
                      <ToggleRight size={24} className='text-green-600' />
                    ) : (
                      <ToggleLeft size={24} className='text-gray-400' />
                    )}
                    {isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Create Cohort Modal */}
      {isCreateOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full p-6 space-y-4 border border-gray-100 dark:border-gray-800 max-h-[90vh] overflow-y-auto'>
            <div className='flex justify-between items-center border-b pb-3 dark:border-gray-800'>
              <h2 className='text-lg font-bold text-dark dark:text-white'>
                Create Scholarship Cohort
              </h2>
              <button
                onClick={() => setIsCreateOpen(false)}
                className='text-gray-400 hover:text-dark'
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className='space-y-4'>
              <div className='space-y-1'>
                <label className='text-xs font-semibold uppercase text-gray-400'>
                  Cohort Name
                </label>
                <input
                  required
                  type='text'
                  placeholder='e.g. Q3 2026 Tech Scholarship'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple'
                />
              </div>

              <div className='space-y-1'>
                <label className='text-xs font-semibold uppercase text-gray-400'>
                  Cohort Code
                </label>
                <input
                  required
                  type='text'
                  placeholder='e.g. SCH-Q3-2026'
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple'
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                <div className='space-y-1'>
                  <label className='text-xs font-semibold uppercase text-gray-400'>
                    Application Open Date
                  </label>
                  <input
                    required
                    type='date'
                    value={formData.applicationOpenDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        applicationOpenDate: e.target.value,
                      })
                    }
                    className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple'
                  />
                </div>
                <div className='space-y-1'>
                  <label className='text-xs font-semibold uppercase text-gray-400'>
                    Application Close Date
                  </label>
                  <input
                    required
                    type='date'
                    value={formData.applicationCloseDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        applicationCloseDate: e.target.value,
                      })
                    }
                    className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple'
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                <div className='space-y-1'>
                  <label className='text-xs font-semibold uppercase text-gray-400'>
                    Cohort Start Date
                  </label>
                  <input
                    required
                    type='date'
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple'
                  />
                </div>
                <div className='space-y-1'>
                  <label className='text-xs font-semibold uppercase text-gray-400'>
                    Cohort End Date
                  </label>
                  <input
                    required
                    type='date'
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple'
                  />
                </div>
              </div>

              <div className='flex justify-end gap-3 pt-4 border-t dark:border-gray-800'>
                <button
                  type='button'
                  onClick={() => setIsCreateOpen(false)}
                  className='px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm font-medium hover:bg-gray-200 transition'
                >
                  Cancel
                </button>
                <button
                  disabled={createLoading}
                  type='submit'
                  className='px-4 py-2 rounded-xl bg-primary-purple text-white text-sm font-medium hover:opacity-95 transition flex items-center gap-2'
                >
                  {createLoading && (
                    <Loader2 size={16} className='animate-spin' />
                  )}
                  Create Cohort
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Cohort Modal */}
      {isEditOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full p-6 space-y-4 border border-gray-100 dark:border-gray-800 max-h-[90vh] overflow-y-auto'>
            <div className='flex justify-between items-center border-b pb-3 dark:border-gray-800'>
              <h2 className='text-lg font-bold text-dark dark:text-white'>
                Edit Scholarship Cohort
              </h2>
              <button
                onClick={() => setIsEditOpen(false)}
                className='text-gray-400 hover:text-dark'
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className='space-y-4'>
              <div className='space-y-1'>
                <label className='text-xs font-semibold uppercase text-gray-400'>
                  Cohort Name
                </label>
                <input
                  required
                  type='text'
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, name: e.target.value })
                  }
                  className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple'
                />
              </div>

              <div className='space-y-1'>
                <label className='text-xs font-semibold uppercase text-gray-400'>
                  Cohort Code
                </label>
                <input
                  required
                  type='text'
                  value={editFormData.code}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, code: e.target.value })
                  }
                  className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple'
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                <div className='space-y-1'>
                  <label className='text-xs font-semibold uppercase text-gray-400'>
                    Application Open Date
                  </label>
                  <input
                    required
                    type='date'
                    value={editFormData.applicationOpenDate}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        applicationOpenDate: e.target.value,
                      })
                    }
                    className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple'
                  />
                </div>
                <div className='space-y-1'>
                  <label className='text-xs font-semibold uppercase text-gray-400'>
                    Application Close Date
                  </label>
                  <input
                    required
                    type='date'
                    value={editFormData.applicationCloseDate}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        applicationCloseDate: e.target.value,
                      })
                    }
                    className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple'
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                <div className='space-y-1'>
                  <label className='text-xs font-semibold uppercase text-gray-400'>
                    Cohort Start Date
                  </label>
                  <input
                    required
                    type='date'
                    value={editFormData.startDate}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        startDate: e.target.value,
                      })
                    }
                    className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple'
                  />
                </div>
                <div className='space-y-1'>
                  <label className='text-xs font-semibold uppercase text-gray-400'>
                    Cohort End Date
                  </label>
                  <input
                    required
                    type='date'
                    value={editFormData.endDate}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        endDate: e.target.value,
                      })
                    }
                    className='w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-primary-purple'
                  />
                </div>
              </div>

              <div className='flex justify-end gap-3 pt-4 border-t dark:border-gray-800'>
                <button
                  type='button'
                  onClick={() => setIsEditOpen(false)}
                  className='px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm font-medium hover:bg-gray-200 transition'
                >
                  Cancel
                </button>
                <button
                  disabled={editLoading}
                  type='submit'
                  className='px-4 py-2 rounded-xl bg-primary-purple text-white text-sm font-medium hover:opacity-95 transition flex items-center gap-2'
                >
                  {editLoading && (
                    <Loader2 size={16} className='animate-spin' />
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}