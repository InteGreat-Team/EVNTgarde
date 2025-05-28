import type React from "react"
import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import "./index.css"

import HomePage from "./Major Pages/Dashboards/Unregistered/homepage" // Non-registered home
import AboutLoggedOut from "./Major Pages/Dashboards/Unregistered/about-loggedout"
import LoginPage from "./Major Pages/Login Page/LoginPage" // Login page
import SuperAdminQuickLogin from "./Major Pages/Login Page/SuperAdminQuickLogin" // Super Admin Quick Login

// Wrappers
import ProtectedLayout from "./functions/ProtectedRoute"
import CombinedLayout from "./Layout/combined-layout"

// consolidated role selection
import RoleSelection from "./Major Pages/Login Page/RoleSelection"

// Registration Components
import OrganizerRegistration from "./Major Pages/Login Page/OrganizerRegistration"
import IndividualRegistration from "./Major Pages/Login Page/IndividualRegistration"
import VendorRegistration from "./Major Pages/Login Page/VendorRegistration"

// Main Pages
import Dashboard from "./Major Pages/Dashboards/Registered/Dashboard"
import Bookings from "./Major Pages/Bookings/Bookings"
import RSVP from "./Major Pages/RSVP/RSVP"
import UserManagement from "./Major Pages/Dashboards/Registered/UserManagement"
import Track from "./Major Pages/Dashboards/Registered/Track"
import ProfileSettings from "./Major Pages/Dashboards/Registered/ProfileSettings"
import Reviews from "./Major Pages/Reviews/Reviews"

// Super Admin Pages
import SuperAdminDashboard from "./Major Pages/Dashboards/Registered/SuperAdminDashboard"

// Misc Pages
import OrganizerDetails from "./Major Pages/Dashboards/Registered/Elements/OrganizerDetails"

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated") === "true"
    setIsAuthenticated(authStatus)
  }, [])

  const login = async () => {
    setIsAuthenticated(true)
  }

  // Function to determine the correct route based on userType
  const getDashboardRoute = () => {
    const currentUserType = localStorage.getItem("userType") // Read directly from localStorage

    switch (currentUserType) {
      case "individual":
      case "organizer":
      case "vendor":
        return "/dashboard"
      case "super_admin":
        return "/super-admin/dashboard"
      default:
        console.log("No userType found, defaulting to /", currentUserType) // Debug log
        return "/dashboard"
    }
  }

  return (
    <Router>
      {/* Main Content Wrapper */}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={isAuthenticated ? <Navigate to={getDashboardRoute()} /> : <HomePage />} />

        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to={getDashboardRoute()} /> : <LoginPage login={login} />}
        />

        {/* Super Admin Quick Login Route */}
        <Route
          path="/super-admin/login"
          element={
            localStorage.getItem("userType") === "super_admin" ? (
              <Navigate to="/super-admin/dashboard" />
            ) : (
              <SuperAdminQuickLogin login={login} />
            )
          }
        />

        {/* Super Admin Dashboard Route - STANDALONE (not wrapped in layout) */}
        <Route
          path="/super-admin/dashboard"
          element={
            localStorage.getItem("userType") === "super_admin" && localStorage.getItem("isAuthenticated") === "true" ? (
              <SuperAdminDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Consolidated Role Selection Route */}
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/role-selection-dark" element={<Navigate to="/role-selection" />} />

        {/* Registration Routes */}
        <Route path="/register/organizer" element={<OrganizerRegistration step={1} />} />
        <Route path="/register/organizer/step2" element={<OrganizerRegistration step={2} />} />
        <Route path="/register/organizer/step3" element={<OrganizerRegistration step={3} />} />

        <Route path="/register/individual" element={<IndividualRegistration step={1} />} />
        <Route path="/register/individual/step2" element={<IndividualRegistration step={2} />} />
        <Route path="/register/individual/step3" element={<IndividualRegistration step={3} />} />

        <Route path="/register/vendor" element={<VendorRegistration step={1} />} />
        <Route path="/register/vendor/step2" element={<VendorRegistration step={2} />} />
        <Route path="/register/vendor/step3" element={<VendorRegistration step={3} />} />

        <Route path="/about" element={<AboutLoggedOut />} />

        <Route element={<ProtectedLayout />}>
          <Route element={<CombinedLayout isLoggedIn={isAuthenticated} />}>
            {/* Protected routes for authenticated users (wrapped in layout) */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/rsvp" element={<RSVP />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="/track" element={<Track />} />
            <Route path="/profile-settings" element={<ProfileSettings />} />

            {/* temp route for organizer viewing */}
            <Route path="/organizers/:id" element={<OrganizerDetails />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
