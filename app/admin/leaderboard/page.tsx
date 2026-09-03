// // src/app/admin/leaderboard/page.tsx
// 'use client'

// import { useState, useEffect } from 'react'
// import {
//   Trophy,
//   Medal,
//   Award,
//   Search,
//   Filter,
//   ChevronLeft,
//   ChevronRight,
//   User,
//   TrendingUp,
// } from 'lucide-react'
// import { adminApiClient } from '@/services/api'

// export default function AdminLeaderboardPage() {
//   const [leaderboard, setLeaderboard] = useState<any[]>([])
//   const [podium, setPodium] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)
//   const [search, setSearch] = useState('')
//   const [courseId, setCourseId] = useState('')
//   const [page, setPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)

//   const fetchLeaderboardData = async () => {
//     setLoading(true)
//     try {
//       const [leaderboardRes, podiumRes] = await Promise.all([
//         adminApiClient.getLeaderboard({
//           courseId: courseId || undefined,
//           search: search || undefined,
//           page,
//           limit: 15,
//         }),
//         adminApiClient.getLeaderboardPodium(courseId || undefined),
//       ])

//       // Handle diverse response structural variants safely
//       const items =
//         leaderboardRes?.data ||
//         leaderboardRes?.leaderboard ||
//         (Array.isArray(leaderboardRes) ? leaderboardRes : [])
//       setLeaderboard(items)

//       if (leaderboardRes?.totalPages) {
//         setTotalPages(leaderboardRes.totalPages)
//       } else if (leaderboardRes?.pagination?.totalPages) {
//         setTotalPages(leaderboardRes.pagination.totalPages)
//       }

//       const podiumItems =
//         podiumRes?.data ||
//         podiumRes?.podium ||
//         (Array.isArray(podiumRes) ? podiumRes : [])
//       setPodium(podiumItems)
//     } catch (err) {
//       console.error('Failed to fetch leaderboard data', err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchLeaderboardData()
//   }, [page, courseId])

//   const handleSearchSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     setPage(1)
//     fetchLeaderboardData()
//   }

//   const getRankBadgeStyle = (rank: number) => {
//     switch (rank) {
//       case 1:
//         return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-300 dark:border-amber-700'
//       case 2:
//         return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700'
//       case 3:
//         return 'bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-400 border-orange-300 dark:border-orange-800'
//       default:
//         return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700'
//     }
//   }

//   return (
//     <div className='p-6 md:p-8 space-y-8 max-w-7xl mx-auto'>
//       {/* Header Section */}
//       <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
//         <div>
//           <h1 className='text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5'>
//             <Trophy className='text-primary-purple' size={28} />
//             Student Leaderboard & CGPA Rankings
//           </h1>
//           <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
//             Global percentage-based ranking system across cohort programs.
//           </p>
//         </div>

//         {/* Course Filter Dropdown */}
//         <div className='flex items-center gap-2'>
//           <Filter size={16} className='text-gray-400' />
//           <select
//             value={courseId}
//             onChange={(e) => {
//               setCourseId(e.target.value)
//               setPage(1)
//             }}
//             className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-purple/50'
//           >
//             <option value=''>All Courses & Programs</option>
//             <option value='MERN_STACK_PRO'>MERN Stack Pro</option>
//             <option value='FULLSTACK_MOBILE'>Flutter & React Native</option>
//             <option value='FRONTEND_NEXTJS'>Next.js & TypeScript</option>
//           </select>
//         </div>
//       </div>

//       {/* Top 3 Podium Display */}
//       {podium.length > 0 && (
//         <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
//           {podium.slice(0, 3).map((student, idx) => {
//             const rank = idx + 1
//             const borderColors =
//               rank === 1
//                 ? 'border-amber-400 bg-gradient-to-b from-amber-50/50 to-white dark:from-amber-950/20 dark:to-gray-900'
//                 : rank === 2
//                 ? 'border-slate-300 bg-gradient-to-b from-slate-50/50 to-white dark:from-slate-900/40 dark:to-gray-900'
//                 : 'border-orange-400 bg-gradient-to-b from-orange-50/50 to-white dark:from-orange-950/20 dark:to-gray-900'

//             return (
//               <div
//                 key={student.id || idx}
//                 className={`p-6 rounded-2xl border-2 ${borderColors} shadow-sm relative overflow-hidden flex flex-col items-center text-center transition-transform hover:-translate-y-1`}
//               >
//                 <div className='absolute top-4 right-4'>
//                   <span
//                     className={`px-3 py-1 rounded-full text-xs font-bold border ${getRankBadgeStyle(
//                       rank
//                     )}`}
//                   >
//                     #{rank} {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
//                   </span>
//                 </div>
//                 <div className='w-16 h-16 rounded-full bg-gradient-to-tr from-primary-purple to-indigo-600 text-white font-bold flex items-center justify-center text-xl shadow-md mb-4 ring-4 ring-primary-purple/20'>
//                   {student.first_name?.[0] || student.name?.[0] || 'S'}
//                 </div>
//                 <h3 className='font-bold text-gray-900 dark:text-white text-base'>
//                   {student.first_name} {student.last_name || student.name || ''}
//                 </h3>
//                 <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
//                   {student.course_title || student.course || 'Software Engineering'}
//                 </p>
//                 <div className='mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 w-full flex items-center justify-between text-sm'>
//                   <span className='text-gray-500 font-medium'>Score / CGPA</span>
//                   <span className='font-extrabold text-primary-purple text-base'>
//                     {student.percentageScore || student.percentage || student.score || '0'}%
//                   </span>
//                 </div>
//               </div>
//             )
//           })}
//         </div>
//       )}

//       {/* Search and Table Controls */}
//       <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden'>
//         <div className='p-5 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4'>
//           <form onSubmit={handleSearchSubmit} className='relative w-full sm:w-80'>
//             <Search className='absolute left-3.5 top-3 text-gray-400' size={18} />
//             <input
//               type='text'
//               placeholder='Search student by name...'
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className='w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-purple/50'
//             />
//           </form>
//           <div className='text-xs text-gray-500 dark:text-gray-400 font-medium'>
//             Showing student rank list sorted by percentage score
//           </div>
//         </div>

//         {/* Table View */}
//         <div className='overflow-x-auto'>
//           <table className='w-full text-left border-collapse'>
//             <thead>
//               <tr className='bg-gray-50/75 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-500 uppercase tracking-wider'>
//                 <th className='py-4 px-6'>Rank</th>
//                 <th className='py-4 px-6'>Student Scholar</th>
//                 <th className='py-4 px-6'>Enrolled Program</th>
//                 <th className='py-4 px-6 text-right'>Percentage Score</th>
//               </tr>
//             </thead>
//             <tbody className='divide-y divide-gray-100 dark:divide-gray-800 text-sm'>
//               {loading ? (
//                 <tr>
//                   <td colSpan={4} className='py-12 text-center text-gray-400'>
//                     Loading leaderboard rankings...
//                   </td>
//                 </tr>
//               ) : leaderboard.length === 0 ? (
//                 <tr>
//                   <td colSpan={4} className='py-12 text-center text-gray-400'>
//                     No students found matching your filters.
//                   </td>
//                 </tr>
//               ) : (
//                 leaderboard.map((item, idx) => {
//                   const rankNumber = item.rank || (page - 1) * 15 + idx + 1
//                   return (
//                     <tr
//                       key={item.id || idx}
//                       className='hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors'
//                     >
//                       <td className='py-4 px-6 font-semibold'>
//                         <span
//                           className={`inline-flex items-center justify-center w-8 h-8 rounded-xl border text-xs font-bold ${getRankBadgeStyle(
//                             rankNumber
//                           )}`}
//                         >
//                           #{rankNumber}
//                         </span>
//                       </td>
//                       <td className='py-4 px-6'>
//                         <div className='flex items-center gap-3'>
//                           <div className='w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 text-primary-purple font-bold flex items-center justify-center text-xs'>
//                             {item.first_name?.[0] || item.name?.[0] || 'S'}
//                           </div>
//                           <div>
//                             <p className='font-bold text-gray-900 dark:text-white'>
//                               {item.first_name} {item.last_name || item.name || ''}
//                             </p>
//                             <p className='text-xs text-gray-400'>{item.email || ''}</p>
//                           </div>
//                         </div>
//                       </td>
//                       <td className='py-4 px-6 text-gray-600 dark:text-gray-300 font-medium text-xs'>
//                         {item.course_title || item.course || 'Software Engineering'}
//                       </td>
//                       <td className='py-4 px-6 text-right font-extrabold text-primary-purple'>
//                         {item.percentageScore || item.percentage || item.score || '0'}%
//                       </td>
//                     </tr>
//                   )
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination Footer */}
//         <div className='p-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between'>
//           <button
//             onClick={() => setPage((p) => Math.max(p - 1, 1))}
//             disabled={page === 1 || loading}
//             className='flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all'
//           >
//             <ChevronLeft size={16} />
//             Previous
//           </button>
//           <span className='text-xs font-medium text-gray-500'>
//             Page {page} of {totalPages || 1}
//           </span>
//           <button
//             onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
//             disabled={page >= totalPages || loading}
//             className='flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all'
//           >
//             Next
//             <ChevronRight size={16} />
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// src/app/admin/leaderboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import {
  Trophy,
  Medal,
  Award,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Crown,
  Flame,
  Zap,
  Target,
  Sparkles,
} from 'lucide-react'
import { adminApiClient } from '@/services/admin-api'
import { PROGRAMMES } from '@/constants/programmes'

export default function AdminLeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [podium, setPodium] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [courseId, setCourseId] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchLeaderboardData = async () => {
    setLoading(true)
    try {
      const [leaderboardRes, podiumRes] = await Promise.all([
        adminApiClient.getLeaderboard({
          courseId: courseId || undefined,
          search: search || undefined,
          page,
          limit: 15,
        }),
        adminApiClient.getLeaderboardPodium(courseId || undefined),
      ])

      const items =
        leaderboardRes?.data ||
        leaderboardRes?.leaderboard ||
        (Array.isArray(leaderboardRes) ? leaderboardRes : [])
      setLeaderboard(items)

      if (leaderboardRes?.totalPages) {
        setTotalPages(leaderboardRes.totalPages)
      } else if (leaderboardRes?.pagination?.totalPages) {
        setTotalPages(leaderboardRes.pagination.totalPages)
      }

      const podiumItems =
        podiumRes?.data ||
        podiumRes?.podium ||
        (Array.isArray(podiumRes) ? podiumRes : [])
      setPodium(podiumItems)
    } catch (err) {
      console.error('Failed to fetch leaderboard data', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaderboardData()
  }, [page, courseId])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchLeaderboardData()
  }

  const badgeCatalog = [
    {
      name: 'Grandmaster Apex',
      threshold: '95% - 100% CGPA',
      description: 'Awarded to elite scholars demonstrating absolute mastery across all coding banks.',
      icon: Crown,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700',
    },
    {
      name: 'Platinum Architect',
      threshold: '90% - 94% CGPA',
      description: 'Reserved for top-tier performers with exceptionally clean algorithm execution.',
      icon: Sparkles,
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-700',
    },
    {
      name: 'Gold Elite',
      threshold: '80% - 89% CGPA',
      description: 'Recognizes robust consistency and distinction across cohort milestones.',
      icon: Trophy,
      color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/40 border-yellow-300 dark:border-yellow-700',
    },
    {
      name: 'Silver Prodigy',
      threshold: '70% - 79% CGPA',
      description: 'For scholars showing stellar problem-solving acceleration and dedication.',
      icon: Medal,
      color: 'text-slate-500 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700',
    },
    {
      name: 'Bronze Vanguard',
      threshold: '60% - 69% CGPA',
      description: 'Designates solid foundational competency and steady module progress.',
      icon: Award,
      color: 'text-orange-600 bg-orange-50 dark:bg-orange-950/40 border-orange-300 dark:border-orange-800',
    },
    {
      name: 'Streak Turbo',
      threshold: '10+ Active Days',
      description: 'Granted for unbroken daily assessment submissions and continuous learning.',
      icon: Flame,
      color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700',
    },
    {
      name: 'Syntax Master',
      threshold: 'Zero Test Failures',
      description: 'Achieved by passing all edge cases on the first compilation run.',
      icon: Zap,
      color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-300 dark:border-cyan-700',
    },
    {
      name: 'Code Precision',
      threshold: 'Top 5% Speed',
      description: 'Awarded for exceptional algorithmic efficiency and resource optimization.',
      icon: Target,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700',
    },
  ]

  const getRankBadgeStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-300 dark:border-amber-700'
      case 2:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700'
      case 3:
        return 'bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-400 border-orange-300 dark:border-orange-800'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700'
    }
  }

  return (
    <div className='p-4 sm:p-6 md:p-8 space-y-8 max-w-7xl mx-auto'>
      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
        <div>
          <h1 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5'>
            <Trophy className='text-primary-purple shrink-0' size={28} />
            <span>Student Leaderboard & CGPA Rankings</span>
          </h1>
          <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1'>
            Global percentage-based ranking system across cohort programs.
          </p>
        </div>

        <div className='flex items-center gap-2 w-full lg:w-auto'>
          <Filter size={16} className='text-gray-400 shrink-0' />
          <select
            value={courseId}
            onChange={(e) => {
              setCourseId(e.target.value)
              setPage(1)
            }}
            className='w-full lg:w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-xs sm:text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-purple/50 shadow-xs'
          >
            <option value=''>All Courses & Programs</option>
            {PROGRAMMES.map((prog, idx) => (
              <option key={idx} value={prog.title}>
                {prog.title} ({prog.duration})
              </option>
            ))}
          </select>
        </div>
      </div>

      {podium.length > 0 && (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6'>
          {podium.slice(0, 3).map((student, idx) => {
            const rank = idx + 1
            const borderColors =
              rank === 1
                ? 'border-amber-400 bg-gradient-to-b from-amber-50/50 to-white dark:from-amber-950/20 dark:to-gray-900'
                : rank === 2
                ? 'border-slate-300 bg-gradient-to-b from-slate-50/50 to-white dark:from-slate-900/40 dark:to-gray-900'
                : 'border-orange-400 bg-gradient-to-b from-orange-50/50 to-white dark:from-orange-950/20 dark:to-gray-900'

            const PodiumIcon = rank === 1 ? Crown : rank === 2 ? Medal : Award

            return (
              <div
                key={student.id || idx}
                className={`p-5 sm:p-6 rounded-2xl border-2 ${borderColors} shadow-sm relative overflow-hidden flex flex-col items-center text-center transition-transform hover:-translate-y-1`}
              >
                <div className='absolute top-4 right-4'>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getRankBadgeStyle(
                      rank
                    )}`}
                  >
                    <PodiumIcon size={14} />
                    <span>#{rank}</span>
                  </span>
                </div>
                <div className='w-16 h-16 rounded-full bg-gradient-to-tr from-primary-purple to-indigo-600 text-white font-bold flex items-center justify-center text-xl shadow-md mb-4 ring-4 ring-primary-purple/20 shrink-0'>
                  {student.first_name?.[0] || student.name?.[0] || 'S'}
                </div>
                <h3 className='font-bold text-gray-900 dark:text-white text-base truncate max-w-full'>
                  {student.first_name} {student.last_name || student.name || ''}
                </h3>
                <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-full'>
                  {student.course_title || student.course || 'Software Engineering'}
                </p>
                <div className='mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 w-full flex items-center justify-between text-sm'>
                  <span className='text-gray-500 font-medium'>Score / CGPA</span>
                  <span className='font-extrabold text-primary-purple text-base'>
                    {student.percentageScore || student.percentage || student.score || '0'}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 sm:p-6 shadow-sm'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-base font-bold text-gray-900 dark:text-white flex items-center gap-2'>
            <Sparkles size={18} className='text-primary-purple' />
            <span>Available Achievement Badges & Tiers</span>
          </h2>
          <span className='text-xs text-gray-400 font-medium hidden sm:inline'>
            Automatic student milestone unlocks
          </span>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          {badgeCatalog.map((badge, idx) => {
            const BadgeIcon = badge.icon
            return (
              <div
                key={idx}
                className='p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 flex flex-col justify-between hover:border-primary-purple/40 transition-all'
              >
                <div>
                  <div className='flex items-center justify-between mb-2'>
                    <div className={`p-2 rounded-lg border ${badge.color}`}>
                      <BadgeIcon size={18} />
                    </div>
                    <span className='text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'>
                      {badge.threshold}
                    </span>
                  </div>
                  <h3 className='text-sm font-bold text-gray-900 dark:text-white'>
                    {badge.name}
                  </h3>
                  <p className='text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed'>
                    {badge.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden'>
        <div className='p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4'>
          <form onSubmit={handleSearchSubmit} className='relative w-full sm:w-80'>
            <Search className='absolute left-3.5 top-3 text-gray-400' size={18} />
            <input
              type='text'
              placeholder='Search student by name...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-purple/50'
            />
          </form>
          <div className='text-xs text-gray-500 dark:text-gray-400 font-medium text-center sm:text-right'>
            Showing student rank list sorted by percentage score
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full text-left border-collapse min-w-[640px]'>
            <thead>
              <tr className='bg-gray-50/75 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                <th className='py-4 px-6'>Rank</th>
                <th className='py-4 px-6'>Student Scholar</th>
                <th className='py-4 px-6'>Enrolled Program</th>
                <th className='py-4 px-6 text-right'>Percentage Score</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100 dark:divide-gray-800 text-sm'>
              {loading ? (
                <tr>
                  <td colSpan={4} className='py-12 text-center text-gray-400'>
                    Loading leaderboard rankings...
                  </td>
                </tr>
              ) : leaderboard.length === 0 ? (
                <tr>
                  <td colSpan={4} className='py-12 text-center text-gray-400'>
                    No students found matching your filters.
                  </td>
                </tr>
              ) : (
                leaderboard.map((item, idx) => {
                  const rankNumber = item.rank || (page - 1) * 15 + idx + 1
                  return (
                    <tr
                      key={item.id || idx}
                      className='hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors'
                    >
                      <td className='py-4 px-6 font-semibold whitespace-nowrap'>
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-xl border text-xs font-bold ${getRankBadgeStyle(
                            rankNumber
                          )}`}
                        >
                          #{rankNumber}
                        </span>
                      </td>
                      <td className='py-4 px-6'>
                        <div className='flex items-center gap-3'>
                          <div className='w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 text-primary-purple font-bold flex items-center justify-center text-xs shrink-0'>
                            {item.first_name?.[0] || item.name?.[0] || 'S'}
                          </div>
                          <div className='min-w-0'>
                            <p className='font-bold text-gray-900 dark:text-white truncate'>
                              {item.first_name} {item.last_name || item.name || ''}
                            </p>
                            <p className='text-xs text-gray-400 truncate'>{item.email || ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className='py-4 px-6 text-gray-600 dark:text-gray-300 font-medium text-xs whitespace-nowrap'>
                        {item.course_title || item.course || 'Software Engineering'}
                      </td>
                      <td className='py-4 px-6 text-right font-extrabold text-primary-purple whitespace-nowrap'>
                        {item.percentageScore || item.percentage || item.score || '0'}%
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div className='p-4 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3'>
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1 || loading}
            className='w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all'
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          <span className='text-xs font-medium text-gray-500'>
            Page {page} of {totalPages || 1}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page >= totalPages || loading}
            className='w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all'
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}