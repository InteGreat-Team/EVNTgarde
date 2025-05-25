import { useState, useEffect, useRef } from "react";
import { EventDetailsStep } from "./EventDetailsStep";
import { ServicesStep } from "./ServicesStep";
import { PreviewStep } from "./PreviewStep";
import { ProgressSteps } from "./ProgressSteps";
import { EventData } from "../../../../functions/types";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: EventData) => void;
}

export function CreateEventModal({ isOpen, onClose, onSave }: CreateEventModalProps) {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
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

  const modalRef = useRef<HTMLDivElement>(null);

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
    setEventData({ ...eventData, [field]: value });
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const validators = {
    1: () => {
      const newErrors: Record<string, boolean> = {};
      const requiredFields = [
        "name", "overview", "startDate", "endDate", 
        "startTime", "endTime", "location", "eventType", "attire"
      ];
      
      requiredFields.forEach(field => {
        if (!eventData[field as keyof EventData] || 
            (typeof eventData[field as keyof EventData] === 'string' && 
             !(eventData[field as keyof EventData] as string).trim())) {
          newErrors[field] = true;
        }
      });
      
      if (eventData.numberOfGuests <= 0) newErrors.numberOfGuests = true;
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    2: () => {
      const newErrors: Record<string, boolean> = {};
      if (eventData.services.length === 0 && eventData.customServices.length === 0) {
        newErrors.services = true;
      }
      if (!eventData.budget.trim()) newErrors.budget = true;
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    3: () => true
  };

  const handleNext = () => {
    if (validators[step as keyof typeof validators]()) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSave = () => {
    onSave(eventData);
    onClose();
  };

  const renderStep = () => {
    const stepProps = {
      eventData,
      errors,
      onInputChange: handleInputChange,
    };

    switch (step) {
      case 1:
        return <EventDetailsStep {...stepProps} />;
      case 2:
        return <ServicesStep {...stepProps} setEventData={setEventData} />;
      case 3:
        return <PreviewStep {...stepProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="bg-white rounded-xl w-full max-w-xl mx-4 flex flex-col shadow-xl transform transition-all max-h-[90vh]"
      >
        <div className="p-4 flex-shrink-0">
          <h2 className="text-2xl font-semibold text-[#3061AD] mb-6">Create Event</h2>
          <ProgressSteps currentStep={step} />
        </div>

        <div className="overflow-y-auto p-4 flex-grow">
          {renderStep()}
        </div>

        <div className="flex justify-between p-4 border-t flex-shrink-0">
          <button
            className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            onClick={step === 1 ? onClose : handleBack}
          >
            {step === 1 ? "Cancel" : "Back"}
          </button>

          <button
            className="px-6 py-3 bg-[#3061AD] text-white rounded-md hover:bg-[#2B579A]"
            onClick={step < 3 ? handleNext : handleSave}
          >
            {step < 3 ? "Next" : "Save Draft & View Vendors"}
          </button>
        </div>
      </div>
    </div>
  );
}