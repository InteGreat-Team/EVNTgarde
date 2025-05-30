import type React from "react";
import { useState, useEffect } from "react";
import Card from "./MyEventsCard";
import clipboardImage from "../../../../assets/clipboard.png";
import { CreateEventModal } from "./CreateEventModal";
import { getAuth } from "firebase/auth";
import { EventData } from "../../../../functions/types";

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

interface BackendEvent {
  event_id: string;
  event_name: string;
  event_desc: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  guests: number;
  location: string;
  event_type_name: string;
  attire: string;
  services: string;
  additional_services: string;
  budget: string;
  event_status: string;
}

const MyEvents: React.FC<Props> = ({ onAdd }) => {
  const [selectedEvent, setSelectedEvent] = useState<BackendEvent | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [events, setEvents] = useState<BackendEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const auth = getAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:5000/api/events/user/${user.uid}`);
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (event: BackendEvent) => {
    setSelectedEvent(event);
  };

  const handleCreateEvent = () => {
    if (onAdd) onAdd();
    setIsCreateModalOpen(true);
  };

  const handleSaveEvent = async (eventData: EventData) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }

      const eventPayload = {
        eventName: eventData.name,
        eventOverview: eventData.overview,
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        guests: eventData.numberOfGuests,
        location: eventData.location,
        eventTypeName: eventData.eventType,
        attire: eventData.attire,
        services: eventData.services.join(", ") || null,
        additionalServices: eventData.customServices.join(", ") || null,
        budget: eventData.budget,
        customerId: user.uid,
        organizerId: null,
        vendorId: null,
        venueId: null
      };

      const response = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventPayload)
      });

      if (!response.ok) {
        throw new Error("Failed to create event");
      }

      // Refresh events list
      await fetchEvents();
      setIsCreateModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create event");
    }
  };

  if (loading) {
    return <div className="p-4">Loading events...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

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
          {events.map((event) => (
            <Card
              key={event.event_id}
              name={event.event_name}
              date={event.start_date}
              location={event.location}
              guests={event.guests}
              image="/placeholder.svg"
              description={event.event_desc}
              onView={() => handleView(event)}
            />
          ))}
        </div>
      )}
      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveEvent}
      />
    </div>
  );
};

export default MyEvents;
