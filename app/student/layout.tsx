//src//app/student/layout.tsx
'use client'
import { ReactNode, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/student/Sidebar'
import Navbar from '@/components/student/Navbar'
import { X } from 'lucide-react'

export default function StudentLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Check if user is logged in via session storage
    const loggedIn = sessionStorage.getItem('isLoggedIn')
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('denskill_token')
        : null

    if (!loggedIn && !token) {
      router.push('/auth/login')
    } else {
      setIsAuthorized(true)
    }
  }, [router])

  // Prevent layout flicker or unauthorized render while verifying auth
  if (!isAuthorized) {
    return (
      <div className='h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center'>
        <div className='animate-pulse text-gray-500 font-medium text-sm'>
          Verifying security session...
        </div>
      </div>
    )
  }

  return (
    <div className='h-screen bg-gray-50 dark:bg-gray-950 flex overflow-hidden'>
      {/* Mobile Sliding Menu Drawer */}
      {isMobileMenuOpen && (
        <div className='fixed inset-0 z-50 bg-black/50 md:hidden flex'>
          <div className='w-64 h-full shadow-xl relative bg-white dark:bg-gray-900'>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className='absolute top-6 right-4 text-gray-500 z-10'
            >
              <X size={20} />
            </button>
            <Sidebar onCloseMobile={() => setIsMobileMenuOpen(false)} />
          </div>
          <div className='flex-1' onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className='w-64 border-r border-gray-200 dark:border-gray-800 hidden md:block h-screen'>
        <Sidebar />
      </aside>

      {/* Main Content Area - Isolated scroll container */}
      <div className='flex-1 flex flex-col h-screen overflow-y-auto'>
        <Navbar onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
        <main className='flex-1'>{children}</main>
      </div>
    </div>
  )
}