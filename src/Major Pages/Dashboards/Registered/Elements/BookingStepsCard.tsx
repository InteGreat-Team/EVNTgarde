import React, { useState } from "react";
import { User, MapPin, Users } from "lucide-react";
import BookingDetails from "../../../Bookings/Elements/BookingDetails";

type Booking = {
  id: number;
  type: string;
  date: string;
  day: string;
  title: string;
  startTime: string;
  endTime: string;
  customer: string;
  location: string;
  guests: string;
  organizer?: string;
  requestedServices: { [key: string]: number }; // Flexible object for services
};

type BookingStepsCardProps = {
  bookings: Booking[]; // Receive the booking list as a prop
  onSelect: (booking: Booking) => void;
  selectedEvent: Booking | null;
};

const BookingStepsCard: React.FC<BookingStepsCardProps> = ({
  bookings,
  onSelect,
  selectedEvent,
}) => {
  const activeStatus = "Draft";
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const onBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  const onBackClick = () => {
    setSelectedBooking(null);
  };

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="grid grid-cols-1 lg:grid-cols-3 grid-rows-[auto_auto] items-start gap-4 rounded-lg p-4 shadow-sm bg-white"
        >
          {/* Row 1: Title and Time */}
          <div className="col-span-1 lg:col-span-3">
            <h3 className="text-2xl font-semibold text-[#2B579A]">
              {booking.title}
            </h3>
            <p className="text-gray-600 text-sm">
              {booking.startTime} – {booking.endTime}
            </p>
          </div>

          {/* Row 2, Column 1: Customer and Optional Organizer */}
          <div className="flex flex-col items-start justify-center text-gray-600 text-sm">
            <div className="flex items-center mb-1 pt-2.5 pb-3">
              <User className="text-gray-400 mr-1" size={14} />
              <span>{booking.customer}</span>
            </div>
            {booking.organizer && (
              <div className="flex items-center pt-2.5 pb-3">
                <User className="text-gray-400 mr-1" size={14} />
                <span>{booking.organizer}</span>
              </div>
            )}
          </div>

          {/* Row 2, Column 2: Location and Guests */}
          <div className="flex flex-col items-start justify-center text-gray-600 text-sm">
            <div className="flex items-center mb-1 pt-2.5 pb-3">
              <MapPin className="text-gray-400 mr-1" size={14} />
              <span>{booking.location}</span>
            </div>
            <div className="flex items-center pt-2.5 pb-3">
              <Users className="text-gray-400 mr-1" size={14} />
              <span>{booking.guests} Guests</span>
            </div>
          </div>

          {/* Row 2, Column 3: Event Details and Select */}
          <div className="flex flex-col items-center justify-center">
            {selectedEvent?.id === booking.id ? (
              <button
                onClick={() => onBookingClick(booking)}
                className="flex-1 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 text-sm font-medium px-13 py-2 rounded mb-2"
              >
                Event Details
              </button>
            ) : (
              <>
                <button
                  onClick={() => onBookingClick(booking)}
                  className="flex-1 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 text-sm font-medium px-13 py-2 rounded mb-2"
                >
                  Event Details
                </button>
                <button
                  onClick={() => onSelect(booking)}
                  className="flex-1 bg-[#2B579A] hover:bg-blue-600 text-white text-sm font-medium px-19 py-2 rounded"
                >
                  Select
                </button>
              </>
            )}
          </div>
        </div>
      ))}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-7xl shadow-lg max-h-[90vh] overflow-y-auto relative">
            <BookingDetails
              isModal={true}
              onBackClick={onBackClick}
              activeStatus={activeStatus}
              selectedBooking={selectedBooking}
              showStatus={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingStepsCard;
