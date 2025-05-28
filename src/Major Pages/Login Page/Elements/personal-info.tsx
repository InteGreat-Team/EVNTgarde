import type React from "react";
import { FcGoogle } from "react-icons/fc";
import { AiFillYahoo } from "react-icons/ai";
import {
  signInWithGoogle,
  signInWithYahoo,
} from "../../../functions/authFunctions";

interface PersonalInfoProps {
  firstName: string;
  setFirstName: (name: string) => void;
  lastName: string;
  setLastName: (name: string) => void;
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  setCurrentStep: (step: number) => void;
  handleBack: () => void;
  error: string;
  setError: (error: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isDarkMode: boolean;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  phoneNumber,
  setPhoneNumber,
  setCurrentStep,
  handleBack,
  error,
  setError,
  isLoading,
  setIsLoading,
  isDarkMode,
}) => {
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName) {
      setError("First name and last name are required");
      return;
    }

    const storedData = sessionStorage.getItem("individualRegistration") || "{}";
    const parsedData = JSON.parse(storedData);

    sessionStorage.setItem(
      "individualRegistration",
      JSON.stringify({
        ...parsedData,
        firstName,
        lastName,
        phoneNumber: phoneNumber ? `+63${phoneNumber}` : "",
      })
    );

    setCurrentStep(2.5);
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setError("");
    try {
      await signInWithGoogle("individual");
      alert("Signed in with Google successfully!");
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
      alert("Signed in with Yahoo successfully!");
    } catch (err: any) {
      setError("Failed to sign up with Yahoo. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-4xl font-bold text-blue-600 mt-30 mb-6">Sign Up</h2>
      <p className="text-sm text-blue-600 mb-4">Step 1 of 3</p>

      {error && (
        <div className="bg-red-500 text-white p-3 rounded-md mb-4">{error}</div>
      )}

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

      <form className="space-y-6" onSubmit={handleNext}>
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}
          >
            First Name
          </label>
          <input
            type="text"
            placeholder="John"
            className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-blue-500 ${
              isDarkMode
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-gray-800 border-gray-300"
            }`}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div>
          <label
            className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}
          >
            Last Name
          </label>
          <input
            type="text"
            placeholder="Doe"
            className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-blue-500 ${
              isDarkMode
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-gray-800 border-gray-300"
            }`}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <div>
          <label
            className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}
          >
            Phone number (optional)
          </label>
          <div className="flex items-center border rounded-md">
            <span
              className={`px-3 py-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}
            >
              +63
            </span>
            <input
              type="text"
              placeholder="000 0000 000"
              className={`w-full px-4 py-2 rounded-md focus:outline-none ${
                isDarkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-gray-800 border-gray-300"
              }`}
              value={phoneNumber}
              onChange={(e) =>
                setPhoneNumber(e.target.value.replace(/\D/g, ""))
              }
            />
          </div>
        </div>

        <div className="flex justify-center items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-blue-600 bg-white hover:bg-gray-100 dark:text-blue-400 dark:border-gray-600 dark:bg-transparent dark:hover:bg-gray-700"
          >
            Back
          </button>
          <button
            type="submit"
            className={`flex-1 px-6 py-3 text-white ${
              isDarkMode
                ? "bg-gray-800 hover:bg-gray-300"
                : "bg-blue-600 hover:bg-blue-300"
            } rounded-xl shadow-lg overflow-hidden font-poppins`}
          >
            Next
          </button>
        </div>

        <p
          className={`text-center mt-4 ${isDarkMode ? "text-white" : "text-gray-700"}`}
        >
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Log in
          </a>
        </p>
      </form>
    </>
  );
};

export default PersonalInfo;
