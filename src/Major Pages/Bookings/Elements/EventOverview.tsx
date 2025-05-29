"use client";

import React, { useState } from "react";
import { User, MapPin, Clock } from "lucide-react";

type Booking = {
  id: number;
  date: string;
  day: string;
  title: string;
  startTime: string;
  endTime: string;
  startDateTime: string;
  endDateTime: string;
  start_date: string;
  end_date: string;
  customer: string;
  location: string;
  guests: string;
  eventType: string;
  event_desc: string;
  services: {
    service_name: string;
    price: string;
  }[];
};

type BookingDetailsProps = {
  activeStatus: string;
  selectedBooking: Booking;
  userRole?: "organizer" | "individual" | "vendor";
};

const formatDateTime = (dateTimeStr: string): string => {
  if (!dateTimeStr) return "";
  try {
    const date = new Date(dateTimeStr);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch (e) {
    return "";
  }
};

const BookingDetails: React.FC<BookingDetailsProps> = ({
  selectedBooking,
  activeStatus,
  userRole = "organizer",
}) => {
  const guestsNumber = selectedBooking.guests.split(" ")[0];
  const services = selectedBooking.services || [];

  const [activeTab, setActiveTab] = useState<"Services" | "Venue Map" | "Timeline">("Services");

  return (
    <div className="bg-white h-fit w-full">
      <div className="flex flex-col gap-5 mx-4">
        <div className="border border-gray-300 rounded-md p-4 mt-5">
          <div className="mb-2">
            <h2 className="text-blue-600 font-bold text-xl">
              {selectedBooking.title}
            </h2>
            <p className="text-gray-500 text-sm">{selectedBooking.eventType}</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600 text-sm">{selectedBooking.event_desc}</p>
          </div>
          <div className="p-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-xs">Date</p>
              <p className="font-medium text-sm">
                {formatDateTime(selectedBooking.start_date)}
              </p>
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
              <p className="font-medium text-sm">{guestsNumber}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-500 text-xs">Location</p>
              <p className="font-medium text-sm">{selectedBooking.location}</p>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-300 flex">
          {["Services", "Venue Map", "Timeline"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-2 border-none bg-transparent cursor-pointer ${
                activeTab === tab ? "border-b-2 border-blue-500 font-semibold" : "text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="border border-gray-300 rounded-md mb-5 p-4">
          {activeTab === "Services" && (
            <>
              <p className="text-gray-600 mb-4">
                List of requested services by the customer
              </p>
              {services.length === 0 ? (
                <p className="text-sm text-gray-500">No selected services.</p>
              ) : (
                services.map((service, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center mb-4 border-b pb-4"
                  >
                    <div className="flex items-center">
                      <div className="bg-gray-100 p-2 rounded-full mr-3">
                        <User size={20} className="text-gray-500" />
                      </div>
                      <span>{service.service_name}</span>
                    </div>
                    <div>
                      <p className="text-blue-600 font-medium">{service.price}</p>
                      <p className="text-gray-500 text-sm">Included</p>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === "Venue Map" && (
            <div className="text-gray-800">
              <div className="flex justify-center mb-4">
                <div className="bg-gray-100 rounded-xl w-full h-48 flex items-center justify-center">
                  <MapPin size={32} className="text-red-500" />
                </div>
              </div>
              <p className="text-[17px] font-bold leading-tight mb-1">
                Blessed Pier Giorgio Frassati Building Auditorium
              </p>
              <div className="flex text-gray-500 text-sm justify-between mb-2">
                <div>
                  <p className="text-xs font-semibold">Floor, Building</p>
                  <p className="text-black font-bold">21st Floor, Blessed Pier Giorgio<br />Frassati Building</p>
                </div>
                <div>
                  <p className="text-xs font-semibold">ZIP Code</p>
                  <p className="text-black font-bold">101</p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                <p className="text-xs font-semibold">Street Address, District, City, Province/State</p>
                <p className="text-black font-bold">España Blvd, Sampaloc, Manila, Metro Manila</p>
                <p className="text-xs font-semibold mt-1">Country</p>
                <p className="text-black font-bold">Philippines</p>
              </div>
            </div>
          )}

          {activeTab === "Timeline" && (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <Clock className="text-blue-500" size={28} />
                </div>
              </div>
              <p className="text-sm font-medium">
                Your proposal is still under review. Once you accept it, the organizer can<br />
                create an event timeline.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
