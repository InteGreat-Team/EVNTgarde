import type React from "react";
import { useState, useEffect } from "react";
import Card from "./MyEventsCard";
import clipboardImage from "../../../../assets/clipboard.png";
import { CreateEventModal } from "./CreateEventModal";
import { getAuth } from "firebase/auth";
import { EventData } from "../../../../functions/types";
import { CLOUD_FUNCTIONS } from "@/config/cloudFunctions";
import {
  getCustomerEvents,
  getOrganizerEvents,
} from "../../../../functions/eventFunctions";

// mockEvents if there are no events
//const allEvents: any[] = []

// mockEvents if there are events

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

interface EventType {
  event_type_id: number;
  event_type_name: string;
}

const MyEvents: React.FC<Props> = ({ onAdd }) => {
  const [, setSelectedEvent] = useState<BackendEvent | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [events, setEvents] = useState<BackendEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const auth = getAuth();
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);

  useEffect(() => {
    fetchEvents();
    fetchEventTypes();
  }, []);

  const fetchEvents = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      // First try to get role from Firebase custom claims
      const idTokenResult = await user.getIdTokenResult();
      let roleId = idTokenResult.claims.role_id;
      console.log("User role ID from claims:", roleId);

      // If role_id is not in claims, fetch it from backend
      if (!roleId) {
        console.log("Role ID not found in claims, fetching from backend...");
        const response = await fetch(CLOUD_FUNCTIONS.getRole, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firebaseUid: user.uid,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to get user role");
        }

        const data = await response.json();
        roleId = data.roleId;
        console.log("User role ID from backend:", roleId);
      }

      let events;
      // Check if roleId exists and is a number
      if (
        typeof roleId === "number" ||
        (typeof roleId === "string" && !isNaN(Number(roleId)))
      ) {
        const numericRoleId = Number(roleId);
        if (numericRoleId === 1) {
          // Customer role
          console.log("Fetching customer events..."); // Debug log
          events = await getCustomerEvents(user.uid, roleId);
        } else if (numericRoleId === 2) {
          // Organizer role
          console.log("Fetching organizer events..."); // Debug log
          events = await getOrganizerEvents(user.uid, roleId);
        } else {
          console.error("Invalid role ID value:", roleId); // Debug log
          throw new Error(`Invalid role ID: ${roleId}`);
        }
      } else {
        console.error("Role ID is not a valid number:", roleId); // Debug log
        throw new Error("Role ID is not a valid number");
      }

      setEvents(events?.data || []);
      setLoading(false);
    } catch (err: any) {
      console.error("Error in fetchEvents:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchEventTypes = async () => {
    try {
      const response = await fetch(
        "https://asia-southeast1-evntgarde-event-management.cloudfunctions.net/getEventTypes",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setEventTypes(data.data);
      }
    } catch (err) {
      console.error("Error fetching event types:", err);
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

      console.log("eventData before payload", eventData);
      // Use event_type_id directly from eventData.eventType
      const eventTypeId = Number(eventData.eventType);
      console.log("eventTypeId:", eventTypeId, typeof eventTypeId);
      if (eventTypeId === null || isNaN(eventTypeId)) {
        throw new Error("Invalid event type selected.");
      }

      const eventPayload = {
        event_name: eventData.name,
        event_type_id: eventTypeId,
        start_date: eventData.startDate,
        end_date: eventData.endDate,
        start_time: eventData.startTime,
        end_time: eventData.endTime,
        event_location: eventData.location,
        // Optional/extra fields
        event_overview: eventData.overview,
        guests: eventData.numberOfGuests,
        attire: eventData.attire,
        services: Array.isArray(eventData.services)
          ? eventData.services.join(", ")
          : "",
        additional_services: Array.isArray(eventData.customServices)
          ? eventData.customServices.join(", ")
          : "",
        budget: eventData.budget,
        customer_id: user.uid,
        organizer_id: null,
        venue_id: null,
      };

      const response = await fetch(
        "https://asia-southeast1-evntgarde-event-management.cloudfunctions.net/createEvent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventPayload),
        }
      );

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
