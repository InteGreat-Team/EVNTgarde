import React, { useEffect, useState } from "react";
import Papa from "papaparse"; // added a csv and a csv parsing dependency for temporary purposes since wala pang db. will add more review data once finished na yung monte carlo.
import ReviewCard from "./ReviewCard";

interface ReviewTabsProp {
  onViewReviews: () => void;
  onViewReceived: () => void;
}

interface CSVRow {
  review_title: string;
  liking_score: string;
  text_review: string;
  review_date: string;
  reviewed_by: string;
  event_type?: string;
  images?: string;
}

interface Review {
  reviewTitle: string;
  stars: number;
  eventReview: string;
  dateReviewed: string;
  reviewer: string;
  eventTags: string[];
  images: string[];
  direction: "by";
}

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
    recipient: "Juan Dela Cruz",
    eventTags: ["Concert", "School Event"],
    images: [],
    direction: "to" as const,
  },
];

const ReviewTabs: React.FC<ReviewTabsProp> = ({
  onViewReviews,
  onViewReceived,
}) => {
  const [latestReviewsReceived, setLatestReviewsReceived] = useState<Review[]>(
    []
  );

  useEffect(() => {
    fetch("/Reviews.csv")
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse<CSVRow>(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const mapped = result.data.map((r) => ({
              reviewTitle: r.review_title || "No Title",
              stars: r.liking_score
                ? Math.round((parseFloat(r.liking_score) * 10) / 2)
                : 0,
              eventReview: r.text_review || "No Review",
              dateReviewed: r.review_date || "Unknown Date",
              reviewer: r.reviewed_by || "Anonymous",
              eventTags: r.event_type ? [r.event_type] : [],
              images: r.images
                ? r.images.split(",").map((img) => img.trim())
                : [],
              direction: "by" as const,
            }));

            const reversed = mapped.reverse();
            setLatestReviewsReceived(reversed.slice(0, 2));
          },
        });
      });
  }, []);

  return (
    <div className="space-y-6 p-4">
      {/* My Reviews Section */}
      <div>
        <h2
          className="text-xl font-bold mb-4 cursor-pointer"
          onClick={onViewReviews}
        >
          My Reviews &gt;
        </h2>
        <div className="space-y-4">
          {sampleReviewsGiven.map((review, index) => (
            <div key={index}>
              <ReviewCard {...review} />
            </div>
          ))}
        </div>
      </div>
      {/* Reviews Received Section */}
      <div>
        <h2
          className="text-xl font-bold mb-4 cursor-pointer"
          onClick={onViewReceived}
        >
          Reviews Received &gt;
        </h2>
        <div className="space-y-4">
          {latestReviewsReceived.map((review, index) => (
            <div key={index}>
              <ReviewCard {...review} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewTabs;
