'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  CreditCard,
  BookOpen,
  Bell,
  MessageSquare,
  Receipt,
  User,
  LogOut,
} from 'lucide-react'
import { apiClient } from '@/services/api'

interface SidebarProps {
  onCloseMobile?: () => void
}

export default function Sidebar({ onCloseMobile }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      if (apiClient.logout) {
        await apiClient.logout()
      }
    } catch (err) {
      // Proceed with local cleanup even if API request fails
    } finally {
      sessionStorage.clear()
      localStorage.removeItem('denskill_token')
      localStorage.removeItem('denskill_user')
      router.push('/auth/login')
      if (onCloseMobile) {
        onCloseMobile()
      }
    }
  }

  const navItems = [
    { name: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Payments', href: '/student/payments', icon: CreditCard },
    { name: 'My Courses', href: '/student/courses', icon: BookOpen },
    { name: 'Announcements', href: '/student/announcements', icon: Bell },
    // { name: 'Community', href: '/student/community', icon: MessageSquare },
    { name: 'Receipts', href: '/student/receipts', icon: Receipt },
    { name: 'Profile', href: '/student/profile', icon: User },
  ]

  return (
    <div className='h-full flex flex-col justify-between p-6 bg-white dark:bg-gray-900'>
      <div className='space-y-6'>
        <div>
          <h2 className='text-xl font-bold text-primary-purple'>D Enskill</h2>
          <p className='text-xs text-gray-500'>Student Portal</p>
        </div>

        <nav className='space-y-1'>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary-purple text-white shadow-md shadow-primary-purple/20'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon size={18} /> {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className='flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/25 transition-all w-full text-left cursor-pointer'
      >
        <LogOut size={18} /> Logout
      </button>
    </div>
  )
}
