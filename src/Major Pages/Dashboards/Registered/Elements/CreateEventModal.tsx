import { useState, useEffect, useRef } from "react";
import { X, Calendar, Clock, Plus, Minus, ChevronDown, Check } from "lucide-react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { EventData } from "../../../../functions/types";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: EventData) => void;
}

interface ErrorState {
  [key: string]: boolean | string;
}

interface EventType {
  event_type_id: number;
  event_type_name: string;
}

export function CreateEventModal({ isOpen, onClose, onSave }: CreateEventModalProps) {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<ErrorState>({});
  const [loading, setLoading] = useState(false);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [eventData, setEventData] = useState<EventData>({
    name: "",
    overview: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    numberOfGuests: 0,
    location: "",
    eventType: "",
    attire: "",
    services: [],
    customServices: [],
    budget: "",
    files: [],
  });
  const [customService, setCustomService] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  // Add authentication state listener
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCustomerId(user.uid);
      } else {
        setCustomerId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch event types
  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        console.log("Starting to fetch event types...");
        const response = await fetch("https://asia-southeast1-evntgarde-event-management.cloudfunctions.net/getEventTypes", {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        console.log("Response received:", response.status);
        const data = await response.json();
        console.log("Parsed response data:", data);

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch event types");
        }

        if (!Array.isArray(data.data)) {
          throw new Error("Invalid event types data format");
        }

        console.log("Setting event types:", data.data);
        setEventTypes(data.data);
      } catch (err) {
        console.error("Error in fetchEventTypes:", err);
        setErrors(prev => ({
          ...prev,
          eventTypes: err instanceof Error ? err.message : "Failed to load event types. Please try again."
        }));
      }
    };

    if (isOpen) {
      console.log("Modal opened, fetching event types...");
      fetchEventTypes();
    }
  }, [isOpen]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (field: keyof EventData, value: any) => {
    setEventData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field if it exists
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleServiceToggle = (service: string) => {
    const updatedServices = [...eventData.services];
    const serviceIndex = updatedServices.indexOf(service);

    if (serviceIndex === -1) {
      updatedServices.push(service);
    } else {
      updatedServices.splice(serviceIndex, 1);
    }

    setEventData({
      ...eventData,
      services: updatedServices,
    });
  };

  const addCustomService = () => {
    if (customService.trim()) {
      setEventData({
        ...eventData,
        customServices: [...eventData.customServices, customService.trim()],
      });
      setCustomService("");
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, boolean> = {};

    if (!eventData.name.trim()) newErrors.name = true;
    if (!eventData.overview.trim()) newErrors.overview = true;
    if (!eventData.startDate) newErrors.startDate = true;
    if (!eventData.endDate) newErrors.endDate = true;
    if (!eventData.startTime) newErrors.startTime = true;
    if (!eventData.endTime) newErrors.endTime = true;
    if (eventData.numberOfGuests <= 0) newErrors.numberOfGuests = true;
    if (!eventData.location.trim()) newErrors.location = true;
    if (!eventData.eventType) newErrors.eventType = true;
    if (!eventData.attire) newErrors.attire = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, boolean> = {};

    if (eventData.services.length === 0 && eventData.customServices.length === 0) {
      newErrors.services = true;
    }

    if (!eventData.budget.trim()) {
      newErrors.budget = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
    } else if (step === 2) {
      if (validateStep2()) {
        setStep(3);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setErrors({});
    try {
      if (!customerId) {
        setErrors({ auth: true, message: "You must be logged in to create an event" });
        setLoading(false);
        return;
      }

      // Validate all required fields
      const requiredFields = {
        name: "Event Name",
        overview: "Event Overview",
        startDate: "Start Date",
        endDate: "End Date",
        startTime: "Start Time",
        endTime: "End Time",
        numberOfGuests: "Number of Guests",
        location: "Location",
        eventType: "Event Type",
        attire: "Attire",
        budget: "Budget"
      };

      const missingFields = [];
      for (const [field, label] of Object.entries(requiredFields)) {
        if (!eventData[field as keyof EventData] || 
            (typeof eventData[field as keyof EventData] === 'string' && 
             eventData[field as keyof EventData].toString().trim() === '')) {
          missingFields.push(label);
        }
      }

      if (missingFields.length > 0) {
        setErrors({ 
          save: true,
          message: `Please fill in all required fields: ${missingFields.join(', ')}`
        });
        setLoading(false);
        return;
      }

      // Map eventType (id) directly
      const eventTypeId = eventData.eventType ? Number(eventData.eventType) : null;
      if (!eventTypeId) {
        setErrors({ save: true, message: "Invalid event type selected." });
        setLoading(false);
        return;
      }

      // Only call onSave and close modal, let parent handle API
      onSave(eventData);
      onClose();
      // Reset form state after successful creation
      setEventData({
        name: "",
        overview: "",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        numberOfGuests: 0,
        location: "",
        eventType: "",
        attire: "",
        services: [],
        customServices: [],
        budget: "",
        files: [],
      });
      setStep(1);
      setErrors({});
      setCustomService("");
    } catch (err) {
      setErrors({ 
        save: true,
        message: err instanceof Error ? err.message : "Failed to create event. Please try again."
      });
      console.error("Error validating event:", err);
    } finally {
      setLoading(false);
    }
  };

  const incrementGuests = () => {
    handleInputChange("numberOfGuests", eventData.numberOfGuests + 1);
  };

  const decrementGuests = () => {
    if (eventData.numberOfGuests > 0) {
      handleInputChange("numberOfGuests", eventData.numberOfGuests - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm overflow-auto">
      <div
        ref={modalRef}
        className="bg-white rounded-xl w-full max-w-2xl mx-4 my-4 overflow-hidden shadow-xl transform transition-all"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-[#3061AD]">Create Event</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-base ${
                  step >= 1 ? "bg-[#3061AD] text-white" : "border-2 border-gray-300 text-gray-500"
                }`}
              >
                {step > 1 ? <Check size={18} /> : "01"}
              </div>
              <div className={`ml-3 text-sm ${step === 1 ? "text-[#3061AD] font-medium" : "text-gray-500"}`}>
                Event Details
              </div>
            </div>

            <div className={`flex-1 h-1 mx-4 ${step > 1 ? "bg-[#3061AD]" : "bg-gray-200"}`}></div>

            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-base ${
                  step >= 2 ? "bg-[#3061AD] text-white" : "border-2 border-gray-300 text-gray-500"
                }`}
              >
                {step > 2 ? <Check size={18} /> : "02"}
              </div>
              <div className={`ml-3 text-sm ${step === 2 ? "text-[#3061AD] font-medium" : "text-gray-500"}`}>
                Services
              </div>
            </div>

            <div className={`flex-1 h-1 mx-4 ${step > 2 ? "bg-[#3061AD]" : "bg-gray-200"}`}></div>

            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-base ${
                  step === 3 ? "bg-[#3061AD] text-white" : "border-2 border-gray-300 text-gray-500"
                }`}
              >
                03
              </div>
              <div className={`ml-3 text-sm ${step === 3 ? "text-[#3061AD] font-medium" : "text-gray-500"}`}>
                Preview
              </div>
            </div>
          </div>

          {/* Error Messages */}
          {errors.auth && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              You must be logged in to create an event
            </div>
          )}
          {errors.save && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {errors.message || "Failed to create event. Please try again."}
            </div>
          )}

          {/* Form Content */}
          <div className="max-h-[65vh] overflow-y-auto space-y-6">
            {/* Step 1: Event Details */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Annual Business Conference 2025"
                    className={`w-full p-3 border ${errors.name ? "border-red-500" : "border-gray-300"} rounded-lg text-base`}
                    value={eventData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">Event name is required</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Overview</label>
                  <textarea
                    placeholder="Provide an overview of your event"
                    className={`w-full p-3 border ${errors.overview ? "border-red-500" : "border-gray-300"} rounded-lg text-base h-24`}
                    value={eventData.overview}
                    onChange={(e) => handleInputChange("overview", e.target.value)}
                  />
                  {errors.overview && <p className="text-red-500 text-sm mt-1">Event overview is required</p>}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        className={`w-full p-3 border ${errors.startDate ? "border-red-500" : "border-gray-300"} rounded-lg text-base pr-10`}
                        value={eventData.startDate}
                        onChange={(e) => handleInputChange("startDate", e.target.value)}
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        className={`w-full p-3 border ${errors.endDate ? "border-red-500" : "border-gray-300"} rounded-lg text-base pr-10`}
                        value={eventData.endDate}
                        onChange={(e) => handleInputChange("endDate", e.target.value)}
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                    <div className="relative">
                      <input
                        type="time"
                        className={`w-full p-3 border ${errors.startTime ? "border-red-500" : "border-gray-300"} rounded-lg text-base pr-10`}
                        value={eventData.startTime}
                        onChange={(e) => handleInputChange("startTime", e.target.value)}
                      />
                      <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                    <div className="relative">
                      <input
                        type="time"
                        className={`w-full p-3 border ${errors.endTime ? "border-red-500" : "border-gray-300"} rounded-lg text-base pr-10`}
                        value={eventData.endTime}
                        onChange={(e) => handleInputChange("endTime", e.target.value)}
                      />
                      <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
                    <div className="flex items-center">
                      <button className="p-3 border border-gray-300 rounded-l-lg" onClick={decrementGuests}>
                        <Minus size={18} />
                      </button>
                      <input
                        type="text"
                        className={`flex-1 p-3 border-y ${errors.numberOfGuests ? "border-red-500" : "border-gray-300"} text-base text-center`}
                        value={eventData.numberOfGuests || ""}
                        onChange={(e) => {
                          const value = Number.parseInt(e.target.value) || 0;
                          handleInputChange("numberOfGuests", value);
                        }}
                      />
                      <button className="p-3 border border-gray-300 rounded-r-lg" onClick={incrementGuests}>
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                    <div className="relative">
                      <select
                        className={`w-full p-3 border ${errors.eventType ? "border-red-500" : "border-gray-300"} rounded-lg text-base appearance-none pr-10`}
                        value={eventData.eventType}
                        onChange={e => {
                          console.log("Selected event type:", e.target.value);
                          handleInputChange("eventType", e.target.value);
                        }}
                      >
                        <option value="">Choose Event Type</option>
                        {eventTypes.map((type) => (
                          <option key={type.event_type_id} value={type.event_type_id}>
                            {type.event_type_name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="Enter Event Location"
                    className={`w-full p-3 border ${errors.location ? "border-red-500" : "border-gray-300"} rounded-lg text-base`}
                    value={eventData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Attire</label>
                  <div className="relative">
                    <select
                      className={`w-full p-3 border ${errors.attire ? "border-red-500" : "border-gray-300"} rounded-lg text-base appearance-none pr-10`}
                      value={eventData.attire}
                      onChange={(e) => handleInputChange("attire", e.target.value)}
                    >
                      <option value="">Choose Attire</option>
                      <option value="Casual">Casual</option>
                      <option value="Business Casual">Business Casual</option>
                      <option value="Formal">Formal</option>
                      <option value="Black Tie">Black Tie</option>
                      <option value="White Tie">White Tie</option>
                      <option value="Costume">Costume</option>
                      <option value="School Uniform">School Uniform</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Services */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Required Services</label>
                  <div className="flex flex-wrap gap-3 mb-4">
                    {["Catering", "Decor", "Entertainment", "Photography"].map((service) => (
                      <button
                        key={service}
                        className={`flex items-center px-4 py-2 rounded-lg border text-base ${
                          eventData.services.includes(service)
                            ? "border-[#3061AD] text-[#3061AD]"
                            : "border-gray-300 text-gray-700"
                        }`}
                        onClick={() => handleServiceToggle(service)}
                      >
                        {service}
                        <span className="ml-2 w-5 h-5 rounded-full border flex items-center justify-center">
                          {eventData.services.includes(service) && <Check size={14} />}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Custom Services</label>
                  <div className="flex items-center gap-3 mb-4">
                    <input
                      type="text"
                      placeholder="Add custom service"
                      className="flex-1 p-3 border border-gray-300 rounded-lg text-base"
                      value={customService}
                      onChange={(e) => setCustomService(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addCustomService();
                        }
                      }}
                    />
                    <button
                      className="bg-gray-100 text-[#3061AD] px-4 py-3 rounded-lg hover:bg-gray-200 text-base"
                      onClick={addCustomService}
                    >
                      Add Service
                    </button>
                  </div>

                  {eventData.customServices.length > 0 && (
                    <div className="space-y-2">
                      {eventData.customServices.map((service, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-base">
                          <span>{service}</span>
                          <button
                            className="text-red-500"
                            onClick={() => {
                              const updatedServices = [...eventData.customServices];
                              updatedServices.splice(index, 1);
                              setEventData({
                                ...eventData,
                                customServices: updatedServices,
                              });
                            }}
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                  <input
                    type="text"
                    placeholder="e.g., PHP 100,000"
                    className={`w-full p-3 border ${errors.budget ? "border-red-500" : "border-gray-300"} rounded-lg text-base`}
                    value={eventData.budget}
                    onChange={(e) => handleInputChange("budget", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Preview */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm text-gray-500 mb-2">Name</h4>
                    <p className="text-base font-medium">{eventData.name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500 mb-2">Type</h4>
                    <p className="text-base">
                      {(() => {
                        const selectedType = eventTypes.find(type => String(type.event_type_id) === String(eventData.eventType));
                        return selectedType ? selectedType.event_type_name : eventData.eventType;
                      })()}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <h4 className="text-sm text-gray-500 mb-2">Overview</h4>
                    <p className="text-base">{eventData.overview}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500 mb-2">Date</h4>
                    <p className="text-base">
                      {new Date(eventData.startDate).toLocaleDateString()} to{" "}
                      {new Date(eventData.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500 mb-2">Time</h4>
                    <p className="text-base">
                      {eventData.startTime} to {eventData.endTime}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500 mb-2">Guests</h4>
                    <p className="text-base">{eventData.numberOfGuests}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500 mb-2">Attire</h4>
                    <p className="text-base">{eventData.attire}</p>
                  </div>
                  <div className="col-span-2">
                    <h4 className="text-sm text-gray-500 mb-2">Location</h4>
                    <p className="text-base">{eventData.location}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm text-gray-500 mb-3">Services</h4>
                  <div className="space-y-2">
                    {(eventData.services || []).map((service, index) => (
                      <div key={index} className="text-base bg-gray-50 p-3 rounded-lg">
                        {service}
                      </div>
                    ))}
                    {(eventData.customServices || []).map((service, index) => (
                      <div key={`custom-${index}`} className="text-base bg-gray-50 p-3 rounded-lg">
                        {service}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <h4 className="text-base font-medium text-[#3061AD]">Total Budget</h4>
                  <p className="text-lg font-semibold text-[#3061AD]">{eventData.budget}</p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6 pt-4 border-t">
            {step === 1 ? (
              <button
                className="px-6 py-3 border border-gray-300 rounded-lg text-base text-gray-700 hover:bg-gray-50"
                onClick={onClose}
              >
                Cancel
              </button>
            ) : (
              <button
                className="px-6 py-3 border border-gray-300 rounded-lg text-base text-gray-700 hover:bg-gray-50"
                onClick={handleBack}
              >
                Back
              </button>
            )}

            {step < 3 ? (
              <button 
                className="px-6 py-3 bg-[#3061AD] text-white rounded-lg hover:bg-[#2B579A] text-base" 
                onClick={handleNext}
              >
                Next
              </button>
            ) : (
              <button 
                className="px-6 py-3 bg-[#3061AD] text-white rounded-lg hover:bg-[#2B579A] text-base disabled:opacity-50 disabled:cursor-not-allowed" 
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save & View Vendors"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}