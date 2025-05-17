import React, { useState } from "react";
import Card from "./EventCards";
import EventModal from "./EventModal";

const allEvents = [
  {
    title: "Standard Package",
    price: "Php 40,000",
    intro: "Simple yet complete event solutions.",
    fullDetails: "Our standard package covers the essentials for a memorable event without breaking the budget.",
    included: [
      { section: "Services Included", bullets: ["Basic catering", "Standard decorations", "Sound system rental"] }
    ]
  },
  {
    title: "Luxury Package",
    price: "Php 70,000",
    intro: "Elevate your event to a luxurious experience.",
    fullDetails: "The luxury package includes premium services to make your event stand out with elegance.",
    included: [
      { section: "Luxury Services", bullets: ["Premium catering", "Luxury decorations", "Full lighting setup"] }
    ]
  },
  {
    title: "Budget Package",
    price: "Php 120,000",
    intro: "Affordable yet complete event solution.",
    fullDetails: "Ideal for clients who want to maximize their event while staying within budget.",
    included: [
      { section: "Included Features", bullets: ["Simple catering", "Basic decor", "Microphone and speaker rental"] }
    ]
  },
  {
    title: "Standard Package II",
    price: "Php 40,000",
    intro: "Another version of our best-selling standard package.",
    fullDetails: "This covers everything needed for your event to succeed smoothly.",
    included: [
      { section: "Standard Features", bullets: ["Buffet catering", "Basic stage setup", "Free consultation"] }
    ]
  },
  {
    title: "Luxury Package II",
    price: "Php 70,000",
    intro: "A second luxury option for a grander affair.",
    fullDetails: "More exclusive venues and premium suppliers to suit your luxurious needs.",
    included: [
      { section: "Exclusive Services", bullets: ["VIP guest handling", "Premium souvenirs", "Red carpet setup"] }
    ]
  },
  {
    title: "Budget Package II",
    price: "Php 120,000",
    intro: "Second version of our popular affordable package.",
    fullDetails: "Providing more flexible options for different client needs without sacrificing quality.",
    included: [
      { section: "Features", bullets: ["Affordable catering", "Standard sound system", "Basic event coordinator"] }
    ]
  }
];

interface Props {
  onBack: () => void;
  onAdd: () => void;
}

const EventManagement: React.FC<Props> = ({ onBack, onAdd }) => {
  const [selectedService, setSelectedService] = useState<typeof allEvents[0] | null>(null);

  const handleView = (service: typeof allEvents[0]) => {
    setSelectedService(service);
  };

  const handleClose = () => {
    setSelectedService(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="text-blue-600 font-medium hover:underline"
        >
          &larr; Back
        </button>
        <button
          onClick={onAdd}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          + Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {allEvents.map((service, idx) => (
          <Card
            key={idx}
            title={service.title}
            price={service.price}
            onView={() => handleView(service)}
          />
        ))}
      </div>

      {/* Modal */}
      {selectedService && (
        <EventModal
          title={selectedService.title}
          intro={selectedService.intro}
          fullDetails={selectedService.fullDetails}
          included={selectedService.included}
          price={selectedService.price}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default EventManagement;
