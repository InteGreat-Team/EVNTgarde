import type React from "react";
import { useState } from "react";
import MyReviews from "./Elements/MyReviews";
import ReviewTabs from "./Elements/ReviewTabs";
import ReviewsReceived from "./Elements/ReviewsReceived";

type ManagementView = "none" | "reviews" | "received";

const Reviews: React.FC = () => {
  const [view, setView] = useState<ManagementView>("none");
  const renderContent = () => {
    switch (view) {
      case "reviews":
        return <MyReviews onBack={() => setView("none")} />;

      case "received":
        return <ReviewsReceived onBack={() => setView("none")} />;

      case "none":
        return (
          <ReviewTabs
            onViewReviews={() => setView("reviews")}
            onViewReceived={() => setView("received")}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex">
      <div
        className="flex flex-1 flex-col transition-all duration-300"
        style={{ marginLeft: "16rem" }}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default Reviews;
