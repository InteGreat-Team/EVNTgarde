"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Card from "./MyEventsCard";
import clipboardImage from "../../../../assets/clipboard.png";
import { CreateEventModal } from "./CreateEventModal";
import { getAuth, onAuthStateChanged } from "firebase/auth";

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

interface EventFormData {
  name: string;
  overview: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  numberOfGuests: number;
  location: string;
  eventTypeId: number | "";
  attire: string;
  services: string[];
  customServices: string[];
  budget: string;
  files: File[];
}

interface EventData {
  event_id: number;
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
  budget: number;
  event_status: string;
}

const MyEvents: React.FC<Props> = ({ onAdd }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [events, setEvents] = useState<EventData[]>([]);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch user authentication state
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCustomerId(user.uid);
        fetchUserEvents(user.uid);
      } else {
        setCustomerId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch user's events
  const fetchUserEvents = async (userId: string) => {
    try {
      setLoading(true);
      setError(""); // Clear any previous errors
      console.log("Attempting to fetch events for user:", userId);
      
      const url = `http://localhost:5000/api/events/user/${userId}`;
      console.log("Fetching from URL:", url);
      
      const response = await fetch(url);
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        console.error("Error response data:", errorData);
        throw new Error(errorData.error || `Failed to fetch events: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Successfully fetched events:", data);
      setEvents(data);
    } catch (err) {
      console.error("Detailed error in fetchUserEvents:", {
        error: err,
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined
      });
      setError(err instanceof Error ? err.message : 'Failed to load events');
      setEvents([]); // Clear events on error
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = () => {
    if (onAdd) onAdd();
    setIsCreateModalOpen(true);
  };

  const handleSaveEvent = async (eventData: EventFormData) => {
    if (!customerId) {
      setError("You must be logged in to create an event");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName: eventData.name,
          eventOverview: eventData.overview,
          startDate: eventData.startDate,
          endDate: eventData.endDate,
          startTime: eventData.startTime,
          endTime: eventData.endTime,
          guests: eventData.numberOfGuests,
          location: eventData.location,
          eventTypeId: eventData.eventTypeId,
          attire: eventData.attire,
          services: eventData.services,
          additionalServices: eventData.customServices.join(", "),
          budget: parseFloat(eventData.budget),
          customerId,
        }),
      });

      if (!response.ok) throw new Error('Failed to create event');
      
      // Refresh events list
      await fetchUserEvents(customerId);
      setIsCreateModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-semibold">My Events</h1>
          <p className="text-gray-600">{events.length} events created</p>
        </div>
        <button
          onClick={handleCreateEvent}
          className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900 transition"
        >
          + Create Event
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading && <div className="text-gray-600 mb-4">Loading events...</div>}

      {events.length === 0 ? (
        <div className="bg-gray-100 p-8 rounded-lg flex flex-col items-center space-y-4">
          <img src={clipboardImage} alt="Clipboard" className="w-16 h-16" />
          <p className="text-gray-700 text-lg font-semibold">
            You have not created an event yet.
          </p>
        </div>
      ) : (
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
              onView={() => {}}
            />
          ))}
        </div>
      )}

      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveEvent}
      />
    </div>
  );
};

export default MyEvents;
