import type React from "react";
import { ArrowLeft, Search, Send } from "lucide-react";
import PaginatedTable from "./PaginatedTable";
import StatsCard from "./stats-card";

interface RSVPTrackingProps {
  onBackClick: () => void;
}

const RSVPTracking: React.FC<RSVPTrackingProps> = ({ onBackClick }) => {
  // Mock data for stats
  const totalGuests = 15;
  const goingGuests = 6;
  const notGoingGuests = 3;
  const pendingGuests = 6;

  return (
    <div className="w-full min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={onBackClick}
            className="flex items-center text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Back</span>
          </button>
        </div>

        {/* Header with title and search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            Guests
          </h1>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 border bg-gray-100 border-gray-300 rounded-md w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button className="bg-[#3262AB] hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center">
              <Send className="h-4 w-4 mr-2" />
              Resend Invites
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatsCard title="TOTAL ATTENDEES" value={totalGuests} type="total" />
          <StatsCard title="GOING" value={goingGuests} type="going" />
          <StatsCard title="NOT GOING" value={notGoingGuests} type="notGoing" />
          <StatsCard title="PENDING" value={pendingGuests} type="pending" />
        </div>

        {/* Table */}
        <PaginatedTable />
      </div>
    </div>
  );
};

export default RSVPTracking;
