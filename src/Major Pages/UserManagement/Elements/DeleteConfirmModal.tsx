import type React from "react"
import { AlertTriangle, X } from "lucide-react"

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  employeeName: string
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  employeeName,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 transition-colors duration-300"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative bg-white rounded-lg w-full max-w-md mx-4 overflow-hidden shadow-xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="text-red-600" size={20} />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Delete Employee</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-gray-600">
              Are you sure you want to delete <span className="font-semibold text-gray-900">{employeeName}</span>?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This action cannot be undone. The employee will be permanently removed from the system.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              className="flex-1 py-3 border border-gray-300 rounded-md font-medium hover:bg-gray-50 transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="flex-1 py-3 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors"
              onClick={onConfirm}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmationModal
