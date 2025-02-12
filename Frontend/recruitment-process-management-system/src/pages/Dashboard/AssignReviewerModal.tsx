import React from "react";

interface AssignReviewerModalProps {
  isOpen: boolean;
  reviewers: { id: number; name: string }[];
  selectedReviewer: number | null;
  setSelectedReviewer: (id: number) => void;
  onClose: () => void;
  onAssign: () => void;
}

const AssignReviewerModal: React.FC<AssignReviewerModalProps> = ({
  isOpen,
  reviewers,
  selectedReviewer,
  setSelectedReviewer,
  onClose,
  onAssign,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Assign Reviewer</h2>
        <select
          className="w-full p-2 border rounded"
          value={selectedReviewer ?? ""}
          onChange={(e) => setSelectedReviewer(Number(e.target.value))}
        >
          <option value="" disabled>Select a Reviewer</option>
          {reviewers.map((reviewer) => (
            <option key={reviewer.id} value={reviewer.id}>
              {reviewer.name}
            </option>
          ))}
        </select>
        <div className="flex justify-end mt-4">
          <button className="px-4 py-2 bg-gray-500 text-white rounded mr-2" onClick={onClose}>
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={onAssign}>
            Assign
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignReviewerModal;
