import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LeaveReviewOrganizer from "./LeaveReviewOrganizer";
import LeaveReviewCustomer from "./LeaveReview";
import CancelEvent from "./CancelEvent";

interface StatusProps {
  activeStatus?: "Pending" | "Upcoming" | "Past" | "Rejected" | "Cancelled";
  selectedBooking?: any;
  userRole?: "organizer" | "individual" | "vendor";
  organizer?: {
    name?: string;
    role?: string;
    email?: string;
    phone?: string;
    avatar?: string;
  };
  customer?: {
    name?: string;
    role?: string;
    email?: string;
    phone?: string;
    avatar?: string;
  };
  onAccept?: () => void;
  onReject?: () => void;
}

const Status: React.FC<StatusProps> = ({
  activeStatus,
  selectedBooking,
  userRole,
  organizer,
  customer,
  onAccept,
  onReject,
}) => {
  const navigate = useNavigate();

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewMode, setReviewMode] = useState<"event" | "vendor">("event");
  const [showCancelModal, setShowCancelModal] = useState(false);

  const dates = {
    requestDate: selectedBooking?.requestDate || "Aug 1, 2025",
    acceptedDate: selectedBooking?.acceptedDate || "Aug 10, 2025",
    paymentDueDate: selectedBooking?.paymentDueDate || "Sept 1, 2025",
    paidDate: selectedBooking?.paidDate || "Sept 1, 2025",
    paymentDate: selectedBooking?.paymentDate || "Aug 1, 2025",
    completedDate: selectedBooking?.completedDate || "Aug 10, 2025",
  };

  const displayStatus =
    activeStatus === "Pending"
      ? "awaiting"
      : activeStatus === "Upcoming"
        ? "accepted"
        : activeStatus === "Past"
          ? "completed"
          : activeStatus === "Rejected"
            ? "rejected"
            : activeStatus === "Cancelled"
              ? "cancelled"
              : "awaiting";

  const renderOrganizerInfo = () => {
    const displayInfo = userRole === "organizer" ? customer : organizer;

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
    );
  };

  const renderLeaveReview = () => {
    if (userRole === "organizer") {
      return (
        <LeaveReviewOrganizer
          onClose={() => setShowReviewModal(false)}
          mode={reviewMode === "vendor" ? "client" : "vendor"}
        />
      );
    }
    return <LeaveReviewCustomer onClose={() => setShowReviewModal(false)} />;
  };

    const renderCancelEvent = () => {
    return (
      <CancelEvent
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        eventName={selectedBooking?.eventName}
      />
    )
  }

  const renderStatusContent = () => {
    switch (displayStatus) {
      case "awaiting":
        return (
          <>
            {renderOrganizerInfo()}
            <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
              <h2 className="text-3xl font-bold mb-2">Awaiting Response</h2>
              <p className="text-gray-500">
                {userRole === "organizer"
                  ? "You have received a booking request. Please review and respond."
                  : "You have booked this organizer, please wait for the organizer to respond to your event request."}
              </p>
              {userRole === "organizer" && (
                <div className="mt-4 flex gap-3">
                  <button
                    className="flex-1 bg-green-600 text-white rounded-md py-2 px-4 hover:bg-green-700"
                    onClick={onAccept}
                  >
                    Accept
                  </button>
                  <button
                    className="flex-1 bg-red-600 text-white rounded-md py-2 px-4 hover:bg-red-700"
                    onClick={onReject}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </>
        );
      case "accepted":
        return (
          <>
            {renderOrganizerInfo()}
            <div className="border border-gray-300 rounded-md overflow-hidden">
              <div className="bg-yellow-400 p-6 text-white">
                <h2 className="text-3xl font-bold mb-2">Accepted</h2>
                <p>
                  The event has been accepted, and all the payments for the
                  vendor <strong>have been settled.</strong>
                </p>
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
                  <h3 className="text-lg font-semibold">Payment Due Date</h3>
                  <p className="text-gray-500">{dates.paymentDueDate}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Date Paid</h3>
                  <p className="text-gray-500">{dates.paidDate}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Date Completed</h3>
                  <p className="text-gray-500">-</p>
                </div>
                <button
                  className="w-full bg-red-500 rounded-md py-3 px-4 text-white font-medium hover:bg-red-600"
                  onClick={() => setShowCancelModal(true)}
                >
                  Cancel Event
                </button>
                <div className="pt-2">
                  <h3 className="text-lg font-semibold mb-3">Attendees</h3>
                  <button
                    className="w-full bg-yellow-400 rounded-md py-3 px-4 text-black font-medium hover:bg-yellow-500"
                    //onClick={() => navigate("/rsvp-tracker")} //
                  >
                    View RSVP Tracker
                  </button>
                </div>
              </div>
            </div>
          </>
        );
      case "rejected":
        return (
          <>
            {renderOrganizerInfo()}
            <div className="border border-gray-300 rounded-md overflow-hidden">
              <div className="bg-red-700 p-6 text-white">
                <h2 className="text-3xl font-bold mb-2">Rejected</h2>
                <p>
                  The event proposal has been rejected, and will not proceed to
                  event planning.
                </p>
              </div>
              <div className="p-4 space-y-4 bg-white">
                <div>
                  <h3 className="text-lg font-semibold">Request Date</h3>
                  <p className="text-gray-500">{dates.requestDate}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Date Rejected</h3>
                  <p className="text-gray-500">Aug 2, 2025</p>
                </div>
                <button
                  className="w-full bg-blue-600 rounded-md py-3 px-4 text-white font-medium hover:bg-blue-800"
                  //onClick={() => navigate("/vendors")} //
                >
                  Browse Other Vendors
                </button>
              </div>
            </div>
          </>
        );
      case "completed":
        return (
          <>
            {renderOrganizerInfo()}
            <div className="border border-gray-300 rounded-md overflow-hidden">
              <div className="bg-green-700 p-6 text-white">
                <h2 className="text-3xl font-bold mb-2">Completed</h2>
                <p>
                  The event has concluded, and all the payments have been
                  received
                </p>
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
                      setReviewMode("event");
                      setShowReviewModal(true);
                    }}
                  >
                    {userRole === "organizer"
                      ? "Leave Client Review"
                      : "Share Experience"}
                  </button>
                  {userRole === "organizer" && (
                    <button
                      className="w-full border border-blue-600 text-blue-600 rounded-md py-3 px-4 font-medium hover:bg-blue-50"
                      onClick={() => {
                        setReviewMode("vendor");
                        setShowReviewModal(true);
                      }}
                    >
                      Leave Organizer Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        );
      case "cancelled":
        return (
          <>
            {renderOrganizerInfo()}
            <div className="border border-gray-300 rounded-md overflow-hidden">
              <div className="bg-red-600 p-6 text-white">
                <h2 className="text-3xl font-bold mb-2">Cancelled</h2>
                <p>The event will no longer proceed as scheduled.</p>
              </div>
              <div className="p-4 space-y-4 bg-white">
                <div className="text-red-600 mb-2">
                  <h3 className="text-sm font-medium">Issues:</h3>
                  <ul className="ml-4 mt-1">
                    <li>• Low attendance expected</li>
                    <li>• Venue issues</li>
                  </ul>
                </div>
                <p className="text-gray-600 text-sm">
                  We're sorry to announce the cancellation of this event. We
                  understand this may be disappointing.
                </p>
                <div>
                  <h3 className="text-lg font-semibold">Request Date</h3>
                  <p className="text-gray-500">{dates.requestDate}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Date Accepted</h3>
                  <p className="text-gray-500">{dates.acceptedDate}</p>
                </div>
                <button
                  className="w-full bg-blue-600 rounded-md py-3 px-4 text-white font-medium hover:bg-blue-800"
                  onClick={() => navigate("/dashboard")}
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

   return (
    <div className="flex flex-col gap-5 pr-5">
      {renderStatusContent()}
      {showReviewModal && renderLeaveReview()}
      {showCancelModal && renderCancelEvent()}
    </div>
  )
}

export default Status;
