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
import { useEffect, useMemo, useState } from "react";
import OragnizerLogo from "../assets/OrganizerLogo.png";

interface SidebarProps {
  logout: () => void;
}

export function Sidebar({ logout }: SidebarProps) {
  const location = useLocation();
  const isCollapsed = false;
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [userType, setUserType] = useState(
    localStorage.getItem("userType") === "individual"
      ? "customer"
      : localStorage.getItem("userType")
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setUserType(
        localStorage.getItem("userType") === "individual"
          ? "customer"
          : localStorage.getItem("userType")
      );
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const sidebarItems = useMemo(() => {
    const items = [
      { title: "Dashboard", icon: LayoutDashboard, href: `/dashboard` },
      { title: "Bookings", icon: CalendarDays, href: `/bookings` },
      ...(userType === "customer" || userType === "organizer"
        ? [{ title: "RSVP", icon: MailOpenIcon, href: `/rsvp` }]
        : []),
      { title: "Reviews", icon: Star, href: `/reviews` },
      ...((userType === "vendor" &&
        localStorage.getItem("vendorType") === "Company Vendor") ||
      userType === "organizer"
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
  }, [userType]);

  const { isDarkMode } = useTheme();

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
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
        {sidebarItems.map((item) => (
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
        ))}
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
