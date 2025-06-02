import { useTheme } from "@/functions/ThemeContext";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Star,
  LogOut,
  UserRound,
  MailOpenIcon,
  UserCircle,
  X,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./combined-ui";
import { useMemo, useState } from "react";
import OragnizerLogo from "../assets/OrganizerLogo.png";
import { useRole } from "../functions/RoleContext"; // Import your useRole hook

interface SidebarProps {
  logout: () => void; // This `logout` prop should now handle signing out AND refreshing the role context
}

export function Sidebar({ logout }: SidebarProps) {
  const location = useLocation();
  const isCollapsed = false; // Assuming this is managed elsewhere or fixed for now
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // --- Use roleId and isLoading from the RoleContext ---
  const { roleId, isLoading } = useRole();

  // Remove the old userType state and its useEffect
  // const [userType, setUserType] = useState(...)
  // useEffect(() => { ... }, []);

  // Map numerical roleId to descriptive names for clearer logic, if needed
  // Or directly use roleId strings in conditions
  const sidebarItems = useMemo(() => {
    // If the role is still loading, or no role is determined, return an empty array
    if (isLoading || !roleId) {
      return [];
    }

    const items = [
      { title: "Dashboard", icon: LayoutDashboard, href: `/dashboard` },
      { title: "Bookings", icon: CalendarDays, href: `/bookings` },

      // RSVP: For Customer (roleId: "1") or Organizer (roleId: "2")
      ...(roleId === "1" || roleId === "2"
        ? [{ title: "RSVP", icon: MailOpenIcon, href: `/rsvp` }]
        : []),

      { title: "Reviews", icon: Star, href: `/reviews` },

      // User Management: For Vendor (roleId: "3" AND vendorType "Company Vendor") or Organizer (roleId: "2")
      // Note: "vendorType" (e.g., "Company Vendor") is still read from localStorage as it's not in RoleContext.
      // If this "vendorType" is also dynamic and related to the user's main role,
      // you might consider fetching it via another context or including it with the role data.
      ...((roleId === "3" &&
        localStorage.getItem("vendorType") === "Company Vendor") ||
      roleId === "2"
        ? [
            {
              title: "User Management",
              icon: UserRound,
              href: `/user-management`,
            },
          ]
        : []),
      {
        title: "Profile Settings",
        icon: UserCircle,
        href: `/profile-settings`,
      },
    ];

    return items;
  }, [roleId, isLoading]); // Re-calculate sidebar items when roleId or loading state changes

  const { isDarkMode } = useTheme();

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    // Call the logout prop from the parent component
    // This `logout` function should be responsible for:
    // 1. Signing out the user (e.g., Firebase signOut)
    // 2. Clearing authentication status from localStorage
    // 3. Calling `refreshRole()` from RoleContext (to clear roleId and localStorage.roleId)
    logout();
    setShowLogoutConfirm(false);
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <TooltipProvider delayDuration={0}>
      {/* Logo at the top of sidebar */}
      <div className="p-6 mb-6 flex justify-center">
        <Link to="/" className="flex items-center justify-center">
          <img
            src={OragnizerLogo}
            alt="Logo"
            className="h-24 w-auto object-contain"
          />
        </Link>
      </div>

      {/* Sidebar Navigation Items */}
      <div className="flex flex-col space-y-1 px-2">
        {isLoading ? ( // Show a loading indicator for sidebar items if role is still loading
          <div className="text-white text-center py-4">Loading menu...</div>
        ) : (
          sidebarItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`relative flex h-10 w-full items-center gap-3 rounded-md px-3 text-white transition-colors
                ${
                  isDarkMode
                    ? `hover:bg-[#1E3A6D] ${location.pathname === item.href ? "bg-[#1E3A6D] after:w-full" : "after:w-0"}`
                    : `hover:bg-[#2B579A] ${location.pathname === item.href ? "bg-[#2B579A] after:w-full" : "after:w-0"}`
                }
                relative after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-yellow-400 after:transition-all hover:after:w-full`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          ))
        )}
      </div>

      {/* Logout Button */}
      <div className="p-3 mt-auto">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={`relative flex h-10 w-full items-center gap-3 rounded-md px-3 text-white transition-colors
                ${
                  isDarkMode
                    ? `hover:bg-[#1E3A6D] ${location.pathname === "/logout" ? "bg-[#1E3A6D] after:w-full" : "after:w-0"}`
                    : `hover:bg-[#2B579A] ${location.pathname === "/logout" ? "bg-[#2B579A] after:w-full" : "after:w-0"}`
                }
                relative after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-yellow-400 after:transition-all hover:after:w-full`}
              onClick={handleLogoutClick}
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </TooltipTrigger>
          {isCollapsed && (
            <TooltipContent
              side="right"
              className={`border-0 ${isDarkMode ? "bg-[#1E3A6D]" : "bg-[#2B579A]"} text-white`}
            >
              Logout
            </TooltipContent>
          )}
        </Tooltip>
      </div>

      {/* Custom Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className={`w-full max-w-md p-6 rounded-lg shadow-lg ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3
                className={`text-lg font-medium flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                <LogOut className="h-5 w-5" />
                Confirm Logout
              </h3>
              <button
                onClick={handleCancelLogout}
                className="rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            </div>
            <div className="mb-6">
              <p
                className={`${isDarkMode ? "text-gray-300" : "text-gray-500"}`}
              >
                Are you sure you want to logout? You will need to sign in again
                to access your account.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelLogout}
                className={`px-4 py-2 rounded-md ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </TooltipProvider>
  );
}
