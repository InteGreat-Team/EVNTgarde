import { MapPinIcon, UsersIcon } from "lucide-react";

export interface EventCardProps {
  name: string;
  date: string;
  location: string;
  guests: number;
  image: string;
  description: string;
  onView: () => void;
}

const EventCard: React.FC<EventCardProps> = ({
  name,
  date,
  location,
  guests,
  image,
  description,
  onView,
}) => {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  return (
    <div className=" w-full bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden">
      <img src={image} alt={name} className="w-full h-60 object-cover" />
      <div className="p-5 space-y-1">
        <h2 className="text-lg font-bold text-blue-800">{name}</h2>
        <div className="flex items-center text-sm text-gray-600">
          {formattedDate}
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <MapPinIcon className="w-4 h-4 mr-1" />
          {location}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <UsersIcon className="w-4 h-4 mr-1" />
          {guests.toLocaleString()} Guests
        </div>
        <p className="text-sm text-black mt-2">{description}</p>
        <button
          onClick={onView}
          className="bg-yellow-400 text-sm font-medium text-black px-3 py-1 rounded mt-2 hover:bg-yellow-500 transition"
        >
          Event Details
        </button>
      </div>
    </div>
  );
};

export default EventCard;
