// 'use client'
// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import {
//   CreditCard,
//   CheckCircle2,
//   Clock,
//   AlertCircle,
//   Download,
//   Loader2,
//   ArrowRight,
//   PlusCircle,
// } from 'lucide-react'
// import { apiClient } from '@/services/api'

// export default function StudentPaymentsPage() {
//   const router = useRouter()
//   const [profile, setProfile] = useState<any>(null)
//   const [payments, setPayments] = useState<any[]>([])
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     const loggedIn = sessionStorage.getItem('isLoggedIn')
//     const token =
//       typeof window !== 'undefined'
//         ? localStorage.getItem('denskill_token')
//         : null
//     const data = sessionStorage.getItem('pendingRegistration')

//     if (!loggedIn && !token) {
//       router.push('/auth/login')
//       return
//     }

//     if (data) {
//       try {
//         setProfile(JSON.parse(data))
//       } catch (e) {
//         setProfile({ firstName: 'Scholar' })
//       }
//     } else {
//       setProfile({ firstName: 'Scholar' })
//     }

//     const fetchPaymentData = async () => {
//       try {
//         const response = apiClient.getPayments
//           ? await apiClient.getPayments()
//           : null
//         if (response) {
//           if (Array.isArray(response)) {
//             setPayments(response)
//           } else if (response.payments || response.data) {
//             setPayments(response.payments || response.data)
//           }
//         }
//       } catch (err) {
//         // Fallback to default mock transaction if API fails
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchPaymentData()
//   }, [router])

//   if (isLoading) {
//     return (
//       <div className='p-6 md:p-12 space-y-6 max-w-5xl mx-auto animate-pulse'>
//         {/* Header Skeleton */}
//         <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
//           <div className='space-y-2'>
//             <div className='h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg'></div>
//             <div className='h-3 w-72 bg-gray-200 dark:bg-gray-800 rounded'></div>
//           </div>
//           <div className='h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded-xl'></div>
//         </div>

//         {/* Overview Cards Skeleton */}
//         <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//           <div className='p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3 shadow-sm'>
//             <div className='h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded'></div>
//             <div className='h-6 w-40 bg-gray-200 dark:bg-gray-800 rounded'></div>
//             <div className='h-3 w-full bg-gray-200 dark:bg-gray-800 rounded'></div>
//           </div>

//           <div className='p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3 shadow-sm flex flex-col justify-between'>
//             <div className='space-y-3'>
//               <div className='h-3 w-32 bg-gray-200 dark:bg-gray-800 rounded'></div>
//               <div className='h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded'></div>
//               <div className='h-3 w-full bg-gray-200 dark:bg-gray-800 rounded'></div>
//             </div>
//             <div className='h-4 w-36 bg-gray-200 dark:bg-gray-800 rounded mt-3'></div>
//           </div>
//         </div>

//         {/* Transaction Table Skeleton */}
//         <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm'>
//           <div className='p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center'>
//             <div className='h-4 w-36 bg-gray-200 dark:bg-gray-800 rounded'></div>
//             <div className='h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded'></div>
//           </div>
//           <div className='divide-y divide-gray-200 dark:divide-gray-800'>
//             {[1, 2, 3].map((item) => (
//               <div key={item} className='p-6 flex items-center justify-between'>
//                 <div className='space-y-2'>
//                   <div className='flex items-center gap-2'>
//                     <div className='h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded'></div>
//                     <div className='h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded-full'></div>
//                   </div>
//                   <div className='h-3 w-48 bg-gray-200 dark:bg-gray-800 rounded'></div>
//                 </div>
//                 <div className='text-right space-y-2 flex flex-col items-end'>
//                   <div className='h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded'></div>
//                   <div className='h-3 w-20 bg-gray-200 dark:bg-gray-800 rounded'></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className='p-6 md:p-12 space-y-6 max-w-5xl mx-auto'>
//       <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
//         <div>
//           <h1 className='text-2xl font-bold text-dark dark:text-white'>
//             Payments & Billing
//           </h1>
//           <p className='text-xs text-gray-500 mt-1'>
//             Manage your academy tuition, payment history, and invoices.
//           </p>
//         </div>
//         <button
//           onClick={() => router.push('/payment')}
//           className='px-5 py-2.5 bg-primary-purple text-white rounded-xl font-bold text-xs hover:opacity-95 transition-all shadow-md flex items-center gap-2 cursor-pointer'
//         >
//           <PlusCircle size={16} /> Make Additional Payment
//         </button>
//       </div>

//       {/* Overview Card */}
//       <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//         <div className='p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-2 shadow-sm'>
//           <span className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>
//             Tuition Status
//           </span>
//           <div className='flex items-center gap-2 text-amber-500 font-bold text-lg'>
//             <Clock size={20} /> Partial Payment / Active
//           </div>
//           <p className='text-xs text-gray-500'>
//             Your installment tracking is active. Review your balance status
//             below or top up your tuition.
//           </p>
//         </div>

//         <div className='p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-2 shadow-sm flex flex-col justify-between'>
//           <div>
//             <span className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>
//               Next Billing Milestone
//             </span>
//             <div className='flex items-center gap-2 text-primary-purple font-bold text-lg mt-1'>
//               <CreditCard size={20} /> Balance Due
//             </div>
//             <p className='text-xs text-gray-500 mt-1'>
//               Complete payment before expiration date to maintain full portal
//               access.
//             </p>
//           </div>
//           <button
//             onClick={() => router.push('/payment')}
//             className='text-xs text-primary-purple font-bold hover:underline flex items-center gap-1 mt-3 w-fit cursor-pointer'
//           >
//             Pay Outstanding Balance <ArrowRight size={14} />
//           </button>
//         </div>
//       </div>

//       {/* Transaction Table */}
//       <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm'>
//         <div className='p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center'>
//           <h3 className='font-bold text-dark dark:text-white text-sm'>
//             Transaction History
//           </h3>
//           <button
//             onClick={() => router.push('/payment')}
//             className='text-xs text-primary-purple font-bold hover:underline flex items-center gap-1 cursor-pointer'
//           >
//             + New Transaction
//           </button>
//         </div>
//         <div className='divide-y divide-gray-200 dark:divide-gray-800'>
//           {payments.length > 0 ? (
//             payments.map((tx, idx) => (
//               <div
//                 key={tx.id || idx}
//                 className='p-6 flex items-center justify-between text-sm'
//               >
//                 <div className='space-y-1'>
//                   <div className='flex items-center gap-2'>
//                     <p className='font-semibold text-dark dark:text-white'>
//                       {tx.course || 'Academy Tuition'}
//                     </p>
//                     <span
//                       className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
//                         tx.payment_status === 'partial'
//                           ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
//                           : 'bg-green-500/10 text-green-600 border border-green-500/20'
//                       }`}
//                     >
//                       {tx.payment_status || 'Paid'}
//                     </span>
//                   </div>
//                   <p className='text-xs text-gray-400'>
//                     Ref:{' '}
//                     <span className='font-mono text-gray-500 dark:text-gray-300'>
//                       {tx.reference}
//                     </span>{' '}
//                     • Expires: {new Date(tx.expires_at).toLocaleDateString()}
//                   </p>
//                 </div>
//                 <div className='text-right space-y-1'>
//                   <div>
//                     <span className='text-xs text-gray-400 block'>
//                       Paid / Total
//                     </span>
//                     <p className='font-bold text-dark dark:text-white'>
//                       ₦{Number(tx.amount_paid).toLocaleString()}{' '}
//                       <span className='text-xs text-gray-400 font-normal'>
//                         / ₦{Number(tx.total_amount).toLocaleString()}
//                       </span>
//                     </p>
//                   </div>
//                   <button
//                     onClick={() => router.push('/student/receipts')}
//                     className='text-xs text-primary-purple underline font-medium cursor-pointer inline-block'
//                   >
//                     View Receipt ➔
//                   </button>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className='p-8 text-center space-y-3'>
//               <p className='text-xs text-gray-400'>
//                 No transaction records found.
//               </p>
//               <button
//                 onClick={() => router.push('/payment')}
//                 className='px-4 py-2 bg-primary-purple text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer'
//               >
//                 Make Initial Payment
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// 'use client'
// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import {
//   CreditCard,
//   CheckCircle2,
//   Clock,
//   AlertCircle,
//   Download,
//   Loader2,
//   ArrowRight,
//   PlusCircle,
//   FileText,
// } from 'lucide-react'
// import { apiClient } from '@/services/api'

// export default function StudentPaymentsPage() {
//   const router = useRouter()
//   const [profile, setProfile] = useState<any>(null)
//   const [payments, setPayments] = useState<any[]>([])
//   const [isLoading, setIsLoading] = useState(true)

//   // New state for handling quick payment / invoice modal actions
//   const [selectedTx, setSelectedTx] = useState<any | null>(null)
//   const [isProcessingPayment, setIsProcessingPayment] = useState(false)

//   useEffect(() => {
//     const loggedIn = sessionStorage.getItem('isLoggedIn')
//     const token =
//       typeof window !== 'undefined'
//         ? localStorage.getItem('denskill_token')
//         : null
//     const data = sessionStorage.getItem('pendingRegistration')

//     if (!loggedIn && !token) {
//       router.push('/auth/login')
//       return
//     }

//     if (data) {
//       try {
//         setProfile(JSON.parse(data))
//       } catch (e) {
//         setProfile({ firstName: 'Scholar' })
//       }
//     } else {
//       setProfile({ firstName: 'Scholar' })
//     }

//     const fetchPaymentData = async () => {
//       try {
//         const response = apiClient.getPayments
//           ? await apiClient.getPayments()
//           : null
//         if (response) {
//           if (Array.isArray(response)) {
//             setPayments(response)
//           } else if (response.payments || response.data) {
//             setPayments(response.payments || response.data)
//           }
//         }
//       } catch (err) {
//         // Fallback or silent catch if API fails
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchPaymentData()
//   }, [router])

//   // Handle quick balance payment routing
//   const handleQuickPay = async (tx: any) => {
//     setIsProcessingPayment(true)
//     try {
//       // Safely navigate to the payment portal
//       router.push('/payment')
//     } catch (err) {
//       router.push('/payment')
//     } finally {
//       setIsProcessingPayment(false)
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className='p-6 md:p-12 space-y-6 max-w-5xl mx-auto animate-pulse'>
//         <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
//           <div className='space-y-2'>
//             <div className='h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg'></div>
//             <div className='h-3 w-72 bg-gray-200 dark:bg-gray-800 rounded'></div>
//           </div>
//           <div className='h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded-xl'></div>
//         </div>

//         <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//           <div className='p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3 shadow-sm'>
//             <div className='h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded'></div>
//             <div className='h-6 w-40 bg-gray-200 dark:bg-gray-800 rounded'></div>
//             <div className='h-3 w-full bg-gray-200 dark:bg-gray-800 rounded'></div>
//           </div>

//           <div className='p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3 shadow-sm flex flex-col justify-between'>
//             <div className='space-y-3'>
//               <div className='h-3 w-32 bg-gray-200 dark:bg-gray-800 rounded'></div>
//               <div className='h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded'></div>
//               <div className='h-3 w-full bg-gray-200 dark:bg-gray-800 rounded'></div>
//             </div>
//             <div className='h-4 w-36 bg-gray-200 dark:bg-gray-800 rounded mt-3'></div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className='p-6 md:p-12 space-y-6 max-w-5xl mx-auto'>
//       <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
//         <div>
//           <h1 className='text-2xl font-bold text-dark dark:text-white'>
//             Payments & Billing
//           </h1>
//           <p className='text-xs text-gray-500 mt-1'>
//             Manage your academy tuition, payment history, and invoices.
//           </p>
//         </div>
//         <button
//           onClick={() => router.push('/payment')}
//           className='px-5 py-2.5 bg-primary-purple text-white rounded-xl font-bold text-xs hover:opacity-95 transition-all shadow-md flex items-center gap-2 cursor-pointer'
//         >
//           <PlusCircle size={16} /> Make Additional Payment
//         </button>
//       </div>

//       {/* Overview Cards */}
//       <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//         <div className='p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-2 shadow-sm'>
//           <span className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>
//             Tuition Status
//           </span>
//           <div className='flex items-center gap-2 text-amber-500 font-bold text-lg'>
//             <Clock size={20} /> Partial Payment / Active
//           </div>
//           <p className='text-xs text-gray-500'>
//             Your installment tracking is active. Review your balance status
//             below or top up your tuition.
//           </p>
//         </div>

//         <div className='p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-2 shadow-sm flex flex-col justify-between'>
//           <div>
//             <span className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>
//               Next Billing Milestone
//             </span>
//             <div className='flex items-center gap-2 text-primary-purple font-bold text-lg mt-1'>
//               <CreditCard size={20} /> Balance Due
//             </div>
//             <p className='text-xs text-gray-500 mt-1'>
//               Complete payment before expiration date to maintain full portal
//               access.
//             </p>
//           </div>
//           <button
//             onClick={() => router.push('/payment')}
//             className='text-xs text-primary-purple font-bold hover:underline flex items-center gap-1 mt-3 w-fit cursor-pointer'
//           >
//             Pay Outstanding Balance <ArrowRight size={14} />
//           </button>
//         </div>
//       </div>

//       {/* Transaction Table */}
//       <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm'>
//         <div className='p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center'>
//           <h3 className='font-bold text-dark dark:text-white text-sm'>
//             Transaction History
//           </h3>
//           <button
//             onClick={() => router.push('/payment')}
//             className='text-xs text-primary-purple font-bold hover:underline flex items-center gap-1 cursor-pointer'
//           >
//             + New Transaction
//           </button>
//         </div>
//         <div className='divide-y divide-gray-200 dark:divide-gray-800'>
//           {payments.length > 0 ? (
//             payments.map((tx, idx) => (
//               <div
//                 key={tx.id || idx}
//                 className='p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm'
//               >
//                 <div className='space-y-1'>
//                   <div className='flex items-center gap-2'>
//                     <p className='font-semibold text-dark dark:text-white'>
//                       {tx.course || 'Academy Tuition'}
//                     </p>
//                     <span
//                       className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
//                         tx.payment_status === 'partial'
//                           ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
//                           : 'bg-green-500/10 text-green-600 border border-green-500/20'
//                       }`}
//                     >
//                       {tx.payment_status || 'Paid'}
//                     </span>
//                   </div>
//                   <p className='text-xs text-gray-400'>
//                     Ref:{' '}
//                     <span className='font-mono text-gray-500 dark:text-gray-300'>
//                       {tx.reference}
//                     </span>{' '}
//                     {tx.expires_at &&
//                       `• Expires: ${new Date(tx.expires_at).toLocaleDateString()}`}
//                   </p>
//                 </div>
//                 <div className='flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end'>
//                   <div className='text-right'>
//                     <span className='text-xs text-gray-400 block'>
//                       Paid / Total
//                     </span>
//                     <p className='font-bold text-dark dark:text-white'>
//                       ₦{Number(tx.amount_paid || 0).toLocaleString()}{' '}
//                       <span className='text-xs text-gray-400 font-normal'>
//                         / ₦{Number(tx.total_amount || 0).toLocaleString()}
//                       </span>
//                     </p>
//                   </div>
//                   <div className='flex items-center gap-3'>
//                     {tx.payment_status === 'partial' && (
//                       <button
//                         onClick={() => handleQuickPay(tx)}
//                         disabled={isProcessingPayment}
//                         className='px-3 py-1.5 bg-primary-purple text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all flex items-center gap-1.5'
//                       >
//                         {isProcessingPayment && (
//                           <Loader2 size={12} className='animate-spin' />
//                         )}
//                         Pay Balance
//                       </button>
//                     )}
//                     <button
//                       onClick={() => setSelectedTx(tx)}
//                       className='p-2 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-100 transition-all text-xs font-bold flex items-center gap-1'
//                       title='View Invoice Details'
//                     >
//                       <FileText size={14} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className='p-8 text-center space-y-3'>
//               <p className='text-xs text-gray-400'>
//                 No transaction records found.
//               </p>
//               <button
//                 onClick={() => router.push('/payment')}
//                 className='px-4 py-2 bg-primary-purple text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer'
//               >
//                 Make Initial Payment
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Invoice Details Modal */}
//       {selectedTx && (
//         <div className='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4'>
//           <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-xl text-xs'>
//             <div className='flex items-center justify-between border-b pb-4 dark:border-gray-800'>
//               <div>
//                 <span className='text-[10px] uppercase font-bold text-primary-purple tracking-wider'>
//                   Invoice Breakdown
//                 </span>
//                 <h2 className='text-lg font-bold text-dark dark:text-white'>
//                   {selectedTx.course || 'Academy Program'}
//                 </h2>
//               </div>
//               <button
//                 onClick={() => setSelectedTx(null)}
//                 className='p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 font-bold'
//               >
//                 ✕
//               </button>
//             </div>

//             <div className='space-y-3 text-gray-600 dark:text-gray-300'>
//               <div className='flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-800'>
//                 <span className='text-gray-400'>Reference ID</span>
//                 <span className='font-mono font-medium'>
//                   {selectedTx.reference}
//                 </span>
//               </div>
//               <div className='flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-800'>
//                 <span className='text-gray-400'>Payment Status</span>
//                 <span className='uppercase font-bold text-primary-purple'>
//                   {selectedTx.payment_status}
//                 </span>
//               </div>
//               <div className='flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-800'>
//                 <span className='text-gray-400'>Amount Paid</span>
//                 <span className='font-bold text-dark dark:text-white'>
//                   ₦{Number(selectedTx.amount_paid || 0).toLocaleString()}
//                 </span>
//               </div>
//               <div className='flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-800'>
//                 <span className='text-gray-400'>Total Tuition</span>
//                 <span className='font-bold text-dark dark:text-white'>
//                   ₦{Number(selectedTx.total_amount || 0).toLocaleString()}
//                 </span>
//               </div>
//               {selectedTx.expires_at && (
//                 <div className='flex justify-between py-1.5'>
//                   <span className='text-gray-400'>Installment Expiry</span>
//                   <span>
//                     {new Date(selectedTx.expires_at).toLocaleDateString()}
//                   </span>
//                 </div>
//               )}
//             </div>

//             <div className='pt-2 flex gap-3'>
//               <button
//                 onClick={() => router.push('/student/receipts')}
//                 className='flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-dark dark:text-white rounded-xl font-bold transition-all text-center'
//               >
//                 View Full Receipt
//               </button>
//               {selectedTx.payment_status === 'partial' && (
//                 <button
//                   onClick={() => handleQuickPay(selectedTx)}
//                   className='flex-1 py-2.5 bg-primary-purple text-white rounded-xl font-bold hover:opacity-90 transition-all text-center'
//                 >
//                   Pay Balance Now
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Loader2,
  ArrowRight,
  PlusCircle,
  FileText,
  Lock,
} from 'lucide-react'
import { apiClient } from '@/services/api'
import { PROGRAMMES } from '@/constants/programmes'

export default function StudentPaymentsPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [payments, setPayments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Invoice modal & inline checkout states
  const [selectedTx, setSelectedTx] = useState<any | null>(null)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  // Modal for direct payment input (when clicking Pay Balance or Additional Payment)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [activeCourse, setActiveCourse] = useState('')
  const [paymentAmount, setPaymentAmount] = useState('50000')
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const loggedIn = sessionStorage.getItem('isLoggedIn')
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('denskill_token') ||
          localStorage.getItem('token')
        : null
    const data = sessionStorage.getItem('pendingRegistration')

    if (!loggedIn && !token) {
      router.push('/auth/login')
      return
    }

    if (data) {
      try {
        setProfile(JSON.parse(data))
      } catch (e) {
        setProfile({ firstName: 'Scholar' })
      }
    } else {
      setProfile({ firstName: 'Scholar' })
    }

    const fetchPaymentData = async () => {
      try {
        const response = apiClient.getPayments
          ? await apiClient.getPayments()
          : null
        if (response) {
          if (Array.isArray(response)) {
            setPayments(response)
          } else if (response.payments || response.data) {
            setPayments(response.payments || response.data)
          }
        }
      } catch (err) {
        // Fallback or silent catch if API fails
      } finally {
        setIsLoading(false)
      }
    }

    fetchPaymentData()
  }, [router])

  // Open inline direct checkout modal with course context
  const handleOpenPaymentModal = (courseName?: string) => {
    const targetCourse =
      courseName ||
      profile?.course ||
      payments[0]?.course ||
      'Frontend Development'
    setActiveCourse(targetCourse)
    setErrorMsg('')
    setShowPaymentModal(true)
    if (selectedTx) setSelectedTx(null) // close invoice modal if open
  }

  // Execute payment and redirect to Flutterwave gateway
  const handleExecutePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    const numericAmount = Number(paymentAmount)
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setErrorMsg('Please enter a valid payment amount.')
      return
    }

    setErrorMsg('')
    setPaymentLoading(true)

    try {
      const redirect_url = `${window.location.origin}/verify`
      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('denskill_token') ||
            localStorage.getItem('token') ||
            sessionStorage.getItem('token')
          : null

      if (!token) {
        setErrorMsg('Authentication session expired. Please log in again.')
        setPaymentLoading(false)
        router.push('/auth/login')
        return
      }

      // Call installment endpoint with explicit authentication header and validated payload structure
      const response = await (apiClient.payInstallment as any)(
        {
          course: activeCourse,
          amount: numericAmount,
          redirect_url,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      // Extract authorization URL from Flutterwave backend response
      const checkoutUrl =
        response?.authorization_url ||
        response?.link ||
        response?.data?.authorization_url ||
        response?.data?.link ||
        response?.data?.data?.link

      if (checkoutUrl) {
        window.location.href = checkoutUrl
      } else {
        setErrorMsg('Failed to retrieve Flutterwave checkout URL from backend.')
        setPaymentLoading(false)
      }
    } catch (err: any) {
      console.error('Full backend error response:', err?.response?.data)
      const serverMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message
      setErrorMsg(
        serverMessage
          ? `Server Error: ${serverMessage}`
          : 'Connection error. Failed to initialize payment gateway.',
      )
      setPaymentLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className='p-6 md:p-12 space-y-6 max-w-5xl mx-auto animate-pulse'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
          <div className='space-y-2'>
            <div className='h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg'></div>
            <div className='h-3 w-72 bg-gray-200 dark:bg-gray-800 rounded'></div>
          </div>
          <div className='h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded-xl'></div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3 shadow-sm'>
            <div className='h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded'></div>
            <div className='h-6 w-40 bg-gray-200 dark:bg-gray-800 rounded'></div>
            <div className='h-3 w-full bg-gray-200 dark:bg-gray-800 rounded'></div>
          </div>

          <div className='p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3 shadow-sm flex flex-col justify-between'>
            <div className='space-y-3'>
              <div className='h-3 w-32 bg-gray-200 dark:bg-gray-800 rounded'></div>
              <div className='h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded'></div>
              <div className='h-3 w-full bg-gray-200 dark:bg-gray-800 rounded'></div>
            </div>
            <div className='h-4 w-36 bg-gray-200 dark:bg-gray-800 rounded mt-3'></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='p-6 md:p-12 space-y-6 max-w-5xl mx-auto'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-dark dark:text-white'>
            Payments & Billing
          </h1>
          <p className='text-xs text-gray-500 mt-1'>
            Manage your academy tuition, payment history, and invoices.
          </p>
        </div>
        <button
          onClick={() => handleOpenPaymentModal()}
          className='px-5 py-2.5 bg-primary-purple text-white rounded-xl font-bold text-xs hover:opacity-95 transition-all shadow-md flex items-center gap-2 cursor-pointer'
        >
          <PlusCircle size={16} /> Make Additional Payment
        </button>
      </div>

      {/* Overview Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-2 shadow-sm'>
          <span className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>
            Tuition Status
          </span>
          <div className='flex items-center gap-2 text-amber-500 font-bold text-lg'>
            <Clock size={20} /> Partial Payment / Active
          </div>
          <p className='text-xs text-gray-500'>
            Your installment tracking is active. Review your balance status
            below or top up your tuition.
          </p>
        </div>

        <div className='p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-2 shadow-sm flex flex-col justify-between'>
          <div>
            <span className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>
              Next Billing Milestone
            </span>
            <div className='flex items-center gap-2 text-primary-purple font-bold text-lg mt-1'>
              <CreditCard size={20} /> Balance Due
            </div>
            <p className='text-xs text-gray-500 mt-1'>
              Complete payment before expiration date to maintain full portal
              access.
            </p>
          </div>
          <button
            onClick={() => handleOpenPaymentModal()}
            className='text-xs text-primary-purple font-bold hover:underline flex items-center gap-1 mt-3 w-fit cursor-pointer'
          >
            Pay Outstanding Balance <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Transaction Table */}
      <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm'>
        <div className='p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center'>
          <h3 className='font-bold text-dark dark:text-white text-sm'>
            Transaction History
          </h3>
          <button
            onClick={() => handleOpenPaymentModal()}
            className='text-xs text-primary-purple font-bold hover:underline flex items-center gap-1 cursor-pointer'
          >
            + New Transaction
          </button>
        </div>
        <div className='divide-y divide-gray-200 dark:divide-gray-800'>
          {payments.length > 0 ? (
            payments.map((tx, idx) => (
              <div
                key={tx.id || idx}
                className='p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm'
              >
                <div className='space-y-1'>
                  <div className='flex items-center gap-2'>
                    <p className='font-semibold text-dark dark:text-white'>
                      {tx.course || 'Academy Tuition'}
                    </p>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        tx.payment_status === 'partial'
                          ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                          : 'bg-green-500/10 text-green-600 border border-green-500/20'
                      }`}
                    >
                      {tx.payment_status || 'Paid'}
                    </span>
                  </div>
                  <p className='text-xs text-gray-400'>
                    Ref:{' '}
                    <span className='font-mono text-gray-500 dark:text-gray-300'>
                      {tx.reference}
                    </span>{' '}
                    {tx.expires_at &&
                      `• Expires: ${new Date(tx.expires_at).toLocaleDateString()}`}
                  </p>
                </div>
                <div className='flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end'>
                  <div className='text-right'>
                    <span className='text-xs text-gray-400 block'>
                      Paid / Total
                    </span>
                    <p className='font-bold text-dark dark:text-white'>
                      ₦{Number(tx.amount_paid || 0).toLocaleString()}{' '}
                      <span className='text-xs text-gray-400 font-normal'>
                        / ₦{Number(tx.total_amount || 0).toLocaleString()}
                      </span>
                    </p>
                  </div>
                  <div className='flex items-center gap-3'>
                    {tx.payment_status === 'partial' && (
                      <button
                        onClick={() => handleOpenPaymentModal(tx.course)}
                        disabled={isProcessingPayment}
                        className='px-3 py-1.5 bg-primary-purple text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all flex items-center gap-1.5'
                      >
                        {isProcessingPayment && (
                          <Loader2 size={12} className='animate-spin' />
                        )}
                        Pay Balance
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedTx(tx)}
                      className='p-2 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-100 transition-all text-xs font-bold flex items-center gap-1'
                      title='View Invoice Details'
                    >
                      <FileText size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className='p-8 text-center space-y-3'>
              <p className='text-xs text-gray-400'>
                No transaction records found.
              </p>
              <button
                onClick={() => handleOpenPaymentModal()}
                className='px-4 py-2 bg-primary-purple text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer'
              >
                Make Initial Payment
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Details Modal */}
      {selectedTx && (
        <div className='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4'>
          <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-xl text-xs'>
            <div className='flex items-center justify-between border-b pb-4 dark:border-gray-800'>
              <div>
                <span className='text-[10px] uppercase font-bold text-primary-purple tracking-wider'>
                  Invoice Breakdown
                </span>
                <h2 className='text-lg font-bold text-dark dark:text-white'>
                  {selectedTx.course || 'Academy Program'}
                </h2>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className='p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 font-bold'
              >
                ✕
              </button>
            </div>

            <div className='space-y-3 text-gray-600 dark:text-gray-300'>
              <div className='flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-800'>
                <span className='text-gray-400'>Reference ID</span>
                <span className='font-mono font-medium'>
                  {selectedTx.reference}
                </span>
              </div>
              <div className='flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-800'>
                <span className='text-gray-400'>Payment Status</span>
                <span className='uppercase font-bold text-primary-purple'>
                  {selectedTx.payment_status}
                </span>
              </div>
              <div className='flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-800'>
                <span className='text-gray-400'>Amount Paid</span>
                <span className='font-bold text-dark dark:text-white'>
                  ₦{Number(selectedTx.amount_paid || 0).toLocaleString()}
                </span>
              </div>
              <div className='flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-800'>
                <span className='text-gray-400'>Total Tuition</span>
                <span className='font-bold text-dark dark:text-white'>
                  ₦{Number(selectedTx.total_amount || 0).toLocaleString()}
                </span>
              </div>
              {selectedTx.expires_at && (
                <div className='flex justify-between py-1.5'>
                  <span className='text-gray-400'>Installment Expiry</span>
                  <span>
                    {new Date(selectedTx.expires_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            <div className='pt-2 flex gap-3'>
              <button
                onClick={() => router.push('/student/receipts')}
                className='flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-dark dark:text-white rounded-xl font-bold transition-all text-center'
              >
                View Full Receipt
              </button>
              {selectedTx.payment_status === 'partial' && (
                <button
                  onClick={() => handleOpenPaymentModal(selectedTx.course)}
                  className='flex-1 py-2.5 bg-primary-purple text-white rounded-xl font-bold hover:opacity-90 transition-all text-center'
                >
                  Pay Balance Now
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Direct Payment Checkout Modal */}
      {showPaymentModal && (
        <div className='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4'>
          <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-xl'>
            <div className='flex items-center justify-between border-b pb-4 dark:border-gray-800'>
              <div>
                <span className='text-[10px] uppercase font-bold text-orange-500 tracking-wider'>
                  Flutterwave Checkout
                </span>
                <h2 className='text-lg font-bold text-dark dark:text-white'>
                  Secure Installment Top-up
                </h2>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className='p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 font-bold'
              >
                ✕
              </button>
            </div>

            <div className='p-3 rounded-xl bg-orange-500/5 border border-orange-500/20 text-xs space-y-1 text-gray-600 dark:text-gray-300'>
              <div className='flex justify-between'>
                <span>Selected Course:</span>
                <span className='font-bold text-dark dark:text-white truncate max-w-[200px]'>
                  {activeCourse}
                </span>
              </div>
            </div>

            {errorMsg && (
              <div className='p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl flex items-center gap-2'>
                <AlertCircle size={16} className='shrink-0' />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleExecutePayment} className='space-y-4 text-xs'>
              <div>
                <label className='block font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                  Payment Amount (₦)
                </label>
                <input
                  type='number'
                  required
                  min='1'
                  step='any'
                  className='w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-dark dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm'
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
              </div>

              <button
                type='submit'
                disabled={paymentLoading}
                className='w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-60 text-xs'
              >
                {paymentLoading ? (
                  <>
                    <Loader2 size={16} className='animate-spin' /> Connecting to
                    Flutterwave...
                  </>
                ) : (
                  <>
                    <span>
                      Pay ₦{Number(paymentAmount || 0).toLocaleString()}
                    </span>
                    <span className='text-[9px] bg-white/20 px-1.5 py-0.5 rounded font-mono text-white'>
                      Live SSL
                    </span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}