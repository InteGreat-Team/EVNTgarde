import React, { useState } from "react";
import ReviewCard from "./ReviewCard";

const sampleReviewsGiven = [
  {
    reviewTitle: "Magical Wedding",
    stars: 5,
    recipientReview: "Our wedding day was nothing short of magical...",
    dateReviewed: "Feb 20, 2025",
    recipient: "Juan Dela Cruz",
    eventTags: ["Wedding"],
    images: [],
    direction: "to" as const,
  },
  {
    reviewTitle: "Amazing Concert",
    stars: 5,
    recipientReview:
      "Amazing concert experience! The event was well-organized...",
    dateReviewed: "Feb 20, 2025",
    recipient: "Maria Santos",
    eventTags: ["Concert", "School Event"],
    images: [],
    direction: "to" as const,
  },
  {
    reviewTitle: "Delicious Catering",
    stars: 4,
    recipientReview: "The food was absolutely delicious!",
    dateReviewed: "Feb 15, 2025",
    recipient: "Elena Rodriguez",
    eventTags: ["Catering", "Party"],
    images: [],
    direction: "to" as const,
  },
  {
    reviewTitle: "Great Photography",
    stars: 5,
    recipientReview: "We loved our wedding photos!",
    dateReviewed: "Feb 10, 2025",
    recipient: "Ricardo Gomez",
    eventTags: ["Photography", "Wedding"],
    images: [],
    direction: "to" as const,
  },
  {
    reviewTitle: "Fun DJ",
    stars: 4,
    recipientReview: "The DJ kept the party going all night!",
    dateReviewed: "Feb 05, 2025",
    recipient: "Sofia Lopez",
    eventTags: ["DJ", "Party"],
    images: [],
    direction: "to" as const,
  },
  {
    reviewTitle: "Beautiful Venue",
    stars: 5,
    recipientReview: "The venue was stunning!",
    dateReviewed: "Jan 30, 2025",
    recipient: "Carlos Perez",
    eventTags: ["Venue", "Event"],
    images: [],
    direction: "to" as const,
  },
  {
    reviewTitle: "Excellent Service",
    stars: 5,
    recipientReview: "The service was top-notch.",
    dateReviewed: "Jan 25, 2025",
    recipient: "Isabela Vargas",
    eventTags: ["Service"],
    images: [],
    direction: "to" as const,
  },
  {
    reviewTitle: "Mediocre Experience",
    stars: 3,
    recipientReview: "It was an okay experience.",
    dateReviewed: "Jan 20, 2025",
    recipient: "Javier Torres",
    eventTags: ["Other"],
    images: [],
    direction: "to" as const,
  },
  {
    reviewTitle: "Highly Recommended",
    stars: 5,
    recipientReview: "I would highly recommend them!",
    dateReviewed: "Jan 15, 2025",
    recipient: "Luisa Fernandez",
    eventTags: ["Recommendation"],
    images: [],
    direction: "to" as const,
  },
  {
    reviewTitle: "Good Value",
    stars: 4,
    recipientReview: "Good value for the price.",
    dateReviewed: "Jan 10, 2025",
    recipient: "Andres Diaz",
    eventTags: ["Value"],
    images: [],
    direction: "to" as const,
  },
  {
    reviewTitle: "Average Performance",
    stars: 3,
    recipientReview: "The performance was just average.",
    dateReviewed: "Jan 05, 2025",
    recipient: "Manuela Flores",
    eventTags: ["Performance"],
    images: [],
    direction: "to" as const,
  },
  {
    reviewTitle: "Superb Organization",
    stars: 5,
    recipientReview: "The organization was superb!",
    dateReviewed: "Dec 30, 2024",
    recipient: "Pablo Ruiz",
    eventTags: ["Organization"],
    images: [],
    direction: "to" as const,
  },
];

const itemsPerPage = 5;

interface Props {
  onBack: () => void;
}

const MyReviews: React.FC<Props> = ({ onBack }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReviews = sampleReviewsGiven.slice(startIndex, endIndex);
  const totalPages = Math.ceil(sampleReviewsGiven.length / itemsPerPage);

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
      <h2 className="text-xl font-bold mb-4">My Reviews</h2>
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

export default MyReviews;
