import { Eye, EyeOff } from "lucide-react";
import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/OrganizerLogo.png";
import { registerUser, signInWithGoogle, signInWithYahoo } from "../../functions/authFunctions";
import { createUserAccount } from "../../functions/userAccount";
import { useTheme } from "../../functions/ThemeContext";
import { FcGoogle } from "react-icons/fc";
import { AiFillYahoo } from "react-icons/ai";

const IndividualRegistration: React.FC<{ step: number }> = ({ step = 1 }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(step);
  const { isDarkMode } = useTheme();

  // Step 2 form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [preferences, setPreferences] = useState<string[]>([]);

  // Add new state variables for address form
  const [houseNo, setHouseNo] = useState("");
  const [street, setStreet] = useState("");
  const [barangay, setBarangay] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");

  // Step 3 form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);

  // Terms and conditions modal
  const [showTermsModal, setShowTermsModal] = useState(false);

  const [userRole, setUserRole] = useState<string>("");
  const [eventPreferencesError, setEventPreferencesError] = useState("");

  // Common state
  const [error, setError] = useState("");

  // Available event types
  const eventTypes = [
    "Birthday",
    "Wedding",
    "Anniversary",
    "Baby Shower",
    "Gender Reveal",
    "Engagement",
    "Seminar",
    "Workshop",
    "Conference",
    "Convention",
    "Product Launch",
    "Networking",
    "Training Session",
    "Certification Class",
    "Concert",
    "Live Performance",
    "Art Exhibit",
    "Gallery Opening",
    "Open Mic",
    "Theater/Stage Play",
    "Festival/Parade",
    "Talent Show",
    "Church Service",
    "Spiritual Retreat",
    "Fundraiser",
    "Charity Event",
    "Outreach/Volunteering Drive",
    "Religious Ceremony (e.g. Baptism)",
  ];

  useEffect(() => {
    setCurrentStep(step);
  }, [step]);

  // Password validation
  useEffect(() => {
    const validatePassword = (pass: string): string => {
      if (pass.length < 12)
        return "Password must be at least 12 characters long.";
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

  // Load data from session storage when moving to step 3
  useEffect(() => {
    if (currentStep === 3) {
      const storedData = sessionStorage.getItem("individualRegistration");
      if (storedData) {
        const data = JSON.parse(storedData);
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setPhoneNumber(data.phoneNumber ? data.phoneNumber.replace("+63", "") : "");
        setPreferences(data.preferences || []);
        setUserRole(data.userRole || "");

        // Load address data
        if (data.address) {
          setHouseNo(data.address.houseNo || "");
          setStreet(data.address.street || "");
          setBarangay(data.address.barangay || "");
          setCity(data.address.city || "");
          setProvince(data.address.province || "");
          setZipCode(data.address.zipCode || "");
          setCountry(data.address.country || "");
        }
      }
    }
  }, [currentStep]);

   // Handle role selection
  const handleRoleSelect = (role: string) => {
    setUserRole(role)

    // Store the selected role in session storage
    const storedData = sessionStorage.getItem("individualRegistration") || "{}"
    const parsedData = JSON.parse(storedData)
    sessionStorage.setItem(
      "individualRegistration",
      JSON.stringify({
        ...parsedData,
        userRole: role,
      }),
    )

    // Go to welcome screen
    setCurrentStep(1.25)
  };

  // Handle welcome screen proceed button
  const handleProceed = () => {
    setCurrentStep(1.5);
  };

  // Handle event preference toggle
  const toggleEventPreference = (eventType: string) => {
    setEventPreferencesError("");

    if (preferences.includes(eventType)) {
      // Remove the event type if it's already selected
      setPreferences(preferences.filter((type) => type !== eventType));
    } else {
      // Add the event type if it's not already selected and we haven't reached the limit
      if (preferences.length < 5) {
        setPreferences([...preferences, eventType]);
      } else {
        setEventPreferencesError("You can select up to 5 event types");
      }
    }
  };

  // Handle event preferences submission
  const handlePreferencesNext = () => {
    // Store preferences in session storage
    const storedData = sessionStorage.getItem("individualRegistration") || "{}";
    const parsedData = JSON.parse(storedData);

    sessionStorage.setItem(
      "individualRegistration",
      JSON.stringify({
        ...parsedData,
        preferences,
      }),
    );

    // Go to personal info step
    setCurrentStep(2);
  };

  // Handle step 2 submission
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName) {
      setError("First name and last name are required");
      return;
    }

    // Store form data in sessionStorage
    const storedData = sessionStorage.getItem("individualRegistration") || "{}";
    const parsedData = JSON.parse(storedData);

    sessionStorage.setItem(
      "individualRegistration",
      JSON.stringify({
        ...parsedData,
        firstName,
        lastName,
        phoneNumber: phoneNumber ? `+63${phoneNumber}` : "",
      }),
    );

    // Navigate to address form step
    setCurrentStep(2.5);
  };

  // Handle address form submission
  const handleAddressNext = (e: React.FormEvent) => {
    e.preventDefault();

    if (!city) {
      setError("City is required");
      return;
    }

    // Store address data in session storage
    const storedData = sessionStorage.getItem("individualRegistration") || "{}";
    const parsedData = JSON.parse(storedData);

    sessionStorage.setItem(
      "individualRegistration",
      JSON.stringify({
        ...parsedData,
        address: {
          houseNo,
          street,
          barangay,
          city,
          province,
          zipCode,
          country,
        },
      }),
    );

    // Navigate to account creation step
    setCurrentStep(3);
  };

  // Handle back button
  const handleBack = () => {
    if (currentStep === 1) {
      navigate("/role-selection");
    } else if (currentStep === 1.25) {
      setCurrentStep(1);
    } else if (currentStep === 1.5) {
      setCurrentStep(1.25);
    } else if (currentStep === 2) {
      setCurrentStep(1.5);
    } else if (currentStep === 2.5) {
      setCurrentStep(2);
    } else {
      setCurrentStep(2.5);
    }
  };

  // Open terms and conditions modal
  const openTermsModal = (e: React.MouseEvent | React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setShowTermsModal(true);
  };

  // Close terms and conditions modal
  const closeTermsModal = () => {
    setShowTermsModal(false);
  };

  // Accept terms and conditions
  const acceptTerms = () => {
    setTermsAgreed(true);
    closeTermsModal();
  };

  // Handle final submission
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (!termsAgreed) {
      setError("You must agree to the Terms and Conditions");
      return;
    }

    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (confirmPasswordError) {
      setError(confirmPasswordError);
      return;
    }

    setIsLoading(true);

    try {
      // Get stored data including userRole
      const storedData = sessionStorage.getItem("individualRegistration");
      const userData = storedData ? JSON.parse(storedData) : {};

      // Create user account with data from all parts
      const userAccountData = createUserAccount("individual", email, {
        firstName,
        lastName,
        phoneNumber: phoneNumber ? `+63${phoneNumber}` : "",
        preferences,
        userRole: userData.userRole || "",
        address: {
          houseNo,
          street,
          barangay,
          city,
          province,
          zipCode,
          country,
        },
      });

      const firebaseUser = await registerUser(email, password, "individual", userAccountData);
console.log("firebaseUser:", firebaseUser);
const firebaseUid = firebaseUser?.uid;
console.log("firebaseUid:", firebaseUid);

if (!firebaseUid) {
  setError("Registration failed: No Firebase UID returned.");
  setIsLoading(false);
  return;
}
      // Register user with PostgreSQL
    try {
      const response = await fetch('http://localhost:5000/api/registerCustomer', {
        method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firebaseUid, // <-- send this
            firstName,
            lastName,
            email,
            password,
            phoneNo: phoneNumber ? `+63${phoneNumber}` : null,
            preferences: preferences.join(','),
            customerType: userData.userRole || "enthusiast"
          }),
        });

        if (!response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to register with database');
          } else {
            throw new Error(`Server error: ${response.status}`);
          }
        }

        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message || 'Registration failed');
        }
      } catch (dbError: any) {
        console.error('Database registration error:', dbError);
        // If database registration fails, we should clean up the Firebase user
        if (firebaseUser) {
          await firebaseUser.delete();
        }
        throw new Error(dbError.message || 'Failed to register with database. Please try again.');
      }

      // Clear session storage
      sessionStorage.removeItem("individualRegistration");

      // Navigate to dashboard or login page
      navigate("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setError("");
    try {
      await signInWithGoogle("individual");
      // Navigate to customer dashboard
      navigate("/login");
    } catch (err: any) {
      setError("Failed to sign up with Google. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleYahooSignUp = async () => {
    setIsLoading(true);
    setError("");
    try {
      await signInWithYahoo("individual");
      // Navigate to customer dashboard
      navigate("/login");
    } catch (err: any) {
      setError("Failed to sign up with Yahoo. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Get the appropriate welcome message based on user role
  const getWelcomeMessage = () => {
    if (userRole === "enthusiast") {
      return "You're a Customer - an Event Enthusiast!";
    } else if (userRole === "student") {
      return "You're a Customer - a Student!";
    } else if (userRole === "church") {
      return "You're a Customer - a Church Member!";
    } else {
      return "You're a Client!";
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-300 font-[Poppins] p-4">
      <div
        className={`flex w-[1440px] h-[650px] ${
          isDarkMode ? "bg-gray-800" : "bg-blue-600"
        } rounded-xl shadow-lg overflow-hidden font-poppins`}
      >
        {/* Left Side - Logo & Text */}
        <div
          className={`w-2/5 ${
            isDarkMode ? "bg-gray-800" : "bg-blue-600"
          } text-white flex flex-col items-center justify-center text-center p-8`}
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
        >
          {currentStep === 1 ? (
            /* Role Selection Screen */
            <>
              <h2 className="text-4xl font-bold text-blue-600 mt-30 mb-6">Sign Up</h2>

              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-2">Which best describes you?</h3>
                <p className="text-sm text-gray-500 mb-6">Select the option that best describes you.</p>

                <div className="space-y-4">
                  <div
                    className={`p-4 border rounded-lg cursor-pointer ${
                      userRole === "enthusiast"
                        ? isDarkMode
                          ? "bg-gray-700 border-blue-500"
                          : "bg-blue-50 border-blue-500"
                        : isDarkMode
                          ? "border-gray-600 hover:bg-gray-700"
                          : "border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setUserRole("enthusiast")}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        checked={userRole === "enthusiast"}
                        onChange={() => setUserRole("enthusiast")}
                        className="mr-3"
                      />
                      <span>I'm an event enthusiast - just exploring for now</span>
                    </div>
                  </div>

                  <div
                    className={`p-4 border rounded-lg cursor-pointer ${
                      userRole === "student"
                        ? isDarkMode
                          ? "bg-gray-700 border-blue-500"
                          : "bg-blue-50 border-blue-500"
                        : isDarkMode
                          ? "border-gray-600 hover:bg-gray-700"
                          : "border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setUserRole("student")}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        checked={userRole === "student"}
                        onChange={() => setUserRole("student")}
                        className="mr-3"
                      />
                      <span>I'm a student</span>
                    </div>
                  </div>

                  <div
                    className={`p-4 border rounded-lg cursor-pointer ${
                      userRole === "church"
                        ? isDarkMode
                          ? "bg-gray-700 border-blue-500"
                          : "bg-blue-50 border-blue-500"
                        : isDarkMode
                          ? "border-gray-600 hover:bg-gray-700"
                          : "border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setUserRole("church")}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        checked={userRole === "church"}
                        onChange={() => setUserRole("church")}
                        className="mr-3"
                      />
                      <span>I'm part of a church group</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center items-center gap-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-blue-600 bg-white hover:bg-gray-100 dark:text-blue-400 dark:border-gray-600 dark:bg-transparent dark:hover:bg-gray-700"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSelect(userRole)}
                  disabled={!userRole}
                  className={`flex-1 px-6 py-3 text-white ${
                    !userRole
                      ? "bg-gray-400 cursor-not-allowed"
                      : isDarkMode
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  Next
                </button>
              </div>

              <p className={`text-center mt-4 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
                Already have an account?{" "}
                <a href="/login" className="text-blue-600 hover:underline">
                  Log in
                </a>
              </p>
            </>
          ) : currentStep === 1.25 ? (
            /* Welcome Screen */
            <>
              <h2 className="text-4xl font-bold text-blue-600 mt-30 mb-6">Sign Up</h2>

              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4">{getWelcomeMessage()}</h3>
                <p className="text-lg mb-6">
                  Perfect Pick! Find experienced organizers to bring your event to life. We'll help you get set up right
                  away.
                </p>
              </div>

              <div className="flex justify-center items-center gap-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-blue-600 bg-white hover:bg-gray-100 dark:text-blue-400 dark:border-gray-600 dark:bg-transparent dark:hover:bg-gray-700"
                >
                  Start Over
                </button>
                <button
                  type="button"
                  onClick={handleProceed}
                  className={`flex-1 px-6 py-3 text-white ${
                    isDarkMode ? "bg-gray-800 hover:bg-gray-300" : "bg-blue-600"
                  } rounded-xl shadow-lg overflow-hidden font-poppins`}
                >
                  Get Started
                </button>
              </div>

              <p className={`text-center mt-4 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
                Already have an account?{" "}
                <a href="/login" className="text-blue-600 hover:underline">
                  Log in
                </a>
              </p>
            </>
          ) : currentStep === 1.5 ? (
            /* Event Preferences Selection Screen */
            <>
              <h2 className="text-4xl font-bold text-blue-600 mt-30 mb-6">Sign Up</h2>

              <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-2">What Type of Events Do You Prefer?</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Let us know your go-to events (choose up to 5) so we can suggest the best options for you.
                </p>

                {eventPreferencesError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                    {eventPreferencesError}
                  </div>
                )}

                <div className="flex flex-wrap gap-2 max-h-[280px] overflow-y-auto pr-2">
                  {eventTypes.map((eventType) => (
                    <button
                      key={eventType}
                      type="button"
                      onClick={() => toggleEventPreference(eventType)}
                      className={`px-3 py-2 rounded-full text-sm ${
                        preferences.includes(eventType)
                          ? isDarkMode
                            ? "bg-blue-600 text-white"
                            : "bg-blue-600 text-white"
                          : isDarkMode
                            ? "bg-gray-700 text-white border border-gray-600"
                            : "bg-white text-gray-700 border border-gray-300"
                      }`}
                    >
                      {eventType}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-center items-center gap-4 mt-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-blue-600 bg-white hover:bg-gray-100 dark:text-blue-400 dark:border-gray-600 dark:bg-transparent dark:hover:bg-gray-700"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handlePreferencesNext}
                  className={`flex-1 px-6 py-3 text-white ${
                    isDarkMode ? "bg-gray-800 hover:bg-gray-300" : "bg-blue-600 hover:bg-blue-300"
                  } rounded-xl shadow-lg overflow-hidden font-poppins`}
                >
                  Next
                </button>
              </div>

              <p className={`text-center mt-4 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
                Already have an account?{" "}
                <a href="/login" className="text-blue-600 hover:underline">
                  Log in
                </a>
              </p>
            </>
          ) : currentStep === 2 ? (
            /* Personal Information Form */
            <>
              <h2 className="text-4xl font-bold text-blue-600 mt-30 mb-6">Sign Up</h2>
              <p className="text-sm text-blue-600 mb-4">Step 1 of 3</p>

              {error && <div className="bg-red-500 text-white p-3 rounded-md mb-4">{error}</div>}

              <div className="flex items-center justify-center gap-4 mb-4">
                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  className={`flex items-center justify-center gap-2 px-23 py-3 rounded-lg border w-full md:w-auto 
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
                  className={`flex items-center justify-center gap-2 px-23 py-3 rounded-lg border w-full md:w-auto 
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
                <div className={`flex-grow border-t ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}></div>
                <span className={`flex-shrink mx-4 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>OR</span>
                <div className={`flex-grow border-t ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}></div>
              </div>

              <form className="space-y-6" onSubmit={handleNext}>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="John"
                    className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-blue-500 ${
                      isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
                    }`}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Doe"
                    className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-blue-500 ${
                      isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
                    }`}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
                    Phone number (optional)
                  </label>
                  <div className="flex items-center border rounded-md">
                    <span className={`px-3 py-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>+63</span>
                    <input
                      type="text"
                      placeholder="000 0000 000"
                      className={`w-full px-4 py-2 rounded-md focus:outline-none ${
                        isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
                      }`}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                    />
                  </div>
                </div>

                <div className="flex justify-center items-center gap-3">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-blue-600 bg-white hover:bg-gray-100 dark:text-blue-400 dark:border-gray-600 dark:bg-transparent dark:hover:bg-gray-700"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 px-6 py-3 text-white ${
                      isDarkMode ? "bg-gray-800 hover:bg-gray-300" : "bg-blue-600 hover:bg-blue-300"
                    } rounded-xl shadow-lg overflow-hidden font-poppins`}
                  >
                    Next
                  </button>
                </div>

                <p className={`text-center mt-4 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
                  Already have an account?{" "}
                  <a href="/login" className="text-blue-600 hover:underline">
                    Log in
                  </a>
                </p>
              </form>
            </>
          ) : currentStep === 2.5 ? (
            /* Address Form */
            <>
              <h2 className="text-4xl font-bold text-blue-600 mt-30 mb-6">Sign Up</h2>
              <p className="text-sm text-blue-600 mb-6">Step 2 of 3</p>

              {error && <div className="bg-red-500 text-white p-3 rounded-md mb-4">{error}</div>}

              <form className="space-y-4" onSubmit={handleAddressNext}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
                      House No. (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 123"
                      className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-blue-500 ${
                        isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
                      }`}
                      value={houseNo}
                      onChange={(e) => setHouseNo(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
                      Street
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Maple Street"
                      className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-blue-500 ${
                        isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
                      }`}
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
                    Barangay
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Barangay San Isidro"
                    className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-blue-500 ${
                      isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
                    }`}
                    value={barangay}
                    onChange={(e) => setBarangay(e.target.value)}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
                    City
                  </label>
                  <select
                    className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-blue-500 ${
                      isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
                    }`}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  >
                    <option value="">Select your city</option>
                    <option value="Manila">Manila</option>
                    <option value="Quezon City">Quezon City</option>
                    <option value="Davao City">Davao City</option>
                    <option value="Cebu City">Cebu City</option>
                    <option value="Makati">Makati</option>
                    <option value="Taguig">Taguig</option>
                    <option value="Pasig">Pasig</option>
                    <option value="Cagayan de Oro">Cagayan de Oro</option>
                    <option value="Parañaque">Parañaque</option>
                    <option value="Caloocan">Caloocan</option>
                    <option value="Iloilo City">Iloilo City</option>
                    <option value="Valenzuela">Valenzuela</option>
                    <option value="Las Piñas">Las Piñas</option>
                    <option value="Pasay">Pasay</option>
                    <option value="Muntinlupa">Muntinlupa</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
                    Province
                  </label>
                  <select
                    className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-blue-500 ${
                      isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
                    }`}
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                  >
                    <option value="">Select your province</option>
                    <option value="Metro Manila">Metro Manila</option>
                    <option value="Cavite">Cavite</option>
                    <option value="Laguna">Laguna</option>
                    <option value="Batangas">Batangas</option>
                    <option value="Rizal">Rizal</option>
                    <option value="Bulacan">Bulacan</option>
                    <option value="Pampanga">Pampanga</option>
                    <option value="Cebu">Cebu</option>
                    <option value="Davao del Sur">Davao del Sur</option>
                    <option value="Iloilo">Iloilo</option>
                    <option value="Negros Occidental">Negros Occidental</option>
                    <option value="Pangasinan">Pangasinan</option>
                    <option value="Bataan">Bataan</option>
                    <option value="Zambales">Zambales</option>
                    <option value="Nueva Ecija">Nueva Ecija</option>
                    <option value="Tarlac">Tarlac</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
                    Zip Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 1234"
                    className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-blue-500 ${
                      isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
                    }`}
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
                    Country
                  </label>
                  <select
                    className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-blue-500 ${
                      isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
                    }`}
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    <option value="">Select your country</option>
                    <option value="Philippines">Philippines</option>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Japan">Japan</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="flex justify-center items-center gap-4 mt-6">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-blue-600 bg-white hover:bg-gray-100 dark:text-blue-400 dark:border-gray-600 dark:bg-transparent dark:hover:bg-gray-700"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 px-6 py-3 text-white ${
                      isDarkMode ? "bg-gray-800 hover:bg-gray-300" : "bg-blue-600 hover:bg-blue-300"
                    } rounded-xl shadow-lg overflow-hidden font-poppins`}
                  >
                    Next
                  </button>
                </div>

                <p className={`text-center mt-4 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
                  Already have an account?{" "}
                  <a href="/login" className="text-blue-600 hover:underline">
                    Log in
                  </a>
                </p>
              </form>
            </>
          ) : (
            /* Account Creation Form */
            <>
              <h2 className="text-4xl font-bold text-blue-600 mt-30 mb-6">Sign Up</h2>
              <p className="text-sm text-blue-600 mb-6">Step 3 of 3</p>

              {error && <div className="bg-red-500 text-white p-3 rounded-md mb-4">{error}</div>}

              <form onSubmit={handleCreateAccount}>
                      <div className="mb-4">
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
                    Phone Number (optional)
                  </label>
                  <div className="flex items-center border rounded-md">
                    <span className={`px-3 py-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>+63</span>
                    <input
                      type="text"
                      placeholder="000 0000 000"
                      className={`w-full px-4 py-2 rounded-md focus:outline-none ${
                        isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
                      }`}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-blue-500 ${
                      isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
                    }`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
                    Enter Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      className={`w-full px-4 py-2 border rounded-md text-sm ${
                        passwordError && password ? "border-red-500" : ""
                      } ${
                        isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
                      }`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {passwordError && password && (
                    <p className={`text-sm mt-1 ${isDarkMode ? "text-red-400" : "text-red-500"}`}>{passwordError}</p>
                  )}
                </div>

                <div className="mb-6">
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter password"
                      className={`w-full px-4 py-2 border rounded-md text-sm ${
                        confirmPasswordError && confirmPassword ? "border-red-500" : ""
                      } ${
                        isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
                      }`}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {confirmPasswordError && confirmPassword && (
                    <p className={`text-sm mt-1 ${isDarkMode ? "text-red-400" : "text-red-500"}`}>
                      {confirmPasswordError}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={termsAgreed}
                      onChange={(e) => {
                        setTermsAgreed(e.target.checked)
                        if (!termsAgreed) {
                          openTermsModal(e)
                        }
                      }}
                      className="mr-2 cursor-pointer"
                    />
                    <label
                      htmlFor="terms"
                      className={`text-sm ${isDarkMode ? "text-white" : "text-gray-700"} cursor-pointer`}
                      onClick={(e) => {
                        e.preventDefault()
                        openTermsModal(e)
                      }}
                    >
                      I agree with EVNTgarde's Terms and Conditions
                    </label>
                  </div>
                </div>

                <div className="flex justify-center items-center gap-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-blue-600 bg-white hover:bg-gray-100 dark:text-blue-400 dark:border-gray-600 dark:bg-transparent dark:hover:bg-gray-700"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 px-6 py-3 ${
                      isDarkMode ? "bg-gray-800 hover:bg-gray-300" : "bg-blue-600 hover:bg-blue-300"
                    } rounded-xl shadow-lg overflow-hidden font-poppins`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    ) : null}
                    Create Account
                  </button>
                </div>

                <p className={`text-center mt-4 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
                  Already have an account?{" "}
                  <a href="/login" className="text-blue-600 hover:underline">
                    Log in
                  </a>
                </p>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-blue-600 text-center mb-2">Terms and Conditions</h2>
              <p className="text-sm text-gray-700 text-center">
                By using our platform, you agree to these Terms and Conditions. Please read them carefully.
              </p>
    </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto text-sm text-gray-800 space-y-4">
              <ol className="list-decimal pl-5 space-y-4">
                <li>
                  <strong>Acceptance of Terms</strong> By accessing or using EVNTgarde, you agree to be bound by these
                  Terms and our Privacy Policy. If you do not agree, please do not use our services.
                </li>

                <li>
                  <strong>User Roles and Responsibilities</strong>
                  <ul className="list-disc pl-5 mt-2 space-y-2">
                    <li>Clients: Responsible for providing accurate event details and timely payments.</li>
                    <li>Organizers: Must communicate requirements clearly and honor commitments.</li>
                    <li>Vendors: Must deliver services as described and adhere to agreed timelines.</li>
                  </ul>
                </li>

                <li>
                  <strong>Account Registration</strong> You must provide accurate information and keep your account
                  secure. You are responsible for all activities under your account.
                </li>

                <li>
                  <strong>Payments and Fees</strong> Payments are processed through secure third-party providers. Service
                  fees may apply and will be disclosed before confirmation.
                </li>

                <li>
                  <strong>Cancellations and Refunds</strong> Cancellation policies vary by vendor. Refund eligibility is
                  subject to individual service agreements.
                </li>

                <li>
                  <strong>Prohibited Activities</strong> Users may not:
                  <ul className="list-disc pl-5 mt-2 space-y-2">
                    <li>Misrepresent services or credentials</li>
                    <li>Engage in fraudulent or illegal activities</li>
                    <li>Abuse or harass other users</li>
                  </ul>
                </li>

                <li>
                  <strong>Limitation of Liability</strong> EVNTgarde is not liable for disputes between users or issues
                  with third-party services. We provide the platform, but service agreements are between users.
                </li>

                <li>
                  <strong>Changes to Terms</strong> We may update these Terms from time to time. Continued use of the
                  platform means you accept the revised Terms.
                </li>

                <li>
                  <strong>Contact Us</strong> For questions or concerns, contact us at evntgarde@gmail.com.
                </li>
              </ol>

              <p className="mt-4">
                By using EVNTgarde, you acknowledge that you have read, understood, and agree to be bound by these Terms
                and Conditions.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t flex justify-end gap-3 bg-white">
              <button
                onClick={closeTermsModal}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                Close
              </button>
              <button
                onClick={acceptTerms}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndividualRegistration;