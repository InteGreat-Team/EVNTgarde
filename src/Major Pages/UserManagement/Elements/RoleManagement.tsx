import type React from "react"
import { Check, XIcon } from "lucide-react"

const RoleManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Superadmin Role */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-purple-600 text-xl font-semibold">S</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Superadmin</h3>
            <p className="text-gray-600">Complete system access and control</p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium mb-3">Permissions:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <Check className="text-green-500" size={18} />
              <span>Full System Access</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="text-green-500" size={18} />
              <span>Manage All Users</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="text-green-500" size={18} />
              <span>Manage All Events</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="text-green-500" size={18} />
              <span>Manage All Bookings</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="text-green-500" size={18} />
              <span>Manage All RSVPs</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="text-green-500" size={18} />
              <span>System Configuration</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="text-green-500" size={18} />
              <span>Access All Reports</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="text-green-500" size={18} />
              <span>Manage Roles & Permissions</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 text-xl font-semibold">M</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Manager</h3>
            <p className="text-gray-600">Full access to features and user management</p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium mb-3">Permissions:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <Check className="text-green-500" size={18} />
              <span>View Events</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="text-green-500" size={18} />
              <span>Create Events</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="text-green-500" size={18} />
              <span>Edit Events</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="text-green-500" size={18} />
              <span>Delete Events</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="text-green-500" size={18} />
              <span>Access to User Management</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="text-green-500" size={18} />
              <span>Access Reports</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <span className="text-orange-600 text-xl font-semibold">S</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Staff</h3>
            <p className="text-gray-600">Can manage events</p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium mb-3">Permissions:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <Check className="text-green-500" size={18} />
              <span>View Events</span>
            </div>
            <div className="flex items-center space-x-2">
              <XIcon className="text-red-500" size={18} />
              <span className="text-gray-500">Create Events</span>
            </div>
            <div className="flex items-center space-x-2">
              <XIcon className="text-red-500" size={18} />
              <span className="text-gray-500">Edit Events</span>
            </div>
            <div className="flex items-center space-x-2">
              <XIcon className="text-red-500" size={18} />
              <span className="text-gray-500">Delete Events</span>
            </div>
            <div className="flex items-center space-x-2">
              <XIcon className="text-red-500" size={18} />
              <span className="text-gray-500">Access to User Management</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="text-green-500" size={18} />
              <span>Access Reports</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoleManagement
