import type React from "react"
import Logo from "../../../assets/OrganizerLogo.png"

interface RegistrationLayoutProps {
  children: React.ReactNode
  isDarkMode: boolean
}

const RegistrationLayout: React.FC<RegistrationLayoutProps> = ({ children, isDarkMode }) => {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-300 font-[Poppins] p-4">
      <div
        className={`flex w-[1440px] h-[650px] ${
          isDarkMode ? "bg-gray-800" : "bg-blue-600"
        } rounded-xl shadow-lg overflow-hidden font-poppins`}
      >
        {/* Left Side - Logo & Text */}
        <div
          className={`w-2/5 ${
            isDarkMode ? "bg-gray-800" : "bg-blue-600"
          } text-white flex flex-col items-center justify-center text-center p-8`}
        >
          <img src={Logo || "/placeholder.svg"} className="max-w-xs mb-4" alt="Logo" />
          <p className="text-lg font-medium mb-2">Discover tailored events services.</p>
          <p className="text-lg font-medium mb-2">Sign up for personalized services today!</p>
        </div>

        {/* Right Side - Form */}
        <div
          className={`w-3/5 ${
            isDarkMode ? "bg-black text-white" : "bg-white text-gray-800"
          } p-12 flex flex-col justify-center rounded-l-[50px] shadow-md relative overflow-y-auto`}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default RegistrationLayout
