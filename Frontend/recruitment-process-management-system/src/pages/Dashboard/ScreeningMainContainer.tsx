import React from "react";
import ScreeningPage from "./ScreeningPage"; // Make sure this path is correct


const ScreeningMainContainer: React.FC = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen dark:bg-gray-900">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        Resume Screening
      </h1>
      <ScreeningPage />
    </div>
  );
};

export default ScreeningMainContainer;