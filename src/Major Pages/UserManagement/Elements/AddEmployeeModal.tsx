import type React from "react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface AddEmployeeModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (employee: {
    name: string
    gender: string
    sms: string
    email: string
    role: string
    status: string
  }) => void
  isEditMode?: boolean
  initialData?: {
    name: string
    gender: string
    sms: string
    email: string
    role: string
    status: string
  }
  title?: string
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  isEditMode = false,
  initialData,
  title = "Add Employee",
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    gender: initialData?.gender || "",
    sms: initialData?.sms || "",
    email: initialData?.email || "",
    role: initialData?.role || "",
    status: initialData?.status || "",
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        gender: initialData.gender,
        sms: initialData.sms,
        email: initialData.email,
        role: initialData.role,
        status: initialData.status,
      })
    }
  }, [initialData])

  if (!isOpen) return null

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = () => {
    // Basic validation
    if (!formData.name || !formData.gender || !formData.sms || !formData.email || !formData.role || !formData.status) {
      alert("Please fill in all fields")
      return
    }

    onAdd(formData)

    // Reset form
    setFormData({
      name: "",
      gender: "",
      sms: "",
      email: "",
      role: "",
      status: "",
    })

    onClose()
  }

  const handleCancel = () => {
    // Reset form
    setFormData({
      name: "",
      gender: "",
      sms: "",
      email: "",
      role: "",
      status: "",
    })
    onClose()
  }

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
            <h2 className="text-2xl font-semibold text-[#3061AD]">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                placeholder="Enter Name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3061AD] focus:border-transparent"
              />
            </div>

            {/* Gender Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <div className="flex space-x-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={formData.gender === "Male"}
                    onChange={(e) => handleInputChange("gender", e.target.value)}
                    className="mr-2 text-[#3061AD] focus:ring-[#3061AD]"
                  />
                  <span className="text-sm text-gray-700">Male</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={formData.gender === "Female"}
                    onChange={(e) => handleInputChange("gender", e.target.value)}
                    className="mr-2 text-[#3061AD] focus:ring-[#3061AD]"
                  />
                  <span className="text-sm text-gray-700">Female</span>
                </label>
              </div>
            </div>

            {/* SMS Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SMS</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md">
                  +63
                </span>
                <input
                  type="tel"
                  placeholder="000 0000 000"
                  value={formData.sms}
                  onChange={(e) => handleInputChange("sms", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-[#3061AD] focus:border-transparent"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3061AD] focus:border-transparent"
              />
            </div>

            {/* Role Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <div className="flex space-x-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="Superadmin"
                    checked={formData.role === "Superadmin"}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                    className="mr-2 text-[#3061AD] focus:ring-[#3061AD]"
                  />
                  <span className="text-sm text-gray-700">Superadmin</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="Manager"
                    checked={formData.role === "Manager"}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                    className="mr-2 text-[#3061AD] focus:ring-[#3061AD]"
                  />
                  <span className="text-sm text-gray-700">Manager</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="Staff"
                    checked={formData.role === "Staff"}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                    className="mr-2 text-[#3061AD] focus:ring-[#3061AD]"
                  />
                  <span className="text-sm text-gray-700">Staff</span>
                </label>
              </div>
            </div>

            {/* Status Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className="flex space-x-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="active"
                    checked={formData.status === "active"}
                    onChange={(e) => handleInputChange("status", e.target.value)}
                    className="mr-2 text-[#3061AD] focus:ring-[#3061AD]"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="inactive"
                    checked={formData.status === "inactive"}
                    onChange={(e) => handleInputChange("status", e.target.value)}
                    className="mr-2 text-[#3061AD] focus:ring-[#3061AD]"
                  />
                  <span className="text-sm text-gray-700">Inactive</span>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-6">
            <button
              className="flex-1 py-3 border border-gray-300 rounded-md font-medium hover:bg-gray-50 transition-colors"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="flex-1 py-3 bg-[#3061AD] text-white rounded-md font-medium hover:bg-[#204170] transition-colors"
              onClick={handleSubmit}
            >
              {isEditMode ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddEmployeeModal
