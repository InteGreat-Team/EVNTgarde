import type React from "react"
import { useState, useRef, useEffect } from "react"
import { X, Check } from "lucide-react"

interface AddServiceModalProps {
  isOpen: boolean
  onClose: () => void
}

type Step = "overview" | "features" | "pricing"

interface ServiceFeature {
  title: string
  features: string[]
}

interface ServiceData {
  name: string
  subtext: string
  message: string
  image: File | null
  features: ServiceFeature[]
  type: string
  amount: string
}

export const AddServiceModal: React.FC<AddServiceModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState<Step>("overview")
  const [serviceData, setServiceData] = useState<ServiceData>({
    name: "",
    subtext: "",
    message: "",
    image: null,
    features: [{ title: "", features: ["", ""] }],
    type: "",
    amount: "",
  })
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Effect to prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save the current overflow style
      const originalStyle = window.getComputedStyle(document.body).overflow

      // Prevent scrolling on the body
      document.body.style.overflow = "hidden"

      // Cleanup function to restore scrolling when component unmounts or modal closes
      return () => {
        document.body.style.overflow = originalStyle
      }
    }
  }, [isOpen]) // Re-run effect when isOpen changes

  if (!isOpen) return null

  const validateOverview = () => {
    const newErrors: Record<string, boolean> = {}
    if (!serviceData.name.trim()) newErrors.name = true
    if (!serviceData.subtext.trim()) newErrors.subtext = true
    if (!serviceData.message.trim()) newErrors.message = true

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateFeatures = () => {
    const newErrors: Record<string, boolean> = {}

    serviceData.features.forEach((feature, featureIndex) => {
      if (!feature.title.trim()) {
        newErrors[`featureTitle-${featureIndex}`] = true
      }

      feature.features.forEach((featureItem, featureItemIndex) => {
        if (!featureItem.trim()) {
          newErrors[`feature-${featureIndex}-${featureItemIndex}`] = true
        }
      })
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePricing = () => {
    const newErrors: Record<string, boolean> = {}
    if (!serviceData.type.trim()) newErrors.type = true
    if (!serviceData.amount.trim()) newErrors.amount = true

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (currentStep === "overview") {
      if (validateOverview()) {
        setCurrentStep("features")
      }
    } else if (currentStep === "features") {
      if (validateFeatures()) {
        setCurrentStep("pricing")
      }
    }
  }

  const handleBack = () => {
    if (currentStep === "features") {
      setCurrentStep("overview")
    } else if (currentStep === "pricing") {
      setCurrentStep("features")
    }
  }

  const handleFinish = () => {
    if (validatePricing()) {
      // Here you would typically save the data or perform an API call
      console.log("Service data:", serviceData)
      onClose()
    }
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setServiceData({
        ...serviceData,
        image: e.target.files[0],
      })
    }
  }

  const addFeature = (featureIndex: number) => {
    const updatedFeatures = [...serviceData.features]
    updatedFeatures[featureIndex].features.push("")
    setServiceData({
      ...serviceData,
      features: updatedFeatures,
    })
  }

  const addServiceFeature = () => {
    setServiceData({
      ...serviceData,
      features: [...serviceData.features, { title: "", features: ["", ""] }],
    })
  }

  const updateFeatureTitle = (featureIndex: number, value: string) => {
    const updatedFeatures = [...serviceData.features]
    updatedFeatures[featureIndex].title = value
    setServiceData({
      ...serviceData,
      features: updatedFeatures,
    })
  }

  const updateFeatureItem = (featureIndex: number, itemIndex: number, value: string) => {
    const updatedFeatures = [...serviceData.features]
    updatedFeatures[featureIndex].features[itemIndex] = value
    setServiceData({
      ...serviceData,
      features: updatedFeatures,
    })
  }

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl mx-6 relative max-h-[90vh] overflow-auto shadow-xl">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 z-10">
          <X size={24} />
        </button>

        <div className="p-8">
          <h2 className="text-3xl font-bold text-blue-600 mb-8">Add Service</h2>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-10 px-4">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep === "overview"
                    ? "bg-blue-600 text-white"
                    : currentStep === "features" || currentStep === "pricing"
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300"
                }`}
              >
                {currentStep === "overview" ? "01" : <Check size={18} />}
              </div>
              <span className="text-sm mt-2 text-blue-600 font-medium">Overview</span>
            </div>

            <div className="flex-1 h-1 bg-gray-300 mx-4">
              <div
                className={`h-full bg-blue-600 ${
                  currentStep === "features" || currentStep === "pricing" ? "w-full" : "w-0"
                }`}
              ></div>
            </div>

            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep === "features"
                    ? "bg-blue-600 text-white"
                    : currentStep === "pricing"
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300"
                }`}
              >
                {currentStep === "features" ? "02" : currentStep === "pricing" ? <Check size={18} /> : "02"}
              </div>
              <span
                className={`text-sm mt-2 ${currentStep === "features" ? "text-blue-600 font-medium" : "text-gray-500"}`}
              >
                Features
              </span>
            </div>

            <div className="flex-1 h-1 bg-gray-300 mx-4">
              <div className={`h-full bg-blue-600 ${currentStep === "pricing" ? "w-full" : "w-0"}`}></div>
            </div>

            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep === "pricing" ? "bg-blue-600 text-white" : "border border-gray-300"
                }`}
              >
                {currentStep === "pricing" ? "03" : "03"}
              </div>
              <span
                className={`text-sm mt-2 ${currentStep === "pricing" ? "text-blue-600 font-medium" : "text-gray-500"}`}
              >
                Pricing
              </span>
            </div>
          </div>

          {/* Step 1: Overview */}
          {currentStep === "overview" && (
            <div className="space-y-6 px-4">
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">Service Name</label>
                <input
                  type="text"
                  value={serviceData.name}
                  onChange={(e) => setServiceData({ ...serviceData, name: e.target.value })}
                  placeholder="Add a clear title that describes your event or service (e.g. Wedding Planning)"
                  className={`w-full p-3 border ${errors.name ? "border-red-500" : "border-gray-300"} rounded-md text-base`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">Service name is required</p>}
              </div>

              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">Subtext</label>
                <input
                  type="text"
                  value={serviceData.subtext}
                  onChange={(e) => setServiceData({ ...serviceData, subtext: e.target.value })}
                  placeholder="Write a short tagline or sentence that explains the value of your service"
                  className={`w-full p-3 border ${errors.subtext ? "border-red-500" : "border-gray-300"} rounded-md text-base`}
                />
                {errors.subtext && <p className="text-red-500 text-sm mt-1">Subtext is required</p>}
              </div>

              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={serviceData.message}
                  onChange={(e) => setServiceData({ ...serviceData, message: e.target.value })}
                  placeholder="Describe the service in detail—what's included, who it's for, and what makes it special"
                  className={`w-full p-3 border ${errors.message ? "border-red-500" : "border-gray-300"} rounded-md text-base h-32`}
                />
                {errors.message && <p className="text-red-500 text-sm mt-1">Message is required</p>}
              </div>

              <div className="mt-8">
                <label className="block text-base font-medium text-gray-700 mb-2">Upload Image</label>
                <div className="text-sm text-gray-500 mb-3">
                  <p>• Upload PNG or JPG</p>
                  <p>• Image should not exceed 25mb.</p>
                </div>
                <button
                  onClick={handleFileUpload}
                  className="w-full p-4 border border-dashed border-blue-300 rounded-md text-blue-600 flex items-center justify-center bg-blue-50 hover:bg-blue-100"
                >
                  Upload File
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg"
                  className="hidden"
                />
                {serviceData.image && (
                  <p className="text-sm text-green-600 mt-2">File selected: {serviceData.image.name}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Features */}
          {currentStep === "features" && (
            <div className="space-y-8 px-4">
              {serviceData.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="p-6 bg-gray-50 rounded-md space-y-4">
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-2">Service Feature/Inclusion</label>
                    <input
                      type="text"
                      value={feature.title}
                      onChange={(e) => updateFeatureTitle(featureIndex, e.target.value)}
                      placeholder="Title for this inclusion (e.g. Initial Consultation & Vision Development)"
                      className={`w-full p-3 border ${errors[`featureTitle-${featureIndex}`] ? "border-red-500" : "border-gray-300"} rounded-md text-base`}
                    />
                    {errors[`featureTitle-${featureIndex}`] && (
                      <p className="text-red-500 text-sm mt-1">Feature title is required</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-2">Feature List</label>
                    {feature.features.map((featureItem, itemIndex) => (
                      <div key={itemIndex} className="mb-3">
                        <input
                          type="text"
                          value={featureItem}
                          onChange={(e) => updateFeatureItem(featureIndex, itemIndex, e.target.value)}
                          placeholder="Add a specific feature (e.g. Venue walkthrough and logistics assessment)"
                          className={`w-full p-3 border ${errors[`feature-${featureIndex}-${itemIndex}`] ? "border-red-500" : "border-gray-300"} rounded-md text-base`}
                        />
                        {errors[`feature-${featureIndex}-${itemIndex}`] && (
                          <p className="text-red-500 text-sm mt-1">Feature item is required</p>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => addFeature(featureIndex)}
                      className="w-full p-3 bg-blue-50 text-blue-600 rounded-md flex items-center justify-center hover:bg-blue-100 mt-2"
                    >
                      <span className="mr-1">+</span> Add feature
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={addServiceFeature}
                className="w-full p-4 bg-blue-50 text-blue-600 rounded-md flex items-center justify-center hover:bg-blue-100 mt-4"
              >
                <span className="mr-1">+</span> Add Another Service Feature/Inclusion
              </button>
            </div>
          )}

          {/* Step 3: Pricing */}
          {currentStep === "pricing" && (
            <div className="space-y-6 px-4">
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">Type</label>
                <input
                  type="text"
                  value={serviceData.type}
                  onChange={(e) => setServiceData({ ...serviceData, type: e.target.value })}
                  placeholder="Full Wedding Planning"
                  className={`w-full p-3 border ${errors.type ? "border-red-500" : "border-gray-300"} rounded-md text-base`}
                />
                {errors.type && <p className="text-red-500 text-sm mt-1">Type is required</p>}
              </div>

              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">Amount</label>
                <input
                  type="text"
                  value={serviceData.amount}
                  onChange={(e) => setServiceData({ ...serviceData, amount: e.target.value })}
                  placeholder="PHP 90,000"
                  className={`w-full p-3 border ${errors.amount ? "border-red-500" : "border-gray-300"} rounded-md text-base`}
                />
                {errors.amount && <p className="text-red-500 text-sm mt-1">Amount is required</p>}
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
                className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-base font-medium"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-base font-medium"
              >
                Finish
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
