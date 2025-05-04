import React, { useState } from "react";
import EventCard from "./EventCards";
import EventModal from "./EventModal";

const mockEvents = [
  {
    title: "Wedding Planning",
    price: "Php 90,000",
    intro: "Let us handle every detail, so you can fully savor your special day.",
    fullDetails: `At Eventify, we understand that planning a wedding can be both exciting and overwhelming. Our Full Wedding Planning service is designed to take the stress out of the process, allowing you to relax and enjoy every moment leading up to and on your wedding day.

From the initial concept to the final farewell, we meticulously manage every detail to create a celebration that perfectly reflects your unique style and vision.`,
    included: [
      {
        section: "Initial Consultation & Vision Development:",
        bullets: [
          "In-depth discussions to understand your vision, preferences, style, and budget.",
          "Conceptualization of the wedding theme, color palette, and overall aesthetic.",
          "Development of a detailed wedding plan and timeline."
        ]
      },
      {
        section: "Budget Management:",
        bullets: [
          "Creation of a realistic and detailed budget.",
          "Tracking expenses and ensuring adherence to the agreed-upon budget.",
          "Negotiation with vendors to secure the best possible rates."
        ]
      },
      {
        section: "Venue Sourcing & Management:",
        bullets: [
          "Scheduling and accompanying you on venue visits.",
          "Negotiating and managing venue contracts.",
          "Liaising with the venue coordinator throughout the planning process."
        ]
      }
    ]
  },
  {
    title: "Birthday Planning",
    price: "Php 50,000",
    intro: "Celebrate your birthday with ease and style!",
    fullDetails: "We specialize in memorable birthday experiences for all ages.",
    included: [
      { section: "Theme Setup", bullets: ["Decorations", "Program", "Games"] }
    ]
  },
  {
    title: "Social Event Planning",
    price: "Php 70,000",
    intro: "Make your social gatherings unforgettable.",
    fullDetails: "Attention to every detail for a memorable event.",
    included: [
      { section: "Logistics", bullets: ["Guest list", "Catering", "Program flow"] }
    ]
  },
  {
    title: "Corporate Event Planning",
    price: "Php 99,999",
    intro: "Professional execution for your company events.",
    fullDetails: "Conferences, seminars, and formal gatherings handled professionally.",
    included: [
      { section: "Corporate Services", bullets: ["Venue booking", "Speaker coordination", "Sponsor management"] }
    ]
  },
  {
    title: "Charity Gala Planning",
    price: "Php 120,000",
    intro: "Elegant and impactful charity events.",
    fullDetails: "Fundraising strategies, auction management, and donor engagement.",
    included: [
      { section: "Fundraising Setup", bullets: ["Silent auction", "VIP donor care", "Event marketing"] }
    ]
  },
  {
    title: "Debut Planning",
    price: "Php 85,000",
    intro: "Celebrate your milestone debut in style.",
    fullDetails: "We coordinate the full 18 Roses, 18 Candles, and 18 Treasures program.",
    included: [
      { section: "Debut Coordination", bullets: ["Program design", "Event styling", "Host management"] }
    ]
  }
];

const mockServiceInclusions = [
  {
    title: "Standard Package",
    price: "Php 40,000",
    intro: "Simple yet complete event solutions.",
    fullDetails: "Ideal for small events needing essentials.",
    included: [
      { section: "Services Included", bullets: ["Basic catering", "Simple decorations", "Sound system"] }
    ]
  },
  {
    title: "Premium Package",
    price: "Php 70,000",
    intro: "Upgraded experience for special occasions.",
    fullDetails: "Better decoration, menu options, and entertainment.",
    included: [
      { section: "Services Included", bullets: ["Full catering", "Elegant decorations", "Live music"] }
    ]
  },
  {
    title: "Luxury Package",
    price: "Php 120,000",
    intro: "Luxury experience with top-tier services.",
    fullDetails: "Exclusive designs, premium menus, luxury options.",
    included: [
      { section: "Luxury Features", bullets: ["Exclusive venue", "Premium catering", "Celebrity host"] }
    ]
  },
  {
    title: "Standard Package II",
    price: "Php 40,000",
    intro: "Simple yet complete event solutions.",
    fullDetails: "Ideal for small events needing essentials.",
    included: [
      { section: "Services Included", bullets: ["Basic catering", "Simple decorations", "Sound system"] }
    ]
  },
  {
    title: "Premium Package II",
    price: "Php 70,000",
    intro: "Upgraded experience for special occasions.",
    fullDetails: "Better decoration, menu options, and entertainment.",
    included: [
      { section: "Services Included", bullets: ["Full catering", "Elegant decorations", "Live music"] }
    ]
  },
  {
    title: "Luxury Package II",
    price: "Php 120,000",
    intro: "Luxury experience with top-tier services.",
    fullDetails: "Exclusive designs, premium menus, luxury options.",
    included: [
      { section: "Luxury Features", bullets: ["Exclusive venue", "Premium catering", "Celebrity host"] }
    ]
  }
];

interface EventCarouselProps {
  onManageEvents: () => void;
  onManageServices: () => void;
}

const EventCarousel: React.FC<EventCarouselProps> = ({ onManageEvents, onManageServices }) => {
  const [selectedEvent, setSelectedEvent] = useState<typeof mockEvents[0] | null>(null);
  const [selectedService, setSelectedService] = useState<typeof mockServiceInclusions[0] | null>(null);
  const [eventPage, setEventPage] = useState(0);
  const [servicePage, setServicePage] = useState(0);

  const cardsPerPage = 3;

  const eventPages = Math.ceil(mockEvents.length / cardsPerPage);
  const servicePages = Math.ceil(mockServiceInclusions.length / cardsPerPage);

  const nextEventPage = () => {
    if (eventPage < eventPages - 1) setEventPage(eventPage + 1);
  };
  const prevEventPage = () => {
    if (eventPage > 0) setEventPage(eventPage - 1);
  };
  const nextServicePage = () => {
    if (servicePage < servicePages - 1) setServicePage(servicePage + 1);
  };
  const prevServicePage = () => {
    if (servicePage > 0) setServicePage(servicePage - 1);
  };

  return (
    <div className="space-y-12">
      {/* Event Management Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold cursor-pointer" onClick={onManageEvents}>
            Event Management &gt;
          </h2>
        </div>

        <div className="relative flex items-center">
          <button
            onClick={prevEventPage}
            disabled={eventPage === 0}
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full shadow-md z-10 ${
              eventPage === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-white hover:bg-gray-200"
            }`}
          >
            &lt;
          </button>

          <div className="flex gap-4 justify-center w-full transition-transform duration-500">
            {mockEvents
              .slice(eventPage * cardsPerPage, (eventPage + 1) * cardsPerPage)
              .map((event, index) => (
                <div key={index} className="w-[75vw] sm:w-[300px] md:w-[340px] lg:w-[380px]">
                  <EventCard
                    title={event.title}
                    price={event.price}
                    onView={() => setSelectedEvent(event)}
                  />
                </div>
              ))}
          </div>

          <button
            onClick={nextEventPage}
            disabled={eventPage === eventPages - 1}
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full shadow-md z-10 ${
              eventPage === eventPages - 1 ? "bg-gray-300 cursor-not-allowed" : "bg-white hover:bg-gray-200"
            }`}
          >
            &gt;
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center space-x-2 pt-4">
          {Array.from({ length: eventPages }).map((_, idx) => (
            <span
              key={idx}
              className={`h-2 w-2 rounded-full ${idx === eventPage ? "bg-blue-600" : "bg-gray-300"}`}
            />
          ))}
        </div>
      </div>

      {/* Service Inclusion Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold cursor-pointer" onClick={onManageServices}>
            Service Inclusion &gt;
          </h2>
        </div>

        <div className="relative flex items-center">
          <button
            onClick={prevServicePage}
            disabled={servicePage === 0}
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full shadow-md z-10 ${
              servicePage === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-white hover:bg-gray-200"
            }`}
          >
            &lt;
          </button>

          <div className="flex gap-4 justify-center w-full transition-transform duration-500">
            {mockServiceInclusions
              .slice(servicePage * cardsPerPage, (servicePage + 1) * cardsPerPage)
              .map((service, index) => (
                <div key={index} className="w-[75vw] sm:w-[300px] md:w-[340px] lg:w-[380px]">
                  <EventCard
                    title={service.title}
                    price={service.price}
                    onView={() => setSelectedService(service)}
                  />
                </div>
              ))}
          </div>

          <button
            onClick={nextServicePage}
            disabled={servicePage === servicePages - 1}
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full shadow-md z-10 ${
              servicePage === servicePages - 1 ? "bg-gray-300 cursor-not-allowed" : "bg-white hover:bg-gray-200"
            }`}
          >
            &gt;
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center space-x-2 pt-4">
          {Array.from({ length: servicePages }).map((_, idx) => (
            <span
              key={idx}
              className={`h-2 w-2 rounded-full ${idx === servicePage ? "bg-blue-600" : "bg-gray-300"}`}
            />
          ))}
        </div>
      </div>

      {/* Modals */}
      {selectedEvent && (
        <EventModal
          title={selectedEvent.title}
          intro={selectedEvent.intro}
          fullDetails={selectedEvent.fullDetails}
          included={selectedEvent.included}
          price={selectedEvent.price}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {selectedService && (
        <EventModal
          title={selectedService.title}
          intro={selectedService.intro}
          fullDetails={selectedService.fullDetails}
          included={selectedService.included}
          price={selectedService.price}
          onClose={() => setSelectedService(null)}
        />
      )}
    </div>
  );
};

export default EventCarousel;
