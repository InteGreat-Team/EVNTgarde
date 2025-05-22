import React, { useState } from "react";
import emptyBox from "src\assets\empty-box.png"; // adjust path based on your project structure
import RSVPCard, { RSVPCardProps } from "./Elements/rsvp-cards"; // Assuming EventCard is in the same directory
import RSVPTracking from "./Elements/rsvp-tracking";

const mockEvents: RSVPCardProps[] = Array.from({ length: 15 }, (_, index) => ({
  eventName: `Event ${index + 1}`,
  date: `May ${String(index + 5).padStart(2, "0")}, 2025`,
  location: `Location ${index + 1}`,
  rsvpCreated: index % 3 === 0, // Some events have RSVP created
}));

const itemsPerPage = 9;

const RSVP: React.FC = () => {
  const [viewingTracker, setViewingTracker] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleViewTracker = () => {
    setViewingTracker(true);
  };

  const handleBackClick = () => {
    setViewingTracker(false);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEvents = mockEvents.slice(startIndex, endIndex);

  const totalPages = Math.ceil(mockEvents.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    if (totalPages <= 1) {
      return null;
    }

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    const getPageRange = () => {
      const visiblePages = 5;
      if (totalPages <= visiblePages) {
        return pageNumbers;
      }
      const middle = Math.floor(visiblePages / 2);

      if (currentPage <= middle + 1) {
        return pageNumbers.slice(0, visiblePages);
      }
      if (currentPage >= totalPages - middle) {
        return pageNumbers.slice(totalPages - visiblePages);
      }
      return pageNumbers.slice(currentPage - middle - 1, currentPage + middle);
    };

    const visiblePageNumbers = getPageRange();

    return (
      <div className="flex justify-center items-center mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:text-gray-400 disabled:bg-gray-50"
        >
          ← Previous
        </button>
        <div className="flex space-x-2 mx-3">
          {visiblePageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`px-2 py-1 rounded-md ${
                currentPage === number
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {number}
            </button>
          ))}
          {totalPages > visiblePageNumbers.slice(-1)[0] && (
            <span className="text-gray-400">...</span>
          )}
        </div>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:text-gray-400 disabled:bg-gray-50"
        >
          Next →
        </button>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen">
      <div
        className="flex flex-1 flex-col justify-between transition-all duration-300"
        style={{ marginLeft: "16rem" }}
      >
        {viewingTracker ? (
          <RSVPTracking onBackClick={handleBackClick} />
        ) : (
          <>
            <div className="p-6 space-y-4">
              <h1 className="text-4xl font-bold text-gray-800 mb-3">RSVP</h1>
              {mockEvents.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {currentEvents.map((event, index) => (
                    <RSVPCard
                      key={index}
                      {...event}
                      onViewTracker={handleViewTracker}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center mt-24">
                  <img
                    src={emptyBox}
                    alt="No Events"
                    className="w-48 h-48 mb-8"
                  />
                  <h2 className="text-3xl font-semibold text-gray-800 mb-3">
                    Ready to Host Something?
                  </h2>
                  <p className="text-lg text-gray-600 max-w-lg">
                    It looks like you haven’t created any events that require an
                    RSVP...
                  </p>
                </div>
              )}
            </div>
            {mockEvents.length > 0 && renderPagination()}
          </>
        )}
      </div>
    </div>
  );
};

export default RSVP;
