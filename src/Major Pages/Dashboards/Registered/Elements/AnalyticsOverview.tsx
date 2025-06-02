import React, { useMemo } from "react"; // Import useMemo
import AnalyticsOverviewDashboard from "./AnalyticsOverviewDashboard";
import { useRole } from "../../../../functions/RoleContext"; // Import your useRole hook

// Define the userType strings that your dashboard logic expects
type UserDashboardType = "organizer" | "vendor" | "customer" | "superadmin";

const AnalyticsOverview: React.FC = () => {
  // Use the useRole hook to get the roleId and isLoading state
  const { roleId, isLoading } = useRole();

  // Derive the user's specific dashboard type based on roleId
  const userDashboardType: UserDashboardType | null = useMemo(() => {
    if (isLoading || !roleId) {
      return null; // Return null if role is still loading or not available
    }

    // Map roleId to the string types used for your dashboard logic
    switch (roleId) {
      case "1":
        return "customer";
      case "2":
        return "organizer";
      case "3":
        return "vendor";
      case "4": // Assuming '4' is the roleId for 'superadmin' if it's a distinct role in your backend
        return "superadmin";
      default:
        // Handle cases where roleId doesn't match a known type, maybe a default or error state
        console.warn(
          `Unknown roleId: ${roleId}. Defaulting to customer dashboard.`
        );
        return "customer"; // Fallback to customer or a suitable default
    }
  }, [roleId, isLoading]); // Recalculate if roleId or isLoading changes

  // Handle loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-[700px] flex items-center justify-center">
        Loading analytics dashboard...
      </div>
    );
  }

  // Handle cases where userDashboardType couldn't be determined (e.g., no roleId after loading)
  if (!userDashboardType) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-[700px] flex items-center justify-center text-red-500">
        Error: User role not determined for analytics dashboard.
      </div>
    );
  }

  // Now use the derived userDashboardType for your conditional rendering
  const isOrganizerDashboard = userDashboardType === "organizer";
  // The original logic was `userType === "superadmin" || userType === "customer"`.
  // This means if a user is a 'customer' (roleId "1") or a 'superadmin' (if roleId "4"),
  // they will see the "Super Admin Dashboard".
  const isSuperadminDashboard =
    userDashboardType === "superadmin" || userDashboardType === "customer";

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-[700px]">
      {isSuperadminDashboard ? (
        <AnalyticsOverviewDashboard
          reportId="fe3fa790-09ed-4957-a328-5c04f3ac7536"
          ctid="2840082d-702c-4fb1-9885-abddd1ddaa1e"
          title="Super Admin Dashboard"
        />
      ) : isOrganizerDashboard ? (
        <AnalyticsOverviewDashboard
          reportId="069524ac-36ab-42ae-b6bc-e58a76935c81"
          ctid="2840082d-702c-4fb1-9885-abddd1ddaa1e"
          title="Organizer Dashboard"
        />
      ) : (
        // This will be the Vendor Dashboard if not Super Admin/Customer or Organizer
        <AnalyticsOverviewDashboard
          reportId="ce84b595-b49e-4b45-86d5-df0fe15ab14e"
          ctid="2840082d-702c-4fb1-9885-abddd1ddaa1e"
          title="Vendor Dashboard"
        />
      )}
    </div>
  );
};

export default AnalyticsOverview;
