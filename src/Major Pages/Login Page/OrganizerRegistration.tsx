import { Eye, EyeOff } from "lucide-react";
import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@/assets/OrganizerLogo.png";
import { registerUser } from "../../functions/authFunctions";
import { createUserAccount } from "../../functions/userAccount";
import { useTheme } from "../../functions/ThemeContext";
import {
  signInWithGoogle,
  signInWithYahoo,
} from "../../functions/authFunctions";
import { FcGoogle } from "react-icons/fc";
import { AiFillYahoo } from "react-icons/ai";

// Philippines location data
const philippinesCities = [
  "Manila",
  "Quezon City",
  "Davao City",
  "Caloocan",
  "Cebu City",
  "Zamboanga City",
  "Taguig",
  "Pasig",
  "Cagayan de Oro",
  "Parañaque",
  "Makati",
  "Pasay",
  "Bacolod",
  "General Santos",
  "Marikina",
];

const philippinesProvinces = [
  "Metro Manila",
  "Cebu",
  "Davao del Sur",
  "Negros Occidental",
  "Pangasinan",
  "Laguna",
  "Cavite",
  "Bulacan",
  "Rizal",
  "Batangas",
  "Pampanga",
  "Iloilo",
  "Zamboanga del Sur",
  "South Cotabato",
  "Leyte",
];

// Industry options
const industryOptions = [
  { value: "", label: "Please select your company industry" },
  { value: "corporate", label: "Corporate/Business Industry" },
  { value: "education", label: "Education Industry" },
  { value: "health", label: "Health & Wellness Industry" },
  { value: "media", label: "Media, Arts, & Entertainment Industry" },
  { value: "social", label: "Social & Lifestyle Industry" },
  { value: "government", label: "Government & Public Services Industry" },
  { value: "nonprofit", label: "Non-Profit & Advocacy Industry" },
  { value: "religious", label: "Religious Industry" },
];

// Budget options
const budgetOptions = [
  {
    value: "low",
    label: "₱10,000 - ₱25,000",
    description: "Low-Budget Organizer",
  },
  {
    value: "mid",
    label: "₱26,000 - ₱50,000",
    description: "Mid-Budget Organizer",
  },
  {
    value: "high",
    label: "₱51,000 - ₱500,000",
    description: "High-Budget Organizer",
  },
];

// Gender options
const genderOptions = [
  { value: "", label: "Select your gender" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

const OrganizerRegistration: React.FC<{ step: number }> = ({ step = 1 }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(step);
  const { isDarkMode } = useTheme();
  const [showTerms, setShowTerms] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Step 1 - What brings you here
  const [role, setRole] = useState("organizer");

  // Step 2 - Budget selection
  const [budget, setBudget] = useState("");
  const [budgetDescription, setBudgetDescription] = useState("");

  // Step 3 - Company details
  const [companyName, setCompanyName] = useState("");
  const [gender, setGender] = useState("");
  const [industry, setIndustry] = useState("");

  // Step 4 - Address details
  const [houseNo, setHouseNo] = useState("");
  const [street, setStreet] = useState("");
  const [barangay, setBarangay] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("Philippines");

  // Step 5 - Contact and password
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Add Poppins font
  useEffect(() => {
    // Create a link element for the Google Fonts
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Create a style element for custom styles
    const style = document.createElement("style");
    style.textContent = `
      * {
        font-family: 'Poppins', sans-serif !important;
      }
      
      body {
        margin: 0;
        padding: 0;
      }
      
      /* Custom scrollbar for the form area */
      .overflow-y-auto::-webkit-scrollbar {
        width: 6px;
      }
      
      .overflow-y-auto::-webkit-scrollbar-track {
        background: #f1f1f1;
      }
      
      .overflow-y-auto::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 3px;
      }
      
      .overflow-y-auto::-webkit-scrollbar-thumb:hover {
        background: #555;
      }
      
      /* Dark mode scrollbar */
      .dark .overflow-y-auto::-webkit-scrollbar-track {
        background: #2d3748;
      }
      
      .dark .overflow-y-auto::-webkit-scrollbar-thumb {
        background: #4a5568;
      }
      
      .dark .overflow-y-auto::-webkit-scrollbar-thumb:hover {
        background: #718096;
      }
    `;
    document.head.appendChild(style);

    // Cleanup function to remove the elements when component unmounts
    return () => {
      document.head.removeChild(link);
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    setCurrentStep(step);
  }, [step]);

  // Password validation
  useEffect(() => {
    const validatePassword = (pass: string): string => {
      if (pass.length < 8)
        return "Password must be at least 8 characters long.";
      if (!/[A-Z]/.test(pass))
        return "Password must include at least one uppercase letter.";
      if (!/\d/.test(pass)) return "Password must include at least one number.";
      if (!/[!@#$%^&*_]/.test(pass))
        return "Password must include at least one special character (!@#$%^&*_).";
      return "";
    };

    setPasswordError(validatePassword(password));
  }, [password]);

  // Confirm password validation
  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError("");
    }
  }, [password, confirmPassword]);

  // Phone number validation
  useEffect(() => {
    if (phoneNumber && phoneNumber.length !== 10) {
      setPhoneError(
        "Phone number must be 10 digits (excluding the +63 prefix)."
      );
    } else {
      setPhoneError("");
    }
  }, [phoneNumber]);

  // Handle budget selection
  const handleBudgetSelect = (value: string, description: string) => {
    setBudget(value);
    setBudgetDescription(description);
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!budget) {
        newErrors.budget = "Please select a budget range";
      }
    } else if (currentStep === 2) {
      if (!companyName) {
        newErrors.companyName = "Company name is required";
      }
      if (!gender) {
        newErrors.gender = "Gender is required";
      }
      if (!industry) {
        newErrors.industry = "Industry is required";
      }
    } else if (currentStep === 3) {
      // Changed from 2.5 to 3
      // House number is optional
      if (!street) {
        newErrors.street = "Street is required";
      }
      if (!barangay) {
        newErrors.barangay = "Barangay is required";
      }
      if (!city) {
        newErrors.city = "City is required";
      }
      if (!province) {
        newErrors.province = "Province is required";
      }
      if (!zipCode) {
        newErrors.zipCode = "Zip code is required";
      }
    } else if (currentStep === 4) {
      if (!phoneNumber) {
        newErrors.phoneNumber = "Phone number is required";
      } else if (phoneError) {
        newErrors.phoneNumber = phoneError;
      }
      if (!email) {
        newErrors.email = "Email is required";
      }
      if (!password) {
        newErrors.password = "Password is required";
      } else if (passwordError) {
        newErrors.password = passwordError;
      }
      if (!confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (confirmPasswordError) {
        newErrors.confirmPassword = confirmPasswordError;
      }
      if (!termsAccepted) {
        newErrors.terms = "You must accept the Terms and Conditions";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) {
      return;
    }

    // Save current step data to session storage
    saveStepData();

    if (currentStep === 1) {
      setCurrentStep(5); // Go to budget confirmation
    } else if (currentStep === 2) {
      setCurrentStep(3); // Company details to Address details
    } else if (currentStep === 3) {
      setCurrentStep(4); // Address details to Contact/Password
    } else if (currentStep === 4) {
      // Handle form submission
      handleCreateAccount(new Event("submit") as unknown as React.FormEvent);
    } else if (currentStep === 5) {
      setCurrentStep(2); // From budget confirmation to Company details
    }
  };
  const handleBack = () => {
    if (currentStep === 1) {
      navigate("/role-selection");
    } else if (currentStep === 2) {
      setCurrentStep(1); // Company details back to Budget selection
    } else if (currentStep === 3) {
      setCurrentStep(2); // Address details back to Company details
    } else if (currentStep === 4) {
      setCurrentStep(3); // Contact/Password back to Address details
    } else if (currentStep === 5) {
      setCurrentStep(1); // Budget confirmation back to Budget selection
    }
  };

  // Save step data to session storage
  const saveStepData = () => {
    const stepData = {
      role,
      budget,
      budgetDescription,
      companyName,
      gender,
      industry,
      houseNo,
      street,
      barangay,
      city,
      province,
      zipCode,
      country,
      phoneNumber,
      email,
    };
    sessionStorage.setItem(
      "organizerRegistrationData",
      JSON.stringify(stepData)
    );
  };

  // Load data from session storage
  useEffect(() => {
    const storedData = sessionStorage.getItem("organizerRegistrationData");
    if (storedData) {
      const data = JSON.parse(storedData);
      setRole(data.role || "organizer");
      setBudget(data.budget || "");
      setBudgetDescription(data.budgetDescription || "");
      setCompanyName(data.companyName || "");
      setGender(data.gender || "");
      setIndustry(data.industry || "");
      setHouseNo(data.houseNo || "");
      setStreet(data.street || "");
      setBarangay(data.barangay || "");
      setCity(data.city || "");
      setProvince(data.province || "");
      setZipCode(data.zipCode || "");
      setCountry(data.country || "Philippines");
      setPhoneNumber(data.phoneNumber || "");
      setEmail(data.email || "");
    }
  }, []);

  // Handle Google sign up
  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setErrors({});
    try {
      await signInWithGoogle("organizer");
      navigate("/organizer");
    } catch (err: any) {
      setErrors({
        general: "Failed to sign up with Google. Please try again.",
      });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Yahoo sign up
  const handleYahooSignUp = async () => {
    setIsLoading(true);
    setErrors({});
    try {
      await signInWithYahoo("organizer");
      navigate("/organizer");
    } catch (err: any) {
      setErrors({ general: "Failed to sign up with Yahoo. Please try again." });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep()) {
      return;
    }

    setIsLoading(true);

    try {
      // Create user account with all collected data
      const userData = createUserAccount("organizer", email, {
        budget,
        budgetDescription,
        companyName,
        gender,
        industry,
        address: {
          houseNo,
          street,
          barangay,
          city,
          province,
          zipCode,
          country,
        },
        phoneNumber: phoneNumber ? `+63${phoneNumber}` : "",
        userType: "organizer",
      });

      // Register user with Firebase and cloud function
      const firebaseUser = await registerUser(
        email,
        password,
        "organizer",
        userData
      );

      if (!firebaseUser) {
        throw new Error("Registration failed: No Firebase user returned.");
      }

      // Clear session storage
      sessionStorage.removeItem("organizerRegistration");
      navigate("/login");
    } catch (err: any) {
      setErrors({
        general: err.message || "Failed to create account. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Terms and conditions modal
  const TermsAndConditionsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 bg-white/10 backdrop-brightness-50">
      <div
        className={`w-full max-w-2xl p-6 rounded-lg shadow-lg ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <h2 className="text-2xl font-bold mb-4 text-blue-600">
          Terms and Conditions
        </h2>

        <div className="max-h-96 overflow-y-auto mb-6 pr-2">
          <p className="mb-4">
            By using our platform, you agree to these Terms and Conditions.
            Please read them carefully.
          </p>

          <ol className="list-decimal pl-5 space-y-4">
            <li>
              <p className="font-medium">Acceptance of Terms</p>
              <p>
                By accessing or using EVNTgarde, you agree to be bound by these
                Terms and our Privacy Policy. If you do not agree, please do not
                use our services.
              </p>
            </li>

            <li>
              <p className="font-medium">User Roles and Responsibilities</p>
              <ul className="list-disc pl-5 mt-2">
                <li>
                  Clients: Responsible for providing accurate event details and
                  timely payments.
                </li>
                <li>
                  Organizers: Must communicate requirements clearly and honor
                  commitments.
                </li>
                <li>
                  Vendors: Must deliver services as described and adhere to
                  agreed timelines.
                </li>
              </ul>
            </li>

            <li>
              <p className="font-medium">Account Registration</p>
              <p>
                You must provide accurate information and keep your account
                secure. You are responsible for all activities under your
                account.
              </p>
            </li>

            <li>
              <p className="font-medium">Payments and Fees</p>
              <p>
                Payments are processed through secure third-party providers.
                Service fees may apply and will be disclosed before
                confirmation.
              </p>
            </li>
          </ol>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setShowTerms(false)}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Close
          </button>
          <button
            onClick={() => {
              setTermsAccepted(true);
              setShowTerms(false);
            }}
            className={`px-6 py-2 text-white rounded-lg ${isDarkMode ? "bg-blue-700 hover:bg-blue-800" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="flex h-screen items-center justify-center bg-gray-300 p-4"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div
        className={`flex w-[1440px] h-[650px] ${
          isDarkMode ? "bg-gray-800" : "bg-blue-600"
        } rounded-xl shadow-lg overflow-hidden`}
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {/* Left Side - Logo & Text */}
        <div
          className={`w-2/5 ${
            isDarkMode ? "bg-gray-800" : "bg-blue-600"
          } text-white flex flex-col items-center justify-center text-center p-8`}
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          <img
            src={Logo || "/placeholder.svg"}
            className="max-w-xs mb-4"
            alt="Logo"
          />
          <p className="text-lg font-medium mb-2">
            Discover tailored events services.
          </p>
          <p className="text-lg font-medium mb-2">
            Sign up for personalized services today!
          </p>
        </div>

        {/* Right Side - Form */}
        <div
          className={`w-3/5 ${
            isDarkMode ? "bg-black text-white" : "bg-white text-gray-800"
          } p-12 flex flex-col justify-center rounded-l-[50px] shadow-md relative overflow-y-auto`}
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {/* Step 1: Budget Selection */}
          {currentStep === 1 && (
            <>
              <h2 className="text-4xl font-bold mb-6">Sign Up</h2>
              <p className="text-lg mb-6">
                How much do you usually charge for your events?
                <br />
                <span className="text-sm text-gray-500">
                  This helps us categorize you properly and suggest the right
                  tools for your events.
                </span>
              </p>

              {errors.budget && (
                <p className="text-red-500 text-sm mb-2">{errors.budget}</p>
              )}

              <div className="space-y-4 mb-8">
                {budgetOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      budget === option.value
                        ? isDarkMode
                          ? "border-blue-500 bg-blue-900/20"
                          : "border-blue-500 bg-blue-50"
                        : isDarkMode
                          ? "border-gray-700 hover:border-gray-500"
                          : "border-gray-300 hover:border-gray-400"
                    }`}
                    onClick={() =>
                      handleBudgetSelect(option.value, option.description)
                    }
                  >
                    <div className="font-medium">{option.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-auto">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className={`px-6 py-3 text-white rounded-lg ${
                    isDarkMode
                      ? "bg-blue-700 hover:bg-blue-800"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  disabled={!budget}
                >
                  Next
                </button>
              </div>
              <p className="text-center text-sm mt-4 text-gray-500">
                Already have an account?{" "}
                <a href="/login" className="text-blue-600 hover:underline">
                  Log in
                </a>
              </p>
            </>
          )}

          {/* Step 2: Company Details */}
          {currentStep === 2 && (
            <>
              <h2 className="text-4xl font-bold mb-6">Sign Up</h2>
              <p className="text-lg mb-2">Step 1 of 3</p>

              {errors.general && (
                <div className="bg-red-500 text-white p-3 rounded-md mb-4">
                  {errors.general}
                </div>
              )}

              <div className="flex items-center justify-center gap-4 mb-4">
                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border w-full 
                    ${
                      isDarkMode
                        ? "bg-black border-gray-600 text-white hover:bg-gray-700"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-100"
                    }`}
                  disabled={isLoading}
                >
                  <FcGoogle size={20} />
                  <span className="font-medium">Sign up with Google</span>
                </button>
                <button
                  type="button"
                  onClick={handleYahooSignUp}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border w-full
                    ${
                      isDarkMode
                        ? "bg-black border-gray-600 text-white hover:bg-gray-900"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-100"
                    }`}
                  disabled={isLoading}
                >
                  <AiFillYahoo size={20} className="text-purple-600" />
                  <span className="font-medium">Sign up with Yahoo</span>
                </button>
              </div>

              <div className="relative flex items-center py-2 mb-4">
                <div
                  className={`flex-grow border-t ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}
                ></div>
                <span
                  className={`flex-shrink mx-4 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  OR
                </span>
                <div
                  className={`flex-grow border-t ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}
                ></div>
              </div>

              <form className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}
                  >
                    Company Name
                  </label>
                  <input
                    type="text"
                    placeholder="ABC Events"
                    className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-blue-500 ${
                      errors.companyName ? "border-red-500" : ""
                    } ${
                      isDarkMode
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-white text-gray-800 border-gray-300"
                    }`}
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  />
                  {errors.companyName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.companyName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}
                  >
                    Gender
                  </label>
                  <select
                    className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.gender ? "border-red-500" : ""
                    } ${
                      isDarkMode
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-white text-gray-800 border-gray-300"
                    }`}
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {genderOptions.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        className={isDarkMode ? "text-white" : "text-gray-800"}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.gender && (
                    <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                  )}
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}
                  >
                    Industry
                  </label>
                  <select
                    className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.industry ? "border-red-500" : ""
                    } ${
                      isDarkMode
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-white text-gray-800 border-gray-300"
                    }`}
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    required
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {industryOptions.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        className={isDarkMode ? "text-white" : "text-gray-800"}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.industry && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.industry}
                    </p>
                  )}
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className={`px-6 py-3 text-white rounded-lg ${
                      isDarkMode
                        ? "bg-blue-700 hover:bg-blue-800"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </form>
            </>
          )}

          {/* Step 3: Address Details */}
          {currentStep === 3 && (
            <>
              <h2 className="text-4xl font-bold mb-6">Sign Up</h2>
              <p className="text-lg mb-2">Step 2 of 3</p>

              {errors.general && (
                <div className="bg-red-500 text-white p-3 rounded-md mb-4">
                  {errors.general}
                </div>
              )}

              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}
                    >
                      House No. (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-blue-500 ${
                        isDarkMode
                          ? "bg-gray-700 text-white border-gray-600"
                          : "bg-white text-gray-800 border-gray-300"
                      }`}
                      value={houseNo}
                      onChange={(e) => setHouseNo(e.target.value)}
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}
                    >
                      Street
                    </label>
                    <input
                      type="text"
                      placeholder="Main Street"
                      className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-blue-500 ${
                        errors.street ? "border-red-500" : ""
                      } ${
                        isDarkMode
                          ? "bg-gray-700 text-white border-gray-600"
                          : "bg-white text-gray-800 border-gray-300"
                      }`}
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      required
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    />
                    {errors.street && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.street}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}
                  >
                    Barangay
                  </label>
                  <input
                    type="text"
                    placeholder="San Lorenzo"
                    className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-blue-500 ${
                      errors.barangay ? "border-red-500" : ""
                    } ${
                      isDarkMode
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-white text-gray-800 border-gray-300"
                    }`}
                    value={barangay}
                    onChange={(e) => setBarangay(e.target.value)}
                    required
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  />
                  {errors.barangay && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.barangay}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}
                  >
                    City
                  </label>
                  <select
                    className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.city ? "border-red-500" : ""
                    } ${
                      isDarkMode
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-white text-gray-800 border-gray-300"
                    }`}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    <option value="">Select your city</option>
                    {philippinesCities.map((cityName) => (
                      <option
                        key={cityName}
                        value={cityName}
                        className={isDarkMode ? "text-white" : "text-gray-800"}
                      >
                        {cityName}
                      </option>
                    ))}
                  </select>
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}
                    >
                      Province
                    </label>
                    <select
                      className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.province ? "border-red-500" : ""
                      } ${
                        isDarkMode
                          ? "bg-gray-700 text-white border-gray-600"
                          : "bg-white text-gray-800 border-gray-300"
                      }`}
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      required
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      <option value="">Select your province</option>
                      {philippinesProvinces.map((provinceName) => (
                        <option
                          key={provinceName}
                          value={provinceName}
                          className={
                            isDarkMode ? "text-white" : "text-gray-800"
                          }
                        >
                          {provinceName}
                        </option>
                      ))}
                    </select>
                    {errors.province && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.province}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}
                    >
                      Zip Code
                    </label>
                    <input
                      type="text"
                      placeholder="1000"
                      className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-blue-500 ${
                        errors.zipCode ? "border-red-500" : ""
                      } ${
                        isDarkMode
                          ? "bg-gray-700 text-white border-gray-600"
                          : "bg-white text-gray-800 border-gray-300"
                      }`}
                      value={zipCode}
                      onChange={(e) =>
                        setZipCode(e.target.value.replace(/\D/g, ""))
                      }
                      required
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    />
                    {errors.zipCode && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.zipCode}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}
                  >
                    Country
                  </label>
                  <select
                    className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-white text-gray-800 border-gray-300"
                    }`}
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    disabled
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    <option value="Philippines">Philippines</option>
                  </select>
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className={`px-6 py-3 text-white rounded-lg ${
                      isDarkMode
                        ? "bg-blue-700 hover:bg-blue-800"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </form>
            </>
          )}

          {/* Step 4: Contact and Password */}
          {currentStep === 4 && (
            <>
              <h2 className="text-4xl font-bold mb-6">Sign Up</h2>
              <p className="text-lg mb-2">Step 3 of 3</p>

              {errors.general && (
                <div className="bg-red-500 text-white p-3 rounded-md mb-4">
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleCreateAccount} className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}
                  >
                    Phone Number (required)
                  </label>
                  <div className="flex items-center border rounded-md">
                    <span
                      className={`px-3 py-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}
                    >
                      +63
                    </span>
                    <input
                      type="text"
                      placeholder="9XX XXX XXXX"
                      className={`w-full px-4 py-2 rounded-md focus:outline-none ${
                        errors.phoneNumber ? "border-red-500" : ""
                      } ${
                        isDarkMode
                          ? "bg-gray-700 text-white border-gray-600"
                          : "bg-white text-gray-800 border-gray-300"
                      }`}
                      value={phoneNumber}
                      onChange={(e) =>
                        setPhoneNumber(e.target.value.replace(/\D/g, ""))
                      }
                      required
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}
                  >
                    Company Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="company@example.com"
                    className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-blue-500 ${
                      errors.email ? "border-red-500" : ""
                    } ${
                      isDarkMode
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-white text-gray-800 border-gray-300"
                    }`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}
                  >
                    Enter Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      className={`w-full px-4 py-2 border rounded-md text-sm ${
                        errors.password ? "border-red-500" : ""
                      } ${
                        isDarkMode
                          ? "bg-gray-700 text-white border-gray-600"
                          : "bg-white text-gray-800 border-gray-300"
                      }`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      className={`w-full px-4 py-2 border rounded-md text-sm ${
                        errors.confirmPassword ? "border-red-500" : ""
                      } ${
                        isDarkMode
                          ? "bg-gray-700 text-white border-gray-600"
                          : "bg-white text-gray-800 border-gray-300"
                      }`}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className="flex items-center mt-4">
                  <input
                    id="terms"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    required
                  />
                  <label htmlFor="terms" className="ml-2 text-sm">
                    I agree with the{" "}
                    <button
                      type="button"
                      className="text-blue-600 hover:underline"
                      onClick={() => setShowTerms(true)}
                    >
                      Terms and Conditions
                    </button>
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-red-500 text-sm">{errors.terms}</p>
                )}

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className={`px-6 py-3 text-white rounded-lg ${
                      isDarkMode
                        ? "bg-blue-700 hover:bg-blue-800"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </div>
              </form>
            </>
          )}

          {/* Step 5: Budget Confirmation */}
          {currentStep === 5 && (
            <>
              <h2 className="text-4xl font-bold mb-6">Sign Up</h2>

              <div className="text-center mb-8">
                <p className="text-xl font-medium mb-4">
                  You're a {budgetDescription}!
                </p>
                <p className="text-base text-gray-600 mb-6">
                  We've categorized you based on your typical event budget.
                </p>
              </div>

              <div className="flex justify-center items-center gap-5">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  Start Over
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)} // Go to company details step
                  className={`px-6 py-3 text-white rounded-lg ${
                    isDarkMode
                      ? "bg-blue-700 hover:bg-blue-800"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  Get Started
                </button>
              </div>

              <p className="text-center text-sm mt-4 text-gray-500">
                Already have an account?{" "}
                <a href="/login" className="text-blue-600 hover:underline">
                  Log in
                </a>
              </p>
            </>
          )}

          {/* Terms and Conditions Modal */}
          {showTerms && <TermsAndConditionsModal />}
        </div>
      </div>
    </div>
  );
};

export default OrganizerRegistration;
