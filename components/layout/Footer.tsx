// 'use client'
// import {
//   FaFacebook,
//   FaInstagram,
//   FaLinkedin,
//   FaTwitter,
//   FaGithub,
// } from 'react-icons/fa'
// import { useState, useEffect } from 'react'

// // Dynamically import react-scroll to avoid Turbopack/ESM evaluation errors
// let ScrollLink: any = null

// export default function Footer() {
//   const [isMounted, setIsMounted] = useState(false)

//   useEffect(() => {
//     import('react-scroll').then((module) => {
//       ScrollLink = module.Link
//       setIsMounted(true)
//     })
//   }, [])

//   return (
//     <footer className='bg-dark text-gray-300 py-16 px-6 border-t border-gray-800'>
//       <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12'>
//         {/* Branding */}
//         <div className='col-span-1 md:col-span-2'>
//           <h3 className='text-white text-2xl font-bold mb-4'>D Enskill</h3>
//           <p className='max-w-xs text-sm'>
//             Equipping aspiring developers, designers, and innovators with
//             practical, industry-ready digital skills.
//           </p>
//         </div>

//         {/* Quick Links */}
//         <div>
//           <h4 className='text-white font-bold mb-4'>Quick Links</h4>
//           <ul className='space-y-2 text-sm'>
//             {['About', 'Programmes', 'Scholarship', 'Admission', 'Contact'].map(
//               (item) => (
//                 <li key={item}>
//                   {isMounted && ScrollLink ? (
//                     <ScrollLink
//                       to={item.toLowerCase()}
//                       smooth={true}
//                       className='cursor-pointer hover:text-primary-red transition-colors'
//                     >
//                       {item}
//                     </ScrollLink>
//                   ) : (
//                     <span className='text-gray-500'>{item}</span>
//                   )}
//                 </li>
//               ),
//             )}
//           </ul>
//         </div>

//         {/* Socials */}
//         <div>
//           <h4 className='text-white font-bold mb-4'>Connect</h4>
//           <div className='flex gap-4 text-xl'>
//             <a href='#' className='hover:text-primary-red transition'>
//               <FaFacebook />
//             </a>
//             <a href='#' className='hover:text-primary-red transition'>
//               <FaInstagram />
//             </a>
//             <a href='#' className='hover:text-primary-red transition'>
//               <FaLinkedin />
//             </a>
//             <a href='#' className='hover:text-primary-red transition'>
//               <FaTwitter />
//             </a>
//             <a href='#' className='hover:text-primary-red transition'>
//               <FaGithub />
//             </a>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Bar */}
//       <div className='max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-xs'>
//         &copy; {new Date().getFullYear()} D Enskill. All rights reserved.
//       </div>
//     </footer>
//   )
// }

'use client'
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaGithub,
} from 'react-icons/fa'
import { Link as ScrollLink } from 'react-scroll'

export default function Footer() {
  return (
    <footer className='bg-white dark:bg-gray-950 text-gray-600 dark:text-gray-400 py-16 px-6 border-t border-gray-200 dark:border-gray-800 transition-colors'>
      <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12'>
        {/* Branding */}
        <div className='col-span-1 md:col-span-2'>
          <h3 className='text-2xl font-bold mb-4'>
            <span className='text-dark dark:text-white'>D</span>
            { ' ' }
            <span className='text-primary-red'>Enskill</span>
          </h3>
          <p className='max-w-xs text-sm'>
            Equipping aspiring developers, designers, and innovators with
            practical, industry-ready digital skills.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className='text-dark dark:text-white font-bold mb-4'>
            Quick Links
          </h4>
          <ul className='space-y-2 text-sm'>
            {['About', 'Programmes', 'Scholarship', 'Admission', 'Contact'].map(
              (item) => (
                <li key={item}>
                  <ScrollLink
                    to={item.toLowerCase()}
                    smooth={true}
                    duration={500}
                    className='cursor-pointer hover:text-primary-red transition-colors'
                  >
                    {item}
                  </ScrollLink>
                </li>
              ),
            )}
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h4 className='text-dark dark:text-white font-bold mb-4'>Connect</h4>
          <div className='flex gap-4 text-xl'>
            {[FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaGithub].map(
              (Icon, i) => (
                <a
                  key={i}
                  href='#'
                  className='hover:text-primary-red transition-colors'
                >
                  <Icon />
                </a>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className='max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-xs'>
        <p>&copy; {new Date().getFullYear()} D Enskill. All rights reserved.</p>
      </div>
    </footer>
  )
}
