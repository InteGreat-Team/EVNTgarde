import React from "react";
import { User } from "lucide-react";

interface ServicesTabProps {
  selectedBooking: {
    id: number;
    title: string;
    guests: string;
    [key: string]: any;
  };
}

const ServicesTab: React.FC<ServicesTabProps> = ({ }) => {
  const services = [
    { id: 1, name: "Catering Services", price: "PHP 560,000" },
    { id: 2, name: "Catering Services", price: "PHP 560,000" },
    { id: 3, name: "Catering Services", price: "PHP 560,000" },
  ];

  return (
    <div className="p-4">
      <p className="text-gray-600 mb-4">List of requested services by the customer</p>
      {services.map((service) => (
        <div key={service.id} className="flex justify-between items-center mb-4 border-b pb-4">
          <div className="flex items-center">
            <div className="bg-gray-100 p-2 rounded-full mr-3">
              <User size={20} className="text-gray-500" />
            </div>
            <span>{service.name}</span>
          </div>
          <div>
            <p className="text-blue-600 font-medium">{service.price}</p>
            <p className="text-gray-500 text-sm">Included</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServicesTab;
