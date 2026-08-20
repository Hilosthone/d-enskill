// src/app/tutors/layout.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  BarChart3,
  Menu,
  X,
  LogOut,
  GraduationCap,
} from 'lucide-react'

const navItems = [
  { name: 'Dashboard', href: '/tutors', icon: LayoutDashboard },
  {
    name: 'Assessments & Grading',
    href: '/tutors/assessments',
    icon: FileText,
  },
  { name: 'Modules & Sessions', href: '/tutors/modules', icon: BookOpen },
  { name: 'Cohort Analytics', href: '/tutors/analytics', icon: BarChart3 },
]

export default function TutorsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const handleLogout = () => {
    localStorage.removeItem('denskill_tutor_token')
      localStorage.removeItem('denskill_tutor_logged')
      
      // Redirect to the login page after logout
    window.location.href = '/auth/tutors-login'
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-950 flex'>
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className='fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden'
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo / Header */}
        <div className='p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='w-9 h-9 rounded-xl bg-primary-purple/10 text-primary-purple flex items-center justify-center font-bold'>
              <GraduationCap size={20} />
            </div>
            <div>
              <h2 className='text-sm font-bold text-dark dark:text-white'>
                Tutor Portal
              </h2>
              <p className='text-[10px] text-gray-400'>Instructor Management</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className='md:hidden text-gray-400 hover:text-gray-200 cursor-pointer'
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className='flex-1 p-4 space-y-1.5 overflow-y-auto'>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
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
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Footer / Logout */}
        <div className='p-4 border-t border-gray-100 dark:border-gray-800'>
          <button
            onClick={handleLogout}
            className='w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-500/10 transition cursor-pointer'
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className='flex-1 md:ml-64 flex flex-col min-w-0'>
        {/* Top Navbar */}
        <header className='h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 flex items-center justify-between sticky top-0 z-30'>
          <button
            onClick={() => setSidebarOpen(true)}
            className='md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer'
          >
            <Menu size={20} />
          </button>
          <div className='hidden md:block'>
            <span className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>
              Portal Workspace
            </span>
          </div>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 rounded-full bg-primary-purple/20 text-primary-purple font-bold flex items-center justify-center text-xs'>
              IN
            </div>
            <span className='text-xs font-bold text-dark dark:text-white hidden sm:inline'>
              Instructor Portal
            </span>
          </div>
        </header>

        {/* Page Content View */}
        <main className='flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto'>
          {children}
        </main>
      </div>
    </div>
  )
}
