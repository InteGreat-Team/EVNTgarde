import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, MapPin, Clock } from "lucide-react";

interface Booking {
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
  eventType?: string;
  event_type_name?: string;
  event_desc?: string;
  additional_services?: string;
}

const EventOverview: React.FC = () => {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [activeTab, setActiveTab] = useState<"Services" | "Venue Map" | "Timeline">("Services");

  useEffect(() => {
    const fetchSelectedBooking = async () => {
      const selectedId = localStorage.getItem("selectedBookingId");
      if (!selectedId) return;
      try {
        const res = await axios.get<Booking[]>("http://localhost:5000/api/bookings");
        const found = res.data.find(b => b.id.toString() === selectedId);
        if (found) setSelectedBooking(found);
      } catch (err) {
        console.error("Failed to fetch booking:", err);
      }
    };
    fetchSelectedBooking();
  }, []);

  if (!selectedBooking) {
    return <div className="p-6">Loading booking data...</div>;
  }

  const guestsNumber = selectedBooking.guests.split(" ")[0];

  const venueDetails = {
    name: selectedBooking.location,
    floor: "21st Floor, Blessed Pier Giorgio Frassati Building",
    zipCode: "101",
    street: "España Blvd, Sampaloc, Manila, Metro Manila",
    country: "Philippines",
  };

  const parsedServices = selectedBooking.additional_services
    ? selectedBooking.additional_services
        .split(',')
        .map(service => service.trim())
        .filter(service => service.length > 0)
    : [];

  const servicesContent = (
    <div className="p-4">
      <p className="text-gray-600 mb-4">
        List of requested services by the customer
      </p>
      {parsedServices.length > 0 ? (
        parsedServices.map((service, index) => (
          <div
            key={index}
            className="flex justify-between items-center mb-4 border-b pb-4"
          >
            <div className="flex items-center">
              <div className="bg-gray-100 p-2 rounded-full mr-3">
                <User size={20} className="text-gray-500" />
              </div>
              <span>{service}</span>
            </div>
            <div>
              <p className="text-blue-600 font-medium">PHP 0.00</p>
              <p className="text-gray-500 text-sm">Included</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No services listed for this booking.</p>
      )}
    </div>
  );

  const venueContent = (
    <div className="p-4">
      <div className="bg-gray-100 rounded-lg w-full h-48 relative mb-6">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="mx-auto text-red-500 mb-2" size={32} />
          </div>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">
          {venueDetails.name}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 text-sm">Floor, Building</p>
            <p className="font-medium">{venueDetails.floor}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">ZIP Code</p>
            <p className="font-medium">{venueDetails.zipCode}</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-gray-500 text-sm">
            Street Address, District, City, Province/State
          </p>
          <p className="font-medium">{venueDetails.street}</p>
        </div>
        <div className="mt-4">
          <p className="text-gray-500 text-sm">Country</p>
          <p className="font-medium">{venueDetails.country}</p>
        </div>
      </div>
    </div>
  );

  const timelineContent = (
    <div className="p-4 flex flex-col items-center justify-center h-48">
      <div className="bg-blue-100 p-4 rounded-full mb-4">
        <Clock className="text-blue-500" size={24} />
      </div>
      <p className="text-base text-center text-blue-600">
        The event proposal is still awaiting customer's acceptance. Once they confirm, you can create an event timeline here.
      </p>
    </div>
  );

  const tabContent = {
    "Services": servicesContent,
    "Venue Map": venueContent,
    "Timeline": timelineContent,
  };

  return (
    <div className="bg-white h-fit w-full">
      <div className="flex flex-col gap-5 mx-4">
        <div className="border border-gray-300 rounded-md p-4 mt-5">
          <div className="mb-2">
            <h2 className="text-blue-600 font-bold text-xl">
              {selectedBooking.title}
            </h2>
            <p className="text-gray-500 text-sm">
              {selectedBooking.event_type_name || "No Type Specified"}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600 text-sm">
              {selectedBooking.event_desc || "No description provided."}
            </p>
          </div>

          <div className="p-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-xs">Date</p>
              <p className="font-medium text-sm">{selectedBooking.date}</p>
              <p className="font-medium text-sm">({selectedBooking.day.trim()})</p>
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
              <p className="font-medium text-sm">{selectedBooking.guests}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-500 text-xs">Location</p>
              <p className="font-medium text-sm">{selectedBooking.location}</p>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-300 flex">
          {Object.keys(tabContent).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-2 border-none bg-transparent cursor-pointer ${
                activeTab === tab
                  ? "border-b-2 border-blue-500 font-semibold"
                  : "text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="border border-gray-300 rounded-md mb-5">
          {tabContent[activeTab]}
        </div>
      </div>
    </div>
  );
};

export default EventOverview;
