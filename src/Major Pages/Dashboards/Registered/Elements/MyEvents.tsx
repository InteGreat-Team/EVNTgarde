import React from "react";
import { EventCard } from "./EventCards";
import clipboardImage from "../../../../assets/clipboard.png";

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
  onBack?: () => void;
  onAdd: () => void;
}

const MyEvents: React.FC<Props> = ({ onAdd }) => {
  return (
    <div className="p-5 space-y-5">
      <div>
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-2xl font-semibold">My Events</h1>
          <button
            onClick={onAdd}
            className="bg-blue-800 text-white mr-8 px-4 py-2 rounded hover:bg-blue-800 transition"
          >
            + Create Event
          </button>
        </div>
        <p className="text-gray-600">{allEvents.length} events created</p>
      </div>

      {allEvents.length === 0 ? (
        <div className="bg-gray-100 p-8 rounded-lg flex flex-col items-center space-y-4">
          <img src={clipboardImage} alt="Clipboard" className="w-16 h-16" />
          <p className="text-gray-700 text-lg font-semibold">
            You have not created an event yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {allEvents.map((event, idx) => (
            <EventCard
              key={idx}
              name={event.name}
              date={event.date}
              location={event.location}
              guests={event.guests}
              image={event.image}
              description={event.description}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEvents;
