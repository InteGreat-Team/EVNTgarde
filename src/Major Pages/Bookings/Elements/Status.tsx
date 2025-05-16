// Status.tsx
import React, { useState } from "react"
import { Facebook, Instagram, Linkedin, Globe } from "lucide-react"
import LeaveReviewOrganizer from './LeaveReviewOrganizer'
import LeaveReviewCustomer from './LeaveReview'
import LeaveReviewVendor from './LeaveReviewVendor'

interface StatusProps {
  activeStatus?: "Pending" | "Upcoming" | "Past" | "Rejected" 
  selectedBooking?: any
  userRole?: "organizer" | "individual" | "vendor"
  organizer?: {
    name?: string
    role?: string
    email?: string
    phone?: string
    avatar?: string
  }
  customer?: {
    name?: string
    role?: string
    email?: string
    phone?: string
    avatar?: string
  }
  socialLinks?: {
    facebook?: string
    instagram?: string
    linkedin?: string
    website?: string
  }
  onMarkCompleted?: () => void
  onAccept?: () => void
  onReject?: () => void
  onShareExperience?: () => void
}

const Status: React.FC<StatusProps> = ({
  activeStatus,
  selectedBooking,
  userRole,
  organizer,
  customer,
  socialLinks = {
    facebook: "@linktofacebook",
    instagram: "@linktoinstagram",
    linkedin: "@linktolinkedin",
    website: "@linktowebsite",
  },
  onMarkCompleted,
  onAccept,
  onReject,
  onShareExperience,
}) => {
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewMode, setReviewMode] = useState<'event' | 'vendor'>('event')

  const dates = {
    requestDate: selectedBooking?.requestDate || "Aug 1, 2025",
    acceptedDate: selectedBooking?.acceptedDate || "Aug 10, 2025",
    paymentDueDate: selectedBooking?.paymentDueDate || "Sept 1, 2025",
    paidDate: selectedBooking?.paidDate || "Sept 1, 2025",
    paymentDate: selectedBooking?.paymentDate || "Aug 1, 2025",
    completedDate: selectedBooking?.completedDate || "Aug 10, 2025",
  }

  const displayStatus = activeStatus === "Pending"
    ? "awaiting"
    : activeStatus === "Upcoming"
    ? "accepted"
    : activeStatus === "Past"
    ? "completed"
    : activeStatus === "Rejected"
    ? "rejected"
    : "awaiting"

  const renderOrganizerInfo = () => {
    const displayInfo = userRole === "organizer" ? customer : organizer

    return (
      <div className="border border-gray-300 rounded-md p-4 bg-white">
        <div className="flex items-center gap-4 mb-4">
          {displayInfo?.avatar ? (
            <div className="w-16 h-16 rounded-full overflow-hidden">
              <img
                src={displayInfo.avatar || "/placeholder.svg"}
                alt={displayInfo?.name || "User"}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-200"></div>
          )}
          <div>
            <h1 className="text-2xl font-bold">
              {displayInfo?.name || "User Name"}
            </h1>
            <p className="text-gray-500">{displayInfo?.role || "User"}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Email</h3>
            <p className="text-gray-500">
              {displayInfo?.email || "email@example.com"}
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Phone</h3>
            <p className="text-gray-500">
              {displayInfo?.phone || "123-456-7890"}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const renderLeaveReview = () => {
    if (userRole === 'organizer') {
      return (
        <LeaveReviewOrganizer
          onClose={() => setShowReviewModal(false)}
          mode={reviewMode === 'vendor' ? 'client' : 'vendor'}
        />
      )
    }
    return <LeaveReviewCustomer onClose={() => setShowReviewModal(false)} />
  }

  const renderStatusContent = () => {
    switch (displayStatus) {
      case "completed":
        return (
          <>
            {renderOrganizerInfo()}
            <div className="border border-gray-300 rounded-md overflow-hidden">
              <div className="bg-green-700 p-6 text-white">
                <h2 className="text-3xl font-bold mb-2">Completed</h2>
                <p>The event has concluded, and all the payments have been received</p>
              </div>
              <div className="p-4 space-y-4 bg-white">
                <div>
                  <h3 className="text-lg font-semibold">Request Date</h3>
                  <p className="text-gray-500">{dates.requestDate}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Date Accepted</h3>
                  <p className="text-gray-500">{dates.acceptedDate}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Date Completed</h3>
                  <p className="text-gray-500">{dates.completedDate}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Payment Date</h3>
                  <p className="text-gray-500">{dates.paymentDate}</p>
                </div>
                <div className="flex flex-col gap-3">
                  <button
                    className="w-full bg-blue-600 rounded-md py-3 px-4 text-white font-medium hover:bg-blue-800"
                    onClick={() => {
                      setReviewMode('event')
                      setShowReviewModal(true)
                    }}
                  >
                    Share Experience
                  </button>
                  {userRole === 'organizer' && (
                    <button
                      className="w-full border border-blue-600 text-blue-600 rounded-md py-3 px-4 font-medium hover:bg-blue-50"
                      onClick={() => {
                        setReviewMode('vendor')
                        setShowReviewModal(true)
                      }}
                    >
                      Vendor Experience
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col gap-5 pr-5">
      {renderStatusContent()}
      {showReviewModal && renderLeaveReview()}
    </div>
  )
}

export default Status
