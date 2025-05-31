"use client";

import React, { useState } from "react";
import axios from "axios";
import { User, MapPin, Clock, Pencil } from "lucide-react";

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
  services: string | { service_name: string }[];
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
  } catch {
    return "";
  }
};

const BookingDetails: React.FC<BookingDetailsProps> = ({
  selectedBooking,
  activeStatus,
  userRole = "organizer",
}) => {
  const guestsNumber = selectedBooking.guests.split(" ")[0];

  const services: { service_name: string }[] = Array.isArray(selectedBooking.services)
    ? selectedBooking.services
    : typeof selectedBooking.services === "string"
    ? selectedBooking.services
        .split(",")
        .map((s) => ({ service_name: s.trim() }))
        .filter((s) => s.service_name !== "")
    : [];

  const [activeTab, setActiveTab] = useState<"Services" | "Venue Map" | "Timeline">("Services");
  const [editing, setEditing] = useState(false);

  const [buildingName, setBuildingName] = useState("");
  const [floor, setFloor] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [country, setCountry] = useState("");

  const clearVenue = () => {
    setBuildingName("");
    setFloor("");
    setZipCode("");
    setAddress("");
    setDistrict("");
    setCity("");
    setProvince("");
    setCountry("");
  };

  const handleSubmitVenue = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/insert-venue-components", {
        buildingName,
        floor,
        zipCode,
        streetAddress: address,
        district,
        city,
        province,
        country,
      });
      console.log("✅ Venue inserted:", response.data);
      alert("Venue details saved successfully");
      setEditing(false);
    } catch (err) {
      console.error("❌ Error inserting venue:", err);
      alert("Failed to save venue details. See console for details.");
    }
  };

  return (
    <div className="bg-white h-fit w-full">
      <div className="flex flex-col gap-5 mx-4">
        <div className="border border-gray-300 rounded-md p-4 mt-5">
          <div className="mb-2">
            <h2 className="text-blue-600 font-bold text-xl">{selectedBooking.title}</h2>
            <p className="text-gray-500 text-sm">{selectedBooking.eventType}</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600 text-sm">{selectedBooking.event_desc}</p>
          </div>
          <div className="p-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-xs">Date</p>
              <p className="font-medium text-sm">{formatDateTime(selectedBooking.start_date)}</p>
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
              <p className="text-gray-600 mb-4">List of requested services by the customer</p>
              {services.length === 0 ? (
                <p className="text-sm text-gray-500">No selected services.</p>
              ) : (
                services.map((service, index) => (
                  <div key={index} className="flex justify-between items-center mb-4 border-b pb-4">
                    <div className="flex items-center">
                      <div className="bg-gray-100 p-2 rounded-full mr-3">
                        <User size={20} className="text-gray-500" />
                      </div>
                      <span>{service.service_name}</span>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === "Venue Map" && (
            <div className="text-gray-800 relative">
              <div className="flex justify-center mb-4">
                <div className="bg-gray-100 rounded-xl w-full h-48 flex items-center justify-center">
                  <MapPin size={32} className="text-red-500" />
                </div>
              </div>
              <button className="absolute right-4 top-4 text-blue-600" onClick={() => setEditing(!editing)}>
                <Pencil size={20} />
              </button>

              {!editing ? (
                <>
                  <p className="text-[17px] font-bold leading-tight mb-1">{buildingName || "\u00A0"}</p>
                  <div className="flex text-gray-500 text-sm justify-between mb-2">
                    <div>
                      <p className="text-xs font-semibold">Floor, Building</p>
                      <p className="text-black font-bold min-h-[24px]">{floor || "\u00A0"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold">ZIP Code</p>
                      <p className="text-black font-bold min-h-[24px]">{zipCode || "\u00A0"}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p className="text-xs font-semibold">Street Address, District, City, Province/State</p>
                    <p className="text-black font-bold min-h-[24px]">
                      {`${address || "\u00A0"}, ${district || "\u00A0"}, ${city || "\u00A0"}, ${province || "\u00A0"}`}
                    </p>
                    <p className="text-xs font-semibold mt-1">Country</p>
                    <p className="text-black font-bold min-h-[24px]">{country || "\u00A0"}</p>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-3 items-center">
                    {([
                      ["Building Name", buildingName, setBuildingName],
                      ["Floor", floor, setFloor],
                      ["ZIP Code", zipCode, setZipCode],
                      ["Street Address", address, setAddress],
                      ["District", district, setDistrict],
                      ["City", city, setCity],
                      ["Province/State", province, setProvince],
                      ["Country", country, setCountry],
                    ] as [string, string, React.Dispatch<React.SetStateAction<string>>][]).map(
                      ([label, value, setter], i) => (
                        <React.Fragment key={i}>
                          <label className="text-sm text-gray-700">{label}</label>
                          <input
                            className="col-span-2 w-full border rounded p-1"
                            value={value}
                            onChange={(e) => setter(e.target.value)}
                          />
                        </React.Fragment>
                      )
                    )}
                  </div>
                  <div className="mt-4 flex justify-end gap-3">
                    <button
                      onClick={handleSubmitVenue}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md transition-transform transform hover:scale-105 active:scale-95 duration-150"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={clearVenue}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md transition-transform transform hover:scale-105 active:scale-95 duration-150"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              )}
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
