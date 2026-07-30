'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import * as Scroll from 'react-scroll'
import { useTheme } from 'next-themes'
import { NAV_LINKS } from '@/constants/navigation'
import { FaRocket, FaBars, FaTimes, FaSun, FaMoon } from 'react-icons/fa'

export default function Navbar() {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const isHome = pathname === '/'
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  // Prevents hydration errors by not rendering until mounted
  if (!mounted) return null

  const isDark = resolvedTheme === 'dark'

  const handleNavClick = (path: string) => {
    setIsOpen(false)
    if (isHome) {
      // Smooth scroll if already on home
      Scroll.scroller.scrollTo(path, {
        smooth: true,
        duration: 600,
        offset: -80,
      })
    } else {
      // Redirect to home and append hash to scroll once loaded
      router.push(`/#${path}`)
    }
  }

  return (
    <header className='fixed top-4 left-0 right-0 z-[100] px-4 md:px-6'>
      <nav className='max-w-6xl mx-auto bg-white/70 dark:bg-dark/70 backdrop-blur-lg border border-white/20 dark:border-white/10 shadow-lg rounded-full px-6 py-3 flex items-center justify-between'>
        {/* Logo */}
        <Link href='/' className='flex items-center gap-2 group'>
          <FaRocket className='text-primary-red text-xl' />
          <span className='text-lg font-bold text-dark dark:text-white'>
            D <span className='text-primary-red'>Enskill</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className='hidden md:flex items-center gap-8'>
          {NAV_LINKS.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNavClick(link.path)}
              className='text-sm font-extrabold cursor-pointer text-dark/70 dark:text-white/70 hover:text-primary-purple transition-colors'
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Desktop Actions & Theme Toggle */}
        <div className='hidden md:flex items-center gap-3'>
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            aria-label='Toggle Theme'
            className='p-2 rounded-full border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-800/50 text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer'
          >
            {isDark ? (
              <FaSun className='text-amber-400 text-sm' />
            ) : (
              <FaMoon className='text-gray-700 text-sm' />
            )}
          </button>
          <Link
            href='/admission'
            className='bg-primary-red text-white text-xs px-5 py-2 rounded-full font-semibold hover:bg-red-700 transition'
          >
            Apply Now
          </Link>
        </div>

        {/* Mobile Actions Container (Hamburger + Theme Toggle) */}
        <div className='flex items-center gap-2 md:hidden'>
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            aria-label='Toggle Theme'
            className='p-2 rounded-full border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-800/50 text-dark dark:text-white transition cursor-pointer'
          >
            {isDark ? (
              <FaSun className='text-amber-400 text-sm' />
            ) : (
              <FaMoon className='text-gray-700 text-sm' />
            )}
          </button>
          <button
            className='p-2 text-dark dark:text-white z-[110]'
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className='fixed inset-0 z-[95] bg-white/95 dark:bg-dark/95 backdrop-blur-md flex flex-col items-center justify-center gap-8'>
          {NAV_LINKS.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNavClick(link.path)}
              className='text-3xl font-bold text-dark font-extrabold dark:text-white hover:text-primary-purple transition-colors'
            >
              {link.name}
            </button>
          ))}
          <Link
            href='/admission'
            onClick={() => setIsOpen(false)}
            className='bg-primary-red text-white text-sm px-8 py-3 rounded-full font-semibold hover:bg-red-700 transition mt-4'
          >
            Apply Now
          </Link>
        </div>
      )}
    </header>
  )
}