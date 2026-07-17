// import '@/styles/globals.css'
// import { ReactNode } from 'react'
// import { ThemeProvider } from 'next-themes'
// import AosInit from '@/components/AosInit'
// import Navbar from '@/components/layout/Navbar'
// import LiveBackground from '@/components/LiveBackground'
// import Footer from '@/components/layout/Footer'

// export const metadata = {
//   title: 'D Enskill | Practical Tech Skills Institute',
//   description:
//     'Equipping aspiring developers with industry-ready digital skills.',
// }

// export default function RootLayout({ children }: { children: ReactNode }) {
//   return (
//     <html lang='en' suppressHydrationWarning>
//       <body className='antialiased font-sans bg-white dark:bg-dark transition-colors duration-300'>
//         <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
//           <AosInit />
//           <LiveBackground />
//           <Navbar />
//           <main>{children}</main>
//           <Footer />
//         </ThemeProvider>
//       </body>
//     </html>
//   )
// }

import '@/styles/globals.css'
import { ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'
import AosInit from '@/components/AosInit'
import Navbar from '@/components/layout/Navbar'
import LiveBackground from '@/components/LiveBackground'
import Footer from '@/components/layout/Footer'

export const metadata = {
  title: 'D Enskill | Practical Tech Skills Institute',
  description:
    'Equipping aspiring developers with industry-ready digital skills.',
  metadataBase: new URL('https://denskill.com'),
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'D Enskill | Practical Tech Skills Institute',
    description:
      'Equipping aspiring developers with industry-ready digital skills.',
    url: 'https://denskill.com',
    siteName: 'D Enskill',
    images: [
      {
        url: '/denskill.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className='antialiased font-sans bg-white dark:bg-dark transition-colors duration-300'>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <AosInit />
          <LiveBackground />
          <Navbar />
          <main className='min-h-screen'>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}