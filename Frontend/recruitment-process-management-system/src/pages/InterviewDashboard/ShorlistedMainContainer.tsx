import React from "react";
import ShortlistedPage from "./ShorlistedPage";

const ShortlistedMainContainer: React.FC = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen dark:bg-gray-900">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        Shortlisted Page
      </h1>
      <ShortlistedPage />
    </div>
  );
};

export default ShortlistedMainContainer;
