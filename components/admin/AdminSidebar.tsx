'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  UserPlus,
  CreditCard,
  BookOpen,
  Bell,
  GraduationCap,
  BarChart3,
  Settings,
  LogOut,
  X,
} from 'lucide-react'

const adminNavItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Students', href: '/admin/students', icon: Users },
  { label: 'Manual Onboard', href: '/admin/manual-onboard', icon: UserPlus },
  { label: 'Payments', href: '/admin/payments', icon: CreditCard },
  { label: 'Courses', href: '/admin/courses', icon: BookOpen },
  { label: 'Announcements', href: '/admin/announcements', icon: Bell },
  { label: 'Instructors', href: '/admin/instructors', icon: GraduationCap },
  { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
  onLogout: () => void
}

export default function AdminSidebar({
  isOpen,
  onClose,
  onLogout,
}: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 
      transform transition-transform duration-200 ease-in-out flex flex-col justify-between
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
    `}
    >
      {/* Brand Header */}
      <div className='p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between'>
        <div>
          <h1 className='text-lg font-bold text-dark dark:text-white'>
            D Enskill
          </h1>
          <p className='text-[10px] uppercase font-semibold tracking-wider text-primary-purple'>
            Admin Portal
          </p>
        </div>
        <button
          onClick={onClose}
          className='md:hidden text-gray-400 hover:text-dark dark:hover:text-white'
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className='flex-1 p-4 space-y-1.5 overflow-y-auto'>
        {adminNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition
                ${
                  isActive
                    ? 'bg-primary-purple text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-dark dark:hover:text-white'
                }
              `}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer / Logout */}
      <div className='p-4 border-t border-gray-100 dark:border-gray-800'>
        <button
          onClick={onLogout}
          className='w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-500/10 transition cursor-pointer'
        >
          <LogOut size={18} />
          <span>Secure Logout</span>
        </button>
      </div>
    </aside>
  )
}
