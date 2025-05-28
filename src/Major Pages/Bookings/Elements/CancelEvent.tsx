import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface CancelEventProps {
  isOpen: boolean
  onClose: () => void
  eventName?: string
}

const CancelEvent: React.FC<CancelEventProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1)
  const [selectedReason, setSelectedReason] = useState("")
  const [additionalDetails, setAdditionalDetails] = useState("")
  const router = useRouter()

  const cancellationReasons = [
    "Marketing conflict",
    "Low attendance expected",
    "Venue issues",
    "Family emergency/conflict",
    "Other (please specify below)",
  ]

  const handleReasonSelect = (reason: string) => {
    setSelectedReason(reason)
  }

  const handleNext = () => {
    if (step === 1 && selectedReason) {
      setStep(2)
    } else if (step === 2) {
      setStep(3)
    }
  }

  const handleBack = () => {
    if (step === 2) {
      setStep(1)
    } else if (step === 1) {
      onClose()
    }
  }

  const handleGoToDashboard = () => {
    router.push("/dashboard")
    onClose()
  }

  const handleGotIt = () => {
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-poppins">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        {/* Step 1: Reason Selection */}
        {step === 1 && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6 text-center">Are you sure you want to cancel this event?</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Select a reason</label>
              <div className="space-y-2">
                {cancellationReasons.map((reason, index) => (
                  <label key={index} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="cancellationReason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={() => handleReasonSelect(reason)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            {selectedReason === "Other (please specify below)" && (
              <div className="mb-6">
                <textarea
                  placeholder="Please provide additional details..."
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md resize-none h-20 text-sm"
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!selectedReason}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Cancel Event
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Confirmation */}
        {step === 2 && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6 text-center">Are you sure you want to cancel this event?</h2>

            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              This action cannot be undone. The event will be taken off your schedule and all other stakeholders
              (Attendees, if bookings - clients) will be notified.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Yes, Cancel Event
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="p-6 relative">
            <h2 className="text-xl font-semibold mb-4 text-center">Event Cancelled Successfully</h2>

            <p className="text-gray-600 text-sm mb-6 leading-relaxed text-center">
              The event is now cancelled and you can view the event details from the dashboard to manage your bookings.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleGoToDashboard}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Go to Dashboard
              </button>
              <button
                onClick={handleGotIt}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CancelEvent