import type React from "react";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { registerUser } from "../../../functions/authFunctions";
import { createUserAccount } from "../../../functions/userAccount";

interface AccountCreationProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  termsAgreed: boolean;
  setTermsAgreed: (agreed: boolean) => void;
  openTermsModal: (
    e: React.MouseEvent | React.ChangeEvent<HTMLInputElement>
  ) => void;
  phoneNumber: string;
  setPhoneNumber: (phoneNumber: string) => void;
  firstName: string;
  lastName: string;
  preferences: string[];
  houseNo: string;
  street: string;
  barangay: string;
  city: string;
  province: string;
  zipCode: string;
  country: string;
  setCurrentStep: (step: number) => void;
  handleBack: () => void;
  error: string;
  setError: (error: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isDarkMode: boolean;
}

const AccountCreation: React.FC<AccountCreationProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  termsAgreed,
  setTermsAgreed,
  openTermsModal,
  phoneNumber,
  setPhoneNumber,
  firstName,
  lastName,
  preferences,
  houseNo,
  street,
  barangay,
  city,
  province,
  zipCode,
  country,
  setCurrentStep,
  handleBack,
  error,
  setError,
  isLoading,
  setIsLoading,
  isDarkMode,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

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
      const storedData = sessionStorage.getItem("individualRegistration");
      const userData = storedData ? JSON.parse(storedData) : {};

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

      await registerUser(email, password, "individual", userAccountData);

      sessionStorage.removeItem("individualRegistration");

      setError("");
      alert("Account created successfully! You can now log in.");
      setCurrentStep(1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-4xl font-bold text-blue-600 mt-30 mb-6">Sign Up</h2>
      <p className="text-sm text-blue-600 mb-6">Step 3 of 3</p>

      {error && (
        <div className="bg-red-500 text-white p-3 rounded-md mb-4">{error}</div>
      )}

      <form onSubmit={handleCreateAccount}>
        <div className="mb-4">
          <label
            className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}
          >
            Phone Number (optional)
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

        <div className="mb-4">
          <label
            className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}
          >
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-blue-500 ${
              isDarkMode
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-gray-800 border-gray-300"
            }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
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
                passwordError && password ? "border-red-500" : ""
              } ${isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"}`}
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
            <p
              className={`text-sm mt-1 ${isDarkMode ? "text-red-400" : "text-red-500"}`}
            >
              {passwordError}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label
            className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter password"
              className={`w-full px-4 py-2 border rounded-md text-sm ${
                confirmPasswordError && confirmPassword ? "border-red-500" : ""
              } ${isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"}`}
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
            <p
              className={`text-sm mt-1 ${isDarkMode ? "text-red-400" : "text-red-500"}`}
            >
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
                setTermsAgreed(e.target.checked);
                if (!termsAgreed) {
                  openTermsModal(e);
                }
              }}
              className="mr-2 cursor-pointer"
            />
            <label
              htmlFor="terms"
              className={`text-sm ${isDarkMode ? "text-white" : "text-gray-700"} cursor-pointer`}
              onClick={(e) => {
                e.preventDefault();
                openTermsModal(e);
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
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : null}
            Create Account
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

export default AccountCreation;
