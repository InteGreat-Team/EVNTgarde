import React from "react";
import { User } from "lucide-react";

interface Booking {
  title: string;
  date: string;
  day: string;
  customer: string;
  startTime: string;
  endTime: string;
  guests: string;
  location: string;
}

interface EventOverviewProps {
  activeStatus: string;
  selectedBooking: Booking;
  userRole?: string;
}

const EventOverview: React.FC<EventOverviewProps> = ({ selectedBooking }) => {
  return (
    <div className="bg-white h-fit w-full">
      <div className="flex flex-col gap-5 mx-4">
        <div className="border border-gray-300 rounded-md p-4 mt-5">
          <div className="mb-2">
            <h2 className="text-blue-600 font-bold text-xl">{selectedBooking.title}</h2>
            <p className="text-gray-500 text-sm">Concert</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600 text-sm">This is a placeholder for the description of the event, this one's for the boys with the booming system</p>
          </div>
          <div className="p-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-xs">Date</p>
              <p className="font-medium text-sm">{selectedBooking.date} ({selectedBooking.day})</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Organizer</p>
              <p className="font-medium text-sm">{selectedBooking.customer}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Time</p>
              <p className="font-medium text-sm">{selectedBooking.startTime} - {selectedBooking.endTime}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Guests</p>
              <p className="font-medium text-sm">{selectedBooking.guests.split(" ")[0]}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-500 text-xs">Location</p>
              <p className="font-medium text-sm">{selectedBooking.location}</p>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-300 flex">
          {["Services", "Venue Map", "Timeline"].map((tab) => (
            <div
              key={tab}
              className={`flex-1 py-2 border-none bg-transparent ${
                tab === "Services" ? "border-b-2 border-blue-500 font-semibold" : "text-gray-600"
              }`}
            >
              {tab}
            </div>
          ))}
        </div>

        <div className="border border-gray-300 rounded-md mb-5">
          <div className="p-4">
            <p className="text-gray-600 mb-4">List of requested services by the customer</p>
            {[1, 2, 3].map((id) => (
              <div key={id} className="flex justify-between items-center mb-4 border-b pb-4">
                <div className="flex items-center">
                  <div className="bg-gray-100 p-2 rounded-full mr-3">
                    <User size={20} className="text-gray-500" />
                  </div>
                  <span>Catering Services</span>
                </div>
                <div>
                  <p className="text-blue-600 font-medium">PHP 560,000</p>
                  <p className="text-gray-500 text-sm">Included</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventOverview;
