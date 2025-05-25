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
    <div className="flex items-center justify-between mb-4">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= step.number
                  ? "bg-[#3061AD] text-white"
                  : "border border-gray-300 text-gray-500"
              }`}
            >
              {currentStep > step.number ? (
                <Check size={16} />
              ) : (
                `0${step.number}`
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
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-4 ${
                currentStep > step.number ? "bg-[#3061AD]" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
