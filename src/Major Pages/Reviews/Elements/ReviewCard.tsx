import React from "react";
import { Star } from "lucide-react";

interface ReviewCardProps {
  reviewTitle: string;
  stars: number; // Expect 0 to 5
  dateReviewed: string;
  recipientReview?: string | null;
  eventReview?: string | null;
  images?: string[];
  direction: "to" | "by";
  recipient?: string;
  reviewer?: string;
  eventTags: string[];
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  reviewTitle,
  stars,
  dateReviewed,
  recipientReview,
  eventReview,
  images,
  direction,
  recipient,
  reviewer,
  eventTags,
}) => {
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={18}
        className={`text-yellow-500 inline-block ${
          i < stars ? "fill-yellow-500" : "fill-none stroke-yellow-500"
        }`}
      />
    ));
  };

  return (
    <div className="bg-white border border-gray-300 rounded-2xl p-4 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-lg font-semibold text-gray-800">{reviewTitle}</h2>
      </div>

      <div className="flex items-center justify-between mb-2">
        {" "}
        {/* Date and Stars inline */}
        <div className="flex gap-1">{renderStars()}</div>
        <span className="text-sm text-gray-500">{dateReviewed}</span>
      </div>

      {(recipientReview || eventReview) && (
        <p className="text-gray-700 mb-2">
          {recipientReview && <>{recipientReview} </>}
          {eventReview}
        </p>
      )}

      {images && images.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Review image ${index + 1}`}
              className="w-24 h-24 object-cover rounded-md border"
            />
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 mb-3">
        {(reviewer || recipient) && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">
              {direction === "to" ? "To:" : "By:"}
            </span>{" "}
            {direction === "to" ? recipient : reviewer}
          </div>
        )}
        <div className="flex gap-2 flex-wrap">
          {eventTags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-100 border border-gray-300 rounded-full px-3 py-1 text-sm text-gray-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
