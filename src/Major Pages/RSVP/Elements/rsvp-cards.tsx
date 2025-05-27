import type React from "react"
import { Calendar, MapPin } from "lucide-react"

export interface RSVPCardProps {
  eventName: string
  date: string
  location: string
  rsvpCreated: boolean
  onViewTracker?: () => void
}

const RSVPCard: React.FC<RSVPCardProps> = ({ eventName, date, location, rsvpCreated, onViewTracker }) => {
  const getStatusColor = (created: boolean): string => {
    return created ? "bg-green-500" : "bg-gray-400"
  }

  const getStatusText = (created: boolean): string => {
    return created ? "RSVP List: Created" : "RSVP List: Not Created"
  }

  return (
    <div className="bg-white rounded-md shadow-lg p-6 w-full border border-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-transparent opacity-50 pointer-events-none"></div>
      <div className="relative z-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{eventName}</h2>
        <div className="flex items-center text-gray-600 mb-1">
          <Calendar className="h-5 w-5 mr-2" />
          <span>{date}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-5 w-5 mr-2" />
          <span>{location}</span>
        </div>
        <div className="flex items-center mb-3">
          <span
            className={`text-sm px-2 py-1 rounded-md flex items-center ${
              rsvpCreated ? "text-green-600 bg-green-100" : "text-gray-600 bg-gray-200"
            }`}
          >
            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${getStatusColor(rsvpCreated)}`}></span>
            {getStatusText(rsvpCreated)}
          </span>
        </div>
        <button
          onClick={onViewTracker}
          className="bg-[#3262AB] hover:bg-[#4373BC] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          View Tracker
        </button>
      </div>
    </div>
  )
}

export default RSVPCard
