"use client";

import type React from "react";
import { FcGoogle } from "react-icons/fc";
import { AiFillYahoo } from "react-icons/ai";
import type { VendorFormData, SelectOption } from "../../../functions/types";

// Import shared components (you can move these to a separate file later)
const InputField: React.FC<{
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  isDarkMode: boolean;
}> = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  isDarkMode,
}) => (
  <div>
    <label
      className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}
    >
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-blue-500 ${
        isDarkMode
          ? "bg-gray-700 text-white border-gray-600"
          : "bg-white text-gray-800 border-gray-300"
      }`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
    />
  </div>
);

const SelectField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  required?: boolean;
  isDarkMode: boolean;
}> = ({ label, value, onChange, options, required = false, isDarkMode }) => (
  <div>
    <label
      className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}
    >
      {label}
    </label>
    <select
      className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        isDarkMode
          ? "bg-gray-700 text-white border-gray-600"
          : "bg-white text-gray-800 border-gray-300"
      }`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
    >
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          className={isDarkMode ? "text-white" : "text-gray-800"}
        >
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const ButtonGroup: React.FC<{
  onBack: () => void;
  currentStep: number;
  isLoading: boolean;
  isDarkMode: boolean;
}> = ({ onBack, currentStep, isLoading, isDarkMode }) => (
  <div className="flex justify-center items-center gap-4">
    <button
      type="button"
      onClick={onBack}
      className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-blue-600 bg-white hover:bg-gray-100 dark:text-blue-400 dark:border-gray-600 dark:bg-transparent dark:hover:bg-gray-700"
    >
      {currentStep === 1 ? "Start Over" : "Back"}
    </button>
    <button
      type="submit"
      className={`flex-1 px-6 py-3 text-white ${
        isDarkMode
          ? "bg-gray-800 hover:bg-gray-300"
          : "bg-blue-600 hover:bg-blue-300"
      } rounded-xl shadow-lg font-poppins flex items-center justify-center`}
    >
      {isLoading && (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
      )}
      Next
    </button>
  </div>
);

interface VendorDetailsStepsProps {
  formData: VendorFormData;
  currentStep: number;
  isLoading: boolean;
  isDarkMode: boolean;
  onUpdateFormData: (updates: Partial<VendorFormData>) => void;
  onSocialSignUp: (provider: "google" | "yahoo") => void;
  onNext: (e: React.FormEvent) => void;
  onBack: () => void;
}

const VendorDetailsSteps: React.FC<VendorDetailsStepsProps> = ({
  formData,
  currentStep,
  isLoading,
  isDarkMode,
  onUpdateFormData,
  onSocialSignUp,
  onNext,
  onBack,
}) => {
  const serviceOptions: SelectOption[] = [
    { value: "", label: "Please select service offered" },
    { value: "catering", label: "Catering and Food Services" },
    { value: "venue", label: "Furniture" },
    { value: "entertainment", label: "Audio and Visual Equipment" },
    { value: "decoration", label: "Decor and Styling" },
    { value: "photography", label: "Entertainment and Hosts" },
  ];

  const genderOptions: SelectOption[] = [
    { value: "", label: "Select your gender" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
    { value: "prefer-not-to-say", label: "Prefer not to say" },
  ];

  const SocialSignUpButtons = () => (
    <div className="flex items-center justify-center gap-4 mb-4">
      {[
        {
          icon: FcGoogle,
          text: "Google",
          handler: () => onSocialSignUp("google"),
        },
        {
          icon: AiFillYahoo,
          text: "Yahoo",
          handler: () => onSocialSignUp("yahoo"),
          iconClass: "text-purple-600",
        },
      ].map(({ icon: Icon, text, handler, iconClass }) => (
        <button
          key={text}
          type="button"
          onClick={handler}
          disabled={isLoading}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg border w-full ${
            isDarkMode
              ? "bg-black border-gray-600 text-white hover:bg-gray-700"
              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-100"
          }`}
        >
          <Icon size={20} className={iconClass} />
          <span className="font-medium">Sign up with {text}</span>
        </button>
      ))}
    </div>
  );

  return (
    <>
      <h2 className="text-4xl font-bold mt-4 mb-6">Sign Up</h2>
      <p className="text-xl text-gray-500 mb-6">Step 1 of 3</p>

      <SocialSignUpButtons />

      <div className="relative flex items-center py-2 mb-4">
        <div
          className={`flex-grow border-t ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}
        />
        <span
          className={`flex-shrink mx-4 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
        >
          OR
        </span>
        <div
          className={`flex-grow border-t ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}
        />
      </div>

      <form className="space-y-6" onSubmit={onNext}>
        <InputField
          label="Business Name"
          placeholder="John's Catering"
          value={formData.vendorName}
          onChange={(value) => onUpdateFormData({ vendorName: value })}
          required
          isDarkMode={isDarkMode}
        />

        {formData.vendorType === "solo" && (
          <SelectField
            label="Select your gender"
            value={formData.gender}
            onChange={(value) => onUpdateFormData({ gender: value })}
            options={genderOptions}
            required
            isDarkMode={isDarkMode}
          />
        )}

        <SelectField
          label="Services Offered"
          value={formData.businessOffering}
          onChange={(value) => onUpdateFormData({ businessOffering: value })}
          options={serviceOptions}
          required
          isDarkMode={isDarkMode}
        />

        <ButtonGroup
          onBack={onBack}
          currentStep={currentStep}
          isLoading={isLoading}
          isDarkMode={isDarkMode}
        />
      </form>
    </>
  );
};

export default VendorDetailsSteps;
