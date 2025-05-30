import type React from "react"
import { BarChart3 } from "lucide-react"

const AnalyticsOverview: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-[700px]">
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="mb-4">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto" />
        </div>
        <p className="text-gray-500 text-base">Embedded Dashboard from Microsoft Power BI would be displayed here.</p>
      </div>
    </div>
  )
}

export default AnalyticsOverview