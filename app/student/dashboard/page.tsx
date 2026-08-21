// //src/app/student/dashboard/page.tsx
// 'use client'
// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import {
//   BookOpen,
//   CheckCircle2,
//   CreditCard,
//   MessageCircle,
//   ArrowRight,
//   Award,
//   Clock,
//   Bell,
//   UserCheck,
// } from 'lucide-react'
// import { apiClient } from '@/services/api'

// export default function StudentDashboardPage() {
//   const router = useRouter()
//   const [profile, setProfile] = useState<any>(null)
//   const [overview, setOverview] = useState<any>(null)
//   const [installmentData, setInstallmentData] = useState<any>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [isLoadingInstallment, setIsLoadingInstallment] = useState(true)

//   useEffect(() => {
//     const loggedIn = sessionStorage.getItem('isLoggedIn')
//     const token =
//       typeof window !== 'undefined'
//         ? localStorage.getItem('denskill_token')
//         : null
//     const data = sessionStorage.getItem('pendingRegistration')

//     if (!loggedIn && !token) {
//       router.push('/programmes')
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

//     const fetchDashboardData = async () => {
//       try {
//         const response = apiClient.getDashboardOverview
//           ? await apiClient.getDashboardOverview()
//           : null

//         let userObj = null
//         if (response && response.status === 'success') {
//           setOverview(response)
//           if (response.user) {
//             userObj = response.user
//             setProfile(userObj)
//             sessionStorage.setItem(
//               'pendingRegistration',
//               JSON.stringify(userObj),
//             )
//           }
//         } else {
//           // Fallback to profile check if overview fails
//           const profileRes = apiClient.getStudentProfile
//             ? await apiClient.getStudentProfile()
//             : null
//           if (profileRes && (profileRes.user || profileRes.data)) {
//             userObj = profileRes.user || profileRes.data
//             setProfile(userObj)
//             sessionStorage.setItem(
//               'pendingRegistration',
//               JSON.stringify(userObj),
//             )
//           }
//         }

//         // Fetch Installment Status using the active course name
//         const currentCourseName =
//           overview?.courses?.[0]?.course ||
//           userObj?.course ||
//           userObj?.program ||
//           'Software Engineering'

//         if (currentCourseName && apiClient.getInstallmentStatus) {
//           try {
//             const installmentRes =
//               await apiClient.getInstallmentStatus(currentCourseName)
//             if (installmentRes) {
//               setInstallmentData(installmentRes.data || installmentRes)
//             }
//           } catch (instErr) {
//             // Silently handle if installment status is not applicable
//           } finally {
//             setIsLoadingInstallment(false)
//           }
//         } else {
//           setIsLoadingInstallment(false)
//         }
//       } catch (err) {
//         // Fallback to session storage profile if network fails
//         setIsLoadingInstallment(false)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchDashboardData()
//   }, [router])

//   if (isLoading) {
//     return (
//       <div className='p-6 md:p-12 space-y-8 max-w-5xl mx-auto animate-pulse'>
//         {/* Welcome Banner Skeleton */}
//         <div className='bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-3'>
//           <div className='h-3 w-32 bg-gray-200 dark:bg-gray-800 rounded' />
//           <div className='h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded' />
//           <div className='h-4 w-96 bg-gray-200 dark:bg-gray-800 rounded' />
//         </div>

//         {/* Metrics Grid Skeleton */}
//         <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
//           {[1, 2, 3].map((i) => (
//             <div
//               key={i}
//               className='p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4'
//             >
//               <div className='flex justify-between'>
//                 <div className='h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded' />
//                 <div className='w-5 h-5 bg-gray-200 dark:bg-gray-800 rounded-full' />
//               </div>
//               <div className='h-6 w-36 bg-gray-200 dark:bg-gray-800 rounded' />
//               <div className='h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded' />
//             </div>
//           ))}
//         </div>

//         {/* Installment Section Skeleton */}
//         <div className='bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6'>
//           <div className='flex justify-between border-b pb-4 dark:border-gray-800'>
//             <div className='space-y-2'>
//               <div className='h-5 w-64 bg-gray-200 dark:bg-gray-800 rounded' />
//               <div className='h-3 w-48 bg-gray-200 dark:bg-gray-800 rounded' />
//             </div>
//             <div className='h-9 w-32 bg-gray-200 dark:bg-gray-800 rounded-xl' />
//           </div>
//           <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
//             {[1, 2, 3].map((i) => (
//               <div
//                 key={i}
//                 className='p-4 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 space-y-2'
//               >
//                 <div className='h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded' />
//                 <div className='h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded' />
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (!profile) return null

//   const activeCourse = overview?.courses?.[0] || null
//   const latestAnnouncement = overview?.announcements?.[0] || null

//   return (
//     <div className='p-6 md:p-12 space-y-8 max-w-5xl mx-auto'>
//       {/* Welcome Banner */}
//       <div className='flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm gap-4 relative overflow-hidden'>
//         <div className='absolute right-0 top-0 w-32 h-32 bg-primary-purple/5 rounded-full blur-2xl pointer-events-none' />
//         <div className='space-y-1 relative z-10'>
//           <span className='text-[10px] uppercase tracking-wider text-gray-400 font-bold block'>
//             Student Portal Dashboard
//           </span>
//           <h1 className='text-2xl md:text-3xl font-bold text-dark dark:text-white'>
//             Welcome back, {profile.firstName || profile.name || 'Scholar'}! 👋
//           </h1>
//           <p className='text-xs text-gray-500 dark:text-gray-400'>
//             Your technical workspace is initialized and ready for deployment.
//           </p>
//         </div>
//         <div className='flex items-center gap-2 px-4 py-2 bg-primary-purple/15 text-primary-purple text-xs rounded-full font-bold relative z-10'>
//           <Award size={16} /> Enrolled Scholar
//         </div>
//       </div>

//       {/* Announcements Banner */}
//       {latestAnnouncement && (
//         <div className='p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-4'>
//           <div className='p-2 bg-amber-500 text-white rounded-xl mt-0.5'>
//             <Bell size={18} />
//           </div>
//           <div className='space-y-1'>
//             <div className='flex items-center gap-2'>
//               <h4 className='font-bold text-dark dark:text-white text-xs'>
//                 {latestAnnouncement.title}
//               </h4>
//               <span className='text-[10px] text-gray-400'>
//                 {new Date(latestAnnouncement.created_at).toLocaleDateString()}
//               </span>
//             </div>
//             <p className='text-xs text-gray-600 dark:text-gray-300'>
//               {latestAnnouncement.content}
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Metrics / Overview Grid */}
//       <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
//         {/* Card 1: Active Program & Tutor */}
//         <div className='p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between space-y-4'>
//           <div>
//             <div className='flex items-center justify-between text-gray-400 mb-2'>
//               <span className='text-xs font-semibold'>Active Program</span>
//               <BookOpen size={18} className='text-primary-purple' />
//             </div>
//             <p className='text-base font-bold text-dark dark:text-white leading-snug'>
//               {activeCourse?.course ||
//                 profile.course ||
//                 profile.program ||
//                 'Mobile Development'}
//             </p>
//             {activeCourse?.tutor_name ? (
//               <div className='mt-2 pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center gap-1.5 text-xs text-gray-500'>
//                 <UserCheck size={14} className='text-primary-purple' />
//                 <span>
//                   Tutor:{' '}
//                   <strong className='text-dark dark:text-white'>
//                     {activeCourse.tutor_name}
//                   </strong>
//                 </span>
//               </div>
//             ) : (
//               <p className='text-[11px] text-gray-400 mt-1'>
//                 Tutor assignment pending
//               </p>
//             )}
//           </div>
//           <span className='text-[10px] bg-primary-purple/15 text-primary-purple px-2.5 py-1 rounded-md font-semibold inline-block w-fit'>
//             Status: {activeCourse?.payment_status || 'Active'}
//           </span>
//         </div>

//         {/* Card 2: Payment Status */}
//         <div className='p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between space-y-4'>
//           <div>
//             <div className='flex items-center justify-between text-gray-400 mb-2'>
//               <span className='text-xs font-semibold'>Credential Status</span>
//               <CheckCircle2 size={18} className='text-green-600' />
//             </div>
//             <p className='text-lg font-bold text-green-600 flex items-center gap-1.5'>
//               {activeCourse?.payment_status === 'partial'
//                 ? 'Partial / Verified'
//                 : 'Active / Verified'}
//             </p>
//             <p className='text-[11px] text-gray-500 mt-0.5'>
//               {activeCourse
//                 ? `Paid ₦${Number(activeCourse.amount_paid).toLocaleString()} of ₦${Number(activeCourse.total_amount).toLocaleString()}`
//                 : 'Automated receipt generated.'}
//             </p>
//           </div>
//           <button
//             onClick={() => router.push('/student/receipts')}
//             className='text-[11px] text-primary-purple font-bold hover:underline flex items-center gap-1 w-fit cursor-pointer'
//           >
//             View Digital Receipts <ArrowRight size={12} />
//           </button>
//         </div>

//         {/* Card 3: Access Hub */}
//         <div className='p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between space-y-4'>
//           <div>
//             <div className='flex items-center justify-between text-gray-400 mb-2'>
//               <span className='text-xs font-semibold'>Access Level</span>
//               <CreditCard size={18} className='text-primary-red' />
//             </div>
//             <p className='text-lg font-bold text-dark dark:text-white'>
//               Full Hub Tier
//             </p>
//             <p className='text-[11px] text-gray-500 mt-0.5'>
//               All technical modules unlocked.
//             </p>
//           </div>
//           <button
//             onClick={() => router.push('/student/payments')}
//             className='text-[11px] text-primary-red font-bold hover:underline flex items-center gap-1 w-fit cursor-pointer'
//           >
//             Manage Billing & Balances <ArrowRight size={12} />
//           </button>
//         </div>
//       </div>

//       {/* Installment Breakdown & Timeline Section */}
//       <div className='bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6'>
//         <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 dark:border-gray-800'>
//           <div>
//             <h3 className='font-bold text-dark dark:text-white text-base flex items-center gap-2'>
//               <Clock className='text-primary-purple' size={20} />
//               Installment Breakdown & Timeline Health
//             </h3>
//             <p className='text-xs text-gray-500'>
//               Track your tuition milestone progression and payment schedule
//               health.
//             </p>
//           </div>
//           <button
//             onClick={() => router.push('/student/payments')}
//             className='px-4 py-2 bg-primary-purple/15 text-primary-purple hover:bg-primary-purple/20 text-xs font-bold rounded-xl transition cursor-pointer'
//           >
//             Pay Next Installment
//           </button>
//         </div>

//         {isLoadingInstallment ? (
//           <div className='space-y-6 animate-pulse'>
//             <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
//               {[1, 2, 3].map((i) => (
//                 <div
//                   key={i}
//                   className='p-4 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 space-y-2'
//                 >
//                   <div className='h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded' />
//                   <div className='h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded' />
//                 </div>
//               ))}
//             </div>
//             <div className='space-y-3'>
//               <div className='h-3 w-32 bg-gray-200 dark:bg-gray-800 rounded' />
//               <div className='space-y-2'>
//                 {[1, 2].map((i) => (
//                   <div
//                     key={i}
//                     className='h-16 rounded-xl bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800'
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>
//         ) : installmentData ? (
//           <div className='space-y-6'>
//             <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
//               <div className='p-4 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800'>
//                 <span className='text-[11px] text-gray-500 uppercase tracking-wider block font-semibold'>
//                   Total Course Fee
//                 </span>
//                 <p className='text-lg font-bold text-dark dark:text-white mt-1'>
//                   ₦
//                   {Number(
//                     installmentData.totalAmount ||
//                       installmentData.total_amount ||
//                       0,
//                   ).toLocaleString()}
//                 </p>
//               </div>
//               <div className='p-4 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800'>
//                 <span className='text-[11px] text-gray-500 uppercase tracking-wider block font-semibold'>
//                   Total Paid Balance
//                 </span>
//                 <p className='text-lg font-bold text-green-600 mt-1'>
//                   ₦
//                   {Number(
//                     installmentData.amountPaid ||
//                       installmentData.amount_paid ||
//                       0,
//                   ).toLocaleString()}
//                 </p>
//               </div>
//               <div className='p-4 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800'>
//                 <span className='text-[11px] text-gray-500 uppercase tracking-wider block font-semibold'>
//                   Timeline Health Status
//                 </span>
//                 <p className='text-sm font-bold text-primary-purple mt-1 flex items-center gap-1.5'>
//                   <span className='w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse' />
//                   {installmentData.timelineHealth ||
//                     installmentData.health ||
//                     'On Track'}
//                 </p>
//               </div>
//             </div>

//             {installmentData.installments &&
//               installmentData.installments.length > 0 && (
//                 <div className='space-y-3'>
//                   <h4 className='text-xs font-bold text-gray-500 uppercase tracking-wider'>
//                     Milestone Schedules
//                   </h4>
//                   <div className='space-y-2'>
//                     {installmentData.installments.map(
//                       (inst: any, idx: number) => (
//                         <div
//                           key={idx}
//                           className='flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs'
//                         >
//                           <div className='flex items-center gap-3'>
//                             <div
//                               className={`p-2 rounded-lg ${inst.status === 'paid' ? 'bg-green-500/15 text-green-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}
//                             >
//                               <CheckCircle2 size={16} />
//                             </div>
//                             <div>
//                               <p className='font-bold text-dark dark:text-white'>
//                                 {inst.title || `Milestone ${idx + 1}`}
//                               </p>
//                               <p className='text-[11px] text-gray-400'>
//                                 Due:{' '}
//                                 {inst.dueDate
//                                   ? new Date(inst.dueDate).toLocaleDateString()
//                                   : 'Flexible'}
//                               </p>
//                             </div>
//                           </div>
//                           <div className='text-right'>
//                             <p className='font-bold text-dark dark:text-white'>
//                               ₦{Number(inst.amount || 0).toLocaleString()}
//                             </p>
//                             <span
//                               className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${inst.status === 'paid' ? 'bg-green-500/15 text-green-600' : 'bg-amber-500/15 text-amber-600'}`}
//                             >
//                               {inst.status || 'Pending'}
//                             </span>
//                           </div>
//                         </div>
//                       ),
//                     )}
//                   </div>
//                 </div>
//               )}
//           </div>
//         ) : (
//           <div className='text-center py-8 text-xs text-gray-400'>
//             No installment breakdown records returned for this active cohort.
//           </div>
//         )}
//       </div>

//       {/* Community Callout Banner */}
//       <div className='p-8 rounded-2xl bg-gradient-to-r from-primary-purple/15 via-blue-500/15 to-transparent border border-primary-purple/20 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm'>
//         <div className='space-y-1 text-center md:text-left'>
//           <h3 className='font-bold text-dark dark:text-white text-base flex items-center justify-center md:justify-start gap-2'>
//             <MessageCircle className='text-primary-purple' size={20} />
//             Academy Community Channel
//           </h3>
//           <p className='text-xs text-gray-600 dark:text-gray-300 max-w-xl'>
//             Collaborate with fellow engineers, review daily milestones, and
//             connect directly with lead technical instructors via our official
//             cohort portal.
//           </p>
//         </div>
//         <a
//           href='https://wa.me/2348134984001'
//           target='_blank'
//           rel='noopener noreferrer'
//           className='px-6 py-3 bg-green-600 text-white font-bold text-xs rounded-xl hover:bg-green-700 transition-all text-center whitespace-nowrap shadow-md flex items-center gap-2'
//         >
//           <span>Open WhatsApp Cohort</span>
//           <ArrowRight size={14} />
//         </a>
//       </div>
//     </div>
//   )
// }



//src/app/student/dashboard/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  BookOpen,
  CheckCircle2,
  CreditCard,
  MessageCircle,
  ArrowRight,
  Award,
  Clock,
  Bell,
  UserCheck,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { apiClient } from '@/services/api'

export default function StudentDashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [overview, setOverview] = useState<any>(null)
  const [scholarshipData, setScholarshipData] = useState<any>(null)
  const [installmentData, setInstallmentData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingFinancials, setIsLoadingFinancials] = useState(true)

  useEffect(() => {
    const loggedIn = sessionStorage.getItem('isLoggedIn')
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('denskill_token')
        : null
    const data = sessionStorage.getItem('pendingRegistration')

    if (!loggedIn && !token) {
      router.push('/programmes')
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

    const fetchDashboardData = async () => {
      try {
        // 1. Fetch main dashboard overview
        const response = apiClient.getDashboardOverview
          ? await apiClient.getDashboardOverview()
          : null

        let userObj = null
        if (response && response.status === 'success') {
          setOverview(response)
          if (response.user) {
            userObj = response.user
            setProfile(userObj)
            sessionStorage.setItem(
              'pendingRegistration',
              JSON.stringify(userObj),
            )
          }
        } else {
          // Fallback to profile check if overview fails
          const profileRes = apiClient.getStudentProfile
            ? await apiClient.getStudentProfile()
            : null
          if (profileRes && (profileRes.user || profileRes.data)) {
            userObj = profileRes.user || profileRes.data
            setProfile(userObj)
            sessionStorage.setItem(
              'pendingRegistration',
              JSON.stringify(userObj),
            )
          }
        }

        const isScholarshipStudent =
          userObj?.student_type === 'SCHOLARSHIP' ||
          userObj?.scholarship_status ||
          overview?.scholarship

        // 2. Differentiate data fetching based on student type
        if (isScholarshipStudent) {
          try {
            if (apiClient.getScholarshipProfile) {
              const scholRes = await apiClient.getScholarshipProfile()
              if (scholRes && scholRes.scholarship) {
                setScholarshipData(scholRes.scholarship)
              }
            }
          } catch (scholErr) {
            // Fallback or silent catch if profile isn't provisioned yet
          } finally {
            setIsLoadingFinancials(false)
          }
        } else {
          // Regular student: Fetch Installment / Payment status using active course name
          const currentCourseName =
            overview?.courses?.[0]?.course ||
            userObj?.course ||
            userObj?.program ||
            'Frontend Development'

          if (currentCourseName && apiClient.getInstallmentStatus) {
            try {
              const installmentRes =
                await apiClient.getInstallmentStatus(currentCourseName)
              if (installmentRes) {
                setInstallmentData(installmentRes.data || installmentRes)
              }
            } catch (instErr) {
              // Silently handle if installment status is not applicable
            } finally {
              setIsLoadingFinancials(false)
            }
          } else {
            setIsLoadingFinancials(false)
          }
        }
      } catch (err) {
        setIsLoadingFinancials(false)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [router])

  if (isLoading) {
    return (
      <div className='p-6 md:p-12 space-y-8 max-w-5xl mx-auto animate-pulse'>
        <div className='bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-3'>
          <div className='h-3 w-32 bg-gray-200 dark:bg-gray-800 rounded' />
          <div className='h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded' />
          <div className='h-4 w-96 bg-gray-200 dark:bg-gray-800 rounded' />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className='p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4'
            >
              <div className='flex justify-between'>
                <div className='h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded' />
                <div className='w-5 h-5 bg-gray-200 dark:bg-gray-800 rounded-full' />
              </div>
              <div className='h-6 w-36 bg-gray-200 dark:bg-gray-800 rounded' />
              <div className='h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded' />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!profile) return null

  const activeCourse = overview?.courses?.[0] || null
  const latestAnnouncement = overview?.announcements?.[0] || null
  const isScholarshipStudent =
    profile.student_type === 'SCHOLARSHIP' ||
    profile.scholarship_status ||
    overview?.scholarships

  return (
    <div className='p-6 md:p-12 space-y-8 max-w-5xl mx-auto'>
      {/* Welcome Banner */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm gap-4 relative overflow-hidden'>
        <div className='absolute right-0 top-0 w-32 h-32 bg-primary-purple/5 rounded-full blur-2xl pointer-events-none' />
        <div className='space-y-1 relative z-10'>
          <span className='text-[10px] uppercase tracking-wider text-gray-400 font-bold block'>
            Student Portal Dashboard ({isScholarshipStudent ? 'Scholarship Track' : 'Regular Track'})
          </span>
          <h1 className='text-2xl md:text-3xl font-bold text-dark dark:text-white'>
            Welcome back, {profile.firstName || profile.name || 'Scholar'}! 👋
          </h1>
          <p className='text-xs text-gray-500 dark:text-gray-400'>
            Your technical workspace is initialized and ready for deployment.
          </p>
        </div>
        <div className='flex items-center gap-2 px-4 py-2 bg-primary-purple/15 text-primary-purple text-xs rounded-full font-bold relative z-10'>
          {isScholarshipStudent ? <Sparkles size={16} /> : <Award size={16} />}
          {isScholarshipStudent ? 'Scholarship Beneficiary' : 'Enrolled Scholar'}
        </div>
      </div>

      {/* Announcements Banner */}
      {latestAnnouncement && (
        <div className='p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-4'>
          <div className='p-2 bg-amber-500 text-white rounded-xl mt-0.5'>
            <Bell size={18} />
          </div>
          <div className='space-y-1'>
            <div className='flex items-center gap-2'>
              <h4 className='font-bold text-dark dark:text-white text-xs'>
                {latestAnnouncement.title}
              </h4>
              <span className='text-[10px] text-gray-400'>
                {new Date(latestAnnouncement.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className='text-xs text-gray-600 dark:text-gray-300'>
              {latestAnnouncement.content}
            </p>
          </div>
        </div>
      )}

      {/* Metrics / Overview Grid */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
        {/* Card 1: Active Program & Tutor */}
        <div className='p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between space-y-4'>
          <div>
            <div className='flex items-center justify-between text-gray-400 mb-2'>
              <span className='text-xs font-semibold'>Active Program</span>
              <BookOpen size={18} className='text-primary-purple' />
            </div>
            <p className='text-base font-bold text-dark dark:text-white leading-snug'>
              {activeCourse?.course ||
                profile.course ||
                profile.program ||
                'Frontend Development'}
            </p>
            {activeCourse?.tutor_name ? (
              <div className='mt-2 pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center gap-1.5 text-xs text-gray-500'>
                <UserCheck size={14} className='text-primary-purple' />
                <span>
                  Tutor:{' '}
                  <strong className='text-dark dark:text-white'>
                    {activeCourse.tutor_name}
                  </strong>
                </span>
              </div>
            ) : (
              <p className='text-[11px] text-gray-400 mt-1'>
                Tutor assignment pending
              </p>
            )}
          </div>
          <span className='text-[10px] bg-primary-purple/15 text-primary-purple px-2.5 py-1 rounded-md font-semibold inline-block w-fit'>
            Status: {activeCourse?.payment_status || (isScholarshipStudent ? 'Scholarship Active' : 'Active')}
          </span>
        </div>

        {/* Card 2: Credential / Payment Status (Differentiated) */}
        <div className='p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between space-y-4'>
          <div>
            <div className='flex items-center justify-between text-gray-400 mb-2'>
              <span className='text-xs font-semibold'>
                {isScholarshipStudent ? 'Scholarship Status' : 'Credential Status'}
              </span>
              <CheckCircle2 size={18} className='text-green-600' />
            </div>
            <p className='text-lg font-bold text-green-600 flex items-center gap-1.5'>
              {isScholarshipStudent
                ? 'Award Granted'
                : activeCourse?.payment_status === 'partial'
                ? 'Partial / Verified'
                : 'Active / Verified'}
            </p>
            <p className='text-[11px] text-gray-500 mt-0.5'>
              {isScholarshipStudent
                ? 'Subsidized tuition package enabled.'
                : activeCourse
                ? `Paid ₦${Number(activeCourse.amount_paid).toLocaleString()} of ₦${Number(activeCourse.total_amount).toLocaleString()}`
                : 'Automated receipt generated.'}
            </p>
          </div>
          {!isScholarshipStudent && (
            <button
              onClick={() => router.push('/student/receipts')}
              className='text-[11px] text-primary-purple font-bold hover:underline flex items-center gap-1 w-fit cursor-pointer'
            >
              View Digital Receipts <ArrowRight size={12} />
            </button>
          )}
        </div>

        {/* Card 3: Access Hub */}
        <div className='p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between space-y-4'>
          <div>
            <div className='flex items-center justify-between text-gray-400 mb-2'>
              <span className='text-xs font-semibold'>Access Level</span>
              <CreditCard size={18} className='text-primary-red' />
            </div>
            <p className='text-lg font-bold text-dark dark:text-white'>
              {isScholarshipStudent ? 'Scholar Hub Tier' : 'Full Hub Tier'}
            </p>
            <p className='text-[11px] text-gray-500 mt-0.5'>
              All technical modules unlocked.
            </p>
          </div>
          <button
            onClick={() => router.push(isScholarshipStudent ? '/student/scholarship' : '/student/payments')}
            className='text-[11px] text-primary-red font-bold hover:underline flex items-center gap-1 w-fit cursor-pointer'
          >
            {isScholarshipStudent ? 'View Scholarship Details' : 'Manage Billing & Balances'} <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* Differentiated Section: Scholarship Profile vs Installment Timeline */}
      {isScholarshipStudent ? (
        <div className='bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6'>
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 dark:border-gray-800'>
            <div>
              <h3 className='font-bold text-dark dark:text-white text-base flex items-center gap-2'>
                <ShieldCheck className='text-primary-purple' size={20} />
                Scholarship Award & Contribution Details
              </h3>
              <p className='text-xs text-gray-500'>
                Your official scholarship allocation and setup progress.
              </p>
            </div>
          </div>

          {isLoadingFinancials ? (
            <div className='space-y-4 animate-pulse'>
              <div className='h-16 bg-gray-100 dark:bg-gray-800 rounded-xl' />
            </div>
          ) : scholarshipData ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs'>
              <div className='p-4 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 space-y-1'>
                <span className='text-gray-400 uppercase font-bold tracking-wider'>Grant Status</span>
                <p className='text-sm font-bold text-dark dark:text-white'>Active Scholarship Grant</p>
              </div>
              <div className='p-4 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 space-y-1'>
                <span className='text-gray-400 uppercase font-bold tracking-wider'>Support Reference</span>
                <p className='text-sm font-bold text-dark dark:text-white'>{scholarshipData.reference || 'Verified'}</p>
              </div>
            </div>
          ) : (
            <div className='text-center py-6 text-xs text-gray-400'>
              Scholarship profile initialized successfully. Complete any prerequisite contribution milestones if prompted.
            </div>
          )}
        </div>
      ) : (
        <div className='bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6'>
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 dark:border-gray-800'>
            <div>
              <h3 className='font-bold text-dark dark:text-white text-base flex items-center gap-2'>
                <Clock className='text-primary-purple' size={20} />
                Installment Breakdown & Timeline Health
              </h3>
              <p className='text-xs text-gray-500'>
                Track your tuition milestone progression and payment schedule health.
              </p>
            </div>
            <button
              onClick={() => router.push('/student/payments')}
              className='px-4 py-2 bg-primary-purple/15 text-primary-purple hover:bg-primary-purple/20 text-xs font-bold rounded-xl transition cursor-pointer'
            >
              Pay Next Installment
            </button>
          </div>

          {isLoadingFinancials ? (
            <div className='space-y-6 animate-pulse'>
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className='p-4 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 space-y-2'
                  >
                    <div className='h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded' />
                    <div className='h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded' />
                  </div>
                ))}
              </div>
            </div>
          ) : installmentData ? (
            <div className='space-y-6'>
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                <div className='p-4 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800'>
                  <span className='text-[11px] text-gray-500 uppercase tracking-wider block font-semibold'>
                    Total Course Fee
                  </span>
                  <p className='text-lg font-bold text-dark dark:text-white mt-1'>
                    ₦
                    {Number(
                      installmentData.totalAmount ||
                        installmentData.total_amount ||
                        0,
                    ).toLocaleString()}
                  </p>
                </div>
                <div className='p-4 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800'>
                  <span className='text-[11px] text-gray-500 uppercase tracking-wider block font-semibold'>
                    Total Paid Balance
                  </span>
                  <p className='text-lg font-bold text-green-600 mt-1'>
                    ₦
                    {Number(
                      installmentData.amountPaid ||
                        installmentData.amount_paid ||
                        0,
                    ).toLocaleString()}
                  </p>
                </div>
                <div className='p-4 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800'>
                  <span className='text-[11px] text-gray-500 uppercase tracking-wider block font-semibold'>
                    Timeline Health Status
                  </span>
                  <p className='text-sm font-bold text-primary-purple mt-1 flex items-center gap-1.5'>
                    <span className='w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse' />
                    {installmentData.timelineHealth ||
                      installmentData.health ||
                      'On Track'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className='text-center py-8 text-xs text-gray-400'>
              No installment breakdown records returned for this active cohort.
            </div>
          )}
        </div>
      )}

      {/* Community Callout Banner */}
      <div className='p-8 rounded-2xl bg-gradient-to-r from-primary-purple/15 via-blue-500/15 to-transparent border border-primary-purple/20 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm'>
        <div className='space-y-1 text-center md:text-left'>
          <h3 className='font-bold text-dark dark:text-white text-base flex items-center justify-center md:justify-start gap-2'>
            <MessageCircle className='text-primary-purple' size={20} />
            Academy Community Channel
          </h3>
          <p className='text-xs text-gray-600 dark:text-gray-300 max-w-xl'>
            Collaborate with fellow engineers, review daily milestones, and
            connect directly with lead technical instructors via our official
            cohort portal.
          </p>
        </div>
        <a
          href='https://wa.me/2348134984001'
          target='_blank'
          rel='noopener noreferrer'
          className='px-6 py-3 bg-green-600 text-white font-bold text-xs rounded-xl hover:bg-green-700 transition-all text-center whitespace-nowrap shadow-md flex items-center gap-2'
        >
          <span>Open WhatsApp Cohort</span>
          <ArrowRight size={14} />
        </a>
      </div>
    </div>
  )
}