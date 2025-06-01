import { Eye, EyeOff } from "lucide-react"
import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { auth, signInWithEmailAndPassword } from "../../functions/firebase"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../../functions/firebase"
import { checkSessionExpiry } from "@/functions/authFunctions"
import { useTheme } from "../../functions/ThemeContext"
import { signInWithGoogle, signInWithYahoo } from "../../functions/authFunctions"
import { FcGoogle } from "react-icons/fc"
import { AiFillYahoo } from "react-icons/ai"
import AuthLayout from "../Dashboards/Registered/Elements/AuthLayout"
import { createSuperadminAccount } from "../../functions/authFunctions"

const LoginPage: React.FC<{ login: () => void }> = ({ login }) => {
  const navigate = useNavigate()
  const { isDarkMode } = useTheme()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [failedAttempts, setFailedAttempts] = useState(0)

  useEffect(() => {
    const sessionExpired = checkSessionExpiry()
    if (sessionExpired) {
      navigate("/login") // Redirect user if session expired
    }

    // Create superadmin account if it doesn't exist
    const createSuperadmin = async () => {
      try {
        await createSuperadminAccount();
      } catch (error) {
        console.error("Error creating superadmin account:", error);
      }
    };
    createSuperadmin();
  }, [navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const userId = userCredential.user.uid

      // Retrieve user data from Firestore
      const userDoc = await getDoc(doc(db, "users", userId))
      if (!userDoc.exists()) {
        throw new Error("User data not found.")
      }

      const userType = userDoc.data().userType
      let vendorType
      if (userType === "vendor") {
        vendorType = userDoc.data().vendorType
      }

      // Store authentication status and userType
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("userType", userType)
      localStorage.setItem("vendorType", vendorType)

      if (rememberMe) {
        localStorage.setItem("loginTimestamp", Date.now().toString())
      }

      login()

      // Redirect user based on userType
      switch (userType) {
        case "customer":
          navigate("/customer")
          break
        case "organizer":
          navigate("/organizer")
          break
        case "vendor":
          navigate("/vendor")
          break
        case "superadmin":
          navigate("/admin/dashboard")
          break
        default:
          throw new Error("Invalid user type.")
      }
    } catch (err: any) {
      const newFailedAttempts = failedAttempts + 1
      setFailedAttempts(newFailedAttempts)
      // 3 failed attempts, generic message
      if (newFailedAttempts >= 3) {
        setError("Login failed. Please check your credentials and try again.")
      } else {
        if (err.code === "auth/user-not-found") {
          setError("No account found with this email")
        } else if (err.code === "auth/wrong-password") {
          setError("Incorrect password")
        } else {
          setError("Invalid Email/Invalid Password")
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      await signInWithGoogle("individual") // Default to individual, will be updated from Firestore
      login()
      // Redirect will happen based on userType in Firestore
    } catch (err: any) {
      setError("Failed to sign in with Google. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleYahooLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      await signInWithYahoo("individual") // Default to individual, will be updated from Firestore
      login()
      // Redirect will happen based on userType in Firestore
    } catch (err: any) {
      setError("Failed to sign in with Yahoo. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Discover tailored events services."
      subtitle="Log in now to unlock your personalized experience!"
    >
      <h2 className={`text-4xl font-bold ${isDarkMode ? "text-white" : "text-blue-600"} mb-4`}>Log In</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form className="flex flex-col space-y-4" onSubmit={handleLogin}>
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg border shadow-md w-full ${
              isDarkMode
                ? "bg-black border-gray-600 text-white hover:bg-gray-700"
                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-100"
            }`}
            disabled={loading}
          >
            <FcGoogle size={20} />
            <span className="font-medium">Log in with Google</span>
          </button>

          <button
            type="button"
            onClick={handleYahooLogin}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg border shadow-md w-full ${
              isDarkMode
                ? "bg-black border-gray-600 text-white hover:bg-gray-900"
                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-100"
            }`}
            disabled={loading}
          >
            <AiFillYahoo size={20} className="text-purple-600" />
            <span className="font-medium">Log in with Yahoo</span>
          </button>
        </div>

        <div className="relative flex items-center py-2">
          <div className={`flex-grow border-t ${isDarkMode ? "border-gray-600" : "border-gray-300"}`} />
          <span className={`flex-shrink mx-4 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>OR</span>
          <div className={`flex-grow border-t ${isDarkMode ? "border-gray-600" : "border-gray-300"}`} />
        </div>

        <label className={`text-sm ${isDarkMode ? "text-white" : "text-gray-700"}`}>Enter your email*</label>
        <input
          type="email"
          placeholder="Email"
          className={`border p-3 rounded-md ${
            isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
          }`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className={`text-sm ${isDarkMode ? "text-white" : "text-gray-700"}`}>Enter your password*</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={`border p-3 w-full rounded-md ${
              isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
            }`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="flex justify-between items-center text-sm">
          <a href="#" className="text-blue-600 hover:underline">
            Forgot password?
          </a>
        </div>

        <label className={`flex items-center space-x-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
          <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
          <span>Keep me logged in</span>
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white p-3 rounded-full font-bold hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        <div className={`text-center text-sm ${isDarkMode ? "text-white" : "text-gray-700"}`}>
          Don't have an account?{" "}
          <a
            href="#"
            className="text-blue-600 hover:underline"
            onClick={(e) => {
              e.preventDefault()
              navigate("/role-selection")
            }}
          >
            Sign up
          </a>
        </div>
      </form>
    </AuthLayout>
  )
}

export default LoginPage;
