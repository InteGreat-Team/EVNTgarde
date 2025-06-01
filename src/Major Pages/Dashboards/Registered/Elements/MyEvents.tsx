import type React from "react"
import { useState } from "react"
import Card from "./MyEventsCard"
import clipboardImage from "../../../../assets/clipboard.png"
import { CreateEventModal } from "./CreateEventModal"
import { EventDetailsView } from "./EventDetailsView"
import type { EventData, ExtendedEventData } from "../../../../functions/types"

// mockEvents if there are no events
//const allEvents: any[] = []

// mockEvents if there are events
const initialMockEvents: ExtendedEventData[] = [
  {
    id: 1,
    name: "Aliana's Birthday Party",
    title: "Aliana's Birthday Party",
    date: "2025-09-11",
    location: "UP Diliman, Quezon City",
    guests: 1234,
    price: "Php 150,000",
    attire: "Casual",
    image: "/placeholder.svg",
    description:
      "A fun-filled birthday celebration with friends and family featuring live music, games, and delicious food.",
    overview:
      "A fun-filled birthday celebration with friends and family featuring live music, games, and delicious food.",
    intro: "A fun-filled birthday celebration with friends and family featuring live music, games, and delicious food.",
    fullDetails:
      "A fun-filled birthday celebration with friends and family featuring live music, games, and delicious food.",
    dateCreated: "2025-01-15T10:30:00.000Z",
    included: [
      {
        section: "Event Details",
        bullets: [
          "Date: Sept 11, 2025",
          "Time: 5:00 PM to 10:00 PM",
          "Location: UP Diliman, Quezon City",
          "Type: Birthday",
          "Attire: Casual",
          "Guests: 1,234",
        ],
      },
      {
        section: "Services",
        bullets: ["Catering Services", "Photography", "Sound System"],
      },
    ],
    eventType: "Birthday",
    startDate: "2025-09-11",
    endDate: "2025-09-11",
    startTime: "17:00",
    endTime: "22:00",
    numberOfGuests: 1234,
    services: ["Catering Services", "Sound System"],
    customServices: ["Photography"],
    budget: "Php 150,000",
    files: [],
  },
  {
    id: 2,
    name: "Corporate Annual Gala",
    title: "Corporate Annual Gala",
    date: "2025-12-15",
    location: "Manila Hotel, Ermita, Manila",
    guests: 500,
    price: "Php 800,000",
    attire: "Formal",
    image: "/placeholder.svg",
    description:
      "An elegant corporate gala dinner celebrating the company's achievements with awards ceremony and networking.",
    overview:
      "An elegant corporate gala dinner celebrating the company's achievements with awards ceremony and networking.",
    intro:
      "An elegant corporate gala dinner celebrating the company's achievements with awards ceremony and networking.",
    fullDetails:
      "An elegant corporate gala dinner celebrating the company's achievements with awards ceremony and networking.",
    dateCreated: "2025-01-10T14:20:00.000Z",
    included: [
      {
        section: "Event Details",
        bullets: [
          "Date: Dec 15, 2025",
          "Time: 6:00 PM to 11:00 PM",
          "Location: Manila Hotel, Ermita, Manila",
          "Type: Corporate",
          "Attire: Formal",
          "Guests: 500",
        ],
      },
      {
        section: "Services",
        bullets: ["Premium Catering", "Event Coordination", "Audio Visual Equipment", "Floral Arrangements"],
      },
    ],
    eventType: "Corporate",
    startDate: "2025-12-15",
    endDate: "2025-12-15",
    startTime: "18:00",
    endTime: "23:00",
    numberOfGuests: 500,
    services: ["Premium Catering", "Event Coordination", "Audio Visual Equipment"],
    customServices: ["Floral Arrangements"],
    budget: "Php 800,000",
    files: [],
  },
  {
    id: 3,
    name: "Sarah & John's Wedding",
    title: "Sarah & John's Wedding",
    date: "2025-06-20",
    location: "Tagaytay Highlands, Cavite",
    guests: 200,
    price: "Php 500,000",
    attire: "Formal",
    image: "/placeholder.svg",
    description: "A romantic garden wedding ceremony and reception with breathtaking views of Taal Lake and volcano.",
    overview: "A romantic garden wedding ceremony and reception with breathtaking views of Taal Lake and volcano.",
    intro: "A romantic garden wedding ceremony and reception with breathtaking views of Taal Lake and volcano.",
    fullDetails: "A romantic garden wedding ceremony and reception with breathtaking views of Taal Lake and volcano.",
    dateCreated: "2025-01-05T09:15:00.000Z",
    included: [
      {
        section: "Event Details",
        bullets: [
          "Date: June 20, 2025",
          "Time: 3:00 PM to 10:00 PM",
          "Location: Tagaytay Highlands, Cavite",
          "Type: Wedding",
          "Attire: Formal",
          "Guests: 200",
        ],
      },
      {
        section: "Services",
        bullets: ["Wedding Catering", "Bridal Car", "Wedding Photography", "Videography", "Flowers & Decoration"],
      },
    ],
    eventType: "Wedding",
    startDate: "2025-06-20",
    endDate: "2025-06-20",
    startTime: "15:00",
    endTime: "22:00",
    numberOfGuests: 200,
    services: ["Wedding Catering", "Wedding Photography", "Videography"],
    customServices: ["Bridal Car", "Flowers & Decoration"],
    budget: "Php 500,000",
    files: [],
  },
]

interface Props {
  onBack: () => void
  onAdd: () => void
}

const MyEvents: React.FC<Props> = ({ onAdd }) => {
  const [selectedEvent, setSelectedEvent] = useState<ExtendedEventData | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [events, setEvents] = useState<ExtendedEventData[]>(initialMockEvents)
  const [showEventDetails, setShowEventDetails] = useState(false)

  const handleView = (event: ExtendedEventData) => {
    setSelectedEvent(event)
    setShowEventDetails(true)
  }

  const handleBackToList = () => {
    setShowEventDetails(false)
    setSelectedEvent(null)
  }

  const handleCreateEvent = () => {
    // Call the original onAdd function for backward compatibility
    if (onAdd) onAdd()

    // Open the create event modal
    setIsCreateModalOpen(true)
  }

  const handleSaveEvent = (eventData: EventData) => {
    // Create a new event object from the form data
    const newEvent: ExtendedEventData = {
      ...eventData, // Spread all EventData properties
      id: Date.now(), // Simple ID generation
      date: eventData.startDate, // For backward compatibility with card display
      guests: eventData.numberOfGuests, // For backward compatibility
      image: "/placeholder.svg",
      description: eventData.overview,
      dateCreated: new Date().toISOString(),
      // Legacy fields for backward compatibility
      title: eventData.name,
      price: eventData.budget,
      intro: eventData.overview.substring(0, 100) + (eventData.overview.length > 100 ? "..." : ""),
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
    }

    // Add the new event to the events array
    setEvents((prevEvents) => [...prevEvents, newEvent])
  }

  // Show event details view if an event is selected
  if (showEventDetails && selectedEvent) {
    return <EventDetailsView event={selectedEvent} onBack={handleBackToList} />
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
          <img src={clipboardImage || "/placeholder.svg"} alt="Clipboard" className="w-16 h-16" />
          <p className="text-gray-700 text-lg font-semibold">You have not created an event yet.</p>
        </div>
      )}

      {/* Display event cards if there are events */}
      {events.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {events.map((event) => (
            <Card
              key={event.id}
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
          handleSaveEvent(eventData)
          setIsCreateModalOpen(false)
        }}
      />
    </div>
  )
}

export default MyEvents
