import React from "react"
// import { BarChart3 } from "lucide-react"

const AnalyticsOverview: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-[700px]">
      <iframe
        title="Super Admin Dashboard"
        width="100%"
        height="100%"
        src="https://app.powerbi.com/reportEmbed?reportId=fe3fa790-09ed-4957-a328-5c04f3ac7536&autoAuth=true&ctid=2840082d-702c-4fb1-9885-abddd1ddaa1e"
        frameBorder="0"
        allowFullScreen
        className="w-full h-full rounded-lg"
      ></iframe>
    </div>
  )
}

export default AnalyticsOverview