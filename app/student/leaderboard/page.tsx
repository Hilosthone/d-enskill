// app/student/leaderboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trophy, 
  Medal, 
  Award, 
  Search, 
  Filter, 
  Loader2, 
  User, 
  TrendingUp, 
  Crown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { apiClient } from '@/services/api'

interface LeaderboardUser {
  id?: string | number
  userId?: string | number
  name?: string
  fullName?: string
  username?: string
  email?: string
  avatarUrl?: string
  percentage?: number
  cgpa?: number
  score?: number
  rank?: number
  courseId?: string
}

interface PodiumUser extends LeaderboardUser {
  position?: number
}

export default function StudentLeaderboardPage() {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Data states
  const [leaderboardList, setLeaderboardList] = useState<LeaderboardUser[]>([])
  const [podiumList, setPodiumList] = useState<PodiumUser[]>([])
  const [myRanking, setMyRanking] = useState<LeaderboardUser | null>(null)

  // Filter and pagination states
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedCourse, setSelectedCourse] = useState<string>('ALL')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const limit = 20

  // Fetch leaderboard data whenever filters or pagination change
  useEffect(() => {
    fetchLeaderboardData()
  }, [selectedCourse, searchQuery, currentPage])

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const courseParam = selectedCourse !== 'ALL' ? selectedCourse : undefined

      // 1. Fetch main leaderboard list with search, course filter, and pagination
      const listResponse = await apiClient.getLeaderboard({
        courseId: courseParam,
        search: searchQuery || undefined,
        page: currentPage,
        limit: limit,
      })

      // Handle various response structures (array or paginated object)
      const items = Array.isArray(listResponse) 
        ? listResponse 
        : listResponse?.data || listResponse?.results || listResponse?.leaderboard || []
      
      setLeaderboardList(items)
      if (listResponse?.totalPages) {
        setTotalPages(listResponse.totalPages)
      }

      // 2. Fetch top 3 podium performers
      try {
        const podiumResponse = await apiClient.getLeaderboardPodium({ courseId: courseParam })
        const podiumData = Array.isArray(podiumResponse) 
          ? podiumResponse 
          : podiumResponse?.data || podiumResponse?.podium || []
        setPodiumList(podiumData)
      } catch (err) {
        console.error('Failed to fetch podium data', err)
      }

      // 3. Fetch authenticated student's individual rank profile
      try {
        const myRankResponse = await apiClient.getLeaderboardMe({ courseId: courseParam })
        setMyRanking(myRankResponse?.data || myRankResponse || null)
      } catch (err) {
        // 404 means no ranking data found yet, which is normal for new students
        setMyRanking(null)
      }

    } catch (err: any) {
      setError(err.message || 'Failed to load leaderboard ranking system.')
    } finally {
      setLoading(false)
    }
  }

  // Helper to format student display names
  const getStudentName = (user: LeaderboardUser) => {
    return user.name || user.fullName || user.username || user.email?.split('@')[0] || 'Student'
  }

  // Helper to calculate percentage value safely
  const getPercentageScore = (user: LeaderboardUser) => {
    const val = user.percentage ?? user.cgpa ?? user.score ?? 0
    return Number(val).toFixed(1)
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 lg:p-10 space-y-8'>
      {/* Header Banner */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800'>
        <div>
          <h1 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5'>
            <Trophy className='text-amber-500 shrink-0' size={28} />
            Global Student Leaderboard
          </h1>
          <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1'>
            Global student percentage-based CGPA ranking system. Track top performers and check your standing.
          </p>
        </div>
      </div>

      {/* Authenticated User Quick Rank Card */}
      {myRanking && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-gradient-to-r from-primary-purple/10 via-purple-500/5 to-transparent border border-primary-purple/20 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4'
        >
          <div className='flex items-center gap-4 text-center sm:text-left'>
            <div className='w-12 h-12 rounded-2xl bg-primary-purple text-white flex items-center justify-center font-bold text-lg shadow-md shadow-primary-purple/30 shrink-0'>
              #{myRanking.rank || '-'}
            </div>
            <div>
              <span className='text-xs font-semibold uppercase tracking-wider text-primary-purple'>Your Current Standing</span>
              <h3 className='text-base sm:text-lg font-bold text-gray-900 dark:text-white'>
                {getStudentName(myRanking)}
              </h3>
            </div>
          </div>
          <div className='flex items-center gap-6'>
            <div className='text-center sm:text-right'>
              <span className='text-xs text-gray-500 dark:text-gray-400'>Performance Score</span>
              <p className='text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400'>
                {getPercentageScore(myRanking)}% CGPA
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Podium Section (Top 3 Performers) */}
      {!searchQuery && podiumList.length > 0 && (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-5 pt-2'>
          {podiumList.map((user, idx) => {
            const rank = user.position || idx + 1
            const isFirst = rank === 1
            const isSecond = rank === 2

            return (
              <motion.div
                key={user.id || user.userId || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-white dark:bg-gray-900 rounded-2xl border p-6 flex flex-col items-center text-center relative shadow-sm ${
                  isFirst 
                    ? 'border-amber-400/50 dark:border-amber-500/30 bg-gradient-to-b from-amber-50/50 dark:from-amber-950/20 to-white dark:to-gray-900 md:-translate-y-2' 
                    : isSecond
                    ? 'border-slate-300 dark:border-slate-700 bg-gradient-to-b from-slate-50/50 dark:from-slate-900/20 to-white dark:to-gray-900'
                    : 'border-orange-200 dark:border-orange-900/30 bg-gradient-to-b from-orange-50/40 dark:from-orange-950/20 to-white dark:to-gray-900'
                }`}
              >
                <div className='absolute top-4 right-4'>
                  {isFirst ? (
                    <Crown className='text-amber-500' size={24} />
                  ) : isSecond ? (
                    <Medal className='text-slate-400' size={22} />
                  ) : (
                    <Award className='text-amber-700' size={22} />
                  )}
                </div>

                <div className='w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-xl mb-3 shadow-inner overflow-hidden border-2 border-white dark:border-gray-800'>
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={getStudentName(user)} className='w-full h-full object-cover' />
                  ) : (
                    getStudentName(user).charAt(0).toUpperCase()
                  )}
                </div>

                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full mb-2 ${
                  isFirst 
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400' 
                    : isSecond 
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300' 
                    : 'bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400'
                }`}>
                  Rank #{rank}
                </span>

                <h3 className='text-base font-bold text-gray-900 dark:text-white truncate max-w-full'>
                  {getStudentName(user)}
                </h3>

                <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
                  {user.courseId || 'General Track'}
                </p>

                <div className='mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 w-full flex items-center justify-between text-xs font-medium'>
                  <span className='text-gray-500'>Score Percentage:</span>
                  <span className='font-bold text-emerald-600 dark:text-emerald-400 text-sm'>
                    {getPercentageScore(user)}%
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Filter & Search Controls */}
      <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between pt-4'>
        <div className='relative w-full sm:w-80 md:w-96'>
          <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
          <input
            type='text'
            placeholder='Search student name...'
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className='w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-purple dark:text-white'
          />
        </div>

        <div className='flex items-center gap-2 w-full sm:w-auto'>
          <Filter size={16} className='text-gray-400 shrink-0' />
          <select
            value={selectedCourse}
            onChange={(e) => {
              setSelectedCourse(e.target.value)
              setCurrentPage(1)
            }}
            className='w-full sm:w-auto px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-purple dark:text-white'
          >
            <option value='ALL'>All Courses / Tracks</option>
            <option value='MERN_STACK_PRO'>MERN Stack Pro</option>
            <option value='FULLSTACK_MERN'>Fullstack MERN</option>
            <option value='MOBILE_FLUTTER'>Mobile Flutter</option>
            <option value='FULLSTACK_JS'>Fullstack JavaScript</option>
          </select>
        </div>
      </div>

      {/* Main Table Section */}
      {loading ? (
        <div className='flex justify-center items-center py-24'>
          <Loader2 className='animate-spin text-primary-purple' size={40} />
        </div>
      ) : error ? (
        <div className='bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 p-4 rounded-xl text-center text-sm'>
          {error}
        </div>
      ) : leaderboardList.length === 0 ? (
        <div className='text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8'>
          <TrendingUp className='mx-auto text-gray-300 dark:text-gray-700 mb-3' size={48} />
          <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-200'>No rankings found</h3>
          <p className='text-sm text-gray-500 mt-1'>No student performance records match your search filter.</p>
        </div>
      ) : (
        <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm'>
          <div className='overflow-x-auto'>
            <table className='w-full text-left border-collapse'>
              <thead>
                <tr className='bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 text-xs uppercase text-gray-400 font-semibold'>
                  <th className='p-4 sm:px-6 w-20 text-center'>Rank</th>
                  <th className='p-4 sm:px-6'>Student Name</th>
                  <th className='p-4 sm:px-6'>Course Track</th>
                  <th className='p-4 sm:px-6 text-right'>Percentage Score</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100 dark:divide-gray-800 text-sm'>
                {leaderboardList.map((user, idx) => {
                  const rankNum = user.rank || (currentPage - 1) * limit + idx + 1
                  const isTopThree = rankNum <= 3

                  return (
                    <tr 
                      key={user.id || user.userId || idx}
                      className='hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors'
                    >
                      <td className='p-4 sm:px-6 text-center font-bold'>
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-xl text-xs ${
                          rankNum === 1 
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 font-extrabold' 
                            : rankNum === 2 
                            ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-extrabold' 
                            : rankNum === 3 
                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400 font-extrabold' 
                            : 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/50'
                        }`}>
                          #{rankNum}
                        </span>
                      </td>

                      <td className='p-4 sm:px-6 font-semibold text-gray-900 dark:text-white flex items-center gap-3'>
                        <div className='w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-xs shrink-0 overflow-hidden'>
                          {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={getStudentName(user)} className='w-full h-full object-cover' />
                          ) : (
                            getStudentName(user).charAt(0).toUpperCase()
                          )}
                        </div>
                        <span className='truncate'>{getStudentName(user)}</span>
                      </td>

                      <td className='p-4 sm:px-6 text-gray-500 dark:text-gray-400 text-xs font-medium'>
                        <span className='px-2.5 py-1 bg-purple-50 dark:bg-purple-950/50 text-primary-purple rounded-full'>
                          {user.courseId || 'General'}
                        </span>
                      </td>

                      <td className='p-4 sm:px-6 text-right font-bold text-emerald-600 dark:text-emerald-400'>
                        {getPercentageScore(user)}%
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className='p-4 sm:px-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/20'>
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className='flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors'
              >
                <ChevronLeft size={16} /> Previous
              </button>
              
              <span className='text-xs text-gray-500 dark:text-gray-400 font-medium'>
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className='flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors'
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}