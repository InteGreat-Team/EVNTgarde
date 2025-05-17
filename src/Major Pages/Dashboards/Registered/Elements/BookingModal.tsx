import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  organizerName: string;
}

const allEvents = [
  {
    title: "Wedding Planning",
    price: "Php 90,000",
    intro:
      "Let us handle every detail, so you can fully savor your special day.",
    fullDetails: `At Eventify, we understand that planning a wedding can be both exciting and overwhelming. Our Full Wedding Planning service is designed to take the stress out of the process, allowing you to relax and enjoy every moment leading up to and on your wedding day.

From the initial concept to the final farewell, we meticulously manage every detail to create a celebration that perfectly reflects your unique style and vision.`,
    included: [
      {
        section: "Initial Consultation & Vision Development:",
        bullets: [
          "In-depth discussions to understand your vision, preferences, style, and budget.",
          "Conceptualization of the wedding theme, color palette, and overall aesthetic.",
          "Development of a detailed wedding plan and timeline.",
        ],
      },
      {
        section: "Budget Management:",
        bullets: [
          "Creation of a realistic and detailed budget.",
          "Tracking expenses and ensuring adherence to the agreed-upon budget.",
          "Negotiation with vendors to secure the best possible rates.",
        ],
      },
      {
        section: "Venue Sourcing & Management:",
        bullets: [
          "Scheduling and accompanying you on venue visits.",
          "Negotiating and managing venue contracts.",
          "Liaising with the venue coordinator throughout the planning process.",
        ],
      },
    ],
  },
  {
    title: "Birthday Planning",
    price: "Php 50,000",
    intro: "Celebrate birthdays in unforgettable ways.",
    fullDetails:
      "Whether for kids, teens, or adults, we plan birthday parties tailored to your dream theme...",
    included: [
      {
        section: "Birthday Setup",
        bullets: ["Decorations", "Games", "Cake setup"],
      },
    ],
  },
  {
    title: "Social Event Planning",
    price: "Php 70,000",
    intro: "Memorable social events made simple.",
    fullDetails:
      "From intimate gatherings to grand socials, we ensure your event is remarkable...",
    included: [
      {
        section: "Social Coordination",
        bullets: ["Guest management", "Program hosting"],
      },
    ],
  },
  {
    title: "Corporate Event Planning",
    price: "Php 99,999",
    intro: "Professional and seamless corporate events.",
    fullDetails:
      "Be it seminars, launches, or year-end parties, we handle the pressure so you don't have to...",
    included: [
      {
        section: "Corporate Services",
        bullets: ["Venue booking", "Speaker management"],
      },
    ],
  },
  {
    title: "Charity Gala Planning",
    price: "Php 120,000",
    intro: "Elegant and impactful charity galas.",
    fullDetails:
      "From donor engagement to event execution, we help you make a difference in style...",
    included: [
      {
        section: "Charity Setup",
        bullets: ["Auction management", "Guest VIP handling"],
      },
    ],
  },
  {
    title: "Debut Planning",
    price: "Php 85,000",
    intro: "A magical debut night, just for you.",
    fullDetails:
      "Celebrate your milestone with an unforgettable debut experience...",
    included: [
      {
        section: "Debut Coordination",
        bullets: ["18 Roses", "18 Candles", "18 Treasures"],
      },
    ],
  },
];

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  onContinue,
  organizerName,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [userRole, setUserRole] = useState<
    "organizer" | "individual" | "vendor"
  >("individual");

  const handleOutsideClick = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    if (
      storedUserType === "organizer" ||
      storedUserType === "individual" ||
      storedUserType === "vendor"
    ) {
      setUserRole(storedUserType as "organizer" | "individual" | "vendor");
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const renderButton = () => {
    if (userRole === "organizer")
      return (
        <button
          onClick={onContinue}
          className="w-full bg-[#2B579A] text-white py-3 rounded-lg hover:bg-blue-600 transition"
        >
          Book Vendor
        </button>
      );
    else if (userRole === "individual")
      return (
        <button
          onClick={onContinue}
          className="w-full bg-[#2B579A] text-white py-3 rounded-lg hover:bg-blue-600 transition"
        >
          Book Organizer
        </button>
      );
    else return null;
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg p-6 w-full max-w-3xl shadow-lg max-h-[90vh] overflow-y-auto relative"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <X size={20} />
        </button>
        <h2 className="text-lg font-semibold mb-4 text-center">
          {organizerName} Full Event Management List
        </h2>

        {allEvents.map((event, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-md mb-4 overflow-hidden"
          >
            <button
              onClick={() => toggleExpand(index)}
              className="w-full flex justify-between items-center py-4 pl-5 pr-5 bg-gray-100 hover:bg-gray-200"
            >
              <span className="font-medium text-gray-800">{event.title}</span>
              {expandedIndex === index ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>

            {expandedIndex === index && (
              <div className="p-4 space-y-4 text-sm text-gray-700 bg-white">
                <p className="italic text-gray-600">{event.intro}</p>
                <p>{event.fullDetails}</p>

                {event.included.map((section, secIdx) => (
                  <div key={secIdx}>
                    <h4 className="font-semibold mb-1">{section.section}</h4>
                    <ul className="list-disc pl-13 space-y-2">
                      {section.bullets.map((bullet, bIdx) => (
                        <li key={bIdx}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}

                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="font-semibold">Full Package</span>
                  <span className="text-blue-600 font-medium">
                    {event.price}
                  </span>
                </div>

                {renderButton()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingModal;
