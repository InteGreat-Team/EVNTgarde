import type React from "react";
import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { User, MapPin, Users } from "lucide-react";
import BookingStepsCard from "./BookingStepsCard";

// Define the Booking interface
interface Booking {
  id: number;
  type: string;
  date: string;
  endDate?: string;
  day: string;
  title: string;
  startTime: string;
  endTime: string;
  customer: string;
  location: string;
  guests: string;
  organizer?: string;
  requestedServices: { [key: string]: number };
  overview?: string;
  attire?: string;
  additionalServices?: string[];
}

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "overview" | "features" | "pricing";

interface ServiceData {
  name: string;
  subtext: string;
  message: string;
  image: File | null;
  features: { title: string; features: string[] }[];
  type: string;
  amount: string;
  organizerName?: string;
  requestedService?: string;
}

// Sample dummy bookings data
const dummyBookings: Booking[] = [
  {
    id: 1,
    type: "Wedding",
    date: "March 25, 2025",
    endDate: "March 26, 2025",
    day: "Wednesday",
    title: "Wedding Reception Program",
    startTime: "8:00 AM",
    endTime: "8:30 PM",
    customer: "JMiryang Wedding",
    location: "Location A",
    guests: "999",
    organizer: "Elite Events Co.",
    overview: "Wedding ng ino Mo",
    attire: "Black Tie",
    requestedServices: {
      "Wedding Planning": 120000,
      "Additional Services": 90000,
      "Confetti, Drones": 60000,
    },
  },
  {
    id: 2,
    type: "Corporate Seminar",
    date: "2025-05-20",
    day: "Tuesday",
    title: "Future of Technology",
    startTime: "9:00 AM",
    endTime: "4:00 PM",
    customer: "Tech Innovations Inc.",
    location: "Conference Hall 1",
    guests: "200",
    organizer: "Corporate Events Ltd.",
    requestedServices: {
      "Venue Rental": 50000,
      Catering: 40000,
      "AV Equipment": 30000,
      Speakers: 150000,
      "Printing & Materials": 15000,
    },
  },
  {
    id: 3,
    type: "Birthday Party",
    date: "2025-07-10",
    day: "Thursday",
    title: "Sweet Sixteen Bash",
    startTime: "7:00 PM",
    endTime: "11:00 PM",
    customer: "Jessica Miller",
    location: "The Party Place",
    guests: "80",
    requestedServices: {
      Catering: 60000,
      DJ: 40000,
      Decorations: 35000,
      Photography: 25000,
      Cake: 10000,
    },
  },
];

export const BookingStepsModal: React.FC<AddServiceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState<Step>("overview");
  const [serviceData, setServiceData] = useState<ServiceData>({
    name: "",
    subtext: "",
    message: "",
    image: null,
    features: [{ title: "", features: ["", ""] }],
    type: "Wedding Planning",
    amount: "",
    organizerName: "Wedding Ina Mo, Wedding Nating Lahat",
    requestedService: "Wedding Planning",
  });
  const [showBookingCard, setShowBookingCard] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Booking | null>(
    dummyBookings[0]
  ); // Default to first booking for demo
  const [bookings] = useState(dummyBookings);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [, setUserRole] = useState<"organizer" | "individual" | "vendor">(
    "organizer"
  );

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

  // Effect to prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save the current overflow style
      const originalStyle = window.getComputedStyle(document.body).overflow;

      // Prevent scrolling on the body
      document.body.style.overflow = "hidden";

      // Cleanup function to restore scrolling when component unmounts or modal closes
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]); // Re-run effect when isOpen changes

  if (!isOpen) return null;

  const validateOverview = () => {
    const newErrors: Record<string, boolean> = {};
    if (!selectedEvent) {
      newErrors.selectedEvent = true; // Add an error if no event is selected
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === "overview") {
      if (validateOverview()) {
        setCurrentStep("features");
      }
    } else if (currentStep === "features") {
      setCurrentStep("pricing");
    }
  };

  const handleBack = () => {
    if (currentStep === "features") {
      setCurrentStep("overview");
    } else if (currentStep === "pricing") {
      setCurrentStep("features");
    }
  };

  const handleFinish = () => {
    // Here you would typically save the data or perform an API call
    console.log("Service data:", serviceData);
    onClose();
  };

  const handleSelectEvent = (booking: Booking) => {
    setSelectedEvent(booking);
    setShowBookingCard(false);
    // Now the parent has the full booking object
    console.log("Selected event in parent:", booking);
    // Update parent UI with selectedEvent details
  };

  const handleChangeEvent = () => {
    setSelectedEvent(null);
    setShowBookingCard(true);
  };

  const displayEvents = () => {
    setShowBookingCard(true);
  };

  const renderTitle = () => "Book Organizer";

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl mx-6 relative max-h-[90vh] overflow-auto shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 z-10"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-[#2B579A] mb-8">
            {renderTitle()}
          </h2>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-10 px-4">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === "overview"
                    ? "bg-[#2B579A] text-white"
                    : "bg-[#2B579A] text-white"
                }`}
              >
                {currentStep === "overview" ? (
                  <span className="text-xs">01</span>
                ) : (
                  <Check size={16} className="text-white" />
                )}
              </div>
              <span className="text-xs mt-1 text-[#2B579A] font-medium">
                Select Event
              </span>
            </div>

            <div className="flex-1 h-1 bg-gray-300 mx-2">
              <div
                className={`h-full bg-[#2B579A] ${
                  currentStep === "features" || currentStep === "pricing"
                    ? "w-full"
                    : "w-0"
                }`}
              ></div>
            </div>

            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === "features"
                    ? "bg-[#2B579A] text-white"
                    : currentStep === "pricing"
                      ? "bg-[#2B579A] text-white"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {currentStep === "features" ? (
                  <span className="text-xs">02</span>
                ) : currentStep === "pricing" ? (
                  <Check size={16} className="text-white" />
                ) : (
                  <span className="text-xs">02</span>
                )}
              </div>
              <span
                className={`text-xs mt-1 ${
                  currentStep === "features"
                    ? "text-[#2B579A] font-medium"
                    : "text-gray-500"
                }`}
              >
                Set Payment
              </span>
            </div>

            <div className="flex-1 h-1 bg-gray-300 mx-2">
              <div
                className={`h-full bg-[#2B579A] ${currentStep === "pricing" ? "w-full" : "w-0"}`}
              ></div>
            </div>

            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === "pricing"
                    ? "bg-[#2B579A] text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                <span className="text-xs">03</span>
              </div>
              <span
                className={`text-xs mt-1 ${currentStep === "pricing" ? "text-[#2B579A] font-medium" : "text-gray-500"}`}
              >
                Finalize
              </span>
            </div>
          </div>

          {/* Step 1: Overview */}
          {currentStep === "overview" && (
            <div className="space-y-6 px-4">
              <div className="mt-8">
                {showBookingCard ? (
                  <BookingStepsCard
                    bookings={bookings} // Pass the booking list as a prop
                    onSelect={handleSelectEvent}
                    selectedEvent={selectedEvent}
                  />
                ) : selectedEvent ? (
                  <BookingStepsCard
                    bookings={[selectedEvent]} // Pass the booking list as a prop
                    onSelect={handleSelectEvent}
                    selectedEvent={selectedEvent}
                  />
                ) : (
                  <button
                    onClick={displayEvents}
                    className="w-full p-4 border border-dashed border-blue-300 rounded-md text-[#2B579A] flex items-center justify-center bg-blue-50 hover:bg-blue-100"
                  >
                    Select Event
                  </button>
                )}
              </div>
              {selectedEvent && (
                <>
                  <div className="flex justify-center mb-4">
                    <button
                      onClick={handleChangeEvent}
                      className="w-full bg-[#2B579A] hover:bg-blue-600 text-white text-sm font-medium py-2 rounded"
                    >
                      Change
                    </button>
                  </div>
                  <div className="gap-4 rounded-lg p-4 shadow-sm bg-white">
                    <h3 className="text-xl font-semibold text-[#2B579A]">
                      Event Summary
                    </h3>
                    <div className="grid grid-cols-2 gap-y-2 text-gray-500">
                      <div>Name</div>
                      <div>{selectedEvent.customer}</div>
                      <div>Overview</div>
                      <div>{selectedEvent.overview}</div>
                      <div>Type</div>
                      <div>{selectedEvent.type}</div>
                      <div>Date</div>
                      <div>{selectedEvent.date}</div>
                      <div>Time</div>
                      <div>
                        {selectedEvent.startTime} to {selectedEvent.endTime}
                      </div>
                      <div>Address</div>
                      <div>{selectedEvent.location}</div>
                      <div>Number of Guests</div>
                      <div>{selectedEvent.guests}</div>
                      <div>Attire</div>
                      <div>{selectedEvent.attire}</div>
                    </div>

                    <h3 className="text-xl font-semibold text-[#2B579A] mt-6">
                      Requested Services
                    </h3>
                    <div className="mt-2">
                      {Object.entries(selectedEvent.requestedServices).map(
                        ([service, cost]) => (
                          <div
                            key={service}
                            className="flex justify-between text-gray-500"
                          >
                            <div className="gap-y-2">{service}</div>
                            <div className="gap-y-2">
                              Php {cost.toLocaleString()}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </>
              )}
              {errors.selectedEvent && (
                <p className="text-red-500">
                  Please select an event before proceeding.
                </p>
              )}
              <div className="flex gap-4">
                <button
                  onClick={handleBack}
                  className="flex-1 py-3 px-6 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-base font-medium"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 py-3 px-6 bg-[#2B579A] text-white rounded-md hover:bg-blue-700 text-base font-medium"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Features */}
          {currentStep === "features" && (
            <div className="space-y-6 px-4">
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-[#4A6FBF] mb-2">
                  {selectedEvent
                    ? selectedEvent.title
                    : "Wedding Reception Program"}
                </h3>
                <p className="text-gray-600 text-sm">
                  {selectedEvent
                    ? `${selectedEvent.startTime} - ${selectedEvent.endTime}`
                    : "5:30 PM - 10:00 PM"}
                </p>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center text-gray-600 text-sm">
                    <User className="text-gray-400 mr-2" size={16} />
                    <span>
                      {selectedEvent ? selectedEvent.customer : "Customer Name"}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="text-gray-400 mr-2" size={16} />
                    <span>
                      {selectedEvent ? selectedEvent.location : "Location Name"}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Users className="text-gray-400 mr-2" size={16} />
                    <span>
                      {selectedEvent
                        ? `${selectedEvent.guests} Guests`
                        : "150 Guests"}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end mt-2">
                  <button className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 text-sm font-medium px-4 py-2 rounded">
                    Event Details
                  </button>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[#4A6FBF] mb-4">
                  Event Budget
                </h3>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">Total Budget</span>
                  <span className="font-medium">
                    Php{" "}
                    {selectedEvent
                      ? Object.values(selectedEvent.requestedServices)
                          .reduce((a: number, b: number) => a + b, 0)
                          .toLocaleString()
                      : "500,000"}
                  </span>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[#4A6FBF] mb-4">
                  Hire Organizer
                </h3>
                <p className="text-gray-600 mb-2">
                  Which organizer's service would you like for your event?
                </p>

                <div className="relative">
                  <select
                    className="w-full p-3 border border-gray-300 rounded-md text-base appearance-none bg-white pr-10"
                    value={serviceData.type}
                    onChange={(e) =>
                      setServiceData({ ...serviceData, type: e.target.value })
                    }
                  >
                    <option value="" disabled>
                      Choose Organizer Service
                    </option>
                    <option value="Wedding Planning">Wedding Planning</option>
                    <option value="Birthday Planning">Birthday Planning</option>
                    <option value="Educational Convention Planning">
                      Educational Convention Planning
                    </option>
                    <option value="Corporate Event Planning">
                      Corporate Event Planning
                    </option>
                    <option value="Social Gathering Planning">
                      Social Gathering Planning
                    </option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleBack}
                  className="flex-1 py-3 px-6 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-base font-medium"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 py-3 px-6 bg-[#2B579A] text-white rounded-md hover:bg-blue-700 text-base font-medium"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Pricing/Finalize */}
          {currentStep === "pricing" && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-[#2B579A] mb-4">
                  Event Summary
                </h3>

                <div className="grid grid-cols-2 gap-y-4">
                  <div className="text-sm text-gray-600">Name</div>
                  <div className="text-sm">{selectedEvent?.customer}</div>

                  <div className="text-sm text-gray-600">Overview</div>
                  <div className="text-sm">
                    {selectedEvent?.overview || "Wedding ng ino Mo"}
                  </div>

                  <div className="text-sm text-gray-600">Date</div>
                  <div className="text-sm">
                    {selectedEvent?.date}{" "}
                    {selectedEvent?.endDate
                      ? `to ${selectedEvent.endDate}`
                      : ""}
                  </div>

                  <div className="text-sm text-gray-600">Time</div>
                  <div className="text-sm">
                    {selectedEvent?.startTime} to {selectedEvent?.endTime}
                  </div>

                  <div className="text-sm text-gray-600">Number of Guest</div>
                  <div className="text-sm">{selectedEvent?.guests}</div>

                  <div className="text-sm text-gray-600">Address</div>
                  <div className="text-sm">{selectedEvent?.location}</div>

                  <div className="text-sm text-gray-600">Type</div>
                  <div className="text-sm">{selectedEvent?.type}</div>

                  <div className="text-sm text-gray-600">Attire</div>
                  <div className="text-sm">
                    {selectedEvent?.attire || "Black Tie"}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-[#2B579A] mb-4">
                  Event Budget
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Budget</span>
                  <span className="text-sm font-medium">
                    Php{" "}
                    {selectedEvent
                      ? Object.values(selectedEvent.requestedServices)
                          .reduce((a: number, b: number) => a + b, 0)
                          .toLocaleString()
                      : "500,000"}
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-[#2B579A] mb-4">
                  Organizer Details
                </h3>

                <div className="grid grid-cols-2 gap-y-4">
                  <div className="text-sm text-gray-600">Organizer Name</div>
                  <div className="text-sm">{serviceData.organizerName}</div>

                  <div className="text-sm text-gray-600">Requested Service</div>
                  <div className="text-sm">{serviceData.requestedService}</div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleBack}
                  className="flex-1 py-3 px-6 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-base font-medium"
                >
                  Back
                </button>
                <button
                  onClick={handleFinish}
                  className="flex-1 py-3 px-6 bg-[#2B579A] text-white rounded-md hover:bg-blue-700 text-base font-medium"
                >
                  Book
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
