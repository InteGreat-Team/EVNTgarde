import React, { useState } from "react";
import ServicesTab from "./components/ServicesTab";
import TimelineTab from "./components/TimelineTab";
import VenueMap from "./components/VenueMap";

// Type for the booking structure - imported from parent component
type Booking = {
  id: number;
  title: string;
  date: string;
  day: string;
  customer: string;
  startTime: string;
  endTime: string;

  startDateTime: string;
  endDateTime: string;
  customer: string;
  location: string;
  guests: string;
  eventType: string;
};

interface EventOverviewProps {
  activeStatus: string;
  selectedBooking: Booking;
  userRole: "organizer" | "individual" | "vendor";
}


// Helper function to format date and time
const formatDateTime = (dateTimeStr: string): string => {
  if (!dateTimeStr) return '';
  const date = new Date(dateTimeStr);
  return date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
};

const EventOverview: React.FC<EventOverviewProps> = ({
  activeStatus,
  selectedBooking,
  activeStatus,
  userRole,
}) => {
  const [activeTab, setActiveTab] = useState("Services");

  return (
    <div className="bg-white h-fit w-full">
      <div className="flex flex-col gap-5 mx-4">
        {/* Event Details */}
        <div className="border border-gray-300 rounded-md p-4 mt-5">
          <div className="mb-2">
            <h2 className="text-blue-600 font-bold text-xl">
              {selectedBooking.title}
            </h2>
            <p className="text-gray-500 text-sm">{selectedBooking.eventType}</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600 text-sm">
              This is a placeholder for the description of the event, this one's
              for the boys with the booming system
            </p>
          </div>
          <div className="p-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-xs">Date</p>
              <p className="font-medium text-sm">
                {formatDateTime(selectedBooking.startDateTime)}
              </p>
              {selectedBooking.startDateTime !== selectedBooking.endDateTime && (
                <p className="font-medium text-sm">
                  to {formatDateTime(selectedBooking.endDateTime)}
                </p>
              )}
            </div>
            <div>
              <p className="text-gray-500 text-xs">Organizer</p>
              <p className="font-medium text-sm">{selectedBooking.customer}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Time</p>
              <p className="font-medium text-sm">
                {selectedBooking.startTime} - {selectedBooking.endTime}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Guests</p>
              <p className="font-medium text-sm">
                {selectedBooking.guests.split(" ")[0]}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-500 text-xs">Location</p>
              <p className="font-medium text-sm">{selectedBooking.location}</p>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="border-b border-gray-300 flex">
          {["Services", "Venue Map", "Timeline"].map((tab) => (
            <button
              key={tab}
              type="button"
              className={`flex-1 py-2 border-none bg-transparent cursor-pointer ${
                activeTab === tab
                  ? "border-b-2 border-blue-500 font-semibold"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="border border-gray-300 rounded-md mb-5">
          {activeTab === "Services" && (
            <ServicesTab selectedBooking={selectedBooking} />
          )}
          {activeTab === "Venue Map" && (
            <VenueMap selectedBooking={selectedBooking} />
          )}
          {activeTab === "Timeline" && (
            <TimelineTab
              selectedBooking={selectedBooking}
              activeStatus={activeStatus}
              userRole={userRole}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EventOverview;
