import type React from "react"

interface RoleSelectionProps {
  error: string
  userRole: string
  setUserRole: (role: string) => void
  setCurrentStep: (step: number) => void
  handleBack: () => void
  isDarkMode: boolean
}

const RoleSelection: React.FC<RoleSelectionProps> = ({
  userRole,
  setUserRole,
  setCurrentStep,
  handleBack,
  isDarkMode,
}) => {
  const handleRoleSelect = (role: string) => {
    setUserRole(role)

    const storedData = sessionStorage.getItem("individualRegistration") || "{}"
    const parsedData = JSON.parse(storedData)
    sessionStorage.setItem(
      "individualRegistration",
      JSON.stringify({
        ...parsedData,
        userRole: role,
      }),
    )

    setCurrentStep(1.25)
  }

  return (
    <>
      <h2 className="text-4xl font-bold text-blue-600 mt-30 mb-6">Sign Up</h2>

      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-2">Which best describes you?</h3>
        <p className="text-sm text-gray-500 mb-6">Select the option that best describes you.</p>

        <div className="space-y-4">
          <div
            className={`p-4 border rounded-lg cursor-pointer ${
              userRole === "enthusiast"
                ? isDarkMode
                  ? "bg-gray-700 border-blue-500"
                  : "bg-blue-50 border-blue-500"
                : isDarkMode
                  ? "border-gray-600 hover:bg-gray-700"
                  : "border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => setUserRole("enthusiast")}
          >
            <div className="flex items-center">
              <input
                type="radio"
                checked={userRole === "enthusiast"}
                onChange={() => setUserRole("enthusiast")}
                className="mr-3"
              />
              <span>I'm an event enthusiast - just exploring for now</span>
            </div>
          </div>

          <div
            className={`p-4 border rounded-lg cursor-pointer ${
              userRole === "student"
                ? isDarkMode
                  ? "bg-gray-700 border-blue-500"
                  : "bg-blue-50 border-blue-500"
                : isDarkMode
                  ? "border-gray-600 hover:bg-gray-700"
                  : "border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => setUserRole("student")}
          >
            <div className="flex items-center">
              <input
                type="radio"
                checked={userRole === "student"}
                onChange={() => setUserRole("student")}
                className="mr-3"
              />
              <span>I'm a student</span>
            </div>
          </div>

          <div
            className={`p-4 border rounded-lg cursor-pointer ${
              userRole === "church"
                ? isDarkMode
                  ? "bg-gray-700 border-blue-500"
                  : "bg-blue-50 border-blue-500"
                : isDarkMode
                  ? "border-gray-600 hover:bg-gray-700"
                  : "border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => setUserRole("church")}
          >
            <div className="flex items-center">
              <input
                type="radio"
                checked={userRole === "church"}
                onChange={() => setUserRole("church")}
                className="mr-3"
              />
              <span>I'm part of a church group</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center gap-4">
        <button
          type="button"
          onClick={handleBack}
          className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-blue-600 bg-white hover:bg-gray-100 dark:text-blue-400 dark:border-gray-600 dark:bg-transparent dark:hover:bg-gray-700"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => handleRoleSelect(userRole)}
          disabled={!userRole}
          className={`flex-1 px-6 py-3 text-white rounded-lg ${
            !userRole
              ? "bg-gray-400 cursor-not-allowed"
              : isDarkMode
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Next
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

export default RoleSelection
