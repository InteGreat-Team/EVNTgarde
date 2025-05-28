import type React from "react"
import { useState, useEffect } from "react"
import { Users, Calendar, Shield, CheckCircle, XCircle, Search, Filter, UserCheck, UserX, LogOut } from 'lucide-react'
import { useNavigate } from "react-router-dom"

interface VerificationRequest {
  verification_id: string
  user_id: string
  user_type: string
  documents_submitted: string
  status: string
  admin_notes: string
  reviewed_by: string
  reviewed_at: string
  email: string
  name: string
}

interface CancellationRequest {
  cancellation_id: string
  event_id: string
  requested_by: string
  reason: string
  status: string
  refund_amount: number
  penalty_amount: number
  admin_notes: string
  event_name: string
  start_date: string
  end_date: string
  customer_email: string
  organizer_email: string
}

const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<"users" | "events">("users")
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([])
  const [cancellationRequests, setCancellationRequests] = useState<CancellationRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  useEffect(() => {
    // Check if user is still authenticated as super admin
    const userType = localStorage.getItem("userType")
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    
    if (!isAuthenticated || userType !== "super_admin") {
      navigate("/login")
      return
    }

    fetchVerificationRequests()
    fetchCancellationRequests()
  }, [navigate])

  const handleLogout = () => {
    try {
      // Clear all localStorage items
      localStorage.removeItem("isAuthenticated")
      localStorage.removeItem("userType")
      localStorage.removeItem("adminId")
      localStorage.removeItem("adminEmail")
      localStorage.removeItem("loginTimestamp")
      localStorage.removeItem("userId")
      localStorage.removeItem("vendorType")
      
      // Clear any other potential auth-related items
      localStorage.clear()
      
      console.log("Logout successful, redirecting to login...")
      
      // Force a page reload to ensure clean state
      window.location.href = "/login"
    } catch (error) {
      console.error("Error during logout:", error)
      // Fallback: force navigation
      window.location.href = "/login"
    }
  }

  const fetchVerificationRequests = async () => {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:5000/api/superAdmin/verification-requests", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminId")}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setVerificationRequests(data.requests)
      }
    } catch (error) {
      console.error("Error fetching verification requests:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCancellationRequests = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/superAdmin/cancellation-requests", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminId")}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setCancellationRequests(data.requests)
      }
    } catch (error) {
      console.error("Error fetching cancellation requests:", error)
    }
  }

  const handleVerificationAction = async (
    verificationId: string,
    action: "approve" | "reject",
    adminNotes?: string,
  ) => {
    try {
      const response = await fetch(`http://localhost:5000/api/superAdmin/handle-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminId")}`,
        },
        body: JSON.stringify({ verificationId, action, adminNotes }),
      })

      const data = await response.json()
      if (data.success) {
        // Update local state
        setVerificationRequests(
          verificationRequests.map((req) =>
            req.verification_id === verificationId
              ? { ...req, status: action === "approve" ? "approved" : "rejected" }
              : req,
          ),
        )
      }
    } catch (error) {
      console.error("Error handling verification:", error)
    }
  }

  const handleCancellationAction = async (
    cancellationId: string,
    action: "approve" | "reject",
    adminNotes?: string,
    refundAmount?: number,
    penaltyAmount?: number,
  ) => {
    try {
      const response = await fetch(`http://localhost:5000/api/superAdmin/handle-cancellation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminId")}`,
        },
        body: JSON.stringify({ cancellationId, action, adminNotes, refundAmount, penaltyAmount }),
      })

      const data = await response.json()
      if (data.success) {
        // Remove from pending list
        setCancellationRequests(cancellationRequests.filter((req) => req.cancellation_id !== cancellationId))
      }
    } catch (error) {
      console.error("Error handling cancellation:", error)
    }
  }

  const filteredVerificationRequests = verificationRequests.filter((req) => {
    const matchesSearch =
      req.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.name?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterStatus === "all" || req.status === filterStatus

    return matchesSearch && matchesFilter
  })

  const filteredCancellationRequests = cancellationRequests.filter(
    (req) =>
      req.event_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-red-600 text-white p-6 shadow-lg">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center">
            <Shield size={32} className="mr-3" />
            <div>
              <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
              <p className="text-red-100">System Administration Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-red-100">Logged in as</p>
              <p className="font-medium">{localStorage.getItem("adminEmail") || "admin@evntgarde.com"}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
              title="Logout from Super Admin"
            >
              <LogOut size={16} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("users")}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === "users"
                  ? "border-red-500 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Users className="inline mr-2" size={16} />
              User Management
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === "events"
                  ? "border-red-500 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Calendar className="inline mr-2" size={16} />
              Event Cancellations
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={activeTab === "users" ? "Search users..." : "Search events..."}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {activeTab === "users" && (
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          )}
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">User Verification</h2>
              <p className="text-sm text-gray-500">Approve or reject user registrations</p>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                <p className="mt-2 text-gray-500">Loading verification requests...</p>
              </div>
            ) : filteredVerificationRequests.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Users size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No verification requests found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Documents
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredVerificationRequests.map((request) => (
                      <tr key={request.verification_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{request.name || "N/A"}</div>
                            <div className="text-sm text-gray-500">{request.email || "N/A"}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {request.user_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              request.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : request.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.documents_submitted || "No documents"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {request.status === "pending" && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleVerificationAction(request.verification_id, "approve")}
                                className="text-green-600 hover:text-green-900 flex items-center"
                              >
                                <UserCheck size={16} className="mr-1" />
                                Approve
                              </button>
                              <button
                                onClick={() => handleVerificationAction(request.verification_id, "reject")}
                                className="text-red-600 hover:text-red-900 flex items-center"
                              >
                                <UserX size={16} className="mr-1" />
                                Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Events Tab */}
        {activeTab === "events" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Event Cancellation Requests</h2>
              <p className="text-sm text-gray-500">Review and approve event cancellation requests</p>
            </div>

            {filteredCancellationRequests.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No cancellation requests found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Event
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reason
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCancellationRequests.map((request) => (
                      <tr key={request.cancellation_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{request.event_name}</div>
                          <div className="text-sm text-gray-500">ID: {request.event_id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.customer_email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(request.start_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {request.reason || "No reason provided"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleCancellationAction(request.cancellation_id, "approve")}
                              className="text-green-600 hover:text-green-900 flex items-center"
                            >
                              <CheckCircle size={16} className="mr-1" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleCancellationAction(request.cancellation_id, "reject")}
                              className="text-red-600 hover:text-red-900 flex items-center"
                            >
                              <XCircle size={16} className="mr-1" />
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SuperAdminDashboard
