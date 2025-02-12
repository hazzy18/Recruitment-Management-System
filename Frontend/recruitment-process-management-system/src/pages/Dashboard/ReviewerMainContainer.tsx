import React from "react";
import ReviewerPage from "./ReviewerPage";

const ReviewerMainContainer: React.FC = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen dark:bg-gray-900">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        Resume Screening
      </h1>
      <ReviewerPage />
    </div>
  );
};

export default ReviewerMainContainer;
