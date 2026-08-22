// // // src/app/tutors/layout.tsx
// // 'use client'

// // import { useState } from 'react'
// // import Link from 'next/link'
// // import { usePathname } from 'next/navigation'
// // import {
// //   LayoutDashboard,
// //   FileText,
// //   BookOpen,
// //   BarChart3,
// //   Menu,
// //   X,
// //   LogOut,
// //   GraduationCap,
// // } from 'lucide-react'

// // const navItems = [
// //   { name: 'Dashboard', href: '/tutors', icon: LayoutDashboard },
// //   {
// //     name: 'Assessments & Grading',
// //     href: '/tutors/assessments',
// //     icon: FileText,
// //   },
// //   { name: 'Modules & Sessions', href: '/tutors/modules', icon: BookOpen },
// //   { name: 'Cohort Analytics', href: '/tutors/analytics', icon: BarChart3 },
// // ]

// // export default function TutorsLayout({
// //   children,
// // }: {
// //   children: React.ReactNode
// // }) {
// //   const [sidebarOpen, setSidebarOpen] = useState(false)
// //   const pathname = usePathname()

// //   const handleLogout = () => {
// //     localStorage.removeItem('denskill_tutor_token')
// //       localStorage.removeItem('denskill_tutor_logged')
      
// //       // Redirect to the login page after logout
// //     window.location.href = '/auth/tutors-login'
// //   }

// //   return (
// //     <div className='min-h-screen bg-gray-50 dark:bg-gray-950 flex'>
// //       {/* Mobile Sidebar Backdrop */}
// //       {sidebarOpen && (
// //         <div
// //           onClick={() => setSidebarOpen(false)}
// //           className='fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden'
// //         />
// //       )}

// //       {/* Sidebar Navigation */}
// //       <aside
// //         className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-transform duration-300 md:translate-x-0 ${
// //           sidebarOpen ? 'translate-x-0' : '-translate-x-full'
// //         }`}
// //       >
// //         {/* Logo / Header */}
// //         <div className='p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between'>
// //           <div className='flex items-center gap-3'>
// //             <div className='w-9 h-9 rounded-xl bg-primary-purple/10 text-primary-purple flex items-center justify-center font-bold'>
// //               <GraduationCap size={20} />
// //             </div>
// //             <div>
// //               <h2 className='text-sm font-bold text-dark dark:text-white'>
// //                 Tutor Portal
// //               </h2>
// //               <p className='text-[10px] text-gray-400'>Instructor Management</p>
// //             </div>
// //           </div>
// //           <button
// //             onClick={() => setSidebarOpen(false)}
// //             className='md:hidden text-gray-400 hover:text-gray-200 cursor-pointer'
// //           >
// //             <X size={20} />
// //           </button>
// //         </div>

// //         {/* Navigation Links */}
// //         <nav className='flex-1 p-4 space-y-1.5 overflow-y-auto'>
// //           {navItems.map((item) => {
// //             const Icon = item.icon
// //             const isActive = pathname === item.href
// //             return (
// //               <Link
// //                 key={item.href}
// //                 href={item.href}
// //                 onClick={() => setSidebarOpen(false)}
// //                 className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${
// //                   isActive
// //                     ? 'bg-primary-purple text-white shadow-sm'
// //                     : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60'
// //                 }`}
// //               >
// //                 <Icon size={18} />
// //                 {item.name}
// //               </Link>
// //             )
// //           })}
// //         </nav>

// //         {/* Footer / Logout */}
// //         <div className='p-4 border-t border-gray-100 dark:border-gray-800'>
// //           <button
// //             onClick={handleLogout}
// //             className='w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-500/10 transition cursor-pointer'
// //           >
// //             <LogOut size={18} /> Sign Out
// //           </button>
// //         </div>
// //       </aside>

// //       {/* Main Content Area */}
// //       <div className='flex-1 md:ml-64 flex flex-col min-w-0'>
// //         {/* Top Navbar */}
// //         <header className='h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 flex items-center justify-between sticky top-0 z-30'>
// //           <button
// //             onClick={() => setSidebarOpen(true)}
// //             className='md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer'
// //           >
// //             <Menu size={20} />
// //           </button>
// //           <div className='hidden md:block'>
// //             <span className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>
// //               Portal Workspace
// //             </span>
// //           </div>
// //           <div className='flex items-center gap-3'>
// //             <div className='w-8 h-8 rounded-full bg-primary-purple/20 text-primary-purple font-bold flex items-center justify-center text-xs'>
// //               IN
// //             </div>
// //             <span className='text-xs font-bold text-dark dark:text-white hidden sm:inline'>
// //               Instructor Portal
// //             </span>
// //           </div>
// //         </header>

// //         {/* Page Content View */}
// //         <main className='flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto'>
// //           {children}
// //         </main>
// //       </div>
// //     </div>
// //   )
// // }



// // src/app/tutors/layout.tsx
// 'use client'

// import { useState } from 'react'
// import Link from 'next/link'
// import { usePathname } from 'next/navigation'
// import {
//   LayoutDashboard,
//   FileText,
//   BookOpen,
//   BarChart3,
//   CalendarCheck,
//   Users,
//   Megaphone,
//   Menu,
//   X,
//   LogOut,
//   GraduationCap,
// } from 'lucide-react'

// const navItems = [
//   { name: 'Dashboard', href: '/tutors/dashboard', icon: LayoutDashboard },
//   {
//     name: 'Assessments & Grading',
//     href: '/tutors/assessments',
//     icon: FileText,
//   },
//   { name: 'Modules & Sessions', href: '/tutors/modules', icon: BookOpen },
//   { name: 'Attendance', href: '/tutors/attendance', icon: CalendarCheck },
//   { name: 'Student Roster', href: '/tutors/roster', icon: Users },
//   { name: 'Announcements', href: '/tutors/announcements', icon: Megaphone },
//   { name: 'Cohort Analytics', href: '/tutors/analytics', icon: BarChart3 },
// ]

// export default function TutorsLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const [sidebarOpen, setSidebarOpen] = useState(false)
//   const pathname = usePathname()

//   const handleLogout = () => {
//     localStorage.removeItem('denskill_tutor_token')
//     localStorage.removeItem('denskill_tutor_logged')
    
//     // Redirect to the login page after logout
//     window.location.href = '/auth/tutors-login'
//   }

//   return (
//     <div className='min-h-screen bg-gray-50 dark:bg-gray-950 flex'>
//       {/* Mobile Sidebar Backdrop */}
//       {sidebarOpen && (
//         <div
//           onClick={() => setSidebarOpen(false)}
//           className='fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden'
//         />
//       )}

//       {/* Sidebar Navigation */}
//       <aside
//         className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-transform duration-300 md:translate-x-0 ${
//           sidebarOpen ? 'translate-x-0' : '-translate-x-full'
//         }`}
//       >
//         {/* Logo / Header */}
//         <div className='p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between'>
//           <div className='flex items-center gap-3'>
//             <div className='w-9 h-9 rounded-xl bg-primary-purple/10 text-primary-purple flex items-center justify-center font-bold'>
//               <GraduationCap size={20} />
//             </div>
//             <div>
//               <h2 className='text-sm font-bold text-dark dark:text-white'>
//                 Tutor Portal
//               </h2>
//               <p className='text-[10px] text-gray-400'>Instructor Management</p>
//             </div>
//           </div>
//           <button
//             onClick={() => setSidebarOpen(false)}
//             className='md:hidden text-gray-400 hover:text-gray-200 cursor-pointer'
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* Navigation Links */}
//         <nav className='flex-1 p-4 space-y-1.5 overflow-y-auto'>
//           {navItems.map((item) => {
//             const Icon = item.icon
//             const isActive = pathname === item.href
//             return (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 onClick={() => setSidebarOpen(false)}
//                 className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${
//                   isActive
//                     ? 'bg-primary-purple text-white shadow-sm'
//                     : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60'
//                 }`}
//               >
//                 <Icon size={18} />
//                 {item.name}
//               </Link>
//             )
//           })}
//         </nav>

//         {/* Footer / Logout */}
//         <div className='p-4 border-t border-gray-100 dark:border-gray-800'>
//           <button
//             onClick={handleLogout}
//             className='w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-500/10 transition cursor-pointer'
//           >
//             <LogOut size={18} /> Sign Out
//           </button>
//         </div>
//       </aside>

//       {/* Main Content Area */}
//       <div className='flex-1 md:ml-64 flex flex-col min-w-0'>
//         {/* Top Navbar */}
//         <header className='h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 flex items-center justify-between sticky top-0 z-30'>
//           <button
//             onClick={() => setSidebarOpen(true)}
//             className='md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer'
//           >
//             <Menu size={20} />
//           </button>
//           <div className='hidden md:block'>
//             <span className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>
//               Portal Workspace
//             </span>
//           </div>
//           <div className='flex items-center gap-3'>
//             <div className='w-8 h-8 rounded-full bg-primary-purple/20 text-primary-purple font-bold flex items-center justify-center text-xs'>
//               IN
//             </div>
//             <span className='text-xs font-bold text-dark dark:text-white hidden sm:inline'>
//               Instructor Portal
//             </span>
//           </div>
//         </header>

//         {/* Page Content View */}
//         <main className='flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto'>
//           {children}
//         </main>
//       </div>
//     </div>
//   )
// }





// src/app/tutors/layout.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  BarChart3,
  CalendarCheck,
  Users,
  Megaphone,
  Menu,
  X,
  LogOut,
  GraduationCap,
  Mail,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react'

type Tutor = {
  id?: string | number
  name?: string
  email?: string
  specialty?: string
  role?: string
}

const navItems = [
  {
    name: 'Dashboard',
    href: '/tutors/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Assessments & Grading',
    href: '/tutors/assessments',
    icon: FileText,
  },
  {
    name: 'Modules & Sessions',
    href: '/tutors/modules',
    icon: BookOpen,
  },
  {
    name: 'Attendance',
    href: '/tutors/attendance',
    icon: CalendarCheck,
  },
  {
    name: 'Student Roster',
    href: '/tutors/roster',
    icon: Users,
  },
  {
    name: 'Announcements',
    href: '/tutors/announcements',
    icon: Megaphone,
  },
  {
    name: 'Cohort Analytics',
    href: '/tutors/analytics',
    icon: BarChart3,
  },
]

export default function TutorsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const [tutor, setTutor] = useState<Tutor | null>(null)
  const pathname = usePathname()

  // ==========================================
  // LOAD LOGGED-IN TUTOR
  // ==========================================

  useEffect(() => {
    const loadTutor = () => {
      try {
        const storedTutor = localStorage.getItem('denskill_tutor')

        if (!storedTutor) {
          setTutor(null)
          return
        }

        const parsedTutor = JSON.parse(storedTutor)

        setTutor(parsedTutor)
      } catch (error) {
        console.error('Failed to load tutor profile:', error)
        setTutor(null)
      }
    }

    loadTutor()

    // Listen for changes to localStorage
    const handleStorageChange = () => {
      loadTutor()
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // ==========================================
  // TUTOR INFORMATION
  // ==========================================

  const tutorName = tutor?.name || 'Tutor'
  const tutorEmail = tutor?.email || 'No email available'
  const tutorRole = tutor?.role || 'Instructor'
  const tutorSpecialty = tutor?.specialty || 'Education'

  const tutorInitials = tutorName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || 'TU'

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem('denskill_tutor_token')
    localStorage.removeItem('denskill_tutor')
    localStorage.removeItem('denskill_tutor_logged')

    // Also remove the old key in case an older login created it
    localStorage.removeItem('denskill_token')

    window.location.href = '/auth/tutors-login'
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-950 flex'>
      {/* ==========================================
          MOBILE SIDEBAR BACKDROP
      ========================================== */}

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className='fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden'
        />
      )}

      {/* ==========================================
          SIDEBAR
      ========================================== */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}

        <div className='p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between'>
          <div className='flex items-center gap-3 min-w-0'>
            <div className='w-9 h-9 shrink-0 rounded-xl bg-primary-purple/10 text-primary-purple flex items-center justify-center font-bold'>
              <GraduationCap size={20} />
            </div>

            <div className='min-w-0'>
              <h2 className='text-sm font-bold text-dark dark:text-white truncate'>
                Tutor Portal
              </h2>

              <p className='text-[10px] text-gray-400 truncate'>
                Instructor Management
              </p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className='md:hidden text-gray-400 hover:text-gray-200 cursor-pointer'
            aria-label='Close sidebar'
          >
            <X size={20} />
          </button>
        </div>

        {/* ==========================================
            LOGGED-IN TUTOR CARD
        ========================================== */}

        <div className='p-4 border-b border-gray-100 dark:border-gray-800'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 shrink-0 rounded-xl bg-primary-purple text-white font-bold flex items-center justify-center text-xs shadow-sm'>
              {tutorInitials}
            </div>

            <div className='min-w-0'>
              <p className='text-xs font-bold text-dark dark:text-white truncate'>
                {tutorName}
              </p>

              <p className='text-[10px] text-gray-400 truncate'>
                {tutorRole}
              </p>
            </div>
          </div>
        </div>

        {/* ==========================================
            NAVIGATION
        ========================================== */}

        <nav className='flex-1 p-4 space-y-1.5 overflow-y-auto'>
          {navItems.map((item) => {
            const Icon = item.icon

            const isActive =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`)

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-primary-purple text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60'
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* ==========================================
            SIDEBAR FOOTER
        ========================================== */}

        <div className='p-4 border-t border-gray-100 dark:border-gray-800'>
          <div className='mb-3 px-3'>
            <p className='text-[10px] text-gray-400 truncate'>
              Signed in as
            </p>

            <p className='text-xs font-semibold text-dark dark:text-white truncate'>
              {tutorEmail}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className='w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-500/10 transition cursor-pointer'
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ==========================================
          MAIN CONTENT
      ========================================== */}

      <div className='flex-1 md:ml-64 flex flex-col min-w-0'>
        {/* ==========================================
            TOP NAVBAR
        ========================================== */}

        <header className='h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30'>
          {/* Mobile Menu */}

          <button
            onClick={() => setSidebarOpen(true)}
            className='md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer'
            aria-label='Open sidebar'
          >
            <Menu size={20} />
          </button>

          {/* Desktop Workspace Title */}

          <div className='hidden md:flex items-center gap-3'>
            <div>
              <span className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                Portal Workspace
              </span>

              <p className='text-[10px] text-gray-400'>
                Tutor & Instructor Management
              </p>
            </div>
          </div>

          {/* ==========================================
              TUTOR PROFILE NAVBAR
          ========================================== */}

          <div className='relative ml-auto'>
            <button
              onClick={() => setProfileOpen((prev) => !prev)}
              className='flex items-center gap-3 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer'
            >
              {/* Avatar */}

              <div className='w-9 h-9 rounded-full bg-primary-purple text-white font-bold flex items-center justify-center text-xs shadow-sm'>
                {tutorInitials}
              </div>

              {/* Name + Role */}

              <div className='hidden sm:block text-left max-w-[180px]'>
                <p className='text-xs font-bold text-dark dark:text-white truncate'>
                  {tutorName}
                </p>

                <p className='text-[10px] text-gray-400 truncate'>
                  {tutorRole}
                </p>
              </div>

              <ChevronDown
                size={15}
                className={`hidden sm:block text-gray-400 transition-transform ${
                  profileOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* ==========================================
                PROFILE DROPDOWN
            ========================================== */}

            {profileOpen && (
              <>
                {/* Dropdown Backdrop */}

                <div
                  className='fixed inset-0 z-[-1]'
                  onClick={() => setProfileOpen(false)}
                />

                <div className='absolute right-0 top-12 w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden'>
                  {/* Profile Header */}

                  <div className='p-4 bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800'>
                    <div className='flex items-center gap-3'>
                      <div className='w-12 h-12 rounded-xl bg-primary-purple text-white font-bold flex items-center justify-center text-sm shadow-sm'>
                        {tutorInitials}
                      </div>

                      <div className='min-w-0'>
                        <h3 className='text-sm font-bold text-dark dark:text-white truncate'>
                          {tutorName}
                        </h3>

                        <p className='text-[10px] text-gray-400 truncate'>
                          {tutorEmail}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tutor Details */}

                  <div className='p-4 space-y-3'>
                    {/* Role */}

                    <div className='flex items-center gap-3'>
                      <div className='w-8 h-8 rounded-lg bg-primary-purple/10 text-primary-purple flex items-center justify-center shrink-0'>
                        <ShieldCheck size={15} />
                      </div>

                      <div className='min-w-0'>
                        <p className='text-[10px] text-gray-400'>
                          Role
                        </p>

                        <p className='text-xs font-semibold text-dark dark:text-white truncate'>
                          {tutorRole}
                        </p>
                      </div>
                    </div>

                    {/* Email */}

                    <div className='flex items-center gap-3'>
                      <div className='w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0'>
                        <Mail size={15} />
                      </div>

                      <div className='min-w-0'>
                        <p className='text-[10px] text-gray-400'>
                          Email
                        </p>

                        <p className='text-xs font-semibold text-dark dark:text-white truncate'>
                          {tutorEmail}
                        </p>
                      </div>
                    </div>

                    {/* Specialty */}

                    <div className='flex items-center gap-3'>
                      <div className='w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0'>
                        <BookOpen size={15} />
                      </div>

                      <div className='min-w-0'>
                        <p className='text-[10px] text-gray-400'>
                          Specialty
                        </p>

                        <p className='text-xs font-semibold text-dark dark:text-white truncate'>
                          {tutorSpecialty}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Logout */}

                  <div className='p-3 border-t border-gray-200 dark:border-gray-800'>
                    <button
                      onClick={handleLogout}
                      className='w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-500/10 transition cursor-pointer'
                    >
                      <LogOut size={15} />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        {/* ==========================================
            PAGE CONTENT
        ========================================== */}

        <main className='flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto'>
          {children}
        </main>
      </div>
    </div>
  )
}