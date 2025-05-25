import type React from "react"
import { useTheme } from "../../../../functions/ThemeContext"
import Logo from "@/assets/OrganizerLogo.png"

interface AuthLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title = "Discover tailored events services.",
  subtitle = "Sign up for personalized services today!",
}) => {
  const { isDarkMode } = useTheme()

  return (
    <div className="flex h-screen items-center justify-center bg-gray-300 font-[Poppins] p-4">
      <div
        className={`flex w-[1440px] h-[650px] ${
          isDarkMode ? "bg-gray-800" : "bg-blue-600"
        } rounded-xl shadow-lg overflow-hidden font-poppins`}
      >
        <div
          className={`w-2/5 ${
            isDarkMode ? "bg-gray-800" : "bg-blue-600"
          } text-white flex flex-col items-center justify-center text-center p-8`}
        >
          <img src={Logo || "/placeholder.svg"} className="max-w-xs mb-4" alt="Logo" />
          <p className="text-lg font-medium mb-2">{title}</p>
          <p className="text-lg font-medium mb-2">{subtitle}</p>
        </div>

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

export default AuthLayout