"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { X, Check } from "lucide-react";
import BookingStepsCard from "./BookingStepsCard";

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "overview" | "features" | "pricing";

interface ServiceFeature {
  title: string;
  features: string[];
}

interface ServiceData {
  name: string;
  subtext: string;
  message: string;
  image: File | null;
  features: ServiceFeature[];
  type: string;
  amount: string;
}

type Booking = {
  id: number;
  type: string;
  date: string;
  day: string;
  title: string;
  startTime: string;
  endTime: string;
  customer: string;
  location: string;
  guests: string;
  organizer?: string;
  requestedServices: { [key: string]: number }; // Flexible object for services
};

const dummyBookings: Booking[] = [
  {
    id: 1,
    type: "Wedding Reception",
    date: "2025-01-01",
    day: "Wednesday",
    title: "Grand Wedding Celebration",
    startTime: "5:30 PM",
    endTime: "10:00 PM",
    customer: "Mr. & Mrs. Smith",
    location: "Ballroom A",
    guests: "150",
    organizer: "Elite Events Co.",
    requestedServices: {
      Catering: 120000,
      "Sound & Lighting": 90000,
      "Floral Arrangements": 60000,
      Band: 110000,
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
    type: "",
    amount: "",
  });
  const [showBookingCard, setShowBookingCard] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Booking | null>(null);
  const [bookings] = useState(dummyBookings);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userRole, setUserRole] = useState<
    "organizer" | "individual" | "vendor"
  >("individual");

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

  const validateFeatures = () => {
    const newErrors: Record<string, boolean> = {};

    serviceData.features.forEach((feature, featureIndex) => {
      if (!feature.title.trim()) {
        newErrors[`featureTitle-${featureIndex}`] = true;
      }

      feature.features.forEach((featureItem, featureItemIndex) => {
        if (!featureItem.trim()) {
          newErrors[`feature-${featureIndex}-${featureItemIndex}`] = true;
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePricing = () => {
    const newErrors: Record<string, boolean> = {};
    if (!serviceData.type.trim()) newErrors.type = true;
    if (!serviceData.amount.trim()) newErrors.amount = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === "overview") {
      if (validateOverview()) {
        setCurrentStep("features");
      }
    } else if (currentStep === "features") {
      if (validateFeatures()) {
        setCurrentStep("pricing");
      }
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
    if (validatePricing()) {
      // Here you would typically save the data or perform an API call
      console.log("Service data:", serviceData);
      onClose();
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setServiceData({
        ...serviceData,
        image: e.target.files[0],
      });
    }
  };

  const addFeature = (featureIndex: number) => {
    const updatedFeatures = [...serviceData.features];
    updatedFeatures[featureIndex].features.push("");
    setServiceData({
      ...serviceData,
      features: updatedFeatures,
    });
  };

  const addServiceFeature = () => {
    setServiceData({
      ...serviceData,
      features: [...serviceData.features, { title: "", features: ["", ""] }],
    });
  };

  const updateFeatureTitle = (featureIndex: number, value: string) => {
    const updatedFeatures = [...serviceData.features];
    updatedFeatures[featureIndex].title = value;
    setServiceData({
      ...serviceData,
      features: updatedFeatures,
    });
  };

  const updateFeatureItem = (
    featureIndex: number,
    itemIndex: number,
    value: string
  ) => {
    const updatedFeatures = [...serviceData.features];
    updatedFeatures[featureIndex].features[itemIndex] = value;
    setServiceData({
      ...serviceData,
      features: updatedFeatures,
    });
  };

  const renderTitle = () => [
    userRole === "organizer" ? "Book Vendor" : "Book Organizer",
  ];

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
          <h2 className="text-3xl font-bold text-[#2B579A] mb-8">
            {renderTitle()}
          </h2>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-10 px-4">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep === "overview"
                    ? "bg-[#2B579A] text-white"
                    : currentStep === "features" || currentStep === "pricing"
                      ? "bg-[#2B579A] text-white"
                      : "border border-gray-300"
                }`}
              >
                {currentStep === "overview" ? "01" : <Check size={18} />}
              </div>
              <span className="text-sm mt-2 text-[#2B579A] font-medium">
                Select Event
              </span>
            </div>

            <div className="flex-1 h-1 bg-gray-300 mx-4">
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
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep === "features"
                    ? "bg-[#2B579A] text-white"
                    : currentStep === "pricing"
                      ? "bg-[#2B579A] text-white"
                      : "border border-gray-300"
                }`}
              >
                {currentStep === "features" ? (
                  "02"
                ) : currentStep === "pricing" ? (
                  <Check size={18} />
                ) : (
                  "02"
                )}
              </div>
              <span
                className={`text-sm mt-2 ${currentStep === "features" ? "text-[#2B579A] font-medium" : "text-gray-500"}`}
              >
                Set Payment
              </span>
            </div>

            <div className="flex-1 h-1 bg-gray-300 mx-4">
              <div
                className={`h-full bg-[#2B579A] ${currentStep === "pricing" ? "w-full" : "w-0"}`}
              ></div>
            </div>

            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep === "pricing"
                    ? "bg-[#2B579A] text-white"
                    : "border border-gray-300"
                }`}
              >
                {currentStep === "pricing" ? "03" : "03"}
              </div>
              <span
                className={`text-sm mt-2 ${currentStep === "pricing" ? "text-[#2B579A] font-medium" : "text-gray-500"}`}
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
                      <div>Type</div>
                      <div>{selectedEvent.type}</div>
                      <div>Date</div>
                      <div>{selectedEvent.date}</div>
                      <div>Time</div>
                      <div>
                        {selectedEvent.startTime} to {selectedEvent.endTime}
                      </div>
                      <div>Location</div>
                      <div>{selectedEvent.location}</div>
                      <div>Number of Guests</div>
                      <div>{selectedEvent.guests}</div>
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
            </div>
          )}

          {/* Step 2: Features */}
          {currentStep === "features" && (
            <div className="space-y-8 px-4">
              {serviceData.features.map((feature, featureIndex) => (
                <div
                  key={featureIndex}
                  className="p-6 bg-gray-50 rounded-md space-y-4"
                >
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-2">
                      Service Feature/Inclusion
                    </label>
                    <input
                      type="text"
                      value={feature.title}
                      onChange={(e) =>
                        updateFeatureTitle(featureIndex, e.target.value)
                      }
                      placeholder="Title for this inclusion (e.g. Initial Consultation & Vision Development)"
                      className={`w-full p-3 border ${errors[`featureTitle-${featureIndex}`] ? "border-red-500" : "border-gray-300"} rounded-md text-base`}
                    />
                    {errors[`featureTitle-${featureIndex}`] && (
                      <p className="text-red-500 text-sm mt-1">
                        Feature title is required
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-2">
                      Feature List
                    </label>
                    {feature.features.map((featureItem, itemIndex) => (
                      <div key={itemIndex} className="mb-3">
                        <input
                          type="text"
                          value={featureItem}
                          onChange={(e) =>
                            updateFeatureItem(
                              featureIndex,
                              itemIndex,
                              e.target.value
                            )
                          }
                          placeholder="Add a specific feature (e.g. Venue walkthrough and logistics assessment)"
                          className={`w-full p-3 border ${errors[`feature-${featureIndex}-${itemIndex}`] ? "border-red-500" : "border-gray-300"} rounded-md text-base`}
                        />
                        {errors[`feature-${featureIndex}-${itemIndex}`] && (
                          <p className="text-red-500 text-sm mt-1">
                            Feature item is required
                          </p>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => addFeature(featureIndex)}
                      className="w-full p-3 bg-blue-50 text-[#2B579A] rounded-md flex items-center justify-center hover:bg-blue-100 mt-2"
                    >
                      <span className="mr-1">+</span> Add feature
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={addServiceFeature}
                className="w-full p-4 bg-blue-50 text-[#2B579A] rounded-md flex items-center justify-center hover:bg-blue-100 mt-4"
              >
                <span className="mr-1">+</span> Add Another Service
                Feature/Inclusion
              </button>
            </div>
          )}

          {/* Step 3: Pricing */}
          {currentStep === "pricing" && (
            <div className="space-y-6 px-4">
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Type
                </label>
                <input
                  type="text"
                  value={serviceData.type}
                  onChange={(e) =>
                    setServiceData({ ...serviceData, type: e.target.value })
                  }
                  placeholder="Full Wedding Planning"
                  className={`w-full p-3 border ${errors.type ? "border-red-500" : "border-gray-300"} rounded-md text-base`}
                />
                {errors.type && (
                  <p className="text-red-500 text-sm mt-1">Type is required</p>
                )}
              </div>

              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <input
                  type="text"
                  value={serviceData.amount}
                  onChange={(e) =>
                    setServiceData({ ...serviceData, amount: e.target.value })
                  }
                  placeholder="PHP 90,000"
                  className={`w-full p-3 border ${errors.amount ? "border-red-500" : "border-gray-300"} rounded-md text-base`}
                />
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-1">
                    Amount is required
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex mt-10 gap-6 px-4">
            {currentStep !== "overview" && (
              <button
                onClick={handleBack}
                className="flex-1 py-3 px-6 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-base font-medium"
              >
                Back
              </button>
            )}

            {currentStep === "overview" && (
              <button
                onClick={onClose}
                className="flex-1 py-3 px-6 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-base font-medium"
              >
                Cancel
              </button>
            )}

            {currentStep !== "pricing" ? (
              <button
                onClick={handleNext}
                className="flex-1 py-3 px-6 bg-[#2B579A] text-white rounded-md hover:bg-blue-700 text-base font-medium"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="flex-1 py-3 px-6 bg-[#2B579A] text-white rounded-md hover:bg-blue-700 text-base font-medium"
              >
                Finish
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
