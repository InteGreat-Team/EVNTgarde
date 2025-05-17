import React from "react";
import StatsCard from "./StatsCard";
import PaginatedTable from "./PaginatedTable";

const RSVPTracking: React.FC = () => {
  // Keep your existing state/props here
  const rsvpCreated = false; // Or true if RSVP is created, adjust as needed

  return (
    <div className="p-4 md:p-8">
      {/* Stats cards */}
      <div className="flex flex-wrap gap-4 mb-6">
        <StatsCard
          title="Invited"
          value={100}
          iconName="Users"
          iconColor="text-blue-500"
          iconBgColor="bg-blue-100"
        />
        <StatsCard
          title="Confirmed"
          value={70}
          iconName="UserCheck"
          iconColor="text-green-500"
          iconBgColor="bg-green-100"
        />
        <StatsCard
          title="Declined"
          value={10}
          iconName="UserX"
          iconColor="text-red-500"
          iconBgColor="bg-red-100"
        />
        <StatsCard
          title="Pending"
          value={20}
          iconName="UserClock"
          iconColor="text-yellow-500"
          iconBgColor="bg-yellow-100"
        />
      </div>

      {/* Search and resend invite button */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="border border-gray-300 rounded px-3 py-2 w-1/3"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Resend Invites
        </button>
      </div>

      {/* Paginated table */}
      <PaginatedTable rsvpCreated={rsvpCreated} />
    </div>
  );
};

export default RSVPTracking;
