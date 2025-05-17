import React from "react";
import ReviewCard from "./ReviewCard";

interface ReviewTabsProp {
  onViewReviews: () => void;
  onViewReceived: () => void;
}

const sampleReviewsGiven = [
  {
    reviewTitle: "Magical Wedding",
    stars: 5,
    recipientReview: "Our wedding day was nothing short of magical...",
    dateReviewed: "Feb 20, 2025",
    recipient: "Juan Dela Cruz",
    eventTags: ["Wedding"],
    images: [
      // "https://example.com/image1.jpg", etc.
    ],
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
    reviewer: "Juan Dela Cruz",
    eventTags: ["Concert", "School Event"],
    images: [],
    direction: "by" as const,
  },
];

const ReviewTabs: React.FC<ReviewTabsProp> = ({
  onViewReviews,
  onViewReceived,
}) => {
  return (
    <div className="space-y-6 p-4">
      {" "}
      {/* Changed space-y-12 to space-y-6 for less vertical space */}
      {/* My Reviews Section */}
      <div>
        <h2
          className="text-xl font-bold mb-4 cursor-pointer"
          onClick={onViewReviews}
        >
          My Reviews &gt;
        </h2>
        <div className="space-y-4">
          {" "}
          {/* Use space-y for vertical stacking with spacing */}
          {sampleReviewsGiven.map((review, index) => (
            <div key={index}>
              {" "}
              {/* Add a wrapper div if needed for specific full-width styling */}
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
          {" "}
          {/* Use space-y for vertical stacking with spacing */}
          {sampleReviewsReceived.map((review, index) => (
            <div key={index}>
              {" "}
              {/* Add a wrapper div if needed for specific full-width styling */}
              <ReviewCard {...review} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewTabs;
