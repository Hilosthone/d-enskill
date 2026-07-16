'use client' // This directive is required for Client Components

import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function AosInit() {
  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800, // Animation duration (ms)
      easing: 'ease-out', // Animation style
      once: true, // Only animate once while scrolling down
      offset: 100, // Offset (in px) from the original trigger point
      mirror: false, // Whether elements should animate out while scrolling past
    })
  }, [])

  // This component doesn't render anything, it just runs the logic
  return null
}
