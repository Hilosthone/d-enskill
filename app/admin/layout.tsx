//src/app/admin/layout.tsx
'use client'
import { ReactNode, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminNavbar from '@/components/admin/AdminNavbar'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Check if admin session exists
    const adminAuth = sessionStorage.getItem('adminAuth')

    // For local development testing, you can temporarily bypass or set a mock token:
    // sessionStorage.setItem('adminAuth', 'true')

    if (!adminAuth) {
      router.push('/auth/login')
    } else {
      setIsAuthorized(true)
    }
  }, [router])

  // Prevent flashing protected content before redirecting
  if (!isAuthorized) {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center'>
        <div className='animate-pulse text-sm font-semibold text-gray-500'>
          Authenticating Director Access...
        </div>
      </div>
    )
  }

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth')
    router.push('/auth/login')
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-950 flex'>
      {/* Sidebar Component */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      {/* Main Content Container */}
      <div className='flex-1 md:ml-64 flex flex-col min-w-0'>
        {/* Header Component */}
        <AdminNavbar onOpenSidebar={() => setSidebarOpen(true)} />

        {/* Page View Container */}
        <main className='flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto'>
          {children}
        </main>
      </div>
    </div>
  )
}