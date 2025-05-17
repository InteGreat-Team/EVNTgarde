import React, { useState } from "react";
import ReviewCard from "./ReviewCard";

const sampleReviewsReceived = [
  {
    reviewTitle: "Fantastic Organizer",
    stars: 5,
    eventReview: "The event went flawlessly thanks to this amazing organizer!",
    dateReviewed: "Feb 20, 2025",
    reviewer: "Juan Dela Cruz",
    eventTags: ["Concert", "School Event"],
    images: [],
    direction: "by" as const,
  },
  {
    reviewTitle: "Excellent Planning",
    stars: 5,
    eventReview: "Great planning and coordination. Very satisfied!",
    dateReviewed: "Feb 20, 2025",
    reviewer: "Maria Santos",
    eventTags: ["Catering"],
    images: [],
    direction: "by" as const,
  },
  {
    reviewTitle: "Highly Professional",
    stars: 5,
    eventReview: "Their professionalism was outstanding.",
    dateReviewed: "Feb 15, 2025",
    reviewer: "Elena Rodriguez",
    eventTags: ["Photography"],
    images: [],
    direction: "by" as const,
  },
  {
    reviewTitle: "Energetic Performance",
    stars: 4,
    eventReview: "The performance was full of energy!",
    dateReviewed: "Feb 10, 2025",
    reviewer: "Ricardo Gomez",
    eventTags: ["DJ"],
    images: [],
    direction: "by" as const,
  },
  {
    reviewTitle: "Stunning Location",
    stars: 5,
    eventReview: "The location made the event truly special.",
    dateReviewed: "Feb 05, 2025",
    reviewer: "Sofia Lopez",
    eventTags: ["Venue"],
    images: [],
    direction: "by" as const,
  },
  {
    reviewTitle: "Great Communication",
    stars: 5,
    eventReview: "Communication was clear and prompt.",
    dateReviewed: "Jan 30, 2025",
    reviewer: "Carlos Perez",
    eventTags: ["Service"],
    images: [],
    direction: "by" as const,
  },
  {
    reviewTitle: "Satisfactory Result",
    stars: 4,
    eventReview: "The result was satisfactory.",
    dateReviewed: "Jan 25, 2025",
    reviewer: "Isabela Vargas",
    eventTags: ["Other"],
    images: [],
    direction: "by" as const,
  },
  {
    reviewTitle: "Would Hire Again",
    stars: 5,
    eventReview: "I would definitely hire them again.",
    dateReviewed: "Jan 20, 2025",
    reviewer: "Javier Torres",
    eventTags: ["Recommendation"],
    images: [],
    direction: "by" as const,
  },
  {
    reviewTitle: "Reasonable Pricing",
    stars: 4,
    eventReview: "The pricing was very reasonable.",
    dateReviewed: "Jan 15, 2025",
    reviewer: "Luisa Fernandez",
    eventTags: ["Value"],
    images: [],
    direction: "by" as const,
  },
  {
    reviewTitle: "Decent Job",
    stars: 3,
    eventReview: "They did a decent job.",
    dateReviewed: "Jan 10, 2025",
    reviewer: "Andres Diaz",
    eventTags: ["Performance"],
    images: [],
    direction: "by" as const,
  },
  {
    reviewTitle: "Impressed with Detail",
    stars: 5,
    eventReview: "I was very impressed with their attention to detail.",
    dateReviewed: "Jan 05, 2025",
    reviewer: "Manuela Flores",
    eventTags: ["Organization"],
    images: [],
    direction: "by" as const,
  },
  {
    reviewTitle: "Smooth Process",
    stars: 5,
    eventReview: "The entire process was very smooth.",
    dateReviewed: "Dec 30, 2024",
    reviewer: "Pablo Ruiz",
    eventTags: ["Planning"],
    images: [],
    direction: "by" as const,
  },
];

const itemsPerPage = 5;

interface Props {
  onBack: () => void;
}

const ReviewsReceived: React.FC<Props> = ({ onBack }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReviews = sampleReviewsReceived.slice(startIndex, endIndex);
  const totalPages = Math.ceil(sampleReviewsReceived.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="text-blue-600 font-medium hover:underline"
        >
          &larr; Back
        </button>
      </div>
      <h2 className="text-xl font-bold mb-4">Reviews Received</h2>
      <div className="space-y-4 mb-8">
        {currentReviews.map((review, index) => (
          <ReviewCard key={index} {...review} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`px-3 py-1 rounded-md text-sm ${
                  currentPage === pageNumber
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {pageNumber}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewsReceived;
