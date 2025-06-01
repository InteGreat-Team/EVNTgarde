import type React from "react";
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./index.css";

import HomePage from "./Major Pages/Dashboards/Unregistered/homepage"; // Non-registered home
import AboutLoggedOut from "./Major Pages/Dashboards/Unregistered/about-loggedout";
import LoginPage from "./Major Pages/Login Page/LoginPage"; // Login page

// Wrappers
import ProtectedLayout from "./functions/ProtectedRoute";
import CombinedLayout from "./Layout/combined-layout";

// consolidated role selection
import RoleSelection from "./Major Pages/Login Page/Elements/RoleSelection";

// Registration Components
import OrganizerRegistration from "./Major Pages/Login Page/OrganizerRegistration";
import IndividualRegistration from "./Major Pages/Login Page/IndividualRegistration";
import VendorRegistration from "./Major Pages/Login Page/VendorRegistration";

// Main Pages
import Dashboard from "./Major Pages/Dashboards/Registered/Dashboard";
import Bookings from "./Major Pages/Bookings/Bookings";
import RSVP from "./Major Pages/RSVP/RSVP";
import Reviews from "./Major Pages/Reviews/Reviews";
import UserManagement from "./Major Pages/UserManagement/UserManagement";
import ProfileSettings from "./Major Pages/ProfileSettings/ProfileSettings";

// Misc Pages
import OrganizerDetails from "./Major Pages/Dashboards/Registered/Elements/OrganizerDetails";

import { CLOUD_FUNCTIONS } from "./config/cloudFunctions";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [, setUserType] = useState<string | null>(null);
  const [roleId, setRoleId] = useState<string | null>(null);

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    const storedUserType = localStorage.getItem("userType");
    const storedRoleId = localStorage.getItem("roleId");

    setIsAuthenticated(authStatus);
    setUserType(storedUserType);
    setRoleId(storedRoleId);
  }, []);

  // Function to determine the correct route based on role_id
  const getDashboardRoute = () => {
    switch (roleId) {
      case "1":
        return "/dashboard"; // Customer
      case "2":
        return "/dashboard"; // Organizer
      case "3":
        return "/dashboard"; // Vendor
      // Add more cases here for new user types as needed
      default:
        return "/dashboard";
    }
  };

  const login = async () => {
    setIsAuthenticated(true);
    const storedUserType = localStorage.getItem("userType");
    setUserType(storedUserType);
    // Check user's role_id from backend using firebase_uid
    const firebaseUid = localStorage.getItem("userId");
    if (firebaseUid) {
      try {
        const response = await fetch(CLOUD_FUNCTIONS.login, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ firebaseUid }),
        });
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("roleId", data.roleId);
          setRoleId(data.roleId); // Update state
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    }
  };

  return (
    <Router>
      {/* Main Content Wrapper */}
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to={getDashboardRoute()} />
            ) : (
              <HomePage />
            )
          }
        />

        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={getDashboardRoute()} />
            ) : (
              <LoginPage login={login} />
            )
          }
        />

        {/* Consolidated Role Selection Route */}
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route
          path="/role-selection-dark"
          element={<Navigate to="/role-selection" />}
        />

        {/* Registration Routes */}
        <Route
          path="/register/organizer"
          element={<OrganizerRegistration step={1} />}
        />
        <Route
          path="/register/organizer/step2"
          element={<OrganizerRegistration step={2} />}
        />
        <Route
          path="/register/organizer/step3"
          element={<OrganizerRegistration step={3} />}
        />

        <Route
          path="/register/individual"
          element={<IndividualRegistration step={1} />}
        />
        <Route
          path="/register/individual/step2"
          element={<IndividualRegistration step={2} />}
        />
        <Route
          path="/register/individual/step3"
          element={<IndividualRegistration step={3} />}
        />

        <Route
          path="/register/vendor"
          element={<VendorRegistration step={1} />}
        />
        <Route
          path="/register/vendor/step2"
          element={<VendorRegistration step={2} />}
        />
        <Route
          path="/register/vendor/step3"
          element={<VendorRegistration step={3} />}
        />

        <Route path="/about" element={<AboutLoggedOut />} />

        <Route element={<ProtectedLayout />}>
          <Route element={<CombinedLayout isLoggedIn={isAuthenticated} />}>
            {/* Protected routes for authenticated users */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/rsvp" element={<RSVP />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="/profile-settings" element={<ProfileSettings />} />s
            {/* temp route for organizer viewing */}
            <Route path="/organizers/:id" element={<OrganizerDetails />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
