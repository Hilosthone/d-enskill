// // app/admin/questions/ExcelImportModal.tsx
// 'use client'

// import { useState } from 'react'
// import { X, Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2, Download } from 'lucide-react'
// import { adminApiClient } from '@/services/admin-api'
// import { AlertMessage } from './types'

// interface ExcelImportModalProps {
//   isOpen: boolean
//   onClose: () => void
//   bankId: string | number
//   onSuccess: () => void
//   setAlert: (alert: AlertMessage | null) => void
// }

// export default function ExcelImportModal({ isOpen, onClose, bankId, onSuccess, setAlert }: ExcelImportModalProps) {
//   const [file, setFile] = useState<File | null>(null)
//   const [loading, setLoading] = useState(false)
//   const [validationResult, setValidationResult] = useState<any | null>(null)

//   if (!isOpen) return null

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setFile(e.target.files[0])
//       setValidationResult(null)
//     }
//   }

//   // Helper to parse Excel/CSV (using a lightweight reader or JSON transformation simulation)
//   const handleValidateOrImport = async (importMode: boolean) => {
//     if (!file) return
//     setLoading(true)
//     try {
//       // In a real browser environment, parse CSV or Excel via FileReader / SheetJS if available,
//       // or send raw file / parsed rows to the validation/import endpoints.
//       const reader = new FileReader()
//       reader.onload = async (event) => {
//         try {
//           const text = event.target?.result as string
//           // Simple CSV line parser fallback if CSV format is used
//           const lines = text.split('\n').filter(Boolean)
//           const parsedQuestions = lines.slice(1).map((line) => {
//             const cols = line.split(',')
//             return {
//               questionText: cols[0]?.trim() || '',
//               questionType: cols[1]?.trim() || 'MCQ',
//               marks: Number(cols[2]) || 1,
//               options: [
//                 { text: cols[3]?.trim() || '', isCorrect: true, explanation: cols[4]?.trim() || '' },
//                 { text: cols[5]?.trim() || '', isCorrect: false, explanation: '' },
//               ],
//             }
//           })

//           if (!importMode) {
//             const res = await adminApiClient.validateImportQuestionBank({ questions: parsedQuestions })
//             setValidationResult(res?.data || res)
//             setAlert({ type: 'success', message: 'File validated successfully!' })
//           } else {
//             await adminApiClient.importQuestionsIntoBank(bankId, { questions: parsedQuestions })
//             setAlert({ type: 'success', message: 'Questions imported successfully from file!' })
//             onSuccess()
//             onClose()
//           }
//         } catch (parseErr: any) {
//           setAlert({ type: 'error', message: 'Failed to parse file structure. Ensure CSV format.' })
//         } finally {
//           setLoading(false)
//         }
//       }
//       reader.readAsText(file)
//     } catch (err: any) {
//       setAlert({ type: 'error', message: err?.message || 'Import process failed.' })
//       setLoading(false)
//     }
//   }

//   const downloadTemplate = () => {
//     const csvContent = "data:text/csv;charset=utf-8,QuestionText,QuestionType,Marks,Option1,Explanation1,Option2,Explanation2\n" +
//       "What is React?,MCQ,1,A JavaScript library,Correct,A database,Wrong"
//     const encodedUri = encodeURI(csvContent)
//     const link = document.createElement("a")
//     link.setAttribute("href", encodedUri)
//     link.setAttribute("download", "question_import_template.csv")
//     document.body.appendChild(link)
//     link.click()
//     document.body.removeChild(link)
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
//       <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col">
//         <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
//           <div className="flex items-center gap-2">
//             <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
//             <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Import Questions (Excel / CSV)</h2>
//           </div>
//           <button onClick={onClose} className="rounded-full p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200">
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         <div className="p-6 space-y-4">
//           <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-950/40 p-3.5 rounded-2xl border border-blue-200 dark:border-blue-900">
//             <div className="text-xs text-blue-800 dark:text-blue-300">
//               <p className="font-semibold">Need the formatting layout?</p>
//               <p className="opacity-80">Download our CSV template to ensure successful imports.</p>
//             </div>
//             <button
//               onClick={downloadTemplate}
//               className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm"
//             >
//               <Download className="h-3.5 w-3.5" /> Template
//             </button>
//           </div>

//           <label className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl p-6 cursor-pointer hover:border-blue-500 transition-colors bg-zinc-50 dark:bg-zinc-800/30">
//             <Upload className="h-8 w-8 text-zinc-400 mb-2" />
//             <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
//               {file ? file.name : 'Click to upload or drag & drop'}
//             </span>
//             <span className="text-xs text-zinc-500 mt-1">CSV or XLSX spreadsheet files</span>
//             <input type="file" accept=".csv, .xlsx, .xls" onChange={handleFileChange} className="hidden" />
//           </label>

//           {validationResult && (
//             <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
//               <p className="font-bold flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Validation Successful</p>
//               <p>Ready rows: {validationResult.validCount || 'Verified'}</p>
//             </div>
//           )}
//         </div>

//         <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
//           <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-800">Cancel</button>
//           <button
//             type="button"
//             disabled={!file || loading}
//             onClick={() => handleValidateOrImport(false)}
//             className="px-4 py-2 text-sm font-medium bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl hover:bg-zinc-300 disabled:opacity-50"
//           >
//             {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Validate File'}
//           </button>
//           <button
//             type="button"
//             disabled={!file || loading}
//             onClick={() => handleValidateOrImport(true)}
//             className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-500/25"
//           >
//             {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Import Questions'}
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }


// app/admin/questions/ExcelImportModal.tsx
'use client'

import { useState } from 'react'
import { X, Upload, FileSpreadsheet, CheckCircle2, Loader2, Download, AlertCircle } from 'lucide-react'
import { adminApiClient } from '@/services/admin-api'
import { AlertMessage } from './types'

interface ExcelImportModalProps {
  isOpen: boolean
  onClose: () => void
  bankId: string | number
  onSuccess: () => void
  setAlert: (alert: AlertMessage | null) => void
}

export default function ExcelImportModal({ isOpen, onClose, bankId, onSuccess, setAlert }: ExcelImportModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [validationResult, setValidationResult] = useState<any | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  if (!isOpen) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setValidationResult(null)
      setErrorMsg(null)
    }
  }

  // Safe CSV line parser that handles quotes and commas correctly
  const parseCSVLine = (text: string) => {
    const result: string[] = []
    let current = ''
    let inQuotes = false
    for (let i = 0; i < text.length; i++) {
      const char = text[i]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    result.push(current.trim())
    return result.map((val) => val.replace(/^"|"$/g, ''))
  }

  const handleValidateOrImport = async (importMode: boolean) => {
    if (!file) return
    setLoading(true)
    setErrorMsg(null)

    try {
      const reader = new FileReader()
      reader.onload = async (event) => {
        try {
          const text = event.target?.result as string
          const lines = text.split('\n').filter((l) => l.trim().length > 0)
          
          if (lines.length <= 1) {
            throw new Error('The CSV file appears to be empty or missing question rows.')
          }

          const parsedQuestions = lines.slice(1).map((line) => {
            const cols = parseCSVLine(line)
            return {
              questionText: cols[0] || '',
              questionType: cols[1] || 'MCQ',
              marks: Number(cols[2]) || 1,
              options: [
                { text: cols[3] || '', isCorrect: true, explanation: cols[4] || '' },
                { text: cols[5] || '', isCorrect: false, explanation: cols[6] || '' },
              ].filter((opt) => opt.text !== ''), // Filter out empty optional options
            }
          })

          // Basic client-side validation check
          for (let i = 0; i < parsedQuestions.length; i++) {
            if (!parsedQuestions[i].questionText) {
              throw new Error(`Row ${i + 1}: Question text is missing.`)
            }
            if (parsedQuestions[i].options.length < 2) {
              throw new Error(`Row ${i + 1}: At least 2 options are required per question.`)
            }
          }

          if (!importMode) {
            // Validation step
            if (typeof adminApiClient.validateImportQuestionBank === 'function') {
              const res = await adminApiClient.validateImportQuestionBank({ questions: parsedQuestions })
              setValidationResult(res?.data || res)
            } else {
              setValidationResult({ validCount: parsedQuestions.length })
            }
            setAlert({ type: 'success', message: `${parsedQuestions.length} questions parsed and validated successfully!` })
          } else {
            // Import step sending JSON payload as expected by adminApiClient
            await adminApiClient.importQuestionsIntoBank(bankId, { questions: parsedQuestions })
            setAlert({ type: 'success', message: 'Questions imported successfully from file!' })
            onSuccess()
            onClose()
          }
        } catch (parseErr: any) {
          setErrorMsg(parseErr?.message || 'Failed to parse file structure. Ensure valid CSV format.')
        } finally {
          setLoading(false)
        }
      }
      reader.readAsText(file)
    } catch (err: any) {
      setErrorMsg(err?.message || 'Import process failed.')
      setLoading(false)
    }
  }

  const downloadTemplate = () => {
    const csvContent = 
      "data:text/csv;charset=utf-8,QuestionText,QuestionType,Marks,Option1,Explanation1,Option2,Explanation2\n" +
      "What is React?,MCQ,1,A JavaScript library,Correct,A database,Wrong"
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "question_import_template.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Import Questions (CSV)</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-950/40 p-3.5 rounded-2xl border border-blue-200 dark:border-blue-900">
            <div className="text-xs text-blue-800 dark:text-blue-300">
              <p className="font-semibold">Need the formatting layout?</p>
              <p className="opacity-80">Download our CSV template to ensure successful imports.</p>
            </div>
            <button
              onClick={downloadTemplate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Download className="h-3.5 w-3.5" /> Template
            </button>
          </div>

          <label className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl p-6 cursor-pointer hover:border-blue-500 transition-colors bg-zinc-50 dark:bg-zinc-800/30">
            <Upload className="h-8 w-8 text-zinc-400 mb-2" />
            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              {file ? file.name : 'Click to upload or drag & drop'}
            </span>
            <span className="text-xs text-zinc-500 mt-1">CSV spreadsheet files</span>
            <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
          </label>

          {validationResult && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
              <p className="font-bold flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Validation Successful</p>
              <p>Ready rows: {validationResult.validCount || 'Verified'}</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-800">Cancel</button>
          <button
            type="button"
            disabled={!file || loading}
            onClick={() => handleValidateOrImport(false)}
            className="px-4 py-2 text-sm font-medium bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl hover:bg-zinc-300 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Validate File'}
          </button>
          <button
            type="button"
            disabled={!file || loading}
            onClick={() => handleValidateOrImport(true)}
            className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-500/25"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Import Questions'}
          </button>
        </div>
      </div>
    </div>
  )
}