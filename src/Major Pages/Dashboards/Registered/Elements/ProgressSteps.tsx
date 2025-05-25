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
    <div className="mb-4">
      <div className="flex items-center justify-between relative">
        {/* Background line connecting step centers - starts from center of first step to center of last step */}
        <div className="absolute top-4 h-0.5 bg-gray-200" style={{ left: '16px', right: '16px' }}></div>
        
        {/* Progress line that fills based on current step */}
        <div 
          className="absolute top-4 h-0.5 bg-[#3061AD] transition-all duration-300"
          style={{ 
            left: '16px',
            width: currentStep === 1 ? '0px' : 
                   currentStep === 2 ? 'calc(50% - 16px)' : 
                   'calc(100% - 32px)' 
          }}
        ></div>
        
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col items-center relative z-10">
            {/* Step Circle */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= step.number
                  ? "bg-[#3061AD] text-white"
                  : "bg-white border-2 border-gray-300 text-gray-500"
              }`}
            >
              {currentStep > step.number ? (
                <Check size={16} />
              ) : (
                String(step.number).padStart(2, '0')
              )}
            </div>
            
            {/* Step Label */}
            <div
              className={`mt-2 text-sm whitespace-nowrap ${
                currentStep === step.number
                  ? "text-[#3061AD] font-medium"
                  : "text-gray-500"
              }`}
            >
              {step.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}