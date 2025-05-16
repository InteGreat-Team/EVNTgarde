import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BarChart3, Briefcase, Search } from "lucide-react";
import ActivityOverview from "./Elements/ActivityOverview";
import EventSection from "./Elements/EventsSection";
import Explore from "./Elements/Explore";

import MyEvents from "./Elements/MyEvents";


type UserType = "customer" | "vendor" | "organizer";

const Dashboard: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("activity");
  const [showEventForm, setShowEventForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleEventSuccess = () => {
    setShowEventForm(false);
    setSuccessMsg("Event created successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
    // Optionally, trigger a refresh of event data here
  };

  const getUserTypeFromAuth = (): UserType => {
    const storedType = localStorage.getItem("userType");
    if (
      storedType === "customer" ||
      storedType === "vendor" ||
      storedType === "organizer"
    ) {
      return storedType as UserType;
    }

    // Default fallback
    return "customer";
  };

  const userType = getUserTypeFromAuth();

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const tabs = (() => {
    if (userType === "customer") {
      return [
        {
          key: "activity",
          label: "Activity Overview",
          icon: <BarChart3 size={16} />,
        },
        { key: "events", label: "My Events", icon: <Briefcase size={16} /> },
        { key: "explore", label: "Explore", icon: <Search size={16} /> },
      ];
    }

    if (userType === "vendor") {
      return [
        {
          key: "activity",
          label: "Activity Overview",
          icon: <BarChart3 size={16} />,
        },
        {
          key: "services",
          label: "My Services",
          icon: <Briefcase size={16} />,
        },
      ];
    }

    // organizer
    return [
      {
        key: "activity",
        label: "Activity Overview",
        icon: <BarChart3 size={16} />,
      },
      { key: "services", label: "My Services", icon: <Briefcase size={16} /> },
      { key: "events", label: "My Events", icon: <Briefcase size={16} /> },
      { key: "explore", label: "Explore", icon: <Search size={16} /> },
    ];
  })();

  const renderContent = () => {
    switch (activeTab) {
      case "activity":
        return <ActivityOverview />;
      case "services":
        return <EventSection />;
      case "events":
        return (
          <MyEvents
            onBack={() => setActiveTab("activity")}
            onAdd={() => console.log("Add event clicked")}
          />
        );
      case "explore":
        return <Explore />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen">
      <div
        className="flex flex-1 flex-col transition-all duration-300"
        style={{ marginLeft: "16rem" }}
      >
        <div className="p-4 space-y-4">
          {/* Row 1 - Dashboard Header */}
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
            <div className="flex items-center space-x-4">
              {/* Tabs */}
              <div className="flex space-x-4 text-sm text-gray-500 pb-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    className={`flex items-center space-x-1 ${
                      activeTab === tab.key
                        ? "text-blue-600 font-semibold"
                        : "text-gray-400"
                    }`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
              <button
                className="ml-auto px-4 py-2 bg-blue-600 text-white rounded"
                onClick={() => setShowEventForm(true)}
              >
                Create Event
              </button>
            </div>
          </div>

          {/* Success Message */}
          {successMsg && <div className="text-green-600 font-semibold">{successMsg}</div>}

          {/* Dynamic Tab Content */}
          <div>{renderContent()}</div>
        </div>
        {showEventForm && (
          <EventForm onClose={() => setShowEventForm(false)} onSuccess={handleEventSuccess} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
