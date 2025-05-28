import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

interface CancelEventProps {
  isOpen: boolean
  onClose: () => void
  eventName?: string
}

const CancelEvent: React.FC<CancelEventProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1)
  const [selectedReason, setSelectedReason] = useState("")
  const [additionalDetails, setAdditionalDetails] = useState("")
  const navigate = useNavigate()

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
    navigate("/dashboard")
    onClose()
  }

  const handleGotIt = () => {
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-gray-800/40 backdrop-blur-md flex items-center justify-center px-4 py-10 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-8 shadow-2xl relative max-h-[100vh] overflow-y-auto">
        {/* Step 1: Reason Selection */}
        {step === 1 && (
          <>
            <h2 className="text-xl font-semibold mb-8  text-[#1e3a8a] text-left">
              Are you sure you want to cancel this event?
            </h2>
            
            <div className="mb-8">
              <label className="block text-sm font-medium text-black mb-6">Select a reason:</label>
              <div className="space-y-3">
                {cancellationReasons.map((reason, index) => (
                  <div
                    key={index}
                    onClick={() => handleReasonSelect(reason)}
                    className={`flex items-center space-x-3 cursor-pointer p-3 rounded-md border ${
                      selectedReason === reason
                        ? "bg-blue-50 border-blue-200"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <input
                      type="radio"
                      name="cancellationReason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={() => handleReasonSelect(reason)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-black">{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Text area */}
            <div className="mb-8">
              <textarea
                placeholder="Let us know why you're cancelling..."
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
                className="w-full border border-gray-300 bg-white rounded-md px-4 py-3 text-sm resize-none h-20 placeholder-gray-400"
                rows={3}
              />
              <p className="text-sm text-right text-gray-500 mt-2">
                {additionalDetails.trim().split(/\s+/).filter(Boolean).length}/15 words
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleBack}
                className="w-full border border-blue-500 text-blue-500 font-medium rounded-md px-4 py-2 hover:bg-blue-50"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!selectedReason}
                className="w-full bg-blue-600 text-white font-medium rounded-md px-4 py-2 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Cancel Event
              </button>
            </div>
          </>
        )}

        {/* Step 2: Confirmation */}
        {step === 2 && (
          <>
            <h2 className="text-xl font-semibold mb-7 text-[#1e3a8a] text-left">
              Are you sure you want to cancel this event?
            </h2>
            <hr className="border-t-2 border-gray-300 w-full mx-auto mb-6" />
            <p className="text-gray-700 text-sm mb-6 leading-loose">
              This action cannot be <span className="text-red-600 font-medium">undone</span>. The event will be taken
              off your schedule and show up under "Cancelled" in Bookings — along with all the details.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleBack}
                className="w-full border border-gray-300 text-gray-700 font-medium rounded-md px-4 py-2 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="w-full bg-blue-600 text-white font-medium rounded-md px-4 py-2 hover:bg-blue-700"
              >
                Yes, Cancel Event
              </button>
            </div>
          </>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <>
            <h2 className="text-xl font-semibold mb-7 text-left text-blue-900">
                Event Cancelled Successfully
              </h2>
              <hr className="border-t-2 border-gray-300 w-full mx-auto mb-6" />
              <p className="text-gray-600 text-left mb-8 leading-loose">
                The event is now cancelled and you can view the event details from the dashboard to manage your bookings.
              </p>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleGoToDashboard}
                className="w-full bg-blue-600 text-white font-medium rounded-md px-4 py-2 hover:bg-blue-700"
              >
                Go to Dashboard
              </button>
              <button
                onClick={handleGotIt}
                className="w-full border border-gray-300 text-gray-700 font-medium rounded-md px-4 py-2 hover:bg-gray-50"
              >
                Got it
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CancelEvent