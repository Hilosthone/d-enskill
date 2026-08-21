// //src
// 'use client'
// import { usePathname } from 'next/navigation'
// import { Menu, Sparkles, Sun, Moon, Bell, ShieldCheck } from 'lucide-react'
// import { useEffect, useState } from 'react'
// import { apiClient } from '@/services/api'

// interface NavbarProps {
//   onOpenMobileMenu: () => void
// }

// export default function Navbar({ onOpenMobileMenu }: NavbarProps) {
//   const pathname = usePathname()
//   const [profile, setProfile] = useState<any>(null)
//   const [isDark, setIsDark] = useState(false)
//   const [hasUnread, setHasUnread] = useState(true)

//   useEffect(() => {
//     // 1. Instantly populate from local session storage for snappy UI loading
//     const localData =
//       sessionStorage.getItem('pendingRegistration') ||
//       localStorage.getItem('denskill_user')
//     if (localData) {
//       try {
//         setProfile(JSON.parse(localData))
//       } catch (e) {
//         // Fallback
//       }
//     }

//     // 2. Fetch fresh user profile directly from the backend API
//     const fetchLiveProfile = async () => {
//       try {
//         const response = apiClient.getStudentProfile
//           ? await apiClient.getStudentProfile()
//           : null
//         if (response && (response.user || response.data)) {
//           const userObj = response.user || response.data
//           setProfile(userObj)
//           sessionStorage.setItem('pendingRegistration', JSON.stringify(userObj))
//         }
//       } catch (err) {
//         // Silently fallback to cached storage if offline/unauthorized
//       }
//     }

//     fetchLiveProfile()

//     // Check current class on html tag on load
//     const isDarkModeActive = document.documentElement.classList.contains('dark')
//     setIsDark(isDarkModeActive)
//   }, [])

//   const handleToggle = () => {
//     const root = document.documentElement
//     if (root.classList.contains('dark')) {
//       root.classList.remove('dark')
//       localStorage.setItem('theme', 'light')
//       setIsDark(false)
//     } else {
//       root.classList.add('dark')
//       localStorage.setItem('theme', 'dark')
//       setIsDark(true)
//     }
//   }

//   const titles: Record<string, string> = {
//     '/student/dashboard': 'Dashboard',
//     '/student/payments': 'Payments',
//     '/student/courses': 'My Courses',
//     '/student/announcements': 'Announcements',
//     '/student/community': 'Community',
//     '/student/receipts': 'Receipts',
//     '/student/profile': 'Profile',
//   }

//   const pageTitle = titles[pathname] || 'Student Portal'

//   return (
//     <header className='bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm transition-colors'>
//       <div className='flex items-center gap-4'>
//         <button
//           onClick={onOpenMobileMenu}
//           className='md:hidden p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer'
//           aria-label='Toggle Menu'
//         >
//           <Menu size={22} />
//         </button>
//         <div>
//           <div className='flex items-center gap-1.5'>
//             <span className='text-[10px] uppercase tracking-wider text-gray-400 font-semibold block'>
//               Portal View
//             </span>
//             <span className='w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse' />
//           </div>
//           <h1 className='text-lg font-bold text-dark dark:text-white flex items-center gap-2'>
//             {pageTitle}
//           </h1>
//         </div>
//       </div>

//       <div className='flex items-center gap-3 md:gap-4'>
//         {/* Enrolled Program Badge */}
//         <div className='hidden xl:flex items-center gap-2 px-3.5 py-1.5 bg-primary-purple/10 text-primary-purple rounded-full text-xs font-semibold border border-primary-purple/20'>
//           <Sparkles size={14} />
//           <span>
//             {profile?.course ||
//               profile?.program ||
//               'Full-Stack Software Engineering'}
//           </span>
//         </div>

//         {/* Quick Notification Bell */}
//         <button
//           onClick={() => setHasUnread(false)}
//           className='relative p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all shadow-sm cursor-pointer'
//           aria-label='Notifications'
//         >
//           <Bell size={18} />
//           {hasUnread && (
//             <span className='absolute top-2 right-2 w-2 h-2 bg-primary-red rounded-full ring-2 ring-white dark:ring-gray-900' />
//           )}
//         </button>

//         {/* Theme Toggle Button */}
//         <button
//           onClick={handleToggle}
//           type='button'
//           aria-label='Toggle Dark/Light Mode'
//           className='p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all shadow-sm cursor-pointer relative z-50'
//         >
//           {isDark ? (
//             <Sun size={18} className='text-amber-400' />
//           ) : (
//             <Moon size={18} className='text-gray-700' />
//           )}
//         </button>

//         {/* User Profile Info Section */}
//         <div className='flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-gray-800'>
//           <div className='w-9 h-9 rounded-full bg-gradient-to-tr from-primary-purple to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-md ring-2 ring-primary-purple/25'>
//             {profile?.firstName ? profile.firstName[0].toUpperCase() : 'S'}
//           </div>
//           <div className='hidden lg:block text-left leading-tight'>
//             <div className='flex items-center gap-1'>
//               <p className='text-xs font-bold text-dark dark:text-white'>
//                 {profile?.firstName || 'Student'} {profile?.lastName || ''}
//               </p>
//               <ShieldCheck size={14} className='text-primary-purple' />
//             </div>
//             <p className='text-[10px] text-gray-400 mt-0.5 font-medium'>
//               Verified Scholar
//             </p>
//           </div>
//         </div>
//       </div>
//     </header>
//   )
// }



// src/components/student/Navbar.tsx
'use client'

import { usePathname } from 'next/navigation'
import { Menu, Sparkles, Sun, Moon, Bell, ShieldCheck, Calendar, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { apiClient } from '@/services/api'

interface NavbarProps {
  onOpenMobileMenu: () => void
}

export default function Navbar({ onOpenMobileMenu }: NavbarProps) {
  const pathname = usePathname()
  const [profile, setProfile] = useState<any>(null)
  const [isDark, setIsDark] = useState(false)
  const [hasUnread, setHasUnread] = useState(true)
  const [currentTime, setCurrentTime] = useState<Date | null>(null)

  useEffect(() => {
    // Set initial client-side time to avoid hydration mismatch
    setCurrentTime(new Date())
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // 1. Instantly populate from local session storage for snappy UI loading
    const localData =
      sessionStorage.getItem('pendingRegistration') ||
      localStorage.getItem('denskill_user')
    if (localData) {
      try {
        setProfile(JSON.parse(localData))
      } catch (e) {
        // Fallback
      }
    }

    // 2. Fetch fresh user profile directly from the backend API
    const fetchLiveProfile = async () => {
      try {
        const response = apiClient.getStudentProfile
          ? await apiClient.getStudentProfile()
          : null
        if (response && (response.user || response.data)) {
          const userObj = response.user || response.data
          setProfile(userObj)
          sessionStorage.setItem('pendingRegistration', JSON.stringify(userObj))
        }
      } catch (err) {
        // Silently fallback to cached storage if offline/unauthorized
      }
    }

    fetchLiveProfile()

    // Check current class on html tag on load
    const isDarkModeActive = document.documentElement.classList.contains('dark')
    setIsDark(isDarkModeActive)

    return () => clearInterval(timer)
  }, [])

  const handleToggle = () => {
    const root = document.documentElement
    if (root.classList.contains('dark')) {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setIsDark(false)
    } else {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setIsDark(true)
    }
  }

  const titles: Record<string, string> = {
    '/student/dashboard': 'Dashboard',
    '/student/payments': 'Payments',
    '/student/courses': 'My Courses',
    '/student/announcements': 'Announcements',
    '/student/community': 'Community',
    '/student/receipts': 'Receipts',
    '/student/profile': 'Profile',
  }

  const pageTitle = titles[pathname] || 'Student Portal'

  // Robust profile name and property fallback resolution
  const firstName = profile?.first_name || profile?.firstName || 'Student'
  const lastName = profile?.last_name || profile?.lastName || ''
  const fullName = `${firstName} ${lastName}`.trim()
  const userInitial = firstName[0]?.toUpperCase() || 'S'

  // Formatted date and time strings
  const formattedDate = currentTime
    ? currentTime.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : ''

  const formattedTime = currentTime
    ? currentTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : ''

  return (
    <header className='bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm transition-colors'>
      {/* Left Section: Mobile Menu & Page Title */}
      <div className='flex items-center gap-4'>
        <button
          onClick={onOpenMobileMenu}
          className='md:hidden p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer'
          aria-label='Toggle Menu'
        >
          <Menu size={22} />
        </button>
        <div>
          <div className='flex items-center gap-1.5'>
            <span className='text-[10px] uppercase tracking-wider text-gray-400 font-semibold block'>
              Portal View
            </span>
            <span className='w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse' />
          </div>
          <h1 className='text-lg font-bold text-dark dark:text-white flex items-center gap-2'>
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Middle Section: Live Calendar & Clock Widget (Visible on md and up) */}
      {currentTime && (
        <div className='hidden md:flex items-center gap-4 px-4 py-1.5 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200/80 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-300 shadow-2xs'>
          <div className='flex items-center gap-1.5 font-medium'>
            <Calendar size={14} className='text-primary-purple' />
            <span>{formattedDate}</span>
          </div>
          <div className='w-px h-3.5 bg-gray-300 dark:bg-gray-700' />
          <div className='flex items-center gap-1.5 font-mono'>
            <Clock size={14} className='text-primary-purple' />
            <span>{formattedTime}</span>
          </div>
        </div>
      )}

      {/* Right Section: Badges, Notifications, Theme & Profile */}
      <div className='flex items-center gap-3 md:gap-4'>
        {/* Enrolled Program Badge */}
        <div className='hidden xl:flex items-center gap-2 px-3.5 py-1.5 bg-primary-purple/10 text-primary-purple rounded-full text-xs font-semibold border border-primary-purple/20'>
          <Sparkles size={14} />
          <span>
            {profile?.course ||
              profile?.program ||
              'Full-Stack Software Engineering'}
          </span>
        </div>

        {/* Quick Notification Bell */}
        <button
          onClick={() => setHasUnread(false)}
          className='relative p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all shadow-sm cursor-pointer'
          aria-label='Notifications'
        >
          <Bell size={18} />
          {hasUnread && (
            <span className='absolute top-2 right-2 w-2 h-2 bg-primary-red rounded-full ring-2 ring-white dark:ring-gray-900' />
          )}
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={handleToggle}
          type='button'
          aria-label='Toggle Dark/Light Mode'
          className='p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all shadow-sm cursor-pointer relative z-50'
        >
          {isDark ? (
            <Sun size={18} className='text-amber-400' />
          ) : (
            <Moon size={18} className='text-gray-700' />
          )}
        </button>

        {/* User Profile Info Section */}
        <div className='flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-gray-800'>
          <div className='w-9 h-9 rounded-full bg-gradient-to-tr from-primary-purple to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-md ring-2 ring-primary-purple/25'>
            {userInitial}
          </div>
          <div className='hidden lg:block text-left leading-tight'>
            <div className='flex items-center gap-1'>
              <p className='text-xs font-bold text-dark dark:text-white'>
                {fullName}
              </p>
              <ShieldCheck size={14} className='text-primary-purple' />
            </div>
            <p className='text-[10px] text-gray-400 mt-0.5 font-medium'>
              Verified Scholar
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}