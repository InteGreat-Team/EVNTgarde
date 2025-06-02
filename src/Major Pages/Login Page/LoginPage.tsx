import { Eye, EyeOff } from "lucide-react";
import type React from "react";
import { useState, useEffect } from "react";
import Logo from "../../assets/OrganizerLogo.png";
import { useNavigate } from "react-router-dom";
import {
  loginUser,
  signInWithGoogle,
  signInWithYahoo,
  checkSessionExpiry,
} from "../../functions/authFunctions";
import { useTheme } from "../../functions/ThemeContext";
import { FcGoogle } from "react-icons/fc";
import { AiFillYahoo } from "react-icons/ai";
import { useRole } from "@/functions/RoleContext";

const LoginPage: React.FC<{ login: () => void }> = ({ login }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { refreshRole, roleId, isLoading: roleIsLoading } = useRole();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const sessionExpired = checkSessionExpiry();
    if (sessionExpired) {
      navigate("/login"); // Redirect user if session expired
    }
    if (roleId && !loading && !roleIsLoading) {
      navigate("/dashboard");
    }
    // Redirect to dashboard if authenticated
    if (localStorage.getItem("isAuthenticated") === "true") {
      navigate("/dashboard");
    }
  }, [roleId, loading, roleIsLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);

    try {
      const { user, role } = await loginUser(email, password);

      if (!user) {
        throw new Error("Login failed: No user returned");
      }

      // Store user type and authentication state
      localStorage.setItem("userType", role);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("loginTimestamp", Date.now().toString());

      refreshRole();

      // Call the login callback
      login();
    } catch (err: any) {
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        setError("Invalid email or password");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later.");
      } else {
        setError(err.message || "Failed to log in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await signInWithGoogle("individual");
      if (user) {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("loginTimestamp", Date.now().toString());
        login();
      }
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
      const user = await signInWithYahoo("individual");
      if (user) {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("loginTimestamp", Date.now().toString());
        login();
      }
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
