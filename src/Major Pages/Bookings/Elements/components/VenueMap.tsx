import React from "react";
import { MapPin } from "lucide-react";

interface VenueMapTabProps {
  selectedBooking: {
    id: number;
    location: string;
    [key: string]: any;
  };
}

const VenueMapTab: React.FC<VenueMapTabProps> = ({ }) => {
  const venueDetails = {
    name: "Blessed Pier Giorgio Frassati Building Auditorium",
    floor: "21st Floor, Blessed Pier Giorgio Frassati Building",
    zipCode: "101",
    street: "España Blvd, Sampaloc, Manila, Metro Manila",
    country: "Philippines",
  };

  return (
    <div className="p-4">
      <div className="bg-gray-100 rounded-lg w-full h-48 relative mb-6">
        <div className="absolute inset-0 flex items-center justify-center">
          <MapPin className="text-red-500" size={32} />
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{venueDetails.name}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 text-sm">Floor, Building</p>
            <p className="font-medium">{venueDetails.floor}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">ZIP Code</p>
            <p className="font-medium">{venueDetails.zipCode}</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-gray-500 text-sm">Street Address, District, City, Province/State</p>
          <p className="font-medium">{venueDetails.street}</p>
        </div>
        <div className="mt-4">
          <p className="text-gray-500 text-sm">Country</p>
          <p className="font-medium">{venueDetails.country}</p>
        </div>
      </div>
    </div>
  );
};

export default VenueMapTab;
