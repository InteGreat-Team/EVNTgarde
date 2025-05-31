import { useState } from "react";
import { User, MapPin } from "lucide-react";
import BookingDetails from "./Elements/BookingDetails";

// Type for the booking structure
type Booking = {
  id: number;
  date: string;
  day: string;
  title: string;
  startTime: string;
  endTime: string;
  customer: string;
  location: string;
  guests: string;
  liking_score?: number;
  event_type_id?: number;
  organizer_id?: number;
  venue_id?: number;
  budget?: number;
  guestListStatus?: "Submitted" | "Not Submitted";
  rsvpListStatus?: "Created" | "Not Created";
};

// User type to check if user is an organizer
type UserRole = "organizer" | "customer" | "vendor";
type BookingStatus = "Pending" | "Upcoming" | "Past" | "Rejected" | "Cancelled";

const Bookings: React.FC = () => {
  const [activeStatus, setActiveStatus] = useState<BookingStatus>("Pending");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const getUserTypeFromAuth = (): UserRole => {
    const storedType = localStorage.getItem("userType");
    if (
      storedType === "individual" ||
      storedType === "vendor" ||
      storedType === "organizer"
    ) {
      return storedType as UserRole;
    }

    // Default fallback
    return "customer";
  };

  const userRole = getUserTypeFromAuth();

  const handleStatusChange = (status: BookingStatus) => {
    setActiveStatus(status);
  };

  const bookingsData: Record<BookingStatus, Booking[]> = {
    Pending: [
      {
        id: 1,
        date: "Mar 26",
        day: "Wednesday",
        title: "Super Duper Long Event Place Holder As in Super Duperrrr...",
        startTime: "5:30 PM",
        endTime: "10:00 PM",
        customer: "Organizer Name",
        location: "Location Name",
        guests: "1,234 Guests",
        guestListStatus: "Submitted",
        rsvpListStatus: "Not Created",
        event_type_id: 2,
        organizer_id: 5,
        venue_id: 3,
        budget: 30000,
      },
      {
        id: 4,
        date: "Mar 27",
        day: "Thursday",
        title: "Another Event Placeholder",
        startTime: "3:00 PM",
        endTime: "8:00 PM",
        customer: "Another Organizer",
        location: "Another Location",
        guests: "567 Guests",
        event_type_id: 4,
        organizer_id: 2,
        venue_id: 5,
        budget: 300000,
      },
      {
        id: 5,
        date: "Mar 28",
        day: "Friday",
        title: "Super Duper Long Event Place Holder As in Super Duperrrr...",
        startTime: "5:30 PM",
        endTime: "10:00 PM",
        customer: "Organizer Name",
        location: "Location Name",
        guests: "1,234 Guests",
        guestListStatus: "Not Submitted",
        rsvpListStatus: "Created",
        event_type_id: 5,
        organizer_id: 1,
        venue_id: 6,
        budget: 3000,
      },
    ],
    Upcoming: [
      {
        id: 2,
        date: "Mar 26",
        day: "Wednesday",
        title: "Super Duper Long Event Place Holder As in Super Duperrrr...",
        startTime: "5:30 PM",
        endTime: "10:00 PM",
        customer: "Organizer Name",
        location: "Location Name",
        guests: "1,234 Guests",
        guestListStatus: "Submitted",
        rsvpListStatus: "Not Created",
      },
      {
        id: 6,
        date: "Mar 30",
        day: "Sunday",
        title: "Upcoming Event Placeholder",
        startTime: "2:00 PM",
        endTime: "7:00 PM",
        customer: "Upcoming Customer",
        location: "Upcoming Location",
        guests: "456 Guests",
        guestListStatus: "Not Submitted",
        rsvpListStatus: "Not Created",
      },
      {
        id: 7,
        date: "Mar 31",
        day: "Monday",
        title: "Next Event Placeholder",
        startTime: "4:00 PM",
        endTime: "9:00 PM",
        customer: "Next Customer",
        location: "Next Location",
        guests: "789 Guests",
        guestListStatus: "Not Submitted",
        rsvpListStatus: "Created",
      },
    ],
    Past: [
      {
        id: 3,
        date: "Mar 23",
        day: "Sunday",
        title: "Super Duper Long Event Place Holder As in Super Duperrrr...",
        startTime: "5:30 PM",
        endTime: "10:00 PM",
        customer: "Organizer Name",
        location: "Location Name",
        guests: "1,234 Guests",
      },
      {
        id: 8,
        date: "Mar 24",
        day: "Monday",
        title: "Past Event Placeholder",
        startTime: "1:00 PM",
        endTime: "6:00 PM",
        customer: "Past Organizer",
        location: "Past Location",
        guests: "345 Guests",
      },
      {
        id: 9,
        date: "Mar 25",
        day: "Tuesday",
        title: "Previous Event Placeholder",
        startTime: "7:00 PM",
        endTime: "11:00 PM",
        customer: "Previous Organizer",
        location: "Previous Location",
        guests: "678 Guests",
      },
    ],
    Rejected: [
      {
        id: 10,
        date: "Mar 20",
        day: "Wednesday",
        title: "Rejected Event Example",
        startTime: "3:00 PM",
        endTime: "8:00 PM",
        customer: "Rejected Organizer",
        location: "Rejected Location",
        guests: "0 Guests",
      },
      {
        id: 11,
        date: "Mar 18",
        day: "Monday",
        title: "Cancelled Conference",
        startTime: "9:00 AM",
        endTime: "2:00 PM",
        customer: "Cancelled Client",
        location: "Cancelled Venue",
        guests: "150 Guests",
      },
      {
        id: 12,
        date: "Mar 19",
        day: "Tuesday",
        title: "Rejected Music Festival",
        startTime: "1:00 PM",
        endTime: "11:00 PM",
        customer: "Festival Organizer",
        location: "Outdoor Park",
        guests: "2,000 Guests",
      },
    ],
    Cancelled: [
      {
        id: 13,
        date: "Mar 22",
        day: "Friday",
        title: "Cancelled Birthday Party",
        startTime: "6:00 PM",
        endTime: "11:00 PM",
        customer: "Cancelled Customer",
        location: "Cancelled Venue",
        guests: "50 Guests",
      },
      {
        id: 14,
        date: "Mar 21",
        day: "Thursday",
        title: "Cancelled Corporate Event",
        startTime: "2:00 PM",
        endTime: "7:00 PM",
        customer: "Corporate Client",
        location: "Business Center",
        guests: "100 Guests",
      },
      {
        id: 15,
        date: "Mar 20",
        day: "Wednesday",
        title: "Cancelled Debut Event",
        startTime: "6:00 PM",
        endTime: "10:00 PM",
        customer: "Debutante",
        location: "Antipolo",
        guests: "100 Guests",
      },
    ],
  };

  // Sort the bookings based on the date
  const sortedPendingBookings = [...bookingsData.Pending].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });

  const sortedPastBookings = [...bookingsData.Past].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const sortedUpcomingBookings = [...bookingsData.Upcoming].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const sortedRejectedBookings = [...bookingsData.Rejected].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const displayedBookings =
    activeStatus === "Pending"
      ? sortedPendingBookings
      : activeStatus === "Upcoming"
        ? sortedUpcomingBookings
        : activeStatus === "Past"
          ? sortedPastBookings
          : activeStatus === "Rejected"
            ? sortedRejectedBookings
            : activeStatus === "Cancelled"
              ? bookingsData.Cancelled
              : bookingsData[activeStatus];

  const onBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
  };
  const onBackClick = () => {
    setSelectedBooking(null);
  };
  const isGuestListSubmitted = (booking: Booking): boolean => {
    return booking.guestListStatus === "Submitted";
  };

  const isRsvpListCreated = (booking: Booking): boolean => {
    return booking.rsvpListStatus === "Created";
  };

  const hasRsvpListStatus = (booking: Booking): boolean => {
    return booking.hasOwnProperty("rsvpListStatus");
  };

  if (selectedBooking) {
    return (
      <BookingDetails
        isModal={false}
        onBackClick={onBackClick}
        activeStatus={activeStatus}
        selectedBooking={selectedBooking}
        showStatus={true}
      />
    );
  }

  return (
    <div style={{ marginLeft: "16rem" }}>
      <h3 className="text-4xl font-bold ml-6 mt-4 text-[#2D2C3C]">Bookings</h3>
      {/* Status buttons */}
      <div className="flex justify-end mb-6">
        <div className="inline-flex bg-gray-100 rounded-lg p-1">
          {[
            "Pending",
            "Upcoming",
            "Past",
            "Rejected",
            ...(userRole === "organizer" || userRole === "customer"
              ? ["Cancelled"]
              : []),
          ].map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status as BookingStatus)}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeStatus === status
                  ? "bg-white shadow-sm text-gray-800"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
      {/* Bookings List */}
      <div className="relative">
        {/* Timeline Line */}
        <div
          className={`absolute left-[12.95rem] w-0.5 ${activeStatus === "Rejected" ? "bg-red-600" : "bg-gray-600"}`}
          style={{
            top: "2rem",
            bottom: "0",
            height: `calc(100% - ${displayedBookings.length * 0}rem)`,
          }}
        ></div>
        <div
          className={`absolute left-[12.95rem] w-0.5 ${activeStatus === "Rejected" ? "bg-red-500" : "bg-gray-600"}`}
          style={{
            top: "2rem",
            bottom: "0",
            height: `calc(100% - ${bookingsData[activeStatus].length * 0}rem)`,
          }}
        ></div>
        {displayedBookings.map((booking) => (
          <div key={booking.id} className="flex mb-12 relative">
            {/* Date and Day Section */}
            <div className="w-32 text-center mr-4 relative">
              <div className="font-bold">{booking.date}</div>
              <div className="text-gray-500 text-sm">{booking.day}</div>
              {/* Timeline Circle */}
              <div className="absolute left-[13rem] top-[calc(50%-4.3rem)] transform -translate-y-1/2 -translate-x-1/2">
                <div
                  className={`w-4.5 h-4.5 rounded-full ${activeStatus === "Rejected" ? "bg-red-600" : "bg-gray-600"}`}
                ></div>
              </div>
            </div>
            <div className="absolute left-[13rem] top-[calc(50%-4.3rem)] transform -translate-y-1/2 -translate-x-1/2">
              <div
                className={`w-4.5 h-4.5 ${activeStatus === "Rejected" ? "bg-red-500" : "bg-gray-600"} rounded-full`}
              ></div>
            </div>
            {/* Placeholder Section */}
            <div className="flex-1 border-transparent rounded-lg p-6 shadow-sm bg-white ml-25">
              <h3
                className={`text-xl font-semibold mb-2 ${activeStatus === "Rejected" ? "text-red-600" : "text-blue-600"}`}
              >
                {booking.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {booking.startTime} – {booking.endTime}
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-4">
                <div className="flex flex-col space-y-1">
                  {/* Customer */}
                  <div className="flex items-center">
                    <User className="text-gray-400 mr-2" size={18} />
                    <span className="text-gray-600">{booking.customer}</span>
                  </div>
                  {/* Status Indicators */}
                  {activeStatus === "Upcoming" && (
                    <div className="flex flex-col space-y-1 mt-2">
                      {/* Guest List Status */}
                      {isGuestListSubmitted(booking) ? (
                        <div className="flex items-center py-1 px-3 rounded-sm bg-green-100 w-fit">
                          <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                          <span className="text-sm text-green-600 font-medium">
                            Guest List: Submitted
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center py-1 px-3 rounded-sm bg-gray-200 w-fit">
                          <span className="w-2 h-2 rounded-full bg-gray-400 mr-2"></span>
                          <span className="text-sm text-gray-500 font-medium">
                            Guest List: Not Submitted
                          </span>
                        </div>
                      )}
                      {/* RSVP List Status */}
                      {userRole === "organizer" &&
                        hasRsvpListStatus(booking) &&
                        (isRsvpListCreated(booking) ? (
                          <div className="flex items-center py-1 px-3 rounded-sm bg-green-100 w-fit">
                            <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                            <span className="text-sm text-green-600 font-medium">
                              RSVP List: Created
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center py-1 px-3 rounded-sm bg-gray-200 w-fit">
                            <span className="w-2 h-2 rounded-full bg-gray-400 mr-2"></span>
                            <span className="text-sm text-gray-500 font-medium">
                              RSVP List: Not Created
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-between">
                  {/* Location */}
                  <div className="flex items-center">
                    <MapPin className="text-gray-400 mr-2" size={18} />
                    <span className="text-gray-600">{booking.location}</span>
                  </div>
                  {/* Guests */}
                  <div className="flex items-center mt-auto">
                    <User className="text-gray-400 mr-2" size={18} />
                    <span className="text-gray-600">{booking.guests}</span>
                  </div>
                </div>
                {/* Event Details Button */}
                <div className="lg:col-span-2 flex justify-end mt-2">
                  <button
                    onClick={() => onBookingClick(booking)}
                    className="w-full lg:w-auto bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-medium px-4 py-2 rounded"
                  >
                    Event Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookings;
