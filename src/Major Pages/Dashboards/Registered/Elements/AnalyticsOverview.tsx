import React, { useEffect, useState } from "react";
import AnalyticsOverviewDashboard from "./AnalyticsOverviewDashboard";

type userType = "organizer" | "vendor" | "customer" | "superadmin";

const AnalyticsOverview: React.FC = () => {
  const [userType, setUserRole] = useState<userType>("organizer");

  useEffect(() => {
    const storedRole = localStorage.getItem("userType");
    if (
      storedRole === "organizer" ||
      storedRole === "vendor" ||
      storedRole === "customer"
    ) {
      setUserRole(storedRole);
    } else if (storedRole === "individual") {
      setUserRole("customer");
    } else {
      setUserRole("organizer");
    }
  }, []);

  const isOrganizer = userType === "organizer";
  const isSuperadmin = userType === "superadmin" || userType === "customer";

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-[700px]">
      {isSuperadmin ? (
        <AnalyticsOverviewDashboard
          reportId="fe3fa790-09ed-4957-a328-5c04f3ac7536"
          ctid="2840082d-702c-4fb1-9885-abddd1ddaa1e"
          title="Super Admin Dashboard"
        />
      ) : isOrganizer ? (
        <AnalyticsOverviewDashboard
          reportId="069524ac-36ab-42ae-b6bc-e58a76935c81"
          ctid="2840082d-702c-4fb1-9885-abddd1ddaa1e"
          title="Organizer Dashboard"
        />
      ) : (
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
