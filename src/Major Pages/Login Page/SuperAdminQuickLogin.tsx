import { Shield, Lock, Server } from "lucide-react"
import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useTheme } from "../../functions/ThemeContext"

const SuperAdminQuickLogin: React.FC<{ login: () => void }> = ({ login }) => {
  const navigate = useNavigate()
  const { isDarkMode } = useTheme()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Redirect if already authenticated as super admin
    if (localStorage.getItem("isAuthenticated") === "true" && localStorage.getItem("userType") === "super_admin") {
      navigate("/super-admin/dashboard")
    }
  }, [navigate])

  const handleSuperAdminQuickLogin = async () => {
    setLoading(true)
    setError(null)

    try {
      // Use the new super admin auth endpoint
      const response = await fetch("http://localhost:5000/api/superAdmin/superAdminQuickLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Super admin quick login failed")
      }

      const adminData = await response.json()

      if (adminData.success && adminData.userType === "super_admin") {
        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem("userType", "super_admin")
        localStorage.setItem("adminId", adminData.adminId)
        localStorage.setItem("adminEmail", adminData.adminEmail)
        localStorage.setItem("loginTimestamp", Date.now().toString())

        login()
        navigate("/super-admin/dashboard")
      } else {
        throw new Error("Invalid super admin response")
      }
    } catch (err: any) {
      setError(err.message || "Super admin quick login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-red-900 via-gray-900 to-black font-[Poppins]">
      <div
        className={`w-[500px] h-[600px] ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } rounded-xl shadow-2xl overflow-hidden border-2 border-red-600`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-8 text-center">
          <Shield size={80} className="mx-auto mb-4 text-yellow-300" />
          <h1 className="text-3xl font-bold mb-2">SUPER ADMIN</h1>
          <p className="text-lg opacity-90">System Administration Portal</p>
        </div>

        {/* Content */}
        <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} p-8 flex flex-col justify-center h-full`}>
          <div className="text-center mb-8">
            <Server className="mx-auto mb-4 text-red-600" size={48} />
            <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"} mb-2`}>
              Administrative Access
            </h2>
            <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              Secure access for authorized system administrators only
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-center">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <button
              onClick={handleSuperAdminQuickLogin}
              className="w-full bg-red-600 text-white p-4 rounded-lg font-bold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              disabled={loading}
            >
              <Lock size={20} />
              {loading ? "Authenticating..." : "Access Admin Panel"}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-red-600 text-sm hover:underline flex items-center justify-center gap-2 mx-auto"
              >
                ← Back to Regular Login
              </button>
            </div>
          </div>

          {/* Security Notice */}
          <div className={`mt-8 p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
            <div className="flex items-center gap-2 mb-2">
              <Shield size={16} className="text-yellow-500" />
              <span className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                Security Notice
              </span>
            </div>
            <p className={`text-xs ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              This portal is restricted to authorized personnel only. All access attempts are logged and monitored.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuperAdminQuickLogin
