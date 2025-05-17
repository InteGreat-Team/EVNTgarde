import React from "react";

interface EventCardProps {
  title: string;
  price: string;
  onView: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ title, price, onView }) => {
  return (
    <div className="border border-gray-300 rounded-lg shadow p-4 flex flex-col justify-between h-[250px] transform transition-transform duration-300 hover:-translate-y-2">
      <div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
      </div>

      <div className="flex flex-col">
        <p className="text-gray-600 mb-2">{price}</p>
        <button
          onClick={onView}
          className="bg-blue-800 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          View
        </button>
      </div>
    </div>
  );
};

export default EventCard;
