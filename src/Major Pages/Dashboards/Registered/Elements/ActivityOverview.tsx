import React, { useState, useEffect } from "react";
import { ArrowUp, User, MapPin, Star } from "lucide-react";
import { CalendarCard } from "./calendar-card";

type userType = "organizer" | "vendor" | "customer";

const ActivityOverview: React.FC = () => {
  const [userType, setUserRole] = useState<userType>("organizer");

  useEffect(() => {
    const storedRole = localStorage.getItem("userType");
    if (storedRole === "organizer" || storedRole === "vendor" || storedRole === "customer") {
      setUserRole(storedRole);
    } else if (storedRole === "individual") {
      setUserRole("customer");
    } else {
      setUserRole("organizer");
    }
  }, []);

  const takenDates = [
    "April 10, 2025",
    "April 11, 2025",
    "April 15, 2025",
    "April 16, 2025",
    "April 22, 2025",
  ];

  const upcomingEvents = [
    {
      id: 2,
      date: "Mar 29",
      day: "Saturday",
      title: "Super Duper Long Event Placeholder",
      startTime: "5:30 PM",
      endTime: "10:00 PM",
      customer: "Customer Name",
      location: "Location Name",
      guests: "1,234 Guests",
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
    },
  ];

  const isCustomer = userType === "customer";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded shadow border border-gray-300">
          <h3
            className={`text-sm ${
              isCustomer ? "font-semibold" : "font-medium"
            } text-gray-500`}
          >
            Pending Approvals
          </h3>
          <p
            className={`text-4xl ${
              isCustomer ? "font-semibold ml-4" : "font-bold"
            } mt-2`}
          >
            1,020
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow border border-gray-300">
          <h3
            className={`text-sm ${
              isCustomer ? "font-semibold" : "font-medium"
            } text-gray-500`}
          >
            {isCustomer ? "Total Events Held" : "Revenue for August"}
          </h3>
          <p
            className={`text-4xl ${
              isCustomer ? "font-semibold ml-5" : "font-bold"
            } mt-2`}
          >
            {isCustomer ? "23" : "$ 124,205.00"}
          </p>
          <div className="flex items-center mt-2 text-xs text-green-600 ml-5">
            <ArrowUp className="h-3 w-3 mr-1" />
            <span>
              {isCustomer ? "10% increase since July" : "12% increase since July"}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow border border-gray-300">
          <h3
            className={`text-sm ${
              isCustomer ? "font-semibold" : "font-medium"
            } text-gray-500`}
          >
            {isCustomer
              ? "What Organizers Say About You"
              : "Customer Satisfaction Rating"}
          </h3>
          <div className="flex items-center mt-2">
            <p
              className={`text-4xl mr-4 ${
                isCustomer ? "font-semibold ml-5" : "font-bold"
              }`}
            >
              4.5
            </p>
            <div className="flex space-x-2 text-yellow-400">
              {[1, 2, 3, 4, 5].map((_, index) => (
                <Star
                  key={index}
                  className={`h-7 w-7 ${
                    index < 4
                      ? "fill-yellow-400"
                      : index === 4
                      ? "fill-yellow-400 opacity-50"
                      : ""
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2 ml-5">Based on 43 reviews</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isCustomer ? (
          <div className="bg-white p-6 rounded shadow border border-gray-300">
            <h3 className="text-sm font-semibold text-gray-500">
              Spendings for August
            </h3>
            <p className="text-4xl font-semibold mt-2 ml-5">$ 24,205.00</p>
          </div>
        ) : (
          <>
            <div className="bg-white p-6 rounded shadow border border-gray-300">
              <h3 className="text-sm font-medium text-gray-500">Total Job Requests</h3>
              <p className="text-4xl font-bold mt-2">180,329</p>
              <div className="flex items-center mt-2 text-xs text-green-600">
                <ArrowUp className="h-3 w-3 mr-1" />
                <span>15% increase since July</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded shadow border border-gray-300">
              <h3 className="text-sm font-medium text-gray-500">Total Revenue Earned</h3>
              <p className="text-4xl font-bold mt-2">$ 298,349.00</p>
              <div className="flex items-center mt-2 text-xs text-green-600">
                <ArrowUp className="h-3 w-3 mr-1" />
                <span>10% increase since 2023</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded shadow border border-gray-300">
              <h3 className="text-sm font-medium text-gray-500">Vendor Satisfaction Rating</h3>
              <div className="flex items-center mt-2">
                <p className="text-4xl font-bold mr-4">4.5</p>
                <div className="flex space-x-2 text-yellow-400">
                  {[1, 2, 3, 4, 5].map((_, index) => (
                    <Star
                      key={index}
                      className={`h-7 w-7 ${
                        index < 4
                          ? "fill-yellow-400"
                          : index === 4
                          ? "fill-yellow-400 opacity-50"
                          : ""
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Based on 43 reviews</p>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow border border-gray-300 md:col-span-1">
          <CalendarCard initialMonth="April" initialYear={2025} takenDates={takenDates} />
        </div>

        <div className="bg-white p-6 rounded shadow border border-gray-300 md:col-span-2">
          <h2 className="text-2xl font-semibold mb-6">Upcoming Events</h2>
          <div className="relative pb-16">
            <div className="absolute left-[115px] top-2 bottom-0 w-0.5 bg-green-600"></div>

            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex mb-8">
                <div className="mr-6 pt-1 w-24 relative">
                  <div className="font-bold text-xl">{event.date}</div>
                  <div className="text-gray-400">{event.day}</div>
                  <div className="absolute left-[115px] top-2 w-4 h-4 bg-green-500 rounded-full transform -translate-x-1/2"></div>
                </div>

                <div className="flex-1 bg-white rounded-lg shadow-sm p-5 border border-gray-100 ml-10">
                  <h3 className="text-xl font-semibold text-blue-600 mb-1">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {event.startTime} - {event.endTime}
                  </p>

                  <div className="grid grid-cols-2 gap-y-4">
                    <div className="flex items-center">
                      <User className="text-gray-400 mr-2" size={18} />
                      <span className="text-gray-600">{event.customer}</span>
                    </div>

                    <div className="flex items-center">
                      <MapPin className="text-gray-400 mr-2" size={18} />
                      <span className="text-gray-600">{event.location}</span>
                    </div>

                    <div className="flex items-center">
                      <Star className="text-yellow-400 mr-2" size={18} />
                      <span className="text-gray-600">{event.guests}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityOverview;
