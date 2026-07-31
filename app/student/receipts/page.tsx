'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Download, CheckCircle2, Loader2, Receipt } from 'lucide-react'
import { apiClient } from '@/services/api'

export default function StudentReceiptsPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [payments, setPayments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loggedIn = sessionStorage.getItem('isLoggedIn')
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('denskill_token')
        : null
    const data = sessionStorage.getItem('pendingRegistration')

    if (!loggedIn && !token) {
      router.push('/auth/login')
      return
    }

    if (data) {
      try {
        setProfile(JSON.parse(data))
      } catch (e) {
        setProfile({ firstName: 'Scholar' })
      }
    } else {
      setProfile({ firstName: 'Scholar' })
    }

    const fetchData = async () => {
      try {
        const [profileRes, paymentsRes] = await Promise.all([
          apiClient.getStudentProfile
            ? apiClient.getStudentProfile()
            : Promise.resolve(null),
          apiClient.getPayments
            ? apiClient.getPayments()
            : Promise.resolve(null),
        ])

        if (profileRes && (profileRes.user || profileRes.data)) {
          const userObj = profileRes.user || profileRes.data
          setProfile(userObj)
          sessionStorage.setItem('pendingRegistration', JSON.stringify(userObj))
        }

        if (paymentsRes) {
          const paymentList =
            paymentsRes.payments || paymentsRes.data || paymentsRes
          if (Array.isArray(paymentList)) {
            setPayments(paymentList)
          }
        }
      } catch (err) {
        // Fallback to local session data
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleDownloadText = () => {
    if (!profile) return

    const latestPayment = payments.length > 0 ? payments[0] : null
    const referenceId = latestPayment?.reference || latestPayment?.id || 'N/A'
    const courseName =
      latestPayment?.course ||
      profile.course ||
      profile.program ||
      'Full-Stack Development'
    const totalAmount = latestPayment?.total_amount
      ? `₦${Number(latestPayment.total_amount).toLocaleString()}`
      : 'N/A'
    const amountPaid = latestPayment?.amount_paid
      ? `₦${Number(latestPayment.amount_paid).toLocaleString()}`
      : 'N/A'
    const paymentStatus = latestPayment?.payment_status || 'Paid'
    const expiresAt = latestPayment?.expires_at
      ? new Date(latestPayment.expires_at).toLocaleDateString()
      : 'N/A'
    const dateIssued = latestPayment?.created_at
      ? new Date(latestPayment.created_at).toLocaleDateString()
      : new Date().toLocaleDateString()

    const receiptContent = `
========================================
            DENSKILL ACADEMY
        Practical Tech Skills Institute
========================================

RECEIPT / PAYMENT DETAILS
----------------------------------------
Reference ID   : ${referenceId}
Date Issued    : ${dateIssued}
Payment Status : ${paymentStatus.toUpperCase()}
Expires At     : ${expiresAt}

STUDENT INFORMATION
----------------------------------------
Name           : ${profile.firstName || ''} ${profile.lastName || ''}
Email          : ${profile.email || 'N/A'}
Enrolled Course: ${courseName}

FINANCIAL BREAKDOWN
----------------------------------------
Total Amount   : ${totalAmount}
Amount Paid    : ${amountPaid}
Description    : Academy Tuition & Admission Processing

========================================
Thank you for training with Denskill!
www.denskill.com
========================================
    `.trim()

    const blob = new Blob([receiptContent], {
      type: 'text/plain;charset=utf-8',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Denskill_Receipt_${referenceId}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className='p-6 md:p-12 space-y-6 max-w-4xl mx-auto animate-pulse'>
        {/* Header Skeleton */}
        <div className='flex justify-between items-center'>
          <div className='space-y-2'>
            <div className='h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg'></div>
            <div className='h-3 w-72 bg-gray-200 dark:bg-gray-800 rounded'></div>
          </div>
          <div className='flex items-center gap-2'>
            <div className='h-10 w-36 bg-gray-200 dark:bg-gray-800 rounded-xl'></div>
            <div className='h-10 w-36 bg-gray-200 dark:bg-gray-800 rounded-xl'></div>
          </div>
        </div>

        {/* Printable Receipt Box Skeleton */}
        <div className='bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6'>
          <div className='flex justify-between items-start border-b pb-6 dark:border-gray-800'>
            <div className='space-y-2'>
              <div className='h-6 w-36 bg-gray-200 dark:bg-gray-800 rounded'></div>
              <div className='h-3 w-44 bg-gray-200 dark:bg-gray-800 rounded'></div>
            </div>
            <div className='text-right space-y-2 flex flex-col items-end'>
              <div className='h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded-full'></div>
              <div className='h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded'></div>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className='space-y-2'>
                <div className='h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded'></div>
                <div className='h-5 w-40 bg-gray-200 dark:bg-gray-800 rounded'></div>
              </div>
            ))}
          </div>

          <div className='border-t pt-6 dark:border-gray-800 space-y-4'>
            <div className='flex justify-between'>
              <div className='h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded'></div>
              <div className='h-4 w-36 bg-gray-200 dark:bg-gray-800 rounded'></div>
            </div>
            <div className='flex justify-between items-center py-3 border-t border-gray-100 dark:border-gray-800'>
              <div className='h-4 w-64 bg-gray-200 dark:bg-gray-800 rounded'></div>
              <div className='h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded'></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) return null

  const latestPayment = payments.length > 0 ? payments[0] : null
  const referenceId =
    latestPayment?.reference ||
    latestPayment?.id ||
    `DNS-${Math.floor(100000 + Math.random() * 900000)}`
  const totalAmount = latestPayment?.total_amount
    ? `₦${Number(latestPayment.total_amount).toLocaleString()}`
    : '₦100,000.00'
  const amountPaid = latestPayment?.amount_paid
    ? `₦${Number(latestPayment.amount_paid).toLocaleString()}`
    : '₦20,000.00'
  const dateIssued = latestPayment?.created_at
    ? new Date(latestPayment.created_at).toLocaleDateString()
    : new Date().toLocaleDateString()

  return (
    <div className='p-6 md:p-12 space-y-6 max-w-4xl mx-auto'>
      <div className='flex justify-between items-center print:hidden'>
        <div>
          <h1 className='text-2xl font-bold text-dark dark:text-white flex items-center gap-2'>
            <Receipt className='text-primary-purple' size={24} />
            Payment Receipt
          </h1>
          <p className='text-xs text-gray-500 mt-1'>
            Official electronic record of your admission payment.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <button
            onClick={() => window.print()}
            className='flex items-center gap-2 px-4 py-2.5 bg-gray-200 dark:bg-gray-800 text-dark dark:text-white font-bold text-xs rounded-xl shadow-sm hover:opacity-90 cursor-pointer'
          >
            <Download size={16} /> Print / Save PDF
          </button>
          <button
            onClick={handleDownloadText}
            className='flex items-center gap-2 px-4 py-2.5 bg-primary-purple text-white font-bold text-xs rounded-xl shadow-md hover:opacity-95 cursor-pointer'
          >
            <Download size={16} /> Download Text File
          </button>
        </div>
      </div>

      {/* Printable Receipt Box */}
      <div className='bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6'>
        <div className='flex justify-between items-start border-b pb-6 dark:border-gray-800'>
          <div>
            <h2 className='text-xl font-bold text-primary-purple'>
              Denskill Academy
            </h2>
            <p className='text-xs text-gray-400'>
              Practical Tech Skills Institute
            </p>
          </div>
          <div className='text-right'>
            <span className='px-3 py-1 bg-green-500/10 text-green-600 text-xs font-bold rounded-full inline-flex items-center gap-1'>
              <CheckCircle2 size={14} />{' '}
              {latestPayment?.payment_status
                ? latestPayment.payment_status.toUpperCase()
                : 'PAID & VERIFIED'}
            </span>
            <p className='text-[10px] text-gray-400 mt-1'>
              Ref ID: {referenceId}
            </p>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4 text-xs'>
          <div>
            <p className='text-gray-400'>Student Name</p>
            <p className='font-bold text-dark dark:text-white text-sm mt-0.5'>
              {profile.firstName || ''} {profile.lastName || ''}
            </p>
          </div>
          <div>
            <p className='text-gray-400'>Email Address</p>
            <p className='font-bold text-dark dark:text-white text-sm mt-0.5'>
              {profile.email}
            </p>
          </div>
          <div>
            <p className='text-gray-400'>Enrolled Program</p>
            <p className='font-bold text-dark dark:text-white text-sm mt-0.5'>
              {latestPayment?.course ||
                profile.course ||
                profile.program ||
                'Full-Stack Development'}
            </p>
          </div>
          <div>
            <p className='text-gray-400'>Date Issued</p>
            <p className='font-bold text-dark dark:text-white text-sm mt-0.5'>
              {dateIssued}
            </p>
          </div>
        </div>

        <div className='border-t pt-6 dark:border-gray-800'>
          <table className='w-full text-left text-xs'>
            <thead>
              <tr className='text-gray-400 border-b pb-2 dark:border-gray-800'>
                <th className='pb-2'>Description</th>
                <th className='pb-2 text-right'>Amount Paid / Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className='py-3 text-dark dark:text-white font-medium'>
                  Academy Tuition & Admission Processing
                </td>
                <td className='py-3 text-right font-bold text-dark dark:text-white'>
                  {amountPaid}{' '}
                  <span className='text-gray-400 font-normal'>
                    / {totalAmount}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
