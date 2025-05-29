import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import ReviewCard from "./ReviewCard";

const itemsPerPage = 5;

interface Props {
  onBack: () => void;
}

interface CSVRow {
  review_title: string;
  liking_score: string; // CSVs are strings
  text_review: string;
  review_date: string;
  reviewed_by: string;
  event_type?: string;
  images?: string; // comma-separated or ignore for now
}

interface Review {
  reviewTitle: string;
  stars: number;
  eventReview: string;
  dateReviewed: string;
  reviewer: string;
  eventTags: string[];
  images: string[]; // you can load later
  direction: "by";
}

const ReviewsReceived: React.FC<Props> = ({ onBack }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch("/Reviews.csv")
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse<CSVRow>(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const mapped = result.data.map((r) => ({
              reviewTitle: r.review_title || "No Title", // Provide fallback if title is missing
              stars: r.liking_score
                ? Math.round((parseFloat(r.liking_score) * 10) / 2)
                : 0, // Handle missing liking_score
              eventReview: r.text_review || "No Review", // Provide fallback for review text
              dateReviewed: r.review_date || "Unknown Date", // Handle missing date
              reviewer: r.reviewed_by || "Anonymous", // Provide fallback for reviewer
              eventTags: r.event_type ? [r.event_type] : [], // Map event_type to eventTags (or adjust as needed)
              images: r.images
                ? r.images.split(",").map((image) => image.trim())
                : [], // Handle images (comma-separated, trim any extra spaces)
              direction: "by" as const,
            }));
            setReviews(mapped.reverse()); // Set reviews after mapping
            //console.log(mapped); // Log mapped reviews
          },
        });
      });
  }, []);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReviews = reviews.slice(startIndex, endIndex);
  const totalPages = Math.ceil(reviews.length / itemsPerPage);

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
