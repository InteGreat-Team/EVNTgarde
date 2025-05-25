import React from "react";
import { Check } from "lucide-react";

interface ProgressStepsProps {
  currentStep: number;
}

export function ProgressSteps({ currentStep }: ProgressStepsProps) {
  const steps = [
    { number: 1, label: "Event Details" },
    { number: 2, label: "Services" },
    { number: 3, label: "Preview" },
  ];

  return (
    <div className="flex items-center mb-4">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center flex-1">
          {/* Step Circle and Label */}
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= step.number
                  ? "bg-[#3061AD] text-white"
                  : "border border-gray-300 text-gray-500"
              }`}
            >
              {currentStep > step.number ? (
                <Check size={16} />
              ) : (
                String(step.number).padStart(2, '0')
              )}
            </div>
            <div
              className={`ml-2 text-sm ${
                currentStep === step.number
                  ? "text-[#3061AD] font-medium"
                  : "text-gray-500"
              }`}
            >
              {step.label}
            </div>
          </div>
          
          {/* Connecting Line */}
          {index < steps.length - 1 && (
            <div className="flex-1 mx-4">
              <div
                className={`h-0.5 w-full ${
                  currentStep > step.number ? "bg-[#3061AD]" : "bg-gray-200"
                }`}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Demo component to show the progress steps in action
export default function ProgressStepsDemo() {
  const [currentStep, setCurrentStep] = React.useState(1);

  return (
    <div className="p-8 bg-white">
      <h2 className="text-2xl font-semibold text-[#3061AD] mb-6">Create Event</h2>
      <ProgressSteps currentStep={currentStep} />
      
      <div className="mt-8 flex gap-4">
        <button
          onClick={() => setCurrentStep(1)}
          className={`px-4 py-2 rounded ${currentStep === 1 ? 'bg-[#3061AD] text-white' : 'bg-gray-200'}`}
        >
          Step 1
        </button>
        <button
          onClick={() => setCurrentStep(2)}
          className={`px-4 py-2 rounded ${currentStep === 2 ? 'bg-[#3061AD] text-white' : 'bg-gray-200'}`}
        >
          Step 2
        </button>
        <button
          onClick={() => setCurrentStep(3)}
          className={`px-4 py-2 rounded ${currentStep === 3 ? 'bg-[#3061AD] text-white' : 'bg-gray-200'}`}
        >
          Step 3
        </button>
      </div>
    </div>
  );
}