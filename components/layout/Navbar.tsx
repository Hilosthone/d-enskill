// 'use client'
// import { useState, useEffect } from 'react'
// import { useTheme } from 'next-themes'
// import * as Scroll from 'react-scroll'
// import { NAV_LINKS } from '@/constants/navigation'
// import { FaRocket, FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa'

// const ScrollLink = Scroll.Link

// export default function Navbar() {
//   const [mounted, setMounted] = useState(false)
//   const [isOpen, setIsOpen] = useState(false)
//   const { theme, setTheme } = useTheme()

//   useEffect(() => setMounted(true), [])

//   if (!mounted) return null

//   return (
//     <>
//       <header className='fixed top-4 left-0 right-0 z-[100] px-4 md:px-6'>
//         <nav className='max-w-6xl mx-auto bg-white/70 dark:bg-dark/70 backdrop-blur-lg border border-white/20 dark:border-white/10 shadow-lg rounded-full px-6 py-3 flex items-center justify-between'>
//           {/* Logo */}
//           <ScrollLink
//             to='home'
//             smooth={true}
//             duration={500}
//             className='flex items-center gap-2 cursor-pointer group'
//           >
//             <FaRocket className='text-primary-red text-xl' />
//             <span className='text-lg font-bold text-dark dark:text-white'>
//               Tech<span className='text-primary-red'>Rocket</span>
//             </span>
//           </ScrollLink>

//           {/* Desktop Links */}
//           <div className='hidden md:flex items-center gap-8'>
//             {NAV_LINKS.map((link) => (
//               <ScrollLink
//                 key={link.path}
//                 to={link.path}
//                 smooth={true}
//                 duration={600}
//                 offset={-80}
//                 className='text-sm font-medium cursor-pointer text-dark/70 dark:text-white/70 hover:text-primary-blue transition-colors'
//               >
//                 {link.name}
//               </ScrollLink>
//             ))}
//           </div>

//           {/* Desktop Actions */}
//           <div className='hidden md:flex items-center gap-4'>
//             <button
//               onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
//               className='p-2 rounded-full bg-gray-200 dark:bg-gray-800 transition-colors'
//             >
//               {theme === 'dark' ? (
//                 <FaSun className='text-yellow-400' />
//               ) : (
//                 <FaMoon className='text-dark' />
//               )}
//             </button>
//             <ScrollLink
//               to='admission'
//               smooth={true}
//               className='bg-primary-red text-white text-xs px-5 py-2 rounded-full font-semibold cursor-pointer hover:bg-red-700 transition'
//             >
//               Apply Now
//             </ScrollLink>
//           </div>

//           {/* Hamburger Button */}
//           <button
//             className='md:hidden p-2 text-dark dark:text-white z-[110] relative'
//             onClick={() => setIsOpen(!isOpen)}
//             aria-label='Toggle Menu'
//           >
//             {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
//           </button>
//         </nav>
//       </header>

//       {/* Mobile Menu Overlay - Rendered at top level to avoid container clipping */}
//       {isOpen && (
//         <div className='fixed inset-0 z-[95] bg-white/95 dark:bg-dark/95 backdrop-blur-md flex flex-col items-center justify-center gap-8'>
//           <button
//             className='absolute top-8 right-8 text-dark dark:text-white'
//             onClick={() => setIsOpen(false)}
//           >
//             <FaTimes size={32} />
//           </button>
//           {NAV_LINKS.map((link) => (
//             <ScrollLink
//               key={link.path}
//               to={link.path}
//               smooth={true}
//               duration={600}
//               offset={-80}
//               onClick={() => setIsOpen(false)}
//               className='text-3xl font-bold cursor-pointer hover:text-primary-blue transition-colors'
//             >
//               {link.name}
//             </ScrollLink>
//           ))}
//         </div>
//       )}
//     </>
//   )
// }

'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import * as Scroll from 'react-scroll'
import { NAV_LINKS } from '@/constants/navigation'
import { FaRocket, FaBars, FaTimes } from 'react-icons/fa'

export default function Navbar() {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const isHome = pathname === '/'

  useEffect(() => setMounted(true), [])

  // Prevents hydration errors by not rendering until mounted
  if (!mounted) return null

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
            D {' '} <span className='text-primary-red'>Enskill</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className='hidden md:flex items-center gap-8'>
          {NAV_LINKS.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNavClick(link.path)}
              className='text-sm font-medium cursor-pointer text-dark/70 dark:text-white/70 hover:text-primary-blue transition-colors'
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className='hidden md:flex items-center'>
          <Link
            href='/admission'
            className='bg-primary-red text-white text-xs px-5 py-2 rounded-full font-semibold hover:bg-red-700 transition'
          >
            Apply Now
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className='md:hidden p-2 text-dark dark:text-white z-[110]'
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className='fixed inset-0 z-[95] bg-white/95 dark:bg-dark/95 backdrop-blur-md flex flex-col items-center justify-center gap-8'>
          {NAV_LINKS.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNavClick(link.path)}
              className='text-3xl font-bold text-dark dark:text-white hover:text-primary-blue transition-colors'
            >
              {link.name}
            </button>
          ))}
        </div>
      )}
    </header>
  )
}