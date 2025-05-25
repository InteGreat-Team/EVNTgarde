import React from "react";

interface FindActionCardProps {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
  name?: string;
  subtitle?: string;
  eventType?: string;
  dateCreated?: string;
}

const FindActionCard: React.FC<FindActionCardProps> = ({
  title,
  description,
  buttonText,
  onButtonClick,
  name = "Organizer Name",
  subtitle = "You",
  eventType = "Self-Hosted Event",
  dateCreated = "12/12/2025",
}) => (
  <div className="bg-white rounded-lg border border-gray-200 shadow p-0 flex flex-col items-stretch mt-4.5">
    {/* Top Section */}
    <div className="flex flex-col pt-6 pb-2 px-6">
      <div className="flex items-center mb-1">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-3">
          <svg className="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </div>
        <div>
          <div className="font-semibold text-lg text-gray-900 leading-tight">{name}</div>
          <div className="text-xs text-gray-500">{subtitle}</div>
        </div>
      </div>
      <div className="italic text-sm text-gray-700 mt-1 ml-0">{eventType}</div>
    </div>
    {/* Gray Card Section */}
    <div className="bg-gray-500 text-white px-6 py-5 text-left">
      <div className="font-bold text-lg mb-1">{title}</div>
      <div className="text-sm font-normal">{description}</div>
    </div>
    {/* Date Created Section */}
    <div className="px-6 py-4">
      <div className="text-sm text-gray-500 mb-1">Date Created</div>
      <div className="text-base text-gray-900 font-medium">{dateCreated}</div>
    </div>
    {/* Button */}
    <div className="px-6 pb-6">
      <button
        className="w-full bg-blue-700 hover:bg-blue-800 text-white text-base font-medium py-2.5 rounded-lg transition"
        onClick={onButtonClick}
      >
        {buttonText}
      </button>
    </div>
  </div>
);

export default FindActionCard; 