


//------------------------------------------------------------------------------------------------------------------------------



import axios from "axios";
import { useState } from "react";

interface ResumeScreening {
    resumeScreeningId: number;
    jobName: string;
    jobId:number;
  
    candidateName: string;
    candidateEmail: string;
    experience: number;
    status: string;
    reviewerId: number;
  }

interface OfferLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  screeningsingle:ResumeScreening | null;

}

const OfferLetterModal: React.FC<OfferLetterModalProps> = ({
  isOpen,
  onClose,
  screeningsingle

}) => {
  const [joiningDate, setJoiningDate] = useState("");





  const handleReleaseOffer = async () => {
    if (!screeningsingle) return; // ✅ Ensure screening is selected

    try {
      const response = await axios.post(
        `http://localhost:5283/api/hr/release-offer/${screeningsingle.resumeScreeningId}`,
        { joiningDate }
      );

      alert(response.data.message);
      onClose(); // Close modal after success
    } catch (error) {
      console.error("Error releasing offer:", error);
      alert("Failed to release offer.");
    }
  };




  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Release Offer Letter
        </h2>

        <label className="block text-gray-700 mb-2">Joining Date:</label>
        <input
          type="date"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={joiningDate}
          onChange={(e) => setJoiningDate(e.target.value)}
        />

        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={!joiningDate} // Disable confirm button if no date is selected
            onClick={handleReleaseOffer}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferLetterModal;