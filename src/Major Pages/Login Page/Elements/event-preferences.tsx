import type React from "react"
import { useState } from "react"

interface EventPreferencesProps {
  preferences: string[]
  setPreferences: (preferences: string[]) => void
  setCurrentStep: (step: number) => void
  handleBack: () => void
  isDarkMode: boolean
}

const EventPreferences: React.FC<EventPreferencesProps> = ({
  preferences,
  setPreferences,
  setCurrentStep,
  handleBack,
  isDarkMode,
}) => {
  const [eventPreferencesError, setEventPreferencesError] = useState("")

  const eventTypes = [
    "Birthday",
    "Wedding",
    "Anniversary",
    "Baby Shower",
    "Gender Reveal",
    "Engagement",
    "Seminar",
    "Workshop",
    "Conference",
    "Convention",
    "Product Launch",
    "Networking",
    "Training Session",
    "Certification Class",
    "Concert",
    "Live Performance",
    "Art Exhibit",
    "Gallery Opening",
    "Open Mic",
    "Theater/Stage Play",
    "Festival/Parade",
    "Talent Show",
    "Church Service",
    "Spiritual Retreat",
    "Fundraiser",
    "Charity Event",
    "Outreach/Volunteering Drive",
    "Religious Ceremony (e.g. Baptism)",
  ]

  const toggleEventPreference = (eventType: string) => {
    setEventPreferencesError("")

    if (preferences.includes(eventType)) {
      setPreferences(preferences.filter((type) => type !== eventType))
    } else {
      if (preferences.length < 5) {
        setPreferences([...preferences, eventType])
      } else {
        setEventPreferencesError("You can select up to 5 event types")
      }
    }
  }

  const handlePreferencesNext = () => {
    const storedData = sessionStorage.getItem("individualRegistration") || "{}"
    const parsedData = JSON.parse(storedData)

    sessionStorage.setItem(
      "individualRegistration",
      JSON.stringify({
        ...parsedData,
        preferences,
      }),
    )

    setCurrentStep(2)
  }

  return (
    <>
      <h2 className="text-4xl font-bold text-blue-600 mt-30 mb-6">Sign Up</h2>

      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-2">What Type of Events Do You Prefer?</h3>
        <p className="text-sm text-gray-500 mb-4">
          Let us know your go-to events (choose up to 5) so we can suggest the best options for you.
        </p>

        {eventPreferencesError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {eventPreferencesError}
          </div>
        )}

        <div className="flex flex-wrap gap-2 max-h-[280px] overflow-y-auto pr-2">
          {eventTypes.map((eventType) => (
            <button
              key={eventType}
              type="button"
              onClick={() => toggleEventPreference(eventType)}
              className={`px-3 py-2 rounded-full text-sm ${
                preferences.includes(eventType)
                  ? isDarkMode
                    ? "bg-blue-600 text-white"
                    : "bg-blue-600 text-white"
                  : isDarkMode
                    ? "bg-gray-700 text-white border border-gray-600"
                    : "bg-white text-gray-700 border border-gray-300"
              }`}
            >
              {eventType}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          type="button"
          onClick={handleBack}
          className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-blue-600 bg-white hover:bg-gray-100 dark:text-blue-400 dark:border-gray-600 dark:bg-transparent dark:hover:bg-gray-700"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handlePreferencesNext}
          className={`flex-1 px-6 py-3 text-white ${
            isDarkMode ? "bg-gray-800 hover:bg-gray-300" : "bg-blue-600 hover:bg-blue-300"
          } rounded-xl shadow-lg overflow-hidden font-poppins`}
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

export default EventPreferences
