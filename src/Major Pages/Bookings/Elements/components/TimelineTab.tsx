import React from "react";
import { Clock } from "lucide-react";

interface TimelineTabProps {
  selectedBooking: {
    id: number;
    [key: string]: any;
  };
  activeStatus: string;
  userRole: "organizer" | "individual" | "vendor";
}

const TimelineTab: React.FC<TimelineTabProps> = ({ selectedBooking, activeStatus, userRole }) => {
  return (
    <div className="p-4 flex flex-col items-center justify-center h-48">
      <div className="bg-blue-100 p-4 rounded-full mb-4">
        <Clock className="text-blue-500" size={24} />
      </div>
      <p className="text-base text-center text-blue-600">
        Timeline content placeholder. Status: {activeStatus}, Role: {userRole}
      </p>
    </div>
  );
};

export default TimelineTab;
