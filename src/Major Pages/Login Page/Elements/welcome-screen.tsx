"use client"

import type React from "react"

interface WelcomeScreenProps {
  userRole: string
  setCurrentStep: (step: number) => void
  handleBack: () => void
  isDarkMode: boolean
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ userRole, setCurrentStep, handleBack, isDarkMode }) => {
  const getWelcomeMessage = () => {
    if (userRole === "enthusiast") {
      return "You're a Customer - an Event Enthusiast!"
    } else if (userRole === "student") {
      return "You're a Customer - a Student!"
    } else if (userRole === "church") {
      return "You're a Customer - a Church Member!"
    } else {
      return "You're a Client!"
    }
  }

  const handleProceed = () => {
    setCurrentStep(1.5)
  }

  return (
    <>
      <h2 className="text-4xl font-bold text-blue-600 mt-30 mb-6">Sign Up</h2>

      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">{getWelcomeMessage()}</h3>
        <p className="text-lg mb-6">
          Perfect Pick! Find experienced organizers to bring your event to life. We'll help you get set up right away.
        </p>
      </div>

      <div className="flex justify-center items-center gap-4">
        <button
          type="button"
          onClick={handleBack}
          className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-blue-600 bg-white hover:bg-gray-100 dark:text-blue-400 dark:border-gray-600 dark:bg-transparent dark:hover:bg-gray-700"
        >
          Start Over
        </button>
        <button
          type="button"
          onClick={handleProceed}
          className={`flex-1 px-6 py-3 text-white ${
            isDarkMode ? "bg-gray-800 hover:bg-gray-300" : "bg-blue-600"
          } rounded-xl shadow-lg overflow-hidden font-poppins`}
        >
          Get Started
        </button>
      </div>

      <p className={`text-center mt-4 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
        Already have an account?{" "}
        <a href="/login" className="text-blue-600 hover:underline">
          Log in
        </a>
      </p>
    </>
  )
}

export default WelcomeScreen
