// 'use client'

// import { useState } from 'react'
// import { Mail, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
// import { adminApiClient } from '@/services/api'

// export default function SendEmailPage() {
//   const [formData, setFormData] = useState({
//     emails: '',
//     subject: '',
//     message: '',
//   })
//   const [loading, setLoading] = useState(false)
//   const [responseMessage, setResponseMessage] = useState<{
//     type: 'success' | 'error'
//     text: string
//   } | null>(null)

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
//   ) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)
//     setResponseMessage(null)

//     try {
//       const res = await adminApiClient.sendCustomEmail(formData)

//       if (res && res.success !== false) {
//         setResponseMessage({
//           type: 'success',
//           text: 'Message successfully sent to user inbox(es)',
//         })
//         setFormData({ emails: '', subject: '', message: '' })
//       } else {
//         setResponseMessage({
//           type: 'error',
//           text: res.message || 'Failed to deliver emails via Resend',
//         })
//       }
//     } catch (error: any) {
//       setResponseMessage({
//         type: 'error',
//         text:
//           error?.message ||
//           'An unexpected error occurred while sending the email.',
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className='max-w-4xl mx-auto p-6'>
//       {/* Page Header */}
//       <div className='flex items-center gap-3 mb-8'>
//         <div className='p-3 rounded-xl bg-primary-red/10 text-primary-red'>
//           <Mail size={28} />
//         </div>
//         <div>
//           <h1 className='text-2xl font-bold text-dark dark:text-white'>
//             Broadcast Custom Email
//           </h1>
//           <p className='text-sm text-gray-500 dark:text-gray-400'>
//             Send direct email messages to one or multiple users instantly.
//           </p>
//         </div>
//       </div>

//       {/* Status Alert Banner */}
//       {responseMessage && (
//         <div
//           className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium border ${
//             responseMessage.type === 'success'
//               ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
//               : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
//           }`}
//         >
//           {responseMessage.type === 'success' ? (
//             <CheckCircle2 size={20} />
//           ) : (
//             <AlertCircle size={20} />
//           )}
//           <span>{responseMessage.text}</span>
//         </div>
//       )}

//       {/* Email Form Card */}
//       <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl rounded-2xl p-6 md:p-8'>
//         <form onSubmit={handleSubmit} className='space-y-6'>
//           {/* Recipients Input */}
//           <div>
//             <label className='block text-sm font-semibold text-dark dark:text-gray-200 mb-2'>
//               Recipient Email(s)
//             </label>
//             <input
//               type='text'
//               name='emails'
//               value={formData.emails}
//               onChange={handleChange}
//               required
//               placeholder='student1@gmail.com, student2@gmail.com'
//               className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-red transition'
//             />
//             <p className='text-xs text-gray-400 mt-1.5'>
//               Separate multiple email addresses with commas.
//             </p>
//           </div>

//           {/* Subject Input */}
//           <div>
//             <label className='block text-sm font-semibold text-dark dark:text-gray-200 mb-2'>
//               Subject
//             </label>
//             <input
//               type='text'
//               name='subject'
//               value={formData.subject}
//               onChange={handleChange}
//               required
//               placeholder='Important Update Regarding Your Portal Access'
//               className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-red transition'
//             />
//           </div>

//           {/* Message Body Input */}
//           <div>
//             <label className='block text-sm font-semibold text-dark dark:text-gray-200 mb-2'>
//               Message Body
//             </label>
//             <textarea
//               name='message'
//               value={formData.message}
//               onChange={handleChange}
//               required
//               rows={6}
//               placeholder='Hello, please check your dashboard for recent updates.'
//               className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-red transition resize-y'
//             />
//           </div>

//           {/* Submit Button */}
//           <div className='flex justify-end pt-2'>
//             <button
//               type='submit'
//               disabled={loading}
//               className='bg-primary-red text-white text-sm font-semibold px-8 py-3 rounded-xl hover:bg-red-700 transition flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md'
//             >
//               {loading ? (
//                 <>
//                   <Loader2 size={18} className='animate-spin' />
//                   Sending...
//                 </>
//               ) : (
//                 <>
//                   <Send size={16} />
//                   Send Email
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

'use client'

import { useState } from 'react'
import {
  Mail,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Check,
  Code,
  Sparkles,
  Paperclip,
  FileText,
  FileSpreadsheet,
  File,
  Trash2,
  UploadCloud,
} from 'lucide-react'
import { adminApiClient } from '@/services/admin-api'

interface AttachmentFile {
  name: string
  size: string
  type: string
  content: string // Base64 encoded string for backend transmission
}

export default function SendEmailPage() {
  const [formData, setFormData] = useState({
    emails: '',
    subject: '',
    message: '',
    html: '',
    cc: '',
    bcc: '',
  })

  // Attachments state (Gmail-style chips)
  const [attachments, setAttachments] = useState<AttachmentFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)

  // Modal alert state management
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean
    type: 'success' | 'error'
    title: string
    message: string
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  })

  const showAlert = (
    type: 'success' | 'error',
    title: string,
    message: string,
  ) => {
    setModalConfig({ isOpen: true, type, title, message })
  }

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }))
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle file uploads (PDFs, docs, images, etc.) converting them to Base64
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      const newFiles: AttachmentFile[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Convert file to Base64 string for API payload compliance
        const base64Content = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = () => {
            const result = reader.result as string
            // Strip out the data url prefix (e.g. "data:application/pdf;base64,") if your API expects pure base64
            // Keeping base64 clean or full depends on backend, here we pass the raw base64 payload after comma:
            const base64String = result.split(',')[1] || result
            resolve(base64String)
          }
          reader.onerror = (error) => reject(error)
        })

        // Format file size nicely (e.g., 2.4 MB)
        const sizeFormatted =
          file.size > 1024 * 1024
            ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
            : `${(file.size / 1024).toFixed(1)} KB`

        newFiles.push({
          name: file.name,
          size: sizeFormatted,
          type: file.type || 'application/octet-stream',
          content: base64Content,
        })
      }

      setAttachments((prev) => [...prev, ...newFiles])
    } catch (error) {
      showAlert('error', 'Upload Error', 'Failed to process attachment files.')
    } finally {
      setUploading(false)
      // Reset input value so same file can be re-selected if removed
      e.target.value = ''
    }
  }

  // Remove attachment chip
  const removeAttachment = (indexToRemove: number) => {
    setAttachments((prev) => prev.filter((_, idx) => idx !== indexToRemove))
  }

  // Helper icon for attachment types
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf'))
      return <FileText size={18} className='text-red-500' />
    if (
      fileType.includes('sheet') ||
      fileType.includes('excel') ||
      fileType.includes('csv')
    )
      return <FileSpreadsheet size={18} className='text-emerald-500' />
    return <File size={18} className='text-blue-500' />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload: any = {
        emails: formData.emails,
        subject: formData.subject,
        message: formData.message,
      }

      if (formData.html.trim()) payload.html = formData.html
      if (formData.cc.trim()) payload.cc = formData.cc
      if (formData.bcc.trim()) payload.bcc = formData.bcc

      // Attach attachments formatted as expected: [{ filename, content }]
      if (attachments.length > 0) {
        payload.attachments = attachments.map((att) => ({
          filename: att.name,
          content: att.content,
        }))
      }

      const res = await adminApiClient.sendCustomEmail(payload)

      if (res && res.success !== false) {
        showAlert(
          'success',
          'Email Sent Successfully',
          'Message and attachments successfully sent to user inbox(es)!',
        )
        setFormData({
          emails: '',
          subject: '',
          message: '',
          html: '',
          cc: '',
          bcc: '',
        })
        setAttachments([])
      } else {
        showAlert(
          'error',
          'Delivery Failed',
          res?.message ||
            'Failed to deliver emails via Resend or internal server error.',
        )
      }
    } catch (error: any) {
      showAlert(
        'error',
        'Connection Error',
        error?.message ||
          'An unexpected error occurred while sending the email.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='max-w-4xl mx-auto p-6 animate-fadeIn relative'>
      {/* Background Decorative Glow */}
      <div className='absolute -top-10 -right-10 w-72 h-72 bg-primary-red/10 rounded-full blur-3xl pointer-events-none' />

      {/* Page Header */}
      <div className='flex items-center gap-3 mb-8'>
        <div className='p-3 rounded-xl bg-primary-red/10 text-primary-red animate-bounce'>
          <Mail size={28} />
        </div>
        <div>
          <h1 className='text-2xl font-bold text-dark dark:text-white'>
            Broadcast Custom Email
          </h1>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Send direct email messages with PDFs, documents, HTML, CC, and BCC
            support.
          </p>
        </div>
      </div>

      {/* Email Form Card */}
      <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl rounded-3xl p-6 md:p-8 relative overflow-hidden'>
        <div className='absolute top-0 right-0 p-8 opacity-5 pointer-events-none'>
          <Sparkles size={120} className='text-primary-red' />
        </div>

        <form onSubmit={handleSubmit} className='space-y-6 relative z-10'>
          {/* Recipients Input */}
          <div>
            <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider'>
              Recipient Email(s)
            </label>
            <input
              type='text'
              name='emails'
              value={formData.emails}
              onChange={handleChange}
              required
              placeholder='student1@gmail.com, student2@gmail.com'
              className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-dark dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-red transition'
            />
            <p className='text-xs text-gray-400 mt-1.5'>
              Separate multiple email addresses with commas.
            </p>
          </div>

          {/* CC and BCC Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider'>
                CC (Optional)
              </label>
              <input
                type='text'
                name='cc'
                value={formData.cc}
                onChange={handleChange}
                placeholder='supervisor@denskill.com'
                className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-dark dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-red transition'
              />
            </div>

            <div>
              <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider'>
                BCC (Optional)
              </label>
              <input
                type='text'
                name='bcc'
                value={formData.bcc}
                onChange={handleChange}
                placeholder='audit@denskill.com'
                className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-dark dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-red transition'
              />
            </div>
          </div>

          {/* Subject Input */}
          <div>
            <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider'>
              Subject
            </label>
            <input
              type='text'
              name='subject'
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder='Important Update Regarding Your Portal Access'
              className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-dark dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-red transition'
            />
          </div>

          {/* Message Body Input */}
          <div>
            <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider'>
              Plain Text Message Content
            </label>
            <textarea
              name='message'
              value={formData.message}
              onChange={handleChange}
              required
              rows={4}
              placeholder='Hello, please check your dashboard for recent updates.'
              className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-dark dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-red transition resize-y'
            />
          </div>

          {/* Custom HTML Body Input */}
          <div>
            <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider flex items-center gap-1.5'>
              <Code size={14} className='text-primary-red' />
              Custom HTML Body (Optional)
            </label>
            <textarea
              name='html'
              value={formData.html}
              onChange={handleChange}
              rows={3}
              placeholder='<p>Hello, check your <a href="https://denskill.com">dashboard</a>.</p>'
              className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-dark dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary-red transition resize-y'
            />
          </div>

          {/* Gmail-Style File Attachments Section */}
          <div className='space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800'>
            <div className='flex items-center justify-between'>
              <label className='text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5'>
                <Paperclip size={14} className='text-primary-red' />
                Attachments (PDFs, Docs, Images)
              </label>

              {/* Hidden file input triggered by custom styled button */}
              <label className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-xs font-medium text-dark dark:text-white cursor-pointer transition'>
                {uploading ? (
                  <Loader2 size={14} className='animate-spin' />
                ) : (
                  <UploadCloud size={14} />
                )}
                <span>Attach Files</span>
                <input
                  type='file'
                  multiple
                  accept='.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.txt,.zip'
                  onChange={handleFileChange}
                  className='hidden'
                />
              </label>
            </div>

            {/* Attached Files Chips Grid (Gmail Style) */}
            {attachments.length > 0 ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1'>
                {attachments.map((file, idx) => (
                  <div
                    key={idx}
                    className='flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 group hover:border-primary-red/50 transition'
                  >
                    <div className='flex items-center gap-2.5 min-w-0'>
                      <div className='p-2 rounded-lg bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800'>
                        {getFileIcon(file.type)}
                      </div>
                      <div className='min-w-0'>
                        <p className='text-xs font-bold text-dark dark:text-white truncate'>
                          {file.name}
                        </p>
                        <p className='text-[10px] text-gray-400'>{file.size}</p>
                      </div>
                    </div>

                    <button
                      type='button'
                      onClick={() => removeAttachment(idx)}
                      className='text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer'
                      title='Remove attachment'
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-xs text-gray-400 italic'>
                No attachments added yet. Click &quot;Attach Files&quot; to
                upload PDFs or documents.
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className='flex justify-end pt-4'>
            <button
              type='submit'
              disabled={loading}
              className='w-full bg-primary-red text-white text-sm font-bold py-3.5 rounded-xl hover:bg-red-700 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-red/25'
            >
              {loading ? (
                <>
                  <Loader2 size={18} className='animate-spin' />
                  <span>Dispatching Email...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Send Custom Email</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Fully Animated Custom Modal Alert */}
      {modalConfig.isOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn'>
          <div className='bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-800 space-y-6 transform animate-scaleUp text-center relative overflow-hidden'>
            {/* Top decorative indicator bar */}
            <div
              className={`absolute top-0 left-0 right-0 h-1.5 ${
                modalConfig.type === 'success' ? 'bg-green-500' : 'bg-red-500'
              }`}
            />

            <div className='flex justify-end absolute right-4 top-4'>
              <button
                onClick={closeModal}
                className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer'
              >
                <X size={18} />
              </button>
            </div>

            <div className='flex flex-col items-center space-y-3 pt-2'>
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                  modalConfig.type === 'success'
                    ? 'bg-green-500/15 text-green-600 shadow-green-500/10 animate-bounce'
                    : 'bg-red-500/15 text-red-600 shadow-red-500/10 animate-shake'
                }`}
              >
                {modalConfig.type === 'success' ? (
                  <CheckCircle2 size={36} />
                ) : (
                  <AlertCircle size={36} />
                )}
              </div>

              <div className='space-y-1'>
                <h3 className='text-xl font-extrabold text-dark dark:text-white'>
                  {modalConfig.title}
                </h3>
                <p className='text-xs text-gray-500 dark:text-gray-400 leading-relaxed px-4'>
                  {modalConfig.message}
                </p>
              </div>
            </div>

            <button
              type='button'
              onClick={closeModal}
              className={`w-full py-3.5 rounded-xl text-white font-bold text-xs shadow-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                modalConfig.type === 'success'
                  ? 'bg-green-600 hover:bg-green-700 shadow-green-600/25'
                  : 'bg-primary-red hover:bg-red-700 shadow-primary-red/25'
              }`}
            >
              <Check size={16} /> Got It
            </button>
          </div>
        </div>
      )}
    </div>
  )
}