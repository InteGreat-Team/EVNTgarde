"use client";

import type React from "react";
import { useState } from "react";
import Card from "./MyEventsCard";
import clipboardImage from "../../../../assets/clipboard.png";
import { CreateEventModal } from "./CreateEventModal";

// mockEvents if there are no events
//const allEvents: any[] = []

// mockEvents if there are events
const allEvents = [
  {
    name: "Event Name Placeholder Here",
    date: "2025-09-11",
    location: "Location Name",
    guests: 1234,
    image: "/placeholder.svg",
    description:
      "Lorem ipsum this one is for the boys with the booming system top down AC",
  },
  {
    name: "Event Name Placeholder Here",
    date: "2025-09-11",
    location: "Location Name",
    guests: 1234,
    image: "/placeholder.svg",
    description:
      "Lorem ipsum this one is for the boys with the booming system top down AC",
  },
  {
    name: "Event Name Placeholder Here",
    date: "2025-09-11",
    location: "Location Name",
    guests: 1234,
    image: "/placeholder.svg",
    description:
      "Lorem ipsum this one is for the boys with the booming system top down AC",
  },
];

interface Props {
  onBack: () => void;
  onAdd: () => void;
}

interface EventData {
  name: string;
  overview: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  numberOfGuests: number;
  location: string;
  eventType: string;
  attire: string;
  services: string[];
  customServices: string[];
  budget: string;
  files: File[];
}

const MyEvents: React.FC<Props> = ({ onAdd }) => {
  const [, setSelectedEvent] = useState<(typeof allEvents)[0] | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [events, setEvents] = useState<any[]>(allEvents);

  const handleView = (event: (typeof allEvents)[0]) => {
    setSelectedEvent(event);
  };

  const handleCreateEvent = () => {
    // Call the original onAdd function for backward compatibility
    if (onAdd) onAdd();

    // Open the create event modal
    setIsCreateModalOpen(true);
  };

  const handleSaveEvent = (eventData: EventData) => {
    // Create a new event object from the form data
    const newEvent = {
      title: eventData.name,
      price: eventData.budget,
      intro:
        eventData.overview.substring(0, 100) +
        (eventData.overview.length > 100 ? "..." : ""),
      fullDetails: eventData.overview,
      included: [
        {
          section: "Event Details",
          bullets: [
            `Date: ${new Date(eventData.startDate).toLocaleDateString()} to ${new Date(eventData.endDate).toLocaleDateString()}`,
            `Time: ${eventData.startTime} to ${eventData.endTime}`,
            `Location: ${eventData.location}`,
            `Type: ${eventData.eventType}`,
            `Attire: ${eventData.attire}`,
            `Guests: ${eventData.numberOfGuests}`,
          ],
        },
        {
          section: "Services",
          bullets: [...eventData.services, ...eventData.customServices],
        },
      ],
    };

    // Add the new event to the events array
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };
  return (
    <div className="p-4">
      <div>
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-3xl font-semibold">My Events</h1>
          <button
            onClick={handleCreateEvent}
            className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900 transition"
          >
            + Create Event
          </button>
        </div>
        <p className="text-gray-600">{events.length} events created</p>
      </div>

      {/* Check if there are no events */}
      {events.length === 0 && (
        <div className="bg-gray-100 p-8 rounded-lg flex flex-col items-center space-y-4">
          <img
            src={clipboardImage || "/placeholder.svg"}
            alt="Clipboard"
            className="w-16 h-16"
          />
          <p className="text-gray-700 text-lg font-semibold">
            You have not created an event yet.
          </p>
        </div>
      )}

      {/* Display event cards if there are events */}
      {events.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {allEvents.map((event, idx) => (
            <Card
              key={idx}
              name={event.name}
              date={event.date}
              location={event.location}
              guests={event.guests}
              image={event.image}
              description={event.description}
              onView={() => handleView(event)}
            />
          ))}
        </div>
      )}
      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={(eventData: EventData) => {
          handleSaveEvent(eventData);
          setIsCreateModalOpen(false);
        }}
      />
    </div>
  );
};

export default MyEvents;
