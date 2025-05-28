import type React from "react"
import { useState, useRef } from "react"
import { UploadCloud, X } from "lucide-react"

interface UploadEmployeeModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (employees: ParsedEmployee[]) => void
}

interface ParsedEmployee {
  name: string
  gender: string
  sms: string
  email: string
  role: string
}

const UploadEmployeeModal: React.FC<UploadEmployeeModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [parsedData, setParsedData] = useState<ParsedEmployee[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const itemsPerPage = 5
  const totalPages = Math.ceil(parsedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = parsedData.slice(startIndex, endIndex)

  if (!isOpen) return null

  const parseCSV = (csvText: string): ParsedEmployee[] => {
    const lines = csvText.trim().split("\n")

    const employees: ParsedEmployee[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim())
      if (values.length >= 5) {
        employees.push({
          name: values[0],
          gender: values[1],
          sms: values[2],
          email: values[3],
          role: values[4],
        })
      }
    }

    return employees
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        const text = await file.text()
        const parsed = parseCSV(text)
        setParsedData(parsed)
        setShowPreview(true)
        setCurrentPage(1)
      }
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]

      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        const text = await file.text()
        const parsed = parseCSV(text)
        setParsedData(parsed)
        setShowPreview(true)
        setCurrentPage(1)
      }
    }
  }

  const handleUpload = () => {
    if (parsedData.length > 0) {
      onUpload(parsedData)
      resetModal()
      onClose()
    }
  }

  const handleUploadNewFile = () => {
    setShowPreview(false)
    setParsedData([])
    setCurrentPage(1)
  }

  const resetModal = () => {
    setParsedData([])
    setShowPreview(false)
    setCurrentPage(1)
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  const renderPagination = () => {
    const pages = []
    const maxVisiblePages = 5

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return (
      <div className="flex items-center justify-center">
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {pages.map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                currentPage === page ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                ...
              </span>
              <button
                onClick={() => setCurrentPage(totalPages)}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </nav>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 transition-colors duration-300"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        onClick={handleClose}
      />

      {/* Modal content */}
      <div className="relative bg-white rounded-lg w-full max-w-4xl mx-4 overflow-hidden shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-[#3061AD]">
              {showPreview ? "Upload Employee List Preview" : "Upload Employee List"}
            </h2>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={24} />
            </button>
          </div>

          {!showPreview ? (
            <>
              <div
                className={`border-2 border-dashed rounded-lg p-8 mb-6 text-center transition-colors ${
                  isDragging ? "border-[#3061AD] bg-[#eaf1fa]" : "border-gray-300"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center">
                  <UploadCloud size={40} className="text-gray-400 mb-3" />
                  <h3 className="text-lg font-semibold uppercase mb-2">Upload CSV File</h3>
                  <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
                    The uploaded CSV should follow this column format:
                    <span className="block mt-1 font-medium">Name, Gender, SMS, Email, Role</span>
                  </p>

                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".csv" className="hidden" />
                  <button
                    className="bg-[#3061AD] text-white px-6 py-2 rounded-md hover:bg-[#204170] transition-colors"
                    onClick={handleBrowseClick}
                  >
                    Browse Files
                  </button>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  className="flex-1 py-3 border border-gray-300 rounded-md font-medium hover:bg-gray-50 transition-colors"
                  onClick={handleClose}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Gender
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          SMS
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentData.map((employee, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {employee.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.gender}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.sms}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.role}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-white px-4 py-3 flex items-center justify-center border-t border-gray-200 sm:px-6 mt-4">
                  {totalPages > 1 && renderPagination()}
                </div>
              </div>

              <div className="flex justify-center mb-6">
                <button
                  className="bg-[#3061AD] text-white px-6 py-2 rounded-md hover:bg-[#204170] transition-colors"
                  onClick={handleUploadNewFile}
                >
                  Upload New File
                </button>
              </div>

              <div className="flex space-x-3">
                <button
                  className="flex-1 py-3 border border-gray-300 rounded-md font-medium hover:bg-gray-50 transition-colors"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 py-3 bg-[#3061AD] text-white rounded-md font-medium hover:bg-[#204170] transition-colors"
                  onClick={handleUpload}
                >
                  Upload
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default UploadEmployeeModal
