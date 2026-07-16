'use client'
export default function LiveBackground() {
  return (
    <div className='fixed inset-0 -z-10 h-full w-full bg-white dark:bg-dark'>
      {/* Subtle grid pattern background */}
      <div className='absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30'></div>
    </div>
  )
}
