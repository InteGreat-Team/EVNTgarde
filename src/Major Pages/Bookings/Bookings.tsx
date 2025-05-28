// === Updated Bookings.tsx with console logs ===
import { useState, useEffect } from "react";
import axios from "axios";
import { User, MapPin } from "lucide-react";
import BookingDetails from "./Elements/BookingDetails";

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
  event_status: string;
};

const Bookings: React.FC = () => {
  const [activeStatus, setActiveStatus] = useState<
    "Pending" | "Upcoming" | "Past" | "Rejected"
  >("Pending");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookingsData, setBookingsData] = useState<
    Record<"Pending" | "Upcoming" | "Past" | "Rejected", Booking[]>
  >({
    Pending: [],
    Upcoming: [],
    Past: [],
    Rejected: [],
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get<Booking[]>("http://localhost:5000/api/bookings");
        console.log("Fetched bookings:", response.data);

        const categorized = {
          Pending: [] as Booking[],
          Upcoming: [] as Booking[],
          Past: [] as Booking[],
          Rejected: [] as Booking[],
        };

        response.data.forEach((booking: Booking) => {
          const status = booking.event_status?.toLowerCase().trim();
          console.log("Booking status:", status, "Booking:", booking);

          if (status === "pending") categorized.Pending.push(booking);
          else if (status === "upcoming") categorized.Upcoming.push(booking);
          else if (status === "past") categorized.Past.push(booking);
          else if (status === "rejected") categorized.Rejected.push(booking);
        });

        console.log("Categorized bookings:", categorized);
        setBookingsData(categorized);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      }
    };

    fetchBookings();
  }, []);

  const sortedBookings = (list: Booking[]) =>
    [...list].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

  const displayedBookings = sortedBookings(bookingsData[activeStatus]);

  const onBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
    localStorage.setItem("selectedBookingId", booking.id.toString());
  };
  const onBackClick = () => {
    setSelectedBooking(null);
    localStorage.removeItem("selectedBookingId");
  };

  if (selectedBooking) {
    return (
      <BookingDetails
        isModal={false}
        onBackClick={onBackClick}
        activeStatus={activeStatus}
        selectedBooking={selectedBooking}
      />
    );
  }

  return (
    <div style={{ marginLeft: "16rem" }}>
      <h3 className="text-4xl font-bold ml-6 mt-4 text-[#2D2C3C]">Bookings</h3>
      <div className="flex justify-end mb-6">
        <div className="inline-flex bg-gray-100 rounded-lg p-1">
          {["Pending", "Upcoming", "Past", "Rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setActiveStatus(status as any)}
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

      <div className="relative">
        {displayedBookings.length === 0 ? (
          <p className="text-center text-gray-500 mt-20">
            No bookings available for {activeStatus}.
          </p>
        ) : (
          displayedBookings.map((booking) => (
            <div key={booking.id} className="flex mb-12 relative">
              <div className="w-32 text-center mr-4 relative">
                <div className="font-bold">{booking.date}</div>
                <div className="text-gray-500 text-sm">{booking.day}</div>
                <div className="absolute left-[13rem] top-[calc(50%-4.3rem)] transform -translate-y-1/2 -translate-x-1/2">
                  <div className={`w-4.5 h-4.5 rounded-full bg-gray-600`}></div>
                </div>
              </div>
              <div className="absolute left-[13rem] top-[calc(50%-4.3rem)] transform -translate-y-1/2 -translate-x-1/2">
                <div className={`w-4.5 h-4.5 bg-gray-600 rounded-full`}></div>
              </div>
              <div className="flex-1 border-transparent rounded-lg p-6 shadow-sm bg-white ml-25">
                <h3 className="text-xl font-semibold mb-2 text-blue-600">
                  {booking.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {booking.startTime} – {booking.endTime}
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center">
                    <User className="text-gray-400 mr-2" size={18} />
                    <span className="text-gray-600">{booking.customer}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="text-gray-400 mr-2" size={18} />
                    <span className="text-gray-600">{booking.location}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="text-gray-400 mr-2" size={18} />
                    <span className="text-gray-600">{booking.guests}</span>
                  </div>
                  <div className="flex justify-center lg:justify-end col-start-1 lg:col-start-3">
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
          ))
        )}
      </div>
    </div>
  );
};

export default Bookings;
