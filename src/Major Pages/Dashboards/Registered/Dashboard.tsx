import type React from "react"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { BarChart3, Briefcase, Search, Calendar } from "lucide-react"
import ActivityOverview from "./Elements/ActivityOverview"
import EventSection from "./Elements/EventsSection"
import Explore from "./Elements/Explore"
import MyEvents from "./Elements/MyEvents"
import AnalyticsOverview from "./Elements/AnalyticsOverview"
import CalendarView from "./Elements/Calendar"

type UserType = "customer" | "vendor" | "organizer" | "superadmin"

const Dashboard: React.FC = () => {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState("analytics")

  const getUserTypeFromAuth = (): UserType => {
    const storedType = localStorage.getItem("userType")
    if (storedType === "customer" || storedType === "vendor" || storedType === "organizer" || storedType === "superadmin") {
      return storedType as UserType
    }

    // Default fallback
    return "customer"
  }

  const userType = getUserTypeFromAuth()

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab)
    }
  }, [location.state])

  const tabs = (() => {
    if (userType === "superadmin") {
      return [
        {
          key: "analytics",
          label: "Analytics Overview",
          icon: <BarChart3 size={16} />,
        }
      ]
    }

    if (userType === "customer") {
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
      ]
    }

    if (userType === "vendor") {
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
      ]
    }

    // organizer
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
    ]
  })()

  const renderContent = () => {
    switch (activeTab) {
      case "analytics":
        return <AnalyticsOverview />
      case "calendar":
        return <CalendarView />
      case "activity":
        return <ActivityOverview />
      case "services":
        return <EventSection />
      case "events":
        return <MyEvents onBack={() => setActiveTab("analytics")} onAdd={() => console.log("Add event clicked")} />
      case "explore":
        return <Explore />
      default:
        return <AnalyticsOverview />
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col transition-all duration-300" style={{ marginLeft: "16rem" }}>
        <div className="p-4 space-y-4">
          {/* Row 1 - Dashboard Header */}
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
            {/* Tabs */}
            <div className="flex space-x-4 text-sm text-gray-500 pb-2">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  className={`flex items-center space-x-1 ${
                    activeTab === tab.key ? "text-blue-600 font-semibold" : "text-gray-400"
                  }`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Tab Content */}
          <div>{renderContent()}</div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
