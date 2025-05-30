import { useEffect, useState } from "react";
import axios from "axios";
import { User, MapPin } from "lucide-react";
import BookingDetails from "./Elements/BookingDetails";

type Status = "Pending" | "Upcoming" | "Past" | "Rejected" | "Draft";

type Booking = {
  id: number;
  title: string;
  event_status: Status;
  date: string;
  day: string;
  startTime: string;
  endTime: string;
  customer: string;
  location: string;
  guests: string;
  start_datetime: string;
  end_datetime: string;
  eventType: string;
  event_desc: string;
  services: { service_name: string }[];
};

const Bookings: React.FC = () => {
  const [activeStatus, setActiveStatus] = useState<Status>("Pending");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookingsData, setBookingsData] = useState<Record<Status, Booking[]>>({
    Pending: [],
    Upcoming: [],
    Past: [],
    Rejected: [],
    Draft: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/bookings");
        const rawData = response.data as Partial<Record<Status, Booking[]>>;
        const normalizedData: Record<Status, Booking[]> = {
          Pending: rawData.Pending ?? [],
          Upcoming: rawData.Upcoming ?? [],
          Past: rawData.Past ?? [],
          Rejected: rawData.Rejected ?? [],
          Draft: rawData.Draft ?? [],
        };
        setBookingsData(normalizedData);
        setError(null);
      } catch (err) {
        console.error("❌ Fetch error:", err);
        setError("Failed to load bookings. Please try again later.");
      }
    };
    fetchBookings();
  }, []);

  const sortByDate = (list: Booking[]) =>
    [...list].sort(
      (a, b) => new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime()
    );

  const sortedBookings = sortByDate(bookingsData[activeStatus]);
  const totalPages = Math.ceil(sortedBookings.length / itemsPerPage);
  const displayedBookings = sortedBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          {["Pending", "Upcoming", "Past", "Rejected", "Draft"].map((status) => (
            <button
              key={status}
              onClick={() => {
                setActiveStatus(status as Status);
                setCurrentPage(1);
              }}
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

      {error && (
        <div className="text-red-600 bg-red-100 border border-red-400 p-3 rounded mb-6 mx-8 text-center">
          {error}
        </div>
      )}

      <div className="relative">
        {displayedBookings.length === 0 ? (
          <p className="text-center text-gray-500 mt-20">
            No bookings available for {activeStatus}.
          </p>
        ) : (
          <>
            {displayedBookings.map((booking) => (
              <div key={booking.id} className="flex mb-12 relative">
                <div className="w-32 text-center mr-4 relative">
                  <div className="font-bold">{booking.date}</div>
                  <div className="text-gray-500 text-sm">{booking.day}</div>
                  <div className="absolute left-[13rem] top-[calc(50%-4.3rem)] transform -translate-y-1/2 -translate-x-1/2">
                    <div
                      className={`w-4.5 h-4.5 rounded-full ${
                        activeStatus === "Rejected"
                          ? "bg-red-600"
                          : activeStatus === "Draft"
                          ? "bg-yellow-500"
                          : "bg-gray-600"
                      }`}
                    ></div>
                  </div>
                </div>

                <div className="flex-1 border-transparent rounded-lg p-6 shadow-sm bg-white ml-25">
                  <h3
                    className={`text-xl font-semibold mb-2 ${
                      activeStatus === "Rejected"
                        ? "text-red-600"
                        : activeStatus === "Draft"
                        ? "text-yellow-600"
                        : "text-blue-600"
                    }`}
                  >
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
            ))}

            <div className="flex justify-center mt-8 space-x-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-gray-700 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Bookings;