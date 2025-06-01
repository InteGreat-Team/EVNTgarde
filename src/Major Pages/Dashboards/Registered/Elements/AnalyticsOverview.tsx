import React from "react"
// import { BarChart3 } from "lucide-react"

interface AnalyticsOverviewProps {
  role: "super admin" | "organizer" | "vendor";
}

const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({ role }) => {
  const dashboards: Record<string, string> = {
    "super admin": "https://app.powerbi.com/reportEmbed?reportId=fe3fa790-09ed-4957-a328-5c04f3ac7536&autoAuth=true&ctid=2840082d-702c-4fb1-9885-abddd1ddaa1e",
    "organizer": "https://app.powerbi.com/reportEmbed?reportId=fe3fa790-09ed-4957-a328-5c04f3ac7536&autoAuth=true&ctid=2840082d-702c-4fb1-9885-abddd1ddaa1e",
    "vendor": // replace wit actual link
  };

  const dashboardUrl = dashboards[role];

  if (!dashboardUrl) {
    return <div className="text-center text-gray-500">No dashboard available for your role.</div>;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-[700px]">
      <iframe
        title={`${role.charAt(0).toUpperCase() + role.slice(1)} Dashboard`}
        width="100%"
        height="100%"
        src={dashboardUrl}
        frameBorder="0"
        allowFullScreen
        className="w-full h-full rounded-lg"
      />
    </div>
  );
};

export default AnalyticsOverview
