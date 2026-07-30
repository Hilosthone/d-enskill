'use client'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Menu, ShieldAlert, Bell, Sun, Moon, User } from 'lucide-react'

interface AdminHeaderProps {
  onOpenSidebar: () => void
}

export default function AdminHeader({ onOpenSidebar }: AdminHeaderProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by waiting until mounted
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <header className='h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 flex items-center justify-between sticky top-0 z-40 transition-colors'>
      {/* Left Section: Sidebar Toggle & Console Title */}
      <div className='flex items-center gap-4'>
        <button
          onClick={onOpenSidebar}
          className='md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer'
          aria-label='Toggle Sidebar'
        >
          <Menu size={20} />
        </button>
        <div className='hidden sm:block'>
          <span className='text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block'>
            System Portal
          </span>
          <span className='text-sm font-bold text-dark dark:text-white tracking-wide'>
            Management Console
          </span>
        </div>
      </div>

      {/* Right Section: Theme Toggle, Notifications & Administrator Profile */}
      <div className='flex items-center gap-3'>
        {/* Light/Dark Mode Toggle Button */}
        {mounted && (
          <button
            onClick={toggleTheme}
            className='p-2.5 rounded-xl text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer'
            title='Toggle Theme'
            aria-label='Toggle Theme'
          >
            {theme === 'dark' ? (
              <Sun size={17} className='text-amber-400' />
            ) : (
              <Moon size={17} className='text-primary-purple' />
            )}
          </button>
        )}

        {/* Notifications Button */}
        <button
          className='p-2.5 rounded-xl text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 relative transition cursor-pointer'
          aria-label='Notifications'
        >
          <Bell size={17} />
          <span className='absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse' />
        </button>

        <div className='h-6 w-[1px] bg-gray-200 dark:bg-gray-800 mx-1 hidden md:block' />

        {/* Administrator Badge & Welcome */}
        <div className='flex items-center gap-3 bg-primary-purple/5 dark:bg-gray-800/60 border border-primary-purple/20 dark:border-gray-700 px-3.5 py-1.5 rounded-2xl'>
          <div className='w-8 h-8 rounded-xl bg-primary-purple text-white font-bold flex items-center justify-center text-xs shadow-sm'>
            MJ
          </div>
          <div className='hidden md:block text-left'>
            <p className='text-xs font-bold text-dark dark:text-white leading-tight'>
              Mr. Julius
            </p>
            <p className='text-[10px] text-primary-purple font-semibold flex items-center gap-1'>
              <ShieldAlert size={10} /> Director
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
