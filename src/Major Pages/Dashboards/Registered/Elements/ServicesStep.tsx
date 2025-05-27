import { useState } from "react";
import { X, Check, Plus, Upload } from "lucide-react";
import { StepProps, EventData } from "../../../../functions/types";

interface ServicesStepProps extends StepProps {
  setEventData: (data: EventData) => void;
}

export function ServicesStep({ eventData, errors, onInputChange }: ServicesStepProps) {
  const [customService, setCustomService] = useState("");

  const handleServiceToggle = (service: string) => {
    const updatedServices = [...eventData.services];
    const serviceIndex = updatedServices.indexOf(service);

    if (serviceIndex === -1) {
      updatedServices.push(service);
    } else {
      updatedServices.splice(serviceIndex, 1);
    }

    onInputChange("services", updatedServices);
  };

  const addCustomService = () => {
    if (customService.trim()) {
      onInputChange("customServices", [...eventData.customServices, customService.trim()]);
      setCustomService("");
    }
  };

  const removeCustomService = (index: number) => {
    const updatedServices = [...eventData.customServices];
    updatedServices.splice(index, 1);
    onInputChange("customServices", updatedServices);
  };

  return (
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
        {errors.services && (
          <p className="text-red-500 text-xs mt-1">At least one service is required</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Services
        </label>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter custom service"
            className="flex-1 p-3 border border-gray-300 rounded-md"
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
                <li
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                >
                  <span>{service}</span>
                  <button
                    className="text-red-500"
                    onClick={() => removeCustomService(index)}
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Total Event Budget
        </label>
        <input
          type="text"
          placeholder="e.g., PHP 100,000"
          className={`w-full p-3 border ${errors.budget ? "border-red-500" : "border-gray-300"} rounded-md`}
          value={eventData.budget}
          onChange={(e) => onInputChange("budget", e.target.value)}
        />
        {errors.budget && (
          <p className="text-red-500 text-xs mt-1">Budget is required</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Event Files/Resources{" "}
          <span className="text-gray-500 text-xs">(optional)</span>
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
              e.preventDefault();
              alert("File upload functionality is currently disabled");
            }}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}