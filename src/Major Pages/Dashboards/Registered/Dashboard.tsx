import type React from "react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BarChart3, Briefcase, Search, Calendar } from "lucide-react";
import ActivityOverview from "./Elements/ActivityOverview";
import EventSection from "./Elements/EventsSection";
import Explore from "./Elements/Explore";
import MyEvents from "./Elements/MyEvents";
import AnalyticsOverview from "./Elements/AnalyticsOverview";
import CalendarView from "./Elements/Calendar";
import { CLOUD_FUNCTIONS } from "../../../config/cloudFunctions";

type RoleId = "1" | "2" | "3"; // 1: customer, 2: organizer, 3: vendor

const Dashboard: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("analytics");
  const [roleId, setRoleId] = useState<RoleId | null>(null);

  const getRoleIdFromAuth = async (): Promise<RoleId> => {
    try {
      const firebaseUid =
        localStorage.getItem("firebaseUid") || localStorage.getItem("userId");
      console.log("Dashboard is sending firebaseUid:", firebaseUid);
      if (!firebaseUid) {
        throw new Error("No Firebase UID found");
      }

      const response = await fetch(CLOUD_FUNCTIONS.getRole, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firebaseUid,
        }),
      });

      const data = await response.json();
      console.log("getRole response:", data);
      if (!response.ok || !data.roleId) {
        throw new Error(data.message || "Failed to get user role");
      }
      return data.roleId as RoleId;
    } catch (error) {
      console.error("Error getting role ID:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const role = await getRoleIdFromAuth();
        setRoleId(role);
      } catch (error) {
        console.error("Error fetching role:", error);
      }
    };

    fetchRole();
  }, []);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const tabs = (() => {
    if (roleId === "1") {
      // customer
      return [
        {
          key: "analytics",
          label: "Analytics Overview",
          icon: <BarChart3 size={16} />,
        },
        {
          key: "calendar",
          label: "My Calendar",
          icon: <Calendar size={16} />,
        },
        { key: "events", label: "My Events", icon: <Briefcase size={16} /> },
        { key: "explore", label: "Explore", icon: <Search size={16} /> },
      ];
    }

    if (roleId === "3") {
      // vendor
      return [
        {
          key: "analytics",
          label: "Analytics Overview",
          icon: <BarChart3 size={16} />,
        },
        {
          key: "calendar",
          label: "My Calendar",
          icon: <Calendar size={16} />,
        },
        {
          key: "services",
          label: "My Services",
          icon: <Briefcase size={16} />,
        },
      ];
    }

    // organizer (roleId === "2")
    return [
      {
        key: "analytics",
        label: "Analytics Overview",
        icon: <BarChart3 size={16} />,
      },
      {
        key: "calendar",
        label: "My Calendar",
        icon: <Calendar size={16} />,
      },
      { key: "services", label: "My Services", icon: <Briefcase size={16} /> },
      { key: "events", label: "My Events", icon: <Briefcase size={16} /> },
      { key: "explore", label: "Explore", icon: <Search size={16} /> },
    ];
  })();

  const renderContent = () => {
    switch (activeTab) {
      case "analytics":
        return <AnalyticsOverview />;
      case "calendar":
        return <CalendarView />;
      case "activity":
        return <ActivityOverview />;
      case "services":
        return <EventSection />;
      case "events":
        return (
          <MyEvents
            onBack={() => setActiveTab("analytics")}
            onAdd={() => console.log("Add event clicked")}
          />
        );
      case "explore":
        return <Explore />;
      default:
        return <AnalyticsOverview />;
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
            {/* Tabs */}
            {roleId ? (
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
            ) : (
              <div className="text-red-500 font-semibold">
                Unable to determine user role. Please contact support or try
                logging in again.
              </div>
            )}
          </div>

          {/* Dynamic Tab Content */}
          <div>{roleId ? renderContent() : null}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
