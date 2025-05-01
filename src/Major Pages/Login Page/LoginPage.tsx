import { Eye, EyeOff } from "lucide-react";
import type React from "react";
import { useState, useEffect } from "react";
import Logo from "../../assets/OrganizerLogo.png";
import { useNavigate } from "react-router-dom";
import { checkSessionExpiry } from "@/functions/authFunctions";
import { useTheme } from "../../functions/ThemeContext";
import {
  signInWithGoogle,
  signInWithYahoo,
} from "../../functions/authFunctions";
import { FcGoogle } from "react-icons/fc";
import { AiFillYahoo } from "react-icons/ai";

const LoginPage: React.FC<{ login: () => void }> = ({ login }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);

  useEffect(() => {
    const sessionExpired = checkSessionExpiry();
    if (sessionExpired) {
      navigate("/login"); // Redirect user if session expired
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/loginCustomer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!result.success) {
        setFailedAttempts(failedAttempts + 1);
        setError(
          failedAttempts + 1 >= 3
            ? "Login failed. Please check your credentials and try again."
            : "Invalid Email/Invalid Password"
        );
        setLoading(false);
        return;
      }

      // Store authentication status and userType
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userType", result.user.userType);
      localStorage.setItem("userId", result.user.id);

      if (rememberMe) {
        localStorage.setItem("loginTimestamp", Date.now().toString());
      }

      login();

      // Redirect user based on userType
      switch (result.user.userType) {
        case "customer":
          navigate("/customer");
          break;
        case "organizer":
          navigate("/organizer");
          break;
        case "vendor":
          navigate("/vendor");
          break;
        default:
          throw new Error("Invalid user type.");
      }
    } catch (err: any) {
      setError("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle("individual"); // Default to individual, will be updated from Firestore
      login();
      // Redirect will happen based on userType in Firestore
    } catch (err: any) {
      setError("Failed to sign in with Google. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleYahooLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithYahoo("individual"); // Default to individual, will be updated from Firestore
      login();
      // Redirect will happen based on userType in Firestore
    } catch (err: any) {
      setError("Failed to sign in with Yahoo. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-300 font-[Poppins]">
      <div
        className={`flex w-[1440px] h-[650px] ${
          isDarkMode ? "bg-gray-800" : "bg-blue-600"
        } rounded-xl shadow-lg overflow-hidden font-poppins`}
      >
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
            Log in now to unlock your personalized experience!
          </p>
        </div>
        <div
          className={`w-3/5 ${
            isDarkMode ? "bg-black" : "bg-white"
          } p-10 flex flex-col justify-center rounded-l-[50px] shadow-md`}
        >
          <h2
            className={`text-4xl font-bold ${
              isDarkMode ? "text-white" : "text-blue-600"
            } mb-4`}
          >
            Log In
          </h2>
          {error && <p className="text-red-500">{error}</p>}
          <form className="flex flex-col space-y-4" onSubmit={handleLogin}>
            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className={`flex items-center justify-center gap-2 px-25 py-3 rounded-lg border shadow-md w-full md:w-auto 
                ${
                  isDarkMode
                    ? "bg-black border-gray-600 text-white hover:bg-gray-700"
                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-100"
                }`}
                disabled={loading}
              >
                <FcGoogle size={20} />
                <span className="font-medium">Log in with Google</span>
              </button>

              <button
                type="button"
                onClick={handleYahooLogin}
                className={`flex items-center justify-center gap-2 px-25 py-3 rounded-lg border shadow-md w-full md:w-auto 
                ${
                  isDarkMode
                    ? "bg-black border-gray-600 text-white hover:bg-gray-900"
                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-100"
                }`}
                disabled={loading}
              >
                <AiFillYahoo size={20} className="text-purple-600" />
                <span className="font-medium">Log in with Yahoo</span>
              </button>
            </div>

            <div className="relative flex items-center py-2">
              <div
                className={`flex-grow border-t ${
                  isDarkMode ? "border-gray-600" : "border-gray-300"
                }`}
              ></div>
              <span
                className={`flex-shrink mx-4 text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                OR
              </span>
              <div
                className={`flex-grow border-t ${
                  isDarkMode ? "border-gray-600" : "border-gray-300"
                }`}
              ></div>
            </div>

            <label
              className={`text-sm ${
                isDarkMode ? "text-white" : "text-gray-700"
              }`}
            >
              Enter your email*
            </label>
            <input
              type="email"
              placeholder="Email"
              className={`border p-3 rounded-md ${
                isDarkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label
              className={`text-sm ${
                isDarkMode ? "text-white" : "text-gray-700"
              }`}
            >
              Enter your password*
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={`border p-3 w-full rounded-md ${
                  isDarkMode
                    ? "bg-gray-700 text-white"
                    : "bg-white text-gray-800"
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
            <div className="flex justify-between items-center text-sm">
              <a href="#" className="text-blue-600">
                Forgot password?
              </a>
            </div>
            <label
              className={`flex items-center space-x-2 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Keep me logged in</span>
            </label>
            <button
              type="submit"
              className="bg-blue-600 text-white p-3 rounded-full font-bold hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
            <div
              className={`text-center text-sm ${
                isDarkMode ? "text-white" : "text-gray-700"
              }`}
            >
              Don't have an account?{" "}
              <a
                href="#"
                className="text-blue-600"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/role-selection");
                }}
              >
                Sign up
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
