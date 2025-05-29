import { Button } from "./combined-ui";
import { useLocation, Outlet } from "react-router-dom";
import { ThemeToggle } from "../functions/ThemeToogle";
import { Bell } from "lucide-react";
import { Sidebar } from "./sidebar";
import { useTheme } from "@/functions/ThemeContext";
import { useEffect, useState } from "react";

interface CombinedLayoutProps {
  isLoggedIn?: boolean;
}

export default function CombinedLayout({
  isLoggedIn = localStorage.getItem("isAuthenticated") === "true",
}: CombinedLayoutProps) {
  const [userType, setUserType] = useState<string | null>(null);
  useEffect(() => {
    setUserType(localStorage.getItem("userType"));
  }, []); // <-- Add []
  const newUserType = userType === "individual" ? "customer" : userType;

  const location = useLocation();
  const isHomePage =
    location.pathname === "/" ||
    location.pathname === "/customer" ||
    location.pathname === "/vendor" ||
    location.pathname === "/organizer";

  const showWelcomeBanner =
    isHomePage &&
    (newUserType === "customer" ||
      newUserType === "organizer" ||
      newUserType === "vendor");

  const { isDarkMode } = useTheme();

  const handleLogout = () => {
    setUserType(null);
    localStorage.removeItem("isAuthenticated");
    if (localStorage.getItem("userType") === "vendor") {
      localStorage.removeItem("vendorType");
    }
    localStorage.removeItem("userType");
    localStorage.removeItem("UserID");
    window.location.href = "/"; // Redirect after logout
  };

  return (
    <div className="flex min-h-screen">
      <div
        className={`fixed left-0 top-0 h-full w-64 transition-all duration-300 ${
          isDarkMode ? "bg-[#1E3A6D]" : "bg-[#2B579A]"
        }`}
      >
        {isLoggedIn && <Sidebar logout={handleLogout} />}
      </div>
      <div className="flex flex-1 flex-col transition-all duration-300">
        <div className="HeaderContainer" style={{ marginLeft: "16rem" }}>
          <Header />
        </div>
        <div className="MainContainer mt-[56px] p-6">
          <div className="MainContent">
            {showWelcomeBanner && <WelcomeBanner />}
            <Outlet /> {/* Use Outlet instead of children prop */}
          </div>
        </div>
        {!isLoggedIn && (
          <div className="FooterContainer">
            <Footer />
          </div>
        )}
      </div>
    </div>
  );
}

function Header() {
  const { isDarkMode } = useTheme();
  return (
    <header
      className={`fixed top-0 z-50 w-full text-white transition-colors ${
        isDarkMode ? "bg-[#1E3A6D]" : "bg-[#2B579A]"
      }`}
    >
      <div className="container flex h-14 items-center">
        <div className="flex items-center"></div>
        <div className="flex items-center gap-2 ml-[70vw]">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-blue-600 dark:hover:bg-blue-800"
          >
            <Bell className="h-5 w-5" />
            <span className="sr-only">Toggle Notifications</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-blue-600 dark:hover:bg-blue-800"
          >
            <ThemeToggle />
            <span className="sr-only">Toggle Theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-[#2B579A] text-white dark:bg-[rgb(30,58,109)] py-8">
      <div className="container mx-auto px-4">
        <div className="text-center text-sm">
          © {new Date().getFullYear()} Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function WelcomeBanner() {
  return (
    <main className="w-full">
      {/* Welcome Banner Section */}
      <section className="relative overflow-hidden bg-gray-900 ml-64">
        <div className="absolute inset-0">
          <img
            src="../../src/assets/banner.jpg"
            alt="Concert background"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:py-24">
          <div className="flex flex-col sm:flex-row items-center justify-center">
            <div className="mb-8 sm:mb-0 sm:mr-8 flex-shrink-0">
              <img
                src="../../src/assets/OrganizerLogo.png"
                alt="Event Logo"
                className="h-65 sm:h-64 lg:h-[250px]  w-auto object-contain"
              />
            </div>
            <div className="text-center sm:text-left flex flex-col justify-center self-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                Welcome to Your Event Management Hub
              </h1>
              <p className="mt-6 max-w-lg text-lg text-gray-300 sm:mx-auto md:mt-8 md:max-w-xl md:text-xl lg:mx-0">
                Discover tailored events services and manage everything from one
                central dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
