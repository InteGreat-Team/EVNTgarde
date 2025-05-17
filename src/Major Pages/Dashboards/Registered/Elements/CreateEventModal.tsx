"use client"

import { useState, useEffect, useRef } from "react"
import { X, Calendar, Clock, Plus, Minus, ChevronDown, Upload, Check } from "lucide-react"

interface CreateEventModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (eventData: EventData) => void
}

interface EventData {
  name: string
  overview: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  numberOfGuests: number
  location: string
  eventType: string
  attire: string
  services: string[]
  customServices: string[]
  budget: string
  files: File[]
}

export function CreateEventModal({ isOpen, onClose, onSave }: CreateEventModalProps) {
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, boolean>>({})
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
  })
  const [customService, setCustomService] = useState("")
  const modalRef = useRef<HTMLDivElement>(null)

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleInputChange = (field: keyof EventData, value: any) => {
    setEventData({
      ...eventData,
      [field]: value,
    })

    // Clear error for this field if it exists
    if (errors[field]) {
      const newErrors = { ...errors }
      delete newErrors[field]
      setErrors(newErrors)
    }
  }

  const handleServiceToggle = (service: string) => {
    const updatedServices = [...eventData.services]
    const serviceIndex = updatedServices.indexOf(service)

    if (serviceIndex === -1) {
      updatedServices.push(service)
    } else {
      updatedServices.splice(serviceIndex, 1)
    }

    setEventData({
      ...eventData,
      services: updatedServices,
    })
  }

  const addCustomService = () => {
    if (customService.trim()) {
      setEventData({
        ...eventData,
        customServices: [...eventData.customServices, customService.trim()],
      })
      setCustomService("")
    }
  }

  const validateStep1 = () => {
    const newErrors: Record<string, boolean> = {}

    if (!eventData.name.trim()) newErrors.name = true
    if (!eventData.overview.trim()) newErrors.overview = true
    if (!eventData.startDate) newErrors.startDate = true
    if (!eventData.endDate) newErrors.endDate = true
    if (!eventData.startTime) newErrors.startTime = true
    if (!eventData.endTime) newErrors.endTime = true
    if (eventData.numberOfGuests <= 0) newErrors.numberOfGuests = true
    if (!eventData.location.trim()) newErrors.location = true
    if (!eventData.eventType) newErrors.eventType = true
    if (!eventData.attire) newErrors.attire = true

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, boolean> = {}

    if (eventData.services.length === 0 && eventData.customServices.length === 0) {
      newErrors.services = true
    }

    if (!eventData.budget.trim()) {
      newErrors.budget = true
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2)
      }
    } else if (step === 2) {
      if (validateStep2()) {
        setStep(3)
      }
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSave = () => {
    onSave(eventData)
    onClose()
  }

  const incrementGuests = () => {
    handleInputChange("numberOfGuests", eventData.numberOfGuests + 1)
  }

  const decrementGuests = () => {
    if (eventData.numberOfGuests > 0) {
      handleInputChange("numberOfGuests", eventData.numberOfGuests - 1)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm overflow-auto">
      <div
        ref={modalRef}
        className="bg-white rounded-xl w-full max-w-xl mx-4 my-4 overflow-hidden shadow-xl transform transition-all"
      >
        <div className="p-4">
          <h2 className="text-2xl font-semibold text-[#3061AD] mb-6">Create Event</h2>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 1 ? "bg-[#3061AD] text-white" : "border border-gray-300 text-gray-500"
                }`}
              >
                {step > 1 ? <Check size={16} /> : "01"}
              </div>
              <div className={`ml-2 text-sm ${step === 1 ? "text-[#3061AD] font-medium" : "text-gray-500"}`}>
                Event Details
              </div>
            </div>

            <div className={`flex-1 h-0.5 mx-4 ${step > 1 ? "bg-[#3061AD]" : "bg-gray-200"}`}></div>

            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 2 ? "bg-[#3061AD] text-white" : "border border-gray-300 text-gray-500"
                }`}
              >
                {step > 2 ? <Check size={16} /> : "02"}
              </div>
              <div className={`ml-2 text-sm ${step === 2 ? "text-[#3061AD] font-medium" : "text-gray-500"}`}>
                Services
              </div>
            </div>

            <div className={`flex-1 h-0.5 mx-4 ${step > 2 ? "bg-[#3061AD]" : "bg-gray-200"}`}></div>

            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 3 ? "bg-[#3061AD] text-white" : "border border-gray-300 text-gray-500"
                }`}
              >
                03
              </div>
              <div className={`ml-2 text-sm ${step === 3 ? "text-[#3061AD] font-medium" : "text-gray-500"}`}>
                Preview
              </div>
            </div>
          </div>

          {/* Step 1: Event Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                <input
                  type="text"
                  placeholder="e.g., Annual Business Conference 2025"
                  className={`w-full p-3 border ${errors.name ? "border-red-500" : "border-gray-300"} rounded-md`}
                  value={eventData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">Event name is required</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Overview</label>
                <textarea
                  placeholder="Provide an overview of your event. Mention what makes it unique and any important details"
                  className={`w-full p-3 border ${errors.overview ? "border-red-500" : "border-gray-300"} rounded-md h-16`}
                  value={eventData.overview}
                  onChange={(e) => handleInputChange("overview", e.target.value)}
                />
                {errors.overview && <p className="text-red-500 text-xs mt-1">Event overview is required</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <input
                      type="date"
                      placeholder="Start Date"
                      className={`w-full p-3 border ${errors.startDate ? "border-red-500" : "border-gray-300"} rounded-md pr-10`}
                      value={eventData.startDate}
                      onChange={(e) => handleInputChange("startDate", e.target.value)}
                    />
                    <Calendar
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={18}
                    />
                    {errors.startDate && <p className="text-red-500 text-xs mt-1">Start date is required</p>}
                  </div>

                  <span className="text-gray-500">To</span>

                  <div className="relative flex-1">
                    <input
                      type="date"
                      placeholder="End Date"
                      className={`w-full p-3 border ${errors.endDate ? "border-red-500" : "border-gray-300"} rounded-md pr-10`}
                      value={eventData.endDate}
                      onChange={(e) => handleInputChange("endDate", e.target.value)}
                    />
                    <Calendar
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={18}
                    />
                    {errors.endDate && <p className="text-red-500 text-xs mt-1">End date is required</p>}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <input
                      type="time"
                      placeholder="Start Time"
                      className={`w-full p-3 border ${errors.startTime ? "border-red-500" : "border-gray-300"} rounded-md pr-10`}
                      value={eventData.startTime}
                      onChange={(e) => handleInputChange("startTime", e.target.value)}
                    />
                    <Clock
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={18}
                    />
                    {errors.startTime && <p className="text-red-500 text-xs mt-1">Start time is required</p>}
                  </div>

                  <span className="text-gray-500">To</span>

                  <div className="relative flex-1">
                    <input
                      type="time"
                      placeholder="End Time"
                      className={`w-full p-3 border ${errors.endTime ? "border-red-500" : "border-gray-300"} rounded-md pr-10`}
                      value={eventData.endTime}
                      onChange={(e) => handleInputChange("endTime", e.target.value)}
                    />
                    <Clock
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={18}
                    />
                    {errors.endTime && <p className="text-red-500 text-xs mt-1">End time is required</p>}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
                <div className="flex items-center">
                  <button className="p-3 border border-gray-300 rounded-l-md" onClick={decrementGuests}>
                    <Minus size={16} />
                  </button>
                  <input
                    type="text"
                    className={`flex-1 p-3 border-y ${errors.numberOfGuests ? "border-red-500" : "border-gray-300"} text-center`}
                    value={eventData.numberOfGuests || ""}
                    onChange={(e) => {
                      const value = Number.parseInt(e.target.value) || 0
                      handleInputChange("numberOfGuests", value)
                    }}
                  />
                  <button className="p-3 border border-gray-300 rounded-r-md" onClick={incrementGuests}>
                    <Plus size={16} />
                  </button>
                </div>
                {errors.numberOfGuests && <p className="text-red-500 text-xs mt-1">Number of guests is required</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Location</label>
                <input
                  type="text"
                  placeholder="Enter Event Location"
                  className={`w-full p-3 border ${errors.location ? "border-red-500" : "border-gray-300"} rounded-md`}
                  value={eventData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                />
                {errors.location && <p className="text-red-500 text-xs mt-1">Event location is required</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                <div className="relative">
                  <select
                    className={`w-full p-3 border ${errors.eventType ? "border-red-500" : "border-gray-300"} rounded-md appearance-none pr-10`}
                    value={eventData.eventType}
                    onChange={(e) => handleInputChange("eventType", e.target.value)}
                  >
                    <option value="">Choose Event Type</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Conference">Conference</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={18}
                  />
                </div>
                {errors.eventType && <p className="text-red-500 text-xs mt-1">Event type is required</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Attire</label>
                <div className="relative">
                  <select
                    className={`w-full p-3 border ${errors.attire ? "border-red-500" : "border-gray-300"} rounded-md appearance-none pr-10`}
                    value={eventData.attire}
                    onChange={(e) => handleInputChange("attire", e.target.value)}
                  >
                    <option value="">Choose an attire</option>
                    <option value="Casual">Casual</option>
                    <option value="Business Casual">Business Casual</option>
                    <option value="Formal">Formal</option>
                    <option value="Black Tie">Black Tie</option>
                    <option value="White Tie">White Tie</option>
                    <option value="Costume">Costume</option>
                    <option value="School Uniform">School Uniform</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={18}
                  />
                </div>
                {errors.attire && <p className="text-red-500 text-xs mt-1">Attire is required</p>}
              </div>
            </div>
          )}

          {/* Step 2: Services */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  List Services Required for your event
                </label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {["Catering Services", "Decor & Design", "Entertainment", "Photography"].map((service) => (
                    <button
                      key={service}
                      className={`flex items-center px-3 py-2 rounded-md border ${
                        eventData.services.includes(service)
                          ? "border-[#3061AD] text-[#3061AD]"
                          : "border-gray-300 text-gray-700"
                      }`}
                      onClick={() => handleServiceToggle(service)}
                    >
                      {service}
                      <span className="ml-2 w-5 h-5 rounded-full border flex items-center justify-center">
                        {eventData.services.includes(service) && <Check size={12} />}
                      </span>
                    </button>
                  ))}
                </div>
                {errors.services && <p className="text-red-500 text-xs mt-1">At least one service is required</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Services</label>
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Enter custom service"
                    className="flex-1 p-3 border border-gray-300 rounded-md"
                    value={customService}
                    onChange={(e) => setCustomService(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addCustomService()
                      }
                    }}
                  />
                  <button
                    className="bg-gray-100 text-[#3061AD] px-3 py-3 rounded-md hover:bg-gray-200"
                    onClick={addCustomService}
                  >
                    Add Custom Service
                  </button>
                </div>

                {eventData.customServices.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Custom Services:</h4>
                    <ul className="space-y-2">
                      {eventData.customServices.map((service, index) => (
                        <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                          <span>{service}</span>
                          <button
                            className="text-red-500"
                            onClick={() => {
                              const updatedServices = [...eventData.customServices]
                              updatedServices.splice(index, 1)
                              setEventData({
                                ...eventData,
                                customServices: updatedServices,
                              })
                            }}
                          >
                            <X size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Event Budget</label>
                <input
                  type="text"
                  placeholder="e.g., PHP 100,000"
                  className={`w-full p-3 border ${errors.budget ? "border-red-500" : "border-gray-300"} rounded-md`}
                  value={eventData.budget}
                  onChange={(e) => handleInputChange("budget", e.target.value)}
                />
                {errors.budget && <p className="text-red-500 text-xs mt-1">Budget is required</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Event Files/Resources <span className="text-gray-500 text-xs">(optional)</span>
                </label>
                <div className="border border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                  <Upload className="text-gray-400 mb-2" size={24} />
                  <p className="text-sm text-gray-600 text-center mb-1">
                    Browse and choose the files you want to upload from your device
                  </p>
                  <p className="text-xs text-gray-500 text-center">
                    Sample files: event banners, speaker photos, schedules, promotional posters, or presentation slides
                  </p>
                  <button
                    className="mt-4 bg-[#3061AD] text-white p-2 rounded-md"
                    onClick={(e) => {
                      e.preventDefault()
                      // File upload functionality is disabled as per requirements
                      alert("File upload functionality is currently disabled")
                    }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Preview */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-[#3061AD] mb-4">Event Details</h3>

                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                  <div>
                    <h4 className="text-sm text-gray-500">Name</h4>
                    <p className="font-medium">{eventData.name}</p>
                  </div>

                  <div className="col-span-2">
                    <h4 className="text-sm text-gray-500">Overview</h4>
                    <p>{eventData.overview}</p>
                  </div>

                  <div>
                    <h4 className="text-sm text-gray-500">Date</h4>
                    <p>
                      {new Date(eventData.startDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      to{" "}
                      {new Date(eventData.endDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm text-gray-500">Time</h4>
                    <p>
                      {eventData.startTime} to {eventData.endTime}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm text-gray-500">Number of Guest</h4>
                    <p>{eventData.numberOfGuests}</p>
                  </div>

                  <div className="col-span-2">
                    <h4 className="text-sm text-gray-500">Address</h4>
                    <p>{eventData.location}</p>
                  </div>

                  <div>
                    <h4 className="text-sm text-gray-500">Type</h4>
                    <p>{eventData.eventType}</p>
                  </div>

                  <div>
                    <h4 className="text-sm text-gray-500">Attire</h4>
                    <p>{eventData.attire}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-[#3061AD] mb-4">Requested Services</h3>
                <ul className="space-y-2">
                  {eventData.services.map((service, index) => (
                    <li key={index}>{service}</li>
                  ))}
                  {eventData.customServices.map((service, index) => (
                    <li key={`custom-${index}`}>{service}</li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-[#3061AD]">Total Event Budget</h3>
                <p className="text-xl font-semibold text-[#3061AD]">{eventData.budget}</p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-4">
            {step === 1 ? (
              <button
                className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                onClick={onClose}
              >
                Cancel
              </button>
            ) : (
              <button
                className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                onClick={handleBack}
              >
                Back
              </button>
            )}

            {step < 3 ? (
              <button className="px-6 py-3 bg-[#3061AD] text-white rounded-md hover:bg-[#2B579A]" onClick={handleNext}>
                Next
              </button>
            ) : (
              <button className="px-6 py-3 bg-[#3061AD] text-white rounded-md hover:bg-[#2B579A]" onClick={handleSave}>
                Save Draft & View Vendors
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}