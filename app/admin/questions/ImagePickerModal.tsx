// app/admin/questions/ImagePickerModal.tsx
'use client'

import { useState } from 'react'
import { X, Image as ImageIcon, Link, Upload, Check, Loader2 } from 'lucide-react'
import { AlertMessage } from './types'

interface ImagePickerModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectImage: (url: string) => void
  setAlert: (alert: AlertMessage | null) => void
}

export default function ImagePickerModal({ isOpen, onClose, onSelectImage, setAlert }: ImagePickerModalProps) {
  const [activeTab, setActiveTab] = useState<'url' | 'upload'>('url')
  const [imageUrlInput, setImageUrlInput] = useState('')
  const [uploading, setUploading] = useState(false)

  if (!isOpen) return null

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!imageUrlInput.trim()) return
    onSelectImage(imageUrlInput.trim())
    setImageUrlInput('')
    onClose()
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setUploading(true)
      // Simulate direct file upload or image bucket storage API link resolution
      setTimeout(() => {
        const mockUrl = URL.createObjectURL(file)
        onSelectImage(mockUrl)
        setUploading(false)
        setAlert({ type: 'success', message: 'Image attached successfully!' })
        onClose()
      }, 1000)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-blue-600" />
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Attach Question Image</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-zinc-400 hover:text-zinc-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-800/50 p-1">
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'url' ? 'bg-white dark:bg-zinc-900 text-blue-600 shadow-sm' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Image URL
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'upload' ? 'bg-white dark:bg-zinc-900 text-blue-600 shadow-sm' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Upload File
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'url' ? (
            <form onSubmit={handleUrlSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Direct Image URL</label>
                <div className="flex items-center gap-2">
                  <Link className="h-4 w-4 text-zinc-400 shrink-0" />
                  <input
                    type="url"
                    required
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="https://example.com/image.png"
                    className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-all shadow-lg shadow-blue-500/25"
              >
                Attach Image URL
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl p-6 cursor-pointer hover:border-blue-500 transition-colors bg-zinc-50 dark:bg-zinc-800/30">
                {uploading ? (
                  <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-2" />
                ) : (
                  <Upload className="h-8 w-8 text-zinc-400 mb-2" />
                )}
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  {uploading ? 'Uploading image...' : 'Click to select image file'}
                </span>
                <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} className="hidden" />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}